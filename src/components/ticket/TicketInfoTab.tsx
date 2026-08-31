import { TicketProperties } from "./TicketProperties";
import { TicketTimelineEstimation } from "./TicketTimelineEstimation";
import { TicketLoggingProgress } from "./TicketLoggingProgress";
import { FileText } from "lucide-react";
import { formatTicketDate } from "@/utils/ticket";
import { TicketInfoTabProps } from "@/types/ticket/ticket.types";

export function TicketInfoTab({
  ticket,
  employees,
  projects = [],
  isAdmin,
  canEdit,
  formState,
  setFormValue,
}: TicketInfoTabProps) {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h5 className="text-[11px] uppercase font-bold text-slate-400 tracking-wider">
          Ticket Name
        </h5>
        {isAdmin ? (
          <input
            type="text"
            className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-sm font-semibold"
            placeholder="Enter ticket title..."
            value={formState.title}
            onChange={(e) => setFormValue("title", e.target.value)}
          />
        ) : (
          <h2 className="text-base font-bold text-slate-100 px-3 py-2 bg-slate-950/20 rounded-xl border border-slate-900">
            {ticket?.title}
          </h2>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <TicketProperties
          ticket={ticket}
          employees={employees}
          projects={projects}
          canEditAssignee={isAdmin}
          canEditProject={isAdmin}
          localAssigneeId={formState.assigneeId}
          localProjectId={formState.projectId}
          onUpdateAssignee={(val) => setFormValue("assigneeId", val)}
          onUpdateProject={(val) => setFormValue("projectId", val)}
        />
        <TicketTimelineEstimation
          ticket={ticket}
          formatDate={formatTicketDate}
          canEdit={isAdmin}
          localStartDate={formState.startDate}
          setLocalStartDate={(val) => setFormValue("startDate", val)}
          localDueDate={formState.dueDate}
          setLocalDueDate={(val) => setFormValue("dueDate", val)}
          localStoryPoints={formState.storyPoints}
          setLocalStoryPoints={(val) => setFormValue("storyPoints", val)}
          localEstimatedHours={formState.estimatedHours}
          setLocalEstimatedHours={(val) => setFormValue("estimatedHours", val)}
        />
      </div>

      <TicketLoggingProgress
        ticket={ticket}
        localStatus={formState.status}
        setLocalStatus={(val) => setFormValue("status", val)}
        localActualHours={formState.actualHours}
        setLocalActualHours={(val) => setFormValue("actualHours", val)}
        canEdit={canEdit}
      />

      <div className="flex flex-col gap-2">
        <h5 className="text-[11px] uppercase font-bold text-slate-400 tracking-wider flex items-center gap-1.5">
          <FileText size={12} className="text-indigo-400" />
          Description
        </h5>
        {isAdmin ? (
          <textarea
            className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-sm min-h-24 resize-y leading-relaxed"
            placeholder="No description provided. Add details here..."
            value={formState.description}
            onChange={(e) => setFormValue("description", e.target.value)}
          />
        ) : (
          <p className="text-sm text-slate-300 leading-relaxed bg-slate-950/20 p-4 rounded-xl border border-slate-900 min-h-16">
            {ticket?.description || "No description provided."}
          </p>
        )}
      </div>
    </div>
  );
}
