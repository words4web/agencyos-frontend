import {
  UserPlus,
  Trash2,
  FolderOpen,
  Edit2,
  Building2,
  Mail,
  ArrowUpRight,
} from "lucide-react";
import { ProjectCardProps } from "@/types/project/project.types";
import Link from "next/link";

const AVATAR_COLORS = [
  "bg-indigo-500/20 text-indigo-300 border-indigo-500/30",
  "bg-purple-500/20 text-purple-300 border-purple-500/30",
  "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
  "bg-sky-500/20 text-sky-300 border-sky-500/30",
  "bg-amber-500/20 text-amber-300 border-amber-500/30",
  "bg-pink-500/20 text-pink-300 border-pink-500/30",
];

function getInitials(name?: string) {
  if (!name) return "U";
  return name
    ?.split(" ")
    ?.filter(Boolean)
    ?.map((n) => n[0])
    ?.slice(0, 2)
    ?.join("")
    ?.toUpperCase();
}

export function ProjectCard({
  project,
  onAllocateClick,
  onDeleteClick,
  onEditClick,
  baseFilesUrl = "/admin/projects",
}: ProjectCardProps & { baseFilesUrl?: string }) {
  const employees = project?.employees || [];

  const maxVisibleAvatars = 4;
  const visibleEmployees = employees.slice(0, maxVisibleAvatars);
  const remainingEmployeesCount = employees.length - maxVisibleAvatars;

  return (
    <div className="bg-slate-900/50 hover:bg-slate-900/70 border border-slate-800 hover:border-slate-700/80 rounded-2xl p-4 shadow-lg shadow-black/20 transition-all duration-200 flex flex-col justify-between gap-3 group">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <h3 className="text-sm font-bold text-slate-100 group-hover:text-white transition-colors truncate">
            {project?.name}
          </h3>
          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[9px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shrink-0">
            <span className="w-1 h-1 rounded-full bg-emerald-400 animate-pulse" />
            Active
          </span>
        </div>

        <div className="flex items-center gap-1 shrink-0">
          {onEditClick && (
            <button
              onClick={() => onEditClick(project)}
              className="p-1 rounded-lg bg-slate-950/80 border border-slate-800 text-slate-400 hover:text-indigo-300 hover:bg-slate-800 transition-colors shadow-sm"
              title="Edit Project Details">
              <Edit2 size={12} />
            </button>
          )}
          {onDeleteClick && (
            <button
              onClick={() => onDeleteClick(project?._id)}
              className="p-1 rounded-lg bg-slate-950/80 border border-slate-800 text-slate-500 hover:text-red-400 hover:bg-red-950/30 hover:border-red-900/40 transition-colors shadow-sm"
              title="Delete Project">
              <Trash2 size={12} />
            </button>
          )}
        </div>
      </div>

      <div className="bg-slate-950/50 border border-slate-800/80 rounded-xl px-3 py-2 flex items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-2 min-w-0">
          <Building2 size={13} className="text-indigo-400 shrink-0" />
          <span className="font-semibold text-slate-200 truncate text-[11px]">
            {project?.clientName || "Unnamed Client"}
          </span>
        </div>

        {project?.clientEmail && (
          <div className="flex items-center gap-1 text-slate-400 text-[10px] bg-slate-900/60 px-2 py-0.5 rounded border border-slate-800/60 truncate max-w-[170px]">
            <Mail size={10} className="shrink-0 text-slate-500" />
            <span className="truncate">{project?.clientEmail}</span>
          </div>
        )}
      </div>

      <div className="border-t border-slate-800/80 pt-2.5 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          {employees.length === 0 ? (
            onAllocateClick ? (
              <button
                onClick={() => onAllocateClick(project)}
                className="text-[11px] text-slate-500 hover:text-indigo-400 flex items-center gap-1 transition-colors">
                <UserPlus size={12} />
                <span>Assign team</span>
              </button>
            ) : (
              <span className="text-[11px] text-slate-600 italic">
                No team assigned
              </span>
            )
          ) : (
            <div className="flex items-center gap-1.5">
              <div className="flex items-center -space-x-2 overflow-hidden py-0.5">
                {visibleEmployees?.map((emp, i) => (
                  <div
                    key={emp?._id || i}
                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center text-[9px] font-bold shadow-sm cursor-help transition-transform hover:scale-110 hover:z-10 ${
                      AVATAR_COLORS[i % AVATAR_COLORS.length]
                    }`}
                    title={`${emp?.name} • ${emp?.designation || "Member"}`}>
                    {getInitials(emp?.name)}
                  </div>
                ))}
                {remainingEmployeesCount > 0 && (
                  <div
                    className="w-6 h-6 rounded-full bg-slate-800 border-2 border-slate-900 text-slate-300 flex items-center justify-center text-[9px] font-bold shadow-sm"
                    title={`${remainingEmployeesCount} more members`}>
                    +{remainingEmployeesCount}
                  </div>
                )}
              </div>
              {onAllocateClick && (
                <button
                  onClick={() => onAllocateClick(project)}
                  className="p-1 rounded-md text-slate-500 hover:text-indigo-400 hover:bg-slate-800/60 transition-colors"
                  title="Allocate members">
                  <UserPlus size={11} />
                </button>
              )}
            </div>
          )}
        </div>

        <Link
          href={`${baseFilesUrl}/${project?._id}/files`}
          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-semibold text-indigo-300 bg-indigo-500/10 hover:bg-indigo-500/20 hover:text-white border border-indigo-500/20 hover:border-indigo-500/30 transition-all shadow-sm shrink-0">
          <FolderOpen size={12} />
          <span>Files</span>
          <ArrowUpRight size={11} className="opacity-70" />
        </Link>
      </div>
    </div>
  );
}
