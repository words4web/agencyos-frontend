import React from "react";
import { AlertCircle, RefreshCcw } from "lucide-react";
import { Button } from "./Button";
import { CommonErrorProps } from "@/types/common/common.types";

export const CommonError: React.FC<CommonErrorProps> = ({
  message = "Something went wrong. Please try again.",
  onRetry,
  fullScreen = false,
  compact = false,
}) => {
  if (compact) {
    return (
      <div className="flex flex-col items-center justify-center p-4 text-center border border-dashed border-slate-800 bg-slate-900/40 rounded-xl w-full min-h-[120px] animate-in fade-in duration-200">
        <AlertCircle className="h-5 w-5 text-red-500 mb-1.5" />
        <h4 className="text-xs font-semibold text-slate-100 mb-1">Error</h4>
        <p className="text-[11px] text-slate-400 mb-2 max-w-[200px] leading-normal">
          {message}
        </p>
        {onRetry && (
          <Button
            onClick={onRetry}
            variant="secondary"
            className="flex items-center gap-1 text-[10px] h-7 px-2.5 py-0">
            <RefreshCcw size={12} />
            Try Again
          </Button>
        )}
      </div>
    );
  }

  const content = (
    <div className="flex flex-col items-center justify-center p-8 text-center animate-in fade-in zoom-in-95 duration-300">
      <div className="mb-4 rounded-full bg-red-950/20 border border-red-800/40 p-3 text-red-400">
        <AlertCircle className="h-10 w-10" />
      </div>
      <h3 className="mb-2 text-lg font-semibold text-slate-100">Error</h3>
      <p className="mb-6 max-w-xs text-sm text-slate-400">{message}</p>
      {onRetry && (
        <Button
          onClick={onRetry}
          variant="secondary"
          className="flex items-center gap-2">
          <RefreshCcw size={16} />
          Try Again
        </Button>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm">
        {content}
      </div>
    );
  }

  return (
    <div className="flex min-h-[250px] w-full items-center justify-center rounded-xl border border-dashed border-slate-800 bg-slate-900/20">
      {content}
    </div>
  );
};
