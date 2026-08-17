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
  ball_python: [8, 17],
  corn_snake: [9, 18],
  kingsnake: [21, 6],
  green_tree_python: [8, 17],
  hognose: [20, 7],
  garter: [21, 6],
  boa: [22, 7],
  milk_snake: [9, 18],
  rosy_boa: [21, 7],
  carpet_python: [8, 17],
  octopus: [8, 17],
  cuttlefish: [8, 17],
  nautilus: [8, 18],
  moon_jelly: [23, 5],
  sea_star: [21, 6],
  hermit_crab: [8, 18],
  horseshoe_crab: [8, 18],
  seahorse: [20, 6],
  manta: [21, 6],
  moray: [8, 17],
};

export function isRestingHour(key: string, hour = new Date().getHours()) {
  const [start, end] = REST[key] ?? [22, 7];
  if (start === end) return false;
  if (start < end) return hour >= start && hour < end;
  return hour >= start || hour < end;
}

export type DayPart = "dawn" | "day" | "dusk" | "night";

export function dayPart(hour = new Date().getHours()): DayPart {
  if (hour >= 5 && hour < 8) return "dawn";
  if (hour >= 8 && hour < 17) return "day";
  if (hour >= 17 && hour < 21) return "dusk";
  return "night";
}

export function dayPartLabel(part: DayPart) {
  if (part === "dawn") return "Dawn";
  if (part === "dusk") return "Dusk";
  if (part === "night") return "Night";
  return "Day";
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
  ball_python: "I went inside the bun.",
  corn_snake: "I took the pencil canyon.",
  kingsnake: "The drawer is closed. By me.",
  green_tree_python: "Above you. Still green.",
  hognose: "I died backstage.",
  garter: "Mid-route. Do not wait.",
  boa: "Under the river of blotter.",
  milk_snake: "Behind a rumor.",
  rosy_boa: "The corner kept me.",
  carpet_python: "Off the legend. Still on the shelf.",
  octopus: "I went inside the cup.",
  cuttlefish: "Behind a flush.",
  nautilus: "In the older room.",
  moon_jelly: "A lower drift.",
  sea_star: "I am still here. You will not notice.",
  hermit_crab: "The lid is closed. By me.",
  horseshoe_crab: "Under the tray.",
  seahorse: "Hitched. Do not jostle.",
  manta: "Above the bowl. Still a kite.",
  moray: "Inside the jamb.",
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
  ball_python: "I will sit on the thought of it.",
  corn_snake: "Pinkie diplomacy. Accepted.",
  kingsnake: "Tribute in bands of flavor.",
  green_tree_python: "Warmth first. Then the treaty.",
  hognose: "I will eat this after my scene.",
  garter: "Worm treaty. Signed in three copies.",
  boa: "Tribute. I will take my time.",
  milk_snake: "An egg of a treaty.",
  rosy_boa: "A mouse of manners.",
  carpet_python: "A morsel for the cartographer.",
  octopus: "A crab of a treaty.",
  cuttlefish: "A shrimp of a treaty.",
  nautilus: "Tribute for the older office.",
  moon_jelly: "A drift of food. Accepted.",
  sea_star: "I will finish this this afternoon.",
  hermit_crab: "Scrap diplomacy. Accepted.",
  horseshoe_crab: "A worm of a treaty.",
  seahorse: "A brine of a treaty.",
  manta: "A filter of a treaty.",
  moray: "A fish of a treaty.",
};


export function returnLine(awayMs: number, hour = new Date().getHours()) {
  const hours = awayMs / 3_600_000;
  if (hours < 0.4) return null;
  if (hours >= 20) {
    if (hour >= 5 && hour < 11) return "You were gone a night. I kept the blotter.";
    return "A long absence. I counted the dust.";
  }
  if (hours >= 6) return "Hours. I sat in most of them.";
  if (hours >= 1) return "You were elsewhere. I practiced waiting.";
  return "Back. I noticed.";
}

export function rememberVisit(key: string) {
  const store = `computerpets.seen.${key}`;
  let away = 0;
  try {
    const last = Number(localStorage.getItem(store) || 0);
    if (last > 0) away = Date.now() - last;
    localStorage.setItem(store, String(Date.now()));
  } catch {
    /* ignore */
  }
  return away;
}
