import { axiosInstance } from "@/utils/axios";
import { API_ROUTES } from "@/constants/api";
import { AxiosResponse } from "axios";
import {
  SyncDevicePayload,
  INotification,
  INotificationListResponse,
} from "@/types/notification/notification.types";

export const notificationService = {
  syncDevice: async (
    payload: SyncDevicePayload,
  ): Promise<AxiosResponse<{ success: boolean }>> => {
    return axiosInstance.post(API_ROUTES.NOTIFICATIONS.DEVICES.SYNC, payload);
  },

  removeDevice: async (
    fcmToken: string,
  ): Promise<AxiosResponse<{ success: boolean }>> => {
    return axiosInstance.post(API_ROUTES.NOTIFICATIONS.DEVICES.REMOVE, {
      fcmToken,
    });
  },

  getNotifications: async (
    page: number = 1,
    limit: number = 10,
  ): Promise<
    AxiosResponse<{ success: boolean; data: INotificationListResponse }>
  > => {
    return axiosInstance.get(API_ROUTES.NOTIFICATIONS.BASE, {
      params: { page, limit },
    });
  },

  markAsRead: async (
    id: string,
  ): Promise<AxiosResponse<{ success: boolean; data: INotification }>> => {
    return axiosInstance.patch(API_ROUTES.NOTIFICATIONS.MARK_READ(id));
  },

  markAllAsRead: async (): Promise<AxiosResponse<{ success: boolean }>> => {
    return axiosInstance.patch(API_ROUTES.NOTIFICATIONS.MARK_ALL_READ);
  },
};
