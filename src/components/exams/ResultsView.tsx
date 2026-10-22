"use client";

import { useState } from "react";
import { Award, TrendingUp, BarChart3, CheckCircle2, AlertCircle, FileCheck } from "lucide-react";
import { cn } from "@/lib/utils";

interface SubjectResult {
  code: string;
  name: string;
  credits: number;
  internalMarks: number;
  externalMarks: number;
  totalMarks: number;
  maxTotal: number;
  grade: string;
  gradePoint: number;
  isPass: boolean;
}

interface ResultsViewProps {
  results: SubjectResult[];
  sgpa: number;
  cgpa: number;
  totalCreditsEarned: number;
  semester: number;
}

export function ResultsView({
  results,
  sgpa,
  cgpa,
  totalCreditsEarned,
  semester,
}: ResultsViewProps) {
  const [selectedSemester, setSelectedSemester] = useState(semester);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="page-header flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="page-title">Examination Results & Transcripts</h1>
          <p className="page-subtitle">Cumulative grade points, semester performance, and mark sheets</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="badge badge-emerald">Provisional Result Declared</span>
        </div>
      </div>

      {/* Metrics cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="card p-5 bg-gradient-to-br from-violet-950/20 via-slate-900 to-slate-900 border-violet-500/20">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-medium">Semester GPA (SGPA)</span>
            <Award size={18} className="text-violet-400" />
          </div>
          <p className="text-3xl font-black text-violet-300 mt-2">{sgpa.toFixed(2)}</p>
          <p className="text-[11px] text-slate-500 mt-1">Semester {selectedSemester} Performance</p>
        </div>

        <div className="card p-5 bg-gradient-to-br from-emerald-950/20 via-slate-900 to-slate-900 border-emerald-500/20">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-medium">Cumulative GPA (CGPA)</span>
            <TrendingUp size={18} className="text-emerald-400" />
          </div>
          <p className="text-3xl font-black text-emerald-300 mt-2">{cgpa.toFixed(2)}</p>
          <p className="text-[11px] text-slate-500 mt-1">Overall Academic Standing</p>
        </div>

        <div className="card p-5 bg-gradient-to-br from-blue-950/20 via-slate-900 to-slate-900 border-blue-500/20">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-medium">Total Earned Credits</span>
            <FileCheck size={18} className="text-blue-400" />
          </div>
          <p className="text-3xl font-black text-blue-300 mt-2">{totalCreditsEarned}</p>
          <p className="text-[11px] text-slate-500 mt-1">Out of required curriculum</p>
        </div>
      </div>

      {/* Results table card */}
      <div className="card p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="section-title">Semester {selectedSemester} Marksheet</h3>
          <span className="text-xs text-slate-400">10-Point Grading Scale</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-white/10 text-slate-400 uppercase text-[11px]">
                <th className="py-3 px-3">Subject</th>
                <th className="py-3 px-3 text-center">Credits</th>
                <th className="py-3 px-3 text-center">Internal (25)</th>
                <th className="py-3 px-3 text-center">External (50)</th>
                <th className="py-3 px-3 text-center">Total (75)</th>
                <th className="py-3 px-3 text-center">Grade</th>
                <th className="py-3 px-3 text-center">Grade Point</th>
                <th className="py-3 px-3 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-slate-300">
              {results.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-500">
                    <AlertCircle size={28} className="mx-auto mb-2 text-slate-600" />
                    <p className="font-semibold text-slate-300">No marksheet records available</p>
                    <p className="text-xs text-slate-500 mt-1">Official evaluation for Semester {selectedSemester} is underway.</p>
                  </td>
                </tr>
              ) : (
                results.map((res) => (
                  <tr key={res.code} className="hover:bg-white/[0.02]">
                    <td className="py-3 px-3">
                      <span className="font-mono text-violet-400 font-bold block">{res.code}</span>
                      <span className="font-medium text-slate-200">{res.name}</span>
                    </td>
                    <td className="py-3 px-3 text-center font-bold text-slate-400">{res.credits}</td>
                    <td className="py-3 px-3 text-center font-mono">{res.internalMarks}</td>
                    <td className="py-3 px-3 text-center font-mono">{res.externalMarks}</td>
                    <td className="py-3 px-3 text-center font-mono font-bold text-slate-100">
                      {res.totalMarks} / {res.maxTotal}
                    </td>
                    <td className="py-3 px-3 text-center">
                      <span className="px-2 py-0.5 rounded font-black text-xs bg-violet-500/10 text-violet-300 border border-violet-500/20">
                        {res.grade}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-center font-mono font-bold text-slate-300">
                      {res.gradePoint}
                    </td>
                    <td className="py-3 px-3 text-center">
                      <span
                        className={cn(
                          "px-2 py-0.5 rounded-full text-[10px] font-bold uppercase",
                          res.isPass
                            ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                            : "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                        )}
                      >
                        {res.isPass ? "PASS" : "RE-APPEAR"}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
