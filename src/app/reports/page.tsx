"use client";

import { Loader2, Calendar, ChevronDown, BarChart3 } from "lucide-react";
import { useWeeklyReport } from "@/hooks/useWeeklyReport";
import { PageHeader } from "@/components/PageHeader";
import { KpiSummaryBanner } from "@/components/report/KpiSummaryBanner";
import { TeamComparisonTable } from "@/components/report/TeamComparisonTable";
import { EmployeePerformanceCard } from "@/components/report/EmployeePerformanceCard";
import { formatDate } from "@/utils/date";

export default function ReportsPage() {
  return null;

  const {
    loading,
    fetching,
    employees,
    summary,
    weekRange,
    availableWeeks,
    selectedWeekId,
    setSelectedWeekId,
    hasReports,
  } = useWeeklyReport();

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-100px)] w-full gap-3 text-slate-400">
        <Loader2 className="animate-spin text-sky-400" size={36} />
        <p className="text-sm font-medium text-slate-300">
          Loading Weekly Performance Report...
        </p>
      </div>
    );
  }

  if (!hasReports) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center min-w-0 w-full p-6 md:p-8 text-center">
        <div className="bg-slate-900/60 border border-slate-800 p-8 rounded-2xl max-w-md w-full flex flex-col items-center gap-3">
          <Calendar size={36} className="text-slate-500" />
          <h2 className="text-lg font-bold text-slate-200">
            No Reports Available
          </h2>
          <p className="text-xs text-slate-400">
            No weekly performance reports have been saved in the system yet.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col min-w-0 overflow-y-auto w-full p-6 md:p-8">
      <div className="space-y-8 max-w-[1400px] w-full mx-auto pb-16">
        <PageHeader
          title="Weekly Performance Report"
          subtitle={`${weekRange?.start} – ${weekRange?.end}${fetching ? " • Updating..." : ""}`}
          icon={BarChart3}>
          {availableWeeks?.length > 0 && (
            <div className="relative">
              <select
                value={selectedWeekId}
                onChange={(e) => setSelectedWeekId(e.target.value)}
                className="appearance-none bg-slate-900 border border-slate-800 hover:border-slate-700 text-xs font-semibold text-slate-200 py-2 pl-3.5 pr-8 rounded-xl focus:outline-none focus:ring-1 focus:ring-sky-500 cursor-pointer transition-colors">
                {availableWeeks?.map((w, idx) => (
                  <option
                    key={w._id}
                    value={w._id}
                    className="bg-slate-900 text-slate-200">
                    {formatDate(w?.weekStart)} – {formatDate(w?.weekEnd)}
                    {idx === 0 ? " (Latest)" : ""}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center px-2.5 pointer-events-none text-slate-400">
                <ChevronDown size={14} />
              </div>
            </div>
          )}
        </PageHeader>

        <KpiSummaryBanner summary={summary} employeeCount={employees.length} />
        <TeamComparisonTable employees={employees} />
        <div className="space-y-4 pt-2">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-100 tracking-tight">
              Employee Performance Breakdown
            </h2>
            <span className="text-xs text-slate-400">
              {employees.length} team members
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {employees.map((emp) => (
              <EmployeePerformanceCard key={emp.user.id} employee={emp} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
