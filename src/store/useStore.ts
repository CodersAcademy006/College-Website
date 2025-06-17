import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  id: string;
  email: string;
  role: 'admin' | 'teacher' | 'student';
  name: string;
}

interface UIState {
  sidebarOpen: boolean;
  darkMode: boolean;
  notifications: number;
  setSidebarOpen: (open: boolean) => void;
  toggleDarkMode: () => void;
  setNotifications: (count: number) => void;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (user: User, token: string) => void;
  logout: () => void;
}

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      sidebarOpen: true,
      darkMode: false,
      notifications: 0,
      setSidebarOpen: (open) => set({ sidebarOpen: open }),
      toggleDarkMode: () => set((state) => ({ darkMode: !state.darkMode })),
      setNotifications: (count) => set({ notifications: count }),
    }),
    {
      name: 'ui-storage',
    }
  )
);

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      login: (user, token) => set({ user, token, isAuthenticated: true }),
      logout: () => set({ user: null, token: null, isAuthenticated: false }),
    }),
    {
      name: 'auth-storage',
    }
  )
); 