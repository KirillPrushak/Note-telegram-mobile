import { router, useLocalSearchParams } from "expo-router";
import { View } from "react-native";

import { StateView } from "@/components/common/stateView";
import { NoteEditor } from "@/components/features/notes/noteEditor";
import { useNote } from "@/hooks/useNote";

// A note opens straight in the editor: reading and editing are one screen.
export default function NoteScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { note, isLoading, error } = useNote(Number(id));

  if (!note) {
    return (
      <View className="flex-1 bg-background px-5">
        {isLoading ? (
          <StateView type="loading" />
        ) : error ? (
          <StateView
            type="error"
            message={error}
            onRetry={() => router.replace({ pathname: "/note/[id]", params: { id } })}
          />
        ) : (
          <StateView type="empty" message="Note not found" />
        )}
      </View>
    );
  }

  // Keyed by id: the editor takes the note as its initial state only, so
  // later store updates (after its own autosaves) don't reset the text.
  return <NoteEditor key={note.id} note={note} />;
}
