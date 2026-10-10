// Web fallback for secureStorage.ts: expo-secure-store has no web
// implementation, so the token goes to localStorage (same as the web app).
export const secureStorage = {
  getItem: async (key: string) => localStorage.getItem(key),
  setItem: async (key: string, value: string) => localStorage.setItem(key, value),
  removeItem: async (key: string) => localStorage.removeItem(key),
};
