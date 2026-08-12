import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AxiosError } from "axios";
import { Modal } from "@/components/Modal";
import { Input } from "@/components/Input";
import { Button } from "@/components/Button";
import { ShieldAlert } from "lucide-react";
import {
  addAssetSchema,
  AddAssetFormValues,
} from "@/schemas/project/project.schema";
import { useAddAsset } from "@/services/project/project.hooks";
import { AddAssetModalProps } from "@/types/project/project.types";

export function AddAssetModal({
  isOpen,
  onClose,
  projectId,
}: AddAssetModalProps) {
  const addAssetMutation = useAddAsset();
  const [formError, setFormError] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AddAssetFormValues>({
    resolver: zodResolver(addAssetSchema),
    defaultValues: {
      name: "",
      url: "",
      category: "Brand Kit",
    },
  });

  const onSubmit = (data: AddAssetFormValues) => {
    setFormError("");
    addAssetMutation.mutate(
      { projectId, payload: data },
      {
        onSuccess: () => {
          reset();
          onClose();
        },
        onError: (err) => {
          const axiosError = err as AxiosError<{ message?: string }>;
          setFormError(
            axiosError.response?.data?.message || "Failed to add asset",
          );
        },
      },
    );
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add Project Asset">
      {formError && (
        <div className="mb-4 p-3 bg-red-950/20 border border-red-800/40 rounded-lg text-xs text-red-400 flex items-center gap-2">
          <ShieldAlert size={16} />
          {formError}
        </div>
      )}
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <Input
          id="assetName"
          label="Asset Title"
          placeholder="Logo Kit / SOP Document"
          error={errors.name?.message}
          {...register("name")}
        />
        <Input
          id="assetUrl"
          label="Resource URL"
          placeholder="https://drive.google.com/..."
          error={errors.url?.message}
          {...register("url")}
        />
        <div className="flex flex-col gap-1">
          <label className="text-sm font-semibold text-slate-300">
            Category
          </label>
          <select
            className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-slate-100 focus:outline-none focus:border-indigo-500 text-sm"
            {...register("category")}>
            <option value="Brand Kit">Brand Kit</option>
            <option value="Design File">Design File</option>
            <option value="SOP">SOP</option>
            <option value="URL">URL</option>
            <option value="Other">Other</option>
          </select>
          {errors.category && (
            <p className="text-xs text-red-400">{errors.category.message}</p>
          )}
        </div>
        <div className="flex gap-3 justify-end mt-4">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={addAssetMutation.isPending}>
            {addAssetMutation.isPending ? "Adding..." : "Add Asset"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
