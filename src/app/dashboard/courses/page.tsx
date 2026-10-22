import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { CoursesView } from "@/components/academic/CoursesView";

export default async function CoursesPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");
  const role = (session.user as any).role;
  const profileId = (session.user as any).profileId;
  const isRealAccount = (session.user as any).isRealAccount === true;
  const collegeSession = (session.user as any).collegeSession;

  if (role === "STUDENT" && isRealAccount && collegeSession) {
    const { getRegisteredCourses } = await import("@/lib/college-api/services");
    let liveCourses: any[] = [];
    try {
      liveCourses = await getRegisteredCourses(collegeSession);
    } catch (err) {
      console.warn("Live registered courses fetch error:", err);
    }

    const mappedCourses = liveCourses.map((c, idx) => ({
      id: `course-${c.CourseNo || idx}`,
      name: c.CourseName || c.Ccode || `Course ${idx + 1}`,
      code: c.Ccode || `SUB-${c.CourseNo || idx + 1}`,
      credits: c.Credits || 3,
      semester: c.SemesterNo || collegeSession.currentSemesterNo || 1,
      isElective: false,
      department: { name: "Engineering & Technology", code: "ENG" },
    }));

    return (
      <CoursesView
        courses={mappedCourses}
        enrolledCourseIds={mappedCourses.map((c) => c.id)}
        role="STUDENT"
      />
    );
  }

  const courses = await prisma.course.findMany({
    include: { department: true },
    orderBy: [{ semester: "asc" }, { code: "asc" }],
  });

  let enrolledCourseIds: string[] = [];
  if (role === "STUDENT" && profileId) {
    const enrollments = await prisma.courseEnrollment.findMany({
      where: { studentId: profileId },
      select: { courseId: true },
    });
    enrolledCourseIds = enrollments.map((e) => e.courseId);
  }

  return (
    <CoursesView
      courses={courses as any}
      enrolledCourseIds={enrolledCourseIds}
      role={role}
    />
  );
}
