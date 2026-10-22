import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getAllStudentAssignments } from "@/lib/college-api/services";
import { AssignmentCenterView } from "@/components/assignments/AssignmentCenterView";

export default async function AssignmentsPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const role = (session.user as any).role;
  const isRealAccount = (session.user as any).isRealAccount === true;
  const collegeSession = (session.user as any).collegeSession;

  let assignments: any[] = [];
  let isLive = false;

  if (role === "STUDENT" && isRealAccount && collegeSession) {
    try {
      assignments = await getAllStudentAssignments(collegeSession);
      isLive = true;
    } catch (err) {
      console.warn("Failed to fetch live student assignments:", err);
    }
  }

  const stats = {
    total: assignments.length,
    active: assignments.filter((a) => !a.isExpired && !a.isSubmitted).length,
    dueThisWeek: assignments.filter((a) => !a.isExpired && !a.isSubmitted && a.daysRemaining <= 7 && a.daysRemaining >= 0).length,
    expired: assignments.filter((a) => a.isExpired && !a.isSubmitted).length,
    submitted: assignments.filter((a) => a.isSubmitted).length,
  };

  return (
    <AssignmentCenterView
      assignments={assignments}
      stats={stats}
      isLiveGateway={isLive}
      role={role}
    />
  );
}
