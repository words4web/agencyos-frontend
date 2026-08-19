import { FileGridProps } from "@/types/project/project.types";
import { FileCard } from "./FileCard";
import { FolderCard } from "./FolderCard";

export function FileGrid({
  assets,
  onDeleteAsset,
  onEditAsset,
  deletingAssetId,
  onFolderClick,
}: FileGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {assets?.map((asset) =>
        asset?.isFolder ? (
          <FolderCard
            key={asset?._id}
            asset={asset}
            onDelete={() => asset?._id && onDeleteAsset(asset?._id)}
            onEdit={() => onEditAsset(asset)}
            isDeleting={deletingAssetId === asset?._id}
            onFolderClick={onFolderClick}
          />
        ) : (
          <FileCard
            key={asset?._id}
            asset={asset}
            onDelete={() => asset?._id && onDeleteAsset(asset?._id)}
            onEdit={() => onEditAsset(asset)}
            isDeleting={deletingAssetId === asset?._id}
          />
        ),
      )}
    </div>
  );
}
