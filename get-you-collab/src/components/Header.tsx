"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { appStore } from "@/lib/store";
import { UserRole } from "@/lib/types";
import ThemeToggle from "./ThemeToggle";
import {
  Bell,
  Search,
  Sparkles,
  ShieldCheck,
  UserCheck,
  LogOut,
  Calendar,
  ExternalLink,
  Menu,
  X,
} from "lucide-react";

interface HeaderProps {
  onToggleSidebar?: () => void;
}

export default function Header({ onToggleSidebar }: HeaderProps) {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState(appStore.getState().currentUser);
  const [showSwitchMenu, setShowSwitchMenu] = useState(false);

  useEffect(() => {
    const unsub = appStore.subscribe(() => {
      setCurrentUser(appStore.getState().currentUser);
    });
    return unsub;
  }, []);

  const isCreator = currentUser.role === "creator";

  const handleRoleSwitch = (targetRole: UserRole) => {
    appStore.switchRole(targetRole);
    setShowSwitchMenu(false);
    if (targetRole === "admin") {
      router.push("/admin");
    } else {
      router.push("/creator");
    }
  };

  const handleLogout = () => {
    router.push("/login");
  };

  const currentDateFormatted = new Date().toLocaleDateString("en-IN", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 px-4 backdrop-blur-md sm:px-6 lg:px-8 transition-colors duration-150">
      {/* Left: Mobile menu button + Portal Badge */}
      <div className="flex items-center gap-3">
        {onToggleSidebar && (
          <button
            onClick={onToggleSidebar}
            className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 lg:hidden"
            aria-label="Toggle Navigation"
          >
            <Menu className="h-5 w-5" />
          </button>
        )}

        {isCreator ? (
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-200 dark:border-blue-900/60 bg-blue-50 dark:bg-blue-950/40 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-blue-700 dark:text-blue-300 shadow-sm">
              <Sparkles className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
              INFLUENCER PORTAL
            </span>
            <span className="hidden text-xs text-slate-400 dark:text-slate-600 sm:inline">|</span>
            <span className="hidden text-xs font-medium text-slate-600 dark:text-slate-400 sm:inline">
              Creator ID: {currentUser.creatorId || "crt-aarav-mehta"}
            </span>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 dark:border-emerald-900/60 bg-emerald-50 dark:bg-emerald-950/40 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-emerald-800 dark:text-emerald-300 shadow-sm">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
              AGENCY ADMIN CRM
            </span>
            <span className="hidden text-xs text-slate-400 dark:text-slate-600 sm:inline">|</span>
            <span className="hidden text-xs font-medium text-slate-600 dark:text-slate-400 sm:inline">
              Super Admin Access
            </span>
          </div>
        )}
      </div>

      {/* Right: Date, Dark/Light Mode Toggle, Role Switcher Demo Tool & Profile */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Date Display */}
        <div className="hidden items-center gap-1.5 rounded-md bg-slate-100 dark:bg-slate-800 px-2.5 py-1 text-xs font-medium text-slate-600 dark:text-slate-300 md:flex">
          <Calendar className="h-3.5 w-3.5 text-slate-500 dark:text-slate-400" />
          <span>{currentDateFormatted}</span>
        </div>

        {/* Theme Toggle (Dark / Light Mode) */}
        <ThemeToggle />

        {/* Demo Role Switcher Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowSwitchMenu(!showSwitchMenu)}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 px-2.5 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-200 transition hover:bg-slate-100 dark:hover:bg-slate-700"
            title="Switch Demo Role"
          >
            <UserCheck className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
            <span className="hidden sm:inline">Demo Switch:</span>
            <span className="font-semibold text-slate-900 dark:text-white">
              {isCreator ? "Aarav (Creator)" : "Admin"}
            </span>
          </button>

          {showSwitchMenu && (
            <div className="absolute right-0 mt-2 w-56 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-2 shadow-xl ring-1 ring-black/5 dark:ring-white/5 z-50 animate-in fade-in zoom-in-95 duration-100">
              <div className="px-2 py-1.5 text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                Switch Active View
              </div>
              <button
                onClick={() => handleRoleSwitch("creator")}
                className={`flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-xs transition ${
                  isCreator
                    ? "bg-blue-50 dark:bg-blue-950/50 font-semibold text-blue-700 dark:text-blue-300"
                    : "text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
                }`}
              >
                <div className="h-2 w-2 rounded-full bg-blue-600 dark:bg-blue-400" />
                <div>
                  <div className="font-medium">Aarav Mehta</div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">Creator Portal (3 Deals)</div>
                </div>
              </button>

              <button
                onClick={() => handleRoleSwitch("admin")}
                className={`flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-xs transition ${
                  !isCreator
                    ? "bg-emerald-50 dark:bg-emerald-950/50 font-semibold text-emerald-800 dark:text-emerald-300"
                    : "text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
                }`}
              >
                <div className="h-2 w-2 rounded-full bg-emerald-600 dark:bg-emerald-400" />
                <div>
                  <div className="font-medium">Agency Admin</div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">Full CRM & Insights Portal</div>
                </div>
              </button>
            </div>
          )}
        </div>

        {/* User Avatar + Logout Button */}
        <div className="flex items-center gap-2 border-l border-slate-200 dark:border-slate-800 pl-2 sm:pl-3">
          <div className="flex items-center gap-2">
            {currentUser.avatarUrl ? (
              <img
                src={currentUser.avatarUrl}
                alt={currentUser.fullName}
                className="h-8 w-8 rounded-full object-cover ring-2 ring-slate-200 dark:ring-slate-700"
              />
            ) : (
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white">
                {currentUser.fullName.slice(0, 2).toUpperCase()}
              </div>
            )}
            <div className="hidden text-left lg:block">
              <div className="text-xs font-semibold text-slate-800 dark:text-slate-200 leading-tight">
                {currentUser.fullName}
              </div>
              <div className="text-[10px] capitalize text-slate-400 dark:text-slate-500">
                {currentUser.role}
              </div>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="flex items-center gap-1 rounded-lg p-1.5 text-xs font-medium text-slate-500 dark:text-slate-400 transition hover:bg-red-50 dark:hover:bg-red-950/40 hover:text-red-600 dark:hover:text-red-400"
            title="Log Out"
          >
            <LogOut className="h-4 w-4" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </div>
    </header>
  );
}
