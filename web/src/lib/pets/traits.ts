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
};

export const FALLBACK_TRAIT = TRAITS.red_panda!;

export function traitFor(key: string) {
  return TRAITS[key] ?? FALLBACK_TRAIT;
}
