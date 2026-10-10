import { router, useLocalSearchParams } from "expo-router";

import { NoteForm } from "@/components/features/notes/noteForm";
import { FormScreen } from "@/components/layout/formScreen";
import { useNoteActions } from "@/hooks/useNoteActions";

export default function NewNoteScreen() {
  // Opened from a tag's screen with that tag preselected.
  const { tagId } = useLocalSearchParams<{ tagId?: string }>();
  const { create } = useNoteActions();

  return (
    <FormScreen>
      <NoteForm
        defaultTagId={tagId ? Number(tagId) : undefined}
        submitLabel="Create note"
        onSubmit={async (data) => {
          const result = await create(data);
          if (result.ok) router.back();
          return result;
        }}
      />
    </FormScreen>
  );
}
