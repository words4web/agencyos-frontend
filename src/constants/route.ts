export const ROUTES = {
  // Public / Guest routes
  LANDING: "/",
  LOGIN: "/login",

  // Authenticated / Dashboard routes
  KANBAN: "/kanban",
  PROJECTS: "/projects",
  ADMIN_PROJECTS: "/admin/projects",
  ADMIN_EMPLOYEES: "/admin/employees",
  ADMIN_WORK_TYPES: "/admin/work-types",
  PROFILE: "/profile",
  CALENDAR: "/calendar",
  LEAVES: "/leaves",
};

export type Route = (typeof ROUTES)[keyof typeof ROUTES];
