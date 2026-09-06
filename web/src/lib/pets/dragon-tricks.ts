/** Vesper ground tricks while idle. House dragon — sprawl / guard / smolder / claim / fold personality (wyrm on the mantel; sleeping-dragon desk life). Feed-happy thank-yous sit after eat. Card-open freeze and window-play do not swallow a thank-you. Sleep, hide, and leave still win. Same map as desktop `dragon-tricks.js`. Not a Rui, cat, dog, rabbit, hamster, guinea pig, turtle, goldfish, budgie, fox, penguin, parrot, ferret, hedgehog, chinchilla, axolotl, toucan, iguana, or *Dragon electrical (Relay/Fuse/Ground) move clone. Window-play DRAPE is unchanged — this module never names a trick `drape`. Turtle window-play BASK and Volt COIL stay untouched — never names `bask` or `coil`. Sol already owns sun/dewlap/nod/press/flick and swell/tap/ease. Ground already owns lug/earth/heave/bed. Fuse already owns seat/current/blow/reseat and warm/snap/pulse. Relay already owns click/latch/arc/buzz/switch. Special `hoard` stays the special — never names a trick `hoard`. Avoids drape/bask/coil/hoard/sun/dewlap/nod/press/flick/click/latch/arc/buzz/switch/seat/current/blow/reseat/lug/earth/heave/bed/flatten/soak/tuck/crane/plod/paddle/potato/loaf/nest/bow/dig/flop/zoom/popcorn/hay/rumble/zig/scurry/drift/gulp/flare/glint/dart/circle/loop/preen/bobble/mimic/sidle/dangle/perch/den/mouser/stalk/trot/prance/huddle/toboggan/waddle/porpoise/trumpet/quote/strut/fan/crack/flash/tube/romp/steal/puff/noodle/thread/ball/curl/snuffle/anoint/bristle/root/dust/ash/bound/fluff/chin/sift/gill/amble/mend/smile/plume/float/wall/bloom/toss/bill/hook/roost/berry/juggle/peer/skip/bob/warm/huff name collisions with prior guests. No cry inventing — field-tape skip stays; thank-yous are silent desk motion only. */


export const TRICK_KEY = "dragon";
export const TRICKS = ["sprawl", "guard", "smolder", "claim", "fold"] as const;
export const HAPPY = ["thrum", "glow", "incline"] as const;
export type DragonTrickKind = (typeof TRICKS)[number];
export type DragonHappyKind = (typeof HAPPY)[number];
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

export type DragonTrick = {
  kind: DragonTrickKind;
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

export type DragonHappy = {
  kind: DragonHappyKind;
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

export const HAPPY_DUR: Record<DragonHappyKind, number> = {
  thrum: 1.18,
  glow: 1.22,
  incline: 1.3,
};

/** Sprawl hold — Vesper sprawls on the mantel blotter. Not window-play BASK or FLATTEN. Sleeping-dragon heat-holding. */
export const SPRAWL_HOLD = 10.4;
export const RELEASE_S = 0.64;

export const DUR: Record<DragonTrickKind, number> = {
  sprawl: SPRAWL_HOLD + RELEASE_S,
  guard: 1.38,
  smolder: 1.34,
  claim: 1.4,
  fold: 1.24,
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

export function nextTrickWait(justFinished: boolean, rand?: number, kind?: DragonTrickKind) {
  const roll = rand == null ? Math.random() : rand;
  if (kind === "sprawl") return 42 + roll * 26;
  if (kind === "guard") return 15 + roll * 10;
  if (kind === "smolder") return 14 + roll * 10;
  return justFinished ? 10 + roll * 8 : 5 + roll * 6;
}

export function pickTrick(rand?: number, musicOn = false, lastKind?: DragonTrickKind | null): DragonTrickKind {
  if (musicOn) return "sprawl";
  const roll = rand == null ? Math.random() : rand;
  if (lastKind === "sprawl") {
    if (roll < 0.28) return "guard";
    if (roll < 0.5) return "smolder";
    if (roll < 0.72) return "claim";
    return "fold";
  }
  if (lastKind === "guard") {
    if (roll < 0.3) return "sprawl";
    if (roll < 0.52) return "smolder";
    if (roll < 0.74) return "claim";
    return "fold";
  }
  if (lastKind === "smolder") {
    if (roll < 0.24) return "sprawl";
    if (roll < 0.46) return "guard";
    if (roll < 0.68) return "claim";
    return "fold";
  }
  if (roll < 0.22) return "sprawl";
  if (roll < 0.4) return "guard";
  if (roll < 0.6) return "smolder";
  if (roll < 0.8) return "claim";
  return "fold";
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
  return key === TRICK_KEY || key === "vesper";
}

export function startThankYou(
  key: string | undefined,
  lastKind: DragonHappyKind | null | undefined,
  x: number,
  facing: 1 | -1,
  flags?: TrickFlags,
) {
  if (!wantsThankYou(key)) return null;
  if (!happyCanStart(flags || { cmd: "idle" })) return null;
  const pick = pickHappy(lastKind);
  return { happy: beginHappy(pick, x, facing), kind: pick };
}

export function pickHappy(lastKind?: DragonHappyKind | null, rand?: number): DragonHappyKind {
  const pool = HAPPY.filter((k) => k !== lastKind);
  const list = pool.length ? pool : [...HAPPY];
  const roll = rand == null ? Math.random() : rand;
  return list[Math.floor(roll * list.length)] ?? list[0]!;
}

export function beginHappy(kind: DragonHappyKind, x: number, facing: 1 | -1 = 1): DragonHappy {
  const name: DragonHappyKind = HAPPY.includes(kind) ? kind : "thrum";
  return {
    kind: name,
    happy: true,
    phase: "go",
    t: 0,
    x,
    lift: 0,
    rot: 0,
    anim: name === "thrum" ? "sit" : name === "glow" ? "sit" : "talk",
    facing,
    fromX: x,
  };
}

export function thrumPose(t: number) {
  const u = Math.max(0, Math.min(1, t / HAPPY_DUR.thrum));
  if (u < 0.16) {
    const s = u / 0.16;
    return { lift: s * 1.4, rot: s * 5, dx: 0, anim: "sit" as const };
  }
  if (u < 0.8) {
    return {
      lift: 1.4 + Math.abs(Math.sin(t * 4.2)) * 1.1,
      rot: 5 + Math.sin(t * 3.6) * 3.5,
      dx: 0,
      anim: "sit" as const,
    };
  }
  const s = (u - 0.8) / 0.2;
  return { lift: 1.4 * (1 - s), rot: 5 * (1 - s), dx: 0, anim: "idle" as const };
}

export function glowPose(t: number) {
  const u = Math.max(0, Math.min(1, t / HAPPY_DUR.glow));
  if (u < 0.14) {
    const s = u / 0.14;
    return { lift: s * 1.8, rot: s * 8, dx: 0, anim: "sit" as const };
  }
  if (u < 0.84) {
    return {
      lift: 1.8 + Math.abs(Math.sin(t * 3.8)) * 1.2,
      rot: 8 + Math.sin(t * 3.2) * 6,
      dx: Math.sin(t * 2.4) * 0.3,
      anim: "sit" as const,
    };
  }
  const s = (u - 0.84) / 0.16;
  return { lift: 1.8 * (1 - s), rot: 8 * (1 - s), dx: 0, anim: "sit" as const };
}

export function inclinePose(t: number) {
  return {
    lift: Math.abs(Math.sin(t * 2.6)) * 1.2 + 0.5,
    rot: -8 + Math.sin(t * 2.2) * 6,
    dx: Math.sin(t * 1.8) * 0.35,
    anim: "talk" as const,
  };
}

export function stepHappy(happy: DragonHappy, dt: number, flags?: TrickFlags): DragonHappy {
  if (!happy || happy.phase === "done") return happy;
  if (happyShouldAbort(flags)) {
    return { ...happy, phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true };
  }
  const next: DragonHappy = { ...happy, t: happy.t + Math.max(0, dt) };
  const hold = HAPPY_DUR[next.kind];
  if (next.kind === "thrum") {
    const pose = thrumPose(next.t);
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "glow") {
    const pose = glowPose(next.t);
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else {
    const pose = inclinePose(next.t);
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  }
  if (next.t >= hold) return { ...next, phase: "done", lift: 0, rot: 0, anim: "idle" };
  return next;
}

/** Vesper has no Rui-style sleep-frame hold. */
export function sleepHoldFrame(_key: string | undefined, _frameCount?: number) {
  return null;
}

export function beginTrick(kind: DragonTrickKind, x: number, facing: 1 | -1 = 1): DragonTrick {
  const anim: TrickAnim =
    kind === "sprawl"
      ? "sit"
      : kind === "guard"
        ? "sit"
        : kind === "smolder"
          ? "sit"
          : kind === "claim"
            ? "play"
            : kind === "fold"
              ? "play"
              : "sit";
  return {
    kind,
    phase: kind === "sprawl" ? "hold" : "go",
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

/** Sprawl — sleeping-dragon desk sprawl on the blotter. Heat-holding. Not window-play DRAPE or BASK. Ethogram sit_hold true. */
export function sprawlPose(t: number) {
  return {
    lift: 0.1 + Math.sin(t * 0.9) * 0.35,
    rot: 12 + Math.sin(t * 1.05) * 2.2 + Math.sin(t * 2.1) * 1.4,
  };
}

/** Soft lift — Vesper leaves the mantel sprawl; stays on the desk. Not window-play leave. */
export function releasePose(t: number) {
  const u = Math.max(0, Math.min(1, t / RELEASE_S));
  return { lift: 0.2 * (1 - Math.sin(u * Math.PI * 0.5)), rot: 8 * (1 - u) };
}

/** Guard — watchful province turn on the mantel. Not earth bed. Not window-play DRAPE. Ethogram watch true. */
export function guardPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.guard));
  if (u < 0.12) {
    const s = smoothstep(u / 0.12);
    return { x: fromX, lift: s * 1.2, rot: s * 14 * facing, anim: "sit" as const };
  }
  if (u < 0.88) {
    const s = (u - 0.12) / 0.76;
    const sweep = Math.sin(s * Math.PI * 2);
    return {
      x: fromX + facing * Math.sin(s * Math.PI) * 0.6,
      lift: 1.2 + Math.abs(sweep) * 0.8,
      rot: facing * (14 + sweep * 10),
      anim: "talk" as const,
    };
  }
  const s = smoothstep((u - 0.88) / 0.12);
  return {
    x: fromX,
    lift: 1.2 * (1 - s) * 0.2,
    rot: facing * 6 * (1 - s),
    anim: "sit" as const,
  };
}

/** Smolder — scales hold heat; a soft chest pulse. Not fuse warm. Not iguana sun. Ethogram pulse energy without naming huff. */
export function smolderPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.smolder));
  if (u < 0.12) {
    const s = smoothstep(u / 0.12);
    return { x: fromX, lift: s * 0.8, rot: s * 4 * facing, anim: "sit" as const };
  }
  if (u < 0.88) {
    const s = (u - 0.12) / 0.76;
    const breath = Math.abs(Math.sin(s * Math.PI * 3));
    return {
      x: fromX + facing * Math.sin(s * Math.PI) * 0.3,
      lift: 0.8 + breath * 1.6,
      rot: facing * (4 + breath * 5),
      anim: "sit" as const,
    };
  }
  const s = smoothstep((u - 0.88) / 0.12);
  return {
    x: fromX,
    lift: 0.8 * (1 - s),
    rot: facing * 2 * (1 - s),
    anim: "sit" as const,
  };
}

/** Claim — soft territorial settle of a desk province spot. Not special hoard. Not earth lug. */
export function claimPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.claim));
  if (u < 0.12) {
    const s = smoothstep(u / 0.12);
    return { x: fromX, lift: s * 1.6, rot: -s * 8 * facing, anim: "sit" as const };
  }
  if (u < 0.88) {
    const s = (u - 0.12) / 0.76;
    const plant = Math.abs(Math.sin(s * Math.PI * 2.2));
    return {
      x: fromX + facing * (2.4 * smoothstep(s) + plant * 0.4),
      lift: 1.6 + plant * 2.2,
      rot: facing * (-8 + plant * 10),
      anim: "play" as const,
    };
  }
  const s = smoothstep((u - 0.88) / 0.12);
  return {
    x: fromX + facing * 2.4,
    lift: 1.6 * (1 - s),
    rot: facing * -3 * (1 - s),
    anim: "sit" as const,
  };
}

/** Fold — wings fold like a letter on the blotter. House voice true. Not window-play DRAPE or COIL. */
export function foldPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.fold));
  if (u < 0.18) {
    const s = smoothstep(u / 0.18);
    return { x: fromX, lift: s * 2.0, rot: -s * 16 * facing, anim: "play" as const };
  }
  if (u < 0.72) {
    const s = (u - 0.18) / 0.54;
    const tuck = smoothstep(s);
    return {
      x: fromX + facing * Math.sin(s * Math.PI) * 0.5,
      lift: 2.0 * (1 - tuck * 0.55),
      rot: facing * (-16 + tuck * 22),
      anim: "sit" as const,
    };
  }
  const s = smoothstep((u - 0.72) / 0.28);
  return {
    x: fromX,
    lift: 2.0 * 0.45 * (1 - s),
    rot: facing * 6 * (1 - s),
    anim: "sit" as const,
  };
}

export function stepTrick(trick: DragonTrick, dt: number, flags?: TrickFlags): DragonTrick {
  if (!trick || trick.phase === "done") return trick;
  if (shouldAbort(flags) && trick.kind !== "claim" && trick.kind !== "fold") {
    return { ...trick, phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true };
  }
  const next: DragonTrick = { ...trick, t: trick.t + Math.max(0, dt) };
  if (next.kind === "sprawl") {
    if (next.t < SPRAWL_HOLD) {
      const pose = sprawlPose(next.t);
      next.phase = "hold";
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = "sit";
      return next;
    }
    if (next.t < SPRAWL_HOLD + RELEASE_S) {
      const pose = releasePose(next.t - SPRAWL_HOLD);
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
  if (next.kind === "guard") {
    const pose = guardPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "smolder") {
    const pose = smolderPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "claim") {
    const pose = claimPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else {
    const pose = foldPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
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