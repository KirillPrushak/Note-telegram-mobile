import { create } from "zustand";
import { usersApi } from "@/api";
import type {
  CreateUserDto,
  User,
} from "@/types/users.interface";
import type { StoreActions, StoreState } from "./store.interface";

interface UsersStore extends StoreState, StoreActions {
  users: User[];
  selectedUser: User | null;

  fetchUsers: (limit?: number) => Promise<void>;
  fetchUserById: (id: string) => Promise<User | null>;
  createUser: (data: CreateUserDto) => Promise<void>;

}

export const useUsersStore = create<UsersStore>()(
    (set) => ({
      users: [],
      selectedUser: null,
      isLoading: false,
      error: null,

      fetchUsers: async (limit = 10) => {
        set({ isLoading: true, error: null });
        try {
          const response = await usersApi.getUsers(limit);
          set(
            { users: response.data.data, isLoading: false });
        } catch (error) {
          set(
            {
              error:
                error instanceof Error
                  ? error.message
                  : "Failed to fetch users",
              isLoading: false,
            });
        }
      },

      fetchUserById: async (id: string) => {
        set({ isLoading: true, error: null });
        try {
          const response = await usersApi.getUserById(id);
          const user = response.data.data;
          set(
            { selectedUser: user, isLoading: false });
          return user;
        } catch (error) {
          set(
            {
              error:
                error instanceof Error ? error.message : "Failed to fetch user",
              isLoading: false,
            });
          return null;
        }
      },

      createUser: async (data: CreateUserDto) => {
        set({ isLoading: true, error: null });
        try {
          const response = await usersApi.createUser(data);
          const newUser = response.data.data;
          set(
            (state) => ({
              users: [newUser, ...state.users],
              isLoading: false,
            }));
        } catch (error) {
          set(
            {
              error:
                error instanceof Error
                  ? error.message
                  : "Failed to create user",
              isLoading: false,
            });
        }
      },

      clearError: () => set({ error: null }),
    }),
);
