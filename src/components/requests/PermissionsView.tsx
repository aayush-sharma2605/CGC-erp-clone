"use client";

import { useState } from "react";
import { UserCheck, Plus, CheckCircle2, XCircle, Clock, Calendar } from "lucide-react";
import { formatDate } from "@/lib/utils";

interface Permission {
  id: string;
  date: string;
  fromTime: string;
  toTime: string;
  reason: string;
  status: string;
  approverNote?: string | null;
  createdAt: string;
  student?: { firstName: string; lastName: string; enrollmentNo: string };
}

interface PermissionsViewProps {
  permissions: Permission[];
  role: string;
}

export function PermissionsView({ permissions, role }: PermissionsViewProps) {
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [reason, setReason] = useState("");
  const [date, setDate] = useState("");
  const [fromTime, setFromTime] = useState("");
  const [toTime, setToTime] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch("/api/permissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reason, date, fromTime, toTime }),
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

  const handleStatusChange = async (id: string, status: "APPROVED" | "REJECTED") => {
    try {
      const res = await fetch(`/api/permissions/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
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
          <h1 className="page-title">Special Permissions & Approvals</h1>
          <p className="page-subtitle">Lab after-hours access, event participation, and duty-leave permissions</p>
        </div>
        {role === "STUDENT" && (
          <button onClick={() => setShowApplyModal(true)} className="btn btn-primary text-xs flex items-center gap-2">
            <Plus size={16} />
            <span>Apply For Permission</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {permissions.length === 0 ? (
          <div className="col-span-full card text-center py-12">
            <UserCheck size={36} className="mx-auto text-slate-500 mb-3" />
            <h3 className="text-base font-semibold text-slate-300">No permission requests</h3>
            <p className="text-xs text-slate-500 mt-1">Apply here for special exemptions, late lab stays, or extracurricular permissions.</p>
          </div>
        ) : (
          permissions.map((perm) => (
            <div
              key={perm.id}
              className="card p-5 space-y-4 hover:border-violet-500/30 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span
                    className={`px-2 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider ${
                      perm.status === "APPROVED"
                        ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                        : perm.status === "PENDING"
                        ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                        : "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                    }`}
                  >
                    {perm.status}
                  </span>
                  <span className="text-[11px] text-slate-500">{formatDate(perm.createdAt)}</span>
                </div>

                {role !== "STUDENT" && perm.student && (
                  <div className="mb-2">
                    <p className="font-bold text-slate-200 text-sm">
                      {perm.student.firstName} {perm.student.lastName}
                    </p>
                    <p className="text-[11px] text-slate-500 font-mono">{perm.student.enrollmentNo}</p>
                  </div>
                )}

                <h4 className="font-semibold text-slate-200 text-sm mb-2">{perm.reason}</h4>

                <div className="space-y-1.5 text-xs text-slate-400 bg-slate-950/40 p-3 rounded-lg border border-white/5">
                  <div className="flex items-center gap-2">
                    <Calendar size={13} className="text-violet-400" />
                    <span>Date: {formatDate(perm.date)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock size={13} className="text-slate-400" />
                    <span>Time: {perm.fromTime} – {perm.toTime}</span>
                  </div>
                </div>
              </div>

              {role !== "STUDENT" && perm.status === "PENDING" && (
                <div className="pt-3 border-t border-white/5 flex items-center gap-2">
                  <button
                    onClick={() => handleStatusChange(perm.id, "APPROVED")}
                    className="btn btn-primary text-xs flex-1 flex items-center justify-center gap-1 bg-emerald-600 hover:bg-emerald-500"
                  >
                    <CheckCircle2 size={14} />
                    <span>Approve</span>
                  </button>
                  <button
                    onClick={() => handleStatusChange(perm.id, "REJECTED")}
                    className="btn btn-danger text-xs flex-1 flex items-center justify-center gap-1"
                  >
                    <XCircle size={14} />
                    <span>Reject</span>
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Apply Modal */}
      {showApplyModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <form onSubmit={handleApply} className="card p-6 max-w-md w-full space-y-4 animate-scale-in">
            <h3 className="text-lg font-bold text-slate-100">Special Permission Request</h3>
            <div className="space-y-1">
              <label className="text-xs text-slate-400">Reason / Activity Details</label>
              <textarea
                required
                rows={3}
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Robotics lab night stay, Hackathon attendance, cultural fest practice..."
                className="input w-full text-sm"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs text-slate-400">Date</label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="input w-full text-sm"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs text-slate-400">From Time</label>
                <input
                  type="time"
                  required
                  value={fromTime}
                  onChange={(e) => setFromTime(e.target.value)}
                  className="input w-full text-sm"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs text-slate-400">To Time</label>
                <input
                  type="time"
                  required
                  value={toTime}
                  onChange={(e) => setToTime(e.target.value)}
                  className="input w-full text-sm"
                />
              </div>
            </div>
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/5">
              <button type="button" onClick={() => setShowApplyModal(false)} className="btn btn-ghost text-xs">
                Cancel
              </button>
              <button type="submit" disabled={submitting} className="btn btn-primary text-xs">
                {submitting ? "Submitting..." : "Submit Request"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
