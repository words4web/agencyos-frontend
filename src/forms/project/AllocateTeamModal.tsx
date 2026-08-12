import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Modal } from "@/components/Modal";
import { Button } from "@/components/Button";
import { AllocateTeamModalProps } from "@/types/project/project.types";
import {
  assignEmployeesSchema,
  AssignEmployeesFormValues,
} from "@/schemas/project/project.schema";
import { useAssignEmployees } from "@/services/project/project.hooks";

export function AllocateTeamModal({
  isOpen,
  onClose,
  project,
  employees,
}: AllocateTeamModalProps) {
  const assignEmployeesMutation = useAssignEmployees();

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<AssignEmployeesFormValues>({
    resolver: zodResolver(assignEmployeesSchema),
    defaultValues: {
      employeeIds: project ? project?.employees?.map((e) => e?._id) : [],
    },
  });

  const onSubmit = (data: AssignEmployeesFormValues) => {
    if (!project) return;
    assignEmployeesMutation.mutate(
      {
        projectId: project._id,
        payload: { employeeIds: data.employeeIds },
      },
      {
        onSuccess: () => {
          onClose();
        },
        onError: () => {
          toast.error("Failed to assign employees. Please try again.");
        },
      },
    );
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Allocate Team to Project">
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <div className="text-sm text-slate-400 mb-2">
          Select which staff members should access this project:
        </div>
        <Controller
          name="employeeIds"
          control={control}
          render={({ field }) => (
            <div className="flex flex-col gap-2 max-h-60 overflow-y-auto pr-2">
              {employees?.length === 0 ? (
                <span className="text-xs text-slate-500 italic">
                  No employees found. Create some in the Employee section.
                </span>
              ) : (
                employees?.map((emp) => {
                  const checked = field?.value?.includes(emp?._id);
                  return (
                    <label
                      key={emp?._id}
                      className="flex items-center gap-3 p-2.5 rounded-lg border border-slate-800 bg-slate-950/40 hover:bg-slate-900/30 cursor-pointer transition-colors">
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => {
                          const next = checked
                            ? field?.value?.filter((id) => id !== emp?._id)
                            : [...field?.value, emp?._id];
                          field?.onChange(next);
                        }}
                        className="rounded border-slate-700 bg-slate-900 text-indigo-600 focus:ring-indigo-500 focus:ring-offset-0 w-4 h-4"
                      />
                      <div className="flex flex-col">
                        <span className="text-sm font-semibold text-slate-200">
                          {emp?.name}
                        </span>
                        <span className="text-xs text-indigo-400">
                          {emp?.designation}
                        </span>
                      </div>
                    </label>
                  );
                })
              )}
            </div>
          )}
        />
        {errors?.employeeIds && (
          <p className="text-xs text-red-400">{errors?.employeeIds?.message}</p>
        )}
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
