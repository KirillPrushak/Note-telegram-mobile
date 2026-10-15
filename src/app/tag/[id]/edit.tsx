import { Stack, useLocalSearchParams } from "expo-router";
import { View } from "react-native";

import {
  SettingsSection,
  SwitchRow,
} from "@/components/common/settingsSection";
import { StateView } from "@/components/common/stateView";
import { TagColorPicker } from "@/components/features/tags/tagColorPicker";
import { TagIconPicker } from "@/components/features/tags/tagIconPicker";
import { TagNameForm } from "@/components/features/tags/tagNameForm";
import { FormScreen } from "@/components/layout/formScreen";
import { useNotesAndTags } from "@/hooks/useNotesAndTags";
import { useTagAppearance } from "@/hooks/useTagAppearance";

// Tag settings, opened from the tag screen's "Edit tag". The name is saved
// on the server; the rest applies immediately (local appearance).
export default function EditTagScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const tagId = Number(id);
  const { tags, isLoading } = useNotesAndTags();
  const appearance = useTagAppearance(tagId);

  const tag = tags.find((item) => item.id === tagId);

  if (!tag) {
    return (
      <View className="flex-1 bg-background px-5">
        {isLoading ? (
          <StateView type="loading" />
        ) : (
          <StateView type="empty" icon="pricetags-outline" message="Tag not found" />
        )}
      </View>
    );
  }

  return (
    <FormScreen>
      <Stack.Screen options={{ title: `Edit ${tag.name}` }} />

      <SettingsSection title="Name">
        <TagNameForm key={tag.id} tag={tag} />
      </SettingsSection>

      <SettingsSection title="Display">
        <SwitchRow
          label="Favorite"
          description="Favorite tags are shown first"
          value={appearance.isFavorite}
          onValueChange={appearance.toggleFavorite}
        />
        <SwitchRow
          label="Show in Telegram bot"
          description="Saved on this device only for now"
          value={appearance.botVisible}
          onValueChange={appearance.toggleBotVisible}
          isLast
        />
      </SettingsSection>

      <SettingsSection title="Icon">
        <TagIconPicker
          value={appearance.iconName}
          color={appearance.color}
          onChange={appearance.setIcon}
        />
      </SettingsSection>

      <SettingsSection title="Color">
        <TagColorPicker value={appearance.color} onChange={appearance.setColor} />
      </SettingsSection>
    </FormScreen>
  );
}
