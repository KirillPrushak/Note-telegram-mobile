import { useEffect } from "react";

import { NOTES_LIMIT_FOR_COUNT } from "@/constants/notes";
import { useBoardStore, useTagsStore } from "@/store";

// All of the user's notes (up to the limit) plus tags, as the web dashboard
// loads them. Shared by the dashboard, notes and tags tabs; fetches once on
// first mount and exposes `refetch` for pull-to-refresh.
export function useNotesAndTags() {
  const notes = useBoardStore((s) => s.notes);
  const notesLoading = useBoardStore((s) => s.isLoading);
  const notesError = useBoardStore((s) => s.error);
  const fetchNotes = useBoardStore((s) => s.fetchNotes);

  const tags = useTagsStore((s) => s.tags);
  const tagsLoading = useTagsStore((s) => s.isLoading);
  const tagsError = useTagsStore((s) => s.error);
  const fetchTags = useTagsStore((s) => s.fetchTags);

  const refetch = () =>
    Promise.all([
      fetchNotes(NOTES_LIMIT_FOR_COUNT),
      fetchTags(1, NOTES_LIMIT_FOR_COUNT),
    ]);

  useEffect(() => {
    const { notes: loadedNotes, isLoading } = useBoardStore.getState();
    if (loadedNotes.length === 0 && !isLoading) refetch();
    // Mount-only: later loads go through `refetch` (pull-to-refresh).
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    notes,
    tags,
    isLoading: notesLoading || tagsLoading,
    error: notesError || tagsError,
    refetch,
  };
}
