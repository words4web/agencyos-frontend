"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/Input";
import { Button } from "@/components/Button";
import { ShieldAlert } from "lucide-react";
import {
  employeeSchema,
  EmployeeFormValues,
} from "@/schemas/employee/employee.schema";
import { useCreateEmployee } from "@/services/employee/employee.hooks";
import { AxiosError } from "axios";
import { CreateEmployeeFormProps } from "@/types/employee/employee.types";

export const CreateEmployeeForm: React.FC<CreateEmployeeFormProps> = ({
  onSuccess,
  onCancel,
}) => {
  const [formError, setFormError] = useState("");
  const [formSuccess, setFormSuccess] = useState("");
  const createEmployeeMutation = useCreateEmployee();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<EmployeeFormValues>({
    resolver: zodResolver(employeeSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      designation: "",
    },
  });

  const onSubmit = (data: EmployeeFormValues) => {
    setFormError("");
    setFormSuccess("");

    createEmployeeMutation.mutate(data, {
      onSuccess: () => {
        setFormSuccess("Employee created successfully!");
        setTimeout(() => {
          onSuccess();
        }, 1000);
      },
      onError: (err) => {
        const axiosError = err as AxiosError<{ message?: string }>;
        setFormError(
          axiosError.response?.data?.message || "Failed to create employee",
        );
      },
    });
  };

  return (
    <div className="flex flex-col gap-4">
      {formError && (
        <div className="p-3 bg-red-950/20 border border-red-800/40 rounded-lg text-xs text-red-400 flex items-center gap-2">
          <ShieldAlert size={16} />
          {formError}
        </div>
      )}
      {formSuccess && (
        <div className="p-3 bg-emerald-950/20 border border-emerald-800/40 rounded-lg text-xs text-emerald-400">
          {formSuccess}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <Input
          id="name"
          label="Name"
          placeholder="John Doe"
          error={errors.name?.message}
          {...register("name")}
        />

        <Input
          id="email"
          type="email"
          label="Email Address"
          placeholder="john@agencyos.com"
          error={errors.email?.message}
          {...register("email")}
        />

        <Input
          id="password"
          type="password"
          label="Initial Password"
          placeholder="••••••••"
          error={errors.password?.message}
          {...register("password")}
        />

        <Input
          id="designation"
          label="Designation (e.g. Graphic Designer, SEO Specialist)"
          placeholder="SEO Specialist"
          error={errors.designation?.message}
          {...register("designation")}
        />

        <div className="flex gap-3 justify-end mt-4">
          <Button type="button" variant="secondary" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" disabled={createEmployeeMutation.isPending}>
            {createEmployeeMutation.isPending
              ? "Creating..."
              : "Create Employee"}
          </Button>
        </div>
      </form>
    </div>
  );
};
