import {
  TicketReportData,
  ComputedReportStats,
} from "@/types/report/report.types";

export function computeStats(tickets: TicketReportData[]): ComputedReportStats {
  const now = new Date();
  const byStatus = { completed: 0, in_review: 0, in_progress: 0, todo: 0 };
  const byPriority = { urgent: 0, high: 0, medium: 0, low: 0 };
  let totalMissed = 0;
  let totalRevisions = 0;
  let totalEstimated = 0;
  let totalActual = 0;
  let totalStoryPoints = 0;
  let overdueCount = 0;
  let checklistTotal = 0;
  let checklistDone = 0;

  for (const t of tickets) {
    const st = t?.status as keyof typeof byStatus;
    if (byStatus[st] !== undefined) byStatus[st]++;

    const pr = t?.priority as keyof typeof byPriority;
    if (byPriority[pr] !== undefined) byPriority[pr]++;

    totalMissed += t?.missedDeadlineCount ?? 0;
    totalRevisions += t?.revisionCount ?? 0;
    totalEstimated += t?.estimatedHours ?? 0;
    totalActual += t?.actualHours ?? 0;
    totalStoryPoints += t?.storyPoints ?? 0;

    if (t?.dueDate && new Date(t?.dueDate) < now && t?.status !== "completed") {
      overdueCount++;
    }

    for (const item of t?.checklist ?? []) {
      checklistTotal++;
      if (item?.isCompleted) checklistDone++;
    }
  }

  const completionRate =
    tickets?.length > 0
      ? Math.round((byStatus?.completed / tickets?.length) * 100)
      : 0;

  const checklistRate =
    checklistTotal > 0
      ? Math.round((checklistDone / checklistTotal) * 100)
      : null;

  return {
    byStatus,
    byPriority,
    totalMissed,
    totalRevisions,
    totalEstimated,
    totalActual,
    totalStoryPoints,
    overdueCount,
    completionRate,
    checklistRate,
    checklistTotal,
    checklistDone,
  };
}
