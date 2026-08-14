import { AlertCircle, X, ArrowRight } from "lucide-react";
import { FloatingBannerProps } from "@/types/notification/notification.types";

export function FloatingBanner({
  isOpen,
  title,
  description,
  icon: Icon = AlertCircle,
  action,
  onDismiss,
  variant = "info",
}: FloatingBannerProps) {
  if (!isOpen) return null;

  const variantStyles = {
    info: {
      border: "border-red-500/40 bg-red-950/95 shadow-red-950/40",
      text: "text-red-200",
      iconColor: "text-red-400",
      btnBg:
        "bg-red-500/20 hover:bg-red-500/30 text-red-200 hover:text-white border-red-500/30",
    },
    warning: {
      border: "border-orange-500/40 bg-orange-950/95 shadow-orange-950/20",
      text: "text-orange-200",
      iconColor: "text-orange-400",
      btnBg:
        "bg-orange-500/20 hover:bg-orange-500/30 text-orange-200 hover:text-white border-orange-500/30",
    },
    danger: {
      border: "border-rose-500/40 bg-rose-950/95 shadow-rose-950/20",
      text: "text-rose-200",
      iconColor: "text-rose-400",
      btnBg:
        "bg-rose-500/20 hover:bg-rose-500/30 text-rose-200 hover:text-white border-rose-500/30",
    },
    success: {
      border: "border-cyan-500/40 bg-cyan-950/95 shadow-cyan-950/20",
      text: "text-cyan-200",
      iconColor: "text-cyan-400",
      btnBg:
        "bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-200 hover:text-white border-cyan-500/30",
    },
  };

  const style = variantStyles[variant];

  return (
    <div
      role="alert"
      className={`fixed top-3 sm:top-4 left-1/2 -translate-x-1/2 w-[90vw] z-[100] p-3 sm:p-4 rounded-xl sm:rounded-2xl ${style.border} border backdrop-blur-xl shadow-2xl flex items-start gap-2.5 sm:gap-3.5 animate-in fade-in slide-in-from-top-4 duration-300`}>
      <div
        className={`p-1.5 sm:p-2 rounded-lg sm:rounded-xl bg-slate-900/60 border border-slate-800/80 ${style.iconColor} shrink-0 mt-0.5`}>
        <Icon className="h-4.5 w-4.5 sm:h-5 sm:w-5" />
      </div>

      <div className="flex-1 min-w-0 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 pr-1 sm:pr-2">
        <div>
          <h5 className="text-xs sm:text-sm md:text-base font-bold text-slate-100 leading-snug">
            {title}
          </h5>
          {description && (
            <p className="text-[10px] sm:text-xs md:text-sm text-slate-350 leading-relaxed mt-0.5 sm:mt-1">
              {description}
            </p>
          )}
        </div>

        {action && (
          <button
            onClick={action.onClick}
            className={`flex items-center justify-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg sm:rounded-xl text-[10px] sm:text-xs md:text-sm font-semibold transition-all shrink-0 w-full sm:w-auto border border-transparent ${style.btnBg}`}>
            {action.label}
            <ArrowRight size={13} className="shrink-0" />
          </button>
        )}
      </div>

      <button
        onClick={onDismiss}
        aria-label="Dismiss banner"
        className="shrink-0 p-1 rounded-lg text-white hover:text-slate-200 hover:bg-slate-900/60 transition-colors mt-0.5">
        <X className="h-4 sm:h-4.5 w-4 sm:w-4.5" />
      </button>
    </div>
  );
}
