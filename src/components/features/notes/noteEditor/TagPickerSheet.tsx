import { Link } from "expo-router";
import { useState } from "react";
import { FlatList, Modal, Pressable, TextInput, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Icon } from "@/components/common/icon";
import { Text } from "@/components/ui/text";
import { useTagAppearance } from "@/hooks/useTagAppearance";
import type { Tag } from "@/types/tags.interface";

function TagRow({ tag, isSelected, onPress }: { tag: Tag; isSelected: boolean; onPress: () => void }) {
  const { color } = useTagAppearance(tag.id);

  return (
    <Pressable
      onPress={onPress}
      role="radio"
      aria-checked={isSelected}
      className="h-12 flex-row items-center gap-3 border-b border-border/60 active:opacity-70"
    >
      <View className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: color }} />
      <Text numberOfLines={1} className="flex-1 text-[14px]">
        {tag.name}
      </Text>
      {isSelected && <Icon name="checkmark" size={18} className="text-brand" />}
    </Pressable>
  );
}

interface TagPickerSheetProps {
  visible: boolean;
  tags: Tag[];
  selectedTagId: number | null;
  onSelect: (tagId: number) => void;
  onClose: () => void;
}

// Bottom sheet for picking a note's tag: search + one-tap select.
export function TagPickerSheet({ visible, tags, selectedTagId, onSelect, onClose }: TagPickerSheetProps) {
  const { bottom } = useSafeAreaInsets();
  const [query, setQuery] = useState("");

  const normalized = query.trim().toLowerCase();
  const visibleTags = normalized
    ? tags.filter((tag) => tag.name.toLowerCase().includes(normalized))
    : tags;

  const close = () => {
    setQuery("");
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={close}>
      <View className="flex-1 justify-end bg-black/50">
        <Pressable className="flex-1" onPress={close} aria-label="Close" />

        <View
          role="dialog"
          aria-label="Choose tag"
          className="max-h-[70%] gap-3.5 rounded-t-[22px] bg-card px-5 pt-2.5"
          style={{ paddingBottom: bottom + 16 }}
        >
          <View className="h-1 w-9 self-center rounded-full bg-border" />
          <Text className="text-base font-bold">Tag</Text>

          <View className="h-10 flex-row items-center rounded-[10px] border border-border bg-background px-3">
            <Icon name="search" size={15} className="text-muted-foreground" />
            <TextInput
              value={query}
              onChangeText={setQuery}
              placeholder="Find a tag"
              placeholderClassName="text-muted-foreground"
              autoCorrect={false}
              aria-label="Find a tag"
              className="ml-2 h-full flex-1 text-[13.5px] text-foreground"
            />
          </View>

          <FlatList
            data={visibleTags}
            keyExtractor={(tag) => String(tag.id)}
            keyboardShouldPersistTaps="handled"
            renderItem={({ item }) => (
              <TagRow
                tag={item}
                isSelected={item.id === selectedTagId}
                onPress={() => {
                  onSelect(item.id);
                  close();
                }}
              />
            )}
            ListEmptyComponent={
              <View className="items-center gap-2 py-6">
                <Text className="text-[13px] text-muted-foreground">No tags found</Text>
                <Link href="/tag/new" asChild>
                  <Pressable role="link" hitSlop={8} onPress={close}>
                    <Text className="text-[13px] font-semibold text-brand">Create a tag</Text>
                  </Pressable>
                </Link>
              </View>
            }
          />
        </View>
      </View>
    </Modal>
  );
}
