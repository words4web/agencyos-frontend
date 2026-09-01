import { useState } from "react";
import { IWorkType } from "@/types/workType/workType.types";
import { Plus, Trash2, ListChecks } from "lucide-react";
import {
  useCreateWorkType,
  useUpdateWorkType,
} from "@/services/workType/workType.hooks";
import { toast } from "sonner";
import { Input } from "@/components/Input";

export function WorkTypeManagementModal({
  workType,
  onClose,
}: {
  workType?: IWorkType | null;
  onClose: () => void;
}) {
  const [name, setName] = useState(workType?.name || "");
  const [description, setDescription] = useState(workType?.description || "");
  const [items, setItems] = useState<{ label: string }[]>(
    workType?.items ? workType.items.map((i) => ({ label: i.label })) : [],
  );
  const [newItemLabel, setNewItemLabel] = useState("");

  const createMutation = useCreateWorkType();
  const updateMutation = useUpdateWorkType();

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemLabel.trim()) return;
    setItems((prev) => [...prev, { label: newItemLabel.trim() }]);
    setNewItemLabel("");
  };

  const handleRemoveItem = (index: number) => {
    setItems((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    if (items?.length === 0) {
      toast.error("Please add at least one deliverable checklist item.");
      return;
    }

    const payload = {
      name: name?.trim(),
      description: description?.trim(),
      items: items?.map((i) => ({ label: i?.label })),
    };

    if (workType) {
      updateMutation.mutate(
        { id: workType?._id, payload },
        { onSuccess: onClose },
      );
    } else {
      createMutation.mutate(payload, { onSuccess: onClose });
    }
  };

  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <Input
        id="workTypeName"
        label="Work Type Name"
        placeholder="e.g. Reel Creation, Blog Post, UI Design"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />

      <div className="flex flex-col gap-1">
        <label className="text-xs font-semibold text-slate-300">
          Description (Optional)
        </label>
        <textarea
          placeholder="Describe when to assign this work type..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={2}
          className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
        />
      </div>

      <div className="flex flex-col gap-2 pt-2 border-t border-slate-800">
        <label className="text-xs font-semibold text-slate-300 flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <ListChecks size={14} className="text-indigo-400" />
            Default Deliverable Checklist Items ({items.length})
          </span>
        </label>

        <div className="flex flex-col gap-2 max-h-48 overflow-y-auto pr-1">
          {items.length > 0 ? (
            items.map((item, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-200">
                <span className="font-medium truncate flex-1">
                  {item.label}
                </span>
                <button
                  type="button"
                  onClick={() => handleRemoveItem(index)}
                  className="p-1 text-slate-500 hover:text-red-400 transition-colors ml-2">
                  <Trash2 size={13} />
                </button>
              </div>
            ))
          ) : (
            <span className="text-xs text-slate-500 italic py-1">
              No checklist items added yet. Add items below.
            </span>
          )}
        </div>

        <div className="flex gap-2 items-end mt-1">
          <Input
            id="newItemLabel"
            placeholder="Add default checklist item (e.g. Client logo added)..."
            value={newItemLabel}
            onChange={(e) => setNewItemLabel(e.target.value)}
          />
          <button
            type="button"
            onClick={handleAddItem}
            className="px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs transition-all flex items-center gap-1 shrink-0 h-[38px]">
            <Plus size={13} /> Add
          </button>
        </div>
      </div>

      <div className="flex justify-end gap-2 mt-4 pt-3 border-t border-slate-800">
        <button
          type="button"
          onClick={onClose}
          disabled={isPending}
          className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs transition-all">
          Cancel
        </button>
        <button
          type="submit"
          disabled={isPending}
          className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition-all shadow-md shadow-indigo-600/20">
          {isPending
            ? "Saving..."
            : workType
              ? "Update Work Type"
              : "Create Work Type"}
        </button>
      </div>
    </form>
  );
}
