import { useState } from "react";
import { FileCardProps } from "@/types/project/project.types";
import { getFileIcon } from "@/utils/file.utils";
import { EAssetProvider } from "@/enums";
import { AssetActionMenu } from "./AssetActionMenu";

export function FileCard({
  asset,
  onDelete,
  onEdit,
  isDeleting = false,
}: FileCardProps) {
  const [imgError, setImgError] = useState(false);
  const isImage = asset?.mimeType?.startsWith("image/");

  const thumbnailUrl = asset?.providerFileId
    ? `https://drive.google.com/thumbnail?id=${asset?.providerFileId}&sz=w400`
    : null;

  return (
    <div className="group bg-slate-900/60 border border-slate-800 rounded-xl flex flex-col justify-between hover:border-indigo-500/50 hover:bg-slate-900/80 transition-all duration-300">
      <div className="relative aspect-video w-full bg-slate-950 flex items-center justify-center border-b border-slate-800/80 rounded-t-xl overflow-hidden">
        {isImage && thumbnailUrl && !imgError ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={thumbnailUrl}
            alt={asset?.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
            referrerPolicy="no-referrer"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="p-6 rounded-full bg-slate-900/80 text-slate-400">
            {getFileIcon(asset?.mimeType || "")}
          </div>
        )}

        <span className="absolute top-2 left-2 px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-900/90 text-indigo-300 border border-slate-800">
          {asset?.category}
        </span>
      </div>

      <div className="p-3 flex-1 flex flex-col justify-between gap-2">
        <div className="min-w-0">
          <p
            className="text-xs font-semibold text-slate-200 truncate group-hover:text-white transition-colors"
            title={asset?.name}>
            {asset?.name}
          </p>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-[10px] text-slate-500">
              {asset?.provider === EAssetProvider.GOOGLE_DRIVE
                ? "Drive File"
                : "Linked URL"}
            </span>
            {(asset?.updatedAt || asset?.createdAt) && (
              <>
                <span className="text-slate-700 text-[10px]">•</span>
                <span
                  className="text-[10px] text-slate-500"
                  title="Last Updated">
                  {new Date(
                    asset?.updatedAt || asset.createdAt!,
                  )?.toLocaleString()}
                </span>
              </>
            )}
          </div>
        </div>

        <div className="flex items-center justify-end pt-1 border-t border-slate-850">
          <AssetActionMenu
            asset={asset}
            onEdit={onEdit}
            onDelete={onDelete}
            isDeleting={isDeleting}
          />
        </div>
      </div>
    </div>
  );
}
