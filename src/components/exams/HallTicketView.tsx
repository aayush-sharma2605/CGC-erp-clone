"use client";

import { Printer, Download, ShieldCheck, Calendar, Clock, MapPin } from "lucide-react";
import { formatDate } from "@/lib/utils";

interface ExamSubject {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  room?: string | null;
  course: { name: string; code: string };
}

interface HallTicketViewProps {
  student: {
    firstName: string;
    lastName: string;
    enrollmentNo: string;
    currentSemester: number;
    department: { name: string; code: string };
  };
  registration: {
    hallTicketNo: string;
    exam: {
      name: string;
      subjects: ExamSubject[];
    };
  } | null;
}

export function HallTicketView({ student, registration }: HallTicketViewProps) {
  const handlePrint = () => {
    window.print();
  };

  if (!registration) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="page-header">
          <h1 className="page-title">Examination Hall Ticket</h1>
          <p className="page-subtitle">Download and verify your official examination admit card</p>
        </div>
        <div className="card text-center py-16">
          <ShieldCheck size={40} className="mx-auto text-slate-500 mb-3" />
          <h3 className="text-base font-semibold text-slate-300">No Active Hall Ticket Found</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
            You must register for the upcoming examination under the Exam Registration module before your hall ticket can be generated.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="page-header flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="page-title">Examination Hall Ticket</h1>
          <p className="page-subtitle">Official admit card for {registration.exam.name}</p>
        </div>
        <button onClick={handlePrint} className="btn btn-primary text-xs flex items-center gap-2">
          <Printer size={15} />
          <span>Print / Save PDF</span>
        </button>
      </div>

      {/* Hall Ticket Document Preview */}
      <div className="max-w-3xl mx-auto card p-8 border-violet-500/30 bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 relative overflow-hidden shadow-2xl">
        {/* Watermark / Seal */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.03] pointer-events-none select-none text-center">
          <span className="text-[120px] font-black tracking-widest text-white">CAMPUS</span>
        </div>

        {/* Institution Header */}
        <div className="text-center border-b border-white/10 pb-6 mb-6">
          <span className="text-xs tracking-widest uppercase font-semibold text-violet-400">
            Autonomous Institute of Technology & Management
          </span>
          <h2 className="text-xl font-black text-slate-100 uppercase tracking-wide mt-1">
            Official Admit Card / Hall Ticket
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">{registration.exam.name}</p>
        </div>

        {/* Student & Pass Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6 p-4 rounded-xl bg-slate-950/60 border border-white/5">
          <div className="md:col-span-2 space-y-2 text-xs">
            <div className="grid grid-cols-3 gap-2">
              <span className="text-slate-500 font-medium">Candidate Name:</span>
              <span className="col-span-2 font-bold text-slate-200 uppercase">
                {student.firstName} {student.lastName}
              </span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <span className="text-slate-500 font-medium">Enrollment No:</span>
              <span className="col-span-2 font-mono font-bold text-violet-300">
                {student.enrollmentNo}
              </span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <span className="text-slate-500 font-medium">Programme:</span>
              <span className="col-span-2 text-slate-300">
                B.Tech in {student.department.name}
              </span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <span className="text-slate-500 font-medium">Semester:</span>
              <span className="col-span-2 text-slate-300">Semester {student.currentSemester}</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <span className="text-slate-500 font-medium">Hall Ticket No:</span>
              <span className="col-span-2 font-mono font-bold text-emerald-400">
                {registration.hallTicketNo}
              </span>
            </div>
          </div>

          {/* QR Code and verification box */}
          <div className="flex flex-col items-center justify-center p-3 rounded-lg bg-slate-900 border border-white/10">
            <div className="w-24 h-24 bg-white p-2 rounded-lg flex items-center justify-center shadow-inner">
              {/* Simulated QR Code matrix */}
              <div className="w-full h-full border-2 border-black grid grid-cols-4 grid-rows-4 gap-0.5 p-0.5">
                <div className="bg-black col-span-2 row-span-2"></div>
                <div className="bg-black"></div>
                <div className="bg-transparent"></div>
                <div className="bg-black"></div>
                <div className="bg-black"></div>
                <div className="bg-black"></div>
                <div className="bg-transparent"></div>
                <div className="bg-black col-span-2 row-span-2"></div>
                <div className="bg-black"></div>
                <div className="bg-black"></div>
              </div>
            </div>
            <span className="text-[10px] text-slate-400 mt-2 font-mono">
              VERIFIED ADMIT CODE
            </span>
          </div>
        </div>

        {/* Paper Schedule Table */}
        <div className="mb-6 overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-white/10 text-slate-400 uppercase text-[11px]">
                <th className="py-2.5 px-3">Subject Code</th>
                <th className="py-2.5 px-3">Course Title</th>
                <th className="py-2.5 px-3">Exam Date</th>
                <th className="py-2.5 px-3">Timing</th>
                <th className="py-2.5 px-3">Room / Hall</th>
                <th className="py-2.5 px-3 text-center">Invigilator Sign</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-slate-300">
              {registration.exam.subjects.map((sub) => (
                <tr key={sub.id} className="hover:bg-white/[0.02]">
                  <td className="py-2.5 px-3 font-mono font-semibold text-violet-400">
                    {sub.course.code}
                  </td>
                  <td className="py-2.5 px-3 font-medium text-slate-100">{sub.course.name}</td>
                  <td className="py-2.5 px-3">{formatDate(sub.date)}</td>
                  <td className="py-2.5 px-3">{sub.startTime} – {sub.endTime}</td>
                  <td className="py-2.5 px-3">{sub.room || "Main Auditorium"}</td>
                  <td className="py-2.5 px-3 border border-white/5 text-center text-slate-600">
                    [ ——— ]
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Instructions & Signatures */}
        <div className="border-t border-white/10 pt-4 flex flex-col sm:flex-row items-end justify-between gap-6 text-xs text-slate-500">
          <div className="space-y-1 max-w-sm text-[11px]">
            <p className="font-semibold text-slate-400 uppercase">Important Instructions:</p>
            <p>1. Candidates must arrive at the examination venue 30 minutes before commencement.</p>
            <p>2. Possession of mobile phones, smartwatches, or programmable calculators is strictly prohibited.</p>
            <p>3. This Hall Ticket along with College ID Card is mandatory for entry.</p>
          </div>

          <div className="text-center sm:text-right space-y-1">
            <div className="h-10 border-b border-dashed border-slate-700 w-44 inline-block mb-1"></div>
            <p className="font-bold text-slate-300 uppercase text-[11px]">Controller of Examinations</p>
            <p className="text-[10px] text-slate-500">Autonomous Examination Cell</p>
          </div>
        </div>
      </div>
    </div>
  );
}
