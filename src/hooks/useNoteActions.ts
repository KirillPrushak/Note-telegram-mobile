import { notesUserApi } from "@/api";
import { NOTES_LIMIT_FOR_COUNT, NOTES_PAGE_SIZE } from "@/constants/notes";
import { useBoardStore, useNotesStore, useTagsStore } from "@/store";
import type { CreateNoteDto, Note, UpdateNoteDto } from "@/types/note.interface";
import { getApiErrorMessage } from "@/utils/apiError";
import { confirmAction, showError } from "@/utils/confirm";
import { splitNoteMessage } from "@/utils/noteText";

type ActionResult = { ok: true } | { ok: false; error: string };

// Note CRUD as on web (useNoteActions). Two lists hold notes: the paginated
// Notes tab (useNotesStore) and the latest-100 window behind the dashboard
// and tags (useBoardStore); every change has to reach both.
export function useNoteActions() {
  const reloadBoard = () => useBoardStore.getState().fetchNotes(NOTES_LIMIT_FOR_COUNT);

  // Resolves with the created note: the editor keeps its id so the next
  // autosaves update it instead of creating duplicates.
  const create = async (
    data: CreateNoteDto,
  ): Promise<{ ok: true; note: Note } | { ok: false; error: string }> => {
    try {
      const response = await notesUserApi.createNote(data);
      // The new note goes on top: restart the paginated list from page 1.
      await Promise.all([
        reloadBoard(),
        useNotesStore.getState().fetchNotes(1, NOTES_PAGE_SIZE),
      ]);
      return { ok: true, note: response.data.data };
    } catch (error) {
      return { ok: false, error: getApiErrorMessage(error, "Couldn't create the note") };
    }
  };

  const update = async (id: number, data: UpdateNoteDto): Promise<ActionResult> => {
    try {
      await notesUserApi.updateNote(id, data);
      // Patch in place: reloading page 1 would throw away the pages the user
      // has already scrolled through.
      const tagName = useTagsStore.getState().tags.find((tag) => tag.id === data.tag_id)?.name;
      const patch = (note: Note) =>
        note.id === id
          ? {
              ...note,
              message: data.message,
              tag_id: data.tag_id,
              tag: tagName ?? note.tag,
              updated_at: new Date().toISOString(),
            }
          : note;
      useNotesStore.setState((state) => ({ notes: state.notes.map(patch) }));
      useBoardStore.setState((state) => ({ notes: state.notes.map(patch) }));
      return { ok: true };
    } catch (error) {
      return { ok: false, error: getApiErrorMessage(error, "Couldn't save the note") };
    }
  };

  // Asks for confirmation; resolves true only if the note was deleted.
  const remove = async (note: Note): Promise<boolean> => {
    const confirmed = await confirmAction({
      title: "Delete this note?",
      message: `"${splitNoteMessage(note.message).title}" will be deleted. This action cannot be undone.`,
      confirmLabel: "Delete",
    });
    if (!confirmed) return false;

    try {
      await notesUserApi.deleteNote(note.id);
      useNotesStore.setState((state) => ({
        notes: state.notes.filter((item) => item.id !== note.id),
        totalItems: Math.max(0, state.totalItems - 1),
      }));
      useBoardStore.setState((state) => ({
        notes: state.notes.filter((item) => item.id !== note.id),
      }));
      return true;
    } catch (error) {
      showError("Couldn't delete", getApiErrorMessage(error, "Please try again"));
      return false;
    }
  };

  return { create, update, remove };
}
