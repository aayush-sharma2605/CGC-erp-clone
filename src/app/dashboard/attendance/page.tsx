import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { AttendanceView } from "@/components/attendance/AttendanceView";

export default async function AttendancePage() {
  const session = await auth();
  if (!session?.user) redirect("/login");
  const role = (session.user as any).role;
  const profileId = (session.user as any).profileId;
  const isRealAccount = (session.user as any).isRealAccount === true;
  const collegeSession = (session.user as any).collegeSession;

  if (role === "STUDENT") {
    if (isRealAccount && collegeSession) {
      const { getStudentAttendance, getRegisteredCourses } = await import("@/lib/college-api/services");
      let attList: any[] = [];
      let regCourses: any[] = [];
      try {
        const [attRes, coursesRes] = await Promise.all([
          getStudentAttendance(collegeSession),
          getRegisteredCourses(collegeSession).catch(() => []),
        ]);
        attList = attRes || [];
        regCourses = coursesRes || [];
      } catch (err) {
        console.warn("Live attendance fetch error:", err);
      }

      const totalClasses = attList.reduce((sum, item) => sum + (Number(item.Total_Class) || 0), 0);
      const presentClasses = attList.reduce((sum, item) => sum + (Number(item.Present) || 0), 0);
      const absentClasses = attList.reduce((sum, item) => sum + (Number(item.Absent) || 0), 0);
      const overallPct = totalClasses > 0 ? Math.round((presentClasses / totalClasses) * 1000) / 10 : 0;

      const subjectSummaries = attList.map((item, idx) => {
        const courseNo = String(item.CourseNo || idx + 1);
        const matched = regCourses.find((c: any) => String(c.CourseNo) === courseNo);
        const courseName = item.Course_Name || matched?.CourseName || item.Subject || `Course ${courseNo}`;
        const courseCode = matched?.Ccode || (courseNo ? `C-${courseNo}` : `SUB-${idx + 1}`);
        const category =
          matched?.SubName ||
          (courseName.toLowerCase().includes("lab") || courseName.toLowerCase().includes("practical")
            ? "Practical"
            : "Theory");

        const total = Number(item.Total_Class) || 0;
        const present = Number(item.Present) || 0;
        const absent = Number(item.Absent) || (total >= present ? total - present : 0);
        const pct =
          typeof item.Percentage === "number"
            ? item.Percentage
            : parseFloat(String(item.Percentage)) || (total > 0 ? Math.round((present / total) * 1000) / 10 : 0);

        const canBunk = pct >= 75 ? Math.max(0, Math.floor((present - 0.75 * total) / 0.75)) : 0;
        const needsToAttend = pct < 75 && total > 0 ? Math.max(1, Math.ceil((0.75 * total - present) / 0.25)) : 0;

        return {
          courseNo,
          courseCode,
          courseName,
          category,
          totalClasses: total,
          presentClasses: present,
          absentClasses: absent,
          percentage: pct,
          status: (pct >= 75 ? "ELIGIBLE" : "SHORTAGE") as "ELIGIBLE" | "SHORTAGE",
          canBunk,
          needsToAttend,
        };
      });

      const records = subjectSummaries.map((sub, idx) => ({
        id: `att-live-${idx}`,
        date: new Date().toISOString(),
        period: 1,
        status: sub.percentage >= 75 ? "PRESENT" : "ABSENT",
        course: {
          name: sub.courseName,
          code: sub.courseCode,
        },
        remarks: `${sub.presentClasses} Attended / ${sub.totalClasses} Total Classes (${sub.percentage}%)`,
      }));

      return (
        <AttendanceView
          subjectSummaries={subjectSummaries}
          stats={{
            overallPct,
            totalClasses,
            presentClasses,
            absentClasses,
          }}
          records={records}
          role="STUDENT"
        />
      );
    }

    const records = await prisma.attendanceRecord.findMany({
      where: { studentId: profileId },
      include: { course: true },
      orderBy: { date: "desc" },
    });

    const serialized = records.map((r) => ({
      ...r,
      date: r.date.toISOString(),
      createdAt: r.createdAt.toISOString(),
    }));

    return <AttendanceView records={serialized} role="STUDENT" />;
  }

  // Faculty — show their department students
  const records = await prisma.attendanceRecord.findMany({
    include: { course: true, student: true, markedBy: true },
    orderBy: { date: "desc" },
    take: 200,
  });

  const serialized = records.map((r) => ({
    ...r,
    date: r.date.toISOString(),
    createdAt: r.createdAt.toISOString(),
  }));

  return <AttendanceView records={serialized} role={role} />;
}
