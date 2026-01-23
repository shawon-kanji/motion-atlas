import { create } from 'zustand';
import { authApi } from '@/api/auth';
import { workspaceApi, Workspace } from '@/api/workspaces';

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role: 'owner' | 'admin' | 'member' | 'viewer';
}

// Re-export or use the one from api
export type { Workspace };

interface AuthState {
  user: User | null;
  workspace: Workspace | null;
  workspaces: Workspace[];
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  checkSession: () => Promise<void>;
  switchWorkspace: (workspaceId: string) => void;
  fetchWorkspaces: () => Promise<void>;
  createWorkspace: (name: string) => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>()(
  (set, get) => ({
    user: null,
    workspace: null,
    workspaces: [],
    isAuthenticated: false,
    isLoading: false,
    error: null,

    fetchWorkspaces: async () => {
      try {
        const workspaces = await workspaceApi.getAll();
        set((state) => {
           // Keep current workspace if still in list, otherwise pick first
           let nextWorkspace = state.workspace;
           if (!nextWorkspace || !workspaces.find(w => w.id === nextWorkspace?.id)) {
               nextWorkspace = workspaces.length > 0 ? workspaces[0] : null;
           }
           return { workspaces, workspace: nextWorkspace };
        });
      } catch (error) {
        console.error("Failed to fetch workspaces", error);
      }
    },

    createWorkspace: async (name: string) => {
        try {
            const newWs = await workspaceApi.create(name);
            set(state => ({
                workspaces: [...state.workspaces, newWs],
                workspace: newWs // Switch to new workspace?
            }));
        } catch (error) {
            console.error("Failed to create workspace", error);
            throw error;
        }
    },

    login: async (email, password) => {
      set({ isLoading: true, error: null });
      try {
        const response = await authApi.login(email, password);
        localStorage.setItem('token', response.token);

        const user: User = {
          id: response.user.id,
          email: response.user.email,
          name: response.user.name,
          avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(response.user.name)}`,
          role: 'owner', // Default role for now
        };

        set({
          user,
          isAuthenticated: true,
          isLoading: false,
        });

        // Fetch workspaces
        await get().fetchWorkspaces();

      } catch (error: any) {
        set({
          error: error.response?.data?.error || 'Invalid email or password',
          isLoading: false,
        });
        throw error;
      }
    },

    signup: async (name, email, password) => {
      set({ isLoading: true, error: null });
      try {
        await authApi.signup(name, email, password);
        // Automatically login after signup
        await get().login(email, password);
      } catch (error: any) {
        set({
          error: error.response?.data?.error || 'Failed to create account',
          isLoading: false,
        });
        throw error;
      }
    },

    logout: () => {
      localStorage.removeItem('token');
      set({
        user: null,
        workspace: null,
        workspaces: [],
        isAuthenticated: false,
        error: null,
      });
    },

    checkSession: async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        return;
      }

      try {
        const response = await authApi.me();
        const user: User = {
          id: response.user.id,
          email: response.user.email,
          name: response.user.name,
          avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(response.user.name)}`,
          role: 'owner', // Default role for now
        };

        set({
          user,
          isAuthenticated: true,
        });

        await get().fetchWorkspaces();
      } catch (error) {
        localStorage.removeItem('token');
        set({
          user: null,
          workspace: null,
          workspaces: [],
          isAuthenticated: false,
        });
      }
    },

    switchWorkspace: (workspaceId: string) => {
      set((state) => ({
        workspace: state.workspaces.find((w) => w.id === workspaceId) || null,
      }));
    },

    clearError: () => set({ error: null }),
  }),
);

