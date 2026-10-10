import Constants from "expo-constants";

// Version from app.json (`expo.version`).
export const APP_VERSION = Constants.expoConfig?.version ?? "—";

// Optional: the About section shows the link only when it is configured.
export const PRIVACY_POLICY_URL = process.env.EXPO_PUBLIC_PRIVACY_POLICY_URL || null;
