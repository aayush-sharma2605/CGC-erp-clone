"use client";

import { useState } from "react";
import { ShoppingCart, Plus, CheckCircle2, XCircle, Clock, FileText } from "lucide-react";
import { formatCurrency, formatDate } from "@/lib/utils";

interface POItem {
  id: string;
  poNumber: string;
  vendor: string;
  category: string;
  totalAmount: number;
  status: "PENDING" | "APPROVED" | "REJECTED" | "DELIVERED";
  requestedBy: string;
  description: string;
  createdAt: string;
}

const SAMPLE_POS: POItem[] = [
  {
    id: "po-1",
    poNumber: "PO-2024-CSE-001",
    vendor: "Dell India Pvt Ltd",
    category: "IT Hardware / Lab",
    totalAmount: 485000,
    status: "APPROVED",
    requestedBy: "Dr. Rajesh Kumar",
    description: "20x Dell OptiPlex Core i7 Workstations for Advanced AI Lab",
    createdAt: new Date("2024-10-10").toISOString(),
  },
  {
    id: "po-2",
    poNumber: "PO-2024-LIB-004",
    vendor: "Wiley & McGraw-Hill Distributors",
    category: "Library Subscriptions",
    totalAmount: 125000,
    status: "PENDING",
    requestedBy: "Chief Librarian",
    description: "Annual IEEE / ACM digital library access license renewal",
    createdAt: new Date("2024-10-18").toISOString(),
  },
  {
    id: "po-3",
    poNumber: "PO-2024-ECE-002",
    vendor: "Keysight Technologies",
    category: "Lab Equipment",
    totalAmount: 320000,
    status: "PENDING",
    requestedBy: "Dr. Priya Sharma",
    description: "Digital Storage Oscilloscopes (DSO) for Communication Lab",
    createdAt: new Date("2024-10-21").toISOString(),
  },
];

export function PurchaseOrdersView() {
  const [orders, setOrders] = useState<POItem[]>(SAMPLE_POS);
  const [filter, setFilter] = useState<string>("ALL");

  const handleUpdateStatus = (id: string, newStatus: "APPROVED" | "REJECTED") => {
    setOrders((prev) =>
      prev.map((o) => (o.id === id ? { ...o, status: newStatus } : o))
    );
  };

  const filtered = orders.filter((o) => filter === "ALL" || o.status === filter);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="page-header flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="page-title">Procurement & Purchase Orders</h1>
          <p className="page-subtitle">Equipment indenting, vendor management, and administrative budget approvals</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="badge badge-purple">Admin Authority</span>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 bg-slate-900/60 p-1 rounded-xl border border-white/5 w-fit">
        {["ALL", "PENDING", "APPROVED", "REJECTED"].map((st) => (
          <button
            key={st}
            onClick={() => setFilter(st)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              filter === st
                ? "bg-violet-600 text-white font-semibold"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            {st}
          </button>
        ))}
      </div>

      {/* Orders Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((po) => (
          <div
            key={po.id}
            className="card p-5 space-y-4 hover:border-violet-500/30 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="font-mono text-xs font-bold text-violet-400">
                  {po.poNumber}
                </span>
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                    po.status === "APPROVED"
                      ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                      : po.status === "PENDING"
                      ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                      : "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                  }`}
                >
                  {po.status}
                </span>
              </div>

              <h4 className="font-bold text-slate-100 text-sm mb-1">{po.description}</h4>
              <p className="text-xs text-slate-400">Vendor: <strong className="text-slate-300">{po.vendor}</strong></p>
              <p className="text-xs text-slate-400">Indent Category: {po.category}</p>

              <div className="mt-3 p-3 rounded-xl bg-slate-950/60 border border-white/5 flex items-center justify-between text-xs">
                <span className="text-slate-400">Total Indent Value:</span>
                <span className="font-mono font-black text-emerald-400 text-sm">
                  {formatCurrency(po.totalAmount)}
                </span>
              </div>

              <p className="text-[11px] text-slate-500 mt-2">
                Requested by: {po.requestedBy} · {formatDate(po.createdAt)}
              </p>
            </div>

            {po.status === "PENDING" && (
              <div className="pt-3 border-t border-white/5 flex items-center gap-2">
                <button
                  onClick={() => handleUpdateStatus(po.id, "APPROVED")}
                  className="btn btn-primary text-xs flex-1 flex items-center justify-center gap-1 bg-emerald-600 hover:bg-emerald-500"
                >
                  <CheckCircle2 size={14} />
                  <span>Approve PO</span>
                </button>
                <button
                  onClick={() => handleUpdateStatus(po.id, "REJECTED")}
                  className="btn btn-danger text-xs flex-1 flex items-center justify-center gap-1"
                >
                  <XCircle size={14} />
                  <span>Reject</span>
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
