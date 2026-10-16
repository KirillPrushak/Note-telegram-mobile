import * as Clipboard from "expo-clipboard";
import { Stack, router, useLocalSearchParams } from "expo-router";
import { FlatList, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { DropdownMenu } from "@/components/common/dropdownMenu";
import { Icon } from "@/components/common/icon";
import { StateView } from "@/components/common/stateView";
import { NoteCard } from "@/components/features/notes/noteCard";
import { Text } from "@/components/ui/text";
import { useNotesAndTags } from "@/hooks/useNotesAndTags";
import { useTagActions } from "@/hooks/useTagActions";
import { useTagAppearance } from "@/hooks/useTagAppearance";
import { showError } from "@/utils/confirm";
import { sortByNewest } from "@/utils/dashboardStats";
import { notesLabel } from "@/utils/plural";

// A tag's notes. Settings live on a separate screen ("Edit tag").
export default function TagScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const tagId = Number(id);
  const { bottom } = useSafeAreaInsets();
  const { notes, tags, isLoading, error, refetch } = useNotesAndTags();
  const appearance = useTagAppearance(tagId);
  const { remove } = useTagActions();

  const tag = tags.find((item) => item.id === tagId);
  const tagNotes = sortByNewest(notes.filter((note) => note.tag_id === tagId));

  if (!tag) {
    return (
      <View className="flex-1 bg-background px-5">
        {isLoading ? (
          <StateView type="loading" />
        ) : error ? (
          <StateView type="error" message={error} onRetry={refetch} />
        ) : (
          <StateView
            type="empty"
            message="Tag not found"
          />
        )}
      </View>
    );
  }

  const deleteTag = async () => {
    if (await remove(tag)) router.back();
  };

  const copyName = async () => {
    try {
      await Clipboard.setStringAsync(tag.name);
    } catch {
      showError("Couldn't copy", "Please try again");
    }
  };

  return (
    <View className="flex-1 bg-background">
      <Stack.Screen options={{ title: tag.name }} />

      <FlatList
        data={tagNotes}
        keyExtractor={(note) => String(note.id)}
        renderItem={({ item }) => <NoteCard note={item} />}
        contentContainerClassName="gap-2.5 px-5 pt-4"
        contentContainerStyle={{ paddingBottom: bottom + 24 }}
        ListHeaderComponent={
          <View className="mb-2 flex-row items-center gap-3">
            <View
              className="h-12 w-12 items-center justify-center rounded-xl"
              style={{ backgroundColor: appearance.soft }}
            >
              <Icon name={appearance.icon} size={22} color={appearance.color} />
            </View>
            <View className="min-w-0 flex-1">
              <Text numberOfLines={1} className="text-lg font-bold">
                {tag.name}
              </Text>
              <Text className="text-[12.5px] text-muted-foreground">
                {notesLabel(tagNotes.length)}
              </Text>
            </View>
            <DropdownMenu
              triggerIcon="ellipsis-vertical"
              triggerLabel="Tag actions"
              triggerClassName="h-10 w-10 items-center justify-center rounded-full active:bg-muted"
              triggerIconClassName="text-foreground"
              items={[
                {
                  label: "New",
                  description: "New note with this tag",
                  icon: "add",
                  onPress: () =>
                    router.push({
                      pathname: "/note/new",
                      params: { tagId: tag.id },
                    }),
                },
                {
                  label: "Copy",
                  description: "Copy the tag name",
                  icon: "copy-outline",
                  onPress: copyName,
                },
                {
                  label: "Edit",
                  description: "Name, icon, color, display",
                  icon: "create-outline",
                  onPress: () =>
                    router.push({
                      pathname: "/tag/[id]/edit",
                      params: { id: tag.id },
                    }),
                },
                {
                  label: "Delete",
                  icon: "trash-outline",
                  destructive: true,
                  onPress: deleteTag,
                },
              ]}
            />
          </View>
        }
        ListEmptyComponent={
          <StateView type="empty" message="No notes with this tag yet" />
        }
      />
    </View>
  );
}
