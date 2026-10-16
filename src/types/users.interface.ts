export interface User {
  id?: number;
  user_id?: number;
  username?: string;
  name?: string;
  email?: string;
  created_at?: string;
}

export interface CreateUserDto {
  name: string;
}

export interface UpdateUserDto {
  name?: string;
}

export interface UserInfo {
  userId: number | null;
  telegramUserId: string | null;
  role: string | null;
  issuer: string | null;
  issuedAt: Date | null;
  expiresAt: Date | null;
  email?: string | null;
  name?: string | null;
}
