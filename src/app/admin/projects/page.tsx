"use client";

import { useState, useMemo } from "react";
import { PageHeader } from "@/components/PageHeader";
import { Plus, LayoutDashboard, Search, Briefcase, X } from "lucide-react";
import { IProject as Project } from "@/types/project/project.types";
import { EProjectStatus } from "@/enums";
import {
  useGetProjects,
  useUpdateProject,
} from "@/services/project/project.hooks";
import { toast } from "sonner";
import { useGetEmployees } from "@/services/employee/employee.hooks";
import { ProjectCard } from "@/components/project/ProjectCard";
import { ProjectFiltersHeader } from "@/components/project/ProjectFiltersHeader";
import { ConfirmModal } from "@/components/ConfirmModal";
import { CreateProjectModal } from "@/forms/project/CreateProjectModal";
import { EditProjectModal } from "@/forms/project/EditProjectModal";
import { AllocateTeamModal } from "@/forms/project/AllocateTeamModal";
import { AddAssetModal } from "@/forms/project/AddAssetModal";
import { EditAssetModal } from "@/forms/project/EditAssetModal";
import { IProjectAsset } from "@/types/project/project.types";

export default function ProjectsPage() {
  const [statusFilter, setStatusFilter] = useState<string>(
    EProjectStatus.ACTIVE,
  );
  const { data: projects = [] } = useGetProjects(statusFilter);
  const { data: employees = [] } = useGetEmployees();

  const [searchQuery, setSearchQuery] = useState("");

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [activeProject, setActiveProject] = useState<Project | null>(null);
  const [projectToEdit, setProjectToEdit] = useState<Project | null>(null);
  const [assetProjectId, setAssetProjectId] = useState<string>("");

  const [editAsset, setEditAsset] = useState<IProjectAsset | null>(null);
  const [editProjectId, setEditProjectId] = useState<string>("");
  const [projectToToggleStatus, setProjectToToggleStatus] =
    useState<Project | null>(null);

  const updateProjectMutation = useUpdateProject();

  const executeStatusUpdate = (
    project: Project,
    nextStatus: EProjectStatus,
  ) => {
    updateProjectMutation.mutate(
      {
        projectId: project._id,
        payload: { status: nextStatus },
      },
      {
        onSuccess: () => {
          toast.success(
            nextStatus === EProjectStatus.COMPLETED
              ? `"${project.name}" marked as completed`
              : `"${project.name}" marked as active`,
          );
          setProjectToToggleStatus(null);
        },
        onError: (err: any) => {
          toast.error(
            err?.response?.data?.message || "Failed to update project status",
          );
        },
      },
    );
  };

  const stats = useMemo(() => {
    const totalProjects = projects?.length;
    const uniqueClients = new Set(
      projects?.map((p) => p?.clientName?.trim())?.filter(Boolean),
    )?.size;
    const totalAllocations = projects?.reduce(
      (sum, p) => sum + (p?.employees?.length || 0),
      0,
    );
    const totalAssets = projects?.reduce(
      (sum, p) => sum + (p?.assets?.length || 0),
      0,
    );
    return { totalProjects, uniqueClients, totalAllocations, totalAssets };
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
    <>
      <div className="max-w-6xl mx-auto space-y-6 pb-16">
        <PageHeader
          title="Project Settings"
          subtitle="Configure projects, team allocations, and connected assets"
          icon={LayoutDashboard}
          action={{
            label: "Create Project",
            icon: Plus,
            onClick: () => setIsCreateOpen(true),
          }}
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

        <ProjectFiltersHeader
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
          totalProjectsCount={projects?.length || 0}
          filteredProjectsCount={filteredProjects?.length || 0}
          hasActiveFilters={hasActiveFilters}
          onClearFilters={clearFilters}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredProjects?.length === 0 ? (
            <div className="col-span-full bg-slate-900/20 border border-slate-800/80 rounded-2xl p-16 text-center flex flex-col items-center justify-center">
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
                  : "No active projects"}
              </h3>
              <p className="text-xs text-slate-500 max-w-sm mb-5 leading-relaxed">
                {hasActiveFilters
                  ? "Try checking for typos or searching by client name, email, or team member."
                  : "Get started by creating your first client project to organize tasks, team allocations, and assets."}
              </p>
              {hasActiveFilters ? (
                <button
                  onClick={clearFilters}
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors">
                  Clear Search
                </button>
              ) : (
                <button
                  onClick={() => setIsCreateOpen(true)}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white transition-all shadow-md shadow-indigo-900/20">
                  <Plus size={14} />
                  Create First Project
                </button>
              )}
            </div>
          ) : (
            filteredProjects?.map((proj) => (
              <ProjectCard
                key={proj?._id}
                project={proj}
                onAllocateClick={(project) => setActiveProject(project)}
                onAddAssetClick={(projectId) => setAssetProjectId(projectId)}
                onEditAssetClick={(projectId, asset) => {
                  setEditProjectId(projectId);
                  setEditAsset(asset);
                }}
                onEditClick={(project) => setProjectToEdit(project)}
                onToggleStatusClick={setProjectToToggleStatus}
              />
            ))
          )}
        </div>
      </div>

      <CreateProjectModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
      />

      <EditProjectModal
        isOpen={!!projectToEdit}
        onClose={() => setProjectToEdit(null)}
        project={projectToEdit}
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

      <EditAssetModal
        isOpen={!!editAsset}
        onClose={() => {
          setEditAsset(null);
          setEditProjectId("");
        }}
        projectId={editProjectId}
        asset={editAsset}
      />

      <ConfirmModal
        isOpen={!!projectToToggleStatus}
        onClose={() => setProjectToToggleStatus(null)}
        onConfirm={() => {
          if (projectToToggleStatus) {
            const nextStatus =
              projectToToggleStatus.status === EProjectStatus.COMPLETED
                ? EProjectStatus.ACTIVE
                : EProjectStatus.COMPLETED;
            executeStatusUpdate(projectToToggleStatus, nextStatus);
          }
        }}
        title={
          projectToToggleStatus?.status === EProjectStatus.COMPLETED
            ? "Reactivate Project"
            : "Complete Project"
        }
        description={
          projectToToggleStatus?.status === EProjectStatus.COMPLETED
            ? `Are you sure you want to reactivate "${projectToToggleStatus?.name}"? It will move back into active workflows and team projects.`
            : `Are you sure you want to mark "${projectToToggleStatus?.name}" as completed? It will move out of active workflows and into completed projects.`
        }
        confirmLabel={
          projectToToggleStatus?.status === EProjectStatus.COMPLETED
            ? "Reactivate Project"
            : "Mark as Completed"
        }
        cancelLabel="Cancel"
        isLoading={updateProjectMutation.isPending}
        variant="primary"
      />
    </>
  );
}
