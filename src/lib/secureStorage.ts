import * as SecureStore from "expo-secure-store";

// Native: Keychain (iOS) / Keystore-backed storage (Android).
// The web build uses secureStorage.web.ts instead (SecureStore has no web
// implementation).
export const secureStorage = {
  getItem: (key: string) => SecureStore.getItemAsync(key),
  setItem: (key: string, value: string) => SecureStore.setItemAsync(key, value),
  removeItem: (key: string) => SecureStore.deleteItemAsync(key),
};
