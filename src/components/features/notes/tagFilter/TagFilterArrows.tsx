import { useRef, useState } from "react";
import { Pressable, ScrollView, View } from "react-native";

import { Chip } from "@/components/common/chip";
import { Icon } from "@/components/common/icon";
import { cn } from "@/lib/utils";
import type { Tag } from "@/types/tags.interface";
import { shortenTagName } from "./shortenTagName";

interface TagFilterArrowsProps {
  tags: Tag[];
  activeTagId: number | null;
  onChange: (tagId: number | null) => void;
}

type ChipLayout = { x: number; width: number };

function ArrowButton({
  direction,
  disabled,
  onPress,
}: {
  direction: "left" | "right";
  disabled: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      role="button"
      aria-label={direction === "left" ? "Previous tags" : "Next tags"}
      aria-disabled={disabled}
      // 34px circle, hitSlop brings the touch target to 44px.
      hitSlop={5}
      className={cn(
        "h-[34px] w-[34px] items-center justify-center rounded-full border border-border bg-card active:opacity-70",
        disabled && "opacity-40",
      )}
    >
      <Icon
        name={direction === "left" ? "chevron-back" : "chevron-forward"}
        size={16}
        className="text-foreground"
      />
    </Pressable>
  );
}

// Variant A from the canvas: chips paged by arrows, with page dots. Swipe
// still works; the arrows jump to the first chip that is cut off.
export function TagFilterArrows({ tags, activeTagId, onChange }: TagFilterArrowsProps) {
  const scrollRef = useRef<ScrollView>(null);
  const chipLayouts = useRef<ChipLayout[]>([]);
  const [viewportWidth, setViewportWidth] = useState(0);
  const [contentWidth, setContentWidth] = useState(0);
  const [scrollX, setScrollX] = useState(0);

  const overflows = contentWidth > viewportWidth + 1;
  const maxScroll = Math.max(0, contentWidth - viewportWidth);
  const atStart = scrollX <= 4;
  const atEnd = scrollX >= maxScroll - 4;

  const pageCount = overflows ? Math.ceil(contentWidth / viewportWidth) : 1;
  const activePage = atEnd ? pageCount - 1 : Math.round(scrollX / viewportWidth);

  const scrollTo = (x: number) =>
    scrollRef.current?.scrollTo({ x: Math.min(Math.max(0, x), maxScroll), animated: true });

  // Next page starts at the first chip that isn't fully visible.
  const goNext = () => {
    const rightEdge = scrollX + viewportWidth;
    const cut = chipLayouts.current.find((chip) => chip.x + chip.width > rightEdge + 1);
    scrollTo(cut ? cut.x : maxScroll);
  };

  // Previous page ends where the current one starts.
  const goPrev = () => {
    const target = chipLayouts.current.find((chip) => chip.x >= scrollX - viewportWidth);
    scrollTo(target && target.x < scrollX ? target.x : scrollX - viewportWidth);
  };

  const allChips = [{ id: null, label: "All" }, ...tags.map((tag) => ({ id: tag.id, label: shortenTagName(tag.name) }))];

  return (
    <View className="mx-5 mb-3 gap-2">
      <View className="flex-row items-center gap-1.5">
        {overflows && <ArrowButton direction="left" disabled={atStart} onPress={goPrev} />}

        <View
          className="flex-1 overflow-hidden"
          onLayout={(event) => setViewportWidth(event.nativeEvent.layout.width)}
        >
          <ScrollView
            ref={scrollRef}
            horizontal
            showsHorizontalScrollIndicator={false}
            onContentSizeChange={(width) => setContentWidth(width)}
            onScroll={(event) => setScrollX(event.nativeEvent.contentOffset.x)}
            scrollEventThrottle={32}
            contentContainerClassName="flex-grow items-center justify-center gap-[7px]"
          >
            {allChips.map((chip, index) => (
              <View
                key={chip.id ?? "all"}
                onLayout={(event) => {
                  const { x, width } = event.nativeEvent.layout;
                  chipLayouts.current[index] = { x, width };
                }}
              >
                <Chip
                  label={chip.label}
                  isActive={activeTagId === chip.id}
                  onPress={() => onChange(chip.id)}
                />
              </View>
            ))}
          </ScrollView>
        </View>

        {overflows && <ArrowButton direction="right" disabled={atEnd} onPress={goNext} />}
      </View>

      {overflows && pageCount > 1 && (
        <View className="flex-row justify-center gap-[5px]" aria-hidden>
          {Array.from({ length: pageCount }, (_, index) => (
            <View
              key={index}
              className={cn(
                "h-[5px] rounded-full",
                index === activePage ? "w-4 bg-brand" : "w-[5px] bg-border",
              )}
            />
          ))}
        </View>
      )}
    </View>
  );
}
