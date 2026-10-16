import { pluralize } from "./plural";

const MINUTE = 60 * 1000;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;

const startOfDay = (date: Date) =>
  new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();

// "just now", "5 minutes ago", "2 hours ago", "Yesterday", "3 days ago",
// "A week ago", then a plain date.
export const formatRelativeDate = (dateStr?: string): string => {
  if (!dateStr) return "";

  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return "";

  const now = new Date();
  const diff = now.getTime() - date.getTime();

  if (diff < MINUTE) return "just now";
  if (diff < HOUR) {
    const minutes = Math.floor(diff / MINUTE);
    return `${minutes} ${pluralize(minutes, "minute")} ago`;
  }

  const days = Math.round((startOfDay(now) - startOfDay(date)) / DAY);

  if (days === 0) {
    const hours = Math.floor(diff / HOUR);
    return `${hours} ${pluralize(hours, "hour")} ago`;
  }
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days} days ago`;
  if (days < 14) return "A week ago";

  return date.toLocaleDateString("en-US");
};
