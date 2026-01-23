import { create } from 'zustand';
import { authApi } from '@/api/auth';

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role: 'owner' | 'admin' | 'member' | 'viewer';
}

export interface Workspace {
  id: string;
  name: string;
  slug: string;
  plan: 'free' | 'pro' | 'enterprise';
  logo?: string;
}

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
  clearError: () => void;
}

const DEFAULT_WORKSPACES: Workspace[] = [
  {
    id: 'ws-1',
    name: 'Default Workspace',
    slug: 'default-workspace',
    plan: 'free',
    logo: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=32&h=32&fit=crop&crop=faces',
  }
];

export const useAuthStore = create<AuthState>()(
  (set, get) => ({
    user: null,
    workspace: null,
    workspaces: [],
    isAuthenticated: false,
    isLoading: false,
    error: null,

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
          workspaces: DEFAULT_WORKSPACES,
          workspace: DEFAULT_WORKSPACES[0],
        });
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
          workspaces: DEFAULT_WORKSPACES,
          workspace: DEFAULT_WORKSPACES[0],
        });
      } catch (error) {
        localStorage.removeItem('token');
        set({
          user: null,
          isAuthenticated: false,
        });
      }
    },

    switchWorkspace: (workspaceId) => {
      const workspace = get().workspaces.find((w) => w.id === workspaceId);
      if (workspace) {
        set({ workspace });
      }
    },

    clearError: () => set({ error: null }),
  })
);
