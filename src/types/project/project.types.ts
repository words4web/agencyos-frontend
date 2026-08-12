import { IEmployee } from "../employee/employee.types";
import { EProjectStatus } from "@/enums";
import { CreateProjectFormValues } from "@/schemas/project/project.schema";

export interface IProjectAsset {
  name: string;
  url: string;
  category: string;
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
}

export interface AddAssetModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectId: string;
}

export interface ProjectCardProps {
  project: IProject;
  onAllocateClick: (project: IProject) => void;
  onAddAssetClick: (projectId: string) => void;
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
