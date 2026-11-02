import { prisma } from "@/lib/prisma";

export async function getAllCourses() {
  return prisma.course.findMany({
    where: { isActive: true },
    orderBy: { createdAt: "asc" },
  });
}

export async function getCourseBySlug(slug: string) {
  return prisma.course.findUnique({ where: { slug } });
}

export async function getEnrolledCourses(userId: string) {
  return prisma.enrollment.findMany({
    where: { userId },
    include: { course: true },
    orderBy: { enrolledAt: "desc" },
  });
}

export async function enrollUser(userId: string, courseId: string) {
  return prisma.enrollment.upsert({
    where: { userId_courseId: { userId, courseId } },
    update: { status: "ACTIVE" },
    create: { userId, courseId },
  });
}

export async function updateProgress(userId: string, courseId: string, progress: number) {
  return prisma.enrollment.update({
    where: { userId_courseId: { userId, courseId } },
    data: { progress, status: progress >= 100 ? "COMPLETED" : "ACTIVE" },
  });
}
