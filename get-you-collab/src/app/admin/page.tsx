"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { appStore } from "@/lib/store";
import { formatINR, formatIndianNumber, formatDate } from "@/lib/utils";
import {
  Sparkles,
  TrendingUp,
  Handshake,
  Users,
  Building2,
  Megaphone,
  CheckSquare,
  Receipt,
  ArrowRight,
  ShieldCheck,
  Clock,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";

export default function AdminDashboardPage() {
  const [state, setState] = useState(appStore.getState());

  useEffect(() => {
    return appStore.subscribe(() => {
      setState(appStore.getState());
    });
  }, []);

  const { creators, brands, campaigns, deals, contentItems, payouts, tasks } = state;

  // Agency KPIs
  const totalAgencyGMV = campaigns.reduce((acc, curr) => acc + curr.totalSales, 0);
  const totalCommissionsEarned = campaigns.reduce((acc, curr) => acc + curr.totalCommission, 0);
  const activeCampaignsCount = campaigns.filter((c) => c.status === "Active").length;
  const pendingApprovals = contentItems.filter((c) => c.status === "Pending Approval");
  const pendingPayoutsTotal = payouts
    .filter((p) => p.status === "Pending" || p.status === "Processing")
    .reduce((acc, curr) => acc + curr.netAmount, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Agency Command Center
          </h1>
          <p className="text-sm text-slate-500">
            Real-time influencer marketing intelligence, creator deliverables, and commission settlements.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/admin/insights"
            className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-blue-700 transition"
          >
            <Sparkles className="h-4 w-4" />
            <span>Open Creator Insights</span>
          </Link>
        </div>
      </div>

      {/* 4 Primary Agency KPI Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Total GMV */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Agency Gross Sales (GMV)
            </span>
            <div className="rounded-xl bg-emerald-50 p-2 text-emerald-600">
              <TrendingUp className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3 text-3xl font-black text-emerald-600">
            {formatINR(totalAgencyGMV)}
          </div>
          <div className="mt-2 text-[11px] text-slate-500">
            Creator Commissions: <strong className="text-slate-800">{formatINR(totalCommissionsEarned)}</strong>
          </div>
        </div>

        {/* Active Campaigns */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Active Campaigns
            </span>
            <div className="rounded-xl bg-blue-50 p-2 text-blue-600">
              <Megaphone className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3 text-3xl font-black text-slate-900">
            {activeCampaignsCount}
          </div>
          <div className="mt-2 text-[11px] text-slate-500">
            Across {brands.length} partner brands (BoAt, Luma, Snitch)
          </div>
        </div>

        {/* Pending Content Approvals */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Content Approvals Queue
            </span>
            <div className="rounded-xl bg-amber-50 p-2 text-amber-600">
              <CheckSquare className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3 text-3xl font-black text-amber-600">
            {pendingApprovals.length}
          </div>
          <div className="mt-2 text-[11px] text-slate-500">
            Reels & story drafts awaiting review
          </div>
        </div>

        {/* Pending Payout Escrows */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Pending Payout Escrow
            </span>
            <div className="rounded-xl bg-purple-50 p-2 text-purple-600">
              <Receipt className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3 text-3xl font-black text-purple-700">
            {formatINR(pendingPayoutsTotal)}
          </div>
          <div className="mt-2 text-[11px] text-slate-500">
            10% TDS auto-calculated under 194J
          </div>
        </div>
      </div>

      {/* Main Grid: Pending Approvals & High Priority Tasks */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Content Approvals Queue */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Creator Content Approvals Queue
                </h3>
                <p className="text-xs text-slate-500">
                  Review submitted Reels and assets before they go live on creator feeds.
                </p>
              </div>
              <Link
                href="/admin/approvals"
                className="text-xs font-semibold text-blue-600 hover:underline flex items-center gap-1"
              >
                View All ({pendingApprovals.length}) <ArrowRight className="h-3 w-3" />
              </Link>
            </div>

            <div className="space-y-3">
              {pendingApprovals.slice(0, 3).map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-3.5 rounded-xl border border-slate-100 bg-slate-50/70"
                >
                  <div>
                    <div className="text-xs font-bold text-slate-900">
                      {item.title}
                    </div>
                    <div className="text-[11px] text-slate-500 mt-0.5">
                      Creator: <strong className="text-slate-700">{item.creatorName}</strong> · Campaign: {item.campaignName}
                    </div>
                  </div>

                  <Link
                    href="/admin/approvals"
                    className="rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-blue-700 transition"
                  >
                    Review Asset
                  </Link>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-400">
            Approving automatically notifies creator and updates campaign deal status.
          </div>
        </div>

        {/* Priority Action Tasks */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Follow-ups & High Priority Tasks
                </h3>
                <p className="text-xs text-slate-500">
                  Urgent agency reminders, creator extensions, and fraud verifications.
                </p>
              </div>
              <Link
                href="/admin/tasks"
                className="text-xs font-semibold text-blue-600 hover:underline flex items-center gap-1"
              >
                All Tasks <ArrowRight className="h-3 w-3" />
              </Link>
            </div>

            <div className="space-y-3">
              {tasks.slice(0, 3).map((t) => (
                <div
                  key={t.id}
                  className="flex items-start justify-between p-3.5 rounded-xl border border-slate-100 bg-slate-50/70"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span
                        className={`rounded px-1.5 py-0.5 text-[10px] font-bold ${
                          t.priority === "Urgent"
                            ? "bg-rose-100 text-rose-700"
                            : "bg-amber-100 text-amber-700"
                        }`}
                      >
                        {t.priority}
                      </span>
                      <span className="text-xs font-bold text-slate-900">
                        {t.title}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 line-clamp-1">
                      {t.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
            <span>Section 194J Filing due June 25</span>
            <Link href="/admin/payouts" className="text-blue-600 font-semibold hover:underline">
              Go to Payouts →
            </Link>
          </div>
        </div>
      </div>

      {/* Recent Campaign Deals Performance Table */}
      <div className="rounded-2xl border border-slate-200/80 bg-white shadow-sm overflow-hidden">
        <div className="border-b border-slate-200 px-6 py-4 flex items-center justify-between bg-slate-50/50">
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              Agency Active Campaigns & Attribution Overview
            </h3>
            <p className="text-xs text-slate-500">
              Live e-commerce GMV, clicks, and coupon redemption stats.
            </p>
          </div>
          <Link
            href="/admin/campaigns"
            className="text-xs font-semibold text-blue-600 hover:underline"
          >
            Manage Campaigns →
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100/70 text-[11px] uppercase tracking-wider text-slate-600 font-semibold border-b border-slate-200">
              <tr>
                <th className="px-6 py-3.5">Campaign</th>
                <th className="px-4 py-3.5">Brand</th>
                <th className="px-4 py-3.5 text-right">Budget</th>
                <th className="px-4 py-3.5 text-right">Clicks</th>
                <th className="px-4 py-3.5 text-right">Orders</th>
                <th className="px-4 py-3.5 text-right">Total GMV (Sales)</th>
                <th className="px-4 py-3.5 text-right">Commission Rate</th>
                <th className="px-6 py-3.5 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {campaigns.map((cmp) => (
                <tr key={cmp.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="px-6 py-4 font-bold text-slate-900">
                    {cmp.name}
                  </td>
                  <td className="px-4 py-4 text-slate-700 font-medium">
                    {cmp.brandName}
                  </td>
                  <td className="px-4 py-4 text-right font-semibold text-slate-800">
                    {formatINR(cmp.budget)}
                  </td>
                  <td className="px-4 py-4 text-right text-slate-800 font-medium">
                    {formatIndianNumber(cmp.clicks)}
                  </td>
                  <td className="px-4 py-4 text-right text-slate-800 font-medium">
                    {cmp.orders}
                  </td>
                  <td className="px-4 py-4 text-right font-extrabold text-emerald-600">
                    {formatINR(cmp.totalSales)}
                  </td>
                  <td className="px-4 py-4 text-right font-semibold text-blue-600">
                    {cmp.commissionRate}%
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${
                        cmp.status === "Active"
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                          : cmp.status === "Completed"
                          ? "bg-slate-100 text-slate-700 border border-slate-300"
                          : "bg-amber-50 text-amber-700 border border-amber-200"
                      }`}
                    >
                      {cmp.status}
                    </span>
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
