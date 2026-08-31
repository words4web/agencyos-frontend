import React, { useState, useEffect } from "react";
import { Modal } from "@/components/Modal";
import { ILeave } from "@/types/leave/leave.types";

interface LeaveActionModalContentProps {
  selectedLeave: ILeave | null;
  actionType: "approve" | "reject" | null;
  onClose: () => void;
  onSubmit: (flags: {
    lateNotice?: boolean;
    isAuthorized?: boolean;
    adminNote: string;
  }) => void;
  isPending: boolean;
}

export const LeaveActionModalContent: React.FC<
  LeaveActionModalContentProps
> = ({ selectedLeave, actionType, onClose, onSubmit, isPending }) => {
  const [lateNoticeFlag, setLateNoticeFlag] = useState(false);
  const [isAuthorizedFlag, setIsAuthorizedFlag] = useState(true);
  const [adminNote, setAdminNote] = useState("");

  const prevLeaveIdRef = React.useRef<string | null>(null);
  const currentLeaveId = selectedLeave?._id || null;

  if (currentLeaveId !== prevLeaveIdRef.current) {
    prevLeaveIdRef.current = currentLeaveId;
    setLateNoticeFlag(selectedLeave?.lateNotice || false);
    setIsAuthorizedFlag(selectedLeave?.isAuthorized ?? true);
    setAdminNote("");
  }

  if (!selectedLeave || !actionType) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      lateNotice: lateNoticeFlag,
      isAuthorized: isAuthorizedFlag,
      adminNote,
    });
  };

  return (
    <Modal
      isOpen={selectedLeave !== null}
      onClose={onClose}
      title={
        actionType === "approve"
          ? "Approve Leave Application"
          : "Reject Leave Application"
      }>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <p className="text-xs font-semibold text-slate-400 uppercase">
            Leave Requested By
          </p>
          <p className="text-sm font-bold text-slate-200 mt-0.5">
            {typeof selectedLeave?.employee === "object" &&
            selectedLeave?.employee !== null
              ? selectedLeave?.employee.name
              : "Employee"}
          </p>
        </div>
        <div>
          <p className="text-xs font-semibold text-slate-400 uppercase">
            Reason for Leave
          </p>
          <p className="text-sm text-slate-300 bg-slate-950/40 border border-slate-850 p-3 rounded-xl mt-1 text-slate-400">
            {selectedLeave?.reason}
          </p>
        </div>

        {actionType === "approve" ? (
          <>
            <div className="grid grid-cols-2 gap-4 pt-1">
              <label className="flex items-center gap-2.5 p-3 rounded-xl border border-slate-850 bg-slate-950/40 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={lateNoticeFlag}
                  onChange={(e) => setLateNoticeFlag(e.target.checked)}
                  className="rounded border-slate-800 bg-slate-950 text-indigo-600 focus:ring-0 w-4 h-4"
                />
                <span className="text-xs font-medium text-slate-300">
                  Late Notice
                </span>
              </label>

              <label className="flex items-center gap-2.5 p-3 rounded-xl border border-slate-850 bg-slate-950/40 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={isAuthorizedFlag}
                  onChange={(e) => setIsAuthorizedFlag(e.target.checked)}
                  className="rounded border-slate-800 bg-slate-950 text-indigo-600 focus:ring-0 w-4 h-4"
                />
                <span className="text-xs font-medium text-slate-300">
                  Authorized
                </span>
              </label>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-400 uppercase">
                Remarks / Notes
              </label>
              <input
                type="text"
                value={adminNote}
                onChange={(e) => setAdminNote(e.target.value)}
                placeholder="Optional note for the employee..."
                className="px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 text-sm focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="flex justify-end gap-2.5 mt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-sm transition-all duration-200">
                Cancel
              </button>
              <button
                type="submit"
                disabled={isPending}
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-slate-100 font-semibold text-sm transition-all duration-200">
                {isPending ? "Approving..." : "Approve Leave"}
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-400 uppercase">
                Reason for Rejection
              </label>
              <textarea
                value={adminNote}
                onChange={(e) => setAdminNote(e.target.value)}
                required
                rows={3}
                placeholder="Please state the reason..."
                className="px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 text-sm focus:outline-none focus:border-indigo-500 resize-none"
              />
            </div>

            <div className="flex justify-end gap-2.5 mt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-sm transition-all duration-200">
                Cancel
              </button>
              <button
                type="submit"
                disabled={isPending || !adminNote}
                className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 disabled:opacity-50 text-slate-100 font-semibold text-sm transition-all duration-200">
                {isPending ? "Rejecting..." : "Reject Leave"}
              </button>
            </div>
          </>
        )}
      </form>
    </Modal>
  );
};
