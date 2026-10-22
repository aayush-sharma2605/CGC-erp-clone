"use client";

import { useState } from "react";
import { formatDate, getStatusColor } from "@/lib/utils";
import { Clock, Plus, CheckCircle2, XCircle, X, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

interface Leave {
  id: string;
  fromDate: string;
  toDate: string;
  reason: string;
  status: string;
  createdAt: string;
  approverNote?: string | null;
  student?: { firstName: string; lastName: string; enrollmentNo: string; department: { name: string } };
}

interface LeaveViewProps {
  leaves: Leave[];
  role: string;
  profileId: string;
}

export function LeaveView({ leaves, role, profileId }: LeaveViewProps) {
  const router = useRouter();
  const [showForm, setShowForm] = useState(false);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/leave", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fromDate, toDate, reason, studentId: profileId }),
      });
      if (res.ok) {
        setShowForm(false);
        setFromDate(""); setToDate(""); setReason("");
        router.refresh();
      } else {
        alert("Failed to submit leave application");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleApproval = async (id: string, action: "APPROVED" | "REJECTED") => {
    setActionLoading(id + action);
    try {
      const res = await fetch(`/api/leave/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: action }),
      });
      if (res.ok) router.refresh();
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div className="page-header mb-0">
          <h1 className="page-title">
            {role === "STUDENT" ? "My Leave Requests" : "Leave Approvals"}
          </h1>
          <p className="page-subtitle">
            {role === "STUDENT" ? "Apply and track your leave applications" : "Review and approve student leave requests"}
          </p>
        </div>
        {role === "STUDENT" && (
          <button className="btn btn-primary" onClick={() => setShowForm(true)}>
            <Plus size={16} />
            Apply Leave
          </button>
        )}
      </div>

      {/* Apply form modal */}
      {showForm && (
        <div className="modal-overlay" onClick={() => setShowForm(false)}>
          <div className="modal-content p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-xl font-bold" style={{ color: "rgb(248 250 252)" }}>Apply for Leave</h2>
              <button onClick={() => setShowForm(false)} className="btn-ghost p-1.5 rounded-lg">
                <X size={18} style={{ color: "rgb(100 116 139)" }} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">From Date</label>
                  <input type="date" className="input" value={fromDate} onChange={(e) => setFromDate(e.target.value)} required />
                </div>
                <div>
                  <label className="label">To Date</label>
                  <input type="date" className="input" value={toDate} onChange={(e) => setToDate(e.target.value)} required />
                </div>
              </div>
              <div>
                <label className="label">Reason</label>
                <textarea
                  className="input resize-none"
                  rows={4}
                  placeholder="State your reason for leave…"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  required
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" className="btn btn-secondary flex-1" onClick={() => setShowForm(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary flex-1" disabled={loading}>
                  {loading ? <Loader2 size={16} className="animate-spin" /> : null}
                  Submit Application
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Leaves list */}
      <div className="card">
        {leaves.length === 0 ? (
          <div className="empty-state">
            <Clock size={36} />
            <p>{role === "STUDENT" ? "No leave applications yet" : "No pending leave requests"}</p>
            {role === "STUDENT" && (
              <button className="btn btn-primary btn-sm mt-2" onClick={() => setShowForm(true)}>
                <Plus size={14} />
                Apply Leave
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  {role !== "STUDENT" && <th>Student</th>}
                  <th>From</th>
                  <th>To</th>
                  <th>Reason</th>
                  <th>Status</th>
                  <th>Applied</th>
                  {role !== "STUDENT" && <th>Actions</th>}
                </tr>
              </thead>
              <tbody>
                {leaves.map((leave) => (
                  <tr key={leave.id}>
                    {role !== "STUDENT" && leave.student && (
                      <td>
                        <p className="font-medium text-sm" style={{ color: "rgb(203 213 225)" }}>
                          {leave.student.firstName} {leave.student.lastName}
                        </p>
                        <p className="text-xs" style={{ color: "rgb(71 85 105)" }}>
                          {leave.student.enrollmentNo} · {leave.student.department.name}
                        </p>
                      </td>
                    )}
                    <td>{formatDate(leave.fromDate)}</td>
                    <td>{formatDate(leave.toDate)}</td>
                    <td>
                      <p className="max-w-xs truncate text-sm">{leave.reason}</p>
                      {leave.approverNote && (
                        <p className="text-xs mt-0.5" style={{ color: "rgb(100 116 139)" }}>Note: {leave.approverNote}</p>
                      )}
                    </td>
                    <td>
                      <span className={`badge text-xs ${getStatusColor(leave.status)}`}>{leave.status}</span>
                    </td>
                    <td className="text-sm">{formatDate(leave.createdAt)}</td>
                    {role !== "STUDENT" && (
                      <td>
                        {leave.status === "PENDING" && (
                          <div className="flex gap-2">
                            <button
                              className="btn btn-sm"
                              style={{ background: "rgb(52 211 153 / 0.12)", color: "rgb(52 211 153)", border: "1px solid rgb(52 211 153 / 0.25)" }}
                              onClick={() => handleApproval(leave.id, "APPROVED")}
                              disabled={actionLoading === leave.id + "APPROVED"}
                            >
                              {actionLoading === leave.id + "APPROVED" ? <Loader2 size={13} className="animate-spin" /> : <CheckCircle2 size={13} />}
                              Approve
                            </button>
                            <button
                              className="btn btn-sm btn-danger"
                              onClick={() => handleApproval(leave.id, "REJECTED")}
                              disabled={actionLoading === leave.id + "REJECTED"}
                            >
                              {actionLoading === leave.id + "REJECTED" ? <Loader2 size={13} className="animate-spin" /> : <XCircle size={13} />}
                              Reject
                            </button>
                          </div>
                        )}
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
