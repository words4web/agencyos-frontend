"use client";

import { useState } from "react";
import { STORAGE_KEYS } from "@/constants/storage";
import { FloatingBanner } from "./FloatingBanner";

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

  return (
    <FloatingBanner
      isOpen={visible}
      title="Notifications Blocked"
      description="You have blocked notifications for this site. Enable them in your browser settings to receive real-time updates."
      onDismiss={handleDismiss}
      variant="warning"
    />
  );
}
