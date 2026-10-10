import { View } from "react-native";
import Svg, { Circle } from "react-native-svg";

import { Text } from "@/components/ui/text";
import { pluralize } from "@/utils/plural";

export interface DistributionItem {
  label: string;
  count: number;
  color: string;
}

const SIZE = 88;
const STROKE = 14;
const RADIUS = (SIZE - STROKE) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

// Donut + legend: share of notes per tag.
export function TagDistribution({ items }: { items: DistributionItem[] }) {
  const total = items.reduce((sum, item) => sum + item.count, 0);

  const toLength = (count: number) =>
    total > 0 ? (count / total) * CIRCUMFERENCE : 0;
  // Each segment starts where the previous ones end.
  const segments = items.map((item, index) => ({
    ...item,
    length: toLength(item.count),
    offset: items
      .slice(0, index)
      .reduce((sum, previous) => sum + toLength(previous.count), 0),
  }));

  return (
    <View className="gap-3.5 rounded-[14px] border border-border bg-card p-4">
      <Text className="text-[13.5px] font-semibold">Notes by tag</Text>

      <View className="flex-row items-center gap-[18px]">
        <View style={{ width: SIZE, height: SIZE }}>
          <Svg width={SIZE} height={SIZE} style={{ transform: [{ rotate: "-90deg" }] }}>
            {segments.map((segment) => (
              <Circle
                key={segment.label}
                cx={SIZE / 2}
                cy={SIZE / 2}
                r={RADIUS}
                fill="none"
                stroke={segment.color}
                strokeWidth={STROKE}
                strokeDasharray={`${segment.length} ${CIRCUMFERENCE}`}
                strokeDashoffset={-segment.offset}
              />
            ))}
          </Svg>
          <View className="absolute inset-0 items-center justify-center">
            <Text className="text-[15px] font-bold">{total}</Text>
            <Text className="text-[9.5px] text-muted-foreground">
              {pluralize(total, "note")}
            </Text>
          </View>
        </View>

        <View className="flex-1 gap-[7px]">
          {items.map((item) => (
            <View key={item.label} className="flex-row items-center gap-[7px]">
              <View
                className="h-2 w-2 rounded-full"
                style={{ backgroundColor: item.color }}
              />
              <Text numberOfLines={1} className="flex-1 text-xs">
                {item.label}
              </Text>
              <Text className="text-xs font-semibold">
                {total > 0 ? Math.round((item.count / total) * 100) : 0}%
              </Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}
