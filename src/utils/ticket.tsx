import {
  ITicket as Ticket,
  FormatTicketDateOptions,
} from "@/types/ticket/ticket.types";

export const getPriorityBadge = (p: Ticket["priority"]) => {
  const styles = {
    low: "bg-slate-800 text-slate-400 border-slate-700",
    medium: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    high: "bg-red-500/10 text-red-400 border-red-500/20",
  };
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded border text-[10px] font-semibold uppercase tracking-wider ${styles[p]}`}>
      {p}
    </span>
  );
};

export const formatTicketDate = (
  dateStr?: string,
  options: FormatTicketDateOptions = {},
) => {
  const {
    withTime = false,
    withYear = true,
    fallback = "Not specified",
  } = options;
  if (!dateStr) return withTime ? "" : fallback;
  const formatOptions: Intl.DateTimeFormatOptions = {
    month: "short",
    day: "numeric",
    ...(withYear && { year: "numeric" }),
    ...(withTime && { hour: "2-digit", minute: "2-digit" }),
  };
  return withTime
    ? new Date(dateStr)?.toLocaleString(undefined, formatOptions)
    : new Date(dateStr)?.toLocaleDateString(undefined, formatOptions);
};
