import type { DistributionItem } from "@/components/features/tagDistribution";
import type { KpiTrend } from "@/components/features/kpiCard";
import { OTHER_TAG_COLOR } from "@/constants/tagColors";
import type { TagAppearance } from "@/store/tagAppearance.store";
import { getTagStyle } from "./tagStyle";
import type { Note } from "@/types/note.interface";
import type { Tag } from "@/types/tags.interface";

const DAY = 24 * 60 * 60 * 1000;

const countInRange = (
  items: { created_at?: string }[],
  fromDaysAgo: number,
  toDaysAgo: number,
) => {
  const now = Date.now();
  const from = now - fromDaysAgo * DAY;
  const to = now - toDaysAgo * DAY;
  return items.filter((item) => {
    if (!item.created_at) return false;
    const time = new Date(item.created_at).getTime();
    return time >= from && time < to;
  }).length;
};

const signed = (n: number) => (n > 0 ? `+${n}` : String(n));

export const getDashboardKpis = (notes: Note[], tags: Tag[]) => {
  // Notes: last 30 days vs the 30 before, in percent (as on web).
  const notesMonth = countInRange(notes, 30, 0);
  const notesPrevMonth = countInRange(notes, 60, 30);
  const notesTrend: KpiTrend | undefined =
    notesPrevMonth > 0
      ? (() => {
          const percent = Math.round(((notesMonth - notesPrevMonth) / notesPrevMonth) * 100);
          return { value: `${signed(percent)}%`, isPositive: percent >= 0, caption: "this month" };
        })()
      : undefined;

  const newTags = countInRange(tags, 30, 0);
  const tagsTrend: KpiTrend | undefined =
    newTags > 0 ? { value: `+${newTags}`, isPositive: true, caption: "this month" } : undefined;

  const notesWeek = countInRange(notes, 7, 0);
  const weekDiff = notesWeek - countInRange(notes, 14, 7);
  const weekTrend: KpiTrend = {
    value: signed(weekDiff),
    isPositive: weekDiff >= 0,
    caption: "vs last week",
  };

  return { notesTrend, tagsTrend, notesWeek, weekTrend };
};

// Top tags by note count; everything past `limit` folds into "Other".
export const getTagDistribution = (
  notes: Note[],
  tags: Tag[],
  appearance: Record<string, TagAppearance>,
  limit = 3,
): DistributionItem[] => {
  const sorted = tags
    .map((tag) => ({
      tag,
      count: notes.filter((note) => note.tag_id === tag.id).length,
    }))
    .filter((item) => item.count > 0)
    .sort((a, b) => b.count - a.count);

  const top: DistributionItem[] = sorted.slice(0, limit).map(({ tag, count }) => ({
    label: tag.name,
    count,
    color: getTagStyle(tag.id, appearance[String(tag.id)]).color,
  }));

  const otherCount = sorted.slice(limit).reduce((sum, item) => sum + item.count, 0);
  if (otherCount > 0) {
    top.push({ label: "Other", count: otherCount, color: OTHER_TAG_COLOR });
  }

  return top;
};

export const sortByNewest = (notes: Note[]) =>
  [...notes].sort(
    (a, b) =>
      new Date(b.created_at ?? 0).getTime() - new Date(a.created_at ?? 0).getTime(),
  );
