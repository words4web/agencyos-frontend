import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { reportService } from "@/services/report/report.service";
import { formatDate } from "@/utils/date";

export function useWeeklyReport() {
  const [selectedWeekId, setSelectedWeekId] = useState<string>("");

  const { data: weeksData, isLoading: weeksLoading } = useQuery({
    queryKey: ["available-report-weeks"],
    queryFn: () => reportService.getAvailableWeeks(),
    staleTime: 5 * 60 * 1000,
  });

  const availableWeeks = weeksData?.data ?? [];
  const activeWeekId =
    selectedWeekId ||
    (availableWeeks?.length > 0 ? availableWeeks[0]?._id : "");

  const {
    data: reportData,
    isLoading: reportLoading,
    isFetching: reportFetching,
  } = useQuery({
    queryKey: ["weekly-performance-report", activeWeekId],
    queryFn: () => reportService.getWeeklyPerformance(activeWeekId),
    enabled: Boolean(activeWeekId),
    staleTime: 5 * 60 * 1000,
  });

  const report = reportData?.data;
  const employees = report?.employees ?? [];
  const summary = report?.summary;

  const weekRange = {
    start: report?.weekStart ? formatDate(report?.weekStart) : "—",
    end: report?.weekEnd ? formatDate(report?.weekEnd) : "—",
  };

  return {
    loading: weeksLoading || (availableWeeks?.length > 0 && reportLoading),
    fetching: reportFetching,
    employees,
    summary,
    weekRange,
    availableWeeks,
    selectedWeekId: activeWeekId,
    setSelectedWeekId,
    hasReports: availableWeeks?.length > 0,
  };
}
