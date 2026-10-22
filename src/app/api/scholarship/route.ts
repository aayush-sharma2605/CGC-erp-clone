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
      return NextResponse.json({ error: "Only students can apply for scholarships" }, { status: 403 });
    }

    const { name, amount, remarks } = await req.json();
    if (!name || !amount) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const scholarship = await prisma.scholarship.create({
      data: {
        studentId: profileId,
        name,
        amount: Number(amount),
        remarks,
        status: "PENDING",
      },
    });

    return NextResponse.json(scholarship);
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to create scholarship application" }, { status: 500 });
  }
}
