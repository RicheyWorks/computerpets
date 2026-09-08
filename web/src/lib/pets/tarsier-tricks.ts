/** Gaze ground tricks while idle. House neighborly Philippine tarsier (Tarsius syrichta / Carlito syrichta / Tarsiidae) desk life -- eyeswivel / clingleap / insectpounce / stillstare / tarsiushush personality; NOT Boom/Sun/Hang/Owl/bushbaby/Rui; guest slug Gaze / key tarsier -- accept tarsier and gaze; Thank-yous densgaze / inkgaze / denstarsius. Sleep, hide, leave, rest, card, ribbon still win. Same map as desktop tarsier-tricks.js. Next: Still / potto. Catalog 220. */
export const TRICK_KEY = "tarsier";
export const TRICKS = ["eyeswivel", "clingleap", "insectpounce", "stillstare", "tarsiushush"] as const;
export const HAPPY = ["densgaze", "inkgaze", "denstarsius"] as const;
export type TarsierTrickKind = (typeof TRICKS)[number];
export type TarsierHappyKind = (typeof HAPPY)[number];
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

export type TarsierTrick = {
  kind: TarsierTrickKind;
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

export type TarsierHappy = {
  kind: TarsierHappyKind;
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

export const HAPPY_DUR = { densgaze: 2.64, inkgaze: 2.81, denstarsius: 2.49 } as const;
export const TARSIUSHUSH_HOLD = 31.62;
export const RELEASE_S = 2.36;
export const DUR = { tarsiushush: TARSIUSHUSH_HOLD + RELEASE_S, eyeswivel: 5.52, clingleap: 5.22, insectpounce: 5.08, stillstare: 5.36 } as const;

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
export function nextTrickWait(justFinished: boolean, rand?: number, kind?: TarsierTrickKind | string) {
  const roll = rand == null ? Math.random() : rand;
  if (kind === "tarsiushush") return 203 + roll * 22;
  if (kind === "eyeswivel") return 24.2 + roll * 3.6;
  if (kind === "clingleap") return 23.4 + roll * 3.5;
  if (kind === "insectpounce") return 22.6 + roll * 3.4;
  if (kind === "stillstare") return 25.8 + roll * 3.7;
  return justFinished ? 18.6 + roll * 2.9 : 13.9 + roll * 2.5;
}
export function pickTrick(rand?: number, musicOn?: boolean, lastKind?: TarsierTrickKind | string) {
  if (musicOn) return "tarsiushush";
  const roll = rand == null ? Math.random() : rand;
  if (lastKind === "tarsiushush") {
    if (roll < 0.26) return "eyeswivel";
    if (roll < 0.5) return "clingleap";
    if (roll < 0.74) return "insectpounce";
    return "stillstare";
  }
  if (lastKind === "eyeswivel") {
    if (roll < 0.26) return "tarsiushush";
    if (roll < 0.5) return "clingleap";
    if (roll < 0.74) return "insectpounce";
    return "stillstare";
  }
  if (lastKind === "clingleap") {
    if (roll < 0.22) return "tarsiushush";
    if (roll < 0.44) return "eyeswivel";
    if (roll < 0.68) return "insectpounce";
    return "stillstare";
  }
  if (roll < 0.2) return "tarsiushush";
  if (roll < 0.4) return "eyeswivel";
  if (roll < 0.6) return "clingleap";
  if (roll < 0.8) return "insectpounce";
  return "stillstare";
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
  return key === TRICK_KEY || key === "gaze";
}
export function startThankYou(
  key: string | undefined | null,
  lastKind: TarsierHappyKind | string | undefined,
  x: number,
  facing?: 1 | -1,
  flags?: TrickFlags
) {
  if (!wantsThankYou(key)) return null;
  if (!happyCanStart(flags || { cmd: "idle" })) return null;
  const pick = pickHappy(lastKind);
  return { happy: beginHappy(pick, x, facing), kind: pick };
}
export function pickHappy(lastKind?: TarsierHappyKind | string, rand?: number) {
  const pool = HAPPY.filter((k) => k !== lastKind);
  const list = pool.length ? pool : [...HAPPY];
  const roll = rand == null ? Math.random() : rand;
  return list[Math.floor(roll * list.length)] || list[0];
}
export function beginHappy(kind: TarsierHappyKind | string, x: number, facing?: 1 | -1): TarsierHappy {
  const name = (HAPPY as readonly string[]).indexOf(kind) >= 0 ? (kind as TarsierHappyKind) : "densgaze";
  return {
    kind: name,
    happy: true,
    phase: "go",
    t: 0,
    x,
    lift: 0,
    rot: 0,
    anim: name === "densgaze" ? "sit" : name === "inkgaze" ? "play" : "play",
    facing: facing == null ? 1 : facing,
    fromX: x,
  };
}

export function densgazePose(t: number) {
  const u = Math.max(0, Math.min(1, t / HAPPY_DUR.densgaze));
  if (u < 0.15) {
    const s = u / 0.15;
    return { lift: s * 0.0038, rot: s * -0.18, anim: "sit" as TrickAnim };
  }
  if (u < 0.84) {
    const sway = Math.sin(((u - 0.15) / 0.69) * Math.PI * 2.22);
    return { lift: 0.0038 + Math.abs(sway) * 0.0011, rot: -0.18 + sway * 0.19, anim: "sit" as TrickAnim };
  }
  const s = (u - 0.84) / 0.16;
  return { lift: 0.0038 * (1 - s), rot: -0.18 * (1 - s), anim: "idle" as TrickAnim };
}
export function inkgazePose(t: number) {
  const u = Math.max(0, Math.min(1, t / HAPPY_DUR.inkgaze));
  if (u < 0.12) {
    const s = u / 0.12;
    return { lift: s * 0.0035, rot: s * 0.26, anim: "play" as TrickAnim };
  }
  if (u < 0.82) {
    const arc = Math.sin(((u - 0.12) / 0.7) * Math.PI * 3.12);
    return { lift: 0.0035 + Math.abs(arc) * 0.0020, rot: 0.26 + arc * 0.28, anim: "play" as TrickAnim };
  }
  const s = (u - 0.82) / 0.18;
  return { lift: 0.0035 * (1 - s), rot: 0.26 * (1 - s), anim: "idle" as TrickAnim };
}
export function denstarsiusPose(t: number) {
  const u = Math.max(0, Math.min(1, t / HAPPY_DUR.denstarsius));
  if (u < 0.14) {
    const s = u / 0.14;
    return { lift: s * -0.0016, rot: s * 0.17, anim: "play" as TrickAnim };
  }
  if (u < 0.83) {
    const hush = Math.sin(((u - 0.14) / 0.69) * Math.PI * 2.05);
    return { lift: -0.0016 + Math.abs(hush) * 0.0010, rot: 0.17 + hush * 0.16, anim: "play" as TrickAnim };
  }
  const s = (u - 0.83) / 0.17;
  return { lift: -0.0016 * (1 - s), rot: 0.17 * (1 - s), anim: "idle" as TrickAnim };
}
export function stepHappy(happy: TarsierHappy, dt: number, flags?: TrickFlags): TarsierHappy {
  if (!happy || happy.phase === "done") return happy;
  if (happyShouldAbort(flags)) {
    return { ...happy, phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true };
  }
  const next = { ...happy, t: happy.t + Math.max(0, dt) };
  const hold = HAPPY_DUR[next.kind];
  if (next.kind === "densgaze") {
    const pose = densgazePose(next.t);
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "inkgaze") {
    const pose = inkgazePose(next.t);
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else {
    const pose = denstarsiusPose(next.t);
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
export function beginTrick(kind: TarsierTrickKind | string, x: number, facing?: 1 | -1): TarsierTrick {
  const k = (TRICKS as readonly string[]).includes(kind) ? (kind as TarsierTrickKind) : "tarsiushush";
  const anim: TrickAnim =
    k === "tarsiushush"
      ? "sit"
      : k === "eyeswivel"
        ? "sit"
        : k === "clingleap"
          ? "play"
          : k === "stillstare"
            ? "sit"
            : k === "insectpounce"
              ? "play"
              : "sit";
  return {
    kind: k,
    phase: k === "tarsiushush" ? "hold" : "go",
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

export function tarsiushushPose(t: number) {
  const breath = Math.sin(t * 0.00056) + 0.00019 * Math.sin(t * 0.00158);
  const hush = Math.abs(Math.sin(t * 0.00027));
  return { lift: -0.00024 + hush * 0.00005, rot: 0.0018 + breath * 0.0013 };
}
export function releasePose(t: number) {
  const u = Math.max(0, Math.min(1, t / RELEASE_S));
  return { lift: -0.0002 * (1 - Math.sin(u * Math.PI * 0.5)), rot: 0.0034 * (1 - u) };
}

export function eyeswivelPose(t: number, fromX: number, facing?: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.eyeswivel));
  const face = facing == null ? 1 : facing;
  if (u < 0.16) {
    const s = smoothstep(u / 0.16);
    return { x: fromX + face * s * 0.0002, lift: s * 0.0012, rot: s * -0.42 * face, anim: "sit" as TrickAnim };
  }
  if (u < 0.84) {
    const swivel = Math.sin(((u - 0.16) / 0.68) * Math.PI * 2.45);
    return {
      x: fromX + face * (0.0002 + Math.abs(swivel) * 0.00015),
      lift: 0.0012 + Math.abs(swivel) * 0.00045,
      rot: (-0.42 + swivel * 0.78) * face,
      anim: "sit" as TrickAnim,
    };
  }
  const s = smoothstep((u - 0.84) / 0.16);
  return { x: fromX + face * 0.00025 * (1 - s), lift: 0.0012 * (1 - s), rot: -0.42 * (1 - s) * face, anim: "idle" as TrickAnim };
}
export function clingleapPose(t: number, fromX: number, facing?: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.clingleap));
  const face = facing == null ? 1 : facing;
  if (u < 0.22) {
    const s = smoothstep(u / 0.22);
    return { x: fromX + face * s * -0.0004, lift: s * 0.0115, rot: s * 0.14 * face, anim: "sit" as TrickAnim };
  }
  if (u < 0.48) {
    const s = smoothstep((u - 0.22) / 0.26);
    return { x: fromX + face * (-0.0004 + s * 0.0042), lift: 0.0115 + s * 0.0068, rot: (0.14 - s * 0.08) * face, anim: "play" as TrickAnim };
  }
  if (u < 0.78) {
    const land = Math.sin(((u - 0.48) / 0.3) * Math.PI);
    return {
      x: fromX + face * (0.0038 + land * 0.0006),
      lift: 0.0183 - land * 0.012,
      rot: (0.06 + land * 0.1) * face,
      anim: "play" as TrickAnim,
    };
  }
  const s = smoothstep((u - 0.78) / 0.22);
  return { x: fromX + face * 0.0042 * (1 - s), lift: 0.006 * (1 - s), rot: 0.08 * (1 - s) * face, anim: "idle" as TrickAnim };
}
export function insectpouncePose(t: number, fromX: number, facing?: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.insectpounce));
  const face = facing == null ? 1 : facing;
  if (u < 0.2) {
    const s = smoothstep(u / 0.2);
    return { x: fromX + face * s * -0.0008, lift: s * -0.0044, rot: s * -0.16 * face, anim: "sit" as TrickAnim };
  }
  if (u < 0.38) {
    const s = smoothstep((u - 0.2) / 0.18);
    return { x: fromX + face * (-0.0008 + s * 0.0055), lift: -0.0044 + s * 0.0135, rot: (-0.16 + s * 0.22) * face, anim: "play" as TrickAnim };
  }
  if (u < 0.72) {
    const snap = Math.sin(((u - 0.38) / 0.34) * Math.PI * 2.4);
    return {
      x: fromX + face * (0.0047 + Math.abs(snap) * 0.0004),
      lift: 0.0091 + Math.abs(snap) * 0.0015,
      rot: (0.06 + snap * 0.12) * face,
      anim: "play" as TrickAnim,
    };
  }
  const s = smoothstep((u - 0.72) / 0.28);
  return { x: fromX + face * 0.0048 * (1 - s), lift: 0.0091 * (1 - s), rot: 0.06 * (1 - s) * face, anim: "idle" as TrickAnim };
}
export function stillstarePose(t: number, fromX: number, facing?: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.stillstare));
  const face = facing == null ? 1 : facing;
  if (u < 0.18) {
    const s = smoothstep(u / 0.18);
    return { x: fromX + face * s * 0.00015, lift: s * 0.0006, rot: s * 0.08 * face, anim: "sit" as TrickAnim };
  }
  if (u < 0.86) {
    const micro = Math.sin(((u - 0.18) / 0.68) * Math.PI * 1.15);
    return {
      x: fromX + face * (0.00015 + micro * 0.00005),
      lift: 0.0006 + Math.abs(micro) * 0.00018,
      rot: (0.08 + micro * 0.015) * face,
      anim: "sit" as TrickAnim,
    };
  }
  const s = smoothstep((u - 0.86) / 0.14);
  return { x: fromX + face * 0.00015 * (1 - s), lift: 0.0006 * (1 - s), rot: 0.08 * (1 - s) * face, anim: "idle" as TrickAnim };
}
export function stepTrick(trick: TarsierTrick, dt: number, flags?: TrickFlags): TarsierTrick {
  if (!trick || trick.phase === "done") return trick;
  if (shouldAbort(flags) && trick.kind !== "eyeswivel" && trick.kind !== "clingleap" && trick.kind !== "insectpounce" && trick.kind !== "stillstare") {
    return { ...trick, phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true };
  }
  const next = { ...trick, t: trick.t + Math.max(0, dt) };
  if (next.kind === "tarsiushush") {
    if (next.t < TARSIUSHUSH_HOLD) {
      const pose = tarsiushushPose(next.t);
      next.phase = "hold";
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = "sit";
      return next;
    }
    if (next.t < TARSIUSHUSH_HOLD + RELEASE_S) {
      const pose = releasePose(next.t - TARSIUSHUSH_HOLD);
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
  if (next.kind === "eyeswivel") {
    const pose = eyeswivelPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "clingleap") {
    const pose = clingleapPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "stillstare") {
    const pose = stillstarePose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else {
    const pose = insectpouncePose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  }
  if (u >= 1) return { ...next, phase: "done", lift: 0, rot: 0, anim: "idle" };
  return next;
}
