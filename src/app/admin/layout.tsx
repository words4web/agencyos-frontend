"use client";

import React from "react";
import { useAuth } from "@/hooks/useAuth";
import { CommonLoader } from "@/components/CommonLoader";
import { Sidebar } from "@/components/Sidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isLoading } = useAuth(true);

  if (isLoading) {
    return <CommonLoader fullScreen message="Loading admin console..." />;
  }

  return (
    <div className="flex h-screen overflow-hidden bg-slate-950">
      <Sidebar />
      <main className="flex-1 overflow-y-auto p-8">{children}</main>
    </div>
  );
}
