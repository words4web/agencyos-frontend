import { axiosInstance } from "@/utils/axios";
import { API_ROUTES } from "@/constants/api";
import { AxiosResponse } from "axios";
import {
  IEmployee,
  CreateEmployeePayload,
} from "@/types/employee/employee.types";

export const employeeService = {
  getEmployees: async (): Promise<
    AxiosResponse<{ success: boolean; data: IEmployee[] }>
  > => {
    return axiosInstance.get(API_ROUTES.USERS.BASE);
  },

  createEmployee: async (
    payload: CreateEmployeePayload,
  ): Promise<AxiosResponse<{ success: boolean; data: IEmployee }>> => {
    return axiosInstance.post(API_ROUTES.USERS.BASE, payload);
  },
};
