import { useState, useMemo } from "react";
import { Modal } from "@/components/Modal";
import { Button } from "@/components/Button";
import { ProjectAssetPickerModalProps } from "@/types/ticket/ticket.types";
import {
  Folder,
  FileText,
  Search,
  Check,
  FolderOpen,
  ChevronRight,
} from "lucide-react";

export function ProjectAssetPickerModal({
  isOpen,
  onClose,
  projectAssets = [],
  googleDriveFolderId,
  selectedAssetIds = [],
  onSelectAssets,
}: ProjectAssetPickerModalProps) {
  const [prevIsOpen, setPrevIsOpen] = useState(isOpen);
  const [tempSelected, setTempSelected] = useState<string[]>(selectedAssetIds);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentFolderId, setCurrentFolderId] = useState<string | null>(null);

  if (isOpen && !prevIsOpen) {
    setPrevIsOpen(true);
    setTempSelected(selectedAssetIds);
    setSearchQuery("");
    setCurrentFolderId(null);
  } else if (!isOpen && prevIsOpen) {
    setPrevIsOpen(false);
  }

  const filteredAssets = useMemo(() => {
    const existingFolderIds = new Set(
      projectAssets
        ?.map((a) => a?.providerFileId || a?._id?.toString())
        ?.filter(Boolean),
    );

    const list = projectAssets.filter((asset) => {
      const matchesSearch = asset.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      if (searchQuery.trim()) {
        return matchesSearch;
      }

      if (!currentFolderId) {
        return (
          !asset?.parentFolderId ||
          (googleDriveFolderId &&
            asset?.parentFolderId === googleDriveFolderId) ||
          !existingFolderIds?.has(asset?.parentFolderId)
        );
      }
      return asset?.parentFolderId === currentFolderId;
    });

    return [...list]?.sort((a, b) => {
      if (a?.isFolder && !b?.isFolder) return -1;
      if (!a?.isFolder && b?.isFolder) return 1;
      return a?.name?.localeCompare(b?.name);
    });
  }, [projectAssets, searchQuery, currentFolderId, googleDriveFolderId]);

  const breadcrumbs = useMemo(() => {
    const crumbs: { id: string | null; name: string }[] = [
      { id: null, name: "Root" },
    ];
    let currId = currentFolderId;

    while (currId) {
      const folderObj = projectAssets.find(
        (a) =>
          a?.isFolder && (a?.providerFileId === currId || a?._id === currId),
      );
      if (folderObj) {
        crumbs.splice(1, 0, {
          id: folderObj?.providerFileId || folderObj?._id?.toString() || null,
          name: folderObj?.name || "",
        });
        currId = folderObj?.parentFolderId || null;
      } else {
        break;
      }
    }
    return crumbs;
  }, [currentFolderId, projectAssets]);

  const toggleSelect = (assetId: string) => {
    setTempSelected((prev) =>
      prev.includes(assetId)
        ? prev.filter((id) => id !== assetId)
        : [...prev, assetId],
    );
  };

  const handleApply = () => {
    onSelectAssets(tempSelected);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Select Project Assets"
      size="max-w-2xl">
      <div className="flex flex-col gap-4">
        <div className="relative">
          <Search
            size={14}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
          />
          <input
            type="text"
            placeholder="Search assets by name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 placeholder-slate-500 text-xs focus:outline-none focus:border-indigo-500 font-medium"
          />
        </div>

        {!searchQuery && (
          <div className="flex items-center gap-1 text-xs text-slate-400 overflow-x-auto pb-1">
            {breadcrumbs.map((crumb, idx) => (
              <div key={crumb.id || "root"} className="flex items-center gap-1">
                {idx > 0 && (
                  <ChevronRight size={12} className="text-slate-600" />
                )}
                <button
                  type="button"
                  onClick={() => setCurrentFolderId(crumb.id)}
                  className={`hover:text-indigo-400 transition-colors font-medium text-[11px] ${
                    currentFolderId === crumb.id
                      ? "text-indigo-400 font-bold"
                      : "text-slate-400"
                  }`}>
                  {crumb.name}
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="max-h-72 overflow-y-auto border border-slate-800 rounded-xl bg-slate-950/40 divide-y divide-slate-850">
          {filteredAssets?.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-500 flex flex-col items-center gap-2">
              <FolderOpen size={24} className="text-slate-600" />
              <span>No assets found in this folder.</span>
            </div>
          ) : (
            filteredAssets?.map((asset) => {
              const assetId = asset?._id?.toString() || asset?.name;
              const isSelected = tempSelected.includes(assetId);

              return (
                <div
                  key={assetId}
                  className={`flex items-center justify-between p-3 transition-colors cursor-pointer ${
                    isSelected ? "bg-indigo-950/30" : "hover:bg-slate-900/50"
                  }`}
                  onClick={() => {
                    if (asset?.isFolder) {
                      setCurrentFolderId(
                        asset?.providerFileId || asset?._id?.toString() || null,
                      );
                    } else {
                      toggleSelect(assetId);
                    }
                  }}>
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
                        {asset?.isFolder
                          ? "Folder"
                          : asset?.category || "Asset"}
                      </span>
                    </div>
                  </div>

                  <div
                    className="flex items-center gap-2"
                    onClick={(e) => e.stopPropagation()}>
                    {asset?.isFolder ? (
                      <button
                        type="button"
                        onClick={() =>
                          setCurrentFolderId(
                            asset?.providerFileId ||
                              asset?._id?.toString() ||
                              null,
                          )
                        }
                        className="px-2.5 py-1 text-[11px] font-semibold text-slate-400 hover:text-slate-200 bg-slate-900 rounded-lg border border-slate-800 flex items-center gap-1">
                        Open <ChevronRight size={12} />
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => toggleSelect(assetId)}
                        className={`w-6 h-6 rounded-lg flex items-center justify-center border transition-all ${
                          isSelected
                            ? "bg-indigo-600 border-indigo-500 text-white"
                            : "border-slate-700 bg-slate-900 text-transparent hover:border-slate-500"
                        }`}>
                        <Check size={14} />
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        <div className="flex items-center justify-between pt-2">
          <span className="text-xs font-medium text-slate-400">
            {tempSelected.length} asset(s) selected
          </span>
          <div className="flex gap-2">
            <Button variant="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleApply}>Apply Selection</Button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
