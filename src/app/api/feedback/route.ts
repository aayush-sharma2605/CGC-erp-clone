import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const profileId = (session.user as any).profileId;
    const role = (session.user as any).role;
    if (role !== "STUDENT" || !profileId) {
      return NextResponse.json({ error: "Only students can submit feedback" }, { status: 403 });
    }

    const { subject, message, rating } = await req.json();
    if (!subject || !message) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const feedback = await prisma.feedback.create({
      data: {
        studentId: profileId,
        subject,
        message,
        rating: rating ? Number(rating) : 5,
      },
    });

    return NextResponse.json(feedback);
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to submit feedback" }, { status: 500 });
  }
}
