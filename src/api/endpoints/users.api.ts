import type {
  CreateUserDto,
  UpdateUserDto,
  User,
} from "@/types/users.interface";
import type { ApiResponse } from "../types.interface";
import { apiClient } from "../client";

export const usersApi = {
  getUsers: (limit: number = 10) => {
    return apiClient.get<ApiResponse<User[]>>(`/telegram-users?limit=${limit}`);
  },

  getUserById: (id: string) => {
    return apiClient.get<ApiResponse<User>>(`/telegram-users/${id}`);
  },

  createUser: (data: CreateUserDto) => {
    return apiClient.post<ApiResponse<User>>("/telegram-users", data);
  },

  updateUser: (id: string, data: UpdateUserDto) => {
    return apiClient.patch<ApiResponse<User>>(`/telegram-users/${id}`, data);
  },

  deleteUser: (id: string) => {
    return apiClient.delete<ApiResponse<void>>(`/telegram-users/${id}`);
  },
};
