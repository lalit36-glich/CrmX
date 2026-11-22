"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { appStore } from "@/lib/store";

export default function RootPage() {
  const router = useRouter();

  useEffect(() => {
    const user = appStore.getState().currentUser;
    if (user.role === "creator") {
      router.replace("/creator");
    } else {
      router.replace("/admin");
    }
  }, [router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-900 text-white">
      <div className="flex flex-col items-center gap-3">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent" />
        <div className="text-sm font-medium text-slate-300">
          Loading Get You Collab CRM...
        </div>
      </div>
    </div>
  );
}
