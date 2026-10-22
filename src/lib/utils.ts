import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date | string): string {
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(date));
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
  }).format(amount);
}

export function getInitials(firstName: string, lastName: string): string {
  return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
}

export function getAttendanceColor(percentage: number): string {
  if (percentage >= 75) return "text-emerald-400";
  if (percentage >= 60) return "text-amber-400";
  return "text-red-400";
}

export function getAttendanceBg(percentage: number): string {
  if (percentage >= 75) return "bg-emerald-500/10 border-emerald-500/20";
  if (percentage >= 60) return "bg-amber-500/10 border-amber-500/20";
  return "bg-red-500/10 border-red-500/20";
}

export function getStatusColor(status: string): string {
  const map: Record<string, string> = {
    PENDING: "text-amber-400 bg-amber-400/10",
    APPROVED: "text-emerald-400 bg-emerald-400/10",
    REJECTED: "text-red-400 bg-red-400/10",
    CANCELLED: "text-slate-400 bg-slate-400/10",
    PAID: "text-emerald-400 bg-emerald-400/10",
    PARTIAL: "text-amber-400 bg-amber-400/10",
    OVERDUE: "text-red-400 bg-red-400/10",
    OPEN: "text-blue-400 bg-blue-400/10",
    IN_PROGRESS: "text-amber-400 bg-amber-400/10",
    RESOLVED: "text-emerald-400 bg-emerald-400/10",
    CLOSED: "text-slate-400 bg-slate-400/10",
    USED: "text-violet-400 bg-violet-400/10",
    PRESENT: "text-emerald-400 bg-emerald-400/10",
    ABSENT: "text-red-400 bg-red-400/10",
    LATE: "text-amber-400 bg-amber-400/10",
  };
  return map[status] ?? "text-slate-400 bg-slate-400/10";
}

export function dayOfWeekName(day: number): string {
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  return days[day] ?? "";
}
