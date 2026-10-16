export interface ApiError {
  response?: {
    data?: {
      message?: string;
    };
  };
  message?: string;
}

export interface TokenData {
  token: string;
  token_type: string;
  expires_in: number;
}

export interface TokenPayload {
  sub: number;
  exp: number;
  iat?: number;
  tg_user_id?: string;
  role?: string;
  iss?: string;
  email?: string;
  name?: string;
}
