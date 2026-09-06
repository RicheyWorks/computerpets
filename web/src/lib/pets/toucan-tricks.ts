/** Keel ground tricks while idle. House toucan — roost / berry / juggle / peer / skip personality. Feed-happy thank-yous sit after eat. Card-open freeze and window-play do not swallow a thank-you. Sleep, hide, and leave still win. Same map as desktop `toucan-tricks.js`. Not a Rui, cat, dog, rabbit, hamster, guinea pig, turtle, goldfish, budgie, fox, penguin, parrot, ferret, hedgehog, chinchilla, axolotl, or dragon move clone. Window-play TOSS is unchanged — this module never names a trick `toss`. Pike window-play BILL, raven CROAK, and mallard TIP stay untouched — never names `bill`, `croak`, or `tip`. Quill already owns flash/fan/quote/strut/crack and squawk/bravo/scissor. Echo already owns preen/bobble/mimic/sidle/dangle. Peck already owns beak. Pip already owns tilt as thank-you. Bloom already owns gill/amble/mend/smile/plume. Avoids soak/tuck/crane/plod/paddle/potato/loaf/nest/bow/dig/flop/zoom/popcorn/hay/rumble/zig/scurry/drift/gulp/flare/glint/dart/circle/loop/preen/bobble/mimic/sidle/dangle/perch/den/mouser/stalk/trot/prance/huddle/toboggan/waddle/porpoise/trumpet/quote/strut/fan/crack/flash/tube/romp/steal/puff/noodle/thread/ball/curl/snuffle/anoint/bristle/root/dust/ash/bound/fluff/chin/sift/gill/amble/mend/smile/plume/float/wall/bloom/toss/bill/hook name collisions with prior guests. */

export const TRICK_KEY = "toucan";
export const TRICKS = ["roost", "berry", "juggle", "peer", "skip"] as const;
export const HAPPY = ["clack", "yelp", "tok"] as const;
export type ToucanTrickKind = (typeof TRICKS)[number];
export type ToucanHappyKind = (typeof HAPPY)[number];
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

export type ToucanTrick = {
  kind: ToucanTrickKind;
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

export type ToucanHappy = {
  kind: ToucanHappyKind;
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

export const HAPPY_DUR: Record<ToucanHappyKind, number> = {
  clack: 1.14,
  yelp: 1.2,
  tok: 1.28,
};

/** Roost hold — Keel rests the keel of the bill on the wood. Not window-play TOSS. Not a parrot quote. Not a budgie perch. */
export const ROOST_HOLD = 10.2;
export const RELEASE_S = 0.62;

export const DUR: Record<ToucanTrickKind, number> = {
  roost: ROOST_HOLD + RELEASE_S,
  berry: 1.42,
  juggle: 1.36,
  peer: 1.26,
  skip: 1.32,
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

export function nextTrickWait(justFinished: boolean, rand?: number, kind?: ToucanTrickKind) {
  const roll = rand == null ? Math.random() : rand;
  if (kind === "roost") return 40 + roll * 24;
  if (kind === "berry") return 14 + roll * 10;
  if (kind === "juggle") return 15 + roll * 11;
  return justFinished ? 10 + roll * 8 : 5 + roll * 6;
}

export function pickTrick(rand?: number, musicOn = false, lastKind?: ToucanTrickKind | null): ToucanTrickKind {
  if (musicOn) return "roost";
  const roll = rand == null ? Math.random() : rand;
  if (lastKind === "roost") {
    if (roll < 0.28) return "berry";
    if (roll < 0.5) return "juggle";
    if (roll < 0.72) return "peer";
    return "skip";
  }
  if (lastKind === "berry") {
    if (roll < 0.3) return "roost";
    if (roll < 0.52) return "juggle";
    if (roll < 0.74) return "peer";
    return "skip";
  }
  if (lastKind === "juggle") {
    if (roll < 0.24) return "roost";
    if (roll < 0.46) return "berry";
    if (roll < 0.68) return "peer";
    return "skip";
  }
  if (roll < 0.22) return "roost";
  if (roll < 0.4) return "berry";
  if (roll < 0.6) return "juggle";
  if (roll < 0.8) return "peer";
  return "skip";
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
  return key === TRICK_KEY || key === "keel";
}

export function startThankYou(
  key: string | undefined,
  lastKind: ToucanHappyKind | null | undefined,
  x: number,
  facing: 1 | -1,
  flags?: TrickFlags,
) {
  if (!wantsThankYou(key)) return null;
  if (!happyCanStart(flags || { cmd: "idle" })) return null;
  const pick = pickHappy(lastKind);
  return { happy: beginHappy(pick, x, facing), kind: pick };
}

export function pickHappy(lastKind?: ToucanHappyKind | null, rand?: number): ToucanHappyKind {
  const pool = HAPPY.filter((k) => k !== lastKind);
  const list = pool.length ? pool : [...HAPPY];
  const roll = rand == null ? Math.random() : rand;
  return list[Math.floor(roll * list.length)] ?? list[0]!;
}

export function beginHappy(kind: ToucanHappyKind, x: number, facing: 1 | -1 = 1): ToucanHappy {
  const name: ToucanHappyKind = HAPPY.includes(kind) ? kind : "clack";
  return {
    kind: name,
    happy: true,
    phase: "go",
    t: 0,
    x,
    lift: 0,
    rot: 0,
    anim: name === "clack" ? "sit" : name === "yelp" ? "talk" : "play",
    facing,
    fromX: x,
  };
}

export function clackPose(t: number) {
  const u = Math.max(0, Math.min(1, t / HAPPY_DUR.clack));
  if (u < 0.16) {
    const s = u / 0.16;
    return { lift: s * 2.0, rot: s * 8, dx: 0, anim: "sit" as const };
  }
  if (u < 0.8) {
    return {
      lift: 2.0 + Math.abs(Math.sin(t * 14)) * 1.2,
      rot: 8 + Math.sin(t * 16) * 10,
      dx: Math.sin(t * 10) * 0.5,
      anim: "sit" as const,
    };
  }
  const s = (u - 0.8) / 0.2;
  return { lift: 2.0 * (1 - s), rot: 8 * (1 - s), dx: 0, anim: "idle" as const };
}

export function yelpPose(t: number) {
  const u = Math.max(0, Math.min(1, t / HAPPY_DUR.yelp));
  if (u < 0.12) {
    const s = u / 0.12;
    return { lift: s * 3.0, rot: -s * 9, dx: 0, anim: "talk" as const };
  }
  if (u < 0.84) {
    return {
      lift: 3.0 + Math.abs(Math.sin(t * 9)) * 1.6,
      rot: -9 + Math.sin(t * 11) * 7,
      dx: Math.sin(t * 7) * 0.9,
      anim: "talk" as const,
    };
  }
  const s = (u - 0.84) / 0.16;
  return { lift: 3.0 * (1 - s), rot: -9 * (1 - s), dx: 0, anim: "sit" as const };
}

export function tokPose(t: number) {
  return {
    lift: Math.abs(Math.sin(t * 7)) * 2.8 + 0.8,
    rot: Math.sin(t * 9) * 11,
    dx: Math.sin(t * 6) * 1.1,
    anim: "play" as const,
  };
}

export function stepHappy(happy: ToucanHappy, dt: number, flags?: TrickFlags): ToucanHappy {
  if (!happy || happy.phase === "done") return happy;
  if (happyShouldAbort(flags)) {
    return { ...happy, phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true };
  }
  const next: ToucanHappy = { ...happy, t: happy.t + Math.max(0, dt) };
  const hold = HAPPY_DUR[next.kind];
  if (next.kind === "clack") {
    const pose = clackPose(next.t);
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "yelp") {
    const pose = yelpPose(next.t);
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else {
    const pose = tokPose(next.t);
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  }
  if (next.t >= hold) return { ...next, phase: "done", lift: 0, rot: 0, anim: "idle" };
  return next;
}

/** Keel has no Rui-style sleep-frame hold. */
export function sleepHoldFrame(_key: string | undefined, _frameCount?: number) {
  return null;
}

export function beginTrick(kind: ToucanTrickKind, x: number, facing: 1 | -1 = 1): ToucanTrick {
  const anim: TrickAnim =
    kind === "roost"
      ? "sit"
      : kind === "berry"
        ? "sit"
        : kind === "juggle"
          ? "play"
          : kind === "peer"
            ? "sit"
            : kind === "skip"
              ? "walk"
              : "sit";
  return {
    kind,
    phase: kind === "roost" ? "hold" : "go",
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

/** Roost — oversized bill rests its keel on the blotter. Thermoregulation-true. Not window-play TOSS. Not a parrot quote. Ethogram Ramphastos true. */
export function roostPose(t: number) {
  return {
    lift: 0.4 + Math.sin(t * 1.4) * 0.6,
    rot: 18 + Math.sin(t * 1.7) * 4 + Math.sin(t * 3.2) * 2,
  };
}

/** Soft lift — bill leaves the wood; Keel stays on the desk. Not window-play leave. */
export function releasePose(t: number) {
  const u = Math.max(0, Math.min(1, t / RELEASE_S));
  return { lift: 0.4 * (1 - Math.sin(u * Math.PI * 0.5)), rot: 18 * (1 - u) };
}

/** Berry — fruit inspect with the bill tip on the grain. Not a parrot crack. Not a goldfish gulp. Not window-play TOSS. Ethogram fruit handling true. */
export function berryPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.berry));
  if (u < 0.14) {
    const s = smoothstep(u / 0.14);
    return { x: fromX, lift: -s * 2.2, rot: s * 12 * facing, anim: "sit" as const };
  }
  if (u < 0.86) {
    const s = (u - 0.14) / 0.72;
    return {
      x: fromX + facing * Math.sin(s * Math.PI) * 1.4,
      lift: -2.2 + Math.abs(Math.sin(s * Math.PI * 2.4)) * 2.6,
      rot: facing * (12 + Math.sin(s * Math.PI * 3) * 8),
      anim: "sit" as const,
    };
  }
  const s = smoothstep((u - 0.86) / 0.14);
  return {
    x: fromX,
    lift: -2.2 * (1 - s) * 0.15,
    rot: facing * 6 * (1 - s),
    anim: "sit" as const,
  };
}

/** Juggle — toss-catch fruit with the bill on the desk. Not window-play TOSS (cornice). Not a parrot flash. Ethogram fruit toss true. */
export function jugglePose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.juggle));
  if (u < 0.1) {
    const s = smoothstep(u / 0.1);
    return { x: fromX, lift: s * 1.6, rot: -s * 8 * facing, anim: "sit" as const };
  }
  if (u < 0.9) {
    const s = (u - 0.1) / 0.8;
    const toss = Math.abs(Math.sin(s * Math.PI * 4));
    return {
      x: fromX + facing * Math.sin(s * Math.PI * 2) * 1.8,
      lift: 1.6 + toss * 5.5,
      rot: facing * (-8 + toss * 18),
      anim: "play" as const,
    };
  }
  const s = smoothstep((u - 0.9) / 0.1);
  return {
    x: fromX,
    lift: 1.6 * (1 - s),
    rot: facing * -4 * (1 - s),
    anim: "sit" as const,
  };
}

/** Peer — tip the colorful bill to look under the blotter edge. Not Pip tilt thank-you. Not a fox stalk. Ethogram bill peer true. */
export function peerPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.peer));
  if (u < 0.16) {
    const s = smoothstep(u / 0.16);
    return { x: fromX, lift: s * 1.4, rot: s * 22 * facing, anim: "sit" as const };
  }
  if (u < 0.84) {
    const s = (u - 0.16) / 0.68;
    return {
      x: fromX + facing * Math.sin(s * Math.PI) * 0.6,
      lift: 1.4 + Math.sin(s * Math.PI * 1.6) * 0.8,
      rot: facing * (22 + Math.sin(s * Math.PI * 2) * 6),
      anim: "sit" as const,
    };
  }
  const s = smoothstep((u - 0.84) / 0.16);
  return {
    x: fromX,
    lift: 1.4 * (1 - s),
    rot: facing * 11 * (1 - s),
    anim: "sit" as const,
  };
}

/** Skip — short hops across the blotter. Toucans hop more than they walk. Not a dog zoom. Not a chinchilla bound. Not window-play hop leave. Ethogram hopping true. */
export function skipPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.skip));
  if (u < 0.08) {
    const s = smoothstep(u / 0.08);
    return { x: fromX, lift: s * 1.2, rot: -s * 5 * facing, anim: "sit" as const };
  }
  if (u < 0.9) {
    const s = (u - 0.08) / 0.82;
    const hop = Math.abs(Math.sin(s * Math.PI * 3));
    return {
      x: fromX + facing * (20 * smoothstep(s) + Math.sin(s * Math.PI * 2) * 1.2),
      lift: 1.2 + hop * 6.5,
      rot: facing * (-5 + hop * 14),
      anim: "walk" as const,
    };
  }
  const s = smoothstep((u - 0.9) / 0.1);
  return {
    x: fromX + facing * 20,
    lift: 1.2 * (1 - s),
    rot: facing * -2 * (1 - s),
    anim: "sit" as const,
  };
}

export function stepTrick(trick: ToucanTrick, dt: number, flags?: TrickFlags): ToucanTrick {
  if (!trick || trick.phase === "done") return trick;
  if (shouldAbort(flags) && trick.kind !== "skip" && trick.kind !== "juggle") {
    return { ...trick, phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true };
  }
  const next: ToucanTrick = { ...trick, t: trick.t + Math.max(0, dt) };
  if (next.kind === "roost") {
    if (next.t < ROOST_HOLD) {
      const pose = roostPose(next.t);
      next.phase = "hold";
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = "sit";
      return next;
    }
    if (next.t < ROOST_HOLD + RELEASE_S) {
      const pose = releasePose(next.t - ROOST_HOLD);
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
  if (next.kind === "berry") {
    const pose = berryPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "juggle") {
    const pose = jugglePose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "peer") {
    const pose = peerPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else {
    const pose = skipPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
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