import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "./client";
import { useAuthStore } from "@/stores/authStore";
import {
  mockStats,
} from "../data/mockData";
import type {
  Asset,
  Folder,
  Collection,
} from "../stores/assetStore";
import { useAssetStore } from "../stores/assetStore";

// ============ Type Definitions ============

interface CreateAssetParams {
  file: File;
  name?: string;
  workspaceId: string;
  folderId?: string | null;
  tags?: string[];
}

interface CreateFolderParams {
  name: string;
  workspaceId: string;
  parentId?: string | null;
}

// ============ Assets API ============

export const useAssets = (folderId?: string | null) => {
  const setAssets = useAssetStore((state) => state.setAssets);
  const workspace = useAuthStore((state) => state.workspace);

  return useQuery({
    queryKey: ["assets", workspace?.id, folderId],
    queryFn: async () => {
      if (!workspace?.id) return [];

      const response = await api.get<Asset[]>("/assets", {
        params: {
          workspace_id: workspace.id,
          folder_id: folderId ?? "root",
        },
      });

      // Transform URL if relative
      const assets = response.data.map(a => ({
        ...a,
        url: a.url.startsWith('/') ? `${api.defaults.baseURL?.replace('/api/v1', '')}${a.url}` : a.url
      }));

      setAssets(assets);
      return assets;
    },
    enabled: !!workspace?.id,
  });
};

export const useAsset = (assetId: string) => {
  return useQuery({
    queryKey: ["asset", assetId],
    queryFn: async () => {
      const response = await api.get<Asset>(`/assets/${assetId}`);
       // Transform URL if relative
      const asset = response.data;
      if (asset.url.startsWith('/')) {
        asset.url = `${api.defaults.baseURL?.replace('/api/v1', '')}${asset.url}`;
      }
      return asset;
    },
    enabled: !!assetId,
  });
};

export const useCreateAsset = () => {
  const queryClient = useQueryClient();
  const addAsset = useAssetStore((state) => state.addAsset);

  return useMutation({
    mutationFn: async ({ file, name, workspaceId, folderId, tags }: CreateAssetParams) => {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("workspace_id", workspaceId);
      if (name) formData.append("name", name);
      if (folderId) formData.append("folder_id", folderId);
      if (tags && tags.length > 0) formData.append("tags", tags.join(","));

      const response = await api.post<Asset>("/assets", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    },
    onSuccess: (newAsset) => {
      // addAsset(newAsset); // Optional: we can rely on invalidation
      queryClient.invalidateQueries({ queryKey: ["assets"] });
      queryClient.invalidateQueries({ queryKey: ["stats"] });
    },
  });
};

// ============ Folders API ============

export const useFolders = (parentId?: string | null) => {
  const workspace = useAuthStore((state) => state.workspace);

  return useQuery({
    queryKey: ["folders", workspace?.id, parentId],
    queryFn: async () => {
       if (!workspace?.id) return [];

      const response = await api.get<Folder[]>("/folders", {
        params: {
          workspace_id: workspace.id,
          parent_id: parentId ?? undefined,
        },
      });
      return response.data;
    },
     enabled: !!workspace?.id,
  });
};

export const useFolder = (folderId: string | null) => {
  return useQuery({
    queryKey: ["folder", folderId],
    queryFn: async () => {
      if (!folderId) return null;
      const response = await api.get<Folder>(`/folders/${folderId}`);
      return response.data;
    },
    enabled: !!folderId,
  });
};

export const useFolderPath = (folderId?: string | null) => {
  // Mock path for now until backend supports returning full path hierarchy
  return [];
};

export const useCreateFolder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ name, workspaceId, parentId }: CreateFolderParams) => {
      const response = await api.post<Folder>("/folders", {
        name,
        workspace_id: workspaceId,
        parent_id: parentId,
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["folders"] });
    },
  });
};

// ============ Stats API ============

export const useDashboardStats = () => {
  const workspace = useAuthStore((state) => state.workspace);

  return useQuery({
    queryKey: ["stats", workspace?.id],
    queryFn: async () => {
      if (!workspace?.id) return mockStats;

      try {
          const response = await api.get<{totalAssets: number, recentUploadsLastWeek: number}>("/assets/stats", {
            params: { workspace_id: workspace.id }
          });

          return {
            ...mockStats,
            totalAssets: response.data.totalAssets,
          };
      } catch (e) {
          console.error("Failed to fetch stats", e);
          return mockStats;
      }
    },
    enabled: !!workspace?.id,
  });
};


// ============ Placeholders/Mocks for unimplemented APIs ============
// To keep the UI working without errors while we migrate

export const useCollections = () => {
    return useQuery({
        queryKey: ["collections"],
        queryFn: async () => [] as Collection[]
    })
}

export const useCreateCollection = () => {
    return useMutation({
        mutationFn: async () => {}
    })
}

export const useDeleteAssets = () => {
    return useMutation({
        mutationFn: async (ids: string[]) => {}
    })
}

export const useUpdateAsset = () => {
    return useMutation({
        mutationFn: async () => {}
    })
}

export const useAssetVersions = (assetId: string) => {
    return useQuery({
        queryKey: ["versions", assetId],
        queryFn: async () => []
    })
}

export const useAssetComments = (assetId: string) => {
    return useQuery({
        queryKey: ["comments", assetId],
        queryFn: async () => []
    })
}

export const useAddComment = () => {
    return useMutation({
        mutationFn: async () => {}
    })
}
