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
      return NextResponse.json({ error: "Only students can apply for gate passes" }, { status: 403 });
    }

    const { reason, outDate, returnDate } = await req.json();
    if (!reason || !outDate) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const gatePass = await prisma.gatePass.create({
      data: {
        studentId: profileId,
        reason,
        outDate: new Date(outDate),
        returnDate: returnDate ? new Date(returnDate) : null,
        status: "PENDING",
      },
    });

    return NextResponse.json(gatePass);
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to create gate pass" }, { status: 500 });
  }
}
