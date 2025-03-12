import { create } from "zustand";
import { persist, PersistStorage } from "zustand/middleware";

interface User {
  id: string;
  name: string;
  role: string;
  email: string;
  token: string;
  refreshToken: string;
}

interface UserStore {
  user: User | null;
  setUser: (user: User) => void;
  clearUser: () => void;
  hasHydrated: boolean;
  setHasHydrated: (hydrated: boolean) => void;
}

// Custom sessionStorage adapter for Zustand
const sessionStoragePersist: PersistStorage<UserStore> = {
  getItem: (key) => {
    const storedValue = sessionStorage.getItem(key);
    return storedValue ? JSON.parse(storedValue) : null;
  },
  setItem: (key, value) => {
    sessionStorage.setItem(key, JSON.stringify(value));
  },
  removeItem: (key) => {
    sessionStorage.removeItem(key);
  },
};

// Zustand store with sessionStorage persistence
export const useUserStore = create<UserStore>()(
  persist(
    (set) => ({
      user: null, // Initial state
      hasHydrated: false,
      setUser: (user) => set({ user }),
      clearUser: () => set({ user: null }),
      setHasHydrated: (hydrated) => set({ hasHydrated: hydrated }),
    }),
    {
      name: "user-storage", // Key for session storage
      storage: sessionStoragePersist, // Use custom session storage adapter
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);
