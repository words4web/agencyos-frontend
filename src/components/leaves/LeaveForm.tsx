import { ELeaveType } from "@/enums";
import { useLeaveForm } from "../../hooks/useLeaveForm";
import { LeaveFormProps } from "@/types/leave/leave.types";
import { Input } from "@/components/Input";
import { Textarea } from "@/components/Textarea";
import { Checkbox } from "@/components/Checkbox";

export const LeaveForm = ({
  isAdmin,
  employees = [],
  myBalance,
  allBalances = [],
  onSubmit,
  isPending,
  onCancel,
}: LeaveFormProps) => {
  const { form, isHalfDay, hasPaidBalance, handleFormSubmit } = useLeaveForm({
    isAdmin,
    myBalance,
    allBalances,
    onSubmit,
  });

  const {
    register,
    formState: { errors },
  } = form;

  return (
    <form onSubmit={handleFormSubmit} className="flex flex-col gap-4">
      {isAdmin && (
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-slate-400 uppercase">
            Select Employee
          </label>
          <select
            {...register("employeeId")}
            required
            className="px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 text-sm focus:outline-none focus:border-indigo-500">
            <option value="">-- Choose Employee --</option>
            {employees?.map((emp) => (
              <option key={emp?._id} value={emp?._id}>
                {emp?.name} ({emp?.designation})
              </option>
            ))}
          </select>
          {errors.employeeId && (
            <span className="text-xs text-rose-500">
              {errors.employeeId.message}
            </span>
          )}
        </div>
      )}

      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-bold text-slate-400 uppercase">
          Leave Type
        </label>
        <select
          {...register("leaveType")}
          className="px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 text-sm focus:outline-none focus:border-indigo-500">
          {hasPaidBalance && (
            <option value={ELeaveType.PAID}>Paid Leave</option>
          )}
          <option value={ELeaveType.UNPAID}>Unpaid Leave</option>
        </select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Input
          type="date"
          label={
            <span className="text-xs font-bold text-slate-400 uppercase">
              Start Date
            </span>
          }
          error={errors.startDate?.message}
          required
          className="px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 text-sm focus:outline-none focus:border-indigo-500"
          {...register("startDate")}
        />

        <Input
          type="date"
          label={
            <span className="text-xs font-bold text-slate-400 uppercase">
              End Date
            </span>
          }
          error={errors.endDate?.message}
          required
          disabled={isHalfDay}
          className={`px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 text-sm focus:outline-none focus:border-indigo-500 ${isHalfDay ? "opacity-40 cursor-not-allowed" : ""}`}
          {...register("endDate")}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <Checkbox
          label="Half Day"
          error={errors.isHalfDay?.message}
          {...register("isHalfDay")}
        />
        <p className="text-xs text-slate-500 ml-0.5">
          Half-day leave deducts 0.5 days from your balance.
        </p>
      </div>

      <Textarea
        label={
          <span className="text-xs font-bold text-slate-400 uppercase">
            Reason for Leave
          </span>
        }
        placeholder="Provide a reason or justification..."
        required
        rows={3}
        className="px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 text-sm focus:outline-none focus:border-indigo-500 resize-none"
        error={errors.reason?.message}
        {...register("reason")}
      />

      {isAdmin && (
        <>
          <div className="grid grid-cols-2 gap-4 pt-1">
            <Checkbox
              label="Late Notice"
              error={errors.lateNotice?.message}
              {...register("lateNotice")}
            />

            <Checkbox
              label="Authorized"
              error={errors.isAuthorized?.message}
              {...register("isAuthorized")}
            />
          </div>

          <Input
            type="text"
            label={
              <span className="text-xs font-bold text-slate-400 uppercase">
                Remarks / Notes
              </span>
            }
            placeholder="Optional remarks..."
            className="px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 text-sm focus:outline-none focus:border-indigo-500"
            {...register("adminNote")}
          />
        </>
      )}

      <div className="flex justify-end gap-2.5 mt-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-sm transition-all duration-200">
          Cancel
        </button>
        <button
          type="submit"
          disabled={isPending}
          className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-slate-100 font-semibold text-sm transition-all duration-200">
          {isPending ? "Submitting..." : "Apply Leave"}
        </button>
      </div>
    </form>
  );
};
