import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { TimetableView } from "@/components/academic/TimetableView";

export default async function TimetablePage() {
  const session = await auth();
  if (!session?.user) redirect("/login");
  const role = (session.user as any).role;
  const isRealAccount = (session.user as any).isRealAccount === true;
  const collegeSession = (session.user as any).collegeSession;

  if (isRealAccount && collegeSession) {
    const { getWeeklySchedule, getStudentSchedule } = await import(
      "@/lib/college-api/services"
    );

    // Fetch full weekly timetable from schedule/studentv4
    let weeklySlots: Awaited<ReturnType<typeof getWeeklySchedule>> = [];
    try {
      weeklySlots = await getWeeklySchedule(collegeSession);
    } catch (err) {
      console.warn("Weekly schedule fetch error:", err);
    }

    // Also try to get today's schedule as an additional source
    // (today's schedule is more reliable for attendance status on current day,
    //  but often returns "No Data found" — so it's best-effort only)
    let todaySlots: Awaited<ReturnType<typeof getStudentSchedule>> = [];
    try {
      todaySlots = await getStudentSchedule(collegeSession);
    } catch (_) {
      // silent — today's schedule is a bonus
    }

    // If we got weekly data, use it; otherwise fall back to today's schedule only
    if (weeklySlots.length > 0) {
      // Map WeeklySlot → TimetableView Slot
      const mapped = weeklySlots.map((s) => ({
        id: s.id,
        dayOfWeek: s.dayOfWeek,
        startTime: s.startTime,
        endTime: s.endTime,
        room: s.room || null,
        course: {
          name: s.courseName || s.courseCode || "Course",
          code: s.courseCode || "—",
          credits: 4, // credits not in schedule API; default to 4
        },
        faculty: s.facultyName
          ? { firstName: s.facultyName, lastName: "" }
          : null,
      }));

      return <TimetableView slots={mapped} role={role} />;
    }

    // Fallback: today's schedule only — place all slots on today's day index
    if (todaySlots.length > 0) {
      // JS getDay(): 0=Sunday, 1=Monday … 6=Saturday
      // TimetableView dayOfWeek: 0=Monday … 5=Saturday
      const jsDow = new Date().getDay();
      const viewDow = jsDow === 0 ? 0 : jsDow - 1; // Sunday→Monday(0) as placeholder

      const mapped = todaySlots.map((s, idx) => {
        const times = (s.Slotname || "").split("-").map((t: string) => t.trim());
        return {
          id: `today-${idx}-${s.Ccode}`,
          dayOfWeek: viewDow,
          startTime: times[0] || "09:00 AM",
          endTime: times[1] || "10:00 AM",
          room: s.Roomno || null,
          course: {
            name: s.Coursename || s.Ccode || "Course",
            code: s.Ccode || `SUB-${idx + 1}`,
            credits: 4,
          },
          faculty: s.Facultyname
            ? { firstName: s.Facultyname, lastName: "" }
            : null,
        };
      });

      return <TimetableView slots={mapped} role={role} />;
    }

    // If both API calls returned nothing, show an empty timetable rather than mock data
    return <TimetableView slots={[]} role={role} />;
  }

  // Demo / guest account — use the Prisma-backed timetable
  const slots = await prisma.timetableSlot.findMany({
    include: {
      course: true,
      faculty: true,
    },
    orderBy: [{ dayOfWeek: "asc" }, { startTime: "asc" }],
  });

  return <TimetableView slots={slots as any} role={role} />;
}
