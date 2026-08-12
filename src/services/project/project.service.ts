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
};
