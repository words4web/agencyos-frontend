import React from "react";
import { CheckCircle2, XCircle, Loader2 } from "lucide-react";
import { EUploadStatus } from "@/enums";
import { FileUploadListProps } from "@/types/project/project.types";
import { formatBytes, getFileIcon } from "@/utils/file.utils";

export const FileUploadList: React.FC<FileUploadListProps> = ({
  uploads,
  onRemove,
}) => {
  if (uploads?.length === 0) return null;

  return (
    <div className="flex flex-col gap-3 mt-4 max-h-56 overflow-y-auto pr-1">
      <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wide">
        Uploading Files (
        {uploads?.filter((u) => u.status === EUploadStatus.DONE)?.length} /
        {uploads?.length})
      </h4>
      <div className="flex flex-col gap-2">
        {uploads?.map((up) => (
          <div
            key={up?.id}
            className="flex flex-col gap-1.5 p-3 rounded-lg bg-slate-900/60 border border-slate-800/80">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5 min-w-0">
                {getFileIcon(up?.mimeType)}
                <div className="flex flex-col min-w-0">
                  <span
                    className="text-xs font-medium text-slate-200 truncate max-w-[200px]"
                    title={up?.name}>
                    {up?.name}
                  </span>
                  <span className="text-[10px] text-slate-500">
                    {formatBytes(up?.size)}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                {up?.status === EUploadStatus.UPLOADING && (
                  <>
                    <span className="text-[10px] font-semibold text-indigo-400">
                      {up?.progress >= 90
                        ? "Processing..."
                        : `${up?.progress}%`}
                    </span>
                    <Loader2
                      size={14}
                      className="animate-spin text-indigo-500"
                    />
                  </>
                )}
                {up?.status === EUploadStatus.DONE && (
                  <CheckCircle2 size={16} className="text-green-500" />
                )}
                {up?.status === EUploadStatus.ERROR && (
                  <div className="group relative flex items-center">
                    <XCircle
                      size={16}
                      className="text-red-500 cursor-pointer hover:text-red-400 transition-colors"
                      onClick={() => onRemove && onRemove(up?.id)}
                    />
                    <span className="absolute right-6 scale-0 transition-all rounded bg-red-950 px-2 py-1 text-[10px] text-red-400 border border-red-800/40 group-hover:scale-100 whitespace-nowrap z-50">
                      {up?.errorMsg || "Upload failed"} (Click to remove)
                    </span>
                  </div>
                )}
              </div>
            </div>

            {up?.status === EUploadStatus.UPLOADING && (
              <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-indigo-500 to-violet-500 transition-all duration-150 rounded-full"
                  style={{ width: `${up?.progress}%` }}
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
