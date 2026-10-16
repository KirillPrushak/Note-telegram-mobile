import { useSafeAreaInsets } from "react-native-safe-area-context";

import { TAB_BAR } from "@/components/layout/tabBar";

// Bottom padding a tab screen needs so its last item isn't hidden under
// the floating tab bar.
export function useTabBarInset(): number {
  const { bottom } = useSafeAreaInsets();
  return bottom + TAB_BAR.BOTTOM_OFFSET + TAB_BAR.HEIGHT + TAB_BAR.CONTENT_GAP;
}
