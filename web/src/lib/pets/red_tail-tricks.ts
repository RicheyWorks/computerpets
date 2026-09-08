/** Hook ground tricks while idle — ultra-polish pass. House neighborly Accipitridae / Buteoninae red-tailed hawk desk life — kettle / stoop / bind / keeyer / patagial / tower / buteo personality (kettle thermal-circle wing-set without naming soar or dihedral, stoop dive-coil without naming softcrouch or plunge, bind talon-bind without naming mantle, keeyer kee-eer stance without naming soar-cry or cronk or snore, patagial wing-mark flash without naming flash or fan or strut, tower rising spiral without naming soar or kettle-cry, long buteo Buteo jamaicensis fencepost perch — never named wait or soar or hop or preen or fan or strut or roost or hopwalk or monocle or fossick or anting or scrutinize or glean or corvid or dihedral or billtap or tumble or cronk or invite or toeing or hackles or diskturn or softcrouch or parallax or snore or twist or pellet or tytonid; window-play SOAR owns soar; Soot/Wedge/Heart own their tricks; guest slug Hook / key red_tail — accept "red_tail" and "hook"; do NOT name a trick red_tail or hook or soar or mantle). Amplitudes raised toward Rui richness; denser timing; house cry preferred for talk. Thank-yous borealis / calurus / harlani. Feed-happy after eat. Sleep, hide, leave, rest, card, ribbon still win. Same map as web red_tail-tricks.ts. Window-play SOAR unchanged. True red-tailed hawk desk life — not owl/crow/raven clones. Dee owns the next seat. No cry inventing — thank-yous are silent desk motion only. Never retouch Rui sprites. */
export const TRICK_KEY = "red_tail";
export const TRICKS = ["kettle", "stoop", "bind", "keeyer", "patagial", "tower", "buteo"] as const;
export const HAPPY = ["borealis", "calurus", "harlani"] as const;
export type RedTailTrickKind = (typeof TRICKS)[number];
export type RedTailHappyKind = (typeof HAPPY)[number];
export type TrickAnim = "idle" | "walk" | "sit" | "sleep" | "talk" | "play";
export type TrickPhase = "go" | "hold" | "release" | "done";
export type HappyPhase = "go" | "done";
export type TrickFlags = {
  asleep?: boolean;
  hidden?: boolean;
  leaving?: boolean;
  windowPlay?: boolean;
  card?: boolean;
  cmd?: string;
};
export type HappyFlags = {
  asleep?: boolean;
  hidden?: boolean;
  leaving?: boolean;
  cmd?: string;
};
export type RedTailTrick = {
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
export type RedTailHappy = {
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
export const HAPPY_DUR: Record<RedTailHappyKind, number> = { borealis: 1.58, calurus: 1.72, harlani: 1.65 };
export const BUTEO_HOLD = 14.8;
export const RELEASE_S = 1.08;
export const DUR: Record<RedTailTrickKind, number> = {
  buteo: BUTEO_HOLD + RELEASE_S,
  kettle: 2.48,
  stoop: 2.36,
  bind: 2.42,
  keeyer: 2.28,
  patagial: 2.34,
  tower: 2.52,
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
  if (kind === "buteo") return 44 + roll * 30;
  if (kind === "keeyer" || kind === "tower") return 13 + roll * 9;
  if (kind === "stoop" || kind === "bind") return 12 + roll * 9;
  if (kind === "kettle" || kind === "patagial") return 11 + roll * 8;
  return justFinished ? 8 + roll * 8 : 4 + roll * 7;
}

export function pickTrick(rand?: number, musicOn?: boolean, lastKind?: string): RedTailTrickKind {
  if (musicOn) return "buteo";
  const roll = rand == null ? Math.random() : rand;
  const pool = TRICKS.filter((k) => k !== lastKind);
  const list = pool.length ? pool : [...TRICKS];
  const weights = list.map((k) => (k === "buteo" ? 0.55 : k === "keeyer" || k === "kettle" ? 1.15 : 1));
  let total = 0;
  for (let i = 0; i < weights.length; i++) total += weights[i];
  let r = roll * total;
  for (let i = 0; i < list.length; i++) {
    r -= weights[i];
    if (r <= 0) return list[i];
  }
  return list[list.length - 1] || "kettle";
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

export function wantsThankYou(key: string | undefined | null) {
  return key === TRICK_KEY || key === "hook";
}

export function startThankYou(
  key: string | undefined | null,
  lastKind: string | undefined,
  x: number,
  facing: number,
  flags?: HappyFlags,
) {
  if (!wantsThankYou(key)) return null;
  if (!happyCanStart(flags || { cmd: "idle" })) return null;
  const pick = pickHappy(lastKind);
  return { happy: beginHappy(pick, x, facing), kind: pick };
}

export function pickHappy(lastKind?: string, rand?: number): RedTailHappyKind {
  const pool = HAPPY.filter((k) => k !== lastKind);
  const list = pool.length ? pool : [...HAPPY];
  const roll = rand == null ? Math.random() : rand;
  return list[Math.floor(roll * list.length)] || list[0];
}

export function beginHappy(kind: RedTailHappyKind | string, x: number, facing?: number): RedTailHappy {
  const name = (HAPPY as readonly string[]).indexOf(kind) >= 0 ? (kind as RedTailHappyKind) : "borealis";
  return {
    kind: name,
    happy: true,
    phase: "go",
    t: 0,
    x,
    lift: 0,
    rot: 0,
    anim: name === "calurus" ? "play" : "sit",
    facing: facing == null ? 1 : facing,
    fromX: x,
  };
}

export function borealisPose(t: number) {
  const u = Math.max(0, Math.min(1, t / HAPPY_DUR.borealis));
  if (u < 0.16) {
    const s = u / 0.16;
    return { lift: s * 6, rot: s * 12, dx: 0, anim: "sit" as TrickAnim };
  }
  if (u < 0.82) {
    const flash = Math.sin(t * 5.8) + 0.28 * Math.sin(t * 11.6);
    return { lift: 6 + Math.abs(flash) * 5, rot: 12 + flash * 8, dx: flash * 2.2, anim: "sit" as TrickAnim };
  }
  const s = (u - 0.82) / 0.18;
  return { lift: 4 * (1 - s), rot: 4 * (1 - s), dx: 0, anim: "idle" as TrickAnim };
}

export function calurusPose(t: number) {
  const u = Math.max(0, Math.min(1, t / HAPPY_DUR.calurus));
  if (u < 0.12) {
    const s = u / 0.12;
    return { lift: s * 14, rot: s * -12, dx: s * 3, anim: "play" as TrickAnim };
  }
  if (u < 0.85) {
    const wriggle = Math.sin(t * 4.4) + 0.24 * Math.sin(t * 7.9);
    return { lift: 12 + Math.abs(wriggle) * 10, rot: -10 + wriggle * 14, dx: wriggle * 4, anim: "play" as TrickAnim };
  }
  const s = (u - 0.85) / 0.15;
  return { lift: 5 * (1 - s), rot: -4 * (1 - s), dx: 0, anim: "sit" as TrickAnim };
}

export function harlaniPose(t: number) {
  return {
    lift: 3 + Math.abs(Math.sin(t * 4.0)) * 7,
    rot: Math.sin(t * 3.4) * 9,
    dx: Math.sin(t * 2.6) * 3,
    anim: "sit" as TrickAnim,
  };
}

export function stepHappy(happy: RedTailHappy, dt: number, flags?: HappyFlags): RedTailHappy {
  if (!happy || happy.phase === "done") return happy;
  if (happyShouldAbort(flags)) {
    return { ...happy, phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true };
  }
  const next = { ...happy, t: happy.t + Math.max(0, dt) };
  const hold = HAPPY_DUR[next.kind as RedTailHappyKind];
  const pose =
    next.kind === "borealis" ? borealisPose(next.t) : next.kind === "calurus" ? calurusPose(next.t) : harlaniPose(next.t);
  next.lift = pose.lift;
  next.rot = pose.rot;
  next.anim = pose.anim;
  if (next.t >= hold) return { ...next, phase: "done", lift: 0, rot: 0, anim: "idle" };
  return next;
}

export function sleepHoldFrame(_key?: string, _frameCount?: number) {
  return null;
}

export function beginTrick(kind: RedTailTrickKind | string, x: number, facing?: number): RedTailTrick {
  const name = (TRICKS as readonly string[]).indexOf(kind) >= 0 ? (kind as RedTailTrickKind) : "kettle";
  const anim: TrickAnim =
    name === "buteo" || name === "kettle" || name === "stoop" || name === "patagial"
      ? "sit"
      : name === "bind" || name === "tower"
        ? "play"
        : name === "keeyer"
          ? "talk"
          : "sit";
  return {
    kind: name,
    phase: name === "buteo" ? "hold" : "go",
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

export function buteoPose(t: number) {
  const breath = Math.sin(t * 0.55) + 0.18 * Math.sin(t * 1.4);
  const soft = Math.abs(Math.sin(t * 0.9));
  return { lift: 2 + soft * 4 + Math.abs(breath) * 1.5, rot: -2 + breath * 4 };
}

export function releasePose(t: number) {
  const u = Math.max(0, Math.min(1, t / RELEASE_S));
  return { lift: 3 * (1 - Math.sin(u * Math.PI * 0.5)), rot: -3 * (1 - u) };
}

export function kettlePose(t: number, fromX: number, facing?: number) {
  const u = Math.max(0, Math.min(1, t / DUR.kettle));
  const face = facing == null ? 1 : facing;
  if (u < 0.10) {
    const s = smoothstep(u / 0.10);
    return { x: fromX, lift: s * 10, rot: s * -8 * face, anim: "sit" as TrickAnim };
  }
  if (u < 0.88) {
    const s = (u - 0.10) / 0.78;
    const circle = Math.sin(s * Math.PI * 2);
    const liftWave = Math.abs(Math.sin(s * Math.PI * 3));
    return {
      x: fromX + face * circle * 12,
      lift: 8 + liftWave * 10,
      rot: (-6 + circle * 10) * face,
      anim: "sit" as TrickAnim,
    };
  }
  const s = smoothstep((u - 0.88) / 0.12);
  return { x: fromX, lift: 5 * (1 - s), rot: -3 * (1 - s) * face, anim: "idle" as TrickAnim };
}

export function stoopPose(t: number, fromX: number, facing?: number) {
  const u = Math.max(0, Math.min(1, t / DUR.stoop));
  const face = facing == null ? 1 : facing;
  if (u < 0.12) {
    const s = smoothstep(u / 0.12);
    return { x: fromX, lift: s * 16, rot: s * -14 * face, anim: "sit" as TrickAnim };
  }
  if (u < 0.55) {
    const s = (u - 0.12) / 0.43;
    return {
      x: fromX + face * s * 8,
      lift: 16 - s * 18,
      rot: (-14 - s * 8) * face,
      anim: "sit" as TrickAnim,
    };
  }
  if (u < 0.88) {
    const s = (u - 0.55) / 0.33;
    const settle = Math.sin(s * Math.PI);
    return {
      x: fromX + face * 8,
      lift: -2 + settle * 4,
      rot: (-10 + settle * 6) * face,
      anim: "sit" as TrickAnim,
    };
  }
  const s = smoothstep((u - 0.88) / 0.12);
  return { x: fromX + face * 8 * (1 - s), lift: 2 * (1 - s), rot: -3 * (1 - s) * face, anim: "idle" as TrickAnim };
}

export function bindPose(t: number, fromX: number, facing?: number) {
  const u = Math.max(0, Math.min(1, t / DUR.bind));
  const face = facing == null ? 1 : facing;
  if (u < 0.12) {
    const s = smoothstep(u / 0.12);
    return { x: fromX, lift: s * 8, rot: s * 10 * face, anim: "play" as TrickAnim };
  }
  if (u < 0.86) {
    const clamp = Math.sin(t * 4.2) + 0.22 * Math.sin(t * 8.4);
    return {
      x: fromX + face * clamp * 2.5,
      lift: 6 + Math.abs(clamp) * 5,
      rot: (10 + clamp * 7) * face,
      anim: "play" as TrickAnim,
    };
  }
  const s = smoothstep((u - 0.86) / 0.14);
  return { x: fromX, lift: 3 * (1 - s), rot: 3 * (1 - s) * face, anim: "idle" as TrickAnim };
}

export function keeyerPose(t: number, fromX: number, facing?: number) {
  const u = Math.max(0, Math.min(1, t / DUR.keeyer));
  const face = facing == null ? 1 : facing;
  if (u < 0.12) {
    const s = smoothstep(u / 0.12);
    return { x: fromX, lift: s * 6, rot: s * 14 * face, anim: "talk" as TrickAnim };
  }
  if (u < 0.88) {
    const pulse = Math.sin(t * 3.6) + 0.26 * Math.sin(t * 7.2);
    return {
      x: fromX + face * pulse * 2.6,
      lift: 5 + Math.abs(pulse) * 5,
      rot: (14 + pulse * 7) * face,
      anim: "talk" as TrickAnim,
    };
  }
  const s = smoothstep((u - 0.88) / 0.12);
  return { x: fromX, lift: 3 * (1 - s), rot: 4 * (1 - s) * face, anim: "idle" as TrickAnim };
}

export function patagialPose(t: number, fromX: number, facing?: number) {
  const u = Math.max(0, Math.min(1, t / DUR.patagial));
  const face = facing == null ? 1 : facing;
  if (u < 0.12) {
    const s = smoothstep(u / 0.12);
    return { x: fromX, lift: s * 7, rot: s * -12 * face, anim: "sit" as TrickAnim };
  }
  if (u < 0.86) {
    const flash = Math.sin(t * 5.1) + 0.3 * Math.sin(t * 10.2);
    return {
      x: fromX + face * flash * 3,
      lift: 6 + Math.abs(flash) * 6,
      rot: (-12 + flash * 10) * face,
      anim: "sit" as TrickAnim,
    };
  }
  const s = smoothstep((u - 0.86) / 0.14);
  return { x: fromX, lift: 3 * (1 - s), rot: -3 * (1 - s) * face, anim: "idle" as TrickAnim };
}

export function towerPose(t: number, fromX: number, facing?: number) {
  const u = Math.max(0, Math.min(1, t / DUR.tower));
  const face = facing == null ? 1 : facing;
  if (u < 0.12) {
    const s = smoothstep(u / 0.12);
    return { x: fromX, lift: s * 6, rot: s * -6 * face, anim: "play" as TrickAnim };
  }
  if (u < 0.88) {
    const s = (u - 0.12) / 0.76;
    const spiral = Math.sin(s * Math.PI * 2.5);
    return {
      x: fromX + face * spiral * 8,
      lift: 6 + s * 16 + Math.abs(spiral) * 4,
      rot: (-6 + spiral * 9) * face,
      anim: "play" as TrickAnim,
    };
  }
  const s = smoothstep((u - 0.88) / 0.12);
  return { x: fromX, lift: 8 * (1 - s), rot: -3 * (1 - s) * face, anim: "idle" as TrickAnim };
}

export function stepTrick(trick: RedTailTrick, dt: number, flags?: TrickFlags): RedTailTrick {
  if (!trick || trick.phase === "done") return trick;
  const short =
    trick.kind === "kettle" ||
    trick.kind === "stoop" ||
    trick.kind === "bind" ||
    trick.kind === "keeyer" ||
    trick.kind === "patagial" ||
    trick.kind === "tower";
  if (shouldAbort(flags) && !short) {
    return { ...trick, phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true };
  }
  const next = { ...trick, t: trick.t + Math.max(0, dt) };
  if (next.kind === "buteo") {
    if (next.t < BUTEO_HOLD) {
      const pose = buteoPose(next.t);
      next.phase = "hold";
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = "sit";
      return next;
    }
    if (next.t < BUTEO_HOLD + RELEASE_S) {
      const pose = releasePose(next.t - BUTEO_HOLD);
      next.phase = "release";
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = "sit";
      return next;
    }
    return { ...next, phase: "done", lift: 0, rot: 0, anim: "idle" };
  }
  const hold = DUR[next.kind as RedTailTrickKind];
  const u = next.t / hold;
  const from = trick.fromX != null ? trick.fromX : trick.x;
  const poseFn: Record<string, (t: number, fromX: number, facing?: number) => { x: number; lift: number; rot: number; anim: TrickAnim }> = {
    kettle: kettlePose,
    stoop: stoopPose,
    bind: bindPose,
    keeyer: keeyerPose,
    patagial: patagialPose,
    tower: towerPose,
  };
  const pose = poseFn[next.kind](next.t, from, trick.facing);
  next.x = pose.x;
  next.lift = pose.lift;
  next.rot = pose.rot;
  next.anim = pose.anim;
  if (u >= 1) return { ...next, phase: "done", lift: 0, rot: 0, anim: "idle" };
  return next;
}
