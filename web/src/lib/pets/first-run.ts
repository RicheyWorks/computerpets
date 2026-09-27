/**
 * The first-run hello: a one-time, dismissible hint for a brand-new keeper, written for a child who never
 * installed anything. The web room points at tapping the pet, the keeper card, and care; the desktop
 * overlay (desktop/renderer/keeper.js firstHint) points at the keeper card, clicking and right-clicking the
 * pet, and the tray icon. "Seen" lives in its own localStorage key, not in the card, so a card write from
 * an older copy can never bring the hint back. Once Got it is pressed it never shows again.
 */

export const FIRST_HINT_STORE = "computerpets.first-hint.v1";
export const FIRST_HINT_OK = "Got it";

export type FirstHint = { title: string; lines: string[]; ok: string };
export type HintStore = { getItem: (key: string) => string | null; setItem: (key: string, value: string) => void };

function who(name: string | null | undefined): { who: string; Who: string } {
  const w = String(name ?? "").trim() || "your pet";
  return { who: w, Who: w.charAt(0).toUpperCase() + w.slice(1) };
}

/** The web room's hello (tap the pet, the keeper card, care). */
export function firstHintWeb(name: string | null | undefined): FirstHint {
  const { who: w, Who } = who(name);
  return {
    title: `Hi! This is ${Who}.`,
    lines: [
      `Tap ${w} to open the keeper card and pick something to do together.`,
      `The keeper card shows if ${w} is hungry, sleepy, or happy.`,
      `Press Feed, Play, or Rest to take care of ${w}.`,
    ],
    ok: FIRST_HINT_OK,
  };
}

/** The desktop overlay's hello, word for word what desktop/renderer/keeper.js firstHint paints. */
export function firstHintOverlay(name: string | null | undefined): FirstHint {
  const { who: w, Who } = who(name);
  return {
    title: `Hi! ${Who} lives on your screen now.`,
    lines: [
      `This is ${w}'s keeper card. It shows if ${w} is hungry, sleepy, or happy. Press Feed, Play, or Rest to help.`,
      `Click ${w} any time to open this card again. Right-click ${w} for more things to do.`,
      "Near the clock there is a tiny ComputerPets picture. That is the tray icon. Right-click it to pick a new friend, or pick Quit to turn the pets off.",
    ],
    ok: FIRST_HINT_OK,
  };
}

function pageStore(): HintStore | null {
  try {
    return typeof window === "undefined" ? null : window.localStorage;
  } catch {
    return null;
  }
}

/** True once Got it was pressed on this browser. No storage (a server render) counts as seen, so nothing flashes. */
export function firstHintSeen(store: HintStore | null = pageStore()): boolean {
  if (!store) return true;
  try {
    return store.getItem(FIRST_HINT_STORE) === "1";
  } catch {
    return false;
  }
}

/** Got it: remember it for good. A storage that refuses the write still hides the hint for this visit. */
export function markFirstHintSeen(store: HintStore | null = pageStore()): void {
  if (!store) return;
  try {
    store.setItem(FIRST_HINT_STORE, "1");
  } catch {
    /* hidden for this visit anyway */
  }
}
