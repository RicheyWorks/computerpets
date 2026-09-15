/** Ridge ground tricks while idle — ultra-polish pass. House neighborly Boulder Brain Coral Diploria labyrinthiformis / Mussidae desk life (brain_coral / Ridge) — meandroidridgepulse / polyptentaclewave / mucussheetsettle / dayexpandnightcontract / labyrinthfold / zooxflash / diploriahush personality (meandroidridgepulse meandroid ridge pulse without naming ridge or pulse or brain alone as wait — distinct from sea_star cling and Gum chew; polyptentaclewave polyp tentacle wave without naming wave or tentacle or polyp alone as wait — distinct from Wreath anemone; mucussheetsettle mucus sheet settle without naming mucus or sheet or settle alone as wait; dayexpandnightcontract day-expand night-contract without naming expand or contract or day alone as wait; labyrinthfold labyrinthine groove fold without naming fold or labyrinth or groove alone as wait — Diploria maze tell; zooxflash zooxanthellae light flash without naming flash or light or glow alone as wait — symbiont tell; long diploriahush Diploria hush hold (THE diploriahush sit_hold tell) — never named wait or crouch or sit or still or brain_coral or ridge or coral or cling as bare ethogram-only trick kinds; Gum koala owns eucchewbrowse/forkbranchperch/phascolarctoshush — do NOT reuse; sea_star owns cling — do NOT reuse; milk_snake Coral is unrelated; Wreath anemone owns wreath life next — do NOT reuse; guest slug Ridge / key brain_coral only for wantsThankYou matching — accept "brain_coral" and "ridge"; do NOT name a trick "brain_coral" or "ridge" or "coral" or "anemone" or "wreath" or "koala" or "gum"; not Gum Phascolarctos life, not Wreath Actiniaria life, not sea_star Asterias life, not Rui. Meandroidridgepulse / polyptentaclewave / mucussheetsettle / dayexpandnightcontract / labyrinthfold / zooxflash / diploriahush; densridge / inkridge / densdiploria thank-yous. Same map as desktop brain_coral-tricks.js. Window-play unchanged. Ethogram softs + freeze — never names ridge/polyp/still/walk/sit/wait/brain_coral/coral as bare ethogram-only trick kinds. True Boulder Brain Coral Diploria labyrinthiformis desk life only — meandroid ridge pulse, polyp tentacle wave, mucus sheet settle, day-expand night-contract, labyrinth fold, zoox flash, Diploria hush. Next house-order ultra: Wreath / anemone. No cry inventing — brain_coral.wav EXISTS so prefersHouseCry adds brain_coral after koala. Amplitudes raised toward Rui richness; denser waits/weights. Catalog 221. */
export const TRICK_KEY = "brain_coral";
export const TRICKS = ["meandroidridgepulse", "polyptentaclewave", "mucussheetsettle", "dayexpandnightcontract", "labyrinthfold", "zooxflash", "diploriahush"] as const;
export const HAPPY = ["densridge", "inkridge", "densdiploria"] as const;
export type BrainCoralTrickKind = (typeof TRICKS)[number];
export type BrainCoralHappyKind = (typeof HAPPY)[number];
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

export type BrainCoralTrick = {
  kind: BrainCoralTrickKind;
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

export type BrainCoralHappy = {
  kind: BrainCoralHappyKind;
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

export const HAPPY_DUR = { densridge: 1.70, inkridge: 1.84, densdiploria: 1.76 } as const;
export const DIPLORIAHUSH_HOLD = 11.2;
export const RELEASE_S = 1.18;
export const DUR = {
  diploriahush: DIPLORIAHUSH_HOLD + RELEASE_S,
  meandroidridgepulse: 2.48,
  polyptentaclewave: 2.42,
  mucussheetsettle: 2.40,
  dayexpandnightcontract: 2.44,
  labyrinthfold: 2.38,
  zooxflash: 2.56,
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

export function nextTrickWait(justFinished: boolean, rand?: number, kind?: BrainCoralTrickKind | string) {
  const roll = rand == null ? Math.random() : rand;
  if (kind === "diploriahush") return 40 + roll * 26;
  if (kind === "labyrinthfold" || kind === "zooxflash" || kind === "meandroidridgepulse") return 12.8 + roll * 9.4;
  if (kind === "mucussheetsettle" || kind === "polyptentaclewave" || kind === "dayexpandnightcontract") return 11.6 + roll * 8.5;
  return justFinished ? 8.5 + roll * 8.4 : 4.4 + roll * 7.4;
}

export function pickTrick(rand?: number, musicOn?: boolean, lastKind?: BrainCoralTrickKind | string | null) {
  if (musicOn) return "diploriahush" as const;
  const roll = rand == null ? Math.random() : rand;
  if (lastKind === "diploriahush") {
    if (roll < 0.17) return "meandroidridgepulse" as const;
    if (roll < 0.33) return "polyptentaclewave" as const;
    if (roll < 0.49) return "mucussheetsettle" as const;
    if (roll < 0.65) return "dayexpandnightcontract" as const;
    if (roll < 0.83) return "labyrinthfold" as const;
    return "zooxflash" as const;
  }
  if (lastKind === "meandroidridgepulse") {
    if (roll < 0.16) return "diploriahush" as const;
    if (roll < 0.32) return "polyptentaclewave" as const;
    if (roll < 0.48) return "mucussheetsettle" as const;
    if (roll < 0.64) return "dayexpandnightcontract" as const;
    if (roll < 0.82) return "labyrinthfold" as const;
    return "zooxflash" as const;
  }
  if (lastKind === "polyptentaclewave") {
    if (roll < 0.14) return "diploriahush" as const;
    if (roll < 0.3) return "meandroidridgepulse" as const;
    if (roll < 0.46) return "mucussheetsettle" as const;
    if (roll < 0.62) return "dayexpandnightcontract" as const;
    if (roll < 0.8) return "labyrinthfold" as const;
    return "zooxflash" as const;
  }
  if (lastKind === "mucussheetsettle") {
    if (roll < 0.15) return "diploriahush" as const;
    if (roll < 0.31) return "meandroidridgepulse" as const;
    if (roll < 0.47) return "polyptentaclewave" as const;
    if (roll < 0.63) return "dayexpandnightcontract" as const;
    if (roll < 0.81) return "labyrinthfold" as const;
    return "zooxflash" as const;
  }
  if (lastKind === "dayexpandnightcontract") {
    if (roll < 0.16) return "diploriahush" as const;
    if (roll < 0.32) return "meandroidridgepulse" as const;
    if (roll < 0.48) return "polyptentaclewave" as const;
    if (roll < 0.64) return "mucussheetsettle" as const;
    if (roll < 0.82) return "labyrinthfold" as const;
    return "zooxflash" as const;
  }
  if (lastKind === "labyrinthfold") {
    if (roll < 0.15) return "diploriahush" as const;
    if (roll < 0.31) return "meandroidridgepulse" as const;
    if (roll < 0.47) return "polyptentaclewave" as const;
    if (roll < 0.63) return "mucussheetsettle" as const;
    if (roll < 0.81) return "dayexpandnightcontract" as const;
    return "zooxflash" as const;
  }
  if (lastKind === "zooxflash") {
    if (roll < 0.16) return "diploriahush" as const;
    if (roll < 0.32) return "meandroidridgepulse" as const;
    if (roll < 0.48) return "polyptentaclewave" as const;
    if (roll < 0.64) return "mucussheetsettle" as const;
    if (roll < 0.82) return "dayexpandnightcontract" as const;
    return "labyrinthfold" as const;
  }
  if (roll < 0.14) return "diploriahush" as const;
  if (roll < 0.28) return "meandroidridgepulse" as const;
  if (roll < 0.42) return "polyptentaclewave" as const;
  if (roll < 0.56) return "mucussheetsettle" as const;
  if (roll < 0.7) return "dayexpandnightcontract" as const;
  if (roll < 0.85) return "labyrinthfold" as const;
  return "zooxflash" as const;
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
  return key === TRICK_KEY || key === "ridge";
}

export function startThankYou(
  key: string | undefined | null,
  lastKind: BrainCoralHappyKind | null | undefined,
  x: number,
  facing: 1 | -1,
  flags?: TrickFlags
) {
  if (!wantsThankYou(key)) return null;
  if (!happyCanStart(flags || { cmd: "idle" })) return null;
  const pick = pickHappy(lastKind);
  return { happy: beginHappy(pick, x, facing), kind: pick };
}

export function pickHappy(lastKind?: BrainCoralHappyKind | null, rand?: number) {
  const pool = HAPPY.filter((k) => k !== lastKind);
  const list = pool.length ? pool : [...HAPPY];
  const roll = rand == null ? Math.random() : rand;
  return list[Math.floor(roll * list.length)] || list[0];
}

export function beginHappy(kind: BrainCoralHappyKind | string, x: number, facing: 1 | -1): BrainCoralHappy {
  const name = (HAPPY as readonly string[]).includes(kind) ? (kind as BrainCoralHappyKind) : "densridge";
  return {
    kind: name,
    happy: true,
    phase: "go",
    t: 0,
    x,
    lift: 0,
    rot: 0,
    anim: (name === "densridge" ? "sit" : name === "inkridge" ? "play" : "play") as TrickAnim,
    facing: (facing == null ? 1 : facing) as 1 | -1,
    fromX: x,
  };
}

export function densridgePose(t: number) {
  const u = Math.max(0, Math.min(1, t / HAPPY_DUR.densridge));
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

export function inkridgePose(t: number) {
  const u = Math.max(0, Math.min(1, t / HAPPY_DUR.inkridge));
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

export function densdiploriaPose(t: number) {
  return {
    lift: 2.2 + Math.abs(Math.sin(t * 0.58)) * 1.1,
    rot: Math.sin(t * 0.58) * 8,
    dx: Math.sin(t * 0.4) * 0.06,
    anim: "play" as TrickAnim,
  };
}

export function stepHappy(happy: BrainCoralHappy | null | undefined, dt: number, flags?: TrickFlags) {
  if (!happy || happy.phase === "done") return happy;
  if (happyShouldAbort(flags)) {
    return { ...happy, phase: "done" as const, t: 0, lift: 0, rot: 0, anim: "idle" as TrickAnim, abort: true };
  }
  const next = { ...happy, t: happy.t + Math.max(0, dt) };
  const hold = HAPPY_DUR[next.kind];
  if (next.kind === "densridge") {
    const pose = densridgePose(next.t);
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "inkridge") {
    const pose = inkridgePose(next.t);
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else {
    const pose = densdiploriaPose(next.t);
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

export function beginTrick(kind: BrainCoralTrickKind | string, x: number, facing: 1 | -1): BrainCoralTrick {
  const k = (TRICKS as readonly string[]).includes(kind) ? (kind as BrainCoralTrickKind) : "diploriahush";
  const anim: TrickAnim =
    k === "diploriahush"
      ? "sit"
      : k === "meandroidridgepulse"
        ? "sit"
        : k === "zooxflash"
          ? "talk"
          : k === "polyptentaclewave"
            ? "play"
            : k === "mucussheetsettle"
              ? "sit"
              : k === "dayexpandnightcontract"
                ? "sit"
                : k === "labyrinthfold"
                  ? "walk"
                  : "sit";
  return {
    kind: k,
    phase: k === "diploriahush" ? "hold" : "go",
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

export function diploriahushPose(t: number) {
  return {
    lift: 2.4 + Math.abs(Math.sin(t * 0.42)) * 1.2,
    rot: -0.18 + Math.sin(t * 0.36) * 0.35,
  };
}

export function releasePose(t: number) {
  const u = Math.max(0, Math.min(1, t / RELEASE_S));
  return { lift: 2.4 * (1 - Math.sin(u * Math.PI * 0.5)), rot: -0.18 * (1 - u) };
}

export function meandroidridgepulsePose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.meandroidridgepulse));
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

export function polyptentaclewavePose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.polyptentaclewave));
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

export function mucussheetsettlePose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.mucussheetsettle));
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

export function dayexpandnightcontractPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.dayexpandnightcontract));
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

export function labyrinthfoldPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.labyrinthfold));
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

export function zooxflashPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.zooxflash));
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

export function stepTrick(trick: BrainCoralTrick | null | undefined, dt: number, flags?: TrickFlags) {
  if (!trick || trick.phase === "done") return trick;
  if (
    shouldAbort(flags) &&
    trick.kind !== "meandroidridgepulse" &&
    trick.kind !== "polyptentaclewave" &&
    trick.kind !== "mucussheetsettle" &&
    trick.kind !== "dayexpandnightcontract" &&
    trick.kind !== "labyrinthfold" &&
    trick.kind !== "zooxflash"
  ) {
    return { ...trick, phase: "done" as const, t: 0, lift: 0, rot: 0, anim: "idle" as TrickAnim, abort: true };
  }
  const next = { ...trick, t: trick.t + Math.max(0, dt) };
  if (next.kind === "diploriahush") {
    if (next.t < DIPLORIAHUSH_HOLD) {
      const pose = diploriahushPose(next.t);
      next.phase = "hold";
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = "sit";
      return next;
    }
    if (next.t < DIPLORIAHUSH_HOLD + RELEASE_S) {
      const pose = releasePose(next.t - DIPLORIAHUSH_HOLD);
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
  if (next.kind === "meandroidridgepulse") {
    const pose = meandroidridgepulsePose(next.t, fromX, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "polyptentaclewave") {
    const pose = polyptentaclewavePose(next.t, fromX, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "mucussheetsettle") {
    const pose = mucussheetsettlePose(next.t, fromX, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "dayexpandnightcontract") {
    const pose = dayexpandnightcontractPose(next.t, fromX, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "labyrinthfold") {
    const pose = labyrinthfoldPose(next.t, fromX, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else {
    const pose = zooxflashPose(next.t, fromX, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  }
  if (u >= 1) return { ...next, phase: "done" as const, lift: 0, rot: 0, anim: "idle" as TrickAnim };
  return next;
}
