import { View } from "react-native";

import { Icon, type IconName } from "@/components/common/icon";
import { Text } from "@/components/ui/text";
import { cn } from "@/lib/utils";

type Tone = "brand" | "success" | "info" | "warning";

// Full class names (not built from `tone`) so Tailwind can see them.
const TONE_CLASSES: Record<Tone, { box: string; icon: string }> = {
  brand: { box: "bg-brand/10", icon: "text-brand" },
  success: { box: "bg-success/10", icon: "text-success" },
  info: { box: "bg-info/10", icon: "text-info" },
  warning: { box: "bg-warning/10", icon: "text-warning" },
};

export interface KpiTrend {
  value: string;
  isPositive: boolean;
  caption: string;
}

interface KpiCardProps {
  label: string;
  value: number;
  icon: IconName;
  tone: Tone;
  trend?: KpiTrend;
}

export function KpiCard({ label, value, icon, tone, trend }: KpiCardProps) {
  const toneClasses = TONE_CLASSES[tone];

  return (
    <View className="flex-1 gap-2.5 rounded-[14px] border border-border bg-card p-3.5">
      <View className="flex-row items-center justify-between">
        <Text className="text-xs font-medium text-muted-foreground">{label}</Text>
        <View
          className={cn(
            "h-[30px] w-[30px] items-center justify-center rounded-[9px]",
            toneClasses.box,
          )}
        >
          <Icon name={icon} size={15} className={toneClasses.icon} />
        </View>
      </View>

      <Text className="text-2xl font-bold">{value}</Text>

      {trend && (
        <View className="flex-row items-center gap-1">
          <Icon
            name={trend.isPositive ? "trending-up" : "trending-down"}
            size={12}
            className={trend.isPositive ? "text-success" : "text-destructive"}
          />
          <Text
            className={cn(
              "text-[11.5px] font-medium",
              trend.isPositive ? "text-success" : "text-destructive",
            )}
          >
            {trend.value}
          </Text>
          <Text className="text-[11.5px] text-muted-foreground">{trend.caption}</Text>
        </View>
      )}
    </View>
  );
}
