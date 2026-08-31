import React from "react";
import { ELeaveType } from "@/enums";

interface LeaveTypeBadgeProps {
  leaveType: ELeaveType;
}

export const LeaveTypeBadge = ({ leaveType }: LeaveTypeBadgeProps) => {
  return (
    <span
      className={`px-3 py-1 rounded-md text-[11px] font-bold tracking-wider uppercase ${
        leaveType === ELeaveType.PAID
          ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
          : "bg-orange-500/10 text-orange-400 border border-orange-500/20"
      }`}>
      {leaveType === ELeaveType.PAID ? "PAID" : "UNPAID"}
    </span>
  );
};
