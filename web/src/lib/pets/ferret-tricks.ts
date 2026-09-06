/** Wick ground tricks while idle. House ferret — tube / romp / steal / puff / noodle personality. Feed-happy thank-yous sit after eat. Card-open freeze and window-play do not swallow a thank-you. Sleep, hide, and leave still win. Same map as desktop `ferret-tricks.js`. Not a Rui, cat, dog, rabbit, hamster, guinea pig, turtle, goldfish, budgie, fox, penguin, parrot, or dragon move clone. Window-play THREAD is unchanged — this module never names a trick `thread`. Hamster already owns scurry/nest/cheek/pocket/reel and chitter. Fox already owns den/mouser/stalk/trot/prance. Dog already owns zoom/bow. Rabbit already owns dig/flop/binky. Cat already owns pounce. Rui already owns dance/bounce. Avoids soak/tuck/crane/plod/paddle/potato/loaf/nest/bow/dig/flop/zoom/popcorn/hay/rumble/zig/scurry/drift/gulp/flare/glint/dart/circle/loop/preen/bobble/mimic/sidle/dangle/perch/den/mouser/stalk/trot/prance/huddle/toboggan/waddle/porpoise/trumpet/quote/strut/fan/crack/flash/thread name collisions with prior guests. */

export const TRICK_KEY = "ferret";
export const TRICKS = ["tube", "romp", "steal", "puff", "noodle"] as const;
export const HAPPY = ["dook", "kiss", "chuckle"] as const;
export type FerretTrickKind = (typeof TRICKS)[number];
export type FerretHappyKind = (typeof HAPPY)[number];
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

export type FerretTrick = {
  kind: FerretTrickKind;
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

export type FerretHappy = {
  kind: FerretHappyKind;
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

export const HAPPY_DUR: Record<FerretHappyKind, number> = {
  dook: 1.22,
  kiss: 1.14,
  chuckle: 1.18,
};

/** Tube hold — Wick tunnels into an imaginary sock-tube on the desk. Not window-play thread. Not a fox den. Not a hamster nest. Not a cat loaf. */
export const TUBE_HOLD = 10;
export const RELEASE_S = 0.55;

export const DUR: Record<FerretTrickKind, number> = {
  tube: TUBE_HOLD + RELEASE_S,
  romp: 1.36,
  steal: 1.28,
  puff: 1.2,
  noodle: 1.24,
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

export function nextTrickWait(justFinished: boolean, rand?: number, kind?: FerretTrickKind) {
  const roll = rand == null ? Math.random() : rand;
  if (kind === "tube") return 40 + roll * 20;
  if (kind === "romp") return 14 + roll * 10;
  if (kind === "steal") return 12 + roll * 9;
  return justFinished ? 10 + roll * 8 : 5 + roll * 6;
}

export function pickTrick(rand?: number, musicOn = false, lastKind?: FerretTrickKind | null): FerretTrickKind {
  if (musicOn) return "tube";
  const roll = rand == null ? Math.random() : rand;
  if (lastKind === "tube") {
    if (roll < 0.28) return "romp";
    if (roll < 0.5) return "steal";
    if (roll < 0.72) return "puff";
    return "noodle";
  }
  if (lastKind === "romp") {
    if (roll < 0.32) return "tube";
    if (roll < 0.52) return "steal";
    if (roll < 0.74) return "puff";
    return "noodle";
  }
  if (lastKind === "steal") {
    if (roll < 0.24) return "tube";
    if (roll < 0.44) return "romp";
    if (roll < 0.68) return "puff";
    return "noodle";
  }
  if (roll < 0.22) return "tube";
  if (roll < 0.4) return "romp";
  if (roll < 0.6) return "steal";
  if (roll < 0.8) return "puff";
  return "noodle";
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
  return key === TRICK_KEY || key === "wick";
}

export function startThankYou(
  key: string | undefined,
  lastKind: FerretHappyKind | null | undefined,
  x: number,
  facing: 1 | -1,
  flags?: TrickFlags,
) {
  if (!wantsThankYou(key)) return null;
  if (!happyCanStart(flags || { cmd: "idle" })) return null;
  const pick = pickHappy(lastKind);
  return { happy: beginHappy(pick, x, facing), kind: pick };
}

export function pickHappy(lastKind?: FerretHappyKind | null, rand?: number): FerretHappyKind {
  const pool = HAPPY.filter((k) => k !== lastKind);
  const list = pool.length ? pool : [...HAPPY];
  const roll = rand == null ? Math.random() : rand;
  return list[Math.floor(roll * list.length)] ?? list[0]!;
}

export function beginHappy(kind: FerretHappyKind, x: number, facing: 1 | -1 = 1): FerretHappy {
  const name: FerretHappyKind = HAPPY.includes(kind) ? kind : "dook";
  return {
    kind: name,
    happy: true,
    phase: "go",
    t: 0,
    x,
    lift: 0,
    rot: 0,
    anim: name === "dook" ? "talk" : name === "kiss" ? "sit" : "play",
    facing,
    fromX: x,
  };
}

export function dookPose(t: number) {
  const u = Math.max(0, Math.min(1, t / HAPPY_DUR.dook));
  if (u < 0.14) {
    const s = u / 0.14;
    return { lift: s * 3.8, rot: -s * 9, dx: 0, anim: "talk" as const };
  }
  if (u < 0.82) {
    return {
      lift: 3.8 + Math.abs(Math.sin(t * 12)) * 2.6,
      rot: -9 + Math.sin(t * 14) * 8,
      dx: Math.sin(t * 10) * 1.2,
      anim: "talk" as const,
    };
  }
  const s = (u - 0.82) / 0.18;
  return { lift: 3.8 * (1 - s), rot: -9 * (1 - s), dx: 0, anim: "sit" as const };
}

export function kissPose(t: number) {
  const u = Math.max(0, Math.min(1, t / HAPPY_DUR.kiss));
  if (u < 0.86) {
    return {
      lift: Math.sin(u * Math.PI) * 2.2,
      rot: Math.sin(u * Math.PI * 4) * 7,
      dx: Math.sin(u * Math.PI * 2) * 1.8,
      anim: "sit" as const,
    };
  }
  return { lift: 0, rot: Math.sin(((u - 0.86) / 0.14) * Math.PI) * 2, dx: 0, anim: "idle" as const };
}

export function chucklePose(t: number) {
  const u = Math.max(0, Math.min(1, t / HAPPY_DUR.chuckle));
  return {
    lift: Math.abs(Math.sin(t * 11)) * 3.4,
    rot: Math.sin(t * 13) * 11,
    dx: Math.sin(t * 8) * 1.5,
    anim: "play" as const,
  };
}

export function stepHappy(happy: FerretHappy, dt: number, flags?: TrickFlags): FerretHappy {
  if (!happy || happy.phase === "done") return happy;
  if (happyShouldAbort(flags)) {
    return { ...happy, phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true };
  }
  const next: FerretHappy = { ...happy, t: happy.t + Math.max(0, dt) };
  const hold = HAPPY_DUR[next.kind];
  if (next.kind === "dook") {
    const pose = dookPose(next.t);
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "kiss") {
    const pose = kissPose(next.t);
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else {
    const pose = chucklePose(next.t);
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  }
  if (next.t >= hold) return { ...next, phase: "done", lift: 0, rot: 0, anim: "idle" };
  return next;
}

/** Wick has no Rui-style sleep-frame hold. */
export function sleepHoldFrame(_key: string | undefined, _frameCount?: number) {
  return null;
}

export function beginTrick(kind: FerretTrickKind, x: number, facing: 1 | -1 = 1): FerretTrick {
  const anim: TrickAnim =
    kind === "tube"
      ? "sit"
      : kind === "romp"
        ? "play"
        : kind === "steal"
          ? "walk"
          : kind === "puff"
            ? "sit"
            : kind === "noodle"
              ? "play"
              : "sit";
  return {
    kind,
    phase: kind === "tube" ? "hold" : "go",
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

/** Tube — sock-tunnel rest. Not window-play thread. Not a fox den. Not a hamster nest. */
export function tubePose(t: number) {
  return {
    lift: 0.6 + Math.sin(t * 1.5) * 0.4,
    rot: 18 + Math.sin(t * 1.7) * 3 + Math.sin(t * 3.1) * 2,
  };
}

/** Soft un-tube — nose tips out of the sock again. */
export function releasePose(t: number) {
  const u = Math.max(0, Math.min(1, t / RELEASE_S));
  return { lift: 0.6 * (1 - Math.sin(u * Math.PI * 0.5)), rot: 18 * (1 - u) };
}

/** Romp — weasel war dance. Back-arched sideways hops. Not a Rui dance. Not a rabbit binky. Not a guinea-pig popcorn. Not a fox prance. */
export function rompPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.romp));
  if (u < 0.1) {
    const s = smoothstep(u / 0.1);
    return { x: fromX, lift: s * 3, rot: -s * 16, anim: "sit" as const };
  }
  if (u < 0.88) {
    const s = (u - 0.1) / 0.78;
    const hop = Math.sin(s * Math.PI * 5.5);
    const side = Math.sin(s * Math.PI * 3);
    return {
      x: fromX + facing * (14 * smoothstep(s) + side * 5),
      lift: 3 + Math.abs(hop) * 8,
      rot: -16 + hop * 22 + side * 10,
      anim: "play" as const,
    };
  }
  const s = smoothstep((u - 0.88) / 0.12);
  return {
    x: fromX + facing * 14,
    lift: 3 * (1 - s),
    rot: -8 * (1 - s),
    anim: "sit" as const,
  };
}

/** Steal — sneaky theft dash with a prize in the mouth. Not a dog sniff. Not a hamster pocket. Not a fox mouser. Ethogram ferret true. */
export function stealPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.steal));
  if (u < 0.12) {
    const s = smoothstep(u / 0.12);
    return { x: fromX, lift: -s * 1.4, rot: s * 6 * facing, anim: "sit" as const };
  }
  if (u < 0.5) {
    const s = smoothstep((u - 0.12) / 0.38);
    return {
      x: fromX + facing * 10 * s,
      lift: -1.4 + Math.abs(Math.sin(s * Math.PI * 3)) * 2,
      rot: facing * (6 + Math.sin(s * Math.PI * 4) * 5),
      anim: "walk" as const,
    };
  }
  if (u < 0.88) {
    const s = (u - 0.5) / 0.38;
    const dash = Math.sin(s * Math.PI * 3);
    return {
      x: fromX + facing * (10 + 16 * smoothstep(s)),
      lift: 1.5 + Math.abs(dash) * 4,
      rot: facing * (4 + dash * 12),
      anim: "walk" as const,
    };
  }
  const s = smoothstep((u - 0.88) / 0.12);
  return {
    x: fromX + facing * 26,
    lift: 1.5 * (1 - s),
    rot: facing * 3 * (1 - s),
    anim: "sit" as const,
  };
}

/** Puff — bottlebrush tail alert. Not a dog wag. Not a cat stretch. Not window-play thread. */
export function puffPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.puff));
  if (u < 0.16) {
    const s = smoothstep(u / 0.16);
    return { x: fromX, lift: s * 2.5, rot: s * 12 * facing, anim: "sit" as const };
  }
  if (u < 0.78) {
    const s = (u - 0.16) / 0.62;
    return {
      x: fromX + facing * Math.sin(s * Math.PI) * 1.5,
      lift: 2.5 + Math.sin(s * Math.PI) * 2.2,
      rot: facing * (12 + Math.sin(s * Math.PI * 3) * 10),
      anim: "sit" as const,
    };
  }
  const s = smoothstep((u - 0.78) / 0.22);
  return {
    x: fromX,
    lift: 2.5 * (1 - s),
    rot: facing * 6 * (1 - s),
    anim: "sit" as const,
  };
}

/** Noodle — sinuous whole-body wriggle. Not a turtle paddle. Not a goldfish dart. Not a snake guest. Ethogram Mustela true. */
export function noodlePose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.noodle));
  if (u < 0.12) {
    const s = smoothstep(u / 0.12);
    return {
      x: fromX,
      lift: s * 1.5,
      rot: -s * 20,
      anim: "play" as const,
    };
  }
  if (u < 0.86) {
    return {
      x: fromX + facing * Math.sin(t * 7) * 4,
      lift: 1.5 + Math.abs(Math.sin(t * 9)) * 3.5,
      rot: -20 + Math.sin(t * 8) * 28,
      anim: "play" as const,
    };
  }
  const s = smoothstep((u - 0.86) / 0.14);
  return {
    x: fromX,
    lift: 1.5 * (1 - s),
    rot: -20 * (1 - s),
    anim: "sit" as const,
  };
}

export function stepTrick(trick: FerretTrick, dt: number, flags?: TrickFlags): FerretTrick {
  if (!trick || trick.phase === "done") return trick;
  if (shouldAbort(flags) && trick.kind !== "romp" && trick.kind !== "steal") {
    return { ...trick, phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true };
  }
  const next: FerretTrick = { ...trick, t: trick.t + Math.max(0, dt) };
  if (next.kind === "tube") {
    if (next.t < TUBE_HOLD) {
      const pose = tubePose(next.t);
      next.phase = "hold";
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = "sit";
      return next;
    }
    if (next.t < TUBE_HOLD + RELEASE_S) {
      const pose = releasePose(next.t - TUBE_HOLD);
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
  if (next.kind === "romp") {
    const pose = rompPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "steal") {
    const pose = stealPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "puff") {
    const pose = puffPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else {
    const pose = noodlePose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
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
