export type SpeciesTrait = {
  walk: number;
  hop: number;
  scale: number;
  wander: number;
  nocturnal: boolean;
  perch: boolean;
  aquatic: boolean;
  clingy: boolean;
  special: string;
  verb: string;
  line: string;
};

const T = (
  walk: number,
  hop: number,
  scale: number,
  wander: number,
  flags: Partial<Pick<SpeciesTrait, "nocturnal" | "perch" | "aquatic" | "clingy">>,
  special: string,
  verb: string,
  line: string,
): SpeciesTrait => ({
  walk,
  hop,
  scale,
  wander,
  nocturnal: !!flags.nocturnal,
  perch: !!flags.perch,
  aquatic: !!flags.aquatic,
  clingy: !!flags.clingy,
  special,
  verb,
  line,
});

export const TRAITS: Record<string, SpeciesTrait> = {
  red_panda: T(98, 26, 1, 0.48, {}, "ribbon", "Steal ribbon", "I found a ribbon. It was not lost. It is now safer."),
  cat: T(68, 16, 1.02, 0.22, {}, "sun", "Claim the sun", "This patch of light is reserved."),
  dog: T(122, 30, 0.96, 0.62, { clingy: true }, "follow", "Heel", "The cursor moved. I have prepared a walk."),
  rabbit: T(136, 36, 0.86, 0.4, {}, "thump", "Thump", "Thump. That was a warning and a hello."),
  hamster: T(148, 22, 0.7, 0.7, { nocturnal: true }, "hoard", "Hoard", "This paperclip is now mine. Officially."),
  guinea_pig: T(84, 18, 0.8, 0.5, { clingy: true }, "wheek", "Wheek", "Wheek. Deploy celebrated."),
  turtle: T(26, 3, 0.92, 0.08, {}, "still", "Be still", "I moved. You missed it. That is fine."),
  goldfish: T(52, 6, 0.78, 0.8, { aquatic: true }, "loop", "Loop", "Around again. The view improved."),
  budgie: T(92, 20, 0.68, 0.45, { perch: true }, "echo", "Echo", "Build failed. But musically."),
  fox: T(112, 24, 1.04, 0.4, { nocturnal: true }, "bug", "Find a bug", "There is a bug in the left pocket. You knew."),
  penguin: T(58, 12, 0.9, 0.28, {}, "ritual", "Bow", "A bow. It is brief. It is required."),
  parrot: T(88, 22, 0.94, 0.42, { perch: true }, "quote", "Quote", "Fix typo. A masterpiece."),
  ferret: T(156, 20, 0.88, 0.75, {}, "steal", "Steal", "I put your dongle somewhere better."),
  hedgehog: T(48, 10, 0.76, 0.16, { nocturnal: true }, "curl", "Curl", "Waiting is a kindness I notice."),
  chinchilla: T(118, 26, 0.8, 0.38, {}, "bath", "Dust bath", "That crumb is a scandal."),
  axolotl: T(34, 5, 0.9, 0.3, { aquatic: true }, "regrow", "Regrow", "I grew a little more calm."),
  toucan: T(80, 18, 1.08, 0.34, { perch: true }, "bill", "Inspect", "This perch has opinions about your posture."),
  iguana: T(20, 4, 1.06, 0.06, {}, "bask", "Bask", "I blinked. Minutes will not record it."),
  dragon: T(74, 22, 1.18, 0.24, {}, "hoard", "Keep watch", "I could be larger. I choose this."),
  phoenix: T(86, 24, 1.12, 0.3, { perch: true }, "reborn", "Ember", "I came back softer."),
  ball_python: T(36, 4, 0.92, 0.14, {}, "coil", "Coil", "I made a bun. I am the bun."),
  corn_snake: T(88, 8, 0.84, 0.55, { nocturnal: true }, "slither", "Thread", "I found a gap. I am the gap's problem."),
  kingsnake: T(74, 8, 0.88, 0.32, {}, "inspect", "Inspect", "I am the law of this drawer."),
  green_tree_python: T(28, 6, 0.9, 0.1, { perch: true, nocturnal: true }, "drape", "Drape", "I folded in half. That is sitting."),
  hognose: T(70, 10, 0.78, 0.38, {}, "playdead", "Play dead", "I died. I got over it."),
  garter: T(110, 10, 0.68, 0.7, {}, "patrol", "Patrol", "I do not lounge. I pause."),
  boa: T(42, 5, 1.08, 0.16, {}, "hold", "Hold", "I could be tighter. I choose this."),
  milk_snake: T(80, 8, 0.82, 0.4, { nocturnal: true }, "mimic", "Mimic", "I am not who I look like. Hello."),
  rosy_boa: T(34, 4, 0.8, 0.12, {}, "nest", "Nest", "I am a blush that learned to crawl."),
  carpet_python: T(64, 8, 1.04, 0.28, { perch: true }, "chart", "Chart", "This pattern is a map. I am the country."),
  octopus: T(48, 10, 0.88, 0.35, { aquatic: true }, "ink", "Ink", "I jet. Then I am a cup again."),
  cuttlefish: T(40, 4, 0.9, 0.45, { aquatic: true }, "flush", "Flush", "I changed for you. Then I changed back."),
  nautilus: T(36, 8, 0.95, 0.28, { aquatic: true }, "rise", "Rise", "I have been rising. You may wait."),
  moon_jelly: T(28, 2, 0.82, 0.7, { aquatic: true }, "pulse", "Pulse", "I pulsed. That was hello."),
  sea_star: T(14, 2, 0.7, 0.06, { aquatic: true }, "cling", "Cling", "I have not moved. That is hello."),
  hermit_crab: T(56, 8, 0.72, 0.4, {}, "trade", "Trade", "This shell is temporary. Hello."),
  horseshoe_crab: T(32, 4, 0.86, 0.18, {}, "molt", "Molt", "I am not a crab. Hello."),
  seahorse: T(24, 2, 0.68, 0.22, { aquatic: true }, "hitch", "Hitch", "I hitched. You may look."),
  manta: T(44, 3, 1.16, 0.5, { aquatic: true }, "soar", "Soar", "I saved you a length of sky."),
  moray: T(70, 6, 1.02, 0.08, { aquatic: true }, "gape", "Gape", "The gape is air. Not a threat. Mostly."),
  moss: T(6, 0, 0.55, 0.04, {}, "carpet", "Carpet", "I was already the page. Hello."),
  maidenhair: T(8, 0, 0.72, 0.06, {}, "unfurl", "Unfurl", "I unfurled an inch. Hello."),
  ginkgo: T(10, 0, 0.85, 0.08, {}, "gold", "Gold", "I have been gold before. Hello."),
  oak: T(8, 0, 0.78, 0.05, {}, "drop", "Drop", "I agreed to be small."),
  redwood: T(6, 0, 1.2, 0.04, {}, "rise", "Rise", "I rose an inch. You may look."),
  water_lily: T(12, 0, 0.88, 0.15, { aquatic: true }, "open", "Open", "I opened. That was hello."),
  duckweed: T(16, 0, 0.42, 0.25, { aquatic: true }, "divide", "Divide", "I divided. That was hello."),
  venus_flytrap: T(8, 14, 0.68, 0.06, {}, "snap", "Snap", "I did not snap. That is hello."),
  orchid: T(8, 0, 0.9, 0.06, {}, "bloom", "Bloom", "I bloomed. You may look."),
  saguaro: T(4, 0, 1.05, 0.03, {}, "store", "Store", "I have not moved. That is hello."),
};

export const FALLBACK_TRAIT = TRAITS.red_panda!;

export function traitFor(key: string) {
  return TRAITS[key] ?? FALLBACK_TRAIT;
}
