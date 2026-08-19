import { X } from "lucide-react";
import { Button } from "@/components/Button";
import { FileDropZone } from "@/components/project/FileDropZone";
import { FileUploadList } from "@/components/project/FileUploadList";
import { UploadFilesTabProps } from "@/types/project/project.types";

export function UploadFilesTab({
  selectedFiles,
  uploads,
  onFilesSelected,
  onRemoveSelectedFile,
  onRemoveUpload,
  onClose,
  onUploadClick,
}: UploadFilesTabProps) {
  return (
    <div className="flex flex-col gap-4">
      <FileDropZone onFilesSelected={onFilesSelected} />

      {selectedFiles && selectedFiles?.length > 0 && (
        <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800 flex flex-col gap-2">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            Files Selected ({selectedFiles?.length})
          </span>
          <div className="flex flex-col gap-1 max-h-36 overflow-y-auto">
            {selectedFiles?.map((f, i) => (
              <div
                key={i}
                className="flex justify-between items-center text-xs text-slate-200 py-0.5">
                <span className="truncate max-w-[240px]">{f.name}</span>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-slate-500">
                    {(f.size / (1024 * 1024)).toFixed(2)} MB
                  </span>
                  <button
                    type="button"
                    onClick={() => onRemoveSelectedFile(i)}
                    className="text-slate-500 hover:text-red-400 transition-colors p-0.5">
                    <X size={12} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <FileUploadList uploads={uploads} onRemove={onRemoveUpload} />

      <div className="flex gap-3 justify-end mt-4 border-t border-slate-800/80 pt-4">
        <Button type="button" variant="secondary" onClick={onClose}>
          Close
        </Button>
        {selectedFiles && selectedFiles.length > 0 && (
          <Button type="button" onClick={onUploadClick}>
            Upload Files
          </Button>
        )}
      </div>
    </div>
  );
}
