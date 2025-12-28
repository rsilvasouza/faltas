import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import * as SecureStore from 'expo-secure-store';

const secureStorage = {
  getItem: (name: string) => SecureStore.getItem(name),
  setItem: (name: string, value: string) => SecureStore.setItem(name, value),
  removeItem: (name: string) => SecureStore.deleteItemAsync(name),
};

type AuthState = {
  token: string | null;
  setToken: (token: string | null) => void;
};

export const useAuth = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      setToken: (token) => set({ token }),
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => secureStorage),
    }
  )
);