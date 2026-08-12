"use client";

import { useState, useRef, useEffect } from "react";
import { Bell } from "lucide-react";
import {
  useGetNotifications,
  useMarkNotificationRead,
  useMarkAllNotificationsRead,
} from "@/services/notification/notification.hooks";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/constants/route";
import { INotification } from "@/types/notification/notification.types";
import { NotificationDropdown } from "./NotificationDropdown";

export function NotificationCenter() {
  const [isOpen, setIsOpen] = useState(false);
  const [page, setPage] = useState(1);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const { data: result } = useGetNotifications(page, 10);
  const { mutate: markAsRead } = useMarkNotificationRead();
  const { mutate: markAllAsRead } = useMarkAllNotificationsRead();

  const [accumulatedNotifications, setAccumulatedNotifications] = useState<
    INotification[]
  >([]);

  useEffect(() => {
    if (result?.notifications) {
      const currentNotifications = result.notifications;
      setTimeout(() => {
        setAccumulatedNotifications((prev) => {
          if (page === 1) return currentNotifications;
          const existingIds = new Set(prev.map((n) => n._id));
          const newItems = currentNotifications.filter(
            (n: INotification) => !existingIds.has(n._id),
          );
          return [...prev, ...newItems];
        });
      }, 0);
    }
  }, [result, page]);

  const unreadCount = result?.total
    ? accumulatedNotifications.filter((n: INotification) => !n?.isRead)?.length
    : 0;

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleNotificationClick = (n: INotification) => {
    if (!n.isRead) {
      markAsRead(n._id);
    }
    setIsOpen(false);

    if (n.metadata?.ticketId) {
      router.push(`${ROUTES.KANBAN}?ticketId=${n?.metadata?.ticketId}`);
    }
  };

  const loadMore = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (result && page < result?.pages) {
      setPage((p) => p + 1);
    }
  };

  const hasMore = !!result && page < result?.pages;

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => {
          const nextOpen = !isOpen;
          setIsOpen(nextOpen);
          if (nextOpen) {
            setPage(1);
          }
        }}
        className="relative p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700/80 transition-all focus:outline-none"
        aria-label="Toggle notifications center">
        <Bell size={18} />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-indigo-600 text-[10px] font-bold text-white ring-2 ring-slate-950">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <NotificationDropdown
          unreadCount={unreadCount}
          markAllAsRead={markAllAsRead}
          accumulatedNotifications={accumulatedNotifications}
          handleNotificationClick={handleNotificationClick}
          loadMore={loadMore}
          hasMore={hasMore}
        />
      )}
    </div>
  );
}
