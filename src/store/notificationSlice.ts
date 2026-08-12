import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { NotificationState } from "@/types/notification/notification.types";

const initialState: NotificationState = {
  unreadCount: 0,
  fcmToken: null,
  permissionStatus: "default",
  isToggledOn: true,
  isSidebarOpen: false,
};

const notificationSlice = createSlice({
  name: "notification",
  initialState,
  reducers: {
    setUnreadCount: (state, action: PayloadAction<number>) => {
      state.unreadCount = action.payload;
    },
    decrementUnreadCount: (state) => {
      state.unreadCount = Math.max(0, state.unreadCount - 1);
    },
    incrementUnreadCount: (state) => {
      state.unreadCount = state.unreadCount + 1;
    },
    setFcmToken: (state, action: PayloadAction<string | null>) => {
      state.fcmToken = action.payload;
    },
    setPermissionStatus: (state, action: PayloadAction<string>) => {
      state.permissionStatus = action.payload;
    },
    toggleNotifications: (state, action: PayloadAction<boolean>) => {
      state.isToggledOn = action.payload;
    },
    setSidebarOpen: (state, action: PayloadAction<boolean>) => {
      state.isSidebarOpen = action.payload;
    },
  },
});

export const {
  setUnreadCount,
  decrementUnreadCount,
  incrementUnreadCount,
  setFcmToken,
  setPermissionStatus,
  toggleNotifications,
  setSidebarOpen,
} = notificationSlice.actions;

export default notificationSlice.reducer;
