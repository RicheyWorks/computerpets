/** Sleep windows: [startHour, endHour). Overnight if start > end. */
const REST: Record<string, [number, number]> = {
  red_panda: [22, 7],
  cat: [13, 16],
  dog: [21, 6],
  rabbit: [22, 6],
  hamster: [8, 18],
  guinea_pig: [21, 6],
  turtle: [20, 7],
  goldfish: [23, 5],
  budgie: [19, 6],
  fox: [9, 17],
  penguin: [22, 6],
  parrot: [20, 6],
  ferret: [10, 17],
  hedgehog: [8, 18],
  chinchilla: [21, 7],
  axolotl: [22, 8],
  toucan: [19, 6],
  iguana: [20, 8],
  dragon: [1, 8],
  phoenix: [23, 6],
};

export function isRestingHour(key: string, hour = new Date().getHours()) {
  const [start, end] = REST[key] ?? [22, 7];
  if (start === end) return false;
  if (start < end) return hour >= start && hour < end;
  return hour >= start || hour < end;
}

export const HIDE_LINE: Record<string, string> = {
  red_panda: "I went where the ribbon goes.",
  cat: "The ledge is closed.",
  dog: "I will be under the desk. Call if you walk.",
  rabbit: "Under the chair. Thump if you need me.",
  hamster: "The pouch is a room.",
  guinea_pig: "Hay-side. Quiet.",
  turtle: "I am still here. You will not notice.",
  goldfish: "Behind the glass. Loop later.",
  budgie: "Cage-corner. Soft.",
  fox: "The left pocket. Obviously.",
  penguin: "A small bow, then away.",
  parrot: "I left a note. It says 'brb'.",
  ferret: "I took the dongle with me.",
  hedgehog: "A polite curl, offstage.",
  chinchilla: "Dust-side.",
  axolotl: "I receded. Calmly.",
  toucan: "The perch is vacant. Briefly.",
  iguana: "I am a stone now.",
  dragon: "The hoard is attended. From elsewhere.",
  phoenix: "Ash-side. I will be back.",
};

export const SNACK_LINE: Record<string, string> = {
  red_panda: "A small treaty. Bamboo-adjacent.",
  cat: "I allow this crumb.",
  dog: "For me? I have prepared a sit.",
  rabbit: "A green thing. Correct.",
  hamster: "It fits. Officially.",
  guinea_pig: "Wheek, but smaller.",
  turtle: "I will arrive at the crumb in due course.",
  goldfish: "It drifted. I followed.",
  budgie: "Seed. The only review that matters.",
  fox: "I found it first.",
  penguin: "A pebble of food. Accepted.",
  parrot: "Crunch. Noted.",
  ferret: "Mine. Also that other bit.",
  hedgehog: "A quiet nibble.",
  chinchilla: "That crumb was a scandal. Now it is gone.",
  axolotl: "I grew a little more fed.",
  toucan: "The bill approves.",
  iguana: "I blinked at it. Then I ate.",
  dragon: "Tribute. Modest.",
  phoenix: "Warm. Good.",
};
