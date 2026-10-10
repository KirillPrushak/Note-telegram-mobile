import { View } from "react-native";

import { Text } from "@/components/ui/text";
import { useNotesAndTags } from "@/hooks/useNotesAndTags";
import { usePaginatedNotes } from "@/hooks/usePaginatedNotes";

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <View className="flex-1 items-center gap-0.5">
      <Text className="text-lg font-bold">{value}</Text>
      <Text className="text-[11.5px] text-muted-foreground">{label}</Text>
    </View>
  );
}

// Notes / tags / first note at a glance.
export function ProfileStats() {
  const { notes, tags } = useNotesAndTags();
  const { totalItems } = usePaginatedNotes();
  const total = Math.max(totalItems, notes.length);

  // Only the latest 100 notes are loaded, so the oldest of them is the
  // user's first note only when every note is loaded.
  const allLoaded = total > 0 && notes.length >= total;
  const firstNoteTime = allLoaded
    ? Math.min(
        ...notes
          .map((note) => new Date(note.created_at ?? "").getTime())
          .filter((time) => !Number.isNaN(time)),
      )
    : NaN;

  return (
    <View className="flex-row items-center">
      <Stat label="Notes" value={String(total)} />
      <Stat label="Tags" value={String(tags.length)} />
      {Number.isFinite(firstNoteTime) && (
        <>
          <Stat
            label="First note"
            value={new Date(firstNoteTime).toLocaleDateString("en-US", {
              month: "short",
              year: "numeric",
            })}
          />
        </>
      )}
    </View>
  );
}
