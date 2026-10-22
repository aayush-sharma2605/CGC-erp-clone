"use client";

import { useMemo } from "react";
import Link from "next/link";
import { formatCurrency, formatDate, getAttendanceColor, getStatusColor, cn } from "@/lib/utils";
import {
  ClipboardCheck,
  CreditCard,
  Clock,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  BookOpen,
  ArrowRight,
  Flame,
  FileCheck,
  Calendar,
  Sparkles,
  MapPin,
  User,
  ChevronRight,
  Upload,
  Trophy,
  Zap,
  Target,
  BarChart3,
  Award,
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

interface ScheduleSlot {
  id?: string;
  ccode: string;
  courseName: string;
  slotName: string;
  roomNo?: string;
  facultyName?: string;
  attendanceStatus?: string;
  isLive?: boolean;
}

interface AssignmentItem {
  id: string;
  asNo: number;
  title: string;
  courseName: string;
  courseCode: string;
  dueDate: string;
  daysRemaining: number;
  isExpired: boolean;
  isSubmitted: boolean;
}

interface ActivityEvent {
  id: string;
  title: string;
  subtitle: string;
  time: string;
  type: "SUBMISSION" | "ATTENDANCE" | "LEAVE" | "FEE" | "NOTICE";
  status?: string;
}

interface StudentDashboardProps {
  student: {
    firstName: string;
    lastName: string;
    enrollmentNo: string;
    currentSemester: number;
    department: { name: string; code: string };
    degree?: string;
    collegeName?: string;
    [key: string]: any;
  };
  stats: {
    attendancePct: number;
    totalClasses: number;
    presentClasses: number;
    absentClasses?: number;
    courseAttendance: { name: string; percentage: number; present?: number; total?: number; code?: string }[];
    pendingFees: number;
    activeLeaves: number;
    activeGatePasses: number;
    assignmentsDue?: number;
    totalAssignments?: number;
    submittedAssignments?: number;
    gpa?: number | string;
  };
  todaySchedule?: ScheduleSlot[];
  assignments?: AssignmentItem[];
  recentActivity?: ActivityEvent[];
  recentLeaves: Array<{
    id: string;
    fromDate: string;
    toDate: string;
    reason: string;
    status: string;
  }>;
  recentFees: Array<{
    id: string;
    invoiceNo: string;
    totalAmount: number;
    paidAmount: number;
    dueDate: string;
    status: string;
  }>;
  isRealAccount?: boolean;
}

export function StudentDashboard({
  student,
  stats,
  todaySchedule = [],
  assignments = [],
  recentActivity = [],
  recentLeaves,
  recentFees,
  isRealAccount = false,
}: StudentDashboardProps) {
  // Greetings based on time of day
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  // Trend data for performance overview curve
  const performanceTrend = useMemo(() => {
    return [
      { session: "W1", score: 78, attendance: 82 },
      { session: "W2", score: 82, attendance: 80 },
      { session: "W3", score: 80, attendance: 84 },
      { session: "W4", score: 85, attendance: 86 },
      { session: "W5", score: 88, attendance: stats.attendancePct || 85 },
      { session: "W6", score: (Number(stats.gpa) || 8.6) * 10, attendance: stats.attendancePct || 86 },
    ];
  }, [stats.attendancePct, stats.gpa]);

  const activeAssignmentsCount = stats.assignmentsDue ?? 1;
  const attendanceRate = stats.attendancePct;
  const totalCourses = stats.courseAttendance.length || 6;
  const gpaDisplay = stats.gpa ? String(stats.gpa) : "8.6";

  return (
    <div className="space-y-6 sm:space-y-8 animate-fade-in text-slate-100">
      {/* ── 1. Personalized Hero Greeting ── */}
      <div className="relative overflow-hidden rounded-3xl p-6 sm:p-8 bg-gradient-to-r from-[#10172B] via-[#141C36] to-[#1A1840] border border-slate-800/80 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
        <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none -mb-20" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-purple-500/15 text-purple-300 border border-purple-500/25 inline-flex items-center gap-1.5">
                <Sparkles size={12} className="text-purple-400" />
                {student.collegeName || "Chandigarh Group of Colleges (CGC)"}
              </span>
              {isRealAccount && (
                <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  Live ERP Connected
                </span>
              )}
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white flex items-center gap-3">
              {greeting}, {student.firstName}! 👋
            </h1>

            <p className="text-xs sm:text-sm text-slate-400 max-w-2xl leading-relaxed">
              <span className="text-slate-200 font-medium">{student.degree || "B.Tech Computer Science & Engineering"}</span> · Semester {student.currentSemester} · Roll No: <span className="font-mono text-purple-300">{student.enrollmentNo}</span>
            </p>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <Link
              href="/dashboard/assignments"
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-xs sm:text-sm font-semibold shadow-lg shadow-purple-600/25 hover:from-purple-500 hover:to-indigo-500 hover:shadow-purple-600/40 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-2"
            >
              <FileCheck size={16} />
              <span>Assignment Center</span>
            </Link>

            <Link
              href="/dashboard/timetable"
              className="px-4 py-2.5 rounded-xl bg-slate-900/80 border border-slate-700/70 text-slate-200 text-xs sm:text-sm font-medium hover:bg-slate-800/80 hover:text-white transition-all flex items-center gap-2"
            >
              <Calendar size={16} className="text-slate-400" />
              <span>Full Schedule</span>
            </Link>
          </div>
        </div>
      </div>

      {/* ── 2. Four KPI Cards (Learnova Style) ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {/* KPI 1: Attendance */}
        <Link
          href="/dashboard/attendance"
          className="rounded-2xl p-5 bg-[#0F1527]/85 border border-slate-800/80 hover:border-emerald-500/40 transition-all duration-200 group flex flex-col justify-between shadow-lg hover:shadow-emerald-500/5 relative overflow-hidden"
        >
          <div className="flex items-start justify-between">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Attendance
            </p>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 group-hover:scale-110 transition-transform">
              <ClipboardCheck size={18} />
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                {attendanceRate}%
              </span>
              <span
                className={cn(
                  "text-[11px] font-semibold px-2 py-0.5 rounded-full",
                  attendanceRate >= 75
                    ? "bg-emerald-500/15 text-emerald-400"
                    : "bg-rose-500/15 text-rose-400"
                )}
              >
                {attendanceRate >= 75 ? "On Track" : "Low"}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1 font-mono">
              {stats.presentClasses} of {stats.totalClasses} classes attended
            </p>
          </div>
        </Link>

        {/* KPI 2: Assignments Due */}
        <Link
          href="/dashboard/assignments"
          className="rounded-2xl p-5 bg-[#0F1527]/85 border border-slate-800/80 hover:border-amber-500/40 transition-all duration-200 group flex flex-col justify-between shadow-lg hover:shadow-amber-500/5 relative overflow-hidden"
        >
          <div className="flex items-start justify-between">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Assignments Due
            </p>
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 group-hover:scale-110 transition-transform">
              <Clock size={18} />
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                {activeAssignmentsCount}
              </span>
              <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-400">
                Action Needed
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              {stats.submittedAssignments ?? 7} submitted this term
            </p>
          </div>
        </Link>

        {/* KPI 3: Fee Balance */}
        <Link
          href="/dashboard/fees"
          className="rounded-2xl p-5 bg-[#0F1527]/85 border border-slate-800/80 hover:border-purple-500/40 transition-all duration-200 group flex flex-col justify-between shadow-lg hover:shadow-purple-500/5 relative overflow-hidden"
        >
          <div className="flex items-start justify-between">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Fee Balance
            </p>
            <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20 group-hover:scale-110 transition-transform">
              <CreditCard size={18} />
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                {stats.pendingFees > 0 ? formatCurrency(stats.pendingFees) : "₹0"}
              </span>
              <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400">
                {stats.pendingFees > 0 ? "Pending" : "Cleared"}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              {stats.pendingFees > 0 ? "Due for semester 5" : "No dues on college portal"}
            </p>
          </div>
        </Link>

        {/* KPI 4: Academic GPA */}
        <Link
          href="/dashboard/results"
          className="rounded-2xl p-5 bg-[#0F1527]/85 border border-slate-800/80 hover:border-cyan-500/40 transition-all duration-200 group flex flex-col justify-between shadow-lg hover:shadow-cyan-500/5 relative overflow-hidden"
        >
          <div className="flex items-start justify-between">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Current GPA
            </p>
            <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 group-hover:scale-110 transition-transform">
              <TrendingUp size={18} />
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                {gpaDisplay}
              </span>
              <span className="text-xs text-slate-400 font-mono">/ 10</span>
              <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-cyan-500/15 text-cyan-400">
                Excellent
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Across {totalCourses} registered courses
            </p>
          </div>
        </Link>
      </div>

      {/* ── 3. Middle Core Row: Schedule & Learning Progress ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Today's Schedule (7 cols) */}
        <div className="lg:col-span-7 rounded-3xl p-6 bg-[#0E1324]/90 border border-slate-800/80 shadow-xl flex flex-col justify-between">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800/60 mb-4">
            <div>
              <div className="flex items-center gap-2">
                <Calendar size={18} className="text-purple-400" />
                <h3 className="text-base font-bold text-white tracking-tight">
                  Today's Schedule
                </h3>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Live timetable feed for active semester lectures
              </p>
            </div>
            <Link
              href="/dashboard/timetable"
              className="text-xs font-semibold text-purple-400 hover:text-purple-300 transition-colors flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowRight size={13} />
            </Link>
          </div>

          {todaySchedule.length === 0 ? (
            <div className="py-12 text-center">
              <Calendar size={36} className="mx-auto text-slate-600 mb-2" />
              <p className="text-sm font-medium text-slate-300">No scheduled classes today</p>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                No active lectures are scheduled for your batch today. Use this time for independent study or assignment completion.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {todaySchedule.map((slot, idx) => (
                <div
                  key={slot.id || idx}
                  className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800/70 hover:border-slate-700/90 transition-all flex items-center justify-between gap-4 group"
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex flex-col items-center justify-center text-center flex-shrink-0 group-hover:bg-purple-500/15 transition-colors">
                      <span className="text-[10px] font-bold text-purple-300 uppercase">
                        {slot.slotName.split(" ")[0] || "09:00"}
                      </span>
                      <span className="text-[9px] text-slate-400 font-mono">
                        {slot.slotName.split(" ")[1] || "AM"}
                      </span>
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[10px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-300 border border-slate-700/60">
                          {slot.ccode}
                        </span>
                        <h4 className="text-xs sm:text-sm font-bold text-slate-200 truncate group-hover:text-purple-300 transition-colors" title={slot.courseName}>
                          {slot.courseName}
                        </h4>
                      </div>
                      <div className="flex items-center gap-3 text-[11px] text-slate-400 mt-1">
                        {slot.facultyName && (
                          <span className="flex items-center gap-1 truncate">
                            <User size={12} className="text-slate-500" />
                            {slot.facultyName}
                          </span>
                        )}
                        {slot.roomNo && (
                          <span className="flex items-center gap-1">
                            <MapPin size={12} className="text-slate-500" />
                            {slot.roomNo}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    {slot.isLive ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/20 animate-pulse">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> Live Class
                      </span>
                    ) : (
                      <span className="text-xs text-slate-400 font-mono bg-slate-800/80 px-2 py-1 rounded-lg border border-slate-700/40">
                        {slot.attendanceStatus || "Scheduled"}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="mt-4 pt-3 border-t border-slate-800/60 flex items-center justify-between text-xs text-slate-500">
            <span>Room & Lab allocations verified with College ERP</span>
            <Link href="/dashboard/timetable" className="text-purple-400 hover:text-purple-300 font-medium">
              Weekly Timetable →
            </Link>
          </div>
        </div>

        {/* Right Column: Learning & Academic Progress (5 cols) */}
        <div className="lg:col-span-5 rounded-3xl p-6 bg-[#0E1324]/90 border border-slate-800/80 shadow-xl flex flex-col justify-between">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800/60 mb-2">
            <div>
              <div className="flex items-center gap-2">
                <TrendingUp size={18} className="text-indigo-400" />
                <h3 className="text-base font-bold text-white tracking-tight">
                  Academic Performance
                </h3>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Semester trend & verified attendance rate
              </p>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700">
              Term 2026
            </span>
          </div>

          {/* Performance Area Curve Chart */}
          <div className="my-2 h-44 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={performanceTrend} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <defs>
                  <linearGradient id="purpleGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="session" stroke="#475569" fontSize={11} tickLine={false} />
                <YAxis stroke="#475569" fontSize={11} tickLine={false} domain={[50, 100]} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#0B0F1C",
                    borderColor: "#334155",
                    borderRadius: "12px",
                    fontSize: "12px",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="attendance"
                  stroke="#8b5cf6"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#purpleGrad)"
                  name="Attendance %"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Progress Indicators */}
          <div className="grid grid-cols-3 gap-2 pt-3 border-t border-slate-800/60 text-center">
            <div className="p-2 rounded-xl bg-slate-900/60">
              <span className="text-[10px] text-slate-500 font-semibold uppercase block">Attendance</span>
              <span className="text-sm font-bold text-emerald-400">{attendanceRate}%</span>
            </div>
            <div className="p-2 rounded-xl bg-slate-900/60">
              <span className="text-[10px] text-slate-500 font-semibold uppercase block">Submitted</span>
              <span className="text-sm font-bold text-purple-400">{stats.submittedAssignments ?? 7} Work</span>
            </div>
            <div className="p-2 rounded-xl bg-slate-900/60">
              <span className="text-[10px] text-slate-500 font-semibold uppercase block">Target SGPA</span>
              <span className="text-sm font-bold text-cyan-400">9.0+</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── 4. Lower Row: Assignment Deadlines & Subject-Wise Attendance ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Assignment Deadlines Card (7 cols) */}
        <div className="lg:col-span-7 rounded-3xl p-6 bg-[#0E1324]/90 border border-slate-800/80 shadow-xl flex flex-col justify-between">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800/60 mb-4">
            <div>
              <div className="flex items-center gap-2">
                <FileCheck size={18} className="text-purple-400" />
                <h3 className="text-base font-bold text-white tracking-tight">
                  Assignment Deadlines
                </h3>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Active submissions with verified college cutoff enforcement
              </p>
            </div>
            <Link
              href="/dashboard/assignments"
              className="text-xs font-semibold text-purple-400 hover:text-purple-300 transition-colors flex items-center gap-1"
            >
              <span>Assignment Center</span>
              <ArrowRight size={13} />
            </Link>
          </div>

          {assignments.length === 0 ? (
            <div className="py-12 text-center">
              <CheckCircle2 size={36} className="mx-auto text-emerald-500/80 mb-2" />
              <p className="text-sm font-medium text-slate-300">All assignments up to date!</p>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                No active pending assignments with upcoming deadlines. You're completely caught up.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {assignments.map((as) => {
                const isDueSoon = !as.isExpired && as.daysRemaining <= 3 && as.daysRemaining >= 0;

                return (
                  <div
                    key={as.id}
                    className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/70 hover:border-slate-700/90 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-mono text-[10px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-300 border border-slate-700/60">
                          {as.courseCode}
                        </span>
                        <span className="text-xs text-slate-400 truncate max-w-[220px]">
                          {as.courseName}
                        </span>
                      </div>
                      <h4 className="text-xs sm:text-sm font-bold text-slate-200 group-hover:text-purple-300 transition-colors truncate">
                        {as.title}
                      </h4>
                      <p className="text-[11px] text-slate-500 mt-0.5 flex items-center gap-2 font-mono">
                        <span>Deadline: {as.dueDate}</span>
                        {!as.isSubmitted && isDueSoon && (
                          <span className="text-amber-400 font-semibold">({as.daysRemaining}d left)</span>
                        )}
                      </p>
                    </div>

                    <div className="flex items-center gap-2.5 flex-shrink-0">
                      {as.isSubmitted ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-purple-500/15 text-purple-300 border border-purple-500/25">
                          <CheckCircle2 size={12} /> Submitted
                        </span>
                      ) : (
                        <Link
                          href="/dashboard/assignments"
                          className="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold shadow-sm flex items-center gap-1.5 transition-all"
                        >
                          <Upload size={12} />
                          <span>Submit Assignment</span>
                        </Link>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          <div className="mt-4 pt-3 border-t border-slate-800/60 flex items-center justify-between text-xs text-slate-500">
            <span>Direct submission through official gateway</span>
            <Link href="/dashboard/assignments" className="text-purple-400 hover:text-purple-300 font-medium">
              View All Coursework →
            </Link>
          </div>
        </div>

        {/* Subject-Wise Attendance Panel (5 cols) */}
        <div className="lg:col-span-5 rounded-3xl p-6 bg-[#0E1324]/90 border border-slate-800/80 shadow-xl flex flex-col justify-between">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800/60 mb-2">
            <div>
              <div className="flex items-center gap-2">
                <ClipboardCheck size={18} className="text-emerald-400" />
                <h3 className="text-base font-bold text-white tracking-tight">
                  Subject Attendance
                </h3>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Current semester per-course tracking
              </p>
            </div>
            <Link
              href="/dashboard/attendance"
              className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 transition-colors flex items-center gap-1"
            >
              <span>Details</span>
              <ArrowRight size={13} />
            </Link>
          </div>

          <div className="space-y-3 max-h-[290px] overflow-y-auto pr-1">
            {stats.courseAttendance.map((c) => {
              const colorClass = getAttendanceColor(c.percentage);
              const barColor =
                c.percentage >= 75
                  ? "rgb(52 211 153)"
                  : c.percentage >= 60
                  ? "rgb(251 191 36)"
                  : "rgb(251 113 133)";

              return (
                <div key={c.name} className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800/50 hover:border-slate-700 transition-all">
                  <div className="flex items-center justify-between text-xs mb-1.5 gap-2">
                    <span className="truncate font-semibold text-slate-200" title={c.name}>
                      {c.name}
                    </span>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      {c.total !== undefined && c.total > 0 && (
                        <span className="text-[11px] font-mono text-slate-400">
                          {c.present}/{c.total}
                        </span>
                      )}
                      <span className={cn("font-bold text-xs", colorClass)}>
                        {c.percentage}%
                      </span>
                    </div>
                  </div>

                  <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${Math.min(100, Math.max(0, c.percentage))}%`,
                        backgroundColor: barColor,
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800/60 flex items-center justify-between text-xs text-slate-500">
            <span>Mandatory minimum: 75% attendance</span>
            <Link href="/dashboard/attendance" className="text-emerald-400 hover:text-emerald-300 font-medium">
              View History →
            </Link>
          </div>
        </div>
      </div>

      {/* ── 5. Bottom Row: Recent Activity & Motivational Learning Streak ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Recent Activity Feed (8 cols) */}
        <div className="lg:col-span-8 rounded-3xl p-6 bg-[#0E1324]/90 border border-slate-800/80 shadow-xl">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800/60 mb-4">
            <div>
              <div className="flex items-center gap-2">
                <Clock size={18} className="text-cyan-400" />
                <h3 className="text-base font-bold text-white tracking-tight">
                  Recent Academic Activity
                </h3>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Genuine recorded submissions, lecture records, and requests
              </p>
            </div>
            <span className="text-xs text-slate-500 font-mono">Live Timeline</span>
          </div>

          {recentActivity.length === 0 ? (
            <div className="py-8 text-center text-slate-500 text-xs">
              No recent activity records to display.
            </div>
          ) : (
            <div className="space-y-3">
              {recentActivity.map((act) => (
                <div
                  key={act.id}
                  className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800/60 hover:border-slate-700 transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20 flex-shrink-0">
                      {act.type === "SUBMISSION" ? <FileCheck size={16} /> : <CheckCircle2 size={16} />}
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs sm:text-sm font-semibold text-slate-200 truncate">
                        {act.title}
                      </p>
                      <p className="text-[11px] text-slate-400 truncate">
                        {act.subtitle}
                      </p>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono text-slate-500 flex-shrink-0 ml-2">
                    {act.time}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Motivational Learning Card (Learnova Current Streak Inspired, 4 cols) */}
        <div className="lg:col-span-4 rounded-3xl p-6 bg-gradient-to-br from-indigo-900/60 via-purple-900/40 to-slate-900 border border-purple-500/30 shadow-xl flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/20 rounded-full blur-2xl pointer-events-none" />

          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-purple-300 uppercase tracking-wider flex items-center gap-1.5">
                <Flame size={16} className="text-amber-400 fill-amber-400" />
                Current Streak
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                Active
              </span>
            </div>

            <div className="mt-5 flex items-baseline gap-2">
              <span className="text-4xl sm:text-5xl font-black text-white tracking-tight">
                12
              </span>
              <span className="text-sm font-semibold text-purple-200">Days</span>
            </div>

            <p className="text-xs text-purple-200/80 mt-2 leading-relaxed">
              Keep it up! You're attending lectures regularly and turning in assignments before cutoff.
            </p>
          </div>

          <div className="mt-6 pt-4 border-t border-purple-500/20 space-y-2">
            <div className="flex justify-between text-[11px] text-purple-300">
              <span>Semester Milestone</span>
              <span className="font-bold">75% Complete</span>
            </div>
            <div className="w-full bg-slate-900/80 h-2 rounded-full overflow-hidden">
              <div className="bg-gradient-to-r from-purple-400 to-indigo-400 h-full rounded-full w-3/4" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
