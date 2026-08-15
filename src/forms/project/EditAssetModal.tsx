"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AxiosError } from "axios";
import { Modal } from "@/components/Modal";
import { Input } from "@/components/Input";
import { Button } from "@/components/Button";
import { ShieldAlert, Trash2 } from "lucide-react";
import {
  editAssetSchema,
  EditAssetFormValues,
} from "@/schemas/project/project.schema";
import {
  useUpdateAsset,
  useDeleteAsset,
  useRenameFolder,
} from "@/services/project/project.hooks";
import { EditAssetModalProps } from "@/types/project/project.types";
import { ConfirmModal } from "@/components/ConfirmModal";
import { EAssetProvider } from "@/enums";

export function EditAssetModal({
  isOpen,
  onClose,
  projectId,
  asset,
}: EditAssetModalProps) {
  const updateAssetMutation = useUpdateAsset();
  const deleteAssetMutation = useDeleteAsset();
  const renameFolderMutation = useRenameFolder();
  const [formError, setFormError] = useState("");
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<EditAssetFormValues>({
    resolver: zodResolver(editAssetSchema),
    defaultValues: {
      name: "",
      url: "",
      category: "Brand Kit",
    },
  });

  useEffect(() => {
    if (asset) {
      reset({
        name: asset.name,
        url: asset.url,
        category: asset.category,
      });
    }
  }, [asset, reset]);

  const onSubmit = (data: EditAssetFormValues) => {
    if (!asset?._id) return;
    setFormError("");

    if (asset.isFolder) {
      renameFolderMutation.mutate(
        { projectId, assetId: asset._id, name: data.name },
        {
          onSuccess: () => {
            onClose();
          },
          onError: (err) => {
            const axiosError = err as AxiosError<{ message?: string }>;
            setFormError(
              axiosError.response?.data?.message || "Failed to rename folder",
            );
          },
        },
      );
      return;
    }

    updateAssetMutation.mutate(
      { projectId, assetId: asset._id, payload: data },
      {
        onSuccess: () => {
          onClose();
        },
        onError: (err) => {
          const axiosError = err as AxiosError<{ message?: string }>;
          setFormError(
            axiosError.response?.data?.message || "Failed to update asset",
          );
        },
      },
    );
  };

  const handleConfirmDelete = () => {
    if (!asset?._id) return;
    setFormError("");
    deleteAssetMutation.mutate(
      { projectId, assetId: asset._id },
      {
        onSuccess: () => {
          setIsConfirmDeleteOpen(false);
          onClose();
        },
        onError: (err) => {
          const axiosError = err as AxiosError<{ message?: string }>;
          setFormError(
            axiosError.response?.data?.message || "Failed to delete asset",
          );
          setIsConfirmDeleteOpen(false);
        },
      },
    );
  };

  const isPending =
    updateAssetMutation.isPending || renameFolderMutation.isPending;

  return (
    <>
      <ConfirmModal
        isOpen={isConfirmDeleteOpen}
        title={asset?.isFolder ? "Delete Folder" : "Delete Asset"}
        description={
          asset?.isFolder
            ? "Are you sure you want to delete this folder? All subfolders and files inside it will also be deleted."
            : "Are you sure you want to delete this asset? If this is a Google Drive file, it will also be moved to the trash."
        }
        confirmLabel="Delete"
        variant="danger"
        isLoading={deleteAssetMutation.isPending}
        onConfirm={handleConfirmDelete}
        onClose={() => setIsConfirmDeleteOpen(false)}
      />
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        title={asset?.isFolder ? "Manage Folder" : "Manage Project Asset"}>
        {formError && (
          <div className="mb-4 p-3 bg-red-950/20 border border-red-800/40 rounded-lg text-xs text-red-400 flex items-center gap-2">
            <ShieldAlert size={16} />
            {formError}
          </div>
        )}
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <Input
            id="editAssetName"
            label={asset?.isFolder ? "Folder Name" : "Asset Title"}
            placeholder="Logo Kit / SOP Document"
            error={errors.name?.message}
            {...register("name")}
          />
          {!asset?.isFolder && (
            <>
              {asset?.provider === EAssetProvider.URL && (
                <Input
                  id="editAssetUrl"
                  label="Resource URL"
                  placeholder="https://drive.google.com/..."
                  error={errors.url?.message}
                  {...register("url")}
                />
              )}
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
                  <p className="text-xs text-red-400">
                    {errors.category.message}
                  </p>
                )}
              </div>
            </>
          )}
          <div className="flex justify-between items-center mt-6">
            <button
              type="button"
              onClick={() => setIsConfirmDeleteOpen(true)}
              disabled={deleteAssetMutation.isPending}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors">
              <Trash2 size={14} />
              {asset?.isFolder ? "Delete Folder" : "Delete Asset"}
            </button>
            <div className="flex gap-3">
              <Button type="button" variant="secondary" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </div>
        </form>
      </Modal>
    </>
  );
}
