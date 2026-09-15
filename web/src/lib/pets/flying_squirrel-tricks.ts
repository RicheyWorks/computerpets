/** Glide ground tricks while idle — ultra-polish pass. House neighborly Glaucomys volans / Southern Flying Squirrel desk life (flying_squirrel / Glide) — membranelaunch / softland / nestboxhuddle / nocturnalscurry / flapstretch / barksprint / glaucomyshush personality (membranelaunch membrane launch without naming glide or membrane or launch alone as wait — distinct from Sail patagiumglide and sugar glider; softland soft landing without naming land or soft or hop alone as wait — distinct from Sail clingclimb and Squirrel scurry; nestboxhuddle nest-box huddle without naming nest or box or huddle alone as wait — distinct from Cape and Wrist; nocturnalscurry nocturnal scurry without naming scurry or night or walk alone as wait — distinct from Squirrel scurry and Wrist nightscamper; flapstretch flap-membrane stretch without naming flap or stretch or wing alone as wait — distinct from Sail membranespread and Bat; barksprint bark sprint without naming bark or sprint or run alone as wait — distinct from Sail barkclamp and Squirrel; long glaucomyshush Glaucomys volans hush hold (THE glaucomyshush sit_hold tell) — never named wait or crouch or sit or glide or hop or still or flying_squirrel or glide as bare ethogram-only trick kinds; Sail colugo owns patagiumglide/clingclimb/headdownhang/leaffoldsettle/membranespread/barkclamp/galeopterushush — do NOT reuse; Wrist kinkajou owns pretailhang/nectarsip/wristrotate/nightscamper/honeylap/tailcoil/potoshush — do NOT reuse; Squirrel owns scurry and Cache dens — do NOT reuse bare scurry; guest slug Glide / key flying_squirrel only for wantsThankYou matching — accept "flying_squirrel" and "glide"; do NOT name a trick "flying_squirrel" or "glide" or "colugo" or "sail" or "squirrel" or "cache" or "howler" or "boom"; not Sail Galeopterus life, not Wrist Potos life, not Squirrel Sciurus life, not Boom Alouatta life, not Rui. Membranelaunch / softland / nestboxhuddle / nocturnalscurry / flapstretch / barksprint / glaucomyshush; densglide / inkglide / densglaucomys thank-yous. Same map as desktop flying_squirrel-tricks.js. Window-play unchanged. Ethogram softs + freeze — never names glide/hop/still/sit/wait/flying_squirrel as bare ethogram-only trick kinds. True Southern Flying Squirrel Glaucomys volans desk life only — membrane launch, soft land, nest-box huddle, nocturnal scurry, flap stretch, bark sprint, Glaucomys hush. Next house-order ultra: Boom / howler. No cry inventing — flying_squirrel.wav EXISTS so prefersHouseCry adds flying_squirrel after colugo. Amplitudes raised toward Rui richness; denser waits/weights. Catalog 221. */
export const TRICK_KEY = "flying_squirrel";
export const TRICKS = ["membranelaunch", "softland", "nestboxhuddle", "nocturnalscurry", "flapstretch", "barksprint", "glaucomyshush"] as const;
export const HAPPY = ["densglide", "inkglide", "densglaucomys"] as const;
export type FlyingSquirrelTrickKind = (typeof TRICKS)[number];
export type FlyingSquirrelHappyKind = (typeof HAPPY)[number];
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

export type FlyingSquirrelTrick = {
  kind: FlyingSquirrelTrickKind;
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

export type FlyingSquirrelHappy = {
  kind: FlyingSquirrelHappyKind;
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

export const HAPPY_DUR = { densglide: 1.70, inkglide: 1.84, densglaucomys: 1.76 } as const;
export const GLAUCOMYSHUSH_HOLD = 11.2;
export const RELEASE_S = 1.18;
export const DUR = {
  glaucomyshush: GLAUCOMYSHUSH_HOLD + RELEASE_S,
  membranelaunch: 2.48,
  softland: 2.42,
  nestboxhuddle: 2.40,
  nocturnalscurry: 2.44,
  flapstretch: 2.38,
  barksprint: 2.56,
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

export function nextTrickWait(justFinished: boolean, rand?: number, kind?: FlyingSquirrelTrickKind | string) {
  const roll = rand == null ? Math.random() : rand;
  if (kind === "glaucomyshush") return 40 + roll * 26;
  if (kind === "flapstretch" || kind === "membranelaunch" || kind === "nocturnalscurry") return 12.8 + roll * 9.4;
  if (kind === "nestboxhuddle" || kind === "softland" || kind === "barksprint") return 11.6 + roll * 8.5;
  return justFinished ? 8.5 + roll * 8.4 : 4.4 + roll * 7.4;
}

export function pickTrick(rand?: number, musicOn?: boolean, lastKind?: FlyingSquirrelTrickKind | string | null) {
  if (musicOn) return "glaucomyshush" as const;
  const roll = rand == null ? Math.random() : rand;
  if (lastKind === "glaucomyshush") {
    if (roll < 0.17) return "membranelaunch" as const;
    if (roll < 0.33) return "softland" as const;
    if (roll < 0.49) return "nestboxhuddle" as const;
    if (roll < 0.65) return "nocturnalscurry" as const;
    if (roll < 0.83) return "flapstretch" as const;
    return "barksprint" as const;
  }
  if (lastKind === "membranelaunch") {
    if (roll < 0.16) return "glaucomyshush" as const;
    if (roll < 0.32) return "softland" as const;
    if (roll < 0.48) return "nestboxhuddle" as const;
    if (roll < 0.64) return "nocturnalscurry" as const;
    if (roll < 0.82) return "flapstretch" as const;
    return "barksprint" as const;
  }
  if (lastKind === "softland") {
    if (roll < 0.14) return "glaucomyshush" as const;
    if (roll < 0.3) return "membranelaunch" as const;
    if (roll < 0.46) return "nestboxhuddle" as const;
    if (roll < 0.62) return "nocturnalscurry" as const;
    if (roll < 0.8) return "flapstretch" as const;
    return "barksprint" as const;
  }
  if (lastKind === "nestboxhuddle") {
    if (roll < 0.15) return "glaucomyshush" as const;
    if (roll < 0.31) return "membranelaunch" as const;
    if (roll < 0.47) return "softland" as const;
    if (roll < 0.63) return "nocturnalscurry" as const;
    if (roll < 0.81) return "flapstretch" as const;
    return "barksprint" as const;
  }
  if (lastKind === "nocturnalscurry") {
    if (roll < 0.16) return "glaucomyshush" as const;
    if (roll < 0.32) return "membranelaunch" as const;
    if (roll < 0.48) return "softland" as const;
    if (roll < 0.64) return "nestboxhuddle" as const;
    if (roll < 0.82) return "flapstretch" as const;
    return "barksprint" as const;
  }
  if (lastKind === "flapstretch") {
    if (roll < 0.15) return "glaucomyshush" as const;
    if (roll < 0.31) return "membranelaunch" as const;
    if (roll < 0.47) return "softland" as const;
    if (roll < 0.63) return "nestboxhuddle" as const;
    if (roll < 0.81) return "nocturnalscurry" as const;
    return "barksprint" as const;
  }
  if (lastKind === "barksprint") {
    if (roll < 0.16) return "glaucomyshush" as const;
    if (roll < 0.32) return "membranelaunch" as const;
    if (roll < 0.48) return "softland" as const;
    if (roll < 0.64) return "nestboxhuddle" as const;
    if (roll < 0.82) return "nocturnalscurry" as const;
    return "flapstretch" as const;
  }
  if (roll < 0.14) return "glaucomyshush" as const;
  if (roll < 0.28) return "membranelaunch" as const;
  if (roll < 0.42) return "softland" as const;
  if (roll < 0.56) return "nestboxhuddle" as const;
  if (roll < 0.7) return "nocturnalscurry" as const;
  if (roll < 0.85) return "flapstretch" as const;
  return "barksprint" as const;
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
  return key === TRICK_KEY || key === "glide";
}

export function startThankYou(
  key: string | undefined | null,
  lastKind: FlyingSquirrelHappyKind | null | undefined,
  x: number,
  facing: 1 | -1,
  flags?: TrickFlags
) {
  if (!wantsThankYou(key)) return null;
  if (!happyCanStart(flags || { cmd: "idle" })) return null;
  const pick = pickHappy(lastKind);
  return { happy: beginHappy(pick, x, facing), kind: pick };
}

export function pickHappy(lastKind?: FlyingSquirrelHappyKind | null, rand?: number) {
  const pool = HAPPY.filter((k) => k !== lastKind);
  const list = pool.length ? pool : [...HAPPY];
  const roll = rand == null ? Math.random() : rand;
  return list[Math.floor(roll * list.length)] || list[0];
}

export function beginHappy(kind: FlyingSquirrelHappyKind | string, x: number, facing: 1 | -1): FlyingSquirrelHappy {
  const name = (HAPPY as readonly string[]).includes(kind) ? (kind as FlyingSquirrelHappyKind) : "densglide";
  return {
    kind: name,
    happy: true,
    phase: "go",
    t: 0,
    x,
    lift: 0,
    rot: 0,
    anim: (name === "densglide" ? "sit" : name === "inkglide" ? "play" : "play") as TrickAnim,
    facing: (facing == null ? 1 : facing) as 1 | -1,
    fromX: x,
  };
}

export function densglidePose(t: number) {
  const u = Math.max(0, Math.min(1, t / HAPPY_DUR.densglide));
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

export function inkglidePose(t: number) {
  const u = Math.max(0, Math.min(1, t / HAPPY_DUR.inkglide));
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

export function densglaucomysPose(t: number) {
  return {
    lift: 2.2 + Math.abs(Math.sin(t * 0.58)) * 1.1,
    rot: Math.sin(t * 0.58) * 8,
    dx: Math.sin(t * 0.4) * 0.06,
    anim: "play" as TrickAnim,
  };
}

export function stepHappy(happy: FlyingSquirrelHappy | null | undefined, dt: number, flags?: TrickFlags) {
  if (!happy || happy.phase === "done") return happy;
  if (happyShouldAbort(flags)) {
    return { ...happy, phase: "done" as const, t: 0, lift: 0, rot: 0, anim: "idle" as TrickAnim, abort: true };
  }
  const next = { ...happy, t: happy.t + Math.max(0, dt) };
  const hold = HAPPY_DUR[next.kind];
  if (next.kind === "densglide") {
    const pose = densglidePose(next.t);
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "inkglide") {
    const pose = inkglidePose(next.t);
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else {
    const pose = densglaucomysPose(next.t);
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

export function beginTrick(kind: FlyingSquirrelTrickKind, x: number, facing: 1 | -1): FlyingSquirrelTrick {
  const anim: TrickAnim =
    kind === "glaucomyshush"
      ? "sit"
      : kind === "membranelaunch"
        ? "play"
        : kind === "barksprint"
          ? "talk"
          : kind === "softland"
            ? "walk"
            : kind === "nestboxhuddle"
              ? "sit"
              : kind === "nocturnalscurry"
                ? "play"
                : kind === "flapstretch"
                  ? "walk"
                  : "sit";
  return {
    kind,
    phase: kind === "glaucomyshush" ? "hold" : "go",
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

export function glaucomyshushPose(t: number) {
  return {
    lift: 2.4 + Math.abs(Math.sin(t * 0.42)) * 1.2,
    rot: -0.18 + Math.sin(t * 0.36) * 0.35,
  };
}

export function releasePose(t: number) {
  const u = Math.max(0, Math.min(1, t / RELEASE_S));
  return { lift: 2.4 * (1 - Math.sin(u * Math.PI * 0.5)), rot: -0.18 * (1 - u) };
}

export function membranelaunchPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.membranelaunch));
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

export function softlandPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.softland));
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

export function nestboxhuddlePose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.nestboxhuddle));
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

export function nocturnalscurryPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.nocturnalscurry));
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

export function flapstretchPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.flapstretch));
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

export function barksprintPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.barksprint));
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

export function stepTrick(trick: FlyingSquirrelTrick | null | undefined, dt: number, flags?: TrickFlags) {
  if (!trick || trick.phase === "done") return trick;
  if (
    shouldAbort(flags) &&
    trick.kind !== "membranelaunch" &&
    trick.kind !== "softland" &&
    trick.kind !== "nestboxhuddle" &&
    trick.kind !== "nocturnalscurry" &&
    trick.kind !== "flapstretch" &&
    trick.kind !== "barksprint"
  ) {
    return { ...trick, phase: "done" as const, t: 0, lift: 0, rot: 0, anim: "idle" as TrickAnim, abort: true };
  }
  const next = { ...trick, t: trick.t + Math.max(0, dt) };
  if (next.kind === "glaucomyshush") {
    if (next.t < GLAUCOMYSHUSH_HOLD) {
      const pose = glaucomyshushPose(next.t);
      next.phase = "hold";
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = "sit";
      return next;
    }
    if (next.t < GLAUCOMYSHUSH_HOLD + RELEASE_S) {
      const pose = releasePose(next.t - GLAUCOMYSHUSH_HOLD);
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
  if (next.kind === "membranelaunch") {
    const pose = membranelaunchPose(next.t, fromX, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "softland") {
    const pose = softlandPose(next.t, fromX, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "nestboxhuddle") {
    const pose = nestboxhuddlePose(next.t, fromX, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "nocturnalscurry") {
    const pose = nocturnalscurryPose(next.t, fromX, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "flapstretch") {
    const pose = flapstretchPose(next.t, fromX, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else {
    const pose = barksprintPose(next.t, fromX, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  }
  if (u >= 1) return { ...next, phase: "done" as const, lift: 0, rot: 0, anim: "idle" as TrickAnim };
  return next;
}
