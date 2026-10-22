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
      return NextResponse.json({ error: "Only students can register for exams" }, { status: 403 });
    }

    const { examId } = await req.json();
    if (!examId) {
      return NextResponse.json({ error: "Missing examId" }, { status: 400 });
    }

    const student = await prisma.student.findUnique({
      where: { id: profileId },
    });
    if (!student) {
      return NextResponse.json({ error: "Student not found" }, { status: 404 });
    }

    const hallTicketNo = `HT2024${student.enrollmentNo}`;

    const registration = await prisma.examRegistration.upsert({
      where: {
        studentId_examId: { studentId: profileId, examId },
      },
      update: {},
      create: {
        studentId: profileId,
        examId,
        hallTicketNo,
      },
    });

    return NextResponse.json(registration);
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to register" }, { status: 500 });
  }
}
