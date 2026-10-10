import { Link, Stack, router, useLocalSearchParams } from "expo-router";
import { KeyboardAvoidingView, Platform, ScrollView, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Icon } from "@/components/common/icon";
import { SettingsSection, SwitchRow } from "@/components/common/settingsSection";
import { StateView } from "@/components/common/stateView";
import { NoteCard } from "@/components/features/notes/noteCard";
import { TagColorPicker } from "@/components/features/tags/tagColorPicker";
import { TagIconPicker } from "@/components/features/tags/tagIconPicker";
import { TagNameForm } from "@/components/features/tags/tagNameForm";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { useNotesAndTags } from "@/hooks/useNotesAndTags";
import { useTagActions } from "@/hooks/useTagActions";
import { useTagAppearance } from "@/hooks/useTagAppearance";
import { sortByNewest } from "@/utils/dashboardStats";
import { notesLabel } from "@/utils/plural";

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
          <StateView type="empty" icon="pricetags-outline" message="Tag not found" />
        )}
      </View>
    );
  }

  const deleteTag = async () => {
    if (await remove(tag)) router.back();
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      className="flex-1 bg-background"
    >
      <Stack.Screen options={{ title: tag.name }} />
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerClassName="gap-[22px] px-5 pt-4"
        contentContainerStyle={{ paddingBottom: bottom + 24 }}
      >
        <View className="flex-row items-center gap-3 rounded-[14px] border border-border bg-card p-4">
          <View
            className="h-12 w-12 items-center justify-center rounded-xl"
            style={{ backgroundColor: appearance.soft }}
          >
            <Icon name={appearance.icon} size={22} color={appearance.color} />
          </View>
          <View className="min-w-0 flex-1">
            <Text numberOfLines={1} className="text-base font-bold">
              {tag.name}
            </Text>
            <Text className="text-[12.5px] text-muted-foreground">
              {notesLabel(tagNotes.length)}
            </Text>
          </View>
          {appearance.isFavorite && <Icon name="star" size={18} className="text-warning" />}
        </View>

        <SettingsSection title="Name">
          <TagNameForm key={tag.id} tag={tag} />
        </SettingsSection>

        <SettingsSection title="Display">
          <SwitchRow
            label="Favorite"
            description="Favorite tags are shown first"
            value={appearance.isFavorite}
            onValueChange={appearance.toggleFavorite}
          />
          <SwitchRow
            label="Show in Telegram bot"
            description="Saved on this device only for now"
            value={appearance.botVisible}
            onValueChange={appearance.toggleBotVisible}
            isLast
          />
        </SettingsSection>

        <SettingsSection title="Icon">
          <TagIconPicker
            value={appearance.iconName}
            color={appearance.color}
            onChange={appearance.setIcon}
          />
        </SettingsSection>

        <SettingsSection title="Color">
          <TagColorPicker value={appearance.color} onChange={appearance.setColor} />
        </SettingsSection>

        <SettingsSection title="Notes with this tag">
          {tagNotes.length === 0 ? (
            <Text className="text-[13px] text-muted-foreground">No notes with this tag yet</Text>
          ) : (
            <View className="gap-2.5">
              {tagNotes.map((note) => (
                <NoteCard key={note.id} note={note} />
              ))}
            </View>
          )}
          <Link href={{ pathname: "/note/new", params: { tagId: tag.id } }} asChild>
            <Button variant="outline" className="mt-3 h-11 rounded-[10px]">
              <Icon name="add" size={17} className="text-foreground" />
              <Text className="font-semibold">New note with this tag</Text>
            </Button>
          </Link>
        </SettingsSection>

        <Button variant="outline" onPress={deleteTag} className="h-11 rounded-[10px]">
          <Icon name="trash-outline" size={16} className="text-destructive" />
          <Text className="font-semibold text-destructive">Delete tag</Text>
        </Button>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
