import { z } from "zod";
import { ETicketStatus, ETicketPriority } from "@/enums";

export const createTicketSchema = z.object({
  title: z.string().min(1, "Ticket title is required"),
  description: z.string().optional(),
  project: z.string().min(1, "Project is required"),
  assignee: z.string().min(1, "Assignee is required"),
  status: z.nativeEnum(ETicketStatus),
  priority: z.nativeEnum(ETicketPriority),
  dueDate: z.string().optional(),
  storyPoints: z.number().int().positive().optional(),
  estimatedHours: z.number().positive().optional(),
  tags: z.string().optional(),
  startDate: z.string().optional(),
});

export const addCommentSchema = z.object({
  content: z.string().min(1, "Comment content cannot be empty"),
});

export type CreateTicketFormValues = z.infer<typeof createTicketSchema>;
export type AddCommentFormValues = z.infer<typeof addCommentSchema>;
