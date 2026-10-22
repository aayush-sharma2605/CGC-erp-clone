import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { SettingsView } from "@/components/admin/SettingsView";

export default async function SettingsPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");
  const role = (session.user as any).role;
  if (role !== "ADMIN") redirect("/dashboard");

  return <SettingsView />;
}
