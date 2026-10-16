import * as Linking from "expo-linking";
import { Pressable } from "react-native";

import { Icon } from "@/components/common/icon";
import { Text } from "@/components/ui/text";
import { TELEGRAM_BOT_LINK } from "@/constants/auth";

// Opens the bot in the Telegram app (or the browser if it isn't installed).
export function BotLink({ label = "Open Telegram bot" }: { label?: string }) {
  return (
    <Pressable
      onPress={() => Linking.openURL(TELEGRAM_BOT_LINK)}
      role="link"
      hitSlop={8}
      className="flex-row items-center justify-center gap-1.5 self-center active:opacity-70"
    >
      <Icon name="paper-plane-outline" size={15} className="text-brand" />
      <Text className="text-[13px] font-semibold text-brand">{label}</Text>
    </Pressable>
  );
}
