const colorMap: Record<string, { bg: string; pulse: string; border: string }> =
  {
    backlog: {
      bg: "bg-slate-900/60",
      pulse: "bg-slate-800/80",
      border: "border-slate-800",
    },
    todo: {
      bg: "bg-slate-900/60",
      pulse: "bg-blue-500/25",
      border: "border-slate-800 hover:border-blue-900/50",
    },
    in_progress: {
      bg: "bg-slate-900/60",
      pulse: "bg-amber-500/25",
      border: "border-slate-800 hover:border-amber-900/50",
    },
    in_review: {
      bg: "bg-slate-900/60",
      pulse: "bg-purple-500/25",
      border: "border-slate-800 hover:border-purple-900/50",
    },
    completed: {
      bg: "bg-slate-900/60",
      pulse: "bg-emerald-500/25",
      border: "border-slate-800 hover:border-emerald-900/50",
    },
  };

export function TicketSkeleton({
  columnKey = "backlog",
}: {
  columnKey?: string;
}) {
  const colors = colorMap[columnKey] || colorMap.backlog;

  return (
    <div
      className={`bg-slate-900/60 border ${colors.border} p-4.5 rounded-xl shadow-lg flex flex-col gap-3.5`}>
      <div>
        <div className="flex items-center justify-between gap-2 mb-2">
          <div className={`w-20 h-3 ${colors.pulse} rounded animate-pulse`} />
          <div
            className={`w-12 h-3.5 ${colors.pulse} rounded-full animate-pulse`}
          />
        </div>
        <div
          className={`w-3/4 h-4 ${colors.pulse} rounded mb-1.5 animate-pulse`}
        />
        <div className={`w-1/2 h-4 ${colors.pulse} rounded animate-pulse`} />
      </div>

      <div className="flex items-center justify-between border-t border-slate-800/60 pt-3">
        <div className="flex items-center gap-1.5">
          <div
            className={`w-3 h-3 ${colors.pulse} rounded-full animate-pulse`}
          />
          <div className={`w-24 h-3 ${colors.pulse} rounded animate-pulse`} />
        </div>
        <div className={`w-8 h-3.5 ${colors.pulse} rounded animate-pulse`} />
      </div>
    </div>
  );
}
