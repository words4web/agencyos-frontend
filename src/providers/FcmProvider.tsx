"use client";

import { useFcmLifecycle } from "@/hooks/useFcmLifecycle";
import { NotificationListener } from "@/components/notification/NotificationListener";
import { FcmProviderProps } from "@/types/notification/notification.types";

export function FcmProvider({ children }: FcmProviderProps) {
  useFcmLifecycle();

  return (
    <>
      <NotificationListener />
      {children}
    </>
  );
}
