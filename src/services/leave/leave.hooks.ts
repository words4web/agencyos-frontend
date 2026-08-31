import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { leaveService } from "./leave.service";
import { ILeave } from "@/types/leave/leave.types";
import { ELeaveType } from "@/enums";
import { toast } from "sonner";

export const useGetMyLeaves = () => {
  return useQuery({
    queryKey: ["myLeaves"],
    queryFn: async () => {
      const res = await leaveService.getMyLeaves();
      return res.data?.data || [];
    },
  });
};

export const useGetMyBalance = (year?: number) => {
  return useQuery({
    queryKey: ["myBalance", year],
    queryFn: async () => {
      const res = await leaveService.getMyBalance(year);
      return res.data?.data || null;
    },
  });
};

export const useApplyLeave = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: {
      leaveType: ELeaveType;
      startDate: string;
      endDate: string;
      reason: string;
    }) => leaveService.applyLeave(payload),
    onSuccess: (res) => {
      toast.success(res.data?.message || "Leave applied successfully!");
      queryClient.invalidateQueries({ queryKey: ["myLeaves"] });
      queryClient.invalidateQueries({ queryKey: ["myBalance"] });
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || "Failed to apply for leave");
    },
  });
};

export const useGetAllLeaves = (
  filters?: {
    employeeId?: string;
    status?: string;
    leaveType?: string;
    year?: number;
    month?: number;
  },
  enabled = true
) => {
  return useQuery({
    queryKey: ["allLeaves", filters],
    queryFn: async () => {
      const res = await leaveService.getAllLeaves(filters);
      return res.data?.data || [];
    },
    enabled,
  });
};

export const useGetAllBalances = (year?: number, enabled = true) => {
  return useQuery({
    queryKey: ["allBalances", year],
    queryFn: async () => {
      const res = await leaveService.getAllBalances(year);
      return res.data?.data || [];
    },
    enabled,
  });
};

export const useAdminCreateLeave = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: {
      employeeId: string;
      leaveType: ELeaveType;
      startDate: string;
      endDate: string;
      reason: string;
      lateNotice?: boolean;
      isAuthorized?: boolean;
      adminNote?: string;
    }) => leaveService.adminCreateLeave(payload),
    onSuccess: (res) => {
      toast.success(res.data?.message || "Leave recorded successfully!");
      queryClient.invalidateQueries({ queryKey: ["allLeaves"] });
      queryClient.invalidateQueries({ queryKey: ["allBalances"] });
      queryClient.invalidateQueries({ queryKey: ["events"] });
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || "Failed to record leave");
    },
  });
};

export const useApproveLeave = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (variables: {
      leaveId: string;
      payload: { lateNotice?: boolean; isAuthorized?: boolean; adminNote?: string };
    }) => leaveService.approveLeave(variables.leaveId, variables.payload),
    onSuccess: (res) => {
      toast.success(res.data?.message || "Leave approved successfully!");
      queryClient.invalidateQueries({ queryKey: ["allLeaves"] });
      queryClient.invalidateQueries({ queryKey: ["allBalances"] });
      queryClient.invalidateQueries({ queryKey: ["events"] });
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || "Failed to approve leave");
    },
  });
};

export const useRejectLeave = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (variables: { leaveId: string; payload: { adminNote: string } }) =>
      leaveService.rejectLeave(variables.leaveId, variables.payload),
    onSuccess: (res) => {
      toast.success(res.data?.message || "Leave rejected successfully!");
      queryClient.invalidateQueries({ queryKey: ["allLeaves"] });
      queryClient.invalidateQueries({ queryKey: ["allBalances"] });
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || "Failed to reject leave");
    },
  });
};
