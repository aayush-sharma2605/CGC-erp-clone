import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { PurchaseOrdersView } from "@/components/admin/PurchaseOrdersView";

export default async function AdminPurchaseOrdersPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");
  const role = (session.user as any).role;
  if (role !== "ADMIN") redirect("/dashboard");

  return <PurchaseOrdersView />;
}
