import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const role = (session.user as any).role;
  if (role !== "FACULTY" && role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;
  const body = await req.json();
  const { status, approverNote } = body;

  if (!["APPROVED", "REJECTED", "CANCELLED"].includes(status)) {
    return NextResponse.json({ error: "Invalid status" }, { status: 400 });
  }

  const profileId = (session.user as any).profileId;

  const updated = await prisma.leaveApplication.update({
    where: { id },
    data: {
      status,
      approvedById: profileId,
      approverNote: approverNote ?? null,
    },
  });

  await prisma.auditLog.create({
    data: {
      userId: (session.user as any).id ?? profileId,
      action: status,
      entity: "LeaveApplication",
      entityId: id,
      details: `Leave ${status} by faculty`,
    },
  }).catch(() => {});

  return NextResponse.json(updated);
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const role = (session.user as any).role;
  const profileId = (session.user as any).profileId;

  const leave = await prisma.leaveApplication.findUnique({ where: { id } });
  if (!leave) return NextResponse.json({ error: "Not found" }, { status: 404 });

  // Only student who owns it can cancel
  if (role === "STUDENT" && leave.studentId !== profileId) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  await prisma.leaveApplication.update({ where: { id }, data: { status: "CANCELLED" } });
  return NextResponse.json({ success: true });
}
