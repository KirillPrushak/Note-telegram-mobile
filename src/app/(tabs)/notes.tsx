import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  View,
} from "react-native";

import { SearchInput } from "@/components/common/searchInput";
import { StateView } from "@/components/common/stateView";
import { NoteCard } from "@/components/features/notes/noteCard";
import { TagFilterArrows } from "@/components/features/notes/tagFilter";
import { Screen, ScreenHeader } from "@/components/layout/screen";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { useNotesAndTags } from "@/hooks/useNotesAndTags";
import { usePaginatedNotes } from "@/hooks/usePaginatedNotes";
import { useTabBarInset } from "@/hooks/useTabBarInset";
import { notesLabel } from "@/utils/plural";

export default function NotesScreen() {
  const bottomInset = useTabBarInset();
  const { tags } = useNotesAndTags();
  const {
    notes,
    totalItems,
    hasMore,
    isLoading,
    isLoadingMore,
    error,
    refresh,
    fetchNextPage,
  } = usePaginatedNotes();
  const [query, setQuery] = useState("");
  const [activeTagId, setActiveTagId] = useState<number | null>(null);

  // Search and the tag filter run over the pages loaded so far (the API has
  // no search params). A short filtered list reaches the end right away, so
  // onEndReached keeps loading pages until it fills up or runs out.
  const normalizedQuery = query.trim().toLowerCase();
  const isFiltering = activeTagId !== null || !!normalizedQuery;
  const visibleNotes = notes.filter(
    (note) =>
      (activeTagId === null || note.tag_id === activeTagId) &&
      (!normalizedQuery ||
        note.message?.toLowerCase().includes(normalizedQuery)),
  );

  // An empty filtered list never reaches its end, so keep paging until a
  // match shows up or the pages run out.
  const needsMoreForFilter =
    isFiltering && visibleNotes.length === 0 && hasMore;
  useEffect(() => {
    if (needsMoreForFilter && !isLoadingMore) fetchNextPage();
  }, [needsMoreForFilter, isLoadingMore, fetchNextPage]);

  const renderEmpty = () => {
    if (isLoading || (isFiltering && hasMore))
      return <StateView type="loading" />;
    if (error)
      return <StateView type="error" message={error} onRetry={refresh} />;
    return (
      <StateView
        type="empty"
        message={notes.length === 0 ? "No notes yet" : "Nothing found"}
      />
    );
  };

  const renderFooter = () => {
    if (isLoadingMore) {
      return (
        <View className="items-center py-4">
          <ActivityIndicator />
        </View>
      );
    }
    if (hasMore && visibleNotes.length > 0) {
      return (
        <Button variant="ghost" onPress={fetchNextPage} className="self-center">
          <Text className="text-muted-foreground">Load more</Text>
        </Button>
      );
    }
    if (!hasMore && visibleNotes.length > 0 && !isFiltering) {
      return (
        <Text className="py-4 text-center text-xs text-muted-foreground">
          That’s all, {notesLabel(totalItems)}
        </Text>
      );
    }
    return null;
  };

  return (
    <Screen>
      <View className="gap-3 px-5 pb-3">
        <ScreenHeader
          title="Notes"
          action={{
            icon: "add",
            label: "New note",
            onPress: () => router.push("/note/new"),
          }}
        />
        <SearchInput
          value={query}
          onChangeText={setQuery}
          placeholder="Search notes"
        />
      </View>

      {tags.length > 0 && (
        <TagFilterArrows
          tags={tags}
          activeTagId={activeTagId}
          onChange={setActiveTagId}
        />
      )}

      <FlatList
        data={visibleNotes}
        keyExtractor={(note) => String(note.id)}
        renderItem={({ item }) => <NoteCard note={item} />}
        ListEmptyComponent={renderEmpty}
        ListFooterComponent={renderFooter}
        onEndReached={() => {
          if (hasMore) fetchNextPage();
        }}
        onEndReachedThreshold={0.5}
        contentContainerClassName="gap-2.5 px-5 pt-1"
        contentContainerStyle={{ paddingBottom: bottomInset }}
        keyboardDismissMode="on-drag"
        refreshControl={
          <RefreshControl
            refreshing={isLoading && notes.length > 0}
            onRefresh={refresh}
          />
        }
      />
    </Screen>
  );
}
