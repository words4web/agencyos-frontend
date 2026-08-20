import { useMutation, useQueryClient } from "@tanstack/react-query";
import { authService } from "./auth.service";
import { LoginPayload } from "@/types/auth/auth.types";
import { useDispatch } from "react-redux";
import { setCredentials, clearAuth } from "@/store/authSlice";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/constants/route";

export const useLogin = () => {
  const dispatch = useDispatch();
  const router = useRouter();

  return useMutation({
    mutationFn: (payload: LoginPayload) => {
      return authService.login(payload);
    },
    onSuccess: (response) => {
      const data = response?.data?.data;
      if (data) {
        dispatch(
          setCredentials({
            accessToken: data.accessToken,
            user: data.user,
          }),
        );
        router.push(ROUTES.KANBAN);
      }
    },
  });
};

export const useLogout = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => {
      return authService.logout();
    },
    onSuccess: () => {
      queryClient.clear();
      dispatch(clearAuth());
      router.push(ROUTES.LOGIN);
    },
    onError: () => {
      queryClient.clear();
      dispatch(clearAuth());
      router.push(ROUTES.LOGIN);
    },
  });
};
