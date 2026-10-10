import type { CreateTagDto, Tag, UpdateTagDto } from "@/types/tags.interface";
import type { ApiResponse, PaginatedResponse } from "../types.interface";
import { apiClient } from "../client";
import { getCurrentUserId } from "@/utils/user";

export const tagsApi = {
  getTags: (limit: number = 100, currentPage: number = 1) => {
    const userId = getCurrentUserId();

    return apiClient.get<PaginatedResponse<Tag>>(
      `/tags?user_id=${userId}&limit=${limit}&currentPage=${currentPage}`,
    );
  },

  getTagById: (id: number) => {
    return apiClient.get<ApiResponse<Tag>>(`/tags/${id}`);
  },

  createTag: (data: CreateTagDto) => {
    return apiClient.post<ApiResponse<Tag>>("/tags", data);
  },

  updateTag: (id: number, data: UpdateTagDto) => {
    return apiClient.patch<ApiResponse<Tag>>(`/tags/${id}`, data);
  },

  deleteTag: (id: number) => {
    return apiClient.delete<ApiResponse<void>>(`/tags/${id}`);
  },
};
