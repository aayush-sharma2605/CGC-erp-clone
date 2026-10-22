"use client";

import { formatCurrency, formatDate, getStatusColor } from "@/lib/utils";
import { CreditCard, Download, CheckCircle2, AlertCircle } from "lucide-react";
import { useState } from "react";

interface FeeItem { id: string; description: string; amount: number; category: string; }
interface Payment { id: string; amount: number; method: string; transactionId?: string | null; receiptNo: string; paidAt: string; }
interface Invoice {
  id: string; invoiceNo: string; totalAmount: number; paidAmount: number;
  dueDate: string; status: string; createdAt: string;
  items: FeeItem[]; payments: Payment[];
}

export function FeesView({ invoices }: { invoices: Invoice[] }) {
  const [selected, setSelected] = useState<Invoice | null>(null);

  const totalDue = invoices.reduce((s, i) => s + (i.totalAmount - i.paidAmount), 0);
  const totalPaid = invoices.reduce((s, i) => s + i.paidAmount, 0);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="page-header">
        <h1 className="page-title">Fee Management</h1>
        <p className="page-subtitle">View invoices, payment history, and receipts</p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: "Total Due", value: formatCurrency(Math.max(0, totalDue)), color: "rgb(251 113 133)", icon: <AlertCircle size={20} /> },
          { label: "Total Paid", value: formatCurrency(totalPaid), color: "rgb(52 211 153)", icon: <CheckCircle2 size={20} /> },
          { label: "Invoices", value: invoices.length, color: "rgb(139 92 246)", icon: <CreditCard size={20} /> },
        ].map((s) => (
          <div key={s.label} className="stat-card">
            <div className="stat-icon" style={{ background: `${s.color}20`, color: s.color }}>{s.icon}</div>
            <div>
              <p className="text-xs font-medium" style={{ color: "rgb(100 116 139)" }}>{s.label}</p>
              <p className="text-2xl font-bold" style={{ color: "rgb(248 250 252)" }}>{s.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Invoices */}
      <div className="card">
        <h3 className="section-title">Fee Invoices</h3>
        {invoices.length === 0 ? (
          <div className="empty-state">
            <CreditCard size={36} />
            <p>No fee invoices found</p>
          </div>
        ) : (
          <div className="space-y-3">
            {invoices.map((inv) => (
              <div
                key={inv.id}
                className="p-4 rounded-xl cursor-pointer transition-all"
                style={{
                  background: selected?.id === inv.id ? "rgb(139 92 246 / 0.08)" : "rgb(255 255 255 / 0.03)",
                  border: `1px solid ${selected?.id === inv.id ? "rgb(139 92 246 / 0.3)" : "rgb(255 255 255 / 0.06)"}`,
                }}
                onClick={() => setSelected(selected?.id === inv.id ? null : inv)}
              >
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div>
                    <p className="font-semibold text-sm" style={{ color: "rgb(203 213 225)" }}>Invoice #{inv.invoiceNo}</p>
                    <p className="text-xs mt-0.5" style={{ color: "rgb(100 116 139)" }}>Due: {formatDate(inv.dueDate)}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <p className="font-bold" style={{ color: "rgb(248 250 252)" }}>{formatCurrency(inv.totalAmount)}</p>
                      <p className="text-xs" style={{ color: "rgb(100 116 139)" }}>
                        Paid: {formatCurrency(inv.paidAmount)}
                      </p>
                    </div>
                    <span className={`badge text-xs ${getStatusColor(inv.status)}`}>{inv.status}</span>
                  </div>
                </div>

                {/* Expanded */}
                {selected?.id === inv.id && (
                  <div className="mt-4 pt-4" style={{ borderTop: "1px solid rgb(255 255 255 / 0.06)" }}>
                    <p className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: "rgb(71 85 105)" }}>
                      Fee Breakdown
                    </p>
                    <div className="space-y-2 mb-4">
                      {inv.items.map((item) => (
                        <div key={item.id} className="flex justify-between text-sm">
                          <div>
                            <span style={{ color: "rgb(203 213 225)" }}>{item.description}</span>
                            <span className="ml-2 text-xs px-1.5 py-0.5 rounded" style={{ background: "rgb(255 255 255 / 0.06)", color: "rgb(100 116 139)" }}>
                              {item.category}
                            </span>
                          </div>
                          <span style={{ color: "rgb(248 250 252)" }}>{formatCurrency(item.amount)}</span>
                        </div>
                      ))}
                    </div>

                    {inv.payments.length > 0 && (
                      <>
                        <p className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: "rgb(71 85 105)" }}>
                          Payment History
                        </p>
                        {inv.payments.map((p) => (
                          <div key={p.id} className="flex justify-between text-xs p-2 rounded-lg" style={{ background: "rgb(52 211 153 / 0.06)" }}>
                            <span style={{ color: "rgb(100 116 139)" }}>{formatDate(p.paidAt)} · {p.method} · #{p.receiptNo}</span>
                            <span className="font-semibold" style={{ color: "rgb(52 211 153)" }}>{formatCurrency(p.amount)}</span>
                          </div>
                        ))}
                      </>
                    )}

                    {(inv.status === "PENDING" || inv.status === "PARTIAL" || inv.status === "OVERDUE") && (
                      <button
                        className="btn btn-primary w-full mt-4"
                        onClick={(e) => {
                          e.stopPropagation();
                          alert("Razorpay payment integration — configure RAZORPAY_KEY_ID in .env");
                        }}
                      >
                        <CreditCard size={16} />
                        Pay {formatCurrency(inv.totalAmount - inv.paidAmount)} Now
                      </button>
                    )}

                    <button className="btn btn-secondary w-full mt-2">
                      <Download size={15} />
                      Download Receipt
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
