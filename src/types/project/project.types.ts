import { IEmployee } from "../employee/employee.types";
import { EProjectStatus, EAssetProvider, EUploadStatus } from "@/enums";
import {
  CreateProjectFormValues,
  AddAssetFormValues,
} from "@/schemas/project/project.schema";
import { UseFormRegister, FieldErrors } from "react-hook-form";

export interface IProjectAsset {
  _id?: string;
  name: string;
  url: string;
  category: string;
  provider: EAssetProvider;
  providerFileId?: string;
  mimeType?: string;
  isFolder?: boolean;
  parentFolderId?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface FileUploadState {
  id: string;
  name: string;
  size: number;
  mimeType: string;
  progress: number;
  status: EUploadStatus;
  errorMsg?: string;
}

export interface IProject {
  _id: string;
  name: string;
  clientName?: string;
  clientEmail?: string;
  description?: string;
  employees: IEmployee[];
  assets: IProjectAsset[];
  status: EProjectStatus;
  googleDriveFolderId?: string;
}

export interface CreateProjectPayload {
  name: string;
  clientName: string;
  clientEmail: string;
  description?: string;
}

export interface AssignEmployeesPayload {
  employeeIds: string[];
}

export interface AddAssetPayload {
  name: string;
  url: string;
  category: string;
  provider?: EAssetProvider;
  providerFileId?: string;
  mimeType?: string;
  parentFolderId?: string;
}

export interface ConfirmAssetUploadPayload {
  fileId: string;
  name: string;
  mimeType: string;
  webViewLink: string;
  category: string;
  parentFolderId?: string;
}

export interface AddAssetModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectId: string;
  parentFolderId?: string;
}

export interface ProjectCardProps {
  project: IProject;
  onAllocateClick: (project: IProject) => void;
  onAddAssetClick: (projectId: string) => void;
  onEditAssetClick?: (projectId: string, asset: IProjectAsset) => void;
  onDeleteClick?: (projectId: string) => void;
}

export interface AllocateTeamModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: IProject | null;
  employees: IEmployee[];
}

export interface CreateProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export interface CreateProjectFormProps {
  onSubmit: (values: CreateProjectFormValues) => void;
  onCancel: () => void;
  serverError?: string;
  isPending?: boolean;
}

export interface EditAssetModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectId: string;
  asset: IProjectAsset | null;
}

export interface FileDropZoneProps {
  onFilesSelected: (files: File[]) => void;
  disabled?: boolean;
}

export interface FileUploadListProps {
  uploads: FileUploadState[];
  onRemove?: (id: string) => void;
}

export interface LinkAssetTabProps {
  register: UseFormRegister<AddAssetFormValues>;
  errors: FieldErrors<AddAssetFormValues>;
  isPending: boolean;
  onSubmit: () => void;
  onCancel: () => void;
}

export interface UploadFilesTabProps {
  selectedFiles: File[] | null;
  uploads: FileUploadState[];
  onFilesSelected: (files: File[]) => void;
  onRemoveSelectedFile: (index: number) => void;
  onRemoveUpload: (id: string) => void;
  onClose: () => void;
  onUploadClick: () => void;
}

export interface FileExplorerProps {
  project: IProject;
}

export interface FileListProps {
  assets: IProjectAsset[];
  onDeleteAsset: (assetId: string) => void;
  onEditAsset: (asset: IProjectAsset) => void;
  deletingAssetId: string | null;
  onFolderClick?: (folderId: string) => void;
}

export interface FileGridProps {
  assets: IProjectAsset[];
  onDeleteAsset: (assetId: string) => void;
  onEditAsset: (asset: IProjectAsset) => void;
  deletingAssetId: string | null;
  onFolderClick?: (folderId: string) => void;
}

export interface FileCardProps {
  asset: IProjectAsset;
  onDelete: () => void;
  onEdit: () => void;
  isDeleting?: boolean;
  onFolderClick?: (folderId: string) => void;
}

export interface AssetActionMenuProps {
  asset: IProjectAsset;
  onEdit: () => void;
  onDelete: () => void;
  isDeleting?: boolean;
  onMenuOpenChange?: (open: boolean) => void;
}

export interface CreateFolderModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectId: string;
  parentFolderId: string | null;
}
