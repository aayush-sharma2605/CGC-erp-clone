"use client";

import { useState } from "react";
import { Users, Search, Filter, Phone, Mail, MapPin } from "lucide-react";

interface StudentItem {
  id: string;
  firstName: string;
  lastName: string;
  enrollmentNo: string;
  currentSemester: number;
  phone?: string | null;
  city?: string | null;
  user: { email: string };
  department: { name: string; code: string };
}

interface StudentsDirectoryViewProps {
  students: StudentItem[];
}

export function StudentsDirectoryView({ students }: StudentsDirectoryViewProps) {
  const [search, setSearch] = useState("");
  const [deptFilter, setDeptFilter] = useState("ALL");

  const depts = [...new Set(students.map((s) => s.department.code))];

  const filtered = students.filter((s) => {
    const matchesSearch =
      !search ||
      `${s.firstName} ${s.lastName}`.toLowerCase().includes(search.toLowerCase()) ||
      s.enrollmentNo.toLowerCase().includes(search.toLowerCase()) ||
      s.user.email.toLowerCase().includes(search.toLowerCase());
    const matchesDept = deptFilter === "ALL" || s.department.code === deptFilter;
    return matchesSearch && matchesDept;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="page-header flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="page-title">Student Directory</h1>
          <p className="page-subtitle">Enrolled candidate profiles, admissions records, and department allocations</p>
        </div>
        <div className="card py-2 px-3 text-xs text-slate-400">
          Total Enrolled: <strong className="text-violet-300 font-bold ml-1">{students.length}</strong>
        </div>
      </div>

      {/* Filters and search */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by name, enrollment or email..."
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

      {/* Table */}
      <div className="card p-6">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-white/10 text-slate-400 uppercase text-[11px]">
                <th className="py-3 px-3">Student Name</th>
                <th className="py-3 px-3 font-mono">Enrollment No</th>
                <th className="py-3 px-3">Department</th>
                <th className="py-3 px-3 text-center">Semester</th>
                <th className="py-3 px-3">Contact Email</th>
                <th className="py-3 px-3">Phone</th>
                <th className="py-3 px-3">Location</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-slate-300">
              {filtered.map((s) => (
                <tr key={s.id} className="hover:bg-white/[0.02]">
                  <td className="py-3 px-3 font-bold text-slate-100">
                    {s.firstName} {s.lastName}
                  </td>
                  <td className="py-3 px-3 font-mono text-violet-400 font-semibold">
                    {s.enrollmentNo}
                  </td>
                  <td className="py-3 px-3 text-slate-300">{s.department.name}</td>
                  <td className="py-3 px-3 text-center">
                    <span className="badge badge-purple">Sem {s.currentSemester}</span>
                  </td>
                  <td className="py-3 px-3 font-mono text-slate-400">{s.user.email}</td>
                  <td className="py-3 px-3 text-slate-400">{s.phone || "—"}</td>
                  <td className="py-3 px-3 text-slate-400">{s.city || "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
