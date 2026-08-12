import { useState } from "react";
import { Modal } from "@/components/Modal";
import { useCreateProject } from "@/services/project/project.hooks";
import { CreateProjectModalProps } from "@/types/project/project.types";
import { CreateProjectFormValues } from "@/schemas/project/project.schema";
import { CreateProjectForm } from "@/forms/project/CreateProjectForm";

export function CreateProjectModal({
  isOpen,
  onClose,
}: CreateProjectModalProps) {
  const createProjectMutation = useCreateProject();
  const [serverError, setServerError] = useState("");

  const handleSubmit = (values: CreateProjectFormValues) => {
    setServerError("");

    createProjectMutation.mutate(values, {
      onSuccess: () => {
        onClose();
      },
      onError: (err: unknown) => {
        const error = err as { response?: { data?: { message?: string } } };
        setServerError(
          error.response?.data?.message || "Failed to create project",
        );
      },
    });
  };

  const handleClose = () => {
    setServerError("");
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Create New Project">
      <CreateProjectForm
        onSubmit={handleSubmit}
        onCancel={handleClose}
        serverError={serverError}
        isPending={createProjectMutation.isPending}
      />
    </Modal>
  );
}
