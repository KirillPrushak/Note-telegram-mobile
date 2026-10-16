import { Platform, TextInput, View } from "react-native";

import { Icon } from "@/components/common/icon";
import { Text } from "@/components/ui/text";
import type { useTelegramAuth } from "@/hooks/useTelegramAuth";
import { PrimaryButton } from "@/components/common/primaryButton";
import { BotLink } from "../botLink";
import { FormMessage } from "@/components/common/formMessage";

type UserIdStepProps = Pick<
  ReturnType<typeof useTelegramAuth>,
  "userId" | "changeUserId" | "submitUserId" | "isRequesting" | "error"
>;

const MONO_FONT = Platform.select({ ios: "Menlo", default: "monospace" });

export function UserIdStep({
  userId,
  changeUserId,
  submitUserId,
  isRequesting,
  error,
}: UserIdStepProps) {
  return (
    <View className="gap-[22px]">
      <View className="items-center gap-1.5">
        <Text role="heading" className="text-[17px] font-semibold">
          Enter your User ID
        </Text>
        <Text className="text-center text-[13.5px] text-muted-foreground">
          The ID the Telegram bot sent you
        </Text>
      </View>

      <View className="gap-2">
        <Text nativeID="user-id-label" className="text-[12.5px] font-medium text-muted-foreground">
          User ID
        </Text>
        <View className="h-[46px] flex-row items-center rounded-[10px] border border-border bg-background px-3">
          <Icon name="lock-closed-outline" size={16} className="text-muted-foreground" />
          <TextInput
            value={userId}
            onChangeText={changeUserId}
            onSubmitEditing={submitUserId}
            placeholder="123456789"
            placeholderClassName="text-muted-foreground"
            keyboardType="number-pad"
            returnKeyType="next"
            autoCorrect={false}
            editable={!isRequesting}
            aria-labelledby="user-id-label"
            className="h-full flex-1 pr-4 text-center text-[15px] tracking-wide text-foreground"
            style={{ fontFamily: MONO_FONT }}
          />
        </View>
        <Text className="text-center text-xs text-muted-foreground">
          Copy the ID from the bot’s message
        </Text>
      </View>

      {error && <FormMessage tone="error" message={error} />}

      <PrimaryButton
        label="Continue"
        icon="arrow-forward"
        onPress={submitUserId}
        isLoading={isRequesting}
        disabled={!userId.trim()}
      />

      <BotLink />

      <View className="mt-1 flex-row items-center gap-2 border-t border-border pt-4">
        <View className="h-1.5 w-1.5 rounded-full bg-brand" />
        <Text className="flex-1 text-xs text-muted-foreground">
          Sign-up happens only through the Telegram bot, no separate form needed.
        </Text>
      </View>
    </View>
  );
}
