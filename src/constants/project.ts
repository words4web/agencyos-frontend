import React from "react";
import { Palette, FileText, Globe, Package, PenTool } from "lucide-react";

export const ASSET_ICON: Record<
  string,
  { icon: React.ElementType; color: string; bg: string }
> = {
  "Brand Kit": { icon: Palette, color: "text-pink-400", bg: "bg-pink-500/10" },
  "Design File": {
    icon: PenTool,
    color: "text-purple-400",
    bg: "bg-purple-500/10",
  },
  SOP: { icon: FileText, color: "text-amber-400", bg: "bg-amber-500/10" },
  URL: { icon: Globe, color: "text-sky-400", bg: "bg-sky-500/10" },
  Other: { icon: Package, color: "text-slate-400", bg: "bg-slate-500/10" },
};

export const ALLOWED_MIME_TYPES = [
  "image/",
  "video/",
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument",
  "application/vnd.ms-excel",
  "text/plain",
];

export const MAX_FILE_SIZE_MB = 100;
export const MAX_CONCURRENT_FILES = 5;
