/** Banner ground tricks while idle. House neighborly Papilionidae / Papilio glaucus Eastern Tiger Swallowtail desk life -- wingbanner / puddlesip / flutterhop / tailglidesettle / papiliohush personality (wingbanner forewing open-close bask pulse distinct from monarch asclepias/oyamel and luna plumose/lunule; puddlesip mineral puddle-sip desk cue distinct from honeybee proboscis/figure and hummingbird sip; flutterhop short flutter desk hop distinct from cricket hopskip and grasshopper wingbanner; tailglidesettle hindwing-tail flick then soft glide settle distinct from squirrel tailflick and luna stream; long papiliohush Papilio swallowtail hush -- never named wait; not Milk monarch; not Ghost luna; not Dart darner; not Comb honeybee; not Vault grasshopper; not Blade katydid; not Chirp cricket; window-play and Call Banner leave swallowtail alone; guest slug Banner / key swallowtail -- accept "swallowtail" and "banner"; Thank-yous densbanner / inkbanner / denspapilio. Feed-happy after eat. Sleep, hide, leave, rest, card, ribbon still win. Same map as web swallowtail-tricks.ts. Next: Jewel / jewelwing. Catalog 220. */
export const TRICK_KEY = "swallowtail";
export const TRICKS = ["wingbanner", "puddlesip", "flutterhop", "tailglidesettle", "papiliohush"] as const;
export const HAPPY = ["densbanner", "inkbanner", "denspapilio"] as const;
export type SwallowtailTrickKind = (typeof TRICKS)[number];
export type SwallowtailHappyKind = (typeof HAPPY)[number];
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

export type SwallowtailTrick = {
  kind: SwallowtailTrickKind;
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

export type SwallowtailHappy = {
  kind: SwallowtailHappyKind;
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

export const HAPPY_DUR = { densbanner: 2.52, inkbanner: 2.66, denspapilio: 2.40 } as const;
export const PAPILIOHUSH_HOLD = 28.40;
export const RELEASE_S = 2.12;
export const DUR = { papiliohush: PAPILIOHUSH_HOLD + RELEASE_S, wingbanner: 4.28, puddlesip: 4.55, flutterhop: 3.85, tailglidesettle: 4.62 } as const;

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
export function nextTrickWait(justFinished: boolean, rand?: number, kind?: SwallowtailTrickKind | string) {
  const roll = rand == null ? Math.random() : rand;
  if (kind === "papiliohush") return 188 + roll * 18;
  if (kind === "wingbanner") return 22.4 + roll * 3.6;
  if (kind === "puddlesip") return 25.8 + roll * 4.2;
  if (kind === "flutterhop") return 21.2 + roll * 3.4;
  if (kind === "tailglidesettle") return 24.6 + roll * 3.9;
  return justFinished ? 18.6 + roll * 2.9 : 14.0 + roll * 2.5;
}
export function pickTrick(rand?: number, musicOn?: boolean, lastKind?: SwallowtailTrickKind | string) {
  if (musicOn) return "papiliohush";
  const roll = rand == null ? Math.random() : rand;
  if (lastKind === "papiliohush") {
    if (roll < 0.26) return "wingbanner";
    if (roll < 0.5) return "puddlesip";
    if (roll < 0.74) return "flutterhop";
    return "tailglidesettle";
  }
  if (lastKind === "wingbanner") {
    if (roll < 0.26) return "papiliohush";
    if (roll < 0.5) return "puddlesip";
    if (roll < 0.74) return "flutterhop";
    return "tailglidesettle";
  }
  if (lastKind === "puddlesip") {
    if (roll < 0.22) return "papiliohush";
    if (roll < 0.44) return "wingbanner";
    if (roll < 0.68) return "flutterhop";
    return "tailglidesettle";
  }
  if (roll < 0.2) return "papiliohush";
  if (roll < 0.4) return "wingbanner";
  if (roll < 0.6) return "puddlesip";
  if (roll < 0.8) return "flutterhop";
  return "tailglidesettle";
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
  return cmd === "sleep" || cmd === "leave" || cmd === "hide" || cmd === "rest" || cmd === "seek" || cmd === "play" || cmd === "talk" || cmd === "enter";
}
export function wantsThankYou(key: string | undefined | null) {
  return key === TRICK_KEY || key === "banner";
}
export function startThankYou(key: string | undefined | null, lastKind: string | undefined | null, x: number, facing: 1 | -1 | undefined, flags?: TrickFlags) {
  if (!wantsThankYou(key)) return null;
  if (!happyCanStart(flags || { cmd: "idle" })) return null;
  const pick = pickHappy(lastKind);
  return { happy: beginHappy(pick, x, facing), kind: pick };
}
export function pickHappy(lastKind?: string | null, rand?: number) {
  const pool = HAPPY.filter((k) => k !== lastKind);
  const list = pool.length ? pool : [...HAPPY];
  const roll = rand == null ? Math.random() : rand;
  return list[Math.floor(roll * list.length)] || list[0];
}
export function beginHappy(kind: SwallowtailHappyKind | string, x: number, facing?: 1 | -1): SwallowtailHappy {
  const name = (HAPPY as readonly string[]).indexOf(kind) >= 0 ? (kind as SwallowtailHappyKind) : "densbanner";
  return {
    kind: name,
    happy: true,
    phase: "go",
    t: 0,
    x,
    lift: 0,
    rot: 0,
    anim: name === "densbanner" ? "sit" : name === "inkbanner" ? "play" : "play",
    facing: facing == null ? 1 : facing,
    fromX: x,
  };
}
export function densbannerPose(t: number): { lift: number; rot: number; anim: TrickAnim } {
  const u = Math.max(0, Math.min(1, t / HAPPY_DUR.densbanner));
  if (u < 0.14) {
    const s = u / 0.14;
    return { lift: s * -0.0028, rot: s * -0.10, anim: "sit" };
  }
  if (u < 0.86) {
    const wing = Math.sin(((u - 0.14) / 0.72) * Math.PI * 2.35);
    return { lift: -0.0028 + Math.abs(wing) * 0.00165, rot: -0.10 + wing * 0.12, anim: "sit" };
  }
  const s = (u - 0.86) / 0.14;
  return { lift: -0.0028 * (1 - s), rot: -0.10 * (1 - s), anim: "idle" };
}
export function inkbannerPose(t: number): { lift: number; rot: number; anim: TrickAnim } {
  const u = Math.max(0, Math.min(1, t / HAPPY_DUR.inkbanner));
  if (u < 0.12) {
    const s = u / 0.12;
    return { lift: s * 0.0052, rot: s * 0.38, anim: "play" };
  }
  if (u < 0.84) {
    const pulse = Math.sin(((u - 0.12) / 0.72) * Math.PI * 3.6);
    return { lift: 0.0052 + Math.abs(pulse) * 0.00235, rot: 0.38 + pulse * 0.30, anim: "play" };
  }
  const s = (u - 0.84) / 0.16;
  return { lift: 0.0052 * (1 - s), rot: 0.38 * (1 - s), anim: "idle" };
}
export function denspapilioPose(t: number): { lift: number; rot: number; anim: TrickAnim } {
  const u = Math.max(0, Math.min(1, t / HAPPY_DUR.denspapilio));
  if (u < 0.13) {
    const s = u / 0.13;
    return { lift: s * 0.0018, rot: s * -0.16, anim: "play" };
  }
  if (u < 0.82) {
    const tail = Math.sin(((u - 0.13) / 0.69) * Math.PI * 1.85);
    return { lift: 0.0018 + Math.abs(tail) * 0.00085, rot: -0.16 + tail * 0.11, anim: "play" };
  }
  const s = (u - 0.82) / 0.18;
  return { lift: 0.0018 * (1 - s), rot: -0.16 * (1 - s), anim: "idle" };
}
export function stepHappy(happy: SwallowtailHappy, dt: number, flags?: TrickFlags): SwallowtailHappy {
  if (!happy || happy.phase === "done") return happy;
  if (happyShouldAbort(flags)) {
    return { ...happy, phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true };
  }
  const next = { ...happy, t: happy.t + Math.max(0, dt) };
  const hold = HAPPY_DUR[next.kind];
  if (next.kind === "densbanner") {
    const pose = densbannerPose(next.t);
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "inkbanner") {
    const pose = inkbannerPose(next.t);
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else {
    const pose = denspapilioPose(next.t);
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
export function beginTrick(kind: SwallowtailTrickKind | string, x: number, facing?: 1 | -1): SwallowtailTrick {
  const k = (TRICKS as readonly string[]).includes(kind) ? (kind as SwallowtailTrickKind) : "papiliohush";
  const anim: TrickAnim =
    k === "papiliohush"
      ? "sit"
      : k === "wingbanner"
        ? "play"
        : k === "puddlesip"
          ? "talk"
          : k === "flutterhop"
            ? "play"
            : k === "tailglidesettle"
              ? "play"
              : "sit";
  return {
    kind: k,
    phase: k === "papiliohush" ? "hold" : "go",
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
export function papiliohushPose(t: number): { lift: number; rot: number } {
  const breath = Math.sin(t * 0.00112) + 0.00045 * Math.sin(t * 0.0035);
  const hush = Math.abs(Math.sin(t * 0.00048));
  return { lift: -0.00022 + hush * 0.00009, rot: -0.010 + breath * 0.0032 };
}
export function releasePose(t: number): { lift: number; rot: number } {
  const u = Math.max(0, Math.min(1, t / RELEASE_S));
  return { lift: -0.00022 * (1 - Math.sin(u * Math.PI * 0.5)), rot: -0.010 * (1 - u) };
}
export function wingbannerPose(t: number, fromX: number, facing: 1 | -1 | undefined): { x: number; lift: number; rot: number; anim: TrickAnim } {
  const u = Math.max(0, Math.min(1, t / DUR.wingbanner));
  const face = facing == null ? 1 : facing;
  if (u < 0.12) {
    const s = smoothstep(u / 0.12);
    return { x: fromX + face * s * 0.00012, lift: s * 0.0032, rot: s * -0.22 * face, anim: "play" };
  }
  if (u < 0.88) {
    const open = Math.sin((u - 0.12) / 0.76 * Math.PI * 3.15);
    const banner = Math.sin(t * 2.15) + 0.04 * Math.sin(t * 4.4);
    return {
      x: fromX + face * (0.00012 + open * 0.00028 + banner * 0.00005),
      lift: 0.0032 + Math.abs(open) * 0.00285 + Math.abs(banner) * 0.00045,
      rot: (-0.22 + open * 0.48 + banner * 0.12) * face,
      anim: "play",
    };
  }
  const s = smoothstep((u - 0.88) / 0.12);
  return { x: fromX + face * 0.00012 * (1 - s), lift: 0.0006 * (1 - s), rot: -0.03 * (1 - s) * face, anim: "idle" };
}
export function puddlesipPose(t: number, fromX: number, facing: 1 | -1 | undefined): { x: number; lift: number; rot: number; anim: TrickAnim } {
  const u = Math.max(0, Math.min(1, t / DUR.puddlesip));
  const face = facing == null ? 1 : facing;
  if (u < 0.12) {
    const s = smoothstep(u / 0.12);
    return { x: fromX + face * s * 0.00018, lift: s * -0.0038, rot: s * 0.14 * face, anim: "talk" };
  }
  if (u < 0.86) {
    const sip = Math.sin((u - 0.12) / 0.74 * Math.PI * 5.2);
    const puddle = (u - 0.12) / 0.74;
    return {
      x: fromX + face * (0.00018 + puddle * 0.0028 + sip * 0.00022),
      lift: -0.0038 + Math.abs(sip) * 0.00115,
      rot: (0.14 + sip * 0.18) * face,
      anim: "talk",
    };
  }
  const s = smoothstep((u - 0.86) / 0.14);
  return { x: fromX + face * 0.00298 * (1 - s * 0.04), lift: -0.0038 * (1 - s), rot: 0.02 * (1 - s) * face, anim: "idle" };
}
export function flutterhopPose(t: number, fromX: number, facing: 1 | -1 | undefined): { x: number; lift: number; rot: number; anim: TrickAnim } {
  const u = Math.max(0, Math.min(1, t / DUR.flutterhop));
  const face = facing == null ? 1 : facing;
  if (u < 0.10) {
    const s = smoothstep(u / 0.10);
    return { x: fromX + face * s * 0.00035, lift: s * 0.0045, rot: s * -0.16 * face, anim: "play" };
  }
  if (u < 0.45) {
    const s = smoothstep((u - 0.10) / 0.35);
    const flutter = Math.sin(s * Math.PI * 3.4);
    return {
      x: fromX + face * (0.00035 + s * 0.014 + flutter * 0.0008),
      lift: 0.0045 + Math.abs(flutter) * 0.028 + s * 0.012,
      rot: (-0.16 + flutter * 0.35) * face,
      anim: "play",
    };
  }
  if (u < 0.78) {
    const s = smoothstep((u - 0.45) / 0.33);
    const hop = Math.sin(s * Math.PI);
    return {
      x: fromX + face * (0.01435 + s * 0.012 + hop * 0.0012),
      lift: 0.016 + hop * 0.018,
      rot: (0.12 - s * 0.22) * face,
      anim: "play",
    };
  }
  const s = smoothstep((u - 0.78) / 0.22);
  return { x: fromX + face * 0.02635 * (1 - s * 0.02), lift: 0.004 * (1 - s), rot: 0.02 * (1 - s) * face, anim: "idle" };
}
export function tailglidesettlePose(t: number, fromX: number, facing: 1 | -1 | undefined): { x: number; lift: number; rot: number; anim: TrickAnim } {
  const u = Math.max(0, Math.min(1, t / DUR.tailglidesettle));
  const face = facing == null ? 1 : facing;
  if (u < 0.14) {
    const s = smoothstep(u / 0.14);
    return { x: fromX + face * s * 0.0002, lift: s * 0.0022, rot: s * 0.28 * face, anim: "play" };
  }
  if (u < 0.42) {
    const s = smoothstep((u - 0.14) / 0.28);
    const flick = Math.sin(s * Math.PI * 2.2);
    return {
      x: fromX + face * (0.0002 + s * 0.006 + flick * 0.0004),
      lift: 0.0022 + Math.abs(flick) * 0.0045 + s * 0.008,
      rot: (0.28 + flick * 0.32) * face,
      anim: "play",
    };
  }
  if (u < 0.82) {
    const s = smoothstep((u - 0.42) / 0.40);
    const glide = Math.sin(s * Math.PI * 0.85);
    return {
      x: fromX + face * (0.0062 + s * 0.016 + glide * 0.0015),
      lift: 0.010 + glide * 0.022 * (1 - s * 0.55),
      rot: (0.18 - s * 0.26 + glide * 0.08) * face,
      anim: "play",
    };
  }
  const s = smoothstep((u - 0.82) / 0.18);
  return { x: fromX + face * 0.0222 * (1 - s * 0.02), lift: 0.0035 * (1 - s), rot: 0.015 * (1 - s) * face, anim: "idle" };
}
export function stepTrick(trick: SwallowtailTrick, dt: number, flags?: TrickFlags): SwallowtailTrick {
  if (!trick || trick.phase === "done") return trick;
  if (shouldAbort(flags) && trick.kind !== "wingbanner" && trick.kind !== "puddlesip" && trick.kind !== "flutterhop" && trick.kind !== "tailglidesettle") {
    return { ...trick, phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true };
  }
  const next = { ...trick, t: trick.t + Math.max(0, dt) };
  if (next.kind === "papiliohush") {
    if (next.t < PAPILIOHUSH_HOLD) {
      const pose = papiliohushPose(next.t);
      next.phase = "hold";
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = "sit";
      return next;
    }
    if (next.t < PAPILIOHUSH_HOLD + RELEASE_S) {
      const pose = releasePose(next.t - PAPILIOHUSH_HOLD);
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
  if (next.kind === "wingbanner") {
    const pose = wingbannerPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "puddlesip") {
    const pose = puddlesipPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "flutterhop") {
    const pose = flutterhopPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else {
    const pose = tailglidesettlePose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  }
  if (u >= 1) return { ...next, phase: "done", lift: 0, rot: 0, anim: "idle" };
  return next;
}