import React from "react";
import { Modal } from "@/components/Modal";
import { Clock, ExternalLink } from "lucide-react";
import { ViewEventModalProps } from "@/types/event/event.types";
import { EEventType } from "@/enums";

export const ViewEventModal: React.FC<ViewEventModalProps> = ({
  isOpen,
  onClose,
  selectedEvent,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Event Details">
      {selectedEvent && (
        <div className="flex flex-col gap-4 text-sm text-slate-350">
          <div className="flex flex-col gap-1">
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">
              Event Title
            </span>
            <span className="text-base font-bold text-slate-100 wrap-break-word">
              {selectedEvent?.title}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                Type
              </span>
              <span className="capitalize text-slate-200">
                {selectedEvent?.type}
              </span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                Time
              </span>
              <span className="text-slate-200 flex items-center gap-1">
                <Clock size={12} />
                {selectedEvent?.type === EEventType.HOLIDAY
                  ? "All Day"
                  : new Date(selectedEvent?.startDate).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">
              Date
            </span>
            <span className="text-slate-200">
              {new Date(selectedEvent?.startDate).toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
          </div>

          {selectedEvent?.description && (
            <div className="flex flex-col gap-1">
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                Description
              </span>
              <p className="text-slate-200 bg-slate-950/30 border border-slate-800 rounded-lg p-3 leading-relaxed whitespace-pre-wrap wrap-break-word">
                {selectedEvent?.description}
              </p>
            </div>
          )}

          {selectedEvent?.meetingLink && (
            <div className="flex flex-col gap-1">
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                Event Link
              </span>
              <a
                href={selectedEvent?.meetingLink}
                target="_blank"
                rel="noreferrer"
                className="text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1 mt-0.5">
                <ExternalLink size={14} />
                {selectedEvent?.meetingLink}
              </a>
            </div>
          )}

          {selectedEvent?.participants &&
            selectedEvent?.participants?.length > 0 && (
              <div className="flex flex-col gap-1.5">
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                  Participants
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {selectedEvent?.participants?.map((participant, pIdx) => (
                    <span
                      key={pIdx}
                      className="px-2 py-1 rounded bg-slate-850 text-xs text-slate-300 border border-slate-800">
                      {participant?.name} ({participant?.role})
                    </span>
                  ))}
                </div>
              </div>
            )}
        </div>
      )}
    </Modal>
  );
};
