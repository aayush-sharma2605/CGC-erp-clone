"use client";

import { Clock, DoorOpen, UserCheck, Users, ArrowRight, CheckCircle2, BookOpen } from "lucide-react";
import Link from "next/link";

interface FacultyDashboardProps {
  faculty: {
    firstName: string;
    lastName: string;
    employeeId: string;
    designation?: string | null;
    department: { name: string };
    [key: string]: any;
  };
  stats: {
    pendingLeaves: number;
    pendingGatePasses: number;
    pendingPermissions: number;
    totalStudents: number;
  };
}

export function FacultyDashboard({ faculty, stats }: FacultyDashboardProps) {
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  const pendingTotal = stats.pendingLeaves + stats.pendingGatePasses + stats.pendingPermissions;

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="page-title">{greeting}, {faculty.firstName}! 👋</h1>
        <p className="page-subtitle">
          {faculty.designation ?? "Faculty"} · {faculty.department.name} · {faculty.employeeId}
        </p>
      </div>

      {pendingTotal > 0 && (
        <div
          className="flex items-center gap-3 p-4 rounded-xl text-sm"
          style={{ background: "rgb(251 191 36 / 0.08)", border: "1px solid rgb(251 191 36 / 0.2)", color: "rgb(251 191 36)" }}
        >
          <CheckCircle2 size={18} />
          You have <strong>{pendingTotal} pending approvals</strong> awaiting your review.
        </div>
      )}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Students", value: stats.totalStudents, sub: "In your department", icon: <Users size={20} />, color: "rgb(139 92 246)", href: "/dashboard/admin/students" },
          { label: "Pending Leaves", value: stats.pendingLeaves, sub: "Awaiting approval", icon: <Clock size={20} />, color: "rgb(251 191 36)", href: "/dashboard/leave" },
          { label: "Gate Passes", value: stats.pendingGatePasses, sub: "Awaiting approval", icon: <DoorOpen size={20} />, color: "rgb(34 211 238)", href: "/dashboard/gate-pass" },
          { label: "Permissions", value: stats.pendingPermissions, sub: "Awaiting approval", icon: <UserCheck size={20} />, color: "rgb(52 211 153)", href: "/dashboard/permissions" },
        ].map((stat) => (
          <Link key={stat.label} href={stat.href} className="stat-card group">
            <div className="stat-icon" style={{ background: `${stat.color}20`, color: stat.color }}>
              {stat.icon}
            </div>
            <div>
              <p className="text-xs font-medium mb-0.5" style={{ color: "rgb(100 116 139)" }}>{stat.label}</p>
              <p className="text-2xl font-bold" style={{ color: "rgb(248 250 252)" }}>{stat.value}</p>
              <p className="text-xs" style={{ color: "rgb(100 116 139)" }}>{stat.sub}</p>
            </div>
          </Link>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="section-title">Quick Actions</h3>
          <div className="space-y-2">
            {[
              { label: "Mark Attendance", href: "/dashboard/attendance", icon: <CheckCircle2 size={18} />, color: "rgb(52 211 153)" },
              { label: "Approve Leave Requests", href: "/dashboard/leave", icon: <Clock size={18} />, color: "rgb(251 191 36)" },
              { label: "Approve Gate Passes", href: "/dashboard/gate-pass", icon: <DoorOpen size={18} />, color: "rgb(34 211 238)" },
              { label: "Enter Marks", href: "/dashboard/marks", icon: <BookOpen size={18} />, color: "rgb(139 92 246)" },
              { label: "Create Notice", href: "/dashboard/admin/notice", icon: <ArrowRight size={18} />, color: "rgb(251 113 133)" },
            ].map((a) => (
              <Link
                key={a.label}
                href={a.href}
                className="flex items-center gap-3 p-3 rounded-xl transition-all"
                style={{ background: "rgb(255 255 255 / 0.03)", border: "1px solid rgb(255 255 255 / 0.06)" }}
              >
                <span className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: `${a.color}15`, color: a.color }}>
                  {a.icon}
                </span>
                <span className="text-sm font-medium" style={{ color: "rgb(203 213 225)" }}>{a.label}</span>
                <ArrowRight size={14} className="ml-auto" style={{ color: "rgb(71 85 105)" }} />
              </Link>
            ))}
          </div>
        </div>

        <div className="card">
          <h3 className="section-title">Today&apos;s Overview</h3>
          <div className="space-y-4">
            <div className="p-4 rounded-xl" style={{ background: "rgb(139 92 246 / 0.08)", border: "1px solid rgb(139 92 246 / 0.15)" }}>
              <p className="text-sm font-medium mb-1" style={{ color: "rgb(139 92 246)" }}>Department</p>
              <p className="text-2xl font-bold" style={{ color: "rgb(248 250 252)" }}>{faculty.department.name}</p>
            </div>
            <p className="text-sm" style={{ color: "rgb(100 116 139)" }}>
              View timetable for today&apos;s schedule and class details.
            </p>
            <Link href="/dashboard/timetable" className="btn btn-secondary w-full">
              View Timetable
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
