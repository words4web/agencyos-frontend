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
      <div className="flex h-[60vh] w-full items-center justify-center">
        <Loader2 className="animate-spin text-indigo-500" size={32} />
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="flex h-[60vh] w-full flex-col items-center justify-center text-center p-6">
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
    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <Suspense
        fallback={
          <div className="flex h-[60vh] w-full items-center justify-center">
            <Loader2 className="animate-spin text-indigo-500" size={32} />
          </div>
        }>
        <FileExplorer project={project} />
      </Suspense>
    </div>
  );
}
