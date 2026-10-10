import { Link } from "expo-router";
import { Pressable, View } from "react-native";

import { Text } from "@/components/ui/text";
import { useTagAppearance } from "@/hooks/useTagAppearance";
import { cn } from "@/lib/utils";
import type { Note } from "@/types/note.interface";
import { formatRelativeDate } from "@/utils/formatRelativeDate";
import { splitNoteMessage } from "@/utils/noteText";

function RecentNoteRow({ note, isLast }: { note: Note; isLast: boolean }) {
  const { color } = useTagAppearance(note.tag_id);
  const { title } = splitNoteMessage(note.message);

  return (
    <Link href={{ pathname: "/note/[id]", params: { id: note.id } }} asChild>
      <Pressable
        role="link"
        aria-label={title}
        className={cn("flex-row gap-2.5 py-[9px] active:opacity-70", !isLast && "border-b border-border")}
      >
        <View className="mt-[5px] h-[7px] w-[7px] rounded-full" style={{ backgroundColor: color }} />
        <View className="min-w-0 flex-1">
          <Text numberOfLines={1} className="text-[13px] font-medium">
            {title}
          </Text>
          <Text className="text-[11px] text-muted-foreground">
            {[formatRelativeDate(note.created_at), note.tag].filter(Boolean).join(" · ")}
          </Text>
        </View>
      </Pressable>
    </Link>
  );
}

export function RecentNotes({ notes }: { notes: Note[] }) {
  return (
    <View className="gap-3 rounded-[14px] border border-border bg-card p-4">
      <View className="flex-row items-center justify-between">
        <Text className="text-[13.5px] font-semibold">Recent notes</Text>
        <Link href="/notes" asChild>
          <Pressable hitSlop={10} role="link">
            <Text className="text-xs font-semibold text-brand">See all</Text>
          </Pressable>
        </Link>
      </View>

      {notes.length === 0 ? (
        <Text className="text-xs text-muted-foreground">No notes yet</Text>
      ) : (
        <View>
          {notes.map((note, index) => (
            <RecentNoteRow key={note.id} note={note} isLast={index === notes.length - 1} />
          ))}
        </View>
      )}
    </View>
  );
}
