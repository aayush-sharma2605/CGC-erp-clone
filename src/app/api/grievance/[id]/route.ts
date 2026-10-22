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
    if (role !== "ADMIN" && role !== "FACULTY") {
      return NextResponse.json({ error: "Only admin or faculty can update grievance status" }, { status: 403 });
    }

    const { id } = await params;
    const { status, resolution } = await req.json();

    const updated = await prisma.grievance.update({
      where: { id },
      data: {
        status,
        resolution,
      },
    });

    return NextResponse.json(updated);
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to update grievance" }, { status: 500 });
  }
}
