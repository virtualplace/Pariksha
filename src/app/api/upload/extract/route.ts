import { NextRequest, NextResponse } from "next/server";
import pdfParse from "pdf-parse/lib/pdf-parse.js";
import { extract, ExtractorType } from "@/lib/extractors";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file      = formData.get("file") as File | null;
    const extractor = (formData.get("extractor") as ExtractorType | null) ?? "plain";

    if (!file || file.type !== "application/pdf") {
      return NextResponse.json({ error: "A valid PDF file is required." }, { status: 400 });
    }

    const buffer    = Buffer.from(await file.arrayBuffer());
    const { text }  = await pdfParse(buffer);
    const questions = extract(text, extractor);

    if (questions.length === 0) {
      return NextResponse.json({ error: "No questions could be extracted from this PDF." }, { status: 422 });
    }

    return NextResponse.json({ count: questions.length, questions, sourceFile: file.name });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to process PDF." }, { status: 500 });
  }
}
