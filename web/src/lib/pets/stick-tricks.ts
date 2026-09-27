/** Twig ground tricks while idle — ultra-polish pass. House stick insect — rocking / catalepsy / browse / tread / diapheromera / oviposit / filiform personality (rocking camouflage breeze-sway on the blotter — never named sway (Jade) / lean / nod (Sol) / flutter (Fan+ginkgo) / still (ethogram-old) / freeze (ethogram-old+window FREEZE) / bob / hover / jstroke (Spark) / stream (Ghost), catalepsy tonic-immobility freeze pose as furniture — never named freeze / still / tuck / curl / coil / nest (Clip) / feign (Bluff) / obelisk (Dart), browse leaf-nibble mandible work — never named nibble (Whee happy) / hay / berry / crack / digest / mucilage (Dew) / munch / crumb (Column), tread slow Phasmatodea step — never named walk (ethogram-old) / amble (Bloom) / inch (Nori) / crawl (Cling) / scurry (Clip) / plod / bustle (Column), diapheromera desk life as a Diapheromera femorata Common Walkingstick week, oviposit free egg-capsule drop (species-true Diapheromera oviposition — never named egg / lay / nest (Clip) / seed (Clip) / capsule-as-trick / drop (Fan) / chrysalis (Milk)), filiform antenna-sweep probe (species-true Phasmatodea filiform antennae — never named antenna (Tenant) / ocelli (Comb) / ommatidia (Dart) / palp / feel / whisker); not Dart hawking/tandem/nymph/whir/anax/obelisk/ommatidia, Spark lantern/jstroke/semaphore/elytra/photinus/photocyte/sternite, Ghost plumose/lunule/silk/stream/actias/aphagy/cauda, Milk asclepias/oyamel/warning/chrysalis/danaus/cremaster/tarsus, Comb figure/corbicula/hex/proboscis/hive/ocelli/nasonov, Dew mucilage/tentacle/digest/gland/rosette/lamina/circinate, Well peristome/cistern/brine/operculum/urn/ala/baffle, Snap clamp/trichome/stew/unseal/poise/cage/scape, Arm rib/branch/nocturne/areole/sentinel/pleat/boot, Moth labellum/velamen/column/spike/epiphyte/keiki/pollinia, Disk pad/corolla/rhizome/calyx/sheen/peltate/hydropote, Mast acorn/sinus/gall/taproot/bole/catkin/tyloses, Fan biloba/notch/flutter/drop/amber/dichotomy/petiole, Vein frond/rachis/fiddle/pinna/saucer/sori/stipe, Felt tuft/bead/spore/cushion/thatch/rhizoid/seta, Door hinge/pharynx/knot/lurk/jamb, Kite wing/lobe/gyre/vault/span, Column gallery/pheromone/crumb/bustle/camponotus, Echo preen/bobble, Ember cinder/blaze, Quill fan/flash, Relay buzz/click, Rui dance, Sepia hover, Pulse medusa, Dragon glow, or Jade sway/Sol nod copies). Oviposit is the iconic free egg-capsule drop (not window FREEZE, not ethogram-old freeze/still/walk). Filiform is the iconic antenna-sweep probe (not Tenant antenna). Window-play FREEZE unchanged — never names freeze. Ethogram keeps diapheromera sit_hold; adds rocking/catalepsy/browse/tread/oviposit/filiform softs + freeze (replaces thin freeze/still/walk). Amplitudes raised toward Rui richness; denser waits/weights; prefersHouseCry via stick.wav. Thank-yous femorata / instar / crypsis. Feed-happy after eat. Sleep, hide, leave, rest, card still win. Same map as desktop `stick-tricks.js`. True house-stick desk life — not Rui/cat/dog/rabbit/hamster/Clip/guinea pig/turtle/Ink/goldfish/Coin/budgie/Echo/fox/penguin/parrot/ferret/hedgehog/Burr/chinchilla/axolotl/Bloom/toucan/iguana/Sol/dragon/Vesper/phoenix/Ember/snake/Coral/octopus/Cup/cuttlefish/Sepia/nautilus/Chamber/moon-jelly/Pulse/sea-star/Cling/hermit-crab/Tenant/horseshoe-crab/Ledger/seahorse/Anchor/manta/Kite/moray/Door/moss/Felt/fern/Vein/ginkgo/Fan/oak/Mast/water-lily/Disk/orchid/Moth/saguaro/Arm/venus-flytrap/Snap/pitcher/Drown/sundew/Dew/honeybee/Comb/monarch/Milk/luna/Ghost/firefly/Spark/darner/Dart or *Dragon electrical clone. Next guest ultra is Shard / silica. Phasmatodea Diapheromera desk life only. No cry inventing — thank-yous are silent desk motion only. */
export const TRICK_KEY = "stick";
export const TRICKS = ["rocking", "catalepsy", "browse", "tread", "diapheromera", "oviposit", "filiform"] as const;
export const HAPPY = ["femorata", "instar", "crypsis"] as const;
export type StickTrickKind = (typeof TRICKS)[number];
export type StickHappyKind = (typeof HAPPY)[number];
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

export type StickTrick = {
  kind: StickTrickKind;
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

export type StickHappy = {
  kind: StickHappyKind;
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

export const HAPPY_DUR: Record<StickHappyKind, number> = {
  femorata: 1.70,
  instar: 1.84,
  crypsis: 1.76,
};
export const DIAPHEROMERA_HOLD = 11.2;
export const RELEASE_S = 1.18;
export const DUR: Record<StickTrickKind, number> = {
  diapheromera: DIAPHEROMERA_HOLD + RELEASE_S,
  rocking: 2.48,
  catalepsy: 2.42,
  browse: 2.44,
  tread: 2.56,
  oviposit: 2.40,
  filiform: 2.38,
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

export function nextTrickWait(justFinished: boolean, rand?: number, kind?: StickTrickKind | string) {
  const roll = rand == null ? Math.random() : rand;
  if (kind === "diapheromera") return 40 + roll * 24;
  if (kind === "oviposit" || kind === "filiform" || kind === "catalepsy") return 12 + roll * 9;
  if (kind === "rocking" || kind === "browse" || kind === "tread") return 11 + roll * 8;
  return justFinished ? 8 + roll * 8 : 4 + roll * 7;
}

export function pickTrick(rand?: number, musicOn?: boolean, lastKind?: StickTrickKind | string | null) {
  if (musicOn) return "diapheromera" as const;
  const roll = rand == null ? Math.random() : rand;
  if (lastKind === "diapheromera") {
    if (roll < 0.16) return "rocking" as const;
    if (roll < 0.32) return "catalepsy" as const;
    if (roll < 0.48) return "browse" as const;
    if (roll < 0.64) return "tread" as const;
    if (roll < 0.82) return "oviposit" as const;
    return "filiform" as const;
  }
  if (lastKind === "rocking") {
    if (roll < 0.18) return "diapheromera" as const;
    if (roll < 0.34) return "catalepsy" as const;
    if (roll < 0.5) return "browse" as const;
    if (roll < 0.66) return "tread" as const;
    if (roll < 0.83) return "oviposit" as const;
    return "filiform" as const;
  }
  if (lastKind === "catalepsy") {
    if (roll < 0.16) return "diapheromera" as const;
    if (roll < 0.32) return "rocking" as const;
    if (roll < 0.48) return "browse" as const;
    if (roll < 0.64) return "tread" as const;
    if (roll < 0.82) return "oviposit" as const;
    return "filiform" as const;
  }
  if (lastKind === "oviposit" || lastKind === "filiform") {
    if (roll < 0.16) return "diapheromera" as const;
    if (roll < 0.32) return "rocking" as const;
    if (roll < 0.48) return "catalepsy" as const;
    if (roll < 0.64) return "browse" as const;
    if (roll < 0.8) return "tread" as const;
    return lastKind === "oviposit" ? ("filiform" as const) : ("oviposit" as const);
  }
  if (roll < 0.14) return "diapheromera" as const;
  if (roll < 0.28) return "rocking" as const;
  if (roll < 0.42) return "catalepsy" as const;
  if (roll < 0.56) return "browse" as const;
  if (roll < 0.7) return "tread" as const;
  if (roll < 0.85) return "oviposit" as const;
  return "filiform" as const;
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
  return key === TRICK_KEY || key === "twig";
}

export function startThankYou(
  key: string | undefined | null,
  lastKind: StickHappyKind | string | null | undefined,
  x: number,
  facing: 1 | -1,
  flags?: TrickFlags,
) {
  if (!wantsThankYou(key)) return null;
  if (!happyCanStart(flags || { cmd: "idle" })) return null;
  const pick = pickHappy(lastKind as StickHappyKind | null | undefined);
  return { happy: beginHappy(pick, x, facing), kind: pick };
}

export function pickHappy(lastKind?: StickHappyKind | null, rand?: number) {
  const pool = HAPPY.filter((k) => k !== lastKind);
  const list = pool.length ? pool : [...HAPPY];
  const roll = rand == null ? Math.random() : rand;
  return list[Math.floor(roll * list.length)] || list[0];
}

export function beginHappy(kind: StickHappyKind | string, x: number, facing: 1 | -1): StickHappy {
  const name = (HAPPY as readonly string[]).indexOf(kind) >= 0 ? (kind as StickHappyKind) : "femorata";
  return {
    kind: name,
    happy: true,
    phase: "go",
    t: 0,
    x: x,
    lift: 0,
    rot: 0,
    anim: name === "femorata" ? "play" : name === "instar" ? "talk" : "sit",
    facing: facing == null ? 1 : facing,
    fromX: x,
  };
}

export function femorataPose(t: number) {
  const u = Math.max(0, Math.min(1, t / HAPPY_DUR.femorata));
  if (u < 0.16) {
    const s = u / 0.16;
    return { lift: s * 2.9, rot: s * 12, dx: 0, anim: "play" as TrickAnim };
  }
  if (u < 0.72) {
    const rock = Math.sin(t * 3.4) + 0.22 * Math.sin(t * 6.8);
    return {
      lift: 2.9 + Math.abs(rock) * 1.35,
      rot: 12 + rock * 10,
      dx: rock * 0.22,
      anim: "play" as TrickAnim,
    };
  }
  const s = (u - 0.72) / 0.28;
  return { lift: 2.0 * (1 - s), rot: 6 * (1 - s), dx: 0, anim: "idle" as TrickAnim };
}

export function instarPose(t: number) {
  const u = Math.max(0, Math.min(1, t / HAPPY_DUR.instar));
  if (u < 0.2) {
    const s = u / 0.2;
    return { lift: s * 3.2, rot: s * -9.5, dx: s * 0.18, anim: "talk" as TrickAnim };
  }
  if (u < 0.78) {
    const shed = Math.sin(t * 4.2) + 0.3 * Math.sin(t * 9.1);
    return {
      lift: 3.2 + Math.abs(shed) * 1.4,
      rot: -9.5 + shed * 9,
      dx: shed * 0.2,
      anim: "talk" as TrickAnim,
    };
  }
  const s = (u - 0.78) / 0.22;
  return { lift: 2.1 * (1 - s), rot: -4.5 * (1 - s), dx: 0, anim: "sit" as TrickAnim };
}

export function crypsisPose(t: number) {
  return {
    lift: 2.1 + Math.abs(Math.sin(t * 0.42)) * 0.85,
    rot: Math.sin(t * 0.55) * 6.5,
    dx: Math.sin(t * 0.28) * 0.12,
    anim: "sit" as TrickAnim,
  };
}

export function stepHappy(happy: StickHappy, dt: number, flags: TrickFlags): StickHappy {
  if (!happy || happy.phase === "done") return happy;
  if (happyShouldAbort(flags)) {
    return { ...happy, phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true };
  }
  const next: StickHappy = { ...happy, t: happy.t + Math.max(0, dt) };
  const hold = HAPPY_DUR[next.kind];
  if (next.kind === "femorata") {
    const pose = femorataPose(next.t);
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "instar") {
    const pose = instarPose(next.t);
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else {
    const pose = crypsisPose(next.t);
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

export function beginTrick(kind: StickTrickKind, x: number, facing: 1 | -1): StickTrick {
  const anim: TrickAnim =
    kind === "diapheromera"
      ? "sit"
      : kind === "rocking"
        ? "sit"
        : kind === "catalepsy"
          ? "sit"
          : kind === "browse"
            ? "sit"
            : kind === "tread"
              ? "walk"
              : kind === "oviposit"
                ? "sit"
                : kind === "filiform"
                  ? "talk"
                  : "sit";
  return {
    kind: kind,
    phase: kind === "diapheromera" ? "hold" : "go",
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

export function diapheromeraPose(t: number) {
  const breath = Math.sin(t * 0.2) + 0.035 * Math.sin(t * 1.05);
  const twig = Math.abs(Math.sin(t * 0.62));
  return {
    lift: 2.45 + twig * 1.15,
    rot: 4.2 + breath * 3.4,
  };
}

export function releasePose(t: number) {
  const u = Math.max(0, Math.min(1, t / RELEASE_S));
  return { lift: 2.45 * (1 - Math.sin(u * Math.PI * 0.5)), rot: 3.2 * (1 - u) };
}

export function rockingPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.rocking));
  if (u < 0.12) {
    const s = smoothstep(u / 0.12);
    return { x: fromX, lift: s * 2.8, rot: s * 11 * facing, anim: "sit" as TrickAnim };
  }
  if (u < 0.84) {
    const s = (u - 0.12) / 0.72;
    const breeze = Math.sin(s * Math.PI * 3.2) + 0.35 * Math.sin(s * Math.PI * 5.6);
    return {
      x: fromX + facing * breeze * 0.22,
      lift: 2.8 + Math.abs(breeze) * 1.3,
      rot: facing * (11 + breeze * 9),
      anim: "sit" as TrickAnim,
    };
  }
  const s = smoothstep((u - 0.84) / 0.16);
  return {
    x: fromX,
    lift: 2.8 * (1 - s),
    rot: facing * (5 * (1 - s)),
    anim: "sit" as TrickAnim,
  };
}

export function catalepsyPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.catalepsy));
  if (u < 0.18) {
    const s = smoothstep(u / 0.18);
    return { x: fromX, lift: s * 2.2, rot: s * 8.5 * facing, anim: "sit" as TrickAnim };
  }
  if (u < 0.82) {
    const hold = Math.sin(t * 0.18) * 0.35;
    return {
      x: fromX,
      lift: 2.2 + Math.abs(hold) * 0.55,
      rot: facing * (8.5 + hold * 2.2),
      anim: "sit" as TrickAnim,
    };
  }
  const s = smoothstep((u - 0.82) / 0.18);
  return {
    x: fromX,
    lift: 2.0 * (1 - s),
    rot: facing * (4 * (1 - s)),
    anim: "sit" as TrickAnim,
  };
}

export function browsePose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.browse));
  if (u < 0.14) {
    const s = smoothstep(u / 0.14);
    return { x: fromX + facing * 0.18 * s, lift: s * 2.55, rot: s * -9 * facing, anim: "sit" as TrickAnim };
  }
  if (u < 0.78) {
    const s = (u - 0.14) / 0.64;
    const chew = Math.sin(s * Math.PI * 6.4) + 0.25 * Math.sin(s * Math.PI * 11);
    return {
      x: fromX + facing * (0.18 + 0.22 * s) + facing * chew * 0.12,
      lift: 2.55 + Math.abs(chew) * 1.2,
      rot: facing * (-9 + chew * 8),
      anim: "sit" as TrickAnim,
    };
  }
  const s = smoothstep((u - 0.78) / 0.22);
  return {
    x: fromX + facing * 0.14 * (1 - s),
    lift: 2.0 * (1 - s),
    rot: facing * (-4.5 * (1 - s)),
    anim: "sit" as TrickAnim,
  };
}

export function treadPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.tread));
  if (u < 0.12) {
    const s = smoothstep(u / 0.12);
    return { x: fromX, lift: s * 3.0, rot: s * 8 * facing, anim: "walk" as TrickAnim };
  }
  if (u < 0.78) {
    const s = (u - 0.12) / 0.66;
    const step = Math.sin(s * Math.PI * 2.2);
    const pause = Math.max(0, Math.sin(s * Math.PI * 1.1));
    return {
      x: fromX + facing * (0.55 * s + step * 0.22),
      lift: 3.0 + Math.abs(step) * 1.25 * pause,
      rot: facing * (8 + step * 8),
      anim: "walk" as TrickAnim,
    };
  }
  const s = smoothstep((u - 0.78) / 0.22);
  return {
    x: fromX + facing * 0.4 * (1 - s * 0.35),
    lift: 2.2 * (1 - s),
    rot: facing * (4 * (1 - s)),
    anim: "sit" as TrickAnim,
  };
}

export function ovipositPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.oviposit));
  if (u < 0.14) {
    const s = smoothstep(u / 0.14);
    return { x: fromX, lift: s * 2.4, rot: s * -7.5 * facing, anim: "sit" as TrickAnim };
  }
  if (u < 0.42) {
    const s = (u - 0.14) / 0.28;
    return {
      x: fromX + facing * 0.1 * s,
      lift: 2.4 + s * 1.8,
      rot: facing * (-7.5 + s * 3.5),
      anim: "sit" as TrickAnim,
    };
  }
  if (u < 0.78) {
    const drop = Math.sin(t * 4.6);
    return {
      x: fromX + facing * 0.1,
      lift: 4.2 + Math.abs(drop) * 0.65,
      rot: facing * (-4 + drop * 4.5),
      anim: "sit" as TrickAnim,
    };
  }
  const s = (u - 0.78) / 0.22;
  return {
    x: fromX + facing * 0.1 * (1 - s),
    lift: 4.2 * (1 - s),
    rot: facing * (-3 * (1 - s)),
    anim: "sit" as TrickAnim,
  };
}

export function filiformPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.filiform));
  if (u < 0.12) {
    const s = smoothstep(u / 0.12);
    return { x: fromX, lift: s * 3.1, rot: s * 10 * facing, anim: "talk" as TrickAnim };
  }
  if (u < 0.78) {
    const sweep = Math.sin(t * 11.8) + 0.32 * Math.sin(t * 18.4);
    return {
      x: fromX + facing * sweep * 0.16,
      lift: 3.1 + Math.abs(sweep) * 1.4,
      rot: facing * (10 + sweep * 9),
      anim: "talk" as TrickAnim,
    };
  }
  const s = (u - 0.78) / 0.22;
  return {
    x: fromX,
    lift: 3.1 * (1 - s),
    rot: facing * (5 * (1 - s)),
    anim: "talk" as TrickAnim,
  };
}

export function stepTrick(trick: StickTrick, dt: number, flags: TrickFlags): StickTrick {
  if (!trick || trick.phase === "done") return trick;
  if (
    shouldAbort(flags) &&
    trick.kind !== "rocking" &&
    trick.kind !== "catalepsy" &&
    trick.kind !== "browse" &&
    trick.kind !== "tread" &&
    trick.kind !== "oviposit" &&
    trick.kind !== "filiform"
  ) {
    return { ...trick, phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true };
  }
  const next: StickTrick = { ...trick, t: trick.t + Math.max(0, dt) };
  if (next.kind === "diapheromera") {
    if (next.t < DIAPHEROMERA_HOLD) {
      const pose = diapheromeraPose(next.t);
      next.phase = "hold";
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = "sit";
      return next;
    }
    if (next.t < DIAPHEROMERA_HOLD + RELEASE_S) {
      const pose = releasePose(next.t - DIAPHEROMERA_HOLD);
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
  if (next.kind === "rocking") {
    const pose = rockingPose(next.t, fromX, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "catalepsy") {
    const pose = catalepsyPose(next.t, fromX, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "browse") {
    const pose = browsePose(next.t, fromX, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "oviposit") {
    const pose = ovipositPose(next.t, fromX, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "filiform") {
    const pose = filiformPose(next.t, fromX, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else {
    const pose = treadPose(next.t, fromX, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  }
  if (u >= 1) return { ...next, phase: "done", lift: 0, rot: 0, anim: "idle" };
  return next;
}
