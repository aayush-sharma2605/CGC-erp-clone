import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { HallTicketView } from "@/components/exams/HallTicketView";

export default async function HallTicketPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");
  const role = (session.user as any).role;
  const profileId = (session.user as any).profileId;

  if (role !== "STUDENT" || !profileId) {
    return (
      <div className="card p-8 text-center text-slate-400">
        Admit Cards are only available for enrolled students.
      </div>
    );
  }

  const student = await prisma.student.findUnique({
    where: { id: profileId },
    include: { department: true },
  });
  if (!student) redirect("/login");

  const registration = await prisma.examRegistration.findFirst({
    where: { studentId: profileId },
    include: {
      exam: {
        include: {
          subjects: {
            include: { course: true },
            orderBy: [{ date: "asc" }, { startTime: "asc" }],
          },
        },
      },
    },
    orderBy: { registeredAt: "desc" },
  });

  const serializedReg = registration
    ? {
        hallTicketNo: registration.hallTicketNo || `HT2024${student.enrollmentNo}`,
        exam: {
          name: registration.exam.name,
          subjects: registration.exam.subjects.map((s) => ({
            id: s.id,
            date: s.date.toISOString(),
            startTime: s.startTime,
            endTime: s.endTime,
            room: s.room,
            course: {
              name: s.course.name,
              code: s.course.code,
            },
          })),
        },
      }
    : null;

  return (
    <HallTicketView
      student={{
        firstName: student.firstName,
        lastName: student.lastName,
        enrollmentNo: student.enrollmentNo,
        currentSemester: student.currentSemester,
        department: {
          name: student.department.name,
          code: student.department.code,
        },
      }}
      registration={serializedReg}
    />
  );
}
