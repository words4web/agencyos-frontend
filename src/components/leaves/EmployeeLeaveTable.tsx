import React from "react";
import { format } from "date-fns";
import { ILeave } from "@/types/leave/leave.types";
import { LeaveStatusBadge } from "./LeaveStatusBadge";
import { LeaveTypeBadge } from "./LeaveTypeBadge";
import { Table } from "../Table";
import { Column } from "@/types/common/common.types";

export const EmployeeLeaveTable = ({
  leaves,
  isLoading,
  onRowClick,
}: {
  leaves: ILeave[];
  isLoading: boolean;
  onRowClick: (leave: ILeave) => void;
}) => {
  const columns: Column<ILeave>[] = [
    {
      header: "DATES",
      accessor: (leave) => {
        const start = new Date(leave?.startDate);
        const end = new Date(leave?.endDate);
        const startFormatted = format(start, "MMM dd");

        if (leave?.startDate === leave?.endDate) {
          return (
            <span className="font-semibold text-white">
              {format(start, "MMM dd, yyyy")}
            </span>
          );
        }

        return (
          <span className="font-semibold text-white">
            {startFormatted} – {format(end, "MMM dd, yyyy")}
          </span>
        );
      },
      className: "w-[35%]",
    },
    {
      header: "DAYS",
      accessor: (leave) => (
        <span className="font-bold text-white">
          {leave?.totalDays} {leave?.totalDays === 1 ? "day" : "days"}
        </span>
      ),
      className: "w-[15%]",
    },
    {
      header: "TYPE",
      accessor: (leave) => <LeaveTypeBadge leaveType={leave?.leaveType} />,
      className: "w-[15%]",
    },
    {
      header: "STATUS",
      accessor: (leave) => <LeaveStatusBadge status={leave.status} />,
      className: "w-[20%]",
    },
    {
      header: "AUTHORIZED",
      accessor: (leave) => (
        <span
          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${
            leave?.isAuthorized
              ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
              : "bg-rose-500/10 text-rose-400 border border-rose-500/20"
          }`}>
          {leave?.isAuthorized ? "✓ Yes" : "— No"}
        </span>
      ),
      className: "w-[15%]",
    },
  ];

  const actions = [
    {
      label: "View Details",
      onClick: (leave: ILeave) => onRowClick(leave),
      className: "text-slate-300 hover:text-slate-100",
    },
  ];

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h2 className="text-md font-bold text-slate-200">
          My Leave Applications
        </h2>
        <p className="text-xs text-slate-500 font-medium">
          {leaves?.length}{" "}
          {leaves?.length === 1 ? "application" : "applications"}
        </p>
      </div>
      <Table
        data={leaves}
        columns={columns}
        actions={actions}
        onRowClick={onRowClick}
        isLoading={isLoading}
        loadingMessage="Loading leave applications..."
        emptyMessage="No leave records found."
      />
    </div>
  );
};
