"use client";

import { PageHeader } from "@/components/PageHeader";
import { Modal } from "@/components/Modal";
import { CalendarDays, Plus } from "lucide-react";
import { useLeavesDashboard } from "@/hooks/useLeavesDashboard";

import { LeaveStatsCards } from "@/components/leaves/LeaveStatsCards";
import { EmployeeLeaveTable } from "@/components/leaves/EmployeeLeaveTable";
import { PendingLeavesTable } from "@/components/leaves/PendingLeavesTable";
import { AllLeavesHistoryTable } from "@/components/leaves/AllLeavesHistoryTable";
import { LeaveActionModalContent } from "./LeaveActionModalContent";
import { LeaveForm } from "@/components/leaves/LeaveForm";

import { format } from "date-fns";
import { useState } from "react";
import { ILeave } from "@/types/leave/leave.types";

export default function LeavesPage() {
  const [selectedLeaveForDetails, setSelectedLeaveForDetails] =
    useState<ILeave | null>(null);
  const {
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
  } = useLeavesDashboard();

  return (
    <div className="flex-1 flex flex-col min-w-0 overflow-y-auto p-8 bg-slate-950">
      <PageHeader
        title="Leave Management"
        subtitle="Manage employee leave requests, balances, and records"
        icon={CalendarDays}
        action={
          !isAdmin
            ? {
                label: "Apply for Leave",
                icon: Plus,
                onClick: () => setIsApplyModalOpen(true),
              }
            : {
                label: "Record Staff Leave",
                icon: Plus,
                onClick: () => setIsAdminCreateModalOpen(true),
              }
        }
      />

      {!isAdmin ? (
        <div className="flex flex-col gap-6 max-w-6xl w-full mx-auto">
          <LeaveStatsCards balance={myBalance} />
          <EmployeeLeaveTable
            leaves={myLeaves}
            isLoading={isMyLeavesLoading}
            onRowClick={(leave) => setSelectedLeaveForDetails(leave)}
          />
        </div>
      ) : (
        <div className="flex flex-col gap-8 max-w-6xl w-full mx-auto">
          <PendingLeavesTable
            leaves={allLeaves}
            onActionClick={(leave, type) => {
              setSelectedLeaveForAction(leave);
              setActionType(type);
            }}
            onRowClick={(leave) => setSelectedLeaveForDetails(leave)}
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-1 p-6 rounded-2xl bg-slate-900/40 border border-slate-850 flex flex-col gap-4">
              <div>
                <h3 className="text-sm font-bold text-slate-200">
                  Leave Balance Summary
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Paid leave consumption this year
                </p>
              </div>
              <div className="flex flex-col gap-3 overflow-y-auto max-h-[300px] pr-2">
                {allBalances?.length === 0 ? (
                  <div className="text-center py-6 text-slate-500 text-xs">
                    No records initialized.
                  </div>
                ) : (
                  allBalances?.map((bal) => (
                    <div
                      key={bal?._id}
                      className="p-3.5 rounded-xl bg-slate-950/40 border border-slate-850 flex items-center justify-between">
                      <div>
                        <span className="text-xs font-semibold text-slate-200">
                          {typeof bal?.employee === "object"
                            ? bal.employee?.name
                            : "Employee"}
                        </span>
                        <span className="text-[10px] block text-slate-500 font-medium">
                          Used: {bal?.used} / {bal?.totalAllowed} days
                        </span>
                      </div>
                      <span className="text-xs font-extrabold text-emerald-400">
                        {bal?.remaining} Left
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="md:col-span-2">
              <AllLeavesHistoryTable
                leaves={allLeaves}
                isLoading={isAllLeavesLoading}
                onRowClick={(leave) => setSelectedLeaveForDetails(leave)}
              />
            </div>
          </div>
        </div>
      )}

      <Modal
        isOpen={isApplyModalOpen}
        onClose={() => setIsApplyModalOpen(false)}
        title="Apply for Leave">
        <LeaveForm
          isAdmin={false}
          myBalance={myBalance}
          onSubmit={handleApplyLeave}
          isPending={applyLeaveMutation.isPending}
          onCancel={() => setIsApplyModalOpen(false)}
        />
      </Modal>

      <Modal
        isOpen={isAdminCreateModalOpen}
        onClose={() => setIsAdminCreateModalOpen(false)}
        title="Record Staff Leave">
        <LeaveForm
          isAdmin={true}
          employees={employees}
          allBalances={allBalances}
          onSubmit={handleAdminCreateLeave}
          isPending={adminCreateLeaveMutation.isPending}
          onCancel={() => setIsAdminCreateModalOpen(false)}
        />
      </Modal>

      <LeaveActionModalContent
        selectedLeave={selectedLeaveForAction}
        actionType={actionType}
        onClose={() => {
          setSelectedLeaveForAction(null);
          setActionType(null);
        }}
        onSubmit={handleActionSubmit}
        isPending={
          approveLeaveMutation.isPending || rejectLeaveMutation.isPending
        }
      />

      <Modal
        isOpen={!!selectedLeaveForDetails}
        onClose={() => setSelectedLeaveForDetails(null)}
        title="Leave Request Details">
        {selectedLeaveForDetails && (
          <div className="flex flex-col gap-4 text-sm text-slate-200">
            <div className="grid grid-cols-2 gap-4 pb-2 border-b border-slate-800">
              <div>
                <span className="text-xs text-slate-400 block font-semibold uppercase">
                  Employee
                </span>
                <span className="text-slate-100 font-medium">
                  {typeof selectedLeaveForDetails?.employee === "object"
                    ? selectedLeaveForDetails?.employee?.name
                    : "Employee"}
                </span>
              </div>
              <div>
                <span className="text-xs text-slate-400 block font-semibold uppercase">
                  Status
                </span>
                <span className="font-semibold">
                  {selectedLeaveForDetails?.status === "approved" &&
                    "🟢 Approved"}
                  {selectedLeaveForDetails?.status === "rejected" &&
                    "🔴 Rejected"}
                  {selectedLeaveForDetails?.status === "pending" &&
                    "🟡 Pending"}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 pb-2 border-b border-slate-800">
              <div>
                <span className="text-xs text-slate-400 block font-semibold uppercase">
                  Dates
                </span>
                <span className="text-slate-100">
                  {format(
                    new Date(selectedLeaveForDetails?.startDate),
                    "MMM dd, yyyy",
                  )}{" "}
                  –{" "}
                  {format(
                    new Date(selectedLeaveForDetails?.endDate),
                    "MMM dd, yyyy",
                  )}
                </span>
              </div>
              <div>
                <span className="text-xs text-slate-400 block font-semibold uppercase">
                  Duration
                </span>
                <span className="text-slate-100 font-semibold">
                  {selectedLeaveForDetails?.totalDays}{" "}
                  {selectedLeaveForDetails?.totalDays === 1 ? "day" : "days"}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 pb-2 border-b border-slate-800">
              <div>
                <span className="text-xs text-slate-400 block font-semibold uppercase">
                  Leave Type
                </span>
                <span className="font-bold text-slate-100 uppercase">
                  {selectedLeaveForDetails?.leaveType}
                </span>
              </div>
              <div>
                <span className="text-xs text-slate-400 block font-semibold uppercase">
                  Authorized
                </span>
                <span className="text-slate-100">
                  {selectedLeaveForDetails?.isAuthorized ? "✓ Yes" : "— No"}
                </span>
              </div>
            </div>

            <div className="pb-2 border-b border-slate-800">
              <span className="text-xs text-slate-400 block font-semibold uppercase">
                Reason
              </span>
              <p className="text-slate-100 mt-1 leading-relaxed bg-slate-900/50 p-3 rounded-lg border border-slate-850">
                {selectedLeaveForDetails?.reason}
              </p>
            </div>

            <div>
              <span className="text-xs text-slate-400 block font-semibold uppercase">
                Admin Remarks
              </span>
              <p className="text-slate-100 mt-1 leading-relaxed bg-slate-900/50 p-3 rounded-lg border border-slate-850">
                {selectedLeaveForDetails?.adminNote || "No remarks provided."}
              </p>
            </div>

            <div className="flex justify-end mt-4">
              <button
                type="button"
                onClick={() => setSelectedLeaveForDetails(null)}
                className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-sm transition-all duration-200">
                Close
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
