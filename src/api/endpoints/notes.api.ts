import type {
  CreateNoteDto,
  Note,
  UpdateNoteDto,
} from "@/types/note.interface";
import { apiClient } from "../client";
import type { PaginatedResponse } from "../types.interface";

export const notesApi = {
  getNotes: (page: number = 1, limit: number = 10) => {
    return apiClient.get<PaginatedResponse<Note>>(
      `/notes?page=${page}&limit=${limit}`,
    );
  },

  getNoteById: (id: string) => {
    return apiClient.get<Note>(`/notes/${id}`);
  },

  createNote: (data: CreateNoteDto) => {
    return apiClient.post<Note>("/notes", data);
  },

  updateNote: (id: string, data: UpdateNoteDto) => {
    return apiClient.patch<Note>(`/notes/${id}`, data);
  },

  deleteNote: (id: string) => {
    return apiClient.delete<void>(`/notes/${id}`);
  },
};
