"use client";

import React, { useState, useEffect } from "react";
import { appStore } from "@/lib/store";
import { Activity } from "@/lib/types";
import {
  Activity as ActivityIcon,
  Sparkles,
  ShieldAlert,
  Handshake,
  Receipt,
  CheckCircle2,
  Clock,
  Video,
} from "lucide-react";

export default function AdminActivityPage() {
  const [state, setState] = useState(appStore.getState());

  useEffect(() => {
    return appStore.subscribe(() => {
      setState(appStore.getState());
    });
  }, []);

  const { activities } = state;

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "Content":
        return <Video className="h-4 w-4 text-purple-600" />;
      case "Deal":
        return <Handshake className="h-4 w-4 text-blue-600" />;
      case "Fraud Alert":
        return <ShieldAlert className="h-4 w-4 text-amber-600" />;
      case "Payout":
        return <Receipt className="h-4 w-4 text-emerald-600" />;
      default:
        return <ActivityIcon className="h-4 w-4 text-slate-600" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl dark:text-white">
          Agency Activity & Audit Timeline
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Chronological record of influencer actions, deal revisions, bank disbursements, and system attribution events.
        </p>
      </div>

      {/* Activity Timeline List */}
      <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-800">
          {activities.map((act) => (
            <div key={act.id} className="relative flex items-start gap-4">
              {/* Dot Icon */}
              <div className="absolute -left-6 mt-1 flex h-6 w-6 items-center justify-center rounded-full bg-white border-2 border-slate-300 dark:bg-slate-900 dark:border-slate-700">
                {getActivityIcon(act.entityType)}
              </div>

              {/* Event Content */}
              <div className="flex-1 rounded-xl bg-slate-50 p-4 border border-slate-100 dark:bg-slate-800/60 dark:border-slate-700/60">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                  <div className="text-xs text-slate-800 dark:text-slate-200">
                    <strong className="text-slate-900 font-bold dark:text-white">{act.actorName}</strong>{" "}
                    <span className="text-slate-600 dark:text-slate-400">{act.action}</span>{" "}
                    <span className="font-semibold text-blue-700 dark:text-blue-400">&quot;{act.entityName}&quot;</span>
                  </div>
                  <span className="text-[11px] text-slate-400 flex items-center gap-1 dark:text-slate-500">
                    <Clock className="h-3 w-3" /> {act.timestamp}
                  </span>
                </div>

                {act.details && (
                  <p className="mt-1 text-xs text-slate-500 font-mono dark:text-slate-400">
                    {act.details}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
