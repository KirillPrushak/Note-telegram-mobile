import { router, type Href } from "expo-router";
import { useRef, useState } from "react";
import { Modal, Pressable, View, useWindowDimensions } from "react-native";

import { Icon, type IconName } from "@/components/common/icon";
import { Text } from "@/components/ui/text";

const MENU_WIDTH = 220;
const SCREEN_EDGE = 16;

const ITEMS: {
  label: string;
  description: string;
  icon: IconName;
  href: Href;
}[] = [
  {
    label: "New note",
    description: "Write it down right away",
    icon: "document-text-outline",
    href: "/note/new",
  },
  {
    label: "New tag",
    description: "Name, icon and color",
    icon: "pricetag-outline",
    href: "/tag/new",
  },
];

type Anchor = { top: number; right: number };

// "+" button with a dropdown for quick creation (mobile take on the web
// sidebar's QuickCreateButton). The menu opens right under the button.
export function QuickCreateMenu() {
  const buttonRef = useRef<View>(null);
  const { width: screenWidth } = useWindowDimensions();
  const [anchor, setAnchor] = useState<Anchor | null>(null);

  const open = () => {
    buttonRef.current?.measureInWindow((x, y, width, height) => {
      setAnchor({
        top: y + height + 8,
        right: Math.max(SCREEN_EDGE, screenWidth - (x + width)),
      });
    });
  };

  const close = () => setAnchor(null);

  const go = (href: Href) => {
    close();
    router.push(href);
  };

  return (
    <>
      <Pressable
        ref={buttonRef}
        onPress={open}
        role="button"
        aria-label="Create"
        aria-expanded={!!anchor}
        hitSlop={6}
        className="h-[34px] w-[34px] items-center justify-center rounded-[11px] bg-brand active:opacity-80"
      >
        <Icon name="add" size={22} className="text-brand-foreground" />
      </Pressable>

      {/* statusBarTranslucent: the app draws edge-to-edge, so the modal must
          share the window's coordinates for the measured anchor to line up
          on Android. */}
      <Modal
        visible={!!anchor}
        transparent
        statusBarTranslucent
        animationType="fade"
        onRequestClose={close}
      >
        <Pressable className="flex-1" onPress={close} aria-label="Close menu">
          {anchor && (
            <View
              role="menu"
              className="absolute gap-0.5 rounded-xl border border-border bg-card p-1.5 shadow-lg shadow-black/20"
              style={{
                top: anchor.top,
                right: anchor.right,
                width: MENU_WIDTH,
              }}
            >
              {ITEMS.map((item) => (
                <Pressable
                  key={item.label}
                  onPress={() => go(item.href)}
                  role="menuitem"
                  className="flex-row items-center gap-3 rounded-lg px-2.5 py-2.5 active:bg-muted"
                >
                  <View className="h-8 w-8 items-center justify-center rounded-lg bg-brand/10">
                    <Icon name={item.icon} size={16} className="text-brand" />
                  </View>
                  <View className="flex-1">
                    <Text className="text-[14px] font-semibold">
                      {item.label}
                    </Text>
                    <Text className="text-[11.5px] text-muted-foreground">
                      {item.description}
                    </Text>
                  </View>
                </Pressable>
              ))}
            </View>
          )}
        </Pressable>
      </Modal>
    </>
  );
}
