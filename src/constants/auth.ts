export const TELEGRAM_BOT_LINK =
  process.env.EXPO_PUBLIC_TELEGRAM_BOT_LINK ||
  "https://t.me/TetrisWhmcsPrushak111NoteBot";

// "@BotName", derived from the link so it follows EXPO_PUBLIC_TELEGRAM_BOT_LINK.
export const TELEGRAM_BOT_HANDLE = `@${TELEGRAM_BOT_LINK.replace(/\/+$/, "").split("/").pop()}`;

// Verification code the bot sends: 6 digits.
export const CODE_LENGTH = 6;

// Matches the backend's verification code lifetime. Past this, a
// "requested" id must not short-circuit to the code step: the code waiting
// there is already dead.
export const REQUEST_TTL_MS = 5 * 60 * 1000;

// How long a just-used id keeps explaining the backend's "already
// requested" cooldown (it doesn't expose its own), so the user isn't sent
// to a code step with nothing waiting there.
export const RECENT_USE_TTL_MS = 5 * 60 * 1000;
