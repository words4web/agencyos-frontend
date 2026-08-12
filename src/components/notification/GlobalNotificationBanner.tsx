"use client";

import { useEffect, useState } from "react";
import { AlertCircle, X, ArrowRight } from "lucide-react";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ROUTES } from "@/constants/route";

export function GlobalNotificationBanner() {
  const pathname = usePathname();
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const { isToggledOn, permissionStatus } = useSelector(
    (state: RootState) => state.notification,
  );

  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!isAuthenticated || pathname === ROUTES.PROFILE) {
      setTimeout(() => {
        setVisible(false);
      }, 0);
      return;
    }

    const dismissed = sessionStorage.getItem("notif_global_banner_dismissed");
    const notificationsOff = !isToggledOn || permissionStatus !== "granted";

    if (notificationsOff && !dismissed) {
      setTimeout(() => {
        setVisible(true);
      }, 0);
    } else {
      setTimeout(() => {
        setVisible(false);
      }, 0);
    }
  }, [isAuthenticated, isToggledOn, permissionStatus, pathname]);

  const handleDismiss = () => {
    sessionStorage.setItem("notif_global_banner_dismissed", "true");
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      role="alert"
      className="w-full bg-indigo-900/90 border-b border-indigo-800/60 px-4 py-2 flex items-center justify-between gap-3 text-indigo-100 z-50 animate-in slide-in-from-top-1 duration-200">
      <div className="flex items-center gap-2 flex-1 min-w-0">
        <AlertCircle className="h-4.5 w-4.5 shrink-0 text-indigo-400" />
        <p className="text-xs font-medium truncate">
          Alerts are turned off. Enable push notifications to stay updated on
          your tasks.
        </p>
        <Link
          href={ROUTES.PROFILE}
          className="text-xs font-bold text-white hover:underline flex items-center gap-0.5 shrink-0 ml-1">
          Go to Profile <ArrowRight size={12} />
        </Link>
      </div>
      <button
        onClick={handleDismiss}
        aria-label="Dismiss banner"
        className="shrink-0 p-1 rounded-lg text-indigo-300 hover:text-white hover:bg-indigo-800/30 transition-colors">
        <X className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}
