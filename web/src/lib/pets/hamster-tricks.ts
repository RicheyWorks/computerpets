/** Clip ground tricks while idle — ultra-polish pass. House hamster — nest / cheek / scurry / pocket / reel / scrub / seed personality (soft night-shift desk hamster life). Nest drawer-settle without naming loaf or wait or flop or den or sprawl or curl; cheek pouch-fill without naming wash or face_wash eth alone; scurry night-dart without naming zoom or binky or popcorn; pocket paperclip-hoard without naming stash (window-play) or dig; reel wheel-spin-in-place without naming dance or spin alone; scrub face-paw wipe without naming wash or groom or mlem; seed soft forage pick without naming nibble (eth / guinea happy) or nosh or eat-cmd. Window-play STASH drawer unchanged — never names stash. Guest slug Clip / key hamster — accept "hamster" and "clip". Amplitudes raised toward Rui richness; denser timing; house cry preferred for talk (`hamster.wav`). Thank-yous stuff / chitter / sprint. Feed-happy after eat. Sleep, hide, leave, rest, card, ribbon still win. Same map as desktop hamster-tricks.js. True house-hamster desk life — not Rui/cat/dog/rabbit/guinea-pig/turtle/goldfish/budgie/fox/penguin/parrot/ferret/hedgehog/chinchilla/axolotl/toucan/iguana/dragon/Vesper or *Dragon electrical clones. Bird ultra line (Soot→Ember) and Miso / Pip / Thimble already done; Clip continues mammal ultra-polish. Next guest ultra is Whee / guinea_pig. No cry inventing — thank-yous are silent desk motion only. Never retouch Rui sprites. Ethogram SCRATCH_KEYS still owns paw-scratch motion — this module never names a trick `scratch`. */
export const TRICK_KEY = "hamster";
export const TRICKS = ["nest", "cheek", "scurry", "pocket", "reel", "scrub", "seed"] as const;
export const HAPPY = ["stuff", "chitter", "sprint"] as const;
export type HamsterTrickKind = (typeof TRICKS)[number];
export type HamsterHappyKind = (typeof HAPPY)[number];
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

export type HappyFlags = {
  asleep?: boolean;
  hidden?: boolean;
  leaving?: boolean;
  cmd?: string;
};

export type HamsterTrick = {
  kind: string;
  phase: TrickPhase;
  t: number;
  x: number;
  lift: number;
  rot: number;
  anim: TrickAnim;
  facing: number;
  fromX: number;
  abort?: boolean;
};

export type HamsterHappy = {
  kind: string;
  happy: true;
  phase: HappyPhase;
  t: number;
  x: number;
  lift: number;
  rot: number;
  dx?: number;
  anim: TrickAnim;
  facing: number;
  fromX: number;
  abort?: boolean;
};

export const HAPPY_DUR: Record<HamsterHappyKind, number> = {
  stuff: 1.58,
  chitter: 1.66,
  sprint: 1.72,
};

/** Soft nest hold — Clip punches into the drawer nest and stays soft, then peeks up. Rui-visible breath. Not a cat loaf. Not a rabbit flop. */
export const NEST_HOLD = 14.4;
export const RELEASE_S = 1.02;

export const DUR: Record<HamsterTrickKind, number> = {
  nest: NEST_HOLD + RELEASE_S,
  cheek: 2.10,
  scurry: 1.85,
  pocket: 2.12,
  reel: 2.08,
  scrub: 2.10,
  seed: 1.95,
};

export function canStart(state: TrickFlags | null | undefined) {
  if (!state) return false;
  if (state.asleep || state.hidden || state.leaving || state.windowPlay || state.card) return false;
  const cmd = String(state.cmd || "");
  if (cmd === "sleep" || cmd === "leave" || cmd === "hide" || cmd === "rest") return false;
  if (cmd === "seek" || cmd === "eat" || cmd === "play" || cmd === "talk" || cmd === "enter") return false;
  return true;
}

export function shouldAbort(state: TrickFlags | null | undefined) {
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
  if (kind === "nest") return 42 + roll * 28;
  if (kind === "scurry") return 12 + roll * 9;
  if (kind === "scrub" || kind === "seed") return 11 + roll * 8;
  if (kind === "cheek" || kind === "pocket") return 11 + roll * 8;
  if (kind === "reel") return 10 + roll * 8;
  return justFinished ? 8 + roll * 8 : 4 + roll * 7;
}

export function pickTrick(rand?: number, musicOn = false, lastKind?: string | null) {
  if (musicOn) return "nest";
  const roll = rand == null ? Math.random() : rand;
  const pool = TRICKS.filter((k) => k !== lastKind);
  const list = pool.length ? pool : TRICKS.slice();
  const weights = list.map((k) =>
    k === "nest" ? 0.55 : k === "cheek" || k === "pocket" || k === "scrub" ? 1.15 : 1
  );
  let total = 0;
  for (let i = 0; i < weights.length; i++) total += weights[i];
  let r = roll * total;
  for (let i = 0; i < list.length; i++) {
    r -= weights[i];
    if (r <= 0) return list[i];
  }
  return list[list.length - 1] || "cheek";
}

export function happyCanStart(state: HappyFlags | null | undefined) {
  if (!state) return false;
  if (state.asleep || state.hidden || state.leaving) return false;
  const cmd = String(state.cmd || "");
  if (cmd === "sleep" || cmd === "leave" || cmd === "hide" || cmd === "rest") return false;
  if (cmd === "seek" || cmd === "play" || cmd === "talk" || cmd === "enter") return false;
  return true;
}

export function happyShouldAbort(state: HappyFlags | null | undefined) {
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

export function wantsThankYou(key: string | null | undefined) {
  return key === TRICK_KEY || key === "clip";
}

export function startThankYou(
  key: string | null | undefined,
  lastKind: string | null | undefined,
  x: number,
  facing: number,
  flags?: HappyFlags | null,
) {
  if (!wantsThankYou(key)) return null;
  if (!happyCanStart(flags || { cmd: "idle" })) return null;
  const pick = pickHappy(lastKind);
  return { happy: beginHappy(pick, x, facing), kind: pick };
}

export function pickHappy(lastKind?: string | null, rand?: number) {
  const pool = HAPPY.filter((k) => k !== lastKind);
  const list = pool.length ? pool : HAPPY.slice();
  const roll = rand == null ? Math.random() : rand;
  return list[Math.floor(roll * list.length)] || list[0];
}

export function beginHappy(kind: string, x: number, facing?: number) {
  const name = HAPPY.indexOf(kind as HamsterHappyKind) >= 0 ? kind : "stuff";
  return {
    kind: name,
    happy: true as const,
    phase: "go" as const,
    t: 0,
    x,
    lift: 0,
    rot: 0,
    anim: (name === "chitter" ? "talk" : name === "stuff" ? "sit" : "play") as TrickAnim,
    facing: facing == null ? 1 : facing,
    fromX: x,
  };
}

export function stuffPose(t: number) {
  const u = Math.max(0, Math.min(1, t / HAPPY_DUR.stuff));
  if (u < 0.14) {
    const s = u / 0.14;
    return { lift: -s * 4.5, rot: s * 12, dx: 0, anim: "sit" as TrickAnim };
  }
  if (u < 0.85) {
    const buzz = Math.sin(t * 14) + 0.2 * Math.sin(t * 22);
    return {
      lift: -4.5 + Math.abs(buzz) * 3.2,
      rot: 10 + buzz * 9,
      dx: buzz * 0.8,
      anim: "sit" as TrickAnim,
    };
  }
  const s = (u - 0.85) / 0.15;
  return { lift: -4.5 * (1 - s), rot: Math.sin(s * Math.PI) * 4, dx: 0, anim: "sit" as TrickAnim };
}

export function chitterPose(t: number) {
  const u = Math.max(0, Math.min(1, t / HAPPY_DUR.chitter));
  if (u < 0.28) {
    const s = u / 0.28;
    return { lift: s * 5.5, rot: s * 14, dx: 0, anim: "talk" as TrickAnim };
  }
  if (u < 0.72) {
    const soft = Math.sin(t * 18);
    return { lift: 5.5 + Math.abs(soft) * 2.2, rot: 14 + soft * 8, dx: 0, anim: "talk" as TrickAnim };
  }
  const s = (u - 0.72) / 0.28;
  return { lift: 5.5 * (1 - s), rot: 14 * (1 - s), dx: 0, anim: "sit" as TrickAnim };
}

export function sprintPose(t: number) {
  const u = Math.max(0, Math.min(1, t / HAPPY_DUR.sprint));
  return {
    lift: Math.sin(u * Math.PI) * 12,
    rot: Math.sin(u * Math.PI * 2) * 14,
    dx: Math.sin(u * Math.PI) * 8,
    anim: "play" as TrickAnim,
  };
}

export function stepHappy(happy: HamsterHappy, dt: number, flags?: HappyFlags | null) {
  if (!happy || happy.phase === "done") return happy;
  if (happyShouldAbort(flags)) {
    return Object.assign({}, happy, { phase: "done" as const, t: 0, lift: 0, rot: 0, anim: "idle" as TrickAnim, abort: true });
  }
  const next = Object.assign({}, happy, { t: happy.t + Math.max(0, dt) });
  const hold = HAPPY_DUR[next.kind as HamsterHappyKind];
  if (next.kind === "stuff") {
    const pose = stuffPose(next.t);
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "chitter") {
    const pose = chitterPose(next.t);
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else {
    const pose = sprintPose(next.t);
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  }
  if (next.t >= hold) return Object.assign({}, next, { phase: "done" as const, lift: 0, rot: 0, anim: "idle" as TrickAnim });
  return next;
}

/** Clip has no Rui-style sleep-frame hold. */
export function sleepHoldFrame(_key: string | null | undefined, _frameCount?: number) {
  return null;
}

export function beginTrick(kind: string, x: number, facing?: number) {
  const name = TRICKS.indexOf(kind as HamsterTrickKind) >= 0 ? kind : "nest";
  const anim: TrickAnim =
    name === "nest" || name === "cheek" || name === "pocket" || name === "scrub" || name === "seed"
      ? "sit"
      : name === "scurry" || name === "reel"
        ? "play"
        : "sit";
  return {
    kind: name,
    phase: name === "nest" ? ("hold" as const) : ("go" as const),
    t: 0,
    x,
    lift: 0,
    rot: 0,
    anim,
    facing: facing == null ? 1 : facing,
    fromX: x,
  };
}

function smoothstep(t: number) {
  const x = Math.max(0, Math.min(1, t));
  return x * x * (3 - 2 * x);
}

/** Drawer-nest settle — hips down, soft breath. Not a cat loaf. Not a rabbit flop. */
export function nestPose(t: number) {
  const soft = Math.sin(t * 1.7);
  const breath = Math.sin(t * 2.8);
  return {
    lift: -4.2 + soft * 1.5 + Math.abs(breath) * 1.0,
    rot: -14 + breath * 4 + Math.sin(t * 5.1) * 3,
  };
}

/** Soft peek-up from the nest — no hop. */
export function releasePose(t: number) {
  const u = Math.max(0, Math.min(1, t / RELEASE_S));
  return {
    lift: -4.2 * (1 - Math.sin(u * Math.PI * 0.5)) + Math.sin(u * Math.PI) * 6,
    rot: -14 * (1 - u) + Math.sin(u * Math.PI) * 8,
  };
}

/** Cheek-pouch fill wiggle — night-shift inventory in the face. Rui-visible. Not a cat wash. Not Rui scratch. */
export function cheekPose(t: number) {
  const press = Math.abs(Math.sin(t * 12));
  return {
    lift: -1.0 + press * 10.5,
    rot: Math.sin(t * 14) * 16,
    dx: 0,
    anim: "sit" as TrickAnim,
  };
}

/** Pocket a paperclip into the cheek-hoard. Rui-visible. Not window-play stash. Not a rabbit dig. */
export function pocketPose(t: number) {
  const u = Math.max(0, Math.min(1, t / DUR.pocket));
  if (u < 0.25) {
    const s = smoothstep(u / 0.25);
    return { lift: -s * 6, rot: s * 12, dx: s * 4, anim: "sit" as TrickAnim };
  }
  if (u < 0.75) {
    return {
      lift: -6 + Math.sin(t * 14) * 3.5,
      rot: 12 + Math.sin(t * 12) * 8,
      dx: 4 + Math.sin(t * 10) * 2,
      anim: "sit" as TrickAnim,
    };
  }
  const s = smoothstep((u - 0.75) / 0.25);
  return { lift: -6 * (1 - s), rot: 12 * (1 - s), dx: 4 * (1 - s), anim: "sit" as TrickAnim };
}

/** Wheel-adjacent desk reel — spin in place without a wheel. Rui-visible. Not a dog zoom. Not Rui dance. */
export function reelPose(t: number) {
  const u = Math.max(0, Math.min(1, t / DUR.reel));
  if (u < 0.15) {
    const s = smoothstep(u / 0.15);
    return { lift: s * 4, rot: s * 16, dx: 0, anim: "play" as TrickAnim };
  }
  if (u < 0.85) {
    return {
      lift: 4 + Math.abs(Math.sin(t * 16)) * 6,
      rot: Math.sin(t * 14) * 28,
      dx: Math.sin(t * 12) * 4,
      anim: "play" as TrickAnim,
    };
  }
  const s = smoothstep((u - 0.85) / 0.15);
  return { lift: 4 * (1 - s), rot: 16 * (1 - s), dx: 0, anim: "sit" as TrickAnim };
}

/** Scurry — short night-shift dart across the desk. Rui-visible. Not a dog zoom. Not a rabbit binky. */
export function scurryPose(t: number, fromX: number, facing: number) {
  const u = Math.max(0, Math.min(1, t / DUR.scurry));
  const face = facing == null ? 1 : facing;
  if (u < 0.2) {
    const s = smoothstep(u / 0.2);
    return { x: fromX, lift: -s * 6, rot: s * 12, anim: "sit" as TrickAnim };
  }
  if (u < 0.75) {
    const s = (u - 0.2) / 0.55;
    return {
      x: fromX + face * 28 * smoothstep(s),
      lift: Math.abs(Math.sin(s * Math.PI * 3)) * 10,
      rot: Math.sin(s * Math.PI * 4) * 16,
      anim: "play" as TrickAnim,
    };
  }
  const s = smoothstep((u - 0.75) / 0.25);
  return {
    x: fromX + face * 28,
    lift: 3 * (1 - s),
    rot: 4 * (1 - s),
    anim: "sit" as TrickAnim,
  };
}

/** Face-paw scrub — classic hamster wipe. Rui-visible. Not a cat wash. Not ethogram groom alone. */
export function scrubPose(t: number, fromX: number, facing: number) {
  const u = Math.max(0, Math.min(1, t / DUR.scrub));
  const face = facing == null ? 1 : facing;
  if (u < 0.16) {
    const s = smoothstep(u / 0.16);
    return { x: fromX, lift: -s * 5, rot: s * 14 * face, anim: "sit" as TrickAnim };
  }
  if (u < 0.84) {
    const s = (u - 0.16) / 0.68;
    const wipe = Math.sin(s * Math.PI * 3.2);
    return {
      x: fromX + face * (2 + wipe * 2),
      lift: -5 + Math.abs(wipe) * 8,
      rot: 14 * face + wipe * 10,
      anim: "sit" as TrickAnim,
    };
  }
  const s = smoothstep((u - 0.84) / 0.16);
  return { x: fromX, lift: -5 * (1 - s), rot: 14 * face * (1 - s), anim: "sit" as TrickAnim };
}

/** Soft seed forage — nose-down pick from the desk. Rui-visible. Not nosh. Not nibble eth alone. */
export function seedPose(t: number, fromX: number, facing: number) {
  const u = Math.max(0, Math.min(1, t / DUR.seed));
  const face = facing == null ? 1 : facing;
  if (u < 0.12) {
    const s = smoothstep(u / 0.12);
    return { x: fromX, lift: -s * 4, rot: s * 8 * face, anim: "sit" as TrickAnim };
  }
  if (u < 0.88) {
    const s = (u - 0.12) / 0.76;
    const pick = Math.sin(s * Math.PI * 6);
    return {
      x: fromX + face * pick * 1.2,
      lift: -4 + Math.abs(pick) * 5.5,
      rot: 8 * face + pick * 7,
      anim: "sit" as TrickAnim,
    };
  }
  const s = smoothstep((u - 0.88) / 0.12);
  return { x: fromX, lift: -4 * (1 - s), rot: 8 * face * (1 - s), anim: "sit" as TrickAnim };
}

export function stepTrick(trick: HamsterTrick, dt: number, flags?: TrickFlags | null) {
  if (!trick || trick.phase === "done") return trick;
  if (shouldAbort(flags) && trick.kind !== "scurry") {
    return Object.assign({}, trick, { phase: "done" as const, t: 0, lift: 0, rot: 0, anim: "idle" as TrickAnim, abort: true });
  }
  const next = Object.assign({}, trick, { t: trick.t + Math.max(0, dt) });
  if (next.kind === "nest") {
    if (next.t < NEST_HOLD) {
      const pose = nestPose(next.t);
      next.phase = "hold";
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = "sit";
      return next;
    }
    if (next.t < NEST_HOLD + RELEASE_S) {
      const pose = releasePose(next.t - NEST_HOLD);
      next.phase = "release";
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = "sit";
      return next;
    }
    return Object.assign({}, next, { phase: "done" as const, lift: 0, rot: 0, anim: "idle" as TrickAnim });
  }
  const hold = DUR[next.kind as HamsterTrickKind];
  const u = next.t / hold;
  const fromX = trick.fromX != null ? trick.fromX : trick.x;
  const face = trick.facing;
  if (next.kind === "cheek") {
    const pose = cheekPose(next.t);
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "pocket") {
    const pose = pocketPose(next.t);
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "reel") {
    const pose = reelPose(next.t);
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "scrub") {
    const pose = scrubPose(next.t, fromX, face);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "seed") {
    const pose = seedPose(next.t, fromX, face);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else {
    const pose = scurryPose(next.t, fromX, face);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  }
  if (u >= 1) {
    return Object.assign({}, next, { phase: "done" as const, lift: 0, rot: 0, anim: "idle" as TrickAnim });
  }
  return next;
}
