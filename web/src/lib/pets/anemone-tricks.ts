/** Wreath ground tricks while idle — ultra-polish pass. House neighborly Magnificent Sea Anemone Heteractis magnifica / Actiniaria desk life (anemone / Wreath) — oraldiskwreathsway / nematocysttuck / pedaldiskwalkcreep / retractintocolumn / tentaclefan / oralflare / actiniahush personality (oraldiskwreathsway oral-disk wreath sway without naming wreath or sway or oral alone as wait; nematocysttuck nematocyst cnida tuck without naming tuck or sting or nematocyst alone as wait; pedaldiskwalkcreep pedal-disk walk creep without naming walk or creep or pedal alone as wait; retractintocolumn retract into column without naming retract or column or hide alone as wait; tentaclefan magnificent tentacle fan without naming tentacle or fan or wave alone as wait — Heteractis tentacle tell distinct from Ridge polyptentaclewave; oralflare oral-disk flare without naming flare or disk or mouth alone as wait — feeding tell; long actiniahush Actinia hush hold (THE actiniahush sit_hold tell) — never named wait or crouch or sit or still or anemone or wreath or open as bare ethogram-only trick kinds; Ridge brain_coral owns meandroidridgepulse/polyptentaclewave/diploriahush — do NOT reuse; moon_jelly and sea_star own their tells — do NOT reuse; Paint clownfish comes next — do NOT start; guest slug Wreath / key anemone only for wantsThankYou matching — accept "anemone" and "wreath"; do NOT name a trick "anemone" or "wreath" or "brain_coral" or "ridge" or "coral" or "clownfish" or "paint"; not Ridge Diploria life, not Paint Amphiprion life, not moon_jelly Aurelia life, not Rui. Oraldiskwreathsway / nematocysttuck / pedaldiskwalkcreep / retractintocolumn / tentaclefan / oralflare / actiniahush; denswreath / inkwreath / densactinia thank-yous. Same map as desktop anemone-tricks.js. Window-play unchanged. Ethogram softs + freeze — never names wreath/open/still/walk/sit/wait/anemone as bare ethogram-only trick kinds. True Magnificent Sea Anemone Heteractis magnifica desk life only — oral-disk wreath sway, nematocyst tuck, pedal-disk creep, column retract, tentacle fan, oral flare, Actinia hush. Next house-order ultra: Paint / clownfish. No cry inventing — anemone.wav EXISTS so prefersHouseCry adds anemone after brain_coral. Amplitudes raised toward Rui richness; denser waits/weights. Catalog 221. */
export const TRICK_KEY = "anemone";
export const TRICKS = ["oraldiskwreathsway", "nematocysttuck", "pedaldiskwalkcreep", "retractintocolumn", "tentaclefan", "oralflare", "actiniahush"] as const;
export const HAPPY = ["denswreath", "inkwreath", "densactinia"] as const;
export type AnemoneTrickKind = (typeof TRICKS)[number];
export type AnemoneHappyKind = (typeof HAPPY)[number];
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

export type AnemoneTrick = {
  kind: AnemoneTrickKind;
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

export type AnemoneHappy = {
  kind: AnemoneHappyKind;
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

export const HAPPY_DUR = { denswreath: 1.70, inkwreath: 1.84, densactinia: 1.76 } as const;
export const ACTINIAHUSH_HOLD = 11.2;
export const RELEASE_S = 1.18;
export const DUR = {
  actiniahush: ACTINIAHUSH_HOLD + RELEASE_S,
  oraldiskwreathsway: 2.48,
  nematocysttuck: 2.42,
  pedaldiskwalkcreep: 2.40,
  retractintocolumn: 2.44,
  tentaclefan: 2.38,
  oralflare: 2.56,
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

export function nextTrickWait(justFinished: boolean, rand?: number, kind?: AnemoneTrickKind | string) {
  const roll = rand == null ? Math.random() : rand;
  if (kind === "actiniahush") return 40 + roll * 26;
  if (kind === "tentaclefan" || kind === "oralflare" || kind === "oraldiskwreathsway") return 12.8 + roll * 9.4;
  if (kind === "pedaldiskwalkcreep" || kind === "nematocysttuck" || kind === "retractintocolumn") return 11.6 + roll * 8.5;
  return justFinished ? 8.5 + roll * 8.4 : 4.4 + roll * 7.4;
}

export function pickTrick(rand?: number, musicOn?: boolean, lastKind?: AnemoneTrickKind | string | null) {
  if (musicOn) return "actiniahush" as const;
  const roll = rand == null ? Math.random() : rand;
  if (lastKind === "actiniahush") {
    if (roll < 0.17) return "oraldiskwreathsway" as const;
    if (roll < 0.33) return "nematocysttuck" as const;
    if (roll < 0.49) return "pedaldiskwalkcreep" as const;
    if (roll < 0.65) return "retractintocolumn" as const;
    if (roll < 0.83) return "tentaclefan" as const;
    return "oralflare" as const;
  }
  if (lastKind === "oraldiskwreathsway") {
    if (roll < 0.16) return "actiniahush" as const;
    if (roll < 0.32) return "nematocysttuck" as const;
    if (roll < 0.48) return "pedaldiskwalkcreep" as const;
    if (roll < 0.64) return "retractintocolumn" as const;
    if (roll < 0.82) return "tentaclefan" as const;
    return "oralflare" as const;
  }
  if (lastKind === "nematocysttuck") {
    if (roll < 0.14) return "actiniahush" as const;
    if (roll < 0.3) return "oraldiskwreathsway" as const;
    if (roll < 0.46) return "pedaldiskwalkcreep" as const;
    if (roll < 0.62) return "retractintocolumn" as const;
    if (roll < 0.8) return "tentaclefan" as const;
    return "oralflare" as const;
  }
  if (lastKind === "pedaldiskwalkcreep") {
    if (roll < 0.15) return "actiniahush" as const;
    if (roll < 0.31) return "oraldiskwreathsway" as const;
    if (roll < 0.47) return "nematocysttuck" as const;
    if (roll < 0.63) return "retractintocolumn" as const;
    if (roll < 0.81) return "tentaclefan" as const;
    return "oralflare" as const;
  }
  if (lastKind === "retractintocolumn") {
    if (roll < 0.16) return "actiniahush" as const;
    if (roll < 0.32) return "oraldiskwreathsway" as const;
    if (roll < 0.48) return "nematocysttuck" as const;
    if (roll < 0.64) return "pedaldiskwalkcreep" as const;
    if (roll < 0.82) return "tentaclefan" as const;
    return "oralflare" as const;
  }
  if (lastKind === "tentaclefan") {
    if (roll < 0.15) return "actiniahush" as const;
    if (roll < 0.31) return "oraldiskwreathsway" as const;
    if (roll < 0.47) return "nematocysttuck" as const;
    if (roll < 0.63) return "pedaldiskwalkcreep" as const;
    if (roll < 0.81) return "retractintocolumn" as const;
    return "oralflare" as const;
  }
  if (lastKind === "oralflare") {
    if (roll < 0.16) return "actiniahush" as const;
    if (roll < 0.32) return "oraldiskwreathsway" as const;
    if (roll < 0.48) return "nematocysttuck" as const;
    if (roll < 0.64) return "pedaldiskwalkcreep" as const;
    if (roll < 0.82) return "retractintocolumn" as const;
    return "tentaclefan" as const;
  }
  if (roll < 0.14) return "actiniahush" as const;
  if (roll < 0.28) return "oraldiskwreathsway" as const;
  if (roll < 0.42) return "nematocysttuck" as const;
  if (roll < 0.56) return "pedaldiskwalkcreep" as const;
  if (roll < 0.7) return "retractintocolumn" as const;
  if (roll < 0.85) return "tentaclefan" as const;
  return "oralflare" as const;
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
  return key === TRICK_KEY || key === "wreath";
}

export function startThankYou(
  key: string | undefined | null,
  lastKind: AnemoneHappyKind | null | undefined,
  x: number,
  facing: 1 | -1,
  flags?: TrickFlags
) {
  if (!wantsThankYou(key)) return null;
  if (!happyCanStart(flags || { cmd: "idle" })) return null;
  const pick = pickHappy(lastKind);
  return { happy: beginHappy(pick, x, facing), kind: pick };
}

export function pickHappy(lastKind?: AnemoneHappyKind | null, rand?: number) {
  const pool = HAPPY.filter((k) => k !== lastKind);
  const list = pool.length ? pool : [...HAPPY];
  const roll = rand == null ? Math.random() : rand;
  return list[Math.floor(roll * list.length)] || list[0];
}

export function beginHappy(kind: AnemoneHappyKind | string, x: number, facing: 1 | -1): AnemoneHappy {
  const name = (HAPPY as readonly string[]).includes(kind) ? (kind as AnemoneHappyKind) : "denswreath";
  return {
    kind: name,
    happy: true,
    phase: "go",
    t: 0,
    x,
    lift: 0,
    rot: 0,
    anim: (name === "denswreath" ? "sit" : name === "inkwreath" ? "play" : "play") as TrickAnim,
    facing: (facing == null ? 1 : facing) as 1 | -1,
    fromX: x,
  };
}

export function denswreathPose(t: number) {
  const u = Math.max(0, Math.min(1, t / HAPPY_DUR.denswreath));
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

export function inkwreathPose(t: number) {
  const u = Math.max(0, Math.min(1, t / HAPPY_DUR.inkwreath));
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

export function densactiniaPose(t: number) {
  return {
    lift: 2.2 + Math.abs(Math.sin(t * 0.58)) * 1.1,
    rot: Math.sin(t * 0.58) * 8,
    dx: Math.sin(t * 0.4) * 0.06,
    anim: "play" as TrickAnim,
  };
}

export function stepHappy(happy: AnemoneHappy | null | undefined, dt: number, flags?: TrickFlags) {
  if (!happy || happy.phase === "done") return happy;
  if (happyShouldAbort(flags)) {
    return { ...happy, phase: "done" as const, t: 0, lift: 0, rot: 0, anim: "idle" as TrickAnim, abort: true };
  }
  const next = { ...happy, t: happy.t + Math.max(0, dt) };
  const hold = HAPPY_DUR[next.kind];
  if (next.kind === "denswreath") {
    const pose = denswreathPose(next.t);
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "inkwreath") {
    const pose = inkwreathPose(next.t);
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else {
    const pose = densactiniaPose(next.t);
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

export function beginTrick(kind: AnemoneTrickKind | string, x: number, facing: 1 | -1): AnemoneTrick {
  const k = (TRICKS as readonly string[]).includes(kind) ? (kind as AnemoneTrickKind) : "actiniahush";
  const anim: TrickAnim =
    k === "actiniahush"
      ? "sit"
      : k === "oraldiskwreathsway"
        ? "sit"
        : k === "oralflare"
          ? "talk"
          : k === "nematocysttuck"
            ? "play"
            : k === "pedaldiskwalkcreep"
              ? "sit"
              : k === "retractintocolumn"
                ? "sit"
                : k === "tentaclefan"
                  ? "walk"
                  : "sit";
  return {
    kind: k,
    phase: k === "actiniahush" ? "hold" : "go",
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

export function actiniahushPose(t: number) {
  return {
    lift: 2.4 + Math.abs(Math.sin(t * 0.42)) * 1.2,
    rot: -0.18 + Math.sin(t * 0.36) * 0.35,
  };
}

export function releasePose(t: number) {
  const u = Math.max(0, Math.min(1, t / RELEASE_S));
  return { lift: 2.4 * (1 - Math.sin(u * Math.PI * 0.5)), rot: -0.18 * (1 - u) };
}

export function oraldiskwreathswayPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.oraldiskwreathsway));
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

export function nematocysttuckPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.nematocysttuck));
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

export function pedaldiskwalkcreepPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.pedaldiskwalkcreep));
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

export function retractintocolumnPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.retractintocolumn));
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

export function tentaclefanPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.tentaclefan));
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

export function oralflarePose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.oralflare));
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

export function stepTrick(trick: AnemoneTrick | null | undefined, dt: number, flags?: TrickFlags) {
  if (!trick || trick.phase === "done") return trick;
  if (
    shouldAbort(flags) &&
    trick.kind !== "oraldiskwreathsway" &&
    trick.kind !== "nematocysttuck" &&
    trick.kind !== "pedaldiskwalkcreep" &&
    trick.kind !== "retractintocolumn" &&
    trick.kind !== "tentaclefan" &&
    trick.kind !== "oralflare"
  ) {
    return { ...trick, phase: "done" as const, t: 0, lift: 0, rot: 0, anim: "idle" as TrickAnim, abort: true };
  }
  const next = { ...trick, t: trick.t + Math.max(0, dt) };
  if (next.kind === "actiniahush") {
    if (next.t < ACTINIAHUSH_HOLD) {
      const pose = actiniahushPose(next.t);
      next.phase = "hold";
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = "sit";
      return next;
    }
    if (next.t < ACTINIAHUSH_HOLD + RELEASE_S) {
      const pose = releasePose(next.t - ACTINIAHUSH_HOLD);
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
  if (next.kind === "oraldiskwreathsway") {
    const pose = oraldiskwreathswayPose(next.t, fromX, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "nematocysttuck") {
    const pose = nematocysttuckPose(next.t, fromX, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "pedaldiskwalkcreep") {
    const pose = pedaldiskwalkcreepPose(next.t, fromX, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "retractintocolumn") {
    const pose = retractintocolumnPose(next.t, fromX, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "tentaclefan") {
    const pose = tentaclefanPose(next.t, fromX, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else {
    const pose = oralflarePose(next.t, fromX, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  }
  if (u >= 1) return { ...next, phase: "done" as const, lift: 0, rot: 0, anim: "idle" as TrickAnim };
  return next;
}
