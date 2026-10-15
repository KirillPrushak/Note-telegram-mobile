import { useLocalSearchParams } from "expo-router";

import { NoteEditor } from "@/components/features/notes/noteEditor";

// New note in the same editor; it is created on the first autosave.
export default function NewNoteScreen() {
  // Opened from a tag's screen with that tag preselected.
  const { tagId } = useLocalSearchParams<{ tagId?: string }>();

  return <NoteEditor defaultTagId={tagId ? Number(tagId) : undefined} />;
}
