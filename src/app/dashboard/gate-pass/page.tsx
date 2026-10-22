import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { GatePassView } from "@/components/requests/GatePassView";

export default async function GatePassPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");
  const role = (session.user as any).role;
  const profileId = (session.user as any).profileId;

  let passes;
  if (role === "STUDENT" && profileId) {
    passes = await prisma.gatePass.findMany({
      where: { studentId: profileId },
      orderBy: { createdAt: "desc" },
    });
  } else {
    passes = await prisma.gatePass.findMany({
      include: { student: true },
      orderBy: { createdAt: "desc" },
      take: 100,
    });
  }

  const serialized = passes.map((p) => ({
    ...p,
    outDate: p.outDate.toISOString(),
    returnDate: p.returnDate?.toISOString() ?? null,
    createdAt: p.createdAt.toISOString(),
  }));

  return <GatePassView passes={serialized as any} role={role} />;
}
