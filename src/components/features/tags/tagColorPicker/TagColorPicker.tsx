import { Pressable, View } from "react-native";

import { TAG_COLORS } from "@/constants/tagColors";

interface TagColorPickerProps {
  // Resolved current color (hex), so the auto-assigned color shows as selected.
  value: string;
  onChange: (name: string) => void;
}

export function TagColorPicker({ value, onChange }: TagColorPickerProps) {
  return (
    <View role="radiogroup" className="flex-row flex-wrap gap-3">
      {TAG_COLORS.map((color) => {
        const isSelected = color.value === value;
        return (
          <Pressable
            key={color.name}
            onPress={() => onChange(color.name)}
            role="radio"
            aria-checked={isSelected}
            aria-label={color.label}
            hitSlop={4}
            className="h-9 w-9 items-center justify-center rounded-full border-2"
            style={{ borderColor: isSelected ? color.value : "transparent" }}
          >
            <View className="h-7 w-7 rounded-full" style={{ backgroundColor: color.value }} />
          </Pressable>
        );
      })}
    </View>
  );
}
