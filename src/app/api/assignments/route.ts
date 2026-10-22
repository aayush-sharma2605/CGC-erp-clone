import { auth } from "@/lib/auth";
import { getAllStudentAssignments } from "@/lib/college-api/services";
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
      // Demo accounts or local student without live ERP connection
      return NextResponse.json({
        success: true,
        isLiveGateway: false,
        stats: {
          total: 0,
          active: 0,
          dueThisWeek: 0,
          expired: 0,
          submitted: 0,
        },
        assignments: [],
      });
    }

    const assignments = await getAllStudentAssignments(collegeSession);

    const stats = {
      total: assignments.length,
      active: assignments.filter((a) => !a.isExpired && !a.isSubmitted).length,
      dueThisWeek: assignments.filter((a) => !a.isExpired && !a.isSubmitted && a.daysRemaining <= 7 && a.daysRemaining >= 0).length,
      expired: assignments.filter((a) => a.isExpired && !a.isSubmitted).length,
      submitted: assignments.filter((a) => a.isSubmitted).length,
    };

    return NextResponse.json({
      success: true,
      isLiveGateway: true,
      stats,
      assignments,
    });
  } catch (err: any) {
    console.error("Assignment list API error:", err);
    return NextResponse.json(
      { error: err.message || "Failed to fetch student assignments from college gateway" },
      { status: 500 }
    );
  }
}
