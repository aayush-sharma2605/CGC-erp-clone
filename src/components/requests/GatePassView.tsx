"use client";

import { useState } from "react";
import { DoorOpen, QrCode, Plus, CheckCircle2, XCircle, Clock, Calendar, MapPin } from "lucide-react";
import { formatDate } from "@/lib/utils";

interface GatePass {
  id: string;
  reason: string;
  outDate: string;
  returnDate?: string | null;
  status: string;
  approverNote?: string | null;
  createdAt: string;
  student?: { firstName: string; lastName: string; enrollmentNo: string };
}

interface GatePassViewProps {
  passes: GatePass[];
  role: string;
}

export function GatePassView({ passes, role }: GatePassViewProps) {
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [reason, setReason] = useState("");
  const [outDate, setOutDate] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [selectedQrPass, setSelectedQrPass] = useState<GatePass | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch("/api/gatepass", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reason, outDate, returnDate }),
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
      const res = await fetch(`/api/gatepass/${id}`, {
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
          <h1 className="page-title">Digital Campus Gate Pass</h1>
          <p className="page-subtitle">Out-station leave permits, day exit passes, and security barcode verification</p>
        </div>
        {role === "STUDENT" && (
          <button onClick={() => setShowApplyModal(true)} className="btn btn-primary text-xs flex items-center gap-2">
            <Plus size={16} />
            <span>Apply New Gate Pass</span>
          </button>
        )}
      </div>

      {/* Gate Pass Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {passes.length === 0 ? (
          <div className="col-span-full card text-center py-12">
            <DoorOpen size={36} className="mx-auto text-slate-500 mb-3" />
            <h3 className="text-base font-semibold text-slate-300">No gate passes recorded</h3>
            <p className="text-xs text-slate-500 mt-1">Submit an exit pass request when planning to leave campus.</p>
          </div>
        ) : (
          passes.map((pass) => (
            <div
              key={pass.id}
              className="card p-5 space-y-4 hover:border-violet-500/30 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span
                    className={`px-2 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider ${
                      pass.status === "APPROVED"
                        ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                        : pass.status === "PENDING"
                        ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                        : pass.status === "USED"
                        ? "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                        : "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                    }`}
                  >
                    {pass.status}
                  </span>
                  <span className="text-[11px] text-slate-500">{formatDate(pass.createdAt)}</span>
                </div>

                {role !== "STUDENT" && pass.student && (
                  <div className="mb-2">
                    <p className="font-bold text-slate-200 text-sm">
                      {pass.student.firstName} {pass.student.lastName}
                    </p>
                    <p className="text-[11px] text-slate-500 font-mono">{pass.student.enrollmentNo}</p>
                  </div>
                )}

                <h4 className="font-semibold text-slate-200 text-sm mb-2">{pass.reason}</h4>

                <div className="space-y-1.5 text-xs text-slate-400 bg-slate-950/40 p-3 rounded-lg border border-white/5">
                  <div className="flex items-center gap-2">
                    <Clock size={13} className="text-violet-400" />
                    <span>Out: {new Date(pass.outDate).toLocaleString([], { dateStyle: "short", timeStyle: "short" })}</span>
                  </div>
                  {pass.returnDate && (
                    <div className="flex items-center gap-2">
                      <Clock size={13} className="text-emerald-400" />
                      <span>Return: {new Date(pass.returnDate).toLocaleString([], { dateStyle: "short", timeStyle: "short" })}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Action buttons */}
              <div className="pt-3 border-t border-white/5 flex items-center justify-between">
                {pass.status === "APPROVED" ? (
                  <button
                    onClick={() => setSelectedQrPass(pass)}
                    className="btn btn-secondary text-xs flex items-center gap-1.5 w-full justify-center"
                  >
                    <QrCode size={14} className="text-violet-400" />
                    <span>View Security Pass QR</span>
                  </button>
                ) : role !== "STUDENT" && pass.status === "PENDING" ? (
                  <div className="flex items-center gap-2 w-full">
                    <button
                      onClick={() => handleStatusChange(pass.id, "APPROVED")}
                      className="btn btn-primary text-xs flex-1 flex items-center justify-center gap-1 bg-emerald-600 hover:bg-emerald-500"
                    >
                      <CheckCircle2 size={14} />
                      <span>Approve</span>
                    </button>
                    <button
                      onClick={() => handleStatusChange(pass.id, "REJECTED")}
                      className="btn btn-danger text-xs flex-1 flex items-center justify-center gap-1"
                    >
                      <XCircle size={14} />
                      <span>Reject</span>
                    </button>
                  </div>
                ) : (
                  <span className="text-[11px] text-slate-500 italic">Awaiting warden review</span>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* QR Modal */}
      {selectedQrPass && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="card p-6 max-w-sm w-full text-center space-y-4 animate-scale-in">
            <h3 className="font-bold text-slate-100">Gate Security Scanner QR</h3>
            <p className="text-xs text-slate-400">Present this QR code to the campus main gate warden</p>
            <div className="bg-white p-4 rounded-xl inline-block shadow-lg mx-auto">
              <div className="w-36 h-36 border-4 border-black grid grid-cols-5 grid-rows-5 gap-1 p-1">
                <div className="bg-black col-span-2 row-span-2"></div>
                <div className="bg-black"></div>
                <div className="bg-black col-span-2 row-span-2"></div>
                <div className="bg-black"></div>
                <div className="bg-transparent"></div>
                <div className="bg-black"></div>
                <div className="bg-black"></div>
                <div className="bg-black col-span-2 row-span-2"></div>
                <div className="bg-transparent"></div>
                <div className="bg-black"></div>
              </div>
            </div>
            <div className="font-mono text-xs text-slate-400 bg-slate-950 p-2 rounded">
              PASS-ID: {selectedQrPass.id.slice(0, 16)}
            </div>
            <button onClick={() => setSelectedQrPass(null)} className="btn btn-secondary text-xs w-full">
              Close
            </button>
          </div>
        </div>
      )}

      {/* Apply Modal */}
      {showApplyModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <form onSubmit={handleApply} className="card p-6 max-w-md w-full space-y-4 animate-scale-in">
            <h3 className="text-lg font-bold text-slate-100">New Gate Pass Application</h3>
            <div className="space-y-1">
              <label className="text-xs text-slate-400">Reason for exit</label>
              <textarea
                required
                rows={3}
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Medical appointment, family emergency, official project visit..."
                className="input w-full text-sm"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs text-slate-400">Departure Time</label>
                <input
                  type="datetime-local"
                  required
                  value={outDate}
                  onChange={(e) => setOutDate(e.target.value)}
                  className="input w-full text-sm"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs text-slate-400">Expected Return</label>
                <input
                  type="datetime-local"
                  value={returnDate}
                  onChange={(e) => setReturnDate(e.target.value)}
                  className="input w-full text-sm"
                />
              </div>
            </div>
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/5">
              <button type="button" onClick={() => setShowApplyModal(false)} className="btn btn-ghost text-xs">
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
