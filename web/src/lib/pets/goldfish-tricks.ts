/** Coin ground tricks while idle — ultra-polish pass. House goldfish — drift / gulp / flare / glint / dart / yawn / forage personality (soft bowl-goldfish life). Drift mid-bowl hang without naming circle (window-play) or soak or potato or loaf or nest; gulp surface-mouth without naming drink or eat-cmd; flare fin-pulse without naming flash or puff; glint lamp-catch tilt without naming gleam (Earth thank-you) or wash; dart short bowl dash without naming zoom or scurry or zig or paddle (turtle); yawn wide-mouth gape without naming gape-snake or stretch; forage gravel-mouth pick without naming dig or nosh or hay or seed or browse. Window-play CIRCLE unchanged — never names a trick `circle`. Special Loop unchanged — never names `loop`. Guest slug Coin / key goldfish — accept "goldfish" and "coin". Amplitudes raised toward Rui richness; denser timing; house cry preferred for talk (`goldfish.wav`). Thank-yous bubble / lip / swish. Feed-happy after eat. Sleep, hide, leave, rest, card, ribbon still win. Same map as desktop `goldfish-tricks.js`. True house-goldfish desk life — not Rui/cat/dog/rabbit/hamster/guinea_pig/turtle/budgie/fox/penguin/parrot/ferret/hedgehog/chinchilla/axolotl/toucan/iguana/dragon/Vesper or *Dragon electrical clones. Bird ultra line (Soot→Ember) and Miso / Pip / Thimble / Clip / Whee / Ink already done; Echo/budgie skip (bird-ultra); Peck/penguin skip (bird). Coin continues house-order ultra-polish. Next guest ultra is Rue / fox. No cry inventing — thank-yous are silent desk motion only. Never retouch Rui sprites. Ethogram SCRATCH_KEYS still owns paw-scratch motion — this module never names a trick `scratch`.  goldfish.wav EXISTS so prefersHouseCry adds goldfish. Amplitudes raised toward Rui richness; denser waits/weights (DRIFT_HOLD=11.2 RELEASE_S=1.18). Catalog 221. */

export const TRICK_KEY = "goldfish";
export const TRICKS = ["drift", "gulp", "flare", "glint", "dart", "yawn", "forage"] as const;
export const HAPPY = ["bubble", "lip", "swish"] as const;
export type GoldfishTrickKind = (typeof TRICKS)[number];
export type GoldfishHappyKind = (typeof HAPPY)[number];
// "eat" is a real desk frame set; the forage trick uses it.
export type TrickAnim = "idle" | "walk" | "sit" | "sleep" | "talk" | "play" | "eat";
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

export type GoldfishTrick = {
  kind: GoldfishTrickKind;
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

export type GoldfishHappy = {
  kind: GoldfishHappyKind;
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

export const HAPPY_DUR: Record<GoldfishHappyKind, number> = {
  bubble: 1.58,
  lip: 1.55,
  swish: 1.48,
};

/** Drift hold — Coin hangs mid-bowl on one honest thought. Not window-play circle. Not a turtle soak. Not a guinea-pig potato. */
export const DRIFT_HOLD = 11.2;
export const RELEASE_S = 1.18;

export const DUR: Record<GoldfishTrickKind, number> = {
  drift: DRIFT_HOLD + RELEASE_S,
  gulp: 1.85,
  flare: 2.05,
  glint: 1.95,
  dart: 1.75,
  yawn: 2.08,
  forage: 2.10,
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
  if (kind === "drift") return 40 + roll * 26;
  if (kind === "dart" || kind === "forage" || kind === "flare") return 12.8 + roll * 9.4;
  if (kind === "gulp" || kind === "yawn" || kind === "glint") return 11.6 + roll * 8.5;
  return justFinished ? 8.5 + roll * 8.4 : 4.4 + roll * 7.4;
}

export function pickTrick(rand?: number, musicOn = false, lastKind?: string | null) {
  if (musicOn) return "drift";
  const roll = rand == null ? Math.random() : rand;
  const pool = TRICKS.filter((k) => k !== lastKind);
  const list = pool.length ? pool : TRICKS.slice();
  const weights = list.map((k) =>
    k === "drift" ? 0.72 : k === "yawn" || k === "gulp" || k === "flare" ? 1.28 : k === "dart" || k === "forage" ? 1.18 : 1.08
  );
  let total = 0;
  for (let i = 0; i < weights.length; i++) total += weights[i];
  let r = roll * total;
  for (let i = 0; i < list.length; i++) {
    r -= weights[i];
    if (r <= 0) return list[i];
  }
  return list[list.length - 1] || "drift";
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
  return key === TRICK_KEY || key === "coin";
}

export function startThankYou(
  key: string | undefined,
  lastKind: GoldfishHappyKind | null | undefined,
  x: number,
  facing: 1 | -1,
  flags?: TrickFlags,
) {
  if (!wantsThankYou(key)) return null;
  if (!happyCanStart(flags || { cmd: "idle" })) return null;
  const pick = pickHappy(lastKind);
  return { happy: beginHappy(pick, x, facing), kind: pick };
}

export function pickHappy(lastKind?: GoldfishHappyKind | null, rand?: number): GoldfishHappyKind {
  const pool = HAPPY.filter((k) => k !== lastKind);
  const list = pool.length ? pool : [...HAPPY];
  const roll = rand == null ? Math.random() : rand;
  return list[Math.floor(roll * list.length)] ?? list[0]!;
}

export function beginHappy(kind: GoldfishHappyKind, x: number, facing: 1 | -1 = 1): GoldfishHappy {
  const name: GoldfishHappyKind = HAPPY.includes(kind) ? kind : "bubble";
  return {
    kind: name,
    happy: true,
    phase: "go",
    t: 0,
    x,
    lift: 0,
    rot: 0,
    anim: name === "bubble" ? "talk" : name === "lip" ? "sit" : "play",
    facing,
    fromX: x,
  };
}

export function bubblePose(t: number) {
  const u = Math.max(0, Math.min(1, t / HAPPY_DUR.bubble));
  if (u < 0.2) {
    const s = u / 0.2;
    return { lift: s * 6.6, rot: -s * 9.6, dx: 0, anim: "talk" as const };
  }
  if (u < 0.85) {
    return {
      lift: 6.6 + Math.abs(Math.sin(t * 8)) * 4.6,
      rot: -9.6 + Math.sin(t * 7) * 10.8,
      dx: 0,
      anim: "talk" as const,
    };
  }
  const s = (u - 0.85) / 0.15;
  return { lift: 6.6 * (1 - s), rot: -9.6 * (1 - s), dx: 0, anim: "sit" as const };
}

export function lipPose(t: number) {
  const u = Math.max(0, Math.min(1, t / HAPPY_DUR.lip));
  if (u < 0.9) {
    return {
      lift: Math.abs(Math.sin(t * 12)) * 5.4,
      rot: Math.sin(t * 14) * 14.4,
      dx: 0,
      anim: "sit" as const,
    };
  }
  return { lift: 0, rot: Math.sin(((u - 0.9) / 0.1) * Math.PI) * 2, dx: 0, anim: "idle" as const };
}

export function swishPose(t: number) {
  const u = Math.max(0, Math.min(1, t / HAPPY_DUR.swish));
  return {
    lift: Math.sin(u * Math.PI) * 7.8,
    rot: Math.sin(u * Math.PI * 3) * 19.2,
    dx: Math.sin(u * Math.PI * 2) * 6,
    anim: "play" as const,
  };
}

export function stepHappy(happy: GoldfishHappy, dt: number, flags?: TrickFlags): GoldfishHappy {
  if (!happy || happy.phase === "done") return happy;
  if (happyShouldAbort(flags)) {
    return { ...happy, phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true };
  }
  const next: GoldfishHappy = { ...happy, t: happy.t + Math.max(0, dt) };
  const hold = HAPPY_DUR[next.kind];
  if (next.kind === "bubble") {
    const pose = bubblePose(next.t);
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "lip") {
    const pose = lipPose(next.t);
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else {
    const pose = swishPose(next.t);
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  }
  if (next.t >= hold) return { ...next, phase: "done", lift: 0, rot: 0, anim: "idle" };
  return next;
}

/** Coin has no Rui-style sleep-frame hold. */
export function sleepHoldFrame(_key: string | undefined, _frameCount?: number) {
  return null;
}

export function beginTrick(kind: GoldfishTrickKind, x: number, facing: 1 | -1 = 1): GoldfishTrick {
  const name = TRICKS.indexOf(kind as GoldfishTrickKind) >= 0 ? kind : "drift";
  const anim: TrickAnim =
    name === "drift" || name === "gulp" || name === "flare" || name === "glint" || name === "yawn" || name === "forage"
      ? "sit"
      : name === "dart"
        ? "walk"
        : "sit";
  return {
    kind: name as GoldfishTrickKind,
    phase: name === "drift" ? "hold" : "go",
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

/** Mid-bowl drift — soft hang, richer undulation. Not window-play circle. Not a turtle soak. Not a cat loaf. */
export function driftPose(t: number) {
  return {
    lift: 7.8 + Math.sin(t * 1.6) * 2.6,
    rot: Math.sin(t * 1.1) * 9.6,
  };
}

/** Soft undrift — thought lets go, fins ease. */
export function releasePose(t: number) {
  const u = Math.max(0, Math.min(1, t / RELEASE_S));
  return { lift: 7.8 * (1 - Math.sin(u * Math.PI * 0.5)), rot: 9.6 * (1 - u) };
}

/** Surface gulp — mouth works the waterline. Ethogram gulp_soft, ground-side. */
export function gulpPose(t: number) {
  const u = Math.max(0, Math.min(1, t / DUR.gulp));
  if (u < 0.2) {
    const s = smoothstep(u / 0.2);
    return { lift: s * 11.4, rot: -s * 14.4, dx: 0, anim: "sit" as const };
  }
  if (u < 0.8) {
    return {
      lift: 11.4 + Math.abs(Math.sin(t * 10)) * 3.4,
      rot: -14.4 + Math.sin(t * 9) * 8.4,
      dx: 0,
      anim: "talk" as const,
    };
  }
  const s = smoothstep((u - 0.8) / 0.2);
  return { lift: 11.4 * (1 - s), rot: -14.4 * (1 - s), dx: 0, anim: "sit" as const };
}

/** Fin flare — pectorals and dorsal pulse open. Ethogram flare_soft, ground-side. */
export function flarePose(t: number) {
  const u = Math.max(0, Math.min(1, t / DUR.flare));
  if (u < 0.22) {
    const s = smoothstep(u / 0.22);
    return { lift: s * 6.6, rot: s * 19.2, dx: 0, anim: "sit" as const };
  }
  if (u < 0.78) {
    return {
      lift: 6.6 + Math.abs(Math.sin(t * 5)) * 3.8,
      rot: 19.2 + Math.sin(t * 6) * 14.4,
      dx: Math.sin(t * 4) * 2.9,
      anim: "play" as const,
    };
  }
  const s = smoothstep((u - 0.78) / 0.22);
  return { lift: 6.6 * (1 - s), rot: 19.2 * (1 - s), dx: 0, anim: "sit" as const };
}

/** Glint — metal body tilts to catch the lamp. Not Earth gleam thank-you. Not a cat wash. */
export function glintPose(t: number) {
  const u = Math.max(0, Math.min(1, t / DUR.glint));
  if (u < 0.25) {
    const s = smoothstep(u / 0.25);
    return { lift: s * 4.2, rot: -s * 28.8, dx: 0, anim: "sit" as const };
  }
  if (u < 0.75) {
    return {
      lift: 4.2 + Math.sin(t * 3) * 1.4,
      rot: -28.8 + Math.sin(t * 2.2) * 8.4,
      dx: Math.sin(t * 2) * 1.4,
      anim: "sit" as const,
    };
  }
  const s = smoothstep((u - 0.75) / 0.25);
  return { lift: 4.2 * (1 - s), rot: -28.8 * (1 - s), dx: 0, anim: "sit" as const };
}

/** Dart — short bowl dash then settle. Not a dog zoom. Not a hamster scurry. Not a turtle paddle. Not window-play circle. */
export function dartPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.dart));
  if (u < 0.12) {
    const s = smoothstep(u / 0.12);
    return { x: fromX, lift: s * 2.6, rot: -s * 9.6, anim: "sit" as const };
  }
  if (u < 0.82) {
    const s = (u - 0.12) / 0.7;
    const kick = Math.sin(s * Math.PI);
    return {
      x: fromX + facing * 28 * smoothstep(s),
      lift: 2.6 + kick * 8.4,
      rot: -9.6 + Math.sin(s * Math.PI * 2) * 16.8,
      anim: "walk" as const,
    };
  }
  const s = smoothstep((u - 0.82) / 0.18);
  return {
    x: fromX + facing * 28,
    lift: 3.0 * (1 - s),
    rot: 6 * (1 - s),
    anim: "sit" as const,
  };
}

/** Yawn — wide mouth gape with a soft hang. Not snake gape. Not cat stretch. Ethogram yawn_soft. */
export function yawnPose(t: number, fromX: number, facing: number) {
  const u = Math.max(0, Math.min(1, t / DUR.yawn));
  const face = facing == null ? 1 : facing;
  if (u < 0.18) {
    const s = smoothstep(u / 0.18);
    return { x: fromX, lift: s * 5.4, rot: -s * 7.2 * face, anim: "sit" as const };
  }
  if (u < 0.78) {
    const s = (u - 0.18) / 0.6;
    const gape = Math.sin(s * Math.PI);
    return {
      x: fromX,
      lift: 5.4 + gape * 2.6,
      rot: -7.2 * face + gape * 12 * face,
      anim: "talk" as const,
    };
  }
  const s = smoothstep((u - 0.78) / 0.22);
  return { x: fromX, lift: 5.4 * (1 - s), rot: -7.2 * face * (1 - s), anim: "sit" as const };
}

/** Forage — gravel-mouth pick with soft dips and nudges. Not dig. Not nosh. Not hay. Not seed. Ethogram forage_soft. */
export function foragePose(t: number, fromX: number, facing: number) {
  const u = Math.max(0, Math.min(1, t / DUR.forage));
  const face = facing == null ? 1 : facing;
  if (u < 0.14) {
    const s = smoothstep(u / 0.14);
    return { x: fromX, lift: -s * 6.6, rot: s * 12 * face, anim: "sit" as const };
  }
  if (u < 0.86) {
    const peck = Math.sin(t * 11);
    return {
      x: fromX + face * peck * 2.6,
      lift: -6.6 + Math.abs(peck) * 3.4,
      rot: 12 * face + peck * 9.6,
      anim: "eat" as const,
    };
  }
  const s = smoothstep((u - 0.86) / 0.14);
  return { x: fromX, lift: -6.6 * (1 - s), rot: 12 * face * (1 - s), anim: "sit" as const };
}

export function stepTrick(trick: GoldfishTrick, dt: number, flags?: TrickFlags): GoldfishTrick {
  if (!trick || trick.phase === "done") return trick;
  if (shouldAbort(flags) && trick.kind !== "dart" && trick.kind !== "forage") {
    return { ...trick, phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true };
  }
  const next: GoldfishTrick = { ...trick, t: trick.t + Math.max(0, dt) };
  if (next.kind === "drift") {
    if (next.t < DRIFT_HOLD) {
      const pose = driftPose(next.t);
      next.phase = "hold";
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = "sit";
      return next;
    }
    if (next.t < DRIFT_HOLD + RELEASE_S) {
      const pose = releasePose(next.t - DRIFT_HOLD);
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
  if (next.kind === "gulp") {
    const pose = gulpPose(next.t);
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "flare") {
    const pose = flarePose(next.t);
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "glint") {
    const pose = glintPose(next.t);
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "yawn") {
    const pose = yawnPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "forage") {
    const pose = foragePose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else {
    const pose = dartPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
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
