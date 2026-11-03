import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { quizId, responses, timeTaken } = await req.json() as {
      quizId: string;
      responses: Record<string, string | null>; // questionId -> selected option
      timeTaken: number;
    };

    // Fetch quiz questions with correct answers
    const quiz = await prisma.quiz.findUnique({
      where: { id: quizId },
      include: { questions: { include: { question: true }, orderBy: { order: "asc" } } },
    });
    if (!quiz) return NextResponse.json({ error: "Quiz not found" }, { status: 404 });

    let score = 0;
    const total = quiz.questions.length;

    for (const qq of quiz.questions) {
      const selected = responses[qq.questionId];
      if (selected && selected.toLowerCase() === qq.question.answer.toLowerCase()) score++;
    }

    const attempt = await prisma.quizAttempt.create({
      data: {
        userId: session.user.id,
        quizId,
        score,
        total,
        timeTaken,
        responses: {
          create: quiz.questions.map((qq) => ({
            questionId: qq.questionId,
            selected: responses[qq.questionId] ?? null,
          })),
        },
      },
    });

    return NextResponse.json({ attemptId: attempt.id, score, total });
  } catch (err) {
    console.error("[POST /api/quiz-attempt]", err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
