import { create } from 'zustand';
import { persist } from 'zustand/middleware';

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
  switchWorkspace: (workspaceId: string) => void;
  clearError: () => void;
}

// Mock users database
const mockUsers: Record<string, { password: string; user: User; workspaces: Workspace[] }> = {
  'demo@example.com': {
    password: 'password123',
    user: {
      id: 'user-1',
      email: 'demo@example.com',
      name: 'Demo User',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face',
      role: 'owner',
    },
    workspaces: [
      {
        id: 'ws-1',
        name: 'Acme Studios',
        slug: 'acme-studios',
        plan: 'pro',
        logo: undefined,
      },
      {
        id: 'ws-2',
        name: 'Personal',
        slug: 'personal',
        plan: 'free',
        logo: undefined,
      },
    ],
  },
  'admin@company.com': {
    password: 'admin123',
    user: {
      id: 'user-2',
      email: 'admin@company.com',
      name: 'Admin User',
      role: 'admin',
    },
    workspaces: [
      {
        id: 'ws-3',
        name: 'Enterprise Corp',
        slug: 'enterprise-corp',
        plan: 'enterprise',
      },
    ],
  },
};

// Simulate network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      workspace: null,
      workspaces: [],
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async (email: string, password: string) => {
        set({ isLoading: true, error: null });

        await delay(800); // Simulate network request

        const mockUser = mockUsers[email.toLowerCase()];

        if (!mockUser || mockUser.password !== password) {
          set({
            isLoading: false,
            error: 'Invalid email or password'
          });
          throw new Error('Invalid email or password');
        }

        set({
          user: mockUser.user,
          workspace: mockUser.workspaces[0],
          workspaces: mockUser.workspaces,
          isAuthenticated: true,
          isLoading: false,
          error: null,
        });
      },

      signup: async (name: string, email: string, password: string) => {
        set({ isLoading: true, error: null });

        await delay(1000); // Simulate network request

        // Check if user already exists
        if (mockUsers[email.toLowerCase()]) {
          set({
            isLoading: false,
            error: 'An account with this email already exists'
          });
          throw new Error('An account with this email already exists');
        }

        // Create new user
        const newUser: User = {
          id: `user-${Date.now()}`,
          email: email.toLowerCase(),
          name,
          role: 'owner',
        };

        const newWorkspace: Workspace = {
          id: `ws-${Date.now()}`,
          name: `${name}'s Workspace`,
          slug: name.toLowerCase().replace(/\s+/g, '-'),
          plan: 'free',
        };

        // Add to mock database (won't persist on refresh, but works for session)
        mockUsers[email.toLowerCase()] = {
          password,
          user: newUser,
          workspaces: [newWorkspace],
        };

        set({
          user: newUser,
          workspace: newWorkspace,
          workspaces: [newWorkspace],
          isAuthenticated: true,
          isLoading: false,
          error: null,
        });
      },

      logout: () => {
        set({
          user: null,
          workspace: null,
          workspaces: [],
          isAuthenticated: false,
          error: null,
        });
      },

      switchWorkspace: (workspaceId: string) => {
        const { workspaces } = get();
        const workspace = workspaces.find(w => w.id === workspaceId);
        if (workspace) {
          set({ workspace });
        }
      },

      clearError: () => {
        set({ error: null });
      },
    }),
    {
      name: 'motion-atlas-auth',
      partialize: (state) => ({
        user: state.user,
        workspace: state.workspace,
        workspaces: state.workspaces,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
