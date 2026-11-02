import { prisma } from "@/lib/prisma";

export async function getAllTests() {
  return prisma.test.findMany({
    where: { isActive: true },
    orderBy: { createdAt: "desc" },
  });
}

export async function submitTestAttempt(data: {
  userId: string;
  testId: string;
  score: number;
  totalMarks: number;
}) {
  return prisma.testAttempt.create({ data });
}

export async function getUserResults(userId: string) {
  return prisma.testAttempt.findMany({
    where: { userId },
    include: { test: { select: { title: true, category: true } } },
    orderBy: { attemptedAt: "desc" },
  });
}
