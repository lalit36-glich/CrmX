"use client";

import React, { useState, useEffect } from "react";
import { appStore } from "@/lib/store";
import { Task } from "@/lib/types";
import { formatDate } from "@/lib/utils";
import {
  ListTodo,
  Plus,
  CheckCircle2,
  Clock,
  AlertCircle,
  Calendar,
  X,
  Check,
} from "lucide-react";

export default function AdminTasksPage() {
  const [state, setState] = useState(appStore.getState());
  const [showAddModal, setShowAddModal] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<"Low" | "Medium" | "High" | "Urgent">("Medium");
  const [dueDate, setDueDate] = useState("2026-06-25");
  const [successToast, setSuccessToast] = useState<string | null>(null);

  useEffect(() => {
    return appStore.subscribe(() => {
      setState(appStore.getState());
    });
  }, []);

  const { tasks } = state;

  const handleStatusChange = (taskId: string, status: "Pending" | "In Progress" | "Completed") => {
    appStore.updateTaskStatus(taskId, status);
    setSuccessToast(`Task updated to ${status}`);
    setTimeout(() => setSuccessToast(null), 2000);
  };

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    appStore.addTask({
      title,
      description,
      assignedTo: "Agency Admin",
      dueDate,
      priority,
      status: "Pending",
    });

    setShowAddModal(false);
    setTitle("");
    setDescription("");
    setSuccessToast("New task created!");
    setTimeout(() => setSuccessToast(null), 2500);
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
            Agency Follow-ups & Task Reminders
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Keep track of creator contract extensions, fraud alerts, and TDS certificate deadlines.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-blue-700 transition"
        >
          <Plus className="h-4 w-4" />
          <span>Create Task</span>
        </button>
      </div>

      {/* Tasks Table / Cards */}
      <div className="space-y-3">
        {tasks.map((task) => (
          <div
            key={task.id}
            className={`rounded-2xl border bg-white p-5 shadow-sm transition hover:shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4 dark:bg-slate-900 ${
              task.status === "Completed"
                ? "border-slate-200 opacity-60 bg-slate-50/50 dark:border-slate-800 dark:bg-slate-900/50"
                : task.priority === "Urgent"
                ? "border-rose-200 dark:border-rose-900/60"
                : "border-slate-200/80 dark:border-slate-800"
            }`}
          >
            <div className="space-y-1.5 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <span
                  className={`rounded px-2 py-0.5 text-[10px] font-bold ${
                    task.priority === "Urgent"
                      ? "bg-rose-100 text-rose-700 border border-rose-200 dark:bg-rose-950/60 dark:text-rose-300 dark:border-rose-800"
                      : task.priority === "High"
                      ? "bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300"
                      : "bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300"
                  }`}
                >
                  {task.priority}
                </span>

                {task.creatorName && (
                  <span className="text-xs text-blue-600 font-semibold dark:text-blue-400">
                    @{task.creatorName}
                  </span>
                )}
                {task.campaignName && (
                  <span className="text-xs text-slate-400 font-medium dark:text-slate-500">
                    · {task.campaignName}
                  </span>
                )}
              </div>

              <h3 className={`text-sm font-bold text-slate-900 dark:text-white ${task.status === "Completed" ? "line-through text-slate-400 dark:text-slate-500" : ""}`}>
                {task.title}
              </h3>
              {task.description && (
                <p className="text-xs text-slate-500 leading-relaxed max-w-2xl dark:text-slate-400">
                  {task.description}
                </p>
              )}
            </div>

            <div className="flex items-center gap-4 shrink-0 border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-100 dark:border-slate-800">
              <div className="text-right text-xs">
                <div className="flex items-center gap-1 text-slate-500 dark:text-slate-400">
                  <Calendar className="h-3.5 w-3.5 text-slate-400 dark:text-slate-500" />
                  <span>Due {formatDate(task.dueDate)}</span>
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5 dark:text-slate-500">
                  Assigned: {task.assignedTo}
                </div>
              </div>

              <select
                value={task.status}
                onChange={(e) =>
                  handleStatusChange(task.id, e.target.value as any)
                }
                className="rounded-xl border border-slate-200 bg-white p-2 text-xs font-semibold text-slate-700 outline-none cursor-pointer dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300"
              >
                <option value="Pending">Pending</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
          </div>
        ))}
      </div>

      {/* Add Task Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl animate-in zoom-in-95 duration-150 dark:bg-slate-900 dark:border dark:border-slate-800">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4 dark:border-slate-800">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Create Follow-up Task
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Assign an agency reminder or creator task.
                </p>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleAddTask} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1 dark:text-slate-300">
                  Task Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Verify Snitch reel sound sync"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 p-2.5 text-slate-900 focus:outline-none focus:border-blue-500 dark:bg-slate-800 dark:border-slate-700 dark:text-white"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1 dark:text-slate-300">
                  Description / Context
                </label>
                <textarea
                  rows={3}
                  placeholder="Add specific instructions..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 p-2.5 text-slate-900 focus:outline-none focus:border-blue-500 dark:bg-slate-800 dark:border-slate-700 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1 dark:text-slate-300">
                    Priority
                  </label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as any)}
                    className="w-full rounded-xl border border-slate-300 p-2 text-slate-900 outline-none bg-white dark:bg-slate-800 dark:border-slate-700 dark:text-white"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Urgent">Urgent</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1 dark:text-slate-300">
                    Due Date
                  </label>
                  <input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 p-2 text-slate-900 focus:outline-none focus:border-blue-500 dark:bg-slate-800 dark:border-slate-700 dark:text-white"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
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
                  Create Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
