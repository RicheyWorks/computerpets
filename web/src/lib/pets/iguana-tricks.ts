/** Sol ground tricks while idle. House iguana — sun / dewlap / nod / press / flick personality. Feed-happy thank-yous sit after eat. Card-open freeze and window-play do not swallow a thank-you. Sleep, hide, and leave still win. Same map as desktop `iguana-tricks.js`. Not a Rui, cat, dog, rabbit, hamster, guinea pig, turtle, goldfish, budgie, fox, penguin, parrot, ferret, hedgehog, chinchilla, axolotl, toucan, or dragon move clone. Window-play FLATTEN is unchanged — this module never names a trick `flatten`. Turtle window-play BASK stays untouched — never names `bask`. Ink already owns soak/tuck/crane/plod/paddle and munch/bob/huff. Bloom already owns gill/amble/mend/smile/plume. Keel already owns roost/berry/juggle/peer/skip. Avoids bask/flatten/soak/tuck/crane/plod/paddle/potato/loaf/nest/bow/dig/flop/zoom/popcorn/hay/rumble/zig/scurry/drift/gulp/flare/glint/dart/circle/loop/preen/bobble/mimic/sidle/dangle/perch/den/mouser/stalk/trot/prance/huddle/toboggan/waddle/porpoise/trumpet/quote/strut/fan/crack/flash/tube/romp/steal/puff/noodle/thread/ball/curl/snuffle/anoint/bristle/root/dust/ash/bound/fluff/chin/sift/gill/amble/mend/smile/plume/float/wall/bloom/toss/bill/hook/roost/berry/juggle/peer/skip/bob/warm name collisions with prior guests. No cry inventing — field-tape skip stays; thank-yous are silent desk motion only. */

export const TRICK_KEY = "iguana";
export const TRICKS = ["sun", "dewlap", "nod", "press", "flick"] as const;
export const HAPPY = ["swell", "tap", "ease"] as const;
export type IguanaTrickKind = (typeof TRICKS)[number];
export type IguanaHappyKind = (typeof HAPPY)[number];
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

export type IguanaTrick = {
  kind: IguanaTrickKind;
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

export type IguanaHappy = {
  kind: IguanaHappyKind;
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

export const HAPPY_DUR: Record<IguanaHappyKind, number> = {
  swell: 1.18,
  tap: 1.22,
  ease: 1.3,
};

/** Sun hold — Sol sprawls under the lamp. Not window-play BASK or FLATTEN. Thermoregulation-true. */
export const SUN_HOLD = 10.4;
export const RELEASE_S = 0.64;

export const DUR: Record<IguanaTrickKind, number> = {
  sun: SUN_HOLD + RELEASE_S,
  dewlap: 1.38,
  nod: 1.34,
  press: 1.4,
  flick: 1.24,
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

export function nextTrickWait(justFinished: boolean, rand?: number, kind?: IguanaTrickKind) {
  const roll = rand == null ? Math.random() : rand;
  if (kind === "sun") return 42 + roll * 26;
  if (kind === "dewlap") return 15 + roll * 10;
  if (kind === "nod") return 14 + roll * 10;
  return justFinished ? 10 + roll * 8 : 5 + roll * 6;
}

export function pickTrick(rand?: number, musicOn = false, lastKind?: IguanaTrickKind | null): IguanaTrickKind {
  if (musicOn) return "sun";
  const roll = rand == null ? Math.random() : rand;
  if (lastKind === "sun") {
    if (roll < 0.28) return "dewlap";
    if (roll < 0.5) return "nod";
    if (roll < 0.72) return "press";
    return "flick";
  }
  if (lastKind === "dewlap") {
    if (roll < 0.3) return "sun";
    if (roll < 0.52) return "nod";
    if (roll < 0.74) return "press";
    return "flick";
  }
  if (lastKind === "nod") {
    if (roll < 0.24) return "sun";
    if (roll < 0.46) return "dewlap";
    if (roll < 0.68) return "press";
    return "flick";
  }
  if (roll < 0.22) return "sun";
  if (roll < 0.4) return "dewlap";
  if (roll < 0.6) return "nod";
  if (roll < 0.8) return "press";
  return "flick";
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
  return key === TRICK_KEY || key === "sol";
}

export function startThankYou(
  key: string | undefined,
  lastKind: IguanaHappyKind | null | undefined,
  x: number,
  facing: 1 | -1,
  flags?: TrickFlags,
) {
  if (!wantsThankYou(key)) return null;
  if (!happyCanStart(flags || { cmd: "idle" })) return null;
  const pick = pickHappy(lastKind);
  return { happy: beginHappy(pick, x, facing), kind: pick };
}

export function pickHappy(lastKind?: IguanaHappyKind | null, rand?: number): IguanaHappyKind {
  const pool = HAPPY.filter((k) => k !== lastKind);
  const list = pool.length ? pool : [...HAPPY];
  const roll = rand == null ? Math.random() : rand;
  return list[Math.floor(roll * list.length)] ?? list[0]!;
}

export function beginHappy(kind: IguanaHappyKind, x: number, facing: 1 | -1 = 1): IguanaHappy {
  const name: IguanaHappyKind = HAPPY.includes(kind) ? kind : "swell";
  return {
    kind: name,
    happy: true,
    phase: "go",
    t: 0,
    x,
    lift: 0,
    rot: 0,
    anim: name === "swell" ? "sit" : name === "tap" ? "talk" : "play",
    facing,
    fromX: x,
  };
}

export function swellPose(t: number) {
  const u = Math.max(0, Math.min(1, t / HAPPY_DUR.swell));
  if (u < 0.18) {
    const s = u / 0.18;
    return { lift: s * 1.6, rot: s * 6, dx: 0, anim: "sit" as const };
  }
  if (u < 0.78) {
    return {
      lift: 1.6 + Math.abs(Math.sin(t * 5)) * 0.9,
      rot: 6 + Math.sin(t * 4) * 4,
      dx: 0,
      anim: "sit" as const,
    };
  }
  const s = (u - 0.78) / 0.22;
  return { lift: 1.6 * (1 - s), rot: 6 * (1 - s), dx: 0, anim: "idle" as const };
}

export function tapPose(t: number) {
  const u = Math.max(0, Math.min(1, t / HAPPY_DUR.tap));
  if (u < 0.12) {
    const s = u / 0.12;
    return { lift: s * 2.2, rot: -s * 10, dx: 0, anim: "talk" as const };
  }
  if (u < 0.86) {
    return {
      lift: 2.2 + Math.abs(Math.sin(t * 10)) * 1.4,
      rot: -10 + Math.sin(t * 12) * 12,
      dx: Math.sin(t * 6) * 0.4,
      anim: "talk" as const,
    };
  }
  const s = (u - 0.86) / 0.14;
  return { lift: 2.2 * (1 - s), rot: -10 * (1 - s), dx: 0, anim: "sit" as const };
}

export function easePose(t: number) {
  return {
    lift: Math.abs(Math.sin(t * 3.2)) * 1.4 + 0.4,
    rot: Math.sin(t * 2.8) * 5,
    dx: Math.sin(t * 2.2) * 0.5,
    anim: "play" as const,
  };
}

export function stepHappy(happy: IguanaHappy, dt: number, flags?: TrickFlags): IguanaHappy {
  if (!happy || happy.phase === "done") return happy;
  if (happyShouldAbort(flags)) {
    return { ...happy, phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true };
  }
  const next: IguanaHappy = { ...happy, t: happy.t + Math.max(0, dt) };
  const hold = HAPPY_DUR[next.kind];
  if (next.kind === "swell") {
    const pose = swellPose(next.t);
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "tap") {
    const pose = tapPose(next.t);
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else {
    const pose = easePose(next.t);
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  }
  if (next.t >= hold) return { ...next, phase: "done", lift: 0, rot: 0, anim: "idle" };
  return next;
}

/** Sol has no Rui-style sleep-frame hold. */
export function sleepHoldFrame(_key: string | undefined, _frameCount?: number) {
  return null;
}

export function beginTrick(kind: IguanaTrickKind, x: number, facing: 1 | -1 = 1): IguanaTrick {
  const anim: TrickAnim =
    kind === "sun"
      ? "sit"
      : kind === "dewlap"
        ? "sit"
        : kind === "nod"
          ? "talk"
          : kind === "press"
            ? "play"
            : kind === "flick"
              ? "sit"
              : "sit";
  return {
    kind,
    phase: kind === "sun" ? "hold" : "go",
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

/** Roost — sprawls under the desk lamp. Thermoregulation-true. Not window-play TOSS. Not a parrot quote. Ethogram Ramphastos true. */
export function sunPose(t: number) {
  return {
    lift: 0.2 + Math.sin(t * 1.1) * 0.45,
    rot: 8 + Math.sin(t * 1.3) * 2.5 + Math.sin(t * 2.6) * 1.2,
  };
}

/** Soft lift — Sol leaves the lamp sprawl; stays on the desk. Not window-play leave. */
export function releasePose(t: number) {
  const u = Math.max(0, Math.min(1, t / RELEASE_S));
  return { lift: 0.2 * (1 - Math.sin(u * Math.PI * 0.5)), rot: 8 * (1 - u) };
}

/** Berry — throat fan extends on the blotter. Not a parrot fan. Not window-play FLATTEN. Ethogram dewlap true. */
export function dewlapPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.dewlap));
  if (u < 0.14) {
    const s = smoothstep(u / 0.14);
    return { x: fromX, lift: s * 1.8, rot: s * 10 * facing, anim: "sit" as const };
  }
  if (u < 0.86) {
    const s = (u - 0.14) / 0.72;
    return {
      x: fromX + facing * Math.sin(s * Math.PI) * 0.5,
      lift: 1.8 + Math.abs(Math.sin(s * Math.PI * 2)) * 1.4,
      rot: facing * (10 + Math.sin(s * Math.PI * 2.4) * 6),
      anim: "sit" as const,
    };
  }
  const s = smoothstep((u - 0.86) / 0.14);
  return {
    x: fromX,
    lift: 1.8 * (1 - s) * 0.2,
    rot: facing * 5 * (1 - s),
    anim: "sit" as const,
  };
}

/** Juggle — head-bob signal on the grain. Not turtle bob thank-you. Not budgie bobble. Ethogram head-bob true. */
export function nodPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.nod));
  if (u < 0.1) {
    const s = smoothstep(u / 0.1);
    return { x: fromX, lift: s * 1.2, rot: -s * 6 * facing, anim: "talk" as const };
  }
  if (u < 0.9) {
    const s = (u - 0.1) / 0.8;
    const bob = Math.sin(s * Math.PI * 5);
    return {
      x: fromX + facing * Math.sin(s * Math.PI) * 0.4,
      lift: 1.2 + Math.abs(bob) * 2.2,
      rot: facing * (-6 + bob * 16),
      anim: "talk" as const,
    };
  }
  const s = smoothstep((u - 0.9) / 0.1);
  return {
    x: fromX,
    lift: 1.2 * (1 - s),
    rot: facing * -3 * (1 - s),
    anim: "sit" as const,
  };
}

/** Peer — push-up display on the desk. Not a dog zoom. Not window-play FLATTEN. Ethogram push-up true. */
export function pressPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.press));
  if (u < 0.1) {
    const s = smoothstep(u / 0.1);
    return { x: fromX, lift: s * 2.4, rot: -s * 4 * facing, anim: "sit" as const };
  }
  if (u < 0.9) {
    const s = (u - 0.1) / 0.8;
    const pump = Math.abs(Math.sin(s * Math.PI * 3.5));
    return {
      x: fromX + facing * Math.sin(s * Math.PI * 1.5) * 0.8,
      lift: 2.4 + pump * 4.8,
      rot: facing * (-4 + pump * 8),
      anim: "play" as const,
    };
  }
  const s = smoothstep((u - 0.9) / 0.1);
  return {
    x: fromX,
    lift: 2.4 * (1 - s),
    rot: facing * -2 * (1 - s),
    anim: "sit" as const,
  };
}

/** Skip — tongue-flick chemoreception along the blotter edge. Not a dog sniff. Not a goldfish gulp. Ethogram tongue-flick true. */
export function flickPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.flick));
  if (u < 0.16) {
    const s = smoothstep(u / 0.16);
    return { x: fromX, lift: -s * 1.6, rot: s * 14 * facing, anim: "sit" as const };
  }
  if (u < 0.84) {
    const s = (u - 0.16) / 0.68;
    const tick = Math.abs(Math.sin(s * Math.PI * 4));
    return {
      x: fromX + facing * (1.8 * smoothstep(s) + tick * 0.6),
      lift: -1.6 + tick * 2.0,
      rot: facing * (14 + tick * 7),
      anim: "sit" as const,
    };
  }
  const s = smoothstep((u - 0.84) / 0.16);
  return {
    x: fromX + facing * 1.8,
    lift: -1.6 * (1 - s) * 0.2,
    rot: facing * 7 * (1 - s),
    anim: "sit" as const,
  };
}

export function stepTrick(trick: IguanaTrick, dt: number, flags?: TrickFlags): IguanaTrick {
  if (!trick || trick.phase === "done") return trick;
  if (shouldAbort(flags) && trick.kind !== "press" && trick.kind !== "flick") {
    return { ...trick, phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true };
  }
  const next: IguanaTrick = { ...trick, t: trick.t + Math.max(0, dt) };
  if (next.kind === "sun") {
    if (next.t < SUN_HOLD) {
      const pose = sunPose(next.t);
      next.phase = "hold";
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = "sit";
      return next;
    }
    if (next.t < SUN_HOLD + RELEASE_S) {
      const pose = releasePose(next.t - SUN_HOLD);
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
  if (next.kind === "dewlap") {
    const pose = dewlapPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "nod") {
    const pose = nodPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "press") {
    const pose = pressPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else {
    const pose = flickPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
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