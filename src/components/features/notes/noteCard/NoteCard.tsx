import { Link } from "expo-router";
import { Pressable, View } from "react-native";

import { Text } from "@/components/ui/text";
import { useTagAppearance } from "@/hooks/useTagAppearance";
import type { Note } from "@/types/note.interface";
import { formatRelativeDate } from "@/utils/formatRelativeDate";
import { splitNoteMessage } from "@/utils/noteText";

export function NoteCard({ note }: { note: Note }) {
  const { title, preview } = splitNoteMessage(note.message);
  const tagStyle = useTagAppearance(note.tag_id);

  return (
    <Link href={{ pathname: "/note/[id]", params: { id: note.id } }} asChild>
      <Pressable
        role="link"
        aria-label={title}
        className="gap-2 rounded-xl border border-border bg-card p-3.5 active:opacity-70"
      >
        <Text className="text-[14.5px] font-semibold leading-5">{title}</Text>

        {!!preview && (
          <Text numberOfLines={2} className="text-[12.5px] leading-[19px] text-muted-foreground">
            {preview}
          </Text>
        )}

        <View className="flex-row items-center justify-between">
          {note.tag ? (
            <View className="rounded-full px-[9px] py-[3px]" style={{ backgroundColor: tagStyle.soft }}>
              <Text className="text-[10.5px] font-semibold" style={{ color: tagStyle.color }}>
                {note.tag}
              </Text>
            </View>
          ) : (
            <View />
          )}
          <Text className="text-[11px] text-muted-foreground">
            {formatRelativeDate(note.created_at)}
          </Text>
        </View>
      </Pressable>
    </Link>
  );
}
