"use client";

import { useState } from "react";
import { AlertCircle, X } from "lucide-react";
import { STORAGE_KEYS } from "@/constants/storage";

export function BlockedPermissionBanner() {
  const [visible, setVisible] = useState(() => {
    if (
      typeof window !== "undefined" &&
      "Notification" in window &&
      Notification.permission === "denied" &&
      !sessionStorage.getItem(STORAGE_KEYS.NOTIF_BANNER_DISMISSED)
    ) {
      return true;
    }
    return false;
  });

  const handleDismiss = () => {
    sessionStorage.setItem(STORAGE_KEYS.NOTIF_BANNER_DISMISSED, "1");
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      role="alert"
      className="flex items-start gap-3 w-full px-4 py-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-200 animate-in slide-in-from-top-2 duration-300">
      <AlertCircle className="h-5 w-5 shrink-0 mt-0.5 text-amber-400" />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold leading-snug">
          Notifications Blocked
        </p>
        <p className="text-xs mt-0.5 leading-relaxed text-slate-400">
          You have blocked notifications for this site. Enable them in your
          browser settings to receive real-time updates.
        </p>
      </div>
      <button
        onClick={handleDismiss}
        aria-label="Dismiss banner"
        className="shrink-0 p-0.5 rounded text-slate-400 hover:text-slate-200 transition-colors">
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}
