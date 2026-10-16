export const API_CONFIG = {
  BASE_URL: process.env.EXPO_PUBLIC_API_BASE_URL || "https://prushak.space/api",
  TIMEOUT: Number(process.env.EXPO_PUBLIC_API_TIMEOUT) || 15000,
  DEFAULT_LIMIT: 10,
} as const;
