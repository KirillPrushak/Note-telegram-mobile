import Ionicons from "@expo/vector-icons/Ionicons";
import { cssInterop } from "nativewind";
import type { ComponentProps } from "react";

// Lets icons take their color from a `text-*` class, so the palette stays
// in global.css instead of being duplicated as hex values in components.
cssInterop(Ionicons, {
  className: { target: "style", nativeStyleToProp: { color: true } },
});

export type IconName = ComponentProps<typeof Ionicons>["name"];

export const Icon = Ionicons;
