/** Echo ground tricks while idle. House budgie — preen / bobble / mimic / sidle / dangle personality. Feed-happy thank-yous sit after eat. Card-open freeze and window-play do not swallow a thank-you. Sleep, hide, and leave still win. Same map as desktop `budgie-tricks.js`. Not a Rui, cat, dog, rabbit, hamster, guinea pig, turtle, goldfish, or dragon move clone. Window-play PERCH is unchanged — this module never names a trick `perch`. Cat already owns chirp as thank-you — whistle/trill/ruffle are Echo's. Turtle already owns bob as thank-you — bobble is the head-bob display. Rabbit already owns groom — preen is Melopsittacus feather work. Avoids soak/tuck/crane/plod/paddle/potato/loaf/nest/bow/dig/flop/zoom/popcorn/hay/rumble/zig/scurry/drift/gulp/flare/glint/dart/circle/loop name collisions with prior guests. */

export const TRICK_KEY = "budgie";
export const TRICKS = ["preen", "bobble", "mimic", "sidle", "dangle"] as const;
export const HAPPY = ["whistle", "trill", "ruffle"] as const;
export type BudgieTrickKind = (typeof TRICKS)[number];
export type BudgieHappyKind = (typeof HAPPY)[number];
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

export type BudgieTrick = {
  kind: BudgieTrickKind;
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

export type BudgieHappy = {
  kind: BudgieHappyKind;
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

export const HAPPY_DUR: Record<BudgieHappyKind, number> = {
  whistle: 1.22,
  trill: 1.18,
  ruffle: 1.08,
};

/** Preen hold — Echo works one feather on the lamp-shade thought. Not window-play perch. Not a rabbit groom. Not a cat wash. */
export const PREEN_HOLD = 10;
export const RELEASE_S = 0.55;

export const DUR: Record<BudgieTrickKind, number> = {
  preen: PREEN_HOLD + RELEASE_S,
  bobble: 1.32,
  mimic: 1.55,
  sidle: 1.2,
  dangle: 1.15,
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

export function nextTrickWait(justFinished: boolean, rand?: number, kind?: BudgieTrickKind) {
  const roll = rand == null ? Math.random() : rand;
  if (kind === "preen") return 40 + roll * 20;
  if (kind === "dangle") return 16 + roll * 10;
  if (kind === "mimic") return 12 + roll * 9;
  return justFinished ? 10 + roll * 8 : 5 + roll * 6;
}

export function pickTrick(rand?: number, musicOn = false, lastKind?: BudgieTrickKind | null): BudgieTrickKind {
  if (musicOn) return "mimic";
  const roll = rand == null ? Math.random() : rand;
  if (lastKind === "preen") {
    if (roll < 0.26) return "bobble";
    if (roll < 0.48) return "mimic";
    if (roll < 0.72) return "sidle";
    return "dangle";
  }
  if (lastKind === "dangle") {
    if (roll < 0.34) return "preen";
    if (roll < 0.54) return "bobble";
    if (roll < 0.76) return "mimic";
    return "sidle";
  }
  if (lastKind === "mimic") {
    if (roll < 0.22) return "preen";
    if (roll < 0.42) return "bobble";
    if (roll < 0.66) return "sidle";
    return "dangle";
  }
  if (roll < 0.22) return "preen";
  if (roll < 0.4) return "bobble";
  if (roll < 0.6) return "mimic";
  if (roll < 0.8) return "sidle";
  return "dangle";
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
  return key === TRICK_KEY || key === "echo";
}

export function startThankYou(
  key: string | undefined,
  lastKind: BudgieHappyKind | null | undefined,
  x: number,
  facing: 1 | -1,
  flags?: TrickFlags,
) {
  if (!wantsThankYou(key)) return null;
  if (!happyCanStart(flags || { cmd: "idle" })) return null;
  const pick = pickHappy(lastKind);
  return { happy: beginHappy(pick, x, facing), kind: pick };
}

export function pickHappy(lastKind?: BudgieHappyKind | null, rand?: number): BudgieHappyKind {
  const pool = HAPPY.filter((k) => k !== lastKind);
  const list = pool.length ? pool : [...HAPPY];
  const roll = rand == null ? Math.random() : rand;
  return list[Math.floor(roll * list.length)] ?? list[0]!;
}

export function beginHappy(kind: BudgieHappyKind, x: number, facing: 1 | -1 = 1): BudgieHappy {
  const name: BudgieHappyKind = HAPPY.includes(kind) ? kind : "whistle";
  return {
    kind: name,
    happy: true,
    phase: "go",
    t: 0,
    x,
    lift: 0,
    rot: 0,
    anim: name === "whistle" ? "talk" : name === "trill" ? "talk" : "play",
    facing,
    fromX: x,
  };
}

export function whistlePose(t: number) {
  const u = Math.max(0, Math.min(1, t / HAPPY_DUR.whistle));
  if (u < 0.18) {
    const s = u / 0.18;
    return { lift: s * 3.2, rot: -s * 5, dx: 0, anim: "talk" as const };
  }
  if (u < 0.82) {
    return {
      lift: 3.2 + Math.abs(Math.sin(t * 9)) * 1.8,
      rot: -5 + Math.sin(t * 6) * 4,
      dx: 0,
      anim: "talk" as const,
    };
  }
  const s = (u - 0.82) / 0.18;
  return { lift: 3.2 * (1 - s), rot: -5 * (1 - s), dx: 0, anim: "sit" as const };
}

export function trillPose(t: number) {
  const u = Math.max(0, Math.min(1, t / HAPPY_DUR.trill));
  if (u < 0.88) {
    return {
      lift: Math.abs(Math.sin(t * 14)) * 2.4,
      rot: Math.sin(t * 18) * 9,
      dx: Math.sin(t * 10) * 1.2,
      anim: "talk" as const,
    };
  }
  return { lift: 0, rot: Math.sin(((u - 0.88) / 0.12) * Math.PI) * 3, dx: 0, anim: "idle" as const };
}

export function rufflePose(t: number) {
  const u = Math.max(0, Math.min(1, t / HAPPY_DUR.ruffle));
  return {
    lift: Math.sin(u * Math.PI) * 3.5,
    rot: Math.sin(u * Math.PI * 4) * 12,
    dx: Math.sin(u * Math.PI * 2) * 2,
    anim: "play" as const,
  };
}

export function stepHappy(happy: BudgieHappy, dt: number, flags?: TrickFlags): BudgieHappy {
  if (!happy || happy.phase === "done") return happy;
  if (happyShouldAbort(flags)) {
    return { ...happy, phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true };
  }
  const next: BudgieHappy = { ...happy, t: happy.t + Math.max(0, dt) };
  const hold = HAPPY_DUR[next.kind];
  if (next.kind === "whistle") {
    const pose = whistlePose(next.t);
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "trill") {
    const pose = trillPose(next.t);
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else {
    const pose = rufflePose(next.t);
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  }
  if (next.t >= hold) return { ...next, phase: "done", lift: 0, rot: 0, anim: "idle" };
  return next;
}

/** Echo has no Rui-style sleep-frame hold. */
export function sleepHoldFrame(_key: string | undefined, _frameCount?: number) {
  return null;
}

export function beginTrick(kind: BudgieTrickKind, x: number, facing: 1 | -1 = 1): BudgieTrick {
  const anim: TrickAnim =
    kind === "preen" || kind === "bobble"
      ? "sit"
      : kind === "mimic"
        ? "talk"
        : kind === "sidle"
          ? "walk"
          : kind === "dangle"
            ? "play"
            : "sit";
  return {
    kind,
    phase: kind === "preen" ? "hold" : "go",
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

/** Preen — Melopsittacus feather work. Not window-play perch. Not a rabbit groom. Not a cat wash. */
export function preenPose(t: number) {
  return {
    lift: 1.4 + Math.sin(t * 2.1) * 0.7,
    rot: Math.sin(t * 1.8) * 8 + Math.sin(t * 3.4) * 3,
  };
}

/** Soft un-preen — feathers settle. */
export function releasePose(t: number) {
  const u = Math.max(0, Math.min(1, t / RELEASE_S));
  return { lift: 1.4 * (1 - Math.sin(u * Math.PI * 0.5)), rot: 8 * (1 - u) };
}

/** Bobble — head-bob invitation/display. Not turtle bob thank-you. Ethogram chatty, ground-side. */
export function bobblePose(t: number) {
  const u = Math.max(0, Math.min(1, t / DUR.bobble));
  if (u < 0.15) {
    const s = smoothstep(u / 0.15);
    return { lift: s * 2, rot: -s * 4, dx: 0, anim: "sit" as const };
  }
  if (u < 0.85) {
    return {
      lift: 2 + Math.abs(Math.sin(t * 11)) * 3.2,
      rot: -4 + Math.sin(t * 11) * 6,
      dx: 0,
      anim: "talk" as const,
    };
  }
  const s = smoothstep((u - 0.85) / 0.15);
  return { lift: 2 * (1 - s), rot: -4 * (1 - s), dx: 0, anim: "sit" as const };
}

/** Mimic — repeats the room kinder. Echo's chatty core. Not Relay chatter thank-you. Not cat chirp. */
export function mimicPose(t: number) {
  const u = Math.max(0, Math.min(1, t / DUR.mimic));
  if (u < 0.12) {
    const s = smoothstep(u / 0.12);
    return { lift: s * 3.5, rot: s * 5, dx: 0, anim: "talk" as const };
  }
  if (u < 0.88) {
    return {
      lift: 3.5 + Math.abs(Math.sin(t * 8)) * 2,
      rot: 5 + Math.sin(t * 10) * 7,
      dx: Math.sin(t * 5) * 1.5,
      anim: "talk" as const,
    };
  }
  const s = smoothstep((u - 0.88) / 0.12);
  return { lift: 3.5 * (1 - s), rot: 5 * (1 - s), dx: 0, anim: "sit" as const };
}

/** Sidle — sideways steps along an air-perch line. Not Rui shuffle. Not a hamster scurry. Not window-play perch. */
export function sidlePose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.sidle));
  if (u < 0.1) {
    const s = smoothstep(u / 0.1);
    return { x: fromX, lift: s * 1.5, rot: s * 6 * facing, anim: "sit" as const };
  }
  if (u < 0.85) {
    const s = (u - 0.1) / 0.75;
    const step = Math.sin(s * Math.PI * 3);
    return {
      x: fromX + facing * 14 * smoothstep(s),
      lift: 1.5 + Math.abs(step) * 2.2,
      rot: facing * (6 + step * 8),
      anim: "walk" as const,
    };
  }
  const s = smoothstep((u - 0.85) / 0.15);
  return {
    x: fromX + facing * 14,
    lift: 1.5 * (1 - s),
    rot: facing * 4 * (1 - s),
    anim: "sit" as const,
  };
}

/** Dangle — brief upside-down play. Budgies hang from toys. Not a dog zoom. Not window-play perch. */
export function danglePose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.dangle));
  if (u < 0.18) {
    const s = smoothstep(u / 0.18);
    return { x: fromX, lift: s * 8, rot: -s * 25, anim: "play" as const };
  }
  if (u < 0.72) {
    return {
      x: fromX + facing * Math.sin(t * 6) * 2,
      lift: 8 + Math.sin(t * 5) * 1.5,
      rot: -140 + Math.sin(t * 7) * 12,
      anim: "play" as const,
    };
  }
  const s = smoothstep((u - 0.72) / 0.28);
  return {
    x: fromX,
    lift: 8 * (1 - s),
    rot: -140 * (1 - s),
    anim: "sit" as const,
  };
}

export function stepTrick(trick: BudgieTrick, dt: number, flags?: TrickFlags): BudgieTrick {
  if (!trick || trick.phase === "done") return trick;
  if (shouldAbort(flags) && trick.kind !== "dangle" && trick.kind !== "sidle") {
    return { ...trick, phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true };
  }
  const next: BudgieTrick = { ...trick, t: trick.t + Math.max(0, dt) };
  if (next.kind === "preen") {
    if (next.t < PREEN_HOLD) {
      const pose = preenPose(next.t);
      next.phase = "hold";
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = "sit";
      return next;
    }
    if (next.t < PREEN_HOLD + RELEASE_S) {
      const pose = releasePose(next.t - PREEN_HOLD);
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
  if (next.kind === "bobble") {
    const pose = bobblePose(next.t);
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "mimic") {
    const pose = mimicPose(next.t);
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "sidle") {
    const pose = sidlePose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else {
    const pose = danglePose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
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