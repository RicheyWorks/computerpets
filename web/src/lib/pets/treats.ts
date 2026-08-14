export type TreatShape = "bamboo" | "crumb" | "seed" | "leaf" | "flake" | "pebble" | "ember";

const TREATS: Record<string, { shape: TreatShape; verb: string }> = {
  red_panda: { shape: "bamboo", verb: "Bamboo" },
  cat: { shape: "crumb", verb: "Crumbs" },
  dog: { shape: "crumb", verb: "Biscuit" },
  rabbit: { shape: "leaf", verb: "Greens" },
  hamster: { shape: "seed", verb: "Seed" },
  guinea_pig: { shape: "leaf", verb: "Haybit" },
  turtle: { shape: "leaf", verb: "Leaf" },
  goldfish: { shape: "flake", verb: "Flake" },
  budgie: { shape: "seed", verb: "Seed" },
  fox: { shape: "crumb", verb: "Morsel" },
  penguin: { shape: "pebble", verb: "Pebble" },
  parrot: { shape: "seed", verb: "Nut" },
  ferret: { shape: "crumb", verb: "Nibble" },
  hedgehog: { shape: "crumb", verb: "Bug" },
  chinchilla: { shape: "seed", verb: "Rosehip" },
  axolotl: { shape: "flake", verb: "Worm" },
  toucan: { shape: "leaf", verb: "Fruit" },
  iguana: { shape: "leaf", verb: "Green" },
  dragon: { shape: "ember", verb: "Tribute" },
  phoenix: { shape: "ember", verb: "Ember" },
};

export function treatFor(key: string) {
  return TREATS[key] ?? { shape: "crumb" as TreatShape, verb: "Treat" };
}

export const GIFT_LINE: Record<string, string> = {
  red_panda: "A ribbon I was not using. For the desk.",
  cat: "A moth. Consider it a review.",
  dog: "A sock. I found it first.",
  rabbit: "A clover. Four, if you squint.",
  hamster: "A seed from the official hoard.",
  guinea_pig: "Hay, arranged. Wheek optional.",
  turtle: "A stone I have been considering.",
  goldfish: "A bubble that lasted.",
  budgie: "A note. It says 'ok'.",
  fox: "The bug. Filed.",
  penguin: "A pebble of some standing.",
  parrot: "A word. Keep it.",
  ferret: "Your dongle. Improved.",
  hedgehog: "A leaf I trusted.",
  chinchilla: "Dust, but the good kind.",
  axolotl: "Calm, in object form.",
  toucan: "A berry. Inspected.",
  iguana: "Sun, compressed.",
  dragon: "A coin from the smaller hoard.",
  phoenix: "Ash that still glows.",
};
