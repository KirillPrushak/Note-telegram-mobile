import { tagsApi } from "@/api";
import { NOTES_LIMIT_FOR_COUNT, NOTES_PAGE_SIZE } from "@/constants/notes";
import { useBoardStore, useNotesStore, useTagAppearanceStore, useTagsStore } from "@/store";
import type { CreateTagDto, Tag } from "@/types/tags.interface";
import { getApiErrorMessage } from "@/utils/apiError";
import { confirmAction, showError } from "@/utils/confirm";

type CreateResult = { ok: true; tag: Tag } | { ok: false; error: string };

// Tag CRUD as on web (useTagActions). Rename lives in TagNameForm.
export function useTagActions() {
  const fetchTags = useTagsStore((s) => s.fetchTags);
  const fetchNotes = useBoardStore((s) => s.fetchNotes);

  const create = async (data: CreateTagDto): Promise<CreateResult> => {
    try {
      const response = await tagsApi.createTag(data);
      await fetchTags(1, NOTES_LIMIT_FOR_COUNT);
      return { ok: true, tag: response.data.data };
    } catch (error) {
      return { ok: false, error: getApiErrorMessage(error, "Couldn't create the tag") };
    }
  };

  // Asks for confirmation; resolves true only if the tag was deleted.
  const remove = async (tag: Tag): Promise<boolean> => {
    const confirmed = await confirmAction({
      title: "Delete this tag?",
      message: `"${tag.name}" will be deleted. This action cannot be undone.`,
      confirmLabel: "Delete",
    });
    if (!confirmed) return false;

    try {
      await tagsApi.deleteTag(tag.id);
      useTagAppearanceStore.getState().removeAppearance(String(tag.id));
      // What happens to the tag's notes is up to the backend: reload both.
      await Promise.all([
        fetchTags(1, NOTES_LIMIT_FOR_COUNT),
        fetchNotes(NOTES_LIMIT_FOR_COUNT),
        useNotesStore.getState().fetchNotes(1, NOTES_PAGE_SIZE),
      ]);
      return true;
    } catch (error) {
      showError("Couldn't delete", getApiErrorMessage(error, "Please try again"));
      return false;
    }
  };

  return { create, remove };
}
