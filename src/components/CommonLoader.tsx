import React from "react";
import { Loader2 } from "lucide-react";
import { CommonLoaderProps } from "@/types/common/common.types";

export const CommonLoader: React.FC<CommonLoaderProps> = ({
  fullScreen = false,
  message = "Loading...",
}) => {
  const content = (
    <div className="flex flex-col items-center justify-center gap-4 animate-in fade-in duration-500">
      <div className="relative">
        <Loader2 className="h-12 w-12 animate-spin text-indigo-500" />
        <div className="absolute inset-0 h-12 w-12 animate-ping rounded-full bg-indigo-500/20" />
      </div>
      <p className="text-sm font-medium text-slate-400 animate-pulse">
        {message}
      </p>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-[9999] flex h-screen w-screen items-center justify-center bg-slate-950/80 backdrop-blur-sm transition-all duration-300">
        {content}
      </div>
    );
  }

  return (
    <div className="flex h-full w-full min-h-[200px] items-center justify-center">
      {content}
    </div>
  );
};
