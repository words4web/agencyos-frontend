import { axiosInstance } from "@/utils/axios";
import { API_ROUTES } from "@/constants/api";
import { AxiosResponse } from "axios";
import { LoginPayload, AuthSuccessResponse } from "@/types/auth/auth.types";

export const authService = {
  login: async (
    payload: LoginPayload,
  ): Promise<AxiosResponse<AuthSuccessResponse>> => {
    return axiosInstance.post(API_ROUTES.AUTH.LOGIN, payload);
  },

  logout: async (): Promise<
    AxiosResponse<{ success: boolean; message?: string }>
  > => {
    return axiosInstance.post(API_ROUTES.AUTH.LOGOUT);
  },
};
