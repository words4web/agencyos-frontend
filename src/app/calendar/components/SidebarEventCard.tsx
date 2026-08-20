import React, { useState } from "react";
import {
  Clock,
  ExternalLink,
  Eye,
  Pencil,
  Trash2,
  Settings,
} from "lucide-react";
import { SidebarEventCardProps } from "@/types/event/event.types";
import { EEventType } from "@/enums";

export const SidebarEventCard: React.FC<SidebarEventCardProps> = ({
  event,
  isAdmin,
  onViewEventClick,
  onEditEventClick,
  onDeleteEventClick,
}) => {
  const [showMenu, setShowMenu] = useState(false);
  const isHoliday = event?.type === EEventType.HOLIDAY;

  return (
    <div
      className={`py-3 px-4 pl-2 rounded-xl border border-slate-800/80 bg-slate-950/30 border-l-2 flex flex-col gap-2 transition-all relative ${
        isHoliday ? "border-l-rose-500" : "border-l-indigo-500"
      }`}>
      <div className="flex items-center justify-between">
        <span
          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
            isHoliday
              ? "bg-rose-500/10 text-rose-400"
              : "bg-indigo-500/10 text-indigo-400"
          }`}>
          {isHoliday ? "Holiday" : "Meeting"}
        </span>

        <div className="flex items-center gap-2 relative">
          {!isHoliday && event?.startDate && (
            <span className="text-[11px] text-slate-400 font-medium flex items-center gap-1">
              <Clock size={10} />
              {new Date(event?.startDate).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          )}
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-805 transition-colors cursor-pointer"
            title="Options">
            <Settings size={15} />
          </button>

          {showMenu && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setShowMenu(false)}
              />
              <div className="absolute right-0 top-6 bg-slate-900 border border-slate-800 rounded-lg shadow-xl py-1 z-20 min-w-[90px]">
                <button
                  onClick={() => {
                    onViewEventClick(event);
                    setShowMenu(false);
                  }}
                  className="w-full px-3 py-1.5 text-xs font-semibold text-slate-350 hover:text-white hover:bg-slate-800 text-left flex items-center gap-1.5 cursor-pointer">
                  <Eye size={10} />
                  View
                </button>
                {isAdmin && (
                  <>
                    <button
                      onClick={() => {
                        onEditEventClick(event);
                        setShowMenu(false);
                      }}
                      className="w-full px-3 py-1.5 text-xs font-semibold text-slate-350 hover:text-white hover:bg-slate-800 text-left flex items-center gap-1.5 cursor-pointer">
                      <Pencil size={10} />
                      Edit
                    </button>
                    <button
                      onClick={() => {
                        onDeleteEventClick(event);
                        setShowMenu(false);
                      }}
                      className="w-full px-3 py-1.5 text-xs font-semibold text-red-400 hover:text-red-300 hover:bg-red-950/20 text-left flex items-center gap-1.5 cursor-pointer">
                      <Trash2 size={10} />
                      Delete
                    </button>
                  </>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      <h4 className="text-sm font-semibold text-slate-200 mt-0.5 pl-2 wrap-break-word">
        {event?.title}
      </h4>

      {!isHoliday && event?.meetingLink && (
        <a
          href={event?.meetingLink}
          target="_blank"
          rel="noreferrer"
          className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1 mt-0.5 font-semibold pl-2">
          <ExternalLink size={11} />
          Event Link
        </a>
      )}

      {!isHoliday && event?.participants && event?.participants.length > 0 && (
        <div className="mt-1 flex flex-col gap-1 border-t border-slate-800/40 pt-1.5">
          <div className="flex flex-wrap gap-1">
            {event?.participants?.map((participant, id) => (
              <span
                key={id}
                className="px-1 py-0.5 rounded bg-slate-850 text-[10px] text-slate-400 font-medium border border-slate-800">
                {participant?.name}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
