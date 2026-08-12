import { TicketPropertiesProps } from "@/types/ticket/ticket.types";
import { getPriorityBadge } from "@/utils/ticket";
import { Folder, User, Sliders } from "lucide-react";

export function TicketProperties({ ticket }: TicketPropertiesProps) {
  return (
    <div className="flex flex-col gap-3 bg-slate-950/40 p-4 border border-slate-800/80 rounded-xl">
      <h6 className="text-[11px] uppercase font-bold text-slate-400 tracking-wider flex items-center gap-1.5 border-b border-slate-900 pb-2 mb-1">
        <Sliders size={12} className="text-indigo-400" />
        Ticket Properties
      </h6>

      <div className="flex items-center gap-2.5">
        <div className="p-2 rounded-lg bg-indigo-500/10 border border-indigo-500/10">
          <Folder size={14} className="text-indigo-400" />
        </div>
        <div className="flex flex-col">
          <span className="text-[10px] uppercase font-bold text-slate-500">
            Project
          </span>
          <span className="text-sm font-semibold text-slate-200">
            {ticket?.project?.name}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2.5">
        <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/10">
          <User size={14} className="text-emerald-400" />
        </div>
        <div className="flex flex-col">
          <span className="text-[10px] uppercase font-bold text-slate-500">
            Assignee
          </span>
          <span className="text-sm font-semibold text-slate-200">
            {ticket?.assignee?.name}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2.5 mt-1 pt-1 border-t border-slate-900/60">
        <div className="flex flex-col w-full">
          <span className="text-[10px] uppercase font-bold text-slate-500 mb-1.5">
            Priority
          </span>
          <div>{getPriorityBadge(ticket?.priority)}</div>
        </div>
      </div>
    </div>
  );
}
