import React from "react";
import { format } from "date-fns";
import { ILeave } from "@/types/leave/leave.types";
import { LeaveStatusBadge } from "./LeaveStatusBadge";
import { LeaveTypeBadge } from "./LeaveTypeBadge";
import { Table } from "../Table";
import { Column } from "@/types/common/common.types";

export const AllLeavesHistoryTable = ({
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
      header: "EMPLOYEE",
      accessor: (leave) => {
        const emp =
          typeof leave?.employee === "object" ? leave?.employee : null;
        return (
          <span className="font-semibold text-white">
            {emp?.name || "Employee"}
          </span>
        );
      },
      className: "w-[25%]",
    },
    {
      header: "DATES",
      accessor: (leave) => {
        const start = new Date(leave.startDate);
        const end = new Date(leave.endDate);
        const startFormatted = format(start, "MMM dd");

        // Single day leave
        if (leave.startDate === leave.endDate) {
          return (
            <span className="font-semibold text-white">
              {format(start, "MMM dd, yyyy")}
            </span>
          );
        }

        // Multi day leave
        return (
          <span className="font-semibold text-white">
            {startFormatted} – {format(end, "MMM dd, yyyy")}
          </span>
        );
      },
      className: "w-[30%]",
    },
    {
      header: "DAYS",
      accessor: (leave) => (
        <span className="font-bold text-white">
          {leave?.totalDays} {leave?.totalDays === 1 ? "day" : "days"}
        </span>
      ),
      className: "w-[12%]",
    },
    {
      header: "TYPE",
      accessor: (leave) => <LeaveTypeBadge leaveType={leave?.leaveType} />,
      className: "w-[13%]",
    },
    {
      header: "STATUS",
      accessor: (leave) => <LeaveStatusBadge status={leave?.status} />,
      className: "w-[20%]",
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
        <h2 className="text-md font-bold text-slate-200">All Leaves History</h2>
        <p className="text-xs text-slate-500 font-medium">
          {leaves?.length} {leaves?.length === 1 ? "record" : "records"} in
          history
        </p>
      </div>
      <Table
        data={leaves}
        columns={columns}
        actions={actions}
        onRowClick={onRowClick}
        isLoading={isLoading}
        loadingMessage="Loading leave history..."
        emptyMessage="No leave histories found."
      />
    </div>
  );
};
