import { useState } from "react";
import { useSelector } from "react-redux";
import { Modal } from "@/components/Modal";
import { ConfirmModal } from "@/components/ConfirmModal";
import { UnlockTicketModal } from "./UnlockTicketModal";
import { TicketDetailModalProps } from "@/types/ticket/ticket.types";
import { ETicketStatus, EUserRole } from "@/enums";
import { formatLocalDateTime, isTicketLocked } from "@/utils/ticket";
import { RootState } from "@/store";
import { TicketInfoTab } from "./TicketInfoTab";
import { TicketCommentsTab } from "./TicketCommentsTab";
import { Trash2, Share2, Lock } from "lucide-react";
import { toast } from "sonner";
import { TicketReviewBanner } from "./TicketReviewBanner";
import { useUnlockTicket } from "@/services/ticket/ticket.hooks";

export function TicketDetailModal({
  ticket,
  isOpen,
  onClose,
  onUpdateTicket,
  onDeleteTicket,
  onSubmitComment,
  employees,
  projects = [],
  isCommentsPending,
  isDeleting = false,
  isUpdating = false,
}: TicketDetailModalProps) {
  const { user } = useSelector((state: RootState) => state?.auth);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [isUnlockOpen, setIsUnlockOpen] = useState(false);
  const [isRevisionConfirmOpen, setIsRevisionConfirmOpen] = useState(false);
  const [isApproveConfirmOpen, setIsApproveConfirmOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"info" | "comments">("info");

  const unlockTicketMutation = useUnlockTicket();

  const isLocked = isTicketLocked(ticket);

  const [formState, setFormState] = useState({
    status: ticket?.status || ETicketStatus.TODO,
    actualHours: ticket?.actualHours || 0,
    assigneeId: ticket?.assignee?._id || "",
    projectId: ticket?.project?._id || "",
    description: ticket?.description || "",
    title: ticket?.title || "",
    requiresReview: ticket?.requiresReview || false,
    startDate: ticket?.startDate
      ? formatLocalDateTime(new Date(ticket.startDate))
      : "",
    dueDate: ticket?.dueDate
      ? formatLocalDateTime(new Date(ticket.dueDate))
      : "",
    storyPoints: ticket?.storyPoints != null ? String(ticket.storyPoints) : "",
    estimatedHours:
      ticket?.estimatedHours != null ? String(ticket.estimatedHours) : "",
  });

  const setFormValue = <K extends keyof typeof formState>(
    key: K,
    value: (typeof formState)[K],
  ) => {
    setFormState((prev) => ({ ...prev, [key]: value }));
  };

  const isAdmin = user?.role === EUserRole.ADMIN;
  const canEdit = !!(
    (isAdmin || ticket?.assignee?._id === user?.id) &&
    !isLocked
  );

  const handleUnlockSubmit = (newDueDate: string, waivePenalty: boolean) => {
    if (!ticket) return;
    unlockTicketMutation.mutate(
      {
        ticketId: ticket._id,
        payload: { newDueDate, waivePenalty },
      },
      {
        onSuccess: (res) => {
          setIsUnlockOpen(false);
          toast.success(res.data?.message || "Ticket unlocked successfully!");
          onClose();
        },
        onError: (err: any) => {
          const msg =
            err?.response?.data?.message || "Failed to unlock ticket.";
          toast.error(msg);
        },
      },
    );
  };

  const originalStartDate = ticket?.startDate
    ? formatLocalDateTime(new Date(ticket.startDate))
    : "";
  const originalDueDate = ticket?.dueDate
    ? formatLocalDateTime(new Date(ticket.dueDate))
    : "";
  const originalStoryPoints =
    ticket?.storyPoints != null ? String(ticket.storyPoints) : "";
  const originalEstimatedHours =
    ticket?.estimatedHours != null ? String(ticket.estimatedHours) : "";

  const hasChanges = !!(
    canEdit &&
    ticket &&
    (formState.status !== ticket?.status ||
      formState.actualHours !== (ticket?.actualHours || 0) ||
      formState.assigneeId !== (ticket?.assignee?._id || "") ||
      (isAdmin &&
        (formState.projectId !== (ticket?.project?._id || "") ||
          formState.description !== (ticket?.description || "") ||
          formState.title !== (ticket?.title || "") ||
          formState.requiresReview !== (ticket?.requiresReview || false) ||
          formState.startDate !== originalStartDate ||
          formState.dueDate !== originalDueDate ||
          formState.storyPoints !== originalStoryPoints ||
          formState.estimatedHours !== originalEstimatedHours)))
  );

  const handleSave = () => {
    if (!ticket) return;
    const updates: any = {
      status: formState.status,
      actualHours: formState.actualHours,
    };

    if (isAdmin) {
      if (formState.assigneeId) {
        updates.assignee = formState.assigneeId;
      } else {
        updates.assignee = null;
      }
      if (formState.projectId) {
        updates.project = formState.projectId;
      }
      updates.title = formState.title;
      updates.description = formState.description;
      updates.requiresReview = formState.requiresReview;
      updates.startDate = formState.startDate || null;
      updates.dueDate = formState.dueDate || null;
      updates.storyPoints =
        formState.storyPoints !== "" ? Number(formState.storyPoints) : null;
      updates.estimatedHours =
        formState.estimatedHours !== ""
          ? Number(formState.estimatedHours)
          : null;
    }

    onUpdateTicket(ticket?._id, updates);
  };

  const handleConfirmDelete = () => {
    if (ticket && onDeleteTicket) {
      onDeleteTicket(ticket._id);
      setIsDeleteConfirmOpen(false);
      onClose();
    }
  };

  const handleClose = () => {
    setActiveTab("info");
    onClose();
  };

  const handleShareClick = () => {
    if (!ticket) return;
    const shareUrl = `${window?.location?.origin}/kanban?ticketId=${ticket?._id}`;
    navigator?.clipboard
      ?.writeText(shareUrl)
      ?.then(() => {
        toast.success("Ticket link copied to clipboard!");
      })
      .catch(() => {
        toast.error("Failed to copy link.");
      });
  };

  const headerActions = ticket && (
    <div className="flex items-center gap-1.5">
      <button
        onClick={handleShareClick}
        className="text-slate-400 hover:text-slate-200 rounded-lg p-1.5 hover:bg-slate-800 transition-colors"
        title="Share Ticket Link">
        <Share2 size={16} />
      </button>
      {isAdmin && (
        <button
          onClick={() => setIsDeleteConfirmOpen(true)}
          className="text-red-400 hover:text-red-300 rounded-lg p-1.5 hover:bg-red-950/20 transition-colors"
          title="Delete Ticket">
          <Trash2 size={16} />
        </button>
      )}
    </div>
  );

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={handleClose}
        size="max-w-2xl"
        title={formState.title || (ticket ? ticket?.title : "")}
        headerActions={headerActions}>
        {ticket && (
          <div className="flex flex-col gap-5">
            {isLocked && (
              <div className="flex items-center justify-between p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs">
                <div className="flex items-center gap-2.5">
                  <Lock size={16} className="text-amber-400 shrink-0" />
                  <span>
                    <strong>Ticket Locked:</strong> The deadline has passed.
                    Status changes are disabled until an Admin unlocks it.
                  </span>
                </div>
                {isAdmin && (
                  <button
                    onClick={() => setIsUnlockOpen(true)}
                    className="px-2.5 py-1 rounded bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 font-semibold transition-all shrink-0 ml-2">
                    Unlock Now
                  </button>
                )}
              </div>
            )}

            {ticket?.requiresReview &&
              ticket?.status === ETicketStatus.IN_REVIEW && (
                <TicketReviewBanner
                  isAdmin={isAdmin}
                  isUpdating={isUpdating}
                  onRequestRevision={() => setIsRevisionConfirmOpen(true)}
                  onApprove={() => setIsApproveConfirmOpen(true)}
                />
              )}
            <div className="flex items-center justify-between border-b border-slate-800 -mx-6 px-6">
              <div className="flex">
                <button
                  onClick={() => setActiveTab("info")}
                  className={`px-4 py-2.5 text-xs font-bold uppercase tracking-wider border-b-2 transition-all ${
                    activeTab === "info"
                      ? "border-indigo-500 text-indigo-400"
                      : "border-transparent text-slate-400 hover:text-slate-200"
                  }`}>
                  Ticket Details
                </button>
                <button
                  onClick={() => setActiveTab("comments")}
                  className={`px-4 py-2.5 text-xs font-bold uppercase tracking-wider border-b-2 transition-all flex items-center gap-1.5 ${
                    activeTab === "comments"
                      ? "border-indigo-500 text-indigo-400"
                      : "border-transparent text-slate-400 hover:text-slate-200"
                  }`}>
                  Comments
                  <span className="px-1.5 py-0.5 rounded-full bg-slate-900 border border-slate-800 text-[10px] text-slate-400 font-semibold group-hover:text-slate-200">
                    {ticket.comments?.length || 0}
                  </span>
                </button>
              </div>
              {hasChanges && activeTab === "info" && (
                <button
                  onClick={handleSave}
                  disabled={isUpdating}
                  className="px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-850 disabled:text-slate-400 disabled:shadow-none text-xs font-semibold text-white transition-all shadow-md shadow-indigo-600/20 mb-2 disabled:cursor-not-allowed animate-in fade-in zoom-in-95 duration-200">
                  {isUpdating ? "Saving..." : "Save Changes"}
                </button>
              )}
            </div>

            <div className="mt-2 min-h-[600px]">
              {activeTab === "info" ? (
                <TicketInfoTab
                  ticket={ticket}
                  employees={employees}
                  projects={projects}
                  isAdmin={isAdmin}
                  canEdit={canEdit}
                  formState={formState}
                  setFormValue={setFormValue}
                />
              ) : (
                <TicketCommentsTab
                  ticket={ticket}
                  onSubmitComment={onSubmitComment}
                  isCommentsPending={isCommentsPending}
                />
              )}
            </div>
          </div>
        )}
        <ConfirmModal
          isOpen={isDeleteConfirmOpen}
          title="Delete Ticket"
          description={`Are you sure you want to delete this ticket: "${ticket?.title}"? This action will remove the ticket from the board.`}
          confirmLabel="Delete"
          variant="danger"
          isLoading={isDeleting}
          onConfirm={handleConfirmDelete}
          onClose={() => setIsDeleteConfirmOpen(false)}
        />
        <ConfirmModal
          isOpen={isRevisionConfirmOpen}
          title="Request Ticket Revision"
          description={`Are you sure you want to reject this submission and request a revision for "${ticket?.title}"? The ticket will be moved back to In Progress.`}
          confirmLabel="Request Revision"
          variant="danger"
          isLoading={isUpdating}
          onConfirm={() => {
            if (ticket) {
              onUpdateTicket(ticket._id, { status: ETicketStatus.IN_PROGRESS });
              setIsRevisionConfirmOpen(false);
            }
          }}
          onClose={() => setIsRevisionConfirmOpen(false)}
        />
        <ConfirmModal
          isOpen={isApproveConfirmOpen}
          title="Approve & Complete Ticket"
          description={`Are you sure you want to approve "${ticket?.title}"? This will mark the ticket as Completed.`}
          confirmLabel="Approve & Complete"
          variant="primary"
          isLoading={isUpdating}
          onConfirm={() => {
            if (ticket) {
              onUpdateTicket(ticket._id, { status: ETicketStatus.COMPLETED });
              setIsApproveConfirmOpen(false);
            }
          }}
          onClose={() => setIsApproveConfirmOpen(false)}
        />
      </Modal>

      <UnlockTicketModal
        isOpen={isUnlockOpen}
        onClose={() => setIsUnlockOpen(false)}
        onUnlock={handleUnlockSubmit}
        isUnlocking={unlockTicketMutation.isPending}
      />
    </>
  );
}
