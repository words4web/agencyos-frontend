import { TicketLoggingProgressProps } from "@/types/ticket/ticket.types";
import { ETicketStatus } from "@/enums";

export function TicketLoggingProgress({
  ticket,
  localStatus,
  setLocalStatus,
  localActualHours,
  setLocalActualHours,
  canEdit,
  isAdmin = false,
}: TicketLoggingProgressProps) {
  const isLockedInReview = Boolean(
    ticket?.requiresReview && ticket?.status === ETicketStatus.IN_REVIEW,
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-950/20 p-4 border border-slate-800/80 rounded-xl">
      <div className="flex flex-col gap-1">
        <span className="text-[10px] uppercase font-bold text-slate-500 block mb-1">
          Status
        </span>
        {canEdit && !isLockedInReview ? (
          <select
            value={localStatus}
            onChange={(e) => setLocalStatus(e.target.value as ETicketStatus)}
            className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-205 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 min-h-[28px]">
            <option value={ETicketStatus.BACKLOG}>Backlog</option>
            <option value={ETicketStatus.TODO}>Todo</option>
            <option value={ETicketStatus.IN_PROGRESS}>In Progress</option>
            <option value={ETicketStatus.IN_REVIEW}>In Review</option>
            {(!ticket?.requiresReview || isAdmin) && (
              <option value={ETicketStatus.COMPLETED}>Completed</option>
            )}
          </select>
        ) : (
          <span className="text-xs font-semibold text-slate-300 capitalize">
            {localStatus?.replace(/_/g, " ")}
          </span>
        )}
      </div>

      <div className="flex flex-col gap-1">
        <span className="text-[10px] uppercase font-bold text-slate-500 block mb-1">
          Actual Time Spent
        </span>
        {canEdit ? (
          <div className="relative w-full">
            <input
              type="number"
              step="0.5"
              min="0"
              value={localActualHours}
              onChange={(e) =>
                setLocalActualHours(Math.max(0, Number(e.target.value)))
              }
              className="w-full pl-3 pr-10 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-205 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 min-h-[28px] [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-slate-500 font-bold uppercase tracking-wider pointer-events-none">
              hrs
            </span>
          </div>
        ) : (
          <span className="text-xs font-semibold text-slate-300">
            {localActualHours > 0 ? `${localActualHours} hrs` : "0 hrs"}
          </span>
        )}
      </div>
    </div>
  );
}
