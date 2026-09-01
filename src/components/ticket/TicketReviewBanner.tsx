import { ShieldCheck, RotateCcw, CheckCircle2 } from "lucide-react";
import { TicketReviewBannerProps } from "@/types/ticket/ticket.types";

export function TicketReviewBanner({
  isAdmin,
  isUpdating,
  onRequestRevision,
  onApprove,
}: TicketReviewBannerProps) {
  return (
    <div className="flex flex-col gap-2.5 p-3.5 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 font-bold text-purple-200">
          <ShieldCheck size={16} className="text-purple-400 shrink-0" />
          <span>Admin Review Required</span>
        </div>
        {isAdmin && (
          <div className="flex items-center gap-2">
            <button
              onClick={onRequestRevision}
              disabled={isUpdating}
              className="px-3 py-1.5 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-300 border border-red-500/30 font-semibold transition-all flex items-center gap-1.5 disabled:opacity-50">
              <RotateCcw size={12} /> Request Revision
            </button>
            <button
              onClick={onApprove}
              disabled={isUpdating}
              className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold transition-all flex items-center gap-1.5 shadow-md shadow-emerald-600/20 disabled:opacity-50">
              <CheckCircle2 size={12} /> Approve & Complete
            </button>
          </div>
        )}
      </div>
      <p className="text-slate-400 text-[11px] leading-relaxed">
        {isAdmin
          ? "As an Admin, review the deliverables. To request changes, add a comment in the Comments tab explaining the feedback and click 'Request Revision'. Otherwise, click 'Approve & Complete'."
          : "This ticket is currently awaiting Admin review. Status modifications are locked for employees until approved."}
      </p>
    </div>
  );
}
