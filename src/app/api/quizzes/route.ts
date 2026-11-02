import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const quizzes = await prisma.quiz.findMany({
      orderBy: { createdAt: "desc" },
      include: { _count: { select: { questions: true } } },
    });
    return NextResponse.json(quizzes);
  } catch (err) {
    console.error("[GET /api/quizzes]", err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as {
      title: string;
      description?: string;
      subject?: string;
      difficulty?: "EASY" | "MEDIUM" | "HARD";
      duration?: number;
      questionIds: string[];
    };
    const { title, description, subject, difficulty, duration, questionIds } = body;

    if (!title || !questionIds?.length) {
      return NextResponse.json({ error: "title and questionIds are required." }, { status: 400 });
    }

    const quiz = await prisma.quiz.create({
      data: {
        title,
        description: description || null,
        subject:     subject     || null,
        difficulty:  difficulty  ?? "MEDIUM",
        duration:    duration    ?? 60,
        questions: {
          create: questionIds.map((questionId, order) => ({ questionId, order })),
        },
      },
      include: { _count: { select: { questions: true } } },
    });

    return NextResponse.json(quiz, { status: 201 });
  } catch (err) {
    console.error("[POST /api/quizzes]", err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
