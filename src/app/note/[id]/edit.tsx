import { router, useLocalSearchParams } from "expo-router";

import { StateView } from "@/components/common/stateView";
import { NoteForm } from "@/components/features/notes/noteForm";
import { FormScreen } from "@/components/layout/formScreen";
import { useNoteActions } from "@/hooks/useNoteActions";
import { useNote } from "@/hooks/useNote";

export default function EditNoteScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { note, isLoading } = useNote(Number(id));
  const { update } = useNoteActions();

  return (
    <FormScreen>
      {isLoading ? (
        <StateView type="loading" />
      ) : note ? (
        <NoteForm
          initialNote={note}
          submitLabel="Save"
          onSubmit={async (data) => {
            const result = await update(note.id, data);
            if (result.ok) router.back();
            return result;
          }}
        />
      ) : (
        <StateView type="empty" message="Note not found" />
      )}
    </FormScreen>
  );
}
