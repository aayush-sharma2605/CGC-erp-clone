"use client";

import { useState } from "react";
import { Calendar as CalendarIcon, Clock, MapPin, User, BookOpen } from "lucide-react";
import { cn } from "@/lib/utils";

interface Slot {
  id: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  room?: string | null;
  course: { name: string; code: string; credits: number };
  faculty?: { firstName: string; lastName: string } | null;
}

interface TimetableViewProps {
  slots: Slot[];
  role: string;
}

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export function TimetableView({ slots, role }: TimetableViewProps) {
  const [selectedDay, setSelectedDay] = useState<number>(0);

  const filteredSlots = slots
    .filter((s) => s.dayOfWeek === selectedDay)
    .sort((a, b) => a.startTime.localeCompare(b.startTime));

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="page-header flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="page-title">Weekly Timetable</h1>
          <p className="page-subtitle">Schedule, lecture halls, and faculty allocation</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="badge badge-purple">Semester 5</span>
          <span className="badge badge-cyan">Session 2024-25</span>
        </div>
      </div>

      {/* Day selector tabs */}
      <div className="flex overflow-x-auto gap-2 pb-2 border-b" style={{ borderColor: "rgb(255 255 255 / 0.08)" }}>
        {DAYS.map((day, idx) => {
          const count = slots.filter((s) => s.dayOfWeek === idx).length;
          const isSelected = selectedDay === idx;
          return (
            <button
              key={day}
              onClick={() => setSelectedDay(idx)}
              className={cn(
                "px-4 py-2.5 rounded-xl font-medium text-sm transition-all flex items-center gap-2 whitespace-nowrap",
                isSelected
                  ? "bg-violet-600 text-white shadow-lg shadow-violet-500/25"
                  : "hover:bg-white/5 text-slate-400 hover:text-slate-200"
              )}
            >
              <span>{day}</span>
              <span
                className={cn(
                  "text-xs px-1.5 py-0.5 rounded-full font-bold",
                  isSelected ? "bg-white/20 text-white" : "bg-slate-800 text-slate-400"
                )}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Slots list */}
      {filteredSlots.length === 0 ? (
        <div className="card text-center py-12">
          <CalendarIcon size={36} className="mx-auto text-slate-500 mb-3" />
          <h3 className="text-base font-semibold text-slate-300">No lectures scheduled</h3>
          <p className="text-xs text-slate-500 mt-1">There are no classes scheduled for {DAYS[selectedDay]}.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredSlots.map((slot) => (
            <div
              key={slot.id}
              className="card p-5 relative overflow-hidden group hover:border-violet-500/40 transition-all hover:-translate-y-0.5"
            >
              <div className="flex items-start justify-between gap-3 mb-3">
                <span className="font-mono text-xs px-2 py-0.5 rounded bg-violet-500/10 text-violet-400 font-semibold border border-violet-500/20">
                  {slot.course.code}
                </span>
                <div className="flex items-center gap-1.5 text-xs text-slate-400">
                  <Clock size={14} className="text-violet-400" />
                  <span>{slot.startTime} – {slot.endTime}</span>
                </div>
              </div>

              <h4 className="font-semibold text-slate-100 text-base mb-2 group-hover:text-violet-300 transition-colors">
                {slot.course.name}
              </h4>

              <div className="space-y-1.5 text-xs text-slate-400 border-t pt-3 mt-3" style={{ borderColor: "rgb(255 255 255 / 0.06)" }}>
                {slot.faculty && (
                  <div className="flex items-center gap-2">
                    <User size={13} className="text-slate-500" />
                    <span>Prof. {slot.faculty.firstName} {slot.faculty.lastName}</span>
                  </div>
                )}
                {slot.room && (
                  <div className="flex items-center gap-2">
                    <MapPin size={13} className="text-slate-500" />
                    <span>{slot.room}</span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <BookOpen size={13} className="text-slate-500" />
                  <span>{slot.course.credits} Credits</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
