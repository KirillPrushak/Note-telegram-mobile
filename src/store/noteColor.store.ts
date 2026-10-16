import { create } from "zustand";
import { persist } from "zustand/middleware";
import { persistStorage } from "@/lib/persistStorage";

interface NoteColorsStore {
  noteColors: Record<string, string>;
  setNoteColor: (noteId: string, color: string) => void;
  removeNoteColor: (noteId: string) => void;
  removeMultipleNoteColors: (noteIds: string[]) => void;
  clearAllColors: () => void;
  getNoteColor: (noteId: string) => string | undefined;
}

export const useNoteColorsStore = create<NoteColorsStore>()(
    persist(
      (set, get) => ({
        noteColors: {},

        setNoteColor: (noteId, color) =>
          set(
            (state) => ({
              noteColors: {
                ...state.noteColors,
                [noteId]: color,
              },
            })),

        removeNoteColor: (noteId) =>
          set(
            (state) => {
              const newColors = { ...state.noteColors };
              delete newColors[noteId];
              return { noteColors: newColors };
            }),

        removeMultipleNoteColors: (noteIds) =>
          set(
            (state) => {
              const newColors = { ...state.noteColors };
              noteIds.forEach((noteId) => {
                delete newColors[noteId];
              });
              return { noteColors: newColors };
            }),

        clearAllColors: () => set({ noteColors: {} }),

        getNoteColor: (noteId) => get().noteColors[noteId],
      }),
      {
        name: "note-colors-storage",
        storage: persistStorage,
        partialize: (state) => ({
          noteColors: state.noteColors,
        }),
      },
    ),
);
