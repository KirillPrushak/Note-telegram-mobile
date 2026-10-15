import { router } from "expo-router";

import { DropdownMenu, type DropdownMenuItem } from "@/components/common/dropdownMenu";

const ITEMS: DropdownMenuItem[] = [
  {
    label: "New note",
    description: "Write it down right away",
    icon: "document-text-outline",
    onPress: () => router.push("/note/new"),
  },
  {
    label: "New tag",
    description: "Name, icon and color",
    icon: "pricetag-outline",
    onPress: () => router.push("/tag/new"),
  },
];

// "+" button with a dropdown for quick creation (mobile take on the web
// sidebar's QuickCreateButton).
export function QuickCreateMenu() {
  return (
    <DropdownMenu
      items={ITEMS}
      triggerIcon="add"
      triggerLabel="Create"
      triggerIconSize={22}
      triggerClassName="h-[34px] w-[34px] items-center justify-center rounded-[11px] bg-brand active:opacity-80"
      triggerIconClassName="text-brand-foreground"
    />
  );
}
