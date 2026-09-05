import { Users } from "lucide-react";
import { EmployeeBreakdownGridProps } from "@/types/report/report.types";
import { EmployeeCard } from "./EmployeeCard";

export const EmployeeBreakdownGrid = ({
  employees,
  topPerformerName,
  expandedCards,
  onToggleExpand,
}: EmployeeBreakdownGridProps) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 text-lg font-bold text-slate-100">
        <Users size={20} className="text-indigo-400" />
        <h2>Employee Breakdown</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {employees?.map((entry) => (
          <EmployeeCard
            key={entry?.user?.id}
            entry={entry}
            isTop={entry?.user?.name === topPerformerName}
            isExpanded={!!expandedCards[entry?.user?.id]}
            onToggle={() => onToggleExpand(entry?.user?.id)}
          />
        ))}
      </div>
    </div>
  );
};
