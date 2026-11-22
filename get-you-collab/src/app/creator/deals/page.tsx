"use client";

import React, { useState, useEffect } from "react";
import { appStore } from "@/lib/store";
import { Deal, DealStatus } from "@/lib/types";
import { formatINR, formatDate } from "@/lib/utils";
import {
  Handshake,
  CheckCircle,
  XCircle,
  UploadCloud,
  ExternalLink,
  Calendar,
  Clock,
  AlertCircle,
  FileText,
  Sparkles,
  Link as LinkIcon,
  Check,
  X,
} from "lucide-react";

const STATUS_FLOW: DealStatus[] = [
  "Invited",
  "Accepted",
  "Content Submitted",
  "Approved",
  "Live",
  "Completed",
];

export default function CreatorDealsPage() {
  const [state, setState] = useState(appStore.getState());
  const [activeTab, setActiveTab] = useState<string>("All");
  const [submitModalDeal, setSubmitModalDeal] = useState<Deal | null>(null);
  const [contentUrl, setContentUrl] = useState("");
  const [contentNotes, setContentNotes] = useState("");
  const [successToast, setSuccessToast] = useState<string | null>(null);

  useEffect(() => {
    return appStore.subscribe(() => {
      setState(appStore.getState());
    });
  }, []);

  const creatorId = state.currentUser.creatorId || "crt-aarav-mehta";
  const deals = state.deals.filter((d) => d.creatorId === creatorId);

  const filteredDeals =
    activeTab === "All"
      ? deals
      : deals.filter((d) => d.status.toLowerCase() === activeTab.toLowerCase());

  const handleStatusChange = (dealId: string, status: DealStatus) => {
    appStore.updateDealStatus(dealId, status);
    setSuccessToast(`Deal status updated to "${status}"`);
    setTimeout(() => setSuccessToast(null), 3000);
  };

  const handleOpenSubmitModal = (deal: Deal) => {
    setSubmitModalDeal(deal);
    setContentUrl(deal.contentSubmittedUrl || "");
    setContentNotes(deal.contentDraftNotes || "");
  };

  const handleSubmitContent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!submitModalDeal || !contentUrl.trim()) return;

    appStore.submitContentForDeal(submitModalDeal.id, contentUrl, contentNotes);
    setSubmitModalDeal(null);
    setContentUrl("");
    setContentNotes("");
    setSuccessToast("Content submitted successfully for agency & brand review!");
    setTimeout(() => setSuccessToast(null), 3000);
  };

  const getStatusBadgeClass = (status: DealStatus) => {
    switch (status) {
      case "Invited":
        return "bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800/60";
      case "Accepted":
        return "bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800/60";
      case "Content Submitted":
        return "bg-purple-50 dark:bg-purple-950/50 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800/60";
      case "Approved":
        return "bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/60";
      case "Live":
        return "bg-green-100 dark:bg-green-950/60 text-green-800 dark:text-green-300 border-green-300 dark:border-green-800 font-bold";
      case "Completed":
        return "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700";
      case "Declined":
        return "bg-rose-50 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800/60";
      default:
        return "bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700";
    }
  };

  return (
    <div className="space-y-6">
      {/* Toast alert */}
      {successToast && (
        <div className="fixed bottom-5 right-5 z-50 flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-3 text-xs font-semibold text-white shadow-xl animate-in slide-in-from-bottom duration-200">
          <CheckCircle className="h-4 w-4 text-emerald-400" />
          <span>{successToast}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
            My Brand Deals
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Accept invitations, manage campaign deliverables, and submit your content drafts for brand approval.
          </p>
        </div>
        <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-3 py-1.5 rounded-xl shadow-sm">
          Active Deals: <span className="text-blue-600 dark:text-blue-400 font-bold">{deals.length}</span>
        </div>
      </div>

      {/* Status Flow Tracker Visual */}
      <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm">
        <div className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3">
          Deal Lifecycle Flow
        </div>
        <div className="flex flex-wrap items-center gap-2 text-xs">
          {STATUS_FLOW.map((step, idx) => (
            <React.Fragment key={step}>
              <div className="flex items-center gap-1.5 rounded-lg bg-slate-50 dark:bg-slate-800/70 px-2.5 py-1.5 font-medium text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700/60">
                <span className="flex h-4 w-4 items-center justify-center rounded-full bg-slate-200 dark:bg-slate-700 text-[10px] font-bold text-slate-700 dark:text-slate-200">
                  {idx + 1}
                </span>
                <span>{step}</span>
              </div>
              {idx < STATUS_FLOW.length - 1 && (
                <span className="text-slate-300 dark:text-slate-600 font-bold">→</span>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Status Filter Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
        {["All", "Invited", "Accepted", "Content Submitted", "Approved", "Live", "Completed"].map(
          (tab) => {
            const count =
              tab === "All"
                ? deals.length
                : deals.filter((d) => d.status.toLowerCase() === tab.toLowerCase()).length;

            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`rounded-xl px-3.5 py-2 text-xs font-semibold transition ${
                  activeTab === tab
                    ? "bg-blue-600 text-white shadow-sm shadow-blue-500/20"
                    : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800"
                }`}
              >
                {tab} ({count})
              </button>
            );
          }
        )}
      </div>

      {/* Deals Cards */}
      <div className="space-y-4">
        {filteredDeals.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 p-12 text-center">
            <Handshake className="mx-auto h-10 w-10 text-slate-400 dark:text-slate-600" />
            <h3 className="mt-3 text-sm font-bold text-slate-800 dark:text-slate-200">
              No deals in &quot;{activeTab}&quot; category
            </h3>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Try switching tabs to view your other active or completed brand deals.
            </p>
          </div>
        ) : (
          filteredDeals.map((deal) => (
            <div
              key={deal.id}
              className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm transition hover:shadow-md"
            >
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                {/* Left info */}
                <div className="space-y-2 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[11px] font-semibold ${getStatusBadgeClass(
                        deal.status
                      )}`}
                    >
                      {deal.status}
                    </span>
                    <span className="text-xs text-slate-400">·</span>
                    <span className="text-xs font-medium text-slate-600 dark:text-slate-400">
                      Brand: <strong className="text-slate-900 dark:text-white">{deal.brandName}</strong>
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                    {deal.campaignName}
                  </h3>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 dark:text-slate-400 pt-1">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="h-4 w-4 text-slate-400" />
                      <span>
                        Deadline:{" "}
                        <strong className="text-slate-800 dark:text-slate-200">
                          {formatDate(deal.deadline)}
                        </strong>
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Clock className="h-4 w-4 text-slate-400" />
                      <span>Last activity: {deal.lastActivity}</span>
                    </div>
                  </div>

                  {/* Deliverables Box */}
                  <div className="mt-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 p-3.5 border border-slate-100 dark:border-slate-800">
                    <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      Deliverables Checklist
                    </div>
                    <div className="mt-1 text-xs font-medium text-slate-800 dark:text-slate-200">
                      {deal.deliverables}
                    </div>
                    {deal.terms && (
                      <p className="mt-1.5 text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                        Terms: {deal.terms}
                      </p>
                    )}
                  </div>

                  {/* If content submitted, show link */}
                  {deal.contentSubmittedUrl && (
                    <div className="flex items-center gap-2 text-xs text-purple-700 dark:text-purple-300 bg-purple-50 dark:bg-purple-950/40 p-2.5 rounded-xl border border-purple-200 dark:border-purple-800/60">
                      <LinkIcon className="h-4 w-4 shrink-0 text-purple-600 dark:text-purple-400" />
                      <span className="truncate">
                        Submitted Asset:{" "}
                        <a
                          href={deal.contentSubmittedUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="font-semibold underline"
                        >
                          {deal.contentSubmittedUrl}
                        </a>
                      </span>
                    </div>
                  )}
                </div>

                {/* Right financial & actions */}
                <div className="flex flex-col sm:items-end justify-between gap-4 border-t lg:border-t-0 lg:border-l border-slate-100 dark:border-slate-800 pt-4 lg:pt-0 lg:pl-6 min-w-[240px]">
                  <div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400">Agreed Fixed Value</div>
                    <div className="text-xl font-extrabold text-slate-900 dark:text-white">
                      {formatINR(deal.dealValue)}
                    </div>
                    <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold mt-0.5">
                      + {deal.commissionPercentage}% Affiliate Commission
                    </div>
                  </div>

                  {/* Interactive Action Buttons */}
                  <div className="flex flex-wrap items-center gap-2">
                    {deal.status === "Invited" && (
                      <>
                        <button
                          onClick={() => handleStatusChange(deal.id, "Accepted")}
                          className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-3.5 py-2 text-xs font-semibold text-white shadow-sm hover:bg-emerald-700 transition"
                        >
                          <Check className="h-3.5 w-3.5" />
                          Accept Deal
                        </button>
                        <button
                          onClick={() => handleStatusChange(deal.id, "Declined")}
                          className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition"
                        >
                          <X className="h-3.5 w-3.5" />
                          Decline
                        </button>
                      </>
                    )}

                    {(deal.status === "Accepted" ||
                      deal.status === "Content Submitted" ||
                      deal.status === "Approved") && (
                      <button
                        onClick={() => handleOpenSubmitModal(deal)}
                        className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-3.5 py-2 text-xs font-semibold text-white shadow-sm hover:bg-blue-700 transition"
                      >
                        <UploadCloud className="h-3.5 w-3.5" />
                        <span>
                          {deal.contentSubmittedUrl ? "Re-upload Draft" : "Upload Content Link"}
                        </span>
                      </button>
                    )}

                    {deal.status === "Approved" && (
                      <button
                        onClick={() => handleStatusChange(deal.id, "Live")}
                        className="inline-flex items-center gap-1.5 rounded-xl bg-green-600 px-3.5 py-2 text-xs font-semibold text-white shadow-sm hover:bg-green-700 transition"
                      >
                        <Sparkles className="h-3.5 w-3.5" />
                        Mark as Live
                      </button>
                    )}

                    {deal.status === "Live" && (
                      <button
                        onClick={() => handleStatusChange(deal.id, "Completed")}
                        className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 px-3.5 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition"
                      >
                        <CheckCircle className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                        Mark Completed
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Upload Content Modal */}
      {submitModalDeal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-2xl animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Upload Content Submission
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {submitModalDeal.campaignName}
                </p>
              </div>
              <button
                onClick={() => setSubmitModalDeal(null)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-700 dark:hover:text-slate-200"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitContent} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Draft or Live Asset URL (Google Drive / Instagram / Dropbox) *
                </label>
                <input
                  type="url"
                  required
                  placeholder="https://instagram.com/reel/... or https://drive.google.com/..."
                  value={contentUrl}
                  onChange={(e) => setContentUrl(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-2.5 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Creator Review Notes / Instructions for Brand
                </label>
                <textarea
                  rows={3}
                  placeholder="e.g. Edited with 4K clarity, added background music, discount code AARAV10 highlighted on 00:03 mark."
                  value={contentNotes}
                  onChange={(e) => setContentNotes(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-2.5 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div className="rounded-xl bg-blue-50 dark:bg-blue-950/40 p-3 text-[11px] text-blue-800 dark:text-blue-300 border border-blue-200 dark:border-blue-900/60">
                💡 Submitting updates this deal status to <strong>&quot;Content Submitted&quot;</strong> and alerts the agency admin for review.
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setSubmitModalDeal(null)}
                  className="rounded-xl border border-slate-200 dark:border-slate-700 px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-blue-600 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-blue-700"
                >
                  Submit Content
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
