/** Ridge ground tricks while idle. House neighborly boulder brain coral (Diploria labyrinthiformis / Mussidae) desk life -- meandroid ridge pulse / polyp tentacle wave / mucus sheet settle / day-expand night-contract / long diploria hush; NOT Gum/Still/Gaze; NOT sea star Cling; NOT Coral milk_snake; NOT Rui; guest slug Ridge / key brain_coral -- accept brain_coral and ridge; Thank-yous densridge / inkridge / densdiploria. Sleep, hide, leave, rest, card, ribbon still win. Same map as desktop brain_coral-tricks.js. Next: Wreath / anemone. Catalog 220. */
export const TRICK_KEY = "brain_coral";
export const TRICKS = ["meandroidridgepulse", "polyptentaclewave", "mucussheetsettle", "dayexpandnightcontract", "diploriahush"] as const;
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

export const HAPPY_DUR = { densridge: 2.78, inkridge: 2.94, densdiploria: 2.63 } as const;
export const DIPLORIAHUSH_HOLD = 34.22;
export const RELEASE_S = 2.61;
export const DUR = { diploriahush: DIPLORIAHUSH_HOLD + RELEASE_S, meandroidridgepulse: 5.48, polyptentaclewave: 5.64, mucussheetsettle: 5.31, dayexpandnightcontract: 5.91 } as const;

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
  if (kind === "diploriahush") return 218 + roll * 26;
  if (kind === "polyptentaclewave") return 27.1 + roll * 3.5;
  if (kind === "dayexpandnightcontract") return 25.8 + roll * 3.6;
  if (kind === "meandroidridgepulse") return 24.2 + roll * 3.3;
  if (kind === "mucussheetsettle") return 25.4 + roll * 3.4;
  return justFinished ? 19.1 + roll * 3.0 : 14.2 + roll * 2.6;
}
export function pickTrick(rand?: number, musicOn?: boolean, lastKind?: BrainCoralTrickKind | string) {
  if (musicOn) return "diploriahush";
  const roll = rand == null ? Math.random() : rand;
  if (lastKind === "diploriahush") {
    if (roll < 0.26) return "polyptentaclewave";
    if (roll < 0.5) return "dayexpandnightcontract";
    if (roll < 0.74) return "meandroidridgepulse";
    return "mucussheetsettle";
  }
  if (lastKind === "polyptentaclewave") {
    if (roll < 0.26) return "diploriahush";
    if (roll < 0.5) return "dayexpandnightcontract";
    if (roll < 0.74) return "meandroidridgepulse";
    return "mucussheetsettle";
  }
  if (lastKind === "dayexpandnightcontract") {
    if (roll < 0.22) return "diploriahush";
    if (roll < 0.44) return "polyptentaclewave";
    if (roll < 0.68) return "meandroidridgepulse";
    return "mucussheetsettle";
  }
  if (roll < 0.2) return "diploriahush";
  if (roll < 0.4) return "polyptentaclewave";
  if (roll < 0.6) return "dayexpandnightcontract";
  if (roll < 0.8) return "meandroidridgepulse";
  return "mucussheetsettle";
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
  lastKind: BrainCoralHappyKind | string | undefined,
  x: number,
  facing?: 1 | -1,
  flags?: TrickFlags
) {
  if (!wantsThankYou(key)) return null;
  if (!happyCanStart(flags || { cmd: "idle" })) return null;
  const pick = pickHappy(lastKind);
  return { happy: beginHappy(pick, x, facing), kind: pick };
}
export function pickHappy(lastKind?: BrainCoralHappyKind | string, rand?: number) {
  const pool = HAPPY.filter((k) => k !== lastKind);
  const list = pool.length ? pool : [...HAPPY];
  const roll = rand == null ? Math.random() : rand;
  return list[Math.floor(roll * list.length)] || list[0];
}
export function beginHappy(kind: BrainCoralHappyKind | string, x: number, facing?: 1 | -1): BrainCoralHappy {
  const name = (HAPPY as readonly string[]).indexOf(kind) >= 0 ? (kind as BrainCoralHappyKind) : "densridge";
  return {
    kind: name,
    happy: true,
    phase: "go",
    t: 0,
    x,
    lift: 0,
    rot: 0,
    anim: name === "densridge" ? "sit" : name === "inkridge" ? "play" : "play",
    facing: facing == null ? 1 : facing,
    fromX: x,
  };
}

export function densridgePose(t: number) {
  const u = Math.max(0, Math.min(1, t / HAPPY_DUR.densridge));
  if (u < 0.15) {
    const s = u / 0.15;
    return { lift: s * 0.0034, rot: s * -0.22, anim: "sit" as TrickAnim };
  }
  if (u < 0.84) {
    const sway = Math.sin(((u - 0.15) / 0.69) * Math.PI * 2.22);
    return { lift: 0.0034 + Math.abs(sway) * 0.0009, rot: -0.22 + sway * 0.16, anim: "sit" as TrickAnim };
  }
  const s = (u - 0.84) / 0.16;
  return { lift: 0.0034 * (1 - s), rot: -0.22 * (1 - s), anim: "idle" as TrickAnim };
}
export function inkridgePose(t: number) {
  const u = Math.max(0, Math.min(1, t / HAPPY_DUR.inkridge));
  if (u < 0.12) {
    const s = u / 0.12;
    return { lift: s * 0.0035, rot: s * 0.26, anim: "play" as TrickAnim };
  }
  if (u < 0.82) {
    const arc = Math.sin(((u - 0.12) / 0.7) * Math.PI * 3.12);
    return { lift: 0.0035 + Math.abs(arc) * 0.0020, rot: 0.26 + arc * 0.28, anim: "play" as TrickAnim };
  }
  const s = (u - 0.82) / 0.18;
  return { lift: 0.0035 * (1 - s), rot: 0.26 * (1 - s), anim: "idle" as TrickAnim };
}
export function densdiploriaPose(t: number) {
  const u = Math.max(0, Math.min(1, t / HAPPY_DUR.densdiploria));
  if (u < 0.14) {
    const s = u / 0.14;
    return { lift: s * -0.0016, rot: s * 0.17, anim: "play" as TrickAnim };
  }
  if (u < 0.83) {
    const hush = Math.sin(((u - 0.14) / 0.69) * Math.PI * 2.05);
    return { lift: -0.0016 + Math.abs(hush) * 0.0010, rot: 0.17 + hush * 0.16, anim: "play" as TrickAnim };
  }
  const s = (u - 0.83) / 0.17;
  return { lift: -0.0016 * (1 - s), rot: 0.17 * (1 - s), anim: "idle" as TrickAnim };
}
export function stepHappy(happy: BrainCoralHappy, dt: number, flags?: TrickFlags): BrainCoralHappy {
  if (!happy || happy.phase === "done") return happy;
  if (happyShouldAbort(flags)) {
    return { ...happy, phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true };
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
  if (next.t >= hold) return { ...next, phase: "done", lift: 0, rot: 0, anim: "idle" };
  return next;
}
export function sleepHoldFrame(_key?: string, _frameCount?: number) {
  return null;
}
export function beginTrick(kind: BrainCoralTrickKind | string, x: number, facing?: 1 | -1): BrainCoralTrick {
  const k = (TRICKS as readonly string[]).includes(kind) ? (kind as BrainCoralTrickKind) : "diploriahush";
  const anim: TrickAnim =
    k === "diploriahush"
      ? "sit"
      : k === "polyptentaclewave"
        ? "play"
        : k === "dayexpandnightcontract"
            ? "sit"
          : k === "mucussheetsettle"
              ? "sit"
            : k === "meandroidridgepulse"
                ? "sit"
              : "sit";
  return {
    kind: k,
    phase: k === "diploriahush" ? "hold" : "go",
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

export function diploriahushPose(t: number) {
  const breath = Math.sin(t * 0.00041) + 0.00014 * Math.sin(t * 0.00118);
  const hush = Math.abs(Math.sin(t * 0.00019));
  return { lift: -0.00022 + hush * 0.00005, rot: 0.0011 + breath * 0.0009 };
}
export function releasePose(t: number) {
  const u = Math.max(0, Math.min(1, t / RELEASE_S));
  return { lift: -0.00022 * (1 - Math.sin(u * Math.PI * 0.5)), rot: 0.0028 * (1 - u) };
}

export function polyptentaclewavePose(t: number, fromX: number, facing?: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.polyptentaclewave));
  const face = facing == null ? 1 : facing;
  if (u < 0.18) {
    const s = smoothstep(u / 0.18);
    return { x: fromX + face * s * 0.00008, lift: s * 0.0022, rot: s * 0.11 * face, anim: "play" as TrickAnim };
  }
  if (u < 0.84) {
    const wave = Math.sin(((u - 0.18) / 0.66) * Math.PI * 3.4);
    return {
      x: fromX + face * (0.00005 + wave * 0.00018),
      lift: 0.0022 + Math.abs(wave) * 0.0016,
      rot: (0.11 + wave * 0.19) * face,
      anim: "play" as TrickAnim,
    };
  }
  const s = smoothstep((u - 0.84) / 0.16);
  return { x: fromX + face * 0.00008 * (1 - s), lift: 0.0022 * (1 - s), rot: 0.11 * (1 - s) * face, anim: "idle" as TrickAnim };
}
export function dayexpandnightcontractPose(t: number, fromX: number, facing?: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.dayexpandnightcontract));
  const face = facing == null ? 1 : facing;
  if (u < 0.28) {
    const s = smoothstep(u / 0.28);
    return { x: fromX + face * s * 0.00012, lift: s * 0.0068, rot: s * 0.04 * face, anim: "sit" as TrickAnim };
  }
  if (u < 0.62) {
    const hold = Math.sin(((u - 0.28) / 0.34) * Math.PI);
    return {
      x: fromX + face * 0.00012,
      lift: 0.0068 + hold * 0.0006,
      rot: (0.04 + hold * 0.02) * face,
      anim: "sit" as TrickAnim,
    };
  }
  if (u < 0.88) {
    const c = smoothstep((u - 0.62) / 0.26);
    return {
      x: fromX + face * 0.00012 * (1 - c * 0.4),
      lift: 0.0068 * (1 - c) + (-0.0024) * c,
      rot: (0.04 * (1 - c) - 0.08 * c) * face,
      anim: "sit" as TrickAnim,
    };
  }
  const s = smoothstep((u - 0.88) / 0.12);
  return { x: fromX + face * 0.00007 * (1 - s), lift: -0.0024 * (1 - s), rot: -0.08 * (1 - s) * face, anim: "idle" as TrickAnim };
}
export function meandroidridgepulsePose(t: number, fromX: number, facing?: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.meandroidridgepulse));
  const face = facing == null ? 1 : facing;
  if (u < 0.16) {
    const s = smoothstep(u / 0.16);
    return { x: fromX + face * s * 0.0001, lift: s * 0.0018, rot: s * 0.08 * face, anim: "sit" as TrickAnim };
  }
  if (u < 0.86) {
    const pulse = Math.sin(((u - 0.16) / 0.7) * Math.PI * 2.6);
    return {
      x: fromX + face * (0.0001 + pulse * 0.00012),
      lift: 0.0018 + Math.abs(pulse) * 0.0024,
      rot: (0.08 + pulse * 0.09) * face,
      anim: "sit" as TrickAnim,
    };
  }
  const s = smoothstep((u - 0.86) / 0.14);
  return { x: fromX + face * 0.0001 * (1 - s), lift: 0.0018 * (1 - s), rot: 0.08 * (1 - s) * face, anim: "idle" as TrickAnim };
}
export function mucussheetsettlePose(t: number, fromX: number, facing?: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.mucussheetsettle));
  const face = facing == null ? 1 : facing;
  if (u < 0.2) {
    const s = smoothstep(u / 0.2);
    return { x: fromX + face * s * -0.00005, lift: s * -0.0036, rot: s * 0.06 * face, anim: "sit" as TrickAnim };
  }
  if (u < 0.8) {
    const sheet = Math.sin(((u - 0.2) / 0.6) * Math.PI * 1.4);
    return {
      x: fromX + face * (-0.00005 + sheet * 0.00004),
      lift: -0.0036 + Math.abs(sheet) * 0.0007,
      rot: (0.06 + sheet * 0.04) * face,
      anim: "sit" as TrickAnim,
    };
  }
  const s = smoothstep((u - 0.8) / 0.2);
  return { x: fromX + face * -0.00005 * (1 - s), lift: -0.0036 * (1 - s), rot: 0.06 * (1 - s) * face, anim: "idle" as TrickAnim };
}
export function stepTrick(trick: BrainCoralTrick, dt: number, flags?: TrickFlags): BrainCoralTrick {
  if (!trick || trick.phase === "done") return trick;
  if (shouldAbort(flags) && trick.kind !== "polyptentaclewave" && trick.kind !== "dayexpandnightcontract" && trick.kind !== "meandroidridgepulse" && trick.kind !== "mucussheetsettle") {
    return { ...trick, phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true };
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
    return { ...next, phase: "done", lift: 0, rot: 0, anim: "idle" };
  }
  const hold = DUR[next.kind];
  const u = next.t / hold;
  if (next.kind === "polyptentaclewave") {
    const pose = polyptentaclewavePose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "dayexpandnightcontract") {
    const pose = dayexpandnightcontractPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "mucussheetsettle") {
    const pose = mucussheetsettlePose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else {
    const pose = meandroidridgepulsePose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  }
  if (u >= 1) return { ...next, phase: "done", lift: 0, rot: 0, anim: "idle" };
  return next;
}
