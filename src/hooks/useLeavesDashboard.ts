import { useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { EUserRole } from "@/enums";
import {
  useGetMyLeaves,
  useGetMyBalance,
  useApplyLeave,
  useGetAllLeaves,
  useGetAllBalances,
  useAdminCreateLeave,
  useApproveLeave,
  useRejectLeave,
} from "@/services/leave/leave.hooks";
import { useGetEmployees } from "@/services/employee/employee.hooks";
import { LeaveFormValues, ILeave } from "@/types/leave/leave.types";

export const useLeavesDashboard = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const isAdmin = user?.role === EUserRole.ADMIN;

  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [isAdminCreateModalOpen, setIsAdminCreateModalOpen] = useState(false);
  const [selectedLeaveForAction, setSelectedLeaveForAction] =
    useState<ILeave | null>(null);
  const [actionType, setActionType] = useState<"approve" | "reject" | null>(
    null,
  );

  const { data: myLeaves = [], isLoading: isMyLeavesLoading } =
    useGetMyLeaves();
  const { data: myBalance = null } = useGetMyBalance();
  const applyLeaveMutation = useApplyLeave();

  const { data: allLeaves = [], isLoading: isAllLeavesLoading } =
    useGetAllLeaves(isAdmin ? {} : undefined, isAdmin);
  const { data: allBalances = [] } = useGetAllBalances(
    isAdmin ? new Date().getFullYear() : undefined,
    isAdmin,
  );
  const { data: employees = [] } = useGetEmployees(isAdmin);

  const adminCreateLeaveMutation = useAdminCreateLeave();
  const approveLeaveMutation = useApproveLeave();
  const rejectLeaveMutation = useRejectLeave();

  const handleApplyLeave = (values: LeaveFormValues) => {
    applyLeaveMutation.mutate(
      {
        leaveType: values.leaveType,
        startDate: values.startDate,
        endDate: values.endDate,
        reason: values.reason,
      },
      {
        onSuccess: () => {
          setIsApplyModalOpen(false);
        },
      },
    );
  };

  const handleAdminCreateLeave = (values: LeaveFormValues) => {
    if (!values.employeeId) return;
    adminCreateLeaveMutation.mutate(
      {
        employeeId: values.employeeId,
        leaveType: values.leaveType,
        startDate: values.startDate,
        endDate: values.endDate,
        reason: values.reason,
        lateNotice: values.lateNotice,
        isAuthorized: values.isAuthorized,
        adminNote: values.adminNote,
      },
      {
        onSuccess: () => {
          setIsAdminCreateModalOpen(false);
        },
      },
    );
  };

  const handleActionSubmit = (flags: {
    lateNotice?: boolean;
    isAuthorized?: boolean;
    adminNote: string;
  }) => {
    if (!selectedLeaveForAction) return;

    if (actionType === "approve") {
      approveLeaveMutation.mutate(
        {
          leaveId: selectedLeaveForAction._id,
          payload: flags,
        },
        {
          onSuccess: () => {
            setSelectedLeaveForAction(null);
            setActionType(null);
          },
        },
      );
    } else {
      rejectLeaveMutation.mutate(
        {
          leaveId: selectedLeaveForAction._id,
          payload: { adminNote: flags.adminNote },
        },
        {
          onSuccess: () => {
            setSelectedLeaveForAction(null);
            setActionType(null);
          },
        },
      );
    }
  };

  return {
    isAdmin,
    isApplyModalOpen,
    setIsApplyModalOpen,
    isAdminCreateModalOpen,
    setIsAdminCreateModalOpen,
    selectedLeaveForAction,
    setSelectedLeaveForAction,
    actionType,
    setActionType,
    myLeaves,
    isMyLeavesLoading,
    myBalance,
    applyLeaveMutation,
    allLeaves,
    isAllLeavesLoading,
    allBalances,
    employees,
    adminCreateLeaveMutation,
    approveLeaveMutation,
    rejectLeaveMutation,
    handleApplyLeave,
    handleAdminCreateLeave,
    handleActionSubmit,
  };
};
