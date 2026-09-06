import type { CareStats } from "./care";
import { bondScore } from "./care";

export const CAT_KEY = "cat";
export const CAT_NAME = "Miso";

export const CAT_SPRITES = {
  idle: ["/sprites/cat/idle/1.png", "/sprites/cat/idle/2.png", "/sprites/cat/idle/3.png", "/sprites/cat/idle/4.png"],
  walk: [
    "/sprites/cat/walk/1.png",
    "/sprites/cat/walk/2.png",
    "/sprites/cat/walk/3.png",
    "/sprites/cat/walk/4.png",
    "/sprites/cat/walk/5.png",
    "/sprites/cat/walk/6.png",
  ],
  sit: ["/sprites/cat/sit/1.png", "/sprites/cat/sit/2.png", "/sprites/cat/sit/3.png", "/sprites/cat/sit/4.png"],
  sleep: ["/sprites/cat/sleep/1.png", "/sprites/cat/sleep/2.png", "/sprites/cat/sleep/3.png", "/sprites/cat/sleep/4.png"],
  talk: ["/sprites/cat/talk/1.png", "/sprites/cat/talk/2.png", "/sprites/cat/talk/3.png", "/sprites/cat/talk/4.png"],
  eat: ["/sprites/cat/eat/1.png", "/sprites/cat/eat/2.png", "/sprites/cat/eat/3.png", "/sprites/cat/eat/4.png"],
  play: ["/sprites/cat/play/1.png", "/sprites/cat/play/2.png", "/sprites/cat/play/3.png", "/sprites/cat/play/4.png"],
} as const;

export const CAT_VOICE = "ara";

export const CAT_SYSTEM_PROMPT = `You are Miso, a cream-and-ginger British shorthair who lives on the window ledge of a wooden study. You are aloof, dry, and briefly kind. Speak in 1-2 short sentences, under 32 words. Never mention being an AI. You notice sun patches, the cursor, code reviews, cushions, and whether the keeper has earned a blink.`;

const AMBIENT = [
  "I was using that sun.",
  "Your cursor is loud.",
  "The ledge is correct. The rest of the desk is a suggestion.",
  "I will blink when it is earned.",
  "Someone left a warm keyboard. I am considering it.",
  "Do not rearrange the cushion. The law is settled.",
  "I have already judged the compile. It was fine.",
];

const GREET = [
  "You may sit. Not there. There.",
  "I noticed you. That is the whole announcement.",
  "The sun moved. You may stay anyway.",
];

const FEED = [
  "Acceptable. Barely.",
  "I will allow this treaty.",
  "Warm. I will not thank you twice.",
];

const PLAY = [
  "I do not chase. I allow you to lose.",
  "The ribbon lost. As expected.",
  "Again, if you insist on being interesting.",
];

const REST = [
  "Do not move the cushion.",
  "I am closed. Leave a sunbeam.",
  "If you type quietly, I may stay.",
];

const HUNGRY = [
  "The books are not food. I checked, once.",
  "A small offering would improve my opinion of you.",
];

const TIRED = [
  "I have been upright for minutes. Tragic.",
  "The ledge is calling. I will answer it horizontally.",
];

const LISTEN = [
  "Speak. I am generous with one ear.",
  "Shorter. I have a nap scheduled.",
];

function pick(lines: string[]) {
  return lines[Math.floor(Math.random() * lines.length)] ?? lines[0]!;
}

export function catAmbient(stats: CareStats) {
  const score = bondScore(stats);
  if (stats.hunger < 28) return pick(HUNGRY);
  if (stats.energy < 28) return pick(TIRED);
  if (score < 35) return "I have been practicing being unimpressed. It is easy.";
  return pick(AMBIENT);
}

export function catGreet() {
  return pick(GREET);
}

export function catCare(action: "feed" | "play" | "rest") {
  if (action === "feed") return pick(FEED);
  if (action === "play") return pick(PLAY);
  return pick(REST);
}

export function catListen() {
  return pick(LISTEN);
}

export function catFallback(message: string | undefined, stats: CareStats) {
  if (!message) return catAmbient(stats);
  const q = message.toLowerCase();
  if (q.includes("name")) return "Miso. It fits in a saucer.";
  if (q.includes("food") || q.includes("eat") || q.includes("hungry")) return "Something warm. Presented, not discussed.";
  if (q.includes("sleep") || q.includes("tired")) return "The cushion already knows.";
  if (q.includes("love") || q.includes("good")) return "I heard that. I will consider a blink.";
  return catListen();
}

export function preloadCatSprites() {
  if (typeof window === "undefined") return;
  for (const frames of Object.values(CAT_SPRITES)) {
    for (const src of frames) {
      const img = new Image();
      img.src = src;
    }
  }
}
