import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { NoticesView } from "@/components/communication/NoticesView";

export default async function NoticesPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");
  const role = (session.user as any).role;

  const notices = await prisma.notice.findMany({
    orderBy: [{ isPinned: "desc" }, { createdAt: "desc" }],
  });

  const serialized = notices.map((n) => ({
    ...n,
    createdAt: n.createdAt.toISOString(),
  }));

  return <NoticesView notices={serialized as any} role={role} />;
}
