import { useState } from "react";
import { useSelector } from "react-redux";
import { Modal } from "@/components/Modal";
import { TicketDetailModalProps } from "@/types/ticket/ticket.types";
import { ETicketStatus, EUserRole } from "@/enums";
import { formatTicketDate } from "@/utils/ticket";
import { TicketComments } from "@/components/ticket/TicketComments";
import { TicketProperties } from "@/components/ticket/TicketProperties";
import { TicketTimelineEstimation } from "@/components/ticket/TicketTimelineEstimation";
import { TicketLoggingProgress } from "@/components/ticket/TicketLoggingProgress";
import { FileText } from "lucide-react";
import { RootState } from "@/store";

export function TicketDetailModal({
  ticket,
  isOpen,
  onClose,
  onUpdateTicket,
  onSubmitComment,
  isCommentsPending,
}: TicketDetailModalProps) {
  const { user } = useSelector((state: RootState) => state?.auth);

  const [localStatus, setLocalStatus] = useState<ETicketStatus>(
    ticket?.status || ETicketStatus.TODO,
  );
  const [localActualHours, setLocalActualHours] = useState<number>(
    ticket?.actualHours || 0,
  );

  const canEdit =
    user?.role === EUserRole.ADMIN || ticket?.assignee?._id === user?.id;

  const hasChanges =
    canEdit &&
    ticket &&
    (localStatus !== ticket?.status ||
      localActualHours !== (ticket?.actualHours || 0));

  const handleSave = () => {
    if (!ticket) return;
    onUpdateTicket(ticket?._id, {
      status: localStatus,
      actualHours: localActualHours,
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="max-w-2xl"
      title={ticket ? ticket?.title : ""}>
      {ticket && (
        <div className="flex flex-col gap-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <TicketProperties ticket={ticket} />
            <TicketTimelineEstimation
              ticket={ticket}
              formatDate={formatTicketDate}
            />
          </div>

          <TicketLoggingProgress
            ticket={ticket}
            localStatus={localStatus}
            setLocalStatus={setLocalStatus}
            localActualHours={localActualHours}
            setLocalActualHours={setLocalActualHours}
            canEdit={canEdit}
          />

          {hasChanges && (
            <div className="flex items-center justify-between p-3.5 bg-indigo-950/20 border border-indigo-900/50 rounded-xl animate-in fade-in slide-in-from-bottom-2 duration-200">
              <span className="text-xs text-indigo-400 font-medium">
                You have unsaved changes on this ticket.
              </span>
              <button
                onClick={handleSave}
                className="px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-xs font-semibold text-white transition-all shadow-md shadow-indigo-600/20">
                Save Changes
              </button>
            </div>
          )}

          <div className="flex flex-col gap-2">
            <h5 className="text-[11px] uppercase font-bold text-slate-400 tracking-wider flex items-center gap-1.5">
              <FileText size={12} className="text-indigo-400" />
              Description
            </h5>
            <p className="text-sm text-slate-300 leading-relaxed bg-slate-950/20 p-4 rounded-xl border border-slate-900 min-h-16">
              {ticket.description || "No description provided."}
            </p>
          </div>

          <TicketComments
            comments={ticket.comments}
            onSubmitComment={onSubmitComment}
            isPending={isCommentsPending}
          />
        </div>
      )}
    </Modal>
  );
}
