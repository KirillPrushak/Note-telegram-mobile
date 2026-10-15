import * as Clipboard from "expo-clipboard";
import { Stack, router } from "expo-router";
import { useEffect, useState, type ReactNode } from "react";
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { DropdownMenu, type DropdownMenuItem } from "@/components/common/dropdownMenu";
import { Icon, type IconName } from "@/components/common/icon";
import { Text } from "@/components/ui/text";
import { useNoteActions } from "@/hooks/useNoteActions";
import { type SaveStatus, useNoteAutosave } from "@/hooks/useNoteAutosave";
import { useNotesAndTags } from "@/hooks/useNotesAndTags";
import { useTagAppearance } from "@/hooks/useTagAppearance";
import { cn } from "@/lib/utils";
import type { Note } from "@/types/note.interface";
import { showError } from "@/utils/confirm";
import { TagPickerSheet } from "./TagPickerSheet";

// Normal autosave states stay silent; the header only speaks up when an
// edit would otherwise be lost.
const STATUS_WARNING: Partial<Record<SaveStatus, string>> = {
  needsTag: "Choose a tag to save",
  empty: "Empty note isn’t saved",
  error: "Not saved · Retry",
};

const formatDate = (dateStr?: string) => {
  if (!dateStr) return null;
  const date = new Date(dateStr);
  if (Number.isNaN(date.getTime())) return null;
  return date.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

function PropertyRow({ icon, label, children }: { icon: IconName; label: string; children: ReactNode }) {
  return (
    <View className="min-h-[34px] flex-row items-center">
      <View className="w-24 flex-row items-center gap-2">
        <Icon name={icon} size={15} className="text-muted-foreground" />
        <Text className="text-[13px] text-muted-foreground">{label}</Text>
      </View>
      <View className="min-w-0 flex-1 flex-row">{children}</View>
    </View>
  );
}

function TagChip({ tagId, tagName, onPress }: { tagId: number | null; tagName?: string; onPress: () => void }) {
  const { color, soft } = useTagAppearance(tagId ?? undefined);
  const hasTag = !!tagId && !!tagName;

  return (
    <Pressable
      onPress={onPress}
      role="button"
      aria-label={hasTag ? `Tag ${tagName}, change` : "Add tag"}
      className="h-[30px] max-w-full flex-row items-center gap-1.5 rounded-lg px-2.5 active:opacity-70"
      style={hasTag ? { backgroundColor: soft } : undefined}
    >
      {hasTag && <View className="h-2 w-2 rounded-full" style={{ backgroundColor: color }} />}
      <Text
        numberOfLines={1}
        className={cn("shrink text-[13px] font-medium", !hasTag && "text-muted-foreground")}
      >
        {hasTag ? tagName : "Add tag"}
      </Text>
      <Icon name="chevron-down" size={13} className="text-muted-foreground" />
    </Pressable>
  );
}

interface NoteEditorProps {
  // Existing note; omitted for a new one.
  note?: Note;
  defaultTagId?: number;
}

// The API stores a note as one `message`; trailing whitespace is not saved.
const toMessage = (value: string) => value.replace(/\s+$/, "");

// One screen to read and edit a note (Notion-like): tag/dates as properties
// above the full text, changes autosave. No separate title field: lists
// show the first line as the title.
export function NoteEditor({ note, defaultTagId }: NoteEditorProps) {
  const { top, bottom } = useSafeAreaInsets();
  const { tags } = useNotesAndTags();
  const { remove } = useNoteActions();

  const [text, setText] = useState(note?.message ?? "");
  const [tagId, setTagId] = useState<number | null>(note?.tag_id || defaultTagId || null);
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);

  const autosave = useNoteAutosave({
    noteId: note?.id ?? null,
    message: note?.message ?? "",
    tagId: note?.tag_id || null,
  });

  useEffect(() => {
    const show = Keyboard.addListener("keyboardDidShow", () => setIsKeyboardVisible(true));
    const hide = Keyboard.addListener("keyboardDidHide", () => setIsKeyboardVisible(false));
    return () => {
      show.remove();
      hide.remove();
    };
  }, []);

  const changeText = (value: string) => {
    setText(value);
    autosave.schedule({ message: toMessage(value), tagId });
  };

  const changeTag = (value: number) => {
    setTagId(value);
    autosave.schedule({ message: toMessage(text), tagId: value }, true);
  };

  const done = () => {
    Keyboard.dismiss();
    autosave.flush();
  };

  const copyText = async () => {
    try {
      await Clipboard.setStringAsync(toMessage(text));
    } catch {
      showError("Couldn't copy", "Please try again");
    }
  };

  const deleteNote = async () => {
    if (!autosave.noteId) return;
    const deleted = await remove({ id: autosave.noteId, message: toMessage(text) });
    if (deleted) router.back();
  };

  const menuItems: DropdownMenuItem[] = [
    { label: "Copy", description: "Copy the note text", icon: "copy-outline", onPress: copyText },
  ];
  if (autosave.noteId) {
    menuItems.push({ label: "Delete", icon: "trash-outline", destructive: true, onPress: deleteNote });
  }

  const tagName = tags.find((tag) => tag.id === tagId)?.name ?? note?.tag;
  const createdAt = formatDate(note?.created_at);
  const updatedAt = formatDate(note?.updated_at);
  const isError = autosave.status === "error";
  const statusWarning = STATUS_WARNING[autosave.status];

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      // iOS: the native stack header (44pt) sits above this view.
      keyboardVerticalOffset={Platform.OS === "ios" ? top + 44 : 0}
      className="flex-1 bg-background"
    >
      <Stack.Screen
        options={{
          title: "",
          headerRight: () => (
            <View className="flex-row items-center gap-1">
              {statusWarning && (
                <Pressable
                  onPress={isError ? autosave.retry : undefined}
                  disabled={!isError}
                  hitSlop={8}
                >
                  <Text
                    className={cn(
                      "text-xs",
                      isError ? "text-destructive" : "text-muted-foreground",
                    )}
                  >
                    {statusWarning}
                  </Text>
                </Pressable>
              )}
              <DropdownMenu
                items={menuItems}
                triggerIcon="ellipsis-horizontal"
                triggerLabel="Note actions"
                triggerClassName="h-10 w-10 items-center justify-center rounded-full active:bg-muted"
                triggerIconClassName="text-foreground"
              />
            </View>
          ),
        }}
      />

      <ScrollView
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="interactive"
        contentContainerClassName="gap-3 px-5 pt-1"
        contentContainerStyle={{ paddingBottom: isKeyboardVisible ? 24 : bottom + 24 }}
      >
        <View className="gap-0.5">
          <PropertyRow icon="pricetag-outline" label="Tag">
            <TagChip tagId={tagId} tagName={tagName} onPress={() => setIsPickerOpen(true)} />
          </PropertyRow>
          {createdAt && (
            <PropertyRow icon="calendar-outline" label="Created">
              <Text className="text-[13px] text-foreground/85">{createdAt}</Text>
            </PropertyRow>
          )}
          {updatedAt && (
            <PropertyRow icon="create-outline" label="Updated">
              <Text className="text-[13px] text-foreground/85">{updatedAt}</Text>
            </PropertyRow>
          )}
        </View>

        <View className="h-px bg-border/60" />

        <TextInput
          value={text}
          onChangeText={changeText}
          placeholder="Start writing…"
          autoFocus={!note}
          placeholderClassName="text-muted-foreground/60"
          multiline
          scrollEnabled={false}
          textAlignVertical="top"
          aria-label="Note text"
          className="min-h-[240px] p-0 text-[15px] leading-6 text-foreground"
        />
      </ScrollView>

      {isKeyboardVisible && (
        // Floating "Done" centered a little above the keyboard.
        <View className="items-center pb-3 pt-2">
          <Pressable
            onPress={done}
            role="button"
            hitSlop={6}
            className="h-9 justify-center rounded-full bg-brand px-6 shadow-md shadow-black/20 active:opacity-80"
          >
            <Text className="text-[14px] font-semibold text-brand-foreground">Done</Text>
          </Pressable>
        </View>
      )}

      <TagPickerSheet
        visible={isPickerOpen}
        tags={tags}
        selectedTagId={tagId}
        onSelect={changeTag}
        onClose={() => setIsPickerOpen(false)}
      />
    </KeyboardAvoidingView>
  );
}
