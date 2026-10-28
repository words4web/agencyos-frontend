import { useState } from "react";
import { useForm, useWatch, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  createTicketSchema,
  CreateTicketFormValues,
} from "@/schemas/ticket/ticket.schema";
import { Input } from "@/components/Input";
import { Button } from "@/components/Button";
import { SearchableDropdown } from "@/components/SearchableDropdown";
import {
  ShieldAlert,
  Info,
  Paperclip,
  Plus,
  FileText,
  Folder,
  ArrowRight,
  ArrowLeft,
  Check,
} from "lucide-react";
import { ETicketStatus, ETicketPriority } from "@/enums";
import { CreateTicketFormProps } from "@/types/ticket/ticket.types";
import { formatLocalDateTime, parseLocalDateTimeToISO } from "@/utils/ticket";
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
  const [currentStep, setCurrentStep] = useState<1 | 2>(1);
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
    setValue,
    trigger,
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

  const selectedStatus = useWatch({
    control,
    name: "status",
    defaultValue: ETicketStatus.TODO,
  });

  const selectedProjectId = useWatch({
    control,
    name: "project",
  });

  const selectedAssigneeId = useWatch({
    control,
    name: "assignee",
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
      startDate: parseLocalDateTimeToISO(data?.startDate),
      dueDate: parseLocalDateTimeToISO(data?.dueDate),
      workType: data?.workType || undefined,
      checklist,
      assets: selectedAssetIds,
    });
  };

  const handleNextStep = async () => {
    const isStep1Valid = await trigger(["title", "project", "assignee"]);
    if (isStep1Valid) {
      setCurrentStep(2);
    }
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

      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setCurrentStep(1)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              currentStep === 1
                ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/20"
                : "bg-slate-800/80 text-emerald-400 hover:bg-slate-800 hover:text-emerald-300"
            }`}>
            <span
              className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-bold ${
                currentStep === 1
                  ? "bg-white text-indigo-600"
                  : "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
              }`}>
              {currentStep === 2 ? <Check size={12} /> : "1"}
            </span>
            <span>1. Task Details & Scope</span>
          </button>

          <span className="text-slate-600 text-xs font-bold">→</span>

          <button
            type="button"
            onClick={() => {
              if (currentStep === 1) {
                handleNextStep();
              }
            }}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              currentStep === 2
                ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/20"
                : "bg-slate-800/50 text-slate-400 hover:text-slate-200"
            }`}>
            <span
              className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-bold ${
                currentStep === 2
                  ? "bg-white text-indigo-600"
                  : "bg-slate-700 text-slate-300"
              }`}>
              2
            </span>
            <span>2. Planning & Timeline</span>
          </button>
        </div>

        <span className="text-xs text-slate-400 hidden sm:inline">
          Step {currentStep} of 2
        </span>
      </div>

      <div
        className={`flex flex-col gap-3.5 ${currentStep === 1 ? "block" : "hidden"}`}>
        <Input
          id="ticketTitle"
          label={
            <span>
              Ticket Title <span className="text-rose-400">*</span>
            </span>
          }
          placeholder="e.g. Implement Google OAuth Flow"
          {...register("title")}
          error={errors?.title?.message}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Reusable Searchable & Scrollable Project Dropdown */}
          <SearchableDropdown
            id="ticketProject"
            label={
              <span>
                Project <span className="text-rose-400">*</span>
              </span>
            }
            placeholder="Select Project"
            searchPlaceholder="Search projects..."
            options={
              projects?.map((p) => ({
                value: p?._id,
                label: p?.name,
              })) || []
            }
            value={selectedProjectId}
            onChange={(val) => {
              setValue("project", val, {
                shouldValidate: true,
                shouldDirty: true,
              });
            }}
            error={errors?.project?.message}
          />

          {/* Reusable Searchable & Scrollable Assignee Dropdown */}
          <SearchableDropdown
            id="ticketAssignee"
            label={
              <span>
                Assignee <span className="text-rose-400">*</span>
              </span>
            }
            placeholder="Select Employee"
            searchPlaceholder="Search employees..."
            options={
              employees?.map((e) => ({
                value: e?._id,
                label: e?.name,
                subLabel: e?.designation,
              })) || []
            }
            value={selectedAssigneeId}
            onChange={(val) => {
              setValue("assignee", val, {
                shouldValidate: true,
                shouldDirty: true,
              });
            }}
            error={errors?.assignee?.message}
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm font-semibold text-slate-300">
            Description
          </label>
          <textarea
            className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-sm min-h-[90px] resize-y"
            rows={3}
            placeholder="Outline task details, scope, deliverables, or acceptance criteria..."
            {...register("description")}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <SearchableDropdown
            id="ticketWorkType"
            label="Work Type (Deliverable Checklist Template)"
            placeholder="None (Standard Ticket)"
            searchPlaceholder="Search work types..."
            options={[
              { value: "", label: "None (Standard Ticket)" },
              ...(workTypes?.map((wt) => ({
                value: wt?._id,
                label: wt?.name,
                subLabel: `${wt?.items?.length || 0} deliverable items`,
              })) || []),
            ]}
            value={selectedWorkTypeId || ""}
            onChange={(val) => {
              setValue("workType", val, {
                shouldValidate: true,
                shouldDirty: true,
              });
            }}
            error={errors?.workType?.message}
          />

          {activeWorkTypeObj &&
            activeWorkTypeObj?.items &&
            activeWorkTypeObj?.items?.length > 0 && (
              <div className="mt-1 p-3 bg-purple-950/20 border border-purple-900/40 rounded-xl flex flex-col gap-2">
                <span className="text-[11px] font-bold uppercase text-purple-400 flex items-center gap-1.5">
                  <Info size={13} /> Default Checklist Items for &quot;
                  {activeWorkTypeObj?.name}&quot;
                </span>
                {activeWorkTypeObj?.description && (
                  <p className="text-xs text-purple-200/80 leading-relaxed break-words whitespace-pre-wrap max-h-20 overflow-y-auto">
                    {activeWorkTypeObj?.description}
                  </p>
                )}
                <div className="flex flex-wrap gap-1.5 max-h-28 overflow-y-auto pr-1 custom-scrollbar">
                  {activeWorkTypeObj?.items?.map((item, idx) => (
                    <span
                      key={idx}
                      className="text-xs bg-purple-950/60 border border-purple-800/60 text-purple-200 px-2.5 py-1 rounded-lg break-words max-w-full">
                      ✓ {item?.label}
                    </span>
                  ))}
                </div>
              </div>
            )}
        </div>

        <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex flex-col gap-2.5">
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
              No assets attached yet. Click &quot;Select Assets&quot; to pick
              from project files.
            </p>
          ) : (
            <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto pr-1 custom-scrollbar">
              {attachedAssets?.map((asset) => (
                <span
                  key={asset?._id?.toString() || asset?.name}
                  className="text-xs bg-slate-950/80 border border-slate-800 text-slate-300 px-2.5 py-1 rounded-lg flex items-center gap-1.5 font-medium">
                  {asset?.isFolder ? (
                    <Folder size={12} className="text-amber-400" />
                  ) : (
                    <FileText size={12} className="text-indigo-400" />
                  )}
                  <span className="truncate max-w-[150px]">{asset?.name}</span>
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      <div
        className={`flex flex-col gap-4 ${currentStep === 2 ? "block" : "hidden"}`}>
        <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-sm font-semibold text-slate-300">
              Priority
            </label>
            <select
              {...register("priority")}
              className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-slate-100 text-sm focus:outline-none focus:border-indigo-500">
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
              className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-slate-100 text-sm focus:outline-none focus:border-indigo-500">
              <option value={ETicketStatus.BACKLOG}>Backlog</option>
              <option value={ETicketStatus.TODO}>Todo</option>
              <option value={ETicketStatus.IN_PROGRESS}>In Progress</option>
              <option value={ETicketStatus.IN_REVIEW}>In Review</option>
              <option value={ETicketStatus.COMPLETED}>Completed</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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

        {(selectedStatus === ETicketStatus.IN_REVIEW ||
          selectedStatus === ETicketStatus.COMPLETED) && (
          <Input
            id="actualHours"
            label={
              <span className="flex items-center gap-1">
                Actual Hours Spent
                <span className="text-red-400 font-bold">*</span>
              </span>
            }
            type="number"
            step="0.5"
            placeholder="e.g. 8"
            {...register("actualHours", {
              valueAsNumber: true,
              setValueAs: (v) => (v === "" ? undefined : Number(v)),
            })}
            error={errors?.actualHours?.message}
          />
        )}

        <Input
          id="tags"
          label="Tags (Comma separated)"
          placeholder="ui, backend, bug"
          {...register("tags")}
          error={errors?.tags?.message}
        />

        <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
          <div className="flex flex-col gap-0.5">
            <label
              htmlFor="requiresReviewToggle"
              className="text-xs font-semibold text-slate-200 cursor-pointer flex items-center gap-1.5">
              Require Admin Review Before Completion
            </label>
            <p className="text-[11px] text-slate-400">
              If enabled, employee cannot mark this ticket as Completed
              directly. Only Admins can approve it out of review.
            </p>
          </div>
          <input
            id="requiresReviewToggle"
            type="checkbox"
            {...register("requiresReview")}
            className="w-4 h-4 rounded border-slate-700 bg-slate-950 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
          />
        </div>
      </div>

      <div className="sticky -bottom-6 -mx-6 -mb-6 px-6 py-2.5 bg-slate-900/95 backdrop-blur-md border-t border-slate-800/90 flex items-center justify-between z-10">
        {currentStep === 1 ? (
          <div>
            <Button
              type="button"
              variant="secondary"
              onClick={onCancel}
              className="py-1 px-3 text-xs">
              Cancel
            </Button>
          </div>
        ) : (
          <Button
            type="button"
            variant="secondary"
            onClick={() => setCurrentStep(1)}
            className="py-1 px-3 text-xs flex items-center gap-1.5">
            <ArrowLeft size={13} /> Back
          </Button>
        )}

        <div className="flex items-center gap-2">
          {currentStep === 2 && (
            <Button
              type="button"
              variant="secondary"
              onClick={onCancel}
              className="py-1 px-3 text-xs">
              Cancel
            </Button>
          )}

          {currentStep === 1 ? (
            <Button
              type="button"
              onClick={handleNextStep}
              className="py-1 px-3 text-xs flex items-center gap-1.5">
              Next: Planning & Settings <ArrowRight size={13} />
            </Button>
          ) : (
            <Button
              type="submit"
              disabled={isPending}
              className="py-1 px-3.5 text-xs">
              {isPending ? "Creating..." : "Create Ticket"}
            </Button>
          )}
        </div>
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
