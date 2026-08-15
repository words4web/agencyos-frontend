import { FileListProps } from "@/types/project/project.types";
import { getFileIcon } from "@/utils/file.utils";
import { EAssetProvider } from "@/enums";
import { AssetActionMenu } from "./AssetActionMenu";
import { Folder } from "lucide-react";
import { formatTicketDate } from "@/utils/ticket";

export function FileList({
  assets,
  onDeleteAsset,
  onEditAsset,
  deletingAssetId,
  onFolderClick,
}: FileListProps) {
  return (
    <div className="overflow-x-auto rounded-xl bg-slate-900/20 backdrop-blur-md">
      <table className="w-full text-left border-collapse table-fixed">
        <thead>
          <tr className="bg-slate-900/60 text-slate-400 text-[10px] font-bold uppercase tracking-wider">
            <th className="py-3.5 px-4 w-[40%]">Name</th>
            <th className="py-3.5 px-4 w-[15%]">Category</th>
            <th className="py-3.5 px-4 w-[15%]">Provider</th>
            <th className="py-3.5 px-4 w-[20%]">Last Updated</th>
            <th className="py-3.5 px-4 w-[10%] text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-850/40 text-slate-300 text-xs">
          {(() => {
            const folders = assets?.filter((a) => a.isFolder) || [];
            const files = assets?.filter((a) => !a.isFolder) || [];

            const renderRow = (asset: (typeof assets)[number]) => {
              const handleRowClick = (e: React.MouseEvent) => {
                if ((e.target as HTMLElement).closest(".relative")) return;

                if (asset?.isFolder && onFolderClick && asset.providerFileId) {
                  e.preventDefault();
                  onFolderClick(asset.providerFileId);
                } else if (!asset?.isFolder && asset?.url) {
                  window.open(asset.url, "_blank", "noopener,noreferrer");
                }
              };

              return (
                <tr
                  key={asset?._id}
                  onClick={handleRowClick}
                  className={`transition-colors cursor-pointer ${
                    asset?.isFolder
                      ? "bg-indigo-950/5 hover:bg-indigo-950/15"
                      : "hover:bg-slate-800/30"
                  }`}>
                  <td className="py-3 px-4 font-medium text-slate-200 min-w-0">
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="text-slate-400 flex-shrink-0">
                        {asset?.isFolder ? (
                          <Folder
                            size={16}
                            className="text-indigo-400 fill-indigo-400/10"
                          />
                        ) : (
                          getFileIcon(asset?.mimeType || "")
                        )}
                      </span>
                      <span className="truncate block" title={asset?.name}>
                        {asset?.name}
                      </span>
                    </div>
                  </td>

                  <td className="py-3 px-4">
                    <span
                      className={`inline-flex px-1.5 py-0.5 rounded text-[9px] font-medium ${
                        asset?.isFolder
                          ? "bg-indigo-950/30 text-indigo-300"
                          : "bg-slate-800/40 text-slate-450"
                      }`}>
                      {asset?.isFolder ? "Folder" : asset?.category}
                    </span>
                  </td>

                  <td className="py-3 px-4">
                    <span
                      className={`inline-flex px-1.5 py-0.5 rounded text-[9px] font-medium ${
                        asset?.isFolder
                          ? "bg-indigo-950/20 text-indigo-400"
                          : asset?.provider === EAssetProvider.GOOGLE_DRIVE
                            ? "bg-slate-800/40 text-emerald-400"
                            : "bg-slate-800/40 text-amber-400"
                      }`}>
                      {asset?.isFolder
                        ? "Folder"
                        : asset?.provider === EAssetProvider.GOOGLE_DRIVE
                          ? "Google Drive"
                          : "URL Link"}
                    </span>
                  </td>

                  <td className="py-3 px-4 text-slate-500">
                    {formatTicketDate(asset?.updatedAt || asset?.createdAt)}
                  </td>

                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end">
                      <AssetActionMenu
                        asset={asset}
                        onEdit={() => onEditAsset(asset)}
                        onDelete={() => asset?._id && onDeleteAsset(asset?._id)}
                        isDeleting={deletingAssetId === asset?._id}
                      />
                    </div>
                  </td>
                </tr>
              );
            };

            return (
              <>
                {folders.length > 0 && (
                  <>
                    <tr className="bg-slate-950/40">
                      <td
                        colSpan={5}
                        className="py-2.5 px-4 text-[10px] font-bold text-indigo-400 uppercase tracking-wider">
                        Folders ({folders.length})
                      </td>
                    </tr>
                    {folders.map(renderRow)}
                  </>
                )}

                {files?.length > 0 && (
                  <>
                    <tr className="bg-slate-950/40">
                      <td
                        colSpan={5}
                        className="py-2.5 px-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        Files & Links ({files.length})
                      </td>
                    </tr>
                    {files?.map(renderRow)}
                  </>
                )}
              </>
            );
          })()}
        </tbody>
      </table>
    </div>
  );
}
