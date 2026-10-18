import { LucideIcon } from "lucide-react";

export interface EmployeeProjectBreakdown {
  name: string;
  hours: number;
  ticketCount: number;
}

export interface EmployeePerformanceData {
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
    designation: string;
    slackId?: string;
  };
  completedTickets: number;
  actualHours: number;
  avgHoursPerTicket: number;
  revisionCount: number;
  firstPassRate: number;
  missedDeadlines: number;
  waivedDeadlines: number;
  projects: EmployeeProjectBreakdown[];
}

export interface WeeklyPerformanceSummary {
  totalTickets: number;
  totalHours: number;
  teamAvgHours: number;
  totalRevisions: number;
  firstPassRate: number;
  totalMissedDeadlines: number;
  activeProjectsCount: number;
}

export interface WeeklyPerformanceResponse {
  success: boolean;
  message: string;
  data: {
    _id?: string;
    weekStart: string;
    weekEnd: string;
    summary: WeeklyPerformanceSummary;
    employees: EmployeePerformanceData[];
  };
}

export interface ReportWeekItem {
  _id: string;
  weekStart: string;
  weekEnd: string;
  summary: {
    totalTickets: number;
    totalHours: number;
  };
}

export interface ReportWeeksResponse {
  success: boolean;
  message: string;
  data: ReportWeekItem[];
}

export interface KpiCardConfig {
  label: string;
  value: string | number;
  subtext?: string;
  icon: LucideIcon;
  iconColor: string;
  iconBg: string;
  valueColor?: string;
  isSpecial?: boolean;
}

export interface KpiSummaryBannerProps {
  summary?: WeeklyPerformanceSummary;
  employeeCount: number;
}

export interface EmployeePerformanceCardProps {
  employee: EmployeePerformanceData;
}

export interface TeamComparisonTableProps {
  employees: EmployeePerformanceData[];
}
