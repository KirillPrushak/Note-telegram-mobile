import type { IconName } from "@/components/common/icon";

export interface TabConfig {
  name: string;
  href: "/" | "/notes" | "/tags" | "/profile";
  label: string;
  icon: IconName;
  activeIcon: IconName;
}

export const NAV_TABS: TabConfig[] = [
  { name: "index", href: "/", label: "Dashboard", icon: "home-outline", activeIcon: "home" },
  { name: "notes", href: "/notes", label: "Notes", icon: "document-text-outline", activeIcon: "document-text" },
  { name: "tags", href: "/tags", label: "Tags", icon: "pricetags-outline", activeIcon: "pricetags" },
  { name: "profile", href: "/profile", label: "Profile", icon: "person-outline", activeIcon: "person" },
];

// Island geometry, shared with useTabBarInset so screens can pad their
// content above the floating bar.
export const TAB_BAR = {
  HEIGHT: 64,
  BOTTOM_OFFSET: 8,
  CONTENT_GAP: 16,
} as const;
