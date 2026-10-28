import { Search, X } from "lucide-react";
import { EProjectStatus } from "@/enums";
import { ProjectFiltersHeaderProps } from "@/types/project/project.types";

export function ProjectFiltersHeader({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  totalProjectsCount,
  filteredProjectsCount,
  hasActiveFilters,
  onClearFilters,
}: ProjectFiltersHeaderProps) {
  return (
    <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-3.5 backdrop-blur-md flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 flex-1">
        <div className="relative flex-1 w-full max-w-lg">
          <Search
            size={15}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none"
          />
          <input
            type="text"
            placeholder="Search projects, clients, emails, descriptions, team..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-9 pr-8 py-2 rounded-xl bg-slate-950/60 border border-slate-800 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 p-0.5">
              <X size={13} />
            </button>
          )}
        </div>

        <div className="flex items-center bg-slate-950/70 p-1 rounded-xl border border-slate-800 self-start sm:self-auto shrink-0">
          {["", ...Object.values(EProjectStatus)].map((status, index) => (
            <button
              key={index}
              type="button"
              onClick={() => onStatusFilterChange(status)}
              className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
                statusFilter === status
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "text-slate-400 hover:text-slate-200"
              }`}>
              {status
                ? status.charAt(0).toUpperCase() + status.slice(1)
                : "All"}
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between sm:justify-end gap-3 text-xs text-slate-500 shrink-0">
        <span>
          Showing{" "}
          <strong className="text-slate-300 font-semibold">
            {filteredProjectsCount}
          </strong>{" "}
          of {totalProjectsCount} projects
        </span>
        {hasActiveFilters && (
          <button
            onClick={onClearFilters}
            className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold flex items-center gap-1 transition-colors">
            <X size={12} />
            Clear
          </button>
        )}
      </div>
    </div>
  );
}
