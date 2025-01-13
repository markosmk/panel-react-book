import { create } from 'zustand';
import { queryClient } from '@/providers';
import { authClient } from '@/services/auth';
import { tokenClient } from '@/services/token';

import { User } from '@/types/app.types';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isClosing: boolean;
  loginAction: (user: User, token?: string) => void;
  logoutAction: () => Promise<void>;
  checkLogin: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  isClosing: false,

  loginAction: (user, token) => {
    queryClient.clear();
    if (token) {
      tokenClient.setToken(token);
    }
    set({
      user,
      isAuthenticated: true
    });
  },

  logoutAction: async () => {
    set({ isClosing: true });
    await authClient.logout();
    tokenClient.removeToken();
    queryClient.clear();
    set({
      user: null,
      isAuthenticated: false,
      isClosing: false
    });
  },

  checkLogin: async () => {
    set({ isLoading: true });
    try {
      const response = await authClient.getUser();
      set({
        user: response || null,
        isAuthenticated: !!response
      });
    } catch (error) {
      set({
        user: null,
        isAuthenticated: false
      });
    } finally {
      set({ isLoading: false });
    }
  }
}));
