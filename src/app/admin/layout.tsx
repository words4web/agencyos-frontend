"use client";

import React from "react";
import { useAuth } from "@/hooks/useAuth";
import { CommonLoader } from "@/components/CommonLoader";

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
    <main className="flex-1 overflow-y-auto p-8 text-slate-100 min-w-0 bg-slate-950">
      {children}
    </main>
  );
}
