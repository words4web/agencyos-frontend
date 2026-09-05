import React from "react";
import { Trophy, ChevronDown, ChevronUp } from "lucide-react";
import { EmployeeCardProps } from "@/types/report/report.types";
import { computeStats } from "@/utils/report";

const DetailItem = ({
  label,
  value,
  valueClass = "text-slate-100",
}: {
  label: string;
  value: React.ReactNode;
  valueClass?: string;
}) => (
  <div className="flex justify-between text-xs">
    <span className="text-slate-400">{label}</span>
    <span className={`font-bold ${valueClass}`}>{value}</span>
  </div>
);

const DetailGroup = ({
  title,
  children,
  colSpan = "",
}: {
  title: string;
  children: React.ReactNode;
  colSpan?: string;
}) => (
  <div
    className={`${colSpan} bg-slate-950/60 p-3.5 rounded-xl border border-slate-800/50 space-y-2`}>
    <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
      {title}
    </div>
    {children}
  </div>
);

export const EmployeeCard = ({
  entry,
  isTop,
  isExpanded,
  onToggle,
}: EmployeeCardProps) => {
  const { user, tickets = [] } = entry;
  const liveStats = tickets?.length > 0 ? computeStats(tickets) : null;

  const ticketCount = entry?.ticketCount ?? tickets?.length;
  const storyPoints = entry?.storyPoints ?? liveStats?.totalStoryPoints ?? 0;
  const completionRate =
    entry?.completionRate ?? liveStats?.completionRate ?? 0;
  const safeCompletionRate = Number.isNaN(completionRate) ? 0 : completionRate;

  const byStatus = entry?.byStatus ??
    liveStats?.byStatus ?? {
      completed: 0,
      in_review: 0,
      in_progress: 0,
      todo: 0,
    };

  const byPriority = entry?.byPriority ??
    liveStats?.byPriority ?? {
      urgent: 0,
      high: 0,
      medium: 0,
      low: 0,
    };

  const estimatedHours =
    entry?.estimatedHours ?? liveStats?.totalEstimated ?? 0;
  const actualHours = entry?.actualHours ?? liveStats?.totalActual ?? 0;
  const missedDeadlines = entry?.missedDeadlines ?? liveStats?.totalMissed ?? 0;
  const overdueCount = entry?.overdueCount ?? liveStats?.overdueCount ?? 0;
  const revisionCount = entry?.revisionCount ?? liveStats?.totalRevisions ?? 0;

  const checklistDone =
    entry.checklistProgress?.done ?? liveStats?.checklistDone ?? 0;
  const checklistTotal =
    entry.checklistProgress?.total ?? liveStats?.checklistTotal ?? 0;
  const checklistRate =
    entry.checklistProgress?.rate ?? liveStats?.checklistRate ?? null;

  const fillGradient =
    safeCompletionRate >= 80
      ? "bg-gradient-to-r from-emerald-500 to-teal-400"
      : safeCompletionRate >= 50
        ? "bg-gradient-to-r from-amber-500 to-yellow-400"
        : "bg-gradient-to-r from-rose-500 to-red-400";

  const maxHours = Math.max(estimatedHours, actualHours, 1);
  const estPct = Math.round((estimatedHours / maxHours) * 100);
  const actPct = Math.round((actualHours / maxHours) * 100);

  const statusBadges = [
    {
      label: "Completed",
      count: byStatus.completed ?? 0,
      color: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    },
    {
      label: "In Review",
      count: byStatus.in_review ?? 0,
      color: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    },
    {
      label: "In Progress",
      count: byStatus.in_progress ?? 0,
      color: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    },
    {
      label: "Todo",
      count: byStatus.todo ?? 0,
      color: "bg-slate-800 text-slate-300 border-slate-700",
    },
  ];

  return (
    <div className="bg-slate-900/80 border border-slate-800/80 hover:border-slate-700/80 rounded-2xl p-6 transition-all duration-200">
      <div className="flex items-start justify-between gap-4 mb-3">
        <div>
          <h3 className="text-base font-bold text-slate-100">{user?.name}</h3>
          <p className="text-xs font-medium text-slate-400 mt-0.5">
            {user?.designation}
          </p>
        </div>
        {isTop && (
          <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center gap-1.5 shrink-0">
            <Trophy size={12} /> Top Performer
          </span>
        )}
      </div>

      <div className="text-xs font-semibold text-slate-300 mb-4">
        {ticketCount} Tickets · {storyPoints} Story Points ·{" "}
        {safeCompletionRate}% Completion
      </div>

      <div className="space-y-1.5 mb-5">
        <div className="flex items-center justify-between text-xs font-semibold">
          <span className="text-slate-400">Completion Rate</span>
          <span
            className={
              safeCompletionRate >= 80
                ? "text-emerald-400"
                : safeCompletionRate < 50
                  ? "text-rose-400"
                  : "text-amber-400"
            }>
            {safeCompletionRate}%
          </span>
        </div>
        <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${fillGradient}`}
            style={{ width: `${safeCompletionRate}%` }}
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        {statusBadges?.map((badge) => (
          <span
            key={badge?.label}
            className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${badge?.color}`}>
            {badge?.label}: {badge?.count}
          </span>
        ))}
      </div>

      <button
        onClick={onToggle}
        className="flex items-center gap-1.5 text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition-colors mt-2">
        <span>{isExpanded ? "Hide details" : "View details"}</span>
        {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
      </button>

      {isExpanded && (
        <div className="mt-5 pt-5 border-t border-slate-800/80 grid grid-cols-2 gap-4 animate-in fade-in duration-200">
          <DetailGroup title="Work">
            <DetailItem label="Tickets" value={ticketCount} />
            <DetailItem label="Story Points" value={storyPoints} />
          </DetailGroup>

          <DetailGroup title="Priority">
            <DetailItem label="Urgent" value={byPriority?.urgent ?? 0} />
            <DetailItem label="High" value={byPriority?.high ?? 0} />
            <DetailItem label="Medium" value={byPriority?.medium ?? 0} />
            <DetailItem label="Low" value={byPriority?.low ?? 0} />
          </DetailGroup>

          <DetailGroup title="Hours (Estimated vs Actual)" colSpan="col-span-2">
            <div className="space-y-2 mt-1">
              <div>
                <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                  <span>Estimated</span>
                  <span className="font-semibold text-slate-200">
                    {estimatedHours}h
                  </span>
                </div>
                <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-500 rounded-full"
                    style={{ width: `${estPct}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                  <span>Actual</span>
                  <span className="font-semibold text-slate-200">
                    {actualHours}h
                  </span>
                </div>
                <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-purple-500 rounded-full"
                    style={{ width: `${actPct}%` }}
                  />
                </div>
              </div>
            </div>
          </DetailGroup>

          <DetailGroup title="Deadlines & Quality" colSpan="col-span-2">
            <DetailItem
              label="Overdue Tickets"
              value={overdueCount}
              valueClass={overdueCount > 0 ? "text-rose-400" : "text-slate-100"}
            />
            <DetailItem
              label="Missed Deadlines"
              value={missedDeadlines}
              valueClass={
                missedDeadlines > 0 ? "text-rose-400" : "text-slate-100"
              }
            />
            <DetailItem label="Revisions Requested" value={revisionCount} />
            {checklistRate !== null && (
              <DetailItem
                label="Checklist Progress"
                value={`${checklistDone}/${checklistTotal} (${checklistRate}%)`}
              />
            )}
          </DetailGroup>
        </div>
      )}
    </div>
  );
};
