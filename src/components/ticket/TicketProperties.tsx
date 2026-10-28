import { TicketPropertiesProps } from "@/types/ticket/ticket.types";
import { getPriorityBadge } from "@/utils/ticket";
import { ETicketPriority } from "@/enums";
import { SearchableDropdown } from "@/components/SearchableDropdown";
import {
  Folder,
  User,
  Sliders,
  Tag,
  RotateCcw,
  ShieldCheck,
  CheckSquare,
} from "lucide-react";

export function TicketProperties({
  ticket,
  employees = [],
  projects = [],
  workTypes = [],
  canEditAssignee = false,
  canEditProject = false,
  canEditPriority = false,
  canEditWorkType = false,
  canEditRequiresReview = false,
  localAssigneeId,
  localProjectId,
  localPriority,
  localWorkTypeId,
  localRequiresReview,
  onUpdateAssignee,
  onUpdateProject,
  onUpdatePriority,
  onUpdateWorkType,
  onUpdateRequiresReview,
}: TicketPropertiesProps) {
  return (
    <div className="flex flex-col gap-3.5 bg-slate-950/40 p-4 border border-slate-800/80 rounded-xl min-h-[174px]">
      <h6 className="text-[11px] uppercase font-bold text-slate-400 tracking-wider flex items-center gap-1.5 border-b border-slate-900 pb-2 mb-1">
        <Sliders size={12} className="text-indigo-400" />
        Ticket Properties
      </h6>

      {canEditProject && (
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-indigo-500/10 border border-indigo-500/10 text-indigo-400 shrink-0">
            <Folder size={14} />
          </div>
          <div className="flex flex-col min-w-0 flex-1">
            <SearchableDropdown
              label="Project"
              placeholder="Select Project"
              searchPlaceholder="Search projects..."
              options={
                projects?.map((proj) => ({
                  value: proj?._id,
                  label: proj?.name,
                })) || []
              }
              value={localProjectId || ""}
              onChange={(val) => onUpdateProject?.(val)}
            />
          </div>
        </div>
      )}

      {canEditAssignee && (
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/10 text-emerald-400 shrink-0">
            <User size={14} />
          </div>
          <div className="flex flex-col flex-1 min-w-0">
            <SearchableDropdown
              label="Assignee"
              placeholder="Select Employee"
              searchPlaceholder="Search employees..."
              options={
                employees?.map((emp) => ({
                  value: emp?._id,
                  label: emp?.name,
                  subLabel: emp?.designation,
                })) || []
              }
              value={localAssigneeId || ""}
              onChange={(val) => onUpdateAssignee?.(val)}
            />
          </div>
        </div>
      )}

      <div className="flex items-center gap-2.5">
        <div className="p-2 rounded-lg bg-indigo-500/10 border border-indigo-500/10 text-indigo-400 shrink-0">
          <Sliders size={14} />
        </div>
        <div className="flex flex-col flex-1 min-w-0">
          <span className="text-[10px] uppercase font-bold text-slate-500">
            Priority
          </span>
          {canEditPriority ? (
            <select
              value={
                localPriority || ticket?.priority || ETicketPriority.MEDIUM
              }
              onChange={(e) =>
                onUpdatePriority?.(e.target.value as ETicketPriority)
              }
              className="text-xs font-semibold text-slate-200 bg-slate-900 border border-slate-800/80 rounded px-2 py-1 focus:outline-none focus:border-indigo-500 w-full mt-1 min-h-[28px]">
              <option value={ETicketPriority.LOW}>Low</option>
              <option value={ETicketPriority.MEDIUM}>Medium</option>
              <option value={ETicketPriority.HIGH}>High</option>
            </select>
          ) : (
            <div className="mt-1 flex items-center min-h-[28px]">
              {getPriorityBadge(ticket?.priority)}
            </div>
          )}
        </div>
      </div>

      {(() => {
        const revCount = ticket?.revisionCount || 0;
        return (
          revCount > 0 && (
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-lg bg-purple-500/10 border border-purple-500/10 text-purple-400 shrink-0">
                <RotateCcw size={14} />
              </div>
              <div className="flex flex-col flex-1 min-w-0">
                <span className="text-[10px] uppercase font-bold text-slate-500">
                  Revisions Requested
                </span>
                <span className="text-xs font-bold text-purple-300 mt-0.5">
                  {revCount} iteration{revCount > 1 ? "s" : ""}
                </span>
              </div>
            </div>
          )
        );
      })()}

      <div className="flex items-center gap-2.5">
        <div className="p-2 rounded-lg bg-purple-500/10 border border-purple-500/10 text-purple-400 shrink-0">
          <CheckSquare size={14} />
        </div>
        <div className="flex flex-col min-w-0 flex-1">
          {canEditWorkType ? (
            <SearchableDropdown
              label="Work Type"
              placeholder="None (Standard Ticket)"
              searchPlaceholder="Search work types..."
              options={[
                { value: "", label: "None (Standard Ticket)" },
                ...(workTypes?.map((wt) => ({
                  value: wt?._id,
                  label: wt?.name,
                })) || []),
              ]}
              value={localWorkTypeId || ""}
              onChange={(val) => onUpdateWorkType?.(val)}
            />
          ) : (
            <>
              <span className="text-[10px] uppercase font-bold text-slate-500">
                Work Type
              </span>
              <span className="text-xs font-semibold text-purple-300 truncate mt-0.5">
                {ticket?.workType?.name || "None (Standard)"}
              </span>
            </>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2.5">
        <div className="p-2 rounded-lg bg-indigo-500/10 border border-indigo-500/10 text-indigo-400 shrink-0">
          <ShieldCheck size={14} />
        </div>
        <div className="flex flex-col flex-1 min-w-0">
          <span className="text-[10px] uppercase font-bold text-slate-500">
            Admin Review
          </span>
          {canEditRequiresReview ? (
            <label className="flex items-center gap-2 mt-1 cursor-pointer">
              <input
                type="checkbox"
                checked={localRequiresReview || false}
                onChange={(e) => onUpdateRequiresReview?.(e.target.checked)}
                className="w-3.5 h-3.5 rounded border-slate-700 bg-slate-900 text-indigo-600 focus:ring-indigo-500"
              />
              <span className="text-xs font-semibold text-slate-200">
                {localRequiresReview
                  ? "Required before completion"
                  : "Direct completion allowed"}
              </span>
            </label>
          ) : (
            <span className="text-xs font-semibold text-indigo-300 mt-0.5">
              {ticket?.requiresReview
                ? "Required before completion"
                : "Direct completion allowed"}
            </span>
          )}
        </div>
      </div>

      <div className="mt-1 pt-3 border-t border-slate-900/60 flex flex-col gap-1.5 w-full">
        <span className="text-[10px] uppercase font-bold text-slate-500 flex items-center gap-1">
          <Tag size={10} className="text-indigo-400" />
          Tags
        </span>
        <div className="flex flex-wrap gap-2">
          {ticket?.tags && ticket?.tags?.length > 0 ? (
            ticket?.tags?.map((tag, i) => (
              <span
                key={`${tag}-${i}`}
                className="text-[10px] font-bold bg-indigo-950/40 text-indigo-400 border border-indigo-900/60 px-2 py-0.5 rounded-full uppercase tracking-wider">
                {tag}
              </span>
            ))
          ) : (
            <span className="text-xs text-slate-500 italic">No tags</span>
          )}
        </div>
      </div>
    </div>
  );
}
