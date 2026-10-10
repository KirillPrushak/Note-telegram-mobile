import { isAxiosError } from "axios";

// Backend message if there is one, otherwise the given fallback.
export const getApiErrorMessage = (error: unknown, fallback: string): string => {
  if (isAxiosError<{ message?: string }>(error)) {
    if (error.response?.data?.message) return error.response.data.message;
    if (!error.response) return "No connection to the server";
  }
  if (error instanceof Error && error.message) return error.message;
  return fallback;
};
