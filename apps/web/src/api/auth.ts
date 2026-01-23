import api from './client';
// import { User } from '@/stores/authStore';

// We define minimal interfaces for API responses.
// Note: Backend user object might be simpler than Frontend Store User object.
// We will need to map them in the store.

interface ApiUser {
  id: string;
  email: string;
  name: string;
  is_email_verified?: boolean;
  created_at?: string;
}

interface LoginResponse {
  message: string;
  token: string;
  expires_at: string;
  user: ApiUser;
}

interface SignupResponse {
  message: string;
  user: ApiUser;
}

interface MeResponse {
  user: ApiUser;
}

export const authApi = {
  login: async (email: string, password: string) => {
    const response = await api.post<LoginResponse>('/auth/login', { email, password });
    return response.data;
  },

  signup: async (name: string, email: string, password: string) => {
    const response = await api.post<SignupResponse>('/auth/signup', { name, email, password });
    return response.data;
  },

  me: async () => {
    const response = await api.get<MeResponse>('/me');
    return response.data;
  }
};
