import React from "react";
import { Modal } from "./Modal";
import { Button } from "./Button";
import { Loader2 } from "lucide-react";
import { ConfirmModalProps } from "@/types/common/common.types";

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  isLoading = false,
  variant = "primary",
  onConfirm,
  onClose,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <div className="flex flex-col gap-4">
        {description && (
          <div className="text-sm text-slate-300 leading-relaxed">
            {description}
          </div>
        )}
        <div className="flex gap-3 justify-end mt-4">
          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
            disabled={isLoading}>
            {cancelLabel}
          </Button>
          <Button
            type="button"
            variant={variant === "danger" ? "danger" : "primary"}
            onClick={onConfirm}
            disabled={isLoading}
            className="min-w-[100px] flex items-center justify-center gap-2">
            {isLoading && <Loader2 size={16} className="animate-spin" />}
            {isLoading ? "Processing..." : confirmLabel}
          </Button>
        </div>
      </div>
    </Modal>
  );
};
