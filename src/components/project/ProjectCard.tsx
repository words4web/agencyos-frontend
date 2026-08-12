import { UserPlus, Link2, ExternalLink } from "lucide-react";
import { ProjectCardProps } from "@/types/project/project.types";

export function ProjectCard({
  project,
  onAllocateClick,
  onAddAssetClick,
}: ProjectCardProps) {
  return (
    <div className="bg-slate-900/40 border border-slate-800 rounded-xl p-6 flex flex-col justify-between backdrop-blur-md hover:border-slate-700 transition-colors">
      <div>
        {/* Project Name and Status */}
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-bold text-slate-100">{project?.name}</h3>
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-400">
            Active
          </span>
        </div>

        <p className="text-xs text-slate-400 mb-4">
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

        {/* Team Members */}
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

        {/* Assets */}
        <div className="border-t border-slate-800/80 py-3 flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wide">
              Project Assets
            </span>
            <button
              onClick={() => onAddAssetClick(project?._id)}
              className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1 font-semibold">
              <Link2 size={14} />
              Add Asset
            </button>
          </div>
          <div className="flex flex-col gap-1.5 mt-1">
            {project?.assets?.length === 0 ? (
              <span className="text-xs text-slate-500 italic">
                No assets uploaded.
              </span>
            ) : (
              project?.assets?.map((asset, idx) => (
                <a
                  key={idx}
                  href={asset?.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-2 rounded bg-slate-950/40 border border-slate-900 text-xs hover:border-slate-800 hover:bg-slate-900/20 text-slate-300 transition-colors">
                  <div className="flex flex-col">
                    <span className="font-semibold text-slate-200">
                      {asset?.name}
                    </span>
                    <span className="text-[10px] text-indigo-400 font-medium">
                      {asset?.category}
                    </span>
                  </div>
                  <ExternalLink size={12} className="text-slate-500" />
                </a>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
