import { Pressable, View } from "react-native";

import { Text } from "@/components/ui/text";
import { useTagAppearance } from "@/hooks/useTagAppearance";
import type { Tag } from "@/types/tags.interface";

interface TagOptionProps {
  tag: Tag;
  isSelected: boolean;
  onPress: () => void;
}

// Selectable tag chip in its own color.
export function TagOption({ tag, isSelected, onPress }: TagOptionProps) {
  const { color, soft } = useTagAppearance(tag.id);

  return (
    <Pressable
      onPress={onPress}
      role="radio"
      aria-checked={isSelected}
      className="h-9 flex-row items-center gap-1.5 rounded-full border px-3 active:opacity-70"
      style={{
        borderColor: isSelected ? color : "transparent",
        backgroundColor: isSelected ? soft : undefined,
      }}
    >
      <View className="h-2 w-2 rounded-full" style={{ backgroundColor: color }} />
      <Text
        className="text-[13px] font-semibold"
        style={isSelected ? { color } : undefined}
      >
        {tag.name}
      </Text>
    </Pressable>
  );
}
