import { axiosInstance } from "@/utils/axios";
import { API_ROUTES } from "@/constants/api";
import { WeeklyPerformanceResponse } from "@/types/report/report.types";

export const reportService = {
  getWeeklyPerformance: async () => {
    const res = await axiosInstance.get<WeeklyPerformanceResponse>(
      API_ROUTES.REPORTS.WEEKLY_PERFORMANCE,
    );
    return res.data;
  },
};
