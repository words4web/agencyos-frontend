import { useState } from "react";
import { IProjectAsset } from "@/types/project/project.types";
import { TicketAssetsTabProps } from "@/types/ticket/ticket.types";
import { ProjectAssetPickerModal } from "./ProjectAssetPickerModal";
import { Button } from "@/components/Button";
import {
  Folder,
  FileText,
  Plus,
  ExternalLink,
  Trash2,
  Paperclip,
  Info,
} from "lucide-react";

export function TicketAssetsTab({
  ticket,
  canEdit,
  localAssetIds,
  setLocalAssetIds,
}: TicketAssetsTabProps) {
  const [isPickerOpen, setIsPickerOpen] = useState(false);

  const projectAssets: IProjectAsset[] = ticket?.project?.assets || [];

  const attachedAssets: IProjectAsset[] = localAssetIds
    ?.map((id) =>
      projectAssets?.find(
        (a) =>
          a?._id?.toString() === id ||
          a?.providerFileId === id ||
          a?.name === id,
      ),
    )
    ?.filter((a): a is IProjectAsset => a !== undefined);

  const handleDetachAsset = (targetAsset: IProjectAsset) => {
    const targetId =
      targetAsset._id?.toString() ||
      targetAsset.providerFileId ||
      targetAsset.name;
    setLocalAssetIds(
      localAssetIds.filter(
        (id) =>
          id !== targetId &&
          id !== targetAsset._id?.toString() &&
          id !== targetAsset.name,
      ),
    );
  };

  return (
    <div className="flex flex-col gap-5 py-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Paperclip size={16} className="text-indigo-400" />
          <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
            Attached Project Assets ({attachedAssets.length})
          </h4>
        </div>

        {canEdit && (
          <Button
            type="button"
            variant="secondary"
            onClick={() => setIsPickerOpen(true)}
            className="text-xs flex items-center gap-1.5 py-1.5 px-3">
            <Plus size={14} /> Attach Project Assets
          </Button>
        )}
      </div>

      <div className="p-3 bg-slate-900/60 border border-slate-800 rounded-xl text-xs text-slate-400 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Info size={15} className="text-indigo-400 shrink-0" />
          <span>
            Assets are referenced directly from{" "}
            <strong>{ticket?.project?.name}</strong>.
          </span>
        </div>
      </div>

      {attachedAssets?.length === 0 ? (
        <div className="p-10 border border-dashed border-slate-800 rounded-2xl bg-slate-950/20 text-center flex flex-col items-center justify-center gap-2">
          <Paperclip size={24} className="text-slate-600" />
          <span className="text-xs font-semibold text-slate-400">
            No assets attached to this ticket yet.
          </span>
          {canEdit && (
            <p className="text-[11px] text-slate-500">
              Click &quot;Attach Project Assets&quot; to link files or folders
              from this project.
            </p>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {attachedAssets?.map((asset) => {
            const assetId = asset?._id?.toString() || asset?.name;

            return (
              <div
                key={assetId}
                className="flex items-center justify-between p-3 bg-slate-900/60 border border-slate-800 rounded-xl hover:border-slate-700 transition-all group">
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <div
                    className={`p-2 rounded-lg shrink-0 ${
                      asset?.isFolder
                        ? "bg-amber-500/10 text-amber-400"
                        : "bg-indigo-500/10 text-indigo-400"
                    }`}>
                    {asset?.isFolder ? (
                      <Folder size={16} />
                    ) : (
                      <FileText size={16} />
                    )}
                  </div>
                  <div className="flex flex-col min-w-0 flex-1">
                    <span className="text-xs font-semibold text-slate-200 truncate">
                      {asset?.name}
                    </span>
                    <span className="text-[10px] text-slate-500">
                      {asset?.isFolder ? "Folder" : asset?.category || "Asset"}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0 ml-2">
                  {asset?.url && (
                    <a
                      href={asset?.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 rounded-lg bg-slate-800/80 text-slate-300 hover:text-white hover:bg-indigo-600 transition-all"
                      title="Open / Download Asset">
                      <ExternalLink size={14} />
                    </a>
                  )}

                  {canEdit && (
                    <button
                      type="button"
                      onClick={() => handleDetachAsset(asset)}
                      className="p-1.5 rounded-lg bg-slate-800/80 text-slate-400 hover:text-red-400 hover:bg-red-950/30 transition-all"
                      title="Detach Asset">
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      <ProjectAssetPickerModal
        isOpen={isPickerOpen}
        onClose={() => setIsPickerOpen(false)}
        projectAssets={projectAssets}
        googleDriveFolderId={ticket?.project?.googleDriveFolderId}
        selectedAssetIds={localAssetIds}
        onSelectAssets={setLocalAssetIds}
      />
    </div>
  );
}
