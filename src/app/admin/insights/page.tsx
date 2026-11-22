"use client";

import React, { useState, useEffect } from "react";
import { appStore } from "@/lib/store";
import { Creator, FollowerTier } from "@/lib/types";
import { formatINR, formatIndianNumber } from "@/lib/utils";
import {
  Sparkles,
  TrendingUp,
  Award,
  Zap,
  Percent,
  AlertTriangle,
  UserX,
  Filter,
  CheckCircle2,
  Users,
  Eye,
  SlidersHorizontal,
  ChevronRight,
  ShieldAlert,
  ArrowUpDown,
  X,
  Plus,
} from "lucide-react";

export default function CreatorInsightsPage() {
  const [state, setState] = useState(appStore.getState());
  const [sortBy, setSortBy] = useState<"sales" | "engagement" | "views" | "reliability">("sales");
  const [selectedNiche, setSelectedNiche] = useState<string>("All");
  const [selectedPlatform, setSelectedPlatform] = useState<string>("All");
  const [selectedTier, setSelectedTier] = useState<string>("All");
  const [selectedCity, setSelectedCity] = useState<string>("All");
  const [searchTerm, setSearchTerm] = useState<string>("");

  // Detailed Modal Drawer for a single creator
  const [inspectCreator, setInspectCreator] = useState<Creator | null>(null);

  // Compare 2-3 creators side-by-side
  const [compareIds, setCompareIds] = useState<string[]>(["crt-aarav-mehta", "crt-priya-sharma"]);
  const [showCompareModal, setShowCompareModal] = useState<boolean>(false);

  useEffect(() => {
    return appStore.subscribe(() => {
      setState(appStore.getState());
    });
  }, []);

  const creators = state.creators;

  // Filter creators
  const filteredCreators = creators.filter((c) => {
    if (selectedNiche !== "All" && c.niche !== selectedNiche) return false;
    if (selectedPlatform !== "All" && c.platform !== selectedPlatform) return false;
    if (selectedTier !== "All" && c.followerTier !== selectedTier) return false;
    if (selectedCity !== "All" && !c.city.toLowerCase().includes(selectedCity.toLowerCase())) return false;
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      return c.name.toLowerCase().includes(q) || c.handle.toLowerCase().includes(q) || c.niche.toLowerCase().includes(q);
    }
    return true;
  });

  // Sort creators
  const sortedCreators = [...filteredCreators].sort((a, b) => {
    if (sortBy === "sales") return b.totalSales - a.totalSales;
    if (sortBy === "engagement") return b.engagementRate - a.engagementRate;
    if (sortBy === "views") return b.avgViews - a.avgViews;
    if (sortBy === "reliability") return b.reliabilityScore - a.reliabilityScore;
    return 0;
  });

  // Insight Cards Data
  const topEarner = [...creators].sort((a, b) => b.totalSales - a.totalSales)[0];
  const fastestGrowing = [...creators].sort((a, b) => b.engagementRate - a.engagementRate)[0];
  const bestConversion = creators.find((c) => c.id === "crt-rohan-joshi") || creators[0];
  const creatorsWithoutDeals = creators.filter((c) => c.activeDealsCount === 0);
  const lowReliability = creators.filter((c) => c.reliabilityScore < 88);

  const toggleCompare = (creatorId: string) => {
    if (compareIds.includes(creatorId)) {
      setCompareIds(compareIds.filter((id) => id !== creatorId));
    } else {
      if (compareIds.length >= 3) {
        setCompareIds([compareIds[1], compareIds[2], creatorId]);
      } else {
        setCompareIds([...compareIds, creatorId]);
      }
    }
  };

  const comparedCreators = creators.filter((c) => compareIds.includes(c.id));

  return (
    <div className="space-y-6">
      {/* Header & Compare Quick Bar */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              Creator Intelligence & Leaderboard
            </h1>
            <span className="rounded-full bg-blue-100 text-blue-800 text-[11px] font-bold px-2.5 py-0.5">
              11 Creators Audited
            </span>
          </div>
          <p className="text-sm text-slate-500">
            Cross-evaluate creator ROI, conversion rates, audience demographics, and automated fraud flags.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {compareIds.length > 0 && (
            <button
              onClick={() => setShowCompareModal(true)}
              className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-semibold text-white shadow-md hover:bg-blue-700 transition"
            >
              <Users className="h-4 w-4" />
              <span>Compare Selected ({compareIds.length}/3)</span>
            </button>
          )}
        </div>
      </div>

      {/* 5 Insight Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {/* Card 1: Top Earner */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Top Earner (GMV)
            </span>
            <div className="rounded-lg bg-amber-50 p-1.5 text-amber-600">
              <Award className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 flex items-center gap-2.5">
            <img
              src={topEarner?.avatarUrl}
              alt=""
              className="h-9 w-9 rounded-full object-cover ring-2 ring-amber-400"
            />
            <div className="truncate">
              <div className="text-xs font-bold text-slate-900 truncate">
                {topEarner?.name}
              </div>
              <div className="text-[11px] font-extrabold text-emerald-600">
                {formatINR(topEarner?.totalSales)}
              </div>
            </div>
          </div>
          <div className="mt-2 text-[10px] text-slate-400 border-t border-slate-100 pt-2">
            {topEarner?.handle} · {topEarner?.niche}
          </div>
        </div>

        {/* Card 2: Fastest Growing */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Highest Engagement
            </span>
            <div className="rounded-lg bg-blue-50 p-1.5 text-blue-600">
              <Zap className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 flex items-center gap-2.5">
            <img
              src={fastestGrowing?.avatarUrl}
              alt=""
              className="h-9 w-9 rounded-full object-cover ring-2 ring-blue-400"
            />
            <div className="truncate">
              <div className="text-xs font-bold text-slate-900 truncate">
                {fastestGrowing?.name}
              </div>
              <div className="text-[11px] font-extrabold text-blue-600">
                {fastestGrowing?.engagementRate}% ER
              </div>
            </div>
          </div>
          <div className="mt-2 text-[10px] text-slate-400 border-t border-slate-100 pt-2">
            {fastestGrowing?.followersCount.toLocaleString()} followers
          </div>
        </div>

        {/* Card 3: Best Conversion */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Best Conversion
            </span>
            <div className="rounded-lg bg-emerald-50 p-1.5 text-emerald-600">
              <Percent className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 flex items-center gap-2.5">
            <img
              src={bestConversion?.avatarUrl}
              alt=""
              className="h-9 w-9 rounded-full object-cover ring-2 ring-emerald-400"
            />
            <div className="truncate">
              <div className="text-xs font-bold text-slate-900 truncate">
                {bestConversion?.name}
              </div>
              <div className="text-[11px] font-extrabold text-purple-600">
                6.8% Purchase CR
              </div>
            </div>
          </div>
          <div className="mt-2 text-[10px] text-slate-400 border-t border-slate-100 pt-2">
            Fitness Niche · {bestConversion?.city}
          </div>
        </div>

        {/* Card 4: Underperforming / Low Reliability */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Low Reliability
            </span>
            <div className="rounded-lg bg-rose-50 p-1.5 text-rose-600">
              <AlertTriangle className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-rose-600">
              {lowReliability.length}
            </div>
            <div className="text-[11px] text-slate-600 font-medium">
              Creators below 88 score
            </div>
          </div>
          <div className="mt-2 text-[10px] text-slate-400 border-t border-slate-100 pt-2">
            Requires agency follow-up
          </div>
        </div>

        {/* Card 5: Creators Without Active Deal */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              No Active Deal
            </span>
            <div className="rounded-lg bg-slate-100 p-1.5 text-slate-600">
              <UserX className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-slate-900">
              {creatorsWithoutDeals.length}
            </div>
            <div className="text-[11px] text-slate-600 font-medium">
              Ready for campaign pitch
            </div>
          </div>
          <div className="mt-2 text-[10px] text-slate-400 border-t border-slate-100 pt-2 truncate">
            {creatorsWithoutDeals.map((c) => c.name.split(" ")[0]).join(", ")}
          </div>
        </div>
      </div>

      {/* Fraud Detection & Campaign Risk Flag Banner */}
      <div className="rounded-2xl border border-amber-300 bg-amber-50/80 p-4 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-start gap-3">
            <ShieldAlert className="h-5 w-5 text-amber-700 shrink-0 mt-0.5" />
            <div>
              <div className="text-xs font-bold text-amber-900 uppercase tracking-wide">
                ⚠️ Automated Fraud & Traffic Anomaly Flag
              </div>
              <p className="text-xs text-amber-800 mt-0.5">
                <strong>Tanya Sen (@tanya_upcycle):</strong> Recorded <strong>3,420 link clicks</strong> with only <strong>2 attributed orders</strong> (0.05% conversion rate vs 3.2% benchmark). Flagged for potential bot clicks or misleading swipe-up link placement. Payout is held in escrow pending investigation.
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              const tanya = creators.find((c) => c.handle === "@tanya_upcycle");
              if (tanya) setInspectCreator(tanya);
            }}
            className="shrink-0 rounded-xl bg-amber-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-amber-700 shadow-sm transition"
          >
            Investigate Metric Log
          </button>
        </div>
      </div>

      {/* Filter Bar & Sort Controls */}
      <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* Search box */}
          <div className="relative min-w-[220px] flex-1 sm:max-w-xs">
            <input
              type="text"
              placeholder="Search creator by name or handle..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-3.5 pr-4 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* Sort By buttons */}
          <div className="flex items-center gap-1.5 text-xs font-semibold">
            <span className="text-slate-400 flex items-center gap-1">
              <ArrowUpDown className="h-3 w-3" /> Sort:
            </span>
            {[
              { key: "sales", label: "Attributed GMV" },
              { key: "engagement", label: "Engagement %" },
              { key: "views", label: "Avg Views" },
              { key: "reliability", label: "Reliability" },
            ].map((s) => (
              <button
                key={s.key}
                onClick={() => setSortBy(s.key as any)}
                className={`rounded-lg px-2.5 py-1 text-xs transition ${
                  sortBy === s.key
                    ? "bg-slate-900 text-white font-bold"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        {/* Dropdown Filters */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-slate-100 text-xs">
          <div>
            <label className="text-[10px] font-bold uppercase text-slate-400 block mb-1">
              Niche
            </label>
            <select
              value={selectedNiche}
              onChange={(e) => setSelectedNiche(e.target.value)}
              className="w-full rounded-lg border border-slate-200 bg-white p-1.5 text-slate-700 outline-none"
            >
              <option value="All">All Niches</option>
              <option value="Beauty">Beauty</option>
              <option value="Tech">Tech</option>
              <option value="Fitness">Fitness</option>
              <option value="Fashion">Fashion</option>
              <option value="Lifestyle">Lifestyle</option>
              <option value="Food">Food</option>
              <option value="Gaming">Gaming</option>
            </select>
          </div>

          <div>
            <label className="text-[10px] font-bold uppercase text-slate-400 block mb-1">
              Platform
            </label>
            <select
              value={selectedPlatform}
              onChange={(e) => setSelectedPlatform(e.target.value)}
              className="w-full rounded-lg border border-slate-200 bg-white p-1.5 text-slate-700 outline-none"
            >
              <option value="All">All Platforms</option>
              <option value="Instagram">Instagram</option>
              <option value="YouTube">YouTube</option>
              <option value="Mixed">Mixed</option>
            </select>
          </div>

          <div>
            <label className="text-[10px] font-bold uppercase text-slate-400 block mb-1">
              Follower Tier
            </label>
            <select
              value={selectedTier}
              onChange={(e) => setSelectedTier(e.target.value)}
              className="w-full rounded-lg border border-slate-200 bg-white p-1.5 text-slate-700 outline-none"
            >
              <option value="All">All Tiers</option>
              <option value="Nano">Nano (&lt;100K)</option>
              <option value="Micro">Micro (100K-300K)</option>
              <option value="Macro">Macro (300K-800K)</option>
              <option value="Mega">Mega (&gt;800K)</option>
            </select>
          </div>

          <div>
            <label className="text-[10px] font-bold uppercase text-slate-400 block mb-1">
              City
            </label>
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="w-full rounded-lg border border-slate-200 bg-white p-1.5 text-slate-700 outline-none"
            >
              <option value="All">All Indian Cities</option>
              <option value="Mumbai">Mumbai</option>
              <option value="Delhi">Delhi NCR</option>
              <option value="Bengaluru">Bengaluru</option>
              <option value="Pune">Pune</option>
              <option value="Ahmedabad">Ahmedabad</option>
              <option value="Hyderabad">Hyderabad</option>
            </select>
          </div>
        </div>
      </div>

      {/* Creator Leaderboard Table */}
      <div className="rounded-2xl border border-slate-200/80 bg-white shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100/70 text-[11px] uppercase tracking-wider text-slate-600 font-semibold border-b border-slate-200">
              <tr>
                <th className="px-4 py-3.5 text-center">Rank</th>
                <th className="px-4 py-3.5">Creator</th>
                <th className="px-4 py-3.5">Niche & City</th>
                <th className="px-4 py-3.5 text-right">Followers</th>
                <th className="px-4 py-3.5 text-right">Avg Views</th>
                <th className="px-4 py-3.5 text-right">Engagement</th>
                <th className="px-4 py-3.5 text-right">Attributed GMV</th>
                <th className="px-4 py-3.5 text-center">Reliability</th>
                <th className="px-4 py-3.5 text-center">Compare</th>
                <th className="px-6 py-3.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {sortedCreators.map((c, index) => {
                const isCompared = compareIds.includes(c.id);
                return (
                  <tr key={c.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-4 py-4 text-center font-extrabold text-slate-400">
                      {index === 0 ? "🥇" : index === 1 ? "🥈" : index === 2 ? "🥉" : `#${index + 1}`}
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={c.avatarUrl}
                          alt={c.name}
                          className="h-10 w-10 rounded-full object-cover ring-2 ring-slate-200"
                        />
                        <div>
                          <div className="font-bold text-slate-900 text-sm hover:text-blue-600 cursor-pointer" onClick={() => setInspectCreator(c)}>
                            {c.name}
                          </div>
                          <div className="text-[11px] text-blue-600 font-semibold">
                            {c.handle}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="font-semibold text-slate-800">{c.niche}</div>
                      <div className="text-[11px] text-slate-500">{c.city} · {c.platform}</div>
                    </td>
                    <td className="px-4 py-4 text-right font-medium text-slate-800">
                      {formatIndianNumber(c.followersCount)}
                      <span className="block text-[10px] text-slate-400">{c.followerTier}</span>
                    </td>
                    <td className="px-4 py-4 text-right font-semibold text-slate-800">
                      {formatIndianNumber(c.avgViews)}
                    </td>
                    <td className="px-4 py-4 text-right">
                      <span className="font-bold text-blue-600">{c.engagementRate}%</span>
                    </td>
                    <td className="px-4 py-4 text-right">
                      <div className="font-extrabold text-emerald-600 text-sm">
                        {formatINR(c.totalSales)}
                      </div>
                      <div className="text-[10px] text-slate-400">
                        Comm: {formatINR(c.totalCommission)}
                      </div>
                    </td>
                    <td className="px-4 py-4 text-center">
                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-bold ${
                          c.reliabilityScore >= 94
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : c.reliabilityScore >= 88
                            ? "bg-blue-50 text-blue-700 border border-blue-200"
                            : "bg-rose-50 text-rose-700 border border-rose-200"
                        }`}
                      >
                        {c.reliabilityScore}/100
                      </span>
                    </td>
                    <td className="px-4 py-4 text-center">
                      <input
                        type="checkbox"
                        checked={isCompared}
                        onChange={() => toggleCompare(c.id)}
                        className="h-4 w-4 rounded text-blue-600 cursor-pointer"
                        title="Add to side-by-side comparison"
                      />
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => setInspectCreator(c)}
                        className="inline-flex items-center gap-1 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 shadow-sm transition"
                      >
                        Deep Dive <ChevronRight className="h-3 w-3" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Per-Creator Deep Dive Drawer Modal */}
      {inspectCreator && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-3xl rounded-2xl bg-white p-6 shadow-2xl max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <img
                  src={inspectCreator.avatarUrl}
                  alt={inspectCreator.name}
                  className="h-12 w-12 rounded-2xl object-cover ring-2 ring-blue-500/20"
                />
                <div>
                  <h3 className="text-lg font-bold text-slate-900">
                    {inspectCreator.name} ({inspectCreator.handle})
                  </h3>
                  <div className="text-xs text-slate-500">
                    {inspectCreator.niche} Creator · {inspectCreator.city} · Tier: {inspectCreator.followerTier}
                  </div>
                </div>
              </div>
              <button
                onClick={() => setInspectCreator(null)}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-6 space-y-6 text-xs">
              {/* Primary KPIs */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="rounded-xl bg-slate-50 p-3 border border-slate-100">
                  <div className="text-slate-400 text-[11px] font-semibold">Total Attributed GMV</div>
                  <div className="text-lg font-extrabold text-emerald-600 mt-0.5">
                    {formatINR(inspectCreator.totalSales)}
                  </div>
                </div>
                <div className="rounded-xl bg-slate-50 p-3 border border-slate-100">
                  <div className="text-slate-400 text-[11px] font-semibold">Commission Earned</div>
                  <div className="text-lg font-extrabold text-blue-600 mt-0.5">
                    {formatINR(inspectCreator.totalCommission)}
                  </div>
                </div>
                <div className="rounded-xl bg-slate-50 p-3 border border-slate-100">
                  <div className="text-slate-400 text-[11px] font-semibold">On-Time Delivery %</div>
                  <div className="text-lg font-extrabold text-slate-900 mt-0.5">
                    {inspectCreator.onTimeDeliveryRate}%
                  </div>
                </div>
                <div className="rounded-xl bg-slate-50 p-3 border border-slate-100">
                  <div className="text-slate-400 text-[11px] font-semibold">Reliability Index</div>
                  <div className="text-lg font-extrabold text-indigo-600 mt-0.5">
                    {inspectCreator.reliabilityScore}/100
                  </div>
                </div>
              </div>

              {/* Verified Audience Breakdown */}
              <div className="rounded-2xl border border-slate-100 bg-slate-50/70 p-4">
                <div className="font-bold text-slate-900 mb-3 text-sm">
                  Audience Demographic Split
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <span className="text-slate-500 font-semibold">Gender:</span>
                    <div className="mt-1 space-y-1">
                      <div>Female: <strong>{inspectCreator.audienceGenderSplit.female}%</strong></div>
                      <div>Male: <strong>{inspectCreator.audienceGenderSplit.male}%</strong></div>
                    </div>
                  </div>
                  <div>
                    <span className="text-slate-500 font-semibold">Age Distribution:</span>
                    <div className="mt-1 space-y-1">
                      <div>18-24: <strong>{inspectCreator.audienceAgeSplit["18-24"]}%</strong></div>
                      <div>25-34: <strong>{inspectCreator.audienceAgeSplit["25-34"]}%</strong></div>
                      <div>35+: <strong>{inspectCreator.audienceAgeSplit["35+"]}%</strong></div>
                    </div>
                  </div>
                  <div>
                    <span className="text-slate-500 font-semibold">Top Metro Cities:</span>
                    <div className="mt-1 flex flex-wrap gap-1">
                      {inspectCreator.topCities.map((ct) => (
                        <span key={ct} className="bg-white border border-slate-200 px-2 py-0.5 rounded text-[11px] font-medium text-slate-800">
                          {ct}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Best Content & Reels */}
              <div>
                <div className="font-bold text-slate-900 mb-2 text-sm">
                  Top Performing Campaign Content
                </div>
                <div className="space-y-2">
                  {state.contentItems
                    .filter((cnt) => cnt.creatorId === inspectCreator.id)
                    .map((item) => (
                      <div key={item.id} className="flex items-center justify-between p-3 rounded-xl border border-slate-100 bg-white">
                        <div>
                          <div className="font-bold text-slate-800">{item.title}</div>
                          <div className="text-[11px] text-slate-400">{item.contentType} · {item.campaignName}</div>
                        </div>
                        <div className="text-right">
                          <div className="font-extrabold text-blue-600">{formatIndianNumber(item.viewsCount)} views</div>
                          <div className="text-[10px] text-slate-400">{item.likesCount} likes · {item.commentsCount} comments</div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>

              {/* Banking & Verification */}
              <div className="rounded-xl border border-slate-200 p-3 flex justify-between items-center text-[11px]">
                <div>
                  <span className="text-slate-500">Verified UPI ID:</span>{" "}
                  <strong className="font-mono text-slate-800">{inspectCreator.upiId || "N/A"}</strong>
                  {" · "}
                  <span className="text-slate-500">PAN:</span>{" "}
                  <strong className="font-mono text-slate-800">{inspectCreator.panNumber || "N/A"}</strong>
                </div>
                <span className="rounded bg-emerald-100 text-emerald-800 px-2 py-0.5 font-bold">
                  Section 194J Verified
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Side-by-Side Comparison Modal (2-3 Creators) */}
      {showCompareModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-4xl rounded-2xl bg-white p-6 shadow-2xl max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Side-by-Side Creator Comparison ({comparedCreators.length} Selected)
                </h3>
                <p className="text-xs text-slate-500">
                  Benchmark followers, engagement, delivery reliability, and sales attribution side-by-side.
                </p>
              </div>
              <button
                onClick={() => setShowCompareModal(false)}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="overflow-x-auto text-xs">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50">
                    <th className="p-3 w-40 text-slate-400 uppercase font-bold text-[10px]">Metric</th>
                    {comparedCreators.map((c) => (
                      <th key={c.id} className="p-3 text-center min-w-[200px]">
                        <img
                          src={c.avatarUrl}
                          alt={c.name}
                          className="h-12 w-12 rounded-full mx-auto object-cover ring-2 ring-blue-500/30"
                        />
                        <div className="font-bold text-slate-900 mt-2 text-sm">{c.name}</div>
                        <div className="text-[11px] text-blue-600 font-semibold">{c.handle}</div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <tr>
                    <td className="p-3 font-semibold text-slate-500">Niche & Platform</td>
                    {comparedCreators.map((c) => (
                      <td key={c.id} className="p-3 text-center font-bold text-slate-800">
                        {c.niche} ({c.platform})
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-slate-500">Followers</td>
                    {comparedCreators.map((c) => (
                      <td key={c.id} className="p-3 text-center font-extrabold text-slate-900">
                        {formatIndianNumber(c.followersCount)}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-slate-500">Avg Views per Reel</td>
                    {comparedCreators.map((c) => (
                      <td key={c.id} className="p-3 text-center font-bold text-indigo-600">
                        {formatIndianNumber(c.avgViews)}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-slate-500">Engagement Rate</td>
                    {comparedCreators.map((c) => (
                      <td key={c.id} className="p-3 text-center font-bold text-blue-600">
                        {c.engagementRate}%
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-slate-500">Attributed Sales (GMV)</td>
                    {comparedCreators.map((c) => (
                      <td key={c.id} className="p-3 text-center font-extrabold text-emerald-600 text-sm">
                        {formatINR(c.totalSales)}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-slate-500">On-Time Delivery %</td>
                    {comparedCreators.map((c) => (
                      <td key={c.id} className="p-3 text-center font-bold text-slate-800">
                        {c.onTimeDeliveryRate}%
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-slate-500">Reliability Index</td>
                    {comparedCreators.map((c) => (
                      <td key={c.id} className="p-3 text-center">
                        <span className="rounded-full bg-blue-100 text-blue-800 px-2 py-0.5 font-bold text-[11px]">
                          {c.reliabilityScore}/100
                        </span>
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-slate-500">Audience Female/Male</td>
                    {comparedCreators.map((c) => (
                      <td key={c.id} className="p-3 text-center font-medium text-slate-700">
                        {c.audienceGenderSplit.female}% F / {c.audienceGenderSplit.male}% M
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-slate-500">Top Cities</td>
                    {comparedCreators.map((c) => (
                      <td key={c.id} className="p-3 text-center text-slate-600">
                        {c.topCities.slice(0, 2).join(", ")}
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
