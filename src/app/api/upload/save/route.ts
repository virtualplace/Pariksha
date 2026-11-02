import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { ParsedQuestion } from "@/lib/extractQuestions";

export async function POST(req: NextRequest) {
  try {
    const { questions, sourceFile, subject } = await req.json() as {
      questions: ParsedQuestion[];
      sourceFile: string;
      subject?: string;
    };

    if (!questions?.length || !sourceFile) {
      return NextResponse.json({ error: "questions and sourceFile are required." }, { status: 400 });
    }

    // Clean re-upload: delete existing questions for this file
    await prisma.question.deleteMany({ where: { sourceFile } });

    await prisma.question.createMany({
      data: questions.map((q) => ({
        number:       q.number,
        questionText: q.questionText,
        optionA:      q.optionA,
        optionB:      q.optionB,
        optionC:      q.optionC,
        optionD:      q.optionD,
        optionE:      q.optionE ?? null,
        answer:       q.answer,
        examName:     q.examName ?? null,
        examYear:     q.examYear ?? null,
        explanation:  q.explanation ?? null,
        theory:       q.theory ?? null,
        subject:      subject ?? null,
        // topic: use extracted topic, fall back to subject if empty
        topic:        q.topic ?? subject ?? null,
        sourceFile,
      })),
    });

    return NextResponse.json({
      message: `${questions.length} questions saved successfully.`,
      count: questions.length,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to save questions." }, { status: 500 });
  }
}
