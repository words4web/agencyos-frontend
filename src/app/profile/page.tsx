"use client";

import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { Sidebar } from "@/components/Sidebar";
import { PageHeader } from "@/components/PageHeader";
import { NotificationToggle } from "@/components/notification/NotificationToggle";
import { BlockedPermissionBanner } from "@/components/notification/BlockedPermissionBanner";
import { User, Mail, Shield, BadgeCheck, Briefcase } from "lucide-react";

export default function ProfilePage() {
  const { user } = useSelector((state: RootState) => state.auth);

  const infoItems = [
    {
      icon: <Mail size={16} />,
      label: "Email Address",
      value: user?.email,
    },
    {
      icon: <Briefcase size={16} />,
      label: "Designation",
      value: user?.designation,
    },
    {
      icon: <Shield size={16} />,
      label: "Workspace Role",
      value: user?.role,
      className: "capitalize",
    },
    {
      icon: <BadgeCheck size={16} />,
      label: "Account Status",
      value: "Active",
      valueClassName: "text-emerald-400",
    },
  ];

  return (
    <div className="flex h-screen bg-slate-950 text-slate-100">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto p-8">
        <PageHeader
          icon={User}
          title="My Profile"
          subtitle="Manage your profile and preferences"
        />

        <main className="flex-1 p-6 max-w-4xl w-full mx-auto flex flex-col gap-6">
          <BlockedPermissionBanner />

          <div className="flex flex-col gap-6 p-6 rounded-2xl bg-slate-900/30 border border-slate-800/80 bg-gradient-to-br from-slate-900/40 via-transparent to-transparent">
            <div className="flex flex-col sm:flex-row items-center gap-5 border-b border-slate-900 pb-6">
              <div className="w-20 h-20 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                <User size={40} />
              </div>
              <div className="text-center sm:text-left">
                <h2 className="text-xl font-bold text-slate-100">
                  {user?.name}
                </h2>
                <p className="text-sm text-indigo-400 font-medium capitalize mt-0.5">
                  {user?.role}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {infoItems?.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 p-4 rounded-xl bg-slate-950/40 border border-slate-800/50">
                  <div className="p-2.5 rounded-lg bg-indigo-500/10 text-indigo-400">
                    {item?.icon}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] uppercase font-bold text-slate-500">
                      {item?.label}
                    </span>
                    <span
                      className={`text-sm font-medium ${item?.valueClassName || "text-slate-200"} ${item?.className || ""}`}>
                      {item?.value}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <h3 className="text-xs uppercase font-bold text-slate-500 tracking-wider">
              Preferences
            </h3>
            <NotificationToggle />
          </div>
        </main>
      </div>
    </div>
  );
}
