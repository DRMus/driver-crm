import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface OfflineState {
  isOnline: boolean;
  lastSyncTime: Date | null;
  pendingMutationsCount: number;
  setIsOnline: (isOnline: boolean) => void;
  setLastSyncTime: (time: Date | null) => void;
  setPendingMutationsCount: (count: number) => void;
}

export const useOfflineStore = create<OfflineState>()(
  persist(
    (set) => ({
      isOnline: navigator.onLine,
      lastSyncTime: null,
      pendingMutationsCount: 0,
      setIsOnline: (isOnline) => set({ isOnline }),
      setLastSyncTime: (time) => set({ lastSyncTime: time }),
      setPendingMutationsCount: (count) => set({ pendingMutationsCount: count }),
    }),
    {
      name: 'offline-storage',
    },
  ),
);

