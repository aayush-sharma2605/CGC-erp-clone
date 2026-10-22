import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { PermissionsView } from "@/components/requests/PermissionsView";

export default async function PermissionsPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");
  const role = (session.user as any).role;
  const profileId = (session.user as any).profileId;

  let permissions;
  if (role === "STUDENT" && profileId) {
    permissions = await prisma.permissionRequest.findMany({
      where: { studentId: profileId },
      orderBy: { createdAt: "desc" },
    });
  } else {
    permissions = await prisma.permissionRequest.findMany({
      include: { student: true },
      orderBy: { createdAt: "desc" },
      take: 100,
    });
  }

  const serialized = permissions.map((p) => ({
    ...p,
    date: p.date.toISOString(),
    createdAt: p.createdAt.toISOString(),
  }));

  return <PermissionsView permissions={serialized as any} role={role} />;
}
