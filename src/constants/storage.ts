// Keys for expo-secure-store (auth) — allowed chars: alphanumeric, ".", "-", "_".
export const SECURE_KEYS = {
  TOKEN: "token",
  TOKEN_TYPE: "token_type",
  EXPIRES_IN: "expires_in",
} as const;

// Keys for AsyncStorage (zustand persist).
export const STORAGE_KEYS = {
  NOTE_COLORS: "note-colors-storage",
  TAG_APPEARANCE: "tag-appearance-storage",
  AUTH_FLOW: "auth-flow-storage",
  SETTINGS: "settings-storage",
} as const;
