"use client";

import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useDispatch } from "react-redux";
import { onForegroundMessage } from "@/utils/firebase";
import { incrementUnreadCount } from "@/store/notificationSlice";
import { useAuth } from "@/hooks/useAuth";
import { ROUTES } from "@/constants/route";

export function NotificationListener() {
  const { isAuthenticated } = useAuth();
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) return;

    let unsubscribe: (() => void) | null = null;

    const subscribe = async () => {
      unsubscribe = await onForegroundMessage((payload) => {
        const notification = payload?.notification ?? {};
        const data = payload?.data ?? {};
        const title = notification?.title ?? data?.title ?? "New Alert";
        const body =
          notification?.body ?? data?.body ?? "You have a new update.";
        const ticketId = data?.ticketId;

        toast(title, {
          description: body,
          duration: 6000,
          action: ticketId
            ? {
                label: "View Ticket",
                onClick: () =>
                  router.push(`${ROUTES.KANBAN}?ticketId=${ticketId}`),
              }
            : undefined,
        });

        dispatch(incrementUnreadCount());

        queryClient.invalidateQueries({
          queryKey: ["tickets"],
        });

        queryClient.invalidateQueries({
          queryKey: ["projects"],
        });

        queryClient.invalidateQueries({
          queryKey: ["notifications"],
        });
      });
    };

    subscribe();

    return () => {
      unsubscribe?.();
    };
  }, [isAuthenticated, dispatch, queryClient, router]);

  return null;
}
