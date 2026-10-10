"use client";

import { Suspense } from "react";
import { useParams } from "next/navigation";
import { useGetProject } from "@/services/project/project.hooks";
import { FileExplorer } from "@/components/project/FileExplorer";
import { Loader2 } from "lucide-react";

export default function EmployeeProjectFilesPage() {
  const params = useParams();
  const projectId = params.projectId as string;

  const { data: project, isLoading, error } = useGetProject(projectId);

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center min-w-0 overflow-y-auto p-8">
        <Loader2 className="animate-spin text-indigo-500" size={32} />
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-center min-w-0 overflow-y-auto p-8">
        <p className="text-sm font-semibold text-red-400">
          Failed to load project files
        </p>
        <p className="text-xs text-slate-500 mt-1">
          Please check if the project exists or try again.
        </p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col min-w-0 overflow-y-auto p-6 md:p-8">
      <div className="max-w-7xl mx-auto w-full pb-16">
        <Suspense
          fallback={
            <div className="flex h-[60vh] w-full items-center justify-center">
              <Loader2 className="animate-spin text-indigo-500" size={32} />
            </div>
          }>
          <FileExplorer project={project} />
        </Suspense>
      </div>
    </div>
  );
}
