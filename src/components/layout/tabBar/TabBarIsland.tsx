import { View, type ViewProps } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { TAB_BAR } from "./constants";

// Floating rounded container for the tab triggers. Rendered through
// `<TabList asChild>`, which injects `justifyContent: space-between` as an
// inline style; it's dropped so the className layout below applies.
export function TabBarIsland({
  style: _listStyle,
  children,
  ...props
}: ViewProps) {
  const insets = useSafeAreaInsets();

  return (
    <View
      {...props}
      className="absolute left-4 right-4 flex-row items-center justify-evenly"
      style={{
        height: TAB_BAR.HEIGHT,
        bottom: insets.bottom + TAB_BAR.BOTTOM_OFFSET,
      }}
    >
      {children}
    </View>
  );
}
