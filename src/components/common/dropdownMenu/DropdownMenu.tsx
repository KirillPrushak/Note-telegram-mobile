import { useRef, useState } from "react";
import { Modal, Platform, Pressable, View, useWindowDimensions } from "react-native";

import { Icon, type IconName } from "@/components/common/icon";
import { Text } from "@/components/ui/text";
import { cn } from "@/lib/utils";

const SCREEN_EDGE = 16;
// iOS can't present an Alert while a Modal is still animating out, so item
// actions (e.g. a delete confirmation) run after the menu has closed.
const ACTION_DELAY_MS = Platform.OS === "ios" ? 300 : 0;

export interface DropdownMenuItem {
  label: string;
  description?: string;
  icon: IconName;
  onPress: () => void;
  destructive?: boolean;
}

interface DropdownMenuProps {
  items: DropdownMenuItem[];
  // Trigger look: an icon button styled by the caller.
  triggerIcon: IconName;
  triggerLabel: string;
  triggerClassName: string;
  triggerIconClassName: string;
  triggerIconSize?: number;
  width?: number;
}

type Anchor = { top: number; right: number };

// Icon button that opens a menu right under itself, aligned to its right edge.
export function DropdownMenu({
  items,
  triggerIcon,
  triggerLabel,
  triggerClassName,
  triggerIconClassName,
  triggerIconSize = 20,
  width = 220,
}: DropdownMenuProps) {
  const triggerRef = useRef<View>(null);
  const { width: screenWidth } = useWindowDimensions();
  const [anchor, setAnchor] = useState<Anchor | null>(null);

  const open = () => {
    triggerRef.current?.measureInWindow((x, y, triggerWidth, triggerHeight) => {
      setAnchor({
        top: y + triggerHeight + 8,
        right: Math.max(SCREEN_EDGE, screenWidth - (x + triggerWidth)),
      });
    });
  };

  const close = () => setAnchor(null);

  const select = (item: DropdownMenuItem) => {
    close();
    setTimeout(item.onPress, ACTION_DELAY_MS);
  };

  return (
    <>
      <Pressable
        ref={triggerRef}
        onPress={open}
        role="button"
        aria-label={triggerLabel}
        aria-expanded={!!anchor}
        hitSlop={6}
        className={triggerClassName}
      >
        <Icon name={triggerIcon} size={triggerIconSize} className={triggerIconClassName} />
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
              style={{ top: anchor.top, right: anchor.right, width }}
            >
              {items.map((item) => (
                <Pressable
                  key={item.label}
                  onPress={() => select(item)}
                  role="menuitem"
                  className="flex-row items-center gap-3 rounded-lg px-2.5 py-2.5 active:bg-muted"
                >
                  <View
                    className={cn(
                      "h-8 w-8 items-center justify-center rounded-lg",
                      item.destructive ? "bg-destructive/10" : "bg-brand/10",
                    )}
                  >
                    <Icon
                      name={item.icon}
                      size={16}
                      className={item.destructive ? "text-destructive" : "text-brand"}
                    />
                  </View>
                  <View className="flex-1">
                    <Text
                      className={cn(
                        "text-[14px] font-semibold",
                        item.destructive && "text-destructive",
                      )}
                    >
                      {item.label}
                    </Text>
                    {item.description && (
                      <Text className="text-[11.5px] text-muted-foreground">
                        {item.description}
                      </Text>
                    )}
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
