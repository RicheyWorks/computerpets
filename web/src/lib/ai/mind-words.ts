/**
 * The plain words on every Minds screen: the web desk `/mind`, the overlay Settings window, and the
 * Python blotter. The same sentences sit in desktop/renderer/settings.html and
 * client/computerpets_client/minds.py, and a test holds all three together.
 */
export const MIND_WORDS = {
  intro: "Pets talk without an AI. Adding one is optional.",
  which: "Which AI",
  allPets: "Use for all pets",
  sameAsAll: "Same as all pets",
  house: "House lines need nothing else. Your pets answer with their own words.",
  model: "AI model name",
  modelHelp: "Which version of that AI answers. Picking an AI fills this in, so most people leave it alone.",
  address: "AI website address",
  addressHelp: "Where that AI answers. Picking an AI fills this in, so most people leave it alone.",
  key: "Your key for that AI website",
  keyHelp: "A secret code from that AI website's own page. Keep it secret, like a password.",
  keyPlaceholder: "Paste your key here",
} as const;

/** The small plain tag on each AI card on `/mind` (instead of the plugin kind a builder would read). */
export function presetTag(preset: { kind: string; needsKey?: boolean; id: string }): string {
  if (preset.kind === "local") return "No AI";
  if (preset.kind === "custom") return "Your own address";
  if (preset.kind === "ollama" || preset.id === "lmstudio") return "On this computer";
  return preset.needsKey ? "Needs a key" : "No key needed";
}
