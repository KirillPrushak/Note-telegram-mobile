import type { TokenPayload } from "@/types/token.interface";
import { authStorage } from "@/lib/authStorage";

// JWT segments are base64url without padding, atob expects plain base64.
const decodeBase64Url = (segment: string): string => {
  const base64 = segment.replace(/-/g, "+").replace(/_/g, "/");
  const padding = (4 - (base64.length % 4)) % 4;
  return atob(base64 + "=".repeat(padding));
};

// Get token
export const getTokenPayload = (): TokenPayload | null => {
  const token = authStorage.getToken();
  if (!token) return null;

  try {
    return JSON.parse(decodeBase64Url(token.split(".")[1]));
  } catch {
    return null;
  }
};

// Validate token
export const isTokenValid = (): boolean => {
  const payload = getTokenPayload();
  if (!payload?.exp) return false;

  const expiresAt = payload.exp * 1000;
  return Date.now() < expiresAt;
};

// Information about token
export const getTokenExpiryInfo = (): {
  expiresAt: Date;
  minutesRemaining: number;
  isExpired: boolean;
} | null => {
  const payload = getTokenPayload();
  if (!payload?.exp) return null;

  const expiresAt = new Date(payload.exp * 1000);
  const now = Date.now();
  const minutesRemaining = Math.floor((expiresAt.getTime() - now) / 60000);

  return {
    expiresAt,
    minutesRemaining,
    isExpired: now >= expiresAt.getTime(),
  };
};

// User ID from a token
export const getUserIdFromToken = (): number | null => {
  const payload = getTokenPayload();
  return payload?.sub || null;
};

// Clearing authorization data
export const clearAuthData = (): Promise<void> => authStorage.clear();
