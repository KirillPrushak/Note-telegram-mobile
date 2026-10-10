export const safeFormatDate = (dateStr?: string): string => {
  if (!dateStr) return "No date";

  try {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return "Invalid date";
    return date.toLocaleDateString();
  } catch {
    return "Invalid date";
  }
};
