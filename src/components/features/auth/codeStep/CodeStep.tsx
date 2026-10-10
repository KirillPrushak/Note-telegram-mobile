import { Pressable, View } from "react-native";

import { Icon } from "@/components/common/icon";
import { Text } from "@/components/ui/text";
import { CODE_LENGTH } from "@/constants/auth";
import type { useTelegramAuth } from "@/hooks/useTelegramAuth";
import { PrimaryButton } from "@/components/common/primaryButton";
import { BotLink } from "../botLink";
import { CodeInput } from "../codeInput";
import { FormMessage } from "@/components/common/formMessage";

type CodeStepProps = Pick<
  ReturnType<typeof useTelegramAuth>,
  | "userId"
  | "code"
  | "setCode"
  | "verify"
  | "resendCode"
  | "backToUserId"
  | "isVerifying"
  | "isRequesting"
  | "error"
  | "notice"
>;

export function CodeStep({
  userId,
  code,
  setCode,
  verify,
  resendCode,
  backToUserId,
  isVerifying,
  isRequesting,
  error,
  notice,
}: CodeStepProps) {
  return (
    <View className="gap-[22px]">
      <Pressable
        onPress={backToUserId}
        role="button"
        hitSlop={8}
        className="flex-row items-center gap-1.5 self-start active:opacity-70"
      >
        <Icon name="chevron-back" size={15} className="text-muted-foreground" />
        <Text className="text-[13px] font-semibold text-muted-foreground">Change ID</Text>
      </Pressable>

      <View className="items-center gap-1.5">
        <Text role="heading" className="text-[17px] font-semibold">
          Enter the code
        </Text>
        <Text className="text-center text-[13.5px] text-muted-foreground">
          We sent a verification code to the Telegram bot for ID {userId}
        </Text>
      </View>

      <View className="items-center gap-2.5">
        <Text className="text-[12.5px] font-medium text-muted-foreground">Verification code</Text>
        <CodeInput
          value={code}
          onChange={setCode}
          onComplete={verify}
          hasError={!!error}
          disabled={isVerifying}
        />
      </View>

      <View className="flex-row flex-wrap items-center justify-center gap-1">
        <Text className="text-[13px] text-muted-foreground">Didn’t get a code?</Text>
        <Pressable onPress={resendCode} disabled={isRequesting} role="button" hitSlop={8}>
          <Text className="text-[13px] font-semibold text-brand">
            {isRequesting ? "Sending…" : "Resend"}
          </Text>
        </Pressable>
      </View>

      {error && <FormMessage tone="error" message={error} />}
      {!error && notice && <FormMessage tone="info" message={notice} />}

      <PrimaryButton
        label="Verify and sign in"
        icon="checkmark"
        onPress={() => verify()}
        isLoading={isVerifying}
        disabled={code.length < CODE_LENGTH}
      />

      <BotLink />

      <Text className="text-center text-xs text-muted-foreground">The code is valid for 5 minutes</Text>
    </View>
  );
}
