/** Boom ground tricks while idle. House neighborly mantled howler (Alouatta palliata / Atelidae Alouattinae) desk life -- hyoidboom / tailbrace / canopylounge / leafchew / alouattahush personality; NOT Glide/Sail/Swing/Sun/Rui; guest slug Boom / key howler -- accept howler and boom; Thank-yous densboom / inkboom / densalouatta. Sleep, hide, leave, rest, card, ribbon still win. Same map as desktop howler-tricks.js. Next: Gaze / tarsier. Catalog 220. */
export const TRICK_KEY = "howler";
export const TRICKS = ["hyoidboom", "tailbrace", "canopylounge", "leafchew", "alouattahush"] as const;
export const HAPPY = ["densboom", "inkboom", "densalouatta"] as const;
export type HowlerTrickKind = (typeof TRICKS)[number];
export type HowlerHappyKind = (typeof HAPPY)[number];
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

export type HowlerTrick = {
  kind: HowlerTrickKind;
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

export type HowlerHappy = {
  kind: HowlerHappyKind;
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

export const HAPPY_DUR = { densboom: 2.62, inkboom: 2.79, densalouatta: 2.51 } as const;
export const ALOUATTAHUSH_HOLD = 31.48;
export const RELEASE_S = 2.34;
export const DUR = { alouattahush: ALOUATTAHUSH_HOLD + RELEASE_S, hyoidboom: 5.44, tailbrace: 5.18, canopylounge: 5.31, leafchew: 5.04 } as const;

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
export function nextTrickWait(justFinished: boolean, rand?: number, kind?: HowlerTrickKind | string) {
  const roll = rand == null ? Math.random() : rand;
  if (kind === "alouattahush") return 201 + roll * 22;
  if (kind === "hyoidboom") return 24.6 + roll * 3.7;
  if (kind === "tailbrace") return 23.9 + roll * 3.4;
  if (kind === "canopylounge") return 26.1 + roll * 3.6;
  if (kind === "leafchew") return 22.8 + roll * 3.5;
  return justFinished ? 18.6 + roll * 2.9 : 13.9 + roll * 2.5;
}
export function pickTrick(rand?: number, musicOn?: boolean, lastKind?: HowlerTrickKind | string) {
  if (musicOn) return "alouattahush";
  const roll = rand == null ? Math.random() : rand;
  if (lastKind === "alouattahush") {
    if (roll < 0.26) return "hyoidboom";
    if (roll < 0.5) return "tailbrace";
    if (roll < 0.74) return "canopylounge";
    return "leafchew";
  }
  if (lastKind === "hyoidboom") {
    if (roll < 0.26) return "alouattahush";
    if (roll < 0.5) return "tailbrace";
    if (roll < 0.74) return "canopylounge";
    return "leafchew";
  }
  if (lastKind === "tailbrace") {
    if (roll < 0.22) return "alouattahush";
    if (roll < 0.44) return "hyoidboom";
    if (roll < 0.68) return "canopylounge";
    return "leafchew";
  }
  if (roll < 0.2) return "alouattahush";
  if (roll < 0.4) return "hyoidboom";
  if (roll < 0.6) return "tailbrace";
  if (roll < 0.8) return "canopylounge";
  return "leafchew";
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
  return key === TRICK_KEY || key === "boom";
}
export function startThankYou(
  key: string | undefined | null,
  lastKind: HowlerHappyKind | string | undefined,
  x: number,
  facing?: 1 | -1,
  flags?: TrickFlags
) {
  if (!wantsThankYou(key)) return null;
  if (!happyCanStart(flags || { cmd: "idle" })) return null;
  const pick = pickHappy(lastKind);
  return { happy: beginHappy(pick, x, facing), kind: pick };
}
export function pickHappy(lastKind?: HowlerHappyKind | string, rand?: number) {
  const pool = HAPPY.filter((k) => k !== lastKind);
  const list = pool.length ? pool : [...HAPPY];
  const roll = rand == null ? Math.random() : rand;
  return list[Math.floor(roll * list.length)] || list[0];
}
export function beginHappy(kind: HowlerHappyKind | string, x: number, facing?: 1 | -1): HowlerHappy {
  const name = (HAPPY as readonly string[]).indexOf(kind) >= 0 ? (kind as HowlerHappyKind) : "densboom";
  return {
    kind: name,
    happy: true,
    phase: "go",
    t: 0,
    x,
    lift: 0,
    rot: 0,
    anim: name === "densboom" ? "sit" : name === "inkboom" ? "play" : "play",
    facing: facing == null ? 1 : facing,
    fromX: x,
  };
}

export function densboomPose(t: number) {
  const u = Math.max(0, Math.min(1, t / HAPPY_DUR.densboom));
  if (u < 0.15) {
    const s = u / 0.15;
    return { lift: s * 0.0040, rot: s * -0.13, anim: "sit" as TrickAnim };
  }
  if (u < 0.84) {
    const sway = Math.sin(((u - 0.15) / 0.69) * Math.PI * 2.18);
    return { lift: 0.0040 + Math.abs(sway) * 0.0012, rot: -0.13 + sway * 0.15, anim: "sit" as TrickAnim };
  }
  const s = (u - 0.84) / 0.16;
  return { lift: 0.0040 * (1 - s), rot: -0.13 * (1 - s), anim: "idle" as TrickAnim };
}
export function inkboomPose(t: number) {
  const u = Math.max(0, Math.min(1, t / HAPPY_DUR.inkboom));
  if (u < 0.12) {
    const s = u / 0.12;
    return { lift: s * 0.0031, rot: s * 0.22, anim: "play" as TrickAnim };
  }
  if (u < 0.82) {
    const arc = Math.sin(((u - 0.12) / 0.7) * Math.PI * 2.95);
    return { lift: 0.0031 + Math.abs(arc) * 0.0018, rot: 0.22 + arc * 0.24, anim: "play" as TrickAnim };
  }
  const s = (u - 0.82) / 0.18;
  return { lift: 0.0031 * (1 - s), rot: 0.22 * (1 - s), anim: "idle" as TrickAnim };
}
export function densalouattaPose(t: number) {
  const u = Math.max(0, Math.min(1, t / HAPPY_DUR.densalouatta));
  if (u < 0.14) {
    const s = u / 0.14;
    return { lift: s * -0.0014, rot: s * 0.15, anim: "play" as TrickAnim };
  }
  if (u < 0.83) {
    const hush = Math.sin(((u - 0.14) / 0.69) * Math.PI * 2.12);
    return { lift: -0.0014 + Math.abs(hush) * 0.0010, rot: 0.15 + hush * 0.14, anim: "play" as TrickAnim };
  }
  const s = (u - 0.83) / 0.17;
  return { lift: -0.0014 * (1 - s), rot: 0.15 * (1 - s), anim: "idle" as TrickAnim };
}
export function stepHappy(happy: HowlerHappy, dt: number, flags?: TrickFlags): HowlerHappy {
  if (!happy || happy.phase === "done") return happy;
  if (happyShouldAbort(flags)) {
    return { ...happy, phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true };
  }
  const next = { ...happy, t: happy.t + Math.max(0, dt) };
  const hold = HAPPY_DUR[next.kind];
  if (next.kind === "densboom") {
    const pose = densboomPose(next.t);
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "inkboom") {
    const pose = inkboomPose(next.t);
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else {
    const pose = densalouattaPose(next.t);
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
export function beginTrick(kind: HowlerTrickKind | string, x: number, facing?: 1 | -1): HowlerTrick {
  const k = (TRICKS as readonly string[]).includes(kind) ? (kind as HowlerTrickKind) : "alouattahush";
  const anim: TrickAnim =
    k === "alouattahush"
      ? "sit"
      : k === "hyoidboom"
        ? "sit"
        : k === "tailbrace"
          ? "sit"
          : k === "leafchew"
            ? "sit"
            : k === "canopylounge"
              ? "sit"
              : "sit";
  return {
    kind: k,
    phase: k === "alouattahush" ? "hold" : "go",
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

export function alouattahushPose(t: number) {
  const breath = Math.sin(t * 0.00058) + 0.00021 * Math.sin(t * 0.00164);
  const hush = Math.abs(Math.sin(t * 0.00029));
  return { lift: -0.00022 + hush * 0.00006, rot: 0.0021 + breath * 0.0015 };
}
export function releasePose(t: number) {
  const u = Math.max(0, Math.min(1, t / RELEASE_S));
  return { lift: -0.0002 * (1 - Math.sin(u * Math.PI * 0.5)), rot: 0.0034 * (1 - u) };
}

export function hyoidboomPose(t: number, fromX: number, facing?: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.hyoidboom));
  const face = facing == null ? 1 : facing;
  if (u < 0.18) {
    const s = smoothstep(u / 0.18);
    return { x: fromX + face * s * 0.0003, lift: s * 0.0038, rot: s * -0.22 * face, anim: "sit" as TrickAnim };
  }
  if (u < 0.42) {
    const s = smoothstep((u - 0.18) / 0.24);
    return { x: fromX + face * (0.0003 + s * 0.0004), lift: 0.0038 + s * 0.0046, rot: (-0.22 - s * 0.18) * face, anim: "play" as TrickAnim };
  }
  if (u < 0.78) {
    const boom = Math.sin(((u - 0.42) / 0.36) * Math.PI * 2.15);
    return {
      x: fromX + face * (0.0007 + Math.abs(boom) * 0.00035),
      lift: 0.0084 + Math.abs(boom) * 0.0016,
      rot: (-0.4 + boom * 0.08) * face,
      anim: "play" as TrickAnim,
    };
  }
  const s = smoothstep((u - 0.78) / 0.22);
  return { x: fromX + face * 0.0008 * (1 - s), lift: 0.0084 * (1 - s), rot: -0.4 * (1 - s) * face, anim: "idle" as TrickAnim };
}
export function tailbracePose(t: number, fromX: number, facing?: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.tailbrace));
  const face = facing == null ? 1 : facing;
  if (u < 0.2) {
    const s = smoothstep(u / 0.2);
    return { x: fromX + face * s * -0.0006, lift: s * -0.0032, rot: s * 0.32 * face, anim: "sit" as TrickAnim };
  }
  if (u < 0.72) {
    const wrap = Math.sin(((u - 0.2) / 0.52) * Math.PI * 1.9);
    return {
      x: fromX + face * (-0.0006 + wrap * 0.0005),
      lift: -0.0032 + Math.abs(wrap) * 0.0014,
      rot: (0.32 + wrap * 0.14) * face,
      anim: "sit" as TrickAnim,
    };
  }
  const s = smoothstep((u - 0.72) / 0.28);
  return { x: fromX + face * -0.0006 * (1 - s), lift: -0.0032 * (1 - s), rot: 0.32 * (1 - s) * face, anim: "idle" as TrickAnim };
}
export function canopyloungePose(t: number, fromX: number, facing?: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.canopylounge));
  const face = facing == null ? 1 : facing;
  if (u < 0.22) {
    const s = smoothstep(u / 0.22);
    return { x: fromX + face * s * 0.0005, lift: s * -0.0068, rot: s * 0.18 * face, anim: "sit" as TrickAnim };
  }
  if (u < 0.8) {
    const sprawl = Math.sin(((u - 0.22) / 0.58) * Math.PI * 1.35);
    return {
      x: fromX + face * (0.0005 + Math.abs(sprawl) * 0.0003),
      lift: -0.0068 + Math.abs(sprawl) * 0.0009,
      rot: (0.18 + sprawl * 0.09) * face,
      anim: "sit" as TrickAnim,
    };
  }
  const s = smoothstep((u - 0.8) / 0.2);
  return { x: fromX + face * 0.0005 * (1 - s), lift: -0.0068 * (1 - s), rot: 0.18 * (1 - s) * face, anim: "idle" as TrickAnim };
}
export function leafchewPose(t: number, fromX: number, facing?: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.leafchew));
  const face = facing == null ? 1 : facing;
  if (u < 0.14) {
    const s = smoothstep(u / 0.14);
    return { x: fromX + face * s * 0.0009, lift: s * 0.0016, rot: s * 0.12 * face, anim: "sit" as TrickAnim };
  }
  if (u < 0.86) {
    const chew = Math.sin(((u - 0.14) / 0.72) * Math.PI * 4.4);
    return {
      x: fromX + face * (0.0009 + Math.abs(chew) * 0.00055),
      lift: 0.0016 + Math.abs(chew) * 0.0011,
      rot: (0.12 + chew * 0.11) * face,
      anim: "play" as TrickAnim,
    };
  }
  const s = smoothstep((u - 0.86) / 0.14);
  return { x: fromX + face * 0.0011 * (1 - s), lift: 0.0016 * (1 - s), rot: 0.12 * (1 - s) * face, anim: "idle" as TrickAnim };
}
export function stepTrick(trick: HowlerTrick, dt: number, flags?: TrickFlags): HowlerTrick {
  if (!trick || trick.phase === "done") return trick;
  if (shouldAbort(flags) && trick.kind !== "hyoidboom" && trick.kind !== "tailbrace" && trick.kind !== "canopylounge" && trick.kind !== "leafchew") {
    return { ...trick, phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true };
  }
  const next = { ...trick, t: trick.t + Math.max(0, dt) };
  if (next.kind === "alouattahush") {
    if (next.t < ALOUATTAHUSH_HOLD) {
      const pose = alouattahushPose(next.t);
      next.phase = "hold";
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = "sit";
      return next;
    }
    if (next.t < ALOUATTAHUSH_HOLD + RELEASE_S) {
      const pose = releasePose(next.t - ALOUATTAHUSH_HOLD);
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
  if (next.kind === "hyoidboom") {
    const pose = hyoidboomPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "tailbrace") {
    const pose = tailbracePose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "leafchew") {
    const pose = leafchewPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else {
    const pose = canopyloungePose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  }
  if (u >= 1) return { ...next, phase: "done", lift: 0, rot: 0, anim: "idle" };
  return next;
}
