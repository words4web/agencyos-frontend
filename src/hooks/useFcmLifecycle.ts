"use client";

import { useEffect, useRef } from "react";
import { getToken } from "firebase/messaging";
import { getFirebaseMessaging } from "@/utils/firebase";
import { useDispatch, useSelector } from "react-redux";
import { setFcmToken, setPermissionStatus } from "@/store/notificationSlice";
import { RootState } from "@/store";
import {
  useSyncDevice,
  useRemoveDevice,
} from "@/services/notification/notification.hooks";
import { useAuth } from "@/hooks/useAuth";
import { STORAGE_KEYS } from "@/constants/storage";
import { EPlatformType } from "@/enums";

export const useFcmLifecycle = () => {
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useAuth();
  const isToggledOn = useSelector(
    (state: RootState) => state.notification.isToggledOn,
  );

  const { mutate: syncDevice } = useSyncDevice();
  const { mutate: removeDevice } = useRemoveDevice();

  const isSyncing = useRef(false);

  useEffect(() => {
    if (!isAuthenticated || !user) {
      const tokenToRemove =
        typeof window !== "undefined"
          ? localStorage.getItem(STORAGE_KEYS.FCM_TOKEN)
          : null;
      if (tokenToRemove) {
        if (typeof window !== "undefined") {
          localStorage.removeItem(STORAGE_KEYS.FCM_TOKEN);
          localStorage.removeItem(STORAGE_KEYS.FCM_LANG);
        }
        dispatch(setFcmToken(null));
        removeDevice(tokenToRemove);
      } else {
        dispatch(setFcmToken(null));
      }
      return;
    }

    const performSync = async () => {
      if (isSyncing.current) return;
      isSyncing.current = true;

      try {
        if (typeof window === "undefined") return;

        if (!("Notification" in window)) {
          dispatch(setPermissionStatus("unsupported"));
          return;
        }

        let currentPermission = Notification.permission;
        dispatch(setPermissionStatus(currentPermission));

        const isExplicitlyDisabled =
          localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS_ENABLED) === "false";
        if (
          currentPermission === "default" &&
          isToggledOn &&
          !isExplicitlyDisabled
        ) {
          currentPermission = await Notification.requestPermission();
          dispatch(setPermissionStatus(currentPermission));
        }

        if (currentPermission === "granted" && isToggledOn) {
          const messaging = await getFirebaseMessaging();
          if (!messaging) return;

          const registration = await navigator.serviceWorker.register(
            "/firebase-messaging-sw.js",
          );
          await navigator.serviceWorker.ready;

          const currentToken = await getToken(messaging, {
            vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY,
            serviceWorkerRegistration: registration,
          });

          if (!currentToken) return;

          const cachedToken = localStorage.getItem(STORAGE_KEYS.FCM_TOKEN);

          if (currentToken !== cachedToken) {
            syncDevice(
              { fcmToken: currentToken, platform: EPlatformType.WEB },
              {
                onSuccess: () => {
                  localStorage.setItem(STORAGE_KEYS.FCM_TOKEN, currentToken);
                  localStorage.setItem(
                    STORAGE_KEYS.NOTIFICATIONS_ENABLED,
                    "true",
                  );
                  dispatch(setFcmToken(currentToken));
                },
              },
            );
          } else {
            dispatch(setFcmToken(currentToken));
          }
        } else {
          const tokenToRemove = localStorage.getItem(STORAGE_KEYS.FCM_TOKEN);
          if (tokenToRemove) {
            localStorage.removeItem(STORAGE_KEYS.FCM_TOKEN);
            localStorage.removeItem(STORAGE_KEYS.FCM_LANG);
            dispatch(setFcmToken(null));
            removeDevice(tokenToRemove);
          } else {
            dispatch(setFcmToken(null));
          }
        }
      } catch (err) {
        console.error("[useFcmLifecycle] Sync error:", err);
      } finally {
        isSyncing.current = false;
      }
    };

    performSync();

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        performSync();
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);

    let permissionStatus: PermissionStatus | undefined;

    const handlePermissionChange = () => {
      if (typeof window !== "undefined" && "Notification" in window) {
        const currentPermission = Notification.permission;
        dispatch(setPermissionStatus(currentPermission));
        performSync();
      }
    };

    const setupPermissionListener = async () => {
      try {
        if (navigator?.permissions?.query) {
          permissionStatus = await navigator.permissions.query({
            name: "notifications" as PermissionName,
          });
          permissionStatus.addEventListener("change", handlePermissionChange);
        }
      } catch (_err) {}
    };

    setupPermissionListener();

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      permissionStatus?.removeEventListener("change", handlePermissionChange);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, user, isToggledOn]);
};
