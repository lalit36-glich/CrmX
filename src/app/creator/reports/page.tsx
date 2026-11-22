"use client";

import React, { useState, useEffect } from "react";
import { appStore } from "@/lib/store";
import { formatINR, formatIndianNumber, formatDate } from "@/lib/utils";
import {
  FileText,
  Download,
  Printer,
  Calendar,
  CheckCircle2,
  Table,
  Filter,
} from "lucide-react";

export default function CreatorReportsPage() {
  const [state, setState] = useState(appStore.getState());
  const [reportType, setReportType] = useState<"campaigns" | "payouts">("campaigns");
  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null);

  useEffect(() => {
    return appStore.subscribe(() => {
      setState(appStore.getState());
    });
  }, []);

  const creatorId = state.currentUser.creatorId || "crt-aarav-mehta";
  const creator = state.creators.find((c) => c.id === creatorId) || state.creators[0];
  const deals = state.deals.filter((d) => d.creatorId === creatorId);
  const payouts = state.payouts.filter((p) => p.creatorId === creatorId);

  const exportCSV = () => {
    let csvContent = "data:text/csv;charset=utf-8,";

    if (reportType === "campaigns") {
      csvContent += "Campaign,Brand,Status,Deadline,Clicks,Orders,Attributed Sales (INR),Commission (INR)\n";
      deals.forEach((d) => {
        csvContent += `"${d.campaignName}","${d.brandName}","${d.status}","${d.deadline}",${d.clicks},${d.orders},${d.sales},${d.commission}\n`;
      });
    } else {
      csvContent += "Invoice Number,Date,Status,Payment Mode,Gross Amount (INR),TDS Deducted (INR),Net Credited (INR),UTR Number\n";
      payouts.forEach((p) => {
        csvContent += `"${p.invoiceNumber}","${p.paidAt || p.createdAt}","${p.status}","${p.paymentMethod}",${p.amount},${p.tdsDeducted},${p.netAmount},"${p.utrNumber || ""}"\n`;
      });
    }

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute(
      "download",
      `GYC_${creator.handle.replace("@", "")}_${reportType}_report.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setDownloadSuccess(`Exported ${reportType} CSV successfully!`);
    setTimeout(() => setDownloadSuccess(null), 3000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Toast alert */}
      {downloadSuccess && (
        <div className="fixed top-20 right-6 z-50 flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-3 text-xs font-semibold text-white shadow-xl animate-in slide-in-from-top duration-200">
          <CheckCircle2 className="h-4 w-4 text-emerald-400" />
          <span>{downloadSuccess}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between no-print">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Creator Reports & Exports
          </h1>
          <p className="text-sm text-slate-500">
            Download or print your performance logs, campaign deliverables, and quarterly financial statements.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={exportCSV}
            className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-blue-700 transition"
          >
            <Download className="h-4 w-4" />
            <span>Export CSV</span>
          </button>
          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-slate-700 shadow-sm hover:bg-slate-50 transition"
          >
            <Printer className="h-4 w-4" />
            <span>Print Report</span>
          </button>
        </div>
      </div>

      {/* Report Switcher Tabs */}
      <div className="flex rounded-xl bg-slate-200/70 p-1 w-fit text-xs font-semibold no-print">
        <button
          onClick={() => setReportType("campaigns")}
          className={`rounded-lg px-4 py-2 transition ${
            reportType === "campaigns"
              ? "bg-white text-slate-900 font-bold shadow-sm"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          Campaign Performance Report
        </button>
        <button
          onClick={() => setReportType("payouts")}
          className={`rounded-lg px-4 py-2 transition ${
            reportType === "payouts"
              ? "bg-white text-slate-900 font-bold shadow-sm"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          Earnings & TDS Statement
        </button>
      </div>

      {/* Report Document Sheet */}
      <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm">
        {/* Document Header */}
        <div className="border-b border-slate-200 pb-5 mb-6 flex justify-between items-start">
          <div>
            <div className="text-lg font-bold text-slate-900">
              Get You Collab · {reportType === "campaigns" ? "Campaign Attribution Ledger" : "Tax Deducted Earnings Statement"}
            </div>
            <div className="text-xs text-slate-500 mt-1">
              Creator: <strong className="text-slate-800">{creator.name}</strong> ({creator.handle}) · PAN: {creator.panNumber}
            </div>
          </div>
          <div className="text-right text-xs text-slate-500">
            <div>Generated: {new Date().toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" })}</div>
            <div className="font-semibold text-emerald-600 mt-0.5">Currency: INR (₹)</div>
          </div>
        </div>

        {/* Content Table */}
        {reportType === "campaigns" ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 text-[11px] uppercase tracking-wider text-slate-600 font-semibold border-b border-slate-200">
                <tr>
                  <th className="p-3">Campaign</th>
                  <th className="p-3">Brand</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Clicks</th>
                  <th className="p-3 text-right">Orders</th>
                  <th className="p-3 text-right">Attributed Sales</th>
                  <th className="p-3 text-right">Commission</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {deals.map((d) => (
                  <tr key={d.id} className="hover:bg-slate-50">
                    <td className="p-3 font-bold text-slate-900">{d.campaignName}</td>
                    <td className="p-3 text-slate-700">{d.brandName}</td>
                    <td className="p-3 font-medium text-slate-700">{d.status}</td>
                    <td className="p-3 text-right font-medium">{formatIndianNumber(d.clicks)}</td>
                    <td className="p-3 text-right font-medium">{d.orders}</td>
                    <td className="p-3 text-right font-bold text-slate-900">{formatINR(d.sales)}</td>
                    <td className="p-3 text-right font-bold text-emerald-600">{formatINR(d.commission)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 text-[11px] uppercase tracking-wider text-slate-600 font-semibold border-b border-slate-200">
                <tr>
                  <th className="p-3">Invoice #</th>
                  <th className="p-3">Date</th>
                  <th className="p-3">Mode</th>
                  <th className="p-3 text-right">Gross Amount</th>
                  <th className="p-3 text-right">TDS (10%)</th>
                  <th className="p-3 text-right">Net Credited</th>
                  <th className="p-3 text-center">UTR Reference</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {payouts.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50">
                    <td className="p-3 font-mono font-bold text-slate-900">{p.invoiceNumber}</td>
                    <td className="p-3 text-slate-600">{formatDate(p.paidAt || p.createdAt)}</td>
                    <td className="p-3 font-semibold text-slate-700">{p.paymentMethod}</td>
                    <td className="p-3 text-right font-semibold">{formatINR(p.amount)}</td>
                    <td className="p-3 text-right text-rose-600">-{formatINR(p.tdsDeducted)}</td>
                    <td className="p-3 text-right font-bold text-emerald-600">{formatINR(p.netAmount)}</td>
                    <td className="p-3 text-center font-mono text-[11px] text-slate-500">
                      {p.utrNumber || "In Escrow"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
