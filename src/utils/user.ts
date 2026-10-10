import type { UserInfo } from "@/types/users.interface";
import { getTokenPayload, getUserIdFromToken } from "./token";

const FALLBACK_USER_ID = process.env.EXPO_PUBLIC_NOTE_USER_ID || "2";

export const getCurrentUserId = (): number => {
  const userId = getUserIdFromToken();

  if (userId) {
    return userId;
  }

  // Fallback for Dev
  return Number(FALLBACK_USER_ID);
};

export const getCurrentUserIdOrNull = (): number | null => {
  return getUserIdFromToken();
};

export const isUserLoggedIn = (): boolean => {
  return !!getUserIdFromToken();
};

export const getUserInfo = (): UserInfo | null => {
  const payload = getTokenPayload();
  if (!payload) return null;

  return {
    userId: payload.sub || null,
    telegramUserId: payload.tg_user_id || null,
    role: payload.role || null,
    issuer: payload.iss || null,
    issuedAt: payload.iat ? new Date(payload.iat * 1000) : null,
    expiresAt: payload.exp ? new Date(payload.exp * 1000) : null,
    email: payload.email || null,
    name: payload.name || null,
  };
};

export const hasRole = (role: string | string[]): boolean => {
  const userInfo = getUserInfo();
  if (!userInfo?.role) return false;

  const roles = Array.isArray(role) ? role : [role];
  return roles.includes(userInfo.role);
};

export const isAdmin = (): boolean => {
  return hasRole("admin");
};
