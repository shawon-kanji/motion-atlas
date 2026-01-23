import api from "./client";

export interface Workspace {
  id: string;
  name: string;
  ownerId?: string;
  plan: string;
  createdAt: string;
  updatedAt: string;
}

export const workspaceApi = {
  // Get all workspaces for the current user
  getAll: async (): Promise<Workspace[]> => {
    const response = await api.get<Workspace[]>("/workspaces");
    return response.data;
  },

  // Get a single workspace
  get: async (id: string): Promise<Workspace> => {
    const response = await api.get<Workspace>(`/workspaces/${id}`);
    return response.data;
  },

  // Create a new workspace
  create: async (name: string): Promise<Workspace> => {
    const response = await api.post<Workspace>("/workspaces", { name });
    return response.data;
  },
};
