import { axiosInstance } from "@/utils/axios";
import { API_ROUTES } from "@/constants/api";
import { AxiosResponse } from "axios";
import {
  IProject,
  CreateProjectPayload,
  AssignEmployeesPayload,
  AddAssetPayload,
} from "@/types/project/project.types";

export const projectService = {
  getProjects: async (): Promise<
    AxiosResponse<{ success: boolean; data: IProject[] }>
  > => {
    return axiosInstance.get(API_ROUTES.PROJECTS.BASE);
  },

  getProjectById: async (
    projectId: string,
  ): Promise<AxiosResponse<{ success: boolean; data: IProject }>> => {
    return axiosInstance.get(`${API_ROUTES.PROJECTS.BASE}/${projectId}`);
  },

  createProject: async (
    payload: CreateProjectPayload,
  ): Promise<AxiosResponse<{ success: boolean; data: IProject }>> => {
    return axiosInstance.post(API_ROUTES.PROJECTS.BASE, payload);
  },

  assignEmployees: async (
    projectId: string,
    payload: AssignEmployeesPayload,
  ): Promise<AxiosResponse<{ success: boolean; data: IProject }>> => {
    return axiosInstance.put(API_ROUTES.PROJECTS.EMPLOYEES(projectId), payload);
  },

  addAsset: async (
    projectId: string,
    payload: AddAssetPayload,
  ): Promise<AxiosResponse<{ success: boolean; data: IProject }>> => {
    return axiosInstance.put(API_ROUTES.PROJECTS.ASSETS(projectId), payload);
  },

  updateAsset: async (
    projectId: string,
    assetId: string,
    payload: Partial<AddAssetPayload>,
  ): Promise<AxiosResponse<{ success: boolean; data: IProject }>> => {
    return axiosInstance.put(
      API_ROUTES.PROJECTS.ASSET_DETAIL(projectId, assetId),
      payload,
    );
  },

  deleteAsset: async (
    projectId: string,
    assetId: string,
  ): Promise<AxiosResponse<{ success: boolean; data: IProject }>> => {
    return axiosInstance.delete(
      API_ROUTES.PROJECTS.ASSET_DETAIL(projectId, assetId),
    );
  },

  deleteProject: async (
    projectId: string,
  ): Promise<AxiosResponse<{ success: boolean; data: IProject }>> => {
    return axiosInstance.delete(`${API_ROUTES.PROJECTS.BASE}/${projectId}`);
  },

  uploadFile: async (
    projectId: string,
    file: File,
    onProgress?: (progress: number) => void,
  ): Promise<AxiosResponse<{ success: boolean; data: { fileId: string } }>> => {
    return axiosInstance.post(
      `${API_ROUTES.PROJECTS.BASE}/${projectId}/assets/upload`,
      file,
      {
        headers: {
          "Content-Type": "application/octet-stream",
          "X-File-Name": encodeURIComponent(file.name),
          "X-Mime-Type": file.type || "application/octet-stream",
        },
        onUploadProgress: (progressEvent) => {
          if (progressEvent?.total && onProgress) {
            const progress = Math.round(
              (progressEvent?.loaded / progressEvent?.total) * 100,
            );
            onProgress(progress);
          }
        },
      },
    );
  },

  confirmAssetUpload: async (
    projectId: string,
    payload: {
      fileId: string;
      name: string;
      mimeType: string;
      webViewLink: string;
      category: string;
    },
  ): Promise<AxiosResponse<{ success: boolean; data: IProject }>> => {
    return axiosInstance.post(
      `${API_ROUTES.PROJECTS.BASE}/${projectId}/assets/confirm-upload`,
      payload,
    );
  },
};
