"use client";

import { useState } from "react";
import { Modal } from "@/components/Modal";
import { Input } from "@/components/Input";
import { Calendar, AlertTriangle, CheckCircle2 } from "lucide-react";
import { UnlockTicketModalProps } from "@/types/ticket/ticket.types";
import { formatLocalDateTime } from "@/utils/ticket";
import { toast } from "sonner";

export function UnlockTicketModal({
  isOpen,
  onClose,
  onUnlock,
  isUnlocking = false,
}: UnlockTicketModalProps) {
  const getDefaultTomorrow = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(18, 0, 0, 0);
    return formatLocalDateTime(tomorrow);
  };

  const [newDueDate, setNewDueDate] = useState(getDefaultTomorrow());
  const [waivePenalty, setWaivePenalty] = useState<boolean | null>(null);

  const handleClose = () => {
    setNewDueDate(getDefaultTomorrow());
    setWaivePenalty(null);
    onClose();
  };

  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);
  const minDateStr = formatLocalDateTime(startOfToday);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDueDate || waivePenalty === null) return;
    if (new Date(newDueDate) <= new Date()) {
      toast.error("New due date must be in the future!");
      return;
    }
    onUnlock(newDueDate, waivePenalty);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      size="max-w-lg"
      title="Unlock Ticket & Extend Deadline">
      <form onSubmit={handleSubmit} className="flex flex-col gap-5 pt-2">
        <Input
          type="datetime-local"
          label={
            <span className="flex items-center gap-1.5 text-xs">
              <Calendar size={14} className="text-indigo-400" />
              New Due Date & Time <span className="text-red-400">*</span>
            </span>
          }
          value={newDueDate}
          min={minDateStr}
          onChange={(e) => setNewDueDate(e.target.value)}
          required
        />

        <div className="flex flex-col gap-2.5">
          <label className="text-xs font-semibold text-slate-300">
            Penalty Action
          </label>
          <div className="grid grid-cols-1 gap-2.5">
            <label
              className={`flex items-start gap-3 p-3.5 rounded-xl border cursor-pointer transition-all ${
                waivePenalty === true
                  ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-200"
                  : "bg-slate-900/60 border-slate-800 hover:border-slate-700 text-slate-300"
              }`}>
              <input
                type="radio"
                name="waivePenalty"
                checked={waivePenalty === true}
                onChange={() => setWaivePenalty(true)}
                className="mt-0.5 text-emerald-500 focus:ring-emerald-500"
              />
              <div className="text-xs space-y-0.5">
                <div className="font-bold flex items-center gap-1.5 text-emerald-400">
                  <CheckCircle2 size={14} />
                  Waive Penalty (No Performance Deduction)
                </div>
                <p className="text-slate-400 leading-snug">
                  Use this if the delay was due to urgent priority shifts,
                  client dependency, or valid admin authorization.
                </p>
              </div>
            </label>

            <label
              className={`flex items-start gap-3 p-3.5 rounded-xl border cursor-pointer transition-all ${
                waivePenalty === false
                  ? "bg-red-500/10 border-red-500/30 text-red-200"
                  : "bg-slate-900/60 border-slate-800 hover:border-slate-700 text-slate-300"
              }`}>
              <input
                type="radio"
                name="waivePenalty"
                checked={waivePenalty === false}
                onChange={() => setWaivePenalty(false)}
                className="mt-0.5 text-red-500 focus:ring-red-500"
              />
              <div className="text-xs space-y-0.5">
                <div className="font-bold flex items-center gap-1.5 text-red-400">
                  <AlertTriangle size={14} />
                  Record as Missed Deadline (Penalize Employee)
                </div>
                <p className="text-slate-400 leading-snug">
                  Increments the employee&apos;s missed deadline counter for
                  end-of-month performance reports.
                </p>
              </div>
            </label>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
          <button
            type="button"
            onClick={handleClose}
            disabled={isUnlocking}
            className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-slate-200 transition-colors">
            Cancel
          </button>
          <button
            type="submit"
            disabled={isUnlocking || !newDueDate || waivePenalty === null}
            className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 disabled:text-slate-500 text-xs font-semibold text-white transition-all shadow-md shadow-indigo-600/20">
            {isUnlocking ? "Unlocking..." : "Unlock Ticket"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
