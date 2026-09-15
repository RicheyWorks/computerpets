/** Hide ground tricks while idle — ultra-polish pass. House neighborly Nassau Grouper Epinephelus striatus / Epinephelinae / Perciformes grouper desk life (grouper / Hide) — cavernambushsettle / gulargulpinhale / colorpatternflush / slowcaudalhover / jawsnap / stripeband / epinephelushush personality (cavernambushsettle cavern ambush settle without naming cavern or ambush or settle alone as wait — reef-crevice ambush tell; gulargulpinhale gular gulp inhale without naming gular or gulp or inhale alone as wait — suction-feed tell (distinct from Veil gulpinginhalecue); colorpatternflush color-pattern flush without naming color or pattern or flush alone as wait — barred-pattern flush tell; slowcaudalhover slow caudal hover without naming caudal or hover alone as wait — station-keeping hover tell; jawsnap jaw-snap without naming jaw or snap alone as wait — predatory jaw cue tell (distinct from Lunge coverstrike); stripeband stripe-band without naming stripe or band alone as wait — vertical-bar flash tell (distinct from Lunge latline); epinephelushush Epinephelus hush hold (THE epinephelushush sit_hold tell) — never named wait or crouch or sit or still or grouper or hide as bare ethogram-only trick kinds; Soar eagle_ray owns wingsoarflapglide/cephaliclobesift/sanddigbury/leapbreachcue/spotflash/wingbank/aetobatushush — do NOT reuse; Veil lionfish owns gulpinginhalecue/pteroishush — do NOT reuse; Lunge bass owns coverstrike/bedfan/surboil/latline/salmoides — do NOT reuse; Gate giant_clam owns tridacnahush — do NOT reuse; Arc cyber_dragon comes next — do NOT start; guest slug Hide / key grouper only for wantsThankYou matching — accept "grouper" and "hide"; do NOT name a trick "grouper" or "hide" or "eagle_ray" or "soar" or "bass" or "lunge" or "lionfish" or "veil" or "cyber_dragon" or "arc"; not Soar Aetobatus life, not Veil Pterois life, not Lunge Micropterus life, not Gate Tridacna life, not Arc cyber_dragon life, not Rui. Cavernambushsettle / gulargulpinhale / colorpatternflush / slowcaudalhover / jawsnap / stripeband / epinephelushush; densgrouper / inkgrouper / densepinephelus thank-yous (not denshide — hide UI owns hide). Same map as desktop grouper-tricks.js. Window-play unchanged. Ethogram softs + freeze — never names hide/gape/still/wait/grouper as bare ethogram-only trick kinds. True Nassau Grouper Epinephelus striatus desk life only — cavern ambush settle, gular gulp inhale, color-pattern flush, slow caudal hover, jaw snap, stripe band, Epinephelus hush. Next house-order ultra: Arc / cyber_dragon. No cry inventing — grouper.wav EXISTS so prefersHouseCry adds grouper after eagle_ray. Amplitudes raised toward Rui richness; denser waits/weights; EPINEPHELUSHUSH_HOLD=11.2 RELEASE_S=1.18 (not 34.76/2.61). Catalog 221. */
export const TRICK_KEY = "grouper";
export const TRICKS = ["cavernambushsettle", "gulargulpinhale", "colorpatternflush", "slowcaudalhover", "jawsnap", "stripeband", "epinephelushush"] as const;
export const HAPPY = ["densgrouper", "inkgrouper", "densepinephelus"] as const;
export type GrouperTrickKind = (typeof TRICKS)[number];
export type GrouperHappyKind = (typeof HAPPY)[number];
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

export type GrouperTrick = {
  kind: GrouperTrickKind;
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

export type GrouperHappy = {
  kind: GrouperHappyKind;
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

export const HAPPY_DUR = { densgrouper: 1.70, inkgrouper: 1.84, densepinephelus: 1.76 } as const;
export const EPINEPHELUSHUSH_HOLD = 11.2;
export const RELEASE_S = 1.18;
export const DUR = {
  epinephelushush: EPINEPHELUSHUSH_HOLD + RELEASE_S,
  cavernambushsettle: 2.48,
  gulargulpinhale: 2.42,
  colorpatternflush: 2.40,
  slowcaudalhover: 2.44,
  jawsnap: 2.38,
  stripeband: 2.56,
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

export function nextTrickWait(justFinished: boolean, rand?: number, kind?: GrouperTrickKind | string) {
  const roll = rand == null ? Math.random() : rand;
  if (kind === "epinephelushush") return 40 + roll * 26;
  if (kind === "jawsnap" || kind === "stripeband" || kind === "cavernambushsettle") return 12.8 + roll * 9.4;
  if (kind === "colorpatternflush" || kind === "gulargulpinhale" || kind === "slowcaudalhover") return 11.6 + roll * 8.5;
  return justFinished ? 8.5 + roll * 8.4 : 4.4 + roll * 7.4;
}

export function pickTrick(rand?: number, musicOn?: boolean, lastKind?: GrouperTrickKind | string | null) {
  if (musicOn) return "epinephelushush" as const;
  const roll = rand == null ? Math.random() : rand;
  if (lastKind === "epinephelushush") {
    if (roll < 0.17) return "cavernambushsettle" as const;
    if (roll < 0.33) return "gulargulpinhale" as const;
    if (roll < 0.49) return "colorpatternflush" as const;
    if (roll < 0.65) return "slowcaudalhover" as const;
    if (roll < 0.83) return "jawsnap" as const;
    return "stripeband" as const;
  }
  if (lastKind === "cavernambushsettle") {
    if (roll < 0.16) return "epinephelushush" as const;
    if (roll < 0.32) return "gulargulpinhale" as const;
    if (roll < 0.48) return "colorpatternflush" as const;
    if (roll < 0.64) return "slowcaudalhover" as const;
    if (roll < 0.82) return "jawsnap" as const;
    return "stripeband" as const;
  }
  if (lastKind === "gulargulpinhale") {
    if (roll < 0.14) return "epinephelushush" as const;
    if (roll < 0.3) return "cavernambushsettle" as const;
    if (roll < 0.46) return "colorpatternflush" as const;
    if (roll < 0.62) return "slowcaudalhover" as const;
    if (roll < 0.8) return "jawsnap" as const;
    return "stripeband" as const;
  }
  if (lastKind === "colorpatternflush") {
    if (roll < 0.15) return "epinephelushush" as const;
    if (roll < 0.31) return "cavernambushsettle" as const;
    if (roll < 0.47) return "gulargulpinhale" as const;
    if (roll < 0.63) return "slowcaudalhover" as const;
    if (roll < 0.81) return "jawsnap" as const;
    return "stripeband" as const;
  }
  if (lastKind === "slowcaudalhover") {
    if (roll < 0.16) return "epinephelushush" as const;
    if (roll < 0.32) return "cavernambushsettle" as const;
    if (roll < 0.48) return "gulargulpinhale" as const;
    if (roll < 0.64) return "colorpatternflush" as const;
    if (roll < 0.82) return "jawsnap" as const;
    return "stripeband" as const;
  }
  if (lastKind === "jawsnap") {
    if (roll < 0.15) return "epinephelushush" as const;
    if (roll < 0.31) return "cavernambushsettle" as const;
    if (roll < 0.47) return "gulargulpinhale" as const;
    if (roll < 0.63) return "colorpatternflush" as const;
    if (roll < 0.81) return "slowcaudalhover" as const;
    return "stripeband" as const;
  }
  if (lastKind === "stripeband") {
    if (roll < 0.16) return "epinephelushush" as const;
    if (roll < 0.32) return "cavernambushsettle" as const;
    if (roll < 0.48) return "gulargulpinhale" as const;
    if (roll < 0.64) return "colorpatternflush" as const;
    if (roll < 0.82) return "slowcaudalhover" as const;
    return "jawsnap" as const;
  }
  if (roll < 0.14) return "epinephelushush" as const;
  if (roll < 0.28) return "cavernambushsettle" as const;
  if (roll < 0.42) return "gulargulpinhale" as const;
  if (roll < 0.56) return "colorpatternflush" as const;
  if (roll < 0.7) return "slowcaudalhover" as const;
  if (roll < 0.85) return "jawsnap" as const;
  return "stripeband" as const;
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
  return key === TRICK_KEY || key === "hide";
}

export function startThankYou(
  key: string | undefined | null,
  lastKind: GrouperHappyKind | null | undefined,
  x: number,
  facing: 1 | -1,
  flags?: TrickFlags
) {
  if (!wantsThankYou(key)) return null;
  if (!happyCanStart(flags || { cmd: "idle" })) return null;
  const pick = pickHappy(lastKind);
  return { happy: beginHappy(pick, x, facing), kind: pick };
}

export function pickHappy(lastKind?: GrouperHappyKind | null, rand?: number) {
  const pool = HAPPY.filter((k) => k !== lastKind);
  const list = pool.length ? pool : [...HAPPY];
  const roll = rand == null ? Math.random() : rand;
  return list[Math.floor(roll * list.length)] || list[0];
}

export function beginHappy(kind: GrouperHappyKind | string, x: number, facing: 1 | -1): GrouperHappy {
  const name = (HAPPY as readonly string[]).includes(kind) ? (kind as GrouperHappyKind) : "densgrouper";
  return {
    kind: name,
    happy: true,
    phase: "go",
    t: 0,
    x,
    lift: 0,
    rot: 0,
    anim: (name === "densgrouper" ? "sit" : name === "inkgrouper" ? "play" : "play") as TrickAnim,
    facing: (facing == null ? 1 : facing) as 1 | -1,
    fromX: x,
  };
}

export function densgrouperPose(t: number) {
  const u = Math.max(0, Math.min(1, t / HAPPY_DUR.densgrouper));
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

export function inkgrouperPose(t: number) {
  const u = Math.max(0, Math.min(1, t / HAPPY_DUR.inkgrouper));
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

export function densepinephelusPose(t: number) {
  return {
    lift: 2.2 + Math.abs(Math.sin(t * 0.58)) * 1.1,
    rot: Math.sin(t * 0.58) * 8,
    dx: Math.sin(t * 0.4) * 0.06,
    anim: "play" as TrickAnim,
  };
}

export function stepHappy(happy: GrouperHappy | null | undefined, dt: number, flags?: TrickFlags) {
  if (!happy || happy.phase === "done") return happy;
  if (happyShouldAbort(flags)) {
    return { ...happy, phase: "done" as const, t: 0, lift: 0, rot: 0, anim: "idle" as TrickAnim, abort: true };
  }
  const next = { ...happy, t: happy.t + Math.max(0, dt) };
  const hold = HAPPY_DUR[next.kind];
  if (next.kind === "densgrouper") {
    const pose = densgrouperPose(next.t);
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "inkgrouper") {
    const pose = inkgrouperPose(next.t);
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else {
    const pose = densepinephelusPose(next.t);
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

export function beginTrick(kind: GrouperTrickKind | string, x: number, facing: 1 | -1): GrouperTrick {
  const k = (TRICKS as readonly string[]).includes(kind) ? (kind as GrouperTrickKind) : "epinephelushush";
  const anim: TrickAnim =
    k === "epinephelushush"
      ? "sit"
      : k === "cavernambushsettle"
        ? "sit"
        : k === "stripeband"
          ? "talk"
          : k === "gulargulpinhale"
            ? "play"
            : k === "colorpatternflush"
              ? "sit"
              : k === "slowcaudalhover"
                ? "sit"
                : k === "jawsnap"
                  ? "walk"
                  : "sit";
  return {
    kind: k,
    phase: k === "epinephelushush" ? "hold" : "go",
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

export function epinephelushushPose(t: number) {
  return {
    lift: 2.4 + Math.abs(Math.sin(t * 0.42)) * 1.2,
    rot: -0.18 + Math.sin(t * 0.36) * 0.35,
  };
}

export function releasePose(t: number) {
  const u = Math.max(0, Math.min(1, t / RELEASE_S));
  return { lift: 2.4 * (1 - Math.sin(u * Math.PI * 0.5)), rot: -0.18 * (1 - u) };
}

export function cavernambushsettlePose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.cavernambushsettle));
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

export function gulargulpinhalePose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.gulargulpinhale));
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

export function colorpatternflushPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.colorpatternflush));
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

export function slowcaudalhoverPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.slowcaudalhover));
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

export function jawsnapPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.jawsnap));
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

export function stripebandPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.stripeband));
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

export function stepTrick(trick: GrouperTrick | null | undefined, dt: number, flags?: TrickFlags) {
  if (!trick || trick.phase === "done") return trick;
  if (
    shouldAbort(flags) &&
    trick.kind !== "cavernambushsettle" &&
    trick.kind !== "gulargulpinhale" &&
    trick.kind !== "colorpatternflush" &&
    trick.kind !== "slowcaudalhover" &&
    trick.kind !== "jawsnap" &&
    trick.kind !== "stripeband"
  ) {
    return { ...trick, phase: "done" as const, t: 0, lift: 0, rot: 0, anim: "idle" as TrickAnim, abort: true };
  }
  const next = { ...trick, t: trick.t + Math.max(0, dt) };
  if (next.kind === "epinephelushush") {
    if (next.t < EPINEPHELUSHUSH_HOLD) {
      const pose = epinephelushushPose(next.t);
      next.phase = "hold";
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = "sit";
      return next;
    }
    if (next.t < EPINEPHELUSHUSH_HOLD + RELEASE_S) {
      const pose = releasePose(next.t - EPINEPHELUSHUSH_HOLD);
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
  if (next.kind === "cavernambushsettle") {
    const pose = cavernambushsettlePose(next.t, fromX, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "gulargulpinhale") {
    const pose = gulargulpinhalePose(next.t, fromX, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "colorpatternflush") {
    const pose = colorpatternflushPose(next.t, fromX, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "slowcaudalhover") {
    const pose = slowcaudalhoverPose(next.t, fromX, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "jawsnap") {
    const pose = jawsnapPose(next.t, fromX, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else {
    const pose = stripebandPose(next.t, fromX, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  }
  if (u >= 1) return { ...next, phase: "done" as const, lift: 0, rot: 0, anim: "idle" as TrickAnim };
  return next;
}
