import { Pressable, View } from "react-native";

import { Text } from "@/components/ui/text";
import { cn } from "@/lib/utils";

interface SegmentedControlProps<T extends string> {
  options: { value: T; label: string }[];
  value: T;
  onChange: (value: T) => void;
}

export function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
}: SegmentedControlProps<T>) {
  return (
    <View role="tablist" className="flex-row gap-0.5 rounded-lg bg-muted p-0.5">
      {options.map((option) => {
        const isActive = option.value === value;
        return (
          <Pressable
            key={option.value}
            role="tab"
            aria-selected={isActive}
            onPress={() => onChange(option.value)}
            // `shadow-*` sets CSS variables. NativeWind must see them on the
            // first render, otherwise moving the active segment remounts the
            // component (and crashes in dev while printing the warning). So
            // every segment has the shadow; inactive ones make it transparent.
            className={cn(
              "rounded-[7px] px-[9px] py-[5px] shadow-sm",
              isActive ? "bg-card shadow-black/10" : "shadow-transparent",
            )}
          >
            <Text
              className={cn(
                "text-[11.5px] font-semibold",
                isActive ? "text-foreground" : "text-muted-foreground",
              )}
            >
              {option.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
