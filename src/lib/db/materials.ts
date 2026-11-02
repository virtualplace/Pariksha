import { prisma } from "@/lib/prisma";

export async function getStudyMaterials(subject?: string) {
  return prisma.studyMaterial.findMany({
    where: subject ? { subject } : undefined,
    orderBy: { createdAt: "desc" },
  });
}
