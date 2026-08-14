import { Input } from "@/components/Input";
import { Button } from "@/components/Button";

import { LinkAssetTabProps } from "@/types/project/project.types";

export function LinkAssetTab({
  register,
  errors,
  isPending,
  onSubmit,
  onCancel,
}: LinkAssetTabProps) {
  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4">
      <Input
        id="assetName"
        label="Asset Title"
        placeholder="Logo Kit / SOP Document"
        error={errors.name?.message}
        {...register("name")}
      />
      <Input
        id="assetUrl"
        label="Resource URL"
        placeholder="https://drive.google.com/..."
        error={errors.url?.message}
        {...register("url")}
      />
      <div className="flex flex-col gap-1">
        <label className="text-sm font-semibold text-slate-300">Category</label>
        <select
          className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-slate-100 focus:outline-none focus:border-indigo-500 text-sm"
          {...register("category")}>
          <option value="Brand Kit">Brand Kit</option>
          <option value="Design File">Design File</option>
          <option value="SOP">SOP</option>
          <option value="URL">URL</option>
          <option value="Other">Other</option>
        </select>
        {errors?.category && (
          <p className="text-xs text-red-400">{errors?.category?.message}</p>
        )}
      </div>
      <div className="flex gap-3 justify-end mt-4">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={isPending}>
          {isPending ? "Adding..." : "Add Asset"}
        </Button>
      </div>
    </form>
  );
}
