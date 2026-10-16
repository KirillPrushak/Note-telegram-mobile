import * as Clipboard from "expo-clipboard";
import { useEffect, useState } from "react";

import { Icon } from "@/components/common/icon";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { showError } from "@/utils/confirm";

const RESET_DELAY_MS = 1500;

// Copies `text`; the label flips to "Copied" for a moment (as on web).
export function CopyButton({
  text,
  label = "Copy",
}: {
  text: string;
  label?: string;
}) {
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    if (!isCopied) return;
    const timer = setTimeout(() => setIsCopied(false), RESET_DELAY_MS);
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
    <Button variant="outline" onPress={copy} className="rounded-[10px]">
      <Icon
        name={isCopied ? "checkmark" : "copy-outline"}
        size={16}
        className={isCopied ? "text-success" : "text-foreground"}
      />
      <Text className="font-semibold">{isCopied ? "Copied" : label}</Text>
    </Button>
  );
}
