import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { reportService } from "@/services/report/report.service";
import { ReportSummaryStats } from "@/types/report/report.types";
import { formatDate } from "@/utils/date";

export function useWeeklyReport() {
  const [expandedCards, setExpandedCards] = useState<Record<string, boolean>>(
    {},
  );

  const { data, isLoading, error } = useQuery({
    queryKey: ["weekly-performance-report"],
    queryFn: () => reportService.getWeeklyPerformance(),
    staleTime: Infinity,
    gcTime: Infinity,
  });

  const employees = useMemo(
    () => data?.data?.employees ?? [],
    [data?.data?.employees],
  );

  const weekRange = useMemo(
    () => ({
      start: formatDate(data?.data?.weekStart),
      end: formatDate(data?.data?.weekEnd),
    }),
    [data?.data?.weekStart, data?.data?.weekEnd],
  );

  const toggleExpand = (userId: string) => {
    setExpandedCards((prev) => ({ ...prev, [userId]: !prev[userId] }));
  };

  const stats: ReportSummaryStats = useMemo(() => {
    const summary = data?.data?.summary;
    if (summary) {
      return {
        totalTickets: summary.totalTickets ?? 0,
        totalCompleted: summary.totalCompleted ?? 0,
        totalPoints: summary.totalStoryPoints ?? 0,
        totalMissed: summary.totalMissedDeadlines ?? 0,
        overallRate: summary.completionRate ?? 0,
        topPerformerName: summary.topPerformer?.name ?? "—",
      };
    }

    const ticketsCount = employees.reduce(
      (s, e) => s + (e?.ticketCount ?? 0),
      0,
    );
    const completedCount = employees.reduce(
      (s, e) =>
        s +
        (e?.byStatus?.completed ??
          e?.tickets?.filter((t) => t?.status === "completed")?.length ??
          0),
      0,
    );
    const pointsCount = employees.reduce(
      (s, e) =>
        s +
        (e?.storyPoints ??
          e?.tickets?.reduce((ts, t) => ts + (t?.storyPoints ?? 0), 0) ??
          0),
      0,
    );
    const missedCount = employees.reduce(
      (s, e) =>
        s +
        (e?.missedDeadlines ??
          e?.tickets?.reduce(
            (ts, t) => ts + (t?.missedDeadlineCount ?? 0),
            0,
          ) ??
          0),
      0,
    );
    const rate =
      ticketsCount > 0 ? Math.round((completedCount / ticketsCount) * 100) : 0;

    const sorted = [...employees].sort((a, b) => {
      const aDone =
        a?.byStatus?.completed ??
        a?.tickets?.filter((t) => t?.status === "completed")?.length ??
        0;
      const bDone =
        b?.byStatus?.completed ??
        b?.tickets?.filter((t) => t?.status === "completed")?.length ??
        0;
      return bDone - aDone;
    });
    const top =
      sorted?.length > 0 && sorted[0]?.user?.name ? sorted[0]?.user?.name : "—";

    return {
      totalTickets: ticketsCount,
      totalCompleted: completedCount,
      totalPoints: pointsCount,
      totalMissed: missedCount,
      overallRate: rate,
      topPerformerName: top,
    };
  }, [data?.data?.summary, employees]);

  return {
    loading: isLoading,
    employees,
    weekRange,
    expandedCards,
    toggleExpand,
    stats,
    error,
  };
}
