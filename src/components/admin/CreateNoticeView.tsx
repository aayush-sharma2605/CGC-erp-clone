"use client";

import { useState } from "react";
import { Megaphone, Pin, Send, CheckCircle2 } from "lucide-react";
import { useRouter } from "next/navigation";

export function CreateNoticeView() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [audience, setAudience] = useState("ALL");
  const [isPinned, setIsPinned] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch("/api/notices", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, content, audience, isPinned }),
      });
      if (res.ok) {
        setSuccess(true);
        setTimeout(() => {
          router.push("/dashboard/notices");
        }, 1200);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-3xl">
      <div className="page-header">
        <h1 className="page-title">Broadcast Notice / Circular</h1>
        <p className="page-subtitle">Publish official announcements across candidate and faculty portals</p>
      </div>

      <div className="card p-8">
        {success ? (
          <div className="text-center py-12 space-y-3">
            <CheckCircle2 size={48} className="mx-auto text-emerald-400" />
            <h3 className="text-lg font-bold text-slate-100">Circular Published Successfully!</h3>
            <p className="text-xs text-slate-400">Redirecting to active notices directory...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Circular Title</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Schedule for End-Term Practical Examinations 2024"
                className="input w-full text-sm"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Target Audience</label>
                <select
                  value={audience}
                  onChange={(e) => setAudience(e.target.value)}
                  className="input w-full text-sm"
                >
                  <option value="ALL">All Campus (Students, Faculty, Staff)</option>
                  <option value="STUDENTS">Students Only</option>
                  <option value="FACULTY">Faculty & Staff Only</option>
                  <option value="DEPARTMENT">Specific Department</option>
                </select>
              </div>

              <div className="flex items-center gap-3 pt-6">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-300">
                  <input
                    type="checkbox"
                    checked={isPinned}
                    onChange={(e) => setIsPinned(e.target.checked)}
                    className="w-4 h-4 rounded border-slate-700 bg-slate-900 text-violet-600 focus:ring-violet-500"
                  />
                  <span>Pin as Priority Announcement</span>
                </label>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Full Circular Content</label>
              <textarea
                required
                rows={8}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Type the detailed circular instructions, guidelines, schedules, or contact information..."
                className="input w-full text-sm leading-relaxed"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/5">
              <button
                type="button"
                onClick={() => router.back()}
                className="btn btn-ghost text-xs"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="btn btn-primary text-xs flex items-center gap-2"
              >
                <Megaphone size={14} />
                <span>{submitting ? "Publishing..." : "Publish Circular"}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
