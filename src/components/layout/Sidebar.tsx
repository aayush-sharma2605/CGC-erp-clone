"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { cn } from "@/lib/utils";
import {
  GraduationCap,
  LayoutDashboard,
  ClipboardCheck,
  CreditCard,
  BookOpen,
  Calendar,
  Bell,
  LogOut,
  BarChart3,
  DoorOpen,
  Settings,
  X,
  FileCheck,
  Users,
  Briefcase,
} from "lucide-react";

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
  badge?: string;
  roles?: string[];
}

interface NavGroup {
  title: string;
  items: NavItem[];
}

function getNavGroups(role: string): NavGroup[] {
  if (role === "STUDENT") {
    return [
      {
        title: "Overview",
        items: [
          { label: "Dashboard", href: "/dashboard", icon: <LayoutDashboard size={18} /> },
        ],
      },
      {
        title: "Academics",
        items: [
          { label: "Academics", href: "/dashboard/courses", icon: <BookOpen size={18} /> },
          { label: "Attendance", href: "/dashboard/attendance", icon: <ClipboardCheck size={18} /> },
          { label: "Assignments", href: "/dashboard/assignments", icon: <FileCheck size={18} /> },
          { label: "Timetable", href: "/dashboard/timetable", icon: <Calendar size={18} /> },
          { label: "Results", href: "/dashboard/results", icon: <BarChart3 size={18} /> },
        ],
      },
      {
        title: "Finance & Requests",
        items: [
          { label: "Fees", href: "/dashboard/fees", icon: <CreditCard size={18} /> },
          { label: "Leave & Gate Pass", href: "/dashboard/leave", icon: <DoorOpen size={18} /> },
        ],
      },
      {
        title: "Communication",
        items: [
          { label: "Notices", href: "/dashboard/notices", icon: <Bell size={18} /> },
          { label: "Settings", href: "/dashboard/settings", icon: <Settings size={18} /> },
        ],
      },
    ];
  }

  // Non-student roles fallback
  return [
    {
      title: "Overview",
      items: [
        { label: "Dashboard", href: "/dashboard", icon: <LayoutDashboard size={18} /> },
      ],
    },
    {
      title: "Academics",
      items: [
        { label: "Attendance", href: "/dashboard/attendance", icon: <ClipboardCheck size={18} /> },
        { label: "Timetable", href: "/dashboard/timetable", icon: <Calendar size={18} /> },
      ],
    },
    {
      title: "Administration",
      items: [
        { label: "Students", href: "/dashboard/admin/students", icon: <Users size={18} />, roles: ["ADMIN"] },
        { label: "Faculty", href: "/dashboard/admin/faculty", icon: <Briefcase size={18} />, roles: ["ADMIN"] },
        { label: "Settings", href: "/dashboard/settings", icon: <Settings size={18} /> },
      ],
    },
  ];
}

interface SidebarProps {
  user: { name?: string | null; email?: string | null; role: string };
  isDesktopOpen: boolean;
  isMobileOpen: boolean;
  onMobileClose: () => void;
}

export function Sidebar({ user, isDesktopOpen, isMobileOpen, onMobileClose }: SidebarProps) {
  const pathname = usePathname();
  const navGroups = getNavGroups(user.role);
  const initials = user.name
    ? user.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()
    : "ST";

  const handleLinkClick = () => {
    // Only close drawer on mobile viewports
    if (typeof window !== "undefined" && window.innerWidth < 1024) {
      onMobileClose();
    }
  };

  return (
    <>
      {/* Mobile Backdrop Overlay - only displayed when mobile drawer is open */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm lg:hidden transition-opacity duration-300"
          onClick={onMobileClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar Aside */}
      <aside
        className={cn(
          "fixed top-0 left-0 bottom-0 z-50 w-64 bg-[#0B0F1C] border-r border-slate-800/70 flex flex-col transition-transform duration-300 ease-in-out shadow-2xl lg:shadow-none",
          // Mobile translation:
          isMobileOpen ? "translate-x-0" : "-translate-x-full",
          // Desktop translation:
          isDesktopOpen ? "lg:translate-x-0" : "lg:-translate-x-full"
        )}
      >
        {/* Brand Header */}
        <div className="h-16 flex items-center justify-between px-5 border-b border-slate-800/60 bg-[#0B0F1C]/90 flex-shrink-0">
          <Link href="/dashboard" className="flex items-center gap-3 group" onClick={handleLinkClick}>
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-cyan-400 p-[1px] shadow-lg shadow-purple-500/20 group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-[#0D1224] rounded-[11px] flex items-center justify-center">
                <GraduationCap size={20} className="text-purple-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-sm tracking-tight text-white group-hover:text-purple-300 transition-colors">
                  Campus<span className="text-purple-400">ERP</span>
                </span>
                <span className="text-[10px] px-1.5 py-0.2 rounded-full font-semibold bg-purple-500/15 text-purple-300 border border-purple-500/20">
                  LMS
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium">Student Portal</p>
            </div>
          </Link>
          <button
            onClick={onMobileClose}
            className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/50 transition-colors"
            aria-label="Close navigation drawer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Navigation Groups */}
        <nav className="flex-1 px-3 py-4 space-y-4 overflow-y-auto">
          {navGroups.map((group) => (
            <div key={group.title} className="space-y-1">
              <p className="px-3 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                {group.title}
              </p>
              <div className="space-y-1">
                {group.items.map((item) => {
                  const isActive =
                    item.href === "/dashboard"
                      ? pathname === "/dashboard"
                      : pathname.startsWith(item.href);

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={handleLinkClick}
                      className={cn(
                        "flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-all duration-200 group relative",
                        isActive
                          ? "bg-gradient-to-r from-purple-500/15 to-indigo-500/5 text-purple-300 font-semibold shadow-sm border border-purple-500/20"
                          : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/40"
                      )}
                    >
                      {isActive && (
                        <div className="absolute left-0 top-2 bottom-2 w-1 bg-gradient-to-b from-purple-400 to-indigo-500 rounded-r-full" />
                      )}
                      <span
                        className={cn(
                          "transition-transform duration-200 group-hover:scale-110",
                          isActive ? "text-purple-400" : "text-slate-500 group-hover:text-slate-300"
                        )}
                      >
                        {item.icon}
                      </span>
                      <span className="flex-1 truncate">{item.label}</span>
                      {item.badge && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded-full font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* User Profile Footer */}
        <div className="p-3 border-t border-slate-800/70 bg-[#090D18]/90 flex-shrink-0">
          <div className="flex items-center gap-3 p-2 rounded-xl bg-slate-900/60 border border-slate-800/60 hover:border-slate-700/80 transition-colors">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-500 flex items-center justify-center text-xs font-bold text-white shadow-sm flex-shrink-0">
              {initials}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-slate-200 truncate">
                {user.name || "Student User"}
              </p>
              <p className="text-[11px] text-slate-500 truncate">
                {user.email || "student@cgclerp.in"}
              </p>
            </div>
            <button
              onClick={() => signOut({ callbackUrl: "/login" })}
              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
              title="Sign out"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
