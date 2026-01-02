import { useState, useMemo } from 'react';
import { Modal, Button } from '@/components/ui';
import { Folder, FolderOpen, ChevronRight, ChevronDown, Home } from 'lucide-react';
import { clsx } from 'clsx';
import { mockFolders } from '@/data/mockData';
import type { Folder as FolderType } from '@/stores/assetStore';

interface FolderPickerProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectFolder: (folderId: string | null, folderPath: string) => void;
  currentFolderId?: string | null;
}

interface FolderTreeItemProps {
  folder: FolderType;
  level: number;
  selectedFolderId: string | null;
  expandedFolders: Set<string>;
  onSelect: (folderId: string) => void;
  onToggleExpand: (folderId: string) => void;
  childFolders: Map<string | null, FolderType[]>;
}

function FolderTreeItem({
  folder,
  level,
  selectedFolderId,
  expandedFolders,
  onSelect,
  onToggleExpand,
  childFolders,
}: FolderTreeItemProps) {
  const isExpanded = expandedFolders.has(folder.id);
  const isSelected = selectedFolderId === folder.id;
  const children = childFolders.get(folder.id) || [];
  const hasChildren = children.length > 0;

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
        {hasChildren ? (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleExpand(folder.id);
            }}
            className="p-0.5 hover:bg-gray-200 rounded"
          >
            {isExpanded ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </button>
        ) : (
          <span className="w-5" />
        )}
        {isExpanded ? (
          <FolderOpen className="h-5 w-5 text-amber-500" />
        ) : (
          <Folder className="h-5 w-5 text-amber-500" />
        )}
        <span className="text-sm font-medium truncate">{folder.name}</span>
        <span className="text-xs text-gray-400 ml-auto">{folder.assetCount}</span>
      </div>
      {isExpanded && hasChildren && (
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
              childFolders={childFolders}
            />
          ))}
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

  // Build folder hierarchy
  const { rootFolders, childFolders } = useMemo(() => {
    const childMap = new Map<string | null, FolderType[]>();

    mockFolders.forEach((folder) => {
      const parentId = folder.parentId;
      if (!childMap.has(parentId)) {
        childMap.set(parentId, []);
      }
      childMap.get(parentId)!.push(folder);
    });

    return {
      rootFolders: childMap.get(null) || [],
      childFolders: childMap,
    };
  }, []);

  // Build folder path string
  const getFolderPath = (folderId: string | null): string => {
    if (!folderId) return '/';

    const path: string[] = [];
    let currentId: string | null = folderId;

    while (currentId) {
      const folder = mockFolders.find((f) => f.id === currentId);
      if (!folder) break;
      path.unshift(folder.name);
      currentId = folder.parentId;
    }

    return '/' + path.join('/');
  };

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
    const path = getFolderPath(selectedFolderId);
    onSelectFolder(selectedFolderId, path);
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
          {rootFolders.map((folder) => (
            <FolderTreeItem
              key={folder.id}
              folder={folder}
              level={0}
              selectedFolderId={selectedFolderId}
              expandedFolders={expandedFolders}
              onSelect={setSelectedFolderId}
              onToggleExpand={handleToggleExpand}
              childFolders={childFolders}
            />
          ))}
        </div>

        {/* Selected path preview */}
        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
          <p className="text-xs text-gray-500 mb-1">Upload destination:</p>
          <p className="text-sm font-medium text-gray-900">
            {getFolderPath(selectedFolderId)}
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
