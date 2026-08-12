import React from "react";
import { EmployeeTableProps } from "@/types/employee/employee.types";

export const EmployeeTable: React.FC<EmployeeTableProps> = ({ employees }) => {
  return (
    <div className="bg-slate-900/40 border border-slate-800 rounded-xl overflow-hidden backdrop-blur-md">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-slate-800 bg-slate-950/30 text-xs font-semibold text-slate-400 uppercase">
            <th className="px-6 py-4">Name</th>
            <th className="px-6 py-4">Email</th>
            <th className="px-6 py-4">Designation</th>
            <th className="px-6 py-4">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-800 text-sm text-slate-300">
          {employees?.length === 0 ? (
            <tr>
              <td colSpan={4} className="px-6 py-10 text-center text-slate-500">
                No employees registered yet. Click &quot;Add Employee&quot; to
                create one.
              </td>
            </tr>
          ) : (
            employees?.map((emp) => (
              <tr
                key={emp?._id}
                className="hover:bg-slate-900/20 transition-colors">
                <td className="px-6 py-4 font-medium text-slate-100">
                  {emp?.name}
                </td>
                <td className="px-6 py-4 text-slate-400">{emp?.email}</td>
                <td className="px-6 py-4 text-indigo-400 font-semibold">
                  {emp?.designation}
                </td>
                <td className="px-6 py-4">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400">
                    Active
                  </span>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};
