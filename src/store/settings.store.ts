import { create } from "zustand";
import { persist } from "zustand/middleware";

import { STORAGE_KEYS } from "@/constants/storage";
import { persistStorage } from "@/lib/persistStorage";

export type ThemeMode = "light" | "dark";

interface SettingsStore {
  // null until the user picks a theme: the app follows the OS until then.
  theme: ThemeMode | null;
  setTheme: (theme: ThemeMode) => void;
}

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set) => ({
      theme: null,
      setTheme: (theme) => set({ theme }),
    }),
    {
      name: STORAGE_KEYS.SETTINGS,
      storage: persistStorage,
      // Hydrated by the root layout during the splash screen, so the saved
      // theme is applied before the first frame.
      skipHydration: true,
    },
  ),
);
