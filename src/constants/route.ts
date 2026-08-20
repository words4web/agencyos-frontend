export const ROUTES = {
  // Public / Guest routes
  LANDING: "/",
  LOGIN: "/login",

  // Authenticated / Dashboard routes
  KANBAN: "/kanban",
  PROJECTS: "/projects",
  ADMIN_PROJECTS: "/admin/projects",
  ADMIN_EMPLOYEES: "/admin/employees",
  PROFILE: "/profile",
  CALENDAR: "/calendar",
};

export type Route = (typeof ROUTES)[keyof typeof ROUTES];
