import { Pressable, View } from "react-native";

import { Icon, type IconName } from "@/components/common/icon";
import { Text } from "@/components/ui/text";

interface ScreenHeaderProps {
  title: string;
  // Square brand button on the right (the design's "+").
  action?: { icon: IconName; label: string; onPress: () => void };
}

export function ScreenHeader({ title, action }: ScreenHeaderProps) {
  return (
    <View className="flex-row items-center justify-between">
      <Text role="heading" className="text-xl font-bold">
        {title}
      </Text>
      {action && (
        <Pressable
          onPress={action.onPress}
          role="button"
          aria-label={action.label}
          hitSlop={6}
          className="h-[34px] w-[34px] items-center justify-center rounded-[10px] bg-brand active:opacity-80"
        >
          <Icon name={action.icon} size={18} className="text-brand-foreground" />
        </Pressable>
      )}
    </View>
  );
}
