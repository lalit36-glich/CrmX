"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { appStore } from "@/lib/store";
import {
  LayoutDashboard,
  Sparkles,
  Handshake,
  TrendingUp,
  Wallet,
  FileText,
  UserCog,
  Users,
  Building2,
  Megaphone,
  CheckSquare,
  Link2,
  Receipt,
  ListTodo,
  Activity as ActivityIcon,
  X,
  BadgeCheck,
} from "lucide-react";

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

interface NavItem {
  label: string;
  href: string;
  icon: any;
  badge?: string;
  badgeColor?: string;
  highlight?: boolean;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();
  const [currentUser, setCurrentUser] = useState(appStore.getState().currentUser);
  const [dealsCount, setDealsCount] = useState(0);
  const [pendingApprovalsCount, setPendingApprovalsCount] = useState(0);

  useEffect(() => {
    const updateStats = () => {
      const state = appStore.getState();
      setCurrentUser(state.currentUser);
      if (state.currentUser.role === "creator") {
        const creatorDeals = state.deals.filter(
          (d) => d.creatorId === state.currentUser.creatorId
        );
        setDealsCount(creatorDeals.length);
      } else {
        const pending = state.contentItems.filter(
          (c) => c.status === "Pending Approval"
        );
        setPendingApprovalsCount(pending.length);
      }
    };

    updateStats();
    return appStore.subscribe(updateStats);
  }, []);

  const isCreator = currentUser.role === "creator";

  const creatorNavItems: NavItem[] = [
    { label: "Overview", href: "/creator", icon: LayoutDashboard },
    {
      label: "My Brand Deals",
      href: "/creator/deals",
      icon: Handshake,
      badge: dealsCount > 0 ? `${dealsCount}` : undefined,
    },
    { label: "Sales Performance", href: "/creator/sales", icon: TrendingUp },
    { label: "My Earnings", href: "/creator/earnings", icon: Wallet },
    { label: "Reports", href: "/creator/reports", icon: FileText },
    { label: "Profile & Settings", href: "/creator/profile", icon: UserCog },
  ];

  const adminNavItems: NavItem[] = [
    { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
    {
      label: "Creator Insights",
      href: "/admin/insights",
      icon: Sparkles,
      highlight: true,
    },
    { label: "Creators (Kanban)", href: "/admin/creators", icon: Users },
    { label: "Brands", href: "/admin/brands", icon: Building2 },
    { label: "Campaigns", href: "/admin/campaigns", icon: Megaphone },
    { label: "Deals & Contracts", href: "/admin/deals", icon: Handshake },
    {
      label: "Content Approvals",
      href: "/admin/approvals",
      icon: CheckSquare,
      badge: pendingApprovalsCount > 0 ? `${pendingApprovalsCount}` : undefined,
      badgeColor: "bg-amber-500",
    },
    { label: "Tracking & UTM", href: "/admin/tracking", icon: Link2 },
    { label: "Payouts & TDS", href: "/admin/payouts", icon: Receipt },
    { label: "Follow-ups & Tasks", href: "/admin/tasks", icon: ListTodo },
    { label: "Activity Timeline", href: "/admin/activity", icon: ActivityIcon },
    { label: "Reports & Export", href: "/admin/reports", icon: FileText },
  ];

  const navItems = isCreator ? creatorNavItems : adminNavItems;

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-sm lg:hidden"
        />
      )}

      {/* Main Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col bg-[#0F172A] text-slate-200 transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Brand Header */}
        <div className="flex h-16 items-center justify-between border-b border-slate-800/80 px-6">
          <Link href={isCreator ? "/creator" : "/admin"} className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 font-bold text-white shadow-md shadow-blue-500/20">
              GC
            </div>
            <div>
              <div className="flex items-center gap-1.5 font-bold tracking-tight text-white text-base">
                Get You Collab
              </div>
              <div className="text-[10px] tracking-wider text-blue-400 uppercase font-semibold">
                Creator Marketing CRM
              </div>
            </div>
          </Link>

          {onClose && (
            <button
              onClick={onClose}
              className="rounded-lg p-1 text-slate-400 hover:bg-slate-800 hover:text-white lg:hidden"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>

        {/* Portal Role Indicator Pill */}
        <div className="px-4 pt-4 pb-2">
          <div className="flex items-center justify-between rounded-lg bg-slate-800/70 p-2.5 border border-slate-700/60">
            <div className="flex items-center gap-2 overflow-hidden">
              <div
                className={`h-2.5 w-2.5 shrink-0 rounded-full ${
                  isCreator ? "bg-blue-400 animate-pulse" : "bg-emerald-400"
                }`}
              />
              <div className="truncate">
                <div className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold">
                  {isCreator ? "Creator Account" : "Agency Headquarters"}
                </div>
                <div className="truncate text-xs font-medium text-white">
                  {currentUser.fullName}
                </div>
              </div>
            </div>
            {isCreator && (
              <BadgeCheck className="h-4 w-4 shrink-0 text-blue-400" />
            )}
          </div>
        </div>

        {/* Nav Items */}
        <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-3">
          <div className="px-3 pb-1.5 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
            {isCreator ? "Creator Menu" : "Agency CRM Modules"}
          </div>

          {navItems.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== "/creator" &&
                item.href !== "/admin" &&
                pathname.startsWith(item.href));
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={`group flex items-center justify-between rounded-lg px-3 py-2 text-xs font-medium transition-all ${
                  isActive
                    ? "bg-blue-600 text-white shadow-sm shadow-blue-500/20"
                    : "text-slate-300 hover:bg-slate-800/80 hover:text-white"
                } ${item.highlight && !isActive ? "text-blue-300 font-semibold bg-blue-950/30" : ""}`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`h-4 w-4 shrink-0 transition-colors ${
                      isActive
                        ? "text-white"
                        : item.highlight
                        ? "text-blue-400"
                        : "text-slate-400 group-hover:text-slate-200"
                    }`}
                  />
                  <span>{item.label}</span>
                </div>

                {item.badge && (
                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                      item.badgeColor || "bg-blue-500 text-white"
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Footer info */}
        <div className="border-t border-slate-800/80 p-4 text-[11px] text-slate-400">
          <div className="flex items-center justify-between">
            <span>India Edition (INR ₹)</span>
            <span className="font-semibold text-emerald-400">v1.2 Live</span>
          </div>
          <div className="mt-1 text-[10px] text-slate-400">
            Section 194J TDS Compliant
          </div>
        </div>
      </aside>
    </>
  );
}
