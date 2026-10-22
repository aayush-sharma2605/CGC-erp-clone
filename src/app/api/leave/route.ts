import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const role = (session.user as any).role;
  if (role !== "STUDENT") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const body = await req.json();
  const { fromDate, toDate, reason, studentId } = body;

  if (!fromDate || !toDate || !reason || !studentId) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const leave = await prisma.leaveApplication.create({
    data: {
      studentId,
      fromDate: new Date(fromDate),
      toDate: new Date(toDate),
      reason,
      status: "PENDING",
    },
  });

  // Audit log
  await prisma.auditLog.create({
    data: {
      userId: (session.user as any).id ?? studentId,
      action: "CREATE",
      entity: "LeaveApplication",
      entityId: leave.id,
      details: `Applied for leave: ${fromDate} to ${toDate}`,
    },
  }).catch(() => {});

  return NextResponse.json(leave, { status: 201 });
}

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const role = (session.user as any).role;
  const profileId = (session.user as any).profileId;

  const where = role === "STUDENT" ? { studentId: profileId } : { status: "PENDING" as const };
  const leaves = await prisma.leaveApplication.findMany({
    where,
    include: role !== "STUDENT" ? { student: { include: { department: true } } } : undefined,
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(leaves);
}
