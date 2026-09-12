"use client";

import { useState } from "react";
import { Modal } from "@/components/Modal";
import { Lock } from "lucide-react";
import { RequestUnlockModalProps } from "@/types/ticket/ticket.types";

export function RequestUnlockModal({
  isOpen,
  onClose,
  onSubmit,
  isSubmitting = false,
}: RequestUnlockModalProps) {
  const [reason, setReason] = useState("");

  const handleClose = () => {
    setReason("");
    onClose();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason.trim()) return;
    onSubmit(reason.trim());
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      size="max-w-lg"
      title="Request Unlock"
      closeOnBackdropClick={false}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-5 pt-2">
        <div className="flex flex-col gap-2">
          <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
            <Lock size={12} className="text-amber-400" />
            Why was the deadline missed? <span className="text-red-400">*</span>
          </label>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Explain the reason for missing the deadline and why you need more time..."
            rows={4}
            required
            className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-amber-500/60 resize-none transition-colors"
          />
          <p className="text-xs text-slate-500">
            {reason.trim().length} characters
          </p>
        </div>

        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
          <button
            type="button"
            onClick={handleClose}
            disabled={isSubmitting}
            className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-slate-200 transition-colors">
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting || !reason.trim()}
            className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 disabled:text-slate-500 text-xs font-semibold text-white transition-all">
            {isSubmitting ? "Sending..." : "Send Request"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
