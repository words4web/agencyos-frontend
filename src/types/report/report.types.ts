export interface TicketReportData {
  _id: string;
  title: string;
  status: string;
  priority: string;
  dueDate?: string;
  storyPoints?: number;
  estimatedHours?: number;
  actualHours?: number;
  missedDeadlineCount?: number;
  waivedDeadlineCount?: number;
  revisionCount?: number;
  requiresReview?: boolean;
  checklist?: { isCompleted: boolean }[];
  project?: { name: string };
  workType?: { name: string };
}

export interface UserReportEntry {
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
    designation: string;
    slackId: string;
    isActive?: boolean;
  };
  ticketCount: number;
  storyPoints?: number;
  completionRate?: number;
  byStatus?: {
    completed: number;
    in_review: number;
    in_progress: number;
    todo: number;
  };
  byPriority?: {
    urgent: number;
    high: number;
    medium: number;
    low: number;
  };
  estimatedHours?: number;
  actualHours?: number;
  missedDeadlines?: number;
  overdueCount?: number;
  revisionCount?: number;
  checklistProgress?: {
    done: number;
    total: number;
    rate: number | null;
  };
  tickets?: TicketReportData[];
  _id?: string;
}

export interface WeeklyReportSummary {
  totalTickets: number;
  totalCompleted: number;
  completionRate: number;
  totalStoryPoints: number;
  totalMissedDeadlines: number;
  topPerformer: {
    id: string;
    name: string;
    completedCount: number;
  } | null;
}

export interface WeeklyPerformanceResponse {
  success: boolean;
  message: string;
  data: {
    weekStart: string;
    weekEnd: string;
    summary?: WeeklyReportSummary;
    employees: UserReportEntry[];
  };
}

export interface ComputedReportStats {
  byStatus: {
    completed: number;
    in_review: number;
    in_progress: number;
    todo: number;
  };
  byPriority: {
    urgent: number;
    high: number;
    medium: number;
    low: number;
  };
  totalMissed: number;
  totalRevisions: number;
  totalEstimated: number;
  totalActual: number;
  totalStoryPoints: number;
  overdueCount: number;
  completionRate: number;
  checklistRate: number | null;
  checklistTotal: number;
  checklistDone: number;
}

export interface ReportSummaryStats {
  totalTickets: number;
  totalCompleted: number;
  totalPoints: number;
  totalMissed: number;
  overallRate: number;
  topPerformerName: string;
}

export interface KpiCardConfig {
  label: string;
  value: string | number;
  icon: import("lucide-react").LucideIcon;
  iconColor: string;
  iconBg: string;
  valueColor?: string;
  isSpecial?: boolean;
}

export interface EmployeeCardProps {
  entry: UserReportEntry;
  isTop: boolean;
  isExpanded: boolean;
  onToggle: () => void;
}

export interface EmployeeBreakdownGridProps {
  employees: UserReportEntry[];
  topPerformerName?: string;
  expandedCards: Record<string, boolean>;
  onToggleExpand: (userId: string) => void;
}
