import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  createTicketSchema,
  CreateTicketFormValues,
} from "@/schemas/ticket/ticket.schema";
import { Input } from "@/components/Input";
import { Button } from "@/components/Button";
import { ShieldAlert, Info } from "lucide-react";
import { ETicketStatus, ETicketPriority } from "@/enums";
import { CreateTicketFormProps } from "@/types/ticket/ticket.types";

export function CreateTicketForm({
  projects,
  employees,
  onSubmit,
  onCancel,
  serverError,
  isPending,
}: CreateTicketFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateTicketFormValues>({
    resolver: zodResolver(createTicketSchema),
    defaultValues: {
      title: "",
      description: "",
      project: "",
      assignee: "",
      status: ETicketStatus.TODO,
      priority: ETicketPriority.MEDIUM,
      dueDate: "",
      storyPoints: undefined,
      estimatedHours: undefined,
      tags: "",
      startDate: "",
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
        id="ticketTitle"
        label="Ticket Title"
        placeholder="Implement Google OAuth Flow"
        {...register("title")}
        error={errors?.title?.message}
      />

      <div className="flex flex-col gap-1">
        <label className="text-sm font-semibold text-slate-300">
          Description
        </label>
        <textarea
          className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-sm"
          rows={3}
          placeholder="Outline the deliverables..."
          {...register("description")}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-1">
          <label className="text-sm font-semibold text-slate-300">
            Project
          </label>
          <select
            {...register("project")}
            className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-slate-100 text-sm focus:outline-none focus:border-indigo-500">
            <option value="">Select Project</option>
            {projects?.map((p) => (
              <option key={p?._id} value={p?._id}>
                {p?.name}
              </option>
            ))}
          </select>
          {errors.project && (
            <span className="text-xs text-red-400">
              {errors.project.message}
            </span>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm font-semibold text-slate-300">
            Assignee
          </label>
          <select
            {...register("assignee")}
            className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-slate-100 text-sm focus:outline-none focus:border-indigo-500">
            <option value="">Select Assignee</option>
            {employees?.map((emp) => (
              <option key={emp?._id} value={emp?._id}>
                {emp?.name} ({emp?.designation})
              </option>
            ))}
          </select>
          {errors?.assignee && (
            <span className="text-xs text-red-400">
              {errors?.assignee?.message}
            </span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-1">
          <label className="text-sm font-semibold text-slate-300">
            Priority
          </label>
          <select
            {...register("priority")}
            className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-slate-100 text-sm focus:outline-none">
            <option value={ETicketPriority.LOW}>Low</option>
            <option value={ETicketPriority.MEDIUM}>Medium</option>
            <option value={ETicketPriority.HIGH}>High</option>
          </select>
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-sm font-semibold text-slate-300">
            Initial Status
          </label>
          <select
            {...register("status")}
            className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-slate-100 text-sm focus:outline-none">
            <option value={ETicketStatus.BACKLOG}>Backlog</option>
            <option value={ETicketStatus.TODO}>Todo</option>
            <option value={ETicketStatus.IN_PROGRESS}>In Progress</option>
            <option value={ETicketStatus.IN_REVIEW}>In Review</option>
            <option value={ETicketStatus.COMPLETED}>Completed</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Input
          id="startDate"
          label="Start Date"
          type="date"
          {...register("startDate")}
          error={errors?.startDate?.message}
        />
        <Input
          id="dueDate"
          label="Due Date"
          type="date"
          {...register("dueDate")}
          error={errors?.dueDate?.message}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Input
          id="storyPoints"
          label={
            <span className="flex items-center gap-1">
              Story Points
              <span
                title="Story points measure the relative complexity, effort, and risk of a task, rather than hours."
                className="cursor-help text-slate-500 hover:text-indigo-400 transition-colors">
                <Info size={12} />
              </span>
            </span>
          }
          type="number"
          placeholder="e.g. 5"
          {...register("storyPoints", {
            valueAsNumber: true,
            setValueAs: (v) => (v === "" ? undefined : Number(v)),
          })}
          error={errors?.storyPoints?.message}
        />
        <Input
          id="estimatedHours"
          label="Estimated Hours"
          type="number"
          step="0.5"
          placeholder="e.g. 12"
          {...register("estimatedHours", {
            valueAsNumber: true,
            setValueAs: (v) => (v === "" ? undefined : Number(v)),
          })}
          error={errors?.estimatedHours?.message}
        />
      </div>

      <Input
        id="tags"
        label="Tags (Comma separated)"
        placeholder="ui, backend, bug"
        {...register("tags")}
        error={errors?.tags?.message}
      />

      <div className="flex gap-3 justify-end mt-4">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={isPending}>
          {isPending ? "Creating..." : "Create Ticket"}
        </Button>
      </div>
    </form>
  );
}
