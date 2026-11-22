"use client";

import React, { useState, useEffect } from "react";
import { appStore } from "@/lib/store";
import { formatINR, formatIndianNumber, formatDate } from "@/lib/utils";
import {
  FileText,
  Download,
  Printer,
  CheckCircle2,
  Calendar,
  Layers,
} from "lucide-react";

export default function AdminReportsPage() {
  const [state, setState] = useState(appStore.getState());
  const [reportType, setReportType] = useState<"creators" | "campaigns" | "tds">("creators");
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    return appStore.subscribe(() => {
      setState(appStore.getState());
    });
  }, []);

  const { creators, campaigns, payouts } = state;

  const exportCSV = () => {
    let csvContent = "data:text/csv;charset=utf-8,";

    if (reportType === "creators") {
      csvContent += "Name,Handle,Niche,Platform,City,Followers,Engagement Rate (%),Attributed GMV (INR),Commission (INR),Reliability Score\n";
      creators.forEach((c) => {
        csvContent += `"${c.name}","${c.handle}","${c.niche}","${c.platform}","${c.city}",${c.followersCount},${c.engagementRate},${c.totalSales},${c.totalCommission},${c.reliabilityScore}\n`;
      });
    } else if (reportType === "campaigns") {
      csvContent += "Campaign Name,Brand,Budget (INR),Commission (%),Clicks,Orders,Attributed Sales (INR),Status\n";
      campaigns.forEach((cmp) => {
        csvContent += `"${cmp.name}","${cmp.brandName}",${cmp.budget},${cmp.commissionRate},${cmp.clicks},${cmp.orders},${cmp.totalSales},"${cmp.status}"\n`;
      });
    } else {
      csvContent += "Invoice #,Creator,PAN Number,Date,Payment Mode,Gross Amount (INR),TDS 10% (INR),Net Amount (INR),UTR Reference\n";
      payouts.forEach((p) => {
        const crt = creators.find((c) => c.id === p.creatorId);
        csvContent += `"${p.invoiceNumber}","${p.creatorName}","${crt?.panNumber || "ABCDE1234F"}","${p.paidAt || p.createdAt}","${p.paymentMethod}",${p.amount},${p.tdsDeducted},${p.netAmount},"${p.utrNumber || ""}"\n`;
      });
    }

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `GYC_Agency_${reportType}_report.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setToast(`Exported ${reportType} CSV successfully!`);
    setTimeout(() => setToast(null), 3000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Toast Alert */}
      {toast && (
        <div className="fixed top-20 right-6 z-50 flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-3 text-xs font-semibold text-white shadow-xl animate-in slide-in-from-top duration-200">
          <CheckCircle2 className="h-4 w-4 text-emerald-400" />
          <span>{toast}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between no-print">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl dark:text-white">
            Agency Financial & Campaign Reports
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Export official statements for brand billing, creator settlements, and corporate tax compliance.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={exportCSV}
            className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-blue-700 transition"
          >
            <Download className="h-4 w-4" />
            <span>Download CSV</span>
          </button>
          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-slate-700 shadow-sm hover:bg-slate-50 transition dark:bg-slate-800 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-700"
          >
            <Printer className="h-4 w-4" />
            <span>Print Report</span>
          </button>
        </div>
      </div>

      {/* Report Type Selector */}
      <div className="flex rounded-xl bg-slate-200/70 p-1 w-fit text-xs font-semibold no-print dark:bg-slate-800">
        <button
          onClick={() => setReportType("creators")}
          className={`rounded-lg px-4 py-2 transition ${
            reportType === "creators"
              ? "bg-white text-slate-900 font-bold shadow-sm dark:bg-blue-600 dark:text-white"
              : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
          }`}
        >
          Creator Roster & GMV
        </button>
        <button
          onClick={() => setReportType("campaigns")}
          className={`rounded-lg px-4 py-2 transition ${
            reportType === "campaigns"
              ? "bg-white text-slate-900 font-bold shadow-sm dark:bg-blue-600 dark:text-white"
              : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
          }`}
        >
          Brand Campaign ROI
        </button>
        <button
          onClick={() => setReportType("tds")}
          className={`rounded-lg px-4 py-2 transition ${
            reportType === "tds"
              ? "bg-white text-slate-900 font-bold shadow-sm dark:bg-blue-600 dark:text-white"
              : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
          }`}
        >
          Section 194J TDS Ledger
        </button>
      </div>

      {/* Printable Sheet */}
      <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm text-xs dark:border-slate-800 dark:bg-slate-900">
        {/* Header */}
        <div className="border-b border-slate-200 pb-5 mb-6 flex justify-between items-start dark:border-slate-800">
          <div>
            <div className="text-xl font-bold text-slate-900 dark:text-white">
              Get You Collab Technologies Pvt. Ltd.
            </div>
            <div className="text-slate-500 mt-1 dark:text-slate-400">
              Quarterly Agency Report:{" "}
              <strong className="text-slate-800 uppercase dark:text-slate-200">
                {reportType === "creators"
                  ? "Influencer Roster & Revenue Attribution"
                  : reportType === "campaigns"
                  ? "Brand Campaign Performance Ledger"
                  : "Section 194J TDS Tax Deduction Register"}
              </strong>
            </div>
          </div>
          <div className="text-right text-slate-500 dark:text-slate-400">
            <div>Date: {new Date().toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" })}</div>
            <div className="text-emerald-600 font-semibold mt-0.5 dark:text-emerald-400">Currency: INR (₹)</div>
          </div>
        </div>

        {/* Dynamic Table */}
        {reportType === "creators" && (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-100 uppercase text-[11px] font-bold text-slate-600 border-b border-slate-200 dark:bg-slate-800/80 dark:border-slate-700 dark:text-slate-400">
                <tr>
                  <th className="p-3">Creator Name</th>
                  <th className="p-3">Handle</th>
                  <th className="p-3">Niche & City</th>
                  <th className="p-3 text-right">Followers</th>
                  <th className="p-3 text-right">Engagement</th>
                  <th className="p-3 text-right">Attributed GMV</th>
                  <th className="p-3 text-right">Commission</th>
                  <th className="p-3 text-center">Reliability</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {creators.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                    <td className="p-3 font-bold text-slate-900 dark:text-white">{c.name}</td>
                    <td className="p-3 text-blue-600 font-semibold dark:text-blue-400">{c.handle}</td>
                    <td className="p-3 text-slate-600 dark:text-slate-300">{c.niche} ({c.city})</td>
                    <td className="p-3 text-right font-medium dark:text-slate-300">{formatIndianNumber(c.followersCount)}</td>
                    <td className="p-3 text-right font-bold text-blue-600 dark:text-blue-400">{c.engagementRate}%</td>
                    <td className="p-3 text-right font-bold text-emerald-600 dark:text-emerald-400">{formatINR(c.totalSales)}</td>
                    <td className="p-3 text-right font-semibold text-slate-800 dark:text-slate-200">{formatINR(c.totalCommission)}</td>
                    <td className="p-3 text-center font-bold dark:text-slate-200">{c.reliabilityScore}/100</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {reportType === "campaigns" && (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-100 uppercase text-[11px] font-bold text-slate-600 border-b border-slate-200 dark:bg-slate-800/80 dark:border-slate-700 dark:text-slate-400">
                <tr>
                  <th className="p-3">Campaign</th>
                  <th className="p-3">Brand</th>
                  <th className="p-3 text-right">Budget</th>
                  <th className="p-3 text-right">Commission Rate</th>
                  <th className="p-3 text-right">Clicks</th>
                  <th className="p-3 text-right">Orders</th>
                  <th className="p-3 text-right">Total Attributed Sales</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {campaigns.map((cmp) => (
                  <tr key={cmp.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                    <td className="p-3 font-bold text-slate-900 dark:text-white">{cmp.name}</td>
                    <td className="p-3 text-slate-700 font-medium dark:text-slate-300">{cmp.brandName}</td>
                    <td className="p-3 text-right font-semibold text-slate-800 dark:text-slate-200">{formatINR(cmp.budget)}</td>
                    <td className="p-3 text-right font-bold text-blue-600 dark:text-blue-400">{cmp.commissionRate}%</td>
                    <td className="p-3 text-right dark:text-slate-300">{formatIndianNumber(cmp.clicks)}</td>
                    <td className="p-3 text-right dark:text-slate-300">{cmp.orders}</td>
                    <td className="p-3 text-right font-extrabold text-emerald-600 dark:text-emerald-400">{formatINR(cmp.totalSales)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {reportType === "tds" && (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-100 uppercase text-[11px] font-bold text-slate-600 border-b border-slate-200 dark:bg-slate-800/80 dark:border-slate-700 dark:text-slate-400">
                <tr>
                  <th className="p-3">Invoice #</th>
                  <th className="p-3">Beneficiary Creator</th>
                  <th className="p-3">Payment Mode</th>
                  <th className="p-3 text-right">Gross Amount</th>
                  <th className="p-3 text-right">TDS (10%)</th>
                  <th className="p-3 text-right">Net Credited</th>
                  <th className="p-3 text-center">UTR Reference</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {payouts.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                    <td className="p-3 font-mono font-bold text-slate-900 dark:text-white">{p.invoiceNumber}</td>
                    <td className="p-3 font-bold text-slate-800 dark:text-slate-200">{p.creatorName}</td>
                    <td className="p-3 text-slate-600 font-semibold dark:text-slate-300">{p.paymentMethod}</td>
                    <td className="p-3 text-right font-semibold dark:text-slate-200">{formatINR(p.amount)}</td>
                    <td className="p-3 text-right font-bold text-rose-600 dark:text-rose-400">-{formatINR(p.tdsDeducted)}</td>
                    <td className="p-3 text-right font-extrabold text-emerald-600 dark:text-emerald-400">{formatINR(p.netAmount)}</td>
                    <td className="p-3 text-center font-mono text-[11px] text-slate-600 dark:text-slate-400">
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
