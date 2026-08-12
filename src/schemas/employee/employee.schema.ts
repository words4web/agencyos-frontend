import { z } from "zod";

export const employeeSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().min(1, "Email is required").email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  designation: z.string().min(1, "Designation is required"),
});

export type EmployeeFormValues = z.infer<typeof employeeSchema>;
