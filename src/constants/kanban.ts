import { ITicket as Ticket } from "@/types/ticket/ticket.types";
import { ETicketStatus } from "@/enums";

export const KANBAN_COLUMNS: {
  key: Ticket["status"];
  label: string;
  color: string;
}[] = [
  {
    key: ETicketStatus.BACKLOG,
    label: "Backlog",
    color: "border-t-slate-500 bg-slate-500/5",
  },
  {
    key: ETicketStatus.TODO,
    label: "Todo",
    color: "border-t-blue-500 bg-blue-500/5",
  },
  {
    key: ETicketStatus.IN_PROGRESS,
    label: "In Progress",
    color: "border-t-amber-500 bg-amber-500/5",
  },
  {
    key: ETicketStatus.IN_REVIEW,
    label: "In Review",
    color: "border-t-purple-500 bg-purple-500/5",
  },
  {
    key: ETicketStatus.COMPLETED,
    label: "Completed",
    color: "border-t-emerald-500 bg-emerald-500/5",
  },
];
