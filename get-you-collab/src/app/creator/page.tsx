"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { appStore } from "@/lib/store";
import { formatINR, formatIndianNumber } from "@/lib/utils";
import {
  Sparkles,
  ShieldCheck,
  Handshake,
  Video,
  Eye,
  TrendingUp,
  ArrowRight,
  ExternalLink,
  Copy,
  CheckCircle2,
  Clock,
  ChevronRight,
  BadgePercent,
} from "lucide-react";

export default function CreatorOverviewPage() {
  const [copiedLink, setCopiedLink] = useState<string | null>(null);
  const [state, setState] = useState(appStore.getState());

  useEffect(() => {
    return appStore.subscribe(() => {
      setState(appStore.getState());
    });
  }, []);

  const creatorId = state.currentUser.creatorId || "crt-aarav-mehta";
  const creator = state.creators.find((c) => c.id === creatorId) || state.creators[0];
  const deals = state.deals.filter((d) => d.creatorId === creatorId);
  const contentItems = state.contentItems.filter((c) => c.creatorId === creatorId);
  const trackingLinks = state.trackingLinks.filter((l) => l.creatorId === creatorId);

  // Totals
  const totalDeals = deals.length;
  const totalContent = contentItems.length;
  const totalTrackedViews = contentItems.reduce((acc, curr) => acc + (curr.viewsCount || 0), 0) || 48200;
  const totalAttributedSales = deals.reduce((acc, curr) => acc + (curr.sales || 0), 0);
  const totalCommission = deals.reduce((acc, curr) => acc + (curr.commission || 0), 0);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedLink(id);
    setTimeout(() => setCopiedLink(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Welcome Heading & Action */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
            Welcome back, Aarav 👋
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Here is your live campaign performance, tracked earnings, and active brand deliverables for this week.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/creator/deals"
            className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-semibold text-white shadow-sm shadow-blue-500/20 transition hover:bg-blue-700"
          >
            <Handshake className="h-4 w-4" />
            <span>Manage Brand Deals ({totalDeals})</span>
          </Link>
        </div>
      </div>

      {/* Strict Privacy Banner */}
      <div className="flex items-center justify-between rounded-xl border border-blue-200 dark:border-blue-900/60 bg-blue-50/70 dark:bg-blue-950/40 p-4 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-600 text-white shadow-sm">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div>
            <div className="text-xs font-bold text-blue-900 dark:text-blue-200 uppercase tracking-wide">
              Privacy Protected Workspace
            </div>
            <p className="text-xs text-blue-800 dark:text-blue-300">
              Your workspace is private to your influencer account (@aarav.lifestyle). Deal values, payout records, and audience insights are strictly isolated and not visible to other creators.
            </p>
          </div>
        </div>
        <div className="hidden sm:block">
          <span className="rounded-full bg-blue-200/70 dark:bg-blue-900/60 px-2.5 py-1 text-[11px] font-semibold text-blue-900 dark:text-blue-200">
            RLS Active
          </span>
        </div>
      </div>

      {/* 4 Required KPI Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* KPI 1: My brand deals */}
        <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm transition hover:shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              My Brand Deals
            </span>
            <div className="rounded-xl bg-blue-50 dark:bg-blue-950/60 p-2 text-blue-600 dark:text-blue-400">
              <Handshake className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900 dark:text-white">
              {totalDeals}
            </span>
            <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400">
              3 Active Campaigns
            </span>
          </div>
          <div className="mt-3 flex items-center justify-between text-[11px] text-slate-400 dark:text-slate-500 border-t border-slate-100 dark:border-slate-800 pt-3">
            <span>2 Approved, 1 Live</span>
            <Link href="/creator/deals" className="text-blue-600 dark:text-blue-400 font-semibold hover:underline flex items-center">
              View <ChevronRight className="h-3 w-3 inline" />
            </Link>
          </div>
        </div>

        {/* KPI 2: My content pieces */}
        <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm transition hover:shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              My Content Pieces
            </span>
            <div className="rounded-xl bg-indigo-50 dark:bg-indigo-950/60 p-2 text-indigo-600 dark:text-indigo-400">
              <Video className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900 dark:text-white">
              {totalContent}
            </span>
            <span className="text-xs font-medium text-blue-600 dark:text-blue-400">
              8 pieces total
            </span>
          </div>
          <div className="mt-3 flex items-center justify-between text-[11px] text-slate-400 dark:text-slate-500 border-t border-slate-100 dark:border-slate-800 pt-3">
            <span>4 Live Reels, 2 Stories, 2 Drafts</span>
            <span className="text-emerald-600 dark:text-emerald-400 font-medium">98% on-time</span>
          </div>
        </div>

        {/* KPI 3: My tracked views */}
        <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm transition hover:shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              My Tracked Views
            </span>
            <div className="rounded-xl bg-purple-50 dark:bg-purple-950/60 p-2 text-purple-600 dark:text-purple-400">
              <Eye className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900 dark:text-white">
              {formatIndianNumber(totalTrackedViews)}
            </span>
            <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400">
              +14% this month
            </span>
          </div>
          <div className="mt-3 flex items-center justify-between text-[11px] text-slate-400 dark:text-slate-500 border-t border-slate-100 dark:border-slate-800 pt-3">
            <span>Instagram & Shorts</span>
            <span className="font-semibold text-slate-700 dark:text-slate-300">4.9% Eng. Rate</span>
          </div>
        </div>

        {/* KPI 4: My attributed sales */}
        <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm transition hover:shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              My Attributed Sales
            </span>
            <div className="rounded-xl bg-emerald-50 dark:bg-emerald-950/60 p-2 text-emerald-600 dark:text-emerald-400">
              <TrendingUp className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900 dark:text-white">
              {formatINR(totalAttributedSales)}
            </span>
          </div>
          <div className="mt-3 flex items-center justify-between text-[11px] text-slate-400 dark:text-slate-500 border-t border-slate-100 dark:border-slate-800 pt-3">
            <span>Comm: <strong className="text-emerald-600 dark:text-emerald-400">{formatINR(totalCommission)}</strong></span>
            <span className="text-blue-600 dark:text-blue-400 font-medium">79 orders</span>
          </div>
        </div>
      </div>

      {/* Campaign Performance Table */}
      <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm overflow-hidden">
        <div className="border-b border-slate-200 dark:border-slate-800 px-6 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-slate-50/50 dark:bg-slate-800/40">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              My Recent Campaign Performance
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Real-time affiliate & sponsored campaign attribution synced via tracking links and coupons.
            </p>
          </div>
          <Link
            href="/creator/sales"
            className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline"
          >
            Detailed Analytics <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100/70 dark:bg-slate-800/70 text-[11px] uppercase tracking-wider text-slate-600 dark:text-slate-300 font-semibold border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="px-6 py-3.5">Campaign</th>
                <th className="px-4 py-3.5">Last Activity</th>
                <th className="px-4 py-3.5 text-right">Clicks</th>
                <th className="px-4 py-3.5 text-right">Orders</th>
                <th className="px-4 py-3.5 text-right">Attributed Sales</th>
                <th className="px-4 py-3.5 text-right">My Commission</th>
                <th className="px-6 py-3.5 text-center">Tracking Badge</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {deals.map((deal) => (
                <tr key={deal.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-bold text-slate-900 dark:text-white text-sm">
                      {deal.campaignName}
                    </div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                      Brand: <span className="font-medium text-slate-700 dark:text-slate-300">{deal.brandName}</span> · Deliverables: {deal.deliverables}
                    </div>
                  </td>
                  <td className="px-4 py-4 text-slate-600 dark:text-slate-300 font-medium">
                    <div className="flex items-center gap-1.5">
                      <Clock className="h-3.5 w-3.5 text-slate-400" />
                      <span>{deal.lastActivity}</span>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-right font-semibold text-slate-800 dark:text-slate-200">
                    {formatIndianNumber(deal.clicks)}
                  </td>
                  <td className="px-4 py-4 text-right font-semibold text-slate-800 dark:text-slate-200">
                    {deal.orders}
                  </td>
                  <td className="px-4 py-4 text-right font-bold text-slate-900 dark:text-white">
                    {formatINR(deal.sales)}
                  </td>
                  <td className="px-4 py-4 text-right font-bold text-emerald-600 dark:text-emerald-400">
                    {formatINR(deal.commission)}
                    <span className="block text-[10px] text-slate-400 font-normal">
                      ({deal.commissionPercentage}%)
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 dark:bg-emerald-950/50 px-2.5 py-1 text-[11px] font-semibold text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60">
                      <CheckCircle2 className="h-3 w-3 text-emerald-600 dark:text-emerald-400" />
                      {deal.trackingBadge}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Creator's Active Referral Links & Coupon Codes Widget */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4 mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                My Active Tracking Links & Coupon Codes
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Share these in your Instagram bio, stories swipe-up, and YouTube descriptions to earn commissions.
              </p>
            </div>
            <span className="rounded-lg bg-blue-50 dark:bg-blue-950/50 px-2.5 py-1 text-xs font-semibold text-blue-700 dark:text-blue-300">
              {trackingLinks.length} Active Codes
            </span>
          </div>

          <div className="space-y-3">
            {trackingLinks.map((link) => (
              <div
                key={link.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/50 p-3.5 hover:bg-slate-50 dark:hover:bg-slate-800/80 transition"
              >
                <div>
                  <div className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    {link.campaignName}
                  </div>
                  <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-slate-600 dark:text-slate-400">
                    <span className="font-mono bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 px-2 py-0.5 rounded text-blue-700 dark:text-blue-400 font-bold">
                      {link.couponCode}
                    </span>
                    <span className="text-slate-400">·</span>
                    <span className="text-slate-500 dark:text-slate-400 truncate max-w-xs font-mono text-[11px]">
                      gyc.in/{link.slug}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleCopy(`https://gyc.in/${link.slug}`, link.id)}
                    className="inline-flex items-center gap-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 shadow-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition"
                  >
                    {copiedLink === link.id ? (
                      <>
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                        <span className="text-emerald-600 dark:text-emerald-400">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-3.5 w-3.5 text-slate-500 dark:text-slate-400" />
                        <span>Copy Link</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => handleCopy(link.couponCode, `c-${link.id}`)}
                    className="inline-flex items-center gap-1 rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-blue-700 transition"
                  >
                    {copiedLink === `c-${link.id}` ? (
                      <span>Code Copied!</span>
                    ) : (
                      <>
                        <BadgePercent className="h-3.5 w-3.5" />
                        <span>Copy Coupon</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Creator Profile Card Snapshot */}
        <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3">
              <img
                src={creator.avatarUrl}
                alt={creator.name}
                className="h-14 w-14 rounded-2xl object-cover ring-2 ring-blue-500/20"
              />
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white">{creator.name}</h3>
                <p className="text-xs text-blue-600 dark:text-blue-400 font-medium">{creator.handle}</p>
                <div className="mt-1 flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400">
                  <span>{creator.niche}</span> · <span>{creator.city}</span>
                </div>
              </div>
            </div>

            <div className="mt-6 space-y-2.5 border-t border-slate-100 dark:border-slate-800 pt-4 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500 dark:text-slate-400">Followers:</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">{formatIndianNumber(creator.followersCount)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 dark:text-slate-400">Engagement Rate:</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">{creator.engagementRate}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 dark:text-slate-400">Reliability Score:</span>
                <span className="font-bold text-blue-600 dark:text-blue-400">{creator.reliabilityScore}/100</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 dark:text-slate-400">Linked UPI ID:</span>
                <span className="font-mono text-slate-700 dark:text-slate-300 font-medium">{creator.upiId}</span>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800">
            <Link
              href="/creator/profile"
              className="w-full flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/80 py-2.5 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition"
            >
              Edit Creator Profile & Bank Details
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
