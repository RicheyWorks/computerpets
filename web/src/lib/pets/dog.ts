import type { CareStats } from "./care";
import { bondScore } from "./care";

export const DOG_KEY = "dog";
export const DOG_NAME = "Pip";

export const DOG_SPRITES = {
  idle: ["/sprites/dog/idle/1.png", "/sprites/dog/idle/2.png", "/sprites/dog/idle/3.png", "/sprites/dog/idle/4.png"],
  walk: [
    "/sprites/dog/walk/1.png",
    "/sprites/dog/walk/2.png",
    "/sprites/dog/walk/3.png",
    "/sprites/dog/walk/4.png",
    "/sprites/dog/walk/5.png",
    "/sprites/dog/walk/6.png",
  ],
  sit: ["/sprites/dog/sit/1.png", "/sprites/dog/sit/2.png", "/sprites/dog/sit/3.png", "/sprites/dog/sit/4.png"],
  sleep: ["/sprites/dog/sleep/1.png", "/sprites/dog/sleep/2.png", "/sprites/dog/sleep/3.png", "/sprites/dog/sleep/4.png"],
  talk: ["/sprites/dog/talk/1.png", "/sprites/dog/talk/2.png", "/sprites/dog/talk/3.png", "/sprites/dog/talk/4.png"],
  eat: ["/sprites/dog/eat/1.png", "/sprites/dog/eat/2.png", "/sprites/dog/eat/3.png", "/sprites/dog/eat/4.png"],
  play: ["/sprites/dog/play/1.png", "/sprites/dog/play/2.png", "/sprites/dog/play/3.png", "/sprites/dog/play/4.png"],
} as const;

export const DOG_VOICE = "leo";

export const DOG_SYSTEM_PROMPT = `You are Pip, a cream corgi who lives on the hearth rug of a wooden study. You are loyal, bright, and a little too ready for a walk. Speak in 1-2 short warm sentences, under 32 words. Never mention being an AI. You notice the cursor, compiles, shoes, and whether the keeper is staying.`;

const AMBIENT = [
  "The cursor moved. I have prepared a walk.",
  "I sat. I can also stand. Both are for you.",
  "If the compile is green, we go outside. That is the law.",
  "I memorized the sound of your chair.",
  "The rug is a very fine waiting place.",
  "I will follow. You do not have to ask.",
];

const GREET = [
  "You came back. I kept the rug warm.",
  "I have been practicing sitting still. It was difficult.",
  "Hello. I brought the whole heart.",
];

const FEED = [
  "This is a treaty. I accept all of it.",
  "One more bite. For the walk later.",
  "Warm. I will stay closer.",
];

const PLAY = [
  "I invented this game. The ball agrees.",
  "Catch me. Or I will catch the cursor.",
  "Again. The rug is an arena.",
];

const REST = [
  "I will just close the eyes that watch the door.",
  "Wake me if you put on shoes.",
  "The rug knows what to do.",
];

const HUNGRY = [
  "I have considered the keyboard. It is not food. Sadly.",
  "A small snack would improve my sit.",
];

const TIRED = [
  "The paws have opinions about walking. They still vote yes.",
  "A sit. Then perhaps a loyal lie-down.",
];

const LISTEN = [
  "I am listening with the entire face.",
  "Say it again. I will keep it.",
];

function pick(lines: string[]) {
  return lines[Math.floor(Math.random() * lines.length)] ?? lines[0]!;
}

export function dogAmbient(stats: CareStats) {
  const score = bondScore(stats);
  if (stats.hunger < 28) return pick(HUNGRY);
  if (stats.energy < 28) return pick(TIRED);
  if (score < 35) return "I waited. I can wait more. I would rather not.";
  return pick(AMBIENT);
}

export function dogGreet() {
  return pick(GREET);
}

export function dogCare(action: "feed" | "play" | "rest") {
  if (action === "feed") return pick(FEED);
  if (action === "play") return pick(PLAY);
  return pick(REST);
}

export function dogListen() {
  return pick(LISTEN);
}

export function dogFallback(message: string | undefined, stats: CareStats) {
  if (!message) return dogAmbient(stats);
  const q = message.toLowerCase();
  if (q.includes("name")) return "Pip. It fits on a collar and in a shout.";
  if (q.includes("food") || q.includes("eat") || q.includes("hungry")) return "Something warm. I will not negotiate the second bite.";
  if (q.includes("sleep") || q.includes("tired")) return "The rug is already making room.";
  if (q.includes("walk") || q.includes("outside")) return "I heard shoes. I am ready.";
  if (q.includes("love") || q.includes("good")) return "I stored that in the chest. It is full. There is still room.";
  return dogListen();
}

export function preloadDogSprites() {
  if (typeof window === "undefined") return;
  for (const frames of Object.values(DOG_SPRITES)) {
    for (const src of frames) {
      const img = new Image();
      img.src = src;
    }
  }
}
