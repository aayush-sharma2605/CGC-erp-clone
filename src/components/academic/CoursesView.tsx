"use client";

import { useState } from "react";
import { BookOpen, Award, Layers, Search, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface Course {
  id: string;
  name: string;
  code: string;
  credits: number;
  semester: number;
  isElective: boolean;
  department: { name: string; code: string };
}

interface CoursesViewProps {
  courses: Course[];
  enrolledCourseIds: string[];
  role: string;
}

export function CoursesView({ courses, enrolledCourseIds, role }: CoursesViewProps) {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"ALL" | "ENROLLED" | "CORE" | "ELECTIVE">("ALL");

  const filtered = courses.filter((c) => {
    const isEnrolled = enrolledCourseIds.includes(c.id);
    const matchesSearch =
      !search ||
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.code.toLowerCase().includes(search.toLowerCase());

    if (!matchesSearch) return false;
    if (filter === "ENROLLED") return isEnrolled;
    if (filter === "CORE") return !c.isElective;
    if (filter === "ELECTIVE") return c.isElective;
    return true;
  });

  const totalCredits = courses
    .filter((c) => enrolledCourseIds.includes(c.id))
    .reduce((sum, c) => sum + c.credits, 0);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="page-header flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="page-title">Course Registration & Curriculum</h1>
          <p className="page-subtitle">Enrolled courses, syllabus structure, and academic credits</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="card py-2 px-3 flex items-center gap-2">
            <Award size={16} className="text-violet-400" />
            <span className="text-xs text-slate-400">Total Enrolled Credits:</span>
            <span className="text-sm font-bold text-violet-300">{totalCredits}</span>
          </div>
        </div>
      </div>

      {/* Filters and search */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search course name or code..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input pl-9 text-sm w-full"
          />
        </div>

        <div className="flex items-center gap-1.5 self-start sm:self-auto bg-slate-900/60 p-1 rounded-xl border border-white/5">
          {(["ALL", "ENROLLED", "CORE", "ELECTIVE"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={cn(
                "px-3 py-1.5 rounded-lg text-xs font-medium transition-colors",
                filter === tab
                  ? "bg-violet-600 text-white font-semibold shadow"
                  : "text-slate-400 hover:text-slate-200"
              )}
            >
              {tab.charAt(0) + tab.slice(1).toLowerCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Course grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((course) => {
          const isEnrolled = enrolledCourseIds.includes(course.id);
          return (
            <div
              key={course.id}
              className={cn(
                "card p-5 relative overflow-hidden flex flex-col justify-between group transition-all hover:border-violet-500/40 hover:-translate-y-0.5",
                isEnrolled && "border-violet-500/30 bg-gradient-to-br from-violet-950/10 to-slate-900/40"
              )}
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="font-mono text-xs px-2 py-0.5 rounded bg-violet-500/10 text-violet-400 font-semibold border border-violet-500/20">
                    {course.code}
                  </span>
                  <div className="flex items-center gap-2">
                    <span
                      className={cn(
                        "text-[11px] font-semibold px-2 py-0.5 rounded-full",
                        course.isElective
                          ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                          : "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                      )}
                    >
                      {course.isElective ? "Elective" : "Core"}
                    </span>
                    {isEnrolled && (
                      <span className="flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        <CheckCircle2 size={12} />
                        Enrolled
                      </span>
                    )}
                  </div>
                </div>

                <h3 className="font-bold text-slate-100 text-base mb-1.5 group-hover:text-violet-300 transition-colors">
                  {course.name}
                </h3>
                <p className="text-xs text-slate-400 mb-4">{course.department.name}</p>
              </div>

              <div className="pt-3 border-t border-white/5 flex items-center justify-between text-xs text-slate-400">
                <div className="flex items-center gap-1.5">
                  <Layers size={14} className="text-slate-500" />
                  <span>Semester {course.semester}</span>
                </div>
                <div className="flex items-center gap-1.5 font-medium text-slate-300">
                  <Award size={14} className="text-violet-400" />
                  <span>{course.credits} Credits</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
