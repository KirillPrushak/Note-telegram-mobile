import { apiClient } from "../client";
import type { ApiResponse } from "../types.interface";

export interface RequestCodeRequest {
  user_id: string;
}

export interface RequestCodeResponse {
  telegramLink: string;
  expiresIn?: number;
}

export interface VerifyCodeRequest {
  code: string;
  user_id: string;
}

export interface VerifyCodeResponse {
  token: string;
  token_type: string;
  expires_in: number;
}

export const telegramApi = {
  requestCode: (data: RequestCodeRequest) => {
    return apiClient.post<ApiResponse<RequestCodeResponse>>(
      "/auth/telegram/request-code",
      data,
    );
  },

  verifyCode: (data: VerifyCodeRequest) => {
    return apiClient.post<ApiResponse<VerifyCodeResponse>>(
      "/auth/telegram/verify-code",
      data,
    );
  },
};
