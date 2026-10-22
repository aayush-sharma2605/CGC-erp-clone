import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { FeesView } from "@/components/fees/FeesView";

export default async function FeesPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");
  const profileId = (session.user as any).profileId;

  const invoices = await prisma.feeInvoice.findMany({
    where: { studentId: profileId },
    include: { items: true, payments: true },
    orderBy: { createdAt: "desc" },
  });

  const serialized = invoices.map((inv) => ({
    ...inv,
    dueDate: inv.dueDate.toISOString(),
    createdAt: inv.createdAt.toISOString(),
    payments: inv.payments.map((p) => ({ ...p, paidAt: p.paidAt.toISOString() })),
  }));

  return <FeesView invoices={serialized} />;
}
