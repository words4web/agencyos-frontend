import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { notificationService } from "./notification.service";
import { SyncDevicePayload } from "@/types/notification/notification.types";

export const useSyncDevice = () => {
  return useMutation({
    mutationFn: (payload: SyncDevicePayload) =>
      notificationService.syncDevice(payload),
  });
};

export const useRemoveDevice = () => {
  return useMutation({
    mutationFn: (fcmToken: string) =>
      notificationService.removeDevice(fcmToken),
  });
};

export const useGetNotifications = (page = 1, limit = 10) => {
  return useQuery({
    queryKey: ["notifications", page, limit],
    queryFn: async () => {
      const response = await notificationService.getNotifications(page, limit);
      return (
        response.data?.data || {
          notifications: [],
          total: 0,
          page: 1,
          pages: 1,
        }
      );
    },
  });
};

export const useMarkNotificationRead = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => notificationService.markAsRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });
};

export const useMarkAllNotificationsRead = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => notificationService.markAllAsRead(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });
};
