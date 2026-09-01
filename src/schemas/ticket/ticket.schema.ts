import { z } from "zod";
import { ETicketStatus, ETicketPriority } from "@/enums";

export const createTicketSchema = z
  .object({
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
    requiresReview: z.boolean().optional(),
    workType: z.string().optional(),
    checklist: z
      .array(
        z.object({
          label: z.string(),
          isCompleted: z.boolean(),
        }),
      )
      .optional(),
  })
  .refine(
    (data) => {
      if (data.startDate && data.dueDate) {
        return new Date(data.dueDate) >= new Date(data.startDate);
      }
      return true;
    },
    {
      message: "Due Date cannot be earlier than Start Date",
      path: ["dueDate"],
    },
  );

export const addCommentSchema = z.object({
  content: z.string().min(1, "Please type message"),
});

export type CreateTicketFormValues = z.infer<typeof createTicketSchema>;
export type AddCommentFormValues = z.infer<typeof addCommentSchema>;
