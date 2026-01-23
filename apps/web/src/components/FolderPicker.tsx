import { useState } from 'react';
import { Modal, Button } from '@/components/ui';
import { Folder, FolderOpen, ChevronRight, ChevronDown, Home, Loader2 } from 'lucide-react';
import { clsx } from 'clsx';
import { useFolders } from '@/api/assets';
import type { Folder as FolderType } from '@/stores/assetStore';

interface FolderPickerProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectFolder: (folderId: string | null) => void;
  currentFolderId?: string | null;
}

interface FolderTreeItemProps {
  folder: FolderType;
  level: number;
  selectedFolderId: string | null;
  expandedFolders: Set<string>;
  onSelect: (folderId: string) => void;
  onToggleExpand: (folderId: string) => void;
}

function FolderTreeItem({
  folder,
  level,
  selectedFolderId,
  expandedFolders,
  onSelect,
  onToggleExpand,
}: FolderTreeItemProps) {
  const isExpanded = expandedFolders.has(folder.id);
  const isSelected = selectedFolderId === folder.id;

  // Fetch children only if expanded
  const { data: children = [], isLoading } = useFolders(folder.id);

  // We don't know if it has children until we fetch or check a 'childCount' property
  // For now, let's assume if it's not expanded, we show a chevron if we suspect children
  // Or just always show chevron?
  // Using !isExpanded as a heuristic or maybe we can update backend later to send child count over.
  // For now: Always show chevron unless we loaded and found 0 children.

  // const hasChildren = (children && children.length > 0) || !isExpanded;
  // If expanded and loaded and length 0, then no children.
  const empty = isExpanded && !isLoading && children.length === 0;

  return (
    <div>
      <div
        className={clsx(
          'flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer transition-colors',
          isSelected
            ? 'bg-primary-100 text-primary-700'
            : 'hover:bg-gray-100 text-gray-700'
        )}
        style={{ paddingLeft: `${level * 16 + 12}px` }}
        onClick={() => onSelect(folder.id)}
      >
        <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleExpand(folder.id);
            }}
            className={clsx("p-0.5 hover:bg-gray-200 rounded", empty ? "invisible" : "")}
          >
            {isExpanded ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
               <ChevronRight className="h-4 w-4" />
            )}
        </button>

        {isExpanded ? (
          <FolderOpen className="h-5 w-5 text-amber-500" />
        ) : (
          <Folder className="h-5 w-5 text-amber-500" />
        )}
        <span className="text-sm font-medium truncate">{folder.name}</span>
        {isLoading && isExpanded && <Loader2 className="h-3 w-3 animate-spin text-gray-400" />}
      </div>
      {isExpanded && (
        <div>
          {children.map((child) => (
            <FolderTreeItem
              key={child.id}
              folder={child}
              level={level + 1}
              selectedFolderId={selectedFolderId}
              expandedFolders={expandedFolders}
              onSelect={onSelect}
              onToggleExpand={onToggleExpand}
            />
          ))}
            {children.length === 0 && !isLoading && (
                <div style={{ paddingLeft: `${(level + 1) * 16 + 12}px` }} className="py-2 px-3 text-xs text-gray-500">
                    No subfolders
                </div>
            )}
        </div>
      )}
    </div>
  );
}

export function FolderPicker({
  isOpen,
  onClose,
  onSelectFolder,
  currentFolderId,
}: FolderPickerProps) {
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(
    currentFolderId ?? null
  );
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set());

  // Use null for root folders
  const { data: rootFolders = [], isLoading } = useFolders(null);

  const handleToggleExpand = (folderId: string) => {
    setExpandedFolders((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(folderId)) {
        newSet.delete(folderId);
      } else {
        newSet.add(folderId);
      }
      return newSet;
    });
  };

  const handleSelectRoot = () => {
    setSelectedFolderId(null);
  };

  const handleConfirm = () => {
    // We removed path building because relying on client-side full tree is hard
    // and passing just ID is usually sufficient for backend.
    // If path is needed for UI, the parent component should fetch it.
    onSelectFolder(selectedFolderId);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Select Destination Folder"
      description="Choose where to upload your files"
      size="md"
    >
      <div className="mt-4">
        {/* Root folder option */}
        <div
          className={clsx(
            'flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer transition-colors mb-1',
            selectedFolderId === null
              ? 'bg-primary-100 text-primary-700'
              : 'hover:bg-gray-100 text-gray-700'
          )}
          onClick={handleSelectRoot}
        >
          <span className="w-5" />
          <Home className="h-5 w-5 text-gray-500" />
          <span className="text-sm font-medium">Root folder</span>
        </div>

        {/* Folder tree */}
        <div className="max-h-80 overflow-y-auto border border-gray-200 rounded-lg p-2">
            {isLoading && <div className="p-4 text-center"><Loader2 className="mx-auto h-5 w-5 animate-spin text-gray-400" /></div>}

            {rootFolders.map((folder) => (
                <FolderTreeItem
                key={folder.id}
                folder={folder}
                level={0}
                selectedFolderId={selectedFolderId}
                expandedFolders={expandedFolders}
                onSelect={setSelectedFolderId}
                onToggleExpand={handleToggleExpand}
                />
            ))}
        </div>

        {/* Selected path mock status */}
        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
          <p className="text-xs text-gray-500 mb-1">Upload destination:</p>
          <p className="text-sm font-medium text-gray-900">
            {selectedFolderId ? `Selected Folder ID: ${selectedFolderId}` : "Root Folder"}
          </p>
        </div>

        {/* Actions */}
        <div className="mt-6 flex justify-end gap-3">
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleConfirm}>
            Select Folder
          </Button>
        </div>
      </div>
    </Modal>
  );
}
