/**
 * How long a pet's talk reply stays up: about four seconds plus a little per word, never past twelve.
 * The overlay's `desktop/renderer/mind.js` `replyHoldMs` is the same rule (a test holds them equal).
 * A click on the bubble closes it sooner.
 */
export const REPLY_HOLD_MIN_MS = 4000;
export const REPLY_HOLD_PER_WORD_MS = 300;
export const REPLY_HOLD_MAX_MS = 12000;

export function replyHoldMs(text: string | null | undefined): number {
  const words = String(text ?? "").trim().split(/\s+/).filter(Boolean).length;
  return Math.min(REPLY_HOLD_MAX_MS, REPLY_HOLD_MIN_MS + words * REPLY_HOLD_PER_WORD_MS);
}

/** The keeper's own words, shown back under the talk box while the pet answers. */
export function heardLine(message: string | null | undefined): string {
  const text = String(message ?? "").trim();
  return text ? `You said: “${text}”` : "";
}
