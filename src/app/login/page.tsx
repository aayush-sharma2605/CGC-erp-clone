"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Eye,
  EyeOff,
  GraduationCap,
  Loader2,
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  Sparkles,
} from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedDemoRole, setSelectedDemoRole] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const result = await signIn("credentials", {
        username: email,
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError("Invalid credentials. Please verify your College ID / username and password.");
      } else {
        router.push("/dashboard");
        router.refresh();
      }
    } catch {
      setError("Authentication failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const fillDemo = (role: "student" | "faculty" | "admin") => {
    const creds = {
      student: { email: "student@demo.edu", password: "demo1234" },
      faculty: { email: "faculty@demo.edu", password: "demo1234" },
      admin: { email: "admin@demo.edu", password: "demo1234" },
    };
    setEmail(creds[role].email);
    setPassword(creds[role].password);
    setSelectedDemoRole(role);
    setError("");
  };

  return (
    <div className="min-h-dvh flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8 bg-slate-950 text-slate-100 relative overflow-hidden">
      {/* Background radial glow */}
      <div
        className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[450px] rounded-full opacity-15 blur-[140px] pointer-events-none"
        style={{ background: "radial-gradient(circle, rgb(139 92 246) 0%, rgb(99 102 241) 50%, transparent 80%)" }}
      />

      {/* Centered Login Card Container */}
      <div className="w-full max-w-md mx-auto relative z-10 space-y-6">
        
        {/* Top Logo */}
        <div className="flex flex-col items-center justify-center text-center space-y-2">
          <Link href="/" className="inline-flex items-center gap-2.5 group">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-105"
              style={{
                background: "linear-gradient(135deg, rgb(139 92 246), rgb(99 102 241))",
                boxShadow: "0 0 20px rgb(139 92 246 / 0.4)",
              }}
            >
              <GraduationCap size={20} color="white" />
            </div>
            <span className="text-xl font-black text-white tracking-tight">Campus ERP</span>
          </Link>
          <p className="text-xs text-slate-400">Higher Education Institutional Portal</p>
        </div>

        {/* Card */}
        <div className="card p-7 sm:p-8 border border-white/10 shadow-2xl rounded-2xl bg-slate-900/95 backdrop-blur-xl space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">Welcome back</h1>
            <p className="text-xs text-slate-400 mt-1">Sign in with your institutional credentials to continue</p>
          </div>

          {/* Demo Account Quick-Fill Box */}
          <div className="p-3.5 rounded-xl bg-slate-950/80 border border-violet-500/20 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-slate-300 flex items-center gap-1.5">
                <Sparkles size={13} className="text-violet-400" />
                <span>Demo Accounts (click to fill)</span>
              </span>
              <span className="text-[10px] text-slate-500 font-mono">pwd: demo1234</span>
            </div>

            <div className="grid grid-cols-3 gap-2">
              {(["student", "faculty", "admin"] as const).map((role) => {
                const isActive = selectedDemoRole === role;
                return (
                  <button
                    key={role}
                    type="button"
                    onClick={() => fillDemo(role)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all text-center ${
                      isActive
                        ? "bg-violet-600 text-white shadow-md shadow-violet-500/30 border border-violet-400"
                        : "bg-slate-900 text-slate-300 hover:text-white hover:bg-slate-800 border border-white/5"
                    }`}
                  >
                    {role}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="flex items-start gap-2.5 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs">
              <AlertCircle size={15} className="text-rose-400 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1.5">
              <label htmlFor="email" className="block text-xs font-semibold text-slate-300">
                College ID / Enrollment No / Username
              </label>
              <input
                id="email"
                type="text"
                required
                autoComplete="username"
                placeholder="e.g. CEC247038 or student@demo.edu"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setSelectedDemoRole(null);
                }}
                className="input w-full text-sm"
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="block text-xs font-semibold text-slate-300">
                  Password
                </label>
                <a href="#" className="text-[11px] text-violet-400 hover:text-violet-300 font-medium">
                  Forgot password?
                </a>
              </div>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  required
                  autoComplete="current-password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input w-full text-sm pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 transition-colors p-1"
                  title={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div className="flex items-center pt-1">
              <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-400">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded border-slate-700 bg-slate-900 text-violet-600 focus:ring-violet-500"
                />
                <span>Remember this workstation</span>
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary w-full py-2.5 text-sm font-semibold flex items-center justify-center gap-2 shadow-lg shadow-violet-500/25 mt-2"
            >
              {loading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  <span>Authenticating...</span>
                </>
              ) : (
                <span>Sign in to Portal</span>
              )}
            </button>
          </form>

          {/* Back link */}
          <div className="pt-2 text-center border-t border-white/5">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-200 transition-colors"
            >
              <ArrowLeft size={13} />
              <span>Back to Campus ERP Home</span>
            </Link>
          </div>
        </div>

        {/* Disclaimer */}
        <p className="text-center text-[11px] text-slate-500">
          Campus ERP · Independent higher education system architecture rebuild.
        </p>
      </div>
    </div>
  );
}
