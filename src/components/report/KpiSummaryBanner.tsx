"use client";

import { Clock, CheckCircle2, ShieldCheck, Briefcase } from "lucide-react";
import { KpiSummaryBannerProps } from "@/types/report/report.types";

export const KpiSummaryBanner = ({
  summary,
  employeeCount,
}: KpiSummaryBannerProps) => {
  const totalHours = summary?.totalHours ?? 0;
  const totalTickets = summary?.totalTickets ?? 0;
  const teamAvgHours = summary?.teamAvgHours ?? 0;
  const firstPassRate = summary?.firstPassRate ?? 100;
  const totalRevisions = summary?.totalRevisions ?? 0;
  const activeProjectsCount = summary?.activeProjectsCount ?? 0;

  const kpis = [
    {
      label: "Total Work Logged",
      value: `${totalHours} hrs`,
      subtext: `Avg ${teamAvgHours}h / employee (${employeeCount} active)`,
      icon: Clock,
      iconColor: "text-sky-400",
      iconBg: "bg-sky-500/10 border-sky-500/20",
      valueColor: "text-slate-100",
    },
    {
      label: "Deliverables Closed",
      value: totalTickets,
      subtext: "Strictly completed in week",
      icon: CheckCircle2,
      iconColor: "text-emerald-400",
      iconBg: "bg-emerald-500/10 border-emerald-500/20",
      valueColor: "text-emerald-400",
    },
    {
      label: "First-Pass Quality",
      value: `${firstPassRate}%`,
      subtext: "Delivered with 0 revisions",
      icon: ShieldCheck,
      iconColor: "text-purple-400",
      iconBg: "bg-purple-500/10 border-purple-500/20",
      valueColor:
        firstPassRate >= 80
          ? "text-purple-300"
          : firstPassRate >= 60
            ? "text-amber-300"
            : "text-rose-400",
    },
    {
      label: "Active Projects",
      value: activeProjectsCount,
      subtext: `${totalRevisions} revisions across accounts`,
      icon: Briefcase,
      iconColor: "text-amber-400",
      iconBg: "bg-amber-500/10 border-amber-500/20",
      valueColor: "text-slate-100",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {kpis.map((kpi) => {
        const Icon = kpi.icon;
        return (
          <div
            key={kpi.label}
            className="bg-slate-900/80 border border-slate-800/80 hover:border-slate-700/80 rounded-2xl p-5 transition-all duration-200 shadow-sm relative overflow-hidden group">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  {kpi.label}
                </p>
                <h3
                  className={`text-2xl font-black mt-2 tracking-tight ${kpi.valueColor}`}>
                  {kpi.value}
                </h3>
                <p className="text-xs text-slate-400 mt-1 font-medium">
                  {kpi.subtext}
                </p>
              </div>
              <div
                className={`w-10 h-10 rounded-xl border flex items-center justify-center shrink-0 ${kpi.iconBg} ${kpi.iconColor}`}>
                <Icon size={20} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
