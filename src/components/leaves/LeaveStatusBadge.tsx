import React from "react";
import { CheckCircle2, XCircle, Clock } from "lucide-react";

interface LeaveStatusBadgeProps {
  status: "pending" | "approved" | "rejected";
}

export const LeaveStatusBadge = ({ status }: LeaveStatusBadgeProps) => {
  const getStyles = () => {
    switch (status) {
      case "approved":
        return "bg-emerald-500/10 text-emerald-400 border border-emerald-500/25";
      case "rejected":
        return "bg-rose-500/10 text-rose-400 border border-rose-500/25";
      default:
        return "bg-amber-500/10 text-amber-400 border border-amber-500/25";
    }
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 text-[11px] font-extrabold uppercase px-2.5 py-1 rounded-md ${getStyles()}`}>
      {status === "approved" && <span className="text-[9px]">🟢</span>}
      {status === "rejected" && <span className="text-[9px]">🔴</span>}
      {status === "pending" && <span className="text-[9px]">🟡</span>}
      {status}
    </span>
  );
};
