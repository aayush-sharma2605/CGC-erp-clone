"use client";

import { useState } from "react";
import { AlertTriangle, Plus, CheckCircle2, Clock, MessageSquare, ShieldAlert } from "lucide-react";
import { formatDate } from "@/lib/utils";

interface Grievance {
  id: string;
  subject: string;
  description: string;
  status: string;
  resolution?: string | null;
  createdAt: string;
  student?: { firstName: string; lastName: string; enrollmentNo: string };
}

interface GrievanceViewProps {
  grievances: Grievance[];
  role: string;
}

export function GrievanceView({ grievances, role }: GrievanceViewProps) {
  const [showModal, setShowModal] = useState(false);
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [resolvingId, setResolvingId] = useState<string | null>(null);
  const [resolutionText, setResolutionText] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch("/api/grievance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subject, description }),
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

  const handleResolve = async (id: string) => {
    try {
      const res = await fetch(`/api/grievance/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "RESOLVED", resolution: resolutionText }),
      });
      if (res.ok) {
        window.location.reload();
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="page-header flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="page-title">Grievance Redressal Cell</h1>
          <p className="page-subtitle">File academic, hostel, evaluation, or administrative complaints confidentially</p>
        </div>
        {role === "STUDENT" && (
          <button onClick={() => setShowModal(true)} className="btn btn-primary text-xs flex items-center gap-2">
            <Plus size={16} />
            <span>File Grievance</span>
          </button>
        )}
      </div>

      <div className="space-y-4">
        {grievances.length === 0 ? (
          <div className="card text-center py-12">
            <ShieldAlert size={36} className="mx-auto text-slate-500 mb-3" />
            <h3 className="text-base font-semibold text-slate-300">No grievances logged</h3>
            <p className="text-xs text-slate-500 mt-1">All issues filed through this portal receive an official tracking ID and ombudsman review.</p>
          </div>
        ) : (
          grievances.map((g) => (
            <div key={g.id} className="card p-6 space-y-4 hover:border-violet-500/20 transition-all">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/5 pb-3">
                <div className="flex items-center gap-2 flex-wrap">
                  <span
                    className={`px-2 py-0.5 rounded-full text-[11px] font-bold uppercase ${
                      g.status === "RESOLVED"
                        ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                        : g.status === "IN_PROGRESS"
                        ? "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                        : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                    }`}
                  >
                    {g.status}
                  </span>
                  <span className="font-mono text-xs text-slate-500">ID: {g.id.slice(0, 12)}</span>
                </div>
                <span className="text-xs text-slate-500">{formatDate(g.createdAt)}</span>
              </div>

              {role !== "STUDENT" && g.student && (
                <div className="text-xs text-slate-400">
                  Student: <strong className="text-slate-200">{g.student.firstName} {g.student.lastName}</strong> ({g.student.enrollmentNo})
                </div>
              )}

              <div>
                <h4 className="font-bold text-slate-100 text-base mb-1">{g.subject}</h4>
                <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/40 p-3 rounded-lg border border-white/5">
                  {g.description}
                </p>
              </div>

              {g.resolution && (
                <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-xs">
                  <p className="font-bold text-emerald-400 mb-1 flex items-center gap-1.5">
                    <CheckCircle2 size={14} />
                    <span>Resolution / Redressal Action</span>
                  </p>
                  <p className="text-slate-300">{g.resolution}</p>
                </div>
              )}

              {role !== "STUDENT" && g.status !== "RESOLVED" && (
                <div className="pt-3 border-t border-white/5 flex flex-col sm:flex-row items-center gap-2">
                  <input
                    type="text"
                    placeholder="Enter resolution notes..."
                    value={resolvingId === g.id ? resolutionText : ""}
                    onChange={(e) => {
                      setResolvingId(g.id);
                      setResolutionText(e.target.value);
                    }}
                    className="input text-xs w-full sm:flex-1"
                  />
                  <button
                    onClick={() => handleResolve(g.id)}
                    className="btn btn-primary text-xs w-full sm:w-auto"
                  >
                    Mark Resolved
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <form onSubmit={handleSubmit} className="card p-6 max-w-md w-full space-y-4 animate-scale-in">
            <h3 className="text-lg font-bold text-slate-100">File Formal Grievance</h3>
            <div className="space-y-1">
              <label className="text-xs text-slate-400">Grievance Subject</label>
              <input
                type="text"
                required
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="e.g. Examination Evaluation Discrepancy"
                className="input w-full text-sm"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs text-slate-400">Detailed Statement of Complaint</label>
              <textarea
                required
                rows={5}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe the incident, dates, faculty/staff involved, and requested resolution..."
                className="input w-full text-sm"
              />
            </div>
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/5">
              <button type="button" onClick={() => setShowModal(false)} className="btn btn-ghost text-xs">
                Cancel
              </button>
              <button type="submit" disabled={submitting} className="btn btn-primary text-xs">
                {submitting ? "Submitting..." : "Submit Grievance"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
