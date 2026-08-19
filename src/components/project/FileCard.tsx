import { useState } from "react";
import { FileCardProps } from "@/types/project/project.types";
import { getFileIcon } from "@/utils/file.utils";
import { EAssetProvider } from "@/enums";
import { AssetActionMenu } from "./AssetActionMenu";
import { formatTicketDate } from "@/utils/ticket";
import { Link2 } from "lucide-react";
import { toast } from "sonner";

export function FileCard({
  asset,
  onDelete,
  onEdit,
  isDeleting = false,
}: FileCardProps) {
  const [imgError, setImgError] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isImage = asset?.mimeType?.startsWith("image/");

  const thumbnailUrl = asset?.providerFileId
    ? `https://drive.google.com/thumbnail?id=${asset?.providerFileId}&sz=w400`
    : null;

  const handleClick = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest(".action-menu-container")) {
      return;
    }

    if (asset?.url) {
      window.open(asset.url, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <div
      onClick={handleClick}
      className={`group border rounded-xl flex flex-col justify-between transition-all duration-305 cursor-pointer hover:scale-[1.01] ${
        isMenuOpen ? "z-40 relative" : ""
      } bg-slate-900/60 border-transparent hover:bg-slate-900/80`}>
      <div className="relative h-24 w-full bg-slate-950 flex items-center justify-center rounded-t-xl overflow-hidden">
        {isImage && thumbnailUrl && !imgError ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={thumbnailUrl}
            alt={asset.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
            referrerPolicy="no-referrer"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="p-4 rounded-full bg-slate-900/80 text-slate-400">
            {getFileIcon(asset.mimeType || "")}
          </div>
        )}

        <span className="absolute top-2 left-2 px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-900/90 text-indigo-300">
          {asset.category}
        </span>

        {asset?.url && (
          <button
            title="Copy link"
            onClick={(e) => {
              e.stopPropagation();
              navigator.clipboard.writeText(asset.url!);
              toast.success("Link copied to clipboard");
            }}
            className="action-menu-container absolute top-2 right-2 p-1.5 rounded-lg bg-slate-900/80 opacity-0 group-hover:opacity-100 text-white hover:bg-slate-700 transition-all duration-200 cursor-pointer">
            <Link2 size={11} />
          </button>
        )}
      </div>

      <div className="p-3 flex-1 flex justify-between gap-2">
        <div className="min-w-0">
          <p
            className="text-xs font-semibold text-slate-200 truncate group-hover:text-white transition-colors"
            title={asset.name}>
            {asset.name}
          </p>
          <div className="mt-1">
            <span className="text-[10px] text-slate-500">
              {asset.category} ·{" "}
              {asset.provider === EAssetProvider.GOOGLE_DRIVE
                ? "Google Drive"
                : "URL Link"}
            </span>
            <span className="text-[10px] text-slate-655 mt-0.5 block">
              {formatTicketDate(asset.updatedAt || asset.createdAt)}
            </span>
          </div>
        </div>

        <AssetActionMenu
          asset={asset}
          onEdit={onEdit}
          onDelete={onDelete}
          isDeleting={isDeleting}
          onMenuOpenChange={setIsMenuOpen}
        />
      </div>
    </div>
  );
}
