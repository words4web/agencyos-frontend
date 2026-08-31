import React from "react";
import { format } from "date-fns";
import { ILeave } from "@/types/leave/leave.types";
import { LeaveTypeBadge } from "./LeaveTypeBadge";
import { Table } from "../Table";
import { Column, ActionMenuItem } from "@/types/common/common.types";

export const PendingLeavesTable = ({
  leaves,
  onActionClick,
  onRowClick,
}: {
  leaves: ILeave[];
  onActionClick: (leave: ILeave, type: "approve" | "reject") => void;
  onRowClick: (leave: ILeave) => void;
}) => {
  const pendingLeaves = leaves?.filter((l) => l?.status === "pending");

  const columns: Column<ILeave>[] = [
    {
      header: "EMPLOYEE",
      accessor: (leave) => {
        const emp =
          typeof leave?.employee === "object" ? leave?.employee : null;
        return (
          <div>
            <span className="font-semibold text-white block">
              {emp?.name || "Employee"}
            </span>
            <span className="text-[10px] text-slate-500 block font-normal">
              {emp?.designation || "-"}
            </span>
          </div>
        );
      },
      className: "w-[30%]",
    },
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
      header: "WORKING DAYS",
      accessor: (leave) => (
        <span className="font-bold text-white">
          {leave?.totalDays} {leave?.totalDays === 1 ? "day" : "days"}
        </span>
      ),
      className: "w-[20%]",
    },
    {
      header: "TYPE",
      accessor: (leave) => <LeaveTypeBadge leaveType={leave?.leaveType} />,
      className: "w-[15%]",
    },
  ];

  const actions: ActionMenuItem<ILeave>[] = [
    {
      label: "View Details",
      onClick: (leave) => onRowClick(leave),
      className: "text-slate-300 hover:text-slate-100",
    },
    {
      label: "Approve Application",
      onClick: (leave) => onActionClick(leave, "approve"),
      className: "text-emerald-400 hover:text-emerald-300",
    },
    {
      label: "Reject Application",
      onClick: (leave) => onActionClick(leave, "reject"),
      className: "text-rose-400 hover:text-rose-300",
    },
  ];

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h2 className="text-md font-bold text-slate-200">
          Pending Leave Applications
        </h2>
        <p className="text-xs text-indigo-400 font-bold tracking-wide uppercase">
          {pendingLeaves.length}{" "}
          {pendingLeaves.length === 1 ? "application" : "applications"} needs
          review
        </p>
      </div>
      <Table
        data={pendingLeaves}
        columns={columns}
        actions={actions}
        onRowClick={onRowClick}
        emptyMessage="No pending leave requests."
      />
    </div>
  );
};
