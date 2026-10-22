import { auth } from "@/lib/auth";
import { getAssignmentDetail, submitAssignmentReply, parseMasterSoftDate } from "@/lib/college-api/services";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const isRealAccount = (session.user as any).isRealAccount === true;
    const collegeSession = (session.user as any).collegeSession;

    if (!isRealAccount || !collegeSession) {
      return NextResponse.json({ error: "Live college ERP session required" }, { status: 400 });
    }

    const asNo = id.replace(/^as-/, "");
    const detail = await getAssignmentDetail(collegeSession, asNo);

    return NextResponse.json({
      success: true,
      asNo,
      detail,
    });
  } catch (err: any) {
    console.error("Assignment detail API error:", err);
    return NextResponse.json(
      { error: err.message || "Failed to load assignment details" },
      { status: 500 }
    );
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const asNo = id.replace(/^as-/, "");
    const isRealAccount = (session.user as any).isRealAccount === true;
    const collegeSession = (session.user as any).collegeSession;

    if (!isRealAccount || !collegeSession) {
      return NextResponse.json(
        { error: "Cannot submit assignments in demo mode without live college authorization." },
        { status: 403 }
      );
    }

    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const description = (formData.get("description") as string) || "";
    const cutoffDate = (formData.get("cutoffDate") as string) || "";

    // 1. Authoritative deadline check
    if (cutoffDate) {
      const cutoffObj = parseMasterSoftDate(cutoffDate);
      if (cutoffObj && Date.now() > cutoffObj.getTime()) {
        return NextResponse.json(
          { error: "Submission rejected: Assignment deadline has already passed." },
          { status: 403 }
        );
      }
    }

    // 2. Validate file presence
    if (!file || typeof file === "string") {
      return NextResponse.json(
        { error: "A valid submission file (PDF or DOCX) is required." },
        { status: 400 }
      );
    }

    // 3. Validate file size (max 10MB)
    const MAX_SIZE_BYTES = 10 * 1024 * 1024;
    if (file.size > MAX_SIZE_BYTES) {
      return NextResponse.json(
        { error: "File exceeds the maximum allowed size of 10 MB." },
        { status: 400 }
      );
    }

    // 4. Validate allowed file extensions
    const lowerName = file.name.toLowerCase();
    const allowed = [".pdf", ".docx", ".doc", ".zip", ".txt"];
    if (!allowed.some((ext) => lowerName.endsWith(ext))) {
      return NextResponse.json(
        { error: "Invalid file format. Allowed formats: PDF, DOCX, DOC, ZIP, TXT." },
        { status: 400 }
      );
    }

    // 5. Submit to official gateway
    const result = await submitAssignmentReply(
      collegeSession,
      asNo,
      description,
      file,
      file.name,
      cutoffDate
    );

    return NextResponse.json(result);
  } catch (err: any) {
    console.error("Assignment submission error:", err);
    return NextResponse.json(
      { error: err.message || "Failed to submit assignment to college gateway." },
      { status: 500 }
    );
  }
}
