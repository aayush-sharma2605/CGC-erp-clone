import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { ExamsView } from "@/components/exams/ExamsView";

export default async function ExamsPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");
  const role = (session.user as any).role;
  const profileId = (session.user as any).profileId;

  const exams = await prisma.exam.findMany({
    include: {
      subjects: {
        include: { course: true },
        orderBy: [{ date: "asc" }, { startTime: "asc" }],
      },
      registrations: profileId ? { where: { studentId: profileId } } : false,
    },
    orderBy: { startDate: "desc" },
  });

  const serialized = exams.map((e) => {
    const reg = (e as any).registrations?.[0];
    return {
      id: e.id,
      name: e.name,
      startDate: e.startDate.toISOString(),
      endDate: e.endDate.toISOString(),
      status: e.status,
      isRegistered: !!reg,
      hallTicketNo: reg?.hallTicketNo ?? null,
      subjects: e.subjects.map((s) => ({
        id: s.id,
        date: s.date.toISOString(),
        startTime: s.startTime,
        endTime: s.endTime,
        room: s.room,
        maxMarks: s.maxMarks,
        passingMarks: s.passingMarks,
        course: {
          name: s.course.name,
          code: s.course.code,
          credits: s.course.credits,
        },
      })),
    };
  });

  return <ExamsView exams={serialized} role={role} />;
}
