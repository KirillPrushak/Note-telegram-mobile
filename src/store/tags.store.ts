import { create } from "zustand";
import { tagsApi } from "@/api";
import type { CreateTagDto, Tag, UpdateTagDto } from "@/types/tags.interface";
import type { StoreActions, StoreState } from "./store.interface";
import { CURRENT_PAGE_TAGS, LIMIT_TAGS } from "@/constants/tags";

interface TagsStore extends StoreState, StoreActions {
  tags: Tag[];

  // Pagination
  currentPage: number;
  totalPages: number;
  totalItems: number;
  limit: number;

  fetchTags: (currentPage?: number, limit?: number) => Promise<void>;
  fetchTagById: (id: number) => Promise<Tag | null>;
  createTag: (data: CreateTagDto) => Promise<Tag | undefined>;
  updateTag: (id: number, data: UpdateTagDto) => Promise<void>;
  deleteTag: (id: number) => Promise<void>;

  // Navigation
  setPage: (currentPage: number) => void;
  setLimit: (limit: number) => void;
}

export const useTagsStore = create<TagsStore>()(
    (set, get) => ({
      tags: [],
      isLoading: false,
      error: null,
      currentPage: CURRENT_PAGE_TAGS,
      totalPages: 1,
      totalItems: 0,
      limit: LIMIT_TAGS,

      fetchTags: async (
        currentPage = CURRENT_PAGE_TAGS,
        limit = LIMIT_TAGS,
      ) => {
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
            });
        }
      },

      fetchTagById: async (id: number) => {
        set({ isLoading: true, error: null });
        try {
          const response = await tagsApi.getTagById(id);
          const tag = response.data.data;
          set({ isLoading: false });
          return tag;
        } catch (error) {
          set(
            {
              error:
                error instanceof Error ? error.message : "Failed to fetch tag",
              isLoading: false,
            });
          return null;
        }
      },

      createTag: async (data: CreateTagDto) => {
        set({ isLoading: true, error: null });
        try {
          const response = await tagsApi.createTag(data);
          const newTag = response.data.data;
          set(
            (state) => ({
              tags: [newTag, ...state.tags],
              isLoading: false,
            }));
          return newTag;
        } catch (error) {
          set(
            {
              error:
                error instanceof Error ? error.message : "Failed to create tag",
              isLoading: false,
            });
          return undefined;
        }
      },

      updateTag: async (id: number, data: UpdateTagDto) => {
        set({ isLoading: true, error: null });
        try {
          const response = await tagsApi.updateTag(id, data);
          const updatedTag = response.data.data;
          set(
            (state) => ({
              tags: state.tags.map((tag) =>
                tag.id === updatedTag.id ? updatedTag : tag,
              ),
              isLoading: false,
            }));
        } catch (error) {
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
          set(
            (state) => ({
              tags: state.tags.filter((tag) => tag.id !== id),
              isLoading: false,
            }));
        } catch (error) {
          set(
            {
              error:
                error instanceof Error ? error.message : "Failed to delete tag",
              isLoading: false,
            });
        }
      },

      setPage: (page: number) => {
        const { limit } = get();
        get().fetchTags(page, limit);
      },

      setLimit: (limit: number) => {
        get().fetchTags(CURRENT_PAGE_TAGS, limit);
      },

      clearError: () => set({ error: null }),
    }),
);
