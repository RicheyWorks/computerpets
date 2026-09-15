/** Snout ground tricks while idle — ultra-polish pass. House neighborly Curculionidae / Curculio acorn weevil desk life (acorn_weevil / Snout) — rostrumdrill / acornroll / dropthanatosis / snoutwalk / elytraclamp / cupprobe / curculiohush personality; denssnout / inksnout / denscurculio thank-yous; accept acorn_weevil and snout; NOT Forceps earwig cercithreat/fanwing/nightscuttle/broodguard/tegminacurl/cerciwhip/forficulahush; NOT Armor conglobate/volvation; NOT Cache nutbury; NOT Auger rasp; NOT bare acorn_weevil/snout/click as trick kinds; ethogram softs + freeze; window-play unchanged; Same map as desktop acorn_weevil-tricks.js. True Acorn Weevil Curculio Curculionidae desk life. Next house-order ultra: Click / click_beetle. acorn_weevil.wav EXISTS so prefersHouseCry adds acorn_weevil after earwig. Rui amplitudes; denser waits/weights. Catalog 221. */
export const TRICK_KEY = "acorn_weevil";
export const TRICKS = ["rostrumdrill", "acornroll", "dropthanatosis", "snoutwalk", "elytraclamp", "cupprobe", "curculiohush"] as const;
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

export const HAPPY_DUR = { denssnout: 1.70, inksnout: 1.84, denscurculio: 1.76 } as const;
export const CURCULIOHUSH_HOLD = 11.2;
export const RELEASE_S = 1.18;
export const DUR = {
  curculiohush: CURCULIOHUSH_HOLD + RELEASE_S,
  rostrumdrill: 2.48,
  acornroll: 2.42,
  dropthanatosis: 2.40,
  snoutwalk: 2.44,
  elytraclamp: 2.38,
  cupprobe: 2.56,
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

export function nextTrickWait(justFinished: boolean, rand?: number, kind?: AcornWeevilTrickKind | string) {
  const roll = rand == null ? Math.random() : rand;
  if (kind === "curculiohush") return 40 + roll * 26;
  if (kind === "elytraclamp" || kind === "rostrumdrill" || kind === "snoutwalk") return 12.8 + roll * 9.4;
  if (kind === "dropthanatosis" || kind === "acornroll" || kind === "cupprobe") return 11.6 + roll * 8.5;
  return justFinished ? 8.5 + roll * 8.4 : 4.4 + roll * 7.4;
}

export function pickTrick(rand?: number, musicOn?: boolean, lastKind?: AcornWeevilTrickKind | string | null) {
  if (musicOn) return "curculiohush" as const;
  const roll = rand == null ? Math.random() : rand;
  if (lastKind === "curculiohush") {
    if (roll < 0.17) return "rostrumdrill" as const;
    if (roll < 0.33) return "acornroll" as const;
    if (roll < 0.49) return "dropthanatosis" as const;
    if (roll < 0.65) return "snoutwalk" as const;
    if (roll < 0.83) return "elytraclamp" as const;
    return "cupprobe" as const;
  }
  if (lastKind === "rostrumdrill") {
    if (roll < 0.16) return "curculiohush" as const;
    if (roll < 0.32) return "acornroll" as const;
    if (roll < 0.48) return "dropthanatosis" as const;
    if (roll < 0.64) return "snoutwalk" as const;
    if (roll < 0.82) return "elytraclamp" as const;
    return "cupprobe" as const;
  }
  if (lastKind === "acornroll") {
    if (roll < 0.14) return "curculiohush" as const;
    if (roll < 0.3) return "rostrumdrill" as const;
    if (roll < 0.46) return "dropthanatosis" as const;
    if (roll < 0.62) return "snoutwalk" as const;
    if (roll < 0.8) return "elytraclamp" as const;
    return "cupprobe" as const;
  }
  if (lastKind === "dropthanatosis") {
    if (roll < 0.15) return "curculiohush" as const;
    if (roll < 0.31) return "rostrumdrill" as const;
    if (roll < 0.47) return "acornroll" as const;
    if (roll < 0.63) return "snoutwalk" as const;
    if (roll < 0.81) return "elytraclamp" as const;
    return "cupprobe" as const;
  }
  if (lastKind === "snoutwalk") {
    if (roll < 0.16) return "curculiohush" as const;
    if (roll < 0.32) return "rostrumdrill" as const;
    if (roll < 0.48) return "acornroll" as const;
    if (roll < 0.64) return "dropthanatosis" as const;
    if (roll < 0.82) return "elytraclamp" as const;
    return "cupprobe" as const;
  }
  if (lastKind === "elytraclamp") {
    if (roll < 0.15) return "curculiohush" as const;
    if (roll < 0.31) return "rostrumdrill" as const;
    if (roll < 0.47) return "acornroll" as const;
    if (roll < 0.63) return "dropthanatosis" as const;
    if (roll < 0.81) return "snoutwalk" as const;
    return "cupprobe" as const;
  }
  if (lastKind === "cupprobe") {
    if (roll < 0.16) return "curculiohush" as const;
    if (roll < 0.32) return "rostrumdrill" as const;
    if (roll < 0.48) return "acornroll" as const;
    if (roll < 0.64) return "dropthanatosis" as const;
    if (roll < 0.82) return "snoutwalk" as const;
    return "elytraclamp" as const;
  }
  if (roll < 0.14) return "curculiohush" as const;
  if (roll < 0.28) return "rostrumdrill" as const;
  if (roll < 0.42) return "acornroll" as const;
  if (roll < 0.56) return "dropthanatosis" as const;
  if (roll < 0.7) return "snoutwalk" as const;
  if (roll < 0.85) return "elytraclamp" as const;
  return "cupprobe" as const;
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
  lastKind: AcornWeevilHappyKind | null | undefined,
  x: number,
  facing: 1 | -1,
  flags?: TrickFlags
) {
  if (!wantsThankYou(key)) return null;
  if (!happyCanStart(flags || { cmd: "idle" })) return null;
  const pick = pickHappy(lastKind);
  return { happy: beginHappy(pick, x, facing), kind: pick };
}

export function pickHappy(lastKind?: AcornWeevilHappyKind | null, rand?: number) {
  const pool = HAPPY.filter((k) => k !== lastKind);
  const list = pool.length ? pool : [...HAPPY];
  const roll = rand == null ? Math.random() : rand;
  return list[Math.floor(roll * list.length)] || list[0];
}

export function beginHappy(kind: AcornWeevilHappyKind | string, x: number, facing: 1 | -1): AcornWeevilHappy {
  const name = (HAPPY as readonly string[]).includes(kind) ? (kind as AcornWeevilHappyKind) : "denssnout";
  return {
    kind: name,
    happy: true,
    phase: "go",
    t: 0,
    x,
    lift: 0,
    rot: 0,
    anim: (name === "denssnout" ? "sit" : name === "inksnout" ? "play" : "play") as TrickAnim,
    facing: (facing == null ? 1 : facing) as 1 | -1,
    fromX: x,
  };
}

export function denssnoutPose(t: number) {
  const u = Math.max(0, Math.min(1, t / HAPPY_DUR.denssnout));
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

export function inksnoutPose(t: number) {
  const u = Math.max(0, Math.min(1, t / HAPPY_DUR.inksnout));
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

export function denscurculioPose(t: number) {
  return {
    lift: 2.2 + Math.abs(Math.sin(t * 0.58)) * 1.1,
    rot: Math.sin(t * 0.58) * 8,
    dx: Math.sin(t * 0.4) * 0.06,
    anim: "play" as TrickAnim,
  };
}

export function stepHappy(happy: AcornWeevilHappy | null | undefined, dt: number, flags?: TrickFlags) {
  if (!happy || happy.phase === "done") return happy;
  if (happyShouldAbort(flags)) {
    return { ...happy, phase: "done" as const, t: 0, lift: 0, rot: 0, anim: "idle" as TrickAnim, abort: true };
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
  if (next.t >= hold) return { ...next, phase: "done" as const, lift: 0, rot: 0, anim: "idle" as TrickAnim };
  return next;
}

export function sleepHoldFrame(_key?: string | null, _frameCount?: number) {
  return null;
}

export function beginTrick(kind: AcornWeevilTrickKind, x: number, facing: 1 | -1): AcornWeevilTrick {
  const anim: TrickAnim =
    kind === "curculiohush"
      ? "sit"
      : kind === "rostrumdrill"
        ? "play"
        : kind === "cupprobe"
          ? "talk"
          : kind === "acornroll"
            ? "walk"
            : kind === "dropthanatosis"
              ? "sit"
              : kind === "snoutwalk"
                ? "play"
                : kind === "elytraclamp"
                  ? "walk"
                  : "sit";
  return {
    kind,
    phase: kind === "curculiohush" ? "hold" : "go",
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

export function curculiohushPose(t: number) {
  return {
    lift: 2.4 + Math.abs(Math.sin(t * 0.42)) * 1.2,
    rot: -0.18 + Math.sin(t * 0.36) * 0.35,
  };
}

export function releasePose(t: number) {
  const u = Math.max(0, Math.min(1, t / RELEASE_S));
  return { lift: 2.4 * (1 - Math.sin(u * Math.PI * 0.5)), rot: -0.18 * (1 - u) };
}

export function rostrumdrillPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.rostrumdrill));
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

export function acornrollPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.acornroll));
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

export function dropthanatosisPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.dropthanatosis));
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

export function snoutwalkPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.snoutwalk));
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

export function elytraclampPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.elytraclamp));
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

export function cupprobePose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.cupprobe));
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

export function stepTrick(trick: AcornWeevilTrick | null | undefined, dt: number, flags?: TrickFlags) {
  if (!trick || trick.phase === "done") return trick;
  if (
    shouldAbort(flags) &&
    trick.kind !== "rostrumdrill" &&
    trick.kind !== "acornroll" &&
    trick.kind !== "dropthanatosis" &&
    trick.kind !== "snoutwalk" &&
    trick.kind !== "elytraclamp" &&
    trick.kind !== "cupprobe"
  ) {
    return { ...trick, phase: "done" as const, t: 0, lift: 0, rot: 0, anim: "idle" as TrickAnim, abort: true };
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
    return { ...next, phase: "done" as const, lift: 0, rot: 0, anim: "idle" as TrickAnim };
  }
  const hold = DUR[next.kind];
  const u = next.t / hold;
  const fromX = trick.fromX != null ? trick.fromX : trick.x;
  if (next.kind === "rostrumdrill") {
    const pose = rostrumdrillPose(next.t, fromX, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "acornroll") {
    const pose = acornrollPose(next.t, fromX, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "dropthanatosis") {
    const pose = dropthanatosisPose(next.t, fromX, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "snoutwalk") {
    const pose = snoutwalkPose(next.t, fromX, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "elytraclamp") {
    const pose = elytraclampPose(next.t, fromX, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else {
    const pose = cupprobePose(next.t, fromX, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  }
  if (u >= 1) return { ...next, phase: "done" as const, lift: 0, rot: 0, anim: "idle" as TrickAnim };
  return next;
}
