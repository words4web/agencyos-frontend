"use client";

import { useState } from "react";
import { Modal } from "@/components/Modal";
import { Search } from "lucide-react";
import { StaffLeaveBalanceModalProps } from "@/types/leave/leave.types";
import { EUserRole } from "@/enums";

export function StaffLeaveBalanceModal({
  isOpen,
  onClose,
  allBalances,
}: StaffLeaveBalanceModalProps) {
  const [balanceSearchQuery, setBalanceSearchQuery] = useState("");

  const handleClose = () => {
    setBalanceSearchQuery("");
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      size="max-w-3xl"
      title="Staff Leave Balance Directory">
      <div className="flex flex-col gap-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800/80">
          <div>
            <p className="text-xs text-slate-400">
              Annual paid leave allowances, consumed days, and available
              balances for current year.
            </p>
          </div>

          {/* Search Filter */}
          <div className="relative min-w-[240px]">
            <Search
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              type="text"
              placeholder="Search employee..."
              value={balanceSearchQuery}
              onChange={(e) => setBalanceSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-slate-950/80 border border-slate-800 rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500/60 transition-colors"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[520px] overflow-y-auto pr-1 custom-scrollbar">
          {(() => {
            const filteredBalances = allBalances
              ?.filter((bal) => {
                const emp =
                  typeof bal?.employee === "object" ? bal.employee : null;
                return emp?.role !== EUserRole.ADMIN;
              })
              ?.filter((bal) => {
                if (!balanceSearchQuery.trim()) return true;
                const emp =
                  typeof bal?.employee === "object" ? bal.employee : null;
                const name = emp?.name?.toLowerCase() || "";
                const email = emp?.email?.toLowerCase() || "";
                const query = balanceSearchQuery.toLowerCase();
                return name.includes(query) || email.includes(query);
              });

            if (!filteredBalances || filteredBalances.length === 0) {
              return (
                <div className="col-span-full py-12 text-center text-xs text-slate-500">
                  {balanceSearchQuery
                    ? "No employees match your search query."
                    : "No employee leave balances found."}
                </div>
              );
            }

            return filteredBalances.map((bal) => {
              const emp =
                typeof bal?.employee === "object" ? bal.employee : null;
              const percentUsed =
                bal?.totalAllowed > 0
                  ? Math.min(
                      100,
                      Math.round((bal.used / bal.totalAllowed) * 100),
                    )
                  : 0;

              return (
                <div
                  key={bal?._id}
                  className="p-4 rounded-xl bg-slate-950/70 border border-slate-800/80 hover:border-slate-700 transition-all flex flex-col justify-between gap-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <h4 className="text-sm font-bold text-slate-200 truncate">
                        {emp?.name || "Employee"}
                      </h4>
                      <p className="text-xs text-slate-400 truncate">
                        {emp?.email || "No email available"}
                      </p>
                    </div>
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs font-bold border shrink-0 ${
                        bal?.remaining === 0
                          ? "bg-rose-500/10 text-rose-400 border-rose-500/20"
                          : "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                      }`}>
                      {bal?.remaining} Left
                    </span>
                  </div>

                  <div className="space-y-1.5 pt-2 border-t border-slate-850">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-400">Used:</span>
                      <span className="font-semibold text-slate-300">
                        {bal?.used} / {bal?.totalAllowed} Days
                      </span>
                    </div>
                    {/* Progress track */}
                    <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-300 ${
                          percentUsed >= 100
                            ? "bg-rose-500"
                            : percentUsed >= 70
                              ? "bg-amber-500"
                              : "bg-blue-500"
                        }`}
                        style={{ width: `${percentUsed}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            });
          })()}
        </div>

        <div className="flex justify-end pt-3 border-t border-slate-800/80">
          <button
            type="button"
            onClick={handleClose}
            className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 text-xs font-semibold border border-slate-700/60 transition-colors">
            Close Directory
          </button>
        </div>
      </div>
    </Modal>
  );
}
