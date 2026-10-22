"use client";

import { useState } from "react";
import { Award, Plus, CheckCircle2, Clock, IndianRupee, Sparkles } from "lucide-react";
import { formatCurrency, formatDate } from "@/lib/utils";

interface Scholarship {
  id: string;
  name: string;
  amount: number;
  status: string;
  appliedAt: string;
  remarks?: string | null;
}

interface ScholarshipViewProps {
  scholarships: Scholarship[];
  role: string;
}

const AVAILABLE_SCHEMES = [
  { name: "Merit Academic Excellence Scholarship", amount: 40000, eligibility: "CGPA > 8.5 with no backlogs", deadline: "30 Nov 2024" },
  { name: "Post-Matric Financial Aid Scheme", amount: 50000, eligibility: "Annual family income < ₹3.5 LPA", deadline: "15 Dec 2024" },
  { name: "Women in STEM Innovation Grant", amount: 35000, eligibility: "Female students enrolled in Engineering/Tech", deadline: "10 Dec 2024" },
  { name: "Sports & Athletic Distinction Bursary", amount: 25000, eligibility: "State or National sports medalists", deadline: "05 Dec 2024" },
];

export function ScholarshipView({ scholarships, role }: ScholarshipViewProps) {
  const [applyingName, setApplyingName] = useState<string | null>(null);
  const [applyingAmount, setApplyingAmount] = useState<number>(0);
  const [remarks, setRemarks] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!applyingName) return;
    setSubmitting(true);
    try {
      const res = await fetch("/api/scholarship", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: applyingName, amount: applyingAmount, remarks }),
      });
      if (res.ok) {
        window.location.reload();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="page-header flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="page-title">Scholarships & Financial Aid</h1>
          <p className="page-subtitle">Merit grants, fee concessions, and government scholarship disbursal</p>
        </div>
      </div>

      {/* Applied Grants Status */}
      <div className="space-y-3">
        <h3 className="section-title">My Scholarship Applications</h3>
        {scholarships.length === 0 ? (
          <div className="card text-center py-8 text-xs text-slate-500">
            You have not submitted any scholarship applications yet. Explore available schemes below.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {scholarships.map((s) => (
              <div key={s.id} className="card p-5 space-y-3 border-violet-500/20">
                <div className="flex items-center justify-between">
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase ${
                      s.status === "APPROVED"
                        ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                        : s.status === "PENDING"
                        ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                        : "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                    }`}
                  >
                    {s.status}
                  </span>
                  <span className="text-[11px] text-slate-500">{formatDate(s.appliedAt)}</span>
                </div>
                <div>
                  <h4 className="font-bold text-slate-200 text-sm">{s.name}</h4>
                  <p className="font-mono text-emerald-400 font-bold text-sm mt-1">
                    Grant Amount: {formatCurrency(s.amount)}
                  </p>
                </div>
                {s.remarks && (
                  <p className="text-xs text-slate-400 bg-slate-950/40 p-2.5 rounded border border-white/5">
                    Note: {s.remarks}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Available Scholarship Schemes */}
      <div className="space-y-4 pt-4">
        <h3 className="section-title flex items-center gap-2">
          <Sparkles size={16} className="text-violet-400" />
          <span>Active Scholarship Schemes (Session 2024-25)</span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {AVAILABLE_SCHEMES.map((scheme) => {
            const alreadyApplied = scholarships.some((s) => s.name === scheme.name);
            return (
              <div
                key={scheme.name}
                className="card p-6 flex flex-col justify-between hover:border-violet-500/30 transition-all"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h4 className="font-bold text-slate-100 text-base">{scheme.name}</h4>
                    <span className="font-mono font-black text-sm text-emerald-400">
                      {formatCurrency(scheme.amount)}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mb-3">
                    <strong className="text-slate-300">Eligibility:</strong> {scheme.eligibility}
                  </p>
                  <p className="text-[11px] text-slate-500">
                    Application Deadline: <span className="text-slate-400">{scheme.deadline}</span>
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-white/5">
                  {alreadyApplied ? (
                    <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-semibold">
                      <CheckCircle2 size={15} />
                      <span>Application Submitted</span>
                    </div>
                  ) : (
                    <button
                      onClick={() => {
                        setApplyingName(scheme.name);
                        setApplyingAmount(scheme.amount);
                      }}
                      className="btn btn-primary text-xs w-full"
                    >
                      Apply for Grant
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Apply Modal */}
      {applyingName && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <form onSubmit={handleApply} className="card p-6 max-w-md w-full space-y-4 animate-scale-in">
            <h3 className="text-base font-bold text-slate-100">Apply: {applyingName}</h3>
            <p className="text-xs text-slate-400">
              Grant Amount: <strong className="text-emerald-400 font-mono">{formatCurrency(applyingAmount)}</strong>
            </p>
            <div className="space-y-1">
              <label className="text-xs text-slate-400">Statement / Supporting Details</label>
              <textarea
                required
                rows={4}
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                placeholder="Mention your CGPA, family income details, academic achievements, or extracurricular records..."
                className="input w-full text-sm"
              />
            </div>
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/5">
              <button
                type="button"
                onClick={() => setApplyingName(null)}
                className="btn btn-ghost text-xs"
              >
                Cancel
              </button>
              <button type="submit" disabled={submitting} className="btn btn-primary text-xs">
                {submitting ? "Submitting..." : "Submit Application"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
