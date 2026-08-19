import { useState, useRef, useEffect } from "react";
import {
  MoreHorizontal,
  Download,
  Edit,
  Trash2,
  ExternalLink,
  Loader2,
} from "lucide-react";
import { AssetActionMenuProps } from "@/types/project/project.types";
import { EAssetProvider } from "@/enums";

export function AssetActionMenu({
  asset,
  onEdit,
  onDelete,
  isDeleting = false,
  onMenuOpenChange,
}: AssetActionMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    onMenuOpenChange?.(isOpen);
  }, [isOpen, onMenuOpenChange]);

  const downloadUrl = asset?.providerFileId
    ? `https://drive.google.com/uc?export=download&id=${asset?.providerFileId}`
    : asset?.url;

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className="relative action-menu-container" ref={menuRef}>
      <button
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          if (!isDeleting) setIsOpen(!isOpen);
        }}
        disabled={isDeleting}
        className="px-2.5 py-1.5 w-10 h-7 flex items-center justify-center rounded-lg text-slate-500 hover:text-slate-300 hover:bg-slate-800 transition-colors disabled:opacity-50">
        {isDeleting ? (
          <Loader2 size={16} className="animate-spin text-indigo-400" />
        ) : (
          <MoreHorizontal size={18} strokeWidth={2} color="white" />
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-1.5 w-40 rounded-xl bg-slate-900 border border-slate-800 p-1 shadow-xl z-50 animate-in fade-in slide-in-from-top-1 duration-150">
          {!asset.isFolder && (
            <a
              href={downloadUrl}
              target="_blank"
              rel="noopener noreferrer"
              download={asset.provider === EAssetProvider.GOOGLE_DRIVE}
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2 px-3 py-2 text-xs text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors w-full text-left">
              {asset.provider === EAssetProvider.GOOGLE_DRIVE ? (
                <>
                  <Download size={13} />
                  Download
                </>
              ) : (
                <>
                  <ExternalLink size={13} />
                  Open Link
                </>
              )}
            </a>
          )}

          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setIsOpen(false);
              onEdit();
            }}
            className="flex items-center gap-2 px-3 py-2 text-xs text-slate-300 hover:text-indigo-450 hover:bg-indigo-500/10 rounded-lg transition-colors w-full text-left">
            <Edit size={13} />
            Edit
          </button>

          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setIsOpen(false);
              onDelete();
            }}
            className="flex items-center gap-2 px-3 py-2 text-xs text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors w-full text-left border-t border-slate-850 mt-1 pt-1.5">
            <Trash2 size={13} />
            Delete
          </button>
        </div>
      )}
    </div>
  );
}
