"use client";

import { useState } from "react";
import { Briefcase, Search, Phone, Mail, Award, BookOpen } from "lucide-react";
import { formatDate } from "@/lib/utils";

interface FacultyItem {
  id: string;
  firstName: string;
  lastName: string;
  employeeId: string;
  designation?: string | null;
  qualification?: string | null;
  phone?: string | null;
  joiningDate?: string | null;
  user: { email: string };
  department: { name: string; code: string };
}

interface FacultyDirectoryViewProps {
  facultyList: FacultyItem[];
}

export function FacultyDirectoryView({ facultyList }: FacultyDirectoryViewProps) {
  const [search, setSearch] = useState("");
  const [deptFilter, setDeptFilter] = useState("ALL");

  const depts = [...new Set(facultyList.map((f) => f.department.code))];

  const filtered = facultyList.filter((f) => {
    const matchesSearch =
      !search ||
      `${f.firstName} ${f.lastName}`.toLowerCase().includes(search.toLowerCase()) ||
      f.employeeId.toLowerCase().includes(search.toLowerCase()) ||
      f.user.email.toLowerCase().includes(search.toLowerCase());
    const matchesDept = deptFilter === "ALL" || f.department.code === deptFilter;
    return matchesSearch && matchesDept;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="page-header flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="page-title">Faculty & Staff Directory</h1>
          <p className="page-subtitle">Professors, department heads, designations, and academic credentials</p>
        </div>
        <div className="card py-2 px-3 text-xs text-slate-400">
          Faculty Count: <strong className="text-violet-300 font-bold ml-1">{facultyList.length}</strong>
        </div>
      </div>

      {/* Filters and search */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search faculty name, ID or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input pl-9 text-sm w-full"
          />
        </div>

        <div className="flex items-center gap-1.5 self-start sm:self-auto bg-slate-900/60 p-1 rounded-xl border border-white/5">
          <button
            onClick={() => setDeptFilter("ALL")}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              deptFilter === "ALL" ? "bg-violet-600 text-white font-semibold" : "text-slate-400 hover:text-slate-200"
            }`}
          >
            All Depts
          </button>
          {depts.map((d) => (
            <button
              key={d}
              onClick={() => setDeptFilter(d)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                deptFilter === d ? "bg-violet-600 text-white font-semibold" : "text-slate-400 hover:text-slate-200"
              }`}
            >
              {d}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((f) => (
          <div key={f.id} className="card p-5 space-y-4 hover:border-violet-500/30 transition-all">
            <div className="flex items-start justify-between gap-2">
              <div>
                <h3 className="font-bold text-slate-100 text-base">
                  Prof. {f.firstName} {f.lastName}
                </h3>
                <p className="text-xs text-violet-400 font-semibold">{f.designation ?? "Faculty"}</p>
                <p className="text-xs text-slate-400 mt-0.5">{f.department.name}</p>
              </div>
              <span className="font-mono text-xs px-2 py-0.5 rounded bg-violet-500/10 text-violet-300 border border-violet-500/20">
                {f.employeeId}
              </span>
            </div>

            <div className="space-y-1.5 text-xs text-slate-400 pt-3 border-t border-white/5">
              {f.qualification && (
                <div className="flex items-center gap-2">
                  <Award size={13} className="text-amber-400" />
                  <span>{f.qualification}</span>
                </div>
              )}
              <div className="flex items-center gap-2">
                <Mail size={13} className="text-slate-500" />
                <span className="font-mono">{f.user.email}</span>
              </div>
              {f.phone && (
                <div className="flex items-center gap-2">
                  <Phone size={13} className="text-slate-500" />
                  <span>{f.phone}</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
