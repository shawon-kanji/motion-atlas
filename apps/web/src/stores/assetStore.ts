import { create } from 'zustand';

export interface Asset {
  id: string;
  name: string;
  type: 'video' | 'image' | 'audio' | 'document';
  thumbnail: string;
  url: string;
  size: number;
  duration?: number;
  width?: number;
  height?: number;
  format: string;
  status: 'processing' | 'ready' | 'error';
  folderId: string | null;
  collectionIds: string[];
  tags: string[];
  metadata: Record<string, string>;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

export interface Folder {
  id: string;
  name: string;
  parentId: string | null;
  assetCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface Collection {
  id: string;
  name: string;
  description?: string;
  color: string;
  assetCount: number;
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AssetVersion {
  id: string;
  assetId: string;
  version: number;
  url: string;
  size: number;
  createdAt: string;
  createdBy: string;
  comment?: string;
}

export interface Comment {
  id: string;
  assetId: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  content: string;
  timestamp?: number; // For video timestamp comments
  createdAt: string;
  replies?: Comment[];
}

interface AssetState {
  assets: Asset[];
  folders: Folder[];
  collections: Collection[];
  selectedAssets: string[];
  currentFolder: string | null;
  viewMode: 'grid' | 'list';
  sortBy: 'name' | 'date' | 'size' | 'type';
  sortOrder: 'asc' | 'desc';
  filterType: string | null;
  searchQuery: string;

  // Actions
  setAssets: (assets: Asset[]) => void;
  addAsset: (asset: Asset) => void;
  updateAsset: (id: string, updates: Partial<Asset>) => void;
  deleteAsset: (id: string) => void;
  deleteAssets: (ids: string[]) => void;

  setFolders: (folders: Folder[]) => void;
  addFolder: (folder: Folder) => void;
  updateFolder: (id: string, updates: Partial<Folder>) => void;
  deleteFolder: (id: string) => void;

  setCollections: (collections: Collection[]) => void;
  addCollection: (collection: Collection) => void;
  updateCollection: (id: string, updates: Partial<Collection>) => void;
  deleteCollection: (id: string) => void;

  setSelectedAssets: (ids: string[]) => void;
  toggleAssetSelection: (id: string) => void;
  selectAllAssets: () => void;
  clearSelection: () => void;

  setCurrentFolder: (folderId: string | null) => void;
  setViewMode: (mode: 'grid' | 'list') => void;
  setSortBy: (sortBy: 'name' | 'date' | 'size' | 'type') => void;
  setSortOrder: (order: 'asc' | 'desc') => void;
  setFilterType: (type: string | null) => void;
  setSearchQuery: (query: string) => void;
}

export const useAssetStore = create<AssetState>()((set, _get) => ({
  assets: [],
  folders: [],
  collections: [],
  selectedAssets: [],
  currentFolder: null,
  viewMode: 'grid',
  sortBy: 'date',
  sortOrder: 'desc',
  filterType: null,
  searchQuery: '',

  setAssets: (assets) => set({ assets }),
  addAsset: (asset) => set((state) => ({ assets: [asset, ...state.assets] })),
  updateAsset: (id, updates) => set((state) => ({
    assets: state.assets.map(a => a.id === id ? { ...a, ...updates } : a),
  })),
  deleteAsset: (id) => set((state) => ({
    assets: state.assets.filter(a => a.id !== id),
    selectedAssets: state.selectedAssets.filter(sid => sid !== id),
  })),
  deleteAssets: (ids) => set((state) => ({
    assets: state.assets.filter(a => !ids.includes(a.id)),
    selectedAssets: [],
  })),

  setFolders: (folders) => set({ folders }),
  addFolder: (folder) => set((state) => ({ folders: [...state.folders, folder] })),
  updateFolder: (id, updates) => set((state) => ({
    folders: state.folders.map(f => f.id === id ? { ...f, ...updates } : f),
  })),
  deleteFolder: (id) => set((state) => ({
    folders: state.folders.filter(f => f.id !== id),
  })),

  setCollections: (collections) => set({ collections }),
  addCollection: (collection) => set((state) => ({ collections: [...state.collections, collection] })),
  updateCollection: (id, updates) => set((state) => ({
    collections: state.collections.map(c => c.id === id ? { ...c, ...updates } : c),
  })),
  deleteCollection: (id) => set((state) => ({
    collections: state.collections.filter(c => c.id !== id),
  })),

  setSelectedAssets: (ids) => set({ selectedAssets: ids }),
  toggleAssetSelection: (id) => set((state) => ({
    selectedAssets: state.selectedAssets.includes(id)
      ? state.selectedAssets.filter(sid => sid !== id)
      : [...state.selectedAssets, id],
  })),
  selectAllAssets: () => set((state) => ({
    selectedAssets: state.assets
      .filter(a => state.currentFolder === null || a.folderId === state.currentFolder)
      .map(a => a.id),
  })),
  clearSelection: () => set({ selectedAssets: [] }),

  setCurrentFolder: (folderId) => set({ currentFolder: folderId, selectedAssets: [] }),
  setViewMode: (viewMode) => set({ viewMode }),
  setSortBy: (sortBy) => set({ sortBy }),
  setSortOrder: (sortOrder) => set({ sortOrder }),
  setFilterType: (filterType) => set({ filterType }),
  setSearchQuery: (searchQuery) => set({ searchQuery }),
}));
