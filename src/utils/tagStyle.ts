import { TAG_COLORS, softColor } from "@/constants/tagColors";
import { getTagIcon } from "@/constants/tagIcons";
import type { TagAppearance } from "@/store/tagAppearance.store";

// Resolved look of a tag: the user's choice from tag settings, otherwise a
// stable color picked by id so tags differ out of the box.
export const getTagStyle = (tagId: number | undefined, appearance?: TagAppearance) => {
  const chosen = TAG_COLORS.find((color) => color.name === appearance?.color);
  const color = (chosen ?? TAG_COLORS[Math.abs(tagId ?? 0) % TAG_COLORS.length]).value;

  return {
    color,
    soft: softColor(color),
    icon: getTagIcon(appearance?.icon),
  };
};
