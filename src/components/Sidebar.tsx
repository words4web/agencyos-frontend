"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "../store";
import {
  LayoutDashboard,
  Users,
  FolderKanban,
  Terminal,
  User,
  Calendar,
  CalendarClock,
} from "lucide-react";
import { EUserRole } from "@/enums";
import { ROUTES } from "@/constants/route";
import { useDispatch } from "react-redux";
import { setSidebarOpen } from "@/store/notificationSlice";
import { ChevronLeft } from "lucide-react";

export const Sidebar: React.FC = () => {
  const pathname = usePathname();
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);
  const { isSidebarOpen } = useSelector(
    (state: RootState) => state.notification,
  );
  const handleCloseSidebar = () => {
    dispatch(setSidebarOpen(false));
  };

  const isAdmin = user?.role === EUserRole.ADMIN;

  const menuItems = [
    {
      name: "Kanban Board",
      path: ROUTES.KANBAN,
      icon: FolderKanban,
      visible: true,
    },
    {
      name: "My Projects",
      path: ROUTES.PROJECTS,
      icon: LayoutDashboard,
      visible: !isAdmin,
    },
    {
      name: "Projects",
      path: ROUTES.ADMIN_PROJECTS,
      icon: LayoutDashboard,
      visible: isAdmin,
    },
    {
      name: "Employees",
      path: ROUTES.ADMIN_EMPLOYEES,
      icon: Users,
      visible: isAdmin,
    },
    {
      name: "Calendar",
      path: ROUTES.CALENDAR,
      icon: Calendar,
      visible: true,
    },
    {
      name: "Leaves",
      path: ROUTES.LEAVES,
      icon: CalendarClock,
      visible: true,
    },
    {
      name: "Profile",
      path: ROUTES.PROFILE,
      icon: User,
      visible: true,
    },
  ];

  return (
    <>
      {isSidebarOpen && (
        <div
          onClick={handleCloseSidebar}
          className="fixed inset-0 bg-slate-950/65 backdrop-blur-sm z-40 md:hidden transition-opacity duration-200"
        />
      )}

      <aside
        className={`bg-slate-950/85 border-r border-slate-900/80 flex flex-col h-screen shrink-0 backdrop-blur-lg fixed md:static inset-y-0 left-0 z-45 transition-all duration-300 ease-in-out ${
          isSidebarOpen
            ? "w-64 translate-x-0"
            : "w-0 -translate-x-full md:w-20 md:translate-x-0"
        }`}>
        <div
          className={`flex items-center py-7 border-b border-slate-900/50 ${
            isSidebarOpen ? "px-6 justify-between" : "px-0 justify-center"
          }`}>
          {isSidebarOpen && (
            <div className="flex items-center gap-3.5">
              <div className="w-9 h-9 rounded-xl bg-indigo-600/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 shadow-md shadow-indigo-500/5 shrink-0">
                <Terminal size={18} />
              </div>
              <div>
                <h1 className="font-bold text-base text-slate-100 tracking-tight leading-tight">
                  AgencyOS
                </h1>
                <span className="text-[9px] text-indigo-400/80 font-bold tracking-widest uppercase mt-0.5 block">
                  {user?.role} Mode
                </span>
              </div>
            </div>
          )}

          <button
            onClick={() => dispatch(setSidebarOpen(!isSidebarOpen))}
            className="p-1.5 rounded-lg border border-slate-800 bg-slate-900/50 text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors">
            <ChevronLeft
              size={16}
              className={`transition-transform duration-300 ${!isSidebarOpen ? "rotate-180" : ""}`}
            />
          </button>
        </div>

        <nav
          className={`flex-1 py-6 flex flex-col gap-1 ${isSidebarOpen ? "px-3" : "px-2 items-center"}`}>
          {menuItems
            ?.filter((item) => item.visible)
            ?.map((item) => {
              const Icon = item?.icon;
              const active = pathname === item?.path;
              return (
                <Link
                  key={item?.path}
                  href={item?.path}
                  onClick={() => {
                    if (window.innerWidth < 768) {
                      handleCloseSidebar();
                    }
                  }}
                  className={`flex items-center gap-3 py-3 rounded-xl text-sm font-medium transition-all duration-200 relative group ${
                    isSidebarOpen ? "px-4 w-full" : "px-0 w-12 justify-center"
                  } ${
                    active
                      ? "text-indigo-400 bg-indigo-500/5 border border-indigo-500/10 shadow-sm"
                      : "text-slate-400 hover:text-slate-200 hover:bg-slate-900/40"
                  }`}>
                  {active && isSidebarOpen && (
                    <span className="absolute left-0 top-3 bottom-3 w-1 rounded-r bg-indigo-500" />
                  )}
                  <Icon
                    size={18}
                    className={`transition-colors duration-200 shrink-0 ${
                      active
                        ? "text-indigo-400"
                        : "text-slate-400 group-hover:text-slate-200"
                    }`}
                  />
                  {isSidebarOpen && <span>{item?.name}</span>}

                  {!isSidebarOpen && (
                    <div className="absolute left-14 px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-850 text-xs font-semibold text-slate-200 opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity whitespace-nowrap z-50">
                      {item?.name}
                    </div>
                  )}
                </Link>
              );
            })}
        </nav>
      </aside>
    </>
  );
};
