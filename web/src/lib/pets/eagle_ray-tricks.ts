/** Soar ground tricks while idle — ultra-polish pass. House neighborly Spotted Eagle Ray Aetobatus narinari / Aetobatinae / Myliobatiformes eagle ray desk life (eagle_ray / Soar) — wingsoarflapglide / cephaliclobesift / sanddigbury / leapbreachcue / spotflash / wingbank / aetobatushush personality (wingsoarflapglide wing-soar flap glide without naming wing or soar or glide alone as wait — pectoral soar tell; cephaliclobesift cephalic-lobe sift without naming cephalic or lobe or sift alone as wait — prey-sift tell; sanddigbury sand dig bury without naming sand or dig or bury alone as wait — benthic bury tell; leapbreachcue leap breach cue without naming leap or breach alone as wait — desk-safe surface leap tell; spotflash spot-flash without naming spot or flash alone as wait — white dorsal-spot flash tell (distinct from Kite manta); wingbank wing-bank without naming wing or bank alone as wait — banked turn tell (distinct from Hook red_tail soar/kettle); aetobatushush Aetobatus hush hold (THE aetobatushush sit_hold tell) — never named wait or crouch or sit or still or eagle_ray or soar as bare ethogram-only trick kinds; Gate giant_clam owns mantlecurtainpulse/siphonjetpuff/shellgapeclosegate/zooxanthellaesunbask/byssusgrip/mantleedge/tridacnahush — do NOT reuse; Kite manta owns wing/lobe/gyre/vault/span — do NOT reuse; Hook red_tail owns kettle/stoop/soar — do NOT reuse; Glide flying_squirrel owns glide/patagium — do NOT reuse; Veil lionfish owns pteroishush — do NOT reuse; Hide grouper comes next — do NOT start; guest slug Soar / key eagle_ray only for wantsThankYou matching — accept "eagle_ray" and "soar"; do NOT name a trick "eagle_ray" or "soar" or "giant_clam" or "gate" or "manta" or "kite" or "red_tail" or "hook" or "flying_squirrel" or "glide" or "grouper" or "hide"; not Gate Tridacna life, not Kite Mobula life, not Hook Buteo life, not Glide Sciuridae life, not Hide Epinephelus life, not Rui. Wingsoarflapglide / cephaliclobesift / sanddigbury / leapbreachcue / spotflash / wingbank / aetobatushush; denssoar / inksoar / densaetobatus thank-yous. Same map as desktop eagle_ray-tricks.js. Window-play unchanged. Ethogram softs + freeze — never names soar/glide/still/wait/eagle_ray as bare ethogram-only trick kinds. True Spotted Eagle Ray Aetobatus narinari desk life only — wing-soar flap, cephalic-lobe sift, sand dig bury, leap breach cue, spot flash, wing bank, Aetobatus hush. Next house-order ultra: Hide / grouper. No cry inventing — eagle_ray.wav EXISTS so prefersHouseCry adds eagle_ray after giant_clam. Amplitudes raised toward Rui richness; denser waits/weights; AETOBATUSHUSH_HOLD=11.2 RELEASE_S=1.18 (not 34.48/2.57). Catalog 221. */
export const TRICK_KEY = "eagle_ray";
export const TRICKS = ["wingsoarflapglide", "cephaliclobesift", "sanddigbury", "leapbreachcue", "spotflash", "wingbank", "aetobatushush"] as const;
export const HAPPY = ["denssoar", "inksoar", "densaetobatus"] as const;
export type EagleRayTrickKind = (typeof TRICKS)[number];
export type EagleRayHappyKind = (typeof HAPPY)[number];
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

export type EagleRayTrick = {
  kind: EagleRayTrickKind;
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

export type EagleRayHappy = {
  kind: EagleRayHappyKind;
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

export const HAPPY_DUR = { denssoar: 1.70, inksoar: 1.84, densaetobatus: 1.76 } as const;
export const AETOBATUSHUSH_HOLD = 11.2;
export const RELEASE_S = 1.18;
export const DUR = {
  aetobatushush: AETOBATUSHUSH_HOLD + RELEASE_S,
  wingsoarflapglide: 2.48,
  cephaliclobesift: 2.42,
  sanddigbury: 2.40,
  leapbreachcue: 2.44,
  spotflash: 2.38,
  wingbank: 2.56,
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

export function nextTrickWait(justFinished: boolean, rand?: number, kind?: EagleRayTrickKind | string) {
  const roll = rand == null ? Math.random() : rand;
  if (kind === "aetobatushush") return 40 + roll * 26;
  if (kind === "spotflash" || kind === "wingbank" || kind === "wingsoarflapglide") return 12.8 + roll * 9.4;
  if (kind === "sanddigbury" || kind === "cephaliclobesift" || kind === "leapbreachcue") return 11.6 + roll * 8.5;
  return justFinished ? 8.5 + roll * 8.4 : 4.4 + roll * 7.4;
}

export function pickTrick(rand?: number, musicOn?: boolean, lastKind?: EagleRayTrickKind | string | null) {
  if (musicOn) return "aetobatushush" as const;
  const roll = rand == null ? Math.random() : rand;
  if (lastKind === "aetobatushush") {
    if (roll < 0.17) return "wingsoarflapglide" as const;
    if (roll < 0.33) return "cephaliclobesift" as const;
    if (roll < 0.49) return "sanddigbury" as const;
    if (roll < 0.65) return "leapbreachcue" as const;
    if (roll < 0.83) return "spotflash" as const;
    return "wingbank" as const;
  }
  if (lastKind === "wingsoarflapglide") {
    if (roll < 0.16) return "aetobatushush" as const;
    if (roll < 0.32) return "cephaliclobesift" as const;
    if (roll < 0.48) return "sanddigbury" as const;
    if (roll < 0.64) return "leapbreachcue" as const;
    if (roll < 0.82) return "spotflash" as const;
    return "wingbank" as const;
  }
  if (lastKind === "cephaliclobesift") {
    if (roll < 0.14) return "aetobatushush" as const;
    if (roll < 0.3) return "wingsoarflapglide" as const;
    if (roll < 0.46) return "sanddigbury" as const;
    if (roll < 0.62) return "leapbreachcue" as const;
    if (roll < 0.8) return "spotflash" as const;
    return "wingbank" as const;
  }
  if (lastKind === "sanddigbury") {
    if (roll < 0.15) return "aetobatushush" as const;
    if (roll < 0.31) return "wingsoarflapglide" as const;
    if (roll < 0.47) return "cephaliclobesift" as const;
    if (roll < 0.63) return "leapbreachcue" as const;
    if (roll < 0.81) return "spotflash" as const;
    return "wingbank" as const;
  }
  if (lastKind === "leapbreachcue") {
    if (roll < 0.16) return "aetobatushush" as const;
    if (roll < 0.32) return "wingsoarflapglide" as const;
    if (roll < 0.48) return "cephaliclobesift" as const;
    if (roll < 0.64) return "sanddigbury" as const;
    if (roll < 0.82) return "spotflash" as const;
    return "wingbank" as const;
  }
  if (lastKind === "spotflash") {
    if (roll < 0.15) return "aetobatushush" as const;
    if (roll < 0.31) return "wingsoarflapglide" as const;
    if (roll < 0.47) return "cephaliclobesift" as const;
    if (roll < 0.63) return "sanddigbury" as const;
    if (roll < 0.81) return "leapbreachcue" as const;
    return "wingbank" as const;
  }
  if (lastKind === "wingbank") {
    if (roll < 0.16) return "aetobatushush" as const;
    if (roll < 0.32) return "wingsoarflapglide" as const;
    if (roll < 0.48) return "cephaliclobesift" as const;
    if (roll < 0.64) return "sanddigbury" as const;
    if (roll < 0.82) return "leapbreachcue" as const;
    return "spotflash" as const;
  }
  if (roll < 0.14) return "aetobatushush" as const;
  if (roll < 0.28) return "wingsoarflapglide" as const;
  if (roll < 0.42) return "cephaliclobesift" as const;
  if (roll < 0.56) return "sanddigbury" as const;
  if (roll < 0.7) return "leapbreachcue" as const;
  if (roll < 0.85) return "spotflash" as const;
  return "wingbank" as const;
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
  return key === TRICK_KEY || key === "soar";
}

export function startThankYou(
  key: string | undefined | null,
  lastKind: EagleRayHappyKind | null | undefined,
  x: number,
  facing: 1 | -1,
  flags?: TrickFlags
) {
  if (!wantsThankYou(key)) return null;
  if (!happyCanStart(flags || { cmd: "idle" })) return null;
  const pick = pickHappy(lastKind);
  return { happy: beginHappy(pick, x, facing), kind: pick };
}

export function pickHappy(lastKind?: EagleRayHappyKind | null, rand?: number) {
  const pool = HAPPY.filter((k) => k !== lastKind);
  const list = pool.length ? pool : [...HAPPY];
  const roll = rand == null ? Math.random() : rand;
  return list[Math.floor(roll * list.length)] || list[0];
}

export function beginHappy(kind: EagleRayHappyKind | string, x: number, facing: 1 | -1): EagleRayHappy {
  const name = (HAPPY as readonly string[]).includes(kind) ? (kind as EagleRayHappyKind) : "denssoar";
  return {
    kind: name,
    happy: true,
    phase: "go",
    t: 0,
    x,
    lift: 0,
    rot: 0,
    anim: (name === "denssoar" ? "sit" : name === "inksoar" ? "play" : "play") as TrickAnim,
    facing: (facing == null ? 1 : facing) as 1 | -1,
    fromX: x,
  };
}

export function denssoarPose(t: number) {
  const u = Math.max(0, Math.min(1, t / HAPPY_DUR.denssoar));
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

export function inksoarPose(t: number) {
  const u = Math.max(0, Math.min(1, t / HAPPY_DUR.inksoar));
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

export function densaetobatusPose(t: number) {
  return {
    lift: 2.2 + Math.abs(Math.sin(t * 0.58)) * 1.1,
    rot: Math.sin(t * 0.58) * 8,
    dx: Math.sin(t * 0.4) * 0.06,
    anim: "play" as TrickAnim,
  };
}

export function stepHappy(happy: EagleRayHappy | null | undefined, dt: number, flags?: TrickFlags) {
  if (!happy || happy.phase === "done") return happy;
  if (happyShouldAbort(flags)) {
    return { ...happy, phase: "done" as const, t: 0, lift: 0, rot: 0, anim: "idle" as TrickAnim, abort: true };
  }
  const next = { ...happy, t: happy.t + Math.max(0, dt) };
  const hold = HAPPY_DUR[next.kind];
  if (next.kind === "denssoar") {
    const pose = denssoarPose(next.t);
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "inksoar") {
    const pose = inksoarPose(next.t);
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else {
    const pose = densaetobatusPose(next.t);
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

export function beginTrick(kind: EagleRayTrickKind | string, x: number, facing: 1 | -1): EagleRayTrick {
  const k = (TRICKS as readonly string[]).includes(kind) ? (kind as EagleRayTrickKind) : "aetobatushush";
  const anim: TrickAnim =
    k === "aetobatushush"
      ? "sit"
      : k === "wingsoarflapglide"
        ? "sit"
        : k === "wingbank"
          ? "talk"
          : k === "cephaliclobesift"
            ? "play"
            : k === "sanddigbury"
              ? "sit"
              : k === "leapbreachcue"
                ? "sit"
                : k === "spotflash"
                  ? "walk"
                  : "sit";
  return {
    kind: k,
    phase: k === "aetobatushush" ? "hold" : "go",
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

export function aetobatushushPose(t: number) {
  return {
    lift: 2.4 + Math.abs(Math.sin(t * 0.42)) * 1.2,
    rot: -0.18 + Math.sin(t * 0.36) * 0.35,
  };
}

export function releasePose(t: number) {
  const u = Math.max(0, Math.min(1, t / RELEASE_S));
  return { lift: 2.4 * (1 - Math.sin(u * Math.PI * 0.5)), rot: -0.18 * (1 - u) };
}

export function wingsoarflapglidePose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.wingsoarflapglide));
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

export function cephaliclobesiftPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.cephaliclobesift));
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

export function sanddigburyPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.sanddigbury));
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

export function leapbreachcuePose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.leapbreachcue));
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

export function spotflashPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.spotflash));
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

export function wingbankPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.wingbank));
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

export function stepTrick(trick: EagleRayTrick | null | undefined, dt: number, flags?: TrickFlags) {
  if (!trick || trick.phase === "done") return trick;
  if (
    shouldAbort(flags) &&
    trick.kind !== "wingsoarflapglide" &&
    trick.kind !== "cephaliclobesift" &&
    trick.kind !== "sanddigbury" &&
    trick.kind !== "leapbreachcue" &&
    trick.kind !== "spotflash" &&
    trick.kind !== "wingbank"
  ) {
    return { ...trick, phase: "done" as const, t: 0, lift: 0, rot: 0, anim: "idle" as TrickAnim, abort: true };
  }
  const next = { ...trick, t: trick.t + Math.max(0, dt) };
  if (next.kind === "aetobatushush") {
    if (next.t < AETOBATUSHUSH_HOLD) {
      const pose = aetobatushushPose(next.t);
      next.phase = "hold";
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = "sit";
      return next;
    }
    if (next.t < AETOBATUSHUSH_HOLD + RELEASE_S) {
      const pose = releasePose(next.t - AETOBATUSHUSH_HOLD);
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
  if (next.kind === "wingsoarflapglide") {
    const pose = wingsoarflapglidePose(next.t, fromX, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "cephaliclobesift") {
    const pose = cephaliclobesiftPose(next.t, fromX, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "sanddigbury") {
    const pose = sanddigburyPose(next.t, fromX, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "leapbreachcue") {
    const pose = leapbreachcuePose(next.t, fromX, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "spotflash") {
    const pose = spotflashPose(next.t, fromX, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else {
    const pose = wingbankPose(next.t, fromX, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  }
  if (u >= 1) return { ...next, phase: "done" as const, lift: 0, rot: 0, anim: "idle" as TrickAnim };
  return next;
}
