import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AxiosError } from "axios";
import { Modal } from "@/components/Modal";
import { ShieldAlert, Link, UploadCloud } from "lucide-react";
import {
  addAssetSchema,
  AddAssetFormValues,
} from "@/schemas/project/project.schema";
import { useAddAsset } from "@/services/project/project.hooks";
import { AddAssetModalProps } from "@/types/project/project.types";
import { useFileUpload } from "@/hooks/useFileUpload";
import { EAssetProvider } from "@/enums";
import { ConfirmModal } from "@/components/ConfirmModal";
import { LinkAssetTab } from "./LinkAssetTab";
import { UploadFilesTab } from "./UploadFilesTab";

export function AddAssetModal({
  isOpen,
  onClose,
  projectId,
}: AddAssetModalProps) {
  const [activeTab, setActiveTab] = useState<"link" | "upload">("link");
  const addAssetMutation = useAddAsset();
  const [formError, setFormError] = useState("");
  const [selectedFiles, setSelectedFiles] = useState<File[] | null>(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AddAssetFormValues>({
    resolver: zodResolver(addAssetSchema),
    defaultValues: { name: "", url: "", category: "Brand Kit" },
  });

  const { uploads, prepareUploads, startUploads, clearUploads, removeUpload } =
    useFileUpload(projectId);

  const onSubmit = (data: AddAssetFormValues) => {
    setFormError("");
    addAssetMutation.mutate(
      { projectId, payload: { ...data, provider: EAssetProvider.URL } },
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

  const handleFilesSelected = (files: File[]) => {
    const validated = prepareUploads(files);
    if (validated) {
      setSelectedFiles((prev) => (prev ? [...prev, ...validated] : validated));
    }
  };

  const handleRemoveSelectedFile = (index: number) => {
    setSelectedFiles((prev) => {
      if (!prev) return null;
      const updated = prev.filter((_, idx) => idx !== index);
      return updated.length > 0 ? updated : null;
    });
  };

  const handleConfirmUpload = () => {
    if (selectedFiles) {
      startUploads(selectedFiles);
      setSelectedFiles(null);
      setIsConfirmOpen(false);
    }
  };

  const handleModalClose = () => {
    reset();
    clearUploads();
    setSelectedFiles(null);
    setIsConfirmOpen(false);
    setFormError("");
    onClose();
  };

  const tabClass = (tab: "link" | "upload") =>
    `flex items-center gap-2 px-4 py-2 text-xs font-semibold uppercase tracking-wide border-b-2 transition-all -mb-px ${
      activeTab === tab
        ? "border-indigo-500 text-indigo-400 font-bold"
        : "border-transparent text-slate-500 hover:text-slate-400"
    }`;

  return (
    <>
      <ConfirmModal
        isOpen={isConfirmOpen}
        title="Upload Files"
        description={`Are you sure you want to upload ${selectedFiles?.length || 0} file(s) directly to this project's Google Drive folder?`}
        confirmLabel="Upload"
        onConfirm={handleConfirmUpload}
        onClose={() => setIsConfirmOpen(false)}
      />
      <Modal
        isOpen={isOpen}
        onClose={handleModalClose}
        title="Add Project Asset">
        <div className="flex border-b border-slate-800 mb-6 gap-2">
          <button
            type="button"
            onClick={() => setActiveTab("link")}
            className={tabClass("link")}>
            <Link size={14} />
            Link Asset
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("upload")}
            className={tabClass("upload")}>
            <UploadCloud size={14} />
            Upload Files
          </button>
        </div>

        {formError && (
          <div className="mb-4 p-3 bg-red-950/20 border border-red-800/40 rounded-lg text-xs text-red-400 flex items-center gap-2">
            <ShieldAlert size={16} />
            {formError}
          </div>
        )}

        {activeTab === "link" ? (
          <LinkAssetTab
            register={register}
            errors={errors}
            isPending={addAssetMutation.isPending}
            onSubmit={handleSubmit(onSubmit)}
            onCancel={handleModalClose}
          />
        ) : (
          <UploadFilesTab
            selectedFiles={selectedFiles}
            uploads={uploads}
            onFilesSelected={handleFilesSelected}
            onRemoveSelectedFile={handleRemoveSelectedFile}
            onRemoveUpload={removeUpload}
            onClose={handleModalClose}
            onUploadClick={() => setIsConfirmOpen(true)}
          />
        )}
      </Modal>
    </>
  );
}
