"use client";

import { PageHeader } from "@/components/PageHeader";
import { Modal } from "@/components/Modal";
import { CalendarDays, Plus, Users, ArrowUpRight } from "lucide-react";
import { useLeavesDashboard } from "@/hooks/useLeavesDashboard";

import { LeaveStatsCards } from "@/components/leaves/LeaveStatsCards";
import { EmployeeLeaveTable } from "@/components/leaves/EmployeeLeaveTable";
import { PendingLeavesTable } from "@/components/leaves/PendingLeavesTable";
import { AllLeavesHistoryTable } from "@/components/leaves/AllLeavesHistoryTable";
import { StaffLeaveBalanceModal } from "@/components/modals/leaves/StaffLeaveBalanceModal";
import { LeaveDetailsModal } from "@/components/modals/leaves/LeaveDetailsModal";
import { LeaveActionModalContent } from "./LeaveActionModalContent";
import { LeaveForm } from "@/components/leaves/LeaveForm";

import { useState } from "react";
import { ILeave } from "@/types/leave/leave.types";
import { EUserRole } from "@/enums";

export default function LeavesPage() {
  const [selectedLeaveForDetails, setSelectedLeaveForDetails] =
    useState<ILeave | null>(null);
  const [isBalanceModalOpen, setIsBalanceModalOpen] = useState(false);
  const [adminLeaveTab, setAdminLeaveTab] = useState<"pending" | "history">(
    "pending",
  );
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

  const pendingLeavesCount =
    allLeaves?.filter((l) => l?.status === "pending").length || 0;
  const historyLeavesCount = allLeaves?.length || 0;

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
          <LeaveStatsCards balance={myBalance} leaves={myLeaves} />
          <EmployeeLeaveTable
            leaves={myLeaves}
            isLoading={isMyLeavesLoading}
            onRowClick={(leave) => setSelectedLeaveForDetails(leave)}
          />
        </div>
      ) : (
        <div className="flex flex-col gap-6 max-w-6xl w-full mx-auto">
          <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-900/80 via-slate-900/50 to-slate-900/30 border border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                <Users size={22} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-slate-100">
                    Staff Leave Balances
                  </h3>
                  <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-blue-500/15 text-blue-400 border border-blue-500/30">
                    {allBalances?.filter((bal) => {
                      const emp =
                        typeof bal?.employee === "object" ? bal.employee : null;
                      return emp?.role !== EUserRole.ADMIN;
                    }).length || 0}{" "}
                    Employees
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  Track annual paid leave quotas, usage, and remaining
                  allowances
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsBalanceModalOpen(true)}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-750 text-slate-200 text-xs font-semibold border border-slate-700/70 hover:border-slate-600 transition-all duration-200 shadow-sm shrink-0">
              <span>View All Balances</span>
              <ArrowUpRight size={15} className="text-slate-400" />
            </button>
          </div>

          <div className="flex items-center gap-2 border-b border-slate-800/80 pb-3">
            <button
              type="button"
              onClick={() => setAdminLeaveTab("pending")}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all duration-200 ${
                adminLeaveTab === "pending"
                  ? "bg-blue-600 text-white shadow-sm"
                  : "bg-slate-900/40 text-slate-400 hover:text-slate-200 hover:bg-slate-900 border border-slate-800/60"
              }`}>
              <span>Pending Requests</span>
              <span
                className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                  adminLeaveTab === "pending"
                    ? "bg-blue-700/80 text-white"
                    : pendingLeavesCount > 0
                      ? "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                      : "bg-slate-800 text-slate-400"
                }`}>
                {pendingLeavesCount}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setAdminLeaveTab("history")}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all duration-200 ${
                adminLeaveTab === "history"
                  ? "bg-blue-600 text-white shadow-sm"
                  : "bg-slate-900/40 text-slate-400 hover:text-slate-200 hover:bg-slate-900 border border-slate-800/60"
              }`}>
              <span>All Leaves History</span>
              <span
                className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                  adminLeaveTab === "history"
                    ? "bg-blue-700/80 text-white"
                    : "bg-slate-800 text-slate-400"
                }`}>
                {historyLeavesCount}
              </span>
            </button>
          </div>

          <div className="w-full">
            {adminLeaveTab === "pending" ? (
              <PendingLeavesTable
                leaves={allLeaves}
                onActionClick={(leave, type) => {
                  setSelectedLeaveForAction(leave);
                  setActionType(type);
                }}
                onRowClick={(leave) => setSelectedLeaveForDetails(leave)}
              />
            ) : (
              <AllLeavesHistoryTable
                leaves={allLeaves}
                isLoading={isAllLeavesLoading}
                onRowClick={(leave) => setSelectedLeaveForDetails(leave)}
              />
            )}
          </div>
        </div>
      )}

      <Modal
        isOpen={isApplyModalOpen}
        onClose={() => setIsApplyModalOpen(false)}
        title="Apply for Leave"
        closeOnBackdropClick={false}>
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
        title="Record Staff Leave"
        closeOnBackdropClick={false}>
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
        key={selectedLeaveForAction?._id || "none"}
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

      <LeaveDetailsModal
        leave={selectedLeaveForDetails}
        onClose={() => setSelectedLeaveForDetails(null)}
      />

      <StaffLeaveBalanceModal
        isOpen={isBalanceModalOpen}
        onClose={() => setIsBalanceModalOpen(false)}
        allBalances={allBalances}
      />
    </div>
  );
}
