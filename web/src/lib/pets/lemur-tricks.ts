/** Sun ground tricks while idle. House neighborly ring-tailed lemur (Lemur catta / Lemuridae) desk life -- bellybask / ringtailcurl / hopgallop / scentmark / lemurhush personality (bellybask sun-worship belly bask upright distinct from Skink sunbask and Iguana sunPose; ringtailcurl ring-tail curl signal distinct from Millipede coilcurl and Deer flagtail; hopgallop hop-gallop bound distinct from Rabbit hop and Grasshopper leap; scentmark wrist scent-mark rub desk-safe distinct from Hedgehog anoint and Skunk plume; long lemurhush Lemur catta hush -- never named wait; NOT Hang sloth; NOT Rui red panda; NOT primate generic Swing; guest slug Sun / key lemur -- accept lemur and sun; Thank-yous denssun / inksun / denslemur. Sleep, hide, leave, rest, card, ribbon still win. Same map as desktop lemur-tricks.js. Next: Swing / gibbon. Catalog 220. */
export const TRICK_KEY = "lemur";
export const TRICKS = ["bellybask", "ringtailcurl", "hopgallop", "scentmark", "lemurhush"] as const;
export const HAPPY = ["denssun", "inksun", "denslemur"] as const;
export type LemurTrickKind = (typeof TRICKS)[number];
export type LemurHappyKind = (typeof HAPPY)[number];
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

export type LemurTrick = {
  kind: LemurTrickKind;
  phase: TrickPhase;
  t: number;
  x: number;
  lift: number;
  rot: number;
  anim: TrickAnim;
  facing: 1 | -1;
  fromX: number;
  abort?: boolean;
};

export type LemurHappy = {
  kind: LemurHappyKind;
  happy: true;
  phase: HappyPhase;
  t: number;
  x: number;
  lift: number;
  rot: number;
  anim: TrickAnim;
  facing: 1 | -1;
  fromX: number;
  abort?: boolean;
};

export const HAPPY_DUR = { denssun: 2.58, inksun: 2.74, denslemur: 2.46 } as const;
export const LEMURHUSH_HOLD = 30.85;
export const RELEASE_S = 2.28;
export const DUR = { lemurhush: LEMURHUSH_HOLD + RELEASE_S, bellybask: 5.12, ringtailcurl: 4.96, hopgallop: 5.34, scentmark: 4.72 } as const;

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
export function nextTrickWait(justFinished: boolean, rand?: number, kind?: LemurTrickKind | string) {
  const roll = rand == null ? Math.random() : rand;
  if (kind === "lemurhush") return 196 + roll * 20;
  if (kind === "bellybask") return 23.0 + roll * 3.5;
  if (kind === "ringtailcurl") return 24.8 + roll * 3.6;
  if (kind === "hopgallop") return 21.6 + roll * 3.4;
  if (kind === "scentmark") return 25.2 + roll * 3.7;
  return justFinished ? 18.6 + roll * 3.0 : 13.8 + roll * 2.6;
}
export function pickTrick(rand?: number, musicOn?: boolean, lastKind?: LemurTrickKind | string) {
  if (musicOn) return "lemurhush";
  const roll = rand == null ? Math.random() : rand;
  if (lastKind === "lemurhush") {
    if (roll < 0.26) return "bellybask";
    if (roll < 0.5) return "ringtailcurl";
    if (roll < 0.74) return "hopgallop";
    return "scentmark";
  }
  if (lastKind === "bellybask") {
    if (roll < 0.26) return "lemurhush";
    if (roll < 0.5) return "ringtailcurl";
    if (roll < 0.74) return "hopgallop";
    return "scentmark";
  }
  if (lastKind === "ringtailcurl") {
    if (roll < 0.22) return "lemurhush";
    if (roll < 0.44) return "bellybask";
    if (roll < 0.68) return "hopgallop";
    return "scentmark";
  }
  if (roll < 0.2) return "lemurhush";
  if (roll < 0.4) return "bellybask";
  if (roll < 0.6) return "ringtailcurl";
  if (roll < 0.8) return "hopgallop";
  return "scentmark";
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
export function wantsThankYou(key: string | undefined | null) {
  return key === TRICK_KEY || key === "sun";
}
export function startThankYou(
  key: string | undefined | null,
  lastKind: LemurHappyKind | string | undefined,
  x: number,
  facing?: 1 | -1,
  flags?: TrickFlags
) {
  if (!wantsThankYou(key)) return null;
  if (!happyCanStart(flags || { cmd: "idle" })) return null;
  const pick = pickHappy(lastKind);
  return { happy: beginHappy(pick, x, facing), kind: pick };
}
export function pickHappy(lastKind?: LemurHappyKind | string, rand?: number) {
  const pool = HAPPY.filter((k) => k !== lastKind);
  const list = pool.length ? pool : [...HAPPY];
  const roll = rand == null ? Math.random() : rand;
  return list[Math.floor(roll * list.length)] || list[0];
}
export function beginHappy(kind: LemurHappyKind | string, x: number, facing?: 1 | -1): LemurHappy {
  const name = (HAPPY as readonly string[]).indexOf(kind) >= 0 ? (kind as LemurHappyKind) : "denssun";
  return {
    kind: name,
    happy: true,
    phase: "go",
    t: 0,
    x,
    lift: 0,
    rot: 0,
    anim: name === "denssun" ? "sit" : name === "inksun" ? "play" : "play",
    facing: facing == null ? 1 : facing,
    fromX: x,
  };
}

export function denssunPose(t: number) {
  const u = Math.max(0, Math.min(1, t / HAPPY_DUR.denssun));
  if (u < 0.15) {
    const s = u / 0.15;
    return { lift: s * 0.0042, rot: s * -0.14, anim: "sit" as TrickAnim };
  }
  if (u < 0.84) {
    const sway = Math.sin(((u - 0.15) / 0.69) * Math.PI * 2.25);
    return { lift: 0.0042 + Math.abs(sway) * 0.0012, rot: -0.14 + sway * 0.16, anim: "sit" as TrickAnim };
  }
  const s = (u - 0.84) / 0.16;
  return { lift: 0.0042 * (1 - s), rot: -0.14 * (1 - s), anim: "idle" as TrickAnim };
}
export function inksunPose(t: number) {
  const u = Math.max(0, Math.min(1, t / HAPPY_DUR.inksun));
  if (u < 0.12) {
    const s = u / 0.12;
    return { lift: s * 0.0031, rot: s * 0.22, anim: "play" as TrickAnim };
  }
  if (u < 0.82) {
    const ring = Math.sin(((u - 0.12) / 0.7) * Math.PI * 3.05);
    return { lift: 0.0031 + Math.abs(ring) * 0.0018, rot: 0.22 + ring * 0.24, anim: "play" as TrickAnim };
  }
  const s = (u - 0.82) / 0.18;
  return { lift: 0.0031 * (1 - s), rot: 0.22 * (1 - s), anim: "idle" as TrickAnim };
}
export function denslemurPose(t: number) {
  const u = Math.max(0, Math.min(1, t / HAPPY_DUR.denslemur));
  if (u < 0.14) {
    const s = u / 0.14;
    return { lift: s * -0.0014, rot: s * 0.15, anim: "play" as TrickAnim };
  }
  if (u < 0.83) {
    const hush = Math.sin(((u - 0.14) / 0.69) * Math.PI * 2.15);
    return { lift: -0.0014 + Math.abs(hush) * 0.0010, rot: 0.15 + hush * 0.14, anim: "play" as TrickAnim };
  }
  const s = (u - 0.83) / 0.17;
  return { lift: -0.0014 * (1 - s), rot: 0.15 * (1 - s), anim: "idle" as TrickAnim };
}
export function stepHappy(happy: LemurHappy, dt: number, flags?: TrickFlags): LemurHappy {
  if (!happy || happy.phase === "done") return happy;
  if (happyShouldAbort(flags)) {
    return { ...happy, phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true };
  }
  const next = { ...happy, t: happy.t + Math.max(0, dt) };
  const hold = HAPPY_DUR[next.kind];
  if (next.kind === "denssun") {
    const pose = denssunPose(next.t);
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "inksun") {
    const pose = inksunPose(next.t);
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else {
    const pose = denslemurPose(next.t);
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  }
  if (next.t >= hold) return { ...next, phase: "done", lift: 0, rot: 0, anim: "idle" };
  return next;
}
export function sleepHoldFrame(_key?: string, _frameCount?: number) {
  return null;
}
export function beginTrick(kind: LemurTrickKind | string, x: number, facing?: 1 | -1): LemurTrick {
  const k = (TRICKS as readonly string[]).includes(kind) ? (kind as LemurTrickKind) : "lemurhush";
  const anim: TrickAnim =
    k === "lemurhush"
      ? "sit"
      : k === "bellybask"
        ? "sit"
        : k === "ringtailcurl"
          ? "play"
          : k === "hopgallop"
            ? "walk"
            : k === "scentmark"
              ? "play"
              : "sit";
  return {
    kind: k,
    phase: k === "lemurhush" ? "hold" : "go",
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

export function lemurhushPose(t: number) {
  const breath = Math.sin(t * 0.00078) + 0.00022 * Math.sin(t * 0.0021);
  const hush = Math.abs(Math.sin(t * 0.00029));
  return { lift: -0.00018 + hush * 0.000042, rot: 0.004 + breath * 0.0020 };
}

export function releasePose(t: number) {
  const u = Math.max(0, Math.min(1, t / RELEASE_S));
  return { lift: -0.00020 * (1 - Math.sin(u * Math.PI * 0.5)), rot: 0.005 * (1 - u) };
}

export function bellybaskPose(t: number, fromX: number, facing?: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.bellybask));
  const face = facing == null ? 1 : facing;
  if (u < 0.16) {
    const s = smoothstep(u / 0.16);
    return { x: fromX + face * s * 0.00003, lift: s * 0.0068, rot: s * -0.28 * face, anim: "sit" as TrickAnim };
  }
  if (u < 0.82) {
    const bask = (u - 0.16) / 0.66;
    const glow = Math.sin(bask * Math.PI * 1.55);
    return {
      x: fromX + face * (0.00003 + glow * 0.00012),
      lift: 0.0068 + Math.abs(glow) * 0.0014,
      rot: (-0.28 + glow * 0.08) * face,
      anim: "sit" as TrickAnim,
    };
  }
  const s = smoothstep((u - 0.82) / 0.18);
  return { x: fromX + face * 0.00003 * (1 - s), lift: 0.0068 * (1 - s), rot: -0.28 * (1 - s) * face, anim: "idle" as TrickAnim };
}

export function ringtailcurlPose(t: number, fromX: number, facing?: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.ringtailcurl));
  const face = facing == null ? 1 : facing;
  if (u < 0.18) {
    const s = smoothstep(u / 0.18);
    return { x: fromX + face * s * 0.00005, lift: s * 0.0045, rot: s * 0.55 * face, anim: "play" as TrickAnim };
  }
  if (u < 0.78) {
    const signal = (u - 0.18) / 0.6;
    const curl = Math.sin(signal * Math.PI * 2.4);
    return {
      x: fromX + face * (0.00005 + curl * 0.00022),
      lift: 0.0045 + Math.abs(curl) * 0.0016,
      rot: (0.55 + curl * 0.28) * face,
      anim: "play" as TrickAnim,
    };
  }
  const s = smoothstep((u - 0.78) / 0.22);
  return { x: fromX + face * 0.00005 * (1 - s), lift: 0.0045 * (1 - s), rot: 0.55 * (1 - s) * face, anim: "idle" as TrickAnim };
}

export function hopgallopPose(t: number, fromX: number, facing?: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.hopgallop));
  const face = facing == null ? 1 : facing;
  if (u < 0.12) {
    const s = smoothstep(u / 0.12);
    return { x: fromX + face * s * 0.0008, lift: s * -0.0012, rot: s * -0.12 * face, anim: "walk" as TrickAnim };
  }
  if (u < 0.38) {
    const s = smoothstep((u - 0.12) / 0.26);
    const hop = Math.sin(s * Math.PI);
    return {
      x: fromX + face * (0.0008 + s * 0.011),
      lift: -0.0012 + hop * 0.0085,
      rot: (-0.12 + s * 0.18) * face,
      anim: "walk" as TrickAnim,
    };
  }
  if (u < 0.52) {
    const plant = Math.sin(((u - 0.38) / 0.14) * Math.PI);
    return {
      x: fromX + face * (0.0118 + plant * 0.0003),
      lift: Math.abs(plant) * 0.0010,
      rot: (0.06 + plant * 0.05) * face,
      anim: "walk" as TrickAnim,
    };
  }
  if (u < 0.82) {
    const s = smoothstep((u - 0.52) / 0.3);
    const hop = Math.sin(s * Math.PI);
    return {
      x: fromX + face * (0.0121 + s * 0.0105),
      lift: hop * 0.0078,
      rot: (0.06 - s * 0.1) * face,
      anim: "walk" as TrickAnim,
    };
  }
  const s = smoothstep((u - 0.82) / 0.18);
  return { x: fromX + face * (0.0226 - s * 0.0012), lift: 0.0004 * (1 - s), rot: -0.04 * (1 - s) * face, anim: "idle" as TrickAnim };
}

export function scentmarkPose(t: number, fromX: number, facing?: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.scentmark));
  const face = facing == null ? 1 : facing;
  if (u < 0.14) {
    const s = smoothstep(u / 0.14);
    return { x: fromX + face * s * 0.0004, lift: s * -0.0028, rot: s * 0.36 * face, anim: "play" as TrickAnim };
  }
  if (u < 0.78) {
    const rub = (u - 0.14) / 0.64;
    const wipe = Math.sin(rub * Math.PI * 5.2);
    return {
      x: fromX + face * (0.0004 + wipe * 0.00055),
      lift: -0.0028 + Math.abs(wipe) * 0.0007,
      rot: (0.36 + wipe * 0.14) * face,
      anim: "play" as TrickAnim,
    };
  }
  const s = smoothstep((u - 0.78) / 0.22);
  return { x: fromX + face * 0.0004 * (1 - s), lift: -0.0028 * (1 - s), rot: 0.36 * (1 - s) * face, anim: "idle" as TrickAnim };
}

export function stepTrick(trick: LemurTrick, dt: number, flags?: TrickFlags): LemurTrick {
  if (!trick || trick.phase === "done") return trick;
  if (shouldAbort(flags) && trick.kind !== "bellybask" && trick.kind !== "ringtailcurl" && trick.kind !== "hopgallop" && trick.kind !== "scentmark") {
    return { ...trick, phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true };
  }
  const next = { ...trick, t: trick.t + Math.max(0, dt) };
  if (next.kind === "lemurhush") {
    if (next.t < LEMURHUSH_HOLD) {
      const pose = lemurhushPose(next.t);
      next.phase = "hold";
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = "sit";
      return next;
    }
    if (next.t < LEMURHUSH_HOLD + RELEASE_S) {
      const pose = releasePose(next.t - LEMURHUSH_HOLD);
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
  if (next.kind === "bellybask") {
    const pose = bellybaskPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "ringtailcurl") {
    const pose = ringtailcurlPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "hopgallop") {
    const pose = hopgallopPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else {
    const pose = scentmarkPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  }
  if (u >= 1) return { ...next, phase: "done", lift: 0, rot: 0, anim: "idle" };
  return next;
}
