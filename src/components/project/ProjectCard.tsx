import { UserPlus, Trash2, FolderOpen, Edit2 } from "lucide-react";
import { ProjectCardProps } from "@/types/project/project.types";
import Link from "next/link";

export function ProjectCard({
  project,
  onAllocateClick,
  onAddAssetClick,
  onEditAssetClick,
  onDeleteClick,
  onEditClick,
}: ProjectCardProps) {
  return (
    <div className="bg-slate-900/40 border border-slate-800 rounded-xl p-6 flex flex-col justify-between backdrop-blur-md hover:border-slate-700 transition-colors">
      <div>
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-bold text-slate-100">{project?.name}</h3>
          <div className="flex items-center gap-2">
            {onEditClick && (
              <button
                onClick={() => onEditClick(project)}
                className="p-1.5 rounded-lg bg-slate-950/80 border border-slate-800 text-indigo-400 hover:text-indigo-300 hover:bg-slate-900 transition-colors shadow-sm flex items-center justify-center cursor-pointer"
                title="Edit Project">
                <Edit2 size={13} />
              </button>
            )}
            {onDeleteClick && (
              <button
                onClick={() => onDeleteClick(project?._id)}
                className="p-1 rounded-md text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                title="Delete Project">
                <Trash2 size={15} />
              </button>
            )}
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-400">
              Active
            </span>
          </div>
        </div>

        <p className="text-xs text-slate-400 mb-4 w-full break-words">
          {project?.description || "No description provided."}
        </p>

        {/* Client Info */}
        <div className="border-t border-slate-800/80 py-3 flex flex-col gap-1">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wide">
            Client Details
          </span>
          <span className="text-sm text-slate-200">{project?.clientName}</span>
          <span className="text-xs text-slate-500">{project?.clientEmail}</span>
        </div>

        <div className="border-t border-slate-800/80 py-3 flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wide">
              Assigned Team
            </span>
            <button
              onClick={() => onAllocateClick(project)}
              className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1 font-semibold">
              <UserPlus size={14} />
              Allocate
            </button>
          </div>
          <div className="flex flex-wrap gap-1.5 mt-1">
            {project?.employees?.length === 0 ? (
              <span className="text-xs text-slate-500 italic">
                No employees assigned yet.
              </span>
            ) : (
              project?.employees?.map((emp) => (
                <span
                  key={emp?._id}
                  className="inline-flex items-center px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-xs text-slate-300"
                  title={`${emp?.email} (${emp?.designation})`}>
                  {emp?.name}
                </span>
              ))
            )}
          </div>
        </div>

        <div className="border-t border-slate-800/80 pt-3 mt-3 flex items-center justify-between">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wide">
            Project Assets
          </span>
          <Link
            href={`/admin/projects/${project?._id}/files`}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-indigo-400 bg-indigo-500/10 hover:bg-indigo-500/20 hover:text-indigo-300 transition-all border border-indigo-500/10 hover:border-indigo-500/20">
            <FolderOpen size={13} />
            Manage Assets ({project?.assets?.length || 0})
          </Link>
        </div>
      </div>
    </div>
  );
}
