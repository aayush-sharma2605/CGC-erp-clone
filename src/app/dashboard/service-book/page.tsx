import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { ServiceBookView } from "@/components/faculty/ServiceBookView";

export default async function ServiceBookPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");
  const role = (session.user as any).role;
  const profileId = (session.user as any).profileId;

  if (role !== "FACULTY" && role !== "STAFF" && role !== "ADMIN") {
    return (
      <div className="card p-8 text-center text-slate-400">
        Service book records are available to faculty, staff, and institutional administrators.
      </div>
    );
  }

  const faculty = await prisma.faculty.findFirst({
    where: profileId ? { id: profileId } : undefined,
    include: { department: true },
  });

  if (!faculty) redirect("/login");

  return (
    <ServiceBookView
      faculty={{
        firstName: faculty.firstName,
        lastName: faculty.lastName,
        employeeId: faculty.employeeId,
        designation: faculty.designation,
        department: {
          name: faculty.department.name,
          code: faculty.department.code,
        },
        joiningDate: faculty.joiningDate?.toISOString() ?? null,
        qualification: faculty.qualification,
      }}
    />
  );
}
