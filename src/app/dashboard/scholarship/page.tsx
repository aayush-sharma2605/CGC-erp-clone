import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { ScholarshipView } from "@/components/requests/ScholarshipView";

export default async function ScholarshipPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");
  const role = (session.user as any).role;
  const profileId = (session.user as any).profileId;

  let scholarships = [];
  if (role === "STUDENT" && profileId) {
    scholarships = await prisma.scholarship.findMany({
      where: { studentId: profileId },
      orderBy: { appliedAt: "desc" },
    });
  } else {
    scholarships = await prisma.scholarship.findMany({
      orderBy: { appliedAt: "desc" },
      take: 50,
    });
  }

  const serialized = scholarships.map((s) => ({
    ...s,
    appliedAt: s.appliedAt.toISOString(),
  }));

  return <ScholarshipView scholarships={serialized as any} role={role} />;
}
