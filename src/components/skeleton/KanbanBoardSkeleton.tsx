import { TicketSkeleton } from "./TicketSkeleton";
import { KANBAN_COLUMNS } from "@/constants/kanban";

export function KanbanBoardSkeleton() {
  return (
    <section className="flex-1 overflow-x-auto p-8 flex gap-6 items-stretch min-h-0">
      {KANBAN_COLUMNS?.map((col) => (
        <div
          key={col.key}
          className="w-72 shrink-0 flex flex-col h-full min-h-0">
          <div className="flex items-center justify-between mb-3 px-1">
            <div className="flex items-center gap-2">
              <span
                className="w-2.5 h-2.5 rounded-full animate-pulse"
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
              <span className="w-6 h-4 bg-slate-900 border border-slate-800 rounded-full animate-pulse" />
            </div>
          </div>

          <div
            className={`flex-1 overflow-y-auto flex flex-col gap-3 rounded-xl border-t-2 ${col?.color} border border-slate-900 p-3 min-h-0`}>
            <TicketSkeleton columnKey={col.key} />
            <TicketSkeleton columnKey={col.key} />
            <TicketSkeleton columnKey={col.key} />
          </div>
        </div>
      ))}
    </section>
  );
}
