import React, { useState } from "react";
import { Modal } from "@/components/Modal";
import { Button } from "@/components/Button";
import { AllocateTeamModalProps } from "@/types/project/project.types";
import { assignEmployeesSchema } from "@/schemas/project/project.schema";
import { useAssignEmployees } from "@/services/project/project.hooks";

export function AllocateTeamModal({
  isOpen,
  onClose,
  project,
  employees,
}: AllocateTeamModalProps) {
  const assignEmployeesMutation = useAssignEmployees();
  const [selectedEmployeeIds, setSelectedEmployeeIds] = useState<string[]>(
    () => (project ? project.employees.map((e) => e._id) : []),
  );

  const toggleEmployeeSelection = (id: string) => {
    if (selectedEmployeeIds.includes(id)) {
      setSelectedEmployeeIds(selectedEmployeeIds.filter((eId) => eId !== id));
    } else {
      setSelectedEmployeeIds([...selectedEmployeeIds, id]);
    }
  };

  const handleAssignEmployees = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!project) return;

    const result = assignEmployeesSchema.safeParse({
      employeeIds: selectedEmployeeIds,
    });

    if (!result.success) {
      alert(result.error.issues[0].message);
      return;
    }

    assignEmployeesMutation.mutate(
      {
        projectId: project._id,
        payload: { employeeIds: selectedEmployeeIds },
      },
      {
        onSuccess: () => {
          onClose();
        },
        onError: (err: unknown) => {
          console.error("Failed to assign employees", err);
        },
      },
    );
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Allocate Team to Project">
      <form onSubmit={handleAssignEmployees} className="flex flex-col gap-4">
        <div className="text-sm text-slate-400 mb-2">
          Select which staff members should access this project:
        </div>
        <div className="flex flex-col gap-2 max-h-60 overflow-y-auto pr-2">
          {employees.length === 0 ? (
            <span className="text-xs text-slate-500 italic">
              No employees found. Create some in the Employee section.
            </span>
          ) : (
            employees.map((emp) => {
              const checked = selectedEmployeeIds.includes(emp._id);
              return (
                <label
                  key={emp._id}
                  className="flex items-center gap-3 p-2.5 rounded-lg border border-slate-800 bg-slate-950/40 hover:bg-slate-900/30 cursor-pointer transition-colors">
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => toggleEmployeeSelection(emp._id)}
                    className="rounded border-slate-700 bg-slate-900 text-indigo-600 focus:ring-indigo-500 focus:ring-offset-0 w-4 h-4"
                  />
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold text-slate-200">
                      {emp.name}
                    </span>
                    <span className="text-xs text-indigo-400">
                      {emp.designation}
                    </span>
                  </div>
                </label>
              );
            })
          )}
        </div>
        <div className="flex gap-3 justify-end mt-4">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={assignEmployeesMutation.isPending}>
            {assignEmployeesMutation.isPending
              ? "Allocating..."
              : "Save Allocation"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
