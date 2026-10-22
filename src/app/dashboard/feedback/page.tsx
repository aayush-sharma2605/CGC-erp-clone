import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { FeedbackView } from "@/components/communication/FeedbackView";

export default async function FeedbackPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");
  const role = (session.user as any).role;
  const profileId = (session.user as any).profileId;

  let feedbacks = [];
  if (role === "STUDENT" && profileId) {
    feedbacks = await prisma.feedback.findMany({
      where: { studentId: profileId },
      orderBy: { createdAt: "desc" },
    });
  } else {
    feedbacks = await prisma.feedback.findMany({
      orderBy: { createdAt: "desc" },
      take: 100,
    });
  }

  const serialized = feedbacks.map((f) => ({
    ...f,
    createdAt: f.createdAt.toISOString(),
  }));

  return <FeedbackView feedbacks={serialized} role={role} />;
}
