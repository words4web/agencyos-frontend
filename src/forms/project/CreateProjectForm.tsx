import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  createProjectSchema,
  CreateProjectFormValues,
} from "@/schemas/project/project.schema";
import { Input } from "@/components/Input";
import { Button } from "@/components/Button";
import { ShieldAlert } from "lucide-react";
import { CreateProjectFormProps } from "@/types/project/project.types";

export function CreateProjectForm({
  onSubmit,
  onCancel,
  serverError,
  isPending,
}: CreateProjectFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateProjectFormValues>({
    resolver: zodResolver(createProjectSchema),
    defaultValues: {
      name: "",
      clientName: "",
      clientEmail: "",
      description: "",
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      {serverError && (
        <div className="p-3 bg-red-950/20 border border-red-800/40 rounded-lg text-xs text-red-400 flex items-center gap-2">
          <ShieldAlert size={16} />
          {serverError}
        </div>
      )}

      <Input
        id="projName"
        label="Project Name"
        placeholder="Sartaj Foods Marketing Campaign"
        error={errors.name?.message}
        {...register("name")}
      />

      <Input
        id="clientName"
        label="Client Contact Name"
        placeholder="Harpreet Singh"
        error={errors.clientName?.message}
        {...register("clientName")}
      />

      <Input
        id="clientEmail"
        type="email"
        label="Client Email Address"
        placeholder="harpreet@sartajfoods.jp"
        error={errors.clientEmail?.message}
        {...register("clientEmail")}
      />

      <div className="flex flex-col gap-1">
        <label className="text-sm font-semibold text-slate-300">
          Description
        </label>
        <textarea
          className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-sm"
          rows={3}
          placeholder="Provide a brief summary of the campaign and brand directives..."
          {...register("description")}
        />
      </div>

      <div className="flex gap-3 justify-end mt-4">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={isPending}>
          {isPending ? "Creating..." : "Create Project"}
        </Button>
      </div>
    </form>
  );
}
