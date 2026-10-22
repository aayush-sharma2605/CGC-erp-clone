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
      return NextResponse.json({ error: "Only students can apply for permissions" }, { status: 403 });
    }

    const { reason, date, fromTime, toTime } = await req.json();
    if (!reason || !date || !fromTime || !toTime) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const perm = await prisma.permissionRequest.create({
      data: {
        studentId: profileId,
        reason,
        date: new Date(date),
        fromTime,
        toTime,
        status: "PENDING",
      },
    });

    return NextResponse.json(perm);
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to create permission" }, { status: 500 });
  }
}
