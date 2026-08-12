export const API_ROUTES = {
  AUTH: {
    LOGIN: "/api/auth/login",
    LOGOUT: "/api/auth/logout",
    REFRESH_TOKEN: "/api/auth/refresh-token",
  },
  USERS: {
    BASE: "/api/users",
  },
  PROJECTS: {
    BASE: "/api/projects",
    EMPLOYEES: (id: string) => `/api/projects/${id}/employees`,
    ASSETS: (id: string) => `/api/projects/${id}/assets`,
    ASSET_DETAIL: (projectId: string, assetId: string) =>
      `/api/projects/${projectId}/assets/${assetId}`,
  },
  TICKETS: {
    BASE: "/api/tickets",
    COMMENTS: (id: string) => `/api/tickets/${id}/comments`,
    DETAIL: (id: string) => `/api/tickets/${id}`,
  },
  NOTIFICATIONS: {
    BASE: "/api/notifications",
    MARK_READ: (id: string) => `/api/notifications/${id}/mark-read`,
    MARK_ALL_READ: "/api/notifications/mark-all-read",
    DEVICES: {
      SYNC: "/api/notifications/devices",
      REMOVE: "/api/notifications/devices/remove",
    },
  },
};
