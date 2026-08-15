import { useState } from "react";
import { FileCardProps } from "@/types/project/project.types";
import { AssetActionMenu } from "./AssetActionMenu";
import { Folder } from "lucide-react";
import { formatTicketDate } from "@/utils/ticket";

export function FolderCard({
  asset,
  onDelete,
  onEdit,
  isDeleting = false,
  onFolderClick,
}: FileCardProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleClick = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest(".action-menu-container")) {
      return;
    }

    if (onFolderClick && asset.providerFileId) {
      e.preventDefault();
      onFolderClick(asset.providerFileId);
    }
  };

  return (
    <div
      onClick={handleClick}
      className={`group border rounded-xl flex flex-col justify-between transition-all duration-305 cursor-pointer hover:scale-[1.01] ${
        isMenuOpen ? "z-40 relative" : ""
      } bg-slate-900/30 border-indigo-950/75 hover:border-indigo-500/50 hover:bg-slate-900/50 shadow-md shadow-indigo-950/5`}>
      <div className="relative h-16 w-full bg-slate-950 flex items-center justify-center rounded-t-xl overflow-hidden">
        <div className="p-2.5 rounded-full bg-indigo-950/30 text-indigo-400 group-hover:scale-105 transition-transform duration-300">
          <Folder size={20} className="fill-indigo-400/20" />
        </div>

        <span className="absolute top-2 left-2 px-2 py-0.5 rounded text-[10px] font-semibold bg-indigo-950/80 text-indigo-300">
          Folder
        </span>
      </div>

      <div className="p-2.5 pb-2 flex-1 flex justify-between gap-2">
        <div className="min-w-0">
          <p
            className="text-xs font-semibold text-slate-200 truncate group-hover:text-white transition-colors"
            title={asset.name}>
            {asset.name}
          </p>
          <div className="mt-1">
            <span className="text-[10px] text-slate-500">
              Modified · {formatTicketDate(asset.updatedAt || asset.createdAt)}
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
