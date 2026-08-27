/** Species-true house clips and footstep picks. Same map as desktop `house-sounds.js`. */

export const VOICE_KEYS = ["red_panda", "hummingbird", "cat", "dog", "chickadee"] as const;
export type VoiceKey = (typeof VOICE_KEYS)[number];

export const STEP_KINDS = ["species", "soft", "tap", "claw", "wood", "mute"] as const;
export type StepKind = (typeof STEP_KINDS)[number];

export const STEP_LABELS: Record<StepKind, string> = {
  species: "Species",
  soft: "Soft pad",
  tap: "Tap",
  claw: "Claw",
  wood: "Wood",
  mute: "Mute",
};

export const SOUND_LICENSE = "House-synthesized. Short, loop-safe, public-domain.";

export function isVoiceKey(key: string | undefined): key is VoiceKey {
  return !!key && (VOICE_KEYS as readonly string[]).includes(key);
}

export function parseStep(raw: unknown): StepKind {
  return (STEP_KINDS as readonly string[]).includes(String(raw)) ? (raw as StepKind) : "species";
}

/** Honest defaults. Rui a soft pad. A bird not a boot. A dog a tap. */
export function stepDefault(key: string | undefined): Exclude<StepKind, "species" | "mute"> {
  if (key === "red_panda" || key === "cat" || key === "fox") return "soft";
  if (key === "dog") return "tap";
  if (
    key === "hummingbird" ||
    key === "chickadee" ||
    key === "crow" ||
    key === "raven" ||
    key === "robin" ||
    key === "budgie" ||
    key === "parrot" ||
    key === "toucan" ||
    key === "phoenix" ||
    key === "barn_owl" ||
    key === "red_tail" ||
    key === "pileated" ||
    key === "mallard" ||
    key === "canada_goose"
  )
    return "claw";
  if (key === "turtle" || key === "hedgehog" || key === "armadillo") return "wood";
  return "tap";
}

export function stepOf(houseKind: unknown, guestKind: unknown, key: string | undefined): StepKind {
  const guest = parseStep(guestKind);
  if (guest !== "species" && String(guestKind || "")) return guest;
  const house = parseStep(houseKind);
  if (house !== "species") return house;
  return stepDefault(key);
}

export function voiceSrc(key: string) {
  if (!isVoiceKey(key)) return "";
  return `/sounds/${key}.wav`;
}

export function stepSrc(kind: StepKind, key?: string) {
  const resolved = kind === "species" ? stepDefault(key) : kind;
  if (resolved === "mute") return "";
  return `/sounds/step-${resolved}.wav`;
}

export function overlayVoiceSrc(key: string) {
  if (!isVoiceKey(key)) return "";
  return `sounds/${key}.wav`;
}

export function overlayStepSrc(kind: StepKind, key?: string) {
  const resolved = kind === "species" ? stepDefault(key) : kind;
  if (resolved === "mute") return "";
  return `sounds/step-${resolved}.wav`;
}
