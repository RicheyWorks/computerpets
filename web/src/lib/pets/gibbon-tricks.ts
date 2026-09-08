/** Swing ground tricks while idle. House neighborly lar gibbon (Hylobates lar / Hylobatidae) desk life -- brachiate / whoopduet / bipedalstrut / hangreach / hylobateshush personality (brachiate brachiation swing-arc distinct from Hang hangsway and Opossum hang; whoopduet silent whoop-duet cue posture distinct from Crow hopwalk and Cicada tymbal; bipedalstrut upright bipedal strut distinct from Deer freeze and Lemur hopgallop; hangreach hang-reach fruit pick distinct from Hang reachcrawl and Sloth algaescratch; long hylobateshush Hylobates lar hush -- never named wait; NOT Sun lemur; NOT Hang sloth; NOT Rui red panda; guest slug Swing / key gibbon -- accept gibbon and swing; Thank-yous densswing / inkswing / denshylobates. Sleep, hide, leave, rest, card, ribbon still win. Same map as desktop gibbon-tricks.js. Next: Wrist / kinkajou. Catalog 220. */
export const TRICK_KEY = "gibbon";
export const TRICKS = ["brachiate", "whoopduet", "bipedalstrut", "hangreach", "hylobateshush"] as const;
export const HAPPY = ["densswing", "inkswing", "denshylobates"] as const;
export type GibbonTrickKind = (typeof TRICKS)[number];
export type GibbonHappyKind = (typeof HAPPY)[number];
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

export type GibbonTrick = {
  kind: GibbonTrickKind;
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

export type GibbonHappy = {
  kind: GibbonHappyKind;
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

export const HAPPY_DUR = { densswing: 2.61, inkswing: 2.77, denshylobates: 2.49 } as const;
export const HYLOBATESHUSH_HOLD = 31.05;
export const RELEASE_S = 2.31;
export const DUR = { hylobateshush: HYLOBATESHUSH_HOLD + RELEASE_S, brachiate: 5.28, whoopduet: 5.06, bipedalstrut: 5.42, hangreach: 4.94 } as const;

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
export function nextTrickWait(justFinished: boolean, rand?: number, kind?: GibbonTrickKind | string) {
  const roll = rand == null ? Math.random() : rand;
  if (kind === "hylobateshush") return 197 + roll * 20;
  if (kind === "brachiate") return 22.6 + roll * 3.5;
  if (kind === "whoopduet") return 24.4 + roll * 3.6;
  if (kind === "bipedalstrut") return 21.8 + roll * 3.4;
  if (kind === "hangreach") return 25.0 + roll * 3.7;
  return justFinished ? 18.8 + roll * 3.0 : 14.0 + roll * 2.6;
}
export function pickTrick(rand?: number, musicOn?: boolean, lastKind?: GibbonTrickKind | string) {
  if (musicOn) return "hylobateshush";
  const roll = rand == null ? Math.random() : rand;
  if (lastKind === "hylobateshush") {
    if (roll < 0.26) return "brachiate";
    if (roll < 0.5) return "whoopduet";
    if (roll < 0.74) return "bipedalstrut";
    return "hangreach";
  }
  if (lastKind === "brachiate") {
    if (roll < 0.26) return "hylobateshush";
    if (roll < 0.5) return "whoopduet";
    if (roll < 0.74) return "bipedalstrut";
    return "hangreach";
  }
  if (lastKind === "whoopduet") {
    if (roll < 0.22) return "hylobateshush";
    if (roll < 0.44) return "brachiate";
    if (roll < 0.68) return "bipedalstrut";
    return "hangreach";
  }
  if (roll < 0.2) return "hylobateshush";
  if (roll < 0.4) return "brachiate";
  if (roll < 0.6) return "whoopduet";
  if (roll < 0.8) return "bipedalstrut";
  return "hangreach";
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
  return key === TRICK_KEY || key === "swing";
}
export function startThankYou(
  key: string | undefined | null,
  lastKind: GibbonHappyKind | string | undefined,
  x: number,
  facing?: 1 | -1,
  flags?: TrickFlags
) {
  if (!wantsThankYou(key)) return null;
  if (!happyCanStart(flags || { cmd: "idle" })) return null;
  const pick = pickHappy(lastKind);
  return { happy: beginHappy(pick, x, facing), kind: pick };
}
export function pickHappy(lastKind?: GibbonHappyKind | string, rand?: number) {
  const pool = HAPPY.filter((k) => k !== lastKind);
  const list = pool.length ? pool : [...HAPPY];
  const roll = rand == null ? Math.random() : rand;
  return list[Math.floor(roll * list.length)] || list[0];
}
export function beginHappy(kind: GibbonHappyKind | string, x: number, facing?: 1 | -1): GibbonHappy {
  const name = (HAPPY as readonly string[]).indexOf(kind) >= 0 ? (kind as GibbonHappyKind) : "densswing";
  return {
    kind: name,
    happy: true,
    phase: "go",
    t: 0,
    x,
    lift: 0,
    rot: 0,
    anim: name === "densswing" ? "sit" : name === "inkswing" ? "play" : "play",
    facing: facing == null ? 1 : facing,
    fromX: x,
  };
}

export function densswingPose(t: number) {
  const u = Math.max(0, Math.min(1, t / HAPPY_DUR.densswing));
  if (u < 0.15) {
    const s = u / 0.15;
    return { lift: s * 0.0046, rot: s * -0.16, anim: "sit" as TrickAnim };
  }
  if (u < 0.84) {
    const sway = Math.sin(((u - 0.15) / 0.69) * Math.PI * 2.35);
    return { lift: 0.0046 + Math.abs(sway) * 0.0014, rot: -0.16 + sway * 0.18, anim: "sit" as TrickAnim };
  }
  const s = (u - 0.84) / 0.16;
  return { lift: 0.0046 * (1 - s), rot: -0.16 * (1 - s), anim: "idle" as TrickAnim };
}
export function inkswingPose(t: number) {
  const u = Math.max(0, Math.min(1, t / HAPPY_DUR.inkswing));
  if (u < 0.12) {
    const s = u / 0.12;
    return { lift: s * 0.0034, rot: s * 0.24, anim: "play" as TrickAnim };
  }
  if (u < 0.82) {
    const arc = Math.sin(((u - 0.12) / 0.7) * Math.PI * 3.15);
    return { lift: 0.0034 + Math.abs(arc) * 0.0020, rot: 0.24 + arc * 0.26, anim: "play" as TrickAnim };
  }
  const s = (u - 0.82) / 0.18;
  return { lift: 0.0034 * (1 - s), rot: 0.24 * (1 - s), anim: "idle" as TrickAnim };
}
export function denshylobatesPose(t: number) {
  const u = Math.max(0, Math.min(1, t / HAPPY_DUR.denshylobates));
  if (u < 0.14) {
    const s = u / 0.14;
    return { lift: s * -0.0016, rot: s * 0.17, anim: "play" as TrickAnim };
  }
  if (u < 0.83) {
    const hush = Math.sin(((u - 0.14) / 0.69) * Math.PI * 2.25);
    return { lift: -0.0016 + Math.abs(hush) * 0.0011, rot: 0.17 + hush * 0.15, anim: "play" as TrickAnim };
  }
  const s = (u - 0.83) / 0.17;
  return { lift: -0.0016 * (1 - s), rot: 0.17 * (1 - s), anim: "idle" as TrickAnim };
}
export function stepHappy(happy: GibbonHappy, dt: number, flags?: TrickFlags): GibbonHappy {
  if (!happy || happy.phase === "done") return happy;
  if (happyShouldAbort(flags)) {
    return { ...happy, phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true };
  }
  const next = { ...happy, t: happy.t + Math.max(0, dt) };
  const hold = HAPPY_DUR[next.kind];
  if (next.kind === "densswing") {
    const pose = densswingPose(next.t);
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "inkswing") {
    const pose = inkswingPose(next.t);
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else {
    const pose = denshylobatesPose(next.t);
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
export function beginTrick(kind: GibbonTrickKind | string, x: number, facing?: 1 | -1): GibbonTrick {
  const k = (TRICKS as readonly string[]).includes(kind) ? (kind as GibbonTrickKind) : "hylobateshush";
  const anim: TrickAnim =
    k === "hylobateshush"
      ? "sit"
      : k === "brachiate"
        ? "play"
        : k === "whoopduet"
          ? "play"
          : k === "bipedalstrut"
            ? "walk"
            : k === "hangreach"
              ? "play"
              : "sit";
  return {
    kind: k,
    phase: k === "hylobateshush" ? "hold" : "go",
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

export function hylobateshushPose(t: number) {
  const breath = Math.sin(t * 0.00076) + 0.00024 * Math.sin(t * 0.0020);
  const hush = Math.abs(Math.sin(t * 0.00031));
  return { lift: -0.00016 + hush * 0.000045, rot: 0.0035 + breath * 0.0022 };
}

export function releasePose(t: number) {
  const u = Math.max(0, Math.min(1, t / RELEASE_S));
  return { lift: -0.00018 * (1 - Math.sin(u * Math.PI * 0.5)), rot: 0.0045 * (1 - u) };
}

export function brachiatePose(t: number, fromX: number, facing?: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.brachiate));
  const face = facing == null ? 1 : facing;
  if (u < 0.14) {
    const s = smoothstep(u / 0.14);
    return { x: fromX + face * s * 0.0012, lift: s * 0.0075, rot: s * -0.42 * face, anim: "play" as TrickAnim };
  }
  if (u < 0.48) {
    const s = smoothstep((u - 0.14) / 0.34);
    const arc = Math.sin(s * Math.PI);
    return {
      x: fromX + face * (0.0012 + s * 0.018),
      lift: 0.0075 + arc * 0.0065,
      rot: (-0.42 + s * 0.85) * face,
      anim: "play" as TrickAnim,
    };
  }
  if (u < 0.78) {
    const s = smoothstep((u - 0.48) / 0.3);
    const arc = Math.sin(s * Math.PI);
    return {
      x: fromX + face * (0.0192 + s * 0.012),
      lift: 0.0075 + arc * 0.0055,
      rot: (0.43 - s * 0.55) * face,
      anim: "play" as TrickAnim,
    };
  }
  const s = smoothstep((u - 0.78) / 0.22);
  return { x: fromX + face * (0.0312 - s * 0.0015), lift: 0.0075 * (1 - s), rot: -0.12 * (1 - s) * face, anim: "idle" as TrickAnim };
}

export function whoopduetPose(t: number, fromX: number, facing?: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.whoopduet));
  const face = facing == null ? 1 : facing;
  if (u < 0.16) {
    const s = smoothstep(u / 0.16);
    return { x: fromX + face * s * 0.00004, lift: s * 0.0052, rot: s * -0.32 * face, anim: "play" as TrickAnim };
  }
  if (u < 0.8) {
    const cue = (u - 0.16) / 0.64;
    const whoop = Math.sin(cue * Math.PI * 3.2);
    return {
      x: fromX + face * (0.00004 + whoop * 0.00018),
      lift: 0.0052 + Math.abs(whoop) * 0.0018,
      rot: (-0.32 + whoop * 0.22) * face,
      anim: "play" as TrickAnim,
    };
  }
  const s = smoothstep((u - 0.8) / 0.2);
  return { x: fromX + face * 0.00004 * (1 - s), lift: 0.0052 * (1 - s), rot: -0.32 * (1 - s) * face, anim: "idle" as TrickAnim };
}

export function bipedalstrutPose(t: number, fromX: number, facing?: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.bipedalstrut));
  const face = facing == null ? 1 : facing;
  if (u < 0.12) {
    const s = smoothstep(u / 0.12);
    return { x: fromX + face * s * 0.0006, lift: s * 0.0038, rot: s * -0.08 * face, anim: "walk" as TrickAnim };
  }
  if (u < 0.82) {
    const strut = (u - 0.12) / 0.7;
    const step = Math.sin(strut * Math.PI * 4.0);
    return {
      x: fromX + face * (0.0006 + strut * 0.016),
      lift: 0.0038 + Math.abs(step) * 0.0024,
      rot: (-0.08 + step * 0.12) * face,
      anim: "walk" as TrickAnim,
    };
  }
  const s = smoothstep((u - 0.82) / 0.18);
  return { x: fromX + face * (0.0166 - s * 0.0008), lift: 0.0038 * (1 - s), rot: -0.08 * (1 - s) * face, anim: "idle" as TrickAnim };
}

export function hangreachPose(t: number, fromX: number, facing?: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.hangreach));
  const face = facing == null ? 1 : facing;
  if (u < 0.15) {
    const s = smoothstep(u / 0.15);
    return { x: fromX + face * s * 0.0003, lift: s * 0.0088, rot: s * 0.48 * face, anim: "play" as TrickAnim };
  }
  if (u < 0.55) {
    const reach = (u - 0.15) / 0.4;
    const stretch = Math.sin(reach * Math.PI * 1.2);
    return {
      x: fromX + face * (0.0003 + stretch * 0.0009),
      lift: 0.0088 + stretch * 0.0022,
      rot: (0.48 + stretch * 0.16) * face,
      anim: "play" as TrickAnim,
    };
  }
  if (u < 0.78) {
    const draw = Math.sin(((u - 0.55) / 0.23) * Math.PI);
    return {
      x: fromX + face * (0.0012 - draw * 0.0004),
      lift: 0.0088 - draw * 0.0015,
      rot: (0.64 - draw * 0.22) * face,
      anim: "play" as TrickAnim,
    };
  }
  const s = smoothstep((u - 0.78) / 0.22);
  return { x: fromX + face * 0.0008 * (1 - s), lift: 0.0073 * (1 - s), rot: 0.42 * (1 - s) * face, anim: "idle" as TrickAnim };
}

export function stepTrick(trick: GibbonTrick, dt: number, flags?: TrickFlags): GibbonTrick {
  if (!trick || trick.phase === "done") return trick;
  if (shouldAbort(flags) && trick.kind !== "brachiate" && trick.kind !== "whoopduet" && trick.kind !== "bipedalstrut" && trick.kind !== "hangreach") {
    return { ...trick, phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true };
  }
  const next = { ...trick, t: trick.t + Math.max(0, dt) };
  if (next.kind === "hylobateshush") {
    if (next.t < HYLOBATESHUSH_HOLD) {
      const pose = hylobateshushPose(next.t);
      next.phase = "hold";
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = "sit";
      return next;
    }
    if (next.t < HYLOBATESHUSH_HOLD + RELEASE_S) {
      const pose = releasePose(next.t - HYLOBATESHUSH_HOLD);
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
  if (next.kind === "brachiate") {
    const pose = brachiatePose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "whoopduet") {
    const pose = whoopduetPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "bipedalstrut") {
    const pose = bipedalstrutPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else {
    const pose = hangreachPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  }
  if (u >= 1) return { ...next, phase: "done", lift: 0, rot: 0, anim: "idle" };
  return next;
}
