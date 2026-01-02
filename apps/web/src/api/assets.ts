import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  mockAssets,
  mockFolders,
  mockCollections,
  mockVersions,
  mockComments,
  mockTeamMembers,
  mockActivity,
  mockStats,
  type TeamMember,
  type ActivityItem,
  type DashboardStats,
} from '../data/mockData';
import type {
  Asset,
  Folder,
  Collection,
  AssetVersion,
  Comment
} from '../stores/assetStore';
import { useAssetStore } from '../stores/assetStore';

// Simulate network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// ============ Assets API ============

export const useAssets = (folderId?: string | null) => {
  const setAssets = useAssetStore((state) => state.setAssets);

  return useQuery({
    queryKey: ['assets', folderId],
    queryFn: async () => {
      await delay(300);
      // Filter assets by folderId - null means root level assets
      const assets = mockAssets.filter(a => a.folderId === folderId);
      setAssets(assets);
      return assets;
    },
  });
};

export const useAsset = (assetId: string) => {
  return useQuery({
    queryKey: ['asset', assetId],
    queryFn: async () => {
      await delay(200);
      const asset = mockAssets.find(a => a.id === assetId);
      if (!asset) throw new Error('Asset not found');
      return asset;
    },
    enabled: !!assetId,
  });
};

export const useCreateAsset = () => {
  const queryClient = useQueryClient();
  const addAsset = useAssetStore((state) => state.addAsset);

  return useMutation({
    mutationFn: async (data: Omit<Asset, 'id' | 'createdAt' | 'updatedAt'>) => {
      await delay(500);
      const newAsset: Asset = {
        ...data,
        id: `asset-${Date.now()}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      mockAssets.unshift(newAsset);
      return newAsset;
    },
    onSuccess: (newAsset) => {
      addAsset(newAsset);
      queryClient.invalidateQueries({ queryKey: ['assets'] });
    },
  });
};

export const useUpdateAsset = () => {
  const queryClient = useQueryClient();
  const updateAsset = useAssetStore((state) => state.updateAsset);

  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<Asset> }) => {
      await delay(300);
      const index = mockAssets.findIndex(a => a.id === id);
      if (index === -1) throw new Error('Asset not found');
      mockAssets[index] = { ...mockAssets[index], ...updates, updatedAt: new Date().toISOString() };
      return mockAssets[index];
    },
    onSuccess: (asset) => {
      updateAsset(asset.id, asset);
      queryClient.invalidateQueries({ queryKey: ['assets'] });
      queryClient.invalidateQueries({ queryKey: ['asset', asset.id] });
    },
  });
};

export const useDeleteAsset = () => {
  const queryClient = useQueryClient();
  const deleteAsset = useAssetStore((state) => state.deleteAsset);

  return useMutation({
    mutationFn: async (id: string) => {
      await delay(300);
      const index = mockAssets.findIndex(a => a.id === id);
      if (index !== -1) mockAssets.splice(index, 1);
      return id;
    },
    onSuccess: (id) => {
      deleteAsset(id);
      queryClient.invalidateQueries({ queryKey: ['assets'] });
    },
  });
};

export const useDeleteAssets = () => {
  const queryClient = useQueryClient();
  const deleteAssets = useAssetStore((state) => state.deleteAssets);

  return useMutation({
    mutationFn: async (ids: string[]) => {
      await delay(300);
      ids.forEach(id => {
        const index = mockAssets.findIndex(a => a.id === id);
        if (index !== -1) mockAssets.splice(index, 1);
      });
      return ids;
    },
    onSuccess: (ids) => {
      deleteAssets(ids);
      queryClient.invalidateQueries({ queryKey: ['assets'] });
    },
  });
};

// ============ Folders API ============

export const useFolders = (parentId?: string | null) => {
  const setFolders = useAssetStore((state) => state.setFolders);

  return useQuery({
    queryKey: ['folders', parentId],
    queryFn: async () => {
      await delay(200);
      // Filter folders by parentId - null means root level folders
      const folders = mockFolders.filter(f => f.parentId === parentId);
      setFolders(folders);
      return folders;
    },
  });
};

export const useFolder = (folderId: string) => {
  return useQuery({
    queryKey: ['folder', folderId],
    queryFn: async () => {
      await delay(200);
      const folder = mockFolders.find(f => f.id === folderId);
      if (!folder) throw new Error('Folder not found');
      return folder;
    },
    enabled: !!folderId,
  });
};

export const useFolderPath = (folderId: string | undefined) => {
  return useQuery({
    queryKey: ['folderPath', folderId],
    queryFn: async () => {
      await delay(100);
      if (!folderId) return [];
      
      // Build path from current folder to root
      const path: Folder[] = [];
      let currentId: string | null = folderId;
      
      while (currentId) {
        const folder = mockFolders.find(f => f.id === currentId);
        if (!folder) break;
        path.unshift(folder); // Add to beginning to build path from root to current
        currentId = folder.parentId;
      }
      
      return path;
    },
    enabled: !!folderId,
  });
};

export const useCreateFolder = () => {
  const queryClient = useQueryClient();
  const addFolder = useAssetStore((state) => state.addFolder);

  return useMutation({
    mutationFn: async (data: { name: string; parentId: string | null }) => {
      await delay(300);
      const newFolder: Folder = {
        id: `folder-${Date.now()}`,
        name: data.name,
        parentId: data.parentId,
        assetCount: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      mockFolders.push(newFolder);
      return newFolder;
    },
    onSuccess: (newFolder) => {
      addFolder(newFolder);
      queryClient.invalidateQueries({ queryKey: ['folders'] });
    },
  });
};

export const useUpdateFolder = () => {
  const queryClient = useQueryClient();
  const updateFolder = useAssetStore((state) => state.updateFolder);

  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<Folder> }) => {
      await delay(300);
      const index = mockFolders.findIndex(f => f.id === id);
      if (index === -1) throw new Error('Folder not found');
      mockFolders[index] = { ...mockFolders[index], ...updates, updatedAt: new Date().toISOString() };
      return mockFolders[index];
    },
    onSuccess: (folder) => {
      updateFolder(folder.id, folder);
      queryClient.invalidateQueries({ queryKey: ['folders'] });
    },
  });
};

export const useDeleteFolder = () => {
  const queryClient = useQueryClient();
  const deleteFolder = useAssetStore((state) => state.deleteFolder);

  return useMutation({
    mutationFn: async (id: string) => {
      await delay(300);
      const index = mockFolders.findIndex(f => f.id === id);
      if (index !== -1) mockFolders.splice(index, 1);
      return id;
    },
    onSuccess: (id) => {
      deleteFolder(id);
      queryClient.invalidateQueries({ queryKey: ['folders'] });
    },
  });
};

// ============ Collections API ============

export const useCollections = () => {
  const setCollections = useAssetStore((state) => state.setCollections);

  return useQuery({
    queryKey: ['collections'],
    queryFn: async () => {
      await delay(200);
      setCollections(mockCollections);
      return mockCollections;
    },
  });
};

export const useCollection = (collectionId: string) => {
  return useQuery({
    queryKey: ['collection', collectionId],
    queryFn: async () => {
      await delay(200);
      const collection = mockCollections.find(c => c.id === collectionId);
      if (!collection) throw new Error('Collection not found');
      return collection;
    },
    enabled: !!collectionId,
  });
};

export const useCreateCollection = () => {
  const queryClient = useQueryClient();
  const addCollection = useAssetStore((state) => state.addCollection);

  return useMutation({
    mutationFn: async (data: { name: string; description?: string; color: string }) => {
      await delay(300);
      const newCollection: Collection = {
        id: `collection-${Date.now()}`,
        name: data.name,
        description: data.description,
        color: data.color,
        assetCount: 0,
        isPublic: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      mockCollections.push(newCollection);
      return newCollection;
    },
    onSuccess: (newCollection) => {
      addCollection(newCollection);
      queryClient.invalidateQueries({ queryKey: ['collections'] });
    },
  });
};

export const useUpdateCollection = () => {
  const queryClient = useQueryClient();
  const updateCollection = useAssetStore((state) => state.updateCollection);

  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<Collection> }) => {
      await delay(300);
      const index = mockCollections.findIndex(c => c.id === id);
      if (index === -1) throw new Error('Collection not found');
      mockCollections[index] = { ...mockCollections[index], ...updates, updatedAt: new Date().toISOString() };
      return mockCollections[index];
    },
    onSuccess: (collection) => {
      updateCollection(collection.id, collection);
      queryClient.invalidateQueries({ queryKey: ['collections'] });
    },
  });
};

export const useDeleteCollection = () => {
  const queryClient = useQueryClient();
  const deleteCollection = useAssetStore((state) => state.deleteCollection);

  return useMutation({
    mutationFn: async (id: string) => {
      await delay(300);
      const index = mockCollections.findIndex(c => c.id === id);
      if (index !== -1) mockCollections.splice(index, 1);
      return id;
    },
    onSuccess: (id) => {
      deleteCollection(id);
      queryClient.invalidateQueries({ queryKey: ['collections'] });
    },
  });
};

// ============ Asset Versions API ============

export const useAssetVersions = (assetId: string) => {
  return useQuery({
    queryKey: ['assetVersions', assetId],
    queryFn: async (): Promise<AssetVersion[]> => {
      await delay(200);
      return mockVersions[assetId] || [];
    },
    enabled: !!assetId,
  });
};

// ============ Comments API ============

export const useAssetComments = (assetId: string) => {
  return useQuery({
    queryKey: ['assetComments', assetId],
    queryFn: async (): Promise<Comment[]> => {
      await delay(200);
      return mockComments[assetId] || [];
    },
    enabled: !!assetId,
  });
};

export const useAddComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      assetId: string;
      content: string;
      timestamp?: number;
      userId: string;
      userName: string;
      userAvatar?: string;
    }) => {
      await delay(300);
      const newComment: Comment = {
        id: `comment-${Date.now()}`,
        assetId: data.assetId,
        userId: data.userId,
        userName: data.userName,
        userAvatar: data.userAvatar,
        content: data.content,
        timestamp: data.timestamp,
        createdAt: new Date().toISOString(),
        replies: [],
      };

      if (!mockComments[data.assetId]) {
        mockComments[data.assetId] = [];
      }
      mockComments[data.assetId].unshift(newComment);
      return newComment;
    },
    onSuccess: (comment) => {
      queryClient.invalidateQueries({ queryKey: ['assetComments', comment.assetId] });
    },
  });
};

// ============ Team API ============

export const useTeamMembers = () => {
  return useQuery({
    queryKey: ['teamMembers'],
    queryFn: async (): Promise<TeamMember[]> => {
      await delay(300);
      return mockTeamMembers;
    },
  });
};

export const useInviteTeamMember = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { email: string; role: TeamMember['role'] }) => {
      await delay(500);
      const newMember: TeamMember = {
        id: `user-${Date.now()}`,
        name: data.email.split('@')[0],
        email: data.email,
        role: data.role,
        status: 'pending',
        joinedAt: new Date().toISOString(),
      };
      mockTeamMembers.push(newMember);
      return newMember;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teamMembers'] });
    },
  });
};

export const useUpdateTeamMember = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<TeamMember> }) => {
      await delay(300);
      const index = mockTeamMembers.findIndex(m => m.id === id);
      if (index === -1) throw new Error('Member not found');
      mockTeamMembers[index] = { ...mockTeamMembers[index], ...updates };
      return mockTeamMembers[index];
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teamMembers'] });
    },
  });
};

export const useRemoveTeamMember = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await delay(300);
      const index = mockTeamMembers.findIndex(m => m.id === id);
      if (index !== -1) mockTeamMembers.splice(index, 1);
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teamMembers'] });
    },
  });
};

// ============ Activity & Stats API ============

export const useActivity = () => {
  return useQuery({
    queryKey: ['activity'],
    queryFn: async (): Promise<ActivityItem[]> => {
      await delay(200);
      return mockActivity;
    },
  });
};

export const useDashboardStats = () => {
  return useQuery({
    queryKey: ['dashboardStats'],
    queryFn: async (): Promise<DashboardStats> => {
      await delay(200);
      return mockStats;
    },
  });
};

// ============ Upload API ============

export interface UploadProgress {
  file: File;
  progress: number;
  status: 'pending' | 'uploading' | 'processing' | 'complete' | 'error';
  error?: string;
  assetId?: string;
}

export const useUploadAsset = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      file,
      folderId,
      onProgress,
    }: {
      file: File;
      folderId: string | null;
      onProgress?: (progress: number) => void;
    }) => {
      // Simulate upload progress
      for (let i = 0; i <= 100; i += 10) {
        await delay(150);
        onProgress?.(i);
      }

      // Simulate processing
      await delay(500);

      const isVideo = file.type.startsWith('video/');
      const isImage = file.type.startsWith('image/');

      const newAsset: Asset = {
        id: `asset-${Date.now()}`,
        name: file.name.replace(/\.[^/.]+$/, ''),
        type: isVideo ? 'video' : isImage ? 'image' : 'document',
        thumbnail: isVideo
          ? 'https://storage.googleapis.com/gtv-videos-bucket/sample/images/BigBuckBunny.jpg'
          : 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=800',
        url: isVideo
          ? 'https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'
          : 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=800',
        size: file.size,
        duration: isVideo ? 120 : undefined,
        width: 1920,
        height: 1080,
        format: file.name.split('.').pop() || 'unknown',
        status: 'ready',
        folderId,
        collectionIds: [],
        tags: [],
        metadata: {},
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        createdBy: 'user-1',
      };

      mockAssets.unshift(newAsset);
      return newAsset;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['assets'] });
      queryClient.invalidateQueries({ queryKey: ['dashboardStats'] });
    },
  });
};
