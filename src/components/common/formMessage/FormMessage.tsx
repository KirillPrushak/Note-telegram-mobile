import { View } from "react-native";

import { Text } from "@/components/ui/text";
import { cn } from "@/lib/utils";

// Inline error / info banner under form fields.
export function FormMessage({ tone, message }: { tone: "error" | "info"; message: string }) {
  return (
    <View
      role={tone === "error" ? "alert" : undefined}
      className={cn(
        "rounded-[10px] border px-3 py-2.5",
        tone === "error" ? "border-destructive/20 bg-destructive/10" : "border-info/20 bg-info/10",
      )}
    >
      <Text
        className={cn(
          "text-center text-[13px]",
          tone === "error" ? "text-destructive" : "text-info",
        )}
      >
        {message}
      </Text>
    </View>
  );
}
