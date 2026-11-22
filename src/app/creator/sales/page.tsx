"use client";

import React, { useState, useEffect } from "react";
import { appStore } from "@/lib/store";
import { formatINR, formatIndianNumber } from "@/lib/utils";
import {
  TrendingUp,
  MousePointerClick,
  ShoppingBag,
  Percent,
  Filter,
  Play,
  CheckCircle2,
  Calendar,
  Layers,
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  LineChart,
  Line,
  CartesianGrid,
  AreaChart,
  Area,
} from "recharts";

export default function CreatorSalesPage() {
  const [state, setState] = useState(appStore.getState());
  const [selectedCampaign, setSelectedCampaign] = useState<string>("All");
  const [timeRange, setTimeRange] = useState<string>("30d");
  const [simulatedFeedback, setSimulatedFeedback] = useState<string | null>(null);

  useEffect(() => {
    return appStore.subscribe(() => {
      setState(appStore.getState());
    });
  }, []);

  const creatorId = state.currentUser.creatorId || "crt-aarav-mehta";
  const deals = state.deals.filter((d) => d.creatorId === creatorId);
  const trackingLinks = state.trackingLinks.filter((l) => l.creatorId === creatorId);

  const filteredDeals =
    selectedCampaign === "All"
      ? deals
      : deals.filter((d) => d.campaignId === selectedCampaign);

  const totalClicks = filteredDeals.reduce((acc, curr) => acc + curr.clicks, 0);
  const totalOrders = filteredDeals.reduce((acc, curr) => acc + curr.orders, 0);
  const totalSales = filteredDeals.reduce((acc, curr) => acc + curr.sales, 0);
  const totalCommission = filteredDeals.reduce((acc, curr) => acc + curr.commission, 0);
  const conversionRate = totalClicks > 0 ? ((totalOrders / totalClicks) * 100).toFixed(2) : "0.00";
  const aov = totalOrders > 0 ? Math.round(totalSales / totalOrders) : 0;

  // Chart daily performance data
  const chartData = [
    { date: "May 10", clicks: 42, orders: 3, sales: 7200, commission: 720 },
    { date: "May 15", clicks: 88, orders: 6, sales: 14400, commission: 1440 },
    { date: "May 20", clicks: 120, orders: 9, sales: 21600, commission: 2160 },
    { date: "May 25", clicks: 165, orders: 11, sales: 26400, commission: 2640 },
    { date: "Jun 01", clicks: 210, orders: 14, sales: 33600, commission: 3360 },
    { date: "Jun 05", clicks: 280, orders: 18, sales: 43200, commission: 4320 },
    { date: "Jun 10", clicks: 360, orders: 23, sales: 55200, commission: 5520 },
    { date: "Jun 15", clicks: totalClicks > 0 ? totalClicks : 510, orders: totalOrders > 0 ? totalOrders : 32, sales: totalSales > 0 ? totalSales : 76800, commission: totalCommission > 0 ? totalCommission : 7680 },
  ];

  const handleSimulateOrder = () => {
    if (trackingLinks.length > 0) {
      const link = trackingLinks[0];
      const purchaseValue = 2400; // ₹2,400 order
      appStore.simulateOrder(link.id, purchaseValue);
      setSimulatedFeedback(`🎉 Attributed ₹${purchaseValue} sale (+₹240 comm) to ${link.campaignName}!`);
      setTimeout(() => setSimulatedFeedback(null), 3500);
    }
  };

  return (
    <div className="space-y-6">
      {/* Simulation Feedback Alert */}
      {simulatedFeedback && (
        <div className="fixed top-20 right-6 z-50 flex items-center gap-2 rounded-xl bg-blue-900 px-4 py-3 text-xs font-semibold text-white shadow-2xl animate-in slide-from-top duration-200">
          <CheckCircle2 className="h-4 w-4 text-emerald-400" />
          <span>{simulatedFeedback}</span>
        </div>
      )}

      {/* Header & Filters */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
            Sales & Attribution Performance
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Track real-time conversion rates, attributed customer purchases, and commissions earned across each campaign.
          </p>
        </div>

        {/* Filter Controls & Simulator */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Campaign Selector */}
          <div className="flex items-center gap-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 py-1.5 shadow-sm text-xs">
            <Filter className="h-3.5 w-3.5 text-slate-400" />
            <select
              value={selectedCampaign}
              onChange={(e) => setSelectedCampaign(e.target.value)}
              className="bg-transparent font-semibold text-slate-700 dark:text-slate-200 outline-none cursor-pointer"
            >
              <option value="All">All Campaigns ({deals.length})</option>
              {deals.map((d) => (
                <option key={d.campaignId} value={d.campaignId} className="dark:bg-slate-900">
                  {d.campaignName}
                </option>
              ))}
            </select>
          </div>

          {/* Time range buttons */}
          <div className="flex rounded-xl bg-slate-200/70 dark:bg-slate-800/80 p-1 text-xs font-medium">
            {["7d", "30d", "All"].map((r) => (
              <button
                key={r}
                onClick={() => setTimeRange(r)}
                className={`rounded-lg px-2.5 py-1 text-xs transition ${
                  timeRange === r
                    ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-bold shadow-sm"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                {r.toUpperCase()}
              </button>
            ))}
          </div>

          {/* Live Simulator Button */}
          <button
            onClick={handleSimulateOrder}
            className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-3 py-2 text-xs font-semibold text-white shadow-sm hover:bg-emerald-700 transition"
            title="Simulate a real customer checkout with Aarav's coupon"
          >
            <Play className="h-3.5 w-3.5" />
            <span>Simulate ₹2,400 Sale</span>
          </button>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Total Clicks */}
        <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Total Clicks
            </span>
            <div className="rounded-xl bg-blue-50 dark:bg-blue-950/60 p-2 text-blue-600 dark:text-blue-400">
              <MousePointerClick className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3 text-3xl font-extrabold text-slate-900 dark:text-white">
            {formatIndianNumber(totalClicks)}
          </div>
          <div className="mt-2 text-[11px] text-slate-400">
            Attributed via UTM link & bio redirects
          </div>
        </div>

        {/* Total Orders */}
        <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Attributed Orders
            </span>
            <div className="rounded-xl bg-indigo-50 dark:bg-indigo-950/60 p-2 text-indigo-600 dark:text-indigo-400">
              <ShoppingBag className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3 text-3xl font-extrabold text-slate-900 dark:text-white">
            {totalOrders}
          </div>
          <div className="mt-2 text-[11px] text-slate-400">
            Avg Order Value: <strong className="text-slate-700 dark:text-slate-200">{formatINR(aov)}</strong>
          </div>
        </div>

        {/* Conversion Rate */}
        <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Conversion Rate
            </span>
            <div className="rounded-xl bg-purple-50 dark:bg-purple-950/60 p-2 text-purple-600 dark:text-purple-400">
              <Percent className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3 text-3xl font-extrabold text-purple-700 dark:text-purple-400">
            {conversionRate}%
          </div>
          <div className="mt-2 text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
            High quality engaged traffic (Benchmark: 2.5%)
          </div>
        </div>

        {/* Total GMV Sales */}
        <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Attributed GMV
            </span>
            <div className="rounded-xl bg-emerald-50 dark:bg-emerald-950/60 p-2 text-emerald-600 dark:text-emerald-400">
              <TrendingUp className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3 text-3xl font-extrabold text-emerald-600 dark:text-emerald-400">
            {formatINR(totalSales)}
          </div>
          <div className="mt-2 text-[11px] text-slate-500 dark:text-slate-400">
            Commission: <strong className="text-slate-800 dark:text-slate-200">{formatINR(totalCommission)}</strong>
          </div>
        </div>
      </div>

      {/* Visual Analytics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Daily Revenue Trend (Area Chart) */}
        <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Attributed GMV & Commission Growth
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Cumulative revenue generated in INR (₹)
              </p>
            </div>
            <span className="rounded-lg bg-emerald-50 dark:bg-emerald-950/50 px-2 py-1 text-[11px] font-semibold text-emerald-700 dark:text-emerald-300">
              Live Attribution
            </span>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="salesGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="commGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.3} />
                <XAxis dataKey="date" tick={{ fontSize: 11, fill: "#94a3b8" }} />
                <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} />
                <Tooltip
                  formatter={(val: any) => [formatINR(Number(val)), ""]}
                  contentStyle={{ backgroundColor: "#0f172a", borderRadius: "10px", color: "#fff", fontSize: "12px", border: "1px solid #334155" }}
                />
                <Legend wrapperStyle={{ fontSize: "11px" }} />
                <Area type="monotone" dataKey="sales" name="Sales GMV (₹)" stroke="#10b981" fillOpacity={1} fill="url(#salesGrad)" strokeWidth={2} />
                <Area type="monotone" dataKey="commission" name="My Commission (₹)" stroke="#2563eb" fillOpacity={1} fill="url(#commGrad)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Daily Clicks vs Orders (Bar Chart) */}
        <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Daily Clicks vs Completed Purchases
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Conversion funnel tracking from bio links
              </p>
            </div>
            <span className="rounded-lg bg-blue-50 dark:bg-blue-950/50 px-2 py-1 text-[11px] font-semibold text-blue-700 dark:text-blue-300">
              Avg CR: {conversionRate}%
            </span>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.3} />
                <XAxis dataKey="date" tick={{ fontSize: 11, fill: "#94a3b8" }} />
                <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} />
                <Tooltip
                  contentStyle={{ backgroundColor: "#0f172a", borderRadius: "10px", color: "#fff", fontSize: "12px", border: "1px solid #334155" }}
                />
                <Legend wrapperStyle={{ fontSize: "11px" }} />
                <Bar dataKey="clicks" name="Bio / Swipe-Up Clicks" fill="#93c5fd" radius={[4, 4, 0, 0]} />
                <Bar dataKey="orders" name="Paid Orders" fill="#2563eb" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Campaign Attribution Breakdown */}
      <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm overflow-hidden">
        <div className="border-b border-slate-200 dark:border-slate-800 px-6 py-4 bg-slate-50/50 dark:bg-slate-800/40">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
            Campaign Attribution Breakdown
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Per-brand breakdown of sales, click-through rates, and pending commission settlements.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100/70 dark:bg-slate-800/70 text-[11px] uppercase tracking-wider text-slate-600 dark:text-slate-300 font-semibold border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="px-6 py-3.5">Campaign Name</th>
                <th className="px-4 py-3.5">Brand</th>
                <th className="px-4 py-3.5 text-right">Clicks</th>
                <th className="px-4 py-3.5 text-right">Orders</th>
                <th className="px-4 py-3.5 text-right">Conversion Rate</th>
                <th className="px-4 py-3.5 text-right">Total GMV</th>
                <th className="px-6 py-3.5 text-right">My Commission</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredDeals.map((d) => {
                const cr = d.clicks > 0 ? ((d.orders / d.clicks) * 100).toFixed(2) : "0.00";
                return (
                  <tr key={d.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="px-6 py-4 font-bold text-slate-900 dark:text-white">
                      {d.campaignName}
                    </td>
                    <td className="px-4 py-4 text-slate-700 dark:text-slate-300 font-medium">
                      {d.brandName}
                    </td>
                    <td className="px-4 py-4 text-right text-slate-700 dark:text-slate-300 font-semibold">
                      {formatIndianNumber(d.clicks)}
                    </td>
                    <td className="px-4 py-4 text-right text-slate-700 dark:text-slate-300 font-semibold">
                      {d.orders}
                    </td>
                    <td className="px-4 py-4 text-right text-blue-600 dark:text-blue-400 font-bold">
                      {cr}%
                    </td>
                    <td className="px-4 py-4 text-right font-extrabold text-slate-900 dark:text-white">
                      {formatINR(d.sales)}
                    </td>
                    <td className="px-6 py-4 text-right font-extrabold text-emerald-600 dark:text-emerald-400">
                      {formatINR(d.commission)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
