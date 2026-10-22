import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { FacultyDirectoryView } from "@/components/admin/FacultyDirectoryView";

export default async function AdminFacultyPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");
  const role = (session.user as any).role;
  if (role !== "ADMIN") redirect("/dashboard");

  const facultyList = await prisma.faculty.findMany({
    include: {
      user: { select: { email: true } },
      department: true,
    },
    orderBy: { employeeId: "asc" },
  });

  const serialized = facultyList.map((f) => ({
    ...f,
    joiningDate: f.joiningDate?.toISOString() ?? null,
  }));

  return <FacultyDirectoryView facultyList={serialized as any} />;
}
