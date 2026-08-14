import { FileListProps } from "@/types/project/project.types";
import { getFileIcon } from "@/utils/file.utils";
import { EAssetProvider } from "@/enums";
import { AssetActionMenu } from "./AssetActionMenu";

export function FileList({
  assets,
  onDeleteAsset,
  onEditAsset,
  deletingAssetId,
}: FileListProps) {
  return (
    <div className="overflow-x-auto border border-slate-800 rounded-xl bg-slate-900/20 backdrop-blur-md">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-slate-800 bg-slate-900/60 text-slate-400 text-[10px] font-bold uppercase tracking-wider">
            <th className="py-3.5 px-4">Name</th>
            <th className="py-3.5 px-4">Category</th>
            <th className="py-3.5 px-4">Provider</th>
            <th className="py-3.5 px-4">Uploaded</th>
            <th className="py-3.5 px-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-800/60 text-slate-300 text-xs">
          {assets?.map((asset) => {
            return (
              <tr
                key={asset?._id}
                className="hover:bg-slate-800/30 transition-colors">
                <td className="py-3 px-4 font-medium text-slate-200">
                  <div className="flex items-center gap-3">
                    <span className="text-slate-400 flex-shrink-0">
                      {getFileIcon(asset?.mimeType || "")}
                    </span>
                    <span
                      className="truncate max-w-[200px] sm:max-w-xs md:max-w-md block"
                      title={asset?.name}>
                      {asset?.name}
                    </span>
                  </div>
                </td>

                <td className="py-3 px-4">
                  <span className="inline-flex px-2 py-0.5 rounded text-[10px] font-semibold bg-indigo-500/10 text-indigo-400">
                    {asset?.category}
                  </span>
                </td>

                <td className="py-3 px-4">
                  <span
                    className={`inline-flex px-2 py-0.5 rounded text-[10px] font-semibold ${
                      asset?.provider === EAssetProvider.GOOGLE_DRIVE
                        ? "bg-emerald-500/10 text-emerald-400"
                        : "bg-amber-500/10 text-amber-400"
                    }`}>
                    {asset?.provider === EAssetProvider.GOOGLE_DRIVE
                      ? "Google Drive"
                      : "URL Link"}
                  </span>
                </td>

                <td className="py-3 px-4 text-slate-500">
                  {asset?.updatedAt || asset?.createdAt
                    ? new Date(
                        (asset?.updatedAt || asset?.createdAt)!,
                      )?.toLocaleString()
                    : "—"}
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
          })}
        </tbody>
      </table>
    </div>
  );
}
