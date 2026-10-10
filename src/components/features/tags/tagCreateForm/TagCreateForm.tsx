import { useState } from "react";
import { TextInput, View } from "react-native";

import { FormMessage } from "@/components/common/formMessage";
import { PrimaryButton } from "@/components/common/primaryButton";
import { SettingsSection, SwitchRow } from "@/components/common/settingsSection";
import { TagColorPicker } from "@/components/features/tags/tagColorPicker";
import { TagIconPicker } from "@/components/features/tags/tagIconPicker";
import { TAG_COLORS } from "@/constants/tagColors";
import { DEFAULT_TAG_ICON } from "@/constants/tagIcons";
import { useTagActions } from "@/hooks/useTagActions";
import { useTagAppearanceStore } from "@/store";
import type { Tag } from "@/types/tags.interface";

const DEFAULT_COLOR = TAG_COLORS[0];

// Port of web CreateTagPanel: name goes to the server, the look and the
// switches are saved locally for the new tag id.
export function TagCreateForm({ onCreated }: { onCreated: (tag: Tag) => void }) {
  const { create } = useTagActions();
  const setAppearance = useTagAppearanceStore((s) => s.setAppearance);

  const [name, setName] = useState("");
  const [icon, setIcon] = useState(DEFAULT_TAG_ICON);
  const [colorName, setColorName] = useState<string>(DEFAULT_COLOR.name);
  const [isFavorite, setIsFavorite] = useState(false);
  const [botVisible, setBotVisible] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const color = TAG_COLORS.find((item) => item.name === colorName)?.value ?? DEFAULT_COLOR.value;

  const submit = async () => {
    const trimmed = name.trim();
    if (trimmed.length < 2) return setError("Tag name must be at least 2 characters");
    if (trimmed.length > 50) return setError("Tag name must be less than 50 characters");

    setIsSubmitting(true);
    setError(null);
    const result = await create({ name: trimmed });
    if (!result.ok) {
      setError(result.error);
      setIsSubmitting(false);
      return;
    }

    setAppearance(String(result.tag.id), { icon, color: colorName, isFavorite, botVisible });
    onCreated(result.tag);
  };

  return (
    <View className="gap-[22px]">
      <SettingsSection title="Name">
        <TextInput
          value={name}
          onChangeText={(value) => {
            setName(value);
            setError(null);
          }}
          onSubmitEditing={submit}
          placeholder="e.g. Work"
          placeholderClassName="text-muted-foreground"
          maxLength={50}
          autoFocus
          returnKeyType="done"
          aria-label="Tag name"
          className="h-11 rounded-[10px] border border-border bg-background px-3 text-[14px] text-foreground"
        />
      </SettingsSection>

      <SettingsSection title="Icon">
        <TagIconPicker value={icon} color={color} onChange={setIcon} />
      </SettingsSection>

      <SettingsSection title="Color">
        <TagColorPicker value={color} onChange={setColorName} />
      </SettingsSection>

      <SettingsSection title="Display">
        <SwitchRow
          label="Favorite"
          description="Favorite tags are shown first"
          value={isFavorite}
          onValueChange={() => setIsFavorite((value) => !value)}
        />
        <SwitchRow
          label="Show in Telegram bot"
          description="Saved on this device only for now"
          value={botVisible}
          onValueChange={() => setBotVisible((value) => !value)}
          isLast
        />
      </SettingsSection>

      {error && <FormMessage tone="error" message={error} />}

      <PrimaryButton label="Create tag" icon="add" onPress={submit} isLoading={isSubmitting} />
    </View>
  );
}
