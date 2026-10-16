import { Pressable } from "react-native";

import { Text } from "@/components/ui/text";
import { cn } from "@/lib/utils";

interface ChipProps {
  label: string;
  isActive: boolean;
  onPress: () => void;
}

export function Chip({ label, isActive, onPress }: ChipProps) {
  return (
    <Pressable
      onPress={onPress}
      role="button"
      aria-selected={isActive}
      className={cn(
        "h-8 justify-center rounded-full border px-[13px] active:opacity-70",
        isActive ? "border-brand bg-brand" : "border-border bg-card",
      )}
    >
      <Text
        className={cn(
          "text-xs font-semibold",
          isActive ? "text-brand-foreground" : "text-foreground",
        )}
      >
        {label}
      </Text>
    </Pressable>
  );
}
