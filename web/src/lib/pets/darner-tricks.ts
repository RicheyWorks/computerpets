/** Dart ground tricks while idle — ultra-polish pass. House darner — hawking / tandem / nymph / whir / anax / obelisk / ommatidia personality (hawking Anax lamp-air prey patrol on the blotter — never named hawk (ethogram-old+window Hawk) / dart (Coin+ethogram) / hover (Sepia+ethogram) / bob / still / soar / jstroke (Spark) / stream (Ghost) / wing (Kite) / flutter (Fan) / photocyte (Spark), tandem oviposition-pair clasp perch — never named silk (Ghost) / chrysalis (Milk) / coil / tuck / curl / nest (Clip) / sternite (Spark), nymph aquatic-larva memory with labium-strike recall — never named larva / crawl (Cling) / paddle (Ink) / soak / mucilage (Dew) / digest, whir rapid wing-engine warm-up — never named buzz (Relay) / click (Relay) / wing / flutter / semaphore (Spark) / elytra (Spark) / flash / glow, anax desk life as an Anax junius Aeshnidae green darner week, obelisk sun-point thermoregulation handstand (species-true odonate obelisk — never named freeze / still / catalepsy (Twig) / bask / perch / soar), ommatidia compound-eye scan (species-true Aeshnidae ommatidia — never named ocelli (Comb) / facet / watch / stare / eye); not Spark lantern/jstroke/semaphore/elytra/photinus/photocyte/sternite, Ghost plumose/lunule/silk/stream/actias/aphagy/cauda, Milk asclepias/oyamel/warning/chrysalis/danaus/cremaster/tarsus, Comb figure/corbicula/hex/proboscis/hive/ocelli/nasonov, Dew mucilage/tentacle/digest/gland/rosette/lamina/circinate, Well peristome/cistern/brine/operculum/urn/ala/baffle, Snap clamp/trichome/stew/unseal/poise/cage/scape, Arm rib/branch/nocturne/areole/sentinel/pleat/boot, Moth labellum/velamen/column/spike/epiphyte/keiki/pollinia, Disk pad/corolla/rhizome/calyx/sheen/peltate/hydropote, Mast acorn/sinus/gall/taproot/bole/catkin/tyloses, Fan biloba/notch/flutter/drop/amber/dichotomy/petiole, Vein frond/rachis/fiddle/pinna/saucer/sori/stipe, Felt tuft/bead/spore/cushion/thatch/rhizoid/seta, Door hinge/pharynx/knot/lurk/jamb, Kite wing/lobe/gyre/vault/span, Echo preen/bobble, Ember cinder/blaze, Quill fan/flash, Relay buzz/click, Rui dance, Sepia hover, Pulse medusa, Dragon glow, or Twig rocking/catalepsy copies). Obelisk is the iconic sun-point abdomen raise (not window Hawk, not ethogram-old hawk/hover/still). Ommatidia is the iconic compound-eye scan (not Comb ocelli). Window-play Hawk unchanged — never names hawk. Ethogram keeps anax sit_hold; adds hawking/tandem/nymph/whir/obelisk/ommatidia softs + freeze (replaces thin hawk/hover/still). Amplitudes raised toward Rui richness; denser waits/weights; prefersHouseCry via darner.wav. Thank-yous junius / labium / exuvia. Feed-happy after eat. Sleep, hide, leave, rest, card still win. Same map as desktop `darner-tricks.js`. True house-darner desk life — not Rui/cat/dog/rabbit/hamster/Clip/guinea pig/turtle/Ink/goldfish/Coin/budgie/Echo/fox/penguin/parrot/ferret/hedgehog/Burr/chinchilla/axolotl/Bloom/toucan/iguana/Sol/dragon/Vesper/phoenix/Ember/snake/Coral/octopus/Cup/cuttlefish/Sepia/nautilus/Chamber/moon-jelly/Pulse/sea-star/Cling/hermit-crab/Tenant/horseshoe-crab/Ledger/seahorse/Anchor/manta/Kite/moray/Door/moss/Felt/fern/Vein/ginkgo/Fan/oak/Mast/water-lily/Disk/orchid/Moth/saguaro/Arm/venus-flytrap/Snap/pitcher/Drown/sundew/Dew/honeybee/Comb/monarch/Milk/luna/Ghost/firefly/Spark or *Dragon electrical clone. Next guest ultra is Shard / silica. Aeshnidae Anax desk life only. No cry inventing — thank-yous are silent desk motion only. */

export const TRICK_KEY = "darner";
export const TRICKS = ["hawking", "tandem", "nymph", "whir", "anax", "obelisk", "ommatidia"] as const;
export const HAPPY = ["junius", "labium", "exuvia"] as const;
export type DarnerTrickKind = (typeof TRICKS)[number];
export type DarnerHappyKind = (typeof HAPPY)[number];
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

export type DarnerTrick = {
  kind: DarnerTrickKind;
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

export type DarnerHappy = {
  kind: DarnerHappyKind;
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

export const HAPPY_DUR: Record<DarnerHappyKind, number> = {
  junius: 1.70,
  labium: 1.84,
  exuvia: 1.76,
};
export const ANAX_HOLD = 11.2;
export const RELEASE_S = 1.18;
export const DUR: Record<DarnerTrickKind, number> = {
  anax: ANAX_HOLD + RELEASE_S,
  hawking: 2.48,
  tandem: 2.42,
  nymph: 2.44,
  whir: 2.56,
  obelisk: 2.40,
  ommatidia: 2.38,
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

export function nextTrickWait(justFinished: boolean, rand?: number, kind?: DarnerTrickKind | string) {
  const roll = rand == null ? Math.random() : rand;
  if (kind === "anax") return 40 + roll * 24;
  if (kind === "obelisk" || kind === "ommatidia" || kind === "whir") return 12 + roll * 9;
  if (kind === "hawking" || kind === "tandem" || kind === "nymph") return 11 + roll * 8;
  return justFinished ? 8 + roll * 8 : 4 + roll * 7;
}

export function pickTrick(rand?: number, musicOn?: boolean, lastKind?: DarnerTrickKind | string | null) {
  if (musicOn) return "anax" as const;
  const roll = rand == null ? Math.random() : rand;
  if (lastKind === "anax") {
    if (roll < 0.16) return "hawking" as const;
    if (roll < 0.32) return "tandem" as const;
    if (roll < 0.48) return "nymph" as const;
    if (roll < 0.64) return "whir" as const;
    if (roll < 0.82) return "obelisk" as const;
    return "ommatidia" as const;
  }
  if (lastKind === "hawking") {
    if (roll < 0.18) return "anax" as const;
    if (roll < 0.34) return "tandem" as const;
    if (roll < 0.5) return "nymph" as const;
    if (roll < 0.66) return "whir" as const;
    if (roll < 0.83) return "obelisk" as const;
    return "ommatidia" as const;
  }
  if (lastKind === "tandem") {
    if (roll < 0.16) return "anax" as const;
    if (roll < 0.32) return "hawking" as const;
    if (roll < 0.48) return "nymph" as const;
    if (roll < 0.64) return "whir" as const;
    if (roll < 0.82) return "obelisk" as const;
    return "ommatidia" as const;
  }
  if (lastKind === "obelisk" || lastKind === "ommatidia") {
    if (roll < 0.16) return "anax" as const;
    if (roll < 0.32) return "hawking" as const;
    if (roll < 0.48) return "tandem" as const;
    if (roll < 0.64) return "nymph" as const;
    if (roll < 0.8) return "whir" as const;
    return lastKind === "obelisk" ? ("ommatidia" as const) : ("obelisk" as const);
  }
  if (roll < 0.14) return "anax" as const;
  if (roll < 0.28) return "hawking" as const;
  if (roll < 0.42) return "tandem" as const;
  if (roll < 0.56) return "nymph" as const;
  if (roll < 0.7) return "whir" as const;
  if (roll < 0.85) return "obelisk" as const;
  return "ommatidia" as const;
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
  return key === TRICK_KEY || key === "dart";
}

export function startThankYou(
  key: string | undefined | null,
  lastKind: DarnerHappyKind | string | null | undefined,
  x: number,
  facing: 1 | -1,
  flags?: TrickFlags,
) {
  if (!wantsThankYou(key)) return null;
  if (!happyCanStart(flags || { cmd: "idle" })) return null;
  const pick = pickHappy(lastKind as DarnerHappyKind | null | undefined);
  return { happy: beginHappy(pick, x, facing), kind: pick };
}

export function pickHappy(lastKind?: DarnerHappyKind | null, rand?: number) {
  const pool = HAPPY.filter((k) => k !== lastKind);
  const list = pool.length ? pool : [...HAPPY];
  const roll = rand == null ? Math.random() : rand;
  return list[Math.floor(roll * list.length)] || list[0];
}

export function beginHappy(kind: DarnerHappyKind | string, x: number, facing: 1 | -1): DarnerHappy {
  const name = (HAPPY as readonly string[]).indexOf(kind) >= 0 ? (kind as DarnerHappyKind) : "junius";
  return {
    kind: name,
    happy: true,
    phase: "go",
    t: 0,
    x: x,
    lift: 0,
    rot: 0,
    anim: name === "junius" ? "play" : name === "labium" ? "sit" : "talk",
    facing: facing == null ? 1 : facing,
    fromX: x,
  };
}

export function juniusPose(t: number) {
  const u = Math.max(0, Math.min(1, t / HAPPY_DUR.junius));
  if (u < 0.14) {
    const s = u / 0.14;
    return { lift: s * 2.9, rot: s * 12, dx: 0, anim: "play" as TrickAnim };
  }
  if (u < 0.7) {
    const patrol = Math.sin(t * 11.2) + 0.28 * Math.sin(t * 18.4);
    return {
      lift: 2.9 + Math.abs(patrol) * 1.35,
      rot: 12 + patrol * 10,
      dx: patrol * 0.22,
      anim: "play" as TrickAnim,
    };
  }
  const s = (u - 0.7) / 0.3;
  return { lift: 2.0 * (1 - s), rot: 6 * (1 - s), dx: 0, anim: "idle" as TrickAnim };
}

export function labiumPose(t: number) {
  const u = Math.max(0, Math.min(1, t / HAPPY_DUR.labium));
  if (u < 0.18) {
    const s = u / 0.18;
    return { lift: s * -1.15, rot: s * -6.8, dx: s * 0.18, anim: "sit" as TrickAnim };
  }
  if (u < 0.55) {
    const s = (u - 0.18) / 0.37;
    const jab = Math.sin(s * Math.PI);
    return {
      lift: -1.15 + jab * 1.4,
      rot: -6.8 + jab * 12,
      dx: 0.18 + jab * 0.35,
      anim: "sit" as TrickAnim,
    };
  }
  if (u < 0.84) {
    const warm = Math.sin(t * 0.72);
    return {
      lift: -0.75 + Math.abs(warm) * 0.9,
      rot: -2.4 + warm * 5.6,
      dx: warm * 0.18,
      anim: "sit" as TrickAnim,
    };
  }
  const s = (u - 0.84) / 0.16;
  return { lift: -0.55 * (1 - s), rot: -2.0 * (1 - s), dx: 0, anim: "sit" as TrickAnim };
}

export function exuviaPose(t: number) {
  return {
    lift: 2.25 + Math.abs(Math.sin(t * 0.88)) * 1.15,
    rot: Math.sin(t * 1.05) * 9.5,
    dx: Math.sin(t * 0.52) * 0.22,
    anim: "talk" as TrickAnim,
  };
}

export function stepHappy(happy: DarnerHappy, dt: number, flags: TrickFlags): DarnerHappy {
  if (!happy || happy.phase === "done") return happy;
  if (happyShouldAbort(flags)) {
    return { ...happy, phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true };
  }
  const next: DarnerHappy = { ...happy, t: happy.t + Math.max(0, dt) };
  const hold = HAPPY_DUR[next.kind];
  if (next.kind === "junius") {
    const pose = juniusPose(next.t);
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "labium") {
    const pose = labiumPose(next.t);
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else {
    const pose = exuviaPose(next.t);
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

export function beginTrick(kind: DarnerTrickKind, x: number, facing: 1 | -1): DarnerTrick {
  const anim: TrickAnim =
    kind === "anax"
      ? "sit"
      : kind === "hawking"
        ? "play"
        : kind === "tandem"
          ? "sit"
          : kind === "nymph"
            ? "sit"
            : kind === "whir"
              ? "talk"
              : kind === "obelisk"
                ? "sit"
                : kind === "ommatidia"
                  ? "talk"
                  : "sit";
  return {
    kind: kind,
    phase: kind === "anax" ? "hold" : "go",
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

export function anaxPose(t: number) {
  const breath = Math.sin(t * 0.2) + 0.035 * Math.sin(t * 1.05);
  const engine = Math.abs(Math.sin(t * 0.62));
  return {
    lift: 2.45 + engine * 1.15,
    rot: 4.2 + breath * 3.4,
  };
}

export function releasePose(t: number) {
  const u = Math.max(0, Math.min(1, t / RELEASE_S));
  return { lift: 2.25 * (1 - Math.sin(u * Math.PI * 0.5)), rot: 3.8 * (1 - u) };
}

export function hawkingPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.hawking));
  if (u < 0.1) {
    const s = smoothstep(u / 0.1);
    return { x: fromX, lift: s * 3.1, rot: s * 11 * facing, anim: "play" as TrickAnim };
  }
  if (u < 0.78) {
    const s = (u - 0.1) / 0.68;
    const zag = Math.sin(s * Math.PI * 5.4) + 0.3 * Math.sin(s * Math.PI * 9.2);
    return {
      x: fromX + facing * (0.55 * s + zag * 0.28),
      lift: 3.1 + Math.abs(zag) * 1.25,
      rot: facing * (11 + zag * 9),
      anim: "play" as TrickAnim,
    };
  }
  const s = smoothstep((u - 0.78) / 0.22);
  return {
    x: fromX + facing * 0.35 * (1 - s),
    lift: 3.1 * (1 - s),
    rot: facing * (5 * (1 - s)),
    anim: "sit" as TrickAnim,
  };
}

export function tandemPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.tandem));
  if (u < 0.16) {
    const s = smoothstep(u / 0.16);
    return { x: fromX + facing * 0.22 * s, lift: s * 2.2, rot: s * -8 * facing, anim: "sit" as TrickAnim };
  }
  if (u < 0.72) {
    const s = (u - 0.16) / 0.56;
    const clasp = Math.sin(s * Math.PI * 2.4);
    return {
      x: fromX + facing * (0.22 + 0.18 * s) + facing * clasp * 0.12,
      lift: 2.2 + Math.abs(clasp) * 1.1,
      rot: facing * (-8 + clasp * 6.5),
      anim: "sit" as TrickAnim,
    };
  }
  const s = smoothstep((u - 0.72) / 0.28);
  return {
    x: fromX + facing * 0.18 * (1 - s),
    lift: 1.8 * (1 - s),
    rot: facing * (-4 * (1 - s)),
    anim: "sit" as TrickAnim,
  };
}

export function nymphPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.nymph));
  if (u < 0.14) {
    const s = smoothstep(u / 0.14);
    return { x: fromX, lift: s * -1.25, rot: s * 6.5 * facing, anim: "sit" as TrickAnim };
  }
  if (u < 0.42) {
    const s = (u - 0.14) / 0.28;
    const strike = Math.sin(s * Math.PI);
    return {
      x: fromX + facing * strike * 0.45,
      lift: -1.25 + strike * 1.8,
      rot: facing * (6.5 + strike * 10),
      anim: "sit" as TrickAnim,
    };
  }
  if (u < 0.82) {
    const s = (u - 0.42) / 0.4;
    const silt = Math.sin(s * Math.PI * 1.8);
    return {
      x: fromX + facing * 0.18 * (1 - s) + facing * silt * 0.1,
      lift: -0.55 + silt * 0.95,
      rot: facing * (4.5 + silt * 5),
      anim: "sit" as TrickAnim,
    };
  }
  const s = smoothstep((u - 0.82) / 0.18);
  return {
    x: fromX,
    lift: -0.35 * (1 - s),
    rot: facing * (2.5 * (1 - s)),
    anim: "sit" as TrickAnim,
  };
}

export function whirPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.whir));
  if (u < 0.1) {
    const s = smoothstep(u / 0.1);
    return { x: fromX, lift: s * 2.8, rot: s * 9 * facing, anim: "talk" as TrickAnim };
  }
  if (u < 0.8) {
    const s = (u - 0.1) / 0.7;
    const engine = Math.sin(s * Math.PI * 14) + 0.4 * Math.sin(s * Math.PI * 22);
    return {
      x: fromX + facing * engine * 0.14,
      lift: 2.8 + Math.abs(engine) * 1.35,
      rot: facing * (9 + engine * 11),
      anim: "talk" as TrickAnim,
    };
  }
  const s = smoothstep((u - 0.8) / 0.2);
  return {
    x: fromX,
    lift: 2.8 * (1 - s),
    rot: facing * (4.5 * (1 - s)),
    anim: "sit" as TrickAnim,
  };
}

export function obeliskPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.obelisk));
  if (u < 0.14) {
    const s = smoothstep(u / 0.14);
    return { x: fromX, lift: s * 2.55, rot: s * -8.5 * facing, anim: "sit" as TrickAnim };
  }
  if (u < 0.45) {
    const s = (u - 0.14) / 0.31;
    return {
      x: fromX - facing * 0.12 * s,
      lift: 2.55 + s * 2.4,
      rot: facing * (-8.5 + s * 4),
      anim: "sit" as TrickAnim,
    };
  }
  if (u < 0.82) {
    const sun = Math.sin(t * 3.2);
    return {
      x: fromX - facing * 0.12,
      lift: 4.9 + Math.abs(sun) * 0.7,
      rot: facing * (-4.5 + sun * 3.5),
      anim: "sit" as TrickAnim,
    };
  }
  const s = (u - 0.82) / 0.18;
  return {
    x: fromX - facing * 0.12 * (1 - s),
    lift: 4.9 * (1 - s),
    rot: facing * (-3.5 * (1 - s)),
    anim: "sit" as TrickAnim,
  };
}

export function ommatidiaPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.ommatidia));
  if (u < 0.12) {
    const s = smoothstep(u / 0.12);
    return { x: fromX, lift: s * 3.3, rot: s * 10 * facing, anim: "talk" as TrickAnim };
  }
  if (u < 0.78) {
    const scan = Math.sin(t * 12.4) + 0.35 * Math.sin(t * 19.1);
    return {
      x: fromX + facing * scan * 0.14,
      lift: 3.3 + Math.abs(scan) * 1.45,
      rot: facing * (10 + scan * 9),
      anim: "talk" as TrickAnim,
    };
  }
  const s = (u - 0.78) / 0.22;
  return {
    x: fromX,
    lift: 3.3 * (1 - s),
    rot: facing * (5 * (1 - s)),
    anim: "talk" as TrickAnim,
  };
}

export function stepTrick(trick: DarnerTrick, dt: number, flags: TrickFlags): DarnerTrick {
  if (!trick || trick.phase === "done") return trick;
  if (
    shouldAbort(flags) &&
    trick.kind !== "hawking" &&
    trick.kind !== "tandem" &&
    trick.kind !== "nymph" &&
    trick.kind !== "whir" &&
    trick.kind !== "obelisk" &&
    trick.kind !== "ommatidia"
  ) {
    return { ...trick, phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true };
  }
  const next: DarnerTrick = { ...trick, t: trick.t + Math.max(0, dt) };
  if (next.kind === "anax") {
    if (next.t < ANAX_HOLD) {
      const pose = anaxPose(next.t);
      next.phase = "hold";
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = "sit";
      return next;
    }
    if (next.t < ANAX_HOLD + RELEASE_S) {
      const pose = releasePose(next.t - ANAX_HOLD);
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
  const fromX = trick.fromX != null ? trick.fromX : trick.x;
  if (next.kind === "hawking") {
    const pose = hawkingPose(next.t, fromX, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "tandem") {
    const pose = tandemPose(next.t, fromX, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "nymph") {
    const pose = nymphPose(next.t, fromX, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "whir") {
    const pose = whirPose(next.t, fromX, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "obelisk") {
    const pose = obeliskPose(next.t, fromX, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else {
    const pose = ommatidiaPose(next.t, fromX, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  }
  if (u >= 1) return { ...next, phase: "done", lift: 0, rot: 0, anim: "idle" };
  return next;
}
