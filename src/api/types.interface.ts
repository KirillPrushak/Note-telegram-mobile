export interface ApiResponse<T = unknown> {
  data: T;
  message?: string;
  status?: number;
  success?: boolean;
  token_type?: string;
  expires_in?: number;
  token?: string;
  telegramLink?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  status: string;
  meta: {
    currentPage: number;
    limit: number;
    total: number;
    totalPages?: number;
  };
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}
