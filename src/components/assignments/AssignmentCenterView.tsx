"use client";

import { useState, useMemo, useEffect } from "react";
import {
  FileCheck,
  Clock,
  AlertCircle,
  CheckCircle2,
  Download,
  Upload,
  Search,
  Filter,
  Calendar,
  BookOpen,
  X,
  FileText,
  AlertTriangle,
  ExternalLink,
  ChevronRight,
  Info,
} from "lucide-react";
import { cn } from "@/lib/utils";

export interface AssignmentItem {
  id: string;
  asNo: number;
  title: string;
  courseNo: string;
  courseName: string;
  courseCode: string;
  category?: string;
  createdDate: string;
  dueDate: string;
  cutoffDate: string;
  status: "Active" | "Expired";
  isExpired: boolean;
  isSubmitted: boolean;
  daysRemaining: number;
  result?: string;
}

export interface AssignmentStats {
  total: number;
  active: number;
  dueThisWeek: number;
  expired: number;
  submitted: number;
}

interface AssignmentCenterViewProps {
  assignments: AssignmentItem[];
  stats: AssignmentStats;
  isLiveGateway: boolean;
  role: string;
}

interface AssignmentDetailData {
  AssiDescription?: {
    AssignmentTopic?: string;
    AssignmentQueston?: string;
  } | null;
  attachments?: Array<{
    ATTACHMENT: string;
    FILE_NAME: string;
  }> | null;
  studAttachments?: Array<{
    ATTACHMENT?: string;
    FILE_NAME?: string;
    SUBMIT_DATE?: string;
  }> | null;
  AllowMaxNoOfFile?: number;
}

export function AssignmentCenterView({
  assignments: initialAssignments,
  stats: initialStats,
  isLiveGateway,
  role,
}: AssignmentCenterViewProps) {
  const [assignments, setAssignments] = useState(initialAssignments);
  const [stats, setStats] = useState(initialStats);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [courseFilter, setCourseFilter] = useState("ALL");

  // Restore client-side submitted state from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem("erp_submitted_as_nos");
      if (stored) {
        const submittedNos: number[] = JSON.parse(stored);
        if (Array.isArray(submittedNos) && submittedNos.length > 0) {
          setAssignments((prev) => {
            let changed = false;
            const updated = prev.map((a) => {
              if (submittedNos.includes(a.asNo) && !a.isSubmitted) {
                changed = true;
                return { ...a, isSubmitted: true };
              }
              return a;
            });
            if (changed) {
              setStats({
                total: updated.length,
                active: updated.filter((a) => !a.isExpired && !a.isSubmitted).length,
                dueThisWeek: updated.filter(
                  (a) => !a.isExpired && !a.isSubmitted && a.daysRemaining <= 7 && a.daysRemaining >= 0
                ).length,
                expired: updated.filter((a) => a.isExpired && !a.isSubmitted).length,
                submitted: updated.filter((a) => a.isSubmitted).length,
              });
            }
            return updated;
          });
        }
      }
    } catch {
      // Ignore localStorage errors
    }
  }, []);

  // Detail & Submission Modal State
  const [selectedAssignment, setSelectedAssignment] = useState<AssignmentItem | null>(null);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [detailData, setDetailData] = useState<AssignmentDetailData | null>(null);
  const [detailError, setDetailError] = useState<string | null>(null);

  // Form submission state
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [remarks, setRemarks] = useState("");
  const [showExpired, setShowExpired] = useState(false);

  const courses = useMemo(
    () => [
      ...new Set(
        assignments
          .filter((a) => showExpired || !a.isExpired)
          .map((a) => a.courseName)
      ),
    ],
    [assignments, showExpired]
  );

  const filtered = useMemo(() => {
    return assignments.filter((a) => {
      // Ignore assignments whose deadlines are over unless explicitly toggled
      if (!showExpired && a.isExpired) return false;

      const matchSearch =
        !search ||
        a.title.toLowerCase().includes(search.toLowerCase()) ||
        a.courseName.toLowerCase().includes(search.toLowerCase()) ||
        a.courseCode.toLowerCase().includes(search.toLowerCase());

      const matchCourse = courseFilter === "ALL" || a.courseName === courseFilter;

      let matchStatus = true;
      if (statusFilter === "ACTIVE" || statusFilter === "PENDING") matchStatus = !a.isExpired && !a.isSubmitted;
      else if (statusFilter === "DUE_SOON") matchStatus = !a.isExpired && !a.isSubmitted && a.daysRemaining <= 7 && a.daysRemaining >= 0;
      else if (statusFilter === "SUBMITTED") matchStatus = a.isSubmitted;
      else if (statusFilter === "EXPIRED") matchStatus = a.isExpired;

      return matchSearch && matchCourse && matchStatus;
    });
  }, [assignments, search, statusFilter, courseFilter, showExpired]);

  const handleOpenDetail = async (as: AssignmentItem) => {
    setSelectedAssignment(as);
    setLoadingDetail(true);
    setDetailData(null);
    setDetailError(null);
    setSubmitError(null);
    setSubmitSuccess(null);
    setSelectedFile(null);
    setRemarks("");

    try {
      const res = await fetch(`/api/assignments/${as.asNo}`);
      const data = await res.json();
      if (!res.ok || data.error) {
        throw new Error(data.error || "Failed to load assignment detail from official gateway.");
      }
      setDetailData(data.detail);

      // If official ERP gateway reports student attachments, update local submission state immediately
      const hasStudFiles =
        Array.isArray(data.detail?.studAttachments) && data.detail.studAttachments.length > 0;
      if (hasStudFiles || as.isSubmitted) {
        try {
          const raw = localStorage.getItem("erp_submitted_as_nos");
          const arr: number[] = raw ? JSON.parse(raw) : [];
          if (!arr.includes(as.asNo)) {
            arr.push(as.asNo);
            localStorage.setItem("erp_submitted_as_nos", JSON.stringify(arr));
          }
        } catch {}

        setAssignments((prev) => {
          const updated = prev.map((a) => (a.asNo === as.asNo ? { ...a, isSubmitted: true } : a));
          setStats({
            total: updated.length,
            active: updated.filter((a) => !a.isExpired && !a.isSubmitted).length,
            dueThisWeek: updated.filter(
              (a) => !a.isExpired && !a.isSubmitted && a.daysRemaining <= 7 && a.daysRemaining >= 0
            ).length,
            expired: updated.filter((a) => a.isExpired && !a.isSubmitted).length,
            submitted: updated.filter((a) => a.isSubmitted).length,
          });
          return updated;
        });
      }
    } catch (err: any) {
      setDetailError(err.message || "Failed to connect to official ERP gateway.");
    } finally {
      setLoadingDetail(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const f = e.target.files[0];
      if (f.size > 10 * 1024 * 1024) {
        setSubmitError("File size exceeds 10MB limit.");
        return;
      }
      setSelectedFile(f);
      setSubmitError(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAssignment || !selectedFile) return;

    // Strict client-side cutoff guard
    if (selectedAssignment.isExpired) {
      setSubmitError("Deadline has passed. Official college policy strictly rejects late submissions.");
      return;
    }

    setSubmitting(true);
    setSubmitError(null);
    setSubmitSuccess(null);

    try {
      const formData = new FormData();
      formData.append("file", selectedFile);
      formData.append("description", remarks);
      formData.append("cutoffDate", selectedAssignment.cutoffDate || selectedAssignment.dueDate);

      const res = await fetch(`/api/assignments/${selectedAssignment.asNo}`, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok || data.error) {
        throw new Error(data.error || "Failed to submit assignment to official gateway.");
      }

      setSubmitSuccess(data.message || "Assignment successfully submitted to college ERP!");

      // Persist to localStorage
      try {
        const raw = localStorage.getItem("erp_submitted_as_nos");
        const arr: number[] = raw ? JSON.parse(raw) : [];
        if (!arr.includes(selectedAssignment.asNo)) {
          arr.push(selectedAssignment.asNo);
          localStorage.setItem("erp_submitted_as_nos", JSON.stringify(arr));
        }
      } catch {}

      // Mark as submitted and update all counts
      setAssignments((prev) => {
        const updated = prev.map((a) =>
          a.asNo === selectedAssignment.asNo ? { ...a, isSubmitted: true } : a
        );
        setStats({
          total: updated.length,
          active: updated.filter((a) => !a.isExpired && !a.isSubmitted).length,
          dueThisWeek: updated.filter(
            (a) => !a.isExpired && !a.isSubmitted && a.daysRemaining <= 7 && a.daysRemaining >= 0
          ).length,
          expired: updated.filter((a) => a.isExpired && !a.isSubmitted).length,
          submitted: updated.filter((a) => a.isSubmitted).length,
        });
        return updated;
      });
    } catch (err: any) {
      setSubmitError(err.message || "Submission failed. Please verify network and try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* ── Page Header ── */}
      <div className="page-header flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="page-title">Assignment Center</h1>
          <p className="page-subtitle">
            Official coursework tracking, problem statement downloads, and verified portal submissions
          </p>
        </div>
        <div className="flex items-center gap-2">
          {isLiveGateway ? (
            <span className="badge badge-emerald flex items-center gap-1.5 py-1 px-3">
              <CheckCircle2 size={13} /> Official Gateway Connected
            </span>
          ) : (
            <span className="badge badge-amber flex items-center gap-1.5 py-1 px-3">
              <AlertCircle size={13} /> Offline Mode
            </span>
          )}
        </div>
      </div>

      {/* ── Metric Cards ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: "Pending Submission",
            value: stats.active,
            sub: "Requires your submission",
            color: "rgb(52 211 153)",
          },
          {
            label: "Due This Week",
            value: stats.dueThisWeek,
            sub: "Upcoming deadline",
            color: "rgb(251 191 36)",
          },
          {
            label: "Submitted",
            value: stats.submitted,
            sub: "Recorded on college portal",
            color: "rgb(139 92 246)",
          },
          {
            label: "Total Active",
            value: assignments.filter((a) => !a.isExpired).length,
            sub: "Open coursework",
            color: "rgb(34 211 238)",
          },
        ].map((s) => (
          <div key={s.label} className="card p-5 text-center flex flex-col justify-center">
            <p className="text-3xl font-black" style={{ color: s.color }}>
              {s.value}
            </p>
            <p className="text-sm font-medium mt-1 text-slate-200">{s.label}</p>
            <p className="text-xs text-slate-500 mt-0.5">{s.sub}</p>
          </div>
        ))}
      </div>

      {/* ── Filter & Search Toolbar ── */}
      <div className="card p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
            <input
              className="input pl-9 w-full text-xs sm:text-sm"
              placeholder="Search assignment title, course name, or code..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <select
            className="input text-xs sm:text-sm"
            style={{ maxWidth: "200px" }}
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="ALL">All Active Coursework</option>
            <option value="ACTIVE">Pending Submission</option>
            <option value="DUE_SOON">Due This Week</option>
            <option value="SUBMITTED">Submitted</option>
            {showExpired && <option value="EXPIRED">Expired / Overdue</option>}
          </select>

          {courses.length > 0 && (
            <select
              className="input text-xs sm:text-sm"
              style={{ maxWidth: "220px" }}
              value={courseFilter}
              onChange={(e) => setCourseFilter(e.target.value)}
            >
              <option value="ALL">All Subjects</option>
              {courses.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          )}
        </div>
      </div>

      {/* ── Assignments List ── */}
      {filtered.length === 0 ? (
        <div className="card py-16 text-center empty-state">
          <BookOpen size={40} className="mx-auto text-slate-600 mb-3" />
          <h3 className="text-base font-semibold text-slate-300">
            {assignments.length === 0 ? "No assignments issued currently" : "No assignments match your search"}
          </h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            {assignments.length === 0
              ? "All course assignments issued by your instructors will appear here in real-time."
              : "Try clearing your search query or changing your status filter."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((as) => {
            const isDueUrgent = !as.isExpired && as.daysRemaining <= 3 && as.daysRemaining >= 0;

            return (
              <div
                key={as.id}
                className="card p-5 flex flex-col justify-between hover:border-slate-700 transition-all duration-150"
              >
                <div>
                  {/* Top Subject & Status Badges */}
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-mono text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                          {as.courseCode}
                        </span>
                        <span className="text-xs text-slate-400 truncate max-w-[200px]" title={as.courseName}>
                          {as.courseName}
                        </span>
                      </div>
                      <h3 className="font-bold text-base text-slate-100 leading-snug" title={as.title}>
                        {as.title}
                      </h3>
                    </div>

                    {/* Status Badge */}
                    <div className="flex-shrink-0">
                      {as.isSubmitted ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-purple-500/10 text-purple-400 border border-purple-500/20">
                          <CheckCircle2 size={12} /> Submitted
                        </span>
                      ) : as.isExpired ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/20">
                          <X size={12} /> Expired
                        </span>
                      ) : isDueUrgent ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20 animate-pulse">
                          <Clock size={12} /> Due Soon
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          <Clock size={12} /> Active
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Date & Deadline Info */}
                  <div className="mt-4 pt-3 border-t border-slate-800/80 grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-slate-500 block">Issued On:</span>
                      <span className="text-slate-300 font-medium">{as.createdDate}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Deadline:</span>
                      <span
                        className={cn(
                          "font-medium",
                          as.isExpired ? "text-rose-400 line-through" : isDueUrgent ? "text-amber-400 font-bold" : "text-emerald-400"
                        )}
                      >
                        {as.dueDate}
                      </span>
                    </div>
                  </div>

                  {/* Countdown Notice */}
                  <div className="mt-2 text-xs">
                    {as.isExpired ? (
                      <p className="text-rose-400/80 flex items-center gap-1">
                        <AlertCircle size={12} /> Submissions closed by college server
                      </p>
                    ) : as.daysRemaining === 0 ? (
                      <p className="text-amber-400 font-semibold flex items-center gap-1">
                        <AlertTriangle size={12} /> Due today by 11:59 PM IST
                      </p>
                    ) : (
                      <p className="text-slate-400">
                        {as.daysRemaining} day{as.daysRemaining !== 1 ? "s" : ""} remaining to submit
                      </p>
                    )}
                  </div>
                </div>

                {/* Card Actions */}
                <div className="mt-5 pt-3 border-t border-slate-800/60 flex items-center justify-between">
                  <span className="text-[11px] font-mono text-slate-500">AS_NO: {as.asNo}</span>
                  <button
                    onClick={() => handleOpenDetail(as)}
                    className="btn btn-secondary btn-sm text-xs py-1.5 px-3 flex items-center gap-1.5"
                  >
                    <span>View & Submit</span>
                    <ChevronRight size={13} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── Optional Past Deadlines Toggle ── */}
      {assignments.some((a) => a.isExpired) && (
        <div className="pt-2 pb-1 flex justify-center">
          <button
            onClick={() => setShowExpired((prev) => !prev)}
            className="text-xs text-slate-500 hover:text-slate-300 transition-colors flex items-center gap-1.5 py-1.5 px-3 rounded-lg border border-slate-800 hover:border-slate-700 bg-slate-900/40"
          >
            <span>
              {showExpired
                ? "Hide expired assignments whose deadlines are over"
                : `Show past assignments whose deadlines have passed (${assignments.filter((a) => a.isExpired).length})`}
            </span>
          </button>
        </div>
      )}

      {/* ── Assignment Details & Submission Modal ── */}
      {selectedAssignment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
          <div
            className="card max-w-2xl w-full max-h-[90vh] flex flex-col p-6 shadow-2xl border border-slate-700 bg-slate-900"
            role="dialog"
            aria-modal="true"
          >
            {/* Modal Header */}
            <div className="flex items-start justify-between pb-4 border-b border-slate-800">
              <div className="min-w-0 pr-4">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-mono text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                    {selectedAssignment.courseCode}
                  </span>
                  <span className="text-xs text-slate-400 truncate">{selectedAssignment.courseName}</span>
                </div>
                <h2 className="text-lg font-bold text-slate-100 leading-snug">{selectedAssignment.title}</h2>
              </div>
              <button
                onClick={() => setSelectedAssignment(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
                aria-label="Close"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Scrollable Body */}
            <div className="flex-1 overflow-y-auto py-4 space-y-5">
              {loadingDetail ? (
                <div className="py-12 text-center text-slate-400 flex flex-col items-center justify-center gap-3">
                  <div className="w-6 h-6 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
                  <p className="text-sm">Fetching assignment details from official ERP gateway...</p>
                </div>
              ) : detailError ? (
                <div className="p-4 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm">
                  {detailError}
                </div>
              ) : (
                <>
                  {/* Instructions & Topic */}
                  {detailData?.AssiDescription && (
                    <div className="card p-4 space-y-2 bg-slate-800/40">
                      {detailData.AssiDescription.AssignmentTopic && (
                        <div>
                          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
                            Topic
                          </span>
                          <p className="text-sm text-slate-200 font-medium">
                            {detailData.AssiDescription.AssignmentTopic}
                          </p>
                        </div>
                      )}
                      {detailData.AssiDescription.AssignmentQueston && (
                        <div className="pt-2 border-t border-slate-700/50">
                          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
                            Instructions / Question
                          </span>
                          <p className="text-xs text-slate-300 whitespace-pre-wrap leading-relaxed mt-1">
                            {detailData.AssiDescription.AssignmentQueston}
                          </p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Faculty Handout Attachments */}
                  <div>
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                      Faculty Problem Statement & Handouts
                    </h4>
                    {!detailData?.attachments || detailData.attachments.length === 0 ? (
                      <p className="text-xs text-slate-500">No downloadable files attached by instructor.</p>
                    ) : (
                      <div className="space-y-2">
                        {detailData.attachments.map((att, idx) => (
                          <div
                            key={idx}
                            className="flex items-center justify-between p-3 rounded-xl bg-slate-800/50 border border-slate-700/60"
                          >
                            <div className="flex items-center gap-2.5 min-w-0">
                              <FileText size={16} className="text-purple-400 flex-shrink-0" />
                              <span className="text-xs text-slate-200 font-medium truncate" title={att.FILE_NAME}>
                                {att.FILE_NAME}
                              </span>
                            </div>
                            <a
                              href={att.ATTACHMENT}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="btn btn-secondary btn-sm text-xs py-1 px-2.5 flex items-center gap-1 ml-2 flex-shrink-0"
                            >
                              <Download size={13} /> Download
                            </a>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Student Submission Status / Uploaded Files */}
                  <div>
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                      Your Submission History
                    </h4>
                    {detailData?.studAttachments && detailData.studAttachments.length > 0 ? (
                      <div className="space-y-2">
                        {detailData.studAttachments.map((sAtt, idx) => (
                          <div
                            key={idx}
                            className="flex items-center justify-between p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20"
                          >
                            <div className="flex items-center gap-2.5 min-w-0">
                              <CheckCircle2 size={16} className="text-emerald-400 flex-shrink-0" />
                              <div>
                                <span className="text-xs text-emerald-300 font-medium block truncate">
                                  {sAtt.FILE_NAME || "Submitted File"}
                                </span>
                                {sAtt.SUBMIT_DATE && (
                                  <span className="text-[10px] text-slate-400">
                                    Submitted on {sAtt.SUBMIT_DATE}
                                  </span>
                                )}
                              </div>
                            </div>
                            {sAtt.ATTACHMENT && (
                              <a
                                href={sAtt.ATTACHMENT}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn btn-secondary btn-sm text-xs py-1 px-2.5 flex items-center gap-1"
                              >
                                <Download size={13} /> View
                              </a>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-slate-500">No submission recorded for this assignment yet.</p>
                    )}
                  </div>

                  {/* Submission Form Section */}
                  <div className="pt-3 border-t border-slate-800">
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">
                      Upload & Submit Work
                    </h4>

                    {selectedAssignment.isExpired ? (
                      <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-center gap-2.5">
                        <AlertCircle size={18} className="flex-shrink-0" />
                        <div>
                          <strong>Deadline Passed ({selectedAssignment.dueDate})</strong>
                          <p className="text-[11px] text-rose-400/80 mt-0.5">
                            Submissions are disabled. The college ERP gateway strictly rejects late submissions.
                          </p>
                        </div>
                      </div>
                    ) : (
                      <form onSubmit={handleSubmit} className="space-y-3.5">
                        {/* File Picker */}
                        <div>
                          <label className="block text-xs font-medium text-slate-300 mb-1.5">
                            Upload Solution File (PDF, DOCX, ZIP • Max 10MB)
                          </label>
                          <input
                            type="file"
                            accept=".pdf,.docx,.doc,.zip,.txt"
                            onChange={handleFileChange}
                            disabled={submitting}
                            className="input w-full text-xs file:mr-3 file:py-1 file:px-2.5 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-purple-600 file:text-white hover:file:bg-purple-500"
                          />
                        </div>

                        {/* Remarks */}
                        <div>
                          <label className="block text-xs font-medium text-slate-300 mb-1.5">
                            Remarks / Submission Notes (Optional)
                          </label>
                          <textarea
                            className="input w-full text-xs p-2.5 min-h-[60px]"
                            placeholder="Add any notes or explanation for your professor..."
                            value={remarks}
                            onChange={(e) => setRemarks(e.target.value)}
                            disabled={submitting}
                          />
                        </div>

                        {/* Error or Success alerts */}
                        {submitError && (
                          <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-center gap-2">
                            <AlertCircle size={14} className="flex-shrink-0" />
                            <span>{submitError}</span>
                          </div>
                        )}

                        {submitSuccess && (
                          <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs flex items-center gap-2">
                            <CheckCircle2 size={14} className="flex-shrink-0" />
                            <span>{submitSuccess}</span>
                          </div>
                        )}

                        <div className="flex justify-end pt-2">
                          <button
                            type="submit"
                            disabled={submitting || !selectedFile}
                            className="btn btn-primary btn-sm text-xs py-2 px-4 flex items-center gap-2"
                          >
                            <Upload size={14} />
                            {submitting ? "Uploading to Official Gateway..." : "Submit to College ERP"}
                          </button>
                        </div>
                      </form>
                    )}
                  </div>
                </>
              )}
            </div>

            {/* Modal Footer */}
            <div className="pt-3 border-t border-slate-800 flex justify-between items-center text-xs text-slate-500">
              <span>Deadline: {selectedAssignment.dueDate}</span>
              <button onClick={() => setSelectedAssignment(null)} className="btn btn-secondary btn-sm text-xs">
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
