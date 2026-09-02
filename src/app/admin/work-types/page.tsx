"use client";

import { useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { Modal } from "@/components/Modal";
import { ConfirmModal } from "@/components/ConfirmModal";
import {
  useGetWorkTypes,
  useDeleteWorkType,
} from "@/services/workType/workType.hooks";
import { WorkTypeManagementModal } from "@/components/workType/WorkTypeManagementModal";
import { IWorkType } from "@/types/workType/workType.types";
import { CheckSquare, Plus, Edit3, Trash2, ListChecks } from "lucide-react";

export default function WorkTypesPage() {
  const { data: rawWorkTypes = [], isLoading } = useGetWorkTypes(true);
  const workTypes = Array.isArray(rawWorkTypes) ? rawWorkTypes : [];
  const [selectedWorkType, setSelectedWorkType] = useState<IWorkType | null>(
    null,
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deletingWorkType, setDeletingWorkType] = useState<IWorkType | null>(
    null,
  );

  const deleteMutation = useDeleteWorkType();

  const handleOpenCreate = () => {
    setSelectedWorkType(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (workType: IWorkType) => {
    setSelectedWorkType(workType);
    setIsModalOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (!deletingWorkType) return;
    deleteMutation.mutate(deletingWorkType._id, {
      onSuccess: () => setDeletingWorkType(null),
    });
  };

  return (
    <div className="max-w-6xl mx-auto flex flex-col gap-6">
      <PageHeader
        title="Work Type Checklists"
        subtitle="Manage reusable deliverable checklists for ticket workflows"
        icon={CheckSquare}
        action={{
          label: "Add Work Type",
          icon: Plus,
          onClick: handleOpenCreate,
        }}
      />

      {isLoading ? (
        <div className="flex items-center justify-center p-12 text-slate-500 text-sm">
          Loading work types...
        </div>
      ) : workTypes?.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 bg-slate-950/40 border border-slate-800 rounded-2xl text-center gap-3">
          <ListChecks size={32} className="text-slate-600" />
          <h3 className="text-sm font-bold text-slate-300">
            No Work Types Created
          </h3>
          <p className="text-xs text-slate-500 max-w-sm">
            Create work types (like Reel Creation, Blog Post, UI Design) to
            automatically attach deliverable checklists when assigning tickets.
          </p>
          <button
            onClick={handleOpenCreate}
            className="mt-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition-all shadow-md shadow-indigo-600/20 flex items-center gap-1.5">
            <Plus size={14} /> Create First Work Type
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {workTypes?.map((wt) => (
            <div
              key={wt?._id}
              className={`flex flex-col gap-3 p-5 rounded-2xl border transition-all ${
                wt?.isActive
                  ? "bg-slate-950/40 border-slate-800/80 hover:border-slate-700"
                  : "bg-slate-950/20 border-slate-900 opacity-60"
              }`}>
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400">
                    <CheckSquare size={16} />
                  </div>
                  <div className="flex flex-col">
                    <h4 className="text-sm font-bold text-slate-200">
                      {wt?.name}
                    </h4>
                    <span className="text-[10px] font-semibold text-slate-500">
                      {wt?.items?.length || 0} checklist items
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleOpenEdit(wt)}
                    className="p-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors border border-slate-800"
                    title="Edit Work Type">
                    <Edit3 size={14} />
                  </button>
                  <button
                    onClick={() => setDeletingWorkType(wt)}
                    className="p-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-red-400 transition-colors border border-slate-800"
                    title="Deactivate Work Type">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>

              {wt?.description && (
                <p className="text-xs text-slate-400 leading-relaxed break-words whitespace-pre-wrap max-h-32 overflow-y-auto pr-1">
                  {wt?.description}
                </p>
              )}

              <div className="flex flex-col gap-1.5 mt-2 pt-3 border-t border-slate-900">
                <span className="text-[10px] uppercase font-bold text-slate-500">
                  Default Items
                </span>
                <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto pr-1">
                  {wt?.items && wt?.items?.length > 0 ? (
                    wt?.items?.map((item, i) => (
                      <span
                        key={i}
                        className="text-[10px] font-semibold bg-slate-900 text-slate-300 border border-slate-800 px-2 py-0.5 rounded-md flex items-center gap-1 break-words max-w-full">
                        <span className="break-words max-w-full">
                          {item.label}
                        </span>
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-slate-500 italic">
                      No items defined
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        closeOnBackdropClick={false}
        title={selectedWorkType ? "Edit Work Type" : "Create New Work Type"}>
        <WorkTypeManagementModal
          workType={selectedWorkType}
          onClose={() => setIsModalOpen(false)}
        />
      </Modal>

      <ConfirmModal
        isOpen={!!deletingWorkType}
        title="Deactivate Work Type"
        description={`Are you sure you want to deactivate "${deletingWorkType?.name}"? It will no longer appear in the Work Type selector for new tickets.`}
        confirmLabel="Deactivate"
        variant="danger"
        isLoading={deleteMutation.isPending}
        onConfirm={handleDeleteConfirm}
        onClose={() => setDeletingWorkType(null)}
      />
    </div>
  );
}
