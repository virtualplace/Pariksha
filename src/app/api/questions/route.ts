import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const PAGE_SIZE = 50;

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const subject    = searchParams.get("subject") || undefined;
  const topic      = searchParams.get("topic") || undefined;
  const sourceFile = searchParams.get("sourceFile") || undefined;
  const examName   = searchParams.get("examName") || undefined;
  const search     = searchParams.get("search") || undefined;
  const page       = Math.max(1, parseInt(searchParams.get("page") ?? "1"));

  const where = {
    ...(subject    && { subject }),
    ...(topic      && { topic }),
    ...(sourceFile && { sourceFile }),
    ...(examName   && { examName }),
    ...(search     && {
      OR: [
        { questionText: { contains: search, mode: "insensitive" as const } },
        { explanation:  { contains: search, mode: "insensitive" as const } },
      ],
    }),
  };

  const [total, questions] = await Promise.all([
    prisma.question.count({ where }),
    prisma.question.findMany({
      where,
      orderBy: [{ sourceFile: "asc" }, { number: "asc" }],
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
  ]);

  // Distinct filter options
  const [subjects, topics, sourceFiles, examNames] = await Promise.all([
    prisma.question.findMany({ select: { subject: true }, distinct: ["subject"], where: { subject: { not: null } } }),
    prisma.question.findMany({ select: { topic: true },   distinct: ["topic"],   where: { topic:   { not: null } } }),
    prisma.question.findMany({ select: { sourceFile: true }, distinct: ["sourceFile"], where: { sourceFile: { not: null } } }),
    prisma.question.findMany({ select: { examName: true },   distinct: ["examName"],   where: { examName:   { not: null } } }),
  ]);

  return NextResponse.json({
    questions,
    total,
    page,
    pages: Math.ceil(total / PAGE_SIZE),
    filters: {
      subjects:    subjects.map((r) => r.subject!),
      topics:      topics.map((r) => r.topic!),
      sourceFiles: sourceFiles.map((r) => r.sourceFile!),
      examNames:   examNames.map((r) => r.examName!),
    },
  });
}
