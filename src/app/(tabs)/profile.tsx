import { useColorScheme } from "nativewind";
import { useEffect } from "react";
import { Alert, Platform, ScrollView, View } from "react-native";

import { Icon } from "@/components/common/icon";
import { SegmentedControl } from "@/components/common/segmentedControl";
import { ProfileInfoCard } from "@/components/features/profile";
import { Screen, ScreenHeader } from "@/components/layout/screen";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { useTabBarInset } from "@/hooks/useTabBarInset";
import {
  type ThemeMode,
  useAuthStore,
  useCurrentUser,
  useSettingsStore,
} from "@/store";

const THEME_OPTIONS: { value: ThemeMode; label: string }[] = [
  { value: "light", label: "Light" },
  { value: "dark", label: "Dark" },
];

export default function ProfileScreen() {
  const bottomInset = useTabBarInset();
  const { colorScheme, setColorScheme } = useColorScheme();
  const setTheme = useSettingsStore((s) => s.setTheme);

  const fetchCurrentUser = useCurrentUser((s) => s.fetchCurrentUser);
  const userName = useCurrentUser((s) => s.getUserName());
  const userInitials = useCurrentUser((s) => s.getUserInitials());
  const email = useCurrentUser((s) => s.getUserEmail());

  useEffect(() => {
    fetchCurrentUser();
  }, [fetchCurrentUser]);

  const signOut = useAuthStore((s) => s.signOut);

  // Until the user picks, the app follows the OS; the toggle shows what is
  // actually on screen.
  const changeTheme = (value: ThemeMode) => {
    setColorScheme(value);
    setTheme(value);
  };

  const confirmSignOut = () => {
    // Alert.alert is a no-op in react-native-web.
    if (Platform.OS === "web") {
      if (window.confirm("Sign out?")) void signOut();
      return;
    }
    Alert.alert(
      "Sign out?",
      "You'll need a new code from the Telegram bot to sign in again.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Sign out",
          style: "destructive",
          onPress: () => void signOut(),
        },
      ],
    );
  };

  return (
    <Screen>
      <ScrollView
        contentContainerClassName="gap-7 px-5"
        contentContainerStyle={{ paddingBottom: bottomInset }}
      >
        <ScreenHeader title="Profile" />

        <View className="flex-row items-center gap-3">
          <View className="h-14 w-14 items-center justify-center rounded-full bg-brand/10">
            <Text className="text-lg font-bold text-brand">{userInitials}</Text>
          </View>
          <View className="min-w-0 flex-1">
            <Text numberOfLines={1} className="text-base font-bold">
              {userName}
            </Text>
            <Text
              numberOfLines={1}
              className="text-[12.5px] text-muted-foreground"
            >
              {email ?? "Telegram account"}
            </Text>
          </View>
        </View>

        {/* <ProfileStats /> */}

        <ProfileInfoCard />

        <View className="flex-col items-center gap-3">
          <View className="h-12 flex-row items-center gap-3 px-0.5">
            <Icon
              name="contrast-outline"
              size={18}
              className="text-muted-foreground"
            />
            <Text className="flex-1 text-[14px] font-medium">Theme</Text>
            <SegmentedControl
              options={THEME_OPTIONS}
              value={colorScheme === "dark" ? "dark" : "light"}
              onChange={changeTheme}
            />
          </View>

          <Button
            variant="outline"
            onPress={confirmSignOut}
            className="h-12 justify-center gap-3 px-0.5 w-full"
          >
            <Icon
              name="log-out-outline"
              size={18}
              className="text-destructive"
            />
            <Text className="text-[14px] font-semibold text-destructive">
              Sign out
            </Text>
          </Button>
        </View>
      </ScrollView>
    </Screen>
  );
}
