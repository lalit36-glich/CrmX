"use client";

import React, { useState, useEffect } from "react";
import { appStore } from "@/lib/store";
import { formatIndianNumber } from "@/lib/utils";
import ThemeToggle from "@/components/ThemeToggle";
import {
  User,
  Instagram,
  Youtube,
  MapPin,
  Mail,
  Phone,
  Building,
  CreditCard,
  Save,
  CheckCircle2,
  Sparkles,
  PieChart,
  Moon,
  Sun,
} from "lucide-react";

export default function CreatorProfilePage() {
  const [state, setState] = useState(appStore.getState());
  const [savedMessage, setSavedMessage] = useState(false);

  const creatorId = state.currentUser.creatorId || "crt-aarav-mehta";
  const creator = state.creators.find((c) => c.id === creatorId) || state.creators[0];

  const [name, setName] = useState(creator.name);
  const [handle, setHandle] = useState(creator.handle);
  const [email, setEmail] = useState(creator.email);
  const [phone, setPhone] = useState(creator.phone);
  const [city, setCity] = useState(creator.city);
  const [niche, setNiche] = useState(creator.niche);
  const [platform, setPlatform] = useState(creator.platform);
  const [upiId, setUpiId] = useState(creator.upiId);
  const [bankAccount, setBankAccount] = useState(creator.bankAccountNumber);
  const [bankIfsc, setBankIfsc] = useState(creator.bankIfsc);
  const [panNumber, setPanNumber] = useState(creator.panNumber);

  useEffect(() => {
    return appStore.subscribe(() => {
      setState(appStore.getState());
    });
  }, []);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    appStore.updateCreator(creatorId, {
      name,
      handle,
      email,
      phone,
      city,
      niche,
      platform,
      upiId,
      bankAccountNumber: bankAccount,
      bankIfsc,
      panNumber,
    });
    setSavedMessage(true);
    setTimeout(() => setSavedMessage(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Toast */}
      {savedMessage && (
        <div className="fixed top-20 right-6 z-50 flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-3 text-xs font-semibold text-white shadow-xl animate-in slide-in-from-top duration-200">
          <CheckCircle2 className="h-4 w-4 text-emerald-400" />
          <span>Profile & banking information saved!</span>
        </div>
      )}

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
          Profile & Account Settings
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Manage your creator brand profile, theme appearance, verified social channels, and banking details.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Creator Snapshot Card */}
        <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5">
            <div className="flex items-center gap-5">
              <img
                src={creator.avatarUrl}
                alt={creator.name}
                className="h-20 w-20 rounded-2xl object-cover ring-4 ring-blue-500/20"
              />
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white">{creator.name}</h2>
                  <span className="rounded-full bg-blue-100 dark:bg-blue-950/60 text-blue-800 dark:text-blue-300 px-2.5 py-0.5 text-xs font-bold">
                    {creator.followerTier} Creator
                  </span>
                </div>
                <div className="text-xs text-blue-600 dark:text-blue-400 font-semibold">{creator.handle}</div>
                <div className="text-xs text-slate-500 dark:text-slate-400">
                  Member of Get You Collab Creator Network since {new Date(creator.createdAt).getFullYear()}
                </div>
              </div>
            </div>

            {/* Appearance Mode Pill */}
            <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 p-3 flex items-center justify-between gap-4">
              <div>
                <div className="text-xs font-bold text-slate-900 dark:text-white">Theme Mode</div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400">Toggle light / dark UI</div>
              </div>
              <ThemeToggle showLabel />
            </div>
          </div>
        </div>

        {/* Section 1: Basic & Social Information */}
        <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4 pb-2 border-b border-slate-100 dark:border-slate-800">
            Influencer Details
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Full Name
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-2.5 text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Social Handle
              </label>
              <input
                type="text"
                required
                value={handle}
                onChange={(e) => setHandle(e.target.value)}
                className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-2.5 text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-2.5 text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Phone Number (WhatsApp)
              </label>
              <input
                type="text"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-2.5 text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Primary City
              </label>
              <input
                type="text"
                required
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-2.5 text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Primary Content Niche
              </label>
              <select
                value={niche}
                onChange={(e) => setNiche(e.target.value as any)}
                className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-2.5 text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
              >
                <option value="Lifestyle">Lifestyle</option>
                <option value="Beauty">Beauty & Skincare</option>
                <option value="Tech">Tech & Gadgets</option>
                <option value="Fitness">Fitness & Health</option>
                <option value="Fashion">Fashion & Styling</option>
                <option value="Food">Food & Cooking</option>
                <option value="Gaming">Gaming</option>
              </select>
            </div>
          </div>
        </div>

        {/* Section 2: Indian Banking & TDS Information */}
        <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4 pb-2 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <span>TDS (Section 194J) & Banking Payout Methods</span>
            <span className="text-xs font-normal text-slate-400">Required for direct NEFT/UPI transfers</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                UPI ID (Instant Disbursement)
              </label>
              <input
                type="text"
                required
                value={upiId}
                onChange={(e) => setUpiId(e.target.value)}
                className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-2.5 text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                placeholder="username@okhdfcbank"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Permanent Account Number (PAN Card) *
              </label>
              <input
                type="text"
                required
                value={panNumber}
                onChange={(e) => setPanNumber(e.target.value.toUpperCase())}
                className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-2.5 text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 uppercase font-mono"
                placeholder="ABCDE1234F"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Bank Account Number
              </label>
              <input
                type="text"
                required
                value={bankAccount}
                onChange={(e) => setBankAccount(e.target.value)}
                className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-2.5 text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 font-mono"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Bank IFSC Code
              </label>
              <input
                type="text"
                required
                value={bankIfsc}
                onChange={(e) => setBankIfsc(e.target.value.toUpperCase())}
                className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-2.5 text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 uppercase font-mono"
                placeholder="HDFC0001234"
              />
            </div>
          </div>
        </div>

        {/* Section 3: Verified Audience Demographics */}
        <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Verified Audience Demographics
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Audience data verified via Instagram Graph API & agency audit.
              </p>
            </div>
            <span className="rounded-full bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60 px-2.5 py-0.5 text-[11px] font-bold">
              Verified
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="rounded-xl bg-slate-50 dark:bg-slate-800/60 p-4 border border-slate-100 dark:border-slate-800">
              <div className="font-semibold text-slate-600 dark:text-slate-300 mb-2">Gender Distribution</div>
              <div className="flex items-center justify-between text-slate-800 dark:text-slate-200">
                <span>Female:</span>
                <strong className="text-blue-600 dark:text-blue-400">{creator.audienceGenderSplit.female}%</strong>
              </div>
              <div className="flex items-center justify-between text-slate-800 dark:text-slate-200 mt-1">
                <span>Male:</span>
                <strong className="text-indigo-600 dark:text-indigo-400">{creator.audienceGenderSplit.male}%</strong>
              </div>
            </div>

            <div className="rounded-xl bg-slate-50 dark:bg-slate-800/60 p-4 border border-slate-100 dark:border-slate-800">
              <div className="font-semibold text-slate-600 dark:text-slate-300 mb-2">Age Distribution</div>
              <div className="flex items-center justify-between text-slate-800 dark:text-slate-200">
                <span>18 - 24 years:</span>
                <strong className="text-slate-900 dark:text-white">{creator.audienceAgeSplit["18-24"]}%</strong>
              </div>
              <div className="flex items-center justify-between text-slate-800 dark:text-slate-200 mt-1">
                <span>25 - 34 years:</span>
                <strong className="text-slate-900 dark:text-white">{creator.audienceAgeSplit["25-34"]}%</strong>
              </div>
            </div>

            <div className="rounded-xl bg-slate-50 dark:bg-slate-800/60 p-4 border border-slate-100 dark:border-slate-800">
              <div className="font-semibold text-slate-600 dark:text-slate-300 mb-2">Top Geographic Cities</div>
              <div className="flex flex-wrap gap-1.5 mt-2">
                {creator.topCities.map((c) => (
                  <span
                    key={c}
                    className="rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 px-2 py-0.5 text-[11px] font-semibold text-slate-700 dark:text-slate-300"
                  >
                    {c}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-xs font-bold text-white shadow-md hover:bg-blue-700 transition"
          >
            <Save className="h-4 w-4" />
            <span>Save Profile & Bank Changes</span>
          </button>
        </div>
      </form>
    </div>
  );
}
