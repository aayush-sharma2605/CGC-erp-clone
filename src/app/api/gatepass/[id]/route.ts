import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const role = (session.user as any).role;
    const profileId = (session.user as any).profileId;
    if (role !== "FACULTY" && role !== "ADMIN") {
      return NextResponse.json({ error: "Only faculty or admin can update gate pass status" }, { status: 403 });
    }

    const { id } = await params;
    const { status, approverNote } = await req.json();

    const updated = await prisma.gatePass.update({
      where: { id },
      data: {
        status,
        approverNote,
        approvedById: profileId,
      },
    });

    return NextResponse.json(updated);
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to update gate pass" }, { status: 500 });
  }
}
