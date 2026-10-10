import type { IconName } from "@/components/common/icon";

// Same icon set and names as the web app (lucide names), mapped to Ionicons.
export const TAG_ICONS: { name: string; icon: IconName }[] = [
  { name: "briefcase", icon: "briefcase-outline" },
  { name: "lightbulb", icon: "bulb-outline" },
  { name: "heart", icon: "heart-outline" },
  { name: "book-open", icon: "book-outline" },
  { name: "dollar-sign", icon: "cash-outline" },
  { name: "dumbbell", icon: "barbell-outline" },
  { name: "send", icon: "paper-plane-outline" },
  { name: "folder", icon: "folder-outline" },
  { name: "home", icon: "home-outline" },
  { name: "graduation-cap", icon: "school-outline" },
  { name: "music", icon: "musical-notes-outline" },
  { name: "coffee", icon: "cafe-outline" },
  { name: "shopping-cart", icon: "cart-outline" },
  { name: "camera", icon: "camera-outline" },
  { name: "laptop", icon: "laptop-outline" },
  { name: "star", icon: "star-outline" },
];

export const DEFAULT_TAG_ICON = "folder";

export const getTagIcon = (name?: string): IconName =>
  TAG_ICONS.find((item) => item.name === name)?.icon ?? "folder-outline";
