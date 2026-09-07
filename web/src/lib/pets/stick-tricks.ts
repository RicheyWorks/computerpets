/** Twig ground tricks while idle. House stick insect — rocking / catalepsy / browse / tread / diapheromera personality (rocking camouflage breeze-sway on the blotter — never named sway (Jade) / lean / nod (Sol) / flutter (Fan+ginkgo) / still (ethogram) / freeze (ethogram+window FREEZE) / bob / hover, catalepsy tonic-immobility freeze pose as furniture — never named freeze / still / tuck / curl / coil / nest (Clip) / feign (Bluff), browse leaf-nibble mandible work — never named nibble (Whee happy) / hay / berry / crack / digest / mucilage (Dew) / munch, tread slow Phasmatodea step — never named walk (ethogram) / amble (Bloom) / inch (Nori) / crawl (Cling) / scurry (Clip) / plod, diapheromera desk life as a Diapheromera femorata Common Walkingstick week; not Dart / Spark / Ghost / Milk / Comb / Felt / Mast / Jade / Sol / Clip / *Dragon copies). Feed-happy thank-yous sit after eat. Card-open freeze and window-play FREEZE do not swallow a thank-you. Sleep, hide, and leave still win. Same map as desktop stick-tricks.js. Not a Rui/cat/dog/rabbit/hamster/Clip/guinea pig/turtle/Ink/goldfish/Coin/budgie/Echo/fox/penguin/parrot/ferret/hedgehog/Burr/chinchilla/axolotl/Bloom/toucan/iguana/Sol/dragon/Vesper/phoenix/Ember/snake/Coral/octopus/Cup/cuttlefish/Sepia/nautilus/Chamber/moon-jelly/Pulse/sea-star/Cling/hermit-crab/Tenant/horseshoe-crab/Ledger/seahorse/Anchor/manta/Kite/moray/Door/moss/Felt/fern/Vein/ginkgo/Fan/oak/Mast/water-lily/Disk/orchid/Moth/saguaro/Arm/venus-flytrap/Snap/pitcher/Drown/sundew/Dew/honeybee/Comb/monarch/Milk/luna/Ghost/firefly/Spark/darner/Dart or *Dragon electrical clone. Window-play FREEZE unchanged — never names freeze. Ethogram freeze/still/walk unchanged. Dart owns hawking/tandem/nymph/whir/anax and happy junius/labium/exuvia; Spark owns lantern/jstroke/semaphore/elytra/photinus; Ghost owns plumose/lunule/silk/stream/actias; Milk owns asclepias/oyamel/warning/chrysalis/danaus; Comb owns figure/corbicula/hex/proboscis/hive; Jade owns sway; Sol owns nod; Fan owns flutter; Felt owns tuft/bead/spore/cushion/thatch; Mast owns acorn/sinus/gall/taproot/bole; Rui owns dance; Pulse guest owns moon-jelly; Dragon happy owns glow. Phasmatodea Diapheromera desk life only. No cry inventing — thank-yous are silent desk motion only. */
export const TRICK_KEY = "stick";
export const TRICKS = ["rocking", "catalepsy", "browse", "tread", "diapheromera"] as const;
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

export const HAPPY_DUR = { femorata: 1.24, instar: 1.32, crypsis: 1.28 } as const;
export const DIAPHEROMERA_HOLD = 14.2;
export const RELEASE_S = 0.78;
export const DUR = { diapheromera: DIAPHEROMERA_HOLD + RELEASE_S, rocking: 1.56, catalepsy: 1.68, browse: 1.52, tread: 1.64 } as const;

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
    if (kind === "diapheromera") return 52 + roll * 34;
    if (kind === "catalepsy") return 16 + roll * 12;
    if (kind === "rocking") return 14 + roll * 11;
    return justFinished ? 10.8 + roll * 8.2 : 5.6 + roll * 7;
  }
export function pickTrick(rand?: number, musicOn?: boolean, lastKind?: StickTrickKind | string | null) {
    if (musicOn) return "diapheromera";
    const roll = rand == null ? Math.random() : rand;
    if (lastKind === "diapheromera") {
      if (roll < 0.26) return "rocking";
      if (roll < 0.5) return "catalepsy";
      if (roll < 0.74) return "browse";
      return "tread";
    }
    if (lastKind === "rocking") {
      if (roll < 0.26) return "diapheromera";
      if (roll < 0.5) return "catalepsy";
      if (roll < 0.74) return "browse";
      return "tread";
    }
    if (lastKind === "catalepsy") {
      if (roll < 0.22) return "diapheromera";
      if (roll < 0.44) return "rocking";
      if (roll < 0.68) return "browse";
      return "tread";
    }
    if (roll < 0.2) return "diapheromera";
    if (roll < 0.4) return "rocking";
    if (roll < 0.6) return "catalepsy";
    if (roll < 0.8) return "browse";
    return "tread";
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
      return { lift: s * 0.04, rot: s * 2.4, dx: 0, anim: "play" as TrickAnim };
    }
    if (u < 0.72) {
      const rock = Math.sin(t * 3.4) + 0.22 * Math.sin(t * 6.8);
      return {
        lift: 0.04 + Math.abs(rock) * 0.018,
        rot: 2.4 + rock * 2.6,
        dx: rock * 0.004,
        anim: "play" as TrickAnim,
      };
    }
    const s = (u - 0.72) / 0.28;
    return { lift: 0.02 * (1 - s), rot: 1.0 * (1 - s), dx: 0, anim: "idle" as TrickAnim };
  }
export function instarPose(t: number) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.instar));
    if (u < 0.2) {
      const s = u / 0.2;
      return { lift: s * 0.055, rot: s * -1.8, dx: s * 0.006, anim: "talk" as TrickAnim };
    }
    if (u < 0.78) {
      const shed = Math.sin(t * 4.2) + 0.3 * Math.sin(t * 9.1);
      return {
        lift: 0.055 + Math.abs(shed) * 0.035,
        rot: -1.8 + shed * 3.4,
        dx: shed * 0.007,
        anim: "talk" as TrickAnim,
      };
    }
    const s = (u - 0.78) / 0.22;
    return { lift: 0.03 * (1 - s), rot: -0.7 * (1 - s), dx: 0, anim: "sit" as TrickAnim };
  }
export function crypsisPose(t: number) {
    return {
      lift: 0.008 + Math.abs(Math.sin(t * 0.42)) * 0.012,
      rot: Math.sin(t * 0.55) * 0.9,
      dx: Math.sin(t * 0.28) * 0.002,
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
    const breath = Math.sin(t * 0.16) + 0.03 * Math.sin(t * 0.72);
    const twig = Math.abs(Math.sin(t * 0.28));
    return {
      lift: 0.012 + twig * 0.008,
      rot: 0.18 + breath * 0.42,
    };
  }
export function releasePose(t: number) {
    const u = Math.max(0, Math.min(1, t / RELEASE_S));
    return { lift: 0.016 * (1 - Math.sin(u * Math.PI * 0.5)), rot: 0.22 * (1 - u) };
  }
export function rockingPose(t: number, fromX: number, facing: 1 | -1) {
    const u = Math.max(0, Math.min(1, t / DUR.rocking));
    if (u < 0.12) {
      const s = smoothstep(u / 0.12);
      return { x: fromX, lift: s * 0.02, rot: s * 3.6 * facing, anim: "sit" as TrickAnim };
    }
    if (u < 0.84) {
      const s = (u - 0.12) / 0.72;
      const breeze = Math.sin(s * Math.PI * 3.2) + 0.35 * Math.sin(s * Math.PI * 5.6);
      return {
        x: fromX + facing * breeze * 0.006,
        lift: 0.02 + Math.abs(breeze) * 0.014,
        rot: facing * (3.6 + breeze * 4.8),
        anim: "sit" as TrickAnim,
      };
    }
    const s = smoothstep((u - 0.84) / 0.16);
    return {
      x: fromX,
      lift: 0.02 * (1 - s),
      rot: facing * (1.6 * (1 - s)),
      anim: "sit" as TrickAnim,
    };
  }
export function catalepsyPose(t: number, fromX: number, facing: 1 | -1) {
    const u = Math.max(0, Math.min(1, t / DUR.catalepsy));
    if (u < 0.18) {
      const s = smoothstep(u / 0.18);
      return { x: fromX, lift: s * -0.008, rot: s * 1.8 * facing, anim: "sit" as TrickAnim };
    }
    if (u < 0.82) {
      const hold = Math.sin(t * 0.18) * 0.35;
      return {
        x: fromX,
        lift: -0.008 + Math.abs(hold) * 0.006,
        rot: facing * (1.8 + hold * 0.55),
        anim: "sit" as TrickAnim,
      };
    }
    const s = smoothstep((u - 0.82) / 0.18);
    return {
      x: fromX,
      lift: -0.006 * (1 - s),
      rot: facing * (0.9 * (1 - s)),
      anim: "sit" as TrickAnim,
    };
  }
export function browsePose(t: number, fromX: number, facing: 1 | -1) {
    const u = Math.max(0, Math.min(1, t / DUR.browse));
    if (u < 0.14) {
      const s = smoothstep(u / 0.14);
      return { x: fromX + facing * 0.01 * s, lift: s * -0.02, rot: s * -2.2 * facing, anim: "sit" as TrickAnim };
    }
    if (u < 0.78) {
      const s = (u - 0.14) / 0.64;
      const chew = Math.sin(s * Math.PI * 6.4) + 0.25 * Math.sin(s * Math.PI * 11);
      return {
        x: fromX + facing * (0.01 + 0.012 * s) + facing * chew * 0.004,
        lift: -0.02 + Math.abs(chew) * 0.022,
        rot: facing * (-2.2 + chew * 2.8),
        anim: "sit" as TrickAnim,
      };
    }
    const s = smoothstep((u - 0.78) / 0.22);
    return {
      x: fromX + facing * 0.008 * (1 - s),
      lift: -0.012 * (1 - s),
      rot: facing * (-1.0 * (1 - s)),
      anim: "sit" as TrickAnim,
    };
  }
export function treadPose(t: number, fromX: number, facing: 1 | -1) {
    const u = Math.max(0, Math.min(1, t / DUR.tread));
    if (u < 0.12) {
      const s = smoothstep(u / 0.12);
      return { x: fromX, lift: s * 0.03, rot: s * 1.4 * facing, anim: "walk" as TrickAnim };
    }
    if (u < 0.78) {
      const s = (u - 0.12) / 0.66;
      const step = Math.sin(s * Math.PI * 2.2);
      const pause = Math.max(0, Math.sin(s * Math.PI * 1.1));
      return {
        x: fromX + facing * (0.055 * s + step * 0.012),
        lift: 0.03 + Math.abs(step) * 0.028 * pause,
        rot: facing * (1.4 + step * 2.6),
        anim: "walk" as TrickAnim,
      };
    }
    const s = smoothstep((u - 0.78) / 0.22);
    return {
      x: fromX + facing * 0.04 * (1 - s * 0.35),
      lift: 0.02 * (1 - s),
      rot: facing * (0.8 * (1 - s)),
      anim: "sit" as TrickAnim,
    };
  }
export function stepTrick(trick: StickTrick, dt: number, flags: TrickFlags): StickTrick {
  if (!trick || trick.phase === "done") return trick;
  if (shouldAbort(flags) && trick.kind !== "rocking" && trick.kind !== "catalepsy" && trick.kind !== "browse" && trick.kind !== "tread") {
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
  if (next.kind === "rocking") {
    const pose = rockingPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "catalepsy") {
    const pose = catalepsyPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "browse") {
    const pose = browsePose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else {
    const pose = treadPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  }
  if (u >= 1) return { ...next, phase: "done", lift: 0, rot: 0, anim: "idle" };
  return next;
}
