import { auth } from "@/lib/auth";
import { getSubjectAttendanceHistory } from "@/lib/college-api/services";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const isRealAccount = (session.user as any).isRealAccount === true;
    const collegeSession = (session.user as any).collegeSession;

    if (!isRealAccount || !collegeSession) {
      return NextResponse.json({ error: "Live session not available" }, { status: 400 });
    }

    const { searchParams } = new URL(req.url);
    const courseNo = searchParams.get("courseNo");
    if (!courseNo) {
      return NextResponse.json({ error: "courseNo parameter is required" }, { status: 400 });
    }

    const sessionNo = searchParams.get("sessionNo") || collegeSession.currentSessionNo || 142;
    const lectures = await getSubjectAttendanceHistory(collegeSession, courseNo, sessionNo);

    return NextResponse.json({
      success: true,
      courseNo,
      totalLectures: lectures.length,
      lectures,
    });
  } catch (err: any) {
    console.error("Failed to fetch subject attendance history:", err);
    return NextResponse.json(
      { error: err.message || "Failed to load subject lectures" },
      { status: 500 }
    );
  }
}
