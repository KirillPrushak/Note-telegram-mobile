import { useEffect } from "react";
import { RefreshControl, ScrollView, View } from "react-native";

import { StateView } from "@/components/common/stateView";
import { KpiCard } from "@/components/features/kpiCard";
import { RecentNotes } from "@/components/features/notes/recentNotes";
import { TagDistribution } from "@/components/features/tagDistribution";
import { Screen } from "@/components/layout/screen";
import { Text } from "@/components/ui/text";
import { useNotesAndTags } from "@/hooks/useNotesAndTags";
import { usePaginatedNotes } from "@/hooks/usePaginatedNotes";
import { useTabBarInset } from "@/hooks/useTabBarInset";
import { useCurrentUser, useTagAppearanceStore } from "@/store";
import { getDashboardKpis, getTagDistribution, sortByNewest } from "@/utils/dashboardStats";

export default function DashboardScreen() {
  const bottomInset = useTabBarInset();
  const { notes, tags, isLoading, error, refetch } = useNotesAndTags();
  // Stats use the latest 100 notes; the total comes from the API meta, which
  // counts every note (this also prefetches the Notes tab).
  const { totalItems } = usePaginatedNotes();

  const fetchCurrentUser = useCurrentUser((s) => s.fetchCurrentUser);
  const userName = useCurrentUser((s) => s.getUserName());
  const userInitials = useCurrentUser((s) => s.getUserInitials());
  const tagAppearance = useTagAppearanceStore((s) => s.tagAppearance);

  useEffect(() => {
    fetchCurrentUser();
  }, [fetchCurrentUser]);

  const { notesTrend, tagsTrend, notesWeek, weekTrend } = getDashboardKpis(notes, tags);
  const favoriteTags = tags.filter((tag) => tagAppearance[String(tag.id)]?.isFavorite).length;
  const distribution = getTagDistribution(notes, tags, tagAppearance);
  const recentNotes = sortByNewest(notes).slice(0, 3);
  const hasData = notes.length > 0 || tags.length > 0;

  return (
    <Screen>
      <ScrollView
        contentContainerClassName="gap-5 px-5"
        contentContainerStyle={{ paddingBottom: bottomInset }}
        refreshControl={
          <RefreshControl refreshing={isLoading && hasData} onRefresh={refetch} />
        }
      >
        <View className="flex-row items-center gap-3">
          <View className="h-[42px] w-[42px] items-center justify-center rounded-full bg-brand/10">
            <Text className="text-sm font-bold text-brand">{userInitials}</Text>
          </View>
          <View>
            <Text className="text-base font-bold leading-5">Hi, {userName}</Text>
            <Text className="text-[12.5px] text-muted-foreground">Overview of your notes</Text>
          </View>
        </View>

        {!hasData && isLoading ? (
          <StateView type="loading" />
        ) : !hasData && error ? (
          <StateView type="error" message={error} onRetry={refetch} />
        ) : (
          <>
            <View className="gap-3">
              <View className="flex-row gap-3">
                <KpiCard label="Total notes" value={Math.max(totalItems, notes.length)} icon="document-text-outline" tone="brand" trend={notesTrend} />
                <KpiCard label="Tags" value={tags.length} icon="pricetag-outline" tone="success" trend={tagsTrend} />
              </View>
              <View className="flex-row gap-3">
                <KpiCard label="This week" value={notesWeek} icon="time-outline" tone="info" trend={weekTrend} />
                <KpiCard label="Favorites" value={favoriteTags} icon="star" tone="warning" />
              </View>
            </View>

            {distribution.length > 0 && <TagDistribution items={distribution} />}

            <RecentNotes notes={recentNotes} />
          </>
        )}
      </ScrollView>
    </Screen>
  );
}
