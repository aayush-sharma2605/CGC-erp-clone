"use client";

import { useState } from "react";
import { FileText, Search, Filter, CheckCircle2 } from "lucide-react";
import { formatDate } from "@/lib/utils";

interface MarkRecord {
  id: string;
  marksObtained: number;
  maxMarks: number;
  type: string;
  createdAt: string;
  course: { name: string; code: string };
  student?: { firstName: string; lastName: string; enrollmentNo: string };
}

interface MarksViewProps {
  marks: MarkRecord[];
  role: string;
}

export function MarksView({ marks, role }: MarksViewProps) {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("ALL");

  const filtered = marks.filter((m) => {
    const matchesSearch =
      !search ||
      m.course.name.toLowerCase().includes(search.toLowerCase()) ||
      m.course.code.toLowerCase().includes(search.toLowerCase()) ||
      m.student?.enrollmentNo?.toLowerCase().includes(search.toLowerCase());
    const matchesType = typeFilter === "ALL" || m.type === typeFilter;
    return matchesSearch && matchesType;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="page-header flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="page-title">Continuous Internal Assessment (CIA) & Marks</h1>
          <p className="page-subtitle">Sessional exams, lab evaluations, and continuous internal assessments</p>
        </div>
      </div>

      {/* Search and filters */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by subject or course code..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input pl-9 text-sm w-full"
          />
        </div>

        <div className="flex items-center gap-2">
          {["ALL", "Internal", "External"].map((t) => (
            <button
              key={t}
              onClick={() => setTypeFilter(t)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                typeFilter === t
                  ? "bg-violet-600 text-white font-semibold"
                  : "bg-slate-900/60 text-slate-400 hover:text-slate-200 border border-white/5"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Marks Table */}
      <div className="card p-6">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-white/10 text-slate-400 uppercase text-[11px]">
                <th className="py-3 px-3">Subject</th>
                {role !== "STUDENT" && <th className="py-3 px-3">Student</th>}
                <th className="py-3 px-3 text-center">Evaluation Type</th>
                <th className="py-3 px-3 text-center">Marks Obtained</th>
                <th className="py-3 px-3 text-center">Maximum Marks</th>
                <th className="py-3 px-3 text-center">Percentage</th>
                <th className="py-3 px-3 text-right">Recorded Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-slate-300">
              {filtered.map((m) => {
                const pct = Math.round((m.marksObtained / m.maxMarks) * 100);
                return (
                  <tr key={m.id} className="hover:bg-white/[0.02]">
                    <td className="py-3 px-3">
                      <span className="font-mono text-violet-400 font-semibold block">
                        {m.course.code}
                      </span>
                      <span className="font-medium text-slate-200">{m.course.name}</span>
                    </td>
                    {role !== "STUDENT" && m.student && (
                      <td className="py-3 px-3">
                        <span className="font-medium text-slate-200 block">
                          {m.student.firstName} {m.student.lastName}
                        </span>
                        <span className="text-[11px] text-slate-500 font-mono">
                          {m.student.enrollmentNo}
                        </span>
                      </td>
                    )}
                    <td className="py-3 px-3 text-center">
                      <span className="badge badge-purple">{m.type}</span>
                    </td>
                    <td className="py-3 px-3 text-center font-mono font-bold text-slate-100">
                      {m.marksObtained}
                    </td>
                    <td className="py-3 px-3 text-center font-mono text-slate-400">
                      {m.maxMarks}
                    </td>
                    <td className="py-3 px-3 text-center">
                      <span
                        className={`font-mono font-bold text-xs ${
                          pct >= 75
                            ? "text-emerald-400"
                            : pct >= 50
                            ? "text-amber-400"
                            : "text-rose-400"
                        }`}
                      >
                        {pct}%
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right text-slate-500">
                      {formatDate(m.createdAt)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
