"use client";

import { format } from "date-fns";
import { Modal } from "@/components/Modal";
import { LeaveDetailsModalProps } from "@/types/leave/leave.types";

export function LeaveDetailsModal({ leave, onClose }: LeaveDetailsModalProps) {
  return (
    <Modal isOpen={!!leave} onClose={onClose} title="Leave Request Details">
      {leave && (
        <div className="flex flex-col gap-4 text-sm text-slate-200">
          <div className="grid grid-cols-2 gap-4 pb-2 border-b border-slate-800">
            <div>
              <span className="text-xs text-slate-400 block font-semibold uppercase">
                Employee
              </span>
              <span className="text-slate-100 font-medium">
                {typeof leave?.employee === "object"
                  ? leave?.employee?.name
                  : "Employee"}
              </span>
            </div>
            <div>
              <span className="text-xs text-slate-400 block font-semibold uppercase">
                Status
              </span>
              <span className="font-semibold">
                {leave?.status === "approved" && "🟢 Approved"}
                {leave?.status === "rejected" && "🔴 Rejected"}
                {leave?.status === "pending" && "🟡 Pending"}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 pb-2 border-b border-slate-800">
            <div>
              <span className="text-xs text-slate-400 block font-semibold uppercase">
                Dates
              </span>
              <span className="text-slate-100">
                {format(new Date(leave?.startDate), "MMM dd, yyyy")} –{" "}
                {format(new Date(leave?.endDate), "MMM dd, yyyy")}
              </span>
            </div>
            <div>
              <span className="text-xs text-slate-400 block font-semibold uppercase">
                Duration
              </span>
              <span className="text-slate-100 font-semibold">
                {leave?.totalDays} {leave?.totalDays === 1 ? "day" : "days"}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 pb-2 border-b border-slate-800">
            <div>
              <span className="text-xs text-slate-400 block font-semibold uppercase">
                Leave Type
              </span>
              <span className="font-bold text-slate-100 uppercase">
                {leave?.leaveType}
              </span>
            </div>
            <div>
              <span className="text-xs text-slate-400 block font-semibold uppercase">
                Authorized
              </span>
              <span className="text-slate-100">
                {leave?.isAuthorized ? "✓ Yes" : "— No"}
              </span>
            </div>
          </div>

          <div className="pb-2 border-b border-slate-800">
            <span className="text-xs text-slate-400 block font-semibold uppercase">
              Reason
            </span>
            <p className="text-slate-100 mt-1 leading-relaxed bg-slate-900/50 p-3 rounded-lg border border-slate-850">
              {leave?.reason}
            </p>
          </div>

          <div>
            <span className="text-xs text-slate-400 block font-semibold uppercase">
              Admin Remarks
            </span>
            <p className="text-slate-100 mt-1 leading-relaxed bg-slate-900/50 p-3 rounded-lg border border-slate-850">
              {leave?.adminNote || "No remarks provided."}
            </p>
          </div>

          <div className="flex justify-end mt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-300 font-semibold text-sm transition-all duration-200">
              Close
            </button>
          </div>
        </div>
      )}
    </Modal>
  );
}
