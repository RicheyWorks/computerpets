/** Bloom ground tricks while idle. House axolotl — gill / amble / mend / smile / plume personality. Feed-happy thank-yous sit after eat. Card-open freeze and window-play do not swallow a thank-you. Sleep, hide, and leave still win. Same map as desktop `axolotl-tricks.js`. Not a Rui, cat, dog, rabbit, hamster, guinea pig, turtle, goldfish, budgie, fox, penguin, parrot, ferret, hedgehog, chinchilla, or dragon move clone. Window-play WALL is unchanged — this module never names a trick `wall`. Window-play FLOAT (Nimbus) and BLOOM (yeast) stay untouched — never names `float` or `bloom`. Goldfish already owns drift/gulp/flare/glint/dart and bubble/lip/swish. Turtle already owns soak/paddle. Rui already owns wave. Door window-play owns gape. Guinea pig already owns peep. Chinchilla already owns ash/bound/fluff/chin/sift and eep/coo/bark. Hedgehog already owns curl/snuffle/anoint/bristle/root. Avoids soak/tuck/crane/plod/paddle/potato/loaf/nest/bow/dig/flop/zoom/popcorn/hay/rumble/zig/scurry/drift/gulp/flare/glint/dart/circle/loop/preen/bobble/mimic/sidle/dangle/perch/den/mouser/stalk/trot/prance/huddle/toboggan/waddle/porpoise/trumpet/quote/strut/fan/crack/flash/tube/romp/steal/puff/noodle/thread/ball/curl/snuffle/anoint/bristle/root/dust/ash/bound/fluff/chin/sift/float/wall/bloom name collisions with prior guests. */

export const TRICK_KEY = "axolotl";
export const TRICKS = ["gill", "amble", "mend", "smile", "plume"] as const;
export const HAPPY = ["wink", "blip", "grin"] as const;
export type AxolotlTrickKind = (typeof TRICKS)[number];
export type AxolotlHappyKind = (typeof HAPPY)[number];
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

export type AxolotlTrick = {
  kind: AxolotlTrickKind;
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

export type AxolotlHappy = {
  kind: AxolotlHappyKind;
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

export const HAPPY_DUR: Record<AxolotlHappyKind, number> = {
  wink: 1.12,
  blip: 1.22,
  grin: 1.26,
};

/** Gill hold — Bloom breathes with external plumes on the desk. Not window-play WALL. Not a goldfish drift. Not a turtle soak. Not a cat loaf. */
export const GILL_HOLD = 10.1;
export const RELEASE_S = 0.66;

export const DUR: Record<AxolotlTrickKind, number> = {
  gill: GILL_HOLD + RELEASE_S,
  amble: 1.48,
  mend: 1.38,
  smile: 1.24,
  plume: 1.34,
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

export function nextTrickWait(justFinished: boolean, rand?: number, kind?: AxolotlTrickKind) {
  const roll = rand == null ? Math.random() : rand;
  if (kind === "gill") return 40 + roll * 24;
  if (kind === "amble") return 13 + roll * 10;
  if (kind === "mend") return 16 + roll * 11;
  return justFinished ? 10 + roll * 8 : 5 + roll * 6;
}

export function pickTrick(rand?: number, musicOn = false, lastKind?: AxolotlTrickKind | null): AxolotlTrickKind {
  if (musicOn) return "gill";
  const roll = rand == null ? Math.random() : rand;
  if (lastKind === "gill") {
    if (roll < 0.28) return "amble";
    if (roll < 0.5) return "mend";
    if (roll < 0.72) return "smile";
    return "plume";
  }
  if (lastKind === "amble") {
    if (roll < 0.3) return "gill";
    if (roll < 0.52) return "mend";
    if (roll < 0.74) return "smile";
    return "plume";
  }
  if (lastKind === "mend") {
    if (roll < 0.24) return "gill";
    if (roll < 0.46) return "amble";
    if (roll < 0.68) return "smile";
    return "plume";
  }
  if (roll < 0.22) return "gill";
  if (roll < 0.4) return "amble";
  if (roll < 0.6) return "mend";
  if (roll < 0.8) return "smile";
  return "plume";
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
  return key === TRICK_KEY || key === "bloom";
}

export function startThankYou(
  key: string | undefined,
  lastKind: AxolotlHappyKind | null | undefined,
  x: number,
  facing: 1 | -1,
  flags?: TrickFlags,
) {
  if (!wantsThankYou(key)) return null;
  if (!happyCanStart(flags || { cmd: "idle" })) return null;
  const pick = pickHappy(lastKind);
  return { happy: beginHappy(pick, x, facing), kind: pick };
}

export function pickHappy(lastKind?: AxolotlHappyKind | null, rand?: number): AxolotlHappyKind {
  const pool = HAPPY.filter((k) => k !== lastKind);
  const list = pool.length ? pool : [...HAPPY];
  const roll = rand == null ? Math.random() : rand;
  return list[Math.floor(roll * list.length)] ?? list[0]!;
}

export function beginHappy(kind: AxolotlHappyKind, x: number, facing: 1 | -1 = 1): AxolotlHappy {
  const name: AxolotlHappyKind = HAPPY.includes(kind) ? kind : "wink";
  return {
    kind: name,
    happy: true,
    phase: "go",
    t: 0,
    x,
    lift: 0,
    rot: 0,
    anim: name === "wink" ? "sit" : name === "blip" ? "talk" : "play",
    facing,
    fromX: x,
  };
}

export function winkPose(t: number) {
  const u = Math.max(0, Math.min(1, t / HAPPY_DUR.wink));
  if (u < 0.18) {
    const s = u / 0.18;
    return { lift: s * 1.8, rot: s * 5, dx: 0, anim: "sit" as const };
  }
  if (u < 0.78) {
    return {
      lift: 1.8 + Math.sin(t * 7) * 0.7,
      rot: 5 + Math.sin(t * 9) * 4,
      dx: Math.sin(t * 6) * 0.4,
      anim: "sit" as const,
    };
  }
  const s = (u - 0.78) / 0.22;
  return { lift: 1.8 * (1 - s), rot: 5 * (1 - s), dx: 0, anim: "idle" as const };
}

export function blipPose(t: number) {
  const u = Math.max(0, Math.min(1, t / HAPPY_DUR.blip));
  if (u < 0.14) {
    const s = u / 0.14;
    return { lift: s * 2.4, rot: -s * 7, dx: 0, anim: "talk" as const };
  }
  if (u < 0.82) {
    return {
      lift: 2.4 + Math.abs(Math.sin(t * 10)) * 1.4,
      rot: -7 + Math.sin(t * 12) * 6,
      dx: Math.sin(t * 8) * 0.8,
      anim: "talk" as const,
    };
  }
  const s = (u - 0.82) / 0.18;
  return { lift: 2.4 * (1 - s), rot: -7 * (1 - s), dx: 0, anim: "sit" as const };
}

export function grinPose(t: number) {
  return {
    lift: Math.abs(Math.sin(t * 8)) * 2.6 + 0.6,
    rot: Math.sin(t * 10) * 9,
    dx: Math.sin(t * 7) * 1.0,
    anim: "play" as const,
  };
}

export function stepHappy(happy: AxolotlHappy, dt: number, flags?: TrickFlags): AxolotlHappy {
  if (!happy || happy.phase === "done") return happy;
  if (happyShouldAbort(flags)) {
    return { ...happy, phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true };
  }
  const next: AxolotlHappy = { ...happy, t: happy.t + Math.max(0, dt) };
  const hold = HAPPY_DUR[next.kind];
  if (next.kind === "wink") {
    const pose = winkPose(next.t);
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "blip") {
    const pose = blipPose(next.t);
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else {
    const pose = grinPose(next.t);
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  }
  if (next.t >= hold) return { ...next, phase: "done", lift: 0, rot: 0, anim: "idle" };
  return next;
}

/** Bloom has no Rui-style sleep-frame hold. */
export function sleepHoldFrame(_key: string | undefined, _frameCount?: number) {
  return null;
}

export function beginTrick(kind: AxolotlTrickKind, x: number, facing: 1 | -1 = 1): AxolotlTrick {
  const anim: TrickAnim =
    kind === "gill"
      ? "sit"
      : kind === "amble"
        ? "walk"
        : kind === "mend"
          ? "sit"
          : kind === "smile"
            ? "sit"
            : kind === "plume"
              ? "play"
              : "sit";
  return {
    kind,
    phase: kind === "gill" ? "hold" : "go",
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

/** Gill — external plume breathe on the wood. Not window-play WALL. Not a goldfish drift. Not a turtle soak. Ethogram Ambystoma mexicanum true. */
export function gillPose(t: number) {
  return {
    lift: 0.8 + Math.sin(t * 1.9) * 1.2 + Math.abs(Math.sin(t * 3.6)) * 0.6,
    rot: Math.sin(t * 2.6) * 14 + Math.sin(t * 4.8) * 7,
  };
}

/** Soft settle — plumes still; Bloom stays on the desk. Not window-play leave. */
export function releasePose(t: number) {
  const u = Math.max(0, Math.min(1, t / RELEASE_S));
  return { lift: (0.8 + 1.2) * (1 - Math.sin(u * Math.PI * 0.5)), rot: 14 * (1 - u) };
}

/** Amble — neotenic salamander walk across the grain. Not a dog zoom. Not a turtle plod. Not a goldfish dart. Not window-play WALL walk. Ethogram walking true. */
export function amblePose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.amble));
  if (u < 0.1) {
    const s = smoothstep(u / 0.1);
    return { x: fromX, lift: s * 1.0, rot: -s * 6 * facing, anim: "sit" as const };
  }
  if (u < 0.88) {
    const s = (u - 0.1) / 0.78;
    const step = Math.sin(s * Math.PI * 3.2);
    return {
      x: fromX + facing * (16 * smoothstep(s) + Math.sin(s * Math.PI * 2) * 1.6),
      lift: 1.0 + Math.abs(step) * 3.4,
      rot: facing * (-6 + step * 11),
      anim: "walk" as const,
    };
  }
  const s = smoothstep((u - 0.88) / 0.12);
  return {
    x: fromX + facing * 16,
    lift: 1.0 * (1 - s),
    rot: facing * -3 * (1 - s),
    anim: "sit" as const,
  };
}

/** Mend — regenerate-adjacent settle; desk life heals slow. Not a ferret noodle. Not a hedgehog anoint. Not a rabbit groom. Ethogram regeneration true. */
export function mendPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.mend));
  if (u < 0.16) {
    const s = smoothstep(u / 0.16);
    return { x: fromX, lift: -s * 1.6, rot: s * 8 * facing, anim: "sit" as const };
  }
  if (u < 0.84) {
    const s = (u - 0.16) / 0.68;
    return {
      x: fromX + facing * Math.sin(s * Math.PI) * 1.2,
      lift: -1.6 + Math.sin(s * Math.PI * 2) * 2.8,
      rot: facing * (8 + Math.sin(s * Math.PI * 2.5) * 6),
      anim: "sit" as const,
    };
  }
  const s = smoothstep((u - 0.84) / 0.16);
  return {
    x: fromX,
    lift: (-1.6 + 2.8) * (1 - s) * 0.2,
    rot: facing * 4 * (1 - s),
    anim: "sit" as const,
  };
}

/** Smile — permanent soft face on the desk. Not a fox prance. Not a parrot flash. Not Door window-play gape. Ethogram face true. */
export function smilePose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.smile));
  if (u < 0.14) {
    const s = smoothstep(u / 0.14);
    return { x: fromX, lift: s * 2.2, rot: s * 4 * facing, anim: "sit" as const };
  }
  if (u < 0.86) {
    const s = (u - 0.14) / 0.72;
    return {
      x: fromX + facing * Math.sin(s * Math.PI) * 0.8,
      lift: 2.2 + Math.sin(s * Math.PI * 1.8) * 1.1,
      rot: facing * (4 + Math.sin(s * Math.PI * 2.2) * 5),
      anim: "sit" as const,
    };
  }
  const s = smoothstep((u - 0.86) / 0.14);
  return {
    x: fromX,
    lift: 2.2 * (1 - s),
    rot: facing * 2 * (1 - s),
    anim: "sit" as const,
  };
}

/** Plume — bilateral gill sway as play. Not a budgie preen. Not a parrot fan. Not window-play WALL. Ethogram gill plume true. */
export function plumePose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.plume));
  if (u < 0.1) {
    const s = smoothstep(u / 0.1);
    return {
      x: fromX,
      lift: s * 2.0,
      rot: -s * 10 * facing,
      anim: "sit" as const,
    };
  }
  if (u < 0.88) {
    const s = (u - 0.1) / 0.78;
    const sway = Math.sin(s * Math.PI * 5.5);
    return {
      x: fromX + facing * sway * 2.2,
      lift: 2.0 + Math.abs(sway) * 2.0,
      rot: facing * (-10 + sway * 20),
      anim: "play" as const,
    };
  }
  const s = smoothstep((u - 0.88) / 0.12);
  return {
    x: fromX,
    lift: 2.0 * (1 - s),
    rot: facing * -5 * (1 - s),
    anim: "sit" as const,
  };
}

export function stepTrick(trick: AxolotlTrick, dt: number, flags?: TrickFlags): AxolotlTrick {
  if (!trick || trick.phase === "done") return trick;
  if (shouldAbort(flags) && trick.kind !== "amble" && trick.kind !== "plume") {
    return { ...trick, phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true };
  }
  const next: AxolotlTrick = { ...trick, t: trick.t + Math.max(0, dt) };
  if (next.kind === "gill") {
    if (next.t < GILL_HOLD) {
      const pose = gillPose(next.t);
      next.phase = "hold";
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = "sit";
      return next;
    }
    if (next.t < GILL_HOLD + RELEASE_S) {
      const pose = releasePose(next.t - GILL_HOLD);
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
  if (next.kind === "amble") {
    const pose = amblePose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "mend") {
    const pose = mendPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "smile") {
    const pose = smilePose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else {
    const pose = plumePose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
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
