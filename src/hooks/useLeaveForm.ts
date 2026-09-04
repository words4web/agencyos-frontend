import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { ELeaveType } from "@/enums";
import { formatDateToYYYYMMDD } from "@/utils/date";
import { leaveFormSchema } from "@/schemas/leave/leave.schema";
import { LeaveFormValues, UseLeaveFormProps } from "@/types/leave/leave.types";

export const useLeaveForm = ({
  isAdmin,
  selectedEmployeeId,
  myBalance,
  allBalances,
  onSubmit,
}: UseLeaveFormProps) => {
  const todayStr = formatDateToYYYYMMDD(new Date());

  const defaultValues: LeaveFormValues = {
    employeeId: selectedEmployeeId || "",
    leaveType: ELeaveType.PAID,
    startDate: todayStr,
    endDate: todayStr,
    reason: "",
    isHalfDay: false,
    lateNotice: false,
    isAuthorized: true,
    adminNote: "",
  };

  const form = useForm<LeaveFormValues>({
    resolver: zodResolver(leaveFormSchema),
    defaultValues,
  });

  const { control, setValue } = form;

  const currentEmployeeId = useWatch({ control, name: "employeeId" });
  const isHalfDay = useWatch({ control, name: "isHalfDay" });
  const startDate = useWatch({ control, name: "startDate" });

  useEffect(() => {
    if (isAdmin) {
      if (currentEmployeeId) {
        const empBalance = allBalances?.find(
          (bal) =>
            typeof bal?.employee === "object" &&
            bal?.employee !== null &&
            bal?.employee?._id === currentEmployeeId,
        );
        if (empBalance && empBalance?.remaining <= 0) {
          setValue("leaveType", ELeaveType.UNPAID);
        } else {
          setValue("leaveType", ELeaveType.PAID);
        }
      }
    } else {
      if (myBalance && myBalance.remaining <= 0) {
        setValue("leaveType", ELeaveType.UNPAID);
      } else {
        setValue("leaveType", ELeaveType.PAID);
      }
    }
  }, [currentEmployeeId, isAdmin, myBalance, allBalances, setValue]);

  useEffect(() => {
    if (isHalfDay) {
      setValue("endDate", startDate, { shouldValidate: true });
    }
  }, [isHalfDay, startDate, setValue]);

  const hasPaidBalance = (): boolean => {
    if (isAdmin) {
      if (!currentEmployeeId) return true;
      const empBalance = allBalances?.find(
        (bal) =>
          typeof bal?.employee === "object" &&
          bal?.employee !== null &&
          bal?.employee?._id === currentEmployeeId,
      );
      return !empBalance || empBalance?.remaining > 0;
    } else {
      return !myBalance || myBalance?.remaining > 0;
    }
  };

  const handleFormSubmit = form.handleSubmit((values) => {
    onSubmit(values);
  });

  return {
    form,
    isHalfDay,
    hasPaidBalance: hasPaidBalance(),
    handleFormSubmit,
  };
};
