import { Clock } from "lucide-react";
import { TicketTimelineEstimationProps } from "@/types/ticket/ticket.types";
import { getTicketTimelineItems } from "@/data/ticket";

export function TicketTimelineEstimation({
  ticket,
  formatDate,
  canEdit,
  localStartDate,
  setLocalStartDate,
  localDueDate,
  setLocalDueDate,
  localStoryPoints,
  setLocalStoryPoints,
  localEstimatedHours,
  setLocalEstimatedHours,
}: TicketTimelineEstimationProps) {
  const inputClass =
    "w-full px-2 py-1 mt-1 rounded bg-slate-900/80 border border-slate-800 hover:border-slate-700 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/30 focus:outline-none text-xs font-semibold text-slate-200 transition-all min-h-[28px]";

  const items = getTicketTimelineItems({
    ticket,
    formatDate,
    localStartDate,
    setLocalStartDate,
    localDueDate,
    setLocalDueDate,
    localStoryPoints,
    setLocalStoryPoints,
    localEstimatedHours,
    setLocalEstimatedHours,
    inputClass,
  });

  return (
    <div className="flex flex-col gap-3.5 bg-slate-950/40 p-4 border border-slate-800/80 rounded-xl">
      <h6 className="text-[11px] uppercase font-bold text-slate-400 tracking-wider flex items-center gap-1.5 border-b border-slate-900 pb-2 mb-1">
        <Clock size={12} className="text-indigo-400" />
        Schedule & Effort
      </h6>

      <div className="grid grid-cols-1 gap-4">
        {items?.map((item, idx) => (
          <div key={idx} className="flex items-center gap-2.5">
            <div className={`p-2 rounded-lg ${item?.iconBg} shrink-0`}>
              {item?.icon}
            </div>
            <div className="flex flex-col min-w-0 flex-1">
              <span className="text-[10px] uppercase font-bold text-slate-500 flex items-center gap-0.5">
                {item?.label}
                {"tooltip" in item && item?.tooltip}
              </span>
              {canEdit ? (
                item?.input
              ) : (
                <span className="text-xs font-semibold text-slate-200 truncate mt-0.5">
                  {item?.staticVal}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
