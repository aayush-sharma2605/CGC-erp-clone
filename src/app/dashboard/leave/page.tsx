import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { LeaveView } from "@/components/leave/LeaveView";

export default async function LeavePage() {
  const session = await auth();
  if (!session?.user) redirect("/login");
  const role = (session.user as any).role;
  const profileId = (session.user as any).profileId;

  if (role === "STUDENT") {
    const leaves = await prisma.leaveApplication.findMany({
      where: { studentId: profileId },
      orderBy: { createdAt: "desc" },
    });
    return (
      <LeaveView
        leaves={leaves.map((l) => ({
          ...l,
          fromDate: l.fromDate.toISOString(),
          toDate: l.toDate.toISOString(),
          createdAt: l.createdAt.toISOString(),
          updatedAt: l.updatedAt.toISOString(),
        }))}
        role="STUDENT"
        profileId={profileId}
      />
    );
  }

  // Faculty — see pending leaves
  const leaves = await prisma.leaveApplication.findMany({
    where: { status: "PENDING" },
    include: { student: { include: { department: true } } },
    orderBy: { createdAt: "desc" },
  });

  return (
    <LeaveView
      leaves={leaves.map((l) => ({
        ...l,
        fromDate: l.fromDate.toISOString(),
        toDate: l.toDate.toISOString(),
        createdAt: l.createdAt.toISOString(),
        updatedAt: l.updatedAt.toISOString(),
        student: l.student
          ? {
              firstName: l.student.firstName,
              lastName: l.student.lastName,
              enrollmentNo: l.student.enrollmentNo,
              department: { name: l.student.department.name },
            }
          : undefined,
      }))}
      role={role}
      profileId={profileId}
    />
  );
}
