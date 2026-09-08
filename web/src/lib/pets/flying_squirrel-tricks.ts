/** Glide ground tricks while idle. House neighborly southern flying squirrel (Glaucomys volans / Sciuridae Pteromyini) desk life -- membranelaunch / softland / nestboxhuddle / nocturnalscurry / glaucomyshush personality; NOT Sail/Cache/Cape/Wrist/Swing/Hang; guest slug Glide / key flying_squirrel -- accept flying_squirrel and glide; Thank-yous densglide / inkglide / densglaucomys. Sleep, hide, leave, rest, card, ribbon still win. Same map as desktop flying_squirrel-tricks.js. Next: Boom / howler. Catalog 220. */
export const TRICK_KEY = "flying_squirrel";
export const TRICKS = ["membranelaunch", "softland", "nestboxhuddle", "nocturnalscurry", "glaucomyshush"] as const;
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

export const HAPPY_DUR = { densglide: 2.58, inkglide: 2.71, densglaucomys: 2.44 } as const;
export const GLAUCOMYSHUSH_HOLD = 31.12;
export const RELEASE_S = 2.31;
export const DUR = { glaucomyshush: GLAUCOMYSHUSH_HOLD + RELEASE_S, membranelaunch: 5.36, softland: 5.08, nestboxhuddle: 5.22, nocturnalscurry: 4.96 } as const;

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
  if (kind === "glaucomyshush") return 198 + roll * 21;
  if (kind === "membranelaunch") return 24.1 + roll * 3.6;
  if (kind === "softland") return 23.4 + roll * 3.3;
  if (kind === "nestboxhuddle") return 25.6 + roll * 3.5;
  if (kind === "nocturnalscurry") return 22.2 + roll * 3.4;
  return justFinished ? 18.6 + roll * 2.9 : 13.9 + roll * 2.5;
}
export function pickTrick(rand?: number, musicOn?: boolean, lastKind?: FlyingSquirrelTrickKind | string) {
  if (musicOn) return "glaucomyshush";
  const roll = rand == null ? Math.random() : rand;
  if (lastKind === "glaucomyshush") {
    if (roll < 0.26) return "membranelaunch";
    if (roll < 0.5) return "softland";
    if (roll < 0.74) return "nestboxhuddle";
    return "nocturnalscurry";
  }
  if (lastKind === "membranelaunch") {
    if (roll < 0.26) return "glaucomyshush";
    if (roll < 0.5) return "softland";
    if (roll < 0.74) return "nestboxhuddle";
    return "nocturnalscurry";
  }
  if (lastKind === "softland") {
    if (roll < 0.22) return "glaucomyshush";
    if (roll < 0.44) return "membranelaunch";
    if (roll < 0.68) return "nestboxhuddle";
    return "nocturnalscurry";
  }
  if (roll < 0.2) return "glaucomyshush";
  if (roll < 0.4) return "membranelaunch";
  if (roll < 0.6) return "softland";
  if (roll < 0.8) return "nestboxhuddle";
  return "nocturnalscurry";
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
  lastKind: FlyingSquirrelHappyKind | string | undefined,
  x: number,
  facing?: 1 | -1,
  flags?: TrickFlags
) {
  if (!wantsThankYou(key)) return null;
  if (!happyCanStart(flags || { cmd: "idle" })) return null;
  const pick = pickHappy(lastKind);
  return { happy: beginHappy(pick, x, facing), kind: pick };
}
export function pickHappy(lastKind?: FlyingSquirrelHappyKind | string, rand?: number) {
  const pool = HAPPY.filter((k) => k !== lastKind);
  const list = pool.length ? pool : [...HAPPY];
  const roll = rand == null ? Math.random() : rand;
  return list[Math.floor(roll * list.length)] || list[0];
}
export function beginHappy(kind: FlyingSquirrelHappyKind | string, x: number, facing?: 1 | -1): FlyingSquirrelHappy {
  const name = (HAPPY as readonly string[]).indexOf(kind) >= 0 ? (kind as FlyingSquirrelHappyKind) : "densglide";
  return {
    kind: name,
    happy: true,
    phase: "go",
    t: 0,
    x,
    lift: 0,
    rot: 0,
    anim: name === "densglide" ? "sit" : name === "inkglide" ? "play" : "play",
    facing: facing == null ? 1 : facing,
    fromX: x,
  };
}

export function densglidePose(t: number) {
  const u = Math.max(0, Math.min(1, t / HAPPY_DUR.densglide));
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
export function inkglidePose(t: number) {
  const u = Math.max(0, Math.min(1, t / HAPPY_DUR.inkglide));
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
export function densglaucomysPose(t: number) {
  const u = Math.max(0, Math.min(1, t / HAPPY_DUR.densglaucomys));
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
export function stepHappy(happy: FlyingSquirrelHappy, dt: number, flags?: TrickFlags): FlyingSquirrelHappy {
  if (!happy || happy.phase === "done") return happy;
  if (happyShouldAbort(flags)) {
    return { ...happy, phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true };
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
  if (next.t >= hold) return { ...next, phase: "done", lift: 0, rot: 0, anim: "idle" };
  return next;
}
export function sleepHoldFrame(_key?: string, _frameCount?: number) {
  return null;
}
export function beginTrick(kind: FlyingSquirrelTrickKind | string, x: number, facing?: 1 | -1): FlyingSquirrelTrick {
  const k = (TRICKS as readonly string[]).includes(kind) ? (kind as FlyingSquirrelTrickKind) : "glaucomyshush";
  const anim: TrickAnim =
    k === "glaucomyshush"
      ? "sit"
      : k === "membranelaunch"
        ? "play"
        : k === "softland"
          ? "play"
          : k === "nocturnalscurry"
            ? "walk"
            : k === "nestboxhuddle"
              ? "sit"
              : "sit";
  return {
    kind: k,
    phase: k === "glaucomyshush" ? "hold" : "go",
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

export function glaucomyshushPose(t: number) {
  const breath = Math.sin(t * 0.00061) + 0.00019 * Math.sin(t * 0.00172);
  const hush = Math.abs(Math.sin(t * 0.00031));
  return { lift: -0.00018 + hush * 0.00005, rot: 0.0024 + breath * 0.0016 };
}
export function releasePose(t: number) {
  const u = Math.max(0, Math.min(1, t / RELEASE_S));
  return { lift: -0.00017 * (1 - Math.sin(u * Math.PI * 0.5)), rot: 0.0038 * (1 - u) };
}

export function membranelaunchPose(t: number, fromX: number, facing?: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.membranelaunch));
  const face = facing == null ? 1 : facing;
  if (u < 0.16) {
    const s = smoothstep(u / 0.16);
    return { x: fromX + face * s * 0.0004, lift: s * -0.0024, rot: s * 0.12 * face, anim: "play" as TrickAnim };
  }
  if (u < 0.34) {
    const s = smoothstep((u - 0.16) / 0.18);
    return { x: fromX + face * (0.0004 + s * 0.0012), lift: -0.0024 + s * 0.0148, rot: (0.12 - s * 0.34) * face, anim: "play" as TrickAnim };
  }
  if (u < 0.78) {
    const glide = (u - 0.34) / 0.44;
    const flap = Math.sin(glide * Math.PI * 1.85);
    return {
      x: fromX + face * (0.0016 + glide * 0.034),
      lift: 0.0124 - glide * 0.0055 + Math.abs(flap) * 0.0014,
      rot: (-0.22 + flap * 0.09) * face,
      anim: "play" as TrickAnim,
    };
  }
  const s = smoothstep((u - 0.78) / 0.22);
  return { x: fromX + face * (0.0356 - s * 0.0005), lift: 0.0069 * (1 - s), rot: -0.14 * (1 - s) * face, anim: "idle" as TrickAnim };
}
export function softlandPose(t: number, fromX: number, facing?: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.softland));
  const face = facing == null ? 1 : facing;
  if (u < 0.18) {
    const s = smoothstep(u / 0.18);
    return { x: fromX + face * s * 0.0011, lift: 0.0095 - s * 0.0068, rot: s * -0.16 * face, anim: "play" as TrickAnim };
  }
  if (u < 0.55) {
    const settle = (u - 0.18) / 0.37;
    const bounce = Math.sin(settle * Math.PI * 2.2) * (1 - settle);
    return {
      x: fromX + face * (0.0011 + settle * 0.0018),
      lift: 0.0027 + bounce * 0.0024,
      rot: (-0.16 + bounce * 0.12) * face,
      anim: "play" as TrickAnim,
    };
  }
  if (u < 0.82) {
    const hush = Math.sin(((u - 0.55) / 0.27) * Math.PI * 1.4);
    return {
      x: fromX + face * (0.0029 + Math.abs(hush) * 0.00035),
      lift: 0.0011 + Math.abs(hush) * 0.0007,
      rot: (-0.06 + hush * 0.08) * face,
      anim: "sit" as TrickAnim,
    };
  }
  const s = smoothstep((u - 0.82) / 0.18);
  return { x: fromX + face * 0.0031 * (1 - s), lift: 0.0011 * (1 - s), rot: -0.06 * (1 - s) * face, anim: "idle" as TrickAnim };
}
export function nestboxhuddlePose(t: number, fromX: number, facing?: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.nestboxhuddle));
  const face = facing == null ? 1 : facing;
  if (u < 0.2) {
    const s = smoothstep(u / 0.2);
    return { x: fromX + face * s * 0.0007, lift: s * -0.0046, rot: s * 0.28 * face, anim: "sit" as TrickAnim };
  }
  if (u < 0.76) {
    const huddle = Math.sin(((u - 0.2) / 0.56) * Math.PI * 1.65);
    return {
      x: fromX + face * (0.0007 + Math.abs(huddle) * 0.0004),
      lift: -0.0046 + Math.abs(huddle) * 0.0012,
      rot: (0.28 + huddle * 0.11) * face,
      anim: "sit" as TrickAnim,
    };
  }
  const s = smoothstep((u - 0.76) / 0.24);
  return { x: fromX + face * 0.0008 * (1 - s), lift: -0.0046 * (1 - s), rot: 0.28 * (1 - s) * face, anim: "idle" as TrickAnim };
}
export function nocturnalscurryPose(t: number, fromX: number, facing?: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.nocturnalscurry));
  const face = facing == null ? 1 : facing;
  if (u < 0.12) {
    const s = smoothstep(u / 0.12);
    return { x: fromX + face * s * 0.0014, lift: s * 0.0028, rot: s * -0.1 * face, anim: "walk" as TrickAnim };
  }
  if (u < 0.84) {
    const scurry = (u - 0.12) / 0.72;
    const dart = Math.sin(scurry * Math.PI * 5.6);
    return {
      x: fromX + face * (0.0014 + scurry * 0.022 + dart * 0.0011),
      lift: 0.0028 + Math.abs(dart) * 0.0022,
      rot: (-0.1 + dart * 0.16) * face,
      anim: "walk" as TrickAnim,
    };
  }
  const s = smoothstep((u - 0.84) / 0.16);
  return { x: fromX + face * (0.0234 - s * 0.0006), lift: 0.0028 * (1 - s), rot: -0.08 * (1 - s) * face, anim: "idle" as TrickAnim };
}
export function stepTrick(trick: FlyingSquirrelTrick, dt: number, flags?: TrickFlags): FlyingSquirrelTrick {
  if (!trick || trick.phase === "done") return trick;
  if (shouldAbort(flags) && trick.kind !== "membranelaunch" && trick.kind !== "softland" && trick.kind !== "nestboxhuddle" && trick.kind !== "nocturnalscurry") {
    return { ...trick, phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true };
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
    return { ...next, phase: "done", lift: 0, rot: 0, anim: "idle" };
  }
  const hold = DUR[next.kind];
  const u = next.t / hold;
  if (next.kind === "membranelaunch") {
    const pose = membranelaunchPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "softland") {
    const pose = softlandPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "nocturnalscurry") {
    const pose = nocturnalscurryPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else {
    const pose = nestboxhuddlePose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  }
  if (u >= 1) return { ...next, phase: "done", lift: 0, rot: 0, anim: "idle" };
  return next;
}
