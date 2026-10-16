import { useState } from "react";
import { TextInput, View } from "react-native";

import { Text } from "@/components/ui/text";
import { CODE_LENGTH } from "@/constants/auth";
import { cn } from "@/lib/utils";

interface CodeInputProps {
  value: string;
  onChange: (value: string) => void;
  onComplete: (value: string) => void;
  hasError?: boolean;
  disabled?: boolean;
}

// One transparent TextInput stretched over the cells: keeps native paste,
// iOS one-time-code autofill and backspace, while the cells only render.
export function CodeInput({ value, onChange, onComplete, hasError, disabled }: CodeInputProps) {
  const [isFocused, setIsFocused] = useState(false);

  const handleChange = (text: string) => {
    const digits = text.replace(/\D/g, "").slice(0, CODE_LENGTH);
    onChange(digits);
    if (digits.length === CODE_LENGTH) onComplete(digits);
  };

  return (
    <View className="relative flex-row gap-2">
      {Array.from({ length: CODE_LENGTH }, (_, index) => {
        const isActive = isFocused && index === Math.min(value.length, CODE_LENGTH - 1);
        return (
          <View
            key={index}
            className={cn(
              "h-[52px] w-[46px] items-center justify-center rounded-[10px] border bg-background",
              hasError ? "border-destructive" : isActive ? "border-2 border-brand" : "border-border",
            )}
          >
            <Text className="text-xl font-semibold">{value[index] ?? ""}</Text>
          </View>
        );
      })}

      <TextInput
        value={value}
        onChangeText={handleChange}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        editable={!disabled}
        maxLength={CODE_LENGTH}
        keyboardType="number-pad"
        textContentType="oneTimeCode"
        autoComplete="one-time-code"
        autoFocus
        caretHidden
        aria-label="Verification code"
        className="absolute inset-0 text-transparent opacity-0"
      />
    </View>
  );
}
