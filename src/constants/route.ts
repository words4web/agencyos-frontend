export const ROUTES = {
  // Public / Guest routes
  LANDING: "/",
  LOGIN: "/login",

  // Authenticated / Dashboard routes
  KANBAN: "/kanban",
  ADMIN_PROJECTS: "/admin/projects",
  ADMIN_EMPLOYEES: "/admin/employees",
  PROFILE: "/profile",
};

export type Route = (typeof ROUTES)[keyof typeof ROUTES];
