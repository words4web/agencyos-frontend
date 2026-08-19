import React, { useState, useRef } from "react";
import { Upload, File } from "lucide-react";
import { FileDropZoneProps } from "@/types/project/project.types";

export const FileDropZone: React.FC<FileDropZoneProps> = ({
  onFilesSelected,
  disabled = false,
}) => {
  const [isDragActive, setIsDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (disabled) return;

    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragActive(true);
    } else if (e.type === "dragleave") {
      setIsDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
    if (disabled) return;

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const fileList = Array.from(e.dataTransfer.files);
      onFilesSelected(fileList);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (disabled) return;
    if (e.target.files && e.target.files.length > 0) {
      const fileList = Array.from(e.target.files);
      onFilesSelected(fileList);
    }
  };

  const onButtonClick = () => {
    if (disabled) return;
    fileInputRef.current?.click();
  };

  return (
    <div
      onDragEnter={handleDrag}
      onDragOver={handleDrag}
      onDragLeave={handleDrag}
      onDrop={handleDrop}
      onClick={onButtonClick}
      className={`relative w-full h-44 rounded-xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all duration-300 p-6 ${
        disabled
          ? "border-slate-800 bg-slate-900/10 cursor-not-allowed pointer-events-none opacity-50"
          : isDragActive
            ? "border-indigo-500 bg-indigo-500/5 shadow-md shadow-indigo-500/10"
            : "border-slate-800 hover:border-slate-700 bg-slate-900/20 hover:bg-slate-900/40"
      }`}>
      <input
        ref={fileInputRef}
        type="file"
        multiple
        className="hidden"
        onChange={handleFileInputChange}
        disabled={disabled}
      />
      <div className="flex flex-col items-center gap-3 text-center">
        <div
          className={`p-3 rounded-full ${isDragActive ? "bg-indigo-500/10 text-indigo-400" : "bg-slate-800 text-slate-400"}`}>
          {isDragActive ? (
            <File className="animate-pulse" size={24} />
          ) : (
            <Upload size={24} />
          )}
        </div>
        <div>
          <p className="text-sm font-semibold text-slate-200">
            {isDragActive
              ? "Drop files here to upload"
              : "Drag & drop files here, or click to browse"}
          </p>
          <p className="text-xs text-slate-500 mt-1">
            Supports PDF, DOC, XLS, PNG, JPG, MP4 (Max 100MB per file)
          </p>
        </div>
      </div>
    </div>
  );
};
