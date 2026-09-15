/** Swing ground tricks while idle — ultra-polish pass. House neighborly Hylobates lar / Lar Gibbon desk life (gibbon / Swing) — brachiate / whoopduet / bipedalstrut / hangreach / armhook / duetbow / hylobateshush personality (brachiate brachiation swing-arc without naming swing or hang or brachiate alone as wait — distinct from Hang hangsway and Opossum hang; whoopduet silent whoop-duet cue posture without naming whoop or song or call alone as wait — distinct from Crow hopwalk and Cicada tymbal; bipedalstrut upright bipedal strut without naming walk or strut or bipedal alone as wait — distinct from Deer freeze and Sun hopgallop; hangreach hang-reach fruit pick without naming hang or reach or crawl alone as wait — distinct from Hang reachcrawl and Sloth algaescratch; armhook arm-hook branch hold without naming hook or claw or hang alone as wait — distinct from Hang clawhook and Sun scentmark; duetbow duet-bow pair posture without naming bow or song or duet alone as wait — distinct from Sun stinkfight and Crow hopwalk; long hylobateshush Hylobates lar hush hold (THE hylobateshush sit_hold tell) — never named wait or crouch or sit or walk or swing or gibbon as bare ethogram-only trick kinds; Sun lemur owns bellybask/ringtailcurl/hopgallop/scentmark/stinkfight/sunworship/lemurhush — do NOT reuse; Hang sloth owns hangsway/reachcrawl/algaescratch/headturnstare/clawhook/slowdrip/bradypushush — do NOT reuse; Rob robber_fly owns sallyhawk/beardgroom/midsnatch/stiltsstance/mystaxwipe/perchsally/asilushush — do NOT reuse; guest slug Swing / key gibbon only for wantsThankYou matching — accept "gibbon" and "swing"; do NOT name a trick "gibbon" or "swing" or "lemur" or "sun" or "sloth" or "hang" or "lemurhush" or "hangsway"; not Sun Lemur catta life, not Hang Choloepus life, not Wrist kinkajou, not Rui. Brachiate / whoopduet / bipedalstrut / hangreach / armhook / duetbow / hylobateshush; densswing / inkswing / denshylobates thank-yous. Same map as desktop gibbon-tricks.js. Window-play unchanged. Ethogram softs + freeze — never names swing/song/still/sit/wait/gibbon as bare ethogram-only trick kinds. True Lar Gibbon Hylobates lar desk life only — brachiate, whoop-duet, bipedal strut, hang-reach, arm-hook, duet-bow, Hylobates hush. Next house-order ultra: Wrist / kinkajou. No cry inventing — gibbon.wav EXISTS so prefersHouseCry adds gibbon after lemur. Amplitudes raised toward Rui richness; denser waits/weights. Catalog 221. */
export const TRICK_KEY = "gibbon";
export const TRICKS = ["brachiate", "whoopduet", "bipedalstrut", "hangreach", "armhook", "duetbow", "hylobateshush"] as const;
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

export const HAPPY_DUR = { densswing: 1.70, inkswing: 1.84, denshylobates: 1.76 } as const;
export const HYLOBATESHUSH_HOLD = 11.2;
export const RELEASE_S = 1.18;
export const DUR = {
  hylobateshush: HYLOBATESHUSH_HOLD + RELEASE_S,
  brachiate: 2.48,
  whoopduet: 2.42,
  bipedalstrut: 2.40,
  hangreach: 2.44,
  armhook: 2.38,
  duetbow: 2.56,
} as const;

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
  if (kind === "hylobateshush") return 40 + roll * 26;
  if (kind === "armhook" || kind === "brachiate" || kind === "hangreach") return 12.8 + roll * 9.4;
  if (kind === "bipedalstrut" || kind === "whoopduet" || kind === "duetbow") return 11.6 + roll * 8.5;
  return justFinished ? 8.5 + roll * 8.4 : 4.4 + roll * 7.4;
}

export function pickTrick(rand?: number, musicOn?: boolean, lastKind?: GibbonTrickKind | string | null) {
  if (musicOn) return "hylobateshush" as const;
  const roll = rand == null ? Math.random() : rand;
  if (lastKind === "hylobateshush") {
    if (roll < 0.17) return "brachiate" as const;
    if (roll < 0.33) return "whoopduet" as const;
    if (roll < 0.49) return "bipedalstrut" as const;
    if (roll < 0.65) return "hangreach" as const;
    if (roll < 0.83) return "armhook" as const;
    return "duetbow" as const;
  }
  if (lastKind === "brachiate") {
    if (roll < 0.16) return "hylobateshush" as const;
    if (roll < 0.32) return "whoopduet" as const;
    if (roll < 0.48) return "bipedalstrut" as const;
    if (roll < 0.64) return "hangreach" as const;
    if (roll < 0.82) return "armhook" as const;
    return "duetbow" as const;
  }
  if (lastKind === "whoopduet") {
    if (roll < 0.14) return "hylobateshush" as const;
    if (roll < 0.3) return "brachiate" as const;
    if (roll < 0.46) return "bipedalstrut" as const;
    if (roll < 0.62) return "hangreach" as const;
    if (roll < 0.8) return "armhook" as const;
    return "duetbow" as const;
  }
  if (lastKind === "bipedalstrut") {
    if (roll < 0.15) return "hylobateshush" as const;
    if (roll < 0.31) return "brachiate" as const;
    if (roll < 0.47) return "whoopduet" as const;
    if (roll < 0.63) return "hangreach" as const;
    if (roll < 0.81) return "armhook" as const;
    return "duetbow" as const;
  }
  if (lastKind === "hangreach") {
    if (roll < 0.16) return "hylobateshush" as const;
    if (roll < 0.32) return "brachiate" as const;
    if (roll < 0.48) return "whoopduet" as const;
    if (roll < 0.64) return "bipedalstrut" as const;
    if (roll < 0.82) return "armhook" as const;
    return "duetbow" as const;
  }
  if (lastKind === "armhook") {
    if (roll < 0.15) return "hylobateshush" as const;
    if (roll < 0.31) return "brachiate" as const;
    if (roll < 0.47) return "whoopduet" as const;
    if (roll < 0.63) return "bipedalstrut" as const;
    if (roll < 0.81) return "hangreach" as const;
    return "duetbow" as const;
  }
  if (lastKind === "duetbow") {
    if (roll < 0.16) return "hylobateshush" as const;
    if (roll < 0.32) return "brachiate" as const;
    if (roll < 0.48) return "whoopduet" as const;
    if (roll < 0.64) return "bipedalstrut" as const;
    if (roll < 0.82) return "hangreach" as const;
    return "armhook" as const;
  }
  if (roll < 0.14) return "hylobateshush" as const;
  if (roll < 0.28) return "brachiate" as const;
  if (roll < 0.42) return "whoopduet" as const;
  if (roll < 0.56) return "bipedalstrut" as const;
  if (roll < 0.7) return "hangreach" as const;
  if (roll < 0.85) return "armhook" as const;
  return "duetbow" as const;
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
  lastKind: GibbonHappyKind | null | undefined,
  x: number,
  facing: 1 | -1,
  flags?: TrickFlags
) {
  if (!wantsThankYou(key)) return null;
  if (!happyCanStart(flags || { cmd: "idle" })) return null;
  const pick = pickHappy(lastKind);
  return { happy: beginHappy(pick, x, facing), kind: pick };
}

export function pickHappy(lastKind?: GibbonHappyKind | null, rand?: number) {
  const pool = HAPPY.filter((k) => k !== lastKind);
  const list = pool.length ? pool : [...HAPPY];
  const roll = rand == null ? Math.random() : rand;
  return list[Math.floor(roll * list.length)] || list[0];
}

export function beginHappy(kind: GibbonHappyKind | string, x: number, facing: 1 | -1): GibbonHappy {
  const name = (HAPPY as readonly string[]).includes(kind) ? (kind as GibbonHappyKind) : "densswing";
  return {
    kind: name,
    happy: true,
    phase: "go",
    t: 0,
    x,
    lift: 0,
    rot: 0,
    anim: (name === "densswing" ? "sit" : name === "inkswing" ? "play" : "play") as TrickAnim,
    facing: (facing == null ? 1 : facing) as 1 | -1,
    fromX: x,
  };
}

export function densswingPose(t: number) {
  const u = Math.max(0, Math.min(1, t / HAPPY_DUR.densswing));
  if (u < 0.14) {
    const s = u / 0.14;
    return { lift: s * 2.8, rot: s * 12, dx: 0, anim: "sit" as TrickAnim };
  }
  if (u < 0.78) {
    const flash = Math.sin(t * 2.2);
    return {
      lift: 2.8 + Math.abs(flash) * 1.4,
      rot: 12 + flash * 8,
      dx: flash * 0.08,
      anim: "sit" as TrickAnim,
    };
  }
  const s = (u - 0.78) / 0.22;
  return { lift: 2.0 * (1 - s), rot: 6 * (1 - s), dx: 0, anim: "idle" as TrickAnim };
}

export function inkswingPose(t: number) {
  const u = Math.max(0, Math.min(1, t / HAPPY_DUR.inkswing));
  if (u < 0.12) {
    const s = u / 0.12;
    return { lift: s * 3.7, rot: s * -14, dx: s * 0.15, anim: "play" as TrickAnim };
  }
  if (u < 0.8) {
    const wriggle = Math.sin(t * 2.6);
    return {
      lift: 3.4 + Math.abs(wriggle) * 1.6,
      rot: -14 + wriggle * 10,
      dx: wriggle * 0.12,
      anim: "play" as TrickAnim,
    };
  }
  const s = (u - 0.8) / 0.2;
  return { lift: 2.2 * (1 - s), rot: -6 * (1 - s), dx: 0, anim: "sit" as TrickAnim };
}

export function denshylobatesPose(t: number) {
  return {
    lift: 2.2 + Math.abs(Math.sin(t * 0.58)) * 1.1,
    rot: Math.sin(t * 0.58) * 8,
    dx: Math.sin(t * 0.4) * 0.06,
    anim: "play" as TrickAnim,
  };
}

export function stepHappy(happy: GibbonHappy | null | undefined, dt: number, flags?: TrickFlags) {
  if (!happy || happy.phase === "done") return happy;
  if (happyShouldAbort(flags)) {
    return { ...happy, phase: "done" as const, t: 0, lift: 0, rot: 0, anim: "idle" as TrickAnim, abort: true };
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
  if (next.t >= hold) return { ...next, phase: "done" as const, lift: 0, rot: 0, anim: "idle" as TrickAnim };
  return next;
}

export function sleepHoldFrame(_key?: string | null, _frameCount?: number) {
  return null;
}

export function beginTrick(kind: GibbonTrickKind, x: number, facing: 1 | -1): GibbonTrick {
  const anim: TrickAnim =
    kind === "hylobateshush"
      ? "sit"
      : kind === "brachiate"
        ? "play"
        : kind === "duetbow"
          ? "talk"
          : kind === "whoopduet"
            ? "walk"
            : kind === "bipedalstrut"
              ? "sit"
              : kind === "hangreach"
                ? "play"
                : kind === "armhook"
                  ? "walk"
                  : "sit";
  return {
    kind,
    phase: kind === "hylobateshush" ? "hold" : "go",
    t: 0,
    x,
    lift: 0,
    rot: 0,
    anim,
    facing: (facing == null ? 1 : facing) as 1 | -1,
    fromX: x,
  };
}

function smoothstep(t: number) {
  const x = Math.max(0, Math.min(1, t));
  return x * x * (3 - 2 * x);
}

export function hylobateshushPose(t: number) {
  return {
    lift: 2.4 + Math.abs(Math.sin(t * 0.42)) * 1.2,
    rot: -0.18 + Math.sin(t * 0.36) * 0.35,
  };
}

export function releasePose(t: number) {
  const u = Math.max(0, Math.min(1, t / RELEASE_S));
  return { lift: 2.4 * (1 - Math.sin(u * Math.PI * 0.5)), rot: -0.18 * (1 - u) };
}

export function brachiatePose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.brachiate));
  const face = facing == null ? 1 : facing;
  if (u < 0.14) {
    const s = smoothstep(u / 0.14);
    return { x: fromX + face * s * 0.8, lift: s * 3.0, rot: s * -12 * face, anim: "play" as TrickAnim };
  }
  if (u < 0.78) {
    const bar = Math.sin(t * 2.4);
    return {
      x: fromX + face * (0.8 + bar * 0.16),
      lift: 2.8 + Math.abs(bar) * 1.5,
      rot: face * (-12 + bar * 10),
      anim: "play" as TrickAnim,
    };
  }
  const s = smoothstep((u - 0.78) / 0.22);
  return {
    x: fromX + face * 0.8 * (1 - s),
    lift: 1.4 * (1 - s),
    rot: face * (-4 * (1 - s)),
    anim: "idle" as TrickAnim,
  };
}

export function whoopduetPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.whoopduet));
  const face = facing == null ? 1 : facing;
  if (u < 0.12) {
    const s = smoothstep(u / 0.12);
    return { x: fromX, lift: s * 2.6, rot: s * 10 * face, anim: "walk" as TrickAnim };
  }
  if (u < 0.78) {
    const bob = Math.sin(t * 2.2);
    return {
      x: fromX + face * bob * 0.12,
      lift: 2.6 + Math.abs(bob) * 1.3,
      rot: face * (10 + bob * 8),
      anim: "walk" as TrickAnim,
    };
  }
  const s = smoothstep((u - 0.78) / 0.22);
  return {
    x: fromX,
    lift: 1.2 * (1 - s),
    rot: face * (3 * (1 - s)),
    anim: "idle" as TrickAnim,
  };
}

export function bipedalstrutPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.bipedalstrut));
  const face = facing == null ? 1 : facing;
  if (u < 0.14) {
    const s = smoothstep(u / 0.14);
    return { x: fromX + face * s * 0.5, lift: s * 2.8, rot: s * 11 * face, anim: "sit" as TrickAnim };
  }
  if (u < 0.78) {
    const hang = Math.sin(t * 2.0);
    return {
      x: fromX + face * (0.5 + hang * 0.1),
      lift: 2.8 + Math.abs(hang) * 1.2,
      rot: face * (11 + hang * 8),
      anim: "sit" as TrickAnim,
    };
  }
  const s = smoothstep((u - 0.78) / 0.22);
  return {
    x: fromX + face * 0.5 * (1 - s),
    lift: 1.3 * (1 - s),
    rot: face * (3 * (1 - s)),
    anim: "idle" as TrickAnim,
  };
}

export function hangreachPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.hangreach));
  const face = facing == null ? 1 : facing;
  if (u < 0.1) {
    const s = smoothstep(u / 0.1);
    return { x: fromX + face * s * 1.0, lift: s * 4.0, rot: s * 18 * face, anim: "play" as TrickAnim };
  }
  if (u < 0.8) {
    const thrash = Math.sin(t * 3.6);
    return {
      x: fromX + face * (1.0 + thrash * 0.22),
      lift: 3.6 + Math.abs(thrash) * 2.0,
      rot: face * (18 + thrash * 14),
      anim: "play" as TrickAnim,
    };
  }
  const s = smoothstep((u - 0.8) / 0.2);
  return {
    x: fromX + face * 1.0 * (1 - s),
    lift: 1.6 * (1 - s),
    rot: face * (6 * (1 - s)),
    anim: "idle" as TrickAnim,
  };
}

export function armhookPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.armhook));
  const face = facing == null ? 1 : facing;
  if (u < 0.14) {
    const s = smoothstep(u / 0.14);
    return { x: fromX + face * s * 0.6, lift: s * 3.0, rot: s * 12 * face, anim: "walk" as TrickAnim };
  }
  if (u < 0.8) {
    const cast = Math.sin(t * 2.8);
    return {
      x: fromX + face * (0.6 + cast * 0.16),
      lift: 2.8 + Math.abs(cast) * 1.6,
      rot: face * (12 + cast * 10),
      anim: "walk" as TrickAnim,
    };
  }
  const s = smoothstep((u - 0.8) / 0.2);
  return {
    x: fromX + face * 0.6 * (1 - s),
    lift: 1.4 * (1 - s),
    rot: face * (4 * (1 - s)),
    anim: "idle" as TrickAnim,
  };
}

export function duetbowPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.duetbow));
  const face = facing == null ? 1 : facing;
  if (u < 0.14) {
    const s = smoothstep(u / 0.14);
    return { x: fromX + face * s * 0.6, lift: s * 3.2, rot: s * 14 * face, anim: "talk" as TrickAnim };
  }
  if (u < 0.8) {
    const cloud = Math.sin(t * 3.0);
    return {
      x: fromX + face * (0.6 + cloud * 0.18),
      lift: 3.0 + Math.abs(cloud) * 1.8,
      rot: face * (14 + cloud * 12),
      anim: "talk" as TrickAnim,
    };
  }
  const s = smoothstep((u - 0.8) / 0.2);
  return {
    x: fromX + face * 0.6 * (1 - s),
    lift: 1.5 * (1 - s),
    rot: face * (5 * (1 - s)),
    anim: "idle" as TrickAnim,
  };
}

export function stepTrick(trick: GibbonTrick | null | undefined, dt: number, flags?: TrickFlags) {
  if (!trick || trick.phase === "done") return trick;
  if (
    shouldAbort(flags) &&
    trick.kind !== "brachiate" &&
    trick.kind !== "whoopduet" &&
    trick.kind !== "bipedalstrut" &&
    trick.kind !== "hangreach" &&
    trick.kind !== "armhook" &&
    trick.kind !== "duetbow"
  ) {
    return { ...trick, phase: "done" as const, t: 0, lift: 0, rot: 0, anim: "idle" as TrickAnim, abort: true };
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
    return { ...next, phase: "done" as const, lift: 0, rot: 0, anim: "idle" as TrickAnim };
  }
  const hold = DUR[next.kind];
  const u = next.t / hold;
  const fromX = trick.fromX != null ? trick.fromX : trick.x;
  if (next.kind === "brachiate") {
    const pose = brachiatePose(next.t, fromX, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "whoopduet") {
    const pose = whoopduetPose(next.t, fromX, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "bipedalstrut") {
    const pose = bipedalstrutPose(next.t, fromX, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "hangreach") {
    const pose = hangreachPose(next.t, fromX, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "armhook") {
    const pose = armhookPose(next.t, fromX, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else {
    const pose = duetbowPose(next.t, fromX, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  }
  if (u >= 1) return { ...next, phase: "done" as const, lift: 0, rot: 0, anim: "idle" as TrickAnim };
  return next;
}
