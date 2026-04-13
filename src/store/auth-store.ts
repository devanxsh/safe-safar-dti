import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { auth } from '@devvai/devv-code-backend';

interface User {
  projectId: string;
  uid: string;
  name: string;
  email: string;
  createdTime: number;
  lastLoginTime: number;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  // Actions
  sendOTP: (email: string) => Promise<void>;
  verifyOTP: (email: string, code: string) => Promise<void>;
  logout: () => Promise<void>;
  checkAuthStatus: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,

      sendOTP: async (email: string) => {
        set({ isLoading: true });
        try {
          await auth.sendOTP(email);
        } catch (error) {
          console.error('Failed to send OTP:', error);
          throw error;
        } finally {
          set({ isLoading: false });
        }
      },

      verifyOTP: async (email: string, code: string) => {
        set({ isLoading: true });
        try {
          const response = await auth.verifyOTP(email, code);
          set({
            user: response.user,
            isAuthenticated: true,
            isLoading: false
          });
        } catch (error) {
          console.error('Failed to verify OTP:', error);
          set({ isLoading: false });
          throw error;
        }
      },

      logout: async () => {
        try {
          await auth.logout();
          set({ user: null, isAuthenticated: false });
        } catch (error) {
          console.error('Logout failed:', error);
          // Still clear local state even if API call fails
          set({ user: null, isAuthenticated: false });
        }
      },

      checkAuthStatus: () => {
        const sid = localStorage.getItem('DEVV_CODE_SID');
        const currentState = get();

        if (sid && currentState.user) {
          set({ isAuthenticated: true });
        } else {
          set({ user: null, isAuthenticated: false });
        }
      },
    }),
    {
      name: 'safesafar-auth',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated
      }),
    }
  )
);