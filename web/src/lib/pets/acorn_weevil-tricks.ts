/** Snout ground tricks while idle. House neighborly Curculionidae / Curculio acorn weevil desk life -- rostrumdrill / acornroll / dropthanatosis / snoutwalk / curculiohush personality (rostrumdrill long-rostrum drill-probe into an imaginary acorn cup distinct from Auger rasp/carpenter_bee and Forceps cercithreat; acornroll desk acorn push-roll distinct from Cache nutbury and Mast seed; dropthanatosis drop-thanatosis freeze distinct from Armor conglobate/volvation; snoutwalk slow Curculio desk walk distinct from Forceps nightscuttle and Haste fleetlegs; long curculiohush Curculio weevil hush -- never named wait; NOT Forceps earwig; NOT Lace; NOT Jewel; NOT Auger; NOT Armor; NOT Seven; NOT Cache; guest slug Snout / key acorn_weevil -- accept acorn_weevil and snout; Thank-yous denssnout / inksnout / denscurculio. Sleep, hide, leave, rest, card, ribbon still win. Same map as desktop acorn_weevil-tricks.js. Next: Click / click_beetle. Catalog 220. */
export const TRICK_KEY = "acorn_weevil";
export const TRICKS = ["rostrumdrill", "acornroll", "dropthanatosis", "snoutwalk", "curculiohush"] as const;
export const HAPPY = ["denssnout", "inksnout", "denscurculio"] as const;
export type AcornWeevilTrickKind = (typeof TRICKS)[number];
export type AcornWeevilHappyKind = (typeof HAPPY)[number];
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

export type AcornWeevilTrick = {
  kind: AcornWeevilTrickKind;
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

export type AcornWeevilHappy = {
  kind: AcornWeevilHappyKind;
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

export const HAPPY_DUR = { denssnout: 2.52, inksnout: 2.64, denscurculio: 2.40 } as const;
export const CURCULIOHUSH_HOLD = 29.20;
export const RELEASE_S = 2.12;
export const DUR = { curculiohush: CURCULIOHUSH_HOLD + RELEASE_S, rostrumdrill: 4.26, acornroll: 4.48, snoutwalk: 4.72, dropthanatosis: 4.12 } as const;

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
export function nextTrickWait(justFinished: boolean, rand?: number, kind?: AcornWeevilTrickKind | string) {
  const roll = rand == null ? Math.random() : rand;
  if (kind === "curculiohush") return 192 + roll * 18;
  if (kind === "rostrumdrill") return 21.4 + roll * 3.4;
  if (kind === "acornroll") return 23.6 + roll * 3.6;
  if (kind === "snoutwalk") return 26.0 + roll * 4.0;
  if (kind === "dropthanatosis") return 24.2 + roll * 3.5;
  return justFinished ? 18.2 + roll * 2.8 : 13.6 + roll * 2.4;
}
export function pickTrick(rand?: number, musicOn?: boolean, lastKind?: AcornWeevilTrickKind | string) {
  if (musicOn) return "curculiohush";
  const roll = rand == null ? Math.random() : rand;
  if (lastKind === "curculiohush") {
    if (roll < 0.26) return "rostrumdrill";
    if (roll < 0.5) return "acornroll";
    if (roll < 0.74) return "snoutwalk";
    return "dropthanatosis";
  }
  if (lastKind === "rostrumdrill") {
    if (roll < 0.26) return "curculiohush";
    if (roll < 0.5) return "acornroll";
    if (roll < 0.74) return "snoutwalk";
    return "dropthanatosis";
  }
  if (lastKind === "acornroll") {
    if (roll < 0.22) return "curculiohush";
    if (roll < 0.44) return "rostrumdrill";
    if (roll < 0.68) return "snoutwalk";
    return "dropthanatosis";
  }
  if (roll < 0.2) return "curculiohush";
  if (roll < 0.4) return "rostrumdrill";
  if (roll < 0.6) return "acornroll";
  if (roll < 0.8) return "snoutwalk";
  return "dropthanatosis";
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
  return key === TRICK_KEY || key === "snout";
}
export function startThankYou(
  key: string | undefined | null,
  lastKind: AcornWeevilHappyKind | string | undefined,
  x: number,
  facing?: 1 | -1,
  flags?: TrickFlags
) {
  if (!wantsThankYou(key)) return null;
  if (!happyCanStart(flags || { cmd: "idle" })) return null;
  const pick = pickHappy(lastKind);
  return { happy: beginHappy(pick, x, facing), kind: pick };
}
export function pickHappy(lastKind?: AcornWeevilHappyKind | string, rand?: number) {
  const pool = HAPPY.filter((k) => k !== lastKind);
  const list = pool.length ? pool : [...HAPPY];
  const roll = rand == null ? Math.random() : rand;
  return list[Math.floor(roll * list.length)] || list[0];
}
export function beginHappy(kind: AcornWeevilHappyKind | string, x: number, facing?: 1 | -1): AcornWeevilHappy {
  const name = (HAPPY as readonly string[]).indexOf(kind) >= 0 ? (kind as AcornWeevilHappyKind) : "denssnout";
  return {
    kind: name,
    happy: true,
    phase: "go",
    t: 0,
    x,
    lift: 0,
    rot: 0,
    anim: name === "denssnout" ? "sit" : name === "inksnout" ? "play" : "play",
    facing: facing == null ? 1 : facing,
    fromX: x,
  };
}
export function denssnoutPose(t: number) {
  const u = Math.max(0, Math.min(1, t / HAPPY_DUR.denssnout));
  if (u < 0.14) {
    const s = u / 0.14;
    return { lift: s * -0.0024, rot: s * 0.11, anim: "sit" as TrickAnim };
  }
  if (u < 0.86) {
    const cerci = Math.sin(((u - 0.14) / 0.72) * Math.PI * 2.35);
    return { lift: -0.0024 + Math.abs(cerci) * 0.00135, rot: 0.11 + cerci * 0.16, anim: "sit" as TrickAnim };
  }
  const s = (u - 0.86) / 0.14;
  return { lift: -0.0024 * (1 - s), rot: 0.11 * (1 - s), anim: "idle" as TrickAnim };
}
export function inksnoutPose(t: number) {
  const u = Math.max(0, Math.min(1, t / HAPPY_DUR.inksnout));
  if (u < 0.12) {
    const s = u / 0.12;
    return { lift: s * 0.0038, rot: s * -0.22, anim: "play" as TrickAnim };
  }
  if (u < 0.84) {
    const pulse = Math.sin(((u - 0.12) / 0.72) * Math.PI * 3.05);
    return { lift: 0.0038 + Math.abs(pulse) * 0.00185, rot: -0.22 + pulse * 0.26, anim: "play" as TrickAnim };
  }
  const s = (u - 0.84) / 0.16;
  return { lift: 0.0038 * (1 - s), rot: -0.22 * (1 - s), anim: "idle" as TrickAnim };
}
export function denscurculioPose(t: number) {
  const u = Math.max(0, Math.min(1, t / HAPPY_DUR.denscurculio));
  if (u < 0.13) {
    const s = u / 0.13;
    return { lift: s * 0.0016, rot: s * 0.14, anim: "play" as TrickAnim };
  }
  if (u < 0.82) {
    const flash = Math.sin(((u - 0.13) / 0.69) * Math.PI * 2.15);
    return { lift: 0.0016 + Math.abs(flash) * 0.00112, rot: 0.14 + flash * 0.15, anim: "play" as TrickAnim };
  }
  const s = (u - 0.82) / 0.18;
  return { lift: 0.0016 * (1 - s), rot: 0.14 * (1 - s), anim: "idle" as TrickAnim };
}
export function stepHappy(happy: AcornWeevilHappy, dt: number, flags?: TrickFlags): AcornWeevilHappy {
  if (!happy || happy.phase === "done") return happy;
  if (happyShouldAbort(flags)) {
    return { ...happy, phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true };
  }
  const next = { ...happy, t: happy.t + Math.max(0, dt) };
  const hold = HAPPY_DUR[next.kind];
  if (next.kind === "denssnout") {
    const pose = denssnoutPose(next.t);
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "inksnout") {
    const pose = inksnoutPose(next.t);
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else {
    const pose = denscurculioPose(next.t);
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
export function beginTrick(kind: AcornWeevilTrickKind | string, x: number, facing?: 1 | -1): AcornWeevilTrick {
  const k = (TRICKS as readonly string[]).includes(kind) ? (kind as AcornWeevilTrickKind) : "curculiohush";
  const anim: TrickAnim =
    k === "curculiohush"
      ? "sit"
      : k === "rostrumdrill"
        ? "play"
        : k === "acornroll"
          ? "play"
          : k === "dropthanatosis"
            ? "sit"
            : k === "snoutwalk"
              ? "walk"
              : "sit";
  return {
    kind: k,
    phase: k === "curculiohush" ? "hold" : "go",
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
export function curculiohushPose(t: number) {
  const breath = Math.sin(t * 0.00092) + 0.00034 * Math.sin(t * 0.0027);
  const hush = Math.abs(Math.sin(t * 0.00036));
  return { lift: -0.00022 + hush * 0.00006, rot: 0.006 + breath * 0.0024 };
}
export function releasePose(t: number) {
  const u = Math.max(0, Math.min(1, t / RELEASE_S));
  return { lift: -0.00022 * (1 - Math.sin(u * Math.PI * 0.5)), rot: 0.006 * (1 - u) };
}
export function rostrumdrillPose(t: number, fromX: number, facing?: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.rostrumdrill));
  const face = facing == null ? 1 : facing;
  if (u < 0.12) {
    const s = smoothstep(u / 0.12);
    return { x: fromX + face * s * 0.00004, lift: s * -0.0018, rot: s * 0.38 * face, anim: "play" as TrickAnim };
  }
  if (u < 0.55) {
    const threat = Math.sin((u - 0.12) / 0.43 * Math.PI * 3.4);
    return {
      x: fromX + face * (0.00004 + threat * 0.00012),
      lift: -0.0012 + Math.abs(threat) * 0.00055,
      rot: (0.32 + threat * 0.28) * face,
      anim: "play" as TrickAnim,
    };
  }
  if (u < 0.88) {
    const groom = Math.sin((u - 0.55) / 0.33 * Math.PI * 4.2);
    return {
      x: fromX + face * (0.00004 + groom * 0.00006),
      lift: -0.0006 + Math.abs(groom) * 0.0009,
      rot: (0.12 + groom * 0.14) * face,
      anim: "play" as TrickAnim,
    };
  }
  const s = smoothstep((u - 0.88) / 0.12);
  return { x: fromX + face * 0.00004 * (1 - s), lift: -0.0003 * (1 - s), rot: 0.04 * (1 - s) * face, anim: "idle" as TrickAnim };
}
export function acornrollPose(t: number, fromX: number, facing?: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.acornroll));
  const face = facing == null ? 1 : facing;
  if (u < 0.14) {
    const s = smoothstep(u / 0.14);
    return { x: fromX + face * s * 0.00005, lift: s * 0.0036, rot: s * -0.18 * face, anim: "play" as TrickAnim };
  }
  if (u < 0.72) {
    const fan = Math.sin((u - 0.14) / 0.58 * Math.PI);
    const shimmer = Math.sin(t * 8.4) * 0.012;
    return {
      x: fromX + face * (0.00005 + fan * 0.0001),
      lift: 0.0036 + fan * 0.0042 + Math.abs(shimmer) * 0.0004,
      rot: (-0.18 + fan * 0.42 + shimmer) * face,
      anim: "play" as TrickAnim,
    };
  }
  if (u < 0.88) {
    const s = smoothstep((u - 0.72) / 0.16);
    return { x: fromX + face * 0.00015, lift: 0.0078 - s * 0.0042, rot: (0.24 - s * 0.2) * face, anim: "play" as TrickAnim };
  }
  const s = smoothstep((u - 0.88) / 0.12);
  return { x: fromX + face * 0.00015 * (1 - s), lift: 0.0036 * (1 - s), rot: 0.04 * (1 - s) * face, anim: "idle" as TrickAnim };
}
export function snoutwalkPose(t: number, fromX: number, facing?: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.snoutwalk));
  const face = facing == null ? 1 : facing;
  if (u < 0.10) {
    const s = smoothstep(u / 0.10);
    return { x: fromX + face * s * 0.0002, lift: s * 0.0007, rot: s * -0.08 * face, anim: "walk" as TrickAnim };
  }
  if (u < 0.88) {
    const dash = (u - 0.10) / 0.78;
    const scuttle = Math.sin(dash * Math.PI * 6.4);
    const bob = Math.abs(Math.sin(dash * Math.PI * 5.1));
    return {
      x: fromX + face * (0.0002 + dash * 0.018 + scuttle * 0.00045),
      lift: 0.0007 + bob * 0.0011,
      rot: (-0.08 + scuttle * 0.12) * face,
      anim: "walk" as TrickAnim,
    };
  }
  const s = smoothstep((u - 0.88) / 0.12);
  return { x: fromX + face * 0.0282 * (1 - s * 0.015), lift: 0.0007 * (1 - s), rot: -0.02 * (1 - s) * face, anim: "idle" as TrickAnim };
}
export function dropthanatosisPose(t: number, fromX: number, facing?: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.dropthanatosis));
  const face = facing == null ? 1 : facing;
  if (u < 0.16) {
    const s = smoothstep(u / 0.16);
    return { x: fromX + face * s * 0.00003, lift: s * -0.0042, rot: s * 0.08 * face, anim: "sit" as TrickAnim };
  }
  if (u < 0.84) {
    const guard = Math.sin((u - 0.16) / 0.68 * Math.PI * 1.8);
    const nest = Math.abs(Math.sin(t * 1.35));
    return {
      x: fromX + face * (0.00003 + guard * 0.00008),
      lift: -0.0042 - nest * 0.0002,
      rot: (0.08 + guard * 0.04) * face,
      anim: "sit" as TrickAnim,
    };
  }
  const s = smoothstep((u - 0.84) / 0.16);
  return { x: fromX + face * 0.00003 * (1 - s), lift: -0.0042 * (1 - s), rot: 0.02 * (1 - s) * face, anim: "idle" as TrickAnim };
}
export function stepTrick(trick: AcornWeevilTrick, dt: number, flags?: TrickFlags): AcornWeevilTrick {
  if (!trick || trick.phase === "done") return trick;
  if (shouldAbort(flags) && trick.kind !== "rostrumdrill" && trick.kind !== "acornroll" && trick.kind !== "dropthanatosis" && trick.kind !== "snoutwalk") {
    return { ...trick, phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true };
  }
  const next = { ...trick, t: trick.t + Math.max(0, dt) };
  if (next.kind === "curculiohush") {
    if (next.t < CURCULIOHUSH_HOLD) {
      const pose = curculiohushPose(next.t);
      next.phase = "hold";
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = "sit";
      return next;
    }
    if (next.t < CURCULIOHUSH_HOLD + RELEASE_S) {
      const pose = releasePose(next.t - CURCULIOHUSH_HOLD);
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
  if (next.kind === "rostrumdrill") {
    const pose = rostrumdrillPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "acornroll") {
    const pose = acornrollPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "snoutwalk") {
    const pose = snoutwalkPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else {
    const pose = dropthanatosisPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  }
  if (u >= 1) return { ...next, phase: "done", lift: 0, rot: 0, anim: "idle" };
  return next;
}
