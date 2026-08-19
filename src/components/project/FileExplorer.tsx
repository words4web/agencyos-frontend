import { useState } from "react";
import { Grid, List, FolderOpen, ArrowLeft, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  FileExplorerProps,
  IProjectAsset,
} from "@/types/project/project.types";
import { FileGrid } from "./FileGrid";
import { FileList } from "./FileList";
import { Button } from "@/components/Button";
import { AddAssetModal } from "@/forms/project/AddAssetModal";
import { EditAssetModal } from "@/forms/project/EditAssetModal";
import { ConfirmModal } from "@/components/ConfirmModal";
import { useDeleteAsset } from "@/services/project/project.hooks";
import { toast } from "sonner";

export function FileExplorer({ project }: FileExplorerProps) {
  const router = useRouter();
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [targetAssetId, setTargetAssetId] = useState<string | null>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingAsset, setEditingAsset] = useState<IProjectAsset | null>(null);

  const deleteAssetMutation = useDeleteAsset();

  const handleDeleteClick = (assetId: string) => {
    setTargetAssetId(assetId);
    setIsConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!targetAssetId) return;
    setIsConfirmOpen(false);

    try {
      await deleteAssetMutation.mutateAsync({
        projectId: project._id,
        assetId: targetAssetId,
      });
      toast.success("Asset deleted successfully");
    } catch (error) {
    } finally {
      setTargetAssetId(null);
    }
  };

  const handleEditClick = (asset: IProjectAsset) => {
    setEditingAsset(asset);
    setIsEditOpen(true);
  };

  const assets = project?.assets || [];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push("/admin/projects")}
            className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700 transition-colors">
            <ArrowLeft size={16} />
          </button>
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
              <span>Projects</span>
              <span>/</span>
              <span className="truncate max-w-[120px] sm:max-w-none">
                {project?.name}
              </span>
            </div>
            <h1 className="text-xl font-extrabold text-slate-100 flex items-center gap-2 mt-1">
              <FolderOpen size={20} className="text-indigo-400" />
              Files & Assets
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="flex bg-slate-900 border border-slate-800 rounded-lg p-0.5">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-1.5 rounded-md transition-colors ${
                viewMode === "grid"
                  ? "bg-slate-850 text-indigo-400"
                  : "text-slate-500 hover:text-slate-350"
              }`}
              title="Grid View">
              <Grid size={16} />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-1.5 rounded-md transition-colors ${
                viewMode === "list"
                  ? "bg-slate-850 text-indigo-400"
                  : "text-slate-500 hover:text-slate-350"
              }`}
              title="List View">
              <List size={16} />
            </button>
          </div>

          <Button
            onClick={() => setIsAddOpen(true)}
            className="flex items-center gap-1.5 text-xs font-semibold py-2 px-3 bg-indigo-600 hover:bg-indigo-500">
            <Plus size={14} />
            Add File / Link
          </Button>
        </div>
      </div>

      {assets?.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 border border-slate-800 border-dashed rounded-xl bg-slate-900/10 text-center">
          <div className="p-4 rounded-full bg-slate-900/80 text-slate-500 mb-4">
            <FolderOpen size={32} />
          </div>
          <h3 className="text-sm font-semibold text-slate-300">
            No assets in this project
          </h3>
          <p className="text-xs text-slate-500 mt-1 max-w-[280px]">
            Upload file assets directly to Google Drive or add URL links for
            resource sharing.
          </p>
          <Button
            variant="secondary"
            onClick={() => setIsAddOpen(true)}
            className="mt-4 text-xs">
            Add Asset
          </Button>
        </div>
      ) : viewMode === "grid" ? (
        <FileGrid
          assets={assets}
          onDeleteAsset={handleDeleteClick}
          onEditAsset={handleEditClick}
          deletingAssetId={targetAssetId}
        />
      ) : (
        <FileList
          assets={assets}
          onDeleteAsset={handleDeleteClick}
          onEditAsset={handleEditClick}
          deletingAssetId={targetAssetId}
        />
      )}

      <ConfirmModal
        isOpen={isConfirmOpen}
        title="Delete Asset"
        description="Are you sure you want to permanently delete this project asset? If it's a Google Drive file, the actual file will remain in your Google Drive trash."
        confirmLabel="Delete"
        onConfirm={handleConfirmDelete}
        onClose={() => {
          setIsConfirmOpen(false);
          setTargetAssetId(null);
        }}
      />

      <AddAssetModal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        projectId={project?._id}
      />

      <EditAssetModal
        isOpen={isEditOpen}
        onClose={() => {
          setIsEditOpen(false);
          setEditingAsset(null);
        }}
        projectId={project?._id}
        asset={editingAsset}
      />
    </div>
  );
}
