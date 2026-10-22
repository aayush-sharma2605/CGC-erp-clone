"use client";

import { useState, useMemo } from "react";
import { getAttendanceColor, getStatusColor, formatDate } from "@/lib/utils";
import {
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Clock,
  BookOpen,
  Calendar,
  X,
  Layers,
  ListFilter,
  Sparkles,
  Info,
} from "lucide-react";

export interface SubjectAttendanceItem {
  courseNo: string;
  courseCode: string;
  courseName: string;
  category?: string; // Theory, Practical, etc.
  totalClasses: number;
  presentClasses: number;
  absentClasses: number;
  percentage: number;
  status: "ELIGIBLE" | "SHORTAGE";
  canBunk: number;
  needsToAttend: number;
}

export interface AttendanceStats {
  overallPct: number;
  totalClasses: number;
  presentClasses: number;
  absentClasses: number;
}

export interface AttendanceRecord {
  id: string;
  date: string;
  period: number | string;
  status: string;
  course: { name: string; code: string };
  remarks?: string | null;
}

interface AttendanceViewProps {
  records?: AttendanceRecord[];
  subjectSummaries?: SubjectAttendanceItem[];
  stats?: AttendanceStats;
  role: string;
}

interface LectureDetail {
  AttDate: string;
  AttStatus: string | number;
  Period: string;
}

export function AttendanceView({
  records = [],
  subjectSummaries = [],
  stats: initialStats,
  role,
}: AttendanceViewProps) {
  const [activeTab, setActiveTab] = useState<"subjects" | "logs">(
    subjectSummaries.length > 0 ? "subjects" : "logs"
  );
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [categoryFilter, setCategoryFilter] = useState("ALL");
  const [logStatusFilter, setLogStatusFilter] = useState("ALL");
  const [logCourseFilter, setLogCourseFilter] = useState("ALL");

  // Selected subject for lecture drill-down modal
  const [selectedSubject, setSelectedSubject] = useState<SubjectAttendanceItem | null>(null);
  const [lectures, setLectures] = useState<LectureDetail[]>([]);
  const [loadingLectures, setLoadingLectures] = useState(false);
  const [lectureError, setLectureError] = useState<string | null>(null);

  // Compute stats if not explicitly passed
  const stats = useMemo(() => {
    if (initialStats) return initialStats;

    if (subjectSummaries.length > 0) {
      const total = subjectSummaries.reduce((sum, s) => sum + s.totalClasses, 0);
      const present = subjectSummaries.reduce((sum, s) => sum + s.presentClasses, 0);
      const absent = subjectSummaries.reduce((sum, s) => sum + s.absentClasses, 0);
      const pct = total > 0 ? Math.round((present / total) * 1000) / 10 : 0;
      return {
        overallPct: pct,
        totalClasses: total,
        presentClasses: present,
        absentClasses: absent,
      };
    }

    const total = records.length;
    const present = records.filter((r) => r.status === "PRESENT" || r.status === "LATE").length;
    const absent = records.filter((r) => r.status === "ABSENT").length;
    const pct = total > 0 ? Math.round((present / total) * 100) : 0;
    return {
      overallPct: pct,
      totalClasses: total,
      presentClasses: present,
      absentClasses: absent,
    };
  }, [initialStats, subjectSummaries, records]);

  // Categories present in subject summaries
  const categories = useMemo(() => {
    const set = new Set<string>();
    subjectSummaries.forEach((s) => {
      if (s.category) set.add(s.category);
    });
    return Array.from(set);
  }, [subjectSummaries]);

  // Filtered subjects
  const filteredSubjects = useMemo(() => {
    return subjectSummaries.filter((s) => {
      const matchSearch =
        !search ||
        s.courseName.toLowerCase().includes(search.toLowerCase()) ||
        s.courseCode.toLowerCase().includes(search.toLowerCase());
      const matchStatus =
        statusFilter === "ALL" ||
        (statusFilter === "ELIGIBLE" && s.percentage >= 75) ||
        (statusFilter === "SHORTAGE" && s.percentage < 75);
      const matchCategory =
        categoryFilter === "ALL" || s.category === categoryFilter;

      return matchSearch && matchStatus && matchCategory;
    });
  }, [subjectSummaries, search, statusFilter, categoryFilter]);

  // Filtered raw records
  const logCourses = useMemo(
    () => [...new Set(records.map((r) => r.course.name))],
    [records]
  );

  const filteredLogs = useMemo(() => {
    return records.filter((r) => {
      const matchSearch =
        !search ||
        r.course.name.toLowerCase().includes(search.toLowerCase()) ||
        r.course.code.toLowerCase().includes(search.toLowerCase());
      const matchStatus = logStatusFilter === "ALL" || r.status === logStatusFilter;
      const matchCourse = logCourseFilter === "ALL" || r.course.name === logCourseFilter;
      return matchSearch && matchStatus && matchCourse;
    });
  }, [records, search, logStatusFilter, logCourseFilter]);

  // Fetch lecture history on click
  const handleOpenLectures = async (subject: SubjectAttendanceItem) => {
    setSelectedSubject(subject);
    setLoadingLectures(true);
    setLectureError(null);
    setLectures([]);

    try {
      const res = await fetch(`/api/attendance/subject?courseNo=${encodeURIComponent(subject.courseNo)}`);
      const data = await res.json();
      if (!res.ok || data.error) {
        throw new Error(data.error || "Failed to fetch lecture history");
      }
      setLectures(data.lectures || []);
    } catch (err: any) {
      setLectureError(err.message || "Failed to load lecture details");
    } finally {
      setLoadingLectures(false);
    }
  };

  const isEligible = stats.overallPct >= 75;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* ── Page Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="page-title">Attendance Overview</h1>
          <p className="page-subtitle">
            Live attendance tracking, subject-wise performance, and compliance metrics
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold ${
              isEligible
                ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                : "bg-rose-500/10 text-rose-400 border border-rose-500/20"
            }`}
          >
            {isEligible ? (
              <>
                <CheckCircle2 size={14} /> Exam Eligible (≥75%)
              </>
            ) : (
              <>
                <AlertCircle size={14} /> Attendance Shortage (&lt;75%)
              </>
            )}
          </span>
        </div>
      </div>

      {/* ── Top Summary Metrics ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          {
            label: "Overall Attendance",
            value: `${stats.overallPct}%`,
            sub: isEligible ? "Safe (≥ 75%)" : "Requires Attention",
            color:
              stats.overallPct >= 75
                ? "rgb(52 211 153)"
                : stats.overallPct >= 60
                ? "rgb(251 191 36)"
                : "rgb(251 113 133)",
          },
          {
            label: "Classes Attended",
            value: stats.presentClasses,
            sub: "Present / Present slots",
            color: "rgb(52 211 153)",
          },
          {
            label: "Classes Absent",
            value: stats.absentClasses,
            sub: "Missed lectures",
            color: "rgb(251 113 133)",
          },
          {
            label: "Total Classes",
            value: stats.totalClasses,
            sub: "Conducted so far",
            color: "rgb(139 92 246)",
          },
        ].map((s) => (
          <div key={s.label} className="card p-5 text-center flex flex-col justify-center">
            <p className="text-3xl font-extrabold tracking-tight" style={{ color: s.color }}>
              {s.value}
            </p>
            <p className="text-sm font-medium mt-1" style={{ color: "rgb(241 245 249)" }}>
              {s.label}
            </p>
            <p className="text-xs mt-0.5" style={{ color: "rgb(100 116 139)" }}>
              {s.sub}
            </p>
          </div>
        ))}
      </div>

      {/* ── Tabs (Subject-wise vs Daily Logs) ── */}
      {subjectSummaries.length > 0 && records.length > 0 && (
        <div className="flex border-b" style={{ borderColor: "rgb(30 41 59)" }}>
          <button
            onClick={() => setActiveTab("subjects")}
            className={`pb-3 px-4 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === "subjects"
                ? "border-purple-500 text-purple-400 font-semibold"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            <Layers size={16} />
            Subject-wise Attendance ({subjectSummaries.length})
          </button>
          <button
            onClick={() => setActiveTab("logs")}
            className={`pb-3 px-4 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === "logs"
                ? "border-purple-500 text-purple-400 font-semibold"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            <ListFilter size={16} />
            Class Logs & History
          </button>
        </div>
      )}

      {/* ── View 1: Subject-Wise Attendance ── */}
      {(activeTab === "subjects" || subjectSummaries.length > 0) && (
        <div className="space-y-4">
          {/* Controls */}
          <div className="card p-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search
                  size={15}
                  className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
                  style={{ color: "rgb(71 85 105)" }}
                />
                <input
                  className="input pl-9 w-full"
                  placeholder="Search subject by name or code..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>

              <select
                className="input"
                style={{ maxWidth: "180px" }}
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="ALL">All Status</option>
                <option value="ELIGIBLE">Eligible (≥75%)</option>
                <option value="SHORTAGE">Shortage (&lt;75%)</option>
              </select>

              {categories.length > 0 && (
                <select
                  className="input"
                  style={{ maxWidth: "180px" }}
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                >
                  <option value="ALL">All Types</option>
                  {categories.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              )}
            </div>
          </div>

          {/* Subjects Table / Cards */}
          {filteredSubjects.length === 0 ? (
            <div className="card py-12 text-center empty-state">
              <BookOpen size={36} className="mx-auto mb-2 text-slate-600" />
              <p className="text-slate-400 font-medium">No matching subjects found</p>
              <p className="text-xs text-slate-500 mt-1">Try adjusting your search query or filters</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredSubjects.map((sub) => {
                const colorClass = getAttendanceColor(sub.percentage);
                const isSubEligible = sub.percentage >= 75;

                return (
                  <div
                    key={sub.courseNo}
                    className="card p-5 flex flex-col justify-between hover:border-slate-700 transition-all duration-150"
                  >
                    <div>
                      {/* Top Header of Subject Card */}
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <div className="min-w-0">
                          <h3
                            className="font-semibold text-base leading-snug truncate"
                            style={{ color: "rgb(241 245 249)" }}
                            title={sub.courseName}
                          >
                            {sub.courseName}
                          </h3>
                          <div className="flex items-center gap-2 mt-1">
                            <span
                              className="font-mono text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700/50"
                            >
                              {sub.courseCode || `C-${sub.courseNo}`}
                            </span>
                            {sub.category && (
                              <span
                                className={`text-xs px-2 py-0.5 rounded font-medium ${
                                  sub.category.toLowerCase().includes("lab") ||
                                  sub.category.toLowerCase().includes("practical")
                                    ? "bg-purple-500/10 text-purple-400 border border-purple-500/20"
                                    : "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                                }`}
                              >
                                {sub.category}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Percentage badge */}
                        <div className="text-right flex-shrink-0">
                          <span
                            className={`text-2xl font-black ${colorClass}`}
                          >
                            {sub.percentage}%
                          </span>
                          <p className="text-xs font-medium text-slate-400 mt-0.5">
                            {sub.presentClasses}/{sub.totalClasses} classes
                          </p>
                        </div>
                      </div>

                      {/* Progress Bar */}
                      <div className="mt-3">
                        <div className="progress-bar h-2 bg-slate-800 rounded-full overflow-hidden">
                          <div
                            className="progress-fill h-full transition-all duration-300"
                            style={{
                              width: `${Math.min(100, Math.max(0, sub.percentage))}%`,
                              background:
                                sub.percentage >= 75
                                  ? "rgb(52 211 153)"
                                  : sub.percentage >= 60
                                  ? "rgb(251 191 36)"
                                  : "rgb(251 113 133)",
                            }}
                          />
                        </div>
                      </div>

                      {/* Smart Guidance / Advice */}
                      <div className="mt-3.5 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                        {isSubEligible ? (
                          <span className="text-emerald-400 flex items-center gap-1.5">
                            <CheckCircle2 size={13} />
                            {sub.canBunk > 0 ? (
                              <span>
                                Can miss up to <strong>{sub.canBunk}</strong> lecture(s) safely
                              </span>
                            ) : (
                              <span>On the 75% boundary — attend next lecture</span>
                            )}
                          </span>
                        ) : (
                          <span className="text-rose-400 flex items-center gap-1.5">
                            <AlertCircle size={13} />
                            <span>
                              Needs <strong>{sub.needsToAttend}</strong> consecutive class(es) for 75%
                            </span>
                          </span>
                        )}

                        <span className="text-slate-500">
                          Absent: <strong>{sub.absentClasses}</strong>
                        </span>
                      </div>
                    </div>

                    {/* Drill-down action */}
                    <div className="mt-4 pt-3 border-t border-slate-800/50 flex justify-end">
                      <button
                        onClick={() => handleOpenLectures(sub)}
                        className="btn btn-secondary btn-sm text-xs py-1.5 px-3 flex items-center gap-1.5"
                      >
                        <Calendar size={13} />
                        View Lecture Records
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ── View 2: Flat Class Logs Table (when activeTab is logs) ── */}
      {activeTab === "logs" && (
        <div className="card">
          <div className="flex flex-col sm:flex-row gap-3 mb-5">
            <div className="relative flex-1">
              <Search
                size={15}
                className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
                style={{ color: "rgb(71 85 105)" }}
              />
              <input
                className="input pl-9"
                placeholder="Search subject…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <select
              className="input"
              style={{ maxWidth: "180px" }}
              value={logStatusFilter}
              onChange={(e) => setLogStatusFilter(e.target.value)}
            >
              <option value="ALL">All Status</option>
              <option value="PRESENT">Present</option>
              <option value="ABSENT">Absent</option>
              <option value="LATE">Late</option>
              <option value="EXCUSED">Excused</option>
            </select>
            <select
              className="input"
              style={{ maxWidth: "220px" }}
              value={logCourseFilter}
              onChange={(e) => setLogCourseFilter(e.target.value)}
            >
              <option value="ALL">All Subjects</option>
              {logCourses.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Subject</th>
                  <th>Period / Slot</th>
                  <th>Status</th>
                  <th>Remarks</th>
                </tr>
              </thead>
              <tbody>
                {filteredLogs.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center py-12" style={{ color: "rgb(71 85 105)" }}>
                      No attendance log records found
                    </td>
                  </tr>
                ) : (
                  filteredLogs.map((r) => (
                    <tr key={r.id}>
                      <td className="text-sm">{formatDate(r.date)}</td>
                      <td>
                        <div className="font-medium text-sm" style={{ color: "rgb(203 213 225)" }}>
                          {r.course.name}
                        </div>
                        <div className="text-xs font-mono" style={{ color: "rgb(71 85 105)" }}>
                          {r.course.code}
                        </div>
                      </td>
                      <td className="text-sm">{r.period}</td>
                      <td>
                        <span className={`badge text-xs ${getStatusColor(r.status)}`}>
                          {r.status}
                        </span>
                      </td>
                      <td className="text-xs" style={{ color: "rgb(100 116 139)" }}>
                        {r.remarks ?? "—"}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          <p className="text-xs mt-3" style={{ color: "rgb(71 85 105)" }}>
            Showing {filteredLogs.length} of {records.length} records
          </p>
        </div>
      )}

      {/* ── Drill-Down Lecture History Modal ── */}
      {selectedSubject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
          <div
            className="card max-w-2xl w-full max-h-[85vh] flex flex-col p-6 shadow-2xl border border-slate-700 bg-slate-900"
            role="dialog"
            aria-modal="true"
          >
            {/* Modal Header */}
            <div className="flex items-start justify-between pb-4 border-b border-slate-800">
              <div>
                <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                  <Calendar size={18} className="text-purple-400" />
                  {selectedSubject.courseName}
                </h2>
                <div className="flex items-center gap-2 mt-1 text-xs text-slate-400">
                  <span className="font-mono">{selectedSubject.courseCode}</span>
                  <span>•</span>
                  <span>{selectedSubject.presentClasses} of {selectedSubject.totalClasses} classes attended</span>
                  <span>•</span>
                  <span className={`font-bold ${getAttendanceColor(selectedSubject.percentage)}`}>
                    {selectedSubject.percentage}%
                  </span>
                </div>
              </div>
              <button
                onClick={() => setSelectedSubject(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
                aria-label="Close"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto py-4">
              {loadingLectures ? (
                <div className="py-12 text-center text-slate-400 flex flex-col items-center justify-center gap-3">
                  <div className="w-6 h-6 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
                  <p className="text-sm">Loading marked lecture slots from college ERP gateway...</p>
                </div>
              ) : lectureError ? (
                <div className="p-4 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm">
                  {lectureError}
                </div>
              ) : lectures.length === 0 ? (
                <div className="py-12 text-center text-slate-500">
                  <Info size={32} className="mx-auto mb-2 text-slate-600" />
                  <p className="text-sm">No lecture-level records returned for this subject.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Date</th>
                        <th>Time Slot / Period</th>
                        <th>Attendance Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {lectures.map((lec, idx) => {
                        const isPresent = String(lec.AttStatus) === "1" || String(lec.AttStatus).toLowerCase() === "present";
                        return (
                          <tr key={`${lec.AttDate}-${idx}`}>
                            <td className="text-xs text-slate-500">{idx + 1}</td>
                            <td className="text-sm font-medium text-slate-200">{lec.AttDate}</td>
                            <td className="text-sm text-slate-400 font-mono text-xs">
                              {lec.Period || "Regular Session"}
                            </td>
                            <td>
                              <span
                                className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-xs font-semibold ${
                                  isPresent
                                    ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                                    : "bg-rose-500/15 text-rose-400 border border-rose-500/30"
                                }`}
                              >
                                {isPresent ? (
                                  <>
                                    <CheckCircle2 size={12} /> Present
                                  </>
                                ) : (
                                  <>
                                    <XCircle size={12} /> Absent
                                  </>
                                )}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="pt-3 border-t border-slate-800 flex justify-between items-center text-xs text-slate-500">
              <span>Total marked lectures: {lectures.length}</span>
              <button
                onClick={() => setSelectedSubject(null)}
                className="btn btn-secondary btn-sm text-xs"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
