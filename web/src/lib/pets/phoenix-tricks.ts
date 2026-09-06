/** Ember ground tricks while idle. House phoenix — cinder / blaze / shed / lift / return personality (ash-and-return firebird desk life). Feed-happy thank-yous sit after eat. Card-open freeze and window-play do not swallow a thank-you. Sleep, hide, and leave still win. Same map as desktop `phoenix-tricks.js`. Not a Rui, cat, dog, rabbit, hamster, guinea pig, turtle, goldfish, budgie, fox, penguin, parrot, ferret, hedgehog, chinchilla, axolotl, toucan, iguana, dragon/Vesper, or *Dragon electrical (Relay/Fuse/Ground) move clone. Window-play KINDLE unchanged — never names `kindle`. Floss already owns ash. Vesper already owns sprawl/guard/smolder/claim/fold and thrum/glow/incline. Sol already owns sun. Avoids kindle/ash/sprawl/guard/smolder/claim/fold/thrum/glow/incline/sun/dewlap/crackle/bank/flare/spark/warm/fan/preen/roost/flash/drape/bask/coil name collisions with prior guests and phoenix window-play. No cry inventing — thank-yous are silent desk motion only. */

export const TRICK_KEY = "phoenix";
export const TRICKS = ["cinder", "blaze", "shed", "lift", "return"] as const;
export const HAPPY = ["shine", "dip", "settle"] as const;
export type PhoenixTrickKind = (typeof TRICKS)[number];
export type PhoenixHappyKind = (typeof HAPPY)[number];
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

export type PhoenixTrick = {
  kind: PhoenixTrickKind;
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

export type PhoenixHappy = {
  kind: PhoenixHappyKind;
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

export const HAPPY_DUR: Record<PhoenixHappyKind, number> = {
  shine: 1.16,
  dip: 1.2,
  settle: 1.28,
};

/** Cinder hold — Ember banks as a coal on the desk ash. Not window-play KINDLE. Not Floss ash-bath. */
export const CINDER_HOLD = 10.4;
export const RELEASE_S = 0.64;

export const DUR: Record<PhoenixTrickKind, number> = {
  cinder: CINDER_HOLD + RELEASE_S,
  blaze: 1.36,
  shed: 1.28,
  lift: 1.42,
  return: 1.3,
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

export function nextTrickWait(justFinished: boolean, rand?: number, kind?: PhoenixTrickKind) {
  const roll = rand == null ? Math.random() : rand;
  if (kind === "cinder") return 42 + roll * 26;
  if (kind === "blaze") return 15 + roll * 10;
  if (kind === "shed") return 14 + roll * 10;
  return justFinished ? 10 + roll * 8 : 5 + roll * 6;
}

export function pickTrick(rand?: number, musicOn = false, lastKind?: PhoenixTrickKind | null): PhoenixTrickKind {
  if (musicOn) return "cinder";
  const roll = rand == null ? Math.random() : rand;
  if (lastKind === "cinder") {
    if (roll < 0.28) return "blaze";
    if (roll < 0.5) return "shed";
    if (roll < 0.72) return "lift";
    return "return";
  }
  if (lastKind === "blaze") {
    if (roll < 0.3) return "cinder";
    if (roll < 0.52) return "shed";
    if (roll < 0.74) return "lift";
    return "return";
  }
  if (lastKind === "shed") {
    if (roll < 0.24) return "cinder";
    if (roll < 0.46) return "blaze";
    if (roll < 0.68) return "lift";
    return "return";
  }
  if (roll < 0.22) return "cinder";
  if (roll < 0.4) return "blaze";
  if (roll < 0.6) return "shed";
  if (roll < 0.8) return "lift";
  return "return";
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
  return key === TRICK_KEY || key === "ember";
}

export function startThankYou(
  key: string | undefined,
  lastKind: PhoenixHappyKind | null | undefined,
  x: number,
  facing: 1 | -1,
  flags?: TrickFlags,
) {
  if (!wantsThankYou(key)) return null;
  if (!happyCanStart(flags || { cmd: "idle" })) return null;
  const pick = pickHappy(lastKind);
  return { happy: beginHappy(pick, x, facing), kind: pick };
}

export function pickHappy(lastKind?: PhoenixHappyKind | null, rand?: number): PhoenixHappyKind {
  const pool = HAPPY.filter((k) => k !== lastKind);
  const list = pool.length ? pool : [...HAPPY];
  const roll = rand == null ? Math.random() : rand;
  return list[Math.floor(roll * list.length)] ?? list[0]!;
}

export function beginHappy(kind: PhoenixHappyKind, x: number, facing: 1 | -1 = 1): PhoenixHappy {
  const name: PhoenixHappyKind = HAPPY.includes(kind) ? kind : "shine";
  return {
    kind: name,
    happy: true,
    phase: "go",
    t: 0,
    x,
    lift: 0,
    rot: 0,
    anim: name === "shine" ? "sit" : name === "dip" ? "sit" : "talk",
    facing,
    fromX: x,
  };
}

export function shinePose(t: number) {
  const u = Math.max(0, Math.min(1, t / HAPPY_DUR.shine));
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

export function dipPose(t: number) {
  const u = Math.max(0, Math.min(1, t / HAPPY_DUR.dip));
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

export function settlePose(t: number) {
  return {
    lift: Math.abs(Math.sin(t * 2.2)) * 1.0 + 0.4,
    rot: -5 + Math.sin(t * 1.9) * 5,
    dx: Math.sin(t * 1.5) * 0.3,
    anim: "talk" as const,
  };
}

export function stepHappy(happy: PhoenixHappy, dt: number, flags?: TrickFlags): PhoenixHappy {
  if (!happy || happy.phase === "done") return happy;
  if (happyShouldAbort(flags)) {
    return { ...happy, phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true };
  }
  const next: PhoenixHappy = { ...happy, t: happy.t + Math.max(0, dt) };
  const hold = HAPPY_DUR[next.kind];
  if (next.kind === "shine") {
    const pose = shinePose(next.t);
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "dip") {
    const pose = dipPose(next.t);
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else {
    const pose = settlePose(next.t);
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  }
  if (next.t >= hold) return { ...next, phase: "done", lift: 0, rot: 0, anim: "idle" };
  return next;
}

/** Ember has no Rui-style sleep-frame hold. */
export function sleepHoldFrame(_key: string | undefined, _frameCount?: number) {
  return null;
}

export function beginTrick(kind: PhoenixTrickKind, x: number, facing: 1 | -1 = 1): PhoenixTrick {
  const anim: TrickAnim =
    kind === "cinder"
      ? "sit"
      : kind === "blaze"
        ? "sit"
        : kind === "shed"
          ? "play"
          : kind === "lift"
            ? "play"
            : kind === "return"
              ? "sit"
              : "sit";
  return {
    kind,
    phase: kind === "cinder" ? "hold" : "go",
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

/** Cinder — banked-coal nestle on the blotter ash. Soft heat pulse. Not Vesper sprawl. Not window-play KINDLE. */
export function cinderPose(t: number) {
  return {
    lift: 0.15 + Math.sin(t * 1.15) * 0.28,
    rot: 4 + Math.sin(t * 0.95) * 1.8 + Math.sin(t * 2.4) * 1.1,
  };
}

/** Soft lift out of the cinder bank; stays on the desk. Not window-play leave. */
export function releasePose(t: number) {
  const u = Math.max(0, Math.min(1, t / RELEASE_S));
  return { lift: 0.25 * (1 - Math.sin(u * Math.PI * 0.5)), rot: 5 * (1 - u) };
}

/** Blaze — brief gold-throat brightening. Not Vesper smolder. Not fuse warm. Not parrot flash. */
export function blazePose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.blaze));
  if (u < 0.12) {
    const s = smoothstep(u / 0.12);
    return { x: fromX, lift: s * 2.0, rot: s * 10 * facing, anim: "sit" as const };
  }
  if (u < 0.86) {
    const s = (u - 0.12) / 0.74;
    const flare = Math.abs(Math.sin(s * Math.PI * 2.4));
    return {
      x: fromX + facing * Math.sin(s * Math.PI) * 0.45,
      lift: 2.0 + flare * 1.4,
      rot: facing * (10 + flare * 8),
      anim: "talk" as const,
    };
  }
  const s = smoothstep((u - 0.86) / 0.14);
  return {
    x: fromX,
    lift: 2.0 * (1 - s) * 0.25,
    rot: facing * 4 * (1 - s),
    anim: "sit" as const,
  };
}

/** Shed — shake ash flakes from the flight feathers. Not Floss ash-bath. Not budgie preen. */
export function shedPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.shed));
  if (u < 0.1) {
    const s = smoothstep(u / 0.1);
    return { x: fromX, lift: s * 1.4, rot: s * -6 * facing, anim: "play" as const };
  }
  if (u < 0.88) {
    const s = (u - 0.1) / 0.78;
    const shake = Math.sin(s * Math.PI * 5.5);
    return {
      x: fromX + facing * shake * 0.7,
      lift: 1.4 + Math.abs(shake) * 1.8,
      rot: facing * (-6 + shake * 14),
      anim: "play" as const,
    };
  }
  const s = smoothstep((u - 0.88) / 0.12);
  return {
    x: fromX,
    lift: 1.4 * (1 - s),
    rot: facing * -2 * (1 - s),
    anim: "sit" as const,
  };
}

/** Lift — rise as if about to take wing, then stay. Not window-play KINDLE rise. Not Rui somersault. */
export function liftPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.lift));
  if (u < 0.14) {
    const s = smoothstep(u / 0.14);
    return { x: fromX, lift: s * 2.8, rot: -s * 12 * facing, anim: "play" as const };
  }
  if (u < 0.78) {
    const s = (u - 0.14) / 0.64;
    const wing = Math.abs(Math.sin(s * Math.PI * 2));
    return {
      x: fromX + facing * Math.sin(s * Math.PI) * 0.8,
      lift: 2.8 + wing * 1.6,
      rot: facing * (-12 + wing * 9),
      anim: "play" as const,
    };
  }
  const s = smoothstep((u - 0.78) / 0.22);
  return {
    x: fromX + facing * 0.4,
    lift: 2.8 * (1 - s) * 0.3,
    rot: facing * -4 * (1 - s),
    anim: "sit" as const,
  };
}

/** Return — the species: leave a little, come back kinder. Not Vesper fold. Not window-play KINDLE. */
export function returnPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.return));
  if (u < 0.2) {
    const s = smoothstep(u / 0.2);
    return { x: fromX + facing * s * 3.2, lift: s * 1.8, rot: s * 8 * facing, anim: "play" as const };
  }
  if (u < 0.7) {
    const s = (u - 0.2) / 0.5;
    const home = smoothstep(s);
    return {
      x: fromX + facing * (3.2 * (1 - home)),
      lift: 1.8 * (1 - home * 0.4) + Math.sin(s * Math.PI) * 0.6,
      rot: facing * (8 - home * 12),
      anim: "sit" as const,
    };
  }
  const s = smoothstep((u - 0.7) / 0.3);
  return {
    x: fromX,
    lift: 1.8 * 0.6 * (1 - s),
    rot: facing * -4 * (1 - s),
    anim: "sit" as const,
  };
}

export function stepTrick(trick: PhoenixTrick, dt: number, flags?: TrickFlags): PhoenixTrick {
  if (!trick || trick.phase === "done") return trick;
  if (shouldAbort(flags) && trick.kind !== "lift" && trick.kind !== "return") {
    return { ...trick, phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true };
  }
  const next: PhoenixTrick = { ...trick, t: trick.t + Math.max(0, dt) };
  if (next.kind === "cinder") {
    if (next.t < CINDER_HOLD) {
      const pose = cinderPose(next.t);
      next.phase = "hold";
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = "sit";
      return next;
    }
    if (next.t < CINDER_HOLD + RELEASE_S) {
      const pose = releasePose(next.t - CINDER_HOLD);
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
  if (next.kind === "blaze") {
    const pose = blazePose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "shed") {
    const pose = shedPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "lift") {
    const pose = liftPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else {
    const pose = returnPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
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
