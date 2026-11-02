import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const quiz = await prisma.quiz.findUnique({
    where: { id },
    include: {
      questions: {
        orderBy: { order: "asc" },
        include: { question: true },
      },
    },
  });
  if (!quiz) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(quiz);
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { title, description, subject, difficulty, duration, isActive } = await req.json();
  const quiz = await prisma.quiz.update({
    where: { id },
    data: {
      ...(title       !== undefined && { title }),
      ...(description !== undefined && { description }),
      ...(subject     !== undefined && { subject }),
      ...(difficulty  !== undefined && { difficulty }),
      ...(duration    !== undefined && { duration }),
      ...(isActive    !== undefined && { isActive }),
    },
    include: { _count: { select: { questions: true } } },
  });
  return NextResponse.json(quiz);
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await prisma.quiz.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
