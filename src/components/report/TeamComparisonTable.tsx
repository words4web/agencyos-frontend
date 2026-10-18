"use client";

import { useState, useMemo } from "react";
import {
  ArrowUpDown,
  Clock,
  CheckCircle2,
  ShieldCheck,
  RotateCcw,
  BarChart2,
  Briefcase,
} from "lucide-react";
import { Table } from "@/components/Table";
import { Column } from "@/types/common/common.types";
import {
  EmployeePerformanceData,
  TeamComparisonTableProps,
} from "@/types/report/report.types";

type SortField =
  | "actualHours"
  | "completedTickets"
  | "avgHoursPerTicket"
  | "firstPassRate"
  | "revisionCount";

export const TeamComparisonTable = ({
  employees,
}: TeamComparisonTableProps) => {
  const [sortField, setSortField] = useState<SortField>("actualHours");
  const [sortAsc, setSortAsc] = useState<boolean>(false);

  const maxHours = useMemo(() => {
    return Math.max(...employees.map((e) => e.actualHours), 1);
  }, [employees]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(false);
    }
  };

  const sortedEmployees = useMemo(() => {
    return [...employees].sort((a, b) => {
      const valA = a[sortField];
      const valB = b[sortField];
      return sortAsc ? valA - valB : valB - valA;
    });
  }, [employees, sortField, sortAsc]);

  const columns: Column<EmployeePerformanceData>[] = [
    {
      header: "Employee",
      accessor: (emp) => (
        <div>
          <div className="font-semibold text-slate-100">{emp.user.name}</div>
          <div className="text-xs text-slate-400">{emp.user.designation}</div>
        </div>
      ),
    },
    {
      header: (
        <button
          onClick={() => handleSort("actualHours")}
          className="flex items-center gap-1.5 hover:text-slate-200 transition-colors uppercase text-[9px] font-bold tracking-wider">
          <Clock size={13} className="text-sky-400" />
          <span>Actual Hours</span>
          <ArrowUpDown size={12} className="opacity-60" />
        </button>
      ),
      accessor: (emp) => {
        const hourSharePct = Math.round((emp.actualHours / maxHours) * 100);
        return (
          <div className="flex items-center gap-3">
            <span className="font-bold text-slate-100 w-12 text-right">
              {emp.actualHours}h
            </span>
            <div className="w-24 bg-slate-800 rounded-full h-1.5 overflow-hidden hidden sm:block">
              <div
                className="bg-sky-400 h-full rounded-full transition-all duration-300"
                style={{ width: `${hourSharePct}%` }}
              />
            </div>
          </div>
        );
      },
    },
    {
      header: (
        <button
          onClick={() => handleSort("completedTickets")}
          className="flex items-center gap-1.5 hover:text-slate-200 transition-colors uppercase text-[9px] font-bold tracking-wider">
          <CheckCircle2 size={13} className="text-emerald-400" />
          <span>Completed Tasks</span>
          <ArrowUpDown size={12} className="opacity-60" />
        </button>
      ),
      accessor: (emp) => (
        <div>
          <span className="font-bold text-emerald-400">
            {emp.completedTickets}
          </span>
          <span className="text-xs text-slate-400 ml-1">tasks</span>
        </div>
      ),
    },
    {
      header: (
        <button
          onClick={() => handleSort("avgHoursPerTicket")}
          className="flex items-center gap-1.5 hover:text-slate-200 transition-colors uppercase text-[9px] font-bold tracking-wider">
          <Clock size={13} className="text-indigo-400" />
          <span>Avg Task Time</span>
          <ArrowUpDown size={12} className="opacity-60" />
        </button>
      ),
      accessor: (emp) => (
        <div>
          <span className="font-medium text-slate-300">
            {emp.avgHoursPerTicket}h
          </span>
          <span className="text-[11px] text-slate-400 ml-1">/task</span>
        </div>
      ),
    },
    {
      header: (
        <button
          onClick={() => handleSort("firstPassRate")}
          className="flex items-center gap-1.5 hover:text-slate-200 transition-colors uppercase text-[9px] font-bold tracking-wider">
          <ShieldCheck size={14} className="text-purple-400" />
          <span>First-Pass Rate</span>
          <ArrowUpDown size={12} className="opacity-60" />
        </button>
      ),
      accessor: (emp) => (
        <span
          className={`inline-flex items-center font-bold px-2 py-0.5 rounded-md text-xs border ${
            emp.firstPassRate >= 80
              ? "bg-purple-500/10 text-purple-300 border-purple-500/20"
              : emp.firstPassRate >= 60
                ? "bg-amber-500/10 text-amber-300 border-amber-500/20"
                : "bg-rose-500/10 text-rose-300 border-rose-500/20"
          }`}>
          {emp.firstPassRate}%
        </span>
      ),
    },
    {
      header: (
        <button
          onClick={() => handleSort("revisionCount")}
          className="flex items-center gap-1.5 hover:text-slate-200 transition-colors uppercase text-[9px] font-bold tracking-wider">
          <RotateCcw size={13} className="text-amber-400" />
          <span>Revisions</span>
          <ArrowUpDown size={12} className="opacity-60" />
        </button>
      ),
      accessor: (emp) => (
        <span
          className={`font-semibold ${
            emp.revisionCount === 0
              ? "text-slate-400"
              : emp.revisionCount > 5
                ? "text-rose-400 font-bold"
                : "text-amber-300"
          }`}>
          {emp.revisionCount}
        </span>
      ),
    },
    {
      header: (
        <div className="flex items-center gap-1.5 uppercase text-[9px] font-bold tracking-wider">
          <Briefcase size={13} className="text-indigo-400" />
          <span>Primary Project Focus</span>
        </div>
      ),
      accessor: (emp) => {
        const topProject = emp.projects?.[0];
        return topProject ? (
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-slate-200 truncate max-w-[160px]">
              {topProject.name}
            </span>
            <span className="text-[11px] font-bold text-sky-400 bg-sky-500/10 px-1.5 py-0.5 rounded border border-sky-500/20">
              {topProject.hours}h
            </span>
          </div>
        ) : (
          <span className="text-xs text-slate-400">—</span>
        );
      },
    },
  ];

  return (
    <div className="bg-slate-900/80 border border-slate-800/80 rounded-2xl overflow-hidden shadow-sm">
      <div className="p-5 border-b border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
            <BarChart2 size={18} />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-100">
              Team Comparison Matrix
            </h2>
            <p className="text-xs text-slate-400">
              Side-by-side comparison of capacity, deliverables, and quality
            </p>
          </div>
        </div>
        <div className="text-xs text-slate-400 font-medium">
          Click any column header to sort
        </div>
      </div>

      <Table
        data={sortedEmployees}
        columns={columns}
        emptyMessage="No employee performance data available."
      />
    </div>
  );
};
