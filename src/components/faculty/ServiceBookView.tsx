"use client";

import { Briefcase, Award, TrendingUp, Calendar, FileText, CheckCircle2, ShieldCheck } from "lucide-react";
import { formatDate } from "@/lib/utils";

interface ServiceBookProps {
  faculty: {
    firstName: string;
    lastName: string;
    employeeId: string;
    designation?: string | null;
    department: { name: string; code: string };
    joiningDate?: string | null;
    qualification?: string | null;
  };
}

export function ServiceBookView({ faculty }: ServiceBookProps) {
  return (
    <div className="space-y-6 animate-fade-in max-w-4xl">
      <div className="page-header flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="page-title">Faculty e-Service Book & Dossier</h1>
          <p className="page-subtitle">Official employment ledger, promotions, annual pay increments, and tenure records</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="badge badge-emerald flex items-center gap-1">
            <ShieldCheck size={13} />
            Verified Dossier
          </span>
        </div>
      </div>

      {/* Profile Card */}
      <div className="card p-6 bg-gradient-to-br from-violet-950/20 via-slate-900 to-slate-900 border-violet-500/20">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-mono text-violet-400 font-bold">
              EMP ID: {faculty.employeeId}
            </span>
            <h2 className="text-xl font-bold text-slate-100 mt-1">
              Prof. {faculty.firstName} {faculty.lastName}
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              {faculty.designation} · {faculty.department.name}
            </p>
          </div>
          <div className="text-xs text-slate-400 space-y-1">
            <p>
              Date of Joining:{" "}
              <strong className="text-slate-200">
                {faculty.joiningDate ? formatDate(faculty.joiningDate) : "01 Jul 2020"}
              </strong>
            </p>
            <p>
              Highest Qualification:{" "}
              <strong className="text-slate-200">{faculty.qualification || "Ph.D. Computer Science"}</strong>
            </p>
            <p>
              Tenure Status: <strong className="text-emerald-400">Confirmed Regular Faculty</strong>
            </p>
          </div>
        </div>
      </div>

      {/* Promotion Timeline */}
      <div className="card p-6 space-y-4">
        <h3 className="section-title flex items-center gap-2">
          <TrendingUp size={16} className="text-violet-400" />
          <span>Career Progression & Promotions</span>
        </h3>
        <div className="space-y-4 border-l-2 border-violet-500/30 pl-4 ml-2 text-xs">
          <div className="relative">
            <div className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-violet-400 ring-4 ring-slate-900" />
            <p className="font-bold text-slate-200 text-sm">Designated as Assistant Professor (Senior Scale)</p>
            <p className="text-slate-400 mt-0.5">Effective Date: 01 July 2023 · UGC Pay Band Level 11</p>
            <p className="text-slate-500 mt-1">Recommended by Institutional Screening-cum-Evaluation Committee.</p>
          </div>
          <div className="relative pt-2">
            <div className="absolute -left-[21px] top-3 w-2.5 h-2.5 rounded-full bg-slate-600 ring-4 ring-slate-900" />
            <p className="font-bold text-slate-200 text-sm">Initial Appointment as Assistant Professor</p>
            <p className="text-slate-400 mt-0.5">Effective Date: 01 July 2020 · UGC Pay Band Level 10</p>
            <p className="text-slate-500 mt-1">Direct recruitment via Selection Committee approval.</p>
          </div>
        </div>
      </div>

      {/* Annual Increments */}
      <div className="card p-6 space-y-4">
        <h3 className="section-title flex items-center gap-2">
          <Award size={16} className="text-emerald-400" />
          <span>Annual Pay Increments & Performance Appraisals</span>
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-white/10 text-slate-400 uppercase text-[11px]">
                <th className="py-2.5 px-3">Effective Year</th>
                <th className="py-2.5 px-3">Increment Type</th>
                <th className="py-2.5 px-3">API Score</th>
                <th className="py-2.5 px-3">New Basic Pay</th>
                <th className="py-2.5 px-3">Sanction Order</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-slate-300">
              <tr className="hover:bg-white/[0.02]">
                <td className="py-2.5 px-3 font-semibold text-slate-100">July 2024</td>
                <td className="py-2.5 px-3">Annual Stated 3% Increment</td>
                <td className="py-2.5 px-3 font-mono text-emerald-400 font-bold">96 / 100 (Outstanding)</td>
                <td className="py-2.5 px-3 font-mono font-bold text-slate-100">₹65,000</td>
                <td className="py-2.5 px-3 font-mono text-slate-500">ORD-2024/782</td>
              </tr>
              <tr className="hover:bg-white/[0.02]">
                <td className="py-2.5 px-3 font-semibold text-slate-100">July 2023</td>
                <td className="py-2.5 px-3">CAS Senior Scale Elevation + 3%</td>
                <td className="py-2.5 px-3 font-mono text-emerald-400 font-bold">94 / 100 (Very Good)</td>
                <td className="py-2.5 px-3 font-mono font-bold text-slate-100">₹63,100</td>
                <td className="py-2.5 px-3 font-mono text-slate-500">ORD-2023/514</td>
              </tr>
              <tr className="hover:bg-white/[0.02]">
                <td className="py-2.5 px-3 font-semibold text-slate-100">July 2022</td>
                <td className="py-2.5 px-3">Annual Stated 3% Increment</td>
                <td className="py-2.5 px-3 font-mono text-emerald-400 font-bold">91 / 100 (Very Good)</td>
                <td className="py-2.5 px-3 font-mono font-bold text-slate-100">₹61,250</td>
                <td className="py-2.5 px-3 font-mono text-slate-500">ORD-2022/339</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
