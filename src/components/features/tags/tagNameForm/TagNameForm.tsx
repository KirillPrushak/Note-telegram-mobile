import { useState } from "react";
import { ActivityIndicator, TextInput, View } from "react-native";

import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { useBoardStore, useNotesStore, useTagsStore } from "@/store";
import type { Tag } from "@/types/tags.interface";

// Rename a tag on the server. Notes carry the tag *name*, so the loaded
// notes are patched locally to keep badges in sync without a refetch.
export function TagNameForm({ tag }: { tag: Tag }) {
  const updateTag = useTagsStore((s) => s.updateTag);
  const [name, setName] = useState(tag.name);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const trimmed = name.trim();
  const canSave = !!trimmed && trimmed !== tag.name && !isSaving;

  const save = async () => {
    if (!canSave) return;
    setIsSaving(true);
    setError(null);

    await updateTag(tag.id, { name: trimmed });
    const storeError = useTagsStore.getState().error;

    if (storeError) {
      setError(storeError);
    } else {
      useBoardStore.setState((state) => ({
        notes: state.notes.map((note) =>
          note.tag_id === tag.id ? { ...note, tag: trimmed } : note,
        ),
        tags: state.tags.map((item) => (item.id === tag.id ? { ...item, name: trimmed } : item)),
      }));
      useNotesStore.setState((state) => ({
        notes: state.notes.map((note) =>
          note.tag_id === tag.id ? { ...note, tag: trimmed } : note,
        ),
      }));
    }
    setIsSaving(false);
  };

  return (
    <View className="gap-2">
      <View className="flex-row gap-2">
        <TextInput
          value={name}
          onChangeText={(value) => {
            setName(value);
            setError(null);
          }}
          onSubmitEditing={save}
          returnKeyType="done"
          maxLength={50}
          aria-label="Tag name"
          className="h-11 flex-1 rounded-[10px] border border-border bg-background px-3 text-[14px] text-foreground"
        />
        <Button
          onPress={save}
          disabled={!canSave}
          className="h-11 rounded-[10px] bg-brand px-4 active:bg-brand/90"
        >
          {isSaving ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className="font-semibold text-brand-foreground">Save</Text>
          )}
        </Button>
      </View>
      {error && <Text className="text-xs text-destructive">{error}</Text>}
    </View>
  );
}
