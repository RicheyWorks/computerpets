/** Dart ground tricks while idle. House darner — hawking / tandem / nymph / whir / anax personality (hawking Anax lamp-air prey patrol on the blotter — never named hawk (ethogram+window Hawk) / dart (Coin+ethogram) / hover (Sepia+ethogram) / bob / still / soar / jstroke (Spark) / stream (Ghost) / wing (Kite) / flutter (Fan), tandem oviposition-pair clasp perch — never named silk (Ghost) / chrysalis (Milk) / coil / tuck / curl / nest (Clip), nymph aquatic-larva memory with labium-strike recall — never named larva / crawl (Cling) / paddle (Ink) / soak / mucilage (Dew) / digest, whir rapid wing-engine warm-up — never named buzz (Relay) / click (Relay) / wing / flutter / semaphore (Spark) / elytra (Spark) / flash / glow, anax desk life as an Anax junius Aeshnidae green darner week; not Spark / Ghost / Milk / Comb / Echo / Ember / Quill / Kite / Fan / Dew / Pulse / Relay / *Dragon copies). Feed-happy thank-yous sit after eat. Card-open freeze and window-play do not swallow a thank-you. Sleep, hide, and leave still win. Same map as desktop darner-tricks.js. Not a Rui/cat/dog/rabbit/hamster/Clip/guinea pig/turtle/Ink/goldfish/Coin/budgie/Echo/fox/penguin/parrot/ferret/hedgehog/Burr/chinchilla/axolotl/Bloom/toucan/iguana/Sol/dragon/Vesper/phoenix/Ember/snake/Coral/octopus/Cup/cuttlefish/Sepia/nautilus/Chamber/moon-jelly/Pulse/sea-star/Cling/hermit-crab/Tenant/horseshoe-crab/Ledger/seahorse/Anchor/manta/Kite/moray/Door/moss/Felt/fern/Vein/ginkgo/Fan/oak/Mast/water-lily/Disk/orchid/Moth/saguaro/Arm/venus-flytrap/Snap/pitcher/Drown/sundew/Dew/honeybee/Comb/monarch/Milk/luna/Ghost/firefly/Spark or *Dragon electrical clone. Window-play Hawk unchanged — never names hawk. Ethogram hawk/dart/hover/bob/still/freeze unchanged. Spark owns lantern/jstroke/semaphore/elytra/photinus; Ghost owns plumose/lunule/silk/stream/actias; Milk owns asclepias/oyamel/warning/chrysalis/danaus; Comb owns figure/corbicula/hex/proboscis/hive; Quill owns fan/flash; Kite owns wing; Fan owns flutter; Echo owns preen/bobble; Ember owns cinder/blaze/shed/lift/return; Sepia owns hover; Relay owns buzz/click and happy spark; Rui owns dance; Pulse guest owns moon-jelly; Dragon happy owns glow. Aeshnidae Anax desk life only. No cry inventing — thank-yous are silent desk motion only. */
export const TRICK_KEY = "darner";
export const TRICKS = ["hawking", "tandem", "nymph", "whir", "anax"] as const;
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

export const HAPPY_DUR = { junius: 1.22, labium: 1.34, exuvia: 1.26 } as const;
export const ANAX_HOLD = 12.6;
export const RELEASE_S = 0.74;
export const DUR = { anax: ANAX_HOLD + RELEASE_S, hawking: 1.48, tandem: 1.42, nymph: 1.54, whir: 1.36 } as const;

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
  if (kind === "anax") return 48 + roll * 32;
  if (kind === "hawking") return 14 + roll * 11;
  if (kind === "whir") return 15 + roll * 10;
  return justFinished ? 10.2 + roll * 8 : 5.2 + roll * 6.8;
}
export function pickTrick(rand?: number, musicOn?: boolean, lastKind?: DarnerTrickKind | string | null) {
  if (musicOn) return "anax" as const;
  const roll = rand == null ? Math.random() : rand;
  if (lastKind === "anax") {
    if (roll < 0.26) return "hawking" as const;
    if (roll < 0.48) return "tandem" as const;
    if (roll < 0.72) return "nymph" as const;
    return "whir" as const;
  }
  if (lastKind === "hawking") {
    if (roll < 0.28) return "anax" as const;
    if (roll < 0.5) return "tandem" as const;
    if (roll < 0.72) return "nymph" as const;
    return "whir" as const;
  }
  if (lastKind === "tandem") {
    if (roll < 0.22) return "anax" as const;
    if (roll < 0.44) return "hawking" as const;
    if (roll < 0.66) return "nymph" as const;
    return "whir" as const;
  }
  if (roll < 0.2) return "anax" as const;
  if (roll < 0.4) return "hawking" as const;
  if (roll < 0.6) return "tandem" as const;
  if (roll < 0.8) return "nymph" as const;
  return "whir" as const;
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
      return { lift: s * 0.13, rot: s * 3.2, dx: 0, anim: "play" as TrickAnim };
    }
    if (u < 0.7) {
      const patrol = Math.sin(t * 11.2) + 0.28 * Math.sin(t * 18.4);
      return {
        lift: 0.13 + Math.abs(patrol) * 0.048,
        rot: 3.2 + patrol * 3.6,
        dx: patrol * 0.01,
        anim: "play" as TrickAnim,
      };
    }
    const s = (u - 0.7) / 0.3;
    return { lift: 0.07 * (1 - s), rot: 1.4 * (1 - s), dx: 0, anim: "idle" as TrickAnim };
  }
export function labiumPose(t: number) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.labium));
    if (u < 0.18) {
      const s = u / 0.18;
      return { lift: s * -0.015, rot: s * -2.1, dx: s * 0.012, anim: "sit" as TrickAnim };
    }
    if (u < 0.55) {
      const s = (u - 0.18) / 0.37;
      const jab = Math.sin(s * Math.PI);
      return {
        lift: -0.015 + jab * 0.04,
        rot: -2.1 + jab * 4.2,
        dx: 0.012 + jab * 0.018,
        anim: "sit" as TrickAnim,
      };
    }
    if (u < 0.84) {
      const warm = Math.sin(t * 0.72);
      return {
        lift: -0.01 + Math.abs(warm) * 0.022,
        rot: -0.8 + warm * 1.4,
        dx: warm * 0.004,
        anim: "sit" as TrickAnim,
      };
    }
    const s = (u - 0.84) / 0.16;
    return { lift: -0.008 * (1 - s), rot: -0.5 * (1 - s), dx: 0, anim: "sit" as TrickAnim };
  }
export function exuviaPose(t: number) {
    return {
      lift: 0.032 + Math.abs(Math.sin(t * 0.88)) * 0.045,
      rot: Math.sin(t * 1.05) * 2.8,
      dx: Math.sin(t * 0.52) * 0.011,
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
      lift: 0.026 + engine * 0.016,
      rot: 0.32 + breath * 0.58,
    };
  }
export function releasePose(t: number) {
    const u = Math.max(0, Math.min(1, t / RELEASE_S));
    return { lift: 0.03 * (1 - Math.sin(u * Math.PI * 0.5)), rot: 0.34 * (1 - u) };
  }
export function hawkingPose(t: number, fromX: number, facing: 1 | -1) {
    const u = Math.max(0, Math.min(1, t / DUR.hawking));
    if (u < 0.1) {
      const s = smoothstep(u / 0.1);
      return { x: fromX, lift: s * 0.16, rot: s * 4.2 * facing, anim: "play" as TrickAnim };
    }
    if (u < 0.78) {
      const s = (u - 0.1) / 0.68;
      const zag = Math.sin(s * Math.PI * 5.4) + 0.3 * Math.sin(s * Math.PI * 9.2);
      return {
        x: fromX + facing * (0.04 * s + zag * 0.018),
        lift: 0.16 + Math.abs(zag) * 0.055,
        rot: facing * (4.2 + zag * 5.8),
        anim: "play" as TrickAnim,
      };
    }
    const s = smoothstep((u - 0.78) / 0.22);
    return {
      x: fromX + facing * 0.02 * (1 - s),
      lift: 0.16 * (1 - s),
      rot: facing * (2.0 * (1 - s)),
      anim: "sit" as TrickAnim,
    };
  }
export function tandemPose(t: number, fromX: number, facing: 1 | -1) {
    const u = Math.max(0, Math.min(1, t / DUR.tandem));
    if (u < 0.16) {
      const s = smoothstep(u / 0.16);
      return { x: fromX + facing * 0.015 * s, lift: s * 0.05, rot: s * -2.8 * facing, anim: "sit" as TrickAnim };
    }
    if (u < 0.72) {
      const s = (u - 0.16) / 0.56;
      const clasp = Math.sin(s * Math.PI * 2.4);
      return {
        x: fromX + facing * (0.015 + 0.008 * s) + facing * clasp * 0.006,
        lift: 0.05 + Math.abs(clasp) * 0.028,
        rot: facing * (-2.8 + clasp * 2.2),
        anim: "sit" as TrickAnim,
      };
    }
    const s = smoothstep((u - 0.72) / 0.28);
    return {
      x: fromX + facing * 0.01 * (1 - s),
      lift: 0.04 * (1 - s),
      rot: facing * (-1.4 * (1 - s)),
      anim: "sit" as TrickAnim,
    };
  }
export function nymphPose(t: number, fromX: number, facing: 1 | -1) {
    const u = Math.max(0, Math.min(1, t / DUR.nymph));
    if (u < 0.14) {
      const s = smoothstep(u / 0.14);
      return { x: fromX, lift: s * -0.05, rot: s * 1.6 * facing, anim: "sit" as TrickAnim };
    }
    if (u < 0.42) {
      const s = (u - 0.14) / 0.28;
      const strike = Math.sin(s * Math.PI);
      return {
        x: fromX + facing * strike * 0.028,
        lift: -0.05 + strike * 0.06,
        rot: facing * (1.6 + strike * 4.5),
        anim: "sit" as TrickAnim,
      };
    }
    if (u < 0.82) {
      const s = (u - 0.42) / 0.4;
      const silt = Math.sin(s * Math.PI * 1.8);
      return {
        x: fromX + facing * 0.01 * (1 - s) + facing * silt * 0.005,
        lift: -0.02 + silt * 0.03,
        rot: facing * (2.4 + silt * 2.0),
        anim: "sit" as TrickAnim,
      };
    }
    const s = smoothstep((u - 0.82) / 0.18);
    return {
      x: fromX,
      lift: -0.012 * (1 - s),
      rot: facing * (1.0 * (1 - s)),
      anim: "sit" as TrickAnim,
    };
  }
export function whirPose(t: number, fromX: number, facing: 1 | -1) {
    const u = Math.max(0, Math.min(1, t / DUR.whir));
    if (u < 0.1) {
      const s = smoothstep(u / 0.1);
      return { x: fromX, lift: s * 0.08, rot: s * 2.4 * facing, anim: "talk" as TrickAnim };
    }
    if (u < 0.8) {
      const s = (u - 0.1) / 0.7;
      const engine = Math.sin(s * Math.PI * 14) + 0.4 * Math.sin(s * Math.PI * 22);
      return {
        x: fromX + facing * engine * 0.008,
        lift: 0.08 + Math.abs(engine) * 0.05,
        rot: facing * (2.4 + engine * 6.2),
        anim: "talk" as TrickAnim,
      };
    }
    const s = smoothstep((u - 0.8) / 0.2);
    return {
      x: fromX,
      lift: 0.08 * (1 - s),
      rot: facing * (1.2 * (1 - s)),
      anim: "sit" as TrickAnim,
    };
  }
export function stepTrick(trick: DarnerTrick, dt: number, flags: TrickFlags): DarnerTrick {
  if (!trick || trick.phase === "done") return trick;
  if (shouldAbort(flags) && trick.kind !== "hawking" && trick.kind !== "tandem" && trick.kind !== "nymph" && trick.kind !== "whir") {
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
  if (next.kind === "hawking") {
    const pose = hawkingPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "tandem") {
    const pose = tandemPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "nymph") {
    const pose = nymphPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else {
    const pose = whirPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  }
  if (u >= 1) return { ...next, phase: "done", lift: 0, rot: 0, anim: "idle" };
  return next;
}
