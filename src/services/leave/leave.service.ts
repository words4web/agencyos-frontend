import { axiosInstance } from "@/utils/axios";
import { API_ROUTES } from "@/constants/api";
import { ELeaveType } from "@/enums";
import { ILeave, ILeaveBalance } from "@/types/leave/leave.types";

interface ResponseData<T> {
  success: boolean;
  data: T;
  message?: string;
}


export const leaveService = {
  applyLeave: async (payload: {
    leaveType: ELeaveType;
    startDate: string;
    endDate: string;
    reason: string;
  }) => {
    return axiosInstance.post<ResponseData<ILeave>>(API_ROUTES.LEAVES.BASE, payload);
  },

  getMyLeaves: async () => {
    return axiosInstance.get<ResponseData<ILeave[]>>(API_ROUTES.LEAVES.MY);
  },

  getMyBalance: async (year?: number) => {
    return axiosInstance.get<ResponseData<ILeaveBalance>>(
      API_ROUTES.LEAVES.MY_BALANCE,
      { params: { year } }
    );
  },

  getAllLeaves: async (params?: {
    employeeId?: string;
    status?: string;
    leaveType?: string;
    year?: number;
    month?: number;
  }) => {
    return axiosInstance.get<ResponseData<ILeave[]>>(API_ROUTES.LEAVES.BASE, { params });
  },

  getAllBalances: async (year?: number) => {
    return axiosInstance.get<ResponseData<ILeaveBalance[]>>(API_ROUTES.LEAVES.BALANCE, {
      params: { year },
    });
  },

  getEmployeeBalance: async (userId: string, year?: number) => {
    return axiosInstance.get<ResponseData<ILeaveBalance>>(
      API_ROUTES.LEAVES.BALANCE_USER(userId),
      { params: { year } }
    );
  },

  adminCreateLeave: async (payload: {
    employeeId: string;
    leaveType: ELeaveType;
    startDate: string;
    endDate: string;
    reason: string;
    lateNotice?: boolean;
    isAuthorized?: boolean;
    adminNote?: string;
  }) => {
    return axiosInstance.post<ResponseData<ILeave>>(API_ROUTES.LEAVES.ADMIN_CREATE, payload);
  },

  approveLeave: async (
    leaveId: string,
    payload: { lateNotice?: boolean; isAuthorized?: boolean; adminNote?: string }
  ) => {
    return axiosInstance.patch<ResponseData<ILeave>>(
      API_ROUTES.LEAVES.APPROVE(leaveId),
      payload
    );
  },

  rejectLeave: async (leaveId: string, payload: { adminNote: string }) => {
    return axiosInstance.patch<ResponseData<ILeave>>(
      API_ROUTES.LEAVES.REJECT(leaveId),
      payload
    );
  },
};
