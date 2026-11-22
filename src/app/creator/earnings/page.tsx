"use client";

import React, { useState, useEffect } from "react";
import { appStore } from "@/lib/store";
import { Payout } from "@/lib/types";
import { formatINR, formatDate } from "@/lib/utils";
import {
  Wallet,
  Clock,
  CheckCircle,
  FileText,
  Download,
  Building,
  CreditCard,
  Printer,
  X,
  ShieldAlert,
  Edit2,
  Check,
} from "lucide-react";

export default function CreatorEarningsPage() {
  const [state, setState] = useState(appStore.getState());
  const [selectedInvoice, setSelectedInvoice] = useState<Payout | null>(null);
  const [isEditingBank, setIsEditingBank] = useState(false);
  const [upiId, setUpiId] = useState("");
  const [bankAccount, setBankAccount] = useState("");
  const [bankIfsc, setBankIfsc] = useState("");
  const [panNumber, setPanNumber] = useState("");
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    return appStore.subscribe(() => {
      setState(appStore.getState());
    });
  }, []);

  const creatorId = state.currentUser.creatorId || "crt-aarav-mehta";
  const creator = state.creators.find((c) => c.id === creatorId) || state.creators[0];
  const payouts = state.payouts.filter((p) => p.creatorId === creatorId);

  useEffect(() => {
    if (creator) {
      setUpiId(creator.upiId || "aarav@oksbi");
      setBankAccount(creator.bankAccountNumber || "50100439281726");
      setBankIfsc(creator.bankIfsc || "HDFC0001234");
      setPanNumber(creator.panNumber || "ABCDE1234F");
    }
  }, [creator]);

  // Aggregate stats
  const totalEarnedGross = payouts.reduce((acc, curr) => acc + curr.amount, 0);
  const totalTdsDeducted = payouts.reduce((acc, curr) => acc + (curr.tdsDeducted || 0), 0);
  const totalNetReceived = payouts
    .filter((p) => p.status === "Paid")
    .reduce((acc, curr) => acc + curr.netAmount, 0);
  const pendingEscrow = payouts
    .filter((p) => p.status === "Pending" || p.status === "Processing")
    .reduce((acc, curr) => acc + curr.netAmount, 0);

  const handleSaveBankDetails = (e: React.FormEvent) => {
    e.preventDefault();
    appStore.updateCreator(creatorId, {
      upiId,
      bankAccountNumber: bankAccount,
      bankIfsc,
      panNumber,
    });
    setIsEditingBank(false);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Toast */}
      {saveSuccess && (
        <div className="fixed top-20 right-6 z-50 flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-3 text-xs font-semibold text-white shadow-xl animate-in slide-in-from-top duration-200">
          <CheckCircle className="h-4 w-4 text-emerald-400" />
          <span>Payout accounts updated successfully!</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
            My Earnings & Payouts
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            View completed bank credits, pending campaign escrows, and download compliant TDS-deducted invoices.
          </p>
        </div>
      </div>

      {/* 3 Metric Cards: Earned, Pending, Paid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {/* Total Earned */}
        <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Total Gross Earned
            </span>
            <div className="rounded-xl bg-blue-50 dark:bg-blue-950/60 p-2 text-blue-600 dark:text-blue-400">
              <Wallet className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3 text-3xl font-extrabold text-slate-900 dark:text-white">
            {formatINR(totalEarnedGross)}
          </div>
          <div className="mt-2 text-[11px] text-slate-400">
            Includes brand fixed fees & commissions
          </div>
        </div>

        {/* Pending Escrow */}
        <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Pending Payout Escrow
            </span>
            <div className="rounded-xl bg-amber-50 dark:bg-amber-950/60 p-2 text-amber-600 dark:text-amber-400">
              <Clock className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3 text-3xl font-extrabold text-amber-600 dark:text-amber-400">
            {formatINR(pendingEscrow)}
          </div>
          <div className="mt-2 text-[11px] text-slate-500 dark:text-slate-400">
            Processing under 7-day review cycle
          </div>
        </div>

        {/* Paid to Bank */}
        <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Net Paid to Bank
            </span>
            <div className="rounded-xl bg-emerald-50 dark:bg-emerald-950/60 p-2 text-emerald-600 dark:text-emerald-400">
              <CheckCircle className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3 text-3xl font-extrabold text-emerald-600 dark:text-emerald-400">
            {formatINR(totalNetReceived)}
          </div>
          <div className="mt-2 text-[11px] text-slate-500 dark:text-slate-400">
            TDS Deducted: <strong className="text-slate-800 dark:text-slate-200">{formatINR(totalTdsDeducted)} (10%)</strong>
          </div>
        </div>
      </div>

      {/* Indian TDS Tax Compliance Notice */}
      <div className="flex items-start gap-3 rounded-2xl border border-blue-200 dark:border-blue-900/60 bg-blue-50/70 dark:bg-blue-950/40 p-4">
        <ShieldAlert className="h-5 w-5 shrink-0 text-blue-700 dark:text-blue-400 mt-0.5" />
        <div className="text-xs text-blue-900 dark:text-blue-200 leading-relaxed">
          <strong>Section 194J Compliance Note:</strong> As per Indian Income Tax regulations for professional influencer services, TDS is deducted at 10% on payments exceeding ₹30,000 annually. TDS certificates (Form 16A) are issued quarterly against your PAN: <strong>{creator.panNumber}</strong>.
        </div>
      </div>

      {/* Payout Details & Bank Account Widget */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Payout History Table */}
        <div className="lg:col-span-2 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm overflow-hidden">
          <div className="border-b border-slate-200 dark:border-slate-800 px-6 py-4 bg-slate-50/50 dark:bg-slate-800/40 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Payout & Settlement History
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                All disbursements sent via IMPS, NEFT, or instant UPI with UTR bank reference.
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100/70 dark:bg-slate-800/70 text-[11px] uppercase tracking-wider text-slate-600 dark:text-slate-300 font-semibold border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="px-6 py-3.5">Invoice #</th>
                  <th className="px-4 py-3.5">Date</th>
                  <th className="px-4 py-3.5">Gross</th>
                  <th className="px-4 py-3.5">TDS (10%)</th>
                  <th className="px-4 py-3.5">Net Credited</th>
                  <th className="px-4 py-3.5">Status</th>
                  <th className="px-6 py-3.5 text-right">Invoice</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {payouts.map((payout) => (
                  <tr key={payout.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="px-6 py-4 font-mono font-bold text-slate-900 dark:text-white">
                      {payout.invoiceNumber}
                      {payout.utrNumber && (
                        <div className="text-[10px] text-slate-400 dark:text-slate-500 font-normal font-sans">
                          UTR: {payout.utrNumber}
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-4 text-slate-600 dark:text-slate-400">
                      {formatDate(payout.paidAt || payout.createdAt)}
                    </td>
                    <td className="px-4 py-4 font-semibold text-slate-800 dark:text-slate-200">
                      {formatINR(payout.amount)}
                    </td>
                    <td className="px-4 py-4 text-rose-600 dark:text-rose-400 font-medium">
                      -{formatINR(payout.tdsDeducted)}
                    </td>
                    <td className="px-4 py-4 font-extrabold text-emerald-600 dark:text-emerald-400">
                      {formatINR(payout.netAmount)}
                    </td>
                    <td className="px-4 py-4">
                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                          payout.status === "Paid"
                            ? "bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60"
                            : "bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800/60"
                        }`}
                      >
                        {payout.status === "Paid" ? "Credited" : payout.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => setSelectedInvoice(payout)}
                        className="inline-flex items-center gap-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-2.5 py-1 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-slate-700 transition shadow-sm"
                      >
                        <FileText className="h-3.5 w-3.5" />
                        <span>View PDF</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* UPI & Bank Account Details */}
        <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3 mb-4">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Payout Account Details
              </h3>
              <button
                onClick={() => setIsEditingBank(!isEditingBank)}
                className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline"
              >
                <Edit2 className="h-3.5 w-3.5" />
                <span>{isEditingBank ? "Cancel" : "Edit"}</span>
              </button>
            </div>

            {isEditingBank ? (
              <form onSubmit={handleSaveBankDetails} className="space-y-3 text-xs">
                <div>
                  <label className="block text-slate-600 dark:text-slate-400 font-medium mb-1">
                    UPI ID (Virtual Payment Address)
                  </label>
                  <input
                    type="text"
                    required
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-2 text-slate-800 dark:text-white focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-600 dark:text-slate-400 font-medium mb-1">
                    Bank Account Number
                  </label>
                  <input
                    type="text"
                    required
                    value={bankAccount}
                    onChange={(e) => setBankAccount(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-2 text-slate-800 dark:text-white focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-600 dark:text-slate-400 font-medium mb-1">
                    Bank IFSC Code
                  </label>
                  <input
                    type="text"
                    required
                    value={bankIfsc}
                    onChange={(e) => setBankIfsc(e.target.value.toUpperCase())}
                    className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-2 text-slate-800 dark:text-white focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-600 dark:text-slate-400 font-medium mb-1">
                    PAN Card Number (for TDS)
                  </label>
                  <input
                    type="text"
                    required
                    value={panNumber}
                    onChange={(e) => setPanNumber(e.target.value.toUpperCase())}
                    className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-2 text-slate-800 dark:text-white focus:outline-none focus:border-blue-500"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full rounded-xl bg-blue-600 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-blue-700 transition"
                >
                  Save Banking Information
                </button>
              </form>
            ) : (
              <div className="space-y-3.5 text-xs">
                <div className="rounded-xl bg-slate-50 dark:bg-slate-800/60 p-3 border border-slate-100 dark:border-slate-800">
                  <div className="text-[11px] text-slate-400 uppercase font-semibold">
                    Primary Instant Mode
                  </div>
                  <div className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">
                    UPI ID: <span className="text-blue-600 dark:text-blue-400 font-mono">{creator.upiId}</span>
                  </div>
                </div>

                <div className="space-y-2 pt-1">
                  <div className="flex justify-between">
                    <span className="text-slate-500 dark:text-slate-400">Bank Account:</span>
                    <span className="font-mono text-slate-800 dark:text-slate-200 font-semibold">
                      •••• •••• {creator.bankAccountNumber?.slice(-4) || "1726"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 dark:text-slate-400">IFSC Code:</span>
                    <span className="font-mono text-slate-800 dark:text-slate-200 font-semibold">
                      {creator.bankIfsc}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 dark:text-slate-400">PAN Card:</span>
                    <span className="font-mono text-slate-800 dark:text-slate-200 font-semibold">
                      {creator.panNumber}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 dark:text-slate-400">Beneficiary Name:</span>
                    <span className="text-slate-800 dark:text-slate-200 font-semibold">{creator.name}</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-400">
            Disbursements occur on the 1st and 15th of each calendar month.
          </div>
        </div>
      </div>

      {/* Printable Invoice PDF Modal */}
      {selectedInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-2xl rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 shadow-2xl animate-in zoom-in-95 duration-150">
            {/* Modal Actions */}
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4 mb-6 no-print">
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Tax Invoice & Payment Receipt
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrint}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-3.5 py-2 text-xs font-semibold text-white shadow-sm hover:bg-blue-700 transition"
                >
                  <Printer className="h-4 w-4" />
                  <span>Print / Save PDF</span>
                </button>
                <button
                  onClick={() => setSelectedInvoice(null)}
                  className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-700 dark:hover:text-slate-200"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Printable Invoice Layout */}
            <div className="space-y-6 text-xs text-slate-800 dark:text-slate-200">
              {/* Invoice Header */}
              <div className="flex justify-between items-start border-b border-slate-200 dark:border-slate-800 pb-6">
                <div>
                  <div className="text-xl font-black text-slate-900 dark:text-white">
                    Get You Collab Technologies Pvt. Ltd.
                  </div>
                  <div className="text-slate-500 dark:text-slate-400 text-xs mt-1">
                    Level 5, Platina Tower, Bandra Kurla Complex (BKC)
                    <br />
                    Mumbai, Maharashtra - 400051
                    <br />
                    GSTIN: 27AABCG1234F1Z8 · TAN: MUMG12345B
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-base font-bold text-blue-600 dark:text-blue-400">
                    {selectedInvoice.invoiceNumber}
                  </div>
                  <div className="text-slate-500 dark:text-slate-400 mt-1">
                    Date: {formatDate(selectedInvoice.paidAt || selectedInvoice.createdAt)}
                  </div>
                  <div className="mt-1">
                    <span className="rounded bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 px-2 py-0.5 font-bold text-[10px]">
                      {selectedInvoice.status.toUpperCase()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Creator & Bank Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-[11px] font-bold uppercase text-slate-400">
                    Billed To (Creator):
                  </div>
                  <div className="font-bold text-slate-900 dark:text-white mt-1 text-sm">
                    {creator.name} ({creator.handle})
                  </div>
                  <div className="text-slate-500 dark:text-slate-400">
                    PAN: {creator.panNumber}
                    <br />
                    City: {creator.city}, India
                    <br />
                    Email: {creator.email}
                  </div>
                </div>
                <div>
                  <div className="text-[11px] font-bold uppercase text-slate-400">
                    Payment Details:
                  </div>
                  <div className="text-slate-700 dark:text-slate-300 mt-1">
                    Mode: <strong>{selectedInvoice.paymentMethod}</strong>
                    <br />
                    Beneficiary: {creator.name}
                    <br />
                    UTR Reference: <strong className="font-mono">{selectedInvoice.utrNumber || "Processing"}</strong>
                  </div>
                </div>
              </div>

              {/* Line Items Table */}
              <table className="w-full border border-slate-200 dark:border-slate-800 text-left">
                <thead className="bg-slate-50 dark:bg-slate-800/60 text-[11px] uppercase text-slate-600 dark:text-slate-300 font-semibold border-b border-slate-200 dark:border-slate-800">
                  <tr>
                    <th className="p-3">Description</th>
                    <th className="p-3 text-right">Gross Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  <tr>
                    <td className="p-3">
                      Influencer Marketing & Content Creation Deliverables
                      <div className="text-[11px] text-slate-500 dark:text-slate-400">
                        Sponsored Instagram Reels, Stories & Sales Attribution
                      </div>
                    </td>
                    <td className="p-3 text-right font-bold text-slate-900 dark:text-white">
                      {formatINR(selectedInvoice.amount)}
                    </td>
                  </tr>
                  <tr className="bg-slate-50/50 dark:bg-slate-800/30">
                    <td className="p-3 text-rose-700 dark:text-rose-400">
                      Less: TDS Deducted under Section 194J (10%)
                    </td>
                    <td className="p-3 text-right text-rose-700 dark:text-rose-400 font-bold">
                      -{formatINR(selectedInvoice.tdsDeducted)}
                    </td>
                  </tr>
                  <tr className="bg-slate-100 dark:bg-slate-800/80 font-bold text-sm">
                    <td className="p-3 text-slate-900 dark:text-white">Total Net Amount Credited</td>
                    <td className="p-3 text-right text-emerald-600 dark:text-emerald-400 font-black">
                      {formatINR(selectedInvoice.netAmount)}
                    </td>
                  </tr>
                </tbody>
              </table>

              <div className="text-[11px] text-slate-400 text-center border-t border-slate-100 dark:border-slate-800 pt-4">
                This is a computer generated payment advice and requires no physical signature.
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
