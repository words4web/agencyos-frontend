import { TicketLoggingProgressProps } from "@/types/ticket/ticket.types";
import { ETicketStatus } from "@/enums";
import { Tag } from "lucide-react";

export function TicketLoggingProgress({
  ticket,
  localStatus,
  setLocalStatus,
  localActualHours,
  setLocalActualHours,
  canEdit,
}: TicketLoggingProgressProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-950/20 p-4 border border-slate-800/80 rounded-xl">
      <div className="flex flex-col gap-1">
        <span className="text-[10px] uppercase font-bold text-slate-500 block mb-1">
          Status
        </span>
        {canEdit ? (
          <select
            value={localStatus}
            onChange={(e) => setLocalStatus(e.target.value as ETicketStatus)}
            className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-sm text-slate-200 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500">
            <option value={ETicketStatus.BACKLOG}>Backlog</option>
            <option value={ETicketStatus.TODO}>Todo</option>
            <option value={ETicketStatus.IN_PROGRESS}>In Progress</option>
            <option value={ETicketStatus.IN_REVIEW}>In Review</option>
            <option value={ETicketStatus.COMPLETED}>Completed</option>
          </select>
        ) : (
          <span className="text-sm font-semibold text-slate-300 capitalize">
            {localStatus?.replace(/_/g, " ")}
          </span>
        )}
      </div>

      <div className="flex flex-col gap-1">
        <span className="text-[10px] uppercase font-bold text-slate-500 block mb-1">
          Actual Time Spent
        </span>
        {canEdit ? (
          <div className="flex items-center gap-1.5">
            <input
              type="number"
              step="0.5"
              min="0"
              value={localActualHours}
              onChange={(e) =>
                setLocalActualHours(Math.max(0, Number(e.target.value)))
              }
              className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-sm text-slate-200 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            />
            <span className="text-sm text-slate-400 font-semibold uppercase tracking-wider">
              hrs
            </span>
          </div>
        ) : (
          <span className="text-sm font-semibold text-slate-300">
            {localActualHours > 0 ? `${localActualHours} hrs` : "Not logged"}
          </span>
        )}
      </div>

      <div className="col-span-1 md:col-span-2 border-t border-slate-900/60 pt-3 flex flex-col gap-1.5">
        <span className="text-[10px] uppercase font-bold text-slate-500 flex items-center gap-1">
          <Tag size={10} className="text-indigo-400" />
          Tags
        </span>
        <div className="flex flex-wrap gap-1">
          {ticket?.tags && ticket?.tags?.length > 0 ? (
            ticket?.tags?.map((tag, i) => (
              <span
                key={`${tag}-${i}`}
                className="text-[10px] font-bold bg-indigo-950/40 text-indigo-400 border border-indigo-900/60 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                {tag}
              </span>
            ))
          ) : (
            <span className="text-sm text-slate-500 italic">
              No tags associated with this ticket
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
