"use client";

import React, { useState, useEffect } from "react";
import { appStore } from "@/lib/store";
import { Brand } from "@/lib/types";
import { formatINR } from "@/lib/utils";
import {
  Building2,
  Plus,
  ExternalLink,
  Mail,
  Megaphone,
  CheckCircle2,
  X,
  TrendingUp,
} from "lucide-react";

export default function AdminBrandsPage() {
  const [state, setState] = useState(appStore.getState());
  const [showAddModal, setShowAddModal] = useState(false);
  const [name, setName] = useState("");
  const [category, setCategory] = useState("Beauty & Skincare");
  const [contactPerson, setContactPerson] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [website, setWebsite] = useState("");
  const [successToast, setSuccessToast] = useState<string | null>(null);

  useEffect(() => {
    return appStore.subscribe(() => {
      setState(appStore.getState());
    });
  }, []);

  const { brands, campaigns } = state;

  const handleAddBrand = (e: React.FormEvent) => {
    e.preventDefault();
    appStore.addBrand({
      name,
      category,
      contactPerson,
      contactEmail,
      website,
      logoUrl: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=120&auto=format&fit=crop&q=80",
      status: "Active",
    });

    setShowAddModal(false);
    setName("");
    setContactPerson("");
    setContactEmail("");
    setSuccessToast(`Brand "${name}" added to portfolio!`);
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
            Brand Partners & Accounts
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Manage Indian brand clients, campaign budgets, and corporate marketing contacts.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-blue-700 transition"
        >
          <Plus className="h-4 w-4" />
          <span>Add Brand Partner</span>
        </button>
      </div>

      {/* Brands Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {brands.map((brand) => {
          const brandCampaigns = campaigns.filter((c) => c.brandId === brand.id);
          const brandTotalGMV = brandCampaigns.reduce((acc, curr) => acc + curr.totalSales, 0);

          return (
            <div
              key={brand.id}
              className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm hover:shadow-md transition flex flex-col justify-between dark:border-slate-800 dark:bg-slate-900"
            >
              <div>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src={brand.logoUrl}
                      alt={brand.name}
                      className="h-12 w-12 rounded-xl object-cover ring-1 ring-slate-200 shadow-sm dark:ring-slate-700"
                    />
                    <div>
                      <h3 className="font-bold text-slate-900 text-base dark:text-white">
                        {brand.name}
                      </h3>
                      <span className="text-xs text-blue-600 font-medium dark:text-blue-400">
                        {brand.category}
                      </span>
                    </div>
                  </div>

                  <span
                    className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                      brand.status === "Active"
                        ? "bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800"
                        : "bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800"
                    }`}
                  >
                    {brand.status}
                  </span>
                </div>

                <div className="mt-5 space-y-2 border-t border-slate-100 pt-3 text-xs text-slate-600 dark:border-slate-800 dark:text-slate-300">
                  <div className="flex justify-between">
                    <span className="text-slate-400 dark:text-slate-500">Contact Lead:</span>
                    <strong className="text-slate-800 dark:text-slate-200">{brand.contactPerson}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400 dark:text-slate-500">Email:</span>
                    <a
                      href={`mailto:${brand.contactEmail}`}
                      className="text-blue-600 hover:underline flex items-center gap-1 dark:text-blue-400"
                    >
                      <Mail className="h-3 w-3" /> {brand.contactEmail}
                    </a>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400 dark:text-slate-500">Active Campaigns:</span>
                    <strong className="text-indigo-600 dark:text-indigo-400">{brandCampaigns.length} Active</strong>
                  </div>
                </div>
              </div>

              <div className="mt-6 border-t border-slate-100 pt-4 flex items-center justify-between dark:border-slate-800">
                <div>
                  <div className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500">
                    Total Attributed GMV
                  </div>
                  <div className="text-base font-extrabold text-emerald-600 dark:text-emerald-400">
                    {formatINR(brandTotalGMV > 0 ? brandTotalGMV : brand.totalSpend)}
                  </div>
                </div>

                {brand.website && (
                  <a
                    href={brand.website}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-xs font-semibold text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
                  >
                    Website <ExternalLink className="h-3 w-3" />
                  </a>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Brand Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl animate-in zoom-in-95 duration-150 dark:bg-slate-900 dark:border dark:border-slate-800">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4 dark:border-slate-800">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Add Brand Partner
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Register a corporate client for campaign sponsorships.
                </p>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleAddBrand} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1 dark:text-slate-300">Brand Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Nykaa, Sugar Cosmetics"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 p-2.5 text-slate-900 focus:outline-none focus:border-blue-500 dark:bg-slate-800 dark:border-slate-700 dark:text-white"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1 dark:text-slate-300">Category</label>
                <input
                  type="text"
                  required
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 p-2.5 text-slate-900 focus:outline-none focus:border-blue-500 dark:bg-slate-800 dark:border-slate-700 dark:text-white"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1 dark:text-slate-300">Contact Person</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Pooja Bhatt"
                  value={contactPerson}
                  onChange={(e) => setContactPerson(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 p-2.5 text-slate-900 focus:outline-none focus:border-blue-500 dark:bg-slate-800 dark:border-slate-700 dark:text-white"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1 dark:text-slate-300">Contact Email</label>
                <input
                  type="email"
                  required
                  placeholder="partnerships@brand.com"
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 p-2.5 text-slate-900 focus:outline-none focus:border-blue-500 dark:bg-slate-800 dark:border-slate-700 dark:text-white"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1 dark:text-slate-300">Website URL</label>
                <input
                  type="url"
                  placeholder="https://brand.com"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
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
                  Save Brand
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
