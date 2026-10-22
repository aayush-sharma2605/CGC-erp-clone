"use client";

import { useState } from "react";
import { MessageSquare, Star, Plus, Send, CheckCircle2 } from "lucide-react";
import { formatDate } from "@/lib/utils";

interface FeedbackItem {
  id: string;
  subject: string;
  message: string;
  rating?: number | null;
  createdAt: string;
}

interface FeedbackViewProps {
  feedbacks: FeedbackItem[];
  role: string;
}

export function FeedbackView({ feedbacks, role }: FeedbackViewProps) {
  const [showModal, setShowModal] = useState(false);
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [rating, setRating] = useState<number>(5);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subject, message, rating }),
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

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="page-header flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="page-title">Course & Faculty Feedback</h1>
          <p className="page-subtitle">Submit constructive feedback on academic curriculum, teaching quality, and facilities</p>
        </div>
        {role === "STUDENT" && (
          <button onClick={() => setShowModal(true)} className="btn btn-primary text-xs flex items-center gap-2">
            <Plus size={16} />
            <span>Submit Feedback</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {feedbacks.length === 0 ? (
          <div className="col-span-full card text-center py-12">
            <MessageSquare size={36} className="mx-auto text-slate-500 mb-3" />
            <h3 className="text-base font-semibold text-slate-300">No feedback submitted</h3>
            <p className="text-xs text-slate-500 mt-1">Your feedback helps improve curriculum delivery and laboratory experiences.</p>
          </div>
        ) : (
          feedbacks.map((fb) => (
            <div key={fb.id} className="card p-5 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      size={14}
                      className={star <= (fb.rating || 5) ? "fill-amber-400 text-amber-400" : "text-slate-600"}
                    />
                  ))}
                </div>
                <span className="text-[11px] text-slate-500">{formatDate(fb.createdAt)}</span>
              </div>
              <h4 className="font-bold text-slate-100 text-sm">{fb.subject}</h4>
              <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/40 p-3 rounded-lg border border-white/5">
                {fb.message}
              </p>
            </div>
          ))
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <form onSubmit={handleSubmit} className="card p-6 max-w-md w-full space-y-4 animate-scale-in">
            <h3 className="text-lg font-bold text-slate-100">Submit Academic Feedback</h3>
            <div className="space-y-1">
              <label className="text-xs text-slate-400">Subject / Course / Facility</label>
              <input
                type="text"
                required
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="e.g. CS302 Database Lab Hardware Performance"
                className="input w-full text-sm"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs text-slate-400">Rating (1 to 5 Stars)</label>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className="p-1 hover:scale-110 transition-transform"
                  >
                    <Star
                      size={20}
                      className={star <= rating ? "fill-amber-400 text-amber-400" : "text-slate-600"}
                    />
                  </button>
                ))}
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-xs text-slate-400">Feedback Description</label>
              <textarea
                required
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Share your detailed observations and constructive suggestions..."
                className="input w-full text-sm"
              />
            </div>
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/5">
              <button type="button" onClick={() => setShowModal(false)} className="btn btn-ghost text-xs">
                Cancel
              </button>
              <button type="submit" disabled={submitting} className="btn btn-primary text-xs">
                {submitting ? "Submitting..." : "Send Feedback"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
