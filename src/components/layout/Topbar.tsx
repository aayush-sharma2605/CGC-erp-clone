"use client";

import { useState, useRef, useEffect } from "react";
import { Menu, Bell, Search, X, CheckCircle2, Clock, AlertCircle, ChevronDown, Sparkles } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface TopbarProps {
  onMenuToggle: () => void;
  user: { name?: string | null; role: string };
}

export function Topbar({ onMenuToggle, user }: TopbarProps) {
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);

  // Close notifications when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setNotificationsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const notifications = [
    {
      id: "n1",
      title: "Upcoming Assignment Deadline",
      message: "Statistical Computing Techniques - Assignment 2 due soon",
      time: "2 days left",
      icon: <Clock size={14} className="text-amber-400" />,
      type: "warning",
      href: "/dashboard/assignments",
    },
    {
      id: "n2",
      title: "Attendance Status Good",
      message: "Overall attendance is above the mandatory 75% threshold",
      time: "Updated today",
      icon: <CheckCircle2 size={14} className="text-emerald-400" />,
      type: "success",
      href: "/dashboard/attendance",
    },
    {
      id: "n3",
      title: "Today's Schedule Active",
      message: "View your classes, faculty details, and lecture rooms",
      time: "Today",
      icon: <Sparkles size={14} className="text-purple-400" />,
      type: "info",
      href: "/dashboard/timetable",
    },
  ];

  const firstName = user.name ? user.name.split(" ")[0] : "Student";
  const initial = user.name ? user.name.charAt(0).toUpperCase() : "S";

  return (
    <header className="sticky top-0 z-30 h-16 bg-[#0B0F1C]/80 backdrop-blur-xl border-b border-slate-800/70 flex items-center justify-between px-4 sm:px-6 lg:px-8 gap-4">
      {/* Left toggle & search */}
      <div className="flex items-center gap-3 flex-1 max-w-lg">
        <button
          onClick={onMenuToggle}
          className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors"
          aria-label="Toggle Navigation"
        >
          <Menu size={20} />
        </button>

        {/* Global Search Bar */}
        <div className="relative flex-1 hidden sm:block">
          <Search
            size={16}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
          />
          <input
            type="text"
            placeholder="Search courses, classes, assignments..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-900/60 border border-slate-800/80 rounded-xl pl-10 pr-12 py-2 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/30 transition-all"
          />
          <kbd className="absolute right-3 top-1/2 -translate-y-1/2 px-1.5 py-0.5 text-[10px] font-mono text-slate-400 bg-slate-800 rounded border border-slate-700/60 pointer-events-none">
            ⌘K
          </kbd>
        </div>
      </div>

      {/* Right actions: search mobile, notifications, profile */}
      <div className="flex items-center gap-2.5">
        {/* Mobile search toggle */}
        <button
          onClick={() => setSearchOpen(!searchOpen)}
          className="sm:hidden p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors"
        >
          <Search size={18} />
        </button>

        {/* Notifications Popover */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setNotificationsOpen(!notificationsOpen)}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors relative"
            aria-label="Notifications"
          >
            <Bell size={18} />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-purple-500 ring-4 ring-[#0B0F1C]" />
          </button>

          {notificationsOpen && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl p-4 z-50 animate-fade-in">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
                <div className="flex items-center gap-2">
                  <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                    Notifications
                  </h4>
                  <span className="text-[10px] px-1.5 py-0.5 rounded-full font-bold bg-purple-500/20 text-purple-300">
                    {notifications.length} New
                  </span>
                </div>
                <button
                  onClick={() => setNotificationsOpen(false)}
                  className="p-1 rounded text-slate-500 hover:text-slate-300"
                >
                  <X size={14} />
                </button>
              </div>

              <div className="space-y-2">
                {notifications.map((n) => (
                  <Link
                    key={n.id}
                    href={n.href}
                    onClick={() => setNotificationsOpen(false)}
                    className="flex items-start gap-3 p-2.5 rounded-xl bg-slate-800/40 hover:bg-slate-800/80 transition-colors border border-slate-800/50 block group"
                  >
                    <div className="p-1.5 rounded-lg bg-slate-800/90 flex-shrink-0 mt-0.5">
                      {n.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-slate-200 group-hover:text-purple-300 transition-colors truncate">
                        {n.title}
                      </p>
                      <p className="text-[11px] text-slate-400 line-clamp-2 mt-0.5 leading-snug">
                        {n.message}
                      </p>
                      <span className="text-[10px] font-mono text-slate-500 mt-1 block">
                        {n.time}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>

              <div className="pt-3 border-t border-slate-800/60 mt-3 text-center">
                <Link
                  href="/dashboard/notices"
                  onClick={() => setNotificationsOpen(false)}
                  className="text-xs font-medium text-purple-400 hover:text-purple-300 transition-colors"
                >
                  View All Campus Notices →
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Student Profile Pill */}
        <Link
          href="/dashboard/settings"
          className="flex items-center gap-2.5 pl-1.5 pr-3 py-1 rounded-full bg-slate-900/60 border border-slate-800/80 hover:border-slate-700 hover:bg-slate-800/60 transition-all group"
        >
          <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-purple-600 via-indigo-600 to-cyan-400 p-[1px] flex-shrink-0">
            <div className="w-full h-full rounded-full bg-[#0B0F1C] flex items-center justify-center text-xs font-bold text-purple-300">
              {initial}
            </div>
          </div>
          <div className="hidden sm:block text-left">
            <p className="text-xs font-bold text-slate-200 leading-tight group-hover:text-purple-300 transition-colors">
              {firstName}
            </p>
            <p className="text-[10px] text-slate-500 leading-tight">
              {user.role.charAt(0) + user.role.slice(1).toLowerCase()}
            </p>
          </div>
        </Link>
      </div>

      {/* Mobile search expanded bar */}
      {searchOpen && (
        <div className="sm:hidden absolute top-16 left-0 right-0 bg-[#0B0F1C] border-b border-slate-800 p-3 flex items-center gap-2 shadow-2xl">
          <input
            type="text"
            placeholder="Search coursework, timetable..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-purple-500"
            autoFocus
          />
          <button
            onClick={() => setSearchOpen(false)}
            className="p-2 rounded-lg text-slate-400 hover:text-slate-200"
          >
            <X size={16} />
          </button>
        </div>
      )}
    </header>
  );
}
