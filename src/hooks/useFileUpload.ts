import { useState, useCallback } from "react";
import { projectService } from "@/services/project/project.service";
import { useConfirmBatchAssetUpload } from "@/services/project/project.hooks";
import { toast } from "sonner";

import { EUploadStatus } from "@/enums";
import { FileUploadState } from "@/types/project/project.types";
import {
  ALLOWED_MIME_TYPES,
  MAX_FILE_SIZE_MB,
  MAX_CONCURRENT_FILES,
} from "@/constants/project";
import { getAssetCategory } from "@/utils/file.utils";

export function useFileUpload(
  projectId: string,
  onAllUploadsComplete?: () => void,
  targetFolderId?: string,
) {
  const [uploads, setUploads] = useState<FileUploadState[]>([]);
  const confirmBatchAssetUploadMutation = useConfirmBatchAssetUpload();

  const prepareUploads = useCallback((files: File[]): File[] | null => {
    const activeCount = uploads.filter(
      (up) =>
        up.status === EUploadStatus.UPLOADING ||
        up.status === EUploadStatus.IDLE,
    ).length;

    if (activeCount + files?.length > MAX_CONCURRENT_FILES) {
      toast.error(
        `You can only upload up to ${MAX_CONCURRENT_FILES} files at once. (Active uploads: ${activeCount})`,
      );
      return null;
    }

    const validFiles: File[] = [];

    for (const file of files) {
      const isTypeAllowed = ALLOWED_MIME_TYPES.some((type) =>
        file?.type.startsWith(type),
      );
      if (!isTypeAllowed) {
        toast.error(`"${file?.name}" uses an unsupported file format.`);
        continue;
      }

      const fileSizeMB = file?.size / (1024 * 1024);
      if (fileSizeMB > MAX_FILE_SIZE_MB) {
        toast.error(
          `"${file?.name}" exceeds the maximum ${MAX_FILE_SIZE_MB}MB file size limit.`,
        );
        continue;
      }

      validFiles.push(file);
    }

    return validFiles.length > 0 ? validFiles : null;
  }, [uploads]);

  const startUploads = useCallback(
    async (files: File[]) => {
      const validFiles = files.map((file) => ({
        file,
        state: {
          id: Math.random().toString(36).substring(7),
          name: file?.name,
          size: file?.size,
          mimeType: file?.type,
          progress: 0,
          status: EUploadStatus.IDLE,
        },
      }));

      setUploads((prev) => [...prev, ...validFiles?.map((vf) => vf?.state)]);

      const confirmedUploads: Array<{
        fileId: string;
        name: string;
        mimeType: string;
        webViewLink: string;
        category: string;
        parentFolderId?: string;
      }> = [];

      await Promise.all(
        validFiles.map(async ({ file, state }) => {
          try {
            setUploads((prev) =>
              prev?.map((up) =>
                up?.id === state?.id
                  ? { ...up, status: EUploadStatus.UPLOADING, progress: 0 }
                  : up,
              ),
            );

            const speedFactor = 0.04 + Math.random() * 0.06;
            const intervalDuration = 180 + Math.floor(Math.random() * 140);

            let simulatedProgress = 0;
            const intervalId = setInterval(() => {
              setUploads((prev) =>
                prev?.map((up) => {
                  if (up?.id !== state?.id) return up;
                  const increment = Math.max(
                    1,
                    Math.round((95 - simulatedProgress) * speedFactor) +
                      Math.floor(Math.random() * 2),
                  );
                  simulatedProgress = Math.min(
                    95,
                    simulatedProgress + increment,
                  );
                  return {
                    ...up,
                    progress: simulatedProgress,
                    status: EUploadStatus.UPLOADING,
                  };
                }),
              );
            }, intervalDuration);

            let uploadRes;
            try {
              uploadRes = await projectService.uploadFile(
                projectId,
                file,
                undefined,
                targetFolderId,
              );
            } finally {
              clearInterval(intervalId);
            }

            const fileId = uploadRes.data?.data?.fileId;

            const webViewLink = `https://drive.google.com/file/d/${fileId}/view?usp=drivesdk`;
            const category = getAssetCategory(file?.type);

            confirmedUploads.push({
              fileId,
              name: file?.name,
              mimeType: file?.type || "application/octet-stream",
              webViewLink,
              category,
              parentFolderId: targetFolderId,
            });

            setUploads((prev) =>
              prev.map((up) =>
                up.id === state.id
                  ? { ...up, status: EUploadStatus.DONE, progress: 100 }
                  : up,
              ),
            );
          } catch (error: any) {
            const errMsg =
              error?.response?.data?.message ||
              error?.message ||
              "Upload failed";
            setUploads((prev) =>
              prev.map((up) =>
                up.id === state.id
                  ? { ...up, status: EUploadStatus.ERROR, errorMsg: errMsg }
                  : up,
              ),
            );
            toast.error(`Failed to upload ${file.name}: ${errMsg}`);
          }
        }),
      );

      if (confirmedUploads.length > 0) {
        try {
          await confirmBatchAssetUploadMutation.mutateAsync({
            projectId,
            payload: confirmedUploads,
          });
        } catch (confirmError) {
          toast.error(
            "Failed to save uploaded assets details in the database.",
          );
        }
      }

      if (onAllUploadsComplete) {
        onAllUploadsComplete();
      }
    },
    [
      projectId,
      confirmBatchAssetUploadMutation,
      onAllUploadsComplete,
      targetFolderId,
    ],
  );

  const clearUploads = useCallback(() => setUploads([]), []);

  const removeUpload = useCallback((id: string) => {
    setUploads((prev) => prev?.filter((up) => up.id !== id));
  }, []);

  return {
    uploads,
    prepareUploads,
    startUploads,
    clearUploads,
    removeUpload,
  };
}
