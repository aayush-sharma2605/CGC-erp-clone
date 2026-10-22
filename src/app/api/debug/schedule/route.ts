import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

  const isRealAccount = (session.user as any).isRealAccount === true;
  const collegeSession = (session.user as any).collegeSession;

  if (!isRealAccount || !collegeSession) {
    return NextResponse.json({ error: "Not a real ERP account" }, { status: 400 });
  }

  const { callCollegeApi } = await import("@/lib/college-api/client");

  try {
    const sessionNo =
      (collegeSession as any).currentSessionNo ||
      (collegeSession as any).sessionNo ||
      142;

    const raw = await callCollegeApi<any>("/schedule/studentv4", {
      body: { idno: String(collegeSession.idNo), sessionno: String(sessionNo) },
      sessionHeaders: collegeSession,
    });

    return NextResponse.json({
      sessionNo,
      idNo: collegeSession.idNo,
      raw,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message, stack: err.stack }, { status: 500 });
  }
}
