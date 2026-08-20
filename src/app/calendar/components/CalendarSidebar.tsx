import React, { useState } from "react";
import { Button } from "@/components/Button";
import { Calendar as CalendarIcon, X, Plus } from "lucide-react";
import { CalendarSidebarProps } from "@/types/event/event.types";
import { SidebarEventCard } from "./SidebarEventCard";
import { SidebarTicketCard } from "./SidebarTicketCard";

export const CalendarSidebar: React.FC<CalendarSidebarProps> = ({
  selectedDay,
  onClose,
  items,
  isAdmin,
  onAddEventClick,
  onViewEventClick,
  onEditEventClick,
  onDeleteEventClick,
}) => {
  const [activeTab, setActiveTab] = useState<"events" | "tickets">("events");

  if (!selectedDay) return null;

  const eventItems = items?.filter((item) => item?.type === "event") || [];
  const ticketItems = items?.filter((item) => item?.type === "ticket") || [];

  return (
    <>
      <div
        onClick={onClose}
        className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-40 transition-opacity"
      />

      <div className="fixed right-0 top-0 bottom-0 h-full w-[380px] bg-slate-900 border-l border-slate-800 z-50 flex flex-col shadow-2xl transition-transform duration-300 transform translate-x-0">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/20">
          <div>
            <h3 className="text-base font-bold text-slate-200">
              {new Date(selectedDay).toLocaleDateString("en-US", {
                weekday: "long",
                month: "short",
                day: "numeric",
              })}
            </h3>
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">
              Agenda Summary
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors">
            <X size={16} />
          </button>
        </div>

        <div className="flex border-b border-slate-800 bg-slate-950/10">
          <button
            onClick={() => setActiveTab("events")}
            className={`flex-1 py-3 text-xs font-bold uppercase tracking-wider border-b-2 text-center transition-all cursor-pointer ${
              activeTab === "events"
                ? "border-indigo-500 text-indigo-400 bg-indigo-500/5"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}>
            Events ({eventItems.length})
          </button>
          <button
            onClick={() => setActiveTab("tickets")}
            className={`flex-1 py-3 text-xs font-bold uppercase tracking-wider border-b-2 text-center transition-all cursor-pointer ${
              activeTab === "tickets"
                ? "border-indigo-500 text-indigo-400 bg-indigo-500/5"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}>
            Tickets ({ticketItems.length})
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-3 min-h-0">
          {activeTab === "events" ? (
            eventItems.length === 0 ? (
              <div className="my-auto py-12 text-center text-slate-500 flex flex-col items-center justify-center gap-2">
                <CalendarIcon size={28} className="text-slate-700 mb-1" />
                <h4 className="text-xs font-semibold text-slate-400">
                  No events scheduled
                </h4>
                <p className="text-[10px] text-slate-500 max-w-[200px]">
                  There are no events for this day.
                </p>
              </div>
            ) : (
              eventItems.map((item, idx) => (
                <SidebarEventCard
                  key={idx}
                  event={item.event}
                  isAdmin={isAdmin}
                  onViewEventClick={onViewEventClick}
                  onEditEventClick={onEditEventClick}
                  onDeleteEventClick={onDeleteEventClick}
                />
              ))
            )
          ) : ticketItems.length === 0 ? (
            <div className="my-auto py-12 text-center text-slate-500 flex flex-col items-center justify-center gap-2">
              <CalendarIcon size={28} className="text-slate-700 mb-1" />
              <h4 className="text-xs font-semibold text-slate-400">
                No tickets due
              </h4>
              <p className="text-[10px] text-slate-500 max-w-[200px]">
                There are no task deadlines today.
              </p>
            </div>
          ) : (
            ticketItems.map((item, idx) => (
              <SidebarTicketCard key={idx} ticket={item.ticket} />
            ))
          )}
        </div>

        {isAdmin && activeTab === "events" && (
          <div className="p-4 border-t border-slate-800 bg-slate-950/20">
            <Button
              onClick={onAddEventClick}
              className="w-full flex items-center justify-center gap-1.5 py-2 text-xs font-semibold">
              <Plus size={14} />
              Add Event
            </Button>
          </div>
        )}
      </div>
    </>
  );
};
