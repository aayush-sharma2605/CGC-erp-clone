import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { GrievanceView } from "@/components/communication/GrievanceView";

export default async function GrievancePage() {
  const session = await auth();
  if (!session?.user) redirect("/login");
  const role = (session.user as any).role;
  const profileId = (session.user as any).profileId;

  let grievances = [];
  if (role === "STUDENT" && profileId) {
    grievances = await prisma.grievance.findMany({
      where: { studentId: profileId },
      orderBy: { createdAt: "desc" },
    });
  } else {
    grievances = await prisma.grievance.findMany({
      include: { student: true },
      orderBy: { createdAt: "desc" },
      take: 100,
    });
  }

  const serialized = grievances.map((g) => ({
    ...g,
    createdAt: g.createdAt.toISOString(),
    updatedAt: g.updatedAt.toISOString(),
  }));

  return <GrievanceView grievances={serialized as any} role={role} />;
}
