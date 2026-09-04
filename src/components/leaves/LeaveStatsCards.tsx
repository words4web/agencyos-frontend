import { CheckCircle2, AlertCircle, Info } from "lucide-react";
import { ILeave, ILeaveBalance } from "@/types/leave/leave.types";
import { ELeaveType } from "@/enums";

export const LeaveStatsCards = ({
  balance,
  leaves = [],
}: {
  balance: ILeaveBalance | null;
  leaves?: ILeave[];
}) => {
  const totalAllowed = balance?.totalAllowed ?? 6;
  const used = balance?.used ?? 0;
  const remaining = balance?.remaining ?? 6;

  const unpaidLeaveDays = leaves
    ?.filter(
      (leave) =>
        leave?.leaveType === ELeaveType.UNPAID && leave?.status === "approved",
    )
    ?.reduce((sum, leave) => sum + (leave?.totalDays || 0), 0);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div className="p-4 rounded-xl bg-slate-900/20 border border-slate-800/80 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-1.5">
            <span className="text-[12px] font-bold text-white tracking-wider">
              Paid Leave Balance
            </span>
            <div
              className="group relative cursor-pointer text-slate-400 hover:text-slate-200"
              title={`Used ${used} of ${totalAllowed} allowed paid days`}>
              <Info size={13} />
              <div className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block w-max max-w-[220px] rounded-lg bg-slate-800 border border-slate-700 p-2 text-[11px] text-slate-200 shadow-xl z-20 font-normal">
                Used <span className="font-semibold text-blue-400">{used}</span>{" "}
                of{" "}
                <span className="font-semibold text-white">{totalAllowed}</span>{" "}
                allowed days
              </div>
            </div>
          </div>
          <h3 className="text-xl font-extrabold text-emerald-400 mt-1">
            {remaining}{" "}
            <span className="text-sm font-semibold text-slate-400">
              / {totalAllowed} Days Remaining
            </span>
          </h3>
        </div>
        <div className="p-2.5 rounded-lg bg-emerald-500/10 text-emerald-400">
          <CheckCircle2 size={16} />
        </div>
      </div>

      <div className="p-4 rounded-xl bg-slate-900/20 border border-slate-800/80 flex items-center justify-between">
        <div>
          <span className="text-[12px] font-bold text-white tracking-wider">
            Unpaid Leave Taken
          </span>
          <h3 className="text-xl font-extrabold text-amber-400 mt-1">
            {unpaidLeaveDays} {unpaidLeaveDays === 1 ? "Day" : "Days"}
          </h3>
        </div>
        <div className="p-2.5 rounded-lg bg-amber-500/10 text-amber-400">
          <AlertCircle size={16} />
        </div>
      </div>
    </div>
  );
};
