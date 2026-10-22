import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { LmsView } from "@/components/academic/LmsView";

export default async function LmsPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");
  const role = (session.user as any).role;
  const isRealAccount = (session.user as any).isRealAccount === true;
  const collegeSession = (session.user as any).collegeSession;

  if (role === "STUDENT" && isRealAccount && collegeSession) {
    const { getRegisteredCourses } = await import("@/lib/college-api/services");
    let liveCourses: any[] = [];
    try {
      liveCourses = await getRegisteredCourses(collegeSession);
    } catch (err) {
      console.warn("Live registered courses for LMS error:", err);
    }

    if (liveCourses.length > 0) {
      const mapped = liveCourses.map((c, idx) => ({
        id: String(c.CourseNo || idx + 1),
        name: c.CourseName || c.Ccode || `Course ${idx + 1}`,
        code: c.Ccode || (c.CourseNo ? `C-${c.CourseNo}` : `SUB-${idx + 1}`),
        category: c.SubName || (c.CourseName?.toLowerCase().includes("lab") ? "Practical" : "Theory"),
        courseNo: String(c.CourseNo || ""),
      }));

      return <LmsView courses={mapped} role="STUDENT" />;
    }
  }

  // Fallback for demo or faculty accounts
  const courses = await prisma.course.findMany({
    select: { id: true, name: true, code: true },
    orderBy: { code: "asc" },
  });

  return <LmsView courses={courses} role={role} />;
}
