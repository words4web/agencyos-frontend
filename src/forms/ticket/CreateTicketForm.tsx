import { useState } from "react";
import { useForm, useWatch, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  createTicketSchema,
  CreateTicketFormValues,
} from "@/schemas/ticket/ticket.schema";
import { Input } from "@/components/Input";
import { Button } from "@/components/Button";
import {
  ShieldAlert,
  Info,
  Paperclip,
  Plus,
  FileText,
  Folder,
} from "lucide-react";
import { ETicketStatus, ETicketPriority } from "@/enums";
import { CreateTicketFormProps } from "@/types/ticket/ticket.types";
import { formatLocalDateTime } from "@/utils/ticket";
import { useGetWorkTypes } from "@/services/workType/workType.hooks";
import { ProjectAssetPickerModal } from "@/components/ticket/ProjectAssetPickerModal";
import { IProjectAsset } from "@/types/project/project.types";

export function CreateTicketForm({
  projects,
  employees,
  onSubmit,
  onCancel,
  serverError,
  isPending,
}: CreateTicketFormProps) {
  const { data: rawWorkTypes = [] } = useGetWorkTypes();
  const workTypes = Array.isArray(rawWorkTypes) ? rawWorkTypes : [];

  const [selectedAssetIds, setSelectedAssetIds] = useState<string[]>([]);
  const [isAssetPickerOpen, setIsAssetPickerOpen] = useState(false);

  const [initialDates] = useState(() => {
    const now = new Date();
    const oneHourLater = new Date(now.getTime() + 60 * 60 * 1000);
    return {
      startDate: formatLocalDateTime(now),
      dueDate: formatLocalDateTime(oneHourLater),
    };
  });

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<CreateTicketFormValues>({
    resolver: zodResolver(createTicketSchema),
    defaultValues: {
      title: "",
      description: "",
      project: "",
      assignee: "",
      workType: "",
      status: ETicketStatus.TODO,
      priority: ETicketPriority.MEDIUM,
      dueDate: initialDates.dueDate,
      storyPoints: undefined,
      estimatedHours: undefined,
      tags: "",
      startDate: initialDates.startDate,
    },
  });

  const startDateValue = useWatch({
    control,
    name: "startDate",
    defaultValue: initialDates.startDate,
  });

  const selectedProjectId = useWatch({
    control,
    name: "project",
  });

  const selectedWorkTypeId = useWatch({
    control,
    name: "workType",
  });

  const activeWorkTypeObj = workTypes?.find(
    (wt) => wt?._id === selectedWorkTypeId,
  );

  const currentProject = projects?.find((p) => p?._id === selectedProjectId);
  const projectAssets: IProjectAsset[] = currentProject?.assets || [];

  const attachedAssets: IProjectAsset[] = selectedAssetIds
    ?.map((id) =>
      projectAssets?.find((a) => a?._id?.toString() === id || a?.name === id),
    )
    ?.filter((a): a is IProjectAsset => a !== undefined);

  const handleFormSubmit: SubmitHandler<CreateTicketFormValues> = (data) => {
    let checklist;
    if (data?.workType) {
      const selectedWorkType = workTypes?.find(
        (wt) => wt?._id === data?.workType,
      );
      if (selectedWorkType?.items) {
        checklist = selectedWorkType?.items?.map((item) => ({
          label: item?.label,
          isCompleted: false,
        }));
      }
    }

    onSubmit({
      ...data,
      workType: data?.workType || undefined,
      checklist,
      assets: selectedAssetIds,
    });
  };

  return (
    <form
      onSubmit={handleSubmit(handleFormSubmit)}
      className="flex flex-col gap-4">
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
            <option value="">Select Employee</option>
            {employees?.map((e) => (
              <option key={e?._id} value={e?._id}>
                {e?.name} ({e?.designation})
              </option>
            ))}
          </select>
          {errors.assignee && (
            <span className="text-xs text-red-400">
              {errors.assignee.message}
            </span>
          )}
        </div>
      </div>

      <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
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
          type="datetime-local"
          {...register("startDate")}
          error={errors?.startDate?.message}
        />
        <Input
          id="dueDate"
          label="Due Date"
          type="datetime-local"
          min={startDateValue}
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

      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-semibold text-slate-300">
          Work Type (Deliverable Checklist Template)
        </label>
        <select
          {...register("workType")}
          className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-slate-100 text-sm focus:outline-none focus:border-indigo-500 font-medium">
          <option value="">None (Standard Ticket)</option>
          {workTypes?.map((wt) => (
            <option key={wt?._id} value={wt?._id}>
              {wt?.name} ({wt?.items?.length || 0} deliverable items)
            </option>
          ))}
        </select>

        {activeWorkTypeObj &&
          activeWorkTypeObj?.items &&
          activeWorkTypeObj?.items?.length > 0 && (
            <div className="mt-1 p-3 bg-purple-950/20 border border-purple-900/40 rounded-xl flex flex-col gap-2">
              <span className="text-[11px] font-bold uppercase text-purple-400 flex items-center gap-1.5">
                <Info size={13} /> Default Checklist Items for &quot;
                {activeWorkTypeObj?.name}&quot;
              </span>
              <div className="flex flex-wrap gap-1.5">
                {activeWorkTypeObj?.items?.map((item, idx) => (
                  <span
                    key={idx}
                    className="text-xs bg-purple-950/60 border border-purple-800/60 text-purple-200 px-2.5 py-1 rounded-lg">
                    ✓ {item?.label}
                  </span>
                ))}
              </div>
            </div>
          )}
      </div>

      <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Paperclip size={16} className="text-indigo-400" />
            <span className="text-xs font-semibold text-slate-200">
              Attach Project Assets ({attachedAssets.length})
            </span>
          </div>
          <Button
            type="button"
            variant="secondary"
            disabled={!selectedProjectId}
            onClick={() => setIsAssetPickerOpen(true)}
            className="text-xs flex items-center gap-1.5 py-1 px-2.5">
            <Plus size={13} /> Select Assets
          </Button>
        </div>

        {!selectedProjectId ? (
          <p className="text-[11px] text-slate-500 italic">
            Select a project above first to attach its files or folders.
          </p>
        ) : attachedAssets?.length === 0 ? (
          <p className="text-[11px] text-slate-500">
            No assets attached yet. Click &quot;Select Assets&quot; to pick from
            project files.
          </p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {attachedAssets?.map((asset) => (
              <span
                key={asset?._id?.toString() || asset?.name}
                className="text-xs bg-slate-950/80 border border-slate-800 text-slate-300 px-2.5 py-1 rounded-lg flex items-center gap-1.5 font-medium">
                {asset?.isFolder ? (
                  <Folder size={12} className="text-amber-400" />
                ) : (
                  <FileText size={12} className="text-indigo-400" />
                )}
                {asset?.name}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
        <div className="flex flex-col gap-0.5">
          <label
            htmlFor="requiresReviewToggle"
            className="text-xs font-semibold text-slate-200 cursor-pointer flex items-center gap-1.5">
            Require Admin Review Before Completion
          </label>
          <p className="text-[11px] text-slate-400">
            If enabled, employee cannot mark this ticket as Completed directly.
            Only Admins can approve it out of review.
          </p>
        </div>
        <input
          id="requiresReviewToggle"
          type="checkbox"
          {...register("requiresReview")}
          className="w-4 h-4 rounded border-slate-700 bg-slate-950 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
        />
      </div>

      <div className="flex gap-3 justify-end mt-4">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={isPending}>
          {isPending ? "Creating..." : "Create Ticket"}
        </Button>
      </div>

      <ProjectAssetPickerModal
        isOpen={isAssetPickerOpen}
        onClose={() => setIsAssetPickerOpen(false)}
        projectAssets={projectAssets}
        googleDriveFolderId={currentProject?.googleDriveFolderId}
        selectedAssetIds={selectedAssetIds}
        onSelectAssets={setSelectedAssetIds}
      />
    </form>
  );
}
