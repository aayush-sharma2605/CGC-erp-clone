import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { StudentDashboard } from "@/components/dashboard/StudentDashboard";
import { FacultyDashboard } from "@/components/dashboard/FacultyDashboard";
import { AdminDashboard } from "@/components/dashboard/AdminDashboard";

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const role = (session.user as any).role;
  const profileId = (session.user as any).profileId;
  const isRealAccount = (session.user as any).isRealAccount === true;
  const collegeSession = (session.user as any).collegeSession;

  if (role === "STUDENT") {
    if (isRealAccount && collegeSession) {
      const {
        getStudentAttendance,
        getRegisteredCourses,
        getStudentSchedule,
        getAllStudentAssignments,
      } = await import("@/lib/college-api/services");

      let attList: any[] = [];
      let regCourses: any[] = [];
      let scheduleList: any[] = [];
      let assignmentList: any[] = [];

      try {
        const [attRes, coursesRes, schedRes, assignRes] = await Promise.all([
          getStudentAttendance(collegeSession).catch(() => []),
          getRegisteredCourses(collegeSession).catch(() => []),
          getStudentSchedule(collegeSession).catch(() => []),
          getAllStudentAssignments(collegeSession).catch(() => []),
        ]);
        attList = attRes || [];
        regCourses = coursesRes || [];
        scheduleList = schedRes || [];
        assignmentList = assignRes || [];
      } catch (err) {
        console.warn("Live college dashboard data fetch:", err);
      }

      const totalClasses = attList.reduce((sum, item) => sum + (Number(item.Total_Class) || 0), 0);
      const presentClasses = attList.reduce((sum, item) => sum + (Number(item.Present) || 0), 0);
      const absentClasses = attList.reduce((sum, item) => sum + (Number(item.Absent) || 0), 0);
      const attendancePct = totalClasses > 0 ? Math.round((presentClasses / totalClasses) * 1000) / 10 : 0;

      const courseAttendance = attList.map((item) => {
        const courseNoStr = String(item.CourseNo || "");
        const matched = regCourses.find((c: any) => String(c.CourseNo) === courseNoStr);
        const name = item.Course_Name || matched?.CourseName || item.Subject || (courseNoStr ? `Course ${courseNoStr}` : "Subject");
        const code = item.CourseCode || matched?.Ccode || (courseNoStr ? `C-${courseNoStr}` : "ENG");
        const total = Number(item.Total_Class) || 0;
        const present = Number(item.Present) || 0;
        const pct =
          typeof item.Percentage === "number"
            ? Math.round(item.Percentage * 100) / 100
            : parseFloat(String(item.Percentage)) || (total > 0 ? Math.round((present / total) * 1000) / 10 : 0);

        return {
          name,
          code,
          percentage: pct,
          present,
          total,
        };
      });

      // Filter active assignments
      const activeAssignments = assignmentList.filter((a) => !a.isExpired);
      const pendingAssignments = activeAssignments.filter((a) => !a.isSubmitted);
      const submittedAssignments = assignmentList.filter((a) => a.isSubmitted);

      // Today's schedule slots
      const todaySchedule = scheduleList.map((s, idx) => ({
        id: `sched-${idx}`,
        ccode: s.Ccode || "SUB",
        courseName: s.Coursename || "Lecture",
        slotName: s.Slotname || "09:30 AM - 10:30 AM",
        roomNo: s.Roomno || "LT-1",
        facultyName: s.Facultyname || "Faculty",
        attendanceStatus: s.AttendancestatusDisplay || (s.Attendancestatus ? "Present" : "Scheduled"),
        isLive: idx === 0,
      }));

      // Recent genuine activities
      const recentActivity: any[] = [];
      for (const as of submittedAssignments.slice(0, 3)) {
        recentActivity.push({
          id: `act-as-${as.asNo}`,
          title: `Assignment Submitted: ${as.title}`,
          subtitle: `${as.courseName} · Recorded on portal`,
          time: as.dueDate ? `Due ${as.dueDate}` : "Recently",
          type: "SUBMISSION",
          status: "SUCCESS",
        });
      }
      for (const att of courseAttendance.slice(0, 2)) {
        if (att.present > 0) {
          recentActivity.push({
            id: `act-att-${att.code}`,
            title: `Lecture Attended: ${att.name}`,
            subtitle: `${att.code} · ${att.present}/${att.total} Lectures Present`,
            time: "Recorded",
            type: "ATTENDANCE",
            status: "SUCCESS",
          });
        }
      }

      const nameParts = (session.user.name || "Student").split(" ");
      return (
        <StudentDashboard
          student={{
            firstName: nameParts[0] || "Student",
            lastName: nameParts.slice(1).join(" ") || "",
            enrollmentNo: (session.user as any).enrollmentNo || "N/A",
            currentSemester: collegeSession.currentSemesterNo || 5,
            department: { name: "Computer Science & Engineering", code: "CSE" },
            degree: "B.Tech Computer Science & Engineering",
            collegeName: "Chandigarh Group of Colleges (CGC)",
          }}
          stats={{
            attendancePct,
            totalClasses,
            presentClasses,
            absentClasses,
            courseAttendance,
            pendingFees: 0,
            activeLeaves: 0,
            activeGatePasses: 0,
            assignmentsDue: pendingAssignments.length,
            totalAssignments: activeAssignments.length,
            submittedAssignments: submittedAssignments.length,
            gpa: 8.6,
          }}
          todaySchedule={todaySchedule}
          assignments={activeAssignments.slice(0, 4)}
          recentActivity={recentActivity}
          recentLeaves={[]}
          recentFees={[]}
          isRealAccount={true}
        />
      );
    }

    const student = await prisma.student.findUnique({
      where: { id: profileId },
      include: {
        department: true,
        academicSession: true,
        attendanceRecords: {
          take: 100,
          orderBy: { date: "desc" },
          include: { course: true },
        },
        feeInvoices: {
          orderBy: { createdAt: "desc" },
          take: 3,
          include: { items: true },
        },
        leaveApplications: {
          orderBy: { createdAt: "desc" },
          take: 3,
        },
        gatePasses: {
          orderBy: { createdAt: "desc" },
          take: 3,
        },
      },
    });

    if (!student) redirect("/login");

    // Compute attendance summary
    const records = student.attendanceRecords;
    const total = records.length;
    const present = records.filter((r) => r.status === "PRESENT" || r.status === "LATE").length;
    const attendancePct = total > 0 ? Math.round((present / total) * 100) : 0;

    // Group by course
    const courseAttMap: Record<string, { name: string; present: number; total: number }> = {};
    for (const r of records) {
      if (!courseAttMap[r.courseId]) {
        courseAttMap[r.courseId] = { name: r.course.name, present: 0, total: 0 };
      }
      courseAttMap[r.courseId].total++;
      if (r.status === "PRESENT" || r.status === "LATE") courseAttMap[r.courseId].present++;
    }
    const courseAttendance = Object.values(courseAttMap).map((c) => ({
      name: c.name,
      percentage: c.total > 0 ? Math.round((c.present / c.total) * 100) : 0,
    }));

    // Pending fees
    const pendingFees = student.feeInvoices
      .filter((f) => f.status === "PENDING" || f.status === "PARTIAL" || f.status === "OVERDUE")
      .reduce((sum, f) => sum + f.totalAmount - f.paidAmount, 0);

    return (
      <StudentDashboard
        student={{
          ...student,
          dateOfBirth: student.dateOfBirth?.toISOString() ?? null,
          createdAt: student.createdAt.toISOString(),
          updatedAt: student.updatedAt.toISOString(),
        }}
        stats={{
          attendancePct,
          totalClasses: total,
          presentClasses: present,
          courseAttendance,
          pendingFees,
          activeLeaves: student.leaveApplications.filter((l) => l.status === "PENDING").length,
          activeGatePasses: student.gatePasses.filter((g) => g.status === "PENDING" || g.status === "APPROVED").length,
          assignmentsDue: 1,
          totalAssignments: 2,
          submittedAssignments: 1,
          gpa: 8.5,
        }}
        todaySchedule={[
          {
            id: "sched-1",
            ccode: "CS-501",
            courseName: "Data Structures & Algorithms",
            slotName: "09:00 AM - 10:00 AM",
            roomNo: "Lab 204",
            facultyName: "Prof. Mehta",
            attendanceStatus: "Present",
            isLive: true,
          },
          {
            id: "sched-2",
            ccode: "CS-502",
            courseName: "Database Management Systems",
            slotName: "11:30 AM - 12:30 PM",
            roomNo: "LT-3",
            facultyName: "Prof. Iyer",
            attendanceStatus: "Scheduled",
            isLive: false,
          },
          {
            id: "sched-3",
            ccode: "CS-503",
            courseName: "Operating Systems",
            slotName: "02:00 PM - 03:00 PM",
            roomNo: "Hall B",
            facultyName: "Prof. Verma",
            attendanceStatus: "Scheduled",
            isLive: false,
          },
        ]}
        assignments={[
          {
            id: "as-1",
            asNo: 501,
            title: "DSA Module 3: Binary Search Trees",
            courseName: "Data Structures & Algorithms",
            courseCode: "CS-501",
            dueDate: "10-25-2026",
            daysRemaining: 2,
            isExpired: false,
            isSubmitted: false,
          },
          {
            id: "as-2",
            asNo: 502,
            title: "Database Normalization Case Study",
            courseName: "Database Management Systems",
            courseCode: "CS-502",
            dueDate: "10-27-2026",
            daysRemaining: 4,
            isExpired: false,
            isSubmitted: true,
          },
        ]}
        recentActivity={[
          {
            id: "act-1",
            title: "Database Normalization Case Study Submitted",
            subtitle: "Database Management Systems · Portal",
            time: "Yesterday",
            type: "SUBMISSION",
            status: "SUCCESS",
          },
          {
            id: "act-2",
            title: "Lecture Attended: Data Structures",
            subtitle: "CS-501 · Lab 204",
            time: "Today 09:00 AM",
            type: "ATTENDANCE",
            status: "SUCCESS",
          },
        ]}
        recentLeaves={student.leaveApplications.map((l) => ({
          ...l,
          fromDate: l.fromDate.toISOString(),
          toDate: l.toDate.toISOString(),
          createdAt: l.createdAt.toISOString(),
          updatedAt: l.updatedAt.toISOString(),
        }))}
        recentFees={student.feeInvoices.map((f) => ({
          ...f,
          dueDate: f.dueDate.toISOString(),
          createdAt: f.createdAt.toISOString(),
        }))}
        isRealAccount={false}
      />
    );
  }

  if (role === "FACULTY") {
    const faculty = await prisma.faculty.findUnique({
      where: { id: profileId },
      include: { department: true },
    });
    if (!faculty) redirect("/login");

    const pendingLeaves = await prisma.leaveApplication.count({ where: { status: "PENDING" } });
    const pendingGatePasses = await prisma.gatePass.count({ where: { status: "PENDING" } });
    const pendingPermissions = await prisma.permissionRequest.count({ where: { status: "PENDING" } });
    const todayStudents = await prisma.student.count({ where: { departmentId: faculty.departmentId } });

    return (
      <FacultyDashboard
        faculty={{
          ...faculty,
          joiningDate: faculty.joiningDate?.toISOString() ?? null,
          createdAt: faculty.createdAt.toISOString(),
          updatedAt: faculty.updatedAt.toISOString(),
        }}
        stats={{ pendingLeaves, pendingGatePasses, pendingPermissions, totalStudents: todayStudents }}
      />
    );
  }

  // Admin
  const [totalStudents, totalFaculty, totalDepts, pendingApprovals] = await Promise.all([
    prisma.student.count(),
    prisma.faculty.count(),
    prisma.department.count(),
    prisma.leaveApplication.count({ where: { status: "PENDING" } }),
  ]);

  return (
    <AdminDashboard
      stats={{ totalStudents, totalFaculty, totalDepts, pendingApprovals }}
      userName={session.user.name ?? "Admin"}
    />
  );
}
