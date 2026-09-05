import {
  Ticket,
  CheckCircle2,
  PieChart,
  Award,
  AlertTriangle,
  Trophy,
} from "lucide-react";
import { ReportSummaryStats, KpiCardConfig } from "@/types/report/report.types";

export const KpiCardsGrid = ({ stats }: { stats: ReportSummaryStats }) => {
  const {
    totalTickets = 0,
    totalCompleted = 0,
    overallRate = 0,
    totalPoints = 0,
    totalMissed = 0,
    topPerformerName = "—",
  } = stats ?? {};

  const safeOverallRate = Number.isNaN(overallRate) ? 0 : overallRate;

  const kpiItems: KpiCardConfig[] = [
    {
      label: "Total Tickets",
      value: totalTickets ?? 0,
      icon: Ticket,
      iconColor: "text-blue-400",
      iconBg: "bg-blue-500/10 border-blue-500/20",
    },
    {
      label: "Completed",
      value: totalCompleted ?? 0,
      icon: CheckCircle2,
      iconColor: "text-emerald-400",
      iconBg: "bg-emerald-500/10 border-emerald-500/20",
    },
    {
      label: "Completion Rate",
      value: `${safeOverallRate}%`,
      icon: PieChart,
      iconColor: "text-purple-400",
      iconBg: "bg-purple-500/10 border-purple-500/20",
      valueColor:
        safeOverallRate >= 70
          ? "text-emerald-400"
          : safeOverallRate < 50
            ? "text-rose-400"
            : "text-slate-100",
    },
    {
      label: "Story Points",
      value: totalPoints ?? 0,
      icon: Award,
      iconColor: "text-pink-400",
      iconBg: "bg-pink-500/10 border-pink-500/20",
    },
    {
      label: "Missed Deadlines",
      value: totalMissed ?? 0,
      icon: AlertTriangle,
      iconColor: "text-rose-400",
      iconBg: "bg-rose-500/10 border-rose-500/20",
      valueColor: (totalMissed ?? 0) > 0 ? "text-rose-400" : "text-slate-100",
    },
    {
      label: "Top Performer",
      value: topPerformerName ?? "—",
      icon: Trophy,
      iconColor: "text-amber-400",
      iconBg: "bg-amber-500/20 border-amber-500/30",
      isSpecial: true,
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
      {kpiItems?.map((item) => {
        const Icon = item?.icon;

        if (item?.isSpecial) {
          return (
            <div
              key={item?.label}
              className="bg-gradient-to-br from-amber-500/10 via-slate-900/90 to-slate-900/80 border border-amber-500/30 rounded-xl p-5 flex flex-col justify-between">
              <div className="flex items-center justify-between mb-3">
                <div
                  className={`w-9 h-9 rounded-lg border flex items-center justify-center ${item?.iconBg} ${item?.iconColor}`}>
                  <Icon size={18} />
                </div>
              </div>
              <div>
                <div className="text-lg font-bold text-amber-300 truncate">
                  {item?.value}
                </div>
                <div className="text-[11px] font-bold uppercase tracking-wider text-amber-400/80 mt-0.5">
                  {item?.label}
                </div>
              </div>
            </div>
          );
        }

        return (
          <div
            key={item?.label}
            className="bg-slate-900/80 border border-slate-800/80 rounded-xl p-5 flex flex-col justify-between hover:border-slate-700/60 transition-colors">
            <div className="flex items-center justify-between mb-3">
              <div
                className={`w-9 h-9 rounded-lg border flex items-center justify-center ${item?.iconBg} ${item?.iconColor}`}>
                <Icon size={18} />
              </div>
            </div>
            <div>
              <div
                className={`text-3xl font-extrabold tracking-tight ${item?.valueColor ?? "text-slate-100"}`}>
                {item?.value}
              </div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mt-1">
                {item?.label}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
