"use client";

import React, { useState, useEffect } from "react";
import { appStore } from "@/lib/store";
import { Payout } from "@/lib/types";
import { formatINR, formatDate } from "@/lib/utils";
import {
  Receipt,
  Plus,
  CheckCircle,
  FileText,
  Clock,
  ShieldCheck,
  X,
  CreditCard,
  Building,
  CheckCircle2,
} from "lucide-react";

export default function AdminPayoutsPage() {
  const [state, setState] = useState(appStore.getState());
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [markPaidModalPayout, setMarkPaidModalPayout] = useState<Payout | null>(null);
  const [utrInput, setUtrInput] = useState("");
  const [successToast, setSuccessToast] = useState<string | null>(null);

  // New payout form state
  const [selectedCreatorId, setSelectedCreatorId] = useState("");
  const [amount, setAmount] = useState<number>(30000);
  const [paymentMethod, setPaymentMethod] = useState<"UPI" | "NEFT" | "IMPS">("UPI");

  useEffect(() => {
    return appStore.subscribe(() => {
      setState(appStore.getState());
    });
  }, []);

  const { payouts, creators } = state;

  useEffect(() => {
    if (creators.length > 0 && !selectedCreatorId) {
      setSelectedCreatorId(creators[0].id);
    }
  }, [creators, selectedCreatorId]);

  const totalGrossDisbursed = payouts
    .filter((p) => p.status === "Paid")
    .reduce((acc, curr) => acc + curr.amount, 0);

  const totalTdsDeducted = payouts
    .filter((p) => p.status === "Paid")
    .reduce((acc, curr) => acc + curr.tdsDeducted, 0);

  const totalNetDisbursed = payouts
    .filter((p) => p.status === "Paid")
    .reduce((acc, curr) => acc + curr.netAmount, 0);

  const pendingDisbursements = payouts
    .filter((p) => p.status === "Pending" || p.status === "Processing")
    .reduce((acc, curr) => acc + curr.netAmount, 0);

  const handleMarkPaid = (e: React.FormEvent) => {
    e.preventDefault();
    if (!markPaidModalPayout || !utrInput.trim()) return;

    appStore.markPayoutPaid(markPaidModalPayout.id, utrInput);
    setMarkPaidModalPayout(null);
    setUtrInput("");
    setSuccessToast(`Disbursement credited with UTR: ${utrInput}`);
    setTimeout(() => setSuccessToast(null), 3000);
  };

  const handleCreatePayout = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCreatorId || amount <= 0) return;

    appStore.createPayout(selectedCreatorId, amount, paymentMethod);
    setShowCreateModal(false);
    setSuccessToast(`Created payout invoice for ${formatINR(amount)}`);
    setTimeout(() => setSuccessToast(null), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Toast Alert */}
      {successToast && (
        <div className="fixed top-20 right-6 z-50 flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-3 text-xs font-semibold text-white shadow-xl animate-in slide-in-from-top duration-200">
          <CheckCircle2 className="h-4 w-4 text-emerald-400" />
          <span>{successToast}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl dark:text-white">
            Creator Payouts & TDS Management
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Automated 10% TDS deduction under Section 194J, UTR settlement tracking, and bank receipts.
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-blue-700 transition"
        >
          <Plus className="h-4 w-4" />
          <span>Create Payout Batch</span>
        </button>
      </div>

      {/* 4 Financial Stat Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Total Gross */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Total Gross Payouts
          </div>
          <div className="mt-3 text-2xl font-black text-slate-900 dark:text-white">
            {formatINR(totalGrossDisbursed)}
          </div>
          <div className="mt-1 text-[11px] text-slate-400 dark:text-slate-500">
            Contractual influencer fees
          </div>
        </div>

        {/* Total TDS */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            TDS Withheld (10%)
          </div>
          <div className="mt-3 text-2xl font-black text-rose-600 dark:text-rose-400">
            {formatINR(totalTdsDeducted)}
          </div>
          <div className="mt-1 text-[11px] text-slate-400 dark:text-slate-500">
            Section 194J quarterly filing
          </div>
        </div>

        {/* Net Paid */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Net Paid to Creators
          </div>
          <div className="mt-3 text-2xl font-black text-emerald-600 dark:text-emerald-400">
            {formatINR(totalNetDisbursed)}
          </div>
          <div className="mt-1 text-[11px] text-slate-400 dark:text-slate-500">
            Transferred via UPI / NEFT
          </div>
        </div>

        {/* Pending Escrow */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Pending Approval
          </div>
          <div className="mt-3 text-2xl font-black text-amber-600 dark:text-amber-400">
            {formatINR(pendingDisbursements)}
          </div>
          <div className="mt-1 text-[11px] text-slate-400 dark:text-slate-500">
            Awaiting UTR generation
          </div>
        </div>
      </div>

      {/* Payouts Table */}
      <div className="rounded-2xl border border-slate-200/80 bg-white shadow-sm overflow-hidden dark:border-slate-800 dark:bg-slate-900">
        <div className="border-b border-slate-200 px-6 py-4 bg-slate-50/50 flex items-center justify-between dark:border-slate-800 dark:bg-slate-800/50">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Disbursement Register & Settlement Log
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              UTR bank numbers verified against Indian payment gateways.
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100/70 text-[11px] uppercase tracking-wider text-slate-600 font-semibold border-b border-slate-200 dark:bg-slate-800/80 dark:border-slate-700 dark:text-slate-400">
              <tr>
                <th className="px-6 py-3.5">Invoice #</th>
                <th className="px-4 py-3.5">Creator Name</th>
                <th className="px-4 py-3.5">Payment Mode</th>
                <th className="px-4 py-3.5 text-right">Gross (INR)</th>
                <th className="px-4 py-3.5 text-right">TDS 10% (194J)</th>
                <th className="px-4 py-3.5 text-right">Net Payable</th>
                <th className="px-4 py-3.5">UTR Reference</th>
                <th className="px-4 py-3.5 text-center">Status</th>
                <th className="px-6 py-3.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {payouts.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50/80 transition-colors dark:hover:bg-slate-800/50">
                  <td className="px-6 py-4 font-mono font-bold text-slate-900 dark:text-white">
                    {p.invoiceNumber}
                  </td>
                  <td className="px-4 py-4 font-bold text-slate-900 dark:text-white">
                    {p.creatorName}
                  </td>
                  <td className="px-4 py-4 text-slate-700 font-medium dark:text-slate-300">
                    {p.paymentMethod}
                  </td>
                  <td className="px-4 py-4 text-right font-semibold text-slate-800 dark:text-slate-200">
                    {formatINR(p.amount)}
                  </td>
                  <td className="px-4 py-4 text-right text-rose-600 font-semibold dark:text-rose-400">
                    -{formatINR(p.tdsDeducted)}
                  </td>
                  <td className="px-4 py-4 text-right font-extrabold text-emerald-600 dark:text-emerald-400">
                    {formatINR(p.netAmount)}
                  </td>
                  <td className="px-4 py-4 font-mono text-[11px] text-slate-600 dark:text-slate-400">
                    {p.utrNumber || (
                      <span className="text-amber-600 font-sans italic font-medium dark:text-amber-400">
                        Pending UTR
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-4 text-center">
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                        p.status === "Paid"
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800"
                          : "bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800"
                      }`}
                    >
                      {p.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    {p.status !== "Paid" ? (
                      <button
                        onClick={() => {
                          setMarkPaidModalPayout(p);
                          setUtrInput(
                            `UTR2026${Math.floor(1000000000 + Math.random() * 9000000000)}`
                          );
                        }}
                        className="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-emerald-700 transition"
                      >
                        Mark as Paid
                      </button>
                    ) : (
                      <span className="text-emerald-700 font-semibold text-xs dark:text-emerald-400">
                        Settled
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mark Paid Modal (UTR Input) */}
      {markPaidModalPayout && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl animate-in zoom-in-95 duration-150 dark:bg-slate-900 dark:border dark:border-slate-800">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4 dark:border-slate-800">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Record Bank UTR Settlement
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Disbursing to {markPaidModalPayout.creatorName} ({markPaidModalPayout.invoiceNumber})
                </p>
              </div>
              <button
                onClick={() => setMarkPaidModalPayout(null)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleMarkPaid} className="space-y-4 text-xs">
              <div className="rounded-xl bg-slate-50 p-3.5 border border-slate-100 space-y-1 dark:bg-slate-800/60 dark:border-slate-700/60">
                <div className="flex justify-between">
                  <span className="text-slate-500 dark:text-slate-400">Gross Invoice:</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{formatINR(markPaidModalPayout.amount)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 dark:text-slate-400">TDS 10% (194J):</span>
                  <span className="font-semibold text-rose-600 dark:text-rose-400">-{formatINR(markPaidModalPayout.tdsDeducted)}</span>
                </div>
                <div className="flex justify-between border-t border-slate-200/60 pt-1 text-sm font-bold dark:border-slate-700">
                  <span className="text-slate-900 dark:text-white">Net Credit Amount:</span>
                  <span className="text-emerald-600 dark:text-emerald-400">{formatINR(markPaidModalPayout.netAmount)}</span>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1 dark:text-slate-300">
                  Bank UTR / Transaction Reference Number *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. UTR20260618001928"
                  value={utrInput}
                  onChange={(e) => setUtrInput(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 p-2.5 font-mono text-slate-900 focus:outline-none focus:border-blue-500 font-bold dark:bg-slate-800 dark:border-slate-700 dark:text-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setMarkPaidModalPayout(null)}
                  className="rounded-xl border border-slate-200 px-4 py-2 font-semibold text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-emerald-600 px-4 py-2 font-semibold text-white shadow-sm hover:bg-emerald-700"
                >
                  Confirm Bank Transfer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Create Payout Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl animate-in zoom-in-95 duration-150 dark:bg-slate-900 dark:border dark:border-slate-800">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4 dark:border-slate-800">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Generate Influencer Payout
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Calculate 10% TDS and schedule payment.
                </p>
              </div>
              <button
                onClick={() => setShowCreateModal(false)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreatePayout} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1 dark:text-slate-300">
                  Select Creator *
                </label>
                <select
                  value={selectedCreatorId}
                  onChange={(e) => setSelectedCreatorId(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 p-2.5 text-slate-900 outline-none bg-white dark:bg-slate-800 dark:border-slate-700 dark:text-white"
                >
                  {creators.map((c) => (
                    <option key={c.id} value={c.id}>{c.name} ({c.handle})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1 dark:text-slate-300">
                  Gross Payment Amount (INR ₹) *
                </label>
                <input
                  type="number"
                  required
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  className="w-full rounded-xl border border-slate-300 p-2.5 text-slate-900 font-bold focus:outline-none focus:border-blue-500 dark:bg-slate-800 dark:border-slate-700 dark:text-white"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1 dark:text-slate-300">
                  Disbursement Mode
                </label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value as any)}
                  className="w-full rounded-xl border border-slate-300 p-2.5 text-slate-900 outline-none bg-white dark:bg-slate-800 dark:border-slate-700 dark:text-white"
                >
                  <option value="UPI">UPI (Instant VPA)</option>
                  <option value="NEFT">NEFT (Direct Bank Transfer)</option>
                  <option value="IMPS">IMPS (Immediate Transfer)</option>
                </select>
              </div>

              <div className="rounded-xl bg-blue-50 p-3 border border-blue-200 text-blue-900 dark:bg-blue-950/60 dark:border-blue-900 dark:text-blue-200">
                <div>Gross: <strong>{formatINR(amount)}</strong></div>
                <div>TDS (10% under 194J): <strong>-{formatINR(amount * 0.1)}</strong></div>
                <div className="mt-1 pt-1 border-t border-blue-200 font-bold text-sm text-emerald-700 dark:border-blue-800 dark:text-emerald-400">
                  Net Payable: {formatINR(amount * 0.9)}
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="rounded-xl border border-slate-200 px-4 py-2 font-semibold text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-blue-600 px-4 py-2 font-semibold text-white shadow-sm hover:bg-blue-700"
                >
                  Schedule Payout
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
