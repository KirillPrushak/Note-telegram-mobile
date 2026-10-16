// Notes have no separate title field: the first non-empty line acts as the
// title and the rest as the preview.
export const splitNoteMessage = (
  message?: string,
): { title: string; preview: string } => {
  const lines = (message ?? "")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  return {
    title: lines[0] ?? "Untitled",
    preview: lines.slice(1).join(" "),
  };
};
