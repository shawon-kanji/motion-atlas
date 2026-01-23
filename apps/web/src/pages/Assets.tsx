import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { AppLayout } from "@/components/layout";
import { Button, Card, Badge, Dropdown, Modal, Input } from "@/components/ui";
import { clsx } from "clsx";
import {
  Upload,
  FolderPlus,
  Grid3X3,
  List,
  Filter,
  SortAsc,
  ChevronRight,
  MoreHorizontal,
  Play,
  Clock,
  Download,
  Share2,
  Trash2,
  Edit,
  Video,
  Image,
  FileText,
  Folder,
  Search,
  Check,
  Plus,
  Layers,
} from "lucide-react";
import {
  useAssets,
  useFolders,
  useFolderPath,
  useCollections,
  useCreateFolder,
  useCreateCollection,
  useDeleteAssets,
} from "@/api/assets";
import { useAuthStore } from "@/stores/authStore";

// Asset store available for future use when adding local state management

type ViewMode = "grid" | "list";
type AssetType = "all" | "video" | "image" | "document" | "folder";

// Color options for collections
const COLLECTION_COLORS = [
  { name: "Blue", value: "#3B82F6" },
  { name: "Green", value: "#10B981" },
  { name: "Yellow", value: "#F59E0B" },
  { name: "Red", value: "#EF4444" },
  { name: "Purple", value: "#8B5CF6" },
  { name: "Pink", value: "#EC4899" },
  { name: "Indigo", value: "#6366F1" },
  { name: "Teal", value: "#14B8A6" },
];

function formatFileSize(bytes: number): string {
  if (bytes >= 1073741824) return (bytes / 1073741824).toFixed(1) + " GB";
  if (bytes >= 1048576) return (bytes / 1048576).toFixed(0) + " MB";
  if (bytes >= 1024) return (bytes / 1024).toFixed(0) + " KB";
  return bytes + " bytes";
}

function formatTimeAgo(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffHours / 24);

  if (diffHours < 1) return "Just now";
  if (diffHours < 24) return `${diffHours} hours ago`;
  if (diffDays < 7) return `${diffDays} days ago`;
  return date.toLocaleDateString();
}

function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

function getAssetIcon(type: string) {
  switch (type) {
    case "video":
      return Video;
    case "image":
      return Image;
    case "folder":
      return Folder;
    default:
      return FileText;
  }
}

export default function Assets() {
  const navigate = useNavigate();
  const { folderId } = useParams<{ folderId?: string }>();
  const { workspace } = useAuthStore();

  // View state
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [selectedType, setSelectedType] = useState<AssetType>("all");
  const [selectedAssets, setSelectedAssets] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState("");

  // Modal state
  const [showNewFolderModal, setShowNewFolderModal] = useState(false);
  const [showNewCollectionModal, setShowNewCollectionModal] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");
  const [newCollectionName, setNewCollectionName] = useState("");
  const [newCollectionDescription, setNewCollectionDescription] = useState("");
  const [newCollectionColor, setNewCollectionColor] = useState(
    COLLECTION_COLORS[0].value,
  );

  // API hooks - pass folderId to filter by current folder
  const { data: assets = [], isLoading: assetsLoading } = useAssets(
    folderId || null,
  );
  const { data: folders = [] } = useFolders(folderId || null);
  const { data: folderPath = [] } = useFolderPath(folderId);
  const { data: collections = [] } = useCollections();
  const createFolder = useCreateFolder();
  const createCollection = useCreateCollection();
  const deleteAssets = useDeleteAssets();

  // Combine folders and assets for display
  const allItems = [
    ...folders.map((f) => ({
      ...f,
      type: "folder" as const,
      thumbnail: undefined,
      duration: undefined,
      tags: [],
    })),
    ...assets,
  ];

  const filteredAssets = allItems.filter((item) => {
    if (selectedType !== "all" && item.type !== selectedType) return false;
    if (
      searchQuery &&
      !item.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
      return false;
    return true;
  });

  const toggleAssetSelection = (id: string) => {
    const newSelection = new Set(selectedAssets);
    if (newSelection.has(id)) {
      newSelection.delete(id);
    } else {
      newSelection.add(id);
    }
    setSelectedAssets(newSelection);
  };

  const selectAll = () => {
    if (selectedAssets.size === filteredAssets.length) {
      setSelectedAssets(new Set());
    } else {
      setSelectedAssets(new Set(filteredAssets.map((a) => a.id)));
    }
  };

  const handleCreateFolder = async () => {
    if (!newFolderName.trim() || !workspace) return;

    try {
      await createFolder.mutateAsync({
        name: newFolderName,
        workspaceId: workspace.id,
        parentId: folderId || null,
      });
      setShowNewFolderModal(false);
      setNewFolderName("");
    } catch (error) {
      console.error("Failed to create folder:", error);
    }
  };

  const handleCreateCollection = async () => {
    if (!newCollectionName.trim()) return;

    try {
      await createCollection.mutateAsync({
        name: newCollectionName,
        description: newCollectionDescription || undefined,
        color: newCollectionColor,
      });
      setShowNewCollectionModal(false);
      setNewCollectionName("");
      setNewCollectionDescription("");
      setNewCollectionColor(COLLECTION_COLORS[0].value);
    } catch (error) {
      console.error("Failed to create collection:", error);
    }
  };

  const handleDeleteSelected = async () => {
    if (selectedAssets.size === 0) return;

    if (confirm(`Delete ${selectedAssets.size} selected item(s)?`)) {
      try {
        await deleteAssets.mutateAsync(Array.from(selectedAssets));
        setSelectedAssets(new Set());
      } catch (error) {
        console.error("Failed to delete assets:", error);
      }
    }
  };

  const breadcrumbs = [
    { name: "All Assets", href: "/assets" },
    ...folderPath.map((folder) => ({
      name: folder.name,
      href: `/assets/${folder.id}`,
    })),
  ];

  // Current folder is the last item in the path
  const currentFolder =
    folderPath.length > 0 ? folderPath[folderPath.length - 1] : null;

  // Page title based on current folder
  const pageTitle = currentFolder ? currentFolder.name : "Assets";

  return (
    <AppLayout title={pageTitle}>
      {/* Breadcrumbs */}
      <nav className="mb-4 flex items-center gap-2 text-sm">
        {breadcrumbs.map((crumb, index) => (
          <div key={crumb.href} className="flex items-center gap-2">
            {index > 0 && <ChevronRight className="h-4 w-4 text-gray-400" />}
            <Link
              to={crumb.href}
              className={clsx(
                index === breadcrumbs.length - 1
                  ? "font-medium text-gray-900"
                  : "text-gray-500 hover:text-gray-700",
              )}
            >
              {crumb.name}
            </Link>
          </div>
        ))}
      </nav>

      {/* Toolbar */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 items-center gap-3">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-600" />
            <input
              type="text"
              placeholder="Search assets..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border border-gray-400 bg-gray-300 py-2 pl-10 pr-4 text-sm text-gray-900 placeholder-gray-600 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
            />
          </div>

          {/* Type Filter */}
          <div className="flex items-center gap-1 rounded-lg border border-gray-400 bg-gray-300 p-1">
            {(
              ["all", "video", "image", "document", "folder"] as AssetType[]
            ).map((type) => (
              <button
                key={type}
                onClick={() => setSelectedType(type)}
                className={clsx(
                  "rounded-md px-3 py-1.5 text-xs font-medium transition-colors capitalize",
                  selectedType === type
                    ? "bg-primary-100 text-primary-700"
                    : "text-gray-800 hover:bg-gray-400",
                )}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* View Toggle */}
          <div className="flex items-center gap-1 rounded-lg border border-gray-400 bg-gray-300 p-1">
            <button
              onClick={() => setViewMode("grid")}
              className={clsx(
                "rounded-md p-1.5 transition-colors",
                viewMode === "grid"
                  ? "bg-gray-400 text-gray-900"
                  : "text-gray-600 hover:text-gray-800",
              )}
            >
              <Grid3X3 className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={clsx(
                "rounded-md p-1.5 transition-colors",
                viewMode === "list"
                  ? "bg-gray-400 text-gray-900"
                  : "text-gray-600 hover:text-gray-800",
              )}
            >
              <List className="h-4 w-4" />
            </button>
          </div>

          <Button
            variant="secondary"
            size="sm"
            leftIcon={<Filter className="h-4 w-4" />}
          >
            Filter
          </Button>

          <Button
            variant="secondary"
            size="sm"
            leftIcon={<SortAsc className="h-4 w-4" />}
          >
            Sort
          </Button>

          <Button
            size="sm"
            leftIcon={<Upload className="h-4 w-4" />}
            onClick={() =>
              navigate(folderId ? `/upload?folderId=${folderId}` : "/upload")
            }
          >
            Upload
          </Button>

          <Button
            variant="secondary"
            size="sm"
            leftIcon={<FolderPlus className="h-4 w-4" />}
            onClick={() => setShowNewFolderModal(true)}
          >
            New Folder
          </Button>

          <Button
            variant="secondary"
            size="sm"
            leftIcon={<Layers className="h-4 w-4" />}
            onClick={() => setShowNewCollectionModal(true)}
          >
            New Collection
          </Button>
        </div>
      </div>

      {/* Collections Bar */}
      {collections.length > 0 && (
        <div className="mb-4 flex items-center gap-2 overflow-x-auto pb-2">
          <span className="text-sm font-medium text-gray-700">
            Collections:
          </span>
          {collections.map((collection) => (
            <button
              key={collection.id}
              className="flex items-center gap-2 rounded-full border border-gray-400 bg-gray-300 px-3 py-1 text-sm hover:bg-gray-400"
            >
              <div
                className="h-2 w-2 rounded-full"
                style={{ backgroundColor: collection.color }}
              />
              <span>{collection.name}</span>
              <Badge variant="default" className="text-xs">
                {collection.assetCount}
              </Badge>
            </button>
          ))}
          <button
            onClick={() => setShowNewCollectionModal(true)}
            className="flex items-center gap-1 rounded-full border border-dashed border-gray-500 px-3 py-1 text-sm text-gray-700 hover:border-gray-600 hover:text-gray-800"
          >
            <Plus className="h-3 w-3" />
            Add
          </button>
        </div>
      )}

      {/* Selection Bar */}
      {selectedAssets.size > 0 && (
        <div className="mb-4 flex items-center justify-between rounded-lg bg-primary-50 px-4 py-2">
          <div className="flex items-center gap-3">
            <button
              onClick={selectAll}
              className="flex h-5 w-5 items-center justify-center rounded border-2 border-primary-600 bg-primary-600 text-white"
            >
              {selectedAssets.size === filteredAssets.length ? (
                <Check className="h-3 w-3" />
              ) : (
                <div className="h-2 w-2 rounded-sm bg-white" />
              )}
            </button>
            <span className="text-sm font-medium text-primary-900">
              {selectedAssets.size} selected
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              leftIcon={<Download className="h-4 w-4" />}
            >
              Download
            </Button>
            <Button
              variant="ghost"
              size="sm"
              leftIcon={<Share2 className="h-4 w-4" />}
            >
              Share
            </Button>
            <Button
              variant="ghost"
              size="sm"
              leftIcon={<Trash2 className="h-4 w-4" />}
              className="text-red-600 hover:bg-red-50 hover:text-red-700"
              onClick={handleDeleteSelected}
              isLoading={deleteAssets.isPending}
            >
              Delete
            </Button>
          </div>
        </div>
      )}

      {/* Loading State */}
      {assetsLoading && (
        <div className="flex items-center justify-center py-12">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-500 border-t-transparent"></div>
        </div>
      )}

      {/* Assets Grid/List */}
      {!assetsLoading && viewMode === "grid" ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredAssets.map((item) => {
            const Icon = getAssetIcon(item.type);
            const isSelected = selectedAssets.has(item.id);
            const isFolder = item.type === "folder";

            return (
              <Card
                key={item.id}
                padding="none"
                className={clsx(
                  "group overflow-hidden transition-shadow hover:shadow-md cursor-pointer",
                  isSelected && "ring-2 ring-primary-500",
                )}
                onClick={() => {
                  if (isFolder) {
                    navigate(`/assets/${item.id}`);
                  } else {
                    navigate(`/assets/view/${item.id}`);
                  }
                }}
              >
                {/* Thumbnail */}
                <div className="relative aspect-video bg-gray-100">
                  {"thumbnail" in item && item.thumbnail ? (
                    <img
                      src={item.thumbnail}
                      alt={item.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center">
                      <Icon
                        className={clsx(
                          "h-12 w-12",
                          isFolder ? "text-primary-500" : "text-gray-400",
                        )}
                      />
                    </div>
                  )}
                  {"duration" in item && item.duration && (
                    <div className="absolute bottom-2 right-2 flex items-center gap-1 rounded bg-black/70 px-1.5 py-0.5 text-xs text-white">
                      <Play className="h-3 w-3" />
                      {formatDuration(item.duration)}
                    </div>
                  )}
                  {/* Selection Checkbox */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleAssetSelection(item.id);
                    }}
                    className={clsx(
                      "absolute left-2 top-2 flex h-5 w-5 items-center justify-center rounded border-2 transition-opacity",
                      isSelected
                        ? "border-primary-600 bg-primary-600 text-white opacity-100"
                        : "border-white bg-white/80 text-transparent opacity-0 group-hover:opacity-100",
                    )}
                  >
                    <Check className="h-3 w-3" />
                  </button>
                  {/* Folder asset count */}
                  {isFolder && "assetCount" in item && (
                    <div className="absolute right-2 top-2 rounded bg-black/70 px-1.5 py-0.5 text-xs text-white">
                      {(item as { assetCount: number }).assetCount} items
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="p-4">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-medium text-gray-900 hover:text-primary-600">
                        {item.name}
                      </span>
                      <p className="mt-1 flex items-center gap-2 text-xs text-gray-500">
                        {"size" in item && item.size && (
                          <span>{formatFileSize(item.size)}</span>
                        )}
                        {"size" in item && item.size && <span>•</span>}
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {formatTimeAgo(item.updatedAt)}
                        </span>
                      </p>
                    </div>
                    <Dropdown
                      trigger={
                        <button
                          onClick={(e) => e.stopPropagation()}
                          className="rounded-lg p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </button>
                      }
                      items={[
                        {
                          label: "Preview",
                          icon: <Play className="h-4 w-4" />,
                          onClick: () => navigate(`/assets/view/${item.id}`),
                        },
                        {
                          label: "Download",
                          icon: <Download className="h-4 w-4" />,
                          onClick: () => {},
                        },
                        {
                          label: "Share",
                          icon: <Share2 className="h-4 w-4" />,
                          onClick: () => {},
                        },
                        {
                          label: "Rename",
                          icon: <Edit className="h-4 w-4" />,
                          onClick: () => {},
                        },
                        {
                          label: "Delete",
                          icon: <Trash2 className="h-4 w-4" />,
                          onClick: () => deleteAssets.mutate([item.id]),
                          danger: true,
                        },
                      ]}
                    />
                  </div>
                  {"tags" in item && item.tags && item.tags.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1">
                      {item.tags.map((tag) => (
                        <Badge key={tag} size="sm">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      ) : (
        /* List View */
        <Card padding="none">
          <table className="min-w-full divide-y divide-gray-400">
            <thead className="bg-gray-300">
              <tr>
                <th className="w-12 px-4 py-3">
                  <button
                    onClick={selectAll}
                    className={clsx(
                      "flex h-4 w-4 items-center justify-center rounded border",
                      selectedAssets.size === filteredAssets.length
                        ? "border-primary-500 bg-primary-500 text-gray-50"
                        : "border-gray-500 bg-gray-300",
                    )}
                  >
                    {selectedAssets.size === filteredAssets.length && (
                      <Check className="h-3 w-3" />
                    )}
                  </button>
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-700">
                  Name
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-700">
                  Type
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-700">
                  Size
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-700">
                  Modified
                </th>
                <th className="w-12 px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-400 bg-gray-200">
              {filteredAssets.map((item) => {
                const Icon = getAssetIcon(item.type);
                const isSelected = selectedAssets.has(item.id);
                const isFolder = item.type === "folder";

                return (
                  <tr
                    key={item.id}
                    className={clsx(
                      "hover:bg-gray-300 cursor-pointer",
                      isSelected && "bg-primary-100",
                    )}
                    onClick={() => {
                      if (isFolder) {
                        navigate(`/assets/${item.id}`);
                      } else {
                        navigate(`/assets/view/${item.id}`);
                      }
                    }}
                  >
                    <td className="px-4 py-3">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleAssetSelection(item.id);
                        }}
                        className={clsx(
                          "flex h-4 w-4 items-center justify-center rounded border",
                          isSelected
                            ? "border-primary-500 bg-primary-500 text-gray-50"
                            : "border-gray-500 bg-gray-300",
                        )}
                      >
                        {isSelected && <Check className="h-3 w-3" />}
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <Icon
                          className={clsx(
                            "h-5 w-5 shrink-0",
                            isFolder ? "text-primary-500" : "text-gray-600",
                          )}
                        />
                        <span className="text-sm font-medium text-gray-900 hover:text-primary-500">
                          {item.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <Badge size="sm" className="capitalize">
                        {item.type}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700">
                      {"size" in item && item.size
                        ? formatFileSize(item.size)
                        : "-"}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700">
                      {formatTimeAgo(item.updatedAt)}
                    </td>
                    <td className="px-4 py-3">
                      <Dropdown
                        trigger={
                          <button
                            onClick={(e) => e.stopPropagation()}
                            className="rounded-lg p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </button>
                        }
                        items={[
                          {
                            label: "Preview",
                            icon: <Play className="h-4 w-4" />,
                            onClick: () => navigate(`/assets/view/${item.id}`),
                          },
                          {
                            label: "Download",
                            icon: <Download className="h-4 w-4" />,
                            onClick: () => {},
                          },
                          {
                            label: "Share",
                            icon: <Share2 className="h-4 w-4" />,
                            onClick: () => {},
                          },
                          {
                            label: "Rename",
                            icon: <Edit className="h-4 w-4" />,
                            onClick: () => {},
                          },
                          {
                            label: "Delete",
                            icon: <Trash2 className="h-4 w-4" />,
                            onClick: () => deleteAssets.mutate([item.id]),
                            danger: true,
                          },
                        ]}
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </Card>
      )}

      {/* Empty State */}
      {filteredAssets.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16">
          <FolderPlus className="h-12 w-12 text-gray-300" />
          <h3 className="mt-4 text-lg font-medium text-gray-900">
            No assets found
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchQuery
              ? "Try adjusting your search or filters"
              : "Upload your first asset to get started"}
          </p>
          {!searchQuery && (
            <Button
              className="mt-4"
              leftIcon={<Upload className="h-4 w-4" />}
              onClick={() =>
                navigate(folderId ? `/upload?folderId=${folderId}` : "/upload")
              }
            >
              Upload Assets
            </Button>
          )}
        </div>
      )}

      {/* New Folder Modal */}
      <Modal
        isOpen={showNewFolderModal}
        onClose={() => setShowNewFolderModal(false)}
        title="Create New Folder"
      >
        <div className="space-y-4">
          <Input
            label="Folder Name"
            placeholder="Enter folder name..."
            value={newFolderName}
            onChange={(e) => setNewFolderName(e.target.value)}
          />
          <div className="flex justify-end gap-3">
            <Button
              variant="secondary"
              onClick={() => setShowNewFolderModal(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreateFolder}
              disabled={!newFolderName.trim() || createFolder.isPending}
            >
              {createFolder.isPending ? "Creating..." : "Create Folder"}
            </Button>
          </div>
        </div>
      </Modal>

      {/* New Collection Modal */}
      <Modal
        isOpen={showNewCollectionModal}
        onClose={() => setShowNewCollectionModal(false)}
        title="Create New Collection"
      >
        <div className="space-y-4">
          <Input
            label="Collection Name"
            placeholder="Enter collection name..."
            value={newCollectionName}
            onChange={(e) => setNewCollectionName(e.target.value)}
          />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Color
            </label>
            <div className="flex flex-wrap gap-2">
              {COLLECTION_COLORS.map((colorOption) => (
                <button
                  key={colorOption.value}
                  onClick={() => setNewCollectionColor(colorOption.value)}
                  className={clsx(
                    "h-8 w-8 rounded-full transition-transform",
                    newCollectionColor === colorOption.value &&
                      "ring-2 ring-offset-2 ring-gray-400 scale-110",
                  )}
                  style={{ backgroundColor: colorOption.value }}
                />
              ))}
            </div>
          </div>
          <div className="flex justify-end gap-3">
            <Button
              variant="secondary"
              onClick={() => setShowNewCollectionModal(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreateCollection}
              disabled={!newCollectionName.trim() || createCollection.isPending}
            >
              {createCollection.isPending ? "Creating..." : "Create Collection"}
            </Button>
          </div>
        </div>
      </Modal>
    </AppLayout>
  );
}
