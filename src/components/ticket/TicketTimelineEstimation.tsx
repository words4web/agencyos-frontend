import {
  TicketTimelineEstimationProps,
  TimelineCardProps,
} from "@/types/ticket/ticket.types";
import { TimelineCard } from "@/components/ticket/TimelineCard";
import { Calendar, Zap, Clock } from "lucide-react";

export function TicketTimelineEstimation({
  ticket,
  formatDate,
}: TicketTimelineEstimationProps) {
  const items: TimelineCardProps[] = [
    {
      icon: <Calendar size={14} className="text-slate-400" />,
      iconBg: "bg-slate-500/10 border border-slate-500/10",
      label: "Start Date",
      value: formatDate(ticket?.startDate),
    },
    {
      icon: <Calendar size={14} className="text-rose-400" />,
      iconBg: "bg-rose-500/10 border border-rose-500/10",
      label: "Due Date",
      value: formatDate(ticket?.dueDate),
    },
    {
      icon: <Zap size={14} className="text-amber-400" />,
      iconBg: "bg-amber-500/10 border border-amber-500/10",
      label: "Story Points",
      value: ticket?.storyPoints ?? "Not estimated",
      tooltip:
        "Story points measure the relative complexity, effort, and risk of a task, rather than hours.",
    },
    {
      icon: <Clock size={14} className="text-sky-400" />,
      iconBg: "bg-sky-500/10 border border-sky-500/10",
      label: "Estimated Time",
      value: ticket?.estimatedHours
        ? `${ticket.estimatedHours} hrs`
        : "Not estimated",
    },
  ];

  return (
    <div className="flex flex-col gap-3.5 bg-slate-950/40 p-4 border border-slate-800/80 rounded-xl">
      <h6 className="text-[11px] uppercase font-bold text-slate-400 tracking-wider flex items-center gap-1.5 border-b border-slate-900 pb-2 mb-1">
        <Clock size={12} className="text-indigo-400" />
        Timeline & Estimation
      </h6>

      <div className="flex flex-col gap-3">
        {items?.map((item, i) => (
          <TimelineCard key={i} {...item} />
        ))}
      </div>
    </div>
  );
}
