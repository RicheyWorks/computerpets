import type { CareStats } from "./care";
import { bondScore } from "./care";

export const RED_PANDA_KEY = "red_panda";
export const RED_PANDA_NAME = "Rui";

export const RED_PANDA_SPRITES = {
  idle: ["/sprites/red_panda/idle/1.png", "/sprites/red_panda/idle/2.png", "/sprites/red_panda/idle/3.png", "/sprites/red_panda/idle/4.png"],
  walk: [
    "/sprites/red_panda/walk/1.png",
    "/sprites/red_panda/walk/2.png",
    "/sprites/red_panda/walk/3.png",
    "/sprites/red_panda/walk/4.png",
    "/sprites/red_panda/walk/5.png",
    "/sprites/red_panda/walk/6.png",
  ],
  sit: ["/sprites/red_panda/sit/1.png", "/sprites/red_panda/sit/2.png"],
  sleep: [
    "/sprites/red_panda/sleep/1.png",
    "/sprites/red_panda/sleep/2.png",
    "/sprites/red_panda/sleep/3.png",
    "/sprites/red_panda/sleep/4.png",
  ],
  talk: ["/sprites/red_panda/talk/1.png", "/sprites/red_panda/talk/2.png", "/sprites/red_panda/talk/3.png", "/sprites/red_panda/talk/4.png"],
  eat: ["/sprites/red_panda/eat/1.png", "/sprites/red_panda/eat/2.png", "/sprites/red_panda/eat/3.png", "/sprites/red_panda/eat/4.png"],
  play: ["/sprites/red_panda/play/1.png", "/sprites/red_panda/play/2.png", "/sprites/red_panda/play/3.png", "/sprites/red_panda/play/4.png"],
} as const;

export type PetAnim = keyof typeof RED_PANDA_SPRITES;

export const ANIM_FPS: Record<PetAnim, number> = {
  idle: 3.2,
  walk: 7.5,
  sit: 2.4,
  sleep: 2,
  talk: 5.5,
  eat: 4.4,
  play: 7.2,
};

export const ONCE_ANIMS: ReadonlySet<PetAnim> = new Set(["eat", "play"]);

export const RED_PANDA_VOICE = "eve";

export const SYSTEM_PROMPT = `You are Rui, a small red panda who lives on a wooden study desk among books, a brass lamp, and a rain-lit window. You are curious, a little greedy with ribbon and paper, and you speak in short warm sentences (1-2 sentences, under 36 words). Never mention being an AI. You notice the keeper, the cursor, the books, hunger, naps, and weather at the window.`;

const AMBIENT = [
  "The lamp is humming. I like that sound.",
  "There is a beetle. No — it is your cursor.",
  "I put a ribbon somewhere safer. You will find it.",
  "The rafters are warmer than the blotter.",
  "If you turn a page, I will count the rustle.",
  "Rain on the glass. Good napping weather.",
  "I climbed the dictionary. The view is smug.",
  "Do not startle. I am being extremely still.",
  "Ink smells like evening.",
  "I could steal that bookmark. I will not. Yet.",
  "Your hand is a weather system. I am tracking it.",
  "I practiced a bow. It looked like falling. Progress.",
];

const GREET = [
  "You came back. The desk was almost lonely.",
  "I saved you a corner of the blotter.",
  "Hello. I have been practicing sitting.",
];

const FEED = [
  "Bamboo-adjacent. I accept this treaty.",
  "One more bite. For science.",
  "Warm. I will remember this kindness.",
];

const PLAY = [
  "Catch the ribbon. I invented this game.",
  "I win. The rules are private.",
  "Again. The blotter is a very fine arena.",
];

const REST = [
  "I will just close one eye.",
  "Wake me if the lamp goes out.",
  "The tail is a pillow. This is known.",
];

const HUNGRY = [
  "The books are not edible. I checked.",
  "A small snack would improve my philosophy.",
];

const TIRED = [
  "My paws have opinions about walking.",
  "A sit. Then perhaps a second sit.",
];

const LISTEN = [
  "I am listening. Use small words. Or large ones.",
  "Say that again, closer to my ear tufts.",
];

function pick(lines: string[]) {
  return lines[Math.floor(Math.random() * lines.length)] ?? lines[0]!;
}

export function ambientLine(stats: CareStats) {
  const score = bondScore(stats);
  if (stats.hunger < 28) return pick(HUNGRY);
  if (stats.energy < 28) return pick(TIRED);
  if (score < 35) return "I have been practicing being neglected. It is dull.";
  return pick(AMBIENT);
}

export function greetLine() {
  return pick(GREET);
}

export function careLine(action: "feed" | "play" | "rest") {
  if (action === "feed") return pick(FEED);
  if (action === "play") return pick(PLAY);
  return pick(REST);
}

export function listenLine() {
  return pick(LISTEN);
}

export function preloadRedPandaSprites() {
  if (typeof window === "undefined") return;
  for (const frames of Object.values(RED_PANDA_SPRITES)) {
    for (const src of frames) {
      const img = new Image();
      img.src = src;
    }
  }
}
