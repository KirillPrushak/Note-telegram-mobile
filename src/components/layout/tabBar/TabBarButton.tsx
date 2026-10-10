import type { TabTriggerSlotProps } from "expo-router/ui";
import { Pressable } from "react-native";

import { Icon } from "@/components/common/icon";
import { cn } from "@/lib/utils";
import type { TabConfig } from "./constants";

type TabBarButtonProps = TabTriggerSlotProps &
  Pick<TabConfig, "icon" | "activeIcon" | "label">;

export function TabBarButton({
  icon,
  activeIcon,
  label,
  isFocused,
  // TabTrigger injects `flexDirection: row; justifyContent: space-between`.
  // Inline style beats className in NativeWind, so it would push the icon
  // to the left edge of the circle. Drop it and lay out via className only.
  style: _triggerStyle,
  ...props
}: TabBarButtonProps) {
  return (
    <Pressable
      {...props}
      role="tab"
      aria-label={label}
      aria-selected={isFocused}
      hitSlop={8}
      className={cn(
        "h-12 w-12 items-center justify-center rounded-full active:opacity-70",
        isFocused && "bg-tabbar-active",
      )}
    >
      <Icon
        name={isFocused ? activeIcon : icon}
        size={22}
        className={
          isFocused ? "text-tabbar-active-foreground" : "text-tabbar-foreground"
        }
      />
    </Pressable>
  );
}
