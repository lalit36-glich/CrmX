"use client";

import React, { useState, useEffect } from "react";
import { appStore } from "@/lib/store";
import { Deal, DealStatus } from "@/lib/types";
import { formatINR, formatDate, formatIndianNumber } from "@/lib/utils";
import {
  Handshake,
  CheckCircle,
  Clock,
  Calendar,
  Search,
  Filter,
  CheckCircle2,
} from "lucide-react";

export default function AdminDealsPage() {
  const [state, setState] = useState(appStore.getState());
  const [filterStatus, setFilterStatus] = useState<string>("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [successToast, setSuccessToast] = useState<string | null>(null);

  useEffect(() => {
    return appStore.subscribe(() => {
      setState(appStore.getState());
    });
  }, []);

  const { deals } = state;

  const filteredDeals = deals.filter((d) => {
    if (filterStatus !== "All" && d.status !== filterStatus) return false;
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      return (
        d.creatorName.toLowerCase().includes(q) ||
        d.campaignName.toLowerCase().includes(q) ||
        d.brandName.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleStatusChange = (dealId: string, status: DealStatus) => {
    appStore.updateDealStatus(dealId, status);
    setSuccessToast(`Deal status updated to "${status}"`);
    setTimeout(() => setSuccessToast(null), 2500);
  };

  return (
    <div className="space-y-6">
      {/* Toast */}
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
            Deals & Contracts Management
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Monitor creator agreements, deliverable timelines, and compensation terms.
          </p>
        </div>
        <div className="text-xs font-semibold text-slate-600 bg-white border border-slate-200 px-3 py-1.5 rounded-xl dark:bg-slate-900 dark:border-slate-800 dark:text-slate-300">
          Total Deals: <strong className="text-blue-600 dark:text-blue-400">{deals.length}</strong>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="relative w-full sm:w-72">
          <input
            type="text"
            placeholder="Search by creator, campaign or brand..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-3.5 pr-4 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:placeholder-slate-500"
          />
        </div>

        <div className="flex flex-wrap items-center gap-1.5 text-xs">
          {["All", "Invited", "Accepted", "Content Submitted", "Approved", "Live", "Completed"].map(
            (st) => (
              <button
                key={st}
                onClick={() => setFilterStatus(st)}
                className={`rounded-lg px-2.5 py-1 text-xs transition ${
                  filterStatus === st
                    ? "bg-slate-900 text-white font-bold dark:bg-blue-600"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
                }`}
              >
                {st}
              </button>
            )
          )}
        </div>
      </div>

      {/* Deals Table */}
      <div className="rounded-2xl border border-slate-200/80 bg-white shadow-sm overflow-hidden dark:border-slate-800 dark:bg-slate-900">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100/70 text-[11px] uppercase tracking-wider text-slate-600 font-semibold border-b border-slate-200 dark:bg-slate-800/80 dark:border-slate-700 dark:text-slate-400">
              <tr>
                <th className="px-6 py-3.5">Creator & Brand</th>
                <th className="px-4 py-3.5">Campaign</th>
                <th className="px-4 py-3.5">Deliverables</th>
                <th className="px-4 py-3.5">Deadline</th>
                <th className="px-4 py-3.5 text-right">Fixed Fee</th>
                <th className="px-4 py-3.5 text-right">Attributed Sales</th>
                <th className="px-4 py-3.5 text-center">Status</th>
                <th className="px-6 py-3.5 text-right">Quick Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredDeals.map((deal) => (
                <tr key={deal.id} className="hover:bg-slate-50/80 transition-colors dark:hover:bg-slate-800/50">
                  <td className="px-6 py-4">
                    <div className="font-bold text-slate-900 text-sm dark:text-white">
                      {deal.creatorName}
                    </div>
                    <div className="text-[11px] text-blue-600 font-medium dark:text-blue-400">
                      Brand: {deal.brandName}
                    </div>
                  </td>
                  <td className="px-4 py-4 text-slate-700 font-medium max-w-xs truncate dark:text-slate-300">
                    {deal.campaignName}
                  </td>
                  <td className="px-4 py-4 text-slate-600 max-w-xs text-[11px] dark:text-slate-400">
                    {deal.deliverables}
                  </td>
                  <td className="px-4 py-4 text-slate-700 font-medium dark:text-slate-300">
                    {formatDate(deal.deadline)}
                  </td>
                  <td className="px-4 py-4 text-right font-bold text-slate-900 dark:text-white">
                    {formatINR(deal.dealValue)}
                    <div className="text-[10px] text-emerald-600 dark:text-emerald-400">
                      +{deal.commissionPercentage}% Comm
                    </div>
                  </td>
                  <td className="px-4 py-4 text-right font-extrabold text-emerald-600 dark:text-emerald-400">
                    {formatINR(deal.sales)}
                    <div className="text-[10px] text-slate-400 dark:text-slate-500">
                      {deal.orders} orders
                    </div>
                  </td>
                  <td className="px-4 py-4 text-center">
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                        deal.status === "Live"
                          ? "bg-green-100 text-green-800 dark:bg-emerald-950/60 dark:text-emerald-300"
                          : deal.status === "Approved"
                          ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300"
                          : deal.status === "Content Submitted"
                          ? "bg-purple-100 text-purple-800 dark:bg-purple-950/60 dark:text-purple-300"
                          : deal.status === "Accepted"
                          ? "bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300"
                          : "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300"
                      }`}
                    >
                      {deal.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <select
                      value={deal.status}
                      onChange={(e) =>
                        handleStatusChange(deal.id, e.target.value as DealStatus)
                      }
                      className="rounded-lg border border-slate-200 bg-white p-1 text-slate-700 text-xs outline-none cursor-pointer dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300"
                    >
                      <option value="Invited">Invited</option>
                      <option value="Accepted">Accepted</option>
                      <option value="Content Submitted">Content Submitted</option>
                      <option value="Approved">Approved</option>
                      <option value="Live">Live</option>
                      <option value="Completed">Completed</option>
                      <option value="Declined">Declined</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
