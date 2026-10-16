import { create } from "zustand";

import { apiClient } from "@/api";
import { authStorage } from "@/lib/authStorage";
import type { TokenData } from "@/types/token.interface";
import { isTokenValid } from "@/utils/token";
import { useAuthFlowStore } from "./authFlow.store";
import { useBoardStore } from "./boardStore.store";
import { useCurrentUser } from "./currentUser.store";
import { useNotesStore } from "./notes.store";
import { useTagsStore } from "./tags.store";

// Reactive "is signed in" flag for the route guards in the root layout.
// The token itself lives in `authStorage`; this only mirrors its validity.
interface AuthStore {
  isReady: boolean;
  isLoggedIn: boolean;

  hydrate: () => Promise<void>;
  signIn: (tokenData: TokenData) => Promise<void>;
  signOut: () => Promise<void>;
}

// Drop the previous account's data so the next sign-in starts clean.
const resetUserData = () => {
  useBoardStore.setState({ notes: [], tags: [], error: null });
  useNotesStore.setState({
    notes: [],
    tags: [],
    error: null,
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
  });
  useTagsStore.setState({ tags: [], error: null });
  useCurrentUser.getState().clearUser();
};

export const useAuthStore = create<AuthStore>()((set) => ({
  isReady: false,
  isLoggedIn: false,

  hydrate: async () => {
    try {
      // The auth screen reads the pending-code state synchronously on
      // mount, so it must be loaded before the splash screen goes away.
      await Promise.all([authStorage.hydrate(), useAuthFlowStore.persist.rehydrate()]);
      if (authStorage.getToken() && !isTokenValid()) {
        await authStorage.clear();
      }
    } catch (error) {
      console.error("auth/hydrate error:", error);
    }
    set({ isReady: true, isLoggedIn: isTokenValid() });
  },

  signIn: async (tokenData) => {
    await authStorage.setAuth(tokenData);
    set({ isLoggedIn: isTokenValid() });
  },

  signOut: async () => {
    await authStorage.clear();
    resetUserData();
    set({ isLoggedIn: false });
  },
}));

// Any 401 from the API (expired/revoked token) signs the user out, which
// flips the route guard back to the auth screen.
apiClient.setUnauthorizedHandler(() => {
  void useAuthStore.getState().signOut();
});
