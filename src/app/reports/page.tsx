"use client";

import { Loader2, Calendar } from "lucide-react";
import { useWeeklyReport } from "@/hooks/useWeeklyReport";
import { KpiCardsGrid } from "@/components/report/KpiCardsGrid";
import { EmployeeBreakdownGrid } from "@/components/report/EmployeeBreakdownGrid";

export default function ReportsPage() {
  const { loading, employees, weekRange, expandedCards, toggleExpand, stats } =
    useWeeklyReport();

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-100px)] w-full gap-3 text-slate-400">
        <Loader2 className="animate-spin text-indigo-500" size={36} />
        <p className="text-sm font-medium text-slate-300">
          Generating Performance Dashboard...
        </p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col min-w-0 overflow-y-auto w-full p-6 md:p-8">
      <div className="space-y-8 max-w-[1400px] w-full mx-auto pb-12">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800/80">
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-slate-100 tracking-tight">
              Weekly Performance Report
            </h1>
            <p className="text-sm font-medium text-slate-400 mt-1 flex items-center gap-2">
              <Calendar size={14} className="text-indigo-400" />
              <span>
                {weekRange?.start} – {weekRange?.end}
              </span>
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="px-3.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs font-semibold text-slate-300">
              This Week
            </span>
          </div>
        </div>

        <KpiCardsGrid stats={stats} />

        <EmployeeBreakdownGrid
          employees={employees}
          topPerformerName={stats?.topPerformerName}
          expandedCards={expandedCards}
          onToggleExpand={toggleExpand}
        />
      </div>
    </div>
  );
}
