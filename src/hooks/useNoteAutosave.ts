import { useEffect, useEffectEvent, useRef, useState } from "react";

import { useNoteActions } from "./useNoteActions";

const AUTOSAVE_DELAY_MS = 1200;

export type SaveStatus =
  | "saved" // matches the server
  | "pending" // edited, save scheduled or running
  | "draft" // new note, nothing to save yet
  | "needsTag" // the API requires a tag
  | "empty" // an emptied note is not saved
  | "error"; // last save failed

interface Snapshot {
  message: string;
  tagId: number | null;
}

// Debounced autosave for the note editor. Creates the note on the first
// save, then keeps updating that id. Saves right away on demand (`flush`)
// and when the screen unmounts.
export function useNoteAutosave(initial: { noteId: number | null } & Snapshot) {
  const { create, update } = useNoteActions();
  const [noteId, setNoteId] = useState(initial.noteId);
  const [status, setStatus] = useState<SaveStatus>(initial.noteId ? "saved" : "draft");

  const noteIdRef = useRef(initial.noteId);
  const latest = useRef<Snapshot>({ message: initial.message, tagId: initial.tagId });
  const persisted = useRef<Snapshot>({ message: initial.message, tagId: initial.tagId });
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const inFlight = useRef(false);
  const queued = useRef(false);

  const save = async () => {
    timer.current = null;
    const { message, tagId } = latest.current;

    const unchanged =
      message === persisted.current.message && tagId === persisted.current.tagId;
    if (noteIdRef.current && unchanged) return setStatus("saved");
    if (!message.trim()) return setStatus(noteIdRef.current ? "empty" : "draft");
    if (!tagId) return setStatus("needsTag");
    // One request at a time; edits made meanwhile are saved right after.
    if (inFlight.current) {
      queued.current = true;
      return;
    }

    inFlight.current = true;
    setStatus("pending");
    const data = { message, tag_id: tagId };
    let ok: boolean;
    if (noteIdRef.current) {
      ok = (await update(noteIdRef.current, data)).ok;
    } else {
      const created = await create(data);
      ok = created.ok;
      if (created.ok) {
        noteIdRef.current = created.note.id;
        setNoteId(created.note.id);
      }
    }
    inFlight.current = false;

    if (ok) {
      persisted.current = { message, tagId };
      setStatus("saved");
    } else {
      setStatus("error");
    }

    if (queued.current) {
      queued.current = false;
      void save();
    }
  };

  const schedule = (next: Snapshot, immediately = false) => {
    latest.current = next;
    if (timer.current) clearTimeout(timer.current);
    setStatus("pending");
    timer.current = setTimeout(save, immediately ? 0 : AUTOSAVE_DELAY_MS);
  };

  const flush = () => {
    if (!timer.current) return;
    clearTimeout(timer.current);
    void save();
  };

  // Leaving the screen saves whatever is still waiting for the debounce.
  const flushOnLeave = useEffectEvent(flush);
  useEffect(() => () => flushOnLeave(), []);

  return { noteId, status, schedule, flush, retry: () => void save() };
}
