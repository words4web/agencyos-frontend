"use client";

import React from "react";
import { CheckCheck, Mail, ExternalLink, Calendar } from "lucide-react";
import { formatTicketDate } from "@/utils/ticket";
import {
  NotificationDropdownProps,
  INotification,
} from "@/types/notification/notification.types";

export const NotificationDropdown: React.FC<NotificationDropdownProps> = ({
  unreadCount,
  markAllAsRead,
  accumulatedNotifications,
  handleNotificationClick,
  loadMore,
  hasMore,
}) => {
  return (
    <div className="absolute right-0 mt-2.5 w-80 sm:w-96 rounded-2xl bg-slate-950/95 border border-slate-800/90 shadow-2xl backdrop-blur-xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-3 duration-200">
      <div className="p-4 border-b border-slate-900 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h4 className="text-sm font-bold text-slate-100">Notifications</h4>
          {unreadCount > 0 && (
            <span className="px-1.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 text-[10px] font-semibold">
              {unreadCount} new
            </span>
          )}
        </div>
        {unreadCount > 0 && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              markAllAsRead();
            }}
            className="flex items-center gap-1 text-[11px] font-semibold text-slate-400 hover:text-indigo-400 transition-colors">
            <CheckCheck size={12} />
            Mark all read
          </button>
        )}
      </div>

      <div className="max-h-[80vh] overflow-y-auto divide-y divide-slate-900/60">
        {accumulatedNotifications?.length > 0 ? (
          <>
            {accumulatedNotifications?.map((n: INotification) => (
              <div
                key={n?._id}
                onClick={() => handleNotificationClick(n)}
                className={`p-4 flex gap-3 cursor-pointer transition-colors relative hover:bg-slate-900/40 ${
                  !n?.isRead ? "bg-indigo-950/5" : ""
                }`}>
                {/* Status Indicator Dot */}
                {!n?.isRead && (
                  <span className="absolute left-2 top-4 h-1.5 w-1.5 rounded-full bg-indigo-500" />
                )}

                <div className="flex-1 min-w-0">
                  <p
                    className={`text-xs font-semibold leading-relaxed ${!n?.isRead ? "text-slate-100" : "text-slate-400"}`}>
                    {n?.title}
                  </p>
                  <p className="text-xs text-slate-400 leading-relaxed mt-0.5">
                    {n?.body}
                  </p>

                  <div className="flex items-center gap-2.5 mt-2 text-[10px] text-slate-500 font-medium">
                    <span className="flex items-center gap-1">
                      <Calendar size={10} />
                      {formatTicketDate(n?.createdAt)}
                    </span>
                    {n?.metadata?.ticketId && (
                      <span className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 font-semibold hover:bg-indigo-500/20 transition-all cursor-pointer">
                        <ExternalLink size={10} />
                        Ticket
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {/* Pagination Load More Button */}
            {hasMore && (
              <button
                onClick={loadMore}
                className="w-full py-3 text-[11px] font-semibold text-indigo-400 hover:text-indigo-300 hover:bg-slate-900/20 text-center transition-colors border-t border-slate-900">
                Load More
              </button>
            )}
          </>
        ) : (
          <div className="py-8 px-4 flex flex-col items-center justify-center text-center gap-2">
            <div className="p-3 rounded-2xl bg-slate-900 text-slate-500">
              <Mail size={20} />
            </div>
            <p className="text-xs font-medium text-slate-400">All caught up!</p>
            <p className="text-[10px] text-slate-500 font-normal">
              No new notifications at this time.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
