"use client";

import React, { useState, useEffect } from "react";
import { appStore } from "@/lib/store";
import { Campaign } from "@/lib/types";
import { formatINR, formatIndianNumber, formatDate } from "@/lib/utils";
import {
  Megaphone,
  Plus,
  Calendar,
  TrendingUp,
  Percent,
  CheckCircle2,
  X,
  MousePointerClick,
  ShoppingBag,
} from "lucide-react";

export default function AdminCampaignsPage() {
  const [state, setState] = useState(appStore.getState());
  const [showAddModal, setShowAddModal] = useState(false);
  const [name, setName] = useState("");
  const [brandId, setBrandId] = useState("");
  const [budget, setBudget] = useState(500000);
  const [commissionRate, setCommissionRate] = useState(10);
  const [startDate, setStartDate] = useState("2026-06-01");
  const [endDate, setEndDate] = useState("2026-08-31");
  const [objective, setObjective] = useState("GMV Sales & Direct Attribution");
  const [successToast, setSuccessToast] = useState<string | null>(null);

  useEffect(() => {
    return appStore.subscribe(() => {
      setState(appStore.getState());
    });
  }, []);

  const { campaigns, brands } = state;

  useEffect(() => {
    if (brands.length > 0 && !brandId) {
      setBrandId(brands[0].id);
    }
  }, [brands, brandId]);

  const handleAddCampaign = (e: React.FormEvent) => {
    e.preventDefault();
    const brand = brands.find((b) => b.id === brandId);
    if (!brand) return;

    appStore.addCampaign({
      brandId: brand.id,
      brandName: brand.name,
      name,
      objective,
      budget,
      startDate,
      endDate,
      status: "Active",
      commissionRate,
    });

    setShowAddModal(false);
    setName("");
    setSuccessToast(`Campaign "${name}" launched successfully!`);
    setTimeout(() => setSuccessToast(null), 3000);
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
            Brand Marketing Campaigns
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Track budgets, influencer delivery schedules, and commission rates across active brand initiatives.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-blue-700 transition"
        >
          <Plus className="h-4 w-4" />
          <span>Launch Campaign</span>
        </button>
      </div>

      {/* Campaign Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {campaigns.map((cmp) => {
          const roi =
            cmp.budget > 0
              ? ((cmp.totalSales / cmp.budget) * 100).toFixed(0)
              : "0";

          return (
            <div
              key={cmp.id}
              className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm hover:shadow-md transition flex flex-col justify-between dark:border-slate-800 dark:bg-slate-900"
            >
              <div>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="text-xs font-semibold text-blue-600 dark:text-blue-400">
                      {cmp.brandName}
                    </span>
                    <h3 className="font-bold text-slate-900 text-base mt-0.5 dark:text-white">
                      {cmp.name}
                    </h3>
                  </div>

                  <span
                    className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                      cmp.status === "Active"
                        ? "bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800"
                        : cmp.status === "Completed"
                        ? "bg-slate-100 text-slate-700 border border-slate-300 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700"
                        : "bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800"
                    }`}
                  >
                    {cmp.status}
                  </span>
                </div>

                <p className="text-xs text-slate-500 mt-2 dark:text-slate-400">
                  Objective: {cmp.objective}
                </p>

                <div className="mt-4 grid grid-cols-2 gap-3 rounded-xl bg-slate-50 p-3.5 border border-slate-100 text-xs dark:bg-slate-800/60 dark:border-slate-700/60">
                  <div>
                    <span className="text-slate-400 dark:text-slate-400">Allocated Budget:</span>
                    <div className="font-extrabold text-slate-900 text-sm mt-0.5 dark:text-white">
                      {formatINR(cmp.budget)}
                    </div>
                  </div>
                  <div>
                    <span className="text-slate-400 dark:text-slate-400">Commission Rate:</span>
                    <div className="font-extrabold text-blue-600 text-sm mt-0.5 dark:text-blue-400">
                      {cmp.commissionRate}%
                    </div>
                  </div>
                  <div>
                    <span className="text-slate-400 dark:text-slate-400">Attributed Sales:</span>
                    <div className="font-extrabold text-emerald-600 text-sm mt-0.5 dark:text-emerald-400">
                      {formatINR(cmp.totalSales)}
                    </div>
                  </div>
                  <div>
                    <span className="text-slate-400 dark:text-slate-400">Campaign ROI:</span>
                    <div className="font-extrabold text-purple-700 text-sm mt-0.5 dark:text-purple-300">
                      {roi}%
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-5 border-t border-slate-100 pt-3 flex items-center justify-between text-xs text-slate-500 dark:border-slate-800 dark:text-slate-400">
                <div className="flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5 text-slate-400" />
                  <span>
                    {formatDate(cmp.startDate)} – {formatDate(cmp.endDate)}
                  </span>
                </div>

                <div className="flex items-center gap-3 font-semibold text-slate-700 dark:text-slate-300">
                  <span>{formatIndianNumber(cmp.clicks)} clicks</span>
                  <span>·</span>
                  <span>{cmp.orders} orders</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Launch Campaign Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl animate-in zoom-in-95 duration-150 dark:bg-slate-900 dark:border dark:border-slate-800">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4 dark:border-slate-800">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Launch New Brand Campaign
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Create a brief for Indian creator collaborations.
                </p>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleAddCampaign} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1 dark:text-slate-300">
                  Brand Partner *
                </label>
                <select
                  value={brandId}
                  onChange={(e) => setBrandId(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 p-2.5 text-slate-900 focus:outline-none focus:border-blue-500 bg-white dark:bg-slate-800 dark:border-slate-700 dark:text-white"
                >
                  {brands.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.name} ({b.category})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1 dark:text-slate-300">
                  Campaign Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. BoAt · Monsoon Bass Fest"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 p-2.5 text-slate-900 focus:outline-none focus:border-blue-500 dark:bg-slate-800 dark:border-slate-700 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1 dark:text-slate-300">
                    Budget (INR ₹)
                  </label>
                  <input
                    type="number"
                    value={budget}
                    onChange={(e) => setBudget(Number(e.target.value))}
                    className="w-full rounded-xl border border-slate-300 p-2.5 text-slate-900 focus:outline-none focus:border-blue-500 dark:bg-slate-800 dark:border-slate-700 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1 dark:text-slate-300">
                    Commission Rate (%)
                  </label>
                  <input
                    type="number"
                    value={commissionRate}
                    onChange={(e) => setCommissionRate(Number(e.target.value))}
                    className="w-full rounded-xl border border-slate-300 p-2.5 text-slate-900 focus:outline-none focus:border-blue-500 dark:bg-slate-800 dark:border-slate-700 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1 dark:text-slate-300">
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 p-2 text-slate-900 focus:outline-none focus:border-blue-500 dark:bg-slate-800 dark:border-slate-700 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1 dark:text-slate-300">
                    End Date
                  </label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 p-2 text-slate-900 focus:outline-none focus:border-blue-500 dark:bg-slate-800 dark:border-slate-700 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1 dark:text-slate-300">
                  Objective & Key Deliverables
                </label>
                <input
                  type="text"
                  value={objective}
                  onChange={(e) => setObjective(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 p-2.5 text-slate-900 focus:outline-none focus:border-blue-500 dark:bg-slate-800 dark:border-slate-700 dark:text-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="rounded-xl border border-slate-200 px-4 py-2 font-semibold text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-blue-600 px-4 py-2 font-semibold text-white shadow-sm hover:bg-blue-700"
                >
                  Create Campaign
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
