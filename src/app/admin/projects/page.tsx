"use client";

import { useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { Plus, LayoutDashboard } from "lucide-react";
import { IProject as Project } from "@/types/project/project.types";
import { useGetProjects } from "@/services/project/project.hooks";
import { useGetEmployees } from "@/services/employee/employee.hooks";
import { ProjectCard } from "@/components/project/ProjectCard";
import { CreateProjectModal } from "@/forms/project/CreateProjectModal";
import { AllocateTeamModal } from "@/forms/project/AllocateTeamModal";
import { AddAssetModal } from "@/forms/project/AddAssetModal";

export default function ProjectsPage() {
  const { data: projects = [] } = useGetProjects();
  const { data: employees = [] } = useGetEmployees();

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [activeProject, setActiveProject] = useState<Project | null>(null);
  const [assetProjectId, setAssetProjectId] = useState<string>("");

  return (
    <>
      <div className="max-w-6xl mx-auto">
        <PageHeader
          title="Project Settings"
          subtitle="Configure projects, allocations, and digital assets"
          icon={LayoutDashboard}
          action={{
            label: "Create Project",
            icon: Plus,
            onClick: () => setIsCreateOpen(true),
          }}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {projects?.length === 0 ? (
            <div className="col-span-full bg-slate-900/20 border border-slate-800 rounded-xl p-12 text-center text-slate-500">
              No active projects. Click &quot;Create Project&quot; to get
              started.
            </div>
          ) : (
            projects?.map((proj) => (
              <ProjectCard
                key={proj?._id}
                project={proj}
                onAllocateClick={(project) => setActiveProject(project)}
                onAddAssetClick={(projectId) => setAssetProjectId(projectId)}
              />
            ))
          )}
        </div>
      </div>

      <CreateProjectModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
      />

      <AllocateTeamModal
        key={activeProject?._id || "none"}
        isOpen={!!activeProject}
        onClose={() => setActiveProject(null)}
        project={activeProject}
        employees={employees}
      />

      <AddAssetModal
        isOpen={!!assetProjectId}
        onClose={() => setAssetProjectId("")}
        projectId={assetProjectId}
      />
    </>
  );
}
