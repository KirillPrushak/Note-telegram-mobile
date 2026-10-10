import { isAxiosError } from "axios";
import { create } from "zustand";
import type { User, UserInfo } from "@/types/users.interface";
import { getUserInfo, isUserLoggedIn } from "@/utils/user";
import { clearAuthData } from "@/utils/token";
import { usersApi, notesUserApi } from "@/api";

interface CurrentUser {
  user: User | null;
  userInfo: UserInfo | null;
  // The /telegram-users record doesn't always carry a display name — this
  // is filled from the username the backend attaches to each note, used
  // only as a last-resort display name (never written to boardStore).
  fallbackName: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;

  // Actions
  fetchCurrentUser: () => Promise<void>;
  clearUser: () => void;
  logout: () => void;

  // Getters
  getUserName: () => string;
  getUserInitials: () => string;
  getUserEmail: () => string | null;
}

export const useCurrentUser = create<CurrentUser>()(
    (set, get) => ({
      user: null,
      userInfo: null,
      fallbackName: null,
      isLoading: false,
      isAuthenticated: false,
      error: null,

      fetchCurrentUser: async () => {
        if (!isUserLoggedIn()) {
          set({
            user: null,
            userInfo: null,
            fallbackName: null,
            isAuthenticated: false,
            isLoading: false,
          });
          return;
        }

        const userInfo = getUserInfo();
        if (!userInfo?.userId) {
          set({
            isLoading: false,
            isAuthenticated: false,
            user: null,
            userInfo: null,
            fallbackName: null,
          });
          return;
        }

        set({
          userInfo,
          isAuthenticated: true,
          isLoading: true,
          error: null,
        });

        let user: User | null = null;
        try {
          const response = await usersApi.getUserById(String(userInfo.userId));
          user = response.data.data;
        } catch (error) {
          // The backend answers 403 for /telegram-users/{id} with a regular
          // user token. That's expected: the name falls back to the notes'
          // username below, so only unexpected failures are logged.
          if (!isAxiosError(error) || error.response?.status !== 403) {
            console.error("currentUser/fetchCurrentUser error:", error);
            set({
              error:
                error instanceof Error ? error.message : "Failed to fetch user",
            });
          }
        }

        set({ user, isLoading: false });

        if (!user?.name && !user?.username && !userInfo.name) {
          try {
            const notesResponse = await notesUserApi.getNotesUser(1);
            set({ fallbackName: notesResponse.data.data[0]?.username || null });
          } catch (error) {
            console.error(
              "currentUser/fetchCurrentUser fallbackName error:",
              error,
            );
          }
        }
      },

      clearUser: () => {
        set({
          user: null,
          userInfo: null,
          fallbackName: null,
          isAuthenticated: false,
          error: null,
        });
      },

      logout: () => {
        void clearAuthData();
        set({
          user: null,
          userInfo: null,
          fallbackName: null,
          isAuthenticated: false,
          error: null,
        });
      },

      getUserName: () => {
        const { user, userInfo, fallbackName } = get();

        if (user?.name) return user.name;
        if (user?.username) return user.username;
        if (userInfo?.name) return userInfo.name;
        if (fallbackName) return fallbackName;
        if (userInfo?.telegramUserId) return `User ${userInfo.telegramUserId}`;
        if (userInfo?.userId) return `User ${userInfo.userId}`;

        return "User";
      },

      getUserInitials: () => {
        const { user, userInfo, fallbackName } = get();
        const name =
          user?.name || user?.username || userInfo?.name || fallbackName;

        if (name) {
          const parts = name.trim().split(/\s+/);
          if (parts.length >= 2) {
            return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
          }
          return name.slice(0, 2).toUpperCase();
        }

        if (userInfo?.telegramUserId) return "TG";
        return "U";
      },

      getUserEmail: () => {
        const { user, userInfo } = get();
        return user?.email || userInfo?.email || null;
      },
    }),
);
