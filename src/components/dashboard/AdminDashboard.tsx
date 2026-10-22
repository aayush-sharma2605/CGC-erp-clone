"use client";

import { Users, Briefcase, Building2, Clock, BarChart3, ArrowRight, TrendingUp } from "lucide-react";
import Link from "next/link";

interface AdminDashboardProps {
  stats: {
    totalStudents: number;
    totalFaculty: number;
    totalDepts: number;
    pendingApprovals: number;
  };
  userName: string;
}

export function AdminDashboard({ stats, userName }: AdminDashboardProps) {
  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="page-title">Welcome back, {userName} 👋</h1>
        <p className="page-subtitle">Administrator Dashboard — manage your institution</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Students", value: stats.totalStudents, icon: <Users size={20} />, color: "rgb(139 92 246)", href: "/dashboard/admin/students" },
          { label: "Total Faculty", value: stats.totalFaculty, icon: <Briefcase size={20} />, color: "rgb(34 211 238)", href: "/dashboard/admin/faculty" },
          { label: "Departments", value: stats.totalDepts, icon: <Building2 size={20} />, color: "rgb(52 211 153)", href: "#" },
          { label: "Pending Approvals", value: stats.pendingApprovals, icon: <Clock size={20} />, color: "rgb(251 191 36)", href: "/dashboard/leave" },
        ].map((s) => (
          <Link key={s.label} href={s.href} className="stat-card group">
            <div className="stat-icon" style={{ background: `${s.color}20`, color: s.color }}>{s.icon}</div>
            <div>
              <p className="text-xs font-medium mb-0.5" style={{ color: "rgb(100 116 139)" }}>{s.label}</p>
              <p className="text-2xl font-bold" style={{ color: "rgb(248 250 252)" }}>{s.value}</p>
            </div>
          </Link>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="section-title">Administration</h3>
          <div className="space-y-2">
            {[
              { label: "Manage Students", href: "/dashboard/admin/students", icon: <Users size={18} />, color: "rgb(139 92 246)" },
              { label: "Manage Faculty", href: "/dashboard/admin/faculty", icon: <Briefcase size={18} />, color: "rgb(34 211 238)" },
              { label: "Purchase Orders", href: "/dashboard/admin/po", icon: <BarChart3 size={18} />, color: "rgb(251 191 36)" },
              { label: "Create Notice", href: "/dashboard/admin/notice", icon: <TrendingUp size={18} />, color: "rgb(52 211 153)" },
            ].map((a) => (
              <Link
                key={a.label}
                href={a.href}
                className="flex items-center gap-3 p-3 rounded-xl"
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
        <div className="card flex flex-col items-center justify-center gap-4 text-center py-12">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center" style={{ background: "rgb(139 92 246 / 0.12)", color: "rgb(139 92 246)" }}>
            <Building2 size={32} />
          </div>
          <div>
            <p className="text-lg font-bold" style={{ color: "rgb(248 250 252)" }}>Institution Overview</p>
            <p className="text-sm mt-1" style={{ color: "rgb(100 116 139)" }}>
              {stats.totalStudents} students across {stats.totalDepts} departments
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
