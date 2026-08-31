import { z } from "zod";
import { EEventType } from "@/enums";

export const eventFormSchema = z
  .object({
    title: z.string().min(1, "Event title is required"),
    description: z.string().optional(),
    type: z.enum([EEventType.HOLIDAY, EEventType.MEETING, EEventType.REMINDER, EEventType.LEAVE]),
    date: z.string().min(1, "Event date is required"),
    time: z.string().optional(),
    meetingLink: z.string().optional(),
    participants: z.array(z.string()).optional(),
  })
  .refine(
    (data) => {
      if (data.type !== EEventType.HOLIDAY && !data.time) {
        return false;
      }
      return true;
    },
    {
      message: "Time is required for meetings and reminders",
      path: ["time"],
    },
  )
  .refine(
    (data) => {
      if (data.type === EEventType.MEETING) {
        if (!data.meetingLink) return false;
        try {
          new URL(data.meetingLink);
          return true;
        } catch {
          return false;
        }
      }
      return true;
    },
    {
      message: "A valid meeting URL is required for meetings",
      path: ["meetingLink"],
    },
  );

export type EventFormValues = z.infer<typeof eventFormSchema>;
