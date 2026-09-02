import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  size?: string;
  headerActions?: React.ReactNode;
  closeOnBackdropClick?: boolean;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  size = "max-w-lg",
  headerActions,
  closeOnBackdropClick = true,
}) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setMounted(true);
    }, 0);
    return () => setMounted(false);
  }, []);

  if (!isOpen || !mounted) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm transition-opacity"
        onClick={closeOnBackdropClick ? onClose : undefined}
      />

      <div
        className={`relative w-full ${size} bg-slate-900/90 border border-slate-800 rounded-xl shadow-2xl overflow-hidden backdrop-blur-md transform transition-all flex flex-col max-h-[85vh] animate-in fade-in zoom-in-95 duration-200`}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/40">
          <h3 className="text-lg font-bold text-slate-100">{title}</h3>
          <div className="flex items-center gap-2">
            {headerActions}
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-200 rounded-lg p-1 hover:bg-slate-800 transition-colors">
              <X size={18} />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 text-slate-300">
          {children}
        </div>
      </div>
    </div>,
    document.body,
  );
};
