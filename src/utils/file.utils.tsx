import React from "react";
import { FileImage, FileVideo, FileText } from "lucide-react";

export function formatBytes(bytes: number, decimals = 2): string {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
}

export function getFileIcon(mimeType: string): React.ReactElement {
  if (mimeType?.startsWith("image/")) {
    return <FileImage size={18} className="text-pink-400" />;
  }
  if (mimeType?.startsWith("video/")) {
    return <FileVideo size={18} className="text-purple-400" />;
  }
  return <FileText size={18} className="text-indigo-400" />;
}

export function getAssetCategory(mimeType: string): string {
  if (mimeType?.startsWith("image/") || mimeType?.startsWith("video/")) {
    return "Design File";
  }
  if (
    mimeType === "application/pdf" ||
    mimeType?.includes("document") ||
    mimeType?.includes("msword")
  ) {
    return "SOP";
  }
  return "Other";
}
