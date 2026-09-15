/** Gate ground tricks while idle — ultra-polish pass. House neighborly Giant Clam Tridacna gigas / Tridacninae / Cardiidae giant clam desk life (giant_clam / Gate) — mantlecurtainpulse / siphonjetpuff / shellgapeclosegate / zooxanthellaesunbask / byssusgrip / mantleedge / tridacnahush personality (mantlecurtainpulse mantle-curtain pulse without naming mantle or curtain or pulse alone as wait — Tridacna mantle tell; siphonjetpuff siphon jet puff without naming siphon or jet or puff alone as wait — excurrent-siphon tell; shellgapeclosegate shell gape-close gate without naming shell or gape or close alone as wait — valve gape tell; zooxanthellaesunbask zooxanthellae sun bask without naming zooxanthellae or sun or bask alone as wait — photosynthetic symbiont bask (distinct from Ridge brain_coral zooxflash); byssusgrip byssus grip without naming byssus or grip alone as wait — juvenile byssal attachment tell; mantleedge mantle-edge sense without naming mantle or edge alone as wait — phototaxis / mantle-margin tell; long tridacnahush Tridacna hush hold (THE tridacnahush sit_hold tell) — never named wait or crouch or sit or still or giant_clam or gate as bare ethogram-only trick kinds; Veil lionfish owns pectoralveilfanflare/gulpinginhalecue/spinewarnraise/slowhoverstalk/stripebar/venomwarn/pteroishush — do NOT reuse; Ridge brain_coral owns zooxflash/diploriahush — do NOT reuse; Hinge mussel owns adductor/protractor/inhalant — do NOT reuse; Pearl oyster owns lamella/imbricate — do NOT reuse; Cement barnacle owns cirrikick/opershut/cementhold/balanushush — do NOT reuse; Tube sea_cucumber owns tubefootcrawl/holothuriahush — do NOT reuse; Soar eagle_ray comes next — do NOT start; guest slug Gate / key giant_clam only for wantsThankYou matching — accept "giant_clam" and "gate"; do NOT name a trick "giant_clam" or "gate" or "lionfish" or "veil" or "brain_coral" or "ridge" or "mussel" or "hinge" or "oyster" or "pearl" or "barnacle" or "cement" or "eagle_ray" or "soar"; not Veil Pterois life, not Ridge Diploria life, not Hinge Unionidae life, not Pearl oyster life, not Cement Balanus life, not Soar Myliobatidae life, not Rui. Mantlecurtainpulse / siphonjetpuff / shellgapeclosegate / zooxanthellaesunbask / byssusgrip / mantleedge / tridacnahush; densgate / inkgate / denstridacna thank-yous. Same map as desktop giant_clam-tricks.js. Window-play unchanged. Ethogram softs + freeze — never names open/mantle/still/wait/giant_clam as bare ethogram-only trick kinds. True Giant Clam Tridacna gigas desk life only — mantle curtain, siphon jet, shell gape-close, zooxanthellae bask, byssus grip, mantle edge, Tridacna hush. Next house-order ultra: Soar / eagle_ray. No cry inventing — giant_clam.wav EXISTS so prefersHouseCry adds giant_clam after lionfish. Amplitudes raised toward Rui richness; denser waits/weights; TRIDACNAHUSH_HOLD=11.2 RELEASE_S=1.18 (not 34.12/2.53). Catalog 221. */
export const TRICK_KEY = "giant_clam";
export const TRICKS = ["mantlecurtainpulse", "siphonjetpuff", "shellgapeclosegate", "zooxanthellaesunbask", "byssusgrip", "mantleedge", "tridacnahush"] as const;
export const HAPPY = ["densgate", "inkgate", "denstridacna"] as const;
export type GiantClamTrickKind = (typeof TRICKS)[number];
export type GiantClamHappyKind = (typeof HAPPY)[number];
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

export type GiantClamTrick = {
  kind: GiantClamTrickKind;
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

export type GiantClamHappy = {
  kind: GiantClamHappyKind;
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

export const HAPPY_DUR = { densgate: 1.70, inkgate: 1.84, denstridacna: 1.76 } as const;
export const TRIDACNAHUSH_HOLD = 11.2;
export const RELEASE_S = 1.18;
export const DUR = {
  tridacnahush: TRIDACNAHUSH_HOLD + RELEASE_S,
  mantlecurtainpulse: 2.48,
  siphonjetpuff: 2.42,
  shellgapeclosegate: 2.40,
  zooxanthellaesunbask: 2.44,
  byssusgrip: 2.38,
  mantleedge: 2.56,
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

export function nextTrickWait(justFinished: boolean, rand?: number, kind?: GiantClamTrickKind | string) {
  const roll = rand == null ? Math.random() : rand;
  if (kind === "tridacnahush") return 40 + roll * 26;
  if (kind === "byssusgrip" || kind === "mantleedge" || kind === "mantlecurtainpulse") return 12.8 + roll * 9.4;
  if (kind === "shellgapeclosegate" || kind === "siphonjetpuff" || kind === "zooxanthellaesunbask") return 11.6 + roll * 8.5;
  return justFinished ? 8.5 + roll * 8.4 : 4.4 + roll * 7.4;
}

export function pickTrick(rand?: number, musicOn?: boolean, lastKind?: GiantClamTrickKind | string | null) {
  if (musicOn) return "tridacnahush" as const;
  const roll = rand == null ? Math.random() : rand;
  if (lastKind === "tridacnahush") {
    if (roll < 0.17) return "mantlecurtainpulse" as const;
    if (roll < 0.33) return "siphonjetpuff" as const;
    if (roll < 0.49) return "shellgapeclosegate" as const;
    if (roll < 0.65) return "zooxanthellaesunbask" as const;
    if (roll < 0.83) return "byssusgrip" as const;
    return "mantleedge" as const;
  }
  if (lastKind === "mantlecurtainpulse") {
    if (roll < 0.16) return "tridacnahush" as const;
    if (roll < 0.32) return "siphonjetpuff" as const;
    if (roll < 0.48) return "shellgapeclosegate" as const;
    if (roll < 0.64) return "zooxanthellaesunbask" as const;
    if (roll < 0.82) return "byssusgrip" as const;
    return "mantleedge" as const;
  }
  if (lastKind === "siphonjetpuff") {
    if (roll < 0.14) return "tridacnahush" as const;
    if (roll < 0.3) return "mantlecurtainpulse" as const;
    if (roll < 0.46) return "shellgapeclosegate" as const;
    if (roll < 0.62) return "zooxanthellaesunbask" as const;
    if (roll < 0.8) return "byssusgrip" as const;
    return "mantleedge" as const;
  }
  if (lastKind === "shellgapeclosegate") {
    if (roll < 0.15) return "tridacnahush" as const;
    if (roll < 0.31) return "mantlecurtainpulse" as const;
    if (roll < 0.47) return "siphonjetpuff" as const;
    if (roll < 0.63) return "zooxanthellaesunbask" as const;
    if (roll < 0.81) return "byssusgrip" as const;
    return "mantleedge" as const;
  }
  if (lastKind === "zooxanthellaesunbask") {
    if (roll < 0.16) return "tridacnahush" as const;
    if (roll < 0.32) return "mantlecurtainpulse" as const;
    if (roll < 0.48) return "siphonjetpuff" as const;
    if (roll < 0.64) return "shellgapeclosegate" as const;
    if (roll < 0.82) return "byssusgrip" as const;
    return "mantleedge" as const;
  }
  if (lastKind === "byssusgrip") {
    if (roll < 0.15) return "tridacnahush" as const;
    if (roll < 0.31) return "mantlecurtainpulse" as const;
    if (roll < 0.47) return "siphonjetpuff" as const;
    if (roll < 0.63) return "shellgapeclosegate" as const;
    if (roll < 0.81) return "zooxanthellaesunbask" as const;
    return "mantleedge" as const;
  }
  if (lastKind === "mantleedge") {
    if (roll < 0.16) return "tridacnahush" as const;
    if (roll < 0.32) return "mantlecurtainpulse" as const;
    if (roll < 0.48) return "siphonjetpuff" as const;
    if (roll < 0.64) return "shellgapeclosegate" as const;
    if (roll < 0.82) return "zooxanthellaesunbask" as const;
    return "byssusgrip" as const;
  }
  if (roll < 0.14) return "tridacnahush" as const;
  if (roll < 0.28) return "mantlecurtainpulse" as const;
  if (roll < 0.42) return "siphonjetpuff" as const;
  if (roll < 0.56) return "shellgapeclosegate" as const;
  if (roll < 0.7) return "zooxanthellaesunbask" as const;
  if (roll < 0.85) return "byssusgrip" as const;
  return "mantleedge" as const;
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
  return key === TRICK_KEY || key === "gate";
}

export function startThankYou(
  key: string | undefined | null,
  lastKind: GiantClamHappyKind | null | undefined,
  x: number,
  facing: 1 | -1,
  flags?: TrickFlags
) {
  if (!wantsThankYou(key)) return null;
  if (!happyCanStart(flags || { cmd: "idle" })) return null;
  const pick = pickHappy(lastKind);
  return { happy: beginHappy(pick, x, facing), kind: pick };
}

export function pickHappy(lastKind?: GiantClamHappyKind | null, rand?: number) {
  const pool = HAPPY.filter((k) => k !== lastKind);
  const list = pool.length ? pool : [...HAPPY];
  const roll = rand == null ? Math.random() : rand;
  return list[Math.floor(roll * list.length)] || list[0];
}

export function beginHappy(kind: GiantClamHappyKind | string, x: number, facing: 1 | -1): GiantClamHappy {
  const name = (HAPPY as readonly string[]).includes(kind) ? (kind as GiantClamHappyKind) : "densgate";
  return {
    kind: name,
    happy: true,
    phase: "go",
    t: 0,
    x,
    lift: 0,
    rot: 0,
    anim: (name === "densgate" ? "sit" : name === "inkgate" ? "play" : "play") as TrickAnim,
    facing: (facing == null ? 1 : facing) as 1 | -1,
    fromX: x,
  };
}

export function densgatePose(t: number) {
  const u = Math.max(0, Math.min(1, t / HAPPY_DUR.densgate));
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

export function inkgatePose(t: number) {
  const u = Math.max(0, Math.min(1, t / HAPPY_DUR.inkgate));
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

export function denstridacnaPose(t: number) {
  return {
    lift: 2.2 + Math.abs(Math.sin(t * 0.58)) * 1.1,
    rot: Math.sin(t * 0.58) * 8,
    dx: Math.sin(t * 0.4) * 0.06,
    anim: "play" as TrickAnim,
  };
}

export function stepHappy(happy: GiantClamHappy | null | undefined, dt: number, flags?: TrickFlags) {
  if (!happy || happy.phase === "done") return happy;
  if (happyShouldAbort(flags)) {
    return { ...happy, phase: "done" as const, t: 0, lift: 0, rot: 0, anim: "idle" as TrickAnim, abort: true };
  }
  const next = { ...happy, t: happy.t + Math.max(0, dt) };
  const hold = HAPPY_DUR[next.kind];
  if (next.kind === "densgate") {
    const pose = densgatePose(next.t);
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "inkgate") {
    const pose = inkgatePose(next.t);
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else {
    const pose = denstridacnaPose(next.t);
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

export function beginTrick(kind: GiantClamTrickKind | string, x: number, facing: 1 | -1): GiantClamTrick {
  const k = (TRICKS as readonly string[]).includes(kind) ? (kind as GiantClamTrickKind) : "tridacnahush";
  const anim: TrickAnim =
    k === "tridacnahush"
      ? "sit"
      : k === "mantlecurtainpulse"
        ? "sit"
        : k === "mantleedge"
          ? "talk"
          : k === "siphonjetpuff"
            ? "play"
            : k === "shellgapeclosegate"
              ? "sit"
              : k === "zooxanthellaesunbask"
                ? "sit"
                : k === "byssusgrip"
                  ? "walk"
                  : "sit";
  return {
    kind: k,
    phase: k === "tridacnahush" ? "hold" : "go",
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

export function tridacnahushPose(t: number) {
  return {
    lift: 2.4 + Math.abs(Math.sin(t * 0.42)) * 1.2,
    rot: -0.18 + Math.sin(t * 0.36) * 0.35,
  };
}

export function releasePose(t: number) {
  const u = Math.max(0, Math.min(1, t / RELEASE_S));
  return { lift: 2.4 * (1 - Math.sin(u * Math.PI * 0.5)), rot: -0.18 * (1 - u) };
}

export function mantlecurtainpulsePose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.mantlecurtainpulse));
  const face = facing == null ? 1 : facing;
  if (u < 0.14) {
    const s = smoothstep(u / 0.14);
    return { x: fromX + face * s * 0.8, lift: s * 3.0, rot: s * -12 * face, anim: "sit" as TrickAnim };
  }
  if (u < 0.78) {
    const bar = Math.sin(t * 2.4);
    return {
      x: fromX + face * (0.8 + bar * 0.16),
      lift: 2.8 + Math.abs(bar) * 1.5,
      rot: face * (-12 + bar * 10),
      anim: "sit" as TrickAnim,
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

export function siphonjetpuffPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.siphonjetpuff));
  const face = facing == null ? 1 : facing;
  if (u < 0.12) {
    const s = smoothstep(u / 0.12);
    return { x: fromX, lift: s * 2.6, rot: s * 10 * face, anim: "play" as TrickAnim };
  }
  if (u < 0.78) {
    const bob = Math.sin(t * 2.2);
    return {
      x: fromX + face * bob * 0.12,
      lift: 2.6 + Math.abs(bob) * 1.3,
      rot: face * (10 + bob * 8),
      anim: "play" as TrickAnim,
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

export function shellgapeclosegatePose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.shellgapeclosegate));
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

export function zooxanthellaesunbaskPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.zooxanthellaesunbask));
  const face = facing == null ? 1 : facing;
  if (u < 0.1) {
    const s = smoothstep(u / 0.1);
    return { x: fromX + face * s * 1.0, lift: s * 4.0, rot: s * 18 * face, anim: "sit" as TrickAnim };
  }
  if (u < 0.8) {
    const thrash = Math.sin(t * 3.6);
    return {
      x: fromX + face * (1.0 + thrash * 0.22),
      lift: 3.6 + Math.abs(thrash) * 2.0,
      rot: face * (18 + thrash * 14),
      anim: "sit" as TrickAnim,
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

export function byssusgripPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.byssusgrip));
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

export function mantleedgePose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.mantleedge));
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

export function stepTrick(trick: GiantClamTrick | null | undefined, dt: number, flags?: TrickFlags) {
  if (!trick || trick.phase === "done") return trick;
  if (
    shouldAbort(flags) &&
    trick.kind !== "mantlecurtainpulse" &&
    trick.kind !== "siphonjetpuff" &&
    trick.kind !== "shellgapeclosegate" &&
    trick.kind !== "zooxanthellaesunbask" &&
    trick.kind !== "byssusgrip" &&
    trick.kind !== "mantleedge"
  ) {
    return { ...trick, phase: "done" as const, t: 0, lift: 0, rot: 0, anim: "idle" as TrickAnim, abort: true };
  }
  const next = { ...trick, t: trick.t + Math.max(0, dt) };
  if (next.kind === "tridacnahush") {
    if (next.t < TRIDACNAHUSH_HOLD) {
      const pose = tridacnahushPose(next.t);
      next.phase = "hold";
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = "sit";
      return next;
    }
    if (next.t < TRIDACNAHUSH_HOLD + RELEASE_S) {
      const pose = releasePose(next.t - TRIDACNAHUSH_HOLD);
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
  if (next.kind === "mantlecurtainpulse") {
    const pose = mantlecurtainpulsePose(next.t, fromX, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "siphonjetpuff") {
    const pose = siphonjetpuffPose(next.t, fromX, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "shellgapeclosegate") {
    const pose = shellgapeclosegatePose(next.t, fromX, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "zooxanthellaesunbask") {
    const pose = zooxanthellaesunbaskPose(next.t, fromX, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "byssusgrip") {
    const pose = byssusgripPose(next.t, fromX, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else {
    const pose = mantleedgePose(next.t, fromX, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  }
  if (u >= 1) return { ...next, phase: "done" as const, lift: 0, rot: 0, anim: "idle" as TrickAnim };
  return next;
}
