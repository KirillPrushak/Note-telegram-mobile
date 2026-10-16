import { useEffect, useState } from "react";

import { notesUserApi } from "@/api";
import { useBoardStore, useNotesStore, useTagsStore } from "@/store";
import type { Note } from "@/types/note.interface";
import { getApiErrorMessage } from "@/utils/apiError";

// One note by id: taken from the loaded lists (paginated list or the
// dashboard's latest-100 window), otherwise fetched from the server, e.g.
// a note that is older than everything loaded so far.
export function useNote(id: number) {
  const fromList = useNotesStore((s) => s.notes.find((note) => note.id === id));
  const fromBoard = useBoardStore((s) => s.notes.find((note) => note.id === id));
  const tags = useTagsStore((s) => s.tags);
  const loadedNote = fromList ?? fromBoard;

  const [fetched, setFetched] = useState<Note | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(!loadedNote);

  useEffect(() => {
    if (loadedNote || Number.isNaN(id)) return;
    let cancelled = false;

    notesUserApi
      .getNoteUserById(id)
      .then((response) => {
        if (!cancelled) setFetched(response.data.data);
      })
      .catch((err) => {
        if (!cancelled) setError(getApiErrorMessage(err, "Couldn't load the note"));
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [id, loadedNote]);

  // The API returns the tag name only; resolve its id like the stores do.
  const note =
    loadedNote ??
    (fetched
      ? { ...fetched, tag_id: tags.find((tag) => tag.name === fetched.tag)?.id || 0 }
      : undefined);

  return { note, isLoading: !note && isLoading, error };
}
