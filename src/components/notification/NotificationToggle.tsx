"use client";

import { useState } from "react";
import { Bell, BellOff, Settings } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store";
import {
  setPermissionStatus,
  toggleNotifications,
  setFcmToken,
} from "@/store/notificationSlice";
import { STORAGE_KEYS } from "@/constants/storage";
import { getFirebaseMessaging } from "@/utils/firebase";
import { getToken } from "firebase/messaging";
import {
  useSyncDevice,
  useRemoveDevice,
} from "@/services/notification/notification.hooks";
import { EPlatformType } from "@/enums";

export function NotificationToggle() {
  const dispatch = useDispatch();
  const { permissionStatus, isToggledOn, fcmToken } = useSelector(
    (state: RootState) => state.notification,
  );
  const [isBusy, setIsBusy] = useState(false);
  const { mutate: syncDevice } = useSyncDevice();
  const { mutate: removeDevice } = useRemoveDevice();

  const isEnabled = permissionStatus === "granted" && isToggledOn;
  const isDenied = permissionStatus === "denied";
  const isUnsupported = permissionStatus === "unsupported";

  const handleEnable = async () => {
    setIsBusy(true);
    try {
      localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS_ENABLED, "true");

      if (typeof window !== "undefined" && "Notification" in window) {
        let permission = Notification.permission;
        if (permission === "default") {
          permission = await Notification.requestPermission();
        }

        dispatch(setPermissionStatus(permission));

        if (permission === "granted") {
          dispatch(toggleNotifications(true));

          const messaging = await getFirebaseMessaging();
          if (messaging) {
            const currentToken = await getToken(messaging, {
              vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY,
            });
            if (currentToken) {
              syncDevice(
                { fcmToken: currentToken, platform: EPlatformType.WEB },
                {
                  onSuccess: () => {
                    localStorage.setItem(STORAGE_KEYS.FCM_TOKEN, currentToken);
                    dispatch(setFcmToken(currentToken));
                  },
                },
              );
            }
          }
        } else {
          localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS_ENABLED, "false");
          dispatch(toggleNotifications(false));
        }
      } else {
        dispatch(setPermissionStatus("unsupported"));
      }
    } catch (err) {
      console.error("[NotificationToggle] Enable error:", err);
    } finally {
      setIsBusy(false);
    }
  };

  const handleDisable = () => {
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS_ENABLED, "false");
    dispatch(toggleNotifications(false));
    if (fcmToken) {
      removeDevice(fcmToken, {
        onSuccess: () => {
          localStorage.removeItem(STORAGE_KEYS.FCM_TOKEN);
          dispatch(setFcmToken(null));
        },
      });
    }
  };

  const handleToggle = () => {
    if (isEnabled) {
      handleDisable();
    } else {
      handleEnable();
    }
  };

  if (isUnsupported) {
    return (
      <div className="flex items-center gap-3 rounded-xl border border-slate-800 bg-slate-950/20 px-4 py-3">
        <BellOff className="h-5 w-5 text-slate-500 shrink-0" />
        <div>
          <p className="text-sm font-semibold text-slate-200">
            Push Notifications
          </p>
          <p className="text-xs text-slate-500 mt-0.5">
            Not supported in this browser
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 p-4 rounded-xl bg-slate-950/40 border border-slate-800/80">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <div
            className={`h-9 w-9 shrink-0 rounded-full flex items-center justify-center ${
              isEnabled
                ? "bg-indigo-500/10 text-indigo-400 border border-indigo-500/20"
                : "bg-slate-900 border border-slate-800 text-slate-500"
            }`}>
            {isEnabled ? <Bell size={16} /> : <BellOff size={16} />}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-slate-200">
              System Notifications
            </p>
            <p className="text-xs text-slate-400 mt-0.5">
              {isDenied
                ? "Permission denied by browser"
                : isEnabled
                  ? "Real-time notifications enabled"
                  : "Notifications turned off"}
            </p>
          </div>
        </div>

        <button
          onClick={handleToggle}
          disabled={isDenied || isBusy}
          className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500/20 disabled:cursor-not-allowed ${
            isEnabled ? "bg-indigo-600" : "bg-slate-800"
          }`}>
          <span
            className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
              isEnabled ? "translate-x-5" : "translate-x-0"
            }`}
          />
        </button>
      </div>

      {isDenied && (
        <div className="flex items-start gap-2.5 rounded-lg bg-amber-500/5 border border-amber-500/10 p-3">
          <Settings className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
          <p className="text-xs text-amber-300/80 leading-relaxed">
            Notifications are blocked. Please enable them in your browser
            settings and refresh the page to receive updates.
          </p>
        </div>
      )}
    </div>
  );
}
