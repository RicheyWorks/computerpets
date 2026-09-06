/** Quill ground tricks while idle. House parrot — quote / strut / fan / crack / flash personality. Feed-happy thank-yous sit after eat. Card-open freeze and window-play do not swallow a thank-you. Sleep, hide, and leave still win. Same map as desktop `parrot-tricks.js`. Not a Rui, cat, dog, rabbit, hamster, guinea pig, turtle, goldfish, budgie, fox, penguin, or dragon move clone. Window-play HOOK is unchanged — this module never names a trick `hook`. Budgie already owns preen/mimic/bobble/sidle/dangle and whistle/trill/ruffle. Penguin already owns beak as thank-you. Pip already owns bow. Avoids soak/tuck/crane/plod/paddle/potato/loaf/nest/bow/dig/flop/zoom/popcorn/hay/rumble/zig/scurry/drift/gulp/flare/glint/dart/circle/loop/preen/bobble/mimic/sidle/dangle/perch/den/mouser/stalk/trot/prance/huddle/toboggan/waddle/porpoise/trumpet/hook name collisions with prior guests. */

export const TRICK_KEY = "parrot";
export const TRICKS = ["quote", "strut", "fan", "crack", "flash"] as const;
export const HAPPY = ["squawk", "bravo", "scissor"] as const;
export type ParrotTrickKind = (typeof TRICKS)[number];
export type ParrotHappyKind = (typeof HAPPY)[number];
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

export type ParrotTrick = {
  kind: ParrotTrickKind;
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

export type ParrotHappy = {
  kind: ParrotHappyKind;
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

export const HAPPY_DUR: Record<ParrotHappyKind, number> = {
  squawk: 1.24,
  bravo: 1.16,
  scissor: 1.1,
};

/** Quote hold — Quill delivers from the chest on the hat-stand tile. Not a budgie mimic. Not a penguin trumpet. Not window-play hook. */
export const QUOTE_HOLD = 10;
export const RELEASE_S = 0.55;

export const DUR: Record<ParrotTrickKind, number> = {
  quote: QUOTE_HOLD + RELEASE_S,
  strut: 1.38,
  fan: 1.28,
  crack: 1.22,
  flash: 1.18,
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

export function nextTrickWait(justFinished: boolean, rand?: number, kind?: ParrotTrickKind) {
  const roll = rand == null ? Math.random() : rand;
  if (kind === "quote") return 40 + roll * 20;
  if (kind === "strut") return 14 + roll * 10;
  if (kind === "flash") return 12 + roll * 9;
  return justFinished ? 10 + roll * 8 : 5 + roll * 6;
}

export function pickTrick(rand?: number, musicOn = false, lastKind?: ParrotTrickKind | null): ParrotTrickKind {
  if (musicOn) return "quote";
  const roll = rand == null ? Math.random() : rand;
  if (lastKind === "quote") {
    if (roll < 0.26) return "strut";
    if (roll < 0.48) return "fan";
    if (roll < 0.72) return "crack";
    return "flash";
  }
  if (lastKind === "strut") {
    if (roll < 0.34) return "quote";
    if (roll < 0.54) return "fan";
    if (roll < 0.76) return "crack";
    return "flash";
  }
  if (lastKind === "flash") {
    if (roll < 0.22) return "quote";
    if (roll < 0.42) return "strut";
    if (roll < 0.66) return "fan";
    return "crack";
  }
  if (roll < 0.22) return "quote";
  if (roll < 0.4) return "strut";
  if (roll < 0.6) return "fan";
  if (roll < 0.8) return "crack";
  return "flash";
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
  return key === TRICK_KEY || key === "quill";
}

export function startThankYou(
  key: string | undefined,
  lastKind: ParrotHappyKind | null | undefined,
  x: number,
  facing: 1 | -1,
  flags?: TrickFlags,
) {
  if (!wantsThankYou(key)) return null;
  if (!happyCanStart(flags || { cmd: "idle" })) return null;
  const pick = pickHappy(lastKind);
  return { happy: beginHappy(pick, x, facing), kind: pick };
}

export function pickHappy(lastKind?: ParrotHappyKind | null, rand?: number): ParrotHappyKind {
  const pool = HAPPY.filter((k) => k !== lastKind);
  const list = pool.length ? pool : [...HAPPY];
  const roll = rand == null ? Math.random() : rand;
  return list[Math.floor(roll * list.length)] ?? list[0]!;
}

export function beginHappy(kind: ParrotHappyKind, x: number, facing: 1 | -1 = 1): ParrotHappy {
  const name: ParrotHappyKind = HAPPY.includes(kind) ? kind : "squawk";
  return {
    kind: name,
    happy: true,
    phase: "go",
    t: 0,
    x,
    lift: 0,
    rot: 0,
    anim: name === "squawk" ? "talk" : name === "bravo" ? "play" : "sit",
    facing,
    fromX: x,
  };
}

export function squawkPose(t: number) {
  const u = Math.max(0, Math.min(1, t / HAPPY_DUR.squawk));
  if (u < 0.14) {
    const s = u / 0.14;
    return { lift: s * 4.2, rot: -s * 10, dx: 0, anim: "talk" as const };
  }
  if (u < 0.8) {
    return {
      lift: 4.2 + Math.abs(Math.sin(t * 11)) * 2.4,
      rot: -10 + Math.sin(t * 13) * 7,
      dx: 0,
      anim: "talk" as const,
    };
  }
  const s = (u - 0.8) / 0.2;
  return { lift: 4.2 * (1 - s), rot: -10 * (1 - s), dx: 0, anim: "sit" as const };
}

export function bravoPose(t: number) {
  const u = Math.max(0, Math.min(1, t / HAPPY_DUR.bravo));
  if (u < 0.88) {
    return {
      lift: Math.abs(Math.sin(t * 13)) * 4.5,
      rot: Math.sin(t * 15) * 14,
      dx: Math.sin(t * 9) * 1.4,
      anim: "play" as const,
    };
  }
  return { lift: 0, rot: Math.sin(((u - 0.88) / 0.12) * Math.PI) * 3, dx: 0, anim: "idle" as const };
}

export function scissorPose(t: number) {
  const u = Math.max(0, Math.min(1, t / HAPPY_DUR.scissor));
  return {
    lift: Math.sin(u * Math.PI) * 1.4,
    rot: Math.sin(u * Math.PI * 5) * 8,
    dx: Math.sin(u * Math.PI * 2) * 1.6,
    anim: "sit" as const,
  };
}

export function stepHappy(happy: ParrotHappy, dt: number, flags?: TrickFlags): ParrotHappy {
  if (!happy || happy.phase === "done") return happy;
  if (happyShouldAbort(flags)) {
    return { ...happy, phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true };
  }
  const next: ParrotHappy = { ...happy, t: happy.t + Math.max(0, dt) };
  const hold = HAPPY_DUR[next.kind];
  if (next.kind === "squawk") {
    const pose = squawkPose(next.t);
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "bravo") {
    const pose = bravoPose(next.t);
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else {
    const pose = scissorPose(next.t);
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  }
  if (next.t >= hold) return { ...next, phase: "done", lift: 0, rot: 0, anim: "idle" };
  return next;
}

/** Quill has no Rui-style sleep-frame hold. */
export function sleepHoldFrame(_key: string | undefined, _frameCount?: number) {
  return null;
}

export function beginTrick(kind: ParrotTrickKind, x: number, facing: 1 | -1 = 1): ParrotTrick {
  const anim: TrickAnim =
    kind === "quote"
      ? "talk"
      : kind === "strut"
        ? "walk"
        : kind === "fan"
          ? "play"
          : kind === "crack"
            ? "sit"
            : kind === "flash"
              ? "play"
              : "sit";
  return {
    kind,
    phase: kind === "quote" ? "hold" : "go",
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

/** Quote — theatrical chest delivery. Not a budgie mimic. Not a penguin trumpet. */
export function quotePose(t: number) {
  return {
    lift: 2.2 + Math.sin(t * 1.8) * 0.7,
    rot: -14 + Math.sin(t * 2.1) * 4 + Math.sin(t * 5.2) * 2.5,
  };
}

/** Soft un-quote — bill finds the room again after the commit message. */
export function releasePose(t: number) {
  const u = Math.max(0, Math.min(1, t / RELEASE_S));
  return { lift: 2.2 * (1 - Math.sin(u * Math.PI * 0.5)), rot: -14 * (1 - u) };
}

/** Strut — macaw swagger across the tile. Not a fox trot. Not a budgie sidle. Not a penguin waddle. */
export function strutPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.strut));
  if (u < 0.1) {
    const s = smoothstep(u / 0.1);
    return { x: fromX, lift: s * 1.8, rot: s * 10 * facing, anim: "sit" as const };
  }
  if (u < 0.88) {
    const s = (u - 0.1) / 0.78;
    const step = Math.sin(s * Math.PI * 4.5);
    return {
      x: fromX + facing * 22 * smoothstep(s),
      lift: 1.8 + Math.abs(step) * 3.2,
      rot: facing * (10 + step * 12),
      anim: "walk" as const,
    };
  }
  const s = smoothstep((u - 0.88) / 0.12);
  return {
    x: fromX + facing * 22,
    lift: 1.8 * (1 - s),
    rot: facing * 5 * (1 - s),
    anim: "sit" as const,
  };
}

/** Fan — wing and tail fan display. Not a goldfish flare. Not a fox prance. Not window-play hook. */
export function fanPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.fan));
  if (u < 0.16) {
    const s = smoothstep(u / 0.16);
    return { x: fromX, lift: s * 3.5, rot: -s * 6, anim: "sit" as const };
  }
  if (u < 0.78) {
    const s = (u - 0.16) / 0.62;
    return {
      x: fromX + facing * Math.sin(s * Math.PI) * 2,
      lift: 3.5 + Math.sin(s * Math.PI) * 4.5,
      rot: -6 + Math.sin(s * Math.PI * 2) * 16,
      anim: "play" as const,
    };
  }
  const s = smoothstep((u - 0.78) / 0.22);
  return {
    x: fromX,
    lift: 3.5 * (1 - s),
    rot: 2 * (1 - s),
    anim: "sit" as const,
  };
}

/** Crack — hooked bill opens a nut. Not Peck beak thank-you. Not a turtle paddle. Ethogram macaw true. */
export function crackPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.crack));
  if (u < 0.12) {
    const s = smoothstep(u / 0.12);
    return { x: fromX, lift: -s * 1.5, rot: s * 8 * facing, anim: "sit" as const };
  }
  if (u < 0.86) {
    const s = (u - 0.12) / 0.74;
    const bite = Math.sin(s * Math.PI * 6);
    return {
      x: fromX + facing * Math.abs(bite) * 1.8,
      lift: -1.5 + Math.abs(bite) * 2.2,
      rot: facing * (8 + bite * 10),
      anim: "sit" as const,
    };
  }
  const s = smoothstep((u - 0.86) / 0.14);
  return {
    x: fromX,
    lift: -1.5 * (1 - s),
    rot: facing * 4 * (1 - s),
    anim: "sit" as const,
  };
}

/** Flash — sudden wing flash display. Not a Rui wave. Not a budgie dangle. Not window-play hook. */
export function flashPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.flash));
  if (u < 0.14) {
    const s = smoothstep(u / 0.14);
    return {
      x: fromX,
      lift: s * 7,
      rot: -s * 14,
      anim: "play" as const,
    };
  }
  if (u < 0.72) {
    return {
      x: fromX + facing * Math.sin(t * 8) * 1.5,
      lift: 7 + Math.abs(Math.sin(t * 10)) * 2,
      rot: -14 + Math.sin(t * 9) * 10,
      anim: "play" as const,
    };
  }
  const s = smoothstep((u - 0.72) / 0.28);
  return {
    x: fromX,
    lift: 7 * (1 - s),
    rot: -14 * (1 - s),
    anim: "sit" as const,
  };
}

export function stepTrick(trick: ParrotTrick, dt: number, flags?: TrickFlags): ParrotTrick {
  if (!trick || trick.phase === "done") return trick;
  if (shouldAbort(flags) && trick.kind !== "strut" && trick.kind !== "flash") {
    return { ...trick, phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true };
  }
  const next: ParrotTrick = { ...trick, t: trick.t + Math.max(0, dt) };
  if (next.kind === "quote") {
    if (next.t < QUOTE_HOLD) {
      const pose = quotePose(next.t);
      next.phase = "hold";
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = "talk";
      return next;
    }
    if (next.t < QUOTE_HOLD + RELEASE_S) {
      const pose = releasePose(next.t - QUOTE_HOLD);
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
  if (next.kind === "strut") {
    const pose = strutPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "fan") {
    const pose = fanPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "crack") {
    const pose = crackPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else {
    const pose = flashPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
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