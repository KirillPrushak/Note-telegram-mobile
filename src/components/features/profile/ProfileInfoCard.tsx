import * as Clipboard from "expo-clipboard";
import * as Linking from "expo-linking";
import { useEffect, useState, type ReactNode } from "react";
import { Platform, Pressable, View } from "react-native";

import { Icon, type IconName } from "@/components/common/icon";
import { Text } from "@/components/ui/text";
import { APP_VERSION, PRIVACY_POLICY_URL } from "@/constants/app";
import { TELEGRAM_BOT_HANDLE, TELEGRAM_BOT_LINK } from "@/constants/auth";
import { cn } from "@/lib/utils";
import { useCurrentUser } from "@/store";
import { showError } from "@/utils/confirm";
import { pluralize } from "@/utils/plural";
import { getTokenExpiryInfo } from "@/utils/token";

const MONO_FONT = Platform.select({ ios: "Menlo", default: "monospace" });

// "in 13 days", "in 5 hours", "in 20 minutes".
const formatRemaining = (minutes: number) => {
  if (minutes < 60) return `in ${minutes} ${pluralize(minutes, "minute")}`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `in ${hours} ${pluralize(hours, "hour")}`;
  const days = Math.floor(hours / 24);
  return `in ${days} ${pluralize(days, "day")}`;
};

function CopyIconButton({ text, label }: { text: string; label: string }) {
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    if (!isCopied) return;
    const timer = setTimeout(() => setIsCopied(false), 1500);
    return () => clearTimeout(timer);
  }, [isCopied]);

  const copy = async () => {
    try {
      await Clipboard.setStringAsync(text);
      setIsCopied(true);
    } catch {
      showError("Couldn't copy", "Please try again");
    }
  };

  return (
    <Pressable
      onPress={copy}
      role="button"
      aria-label={isCopied ? "Copied" : label}
      className="h-11 w-11 items-center justify-center rounded-full active:bg-muted"
    >
      <Icon
        name={isCopied ? "checkmark" : "copy-outline"}
        size={17}
        className={isCopied ? "text-success" : "text-muted-foreground"}
      />
    </Pressable>
  );
}

interface InfoRowProps {
  icon: IconName;
  label: string;
  value: ReactNode;
  accessory?: ReactNode;
  onPress?: () => void;
  isLast: boolean;
}

function InfoRow({
  icon,
  label,
  value,
  accessory,
  onPress,
  isLast,
}: InfoRowProps) {
  const content = (
    <>
      <Icon name={icon} size={18} className="text-muted-foreground" />
      <View className="min-w-0 flex-1">
        <Text className="text-[11.5px] text-muted-foreground">{label}</Text>
        {value}
      </View>
      {accessory}
    </>
  );
  const className = cn(
    "min-h-[56px] flex-row items-center gap-3 py-1.5",
    !isLast && "border-b border-border/60",
  );

  return onPress ? (
    <Pressable
      onPress={onPress}
      role="link"
      className={cn(className, "active:opacity-70")}
    >
      {content}
    </Pressable>
  ) : (
    <View className={className}>{content}</View>
  );
}

// Account, Telegram and About in one soft card (no border): Telegram ID
// (the sign-in login, copyable), session end, bot link, version, policy.
export function ProfileInfoCard() {
  const telegramUserId = useCurrentUser((s) => s.userInfo?.telegramUserId);
  const expiry = getTokenExpiryInfo();
  const privacyUrl = PRIVACY_POLICY_URL;

  const openIcon = (
    <Icon
      name="open-outline"
      size={16}
      className="mr-2 text-muted-foreground"
    />
  );

  const rows: Omit<InfoRowProps, "isLast">[] = [];

  if (telegramUserId) {
    rows.push({
      icon: "person-circle-outline",
      label: "Telegram ID · used to sign in",
      value: (
        <Text
          selectable
          className="text-[15px] font-semibold"
          style={{ fontFamily: MONO_FONT }}
        >
          {telegramUserId}
        </Text>
      ),
      // accessory: (
      //   <CopyIconButton text={telegramUserId} label="Copy Telegram ID" />
      // ),
    });
  }

  if (expiry) {
    rows.push({
      icon: "time-outline",
      label: "Session",
      value: (
        <Text className="text-[14px] font-medium">
          Signed in until{" "}
          {expiry.expiresAt.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })}
          <Text className="text-[12.5px] font-normal text-muted-foreground">
            {"  "}
            {formatRemaining(Math.max(0, expiry.minutesRemaining))}
          </Text>
        </Text>
      ),
    });
  }

  rows.push({
    icon: "paper-plane-outline",
    label: "Telegram bot",
    value: (
      <Text className="text-[14px] font-medium">{TELEGRAM_BOT_HANDLE}</Text>
    ),
    accessory: openIcon,
    onPress: () => Linking.openURL(TELEGRAM_BOT_LINK),
  });

  rows.push({
    icon: "information-circle-outline",
    label: "Version",
    value: <Text className="text-[14px] font-medium">{APP_VERSION}</Text>,
  });

  if (privacyUrl) {
    rows.push({
      icon: "shield-checkmark-outline",
      label: "Legal",
      value: <Text className="text-[14px] font-medium">Privacy policy</Text>,
      accessory: openIcon,
      onPress: () => Linking.openURL(privacyUrl),
    });
  }

  return (
    <View className="rounded-2xl bg-muted/50 px-3.5">
      {rows.map((row, index) => (
        <InfoRow key={row.label} {...row} isLast={index === rows.length - 1} />
      ))}
    </View>
  );
}
