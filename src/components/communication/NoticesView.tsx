"use client";

import { useState } from "react";
import { Bell, Pin, Calendar, User, Search, Tag } from "lucide-react";
import { formatDate } from "@/lib/utils";

interface Notice {
  id: string;
  title: string;
  content: string;
  audience: string;
  isPinned: boolean;
  createdAt: string;
}

interface NoticesViewProps {
  notices: Notice[];
  role: string;
}

export function NoticesView({ notices, role }: NoticesViewProps) {
  const [search, setSearch] = useState("");
  const [audienceFilter, setAudienceFilter] = useState("ALL");

  const filtered = notices.filter((n) => {
    const matchesSearch =
      !search ||
      n.title.toLowerCase().includes(search.toLowerCase()) ||
      n.content.toLowerCase().includes(search.toLowerCase());
    const matchesAudience = audienceFilter === "ALL" || n.audience === audienceFilter;
    return matchesSearch && matchesAudience;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="page-header flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="page-title">Campus Circulars & Notices</h1>
          <p className="page-subtitle">Administrative updates, academic notifications, and event circulars</p>
        </div>
      </div>

      {/* Search and filters */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search circulars..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input pl-9 text-sm w-full"
          />
        </div>

        <div className="flex items-center gap-1.5 self-start sm:self-auto bg-slate-900/60 p-1 rounded-xl border border-white/5">
          {["ALL", "STUDENTS", "FACULTY"].map((aud) => (
            <button
              key={aud}
              onClick={() => setAudienceFilter(aud)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                audienceFilter === aud
                  ? "bg-violet-600 text-white font-semibold"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              {aud === "ALL" ? "All Notices" : aud.charAt(0) + aud.slice(1).toLowerCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Notice List */}
      <div className="space-y-4">
        {filtered.length === 0 ? (
          <div className="card text-center py-12">
            <Bell size={36} className="mx-auto text-slate-500 mb-3" />
            <h3 className="text-base font-semibold text-slate-300">No notices found</h3>
            <p className="text-xs text-slate-500 mt-1">Check back later for newly published circulars.</p>
          </div>
        ) : (
          filtered.map((notice) => (
            <div
              key={notice.id}
              className={`card p-6 space-y-3 transition-all ${
                notice.isPinned
                  ? "border-violet-500/40 bg-gradient-to-r from-violet-950/20 via-slate-900 to-slate-900"
                  : "hover:border-violet-500/20"
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2 flex-wrap">
                  {notice.isPinned && (
                    <span className="flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-violet-500/20 text-violet-300 border border-violet-500/30">
                      <Pin size={11} className="fill-violet-300" />
                      Pinned Announcement
                    </span>
                  )}
                  <span className="badge badge-cyan">{notice.audience}</span>
                </div>
                <div className="flex items-center gap-1 text-xs text-slate-400">
                  <Calendar size={13} className="text-slate-500" />
                  <span>{formatDate(notice.createdAt)}</span>
                </div>
              </div>

              <h3 className="text-base font-bold text-slate-100">{notice.title}</h3>
              <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-line">
                {notice.content}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
