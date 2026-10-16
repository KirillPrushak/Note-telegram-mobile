import type { ReactNode } from "react";
import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

// Base container for tab screens: background + top safe area. Each screen
// owns its scrolling and pads the bottom with `useTabBarInset`.
export function Screen({ children }: { children: ReactNode }) {
  const { top } = useSafeAreaInsets();

  return (
    <View className="flex-1 bg-background" style={{ paddingTop: top + 12 }}>
      {children}
    </View>
  );
}
