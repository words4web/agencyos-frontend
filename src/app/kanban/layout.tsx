"use client";

import React from "react";
import { useAuth } from "@/hooks/useAuth";
import { CommonLoader } from "@/components/CommonLoader";

export default function KanbanLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isLoading } = useAuth();

  if (isLoading) {
    return <CommonLoader fullScreen message="Loading workspace..." />;
  }

  return (
    <main className="flex-1 flex flex-col min-h-0 min-w-0 bg-slate-950">
      {children}
    </main>
  );
}
