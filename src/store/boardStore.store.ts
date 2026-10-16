import { create } from "zustand";

import type {
  CreateNoteDto,
  Note,
  UpdateNoteDto,
} from "@/types/note.interface";
import type { CreateTagDto, Tag, UpdateTagDto } from "@/types/tags.interface";
import { notesUserApi, tagsApi } from "@/api";

interface BoardStore {
  notes: Note[];
  tags: Tag[];
  isLoading: boolean;
  error: string | null;

  // Tags pagination (kanban columns)
  currentPage: number;
  totalPages: number;
  totalItems: number;
  limit: number;

  fetchNotes: (limit?: number) => Promise<void>;
  fetchNoteById: (id: number) => Promise<Note | null>;
  createNote: (data: CreateNoteDto) => Promise<void>;
  deleteNote: (id: number) => Promise<void>;
  updateNote: (id: number, data: UpdateNoteDto) => Promise<void>;
  moveNoteLocal: (id: number, tagId: number) => void;

  fetchTags: (currentPage?: number, limit?: number) => Promise<void>;
  createTag: (data: CreateTagDto) => Promise<void>;
  deleteTag: (id: number) => Promise<void>;
  updateTag: (id: number, data: UpdateTagDto) => Promise<void>;
  setPage: (page: number) => void;

  clearError: () => void;
}

const DEFAULT_TAGS_LIMIT = 100;

export const useBoardStore = create<BoardStore>()((set, get) => ({
    notes: [],
    tags: [],
    isLoading: false,
    error: null,
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    limit: DEFAULT_TAGS_LIMIT,

    fetchNotes: async (limit = 100) => {
      set({ isLoading: true, error: null });
      try {
        const response = await notesUserApi.getNotesUser(limit);
        const notes = response.data.data;

        // Full tag list, used only to resolve each note's tag_id — kept
        // separate from the paginated `tags` state that drives which
        // columns the board renders (see fetchTags).
        const tagsResponse = await tagsApi.getTags(100);
        const tags = tagsResponse.data.data;

        const notesWithTagId = notes.map((note) => {
          const foundTag = tags.find((tag) => tag.name === note.tag);
          return {
            ...note,
            tag_id: foundTag?.id || 0,
          };
        });

        set(
          { notes: notesWithTagId, isLoading: false });
      } catch (error) {
        console.error("board/fetchNotes error:", error);
        set(
          {
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

        const foundTag = tags.find((tag) => tag.name === note.tag);
        const noteWithTagId = {
          ...note,
          tag_id: foundTag?.id || 0,
        };

        set({ isLoading: false });
        return noteWithTagId;
      } catch (error) {
        console.error("board/fetchNoteById error:", error);
        set(
          {
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

        const { tags } = get();

        const foundTag = tags.find((tag) => tag.id === data.tag_id);
        const newNoteWithTag = {
          ...newNote,
          tag: foundTag?.name || newNote.tag || "",
          tag_id: data.tag_id || foundTag?.id || 0,
        };

        set(
          (state) => ({
            notes: [newNoteWithTag, ...state.notes],
            isLoading: false,
          }));
      } catch (error) {
        console.error("board/createNote error:", error);
        set(
          {
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

        const { tags } = get();

        set(
          (state) => ({
            notes: state.notes.map((note) => {
              if (note.id === id) {
                const updatedNoteWithTag = { ...updatedNote };

                if (data.tag_id) {
                  const foundTag = tags.find((tag) => tag.id === data.tag_id);
                  updatedNoteWithTag.tag =
                    foundTag?.name || updatedNote.tag || "";
                  updatedNoteWithTag.tag_id = data.tag_id;
                }

                if (data.message) {
                  updatedNoteWithTag.message = data.message;
                }

                return updatedNoteWithTag;
              }
              return note;
            }),
            isLoading: false,
          }));
      } catch (error) {
        console.error("board/updateNote error:", error);
        set(
          {
            error:
              error instanceof Error ? error.message : "Failed to update note",
            isLoading: false,
          });
        throw error;
      }
    },

    moveNoteLocal: (id: number, tagId: number) => {
      const { tags, notes: currentNotes } = get();
      const foundTag = tags.find((tag) => tag.id === tagId);
      const noteExists = currentNotes.some((note) => note.id === id);

      if (!noteExists) {
        return;
      }

      set(
        (state) => {
          const updatedNotes = state.notes.map((note) =>
            note.id === id
              ? { ...note, tag_id: tagId, tag: foundTag?.name ?? note.tag }
              : note,
          );

          return { notes: updatedNotes };
        });
    },

    deleteNote: async (id: number) => {
      set({ isLoading: true, error: null });
      try {
        await notesUserApi.deleteNote(id);
        set(
          (state) => ({
            notes: state.notes.filter((note) => note.id !== id),
            isLoading: false,
          }));
      } catch (error) {
        console.error("board/deleteNote error:", error);
        set(
          {
            error:
              error instanceof Error ? error.message : "Failed to delete note",
            isLoading: false,
          });
      }
    },

    fetchTags: async (currentPage = 1, limit = DEFAULT_TAGS_LIMIT) => {
      set({ isLoading: true, error: null });
      try {
        const response = await tagsApi.getTags(limit, currentPage);
        const { data: tags, meta } = response.data;
        set(
          {
            tags,
            currentPage,
            totalPages:
              meta?.totalPages || Math.ceil((meta?.total || 0) / limit) || 1,
            totalItems: meta?.total || 0,
            limit,
            isLoading: false,
          });
      } catch (error) {
        set(
          {
            error:
              error instanceof Error ? error.message : "Failed to fetch tags",
            isLoading: false,
            currentPage,
            limit,
          });
      }
    },

    setPage: (page: number) => {
      const { limit } = get();
      get().fetchTags(page, limit);
    },

    createTag: async (data: CreateTagDto) => {
      set({ isLoading: true, error: null });
      try {
        const response = await tagsApi.createTag(data);
        const newTag = response.data.data;
        set(
          (state) => ({
            tags: [...state.tags, newTag],
            isLoading: false,
          }));
      } catch (error) {
        console.error("board/createTag error:", error);
        set(
          {
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
        const updatedTag = response.data.data;
        set(
          (state) => ({
            tags: state.tags.map((tag) => (tag.id === id ? updatedTag : tag)),
            isLoading: false,
          }));
      } catch (error) {
        console.error("board/updateTag error:", error);
        set(
          {
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

        const { tags, currentPage, limit } = get();
        const remainingOnPage = tags.filter((tag) => tag.id !== id).length;

        if (remainingOnPage === 0 && currentPage > 1) {
          await get().fetchTags(currentPage - 1, limit);
        } else {
          await get().fetchTags(currentPage, limit);
        }

        set(
          (state) => ({
            notes: state.notes.filter((note) => note.tag_id !== id),
          }));
      } catch (error) {
        console.error("board/deleteTag error:", error);
        set(
          {
            error:
              error instanceof Error ? error.message : "Failed to delete tag",
            isLoading: false,
          });
      }
    },

    clearError: () => set({ error: null }),
  }),
);
