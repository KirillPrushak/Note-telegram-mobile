import AsyncStorage from "@react-native-async-storage/async-storage";
import { createJSONStorage } from "zustand/middleware";

// Storage adapter for zustand `persist` (replaces localStorage on web).
export const persistStorage = createJSONStorage(() => AsyncStorage);
