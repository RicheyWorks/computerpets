/** Seven ground tricks while idle. House seven-spot ladybird — spots / aphid / reflex / climb / coccinella personality (spots elytra-spot polish and count-display on the blotter — never named elytra (Spark firefly owns elytra) / count (ethogram + window SPOT) / stripe (Bandit) / flash (Quill) / warning (Milk) / semaphore (Spark), aphid aphid-hunt stalk and bead-pounce — never named hunt (ethogram) / forage (bumblebee window) / mouser (Rue) / stalk (Rue) / pounce (Miso) / clamp (Snap) / seize (robber fly window), reflex reflex-bleed hush (thanatosis bead) — never named feign (Bluff) / curl (Burr) / tuck (Ink) / freeze (Twig window FREEZE) / hush / bleed / hemolymph / still (ethogram), climb leaf-dish ascent — never named lift (Ember) / tread (Twig) / crawl (Cling) / scurry (Clip) / scuttle (Tenant) / amble (Bloom) / vault (Kite) / rise, coccinella desk life as a Coccinella septempunctata Seven-spot Ladybird week; not Column / Twig / Dart / Spark / Ghost / Milk / Comb / Clip / Tenant / Burr / *Dragon copies). Feed-happy thank-yous sit after eat. Card-open freeze and window-play SPOT do not swallow a thank-you. Sleep, hide, and leave still win. Same map as desktop ladybird-tricks.js. Not a Rui/cat/dog/rabbit/hamster/Clip/guinea pig/turtle/Ink/goldfish/Coin/budgie/Echo/fox/penguin/parrot/ferret/hedgehog/Burr/chinchilla/axolotl/Bloom/toucan/iguana/Sol/dragon/Vesper/phoenix/Ember/snake/Coral/octopus/Cup/cuttlefish/Sepia/nautilus/Chamber/moon-jelly/Pulse/sea-star/Cling/hermit-crab/Tenant/horseshoe-crab/Ledger/seahorse/Anchor/manta/Kite/moray/Door/moss/Felt/fern/Vein/ginkgo/Fan/oak/Mast/water-lily/Disk/orchid/Moth/saguaro/Arm/venus-flytrap/Snap/pitcher/Drown/sundew/Dew/honeybee/Comb/monarch/Milk/luna/Ghost/firefly/Spark/darner/Dart/stick/Twig/carpenter_ant/Column or *Dragon electrical clone. Window-play SPOT unchanged — never names count. Ethogram count/hunt/still unchanged. Spark owns lantern/jstroke/semaphore/elytra/photinus and happy luciferin/candela/pyralis; Column owns gallery/pheromone/crumb/bustle/camponotus and happy pennsylvanicus/honeydew/formicine; Twig owns rocking/catalepsy/browse/tread/diapheromera; Dart owns hawking/tandem/nymph/whir/anax; Comb owns figure/corbicula/hex/proboscis/hive; Milk owns asclepias/oyamel/warning/chrysalis/danaus; Ghost owns plumose/lunule/silk/stream/actias; Bluff owns feign; Burr owns curl; Clip owns scurry; Tenant owns scuttle; Cling owns crawl. Coccinellidae Coccinella desk life only. No cry inventing — thank-yous are silent desk motion only. */
export const TRICK_KEY = "ladybird";
export const TRICKS = ["spots", "aphid", "reflex", "climb", "coccinella"] as const;
export const HAPPY = ["septempunctata", "bead", "coccinellid"] as const;
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

export const HAPPY_DUR = { septempunctata: 1.24, bead: 1.36, coccinellid: 1.3 } as const;
export const COCCINELLA_HOLD = 13.6;
export const RELEASE_S = 0.76;
export const DUR = { coccinella: COCCINELLA_HOLD + RELEASE_S, spots: 1.54, aphid: 1.62, reflex: 1.48, climb: 1.56 } as const;

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
  if (kind === "coccinella") return 52 + roll * 32;
  if (kind === "spots") return 16 + roll * 12;
  if (kind === "aphid") return 15 + roll * 11;
  return justFinished ? 10.6 + roll * 8 : 5.5 + roll * 6.8;
}

export function pickTrick(rand?: number, musicOn?: boolean, lastKind?: LadybirdTrickKind | string | null) {
  if (musicOn) return "coccinella";
  const roll = rand == null ? Math.random() : rand;
  if (lastKind === "coccinella") {
    if (roll < 0.26) return "spots";
    if (roll < 0.5) return "aphid";
    if (roll < 0.74) return "reflex";
    return "climb";
  }
  if (lastKind === "spots") {
    if (roll < 0.26) return "coccinella";
    if (roll < 0.5) return "aphid";
    if (roll < 0.74) return "reflex";
    return "climb";
  }
  if (lastKind === "aphid") {
    if (roll < 0.22) return "coccinella";
    if (roll < 0.44) return "spots";
    if (roll < 0.68) return "reflex";
    return "climb";
  }
  if (roll < 0.2) return "coccinella";
  if (roll < 0.4) return "spots";
  if (roll < 0.6) return "aphid";
  if (roll < 0.8) return "reflex";
  return "climb";
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
    anim: name === "septempunctata" ? "play" : name === "bead" ? "talk" : "sit",
    facing: facing == null ? 1 : facing,
    fromX: x,
  };
}

export function septempunctataPose(t: number) {
  const u = Math.max(0, Math.min(1, t / HAPPY_DUR.septempunctata));
  if (u < 0.16) {
    const s = u / 0.16;
    return { lift: s * 0.045, rot: s * 2.6, dx: 0, anim: "play" as TrickAnim };
  }
  if (u < 0.72) {
    const rock = Math.sin(t * 3.6) + 0.24 * Math.sin(t * 7.1);
    return {
      lift: 0.045 + Math.abs(rock) * 0.02,
      rot: 2.6 + rock * 2.8,
      dx: rock * 0.004,
      anim: "play" as TrickAnim,
    };
  }
  const s = (u - 0.72) / 0.28;
  return { lift: 0.022 * (1 - s), rot: 1.1 * (1 - s), dx: 0, anim: "idle" as TrickAnim };
}
export function beadPose(t: number) {
  const u = Math.max(0, Math.min(1, t / HAPPY_DUR.bead));
  if (u < 0.2) {
    const s = u / 0.2;
    return { lift: s * 0.06, rot: s * -2.0, dx: s * 0.005, anim: "talk" as TrickAnim };
  }
  if (u < 0.78) {
    const shed = Math.sin(t * 4.4) + 0.28 * Math.sin(t * 8.8);
    return {
      lift: 0.06 + Math.abs(shed) * 0.032,
      rot: -2.0 + shed * 3.2,
      dx: shed * 0.006,
      anim: "talk" as TrickAnim,
    };
  }
  const s = (u - 0.78) / 0.22;
  return { lift: 0.028 * (1 - s), rot: -0.8 * (1 - s), dx: 0, anim: "sit" as TrickAnim };
}
export function coccinellidPose(t: number) {
  return {
    lift: 0.01 + Math.abs(Math.sin(t * 0.44)) * 0.014,
    rot: Math.sin(t * 0.58) * 1.0,
    dx: Math.sin(t * 0.3) * 0.002,
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
  } else if (next.kind === "bead") {
    const pose = beadPose(next.t);
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
    lift: 0.016 + grain * 0.012,
    rot: 0.28 + breath * 0.6,
  };
}

export function releasePose(t: number) {
  const u = Math.max(0, Math.min(1, t / RELEASE_S));
  return { lift: 0.018 * (1 - Math.sin(u * Math.PI * 0.5)), rot: 0.28 * (1 - u) };
}

export function spotsPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.spots));
  if (u < 0.14) {
    const s = smoothstep(u / 0.14);
    return { x: fromX, lift: s * 0.04, rot: s * 4.8 * facing, anim: "sit" as TrickAnim };
  }
  if (u < 0.8) {
    const s = (u - 0.14) / 0.66;
    const polish = Math.sin(s * Math.PI * 6.4) + 0.3 * Math.sin(s * Math.PI * 11.2);
    return {
      x: fromX + facing * polish * 0.004,
      lift: 0.055 + Math.abs(polish) * 0.028,
      rot: facing * (4.8 + polish * 2.2),
      anim: "sit" as TrickAnim,
    };
  }
  const s = smoothstep((u - 0.8) / 0.2);
  return {
    x: fromX,
    lift: 0.014 * (1 - s),
    rot: facing * (1.4 * (1 - s)),
    anim: "sit" as TrickAnim,
  };
}
export function aphidPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.aphid));
  if (u < 0.18) {
    const s = smoothstep(u / 0.18);
    return { x: fromX + facing * 0.02 * s, lift: s * 0.02, rot: s * 1.4 * facing, anim: "walk" as TrickAnim };
  }
  if (u < 0.52) {
    const s = (u - 0.18) / 0.34;
    const stalk = Math.sin(s * Math.PI * 2.2);
    return {
      x: fromX + facing * (0.05 * s + stalk * 0.008),
      lift: 0.02 + Math.abs(stalk) * 0.015,
      rot: facing * (1.4 + stalk * 1.8),
      anim: "walk" as TrickAnim,
    };
  }
  if (u < 0.78) {
    const s = (u - 0.52) / 0.26;
    const peck = Math.sin(s * Math.PI);
    return {
      x: fromX + facing * (0.08 + peck * 0.02),
      lift: 0.02 - peck * 0.04 + Math.abs(Math.sin(s * Math.PI * 3)) * 0.02,
      rot: facing * (1.4 - peck * 4.2),
      anim: "walk" as TrickAnim,
    };
  }
  const s = smoothstep((u - 0.78) / 0.22);
  return {
    x: fromX + facing * 0.06 * (1 - s * 0.35),
    lift: 0.018 * (1 - s),
    rot: facing * (0.6 * (1 - s)),
    anim: "sit" as TrickAnim,
  };
}
export function reflexPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.reflex));
  if (u < 0.12) {
    const s = smoothstep(u / 0.12);
    return { x: fromX, lift: s * -0.025, rot: s * -4.2 * facing, anim: "sit" as TrickAnim };
  }
  if (u < 0.72) {
    const s = (u - 0.12) / 0.6;
    const hush = Math.sin(s * Math.PI * 1.6) * 0.15;
    return {
      x: fromX + facing * hush * 0.003,
      lift: -0.025 + Math.abs(hush) * 0.008,
      rot: facing * (-4.2 + hush * 0.8),
      anim: "sit" as TrickAnim,
    };
  }
  const s = smoothstep((u - 0.72) / 0.28);
  return {
    x: fromX,
    lift: -0.014 * (1 - s),
    rot: facing * (-1.8 * (1 - s)),
    anim: "sit" as TrickAnim,
  };
}
export function climbPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.climb));
  if (u < 0.1) {
    const s = smoothstep(u / 0.1);
    return { x: fromX, lift: s * 0.04, rot: s * 2.8 * facing, anim: "walk" as TrickAnim };
  }
  if (u < 0.82) {
    const s = (u - 0.1) / 0.72;
    const step = Math.sin(s * Math.PI * 5.0) + 0.32 * Math.sin(s * Math.PI * 8.6);
    return {
      x: fromX + facing * (0.03 * Math.sin(s * Math.PI) + step * 0.012),
      lift: 0.04 + s * 0.085 + Math.abs(step) * 0.02,
      rot: facing * (2.8 + step * 3.2),
      anim: "walk" as TrickAnim,
    };
  }
  const s = smoothstep((u - 0.82) / 0.18);
  return {
    x: fromX + facing * 0.01 * (1 - s),
    lift: 0.1 * (1 - s),
    rot: facing * (1.0 * (1 - s)),
    anim: "sit" as TrickAnim,
  };
}
export function stepTrick(trick: LadybirdTrick, dt: number, flags: TrickFlags): LadybirdTrick {
  if (!trick || trick.phase === "done") return trick;
  if (shouldAbort(flags) && trick.kind !== "spots" && trick.kind !== "aphid" && trick.kind !== "reflex" && trick.kind !== "climb") {
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
  } else {
    const pose = climbPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  }
  if (u >= 1) return { ...next, phase: "done", lift: 0, rot: 0, anim: "idle" };
  return next;
}
