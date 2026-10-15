import { Stack, ThemeProvider } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useColorScheme } from "nativewind";
import { useEffect, useState } from "react";
import { Appearance, Platform } from "react-native";
import "../../global.css";

import { NAV_THEME } from "@/lib/theme";
import { useAuthStore, useSettingsStore } from "@/store";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const { colorScheme, setColorScheme } = useColorScheme();
  const [isReady, setIsReady] = useState(false);
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn);

  // Load the token (SecureStore, async) and the saved theme before the
  // first screen renders, while the splash screen is still up.
  useEffect(() => {
    Promise.all([useAuthStore.getState().hydrate(), useSettingsStore.persist.rehydrate()])
      .then(() => {
        const savedTheme = useSettingsStore.getState().theme;
        // On web NativeWind's "class" mode can't follow the OS by itself.
        const systemTheme = Appearance.getColorScheme() === "dark" ? "dark" : "light";
        setColorScheme(savedTheme ?? (Platform.OS === "web" ? systemTheme : "system"));
      })
      .catch((error) => console.error("app/bootstrap error:", error))
      .finally(() => setIsReady(true));
  }, [setColorScheme]);

  useEffect(() => {
    if (isReady) SplashScreen.hide();
  }, [isReady]);

  if (!isReady) return null;

  const navTheme = NAV_THEME[colorScheme === "dark" ? "dark" : "light"];

  return (
    <ThemeProvider value={navTheme}>
      <StatusBar style={colorScheme === "dark" ? "light" : "dark"} />
      <Stack
        screenOptions={{
          headerShown: false,
          headerShadowVisible: false,
          headerBackTitle: "Back",
          headerTintColor: navTheme.colors.primary,
          headerTitleStyle: { color: navTheme.colors.text },
        }}
      >
        <Stack.Protected guard={isLoggedIn}>
          <Stack.Screen name="(tabs)" />
          {/* Both open the same note editor (it sets its own header). */}
          <Stack.Screen name="note/[id]/index" options={{ headerShown: true, title: "" }} />
          <Stack.Screen name="note/new" options={{ headerShown: true, title: "" }} />
          <Stack.Screen name="tag/[id]/index" options={{ headerShown: true, title: "Tag" }} />
          <Stack.Screen
            name="tag/[id]/edit"
            options={{ headerShown: true, title: "Edit tag" }}
          />
          <Stack.Screen
            name="tag/new"
            options={{ headerShown: true, title: "New tag", presentation: "modal" }}
          />
        </Stack.Protected>
        <Stack.Protected guard={!isLoggedIn}>
          <Stack.Screen name="auth" />
        </Stack.Protected>
      </Stack>
    </ThemeProvider>
  );
}
