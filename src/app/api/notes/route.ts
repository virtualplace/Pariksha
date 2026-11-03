import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const notes = await prisma.note.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(notes);
  } catch (err) {
    console.error("[GET /api/notes]", err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { content, sourceType, questionId, quizId, attemptId } = await req.json();
    if (!content?.trim()) return NextResponse.json({ error: "content is required" }, { status: 400 });

    const note = await prisma.note.create({
      data: {
        userId: session.user.id,
        content: content.trim(),
        sourceType: sourceType ?? "manual",
        questionId: questionId ?? null,
        quizId: quizId ?? null,
        attemptId: attemptId ?? null,
      },
    });
    return NextResponse.json(note, { status: 201 });
  } catch (err) {
    console.error("[POST /api/notes]", err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
