import { TimelineCardProps } from "@/types/ticket/ticket.types";
import { Info } from "lucide-react";

export function TimelineCard({
  icon,
  iconBg,
  label,
  value,
  tooltip,
}: TimelineCardProps) {
  return (
    <div className="flex items-center gap-2.5">
      <div className={`p-2 rounded-lg ${iconBg}`}>{icon}</div>
      <div className="flex flex-col">
        <span className="text-[10px] uppercase font-bold text-slate-500 flex items-center gap-0.5">
          {label}
          {tooltip && (
            <span
              title={tooltip}
              className="cursor-help text-slate-500 hover:text-indigo-400 transition-colors">
              <Info size={10} />
            </span>
          )}
        </span>
        <span className="text-xs font-semibold text-slate-200">{value}</span>
      </div>
    </div>
  );
}
