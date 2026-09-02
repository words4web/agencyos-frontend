import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AxiosError } from "axios";
import { Modal } from "@/components/Modal";
import { Input } from "@/components/Input";
import { Button } from "@/components/Button";
import { ShieldAlert } from "lucide-react";
import {
  updateProjectSchema,
  UpdateProjectFormValues,
} from "@/schemas/project/project.schema";
import { useUpdateProject } from "@/services/project/project.hooks";
import { EditProjectModalProps } from "@/types/project/project.types";

export function EditProjectModal({
  isOpen,
  onClose,
  project,
}: EditProjectModalProps) {
  const updateProjectMutation = useUpdateProject();
  const [formError, setFormError] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UpdateProjectFormValues>({
    resolver: zodResolver(updateProjectSchema),
    defaultValues: {
      name: "",
      clientName: "",
      clientEmail: "",
      description: "",
    },
  });

  useEffect(() => {
    if (project) {
      reset({
        name: project.name || "",
        clientName: project.clientName || "",
        clientEmail: project.clientEmail || "",
        description: project.description || "",
      });
    }
  }, [project, reset]);

  const onSubmit = (data: UpdateProjectFormValues) => {
    if (!project) return;
    setFormError("");
    updateProjectMutation.mutate(
      {
        projectId: project._id,
        payload: {
          name: data.name,
          clientName: data.clientName,
          clientEmail: data.clientEmail,
          description: data.description ?? "",
        },
      },
      {
        onSuccess: () => {
          onClose();
        },
        onError: (err) => {
          const axiosError = err as AxiosError<{ message?: string }>;
          setFormError(
            axiosError.response?.data?.message || "Failed to update project",
          );
        },
      },
    );
  };

  const handleClose = () => {
    setFormError("");
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      closeOnBackdropClick={false}
      title="Edit Project Details">
      {formError && (
        <div className="mb-4 p-3 bg-red-950/20 border border-red-800/40 rounded-lg text-xs text-red-400 flex items-center gap-2">
          <ShieldAlert size={16} />
          {formError}
        </div>
      )}
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <Input
          id="editProjName"
          label="Project Name"
          placeholder="Sartaj Foods Marketing Campaign"
          error={errors.name?.message}
          {...register("name")}
        />
        <Input
          id="editClientName"
          label="Client Contact Name"
          placeholder="Harpreet Singh"
          error={errors.clientName?.message}
          {...register("clientName")}
        />
        <Input
          id="editClientEmail"
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
          <Button type="button" variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={updateProjectMutation.isPending}>
            {updateProjectMutation.isPending ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
