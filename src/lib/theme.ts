import { DarkTheme, DefaultTheme, type Theme } from "expo-router";

// React Navigation colors (headers, screen backgrounds) mirroring the CSS
// variables in global.css, so native headers match NativeWind screens.
export const NAV_THEME: Record<"light" | "dark", Theme> = {
  light: {
    ...DefaultTheme,
    colors: {
      background: "#ffffff",
      card: "#ffffff",
      text: "#0a0a0a",
      border: "#d6d6d6",
      notification: "#ef4444",
      primary: "#b37458",
    },
  },
  dark: {
    ...DarkTheme,
    colors: {
      background: "#0a0a0a",
      card: "#0a0a0a",
      text: "#fafafa",
      border: "#262626",
      notification: "#dc2626",
      primary: "#ce8d6f",
    },
  },
};
