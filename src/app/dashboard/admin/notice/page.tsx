import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { CreateNoticeView } from "@/components/admin/CreateNoticeView";

export default async function CreateNoticePage() {
  const session = await auth();
  if (!session?.user) redirect("/login");
  const role = (session.user as any).role;
  if (role !== "ADMIN" && role !== "FACULTY") redirect("/dashboard");

  return <CreateNoticeView />;
}
