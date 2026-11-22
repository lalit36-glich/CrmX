"use client";

import React, { useState, useEffect } from "react";
import { appStore } from "@/lib/store";
import { formatINR, formatIndianNumber } from "@/lib/utils";
import {
  Link2,
  Copy,
  CheckCircle2,
  Play,
  Percent,
  TrendingUp,
  MousePointerClick,
  ShoppingBag,
  ExternalLink,
  Plus,
} from "lucide-react";

export default function AdminTrackingPage() {
  const [state, setState] = useState(appStore.getState());
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // UTM Link Builder state
  const [selectedCampaignId, setSelectedCampaignId] = useState<string>("");
  const [selectedCreatorId, setSelectedCreatorId] = useState<string>("");
  const [destUrl, setDestUrl] = useState("https://boat-lifestyle.com/products/bass-nation");
  const [utmSource, setUtmSource] = useState("instagram");
  const [utmMedium, setUtmMedium] = useState("creator_reel");
  const [couponCode, setCouponCode] = useState("SUMMER20");

  useEffect(() => {
    return appStore.subscribe(() => {
      setState(appStore.getState());
    });
  }, []);

  const { trackingLinks, campaigns, creators } = state;

  useEffect(() => {
    if (campaigns.length > 0 && !selectedCampaignId) {
      setSelectedCampaignId(campaigns[0].id);
    }
    if (creators.length > 0 && !selectedCreatorId) {
      setSelectedCreatorId(creators[0].id);
    }
  }, [campaigns, creators, selectedCampaignId, selectedCreatorId]);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSimulateClick = (linkId: string, campaignName: string) => {
    appStore.recordClick(linkId);
    setToastMessage(`Simulated +1 click on ${campaignName}`);
    setTimeout(() => setToastMessage(null), 2500);
  };

  const handleSimulatePurchase = (linkId: string, campaignName: string) => {
    const amount = 3200; // ₹3,200 purchase
    appStore.simulateOrder(linkId, amount);
    setToastMessage(`🎉 Simulated ₹${amount} customer purchase for ${campaignName}!`);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const builtUrl = `${destUrl}?utm_source=${utmSource}&utm_medium=${utmMedium}&utm_campaign=gyc_collab&creator_coupon=${couponCode}`;

  return (
    <div className="space-y-6">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-3 text-xs font-semibold text-white shadow-xl animate-in slide-in-from-top duration-200">
          <CheckCircle2 className="h-4 w-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl dark:text-white">
            Tracking Links & UTM Attribution
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Generate unique attribution URLs, assign influencer coupon codes, and monitor e-commerce conversions.
          </p>
        </div>
      </div>

      {/* Attribution UTM Builder */}
      <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm space-y-4 dark:border-slate-800 dark:bg-slate-900">
        <div className="border-b border-slate-100 pb-3 dark:border-slate-800">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
            UTM Link & Coupon Builder
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Construct deep tracking links for creator bios, YouTube descriptions, and story stickers.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1 dark:text-slate-300">
              Select Campaign
            </label>
            <select
              value={selectedCampaignId}
              onChange={(e) => setSelectedCampaignId(e.target.value)}
              className="w-full rounded-xl border border-slate-300 p-2 text-slate-900 outline-none bg-white dark:bg-slate-800 dark:border-slate-700 dark:text-white"
            >
              {campaigns.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1 dark:text-slate-300">
              Assign Creator
            </label>
            <select
              value={selectedCreatorId}
              onChange={(e) => setSelectedCreatorId(e.target.value)}
              className="w-full rounded-xl border border-slate-300 p-2 text-slate-900 outline-none bg-white dark:bg-slate-800 dark:border-slate-700 dark:text-white"
            >
              {creators.map((c) => (
                <option key={c.id} value={c.id}>{c.name} ({c.handle})</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1 dark:text-slate-300">
              Custom Coupon Code
            </label>
            <input
              type="text"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
              className="w-full rounded-xl border border-slate-300 p-2 text-slate-900 font-mono font-bold uppercase outline-none dark:bg-slate-800 dark:border-slate-700 dark:text-white"
            />
          </div>
        </div>

        {/* Generated URL Box */}
        <div className="rounded-xl bg-slate-50 p-4 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs dark:bg-slate-800/60 dark:border-slate-700">
          <div className="truncate flex-1">
            <span className="text-[11px] font-bold uppercase text-slate-400 block mb-0.5 dark:text-slate-500">
              Generated Attribution Link
            </span>
            <span className="font-mono text-blue-700 font-semibold break-all dark:text-blue-400">
              {builtUrl}
            </span>
          </div>

          <button
            onClick={() => handleCopy(builtUrl, "builder")}
            className="shrink-0 inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-blue-700 transition"
          >
            {copiedId === "builder" ? (
              <>
                <CheckCircle2 className="h-3.5 w-3.5" />
                <span>Copied!</span>
              </>
            ) : (
              <>
                <Copy className="h-3.5 w-3.5" />
                <span>Copy Link</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Active Tracking Links Table */}
      <div className="rounded-2xl border border-slate-200/80 bg-white shadow-sm overflow-hidden dark:border-slate-800 dark:bg-slate-900">
        <div className="border-b border-slate-200 px-6 py-4 bg-slate-50/50 flex items-center justify-between dark:border-slate-800 dark:bg-slate-800/50">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Active Creator Attribution Links & Live Simulators
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Test click attribution and simulated Shopify webhook checkouts.
            </p>
          </div>
          <span className="rounded-lg bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-800 border border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800">
            {trackingLinks.length} Active Attribution Links
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100/70 text-[11px] uppercase tracking-wider text-slate-600 font-semibold border-b border-slate-200 dark:bg-slate-800/80 dark:border-slate-700 dark:text-slate-400">
              <tr>
                <th className="px-6 py-3.5">Creator & Campaign</th>
                <th className="px-4 py-3.5">Short Link & Coupon</th>
                <th className="px-4 py-3.5 text-right">Clicks</th>
                <th className="px-4 py-3.5 text-right">Orders</th>
                <th className="px-4 py-3.5 text-right">Attributed Revenue</th>
                <th className="px-6 py-3.5 text-right">Live Simulator Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {trackingLinks.map((link) => (
                <tr key={link.id} className="hover:bg-slate-50/80 transition-colors dark:hover:bg-slate-800/50">
                  <td className="px-6 py-4">
                    <div className="font-bold text-slate-900 text-sm dark:text-white">
                      {link.creatorName}
                    </div>
                    <div className="text-[11px] text-slate-500 mt-0.5 dark:text-slate-400">
                      {link.campaignName}
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="font-mono text-blue-600 font-semibold dark:text-blue-400">
                      gyc.in/{link.slug}
                    </div>
                    <div className="mt-0.5">
                      <span className="rounded bg-slate-100 border border-slate-200 px-1.5 py-0.5 text-[10px] font-bold font-mono text-slate-800 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-200">
                        {link.couponCode}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-right font-bold text-slate-800 dark:text-slate-200">
                    {formatIndianNumber(link.clicksCount)}
                  </td>
                  <td className="px-4 py-4 text-right font-bold text-slate-800 dark:text-slate-200">
                    {link.ordersCount}
                  </td>
                  <td className="px-4 py-4 text-right font-extrabold text-emerald-600 dark:text-emerald-400">
                    {formatINR(link.totalRevenue)}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleSimulateClick(link.id, link.campaignName)}
                        className="rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-50 shadow-sm dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-700"
                        title="Simulate +1 Click"
                      >
                        +1 Click
                      </button>
                      <button
                        onClick={() => handleSimulatePurchase(link.id, link.campaignName)}
                        className="inline-flex items-center gap-1 rounded-lg bg-emerald-600 px-2.5 py-1 text-xs font-semibold text-white shadow-sm hover:bg-emerald-700"
                        title="Simulate Customer Purchase"
                      >
                        <Play className="h-3 w-3" />
                        <span>Simulate ₹3,200 Sale</span>
                      </button>
                    </div>
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
