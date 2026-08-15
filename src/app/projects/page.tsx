"use client";

import { PageHeader } from "@/components/PageHeader";
import { Sidebar } from "@/components/Sidebar";
import { Briefcase, FolderOpen } from "lucide-react";
import { useGetProjects } from "@/services/project/project.hooks";
import Link from "next/link";

export default function EmployeeProjectsPage() {
  const { data: projects = [], isLoading } = useGetProjects();

  return (
    <div className="flex h-screen bg-slate-950 text-slate-100">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto p-8">
        <div className="max-w-6xl mx-auto w-full">
          <PageHeader
            title="My Projects"
            subtitle="Projects and assets assigned to you"
            icon={Briefcase}
          />

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[1, 2].map((i) => (
                <div
                  key={i}
                  className="h-64 rounded-xl bg-slate-900/40 border border-slate-800 animate-pulse"
                />
              ))}
            </div>
          ) : projects?.length === 0 ? (
            <div className="bg-slate-900/20 border border-slate-800 rounded-xl p-16 text-center text-slate-500">
              <Briefcase size={36} className="mx-auto mb-4 text-slate-700" />
              <p className="text-sm">
                You have not been assigned to any projects yet.
              </p>
              <p className="text-xs text-slate-600 mt-1">
                Contact your admin to get allocated to a project.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {projects?.map((project) => (
                <div
                  key={project?._id}
                  className="bg-slate-900/40 border border-slate-800 rounded-xl p-6 flex flex-col gap-4 backdrop-blur-md hover:border-slate-700 transition-colors">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-base font-bold text-slate-100 truncate">
                        {project?.name}
                      </h3>
                      <p className="text-xs text-slate-400 mt-1 w-full break-words">
                        {project?.description || "No description provided."}
                      </p>
                    </div>
                    <span className="flex-shrink-0 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-400">
                      Active
                    </span>
                  </div>

                  <div className="border-t border-slate-800/80 pt-3 flex flex-col gap-0.5">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">
                      Client
                    </span>
                    <span className="text-sm text-slate-200">
                      {project?.clientName}
                    </span>
                    <span className="text-xs text-slate-500">
                      {project?.clientEmail}
                    </span>
                  </div>

                  <div className="border-t border-slate-800/80 pt-3 mt-3 flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">
                      Assets
                    </span>
                    <Link
                      href={`/projects/${project?._id}/files`}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-indigo-400 bg-indigo-500/10 hover:bg-indigo-500/20 hover:text-indigo-300 transition-all border border-indigo-500/10 hover:border-indigo-500/20">
                      <FolderOpen size={13} />
                      Manage Assets
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
