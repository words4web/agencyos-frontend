import { EPlatformType } from "@/enums";
import { ReactNode } from "react";

export interface SyncDevicePayload {
  fcmToken: string;
  platform: EPlatformType;
}

export interface NotificationState {
  unreadCount: number;
  fcmToken: string | null;
  permissionStatus: string;
  isToggledOn: boolean;
  isSidebarOpen: boolean;
}

export interface FcmProviderProps {
  children: ReactNode;
}

export interface INotification {
  _id: string;
  user: string;
  title: string;
  body: string;
  isRead: boolean;
  metadata?: {
    ticketId?: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface INotificationListResponse {
  notifications: INotification[];
  total: number;
  page: number;
  pages: number;
}

export interface NotificationListProps {
  notifications: INotification[];
  handleNotificationClick: (n: INotification) => void;
  loadMore: (e: React.MouseEvent) => void;
  hasMore: boolean;
}

export interface NotificationDropdownProps {
  unreadCount: number;
  markAllAsRead: () => void;
  accumulatedNotifications: INotification[];
  handleNotificationClick: (n: INotification) => void;
  loadMore: (e: React.MouseEvent) => void;
  hasMore: boolean;
  isLoading?: boolean;
}

export interface FloatingBannerProps {
  isOpen: boolean;
  title: string;
  description?: string;
  icon?: React.ComponentType<{ className?: string }>;
  action?: {
    label: string;
    onClick: () => void;
  };
  onDismiss: () => void;
  variant?: "info" | "warning" | "danger" | "success";
}
