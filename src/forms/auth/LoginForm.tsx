"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/Input";
import { Button } from "@/components/Button";
import { Mail, Lock } from "lucide-react";
import { loginSchema, LoginFormValues } from "@/schemas/auth/auth.schema";
import { useLogin } from "@/services/auth/auth.hooks";
import { toast } from "sonner";
import { AxiosError } from "axios";

export const LoginForm: React.FC = () => {
  const [apiError, setApiError] = useState("");
  const loginMutation = useLogin();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (data: LoginFormValues) => {
    setApiError("");
    loginMutation.mutate(data, {
      onSuccess: () => {
        toast.success("Successfully logged in!");
      },
      onError: (err) => {
        const axiosError = err as AxiosError<{ message?: string }>;
        const errorMsg =
          axiosError.response?.data?.message ||
          "Invalid credentials or server error";
        setApiError(errorMsg);
        toast.error(errorMsg);
      },
    });
  };

  return (
    <div className="flex flex-col gap-6">
      {apiError && (
        <div className="p-3 bg-red-950/30 border border-red-800/50 rounded-lg text-sm text-red-400 text-center">
          {apiError}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
        <div className="relative">
          <Input
            id="email"
            type="email"
            label="Email Address"
            placeholder="name@agencyos.com"
            error={errors.email?.message}
            className="pl-10"
            {...register("email")}
          />
          <Mail
            className="absolute left-3 top-[38px] text-slate-500"
            size={16}
          />
        </div>

        <div className="relative">
          <Input
            id="password"
            type="password"
            label="Password"
            placeholder="••••••••"
            error={errors.password?.message}
            className="pl-10"
            {...register("password")}
          />
          <Lock
            className="absolute left-3 top-[38px] text-slate-500"
            size={16}
          />
        </div>

        <Button
          type="submit"
          disabled={loginMutation.isPending}
          className="w-full mt-2 py-2.5">
          {loginMutation.isPending ? "Signing in..." : "Sign In"}
        </Button>
      </form>
    </div>
  );
};
