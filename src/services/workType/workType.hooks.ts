import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { workTypeService } from "./workType.service";
import { toast } from "sonner";

export const WORK_TYPE_KEYS = {
  all: ["workTypes"] as const,
  list: (includeInactive: boolean) =>
    [...WORK_TYPE_KEYS.all, "list", includeInactive] as const,
  detail: (id: string) => [...WORK_TYPE_KEYS.all, "detail", id] as const,
};

export function useGetWorkTypes(includeInactive = false) {
  return useQuery({
    queryKey: WORK_TYPE_KEYS.list(includeInactive),
    queryFn: () => workTypeService.getWorkTypes(includeInactive),
  });
}

export function useGetWorkTypeById(id: string) {
  return useQuery({
    queryKey: WORK_TYPE_KEYS.detail(id),
    queryFn: () => workTypeService.getWorkTypeById(id),
    enabled: !!id,
  });
}

export function useCreateWorkType() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: workTypeService.createWorkType,
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: WORK_TYPE_KEYS.all });
      toast.success(res.message || "Work type created successfully!");
    },
    onError: (err: any) => {
      const msg = err?.response?.data?.message || "Failed to create work type.";
      toast.error(msg);
    },
  });
}

export function useUpdateWorkType() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: any }) =>
      workTypeService.updateWorkType(id, payload),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: WORK_TYPE_KEYS.all });
      toast.success(res.message || "Work type updated successfully!");
    },
    onError: (err: any) => {
      const msg = err?.response?.data?.message || "Failed to update work type.";
      toast.error(msg);
    },
  });
}

export function useDeleteWorkType() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: workTypeService.deleteWorkType,
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: WORK_TYPE_KEYS.all });
      toast.success(res?.message || "Work type deactivated successfully!");
    },
    onError: (err: any) => {
      const msg =
        err?.response?.data?.message || "Failed to deactivate work type.";
      toast.error(msg);
    },
  });
}
