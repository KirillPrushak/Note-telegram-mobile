import { Link } from "expo-router";
import { Pressable, View } from "react-native";

import { Icon } from "@/components/common/icon";
import { Text } from "@/components/ui/text";
import { useTagAppearance } from "@/hooks/useTagAppearance";
import type { Tag } from "@/types/tags.interface";
import { formatRelativeDate } from "@/utils/formatRelativeDate";
import { notesLabel } from "@/utils/plural";

interface TagCardProps {
  tag: Tag;
  notesCount: number;
  lastNoteAt?: string;
}

export function TagCard({ tag, notesCount, lastNoteAt }: TagCardProps) {
  const { color, soft, icon, isFavorite, toggleFavorite } = useTagAppearance(tag.id);

  return (
    <Link href={{ pathname: "/tag/[id]", params: { id: tag.id } }} asChild>
      <Pressable
        role="link"
        aria-label={`Tag ${tag.name}`}
        className="flex-row items-center gap-3 rounded-xl border border-border bg-card py-2.5 pl-3 pr-1 active:opacity-70"
      >
        <View
          className="h-10 w-10 items-center justify-center rounded-[10px]"
          style={{ backgroundColor: soft }}
        >
          <Icon name={icon} size={18} color={color} />
        </View>

        <View className="min-w-0 flex-1 gap-0.5">
          <Text numberOfLines={1} className="text-[14.5px] font-semibold">
            {tag.name}
          </Text>
          <Text numberOfLines={1} className="text-xs text-muted-foreground">
            {[notesLabel(notesCount), formatRelativeDate(lastNoteAt)].filter(Boolean).join(" · ")}
          </Text>
        </View>

        <Pressable
          onPress={toggleFavorite}
          role="button"
          aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
          className="h-11 w-11 items-center justify-center rounded-full active:opacity-60"
        >
          <Icon
            name={isFavorite ? "star" : "star-outline"}
            size={18}
            className={isFavorite ? "text-warning" : "text-muted-foreground/50"}
          />
        </Pressable>
        <Icon name="chevron-forward" size={16} className="-ml-2 mr-2 text-muted-foreground/50" />
      </Pressable>
    </Link>
  );
}
