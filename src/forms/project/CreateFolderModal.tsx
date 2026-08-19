import { useState } from "react";
import { useForm } from "react-hook-form";
import { Modal } from "@/components/Modal";
import { Button } from "@/components/Button";
import { FolderPlus } from "lucide-react";
import { useCreateSubFolder } from "@/services/project/project.hooks";
import { toast } from "sonner";
import { CreateFolderModalProps } from "@/types/project/project.types";

export function CreateFolderModal({
  isOpen,
  onClose,
  projectId,
  parentFolderId,
}: CreateFolderModalProps) {
  const createSubFolderMutation = useCreateSubFolder();
  const [errorMsg, setErrorMsg] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<{ name: string }>({
    defaultValues: { name: "" },
  });

  const onSubmit = async (values: { name: string }) => {
    setErrorMsg("");
    try {
      await createSubFolderMutation.mutateAsync({
        projectId,
        parentFolderId,
        name: values.name,
      });
      toast.success("Folder created successfully");
      handleClose();
    } catch (err: any) {
      setErrorMsg(err?.response?.data?.message || "Failed to create folder");
    }
  };

  const handleClose = () => {
    reset();
    setErrorMsg("");
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      size="max-w-md"
      title="Create Folder">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-2">
        <div className="flex items-center gap-3 p-3 bg-indigo-950/20 border border-indigo-900/40 rounded-xl text-indigo-400">
          <FolderPlus size={20} className="shrink-0" />
          <p className="text-xs leading-relaxed">
            Create a new folder to organize your project files.
          </p>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-400 uppercase tracking-wide mb-2">
            Folder Name
          </label>
          <input
            type="text"
            placeholder="Enter folder name..."
            className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
            {...register("name", {
              required: "Folder name is required",
              maxLength: {
                value: 60,
                message: "Folder name cannot exceed 60 characters",
              },
            })}
          />
          {errors.name && (
            <p className="text-xs text-red-400 mt-1">{errors.name.message}</p>
          )}
        </div>

        {errorMsg && (
          <p className="text-xs text-red-400 text-center">{errorMsg}</p>
        )}

        <div className="flex items-center justify-end gap-2.5 pt-2">
          <Button
            type="button"
            variant="secondary"
            onClick={handleClose}
            className="text-xs font-semibold py-2 px-4.5">
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting || createSubFolderMutation.isPending}
            className="text-xs font-semibold py-2 px-4.5 bg-indigo-600 hover:bg-indigo-500">
            {createSubFolderMutation.isPending ? "Creating..." : "Create"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
