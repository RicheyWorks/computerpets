import { SNAKE_KEYS } from "./snakes";
import { normalizeCare, type CareStats } from "./care";

export { applyShed } from "./care";

const DUE_MS = 8 * 60 * 60 * 1000;

export function isSnake(key: string) {
  return SNAKE_KEYS.includes(key);
}

export function isBlue(stats: Partial<CareStats>, key: string, now = Date.now()) {
  if (!isSnake(key)) return false;
  const s = normalizeCare(stats, now);
  const last = s.shedAt ?? 0;
  return now - last >= DUE_MS;
}

const LINES: Record<string, string> = {
  ball_python: "I left a copy. The better bun stayed.",
  corn_snake: "An old sentence. I am the new one.",
  kingsnake: "The bands were due for a reprint.",
  green_tree_python: "Emerald, revised. The old loop is on the blotter.",
  hognose: "I died out of my coat. Reviews were better.",
  garter: "Three new lines. The old route is discarded.",
  boa: "I kept the river. I left the bank.",
  milk_snake: "A rumor I no longer need.",
  rosy_boa: "The pink is new. The corner may keep the rest.",
  carpet_python: "A legend I outgrew. Keep the map.",
};

const WAIT: Record<string, string> = {
  ball_python: "The bun is still honest. Later.",
  corn_snake: "This coat is mid-sentence.",
  kingsnake: "The bands are still in session.",
  green_tree_python: "The loop is not finished being green.",
  hognose: "I am using this death. Not the coat.",
  garter: "The patrol is still in this uniform.",
  boa: "This river has not reached the sea.",
  milk_snake: "The costume still fits the rumor.",
  rosy_boa: "The stone is not ready to change.",
  carpet_python: "The map is current.",
};

export function shedLine(key: string) {
  return LINES[key] ?? "I left a copy. I kept the better one.";
}

export function shedWaitLine(key: string) {
  return WAIT[key] ?? "The coat is still good.";
}
