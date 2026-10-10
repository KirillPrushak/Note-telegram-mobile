// Same color set as the web app (constants/tagColors.ts), as hex: the value
// feeds SVG segments, legend dots and badges, not only classes.
export const TAG_COLORS = [
  { name: "brand", label: "Brand", value: "#b37458" },
  { name: "red", label: "Red", value: "#d66773" },
  { name: "green", label: "Green", value: "#319751" },
  { name: "teal", label: "Teal", value: "#00c0c2" },
  { name: "blue", label: "Blue", value: "#5182c1" },
  { name: "pink", label: "Pink", value: "#b873b2" },
  { name: "purple", label: "Purple", value: "#ae84f2" },
  { name: "gray", label: "Gray", value: "#808080" },
] as const;

export type TagColorName = (typeof TAG_COLORS)[number]["name"];

export const BRAND_COLOR = TAG_COLORS[0].value;
export const OTHER_TAG_COLOR = "#bebebe";

// ~14% alpha, for icon boxes and badge backgrounds.
export const softColor = (hex: string) => `${hex}24`;
