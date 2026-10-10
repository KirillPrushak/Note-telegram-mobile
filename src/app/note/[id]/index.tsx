import { Link, router, useLocalSearchParams } from "expo-router";
import { Pressable, ScrollView, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { CopyButton } from "@/components/common/copyButton";
import { Icon } from "@/components/common/icon";
import { StateView } from "@/components/common/stateView";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { useNoteActions } from "@/hooks/useNoteActions";
import { useNote } from "@/hooks/useNote";
import { useTagAppearance } from "@/hooks/useTagAppearance";
import type { Note } from "@/types/note.interface";

const formatFullDate = (dateStr?: string) => {
  if (!dateStr) return null;
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return null;
  return date.toLocaleString("en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

function NoteTagBadge({ note }: { note: Note }) {
  const { color, soft, icon } = useTagAppearance(note.tag_id);

  const badge = (
    <View
      className="flex-row items-center gap-1.5 self-start rounded-full px-3 py-1.5"
      style={{ backgroundColor: soft }}
    >
      <Icon name={icon} size={13} color={color} />
      <Text className="text-xs font-semibold" style={{ color }}>
        {note.tag}
      </Text>
    </View>
  );

  if (!note.tag_id) return badge;

  return (
    <Link href={{ pathname: "/tag/[id]", params: { id: note.tag_id } }} asChild>
      <Pressable
        role="link"
        aria-label={`Tag ${note.tag}`}
        className="self-start active:opacity-70"
      >
        {badge}
      </Pressable>
    </Link>
  );
}

export default function NoteScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { bottom } = useSafeAreaInsets();
  const { note, isLoading, error } = useNote(Number(id));
  const { remove } = useNoteActions();

  if (!note) {
    return (
      <View className="flex-1 bg-background px-5">
        {isLoading ? (
          <StateView type="loading" />
        ) : error ? (
          <StateView type="error" message={error} onRetry={() => router.replace({ pathname: "/note/[id]", params: { id } })} />
        ) : (
          <StateView type="empty" message="Note not found" />
        )}
      </View>
    );
  }

  const deleteNote = async () => {
    if (await remove(note)) router.back();
  };

  const createdAt = formatFullDate(note.created_at);
  const updatedAt =
    note.updated_at !== note.created_at
      ? formatFullDate(note.updated_at)
      : null;

  return (
    <ScrollView
      className="flex-1 bg-background"
      contentContainerClassName="gap-5 px-5 pt-4"
      contentContainerStyle={{ paddingBottom: bottom + 24 }}
    >
      {note.tag && <NoteTagBadge note={note} />}

      <Text selectable className="text-[15px] leading-6">
        {note.message?.trim() || "Untitled"}
      </Text>

      <View className="flex-row gap-2">
        <CopyButton text={note.message ?? ""} />
        <Link
          href={{ pathname: "/note/[id]/edit", params: { id: note.id } }}
          asChild
        >
          <Button variant="outline" className="h-11 flex-1 rounded-[10px]">
            <Icon name="create-outline" size={16} className="text-foreground" />
            <Text className="font-semibold">Edit</Text>
          </Button>
        </Link>
        <Button
          variant="outline"
          onPress={deleteNote}
          aria-label="Delete note"
          className="h-11 w-11 rounded-[10px] px-0"
        >
          <Icon name="trash-outline" size={17} className="text-destructive" />
        </Button>
      </View>

      <View className="gap-2 border-t border-border pt-4">
        {createdAt && (
          <View className="flex-row items-center gap-2">
            <Icon
              name="calendar-outline"
              size={14}
              className="text-muted-foreground"
            />
            <Text className="text-xs text-muted-foreground">
              Created {createdAt}
            </Text>
          </View>
        )}
        {updatedAt && (
          <View className="flex-row items-center gap-2">
            <Icon
              name="create-outline"
              size={14}
              className="text-muted-foreground"
            />
            <Text className="text-xs text-muted-foreground">
              Updated {updatedAt}
            </Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
}
