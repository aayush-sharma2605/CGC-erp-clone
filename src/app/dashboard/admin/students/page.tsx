import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { StudentsDirectoryView } from "@/components/admin/StudentsDirectoryView";

export default async function AdminStudentsPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");
  const role = (session.user as any).role;
  if (role !== "ADMIN") redirect("/dashboard");

  const students = await prisma.student.findMany({
    include: {
      user: { select: { email: true } },
      department: true,
    },
    orderBy: { enrollmentNo: "asc" },
  });

  return <StudentsDirectoryView students={students as any} />;
}
