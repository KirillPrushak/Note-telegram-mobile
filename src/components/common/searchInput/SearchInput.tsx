import { TextInput, View, type TextInputProps } from "react-native";

import { Icon } from "@/components/common/icon";

export function SearchInput(props: TextInputProps) {
  return (
    <View className="h-10 flex-row items-center rounded-[10px] border border-border bg-muted px-3">
      <Icon name="search" size={16} className="text-muted-foreground" />
      <TextInput
        {...props}
        className="ml-2 h-full flex-1 text-[13.5px] text-foreground"
        placeholderClassName="text-muted-foreground"
        returnKeyType="search"
        clearButtonMode="while-editing"
        autoCorrect={false}
      />
    </View>
  );
}
