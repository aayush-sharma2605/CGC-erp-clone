import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { PaySlipView } from "@/components/finance/PaySlipView";

export default async function PaySlipPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");
  const role = (session.user as any).role;
  const profileId = (session.user as any).profileId;

  if (role !== "FACULTY" && role !== "STAFF") {
    return (
      <div className="card p-8 text-center text-slate-400">
        Salary slips are accessible to faculty and staff members only.
      </div>
    );
  }

  const faculty = await prisma.faculty.findUnique({
    where: { id: profileId },
    include: {
      department: true,
      paySlips: { orderBy: [{ year: "desc" }, { month: "desc" }] },
    },
  });

  if (!faculty) redirect("/login");

  const serializedSlips = faculty.paySlips.map((s) => ({
    ...s,
    generatedAt: s.generatedAt.toISOString(),
  }));

  return (
    <PaySlipView
      slips={serializedSlips}
      facultyName={`${faculty.firstName} ${faculty.lastName}`}
      employeeId={faculty.employeeId}
      department={faculty.department.name}
    />
  );
}
