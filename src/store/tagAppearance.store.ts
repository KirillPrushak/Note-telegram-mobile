import { create } from "zustand";
import { persist } from "zustand/middleware";
import { persistStorage } from "@/lib/persistStorage";

export interface TagAppearance {
  icon?: string;
  color?: string;
  isFavorite?: boolean;
  botVisible?: boolean;
}

interface TagAppearanceStore {
  tagAppearance: Record<string, TagAppearance>;
  setIcon: (tagId: string, icon: string) => void;
  setColor: (tagId: string, color: string) => void;
  toggleFavorite: (tagId: string) => void;
  toggleBotVisible: (tagId: string) => void;
  getAppearance: (tagId: string) => TagAppearance | undefined;
  setAppearance: (tagId: string, appearance: TagAppearance) => void;
  removeAppearance: (tagId: string) => void;
}

const patchAppearance = (
  state: TagAppearanceStore,
  tagId: string,
  patch: Partial<TagAppearance>,
): Pick<TagAppearanceStore, "tagAppearance"> => ({
  tagAppearance: {
    ...state.tagAppearance,
    [tagId]: { ...state.tagAppearance[tagId], ...patch },
  },
});

export const useTagAppearanceStore = create<TagAppearanceStore>()(
    persist(
      (set, get) => ({
        tagAppearance: {},

        // Whole appearance at once, for a freshly created tag.
        setAppearance: (tagId, appearance) =>
          set((state) => patchAppearance(state, tagId, appearance)),

        removeAppearance: (tagId) =>
          set((state) => {
            const next = { ...state.tagAppearance };
            delete next[tagId];
            return { tagAppearance: next };
          }),

        setIcon: (tagId, icon) =>
          set((state) => patchAppearance(state, tagId, { icon })),

        setColor: (tagId, color) =>
          set((state) => patchAppearance(state, tagId, { color })),

        toggleFavorite: (tagId) =>
          set(
            (state) =>
              patchAppearance(state, tagId, {
                isFavorite: !state.tagAppearance[tagId]?.isFavorite,
              })),

        toggleBotVisible: (tagId) =>
          set(
            (state) =>
              patchAppearance(state, tagId, {
                botVisible: !(state.tagAppearance[tagId]?.botVisible ?? true),
              })),

        getAppearance: (tagId) => get().tagAppearance[tagId],
      }),
      {
        name: "tag-appearance-storage",
        storage: persistStorage,
        partialize: (state) => ({ tagAppearance: state.tagAppearance }),
      },
    ),
);
