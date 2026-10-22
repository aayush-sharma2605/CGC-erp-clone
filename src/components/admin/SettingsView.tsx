"use client";

import { useState } from "react";
import { Settings, ShieldCheck, Database, School, CheckCircle2, Lock } from "lucide-react";

export function SettingsView() {
  const [selectedInstitution, setSelectedInstitution] = useState("hits");
  const [sessionActive, setSessionActive] = useState(true);
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-4xl">
      <div className="page-header flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="page-title">Institution & System Settings</h1>
          <p className="page-subtitle">Multi-campus institution parameters, active session controllers, and security safeguards</p>
        </div>
        <button onClick={handleSave} className="btn btn-primary text-xs flex items-center gap-2">
          {saved ? <CheckCircle2 size={15} /> : <Settings size={15} />}
          <span>{saved ? "Settings Saved" : "Save Changes"}</span>
        </button>
      </div>

      {/* Multi-institution Config (from reverse engineering APK findings) */}
      <div className="card p-6 space-y-4">
        <h3 className="section-title flex items-center gap-2">
          <School size={16} className="text-violet-400" />
          <span>Active Institution Profile (Multi-Tenant APK Core)</span>
        </h3>
        <p className="text-xs text-slate-400">
          The reverse-engineered APK bundled configurations for 4 university domains. Select the default institutional identity profile:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            { id: "hits", name: "Hindustan Institute of Tech & Science (HITS)", welcome: "Hits New App", code: "hits" },
            { id: "pu", name: "Presidency / Panjab University (PU)", welcome: "PU New App", code: "pu" },
            { id: "snu", name: "Shoolini / Nalanda University (SNU)", welcome: "Enrollment Identity", code: "snu" },
            { id: "rfccc", name: "Regional Federation Campus Consortium (RFCCC)", welcome: "Welcome to rfccc", code: "rfccc" },
          ].map((inst) => (
            <div
              key={inst.id}
              onClick={() => setSelectedInstitution(inst.id)}
              className={`p-4 rounded-xl border cursor-pointer transition-all ${
                selectedInstitution === inst.id
                  ? "bg-violet-600/15 border-violet-500/40 text-violet-200"
                  : "bg-slate-900/60 border-white/5 hover:border-violet-500/20 text-slate-400"
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-mono text-xs font-bold text-violet-400 uppercase">
                  [{inst.code}]
                </span>
                {selectedInstitution === inst.id && (
                  <CheckCircle2 size={15} className="text-violet-400" />
                )}
              </div>
              <p className="font-bold text-sm text-slate-100">{inst.name}</p>
              <p className="text-[11px] text-slate-500 mt-1">Header: {inst.welcome}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Academic Session */}
      <div className="card p-6 space-y-4">
        <h3 className="section-title flex items-center gap-2">
          <Database size={16} className="text-emerald-400" />
          <span>Academic Session & Term Operations</span>
        </h3>
        <div className="space-y-4 text-xs">
          <div className="flex items-center justify-between p-3 rounded-lg bg-slate-950/60 border border-white/5">
            <div>
              <p className="font-bold text-slate-200">Current Academic Term</p>
              <p className="text-slate-400">2024-25 Odd Semester (August – December 2024)</p>
            </div>
            <span className="badge badge-emerald">ACTIVE TERM</span>
          </div>

          <div className="flex items-center justify-between p-3 rounded-lg bg-slate-950/60 border border-white/5">
            <div>
              <p className="font-bold text-slate-200">Continuous Assessment Grade Entry</p>
              <p className="text-slate-400">Permit faculty to submit and adjust mid-term CIA marks</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={sessionActive}
                onChange={(e) => setSessionActive(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-violet-600"></div>
            </label>
          </div>
        </div>
      </div>

      {/* Security Health */}
      <div className="card p-6 space-y-4">
        <h3 className="section-title flex items-center gap-2">
          <Lock size={16} className="text-blue-400" />
          <span>Security & Authentication Hardening</span>
        </h3>
        <div className="space-y-2 text-xs text-slate-300">
          <div className="flex items-center justify-between py-2 border-b border-white/5">
            <span>NextAuth Session Encryption</span>
            <span className="font-mono text-emerald-400 font-bold">HS512 JWT (Active)</span>
          </div>
          <div className="flex items-center justify-between py-2 border-b border-white/5">
            <span>APK RSA Private Key Vulnerability</span>
            <span className="badge badge-emerald">Resolved — Independent Server-Side Secrets</span>
          </div>
          <div className="flex items-center justify-between py-2">
            <span>Multi-Factor Authentication (MFA) Status</span>
            <span className="text-slate-400">Optional for Faculty & Admin</span>
          </div>
        </div>
      </div>
    </div>
  );
}
