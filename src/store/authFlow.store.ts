import { create } from "zustand";
import { persist } from "zustand/middleware";

import { RECENT_USE_TTL_MS, REQUEST_TTL_MS } from "@/constants/auth";
import { STORAGE_KEYS } from "@/constants/storage";
import { persistStorage } from "@/lib/persistStorage";

type TimestampMap = Record<string, number>;

// Mobile port of web `utils/requestedIds.ts`: remembers which Telegram ids
// already have a code waiting (so reopening the app returns to the code
// step) and which ids were just used to sign in.
interface AuthFlowStore {
  pendingUserId: string | null;
  requestedAt: TimestampMap;
  usedAt: TimestampMap;

  markRequested: (userId: string) => void;
  markUsed: (userId: string) => void;
  clearPending: () => void;
  isRequested: (userId: string) => boolean;
  wasRecentlyUsed: (userId: string) => boolean;
}

const isFresh = (map: TimestampMap, id: string, ttlMs: number) => {
  const timestamp = map[id];
  return timestamp !== undefined && Date.now() - timestamp < ttlMs;
};

const without = (map: TimestampMap, id: string) => {
  const next = { ...map };
  delete next[id];
  return next;
};

export const useAuthFlowStore = create<AuthFlowStore>()(
  persist(
    (set, get) => ({
      pendingUserId: null,
      requestedAt: {},
      usedAt: {},

      markRequested: (userId) =>
        set((state) => ({
          pendingUserId: userId,
          requestedAt: { ...state.requestedAt, [userId]: Date.now() },
        })),

      markUsed: (userId) =>
        set((state) => ({
          pendingUserId: null,
          requestedAt: without(state.requestedAt, userId),
          usedAt: { ...state.usedAt, [userId]: Date.now() },
        })),

      clearPending: () =>
        set((state) => ({
          pendingUserId: null,
          requestedAt: state.pendingUserId
            ? without(state.requestedAt, state.pendingUserId)
            : state.requestedAt,
        })),

      isRequested: (userId) => isFresh(get().requestedAt, userId, REQUEST_TTL_MS),
      wasRecentlyUsed: (userId) => isFresh(get().usedAt, userId, RECENT_USE_TTL_MS),
    }),
    {
      name: STORAGE_KEYS.AUTH_FLOW,
      storage: persistStorage,
      // Hydrated explicitly by useAuthStore.hydrate during the splash screen.
      skipHydration: true,
    },
  ),
);
