"use client";

import { useState } from "react";
import { PenTool, Calendar, Clock, MapPin, CheckCircle2, AlertCircle } from "lucide-react";
import { formatDate } from "@/lib/utils";

interface ExamSubject {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  room?: string | null;
  maxMarks: number;
  passingMarks: number;
  course: { name: string; code: string; credits: number };
}

interface Exam {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  status: string;
  subjects: ExamSubject[];
  isRegistered: boolean;
  hallTicketNo?: string | null;
}

interface ExamsViewProps {
  exams: Exam[];
  role: string;
}

export function ExamsView({ exams, role }: ExamsViewProps) {
  const [registeringId, setRegisteringId] = useState<string | null>(null);

  const handleRegister = async (examId: string) => {
    setRegisteringId(examId);
    try {
      const res = await fetch("/api/exams/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ examId }),
      });
      if (res.ok) {
        window.location.reload();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setRegisteringId(null);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="page-header flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="page-title">Examinations & Registration</h1>
          <p className="page-subtitle">Examination schedules, eligibility status, and enrollment</p>
        </div>
      </div>

      <div className="space-y-6">
        {exams.length === 0 ? (
          <div className="card text-center py-12">
            <PenTool size={36} className="mx-auto text-slate-500 mb-3" />
            <h3 className="text-base font-semibold text-slate-300">No examinations currently scheduled</h3>
            <p className="text-xs text-slate-500 mt-1">Check back when the examination cell announces the session timetable.</p>
          </div>
        ) : (
          exams.map((exam) => (
            <div key={exam.id} className="card p-6 space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-4">
                <div>
                  <div className="flex items-center gap-3">
                    <h2 className="text-lg font-bold text-slate-100">{exam.name}</h2>
                    <span className="badge badge-purple">{exam.status}</span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-slate-400 mt-1.5">
                    <span className="flex items-center gap-1">
                      <Calendar size={13} className="text-slate-500" />
                      {formatDate(exam.startDate)} – {formatDate(exam.endDate)}
                    </span>
                    <span>·</span>
                    <span>{exam.subjects.length} Subjects</span>
                  </div>
                </div>

                <div>
                  {exam.isRegistered ? (
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
                      <CheckCircle2 size={16} />
                      <span>Registered (HT: {exam.hallTicketNo})</span>
                    </div>
                  ) : (
                    <button
                      onClick={() => handleRegister(exam.id)}
                      disabled={registeringId === exam.id}
                      className="btn btn-primary text-xs"
                    >
                      {registeringId === exam.id ? "Registering..." : "Register for Examination"}
                    </button>
                  )}
                </div>
              </div>

              {/* Subject timeline */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Subject-wise Schedule
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {exam.subjects.map((sub) => (
                    <div
                      key={sub.id}
                      className="p-4 rounded-xl bg-slate-900/50 border border-white/5 flex items-center justify-between gap-3 hover:border-violet-500/20 transition-colors"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs text-violet-400 font-semibold">
                            {sub.course.code}
                          </span>
                          <span className="text-xs font-semibold text-slate-200">
                            {sub.course.name}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 text-[11px] text-slate-400">
                          <span className="flex items-center gap-1">
                            <Calendar size={11} className="text-slate-500" />
                            {formatDate(sub.date)}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock size={11} className="text-slate-500" />
                            {sub.startTime} – {sub.endTime}
                          </span>
                          {sub.room && (
                            <span className="flex items-center gap-1">
                              <MapPin size={11} className="text-slate-500" />
                              {sub.room}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="text-right text-xs">
                        <span className="text-slate-400">Max: {sub.maxMarks}</span>
                        <div className="text-[10px] text-slate-500">Pass: {sub.passingMarks}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
