"use client";

import React, { useState, useEffect } from "react";
import { appStore } from "@/lib/store";
import { ContentItem, ContentStatus } from "@/lib/types";
import { formatDate } from "@/lib/utils";
import {
  CheckSquare,
  Check,
  X,
  ExternalLink,
  MessageSquare,
  AlertCircle,
  Clock,
  CheckCircle2,
  Video,
} from "lucide-react";

export default function AdminApprovalsPage() {
  const [state, setState] = useState(appStore.getState());
  const [statusFilter, setStatusFilter] = useState<string>("Pending Approval");
  const [rejectModalItem, setRejectModalItem] = useState<ContentItem | null>(null);
  const [rejectNotes, setRejectNotes] = useState("");
  const [successToast, setSuccessToast] = useState<string | null>(null);

  useEffect(() => {
    return appStore.subscribe(() => {
      setState(appStore.getState());
    });
  }, []);

  const { contentItems } = state;

  const filteredItems =
    statusFilter === "All"
      ? contentItems
      : contentItems.filter((c) => c.status === statusFilter);

  const handleApprove = (item: ContentItem) => {
    appStore.approveContent(item.id);
    setSuccessToast(`Approved "${item.title}"! Deal marked ready to go Live.`);
    setTimeout(() => setSuccessToast(null), 3000);
  };

  const handleRejectSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rejectModalItem || !rejectNotes.trim()) return;

    appStore.rejectContent(rejectModalItem.id, rejectNotes);
    setRejectModalItem(null);
    setRejectNotes("");
    setSuccessToast(`Revision request sent to ${rejectModalItem.creatorName}`);
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
            Content Approvals & QA Queue
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Review submitted video drafts, check brand logo guidelines & promo codes before creator publishing.
          </p>
        </div>

        <div className="flex rounded-xl bg-slate-200/70 p-1 text-xs font-semibold dark:bg-slate-800">
          {["Pending Approval", "Approved", "Revision Requested", "Live", "All"].map(
            (tab) => {
              const count =
                tab === "All"
                  ? contentItems.length
                  : contentItems.filter((c) => c.status === tab).length;

              return (
                <button
                  key={tab}
                  onClick={() => setStatusFilter(tab)}
                  className={`rounded-lg px-3 py-1.5 transition ${
                    statusFilter === tab
                      ? "bg-white text-slate-900 font-bold shadow-sm dark:bg-blue-600 dark:text-white"
                      : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
                  }`}
                >
                  {tab} ({count})
                </button>
              );
            }
          )}
        </div>
      </div>

      {/* Approvals Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredItems.length === 0 ? (
          <div className="col-span-full rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center text-slate-400 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-500">
            <CheckSquare className="mx-auto h-10 w-10 text-slate-300 dark:text-slate-600" />
            <h3 className="mt-3 font-bold text-slate-700 text-sm dark:text-slate-300">
              No content items in &quot;{statusFilter}&quot;
            </h3>
            <p className="text-xs text-slate-500 mt-1 dark:text-slate-400">
              Select another status filter or wait for creators to upload new assets.
            </p>
          </div>
        ) : (
          filteredItems.map((item) => (
            <div
              key={item.id}
              className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm hover:shadow-md transition flex flex-col justify-between dark:border-slate-800 dark:bg-slate-900"
            >
              <div>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="text-xs font-bold text-blue-600 dark:text-blue-400">
                      {item.creatorName}
                    </span>
                    <h3 className="font-bold text-slate-900 text-base mt-0.5 dark:text-white">
                      {item.title}
                    </h3>
                    <div className="text-xs text-slate-500 mt-1 dark:text-slate-400">
                      Campaign: <strong className="text-slate-700 dark:text-slate-300">{item.campaignName}</strong>
                    </div>
                  </div>

                  <span
                    className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                      item.status === "Approved"
                        ? "bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800"
                        : item.status === "Pending Approval"
                        ? "bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800"
                        : item.status === "Revision Requested"
                        ? "bg-rose-50 text-rose-700 border border-rose-200 dark:bg-rose-950/60 dark:text-rose-300 dark:border-rose-800"
                        : "bg-green-100 text-green-800 dark:bg-emerald-950/60 dark:text-emerald-300"
                    }`}
                  >
                    {item.status}
                  </span>
                </div>

                {/* Draft link & Notes */}
                <div className="mt-4 rounded-xl bg-slate-50 p-3.5 border border-slate-100 text-xs space-y-2 dark:bg-slate-800/60 dark:border-slate-700/60">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 font-semibold dark:text-slate-400">Content Format:</span>
                    <span className="rounded bg-white border border-slate-200 px-2 py-0.5 font-bold text-slate-700 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300">
                      {item.contentType}
                    </span>
                  </div>

                  {item.draftAssetUrl && (
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500 font-semibold dark:text-slate-400">Asset File:</span>
                      <a
                        href={item.draftAssetUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-blue-600 font-semibold underline flex items-center gap-1 truncate max-w-[200px] dark:text-blue-400"
                      >
                        Open Draft Link <ExternalLink className="h-3 w-3 inline" />
                      </a>
                    </div>
                  )}

                  {item.reviewNotes && (
                    <div className="border-t border-slate-200/60 pt-2 text-slate-600 dark:border-slate-700 dark:text-slate-300">
                      <span className="text-slate-400 font-semibold dark:text-slate-500">Creator Notes:</span>{" "}
                      {item.reviewNotes}
                    </div>
                  )}
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="mt-5 border-t border-slate-100 pt-3 flex items-center justify-between dark:border-slate-800">
                <span className="text-[11px] text-slate-400 dark:text-slate-500">
                  Submitted {item.submittedAt ? formatDate(item.submittedAt) : "Recently"}
                </span>

                <div className="flex items-center gap-2">
                  {item.status === "Pending Approval" && (
                    <>
                      <button
                        onClick={() => {
                          setRejectModalItem(item);
                          setRejectNotes("");
                        }}
                        className="inline-flex items-center gap-1 rounded-xl border border-rose-200 bg-rose-50 px-3 py-1.5 text-xs font-semibold text-rose-700 hover:bg-rose-100 transition dark:border-rose-900/60 dark:bg-rose-950/60 dark:text-rose-300 dark:hover:bg-rose-900/50"
                      >
                        <X className="h-3.5 w-3.5" />
                        <span>Request Edits</span>
                      </button>

                      <button
                        onClick={() => handleApprove(item)}
                        className="inline-flex items-center gap-1 rounded-xl bg-emerald-600 px-3.5 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-emerald-700 transition"
                      >
                        <Check className="h-3.5 w-3.5" />
                        <span>Approve Content</span>
                      </button>
                    </>
                  )}

                  {item.status === "Approved" && (
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                      <CheckCircle2 className="h-4 w-4" /> Ready for Creator Publishing
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Reject / Request Edits Modal */}
      {rejectModalItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl animate-in zoom-in-95 duration-150 dark:bg-slate-900 dark:border dark:border-slate-800">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4 dark:border-slate-800">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Request Revision
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {rejectModalItem.creatorName} · {rejectModalItem.title}
                </p>
              </div>
              <button
                onClick={() => setRejectModalItem(null)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleRejectSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1 dark:text-slate-300">
                  Revision Notes & Instructions for Creator *
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="e.g. Please show the brand logo in the first 3 seconds and ensure coupon code is clearly pronounced in the voiceover."
                  value={rejectNotes}
                  onChange={(e) => setRejectNotes(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 p-2.5 text-slate-900 focus:outline-none focus:border-blue-500 dark:bg-slate-800 dark:border-slate-700 dark:text-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setRejectModalItem(null)}
                  className="rounded-xl border border-slate-200 px-4 py-2 font-semibold text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-rose-600 px-4 py-2 font-semibold text-white shadow-sm hover:bg-rose-700"
                >
                  Send Revision Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
