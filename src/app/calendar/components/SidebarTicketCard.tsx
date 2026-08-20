import React from "react";
import Link from "next/link";
import { Clock, ChevronRight } from "lucide-react";
import { SidebarTicketCardProps } from "@/types/event/event.types";

export const SidebarTicketCard: React.FC<SidebarTicketCardProps> = ({
  ticket,
}) => {
  return (
    <Link
      href={`/kanban?ticketId=${ticket?._id}`}
      className="py-3 px-4 rounded-xl border border-slate-800/80 bg-slate-950/30 border-l-2 border-l-amber-500 hover:border-slate-700/80 transition-all flex flex-col gap-1.5">
      <div className="flex items-center justify-between">
        <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-amber-500/10 text-amber-400">
          Ticket Deadline
        </span>
        <span className="text-[10px] text-slate-400 font-medium flex items-center gap-1">
          <Clock size={10} />
          Due Today
        </span>
      </div>
      <h4 className="text-xs font-semibold text-slate-200 mt-0.5">
        {ticket?.title}
      </h4>
      <span className="text-[10px] text-indigo-400 font-semibold flex items-center gap-1 mt-0.5">
        Go to Board
        <ChevronRight size={10} />
      </span>
    </Link>
  );
};
