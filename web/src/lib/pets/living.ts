import type { CareStats } from "./care";
import { bondScore } from "./care";
import { ANIM_FPS, ONCE_ANIMS, RED_PANDA_SPRITES, type PetAnim } from "./red-panda";
import { ROSTER, type RosterDef } from "./roster";

export type { PetAnim };

export type SpritePack = Record<PetAnim, readonly string[]>;

export type LivingKind = {
  key: string;
  slug: string;
  name: string;
  speciesLabel: string;
  blurb: string;
  tagline: string;
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

const PHOTO_FPS: Record<PetAnim, number> = {
  idle: 2.8,
  walk: 6.4,
  sit: 2.2,
  sleep: 1.8,
  talk: 4.6,
  eat: 3.8,
  play: 6.6,
};

function pick(lines: string[]) {
  return lines[Math.floor(Math.random() * lines.length)] ?? lines[0]!;
}

function generatedPack(key: string): SpritePack {
  const frame = (anim: PetAnim, count: number) =>
    Array.from({ length: count }, (_, i) => `/sprites/${key}/${anim}/${i + 1}.png`);
  return {
    idle: frame("idle", 4),
    walk: frame("walk", 6),
    sit: frame("sit", 4),
    sleep: frame("sleep", 4),
    talk: frame("talk", 4),
    eat: frame("eat", 4),
    play: frame("play", 4),
  };
}

function kindFrom(def: RosterDef): LivingKind {
  const sprites = def.key === "red_panda" ? RED_PANDA_SPRITES : generatedPack(def.key);
  const lines = def.lines;
  return {
    key: def.key,
    slug: def.slug,
    name: def.name,
    speciesLabel: def.speciesLabel,
    blurb: def.blurb,
    tagline: def.tagline,
    nextHint: "The house",
    localKey: `computerpets.desk.${def.key}.v1`,
    voice: def.voice,
    systemPrompt: def.systemPrompt,
    sprites,
    fps: def.key === "red_panda" ? ANIM_FPS : PHOTO_FPS,
    once: ONCE_ANIMS,
    greetLine: () => pick(lines.greet),
    ambientLine: (stats) => {
      if (stats.hunger < 28) return pick(lines.hungry);
      if (stats.energy < 28) return pick(lines.tired);
      if (bondScore(stats) < 35) return lines.neglected;
      return pick(lines.ambient);
    },
    careLine: (action) => pick(action === "feed" ? lines.feed : action === "play" ? lines.play : lines.rest),
    listenLine: () => pick(lines.listen),
    fallbackLine: (message, stats) => {
      if (!message) {
        if (stats.hunger < 28) return pick(lines.hungry);
        if (stats.energy < 28) return pick(lines.tired);
        return pick(lines.ambient);
      }
      const q = message.toLowerCase();
      if (q.includes("name")) return lines.named;
      if (q.includes("food") || q.includes("eat") || q.includes("hungry")) return lines.foodTalk;
      if (q.includes("sleep") || q.includes("tired")) return lines.sleepTalk;
      if (q.includes("love") || q.includes("good")) return lines.loveTalk;
      return pick(lines.listen);
    },
    preload: () => {
      if (typeof window === "undefined") return;
      for (const frames of Object.values(sprites)) {
        for (const src of frames) {
          const img = new Image();
          img.src = src;
        }
      }
    },
  };
}

export const LIVING_KINDS: LivingKind[] = ROSTER.map(kindFrom);

export const RED_PANDA_KIND = LIVING_KINDS[0]!;
export const CAT_KIND = LIVING_KINDS[1]!;
export const DOG_KIND = LIVING_KINDS[2]!;

export function livingByKey(key: string | undefined | null) {
  return LIVING_KINDS.find((k) => k.key === key) ?? RED_PANDA_KIND;
}

export function livingBySlug(slug: string | undefined | null) {
  return LIVING_KINDS.find((k) => k.slug === slug) ?? null;
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
  return "red_panda";
}

export function saveActiveKindKey(key: string) {
  try {
    localStorage.setItem(ACTIVE_KEY, key);
  } catch {
    /* ignore */
  }
}
