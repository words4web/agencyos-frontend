import { User, MessageSquare } from "lucide-react";
import { KanbanBoardProps } from "@/types/ticket/ticket.types";
import { KANBAN_COLUMNS } from "@/constants/kanban";
import { getPriorityBadge } from "@/utils/ticket";

export function KanbanBoard({ tickets, onTicketClick }: KanbanBoardProps) {
  return (
    <section className="flex-1 overflow-x-auto p-8 flex gap-6 items-stretch min-h-0">
      {KANBAN_COLUMNS?.map((col) => {
        const colTickets = tickets?.filter((t) => t?.status === col?.key);
        return (
          <div
            key={col.key}
            className="w-72 shrink-0 flex flex-col h-full min-h-0">
            <div className="flex items-center justify-between mb-3 px-1">
              <div className="flex items-center gap-2">
                <span
                  className="w-2.5 h-2.5 rounded-full"
                  style={{
                    backgroundColor:
                      col?.key === "backlog"
                        ? "#64748b"
                        : col?.key === "todo"
                          ? "#3b82f6"
                          : col?.key === "in_progress"
                            ? "#f59e0b"
                            : col?.key === "in_review"
                              ? "#a855f7"
                              : "#10b981",
                  }}
                />
                <span className="font-bold text-slate-200 text-sm">
                  {col?.label}
                </span>
                <span className="text-xs text-slate-500 font-semibold px-2 py-0.5 rounded-full bg-slate-900/60 border border-slate-800">
                  {colTickets?.length}
                </span>
              </div>
            </div>

            <div
              className={`flex-1 overflow-y-auto flex flex-col gap-3 rounded-xl border-t-2 ${col?.color} border border-slate-900 p-3 min-h-0`}>
              {colTickets?.map((ticket) => (
                <div
                  key={ticket?._id}
                  onClick={() => onTicketClick(ticket)}
                  className="bg-slate-900/60 border border-slate-800 hover:border-slate-700 p-4.5 rounded-xl shadow-lg cursor-pointer transition-all hover:scale-[1.01] hover:shadow-indigo-950/10 flex flex-col gap-3.5">
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wide truncate max-w-[120px]">
                        {ticket?.project?.name || "Project"}
                      </span>
                      {getPriorityBadge(ticket?.priority)}
                    </div>
                    <h4 className="text-sm font-bold text-slate-100 line-clamp-2 leading-snug">
                      {ticket?.title}
                    </h4>
                  </div>

                  <div className="flex items-center justify-between border-t border-slate-800/60 pt-3">
                    <div className="flex items-center gap-1.5 text-xs text-slate-400">
                      <User size={12} className="text-slate-500" />
                      <span className="truncate max-w-[110px]">
                        {ticket?.assignee?.name}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-slate-500 text-xs">
                      <MessageSquare size={12} />
                      <span>{ticket?.comments?.length || 0}</span>
                    </div>
                  </div>
                </div>
              ))}
              {colTickets?.length === 0 && (
                <div className="text-center py-8 text-xs text-slate-600 border border-dashed border-slate-900 rounded-lg">
                  No tickets
                </div>
              )}
            </div>
          </div>
        );
      })}
    </section>
  );
}
