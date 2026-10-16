// Long tag names would stretch the chips; full names live in the sheet and
// on the tag screen.
const TAG_CHIP_MAX_LENGTH = 16;

export const shortenTagName = (name: string) =>
  name.length > TAG_CHIP_MAX_LENGTH ? `${name.slice(0, TAG_CHIP_MAX_LENGTH)}…` : name;
