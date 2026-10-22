"use client";

import { useState } from "react";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Download, Printer, FileText, CheckCircle2 } from "lucide-react";

interface PaySlip {
  id: string;
  month: number;
  year: number;
  basicPay: number;
  allowances: number;
  deductions: number;
  netPay: number;
  generatedAt: string;
}

interface PaySlipViewProps {
  slips: PaySlip[];
  facultyName: string;
  employeeId: string;
  department: string;
}

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

export function PaySlipView({ slips, facultyName, employeeId, department }: PaySlipViewProps) {
  const [selectedSlip, setSelectedSlip] = useState<PaySlip | null>(slips[0] || null);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="page-header flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="page-title">Faculty Salary & Pay Slips</h1>
          <p className="page-subtitle">Monthly compensation, earnings breakdown, deductions, and tax slips</p>
        </div>
        {selectedSlip && (
          <button onClick={handlePrint} className="btn btn-primary text-xs flex items-center gap-2">
            <Printer size={15} />
            <span>Print Pay Slip</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Slips selector list */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Salary Statements</h3>
          {slips.length === 0 ? (
            <div className="card p-6 text-center text-xs text-slate-500">
              No salary slips issued yet.
            </div>
          ) : (
            slips.map((slip) => {
              const isSelected = selectedSlip?.id === slip.id;
              return (
                <div
                  key={slip.id}
                  onClick={() => setSelectedSlip(slip)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all ${
                    isSelected
                      ? "bg-violet-600/10 border-violet-500/40 text-violet-300"
                      : "card hover:border-violet-500/20 text-slate-300"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-bold text-sm text-slate-100">
                        {MONTH_NAMES[slip.month - 1]} {slip.year}
                      </p>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        Generated on {formatDate(slip.generatedAt)}
                      </p>
                    </div>
                    <span className="font-mono font-bold text-sm text-emerald-400">
                      {formatCurrency(slip.netPay)}
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Detailed Pay Slip Preview */}
        {selectedSlip && (
          <div className="lg:col-span-2 card p-8 border-violet-500/20 bg-slate-900/90 shadow-xl space-y-6">
            <div className="border-b border-white/10 pb-5 text-center">
              <span className="text-[11px] font-bold tracking-widest text-violet-400 uppercase">
                Autonomous Institute of Technology & Management
              </span>
              <h2 className="text-xl font-black text-slate-100 mt-1">
                Salary Slip — {MONTH_NAMES[selectedSlip.month - 1]} {selectedSlip.year}
              </h2>
            </div>

            {/* Employee details */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-xl bg-slate-950/60 border border-white/5 text-xs">
              <div>
                <p className="text-slate-500">Employee Name</p>
                <p className="font-bold text-slate-200 mt-0.5">{facultyName}</p>
              </div>
              <div>
                <p className="text-slate-500">Employee ID</p>
                <p className="font-mono font-bold text-violet-300 mt-0.5">{employeeId}</p>
              </div>
              <div>
                <p className="text-slate-500">Department</p>
                <p className="font-semibold text-slate-200 mt-0.5">{department}</p>
              </div>
              <div>
                <p className="text-slate-500">Status</p>
                <p className="font-bold text-emerald-400 mt-0.5">PAID</p>
              </div>
            </div>

            {/* Earnings & Deductions Table */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
              {/* Earnings */}
              <div className="space-y-3">
                <div className="p-2.5 rounded-lg bg-emerald-500/10 text-emerald-400 font-bold uppercase text-[11px]">
                  Earnings
                </div>
                <div className="space-y-2 text-slate-300">
                  <div className="flex justify-between py-1 border-b border-white/5">
                    <span>Basic Pay</span>
                    <span className="font-mono">{formatCurrency(selectedSlip.basicPay)}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-white/5">
                    <span>Dearness Allowance (DA)</span>
                    <span className="font-mono">{formatCurrency(selectedSlip.allowances * 0.5)}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-white/5">
                    <span>House Rent Allowance (HRA)</span>
                    <span className="font-mono">{formatCurrency(selectedSlip.allowances * 0.3)}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-white/5">
                    <span>Special Academic Allowance</span>
                    <span className="font-mono">{formatCurrency(selectedSlip.allowances * 0.2)}</span>
                  </div>
                  <div className="flex justify-between pt-2 font-bold text-emerald-400">
                    <span>Total Gross Earnings</span>
                    <span className="font-mono">{formatCurrency(selectedSlip.basicPay + selectedSlip.allowances)}</span>
                  </div>
                </div>
              </div>

              {/* Deductions */}
              <div className="space-y-3">
                <div className="p-2.5 rounded-lg bg-rose-500/10 text-rose-400 font-bold uppercase text-[11px]">
                  Deductions
                </div>
                <div className="space-y-2 text-slate-300">
                  <div className="flex justify-between py-1 border-b border-white/5">
                    <span>Provident Fund (EPF)</span>
                    <span className="font-mono">{formatCurrency(selectedSlip.deductions * 0.6)}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-white/5">
                    <span>Professional Tax (PT)</span>
                    <span className="font-mono">{formatCurrency(selectedSlip.deductions * 0.1)}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-white/5">
                    <span>Income Tax (TDS)</span>
                    <span className="font-mono">{formatCurrency(selectedSlip.deductions * 0.3)}</span>
                  </div>
                  <div className="flex justify-between pt-2 font-bold text-rose-400">
                    <span>Total Deductions</span>
                    <span className="font-mono">{formatCurrency(selectedSlip.deductions)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Net Salary Highlight */}
            <div className="p-4 rounded-xl bg-violet-600/15 border border-violet-500/30 flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-wider text-violet-300 font-bold">
                  Net Disbursed Pay
                </p>
                <p className="text-[11px] text-slate-400">Directly credited to linked salary account</p>
              </div>
              <p className="text-2xl font-black font-mono text-emerald-400">
                {formatCurrency(selectedSlip.netPay)}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
