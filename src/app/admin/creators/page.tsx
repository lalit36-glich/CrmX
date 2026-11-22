"use client";

import React, { useState, useEffect } from "react";
import { appStore } from "@/lib/store";
import { Creator, CreatorStage } from "@/lib/types";
import { formatIndianNumber, formatINR } from "@/lib/utils";
import {
  Users,
  Plus,
  ArrowRight,
  ChevronRight,
  ChevronLeft,
  X,
  CheckCircle2,
  Phone,
  Mail,
  MapPin,
  Sparkles,
} from "lucide-react";

const STAGES: CreatorStage[] = [
  "Lead",
  "Contacted",
  "Negotiating",
  "Onboarded",
  "Active",
];

export default function AdminCreatorsPage() {
  const [state, setState] = useState(appStore.getState());
  const [showAddModal, setShowAddModal] = useState(false);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  // New creator form
  const [name, setName] = useState("");
  const [handle, setHandle] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("Mumbai");
  const [niche, setNiche] = useState<any>("Lifestyle");
  const [platform, setPlatform] = useState<any>("Instagram");
  const [followersCount, setFollowersCount] = useState<number>(100000);
  const [avgViews, setAvgViews] = useState<number>(20000);
  const [engagementRate, setEngagementRate] = useState<number>(4.5);
  const [followerTier, setFollowerTier] = useState<any>("Micro");
  const [stage, setStage] = useState<CreatorStage>("Lead");
  const [upiId, setUpiId] = useState("");
  const [panNumber, setPanNumber] = useState("");

  useEffect(() => {
    return appStore.subscribe(() => {
      setState(appStore.getState());
    });
  }, []);

  const creators = state.creators;

  const handleMoveStage = (creatorId: string, currentStage: CreatorStage, direction: "prev" | "next") => {
    const currentIndex = STAGES.indexOf(currentStage);
    const newIndex = direction === "next" ? currentIndex + 1 : currentIndex - 1;
    if (newIndex >= 0 && newIndex < STAGES.length) {
      const nextStage = STAGES[newIndex];
      appStore.updateCreatorStage(creatorId, nextStage);
      setSuccessToast(`Moved to ${nextStage}`);
      setTimeout(() => setSuccessToast(null), 2500);
    }
  };

  const handleAddCreator = (e: React.FormEvent) => {
    e.preventDefault();
    appStore.addCreator({
      name,
      handle,
      email,
      phone,
      city,
      niche,
      platform,
      followersCount,
      avgViews,
      engagementRate,
      followerTier,
      stage,
      reliabilityScore: 92,
      onTimeDeliveryRate: 95,
      upiId: upiId || `${handle.replace("@", "")}@oksbi`,
      bankAccountNumber: "50100439281726",
      bankIfsc: "HDFC0001234",
      panNumber: panNumber || "ABCDE1234F",
      audienceGenderSplit: { female: 60, male: 40 },
      audienceAgeSplit: { "18-24": 50, "25-34": 40, "35+": 10 },
      topCities: [city, "Delhi NCR", "Bengaluru"],
      avatarUrl: `https://images.unsplash.com/photo-${Math.floor(1500000000000 + Math.random() * 50000000)}?w=150&auto=format&fit=crop&q=80`,
    });

    setShowAddModal(false);
    setName("");
    setHandle("");
    setEmail("");
    setSuccessToast(`Added new creator ${name} to pipeline!`);
    setTimeout(() => setSuccessToast(null), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Toast Alert */}
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
            Creator Onboarding Pipeline (Kanban)
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Track prospective influencer discovery, contract negotiations, KYC/bank onboarding, and active roster.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-blue-700 transition"
        >
          <Plus className="h-4 w-4" />
          <span>Add New Creator</span>
        </button>
      </div>

      {/* Kanban Board Columns */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 overflow-x-auto pb-4">
        {STAGES.map((colStage) => {
          const stageCreators = creators.filter((c) => c.stage === colStage);
          const stageBadgeColor =
            colStage === "Lead"
              ? "bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300"
              : colStage === "Contacted"
              ? "bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300"
              : colStage === "Negotiating"
              ? "bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300"
              : colStage === "Onboarded"
              ? "bg-purple-100 text-purple-800 dark:bg-purple-950/60 dark:text-purple-300"
              : "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300";

          return (
            <div
              key={colStage}
              className="flex flex-col rounded-2xl border border-slate-200/80 bg-slate-100/60 p-3 min-w-[240px] dark:border-slate-800 dark:bg-slate-900/60"
            >
              {/* Column Header */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-200/70 mb-3 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-xs text-slate-800 dark:text-slate-200">
                    {colStage}
                  </span>
                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] font-extrabold ${stageBadgeColor}`}
                  >
                    {stageCreators.length}
                  </span>
                </div>
              </div>

              {/* Column Cards */}
              <div className="space-y-3 flex-1">
                {stageCreators.length === 0 ? (
                  <div className="rounded-xl border border-dashed border-slate-200 p-6 text-center text-xs text-slate-400 dark:border-slate-800 dark:text-slate-500">
                    No creators in this stage
                  </div>
                ) : (
                  stageCreators.map((creator) => (
                    <div
                      key={creator.id}
                      className="rounded-xl border border-slate-200/90 bg-white p-3.5 shadow-sm hover:shadow transition dark:border-slate-800 dark:bg-slate-900"
                    >
                      <div className="flex items-center gap-2.5">
                        <img
                          src={creator.avatarUrl}
                          alt={creator.name}
                          className="h-9 w-9 rounded-full object-cover ring-1 ring-slate-200 dark:ring-slate-700"
                        />
                        <div className="truncate">
                          <div className="font-bold text-slate-900 text-xs truncate dark:text-white">
                            {creator.name}
                          </div>
                          <div className="text-[11px] text-blue-600 font-semibold truncate dark:text-blue-400">
                            {creator.handle}
                          </div>
                        </div>
                      </div>

                      <div className="mt-3 grid grid-cols-2 gap-1.5 text-[11px] text-slate-600 border-t border-slate-100 pt-2 dark:border-slate-800 dark:text-slate-300">
                        <div>
                          <span className="text-slate-400 dark:text-slate-500">Niche:</span>{" "}
                          <strong>{creator.niche}</strong>
                        </div>
                        <div>
                          <span className="text-slate-400 dark:text-slate-500">City:</span>{" "}
                          <strong>{creator.city}</strong>
                        </div>
                        <div>
                          <span className="text-slate-400 dark:text-slate-500">Followers:</span>{" "}
                          <strong>{formatIndianNumber(creator.followersCount)}</strong>
                        </div>
                        <div>
                          <span className="text-slate-400 dark:text-slate-500">Eng Rate:</span>{" "}
                          <strong className="text-emerald-600 dark:text-emerald-400">{creator.engagementRate}%</strong>
                        </div>
                      </div>

                      {/* Advance Stage buttons */}
                      <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-2 text-[10px] dark:border-slate-800">
                        {colStage !== "Lead" ? (
                          <button
                            onClick={() => handleMoveStage(creator.id, colStage, "prev")}
                            className="flex items-center gap-0.5 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200"
                            title="Move back"
                          >
                            <ChevronLeft className="h-3 w-3" /> Back
                          </button>
                        ) : (
                          <span />
                        )}

                        {colStage !== "Active" ? (
                          <button
                            onClick={() => handleMoveStage(creator.id, colStage, "next")}
                            className="flex items-center gap-0.5 font-bold text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                            title="Advance stage"
                          >
                            Advance <ChevronRight className="h-3 w-3" />
                          </button>
                        ) : (
                          <span className="text-emerald-600 font-bold dark:text-emerald-400">Active Roster</span>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Creator Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-xl rounded-2xl bg-white p-6 shadow-2xl max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-150 dark:bg-slate-900 dark:border dark:border-slate-800">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4 dark:border-slate-800">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Onboard New Creator
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Add an influencer to the agency acquisition pipeline.
                </p>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleAddCreator} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1 dark:text-slate-300">Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ishaan Sharma"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 p-2 text-slate-900 focus:outline-none focus:border-blue-500 dark:bg-slate-800 dark:border-slate-700 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1 dark:text-slate-300">Handle *</label>
                  <input
                    type="text"
                    required
                    placeholder="@ishaan.creates"
                    value={handle}
                    onChange={(e) => setHandle(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 p-2 text-slate-900 focus:outline-none focus:border-blue-500 dark:bg-slate-800 dark:border-slate-700 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1 dark:text-slate-300">Email *</label>
                  <input
                    type="email"
                    required
                    placeholder="ishaan@creator.in"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 p-2 text-slate-900 focus:outline-none focus:border-blue-500 dark:bg-slate-800 dark:border-slate-700 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1 dark:text-slate-300">Phone *</label>
                  <input
                    type="text"
                    required
                    placeholder="+91 98200 11223"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 p-2 text-slate-900 focus:outline-none focus:border-blue-500 dark:bg-slate-800 dark:border-slate-700 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1 dark:text-slate-300">City</label>
                  <input
                    type="text"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 p-2 text-slate-900 focus:outline-none focus:border-blue-500 dark:bg-slate-800 dark:border-slate-700 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1 dark:text-slate-300">Niche</label>
                  <select
                    value={niche}
                    onChange={(e) => setNiche(e.target.value as any)}
                    className="w-full rounded-xl border border-slate-300 p-2 text-slate-900 focus:outline-none focus:border-blue-500 bg-white dark:bg-slate-800 dark:border-slate-700 dark:text-white"
                  >
                    <option value="Lifestyle">Lifestyle</option>
                    <option value="Beauty">Beauty</option>
                    <option value="Tech">Tech</option>
                    <option value="Fitness">Fitness</option>
                    <option value="Fashion">Fashion</option>
                    <option value="Food">Food</option>
                    <option value="Gaming">Gaming</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1 dark:text-slate-300">Followers Count</label>
                  <input
                    type="number"
                    value={followersCount}
                    onChange={(e) => setFollowersCount(Number(e.target.value))}
                    className="w-full rounded-xl border border-slate-300 p-2 text-slate-900 focus:outline-none focus:border-blue-500 dark:bg-slate-800 dark:border-slate-700 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1 dark:text-slate-300">Initial Pipeline Stage</label>
                  <select
                    value={stage}
                    onChange={(e) => setStage(e.target.value as any)}
                    className="w-full rounded-xl border border-slate-300 p-2 text-slate-900 focus:outline-none focus:border-blue-500 bg-white dark:bg-slate-800 dark:border-slate-700 dark:text-white"
                  >
                    {STAGES.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
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
                  Add Creator to Kanban
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
