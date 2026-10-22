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
      return NextResponse.json({ error: "Only students can file grievances" }, { status: 403 });
    }

    const { subject, description } = await req.json();
    if (!subject || !description) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const grievance = await prisma.grievance.create({
      data: {
        studentId: profileId,
        subject,
        description,
        status: "OPEN",
      },
    });

    return NextResponse.json(grievance);
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to file grievance" }, { status: 500 });
  }
}
