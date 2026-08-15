import { Calendar, Zap, Clock, Info } from "lucide-react";
import { GetTimelineItemsParams } from "@/types/ticket/ticket.types";

export function getTicketTimelineItems({
  ticket,
  formatDate,
  localStartDate,
  setLocalStartDate,
  localDueDate,
  setLocalDueDate,
  localStoryPoints,
  setLocalStoryPoints,
  localEstimatedHours,
  setLocalEstimatedHours,
  inputClass,
}: GetTimelineItemsParams) {
  return [
    {
      label: "Start Date",
      icon: <Calendar size={14} />,
      iconBg: "bg-slate-500/10 text-slate-400",
      staticVal: formatDate(ticket?.startDate, { withTime: true }),
      input: (
        <input
          type="datetime-local"
          className={inputClass}
          value={localStartDate}
          onChange={(e) => setLocalStartDate(e.target.value)}
        />
      ),
    },
    {
      label: "Due Date",
      icon: <Calendar size={14} />,
      iconBg: "bg-rose-500/10 text-rose-400",
      staticVal: formatDate(ticket?.dueDate, { withTime: true }),
      input: (
        <input
          type="datetime-local"
          className={inputClass}
          value={localDueDate}
          onChange={(e) => setLocalDueDate(e.target.value)}
          min={localStartDate}
        />
      ),
    },
    {
      label: "Story Points",
      icon: <Zap size={14} />,
      iconBg: "bg-amber-500/10 text-amber-400",
      tooltip: (
        <span
          title="Story points measure the relative complexity, effort, and risk of a task, rather than hours."
          className="cursor-help text-slate-500 hover:text-indigo-400 transition-colors">
          <Info size={10} />
        </span>
      ),
      staticVal: ticket?.storyPoints ?? "Not estimated",
      input: (
        <input
          type="number"
          className={`${inputClass} [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none`}
          value={localStoryPoints}
          onChange={(e) => setLocalStoryPoints(e.target.value)}
          placeholder="Not estimated"
          min="0"
          step="1"
        />
      ),
    },
    {
      label: "Estimated Time",
      icon: <Clock size={14} />,
      iconBg: "bg-sky-500/10 text-sky-400",
      staticVal: ticket?.estimatedHours
        ? `${ticket.estimatedHours} hrs`
        : "Not estimated",
      input: (
        <input
          type="number"
          className={`${inputClass} [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none`}
          value={localEstimatedHours}
          onChange={(e) => setLocalEstimatedHours(e.target.value)}
          placeholder="Not estimated"
          min="0"
          step="0.5"
        />
      ),
    },
  ];
}
