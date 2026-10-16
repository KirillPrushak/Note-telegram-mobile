import { useTagAppearanceStore } from "@/store";
import { getTagStyle } from "@/utils/tagStyle";

// Local appearance settings of one tag (persisted on the device, like web).
export function useTagAppearance(tagId: number | undefined) {
  const key = String(tagId);
  const appearance = useTagAppearanceStore((s) => s.tagAppearance[key]);
  const setIcon = useTagAppearanceStore((s) => s.setIcon);
  const setColor = useTagAppearanceStore((s) => s.setColor);
  const toggleFavorite = useTagAppearanceStore((s) => s.toggleFavorite);
  const toggleBotVisible = useTagAppearanceStore((s) => s.toggleBotVisible);

  return {
    ...getTagStyle(tagId, appearance),
    iconName: appearance?.icon,
    colorName: appearance?.color,
    isFavorite: appearance?.isFavorite ?? false,
    botVisible: appearance?.botVisible ?? true,
    setIcon: (name: string) => setIcon(key, name),
    setColor: (name: string) => setColor(key, name),
    toggleFavorite: () => toggleFavorite(key),
    toggleBotVisible: () => toggleBotVisible(key),
  };
}
