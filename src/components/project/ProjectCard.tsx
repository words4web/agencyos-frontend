import {
  UserPlus,
  Link2,
  ExternalLink,
  Palette,
  FileText,
  Globe,
  Package,
  PenTool,
  Edit,
} from "lucide-react";

const ASSET_ICON: Record<
  string,
  { icon: React.ElementType; color: string; bg: string }
> = {
  "Brand Kit": { icon: Palette, color: "text-pink-400", bg: "bg-pink-500/10" },
  "Design File": {
    icon: PenTool,
    color: "text-purple-400",
    bg: "bg-purple-500/10",
  },
  SOP: { icon: FileText, color: "text-amber-400", bg: "bg-amber-500/10" },
  URL: { icon: Globe, color: "text-sky-400", bg: "bg-sky-500/10" },
  Other: { icon: Package, color: "text-slate-400", bg: "bg-slate-500/10" },
};
import { ProjectCardProps } from "@/types/project/project.types";

export function ProjectCard({
  project,
  onAllocateClick,
  onAddAssetClick,
  onEditAssetClick,
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
        <div className="border-t border-slate-800/80 pt-3 flex flex-col gap-2">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wide">
              Project Assets
            </span>
            <button
              onClick={() => onAddAssetClick(project?._id)}
              className="flex items-center gap-1 px-2 py-1 rounded-md text-xs font-semibold text-indigo-400 bg-indigo-500/10 hover:bg-indigo-500/20 hover:text-indigo-300 transition-colors">
              <Link2 size={12} />
              Add Asset
            </button>
          </div>

          {project?.assets?.length === 0 ? (
            <p className="text-xs text-slate-600 italic py-1">
              No assets added yet.
            </p>
          ) : (
            <div className="flex flex-col gap-1.5">
              {project?.assets?.map((asset, idx) => (
                <a
                  key={idx}
                  href={asset?.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-3 p-2.5 rounded-lg bg-slate-800/40 border border-slate-800 hover:border-indigo-500/40 hover:bg-slate-800/70 transition-all">
                  {/* Category icon */}
                  {(() => {
                    const meta =
                      ASSET_ICON[asset?.category] ?? ASSET_ICON["Other"];
                    const Icon = meta.icon;
                    return (
                      <div
                        className={`flex-shrink-0 flex items-center justify-center w-7 h-7 rounded-md ${meta.bg}`}>
                        <Icon size={14} className={meta.color} />
                      </div>
                    );
                  })()}
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-slate-200 truncate group-hover:text-white transition-colors">
                      {asset?.name}
                    </p>
                    <p className="text-[10px] text-slate-500 mt-0.5">
                      {asset?.category}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {onEditAssetClick && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          onEditAssetClick(project._id, asset);
                        }}
                        className="p-1.5 rounded-md bg-slate-800 border border-slate-700 text-slate-300 hover:border-indigo-500 hover:bg-indigo-600 hover:text-white transition-all"
                        title="Edit Asset">
                        <Edit size={13} />
                      </button>
                    )}
                    <ExternalLink
                      size={15}
                      className="flex-shrink-0 text-slate-500 group-hover:text-indigo-400 transition-colors"
                    />
                  </div>
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
