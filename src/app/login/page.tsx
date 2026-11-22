"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { appStore } from "@/lib/store";
import {
  Sparkles,
  ShieldCheck,
  UserCheck,
  ArrowRight,
  Lock,
  Mail,
  CheckCircle2,
} from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [role, setRole] = useState<"creator" | "admin">("creator");
  const [email, setEmail] = useState("aarav@creator.in");
  const [password, setPassword] = useState("creator123");
  const [loading, setLoading] = useState(false);

  const handleRoleTabChange = (newRole: "creator" | "admin") => {
    setRole(newRole);
    if (newRole === "creator") {
      setEmail("aarav@creator.in");
      setPassword("creator123");
    } else {
      setEmail("admin@getyoucollab.com");
      setPassword("admin123");
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      appStore.switchRole(role);
      setLoading(false);
      if (role === "creator") {
        router.push("/creator");
      } else {
        router.push("/admin");
      }
    }, 400);
  };

  const handleQuickDemo = (demoRole: "creator" | "admin") => {
    appStore.switchRole(demoRole);
    if (demoRole === "creator") {
      router.push("/creator");
    } else {
      router.push("/admin");
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-900 text-slate-100">
      {/* Left panel - Hero & Agency Showcase */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between p-12 bg-gradient-to-br from-[#0F172A] via-[#1E293B] to-[#0F172A] border-r border-slate-800 relative overflow-hidden">
        {/* Background decorative glows */}
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Top brand */}
        <div className="relative z-10">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-500 text-lg font-black text-white shadow-lg shadow-blue-500/30">
              GC
            </div>
            <div>
              <div className="text-xl font-bold tracking-tight text-white">
                Get You Collab
              </div>
              <div className="text-xs text-blue-400 font-medium">
                Indian Influencer Marketing & CRM Agency
              </div>
            </div>
          </div>
        </div>

        {/* Center showcase quote & metrics */}
        <div className="relative z-10 space-y-8 my-auto max-w-lg">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-900/50 border border-blue-700/50 px-3 py-1 text-xs font-semibold text-blue-300 mb-4">
              <Sparkles className="h-3.5 w-3.5 text-blue-400" />
              Unified Agency & Creator Ecosystem
            </span>
            <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl leading-tight">
              Powering India&apos;s Next Generation of Creator Campaigns.
            </h1>
            <p className="mt-4 text-sm text-slate-400 leading-relaxed">
              Real-time link & coupon attribution, automated TDS (Section 194J) deductions, instant UPI payouts, and rigorous creator performance intelligence in INR.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-4 pt-4 border-t border-slate-800">
            <div>
              <div className="text-2xl font-bold text-white">₹1.86L+</div>
              <div className="text-xs text-slate-400">Attributed GMV</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-400">100%</div>
              <div className="text-xs text-slate-400">TDS & UTR Tracked</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-emerald-400">11+</div>
              <div className="text-xs text-slate-400">Vetted Creators</div>
            </div>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="relative z-10 text-xs text-slate-500">
          © 2026 Get You Collab Technologies Pvt. Ltd. Mumbai · Bengaluru
        </div>
      </div>

      {/* Right panel - Login form */}
      <div className="flex w-full lg:w-1/2 items-center justify-center p-6 sm:p-12 bg-slate-950">
        <div className="w-full max-w-md space-y-8">
          <div>
            <div className="flex items-center gap-2 lg:hidden mb-6">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 font-bold text-white">
                GC
              </div>
              <span className="font-bold text-lg text-white">Get You Collab</span>
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-white">
              Sign in to your portal
            </h2>
            <p className="mt-2 text-sm text-slate-400">
              Select your role below or use 1-click demo access to inspect both views.
            </p>
          </div>

          {/* Role selection tab */}
          <div className="flex rounded-xl bg-slate-900 p-1 border border-slate-800">
            <button
              type="button"
              onClick={() => handleRoleTabChange("creator")}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-xs font-semibold rounded-lg transition-all ${
                role === "creator"
                  ? "bg-blue-600 text-white shadow-md shadow-blue-600/30"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <UserCheck className="h-4 w-4" />
              Creator Portal (Aarav)
            </button>
            <button
              type="button"
              onClick={() => handleRoleTabChange("admin")}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-xs font-semibold rounded-lg transition-all ${
                role === "admin"
                  ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/30"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <ShieldCheck className="h-4 w-4" />
              Agency Admin CRM
            </button>
          </div>

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <Mail className="h-4 w-4 text-slate-500" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="block w-full rounded-xl border border-slate-800 bg-slate-900 pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition outline-none"
                  placeholder="name@example.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Password
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <Lock className="h-4 w-4 text-slate-500" />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="block w-full rounded-xl border border-slate-800 bg-slate-900 pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition outline-none"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full flex items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold text-white shadow-lg transition-all ${
                role === "creator"
                  ? "bg-blue-600 hover:bg-blue-500 shadow-blue-600/30"
                  : "bg-emerald-600 hover:bg-emerald-500 shadow-emerald-600/30"
              }`}
            >
              {loading ? (
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
              ) : (
                <>
                  <span>
                    Sign in as {role === "creator" ? "Creator (Aarav)" : "Admin"}
                  </span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Launchers */}
          <div className="pt-4 border-t border-slate-800 space-y-3">
            <div className="text-xs font-medium text-slate-400 text-center">
              ⚡ Instant 1-Click Demo Portals
            </div>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => handleQuickDemo("creator")}
                className="flex flex-col items-center justify-center gap-1 rounded-xl border border-blue-900/50 bg-blue-950/30 p-3 text-left transition hover:bg-blue-900/40 hover:border-blue-600"
              >
                <div className="flex items-center gap-1.5 text-xs font-semibold text-blue-400">
                  <UserCheck className="h-3.5 w-3.5" />
                  Creator Portal
                </div>
                <div className="text-[11px] text-slate-400">
                  Aarav Mehta (3 Deals)
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemo("admin")}
                className="flex flex-col items-center justify-center gap-1 rounded-xl border border-emerald-900/50 bg-emerald-950/30 p-3 text-left transition hover:bg-emerald-900/40 hover:border-emerald-600"
              >
                <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-400">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  Admin CRM
                </div>
                <div className="text-[11px] text-slate-400">
                  Insights & Tracking
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
