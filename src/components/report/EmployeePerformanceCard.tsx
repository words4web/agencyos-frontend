"use client";

import { CheckCircle2, ShieldCheck, RotateCcw, Briefcase } from "lucide-react";
import { EmployeePerformanceCardProps } from "@/types/report/report.types";

export const EmployeePerformanceCard = ({
  employee,
}: EmployeePerformanceCardProps) => {
  const { user, projects = [] } = employee;

  const totalProjectHours = projects.reduce((sum, p) => sum + p.hours, 0) || 1;

  return (
    <div className="bg-slate-900/80 border border-slate-800/80 hover:border-slate-700/80 rounded-2xl p-5 sm:p-6 transition-all duration-200 shadow-sm flex flex-col justify-between space-y-5">
      <div>
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="text-lg font-bold text-slate-100 tracking-tight">
              {user.name}
            </h3>
            <p className="text-xs text-slate-400 font-medium mt-0.5">
              {user.designation}
            </p>
          </div>

          <div className="text-right">
            <div className="text-2xl font-black text-sky-400">
              {employee.actualHours}h
            </div>
            <div className="text-[11px] text-slate-400 font-medium">
              logged hours
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2.5 mt-4">
          <div className="bg-slate-950/60 border border-slate-800/60 rounded-xl p-2.5 text-center">
            <div className="text-xs text-slate-400 font-semibold flex items-center justify-center gap-1">
              <CheckCircle2 size={12} className="text-emerald-400" />
              <span>Closed</span>
            </div>
            <div className="text-base font-bold text-emerald-400 mt-0.5">
              {employee.completedTickets}
            </div>
            <div className="text-[10px] text-slate-400">
              {employee.avgHoursPerTicket}h / task
            </div>
          </div>

          <div className="bg-slate-950/60 border border-slate-800/60 rounded-xl p-2.5 text-center">
            <div className="text-xs text-slate-400 font-semibold flex items-center justify-center gap-1">
              <ShieldCheck size={13} className="text-purple-400" />
              <span>Quality</span>
            </div>
            <div className="text-base font-bold text-purple-300 mt-0.5">
              {employee.firstPassRate}%
            </div>
            <div className="text-[10px] text-slate-400">0 revisions</div>
          </div>

          <div className="bg-slate-950/60 border border-slate-800/60 rounded-xl p-2.5 text-center">
            <div className="text-xs text-slate-400 font-semibold flex items-center justify-center gap-1">
              <RotateCcw size={12} className="text-amber-400" />
              <span>Rework</span>
            </div>
            <div
              className={`text-base font-bold mt-0.5 ${
                employee.revisionCount === 0
                  ? "text-slate-400"
                  : "text-amber-300"
              }`}>
              {employee.revisionCount}
            </div>
            <div className="text-[10px] text-slate-400">revisions</div>
          </div>
        </div>

        <div className="mt-5 space-y-3">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Briefcase size={12} className="text-indigo-400" />
              <span>Client & Project Allocation</span>
            </span>
            <span className="text-[11px] text-slate-400 normal-case font-normal">
              {projects.length} {projects.length === 1 ? "project" : "projects"}
            </span>
          </div>

          {projects.length === 0 ? (
            <div className="bg-slate-950/50 border border-slate-800/50 rounded-xl p-4 text-center text-xs text-slate-400">
              No project activity recorded in this period.
            </div>
          ) : (
            <div className="space-y-2">
              {projects.map((p) => {
                const pct = Math.round((p.hours / totalProjectHours) * 100);

                return (
                  <div
                    key={p.name}
                    className="bg-slate-950/60 border border-slate-800/50 rounded-xl p-2.5 space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-medium text-slate-200 truncate max-w-[170px]">
                        {p.name}
                      </span>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-slate-400 text-[11px]">
                          {p.ticketCount}{" "}
                          {p.ticketCount === 1 ? "task" : "tasks"}
                        </span>
                        <span className="font-bold text-sky-400 text-xs">
                          {p.hours}h
                        </span>
                      </div>
                    </div>
                    <div className="w-full bg-slate-800/80 rounded-full h-1 overflow-hidden">
                      <div
                        className="bg-indigo-400 h-full rounded-full transition-all duration-300"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
