import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await params;

    const attempt = await prisma.quizAttempt.findUnique({
      where: { id },
      include: {
        quiz: true,
        responses: {
          include: {
            question: true,
          },
          orderBy: { question: { number: "asc" } },
        },
      },
    });

    if (!attempt) return NextResponse.json({ error: "Not found" }, { status: 404 });
    if (attempt.userId !== session.user.id) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    return NextResponse.json(attempt);
  } catch (err) {
    console.error("[GET /api/quiz-attempt/[id]]", err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
