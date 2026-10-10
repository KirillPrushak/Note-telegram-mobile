import { ActivityIndicator } from "react-native";

import { Icon, type IconName } from "@/components/common/icon";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";

interface PrimaryButtonProps {
  label: string;
  icon: IconName;
  onPress: () => void;
  isLoading?: boolean;
  disabled?: boolean;
}

// Full-width brand button (auth design), used by auth and forms.
export function PrimaryButton({ label, icon, onPress, isLoading, disabled }: PrimaryButtonProps) {
  return (
    <Button
      onPress={onPress}
      disabled={disabled || isLoading}
      aria-busy={isLoading}
      className="h-12 w-full rounded-[10px] bg-brand active:bg-brand/90"
    >
      {isLoading ? (
        <ActivityIndicator color="white" />
      ) : (
        <>
          <Text className="text-[15px] font-semibold text-brand-foreground">{label}</Text>
          <Icon name={icon} size={16} className="text-brand-foreground" />
        </>
      )}
    </Button>
  );
}
