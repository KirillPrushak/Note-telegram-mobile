import { KeyboardAvoidingView, Platform, ScrollView, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { CodeStep } from "@/components/features/auth/codeStep";
import { GiraffeMascot } from "@/components/common/giraffeMascot";
import { UserIdStep } from "@/components/features/auth/userIdStep";
import { useTelegramAuth } from "@/hooks/useTelegramAuth";

export default function AuthScreen() {
  const insets = useSafeAreaInsets();
  const auth = useTelegramAuth();

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      className="flex-1 bg-background"
    >
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerClassName="flex-grow px-6"
        contentContainerStyle={{
          paddingTop: insets.top + 24,
          paddingBottom: insets.bottom + 32,
        }}
      >
        <View className="mb-4 items-center">
          <GiraffeMascot size={180} />
        </View>

        {/* <View className="mb-9 items-center gap-2.5">
          <View className="h-14 w-14 items-center justify-center rounded-2xl bg-brand/10">
            <Icon name="paper-plane-outline" size={26} className="text-brand" />
          </View>
          <Text className="text-[19px] font-bold">Note-telegram</Text>
          <Text className="text-[13px] text-muted-foreground">Your personal notes manager</Text>
        </View> */}

        {auth.step === "userId" ? (
          <UserIdStep {...auth} />
        ) : (
          <CodeStep {...auth} />
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
