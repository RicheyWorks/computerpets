/** Rue ground tricks while idle — ultra-polish pass. House fox — den / mouser / stalk / trot / prance / cock / stash personality (soft Vulpes desk life). Den curl-hold without naming loaf or nest or potato or soak or wait; mouser hunting leap without naming pounce (cat) or zoom; stalk low creep without naming sniff or sneak-clone of dog; trot desk gait without naming walk-cmd; prance high-step play without naming binky or popcorn; cock ear/head listen without naming tilt (dog thank-you) or listen (robin ethogram) or head_cock (bird); stash soft paw-cover food cache without naming dig (rabbit) or cache (chickadee) or bury. Window-play SCENT unchanged — never names a trick `scent`. Guest slug Rue / key fox — accept "fox" and "rue". Amplitudes raised toward Rui richness; denser timing; house cry preferred for talk (`fox.wav`). Thank-yous yip / chuff / nuzzle. Feed-happy after eat. Sleep, hide, leave, rest, card, ribbon still win. Same map as desktop `fox-tricks.js`. True house-fox desk life — not Rui/cat/dog/rabbit/hamster/guinea_pig/turtle/goldfish/budgie/penguin/parrot/ferret/hedgehog/chinchilla/axolotl/toucan/iguana/dragon/Vesper or *Dragon electrical clones. Bird ultra line (Soot→Ember) and Miso / Pip / Thimble / Clip / Whee / Ink / Coin already done; Echo/budgie skip (bird-ultra); Peck/penguin skip (bird). Rue continues house-order ultra-polish. Next guest ultra is Wick / ferret. No cry inventing — thank-yous are silent desk motion only. Never retouch Rui sprites. Ethogram SCRATCH_KEYS still owns paw-scratch motion — this module never names a trick `scratch`.  fox.wav EXISTS so prefersHouseCry adds fox. Amplitudes raised toward Rui richness; denser waits/weights (DEN_HOLD=11.2 RELEASE_S=1.18). Catalog 221. */

export const TRICK_KEY = "fox";
export const TRICKS = ["den", "mouser", "stalk", "trot", "prance", "cock", "stash"] as const;
export const HAPPY = ["yip", "chuff", "nuzzle"] as const;
export type FoxTrickKind = (typeof TRICKS)[number];
export type FoxHappyKind = (typeof HAPPY)[number];
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

export type FoxTrick = {
  kind: FoxTrickKind;
  phase: TrickPhase;
  t: number;
  x: number;
  lift: number;
  rot: number;
  anim: TrickAnim;
  facing: 1 | -1;
  fromX?: number;
  abort?: boolean;
};

export type FoxHappy = {
  kind: FoxHappyKind;
  happy: true;
  phase: HappyPhase;
  t: number;
  x: number;
  lift: number;
  rot: number;
  anim: TrickAnim;
  facing: 1 | -1;
  fromX?: number;
  abort?: boolean;
};

export const HAPPY_DUR: Record<FoxHappyKind, number> = {
  yip: 1.72,
  chuff: 1.66,
  nuzzle: 1.58,
};

/** Den hold — Rue curls into a Vulpes ball on one honest thought. Not window-play scent. Not a cat loaf. Not a hamster nest. */
export const DEN_HOLD = 11.2;
export const RELEASE_S = 1.18;

export const DUR: Record<FoxTrickKind, number> = {
  den: DEN_HOLD + RELEASE_S,
  mouser: 1.85,
  stalk: 2.12,
  trot: 1.95,
  prance: 1.88,
  cock: 2.05,
  stash: 2.10,
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

export function nextTrickWait(justFinished: boolean, rand?: number, kind?: FoxTrickKind) {
  const roll = rand == null ? Math.random() : rand;
  if (kind === "den") return 40 + roll * 26;
  if (kind === "mouser" || kind === "prance" || kind === "trot") return 12.8 + roll * 9.4;
  if (kind === "cock" || kind === "stash" || kind === "stalk") return 11.6 + roll * 8.5;
  return justFinished ? 8.5 + roll * 8.4 : 4.4 + roll * 7.4;
}

export function pickTrick(rand?: number, musicOn = false, lastKind?: FoxTrickKind | null): FoxTrickKind {
  if (musicOn) return "den";
  const roll = rand == null ? Math.random() : rand;
  const pool = TRICKS.filter((k) => k !== lastKind);
  const list = pool.length ? pool : TRICKS.slice();
  const weights = list.map((k) =>
    k === "den" ? 0.72 : k === "mouser" || k === "cock" || k === "stash" ? 1.28 : k === "prance" || k === "trot" ? 1.18 : 1.08
  );
  let total = 0;
  for (let i = 0; i < weights.length; i++) total += weights[i];
  let r = roll * total;
  for (let i = 0; i < list.length; i++) {
    r -= weights[i];
    if (r <= 0) return list[i];
  }
  return list[list.length - 1] || "den";
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

export function wantsThankYou(key: string | undefined) {
  return key === TRICK_KEY || key === "rue";
}

export function startThankYou(
  key: string | undefined,
  lastKind: FoxHappyKind | string | null | undefined,
  x: number,
  facing: 1 | -1,
  flags?: TrickFlags,
) {
  if (!wantsThankYou(key)) return null;
  if (!happyCanStart(flags || { cmd: "idle" })) return null;
  const pick = pickHappy(lastKind as FoxHappyKind | null | undefined);
  return { happy: beginHappy(pick, x, facing), kind: pick };
}

export function pickHappy(lastKind?: FoxHappyKind | null, rand?: number): FoxHappyKind {
  const pool = HAPPY.filter((k) => k !== lastKind);
  const list = pool.length ? pool : HAPPY.slice();
  const roll = rand == null ? Math.random() : rand;
  return list[Math.floor(roll * list.length)] || list[0];
}

export function beginHappy(kind: FoxHappyKind, x: number, facing: 1 | -1 = 1): FoxHappy {
  const name = HAPPY.includes(kind) ? kind : "yip";
  return {
    kind: name,
    happy: true,
    phase: "go",
    t: 0,
    x,
    lift: 0,
    rot: 0,
    anim: name === "yip" ? "talk" : name === "chuff" ? "talk" : "sit",
    facing: facing == null ? 1 : facing,
    fromX: x,
  };
}

export function yipPose(t: number) {
  const u = Math.max(0, Math.min(1, t / HAPPY_DUR.yip));
  if (u < 0.16) {
    const s = u / 0.16;
    return { lift: s * 10.2, rot: -s * 12, dx: 0, anim: "talk" as TrickAnim };
  }
  if (u < 0.78) {
    return {
      lift: 10.2 + Math.abs(Math.sin(t * 11)) * 4.6,
      rot: -12 + Math.sin(t * 14) * 9.6,
      dx: 0,
      anim: "talk" as TrickAnim,
    };
  }
  const s = (u - 0.78) / 0.22;
  return { lift: 10.2 * (1 - s), rot: -12 * (1 - s), dx: 0, anim: "sit" as TrickAnim };
}

export function chuffPose(t: number) {
  const u = Math.max(0, Math.min(1, t / HAPPY_DUR.chuff));
  if (u < 0.88) {
    return {
      lift: Math.abs(Math.sin(t * 8)) * 5.0,
      rot: Math.sin(t * 7) * 14.4,
      dx: Math.sin(t * 5) * 2.6,
      anim: "talk" as TrickAnim,
    };
  }
  return { lift: 0, rot: Math.sin(((u - 0.88) / 0.12) * Math.PI) * 4, dx: 0, anim: "idle" as TrickAnim };
}

export function nuzzlePose(t: number) {
  const u = Math.max(0, Math.min(1, t / HAPPY_DUR.nuzzle));
  return {
    lift: Math.sin(u * Math.PI) * 6.6,
    rot: Math.sin(u * Math.PI * 2) * 19.2,
    dx: Math.sin(u * Math.PI) * 6.6,
    anim: "sit" as TrickAnim,
  };
}

export function stepHappy(happy: FoxHappy, dt: number, flags?: TrickFlags): FoxHappy {
  if (!happy || happy.phase === "done") return happy;
  if (happyShouldAbort(flags)) {
    return { ...happy, phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true };
  }
  const next = { ...happy, t: happy.t + Math.max(0, dt) };
  const hold = HAPPY_DUR[next.kind];
  if (next.kind === "yip") {
    const pose = yipPose(next.t);
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "chuff") {
    const pose = chuffPose(next.t);
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else {
    const pose = nuzzlePose(next.t);
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  }
  if (next.t >= hold) return { ...next, phase: "done", lift: 0, rot: 0, anim: "idle" };
  return next;
}

export function sleepHoldFrame(_key: string | undefined, _frameCount?: number) {
  return null;
}

export function beginTrick(kind: FoxTrickKind, x: number, facing: 1 | -1 = 1): FoxTrick {
  const anim: TrickAnim =
    kind === "den" || kind === "stalk" || kind === "cock" || kind === "stash"
      ? "sit"
      : kind === "mouser" || kind === "prance"
        ? "play"
        : kind === "trot"
          ? "walk"
          : "sit";
  return {
    kind,
    phase: kind === "den" ? "hold" : "go",
    t: 0,
    x,
    lift: 0,
    rot: 0,
    anim,
    facing: facing == null ? 1 : facing,
    fromX: x,
  };
}

function smoothstep(t: number) {
  const x = Math.max(0, Math.min(1, t));
  return x * x * (3 - 2 * x);
}

export function denPose(t: number) {
  const soft = Math.sin(t * 1.7);
  const breath = Math.sin(t * 2.8);
  return {
    lift: -5.3 + soft * 1.9 + Math.abs(breath) * 1.3,
    rot: 16.8 + breath * 7.2 + Math.sin(t * 5.1) * 4.8,
  };
}

export function releasePose(t: number) {
  const u = Math.max(0, Math.min(1, t / RELEASE_S));
  return {
    lift: -5.3 * (1 - Math.sin(u * Math.PI * 0.5)) + Math.sin(u * Math.PI) * 7.2,
    rot: 16.8 * (1 - u),
  };
}

export function mouserPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.mouser));
  if (u < 0.18) {
    const s = smoothstep(u / 0.18);
    return { x: fromX, lift: s * 4.8, rot: -s * 14.4, anim: "sit" as TrickAnim };
  }
  if (u < 0.42) {
    const s = smoothstep((u - 0.18) / 0.24);
    return {
      x: fromX + facing * 5 * s,
      lift: 4.8 + s * 26.4,
      rot: -14.4 + s * 28.8,
      anim: "play" as TrickAnim,
    };
  }
  if (u < 0.72) {
    const s = smoothstep((u - 0.42) / 0.3);
    return {
      x: fromX + facing * (5 + 8 * s),
      lift: 31.2 * (1 - s) + 2.4,
      rot: 14.4 - s * 21.6,
      anim: "play" as TrickAnim,
    };
  }
  const s = smoothstep((u - 0.72) / 0.28);
  return {
    x: fromX + facing * 13,
    lift: 2.4 * (1 - s),
    rot: -6 * (1 - s),
    anim: "sit" as TrickAnim,
  };
}

export function stalkPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.stalk));
  if (u < 0.12) {
    const s = smoothstep(u / 0.12);
    return { x: fromX, lift: -s * 4.2, rot: s * 9.6 * facing, anim: "sit" as TrickAnim };
  }
  if (u < 0.85) {
    const s = (u - 0.12) / 0.73;
    const step = Math.sin(s * Math.PI * 4);
    return {
      x: fromX + facing * 20 * smoothstep(s),
      lift: -4.2 + Math.abs(step) * 3.8,
      rot: facing * (9.6 + step * 10.8),
      anim: "walk" as TrickAnim,
    };
  }
  const s = smoothstep((u - 0.85) / 0.15);
  return {
    x: fromX + facing * 20,
    lift: -4.2 * (1 - s),
    rot: facing * 4.8 * (1 - s),
    anim: "sit" as TrickAnim,
  };
}

export function trotPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.trot));
  if (u < 0.1) {
    const s = smoothstep(u / 0.1);
    return { x: fromX, lift: s * 6, rot: s * 12 * facing, anim: "sit" as TrickAnim };
  }
  if (u < 0.88) {
    const s = (u - 0.1) / 0.78;
    const step = Math.sin(s * Math.PI * 5);
    return {
      x: fromX + facing * 24 * smoothstep(s),
      lift: 6 + Math.abs(step) * 7.8,
      rot: facing * (12 + step * 13.2),
      anim: "walk" as TrickAnim,
    };
  }
  const s = smoothstep((u - 0.88) / 0.12);
  return {
    x: fromX + facing * 24,
    lift: 6 * (1 - s),
    rot: facing * 6 * (1 - s),
    anim: "sit" as TrickAnim,
  };
}

export function prancePose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.prance));
  if (u < 0.9) {
    return {
      x: fromX + facing * Math.sin(t * 9) * 5,
      lift: Math.abs(Math.sin(t * 12)) * 16.8,
      rot: Math.sin(t * 10) * 24,
      anim: "play" as TrickAnim,
    };
  }
  const s = smoothstep((u - 0.9) / 0.1);
  return {
    x: fromX,
    lift: 0,
    rot: 12 * (1 - s),
    anim: "sit" as TrickAnim,
  };
}

/** Ear/head cock — Rue listens for desk prey. Not a dog tilt thank-you. Not a robin listen ethogram name. */
export function cockPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.cock));
  if (u < 0.14) {
    const s = smoothstep(u / 0.14);
    return { x: fromX, lift: s * 4.2, rot: s * 21.6 * facing, anim: "sit" as TrickAnim };
  }
  if (u < 0.86) {
    const s = (u - 0.14) / 0.72;
    const tick = Math.sin(s * Math.PI * 3);
    return {
      x: fromX + facing * Math.sin(s * Math.PI) * 2.5,
      lift: 4.2 + Math.abs(tick) * 3.4,
      rot: facing * (21.6 + tick * 12),
      anim: "sit" as TrickAnim,
    };
  }
  const s = smoothstep((u - 0.86) / 0.14);
  return {
    x: fromX,
    lift: 4.2 * (1 - s),
    rot: facing * 21.6 * (1 - s),
    anim: "sit" as TrickAnim,
  };
}

/** Soft paw-cover stash — classic red-fox food cache. Not rabbit dig. Not chickadee cache. */
export function stashPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.stash));
  if (u < 0.16) {
    const s = smoothstep(u / 0.16);
    return { x: fromX, lift: -s * 6.6, rot: s * 14.4 * facing, anim: "sit" as TrickAnim };
  }
  if (u < 0.82) {
    const s = (u - 0.16) / 0.66;
    const scrape = Math.sin(s * Math.PI * 5);
    return {
      x: fromX + facing * scrape * 3.5,
      lift: -6.6 + Math.abs(scrape) * 3.8,
      rot: facing * (14.4 + scrape * 10.8),
      anim: "sit" as TrickAnim,
    };
  }
  const s = smoothstep((u - 0.82) / 0.18);
  return {
    x: fromX,
    lift: -6.6 * (1 - s),
    rot: facing * 9.6 * (1 - s),
    anim: "sit" as TrickAnim,
  };
}

export function stepTrick(trick: FoxTrick, dt: number, flags?: TrickFlags): FoxTrick {
  if (!trick || trick.phase === "done") return trick;
  if (shouldAbort(flags) && trick.kind !== "mouser" && trick.kind !== "trot") {
    return { ...trick, phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true };
  }
  const next = { ...trick, t: trick.t + Math.max(0, dt) };
  if (next.kind === "den") {
    if (next.t < DEN_HOLD) {
      const pose = denPose(next.t);
      next.phase = "hold";
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = "sit";
      return next;
    }
    if (next.t < DEN_HOLD + RELEASE_S) {
      const pose = releasePose(next.t - DEN_HOLD);
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
  if (next.kind === "mouser") {
    const pose = mouserPose(next.t, fromX, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "stalk") {
    const pose = stalkPose(next.t, fromX, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "trot") {
    const pose = trotPose(next.t, fromX, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "prance") {
    const pose = prancePose(next.t, fromX, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "cock") {
    const pose = cockPose(next.t, fromX, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else {
    const pose = stashPose(next.t, fromX, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  }
  if (u >= 1) return { ...next, phase: "done", lift: 0, rot: 0, anim: "idle" };
  return next;
}
