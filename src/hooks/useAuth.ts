"use client";

import { useEffect, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../store";
import {
  setCredentials,
  clearAuth,
  setLoading,
  updateUser as updateUserAction,
} from "../store/authSlice";
import { IUser } from "@/types/auth/auth.types";
import { EUserRole } from "@/enums";
import { axiosInstance } from "../utils/axios";
import { API_ROUTES } from "@/constants/api";
import { STORAGE_KEYS } from "@/constants/storage";
import { ROUTES } from "@/constants/route";
import { toast } from "sonner";

let refreshPromise: Promise<void> | null = null;

export const useAuth = (requireAdmin = false) => {
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useDispatch();
  const { user, accessToken, isAuthenticated, isLoading } = useSelector(
    (state: RootState) => state.auth,
  );

  useEffect(() => {
    const checkAuth = async () => {
      if (refreshPromise) {
        try {
          await refreshPromise;
        } catch (err) {}
        return;
      }

      refreshPromise = (async () => {
        try {
          dispatch(setLoading(true));
          const res = await axiosInstance.post(API_ROUTES.AUTH.REFRESH_TOKEN);
          if (res.data?.data) {
            dispatch(
              setCredentials({
                accessToken: res.data.data.accessToken,
                user: res.data.data.user,
              }),
            );
          }
        } catch (err) {
          dispatch(clearAuth());
          if (pathname !== ROUTES.LOGIN) {
            router.replace(ROUTES.LOGIN);
          }
          throw err;
        } finally {
          dispatch(setLoading(false));
          refreshPromise = null;
        }
      })();

      try {
        await refreshPromise;
      } catch (err) {}
    };

    if (!isAuthenticated) {
      checkAuth();
    } else {
      dispatch(setLoading(false));
    }
  }, [isAuthenticated, dispatch, router, pathname]);

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated && pathname !== ROUTES.LOGIN) {
        router.replace(ROUTES.LOGIN);
      } else if (isAuthenticated) {
        if (pathname === ROUTES.LOGIN) {
          router.replace(ROUTES.KANBAN);
        } else if (requireAdmin && user?.role !== EUserRole.ADMIN) {
          router.replace(ROUTES.KANBAN);
        }
      }
    }
  }, [isAuthenticated, isLoading, user, requireAdmin, router, pathname]);

  const logout = async () => {
    try {
      dispatch(setLoading(true));
      await axiosInstance.post(API_ROUTES.AUTH.LOGOUT);
    } catch (error) {
      toast.error("Logout failed. Please try again.");
    } finally {
      if (typeof window !== "undefined") {
        localStorage.removeItem(STORAGE_KEYS.FCM_TOKEN);
        localStorage.removeItem(STORAGE_KEYS.FCM_LANG);
        localStorage.removeItem(STORAGE_KEYS.NOTIFICATIONS_ENABLED);
      }
      dispatch(clearAuth());
      dispatch(setLoading(false));
    }
  };

  const updateUser = (updatedUser: Partial<IUser>) => {
    if (user) {
      dispatch(updateUserAction(updatedUser));
    }
  };

  return {
    user,
    accessToken,
    isAuthenticated,
    isLoading,
    logout,
    updateUser,
  };
};
