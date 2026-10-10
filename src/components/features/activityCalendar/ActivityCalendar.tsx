import { useState } from "react";
import { Pressable, View } from "react-native";

import { Icon } from "@/components/common/icon";
import { Text } from "@/components/ui/text";
import { cn } from "@/lib/utils";
import type { Note } from "@/types/note.interface";
import { notesLabel } from "@/utils/plural";

const WEEKDAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
const DAY_MS = 24 * 60 * 60 * 1000;

const dayKey = (date: Date) => `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;

const isSameDay = (a: Date, b: Date) => dayKey(a) === dayKey(b);

interface CalendarDay {
  date: Date;
  inMonth: boolean;
  count: number;
}

// Whole weeks covering the month, with leading/trailing days of the
// neighbouring months (shown muted, as in the shadcn calendar).
const buildMonthGrid = (year: number, month: number, counts: Map<string, number>) => {
  const first = new Date(year, month, 1);
  const start = new Date(year, month, 1 - first.getDay());
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cellCount = Math.ceil((first.getDay() + daysInMonth) / 7) * 7;

  return Array.from({ length: cellCount }, (_, index): CalendarDay => {
    const date = new Date(start.getFullYear(), start.getMonth(), start.getDate() + index);
    return {
      date,
      inMonth: date.getMonth() === month,
      count: counts.get(dayKey(date)) ?? 0,
    };
  });
};

function DayCell({
  day,
  isToday,
  isSelected,
  onPress,
}: {
  day: CalendarDay;
  isToday: boolean;
  isSelected: boolean;
  onPress: () => void;
}) {
  const label = day.date.getDate();

  if (!day.inMonth) {
    return (
      <View className="aspect-square flex-1 items-center justify-center rounded-[10px] border border-border/40">
        <Text className="text-[15px] leading-[17px] text-muted-foreground/40">{label}</Text>
      </View>
    );
  }

  return (
    <Pressable
      onPress={onPress}
      role="button"
      aria-selected={isSelected}
      aria-label={`${day.date.toLocaleDateString("en-US", { month: "long", day: "numeric" })}: ${notesLabel(day.count)}`}
      className={cn(
        "aspect-square flex-1 items-center justify-center rounded-[10px] border active:opacity-70",
        isToday ? "border-muted-foreground/40 bg-muted" : "border-border bg-muted/50",
        isSelected && "border-2 border-foreground",
      )}
    >
      <Text className={cn("text-[15px] leading-[17px]", isToday ? "font-bold" : "font-medium")}>
        {label}
      </Text>
      {day.count > 0 && (
        <Text className="absolute right-[5px] top-[3px] text-[10px] font-bold leading-3 text-brand">
          {day.count}
        </Text>
      )}
    </Pressable>
  );
}

// Activity heatmap as a month calendar (design v5): every date in a rounded
// square, the number of notes created that day in its top-right corner.
export function ActivityCalendar({ notes }: { notes: Note[] }) {
  const today = new Date();
  const [visibleMonth, setVisibleMonth] = useState(
    () => new Date(today.getFullYear(), today.getMonth(), 1),
  );
  const [selectedDay, setSelectedDay] = useState<Date>(today);

  const counts = new Map<string, number>();
  for (const note of notes) {
    if (!note.created_at) continue;
    const created = new Date(note.created_at);
    if (Number.isNaN(created.getTime())) continue;
    const key = dayKey(created);
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }

  const year = visibleMonth.getFullYear();
  const month = visibleMonth.getMonth();
  const grid = buildMonthGrid(year, month, counts);
  const weeks = Array.from({ length: grid.length / 7 }, (_, index) =>
    grid.slice(index * 7, index * 7 + 7),
  );

  const isCurrentMonth = year === today.getFullYear() && month === today.getMonth();
  const activeDays = grid.filter((day) => day.inMonth && day.count > 0).length;
  const weekAgo = today.getTime() - 7 * DAY_MS;
  const notesThisWeek = notes.filter(
    (note) => note.created_at && new Date(note.created_at).getTime() >= weekAgo,
  ).length;
  const selectedCount = counts.get(dayKey(selectedDay)) ?? 0;

  const shiftMonth = (delta: number) => setVisibleMonth(new Date(year, month + delta, 1));

  return (
    <View className="gap-2">
      <View className="flex-row items-baseline justify-between px-0.5">
        <Text className="text-[13.5px] font-semibold">Activity</Text>
        <Text className="text-[11.5px] text-muted-foreground">
          {activeDays} active days · {notesThisWeek} this week
        </Text>
      </View>

      <View className="gap-2.5 rounded-xl border border-border bg-card p-3">
        <View className="h-8 flex-row items-center justify-between">
          <Pressable
            onPress={() => shiftMonth(-1)}
            role="button"
            aria-label="Previous month"
            hitSlop={7}
            className="h-[30px] w-[30px] items-center justify-center rounded-lg border border-border active:opacity-70"
          >
            <Icon name="chevron-back" size={14} className="text-foreground" />
          </Pressable>
          <Text className="text-sm font-medium">
            {visibleMonth.toLocaleDateString("en-US", { month: "long", year: "numeric" })}
          </Text>
          <Pressable
            onPress={() => shiftMonth(1)}
            disabled={isCurrentMonth}
            role="button"
            aria-label="Next month"
            aria-disabled={isCurrentMonth}
            hitSlop={7}
            className={cn(
              "h-[30px] w-[30px] items-center justify-center rounded-lg border border-border active:opacity-70",
              isCurrentMonth && "opacity-40",
            )}
          >
            <Icon name="chevron-forward" size={14} className="text-foreground" />
          </Pressable>
        </View>

        <View className="flex-row gap-[5px]">
          {WEEKDAYS.map((weekday) => (
            <Text key={weekday} className="flex-1 text-center text-xs text-muted-foreground">
              {weekday}
            </Text>
          ))}
        </View>

        <View className="gap-[5px]">
          {weeks.map((week) => (
            <View key={dayKey(week[0].date)} className="flex-row gap-[5px]">
              {week.map((day) => (
                <DayCell
                  key={dayKey(day.date)}
                  day={day}
                  isToday={isSameDay(day.date, today)}
                  isSelected={isSameDay(day.date, selectedDay)}
                  onPress={() => setSelectedDay(day.date)}
                />
              ))}
            </View>
          ))}
        </View>
      </View>

      <Text className="px-0.5 text-xs text-muted-foreground">
        {selectedDay.toLocaleDateString("en-US", { month: "short", day: "numeric" })} ·{" "}
        {notesLabel(selectedCount)}
      </Text>
    </View>
  );
}
