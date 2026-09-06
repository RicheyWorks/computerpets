/** Nori ground tricks while idle. House ball python — orb / nook / taste / inch / unroll personality (ball/hide/tongue desk life; shy inkwell bun). Feed-happy thank-yous sit after eat. Card-open freeze and window-play do not swallow a thank-you. Sleep, hide, and leave still win. Same map as desktop `ball-python-tricks.js`. Not a Rui, cat, dog, rabbit, hamster, guinea pig, turtle, goldfish, budgie, fox, penguin, parrot, ferret, hedgehog, chinchilla, axolotl, toucan, iguana, dragon/Vesper, phoenix/Ember, or *Dragon electrical (Relay/Fuse/Ground) move clone. Window-play BUN unchanged — never names `bun`. Hedgehog owns curl/ball; volt window-play owns coil; Ember owns settle/shine/dip; Vesper owns fold/thrum/glow; Sol owns flick/sun. Avoids bun/ball/coil/curl/bask/loaf/potato/tuck/hide/settle/shine/dip/sprawl/guard/smolder/claim/fold/thrum/glow/incline/sun/dewlap/cinder/blaze/shed/lift/return/flick/warm name collisions with prior guests and ball_python window-play. No cry inventing — thank-yous are silent desk motion only. */

export const TRICK_KEY = "ball_python";
export const TRICKS = ["orb", "nook", "taste", "inch", "unroll"] as const;
export const HAPPY = ["savor", "nestle", "center"] as const;
export type BallPythonTrickKind = (typeof TRICKS)[number];
export type BallPythonHappyKind = (typeof HAPPY)[number];
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

export type BallPythonTrick = {
  kind: BallPythonTrickKind;
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

export type BallPythonHappy = {
  kind: BallPythonHappyKind;
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

export const HAPPY_DUR: Record<BallPythonHappyKind, number> = {
  savor: 1.16,
  nestle: 1.2,
  center: 1.28,
};

/** Orb hold — Nori becomes a tight desk ball. Not window-play BUN. Not hedgehog curl. */
export const ORB_HOLD = 10.4;
export const RELEASE_S = 0.64;

export const DUR: Record<BallPythonTrickKind, number> = {
  orb: ORB_HOLD + RELEASE_S,
  nook: 1.36,
  taste: 1.28,
  inch: 1.42,
  unroll: 1.3,
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

export function nextTrickWait(justFinished: boolean, rand?: number, kind?: BallPythonTrickKind) {
  const roll = rand == null ? Math.random() : rand;
  if (kind === "orb") return 42 + roll * 26;
  if (kind === "nook") return 15 + roll * 10;
  if (kind === "taste") return 14 + roll * 10;
  return justFinished ? 10 + roll * 8 : 5 + roll * 6;
}

export function pickTrick(rand?: number, musicOn = false, lastKind?: BallPythonTrickKind | null): BallPythonTrickKind {
  if (musicOn) return "orb";
  const roll = rand == null ? Math.random() : rand;
  if (lastKind === "orb") {
    if (roll < 0.28) return "nook";
    if (roll < 0.5) return "taste";
    if (roll < 0.72) return "inch";
    return "unroll";
  }
  if (lastKind === "nook") {
    if (roll < 0.3) return "orb";
    if (roll < 0.52) return "taste";
    if (roll < 0.74) return "inch";
    return "unroll";
  }
  if (lastKind === "taste") {
    if (roll < 0.24) return "orb";
    if (roll < 0.46) return "nook";
    if (roll < 0.68) return "inch";
    return "unroll";
  }
  if (roll < 0.22) return "orb";
  if (roll < 0.4) return "nook";
  if (roll < 0.6) return "taste";
  if (roll < 0.8) return "inch";
  return "unroll";
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
  return key === TRICK_KEY || key === "nori";
}

export function startThankYou(
  key: string | undefined,
  lastKind: BallPythonHappyKind | null | undefined,
  x: number,
  facing: 1 | -1,
  flags?: TrickFlags,
) {
  if (!wantsThankYou(key)) return null;
  if (!happyCanStart(flags || { cmd: "idle" })) return null;
  const pick = pickHappy(lastKind);
  return { happy: beginHappy(pick, x, facing), kind: pick };
}

export function pickHappy(lastKind?: BallPythonHappyKind | null, rand?: number): BallPythonHappyKind {
  const pool = HAPPY.filter((k) => k !== lastKind);
  const list = pool.length ? pool : [...HAPPY];
  const roll = rand == null ? Math.random() : rand;
  return list[Math.floor(roll * list.length)] ?? list[0]!;
}

export function beginHappy(kind: BallPythonHappyKind, x: number, facing: 1 | -1 = 1): BallPythonHappy {
  const name: BallPythonHappyKind = HAPPY.includes(kind) ? kind : "savor";
  return {
    kind: name,
    happy: true,
    phase: "go",
    t: 0,
    x,
    lift: 0,
    rot: 0,
    anim: name === "savor" ? "sit" : name === "nestle" ? "sit" : "talk",
    facing,
    fromX: x,
  };
}

export function savorPose(t: number) {
  const u = Math.max(0, Math.min(1, t / HAPPY_DUR.savor));
  if (u < 0.15) {
    const s = u / 0.15;
    return { lift: s * 1.6, rot: s * 6, dx: 0, anim: "sit" as const };
  }
  if (u < 0.82) {
    return {
      lift: 1.6 + Math.abs(Math.sin(t * 4.6)) * 1.0,
      rot: 6 + Math.sin(t * 3.4) * 4,
      dx: 0,
      anim: "sit" as const,
    };
  }
  const s = (u - 0.82) / 0.18;
  return { lift: 1.6 * (1 - s), rot: 6 * (1 - s), dx: 0, anim: "idle" as const };
}

export function nestlePose(t: number) {
  const u = Math.max(0, Math.min(1, t / HAPPY_DUR.nestle));
  if (u < 0.14) {
    const s = u / 0.14;
    return { lift: s * 0.6, rot: s * -10, dx: 0, anim: "sit" as const };
  }
  if (u < 0.78) {
    return {
      lift: 0.6 + Math.abs(Math.sin(t * 3.2)) * 0.9,
      rot: -10 + Math.sin(t * 2.8) * 5,
      dx: Math.sin(t * 2.1) * 0.25,
      anim: "sit" as const,
    };
  }
  const s = (u - 0.78) / 0.22;
  return { lift: 0.6 * (1 - s), rot: -10 * (1 - s), dx: 0, anim: "sit" as const };
}

export function centerPose(t: number) {
  return {
    lift: Math.abs(Math.sin(t * 2.2)) * 1.0 + 0.4,
    rot: -5 + Math.sin(t * 1.9) * 5,
    dx: Math.sin(t * 1.5) * 0.3,
    anim: "talk" as const,
  };
}

export function stepHappy(happy: BallPythonHappy, dt: number, flags?: TrickFlags): BallPythonHappy {
  if (!happy || happy.phase === "done") return happy;
  if (happyShouldAbort(flags)) {
    return { ...happy, phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true };
  }
  const next: BallPythonHappy = { ...happy, t: happy.t + Math.max(0, dt) };
  const hold = HAPPY_DUR[next.kind];
  if (next.kind === "savor") {
    const pose = savorPose(next.t);
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "nestle") {
    const pose = nestlePose(next.t);
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else {
    const pose = centerPose(next.t);
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  }
  if (next.t >= hold) return { ...next, phase: "done", lift: 0, rot: 0, anim: "idle" };
  return next;
}

/** Nori has no Rui-style sleep-frame hold. */
export function sleepHoldFrame(_key: string | undefined, _frameCount?: number) {
  return null;
}

export function beginTrick(kind: BallPythonTrickKind, x: number, facing: 1 | -1 = 1): BallPythonTrick {
  const anim: TrickAnim =
    kind === "orb"
      ? "sit"
      : kind === "nook"
        ? "sit"
        : kind === "taste"
          ? "talk"
          : kind === "inch"
            ? "play"
            : kind === "unroll"
              ? "play"
              : "sit";
  return {
    kind,
    phase: kind === "orb" ? "hold" : "go",
    t: 0,
    x,
    lift: 0,
    rot: 0,
    anim,
    facing,
    fromX: x,
  };
}

function smoothstep(t: number) {
  const x = Math.max(0, Math.min(1, t));
  return x * x * (3 - 2 * x);
}

/** Orb — tight comfort ball on the blotter. Soft rock. Not window-play BUN. Not hedgehog curl. */
export function orbPose(t: number) {
  return {
    lift: 0.1 + Math.sin(t * 1.05) * 0.22,
    rot: 6 + Math.sin(t * 0.9) * 1.6 + Math.sin(t * 2.2) * 0.9,
  };
}

/** Soft uncurl out of the orb; stays on the desk. Not window-play leave. */
export function releasePose(t: number) {
  const u = Math.max(0, Math.min(1, t / RELEASE_S));
  return { lift: 0.2 * (1 - Math.sin(u * Math.PI * 0.5)), rot: 6 * (1 - u) };
}

/** Nook — head tucks into a desk hide. Shy hide without naming hide/bun. */
export function nookPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.nook));
  if (u < 0.12) {
    const s = smoothstep(u / 0.12);
    return { x: fromX, lift: s * 0.4, rot: s * -12 * facing, anim: "sit" as const };
  }
  if (u < 0.86) {
    const s = (u - 0.12) / 0.74;
    const tuck = Math.abs(Math.sin(s * Math.PI * 1.6));
    return {
      x: fromX + facing * Math.sin(s * Math.PI) * 0.3,
      lift: 0.4 + tuck * 0.5,
      rot: facing * (-12 - tuck * 4),
      anim: "sit" as const,
    };
  }
  const s = smoothstep((u - 0.86) / 0.14);
  return {
    x: fromX,
    lift: 0.4 * (1 - s),
    rot: facing * -4 * (1 - s),
    anim: "sit" as const,
  };
}

/** Taste — tongue-flick chemosense. Not Sol flick. Not dog sniff. */
export function tastePose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.taste));
  if (u < 0.1) {
    const s = smoothstep(u / 0.1);
    return { x: fromX, lift: s * 1.2, rot: s * 4 * facing, anim: "talk" as const };
  }
  if (u < 0.88) {
    const s = (u - 0.1) / 0.78;
    const flick = Math.sin(s * Math.PI * 6.5);
    return {
      x: fromX + facing * flick * 0.35,
      lift: 1.2 + Math.abs(flick) * 0.9,
      rot: facing * (4 + flick * 10),
      anim: "talk" as const,
    };
  }
  const s = smoothstep((u - 0.88) / 0.12);
  return {
    x: fromX,
    lift: 1.2 * (1 - s),
    rot: facing * 2 * (1 - s),
    anim: "sit" as const,
  };
}

/** Inch — shy one-inch lunge then retreat. Athletic theater, then bun-thought. */
export function inchPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.inch));
  if (u < 0.14) {
    const s = smoothstep(u / 0.14);
    return { x: fromX, lift: s * 1.6, rot: -s * 8 * facing, anim: "play" as const };
  }
  if (u < 0.5) {
    const s = (u - 0.14) / 0.36;
    return {
      x: fromX + facing * smoothstep(s) * 4.2,
      lift: 1.6 + Math.sin(s * Math.PI) * 0.8,
      rot: facing * (-8 + s * 14),
      anim: "play" as const,
    };
  }
  if (u < 0.82) {
    const s = (u - 0.5) / 0.32;
    const home = smoothstep(s);
    return {
      x: fromX + facing * (4.2 * (1 - home)),
      lift: 1.6 * (1 - home * 0.5) + Math.sin(s * Math.PI) * 0.4,
      rot: facing * (6 - home * 10),
      anim: "play" as const,
    };
  }
  const s = smoothstep((u - 0.82) / 0.18);
  return {
    x: fromX,
    lift: 1.6 * 0.5 * (1 - s),
    rot: facing * -2 * (1 - s),
    anim: "sit" as const,
  };
}

/** Unroll — decide to be long, then re-round. Not ferret noodle. Not Vesper fold. */
export function unrollPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.unroll));
  if (u < 0.18) {
    const s = smoothstep(u / 0.18);
    return { x: fromX + facing * s * 2.4, lift: s * 1.1, rot: s * -6 * facing, anim: "play" as const };
  }
  if (u < 0.62) {
    const s = (u - 0.18) / 0.44;
    const wave = Math.sin(s * Math.PI * 2.2);
    return {
      x: fromX + facing * (2.4 + s * 2.8 + wave * 0.4),
      lift: 1.1 + Math.abs(wave) * 0.7,
      rot: facing * (-6 + wave * 8),
      anim: "play" as const,
    };
  }
  const s = smoothstep((u - 0.62) / 0.38);
  return {
    x: fromX + facing * (5.2 * (1 - s)),
    lift: 1.1 * (1 - s) * 0.45,
    rot: facing * (-2 + s * 8),
    anim: "sit" as const,
  };
}

export function stepTrick(trick: BallPythonTrick, dt: number, flags?: TrickFlags): BallPythonTrick {
  if (!trick || trick.phase === "done") return trick;
  if (shouldAbort(flags) && trick.kind !== "inch" && trick.kind !== "unroll") {
    return { ...trick, phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true };
  }
  const next: BallPythonTrick = { ...trick, t: trick.t + Math.max(0, dt) };
  if (next.kind === "orb") {
    if (next.t < ORB_HOLD) {
      const pose = orbPose(next.t);
      next.phase = "hold";
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = "sit";
      return next;
    }
    if (next.t < ORB_HOLD + RELEASE_S) {
      const pose = releasePose(next.t - ORB_HOLD);
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
  if (next.kind === "nook") {
    const pose = nookPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "taste") {
    const pose = tastePose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "inch") {
    const pose = inchPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else {
    const pose = unrollPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  }
  if (u >= 1) {
    return { ...next, phase: "done", lift: 0, rot: 0, anim: "idle" };
  }
  return next;
}
