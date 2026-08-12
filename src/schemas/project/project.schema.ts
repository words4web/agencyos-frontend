import { z } from "zod";

export const createProjectSchema = z.object({
  name: z.string().min(1, "Project name is required"),
  clientName: z.string().min(1, "Client name is required"),
  clientEmail: z
    .string()
    .min(1, "Client email is required")
    .email("Invalid email format"),
  description: z.string().optional(),
});

export const assignEmployeesSchema = z.object({
  employeeIds: z
    .array(z.string())
    .min(1, "At least one employee must be selected"),
});

export const addAssetSchema = z.object({
  name: z.string().min(1, "Asset name is required"),
  url: z.string().min(1, "Asset URL is required").url("Invalid URL format"),
  category: z.string().min(1, "Category is required"),
});

export type CreateProjectFormValues = z.infer<typeof createProjectSchema>;
export type AssignEmployeesFormValues = z.infer<typeof assignEmployeesSchema>;
export type AddAssetFormValues = z.infer<typeof addAssetSchema>;
