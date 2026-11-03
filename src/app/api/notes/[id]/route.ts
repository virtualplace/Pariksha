import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await params;
    const note = await prisma.note.findUnique({ where: { id } });
    if (!note || note.userId !== session.user.id) return NextResponse.json({ error: "Not found" }, { status: 404 });

    await prisma.note.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[DELETE /api/notes/[id]]", err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
