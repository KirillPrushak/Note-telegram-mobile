import { Link } from "expo-router";
import { useState } from "react";
import { Pressable, TextInput, View } from "react-native";

import { FormMessage } from "@/components/common/formMessage";
import { PrimaryButton } from "@/components/common/primaryButton";
import { SettingsSection } from "@/components/common/settingsSection";
import { Text } from "@/components/ui/text";
import { useNotesAndTags } from "@/hooks/useNotesAndTags";
import type { Note, UpdateNoteDto } from "@/types/note.interface";
import { TagOption } from "./TagOption";

type SubmitResult = { ok: true } | { ok: false; error: string };

interface NoteFormProps {
  initialNote?: Note;
  defaultTagId?: number;
  submitLabel: string;
  onSubmit: (data: UpdateNoteDto) => Promise<SubmitResult>;
}

// Create / edit form: both fields are required, as on web.
export function NoteForm({ initialNote, defaultTagId, submitLabel, onSubmit }: NoteFormProps) {
  const { tags } = useNotesAndTags();
  const [message, setMessage] = useState(initialNote?.message ?? "");
  const [tagId, setTagId] = useState<number | null>(initialNote?.tag_id || defaultTagId || null);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const trimmed = message.trim();
  const isUnchanged =
    !!initialNote && trimmed === initialNote.message?.trim() && tagId === initialNote.tag_id;

  const submit = async () => {
    if (!tagId) return setError("Choose a tag");
    if (!trimmed) return setError("Enter the note text");

    setIsSubmitting(true);
    setError(null);
    const result = await onSubmit({ message: trimmed, tag_id: tagId });
    if (!result.ok) {
      setError(result.error);
      setIsSubmitting(false);
    }
    // On success the screen closes, so the form is not touched again.
  };

  return (
    <View className="gap-[22px]">
      <SettingsSection title="Tag">
        {tags.length === 0 ? (
          <View className="flex-row flex-wrap items-center gap-1">
            <Text className="text-[13px] text-muted-foreground">No tags yet.</Text>
            <Link href="/tag/new" asChild>
              <Pressable role="link" hitSlop={8}>
                <Text className="text-[13px] font-semibold text-brand">Create a tag</Text>
              </Pressable>
            </Link>
          </View>
        ) : (
          <View role="radiogroup" className="flex-row flex-wrap gap-2">
            {tags.map((tag) => (
              <TagOption
                key={tag.id}
                tag={tag}
                isSelected={tag.id === tagId}
                onPress={() => {
                  setTagId(tag.id);
                  setError(null);
                }}
              />
            ))}
          </View>
        )}
      </SettingsSection>

      <SettingsSection title="Text">
        <TextInput
          value={message}
          onChangeText={(value) => {
            setMessage(value);
            setError(null);
          }}
          placeholder="The first line becomes the note title"
          placeholderClassName="text-muted-foreground"
          multiline
          textAlignVertical="top"
          autoFocus={!initialNote}
          aria-label="Note text"
          className="min-h-[200px] rounded-[10px] border border-border bg-background p-3 text-[15px] leading-6 text-foreground"
        />
      </SettingsSection>

      {error && <FormMessage tone="error" message={error} />}

      <PrimaryButton
        label={submitLabel}
        icon="checkmark"
        onPress={submit}
        isLoading={isSubmitting}
        disabled={isUnchanged}
      />
    </View>
  );
}
