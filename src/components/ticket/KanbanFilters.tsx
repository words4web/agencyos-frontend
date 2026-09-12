import { Filter, X, CheckCircle2, Calendar } from "lucide-react";
import {
  KanbanFiltersProps,
  CompletedDatePreset,
} from "@/types/ticket/ticket.types";
import { ETicketPriority } from "@/enums";

const DATE_PRESETS: { value: CompletedDatePreset; label: string }[] = [
  { value: "this_week", label: "This Week" },
  { value: "today", label: "Today" },
  { value: "this_month", label: "This Month" },
  { value: "all_time", label: "All Time" },
  { value: "custom", label: "Custom Range" },
];

export function KanbanFilters({
  filterProject,
  setFilterProject,
  filterAssignee,
  setFilterAssignee,
  filterPriority,
  setFilterPriority,
  projects,
  employees,
  clearFilters,
  completedDatePreset,
  setCompletedDatePreset,
  completedCustomFrom,
  setCompletedCustomFrom,
  completedCustomTo,
  setCompletedCustomTo,
}: KanbanFiltersProps) {
  const hasActiveFilters =
    filterProject ||
    filterAssignee ||
    filterPriority ||
    completedDatePreset !== "this_week";

  const isCustomInvalid =
    completedDatePreset === "custom" &&
    completedCustomFrom &&
    completedCustomTo &&
    completedCustomFrom > completedCustomTo;

  return (
    <section className="px-8 py-3 bg-slate-900/10 border-b border-slate-900 flex flex-wrap items-center gap-x-6 gap-y-2">
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
          <Filter size={14} className="text-indigo-400" />
          <span>Filters:</span>
        </div>

        <select
          value={filterProject}
          onChange={(e) => setFilterProject(e.target.value)}
          className="px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-300 focus:outline-none focus:border-indigo-500 cursor-pointer">
          <option value="">All Projects</option>
          {projects?.map((p) => (
            <option key={p?._id} value={p?._id}>
              {p?.name}
            </option>
          ))}
        </select>

        {employees && employees?.length > 0 && (
          <select
            value={filterAssignee}
            onChange={(e) => setFilterAssignee(e.target.value)}
            className="px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-300 focus:outline-none focus:border-indigo-500 cursor-pointer">
            <option value="">All Assignees</option>
            {employees?.map((emp) => (
              <option key={emp?._id} value={emp?._id}>
                {emp?.name}
              </option>
            ))}
          </select>
        )}

        <select
          value={filterPriority}
          onChange={(e) => setFilterPriority(e.target.value)}
          className="px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-300 focus:outline-none focus:border-indigo-500 cursor-pointer">
          <option value="">All Priorities</option>
          <option value={ETicketPriority.LOW}>Low</option>
          <option value={ETicketPriority.MEDIUM}>Medium</option>
          <option value={ETicketPriority.HIGH}>High</option>
        </select>
      </div>

      <div className="h-5 w-px bg-slate-800 hidden sm:block" />

      <div className="flex flex-wrap items-center gap-3">
        <CheckCircle2 size={13} className="text-emerald-400" />

        <select
          value={completedDatePreset}
          onChange={(e) =>
            setCompletedDatePreset(e.target.value as CompletedDatePreset)
          }
          className="px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-300 focus:outline-none focus:border-emerald-500 cursor-pointer">
          {DATE_PRESETS.map((p) => (
            <option key={p.value} value={p.value}>
              {p.label}
            </option>
          ))}
        </select>

        {completedDatePreset === "custom" && (
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5">
              <Calendar size={12} className="text-slate-500" />
              <input
                type="date"
                value={completedCustomFrom}
                onChange={(e) => setCompletedCustomFrom(e.target.value)}
                className="px-2 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-300 focus:outline-none focus:border-emerald-500 cursor-pointer"
              />
            </div>
            <span className="text-slate-600 text-xs">→</span>
            <input
              type="date"
              value={completedCustomTo}
              min={completedCustomFrom || undefined}
              onChange={(e) => setCompletedCustomTo(e.target.value)}
              className={`px-2 py-1.5 rounded-lg bg-slate-900 border text-xs text-slate-300 focus:outline-none cursor-pointer ${
                isCustomInvalid
                  ? "border-red-500 focus:border-red-400"
                  : "border-slate-800 focus:border-emerald-500"
              }`}
            />
            {isCustomInvalid && (
              <span className="text-xs text-red-400">
                End must be after start
              </span>
            )}
          </div>
        )}
      </div>

      {hasActiveFilters && (
        <button
          onClick={clearFilters}
          className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1 font-semibold transition-colors ml-auto">
          <X size={12} />
          Reset Filters
        </button>
      )}
    </section>
  );
}
