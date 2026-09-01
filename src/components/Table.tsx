import { useState, useRef, useEffect } from "react";
import { MoreVertical } from "lucide-react";

import { TableProps } from "@/types/common/common.types";

export function Table<T>({
  data,
  columns,
  isLoading = false,
  loadingMessage = "Loading records...",
  emptyMessage = "No records found.",
  actions = [],
  onRowClick,
}: TableProps<T>) {
  const [activeRowId, setActiveRowId] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setActiveRowId(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="w-full rounded-md border border-slate-800/80 bg-slate-900/10 shadow-xl backdrop-blur-md">
      <div className="overflow-x-visible">
        <table className="w-full border-collapse text-left text-sm text-white">
          <thead className="bg-slate-950/40 text-[9px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-850">
            <tr>
              {columns?.map((col, idx) => (
                <th key={idx} className={`px-6 py-3.5 ${col?.className || ""}`}>
                  {col?.header}
                </th>
              ))}
              {actions.length > 0 && (
                <th className="px-6 py-3.5 text-right w-16">Actions</th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700 bg-slate-900/5">
            {isLoading ? (
              <tr>
                <td
                  colSpan={columns?.length + (actions?.length > 0 ? 1 : 0)}
                  className="px-6 py-12 text-center text-slate-400">
                  <div className="flex flex-col items-center justify-center gap-3">
                    <div className="w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
                    <span className="text-xs font-semibold tracking-wide">
                      {loadingMessage}
                    </span>
                  </div>
                </td>
              </tr>
            ) : data?.length === 0 ? (
              <tr>
                <td
                  colSpan={columns?.length + (actions?.length > 0 ? 1 : 0)}
                  className="px-6 py-12 text-center text-slate-500 text-xs font-medium">
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              data?.map((row: any, rowIdx) => {
                const rowKey = row?._id || rowIdx.toString();
                return (
                  <tr
                    key={rowKey}
                    onClick={() => onRowClick && onRowClick(row)}
                    className={`hover:bg-slate-800/20 transition-all duration-200 group ${
                      onRowClick ? "cursor-pointer" : ""
                    }`}>
                    {columns.map((col, colIdx) => (
                      <td
                        key={colIdx}
                        className={`px-6 py-2.5 align-middle ${col?.className || ""}`}>
                        {col?.accessor(row)}
                      </td>
                    ))}
                    {actions?.length > 0 && (
                      <td
                        className="px-6 py-2.5 align-middle text-right relative"
                        onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveRowId(
                              activeRowId === rowKey ? null : rowKey,
                            );
                          }}
                          className="p-1.5 rounded-lg bg-slate-900/50 border border-slate-800 text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-all duration-250">
                          <MoreVertical size={16} />
                        </button>
                        {activeRowId === rowKey && (
                          <div
                            ref={dropdownRef}
                            className="absolute right-6 mt-1.5 w-44 rounded-xl border border-slate-800 bg-slate-950 p-1 shadow-2xl z-50 animate-in fade-in slide-in-from-top-1 duration-200">
                            {actions?.map((act, actIdx) => (
                              <button
                                key={actIdx}
                                onClick={() => {
                                  act.onClick(row);
                                  setActiveRowId(null);
                                }}
                                className={`w-full text-left px-3.5 py-2 text-xs font-semibold rounded-lg hover:bg-slate-900 transition-all duration-150 ${act?.className || "text-slate-300 hover:text-slate-100"}`}>
                                {act?.label}
                              </button>
                            ))}
                          </div>
                        )}
                      </td>
                    )}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
