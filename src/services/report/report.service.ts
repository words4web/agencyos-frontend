import { axiosInstance } from "@/utils/axios";
import { API_ROUTES } from "@/constants/api";
import {
  WeeklyPerformanceResponse,
  ReportWeeksResponse,
} from "@/types/report/report.types";

export const reportService = {
  getWeeklyPerformance: async (reportId: string) => {
    const res = await axiosInstance.get<WeeklyPerformanceResponse>(
      `${API_ROUTES.REPORTS.WEEKLY_PERFORMANCE}?id=${reportId}`,
    );
    return res.data;
  },

  getAvailableWeeks: async () => {
    const res = await axiosInstance.get<ReportWeeksResponse>(
      API_ROUTES.REPORTS.WEEKS,
    );
    return res.data;
  },
};
