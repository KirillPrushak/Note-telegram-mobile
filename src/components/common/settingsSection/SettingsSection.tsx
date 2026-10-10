import type { ReactNode } from "react";
import { Switch, View } from "react-native";

import { Text } from "@/components/ui/text";
import { BRAND_COLOR } from "@/constants/tagColors";
import { cn } from "@/lib/utils";

// Uppercase caption + grouped rows, as in the design's settings tab.
export function SettingsSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <View>
      <Text className="px-0.5 pb-2 text-[11.5px] font-semibold uppercase tracking-wider text-muted-foreground">
        {title}
      </Text>
      {children}
    </View>
  );
}

interface SwitchRowProps {
  label: string;
  description?: string;
  value: boolean;
  onValueChange: () => void;
  isLast?: boolean;
}

export function SwitchRow({ label, description, value, onValueChange, isLast }: SwitchRowProps) {
  return (
    <View
      className={cn("flex-row items-center gap-3 px-0.5 py-3", !isLast && "border-b border-border")}
    >
      <View className="flex-1">
        <Text className="text-[13.5px] font-medium">{label}</Text>
        {description && (
          <Text className="mt-0.5 text-[11.5px] text-muted-foreground">{description}</Text>
        )}
      </View>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ true: BRAND_COLOR }}
        thumbColor="#ffffff"
        aria-label={label}
      />
    </View>
  );
}
