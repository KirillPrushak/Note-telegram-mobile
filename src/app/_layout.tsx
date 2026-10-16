import { type ErrorBoundaryProps, Stack, ThemeProvider } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useColorScheme } from "nativewind";
import { useEffect, useState } from "react";
import { Appearance, Platform, View } from "react-native";
import "../../global.css";

import { GiraffeMascot } from "@/components/common/giraffeMascot";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { NAV_THEME } from "@/lib/theme";
import { useAuthStore, useSettingsStore } from "@/store";

SplashScreen.preventAutoHideAsync();

// Last line of defense: a crash anywhere in the app shows this instead of a
// blank screen. The error can happen before bootstrap, so hide the splash.
export function ErrorBoundary({ error, retry }: ErrorBoundaryProps) {
  useEffect(() => {
    console.error("app/error-boundary:", error);
    SplashScreen.hide();
  }, [error]);

  return (
    <View className="flex-1 items-center justify-center gap-3 bg-background px-8">
      <GiraffeMascot size={140} mood="sad" />
      <Text className="text-center text-[17px] font-semibold">Something went wrong</Text>
      <Text className="text-center text-sm text-muted-foreground">{error.message}</Text>
      <Button variant="outline" size="sm" onPress={retry}>
        <Text>Try again</Text>
      </Button>
    </View>
  );
}

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
