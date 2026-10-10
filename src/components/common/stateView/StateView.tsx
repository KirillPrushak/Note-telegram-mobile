import { ActivityIndicator, View } from "react-native";

import { Icon, type IconName } from "@/components/common/icon";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";

type StateViewProps =
  | { type: "loading" }
  | { type: "error"; message: string; onRetry: () => void }
  | { type: "empty"; message: string; icon?: IconName };

// Loading / error / empty placeholder used inside lists and screens.
export function StateView(props: StateViewProps) {
  if (props.type === "loading") {
    return (
      <View className="items-center py-16">
        <ActivityIndicator />
      </View>
    );
  }

  if (props.type === "error") {
    return (
      <View className="items-center gap-3 py-16">
        <Icon name="cloud-offline-outline" size={32} className="text-muted-foreground" />
        <Text className="text-center text-sm text-muted-foreground">
          {props.message}
        </Text>
        <Button variant="outline" size="sm" onPress={props.onRetry}>
          <Text>Try again</Text>
        </Button>
      </View>
    );
  }

  return (
    <View className="items-center gap-3 py-16">
      <Icon
        name={props.icon ?? "document-text-outline"}
        size={32}
        className="text-muted-foreground"
      />
      <Text className="text-center text-sm text-muted-foreground">
        {props.message}
      </Text>
    </View>
  );
}
