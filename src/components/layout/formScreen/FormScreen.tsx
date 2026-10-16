import type { ReactNode } from "react";
import { KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

// Scrollable, keyboard-aware container for stack screens with forms.
export function FormScreen({ children }: { children: ReactNode }) {
  const { bottom } = useSafeAreaInsets();

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      className="flex-1 bg-background"
    >
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerClassName="gap-[22px] px-5 pt-4"
        contentContainerStyle={{ paddingBottom: bottom + 24 }}
      >
        {children}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
