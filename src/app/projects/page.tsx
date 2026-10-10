"use client";

import { useState, useMemo } from "react";
import { PageHeader } from "@/components/PageHeader";
import { Briefcase, Search, X } from "lucide-react";
import { useGetProjects } from "@/services/project/project.hooks";
import { ProjectCard } from "@/components/project/ProjectCard";

export default function EmployeeProjectsPage() {
  const { data: projects = [], isLoading } = useGetProjects();
  const [searchQuery, setSearchQuery] = useState("");

  const stats = useMemo(() => {
    const totalProjects = projects?.length || 0;
    const uniqueClients = new Set(
      projects?.map((p) => p?.clientName?.trim())?.filter(Boolean),
    )?.size;
    const totalAllocations = projects?.reduce(
      (sum, p) => sum + (p?.employees?.length || 0),
      0,
    );
    return { totalProjects, uniqueClients, totalAllocations };
  }, [projects]);

  const filteredProjects = useMemo(() => {
    if (!searchQuery?.trim()) return projects;

    const query = searchQuery?.toLowerCase()?.trim();
    return projects?.filter((project) => {
      const matchesName = project?.name?.toLowerCase()?.includes(query);
      const matchesClient = project?.clientName?.toLowerCase()?.includes(query);
      const matchesEmail = project?.clientEmail?.toLowerCase()?.includes(query);
      const matchesDesc = project?.description?.toLowerCase()?.includes(query);
      const matchesEmployee = project?.employees?.some((e) =>
        e.name?.toLowerCase()?.includes(query),
      );

      return (
        matchesName ||
        matchesClient ||
        matchesEmail ||
        matchesDesc ||
        matchesEmployee
      );
    });
  }, [projects, searchQuery]);

  const hasActiveFilters = Boolean(searchQuery?.trim());

  const clearFilters = () => {
    setSearchQuery("");
  };

  return (
    <div className="flex-1 flex flex-col min-w-0 overflow-y-auto p-8">
      <div className="max-w-6xl mx-auto w-full space-y-6 pb-16">
        <PageHeader
          title="My Projects"
          subtitle="Projects and assets assigned to you"
          icon={Briefcase}
        />

        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md text-xs">
            <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
            <span className="text-slate-400 font-medium">Projects:</span>
            <span className="font-bold text-slate-100">
              {stats?.totalProjects}
            </span>
          </div>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md text-xs">
            <span className="w-2 h-2 rounded-full bg-purple-500"></span>
            <span className="text-slate-400 font-medium">Clients:</span>
            <span className="font-bold text-slate-100">
              {stats?.uniqueClients}
            </span>
          </div>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md text-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span className="text-slate-400 font-medium">Allocations:</span>
            <span className="font-bold text-slate-100">
              {stats?.totalAllocations}
            </span>
          </div>
        </div>

        <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-3.5 backdrop-blur-md flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
          <div className="relative flex-1 w-full max-w-lg">
            <Search
              size={15}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none"
            />
            <input
              type="text"
              placeholder="Search projects, clients, emails, descriptions, team..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-8 py-2 rounded-xl bg-slate-950/60 border border-slate-800 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 p-0.5">
                <X size={13} />
              </button>
            )}
          </div>

          <div className="flex items-center justify-between sm:justify-end gap-3 text-xs text-slate-500 shrink-0">
            <span>
              Showing
              <strong className="text-slate-300 font-semibold">
                {filteredProjects?.length}
              </strong>
              of {projects?.length} projects
            </span>
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold flex items-center gap-1 transition-colors">
                <X size={12} />
                Clear
              </button>
            )}
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1, 2].map((i) => (
              <div
                key={i}
                className="h-44 rounded-2xl bg-slate-900/40 border border-slate-800 animate-pulse"
              />
            ))}
          </div>
        ) : filteredProjects?.length === 0 ? (
          <div className="bg-slate-900/20 border border-slate-800/80 rounded-2xl p-16 text-center flex flex-col items-center justify-center">
            <div className="w-14 h-14 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-500 mb-4 shadow-inner">
              {hasActiveFilters ? (
                <Search size={24} />
              ) : (
                <Briefcase size={24} />
              )}
            </div>
            <h3 className="text-base font-bold text-slate-200 mb-1">
              {hasActiveFilters
                ? "No matching projects found"
                : "No projects assigned yet"}
            </h3>
            <p className="text-xs text-slate-500 max-w-sm mb-5 leading-relaxed">
              {hasActiveFilters
                ? "Try checking for typos or searching by client name, email, or team member."
                : "You have not been assigned to any projects yet. Contact your admin to get allocated to a project."}
            </p>
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors">
                Clear Search
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredProjects?.map((proj) => (
              <ProjectCard
                key={proj?._id}
                project={proj}
                baseFilesUrl="/projects"
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
