import { CalendarCheck2, CalendarClock, CheckCircle2 } from "lucide-react";
import { ILeaveBalance } from "@/types/leave/leave.types";

export const LeaveStatsCards = ({
  balance,
}: {
  balance: ILeaveBalance | null;
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <div className="p-4 rounded-xl bg-slate-900/20 border border-slate-800/80 flex items-center justify-between">
        <div>
          <span className="text-[12px] font-bold text-white tracking-wider">
            Total Allowed Paid Leave (Yearly)
          </span>
          <h3 className="text-xl font-extrabold text-white mt-1">
            {balance?.totalAllowed ?? 6}{" "}
            {(balance?.totalAllowed ?? 6) === 1 ? "Day" : "Days"}
          </h3>
        </div>
        <div className="p-2.5 rounded-lg bg-slate-800/40 text-slate-400">
          <CalendarCheck2 size={16} />
        </div>
      </div>

      <div className="p-4 rounded-xl bg-slate-900/20 border border-slate-800/80 flex items-center justify-between">
        <div>
          <span className="text-[12px] font-bold text-white tracking-wider">
            Paid Leave Used
          </span>
          <h3 className="text-xl font-extrabold text-blue-400 mt-1">
            {balance?.used ?? 0} {(balance?.used ?? 0) === 1 ? "Day" : "Days"}
          </h3>
        </div>
        <div className="p-2.5 rounded-lg bg-blue-500/10 text-blue-400">
          <CalendarClock size={16} />
        </div>
      </div>

      <div className="p-4 rounded-xl bg-slate-900/20 border border-slate-800/80 flex items-center justify-between">
        <div>
          <span className="text-[12px] font-bold text-white tracking-wider">
            Remaining Paid Leave
          </span>
          <h3 className="text-xl font-extrabold text-emerald-400 mt-1">
            {balance?.remaining ?? 6}{" "}
            {(balance?.remaining ?? 6) === 1 ? "Day" : "Days"}
          </h3>
        </div>
        <div className="p-2.5 rounded-lg bg-emerald-500/10 text-emerald-400">
          <CheckCircle2 size={16} />
        </div>
      </div>
    </div>
  );
};
