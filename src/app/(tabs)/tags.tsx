import { router } from "expo-router";
import { FlatList, RefreshControl, View } from "react-native";

import { StateView } from "@/components/common/stateView";
import { TagCard } from "@/components/features/tags/tagCard";
import { Screen, ScreenHeader } from "@/components/layout/screen";
import { useNotesAndTags } from "@/hooks/useNotesAndTags";
import { useTabBarInset } from "@/hooks/useTabBarInset";
import { useTagAppearanceStore } from "@/store";
import { sortByNewest } from "@/utils/dashboardStats";

export default function TagsScreen() {
  const bottomInset = useTabBarInset();
  const { notes, tags, isLoading, error, refetch } = useNotesAndTags();
  const tagAppearance = useTagAppearanceStore((s) => s.tagAppearance);

  const newestNotes = sortByNewest(notes);
  const tagItems = tags
    .map((tag) => {
      const tagNotes = newestNotes.filter((note) => note.tag_id === tag.id);
      return {
        tag,
        notesCount: tagNotes.length,
        lastNoteAt: tagNotes[0]?.created_at,
        isFavorite: !!tagAppearance[String(tag.id)]?.isFavorite,
      };
    })
    // Favorites first, then the busiest tags.
    .sort(
      (a, b) => Number(b.isFavorite) - Number(a.isFavorite) || b.notesCount - a.notesCount,
    );

  const renderEmpty = () => {
    if (isLoading) return <StateView type="loading" />;
    if (error) return <StateView type="error" message={error} onRetry={refetch} />;
    return <StateView type="empty" icon="pricetags-outline" message="No tags yet" />;
  };

  return (
    <Screen>
      <View className="px-5 pb-3">
        <ScreenHeader
          title="Tags"
          action={{ icon: "add", label: "New tag", onPress: () => router.push("/tag/new") }}
        />
      </View>

      <FlatList
        data={tagItems}
        keyExtractor={(item) => String(item.tag.id)}
        renderItem={({ item }) => (
          <TagCard tag={item.tag} notesCount={item.notesCount} lastNoteAt={item.lastNoteAt} />
        )}
        ListEmptyComponent={renderEmpty}
        contentContainerClassName="gap-2 px-5 pt-1"
        contentContainerStyle={{ paddingBottom: bottomInset }}
        refreshControl={
          <RefreshControl refreshing={isLoading && tags.length > 0} onRefresh={refetch} />
        }
      />
    </Screen>
  );
}
