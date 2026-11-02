import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await req.json();

  // Only allow known editable fields
  const allowed = ["questionText","optionA","optionB","optionC","optionD","optionE",
                   "answer","examName","examYear","explanation","subject","topic","theory"];
  const data = Object.fromEntries(
    Object.entries(body).filter(([k]) => allowed.includes(k))
  );

  const updated = await prisma.question.update({ where: { id }, data });
  return NextResponse.json(updated);
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await prisma.question.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
