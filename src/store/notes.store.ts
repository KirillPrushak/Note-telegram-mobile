import { create } from "zustand";

import type {
  CreateNoteDto,
  Note,
  UpdateNoteDto,
} from "@/types/note.interface";
import type { CreateTagDto, Tag, UpdateTagDto } from "@/types/tags.interface";
import { notesUserApi, tagsApi } from "@/api";
import { LIMIT_NOTES } from "@/constants/notes";
import { useTagsStore } from "./tags.store";

interface NoteUserStore {
  // State
  notes: Note[];
  tags: Tag[];
  isLoading: boolean;
  error: string | null;

  // Pagination
  currentPage: number;
  totalPages: number;
  totalItems: number;
  limit: number;

  // Infinite scroll (mobile): next page is appended to `notes`
  isLoadingMore: boolean;
  fetchNextPage: () => Promise<void>;

  // Notes
  fetchNotes: (page?: number, limit?: number) => Promise<void>;
  fetchNoteById: (id: number) => Promise<Note | null>;
  createNote: (data: CreateNoteDto) => Promise<void>;
  updateNote: (id: number, data: UpdateNoteDto) => Promise<void>;
  deleteNote: (id: number) => Promise<void>;
  deleteNotes: (ids: number[]) => Promise<void>;

  // Tags
  fetchTags: (limit?: number) => Promise<void>;
  createTag: (data: CreateTagDto) => Promise<void>;
  deleteTag: (id: number) => Promise<void>;
  updateTag: (id: number, data: UpdateTagDto) => Promise<void>;

  // Navigation
  setPage: (currentPage: number) => void;
  setLimit: (limit: number) => void;

  // Utils
  clearError: () => void;
}

const DEFAULT_LIMIT = LIMIT_NOTES;

export const useNotesStore = create<NoteUserStore>()(
    (set, get) => ({
      // ========== INITIAL STATE ==========
      notes: [],
      tags: [],
      isLoading: false,
      error: null,
      currentPage: 1,
      totalPages: 1,
      totalItems: 0,
      limit: DEFAULT_LIMIT,
      isLoadingMore: false,

      // ========== INFINITE SCROLL ==========
      fetchNextPage: async () => {
        const { currentPage, totalPages, limit, isLoading, isLoadingMore } = get();
        if (isLoading || isLoadingMore || currentPage >= totalPages) return;

        // The tags tab keeps the freshest tag list (renames, new tags).
        const sharedTags = useTagsStore.getState().tags;
        const tags = sharedTags.length > 0 ? sharedTags : get().tags;

        set({ isLoadingMore: true });
        try {
          const nextPage = currentPage + 1;
          const response = await notesUserApi.getNotesUser(limit, nextPage);
          const { data: pageNotes, meta } = response.data;

          const mapped = pageNotes.map((note) => ({
            ...note,
            tag_id: tags.find((tag) => tag.name === note.tag)?.id || 0,
          }));

          set((state) => {
            // A note created meanwhile shifts the pages by one, so the new
            // page can repeat the last item of the previous one.
            const loadedIds = new Set(state.notes.map((note) => note.id));
            return {
              notes: [...state.notes, ...mapped.filter((note) => !loadedIds.has(note.id))],
              currentPage: nextPage,
              totalPages: meta?.totalPages || Math.ceil((meta?.total || 0) / limit) || 1,
              totalItems: meta?.total || state.totalItems,
              isLoadingMore: false,
            };
          });
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : "Failed to fetch notes",
            isLoadingMore: false,
          });
        }
      },

      // ========== NOTES ==========
      fetchNotes: async (currentPage = 1, limit = DEFAULT_LIMIT) => {
        set({ isLoading: true, error: null });

        try {
          const response = await notesUserApi.getNotesUser(limit, currentPage);

          const { data: allNotes, meta } = response.data;

          let tags = get().tags;
          // Page 1 = a fresh start (pull-to-refresh, after create): reload
          // tags too, so new or renamed tags resolve.
          if (tags.length === 0 || currentPage === 1) {
            const tagsResponse = await tagsApi.getTags(100);
            tags = tagsResponse.data.data || [];
            set({ tags });
          }

          // Map tag_id
          const notesWithTagId = allNotes.map((note) => ({
            ...note,
            tag_id: tags.find((tag) => tag.name === note.tag)?.id || 0,
          }));

          set({
            notes: notesWithTagId,
            currentPage: currentPage,
            totalPages:
              meta?.totalPages || Math.ceil((meta?.total || 0) / limit) || 1,
            totalItems: meta?.total || 0,
            limit,
            isLoading: false,
            error: null,
          });
        } catch (error) {
          set({
            error:
              error instanceof Error ? error.message : "Failed to fetch notes",
            isLoading: false,
          });
        }
      },

      fetchNoteById: async (id: number) => {
        set({ isLoading: true, error: null });

        try {
          const response = await notesUserApi.getNoteUserById(id);
          const note = response.data.data;
          const { tags } = get();

          const noteWithTagId = {
            ...note,
            tag_id: tags.find((tag) => tag.name === note.tag)?.id || 0,
          };

          set({ isLoading: false });
          return noteWithTagId;
        } catch (error) {
          set({
            error:
              error instanceof Error ? error.message : "Failed to fetch note",
            isLoading: false,
          });
          return null;
        }
      },

      createNote: async (data: CreateNoteDto) => {
        set({ isLoading: true, error: null });

        try {
          const response = await notesUserApi.createNote(data);
          const newNote = response.data.data;
          const { tags, currentPage, limit } = get();

          const foundTag = tags.find((tag) => tag.id === data.tag_id);
          const newNoteWithTag = {
            ...newNote,
            tag: foundTag?.name || newNote.tag || "",
            tag_id: data.tag_id || foundTag?.id || 0,
          };

          set((state) => ({
            notes: [newNoteWithTag, ...state.notes],
            isLoading: false,
          }));

          await get().fetchNotes(currentPage, limit);
        } catch (error) {
          set({
            error:
              error instanceof Error ? error.message : "Failed to create note",
            isLoading: false,
          });
        }
      },

      updateNote: async (id: number, data: UpdateNoteDto) => {
        set({ isLoading: true, error: null });

        try {
          const response = await notesUserApi.updateNote(id, data);
          const updatedNote = response.data.data;
          const { tags, currentPage, limit } = get();

          set((state) => ({
            notes: state.notes.map((note) => {
              if (note.id !== id) return note;

              const updated = { ...updatedNote };
              if (data.tag_id) {
                const foundTag = tags.find((tag) => tag.id === data.tag_id);
                updated.tag = foundTag?.name || updatedNote.tag || "";
                updated.tag_id = data.tag_id;
              }
              if (data.message) {
                updated.message = data.message;
              }
              return updated;
            }),
            isLoading: false,
          }));

          await get().fetchNotes(currentPage, limit);
        } catch (error) {
          set({
            error:
              error instanceof Error ? error.message : "Failed to update note",
            isLoading: false,
          });
          throw error;
        }
      },

      deleteNote: async (id: number) => {
        set({ isLoading: true, error: null });

        try {
          await notesUserApi.deleteNote(id);

          const { currentPage, limit } = get();

          set((state) => ({
            notes: state.notes.filter((note) => note.id !== id),
            isLoading: false,
          }));

          const newNotes = get().notes;
          if (newNotes.length === 0 && currentPage > 1) {
            await get().fetchNotes(currentPage - 1, limit);
          } else {
            await get().fetchNotes(currentPage, limit);
          }
        } catch (error) {
          set({
            error:
              error instanceof Error ? error.message : "Failed to delete note",
            isLoading: false,
          });
        }
      },

      deleteNotes: async (ids: number[]) => {
        set({ isLoading: true, error: null });

        try {
          await Promise.all(ids.map((id) => notesUserApi.deleteNote(id)));

          const { currentPage, limit } = get();

          set((state) => ({
            notes: state.notes.filter((note) => !ids.includes(note.id)),
            isLoading: false,
          }));

          const newNotes = get().notes;
          if (newNotes.length === 0 && currentPage > 1) {
            await get().fetchNotes(currentPage - 1, limit);
          } else {
            await get().fetchNotes(currentPage, limit);
          }
        } catch (error) {
          set({
            error:
              error instanceof Error ? error.message : "Failed to delete notes",
            isLoading: false,
          });
        }
      },

      // ========== TAGS ==========
      fetchTags: async (limit = 100) => {
        set({ isLoading: true, error: null });

        try {
          const response = await tagsApi.getTags(limit);
          set({
            tags: response.data.data || [],
            isLoading: false,
          });
        } catch (error) {
          set({
            error:
              error instanceof Error ? error.message : "Failed to fetch tags",
            isLoading: false,
          });
        }
      },

      createTag: async (data: CreateTagDto) => {
        set({ isLoading: true, error: null });

        try {
          const response = await tagsApi.createTag(data);
          set((state) => ({
            tags: [response.data.data, ...state.tags],
            isLoading: false,
          }));
        } catch (error) {
          set({
            error:
              error instanceof Error ? error.message : "Failed to create tag",
            isLoading: false,
          });
        }
      },

      updateTag: async (id: number, data: UpdateTagDto) => {
        set({ isLoading: true, error: null });

        try {
          const response = await tagsApi.updateTag(id, data);
          set((state) => ({
            tags: state.tags.map((tag) =>
              tag.id === id ? response.data.data : tag,
            ),
            isLoading: false,
          }));
        } catch (error) {
          set({
            error:
              error instanceof Error ? error.message : "Failed to update tag",
            isLoading: false,
          });
        }
      },

      deleteTag: async (id: number) => {
        set({ isLoading: true, error: null });

        try {
          await tagsApi.deleteTag(id);

          set((state) => ({
            tags: state.tags.filter((tag) => tag.id !== id),
            notes: state.notes.filter((note) => note.tag_id !== id),
            isLoading: false,
          }));
        } catch (error) {
          set({
            error:
              error instanceof Error ? error.message : "Failed to delete tag",
            isLoading: false,
          });
        }
      },

      // ========== NAVIGATION ==========
      setPage: (page: number) => {
        const { limit } = get();
        get().fetchNotes(page, limit);
      },

      setLimit: (limit: number) => {
        get().fetchNotes(1, limit);
      },

      // ========== UTILS ==========
      clearError: () => set({ error: null }),
    }),
);
