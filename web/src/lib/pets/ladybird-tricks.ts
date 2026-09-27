/** Seven ground tricks while idle — ultra-polish pass. House seven-spot ladybird — spots / aphid / reflex / climb / coccinella / pronotum / alar personality (spots elytra-spot polish and count-display on the blotter — never named elytra (Spark firefly owns elytra) / count (ethogram-old + window SPOT) / stripe (Bandit) / flash (Quill) / warning (Milk) / semaphore (Spark), aphid aphid-hunt stalk and bead-pounce — never named hunt (ethogram-old + Haste window) / forage (bumblebee window) / mouser (Rue) / stalk (Rue) / pounce (Miso) / clamp (Snap) / seize (robber fly window), reflex reflex-bleed hush (thanatosis bead) — never named feign (Bluff) / curl (Burr) / tuck (Ink) / freeze (Twig window FREEZE) / hush / bleed / hemolymph / still (ethogram-old), climb leaf-dish ascent — never named lift (Ember) / tread (Twig) / crawl (Cling) / scurry (Clip) / scuttle (Tenant) / amble (Bloom) / vault (Kite) / rise / soar, coccinella desk life as a Coccinella septempunctata Seven-spot Ladybird week, pronotum white pronotal-disc rock (species-true Coccinella white pronotum spectacles — never named stripe / flash / warning / semaphore / elytra / count / spot-as-window / spots-as-duplicate), alar under-elytra wing whir settle (species-true brief ladybird flight — never named elytra (Spark) / soar / rise / hover (Sepia) / buzz (Relay) / flash (Quill) / lantern (Spark) / jstroke (Spark) / wing (Kite) / breach (Kite)); not Column gallery/pheromone/crumb/bustle/camponotus/trophallaxis/frass, Twig rocking/catalepsy/browse/tread/diapheromera/oviposit/filiform, Dart hawking/tandem/nymph/whir/anax/obelisk/ommatidia, Spark lantern/jstroke/semaphore/elytra/photinus/photocyte/sternite, Ghost plumose/lunule/silk/stream/actias/aphagy/cauda, Milk asclepias/oyamel/warning/chrysalis/danaus/cremaster/tarsus, Comb figure/corbicula/hex/proboscis/hive/ocelli/nasonov, Dew mucilage/tentacle/digest/gland/rosette/lamina/circinate, Well peristome/cistern/brine/operculum/urn/ala/baffle, Snap clamp/trichome/stew/unseal/poise/cage/scape, Arm rib/branch/nocturne/areole/sentinel/pleat/boot, Moth labellum/velamen/column/spike/epiphyte/keiki/pollinia, Disk pad/corolla/rhizome/calyx/sheen/peltate/hydropote, Mast acorn/sinus/gall/taproot/bole/catkin/tyloses, Fan biloba/notch/flutter/drop/amber, Vein frond/rachis/fiddle/pinna/saucer/sori/stipe, Felt tuft/bead/spore/cushion/thatch/rhizoid/seta, Door hinge/pharynx/knot/lurk/jamb, Kite wing/lobe/gyre/vault/span, Echo preen/bobble, Ember cinder/blaze, Quill fan/flash, Relay buzz/click, Rui dance, Sepia hover, Pulse medusa/trail, Clip nest/scurry, Tenant antenna/scuttle, Dragon glow, or Jade sway/Sol nod copies). Pronotum is the iconic Coccinella white-disc rock (not window SPOT, not ethogram-old count). Alar is the iconic under-elytra whir settle (not Spark elytra, not Quill flash). Window-play SPOT unchanged — never names count. Ethogram keeps coccinella sit_hold; adds spots/aphid/reflex/climb/pronotum/alar softs + freeze (replaces thin count/hunt/still). Amplitudes raised toward Rui richness; denser waits/weights; prefersHouseCry via ladybird.wav. Thank-yous septempunctata / hemolymph / coccinellid. Feed-happy after eat. Sleep, hide, leave, rest, card still win. Same map as desktop `ladybird-tricks.js`. True house-ladybird desk life — not Rui/cat/dog/rabbit/hamster/Clip/guinea pig/turtle/Ink/goldfish/Coin/budgie/Echo/fox/penguin/parrot/ferret/hedgehog/Burr/chinchilla/axolotl/Bloom/toucan/iguana/Sol/dragon/Vesper/phoenix/Ember/snake/Coral/octopus/Cup/cuttlefish/Sepia/nautilus/Chamber/moon-jelly/Pulse/sea-star/Cling/hermit-crab/Tenant/horseshoe-crab/Ledger/seahorse/Anchor/manta/Kite/moray/Door/moss/Felt/fern/Vein/ginkgo/Fan/oak/Mast/water-lily/Disk/orchid/Moth/saguaro/Arm/venus-flytrap/Snap/pitcher/Drown/sundew/Dew/honeybee/Comb/monarch/Milk/luna/Ghost/firefly/Spark/darner/Dart/stick/Twig/carpenter_ant/Column or *Dragon electrical clone. Next guest ultra is Shard / silica. Coccinellidae Coccinella desk life only. No cry inventing — thank-yous are silent desk motion only. */
export const TRICK_KEY = "ladybird";
export const TRICKS = ["spots", "aphid", "reflex", "climb", "coccinella", "pronotum", "alar"] as const;
export const HAPPY = ["septempunctata", "hemolymph", "coccinellid"] as const;
export type LadybirdTrickKind = (typeof TRICKS)[number];
export type LadybirdHappyKind = (typeof HAPPY)[number];
export type TrickAnim = "idle" | "walk" | "sit" | "sleep" | "talk" | "play";
export type TrickPhase = "go" | "hold" | "release" | "done";
export type HappyPhase = "go" | "done";

export type TrickFlags = {
  asleep?: boolean;
  hidden?: boolean;
  leaving?: boolean;
  cmd?: string;
  windowPlay?: boolean;
  card?: boolean;
};

export type LadybirdTrick = {
  kind: LadybirdTrickKind;
  phase: TrickPhase;
  t: number;
  x: number;
  lift: number;
  rot: number;
  anim: TrickAnim;
  facing: 1 | -1;
  fromX: number;
  abort?: boolean;
};

export type LadybirdHappy = {
  kind: LadybirdHappyKind;
  happy: true;
  phase: HappyPhase;
  t: number;
  x: number;
  lift: number;
  rot: number;
  anim: TrickAnim;
  facing: 1 | -1;
  fromX: number;
  abort?: boolean;
};

export const HAPPY_DUR: Record<LadybirdHappyKind, number> = {
  septempunctata: 1.70,
  hemolymph: 1.84,
  coccinellid: 1.76,
};
export const COCCINELLA_HOLD = 11.2;
export const RELEASE_S = 1.18;
export const DUR: Record<LadybirdTrickKind, number> = {
  coccinella: COCCINELLA_HOLD + RELEASE_S,
  spots: 2.48,
  aphid: 2.42,
  reflex: 2.44,
  climb: 2.56,
  pronotum: 2.40,
  alar: 2.38,
};

export function canStart(state: TrickFlags | undefined) {
  if (!state) return false;
  if (state.asleep || state.hidden || state.leaving || state.windowPlay || state.card) return false;
  const cmd = String(state.cmd || "");
  if (cmd === "sleep" || cmd === "leave" || cmd === "hide" || cmd === "rest") return false;
  if (cmd === "seek" || cmd === "eat" || cmd === "play" || cmd === "talk" || cmd === "enter") return false;
  return true;
}

export function shouldAbort(state: TrickFlags | undefined) {
  if (!state) return true;
  if (state.asleep || state.hidden || state.leaving || state.windowPlay || state.card) return true;
  const cmd = String(state.cmd || "");
  return (
    cmd === "sleep" ||
    cmd === "leave" ||
    cmd === "hide" ||
    cmd === "rest" ||
    cmd === "seek" ||
    cmd === "eat" ||
    cmd === "play" ||
    cmd === "talk" ||
    cmd === "enter"
  );
}

export function nextTrickWait(justFinished: boolean, rand?: number, kind?: LadybirdTrickKind | string) {
  const roll = rand == null ? Math.random() : rand;
  if (kind === "coccinella") return 40 + roll * 24;
  if (kind === "pronotum" || kind === "alar" || kind === "spots") return 12 + roll * 9;
  if (kind === "aphid" || kind === "reflex" || kind === "climb") return 11 + roll * 8;
  return justFinished ? 8 + roll * 8 : 4 + roll * 7;
}

export function pickTrick(rand?: number, musicOn?: boolean, lastKind?: LadybirdTrickKind | string | null) {
  if (musicOn) return "coccinella" as const;
  const roll = rand == null ? Math.random() : rand;
  if (lastKind === "coccinella") {
    if (roll < 0.16) return "spots" as const;
    if (roll < 0.32) return "aphid" as const;
    if (roll < 0.48) return "reflex" as const;
    if (roll < 0.64) return "climb" as const;
    if (roll < 0.82) return "pronotum" as const;
    return "alar" as const;
  }
  if (lastKind === "spots") {
    if (roll < 0.18) return "coccinella" as const;
    if (roll < 0.34) return "aphid" as const;
    if (roll < 0.5) return "reflex" as const;
    if (roll < 0.66) return "climb" as const;
    if (roll < 0.83) return "pronotum" as const;
    return "alar" as const;
  }
  if (lastKind === "aphid") {
    if (roll < 0.16) return "coccinella" as const;
    if (roll < 0.32) return "spots" as const;
    if (roll < 0.48) return "reflex" as const;
    if (roll < 0.64) return "climb" as const;
    if (roll < 0.82) return "pronotum" as const;
    return "alar" as const;
  }
  if (lastKind === "pronotum" || lastKind === "alar") {
    if (roll < 0.16) return "coccinella" as const;
    if (roll < 0.32) return "spots" as const;
    if (roll < 0.48) return "aphid" as const;
    if (roll < 0.64) return "reflex" as const;
    if (roll < 0.8) return "climb" as const;
    return lastKind === "pronotum" ? ("alar" as const) : ("pronotum" as const);
  }
  if (roll < 0.14) return "coccinella" as const;
  if (roll < 0.28) return "spots" as const;
  if (roll < 0.42) return "aphid" as const;
  if (roll < 0.56) return "reflex" as const;
  if (roll < 0.7) return "climb" as const;
  if (roll < 0.85) return "pronotum" as const;
  return "alar" as const;
}

export function happyCanStart(state: TrickFlags | undefined) {
  if (!state) return false;
  if (state.asleep || state.hidden || state.leaving) return false;
  const cmd = String(state.cmd || "");
  if (cmd === "sleep" || cmd === "leave" || cmd === "hide" || cmd === "rest") return false;
  if (cmd === "seek" || cmd === "play" || cmd === "talk" || cmd === "enter") return false;
  return true;
}

export function happyShouldAbort(state: TrickFlags | undefined) {
  if (!state) return true;
  if (state.asleep || state.hidden || state.leaving) return true;
  const cmd = String(state.cmd || "");
  return (
    cmd === "sleep" ||
    cmd === "leave" ||
    cmd === "hide" ||
    cmd === "rest" ||
    cmd === "seek" ||
    cmd === "play" ||
    cmd === "talk" ||
    cmd === "enter"
  );
}

export function wantsThankYou(key: string | undefined | null) {
  return key === TRICK_KEY || key === "seven";
}

export function startThankYou(
  key: string | undefined | null,
  lastKind: LadybirdHappyKind | string | null | undefined,
  x: number,
  facing: 1 | -1,
  flags?: TrickFlags,
) {
  if (!wantsThankYou(key)) return null;
  if (!happyCanStart(flags || { cmd: "idle" })) return null;
  const pick = pickHappy(lastKind as LadybirdHappyKind | null | undefined);
  return { happy: beginHappy(pick, x, facing), kind: pick };
}

export function pickHappy(lastKind?: LadybirdHappyKind | null, rand?: number) {
  const pool = HAPPY.filter((k) => k !== lastKind);
  const list = pool.length ? pool : [...HAPPY];
  const roll = rand == null ? Math.random() : rand;
  return list[Math.floor(roll * list.length)] || list[0];
}

export function beginHappy(kind: LadybirdHappyKind | string, x: number, facing: 1 | -1): LadybirdHappy {
  const name = (HAPPY as readonly string[]).indexOf(kind) >= 0 ? (kind as LadybirdHappyKind) : "septempunctata";
  return {
    kind: name,
    happy: true,
    phase: "go",
    t: 0,
    x: x,
    lift: 0,
    rot: 0,
    anim: name === "septempunctata" ? "play" : name === "hemolymph" ? "talk" : "sit",
    facing: facing == null ? 1 : facing,
    fromX: x,
  };
}

export function septempunctataPose(t: number) {
  const u = Math.max(0, Math.min(1, t / HAPPY_DUR.septempunctata));
  if (u < 0.16) {
    const s = u / 0.16;
    return { lift: s * 2.9, rot: s * 12, dx: 0, anim: "play" as TrickAnim };
  }
  if (u < 0.72) {
    const rock = Math.sin(t * 3.6) + 0.24 * Math.sin(t * 7.1);
    return {
      lift: 2.9 + Math.abs(rock) * 1.35,
      rot: 12 + rock * 10,
      dx: rock * 0.18,
      anim: "play" as TrickAnim,
    };
  }
  const s = (u - 0.72) / 0.28;
  return { lift: 2.0 * (1 - s), rot: 6 * (1 - s), dx: 0, anim: "idle" as TrickAnim };
}
export function hemolymphPose(t: number) {
  const u = Math.max(0, Math.min(1, t / HAPPY_DUR.hemolymph));
  if (u < 0.2) {
    const s = u / 0.2;
    return { lift: s * 3.2, rot: s * -9.5, dx: s * 0.2, anim: "talk" as TrickAnim };
  }
  if (u < 0.78) {
    const shed = Math.sin(t * 4.4) + 0.28 * Math.sin(t * 8.8);
    return {
      lift: 3.2 + Math.abs(shed) * 1.4,
      rot: -9.5 + shed * 9,
      dx: shed * 0.22,
      anim: "talk" as TrickAnim,
    };
  }
  const s = (u - 0.78) / 0.22;
  return { lift: 2.1 * (1 - s), rot: -4.5 * (1 - s), dx: 0, anim: "sit" as TrickAnim };
}
export function coccinellidPose(t: number) {
  return {
    lift: 2.1 + Math.abs(Math.sin(t * 0.42)) * 0.85,
    rot: Math.sin(t * 0.55) * 6.5,
    dx: Math.sin(t * 0.3) * 0.08,
    anim: "sit" as TrickAnim,
  };
}
export function stepHappy(happy: LadybirdHappy, dt: number, flags: TrickFlags): LadybirdHappy {
  if (!happy || happy.phase === "done") return happy;
  if (happyShouldAbort(flags)) {
    return { ...happy, phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true };
  }
  const next: LadybirdHappy = { ...happy, t: happy.t + Math.max(0, dt) };
  const hold = HAPPY_DUR[next.kind];
  if (next.kind === "septempunctata") {
    const pose = septempunctataPose(next.t);
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "hemolymph") {
    const pose = hemolymphPose(next.t);
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else {
    const pose = coccinellidPose(next.t);
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  }
  if (next.t >= hold) return { ...next, phase: "done", lift: 0, rot: 0, anim: "idle" };
  return next;
}

export function sleepHoldFrame(_key?: string | null, _frameCount?: number) {
  return null;
}

export function beginTrick(kind: LadybirdTrickKind, x: number, facing: 1 | -1): LadybirdTrick {
  const anim: TrickAnim =
    kind === "coccinella"
      ? "sit"
      : kind === "spots"
        ? "sit"
        : kind === "aphid"
          ? "walk"
          : kind === "reflex"
            ? "sit"
            : kind === "climb"
              ? "walk"
              : kind === "pronotum"
                ? "sit"
                : kind === "alar"
                  ? "play"
                  : "sit";
  return {
    kind: kind,
    phase: kind === "coccinella" ? "hold" : "go",
    t: 0,
    x: x,
    lift: 0,
    rot: 0,
    anim: anim,
    facing: facing == null ? 1 : facing,
    fromX: x,
  };
}

function smoothstep(t: number) {
  const x = Math.max(0, Math.min(1, t));
  return x * x * (3 - 2 * x);
}

export function coccinellaPose(t: number) {
  const breath = Math.sin(t * 0.18) + 0.03 * Math.sin(t * 0.78);
  const grain = Math.abs(Math.sin(t * 0.36));
  return {
    lift: 2.4 + grain * 1.1,
    rot: 3.8 + breath * 3.2,
  };
}

export function releasePose(t: number) {
  const u = Math.max(0, Math.min(1, t / RELEASE_S));
  return { lift: 2.4 * (1 - Math.sin(u * Math.PI * 0.5)), rot: 3.0 * (1 - u) };
}

export function spotsPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.spots));
  if (u < 0.14) {
    const s = smoothstep(u / 0.14);
    return { x: fromX, lift: s * 2.8, rot: s * 10 * facing, anim: "sit" as TrickAnim };
  }
  if (u < 0.8) {
    const s = (u - 0.14) / 0.66;
    const polish = Math.sin(s * Math.PI * 6.4) + 0.3 * Math.sin(s * Math.PI * 11.2);
    return {
      x: fromX + facing * polish * 0.18,
      lift: 2.8 + Math.abs(polish) * 1.3,
      rot: facing * (10 + polish * 8),
      anim: "sit" as TrickAnim,
    };
  }
  const s = smoothstep((u - 0.8) / 0.2);
  return {
    x: fromX,
    lift: 2.0 * (1 - s),
    rot: facing * (4.5 * (1 - s)),
    anim: "sit" as TrickAnim,
  };
}
export function aphidPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.aphid));
  if (u < 0.18) {
    const s = smoothstep(u / 0.18);
    return { x: fromX + facing * 0.35 * s, lift: s * 2.6, rot: s * 8 * facing, anim: "walk" as TrickAnim };
  }
  if (u < 0.52) {
    const s = (u - 0.18) / 0.34;
    const stalk = Math.sin(s * Math.PI * 2.2);
    return {
      x: fromX + facing * (0.7 * s + stalk * 0.2),
      lift: 2.6 + Math.abs(stalk) * 1.1,
      rot: facing * (8 + stalk * 7),
      anim: "walk" as TrickAnim,
    };
  }
  if (u < 0.78) {
    const s = (u - 0.52) / 0.26;
    const peck = Math.sin(s * Math.PI);
    return {
      x: fromX + facing * (0.85 + peck * 0.25),
      lift: 2.6 - peck * 1.4 + Math.abs(Math.sin(s * Math.PI * 3)) * 0.9,
      rot: facing * (8 - peck * 10),
      anim: "walk" as TrickAnim,
    };
  }
  const s = smoothstep((u - 0.78) / 0.22);
  return {
    x: fromX + facing * 0.55 * (1 - s * 0.35),
    lift: 2.0 * (1 - s),
    rot: facing * (3.5 * (1 - s)),
    anim: "sit" as TrickAnim,
  };
}
export function reflexPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.reflex));
  if (u < 0.12) {
    const s = smoothstep(u / 0.12);
    return { x: fromX, lift: s * -1.8, rot: s * -10 * facing, anim: "sit" as TrickAnim };
  }
  if (u < 0.72) {
    const s = (u - 0.12) / 0.6;
    const hush = Math.sin(s * Math.PI * 1.6) * 0.35;
    return {
      x: fromX + facing * hush * 0.12,
      lift: -1.8 + Math.abs(hush) * 0.55,
      rot: facing * (-10 + hush * 3),
      anim: "sit" as TrickAnim,
    };
  }
  const s = smoothstep((u - 0.72) / 0.28);
  return {
    x: fromX,
    lift: -1.0 * (1 - s),
    rot: facing * (-4.5 * (1 - s)),
    anim: "sit" as TrickAnim,
  };
}
export function climbPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.climb));
  if (u < 0.1) {
    const s = smoothstep(u / 0.1);
    return { x: fromX, lift: s * 2.7, rot: s * 9 * facing, anim: "walk" as TrickAnim };
  }
  if (u < 0.82) {
    const s = (u - 0.1) / 0.72;
    const step = Math.sin(s * Math.PI * 5.0) + 0.32 * Math.sin(s * Math.PI * 8.6);
    return {
      x: fromX + facing * (0.4 * Math.sin(s * Math.PI) + step * 0.2),
      lift: 2.7 + s * 2.4 + Math.abs(step) * 1.1,
      rot: facing * (9 + step * 8),
      anim: "walk" as TrickAnim,
    };
  }
  const s = smoothstep((u - 0.82) / 0.18);
  return {
    x: fromX + facing * 0.15 * (1 - s),
    lift: 4.6 * (1 - s),
    rot: facing * (4 * (1 - s)),
    anim: "sit" as TrickAnim,
  };
}
export function pronotumPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.pronotum));
  if (u < 0.14) {
    const s = smoothstep(u / 0.14);
    return { x: fromX, lift: s * 2.65, rot: s * -9.5 * facing, anim: "sit" as TrickAnim };
  }
  if (u < 0.78) {
    const s = (u - 0.14) / 0.64;
    const disc = Math.sin(s * Math.PI * 5.2) + 0.3 * Math.sin(s * Math.PI * 9.6);
    return {
      x: fromX + facing * disc * 0.16,
      lift: 2.65 + Math.abs(disc) * 1.25,
      rot: facing * (-9.5 + disc * 9),
      anim: "sit" as TrickAnim,
    };
  }
  const s = smoothstep((u - 0.78) / 0.22);
  return {
    x: fromX,
    lift: 2.0 * (1 - s),
    rot: facing * (-4.2 * (1 - s)),
    anim: "sit" as TrickAnim,
  };
}
export function alarPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.alar));
  if (u < 0.12) {
    const s = smoothstep(u / 0.12);
    return { x: fromX, lift: s * 3.1, rot: s * 8 * facing, anim: "play" as TrickAnim };
  }
  if (u < 0.55) {
    const s = (u - 0.12) / 0.43;
    const whir = Math.sin(s * Math.PI * 8.4) + 0.35 * Math.sin(s * Math.PI * 14.2);
    return {
      x: fromX + facing * (0.45 * s + whir * 0.2),
      lift: 3.1 + s * 1.8 + Math.abs(whir) * 0.9,
      rot: facing * (8 + whir * 9),
      anim: "play" as TrickAnim,
    };
  }
  if (u < 0.82) {
    const s = (u - 0.55) / 0.27;
    const settle = Math.sin(s * Math.PI);
    return {
      x: fromX + facing * (0.55 + settle * 0.12),
      lift: 4.9 - s * 2.2 + Math.abs(settle) * 0.6,
      rot: facing * (6 - settle * 4),
      anim: "play" as TrickAnim,
    };
  }
  const s = smoothstep((u - 0.82) / 0.18);
  return {
    x: fromX + facing * 0.35 * (1 - s),
    lift: 2.4 * (1 - s),
    rot: facing * (3 * (1 - s)),
    anim: "sit" as TrickAnim,
  };
}
export function stepTrick(trick: LadybirdTrick, dt: number, flags: TrickFlags): LadybirdTrick {
  if (!trick || trick.phase === "done") return trick;
  if (
    shouldAbort(flags) &&
    trick.kind !== "spots" &&
    trick.kind !== "aphid" &&
    trick.kind !== "reflex" &&
    trick.kind !== "climb" &&
    trick.kind !== "pronotum" &&
    trick.kind !== "alar"
  ) {
    return { ...trick, phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true };
  }
  const next: LadybirdTrick = { ...trick, t: trick.t + Math.max(0, dt) };
  if (next.kind === "coccinella") {
    if (next.t < COCCINELLA_HOLD) {
      const pose = coccinellaPose(next.t);
      next.phase = "hold";
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = "sit";
      return next;
    }
    if (next.t < COCCINELLA_HOLD + RELEASE_S) {
      const pose = releasePose(next.t - COCCINELLA_HOLD);
      next.phase = "release";
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = "sit";
      return next;
    }
    return { ...next, phase: "done", lift: 0, rot: 0, anim: "idle" };
  }
  const hold = DUR[next.kind];
  const u = next.t / hold;
  if (next.kind === "spots") {
    const pose = spotsPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "aphid") {
    const pose = aphidPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "reflex") {
    const pose = reflexPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "climb") {
    const pose = climbPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "pronotum") {
    const pose = pronotumPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else {
    const pose = alarPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  }
  if (u >= 1) return { ...next, phase: "done", lift: 0, rot: 0, anim: "idle" };
  return next;
}
