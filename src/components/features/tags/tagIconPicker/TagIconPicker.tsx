import { Pressable, View } from "react-native";

import { Icon } from "@/components/common/icon";
import { DEFAULT_TAG_ICON, TAG_ICONS } from "@/constants/tagIcons";
import { cn } from "@/lib/utils";

interface TagIconPickerProps {
  value?: string;
  color: string;
  onChange: (name: string) => void;
}

export function TagIconPicker({
  value = DEFAULT_TAG_ICON,
  color,
  onChange,
}: TagIconPickerProps) {
  return (
    <View role="radiogroup" className="flex-row flex-wrap gap-3">
      {TAG_ICONS.map((item) => {
        const isSelected = item.name === value;
        return (
          <Pressable
            key={item.name}
            onPress={() => onChange(item.name)}
            role="radio"
            aria-checked={isSelected}
            aria-label={item.name}
            className={cn(
              "h-11 w-11 items-center justify-center rounded-[10px] border active:opacity-70",
              isSelected ? "border-2" : "border-border bg-card",
            )}
            style={
              isSelected
                ? { borderColor: color, backgroundColor: `${color}24` }
                : undefined
            }
          >
            <Icon
              name={item.icon}
              size={18}
              color={isSelected ? color : undefined}
              className={isSelected ? undefined : "text-muted-foreground"}
            />
          </Pressable>
        );
      })}
    </View>
  );
}
