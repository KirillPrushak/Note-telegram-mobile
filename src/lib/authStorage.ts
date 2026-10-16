import { SECURE_KEYS } from "@/constants/storage";
import type { TokenData } from "@/types/token.interface";
import { secureStorage } from "./secureStorage";

// Secure storage is async-only, but the API client and token utils need
// the token synchronously (as localStorage was on web). Keep an in-memory
// copy that is loaded once at startup (`hydrate` in the auth store) and
// kept in sync on every write.
interface AuthCache {
  token: string | null;
  tokenType: string | null;
  expiresIn: string | null;
}

const cache: AuthCache = { token: null, tokenType: null, expiresIn: null };

export const authStorage = {
  hydrate: async (): Promise<void> => {
    const [token, tokenType, expiresIn] = await Promise.all([
      secureStorage.getItem(SECURE_KEYS.TOKEN),
      secureStorage.getItem(SECURE_KEYS.TOKEN_TYPE),
      secureStorage.getItem(SECURE_KEYS.EXPIRES_IN),
    ]);
    cache.token = token;
    cache.tokenType = tokenType;
    cache.expiresIn = expiresIn;
  },

  getToken: (): string | null => cache.token,
  getTokenType: (): string => cache.tokenType || "Bearer",

  setAuth: async ({ token, token_type, expires_in }: TokenData) => {
    cache.token = token;
    cache.tokenType = token_type;
    cache.expiresIn = String(expires_in);
    await Promise.all([
      secureStorage.setItem(SECURE_KEYS.TOKEN, token),
      secureStorage.setItem(SECURE_KEYS.TOKEN_TYPE, token_type),
      secureStorage.setItem(SECURE_KEYS.EXPIRES_IN, String(expires_in)),
    ]);
  },

  clear: async () => {
    cache.token = null;
    cache.tokenType = null;
    cache.expiresIn = null;
    await Promise.all(Object.values(SECURE_KEYS).map((key) => secureStorage.removeItem(key)));
  },
};
