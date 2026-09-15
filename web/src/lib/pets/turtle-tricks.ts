/** Ink ground tricks while idle — ultra-polish pass. House turtle — soak / tuck / crane / plod / paddle / snorkel / wipe personality (soft blotter turtle life). Soak lamp-settle without naming bask (window-play) or loaf or potato or nest or flop; tuck shell-withdraw without naming nest or bun; crane neck-survey without naming stretch (cat) or periscope (rabbit); plod deliberate crawl without naming zoom or scurry or zig; paddle soft swimming-feet without naming wag or buzz; snorkel air-gulp neck-rise without naming rise-cmd or periscope; wipe eye-foot scrub without naming wash or groom-trick or scrub (hamster). Window-play BASK unchanged — never names bask. Guest slug Ink / key turtle — accept "turtle" and "ink". Amplitudes raised toward Rui richness; denser timing; house cry preferred for talk (`turtle.wav`). Thank-yous munch / bob / huff. Feed-happy after eat. Sleep, hide, leave, rest, card, ribbon still win. Same map as desktop turtle-tricks.js. True house-turtle desk life — not Rui/cat/dog/rabbit/hamster/guinea_pig/goldfish/budgie/fox/penguin/parrot/ferret/hedgehog/chinchilla/axolotl/toucan/iguana/dragon/Vesper or *Dragon electrical clones. Bird ultra line (Soot→Ember) and Miso / Pip / Thimble / Clip / Whee already done; Ink continues house-order ultra-polish. Next guest ultra is Coin / goldfish (Echo/budgie already bird-ultra — skip). No cry inventing — thank-yous are silent desk motion only. Never retouch Rui sprites. Ethogram SCRATCH_KEYS still owns paw-scratch motion — this module never names a trick `scratch`.  turtle.wav EXISTS so prefersHouseCry adds turtle. Amplitudes raised toward Rui richness; denser waits/weights (SOAK_HOLD=11.2 RELEASE_S=1.18). Catalog 221. */

export const TRICK_KEY = "turtle";
export const TRICKS = ["soak", "tuck", "crane", "plod", "paddle", "snorkel", "wipe"] as const;
export const HAPPY = ["munch", "bob", "huff"] as const;
export type TurtleTrickKind = (typeof TRICKS)[number];
export type TurtleHappyKind = (typeof HAPPY)[number];
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

export type TurtleTrick = {
  kind: TurtleTrickKind;
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

export type TurtleHappy = {
  kind: TurtleHappyKind;
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

export const HAPPY_DUR: Record<TurtleHappyKind, number> = {
  munch: 1.58,
  bob: 1.55,
  huff: 1.48,
};

/** Soak hold — Ink settles as a warm blotter stone under the lamp. Not window-play bask. Not a cat loaf. Not a guinea-pig potato. */
export const SOAK_HOLD = 11.2;
export const RELEASE_S = 1.18;

export const DUR: Record<TurtleTrickKind, number> = {
  soak: SOAK_HOLD + RELEASE_S,
  tuck: 1.85,
  crane: 2.05,
  plod: 1.75,
  paddle: 1.65,
  snorkel: 2.08,
  wipe: 1.95,
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

export function nextTrickWait(justFinished: boolean, rand?: number, kind?: string) {
  const roll = rand == null ? Math.random() : rand;
  if (kind === "soak") return 40 + roll * 26;
  if (kind === "plod" || kind === "paddle" || kind === "wipe") return 12.8 + roll * 9.4;
  if (kind === "tuck" || kind === "crane" || kind === "snorkel") return 11.6 + roll * 8.5;
  return justFinished ? 8.5 + roll * 8.4 : 4.4 + roll * 7.4;
}

export function pickTrick(rand?: number, musicOn = false, lastKind?: string | null) {
  if (musicOn) return "soak";
  const roll = rand == null ? Math.random() : rand;
  const pool = TRICKS.filter((k) => k !== lastKind);
  const list = pool.length ? pool : TRICKS.slice();
  const weights = list.map((k) =>
    k === "soak" ? 0.72 : k === "crane" || k === "tuck" || k === "snorkel" ? 1.28 : k === "plod" || k === "paddle" ? 1.18 : 1.08
  );
  let total = 0;
  for (let i = 0; i < weights.length; i++) total += weights[i];
  let r = roll * total;
  for (let i = 0; i < list.length; i++) {
    r -= weights[i];
    if (r <= 0) return list[i];
  }
  return list[list.length - 1] || "soak";
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
  return key === TRICK_KEY || key === "ink";
}

export function startThankYou(
  key: string | undefined,
  lastKind: TurtleHappyKind | null | undefined,
  x: number,
  facing: 1 | -1,
  flags?: TrickFlags,
) {
  if (!wantsThankYou(key)) return null;
  if (!happyCanStart(flags || { cmd: "idle" })) return null;
  const pick = pickHappy(lastKind);
  return { happy: beginHappy(pick, x, facing), kind: pick };
}

export function pickHappy(lastKind?: TurtleHappyKind | null, rand?: number): TurtleHappyKind {
  const pool = HAPPY.filter((k) => k !== lastKind);
  const list = pool.length ? pool : [...HAPPY];
  const roll = rand == null ? Math.random() : rand;
  return list[Math.floor(roll * list.length)] ?? list[0]!;
}

export function beginHappy(kind: TurtleHappyKind, x: number, facing: 1 | -1 = 1): TurtleHappy {
  const name: TurtleHappyKind = HAPPY.includes(kind) ? kind : "munch";
  return {
    kind: name,
    happy: true,
    phase: "go",
    t: 0,
    x,
    lift: 0,
    rot: 0,
    anim: name === "munch" ? "sit" : name === "bob" ? "talk" : "play",
    facing,
    fromX: x,
  };
}

export function munchPose(t: number) {
  const u = Math.max(0, Math.min(1, t / HAPPY_DUR.munch));
  if (u < 0.25) {
    const s = u / 0.25;
    return { lift: -s * 4.8, rot: s * 12, dx: 0, anim: "sit" as const };
  }
  if (u < 0.85) {
    return {
      lift: -4.8 + Math.abs(Math.sin(t * 9)) * 3.8,
      rot: 12 + Math.sin(t * 8) * 8.5,
      dx: 0,
      anim: "sit" as const,
    };
  }
  const s = (u - 0.85) / 0.15;
  return { lift: -4.8 * (1 - s), rot: 12 * (1 - s), dx: 0, anim: "sit" as const };
}

export function bobPose(t: number) {
  const u = Math.max(0, Math.min(1, t / HAPPY_DUR.bob));
  if (u < 0.9) {
    return {
      lift: Math.abs(Math.sin(t * 11)) * 7.8,
      rot: Math.sin(t * 10) * 12,
      dx: 0,
      anim: "talk" as const,
    };
  }
  return { lift: 0, rot: Math.sin(((u - 0.9) / 0.1) * Math.PI) * 2, dx: 0, anim: "sit" as const };
}

export function huffPose(t: number) {
  const u = Math.max(0, Math.min(1, t / HAPPY_DUR.huff));
  return {
    lift: Math.sin(u * Math.PI) * 9,
    rot: Math.sin(u * Math.PI * 2) * 11,
    dx: Math.sin(u * Math.PI) * 4.2,
    anim: "play" as const,
  };
}

export function stepHappy(happy: TurtleHappy, dt: number, flags?: TrickFlags): TurtleHappy {
  if (!happy || happy.phase === "done") return happy;
  if (happyShouldAbort(flags)) {
    return { ...happy, phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true };
  }
  const next: TurtleHappy = { ...happy, t: happy.t + Math.max(0, dt) };
  const hold = HAPPY_DUR[next.kind];
  if (next.kind === "munch") {
    const pose = munchPose(next.t);
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "bob") {
    const pose = bobPose(next.t);
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else {
    const pose = huffPose(next.t);
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  }
  if (next.t >= hold) return { ...next, phase: "done", lift: 0, rot: 0, anim: "idle" };
  return next;
}

/** Ink has no Rui-style sleep-frame hold. */
export function sleepHoldFrame(_key: string | undefined, _frameCount?: number) {
  return null;
}

export function beginTrick(kind: TurtleTrickKind, x: number, facing: 1 | -1 = 1): TurtleTrick {
  const name = TRICKS.indexOf(kind as TurtleTrickKind) >= 0 ? kind : "soak";
  const anim: TrickAnim =
    name === "plod" || name === "paddle"
      ? "walk"
      : "sit";
  return {
    kind: name,
    phase: name === "soak" ? "hold" : "go",
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

/** Warm blotter soak — shell flat, slight tilt toward the lamp. Not window-play bask. Not a cat loaf. Not a guinea-pig potato. */
export function soakPose() {
  return { lift: -6.6, rot: 10 };
}

/** Soft unsoak — head and limbs ease out, no hop. */
export function releasePose(t: number) {
  const u = Math.max(0, Math.min(1, t / RELEASE_S));
  return { lift: -6.6 + Math.sin(u * Math.PI) * 8.4, rot: 10 - Math.sin(u * Math.PI) * 9.5 };
}

/** Shell tuck — head withdraws, shell rounds. Not a hamster nest. Not box-turtle window shut. */
export function tuckPose(t: number) {
  const u = Math.max(0, Math.min(1, t / DUR.tuck));
  if (u < 0.22) {
    const s = smoothstep(u / 0.22);
    return { lift: -s * 7.8, rot: s * 7.2, dx: 0, anim: "sit" as const };
  }
  if (u < 0.78) {
    return {
      lift: -7.8 + Math.abs(Math.sin(t * 4)) * 1.7,
      rot: 7.2 + Math.sin(t * 3) * 4.2,
      dx: 0,
      anim: "sit" as const,
    };
  }
  const s = smoothstep((u - 0.78) / 0.22);
  return { lift: -7.8 * (1 - s), rot: 7.2 * (1 - s), dx: 0, anim: "sit" as const };
}

/** Crane neck — long reach up to survey the blotter. Not a cat stretch. Not a rabbit periscope. */
export function cranePose(t: number) {
  const u = Math.max(0, Math.min(1, t / DUR.crane));
  if (u < 0.28) {
    const s = smoothstep(u / 0.28);
    return { lift: s * 13.2, rot: -s * 19, dx: 0, anim: "sit" as const };
  }
  if (u < 0.72) {
    return {
      lift: 13.2 + Math.sin(t * 3) * 1.9,
      rot: -19 + Math.sin(t * 2.5) * 6,
      dx: Math.sin(t * 2) * 1.9,
      anim: "sit" as const,
    };
  }
  const s = smoothstep((u - 0.72) / 0.28);
  return { lift: 13.2 * (1 - s), rot: -19 * (1 - s), dx: 0, anim: "sit" as const };
}

/** Plod — slow deliberate desk crawl. Not a dog zoom. Not a hamster scurry. Not a guinea-pig zig. */
export function plodPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.plod));
  if (u < 0.15) {
    const s = smoothstep(u / 0.15);
    return { x: fromX, lift: -s * 2.4, rot: s * 7.2, anim: "sit" as const };
  }
  if (u < 0.88) {
    const s = (u - 0.15) / 0.73;
    const rock = Math.sin(s * Math.PI * 3);
    return {
      x: fromX + facing * 22 * smoothstep(s),
      lift: Math.abs(rock) * 5.4,
      rot: rock * 14.4,
      anim: "walk" as const,
    };
  }
  const s = smoothstep((u - 0.88) / 0.12);
  return {
    x: fromX + facing * 22,
    lift: 2.4 * (1 - s),
    rot: 4.8 * (1 - s),
    anim: "sit" as const,
  };
}

/** Paddle — soft swimming feet in place, tiny lateral scoot. Not a dog wag. Not Relay buzz. */
export function paddlePose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.paddle));
  if (u < 0.12) {
    const s = smoothstep(u / 0.12);
    return { x: fromX, lift: -s * 1.8, rot: s * 4.8, anim: "sit" as const };
  }
  if (u < 0.88) {
    const s = (u - 0.12) / 0.76;
    const stroke = Math.sin(s * Math.PI * 4);
    return {
      x: fromX + facing * 8 * Math.sin(s * Math.PI),
      lift: Math.abs(stroke) * 6.6,
      rot: stroke * 17,
      anim: "walk" as const,
    };
  }
  const s = smoothstep((u - 0.88) / 0.12);
  return {
    x: fromX,
    lift: 1.8 * (1 - s),
    rot: 3.6 * (1 - s),
    anim: "sit" as const,
  };
}

/** Snorkel — vertical air-gulp neck rise with bob. Not crane survey. Not rabbit periscope. Not window-play rise. */
export function snorkelPose(t: number, fromX: number, facing: number) {
  const u = Math.max(0, Math.min(1, t / DUR.snorkel));
  const face = facing == null ? 1 : facing;
  if (u < 0.18) {
    const s = smoothstep(u / 0.18);
    return { x: fromX, lift: s * 14.4, rot: -s * 7.2 * face, anim: "sit" as const };
  }
  if (u < 0.82) {
    const s = (u - 0.18) / 0.64;
    const gulp = Math.sin(s * Math.PI * 3);
    return {
      x: fromX + face * Math.sin(s * Math.PI) * 1.5,
      lift: 14.4 + Math.abs(gulp) * 3.0,
      rot: -7.2 * face + gulp * 6,
      anim: "sit" as const,
    };
  }
  const s = smoothstep((u - 0.82) / 0.18);
  return { x: fromX, lift: 14.4 * (1 - s), rot: -7.2 * face * (1 - s), anim: "sit" as const };
}

/** Wipe — front-foot eye scrub, soft tilt chatter. Not cat wash. Not hamster scrub. Not rabbit groom. */
export function wipePose(t: number, fromX: number, facing: number) {
  const u = Math.max(0, Math.min(1, t / DUR.wipe));
  const face = facing == null ? 1 : facing;
  if (u < 0.14) {
    const s = smoothstep(u / 0.14);
    return { x: fromX, lift: -s * 4.2, rot: s * 17 * face, anim: "sit" as const };
  }
  if (u < 0.86) {
    const wipe = Math.sin(t * 14);
    return {
      x: fromX + face * wipe * 1.2,
      lift: -4.2 + Math.abs(wipe) * 3.4,
      rot: 17 * face + wipe * 12,
      anim: "sit" as const,
    };
  }
  const s = smoothstep((u - 0.86) / 0.14);
  return { x: fromX, lift: -4.2 * (1 - s), rot: 17 * face * (1 - s), anim: "sit" as const };
}

export function stepTrick(trick: TurtleTrick, dt: number, flags?: TrickFlags): TurtleTrick {
  if (!trick || trick.phase === "done") return trick;
  if (shouldAbort(flags) && trick.kind !== "plod" && trick.kind !== "paddle") {
    return { ...trick, phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true };
  }
  const next: TurtleTrick = { ...trick, t: trick.t + Math.max(0, dt) };
  if (next.kind === "soak") {
    if (next.t < SOAK_HOLD) {
      const pose = soakPose();
      next.phase = "hold";
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = "sit";
      return next;
    }
    if (next.t < SOAK_HOLD + RELEASE_S) {
      const pose = releasePose(next.t - SOAK_HOLD);
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
  if (next.kind === "tuck") {
    const pose = tuckPose(next.t);
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "crane") {
    const pose = cranePose(next.t);
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "plod") {
    const pose = plodPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "paddle") {
    const pose = paddlePose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "snorkel") {
    const pose = snorkelPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else {
    const pose = wipePose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
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
