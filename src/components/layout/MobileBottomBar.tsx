"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Calendar, FileCheck, ClipboardCheck, Menu } from "lucide-react";
import { cn } from "@/lib/utils";

interface MobileBottomBarProps {
  onMenuToggle: () => void;
}

export function MobileBottomBar({ onMenuToggle }: MobileBottomBarProps) {
  const pathname = usePathname();

  const navItems = [
    { label: "Home", href: "/dashboard", icon: <LayoutDashboard size={20} /> },
    { label: "Timetable", href: "/dashboard/timetable", icon: <Calendar size={20} /> },
    { label: "Assignments", href: "/dashboard/assignments", icon: <FileCheck size={20} /> },
    { label: "Attendance", href: "/dashboard/attendance", icon: <ClipboardCheck size={20} /> },
  ];

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-950/85 backdrop-blur-xl border-t border-slate-800/80 px-2 py-2 safe-bottom">
      <nav className="flex items-center justify-around max-w-md mx-auto">
        {navItems.map((item) => {
          const isActive =
            item.href === "/dashboard"
              ? pathname === "/dashboard"
              : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all duration-200 text-[11px] font-medium gap-1",
                isActive
                  ? "text-purple-400 font-semibold"
                  : "text-slate-400 hover:text-slate-200"
              )}
            >
              <div
                className={cn(
                  "p-1.5 rounded-xl transition-all",
                  isActive && "bg-purple-500/15 text-purple-400"
                )}
              >
                {item.icon}
              </div>
              <span className="leading-none">{item.label}</span>
            </Link>
          );
        })}

        <button
          onClick={onMenuToggle}
          className="flex flex-col items-center justify-center py-1 px-3 rounded-xl text-slate-400 hover:text-slate-200 transition-all duration-200 text-[11px] font-medium gap-1"
        >
          <div className="p-1.5 rounded-xl">
            <Menu size={20} />
          </div>
          <span className="leading-none">More</span>
        </button>
      </nav>
    </div>
  );
}
