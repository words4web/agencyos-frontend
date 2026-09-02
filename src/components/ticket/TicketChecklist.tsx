import { CheckSquare, Square, CheckCircle2 } from "lucide-react";
import type { IChecklistItem } from "@/types/ticket/ticket.types";

export const TicketChecklist = ({
  checklist,
  description,
  onToggleItem,
  isReadOnly = false,
}: {
  checklist: IChecklistItem[];
  description?: string;
  onToggleItem?: (index: number, isCompleted: boolean) => void;
  isReadOnly?: boolean;
}) => {
  if (!checklist || checklist?.length === 0) return null;

  const completedCount = checklist?.filter((item) => item?.isCompleted)?.length;
  const totalCount = checklist?.length;
  const progressPercent = Math.round((completedCount / totalCount) * 100);
  const isAllDone = completedCount === totalCount;

  return (
    <div
      id="deliverableChecklistSection"
      className="flex flex-col gap-3 p-4 bg-slate-950/60 border border-slate-800 rounded-2xl scroll-mt-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <CheckSquare size={16} className="text-indigo-400" />
          <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
            Deliverable Checklist ({completedCount}/{totalCount})
          </h4>
        </div>
        {isAllDone && (
          <span className="text-[10px] font-semibold text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 px-2 py-0.5 rounded-md flex items-center gap-1">
            <CheckCircle2 size={12} /> Ready for Review
          </span>
        )}
      </div>

      {description && (
        <p className="text-xs text-slate-400 leading-relaxed bg-slate-900/40 p-2.5 rounded-xl border border-slate-850 break-words whitespace-pre-wrap max-h-32 overflow-y-auto">
          {description}
        </p>
      )}

      <div className="w-full bg-slate-900 rounded-full h-1.5 overflow-hidden border border-slate-800">
        <div
          className={`h-full transition-all duration-300 ${
            isAllDone ? "bg-emerald-500" : "bg-indigo-500"
          }`}
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      <div className="flex flex-col gap-2 mt-1">
        {checklist?.map((item, index) => {
          const isChecked = item?.isCompleted;

          return (
            <div
              key={index}
              onClick={() => {
                if (!isReadOnly && onToggleItem) {
                  onToggleItem(index, !isChecked);
                }
              }}
              className={`flex items-start gap-2.5 p-2.5 rounded-xl border text-xs transition-all ${
                isReadOnly ? "cursor-default" : "cursor-pointer"
              } ${
                isChecked
                  ? "bg-emerald-950/20 border-emerald-900/40 text-emerald-300"
                  : "bg-slate-900/60 border-slate-800/80 text-slate-300 hover:border-slate-700"
              }`}>
              <div className="mt-0.5 shrink-0">
                {isChecked ? (
                  <CheckSquare size={15} className="text-emerald-400" />
                ) : (
                  <Square size={15} className="text-slate-500" />
                )}
              </div>
              <span
                className={`flex-1 min-w-0 font-medium leading-snug break-words whitespace-pre-wrap ${
                  isChecked ? "line-through text-emerald-400/80" : ""
                }`}>
                {item?.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
