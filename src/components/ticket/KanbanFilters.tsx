import { Filter, X } from "lucide-react";
import { KanbanFiltersProps } from "@/types/ticket/ticket.types";
import { ETicketPriority } from "@/enums";

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
}: KanbanFiltersProps) {
  return (
    <section className="px-8 py-3 bg-slate-900/10 border-b border-slate-900 flex flex-wrap items-center gap-3">
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

      {(filterProject || filterAssignee || filterPriority) && (
        <button
          onClick={clearFilters}
          className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1 font-semibold transition-colors ml-2">
          <X size={12} />
          Reset Filters
        </button>
      )}
    </section>
  );
}
