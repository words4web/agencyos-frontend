import { useState, useMemo, useCallback } from "react";
import {
  Grid,
  List,
  FolderOpen,
  ArrowLeft,
  Plus,
  FolderPlus,
  ChevronRight,
} from "lucide-react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import {
  FileExplorerProps,
  IProjectAsset,
} from "@/types/project/project.types";
import { FileGrid } from "./FileGrid";
import { FileList } from "./FileList";
import { Button } from "@/components/Button";
import { AddAssetModal } from "@/forms/project/AddAssetModal";
import { CreateFolderModal } from "@/forms/project/CreateFolderModal";
import { EditAssetModal } from "@/forms/project/EditAssetModal";
import { ConfirmModal } from "@/components/ConfirmModal";
import { useDeleteAsset } from "@/services/project/project.hooks";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { EUserRole } from "@/enums";

export function FileExplorer({ project }: FileExplorerProps) {
  const router = useRouter();
  const { user } = useAuth();
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isCreateFolderOpen, setIsCreateFolderOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [targetAssetId, setTargetAssetId] = useState<string | null>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingAsset, setEditingAsset] = useState<IProjectAsset | null>(null);
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const currentFolderId = searchParams.get("folder") || null;

  const setCurrentFolderId = useCallback(
    (folderId: string | null) => {
      const params = new URLSearchParams(searchParams.toString());
      if (folderId) {
        params.set("folder", folderId);
      } else {
        params.delete("folder");
      }
      router.push(`${pathname}?${params?.toString()}`);
    },
    [searchParams, pathname, router],
  );

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

  const filteredAssets = useMemo(() => {
    return assets.filter((asset) => {
      if (!currentFolderId) {
        return (
          !asset.parentFolderId ||
          asset.parentFolderId === project.googleDriveFolderId
        );
      }
      return asset.parentFolderId === currentFolderId;
    });
  }, [assets, currentFolderId, project]);

  const sortedAssets = useMemo(() => {
    return [...filteredAssets]?.sort((a, b) => {
      if (a.isFolder && !b.isFolder) return -1;
      if (!a.isFolder && b.isFolder) return 1;
      return a.name.localeCompare(b.name);
    });
  }, [filteredAssets]);

  const getBreadcrumbs = () => {
    const crumbs: Array<{ id: string | null; name: string }> = [
      { id: null, name: "Root" },
    ];
    if (!currentFolderId) return crumbs;

    const path: typeof crumbs = [];
    let searchId = currentFolderId;

    while (searchId) {
      const parentFolder = assets.find(
        (a) => a.isFolder && a.providerFileId === searchId,
      );
      if (parentFolder) {
        path.unshift({
          id: parentFolder.providerFileId || null,
          name: parentFolder.name,
        });
        searchId = parentFolder.parentFolderId || "";
        if (searchId === project.googleDriveFolderId) {
          break;
        }
      } else {
        break;
      }
    }
    return [...crumbs, ...path];
  };

  const crumbs = getBreadcrumbs();

  const handleFolderClick = (folderId: string) => {
    setCurrentFolderId(folderId);
  };

  const isFolderTarget = (assetId: string | null): boolean => {
    const target = assets.find((a) => a._id === assetId);
    return !!target?.isFolder;
  };

  const folders = useMemo(
    () => sortedAssets?.filter((a) => a.isFolder) || [],
    [sortedAssets],
  );
  const files = useMemo(
    () => sortedAssets?.filter((a) => !a.isFolder) || [],
    [sortedAssets],
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/30 p-5 rounded-2xl backdrop-blur-md">
        <div className="flex items-start gap-3.5">
          <button
            onClick={() => {
              if (currentFolderId) {
                const activeFolder = assets.find(
                  (a) => a.isFolder && a.providerFileId === currentFolderId,
                );
                const parentId = activeFolder?.parentFolderId || null;
                setCurrentFolderId(
                  parentId === project?.googleDriveFolderId ? null : parentId,
                );
              } else {
                router.push(
                  user?.role === EUserRole.ADMIN
                    ? "/projects"
                    : `/projects/${project?._id}`,
                );
              }
            }}
            className="p-2 mt-0.5 rounded-xl bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-850 transition-colors">
            <ArrowLeft size={16} />
          </button>
          <div>
            <h1 className="text-lg font-bold text-slate-100">Project Assets</h1>
            <p className="text-xs text-slate-450 mt-0.5">
              Manage files, documents, and resources for {project?.name}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 self-start md:self-center">
          <div className="flex items-center bg-slate-950 p-0.5 rounded-xl">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-1.5 rounded-lg transition-colors ${
                viewMode === "grid"
                  ? "bg-indigo-600 text-white font-semibold"
                  : "text-slate-500 hover:text-slate-300"
              }`}>
              <Grid size={15} />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-1.5 rounded-lg transition-colors ${
                viewMode === "list"
                  ? "bg-indigo-600 text-white font-semibold"
                  : "text-slate-500 hover:text-slate-300"
              }`}>
              <List size={15} />
            </button>
          </div>

          <Button
            onClick={() => setIsCreateFolderOpen(true)}
            variant="secondary"
            className="flex items-center gap-1.5 text-xs font-semibold py-2 px-3 bg-slate-900 hover:bg-slate-800">
            <FolderPlus size={14} />
            New Folder
          </Button>

          <Button
            onClick={() => setIsAddOpen(true)}
            className="flex items-center gap-1.5 text-xs font-semibold py-2 px-3 bg-indigo-600 hover:bg-indigo-500 shadow-md shadow-indigo-900/10">
            <Plus size={14} />
            Add Asset
          </Button>
        </div>
      </div>

      <div className="flex items-center flex-wrap gap-1.5 px-1 py-1.5 text-xs text-slate-500 font-medium">
        <span className="text-slate-400">Project Assets</span>
        <ChevronRight size={13} className="text-slate-700" />
        {crumbs.map((crumb, idx) => (
          <div key={idx} className="flex items-center gap-1.5">
            {idx > 0 && <ChevronRight size={13} className="text-slate-700" />}
            <button
              onClick={() => setCurrentFolderId(crumb.id)}
              className={`hover:text-slate-200 transition-colors ${
                crumb.id === currentFolderId
                  ? "text-indigo-400 font-semibold cursor-default"
                  : "text-slate-400"
              }`}>
              {crumb.name}
            </button>
          </div>
        ))}
      </div>

      {sortedAssets.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 px-4 bg-slate-900/15 rounded-2xl">
          <FolderOpen size={40} className="text-slate-650 mb-3" />
          <h3 className="text-sm font-semibold text-slate-300">
            No assets in this directory
          </h3>
          <p className="text-xs text-slate-500 mt-1 max-w-[280px] text-center">
            Upload files directly to this Google Drive folder or add URL links
            for resource sharing.
          </p>
          <div className="flex gap-2.5 mt-4">
            <Button
              variant="secondary"
              onClick={() => setIsCreateFolderOpen(true)}
              className="text-xs">
              New Folder
            </Button>
            <Button
              onClick={() => setIsAddOpen(true)}
              className="text-xs bg-indigo-600 hover:bg-indigo-500">
              Add Asset
            </Button>
          </div>
        </div>
      ) : viewMode === "grid" ? (
        <div className="flex flex-col gap-6">
          {folders.length > 0 && (
            <div>
              <h4 className="text-[11px] font-bold text-indigo-400 uppercase tracking-wider mb-3 ml-1">
                Folders ({folders.length})
              </h4>
              <FileGrid
                assets={folders}
                onDeleteAsset={handleDeleteClick}
                onEditAsset={handleEditClick}
                deletingAssetId={targetAssetId}
                onFolderClick={handleFolderClick}
              />
            </div>
          )}

          {files.length > 0 && (
            <div>
              <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-3 ml-1">
                Files & Links ({files.length})
              </h4>
              <FileGrid
                assets={files}
                onDeleteAsset={handleDeleteClick}
                onEditAsset={handleEditClick}
                deletingAssetId={targetAssetId}
                onFolderClick={handleFolderClick}
              />
            </div>
          )}
        </div>
      ) : (
        <FileList
          assets={sortedAssets}
          onDeleteAsset={handleDeleteClick}
          onEditAsset={handleEditClick}
          deletingAssetId={targetAssetId}
          onFolderClick={handleFolderClick}
        />
      )}

      <ConfirmModal
        isOpen={isConfirmOpen}
        title={isFolderTarget(targetAssetId) ? "Delete Folder" : "Delete Asset"}
        description={
          isFolderTarget(targetAssetId)
            ? "Are you sure you want to delete this folder? All subfolders and files inside it will be recursively deleted from Google Drive and the database."
            : "Are you sure you want to permanently delete this project asset? If it's a Google Drive file, the actual file will remain in your Google Drive trash."
        }
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
        parentFolderId={currentFolderId || project?.googleDriveFolderId}
      />

      <CreateFolderModal
        isOpen={isCreateFolderOpen}
        onClose={() => setIsCreateFolderOpen(false)}
        projectId={project?._id}
        parentFolderId={currentFolderId || project?.googleDriveFolderId || null}
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
