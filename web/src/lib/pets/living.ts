import type { CareStats } from "./care";
import {
  CAT_KEY,
  CAT_NAME,
  CAT_SPRITES,
  CAT_SYSTEM_PROMPT,
  CAT_VOICE,
  catAmbient,
  catCare,
  catFallback,
  catGreet,
  catListen,
  preloadCatSprites,
} from "./cat";
import {
  ambientLine,
  ANIM_FPS,
  careLine,
  greetLine,
  listenLine,
  ONCE_ANIMS,
  preloadRedPandaSprites,
  RED_PANDA_KEY,
  RED_PANDA_NAME,
  RED_PANDA_SPRITES,
  RED_PANDA_VOICE,
  SYSTEM_PROMPT,
  type PetAnim,
} from "./red-panda";

export type { PetAnim };

export type SpritePack = Record<PetAnim, readonly string[]>;

export type LivingKind = {
  key: string;
  name: string;
  speciesLabel: string;
  blurb: string;
  nextHint: string;
  localKey: string;
  voice: string;
  systemPrompt: string;
  sprites: SpritePack;
  fps: Record<PetAnim, number>;
  once: ReadonlySet<PetAnim>;
  greetLine: () => string;
  ambientLine: (stats: CareStats) => string;
  careLine: (action: "feed" | "play" | "rest") => string;
  listenLine: () => string;
  fallbackLine: (message: string | undefined, stats: CareStats) => string;
  preload: () => void;
};

const CAT_FPS: Record<PetAnim, number> = {
  idle: 2.8,
  walk: 6.4,
  sit: 2.2,
  sleep: 1.8,
  talk: 4.6,
  eat: 3.8,
  play: 6.6,
};

export const RED_PANDA_KIND: LivingKind = {
  key: RED_PANDA_KEY,
  name: RED_PANDA_NAME,
  speciesLabel: "Red Panda",
  blurb: "Lives on the blotter. Drag, tap to talk, or send a word.",
  nextHint: "Next: Dog",
  localKey: "computerpets.desk.red_panda.v1",
  voice: RED_PANDA_VOICE,
  systemPrompt: SYSTEM_PROMPT,
  sprites: RED_PANDA_SPRITES,
  fps: ANIM_FPS,
  once: ONCE_ANIMS,
  greetLine,
  ambientLine,
  careLine,
  listenLine,
  fallbackLine: (message, stats) => {
    if (!message) return ambientLine(stats);
    const q = message.toLowerCase();
    if (q.includes("name")) return "Rui. It fits in a mouth and on a collar.";
    if (q.includes("food") || q.includes("eat") || q.includes("hungry"))
      return "Something rust-colored and polite. I am not proud.";
    if (q.includes("sleep") || q.includes("tired")) return "The tail knows what to do.";
    if (q.includes("love") || q.includes("good")) return "I heard that. I will store it in the left ear.";
    return listenLine();
  },
  preload: preloadRedPandaSprites,
};

export const CAT_KIND: LivingKind = {
  key: CAT_KEY,
  name: CAT_NAME,
  speciesLabel: "Cat",
  blurb: "Judges from the ledge. Drag, tap to talk, or send a word.",
  nextHint: "Next: Dog",
  localKey: "computerpets.desk.cat.v1",
  voice: CAT_VOICE,
  systemPrompt: CAT_SYSTEM_PROMPT,
  sprites: CAT_SPRITES,
  fps: CAT_FPS,
  once: ONCE_ANIMS,
  greetLine: catGreet,
  ambientLine: catAmbient,
  careLine: catCare,
  listenLine: catListen,
  fallbackLine: catFallback,
  preload: preloadCatSprites,
};

export const LIVING_KINDS: LivingKind[] = [RED_PANDA_KIND, CAT_KIND];

export function livingByKey(key: string | undefined | null) {
  return LIVING_KINDS.find((k) => k.key === key) ?? RED_PANDA_KIND;
}

export function isLivingSpecies(key: string) {
  return LIVING_KINDS.some((k) => k.key === key);
}

const ACTIVE_KEY = "computerpets.desk.active.v1";

export function loadActiveKindKey() {
  try {
    const raw = localStorage.getItem(ACTIVE_KEY);
    if (raw && isLivingSpecies(raw)) return raw;
  } catch {
    /* ignore */
  }
  return RED_PANDA_KEY;
}

export function saveActiveKindKey(key: string) {
  try {
    localStorage.setItem(ACTIVE_KEY, key);
  } catch {
    /* ignore */
  }
}
