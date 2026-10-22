import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const role = (session.user as any).role;
    const userId = session.user.id;
    if (role !== "ADMIN" && role !== "FACULTY") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { title, content, audience, isPinned } = await req.json();
    if (!title || !content) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const notice = await prisma.notice.create({
      data: {
        title,
        content,
        audience: audience || "ALL",
        isPinned: !!isPinned,
        authorId: userId as string,
      },
    });

    return NextResponse.json(notice);
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to create notice" }, { status: 500 });
  }
}
