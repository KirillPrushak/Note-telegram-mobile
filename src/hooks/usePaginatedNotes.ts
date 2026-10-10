import { useEffect } from "react";

import { NOTES_PAGE_SIZE } from "@/constants/notes";
import { useNotesStore } from "@/store";

// Server-paginated notes (same API as the web pagination), loaded page by
// page for infinite scroll. `notes` is every page loaded so far.
export function usePaginatedNotes() {
  const notes = useNotesStore((s) => s.notes);
  const totalItems = useNotesStore((s) => s.totalItems);
  const hasMore = useNotesStore((s) => s.currentPage < s.totalPages);
  const isLoading = useNotesStore((s) => s.isLoading);
  const isLoadingMore = useNotesStore((s) => s.isLoadingMore);
  const error = useNotesStore((s) => s.error);
  const fetchNotes = useNotesStore((s) => s.fetchNotes);
  const fetchNextPage = useNotesStore((s) => s.fetchNextPage);

  const refresh = () => fetchNotes(1, NOTES_PAGE_SIZE);

  useEffect(() => {
    const { notes: loadedNotes, isLoading: loading } = useNotesStore.getState();
    if (loadedNotes.length === 0 && !loading) refresh();
    // Mount-only: later loads go through `refresh` / `fetchNextPage`.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { notes, totalItems, hasMore, isLoading, isLoadingMore, error, refresh, fetchNextPage };
}
