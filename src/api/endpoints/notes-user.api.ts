import type {
  CreateNoteDto,
  Note,
  UpdateNoteDto,
} from "@/types/note.interface";
import { apiClient } from "../client";
import { getCurrentUserId } from "@/utils/user";
import type { ApiResponse, PaginatedResponse } from "../types.interface";

export const notesUserApi = {
  getNotesUser: (limit: number = 10, currentPage: number = 1) => {
    const userId = getCurrentUserId();

    return apiClient.get<PaginatedResponse<Note>>(
      `/notes?user_id=${userId}&limit=${limit}&currentPage=${currentPage}`,
    );
  },

  getNoteUserById: (id: number) => {
    return apiClient.get<ApiResponse<Note>>(`/notes/${id}`);
  },

  createNote: (data: CreateNoteDto) => {
    return apiClient.post<ApiResponse<Note>>("/notes", {
      message: data.message,
      tag_id: data.tag_id,
    });
  },

  updateNote: (id: number, data: UpdateNoteDto) => {
    const updateData = {
      message: data.message.trim(),
      tag_id: data.tag_id,
    };

    return apiClient.patch<ApiResponse<Note>>(`/notes/${id}`, updateData);
  },

  deleteNote: (id: number) => {
    return apiClient.delete<ApiResponse<void>>(`/notes/${id}`);
  },
};
