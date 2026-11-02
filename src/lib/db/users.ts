import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function createUser(data: {
  name: string;
  email: string;
  phone?: string;
  password: string;
  attemptYear?: number;
}) {
  const passwordHash = await bcrypt.hash(data.password, 10);
  return prisma.user.create({
    data: {
      name: data.name,
      email: data.email,
      phone: data.phone,
      passwordHash,
      attemptYear: data.attemptYear,
    },
    select: { id: true, name: true, email: true, role: true },
  });
}

export async function getUserByEmail(email: string) {
  return prisma.user.findUnique({ where: { email } });
}

export async function verifyPassword(password: string, hash: string) {
  return bcrypt.compare(password, hash);
}

export async function getUserWithStats(userId: string) {
  const [user, enrollments, attempts] = await Promise.all([
    prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, name: true, email: true, phone: true, attemptYear: true, role: true },
    }),
    prisma.enrollment.count({ where: { userId } }),
    prisma.testAttempt.findMany({ where: { userId }, select: { score: true, totalMarks: true } }),
  ]);

  const avgScore = attempts.length
    ? Math.round(attempts.reduce((acc, a) => acc + (a.score / a.totalMarks) * 100, 0) / attempts.length)
    : 0;

  return { user, enrollments, testsAttempted: attempts.length, avgScore };
}
