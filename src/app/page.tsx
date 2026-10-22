import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import {
  GraduationCap,
  ArrowRight,
  ShieldCheck,
  BookOpen,
  Clock,
  Award,
  Users,
  CheckCircle2,
  Calendar,
  CreditCard,
  DoorOpen,
  Bell,
  Sparkles,
  BarChart3,
  TrendingUp,
  MapPin,
} from "lucide-react";

export default async function HomePage() {
  const session = await auth();

  // If already authenticated, redirect to dashboard
  if (session?.user) {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-dvh flex flex-col justify-between bg-slate-950 text-slate-100 relative overflow-hidden">
      {/* Background ambient lighting */}
      <div
        className="absolute -top-40 left-1/2 -translate-x-1/2 w-[700px] h-[400px] rounded-full opacity-20 blur-[140px] pointer-events-none"
        style={{ background: "radial-gradient(circle, rgb(139 92 246) 0%, rgb(99 102 241) 50%, transparent 80%)" }}
      />
      <div
        className="absolute bottom-20 -right-40 w-[450px] h-[450px] rounded-full opacity-10 blur-[130px] pointer-events-none"
        style={{ background: "rgb(34 211 238)" }}
      />

      {/* ─── 1. Navigation Bar ─── */}
      <header className="border-b border-white/5 backdrop-blur-md sticky top-0 z-30 bg-slate-950/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-105"
              style={{
                background: "linear-gradient(135deg, rgb(139 92 246), rgb(99 102 241))",
                boxShadow: "0 0 20px rgb(139 92 246 / 0.4)",
              }}
            >
              <GraduationCap size={20} color="white" />
            </div>
            <div>
              <p className="font-black text-base tracking-tight text-white leading-none">
                Campus ERP
              </p>
              <p className="text-[11px] font-semibold text-slate-400 leading-none mt-1">
                Higher Education Cloud
              </p>
            </div>
          </Link>

          {/* Nav links */}
          <nav className="hidden md:flex items-center gap-6 text-sm text-slate-300 font-medium">
            <a href="#features" className="hover:text-violet-400 transition-colors">
              Features
            </a>
            <a href="#stats" className="hover:text-violet-400 transition-colors">
              Metrics
            </a>
            <a href="#portals" className="hover:text-violet-400 transition-colors">
              Role Portals
            </a>
          </nav>

          {/* Action button */}
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="btn btn-primary text-xs flex items-center gap-2 px-4 py-2"
            >
              <span>Sign In to Portal</span>
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </header>

      {/* ─── 2. Main Container ─── */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 flex-1 flex flex-col justify-center space-y-16">
        
        {/* ─── Hero Section (Side-by-Side on Desktop) ─── */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          {/* Left Column: Headline, Subtitle, Feature Chips, CTAs */}
          <div className="lg:col-span-7 space-y-6 text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-300 text-xs font-semibold">
              <Sparkles size={14} className="text-violet-400" />
              <span>Unified Higher Education ERP</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-[1.15]">
              Manage your{" "}
              <span className="bg-gradient-to-r from-violet-400 via-indigo-300 to-cyan-400 bg-clip-text text-transparent">
                campus smarter
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-xl">
              A unified platform for students, faculty, and administrators. Track attendance,
              manage fees, view results, and more — all in one place.
            </p>

            {/* Feature chips */}
            <div className="flex flex-wrap gap-2 pt-1">
              {[
                { label: "Attendance Tracking", icon: "📊" },
                { label: "Fee Management", icon: "💳" },
                { label: "Exam & Results", icon: "📝" },
                { label: "Gate Pass", icon: "🚪" },
                { label: "Timetable", icon: "📅" },
                { label: "Notices", icon: "🔔" },
              ].map((chip) => (
                <span
                  key={chip.label}
                  className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full font-medium bg-slate-900/80 border border-white/10 text-slate-200 hover:border-violet-500/30 transition-colors shadow-sm"
                >
                  <span>{chip.icon}</span>
                  <span>{chip.label}</span>
                </span>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-4">
              <Link
                href="/login"
                className="btn btn-primary text-sm px-6 py-3 flex items-center justify-center gap-2.5 shadow-lg shadow-violet-500/25"
              >
                <span>Launch ERP Portal</span>
                <ArrowRight size={16} />
              </Link>
              <a
                href="#portals"
                className="btn btn-secondary text-sm px-5 py-3 flex items-center justify-center gap-2"
              >
                <span>Explore Role Access</span>
              </a>
            </div>
          </div>

          {/* Right Column: Interactive Dashboard Preview Card Illustration */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md w-full">
              {/* Outer decorative glow border */}
              <div
                className="absolute -inset-1 rounded-2xl opacity-40 blur-xl pointer-events-none"
                style={{ background: "linear-gradient(135deg, rgb(139 92 246), rgb(34 211 238))" }}
              />

              {/* Main Preview Glass Card */}
              <div className="relative card p-6 bg-slate-900/95 border-violet-500/30 shadow-2xl rounded-2xl space-y-4">
                {/* Header of preview card */}
                <div className="flex items-center justify-between pb-3 border-b border-white/5">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-violet-600/20 text-violet-400 flex items-center justify-center font-bold text-xs">
                      AM
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-100">Arjun Mehta</p>
                      <p className="text-[10px] text-slate-400 font-mono">CSE2022001 · Sem 5</p>
                    </div>
                  </div>
                  <span className="flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    Live ERP Sync
                  </span>
                </div>

                {/* Metric widgets row inside preview */}
                <div className="grid grid-cols-2 gap-2.5">
                  <div className="p-3 rounded-xl bg-slate-950/60 border border-white/5">
                    <div className="flex items-center justify-between text-[11px] text-slate-400">
                      <span>Attendance</span>
                      <BarChart3 size={13} className="text-emerald-400" />
                    </div>
                    <p className="text-lg font-black text-emerald-400 mt-1">88%</p>
                    <div className="w-full bg-slate-800 rounded-full h-1 mt-1.5 overflow-hidden">
                      <div className="bg-emerald-400 h-full rounded-full" style={{ width: "88%" }} />
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-950/60 border border-white/5">
                    <div className="flex items-center justify-between text-[11px] text-slate-400">
                      <span>Current SGPA</span>
                      <Award size={13} className="text-violet-400" />
                    </div>
                    <p className="text-lg font-black text-violet-300 mt-1">8.52</p>
                    <p className="text-[10px] text-slate-500 mt-1">Grade: Outstanding (O)</p>
                  </div>
                </div>

                {/* Upcoming class pill */}
                <div className="p-3 rounded-xl bg-violet-600/10 border border-violet-500/20 flex items-center justify-between">
                  <div className="space-y-0.5">
                    <p className="text-[10px] font-semibold text-violet-300 uppercase tracking-wider">Next Lecture</p>
                    <p className="text-xs font-bold text-slate-100">CS301 · Data Structures</p>
                    <p className="text-[10px] text-slate-400">09:00 AM – 10:00 AM · Hall 102</p>
                  </div>
                  <span className="text-[11px] font-mono px-2 py-1 rounded bg-violet-600/30 text-violet-200">
                    Today
                  </span>
                </div>

                {/* Quick actions chips */}
                <div className="flex items-center justify-between text-[11px] pt-1 text-slate-400">
                  <span className="flex items-center gap-1 text-emerald-400 font-semibold">
                    <CheckCircle2 size={13} /> Fees Paid
                  </span>
                  <span className="flex items-center gap-1 text-violet-300 font-mono">
                    HT2024CSE2022001 (Admit Card)
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ─── 3. Statistics Section (4 Columns on Desktop, 2 on Tablet, 1-2 on Mobile) ─── */}
        <section id="stats" className="space-y-4 pt-4 border-t border-white/5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400">
                Institutional Performance & Reach
              </h2>
              <p className="text-xs text-slate-500">Benchmark metrics across the university network</p>
            </div>
            <span className="text-[10px] text-slate-500 italic">
              * Statistics reflect current academic term demo benchmarks
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: "Active Students", value: "2,400+", subtext: "Enrolled across programmes", color: "rgb(139 92 246)" },
              { label: "Faculty Members", value: "180+", subtext: "Professors & researchers", color: "rgb(34 211 238)" },
              { label: "Academic Departments", value: "12", subtext: "Engineering, Science, Mgmt", color: "rgb(52 211 153)" },
              { label: "System Accuracy", value: "99.8%", subtext: "Automated biometric & QR sync", color: "rgb(251 191 36)" },
            ].map((stat) => (
              <div
                key={stat.label}
                className="card p-5 space-y-1.5 hover:border-violet-500/30 transition-all group"
              >
                <p className="text-3xl font-black tracking-tight" style={{ color: stat.color }}>
                  {stat.value}
                </p>
                <p className="text-sm font-bold text-slate-100 group-hover:text-violet-300 transition-colors">
                  {stat.label}
                </p>
                <p className="text-xs text-slate-400">{stat.subtext}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ─── 4. Role Portals Access Cards ─── */}
        <section id="portals" className="space-y-4 pt-4 border-t border-white/5">
          <div>
            <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400">
              Role-Based Institutional Portals
            </h2>
            <p className="text-sm text-slate-300 mt-1">
              Select your university role to sign in with pre-configured demo credentials
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {/* Student Card */}
            <div className="card p-6 flex flex-col justify-between hover:border-violet-500/40 transition-all hover:-translate-y-1 group">
              <div>
                <div className="w-10 h-10 rounded-xl bg-violet-500/10 text-violet-400 flex items-center justify-center mb-4 group-hover:bg-violet-600 group-hover:text-white transition-colors">
                  <BookOpen size={20} />
                </div>
                <h3 className="font-bold text-slate-100 text-lg mb-1">Student Portal</h3>
                <p className="text-xs text-slate-400 leading-relaxed mb-4">
                  Check daily attendance, view weekly timetable, register for exams, download verified Hall Tickets, pay fees, and access LMS video lectures.
                </p>
              </div>

              <div className="space-y-3 pt-3 border-t border-white/5">
                <div className="font-mono text-[11px] text-violet-300 bg-slate-950/60 p-2.5 rounded-lg border border-white/5">
                  student@demo.edu · demo1234
                </div>
                <Link
                  href="/login"
                  className="btn btn-secondary text-xs w-full flex items-center justify-center gap-1.5"
                >
                  <span>Open Student Login</span>
                  <ArrowRight size={13} />
                </Link>
              </div>
            </div>

            {/* Faculty Card */}
            <div className="card p-6 flex flex-col justify-between hover:border-cyan-500/40 transition-all hover:-translate-y-1 group">
              <div>
                <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center mb-4 group-hover:bg-cyan-600 group-hover:text-white transition-colors">
                  <Users size={20} />
                </div>
                <h3 className="font-bold text-slate-100 text-lg mb-1">Faculty & Staff Portal</h3>
                <p className="text-xs text-slate-400 leading-relaxed mb-4">
                  Mark lecture attendance, enter continuous internal assessment (CIA) scores, review leave applications, generate pay slips, and maintain service book.
                </p>
              </div>

              <div className="space-y-3 pt-3 border-t border-white/5">
                <div className="font-mono text-[11px] text-cyan-300 bg-slate-950/60 p-2.5 rounded-lg border border-white/5">
                  faculty@demo.edu · demo1234
                </div>
                <Link
                  href="/login"
                  className="btn btn-secondary text-xs w-full flex items-center justify-center gap-1.5"
                >
                  <span>Open Faculty Login</span>
                  <ArrowRight size={13} />
                </Link>
              </div>
            </div>

            {/* Admin Card */}
            <div className="card p-6 flex flex-col justify-between hover:border-emerald-500/40 transition-all hover:-translate-y-1 group sm:col-span-2 lg:col-span-1">
              <div>
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-4 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                  <Award size={20} />
                </div>
                <h3 className="font-bold text-slate-100 text-lg mb-1">Administrative Portal</h3>
                <p className="text-xs text-slate-400 leading-relaxed mb-4">
                  Oversee institutional rosters, approve procurement purchase orders, publish priority campus circulars, and manage multi-tenant college settings.
                </p>
              </div>

              <div className="space-y-3 pt-3 border-t border-white/5">
                <div className="font-mono text-[11px] text-emerald-300 bg-slate-950/60 p-2.5 rounded-lg border border-white/5">
                  admin@demo.edu · demo1234
                </div>
                <Link
                  href="/login"
                  className="btn btn-secondary text-xs w-full flex items-center justify-center gap-1.5"
                >
                  <span>Open Admin Login</span>
                  <ArrowRight size={13} />
                </Link>
              </div>
            </div>
          </div>
        </section>

      </main>

      {/* ─── 5. Footer ─── */}
      <footer className="border-t border-white/5 py-6 bg-slate-950/90 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© 2026 Campus ERP. Independent Architecture Rebuild.</p>
          <div className="flex items-center gap-4 text-[11px]">
            <span>Multi-Tenant Engine: <strong className="text-emerald-400">Online</strong></span>
            <span>·</span>
            <span>NextAuth Secure JWT</span>
            <span>·</span>
            <Link href="/login" className="hover:text-slate-300 underline">
              Direct Sign In
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
