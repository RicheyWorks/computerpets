/** Species-true house clips and footstep picks. */
(function (root) {
  const VOICE_KEYS = ["red_panda", "hummingbird", "cat", "dog", "chickadee"];
  const STEP_KINDS = ["species", "soft", "tap", "claw", "wood", "mute"];
  const STEP_LABELS = {
    species: "Species",
    soft: "Soft pad",
    tap: "Tap",
    claw: "Claw",
    wood: "Wood",
    mute: "Mute",
  };
  const SOUND_LICENSE = "House-synthesized. Short, loop-safe, public-domain.";

  function isVoiceKey(key) {
    return !!key && VOICE_KEYS.indexOf(key) >= 0;
  }

  function parseStep(raw) {
    return STEP_KINDS.indexOf(String(raw)) >= 0 ? raw : "species";
  }

  function stepDefault(key) {
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

  function stepOf(houseKind, guestKind, key) {
    const guest = parseStep(guestKind);
    if (guest !== "species" && String(guestKind || "")) return guest;
    const house = parseStep(houseKind);
    if (house !== "species") return house;
    return stepDefault(key);
  }

  function voiceSrc(key) {
    return isVoiceKey(key) ? `/sounds/${key}.wav` : "";
  }

  function overlayVoiceSrc(key) {
    return isVoiceKey(key) ? `sounds/${key}.wav` : "";
  }

  function stepSrc(kind, key) {
    const resolved = kind === "species" ? stepDefault(key) : kind;
    if (resolved === "mute") return "";
    return `/sounds/step-${resolved}.wav`;
  }

  function overlayStepSrc(kind, key) {
    const resolved = kind === "species" ? stepDefault(key) : kind;
    if (resolved === "mute") return "";
    return `sounds/step-${resolved}.wav`;
  }

  const api = {
    VOICE_KEYS,
    STEP_KINDS,
    STEP_LABELS,
    SOUND_LICENSE,
    isVoiceKey,
    parseStep,
    stepDefault,
    stepOf,
    voiceSrc,
    overlayVoiceSrc,
    stepSrc,
    overlayStepSrc,
  };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  root.PetHouseSounds = api;
})(typeof window !== "undefined" ? window : globalThis);
