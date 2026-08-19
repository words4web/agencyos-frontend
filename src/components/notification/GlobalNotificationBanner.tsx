"use client";

import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { useRouter, usePathname } from "next/navigation";
import { ROUTES } from "@/constants/route";
import { FloatingBanner } from "./FloatingBanner";

export function GlobalNotificationBanner() {
  const router = useRouter();
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

  return (
    <FloatingBanner
      isOpen={visible}
      title="Alerts are turned off"
      description="Enable push notifications to stay updated on your tasks and project updates."
      onDismiss={handleDismiss}
      action={{
        label: "Go to Profile",
        onClick: () => router.push(ROUTES.PROFILE),
      }}
      variant="info"
    />
  );
}
