import * as z from "zod";
import { ELeaveType } from "@/enums";

export const leaveFormSchema = z
  .object({
    employeeId: z.string().optional(),
    leaveType: z.nativeEnum(ELeaveType),
    startDate: z.string().min(1, "Start date is required"),
    endDate: z.string().min(1, "End date is required"),
    reason: z.string().min(5, "Reason must be at least 5 characters long"),
    isHalfDay: z.boolean(),
    lateNotice: z.boolean(),
    isAuthorized: z.boolean(),
    adminNote: z.string(),
  })
  .refine(
    (data) => {
      const start = new Date(data.startDate);
      const end = new Date(data.endDate);
      return start <= end;
    },
    {
      message: "End date must be on or after start date",
      path: ["endDate"],
    },
  )
  .refine(
    (data) => {
      if (!data.isHalfDay) return true;
      return data.startDate === data.endDate;
    },
    {
      message: "Half-day leave must have the same start and end date",
      path: ["endDate"],
    },
  );
