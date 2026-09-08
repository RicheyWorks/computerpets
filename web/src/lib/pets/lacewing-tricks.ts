/** Lace ground tricks while idle. House neighborly Chrysopidae / Chrysopa green lacewing desk life -- wingtremble / aphidstalk / eggraise / nightglint / chrysopahush personality (wingtremble lace-wing tremble flutter distinct from Jewel wingtremble, Banner wingbanner, Fan flutter, Darner whir; aphidstalk aphid-predator stalk crawl distinct from Jewel aphidstalk and Dart hawking; eggraise desk-safe stalked-egg pedicel raise cue distinct from Jewel nightglint and Milk chrysalis; nightglint night-glow eye glint distinct from Spark lantern/jstroke and Jewel eggraise; long chrysopahush Chrysopa lacewing hush -- never named wait; NOT Jewel jewelwing (wingtremble/aphidstalk/eggraise/nightglint/chrysopahush); NOT Dart darner (hawking/tandem/nymph/whir/anax); NOT Banner swallowtail; NOT Spark firefly; NOT Milk monarch; NOT Ghost luna; NOT Comb honeybee; NOT Vault grasshopper; NOT Blade katydid; NOT Chirp cricket; window-play and Call Lace leave lacewing alone; guest slug Lace / key lacewing -- accept "lacewing" and "lace"; Thank-yous denslace / inklace / denschrysopa. Feed-happy after eat. Sleep, hide, leave, rest, card, ribbon still win. Same map as desktop lacewing-tricks.js. Next: Forceps / earwig. Catalog 220. */
export const TRICK_KEY = "lacewing";
export const TRICKS = ["wingtremble", "aphidstalk", "eggraise", "nightglint", "chrysopahush"] as const;
export const HAPPY = ["denslace", "inklace", "denschrysopa"] as const;
export type LacewingTrickKind = (typeof TRICKS)[number];
export type LacewingHappyKind = (typeof HAPPY)[number];
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

export type LacewingTrick = {
  kind: LacewingTrickKind;
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

export type LacewingHappy = {
  kind: LacewingHappyKind;
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

export const HAPPY_DUR = { denslace: 2.52, inklace: 2.62, denschrysopa: 2.40 } as const;
export const CHRYSOPAHUSH_HOLD = 29.40;
export const RELEASE_S = 2.12;
export const DUR = { chrysopahush: CHRYSOPAHUSH_HOLD + RELEASE_S, wingtremble: 4.26, aphidstalk: 4.88, eggraise: 4.08, nightglint: 4.52 } as const;

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
export function nextTrickWait(justFinished: boolean, rand?: number, kind?: LacewingTrickKind | string) {
  const roll = rand == null ? Math.random() : rand;
  if (kind === "chrysopahush") return 192 + roll * 18;
  if (kind === "wingtremble") return 21.4 + roll * 3.4;
  if (kind === "aphidstalk") return 27.0 + roll * 4.1;
  if (kind === "eggraise") return 22.8 + roll * 3.5;
  if (kind === "nightglint") return 23.6 + roll * 3.6;
  return justFinished ? 18.6 + roll * 2.9 : 14.0 + roll * 2.5;
}
export function pickTrick(rand?: number, musicOn?: boolean, lastKind?: LacewingTrickKind | string) {
  if (musicOn) return "chrysopahush";
  const roll = rand == null ? Math.random() : rand;
  if (lastKind === "chrysopahush") {
    if (roll < 0.26) return "wingtremble";
    if (roll < 0.5) return "aphidstalk";
    if (roll < 0.74) return "eggraise";
    return "nightglint";
  }
  if (lastKind === "wingtremble") {
    if (roll < 0.26) return "chrysopahush";
    if (roll < 0.5) return "aphidstalk";
    if (roll < 0.74) return "eggraise";
    return "nightglint";
  }
  if (lastKind === "aphidstalk") {
    if (roll < 0.22) return "chrysopahush";
    if (roll < 0.44) return "wingtremble";
    if (roll < 0.68) return "eggraise";
    return "nightglint";
  }
  if (roll < 0.2) return "chrysopahush";
  if (roll < 0.4) return "wingtremble";
  if (roll < 0.6) return "aphidstalk";
  if (roll < 0.8) return "eggraise";
  return "nightglint";
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
  return cmd === "sleep" || cmd === "leave" || cmd === "hide" || cmd === "rest" || cmd === "seek" || cmd === "play" || cmd === "talk" || cmd === "enter";
}
export function wantsThankYou(key: string | undefined | null) {
  return key === TRICK_KEY || key === "lace";
}
export function startThankYou(key: string | undefined | null, lastKind: string | undefined | null, x: number, facing: 1 | -1 | undefined, flags?: TrickFlags) {
  if (!wantsThankYou(key)) return null;
  if (!happyCanStart(flags || { cmd: "idle" })) return null;
  const pick = pickHappy(lastKind);
  return { happy: beginHappy(pick, x, facing), kind: pick };
}
export function pickHappy(lastKind?: string | null, rand?: number) {
  const pool = HAPPY.filter((k) => k !== lastKind);
  const list = pool.length ? pool : [...HAPPY];
  const roll = rand == null ? Math.random() : rand;
  return list[Math.floor(roll * list.length)] || list[0];
}
export function beginHappy(kind: LacewingHappyKind | string, x: number, facing?: 1 | -1): LacewingHappy {
  const name = (HAPPY as readonly string[]).indexOf(kind) >= 0 ? (kind as LacewingHappyKind) : "denslace";
  return {
    kind: name,
    happy: true,
    phase: "go",
    t: 0,
    x,
    lift: 0,
    rot: 0,
    anim: name === "denslace" ? "sit" : name === "inklace" ? "play" : "play",
    facing: facing == null ? 1 : facing,
    fromX: x,
  };
}
export function denslacePose(t: number): { lift: number; rot: number; anim: TrickAnim } {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.denslace));
    if (u < 0.14) {
      const s = u / 0.14;
      return { lift: s * -0.0021, rot: s * -0.08, anim: "sit" };
    }
    if (u < 0.86) {
      const wing = Math.sin(((u - 0.14) / 0.72) * Math.PI * 2.55);
      return { lift: -0.0021 + Math.abs(wing) * 0.00155, rot: -0.08 + wing * 0.13, anim: "sit" };
    }
    const s = (u - 0.86) / 0.14;
    return { lift: -0.0021 * (1 - s), rot: -0.08 * (1 - s), anim: "idle" };
  }
export function inklacePose(t: number): { lift: number; rot: number; anim: TrickAnim } {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.inklace));
    if (u < 0.12) {
      const s = u / 0.12;
      return { lift: s * 0.0042, rot: s * 0.28, anim: "play" };
    }
    if (u < 0.84) {
      const pulse = Math.sin(((u - 0.12) / 0.72) * Math.PI * 3.2);
      return { lift: 0.0042 + Math.abs(pulse) * 0.00195, rot: 0.28 + pulse * 0.24, anim: "play" };
    }
    const s = (u - 0.84) / 0.16;
    return { lift: 0.0042 * (1 - s), rot: 0.28 * (1 - s), anim: "idle" };
  }
export function denschrysopaPose(t: number): { lift: number; rot: number; anim: TrickAnim } {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.denschrysopa));
    if (u < 0.13) {
      const s = u / 0.13;
      return { lift: s * 0.0014, rot: s * -0.12, anim: "play" };
    }
    if (u < 0.82) {
      const flash = Math.sin(((u - 0.13) / 0.69) * Math.PI * 2.05);
      return { lift: 0.0014 + Math.abs(flash) * 0.00105, rot: -0.12 + flash * 0.14, anim: "play" };
    }
    const s = (u - 0.82) / 0.18;
    return { lift: 0.0014 * (1 - s), rot: -0.12 * (1 - s), anim: "idle" };
  }
export function stepHappy(happy: LacewingHappy, dt: number, flags?: TrickFlags): LacewingHappy {
  if (!happy || happy.phase === "done") return happy;
  if (happyShouldAbort(flags)) {
    return { ...happy, phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true };
  }
  const next = { ...happy, t: happy.t + Math.max(0, dt) };
  const hold = HAPPY_DUR[next.kind];
  if (next.kind === "denslace") {
    const pose = denslacePose(next.t);
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "inklace") {
    const pose = inklacePose(next.t);
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else {
    const pose = denschrysopaPose(next.t);
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
export function beginTrick(kind: LacewingTrickKind | string, x: number, facing?: 1 | -1): LacewingTrick {
  const k = (TRICKS as readonly string[]).includes(kind) ? (kind as LacewingTrickKind) : "chrysopahush";
  const anim: TrickAnim =
    k === "chrysopahush"
      ? "sit"
      : k === "wingtremble"
        ? "play"
        : k === "aphidstalk"
          ? "play"
          : k === "eggraise"
            ? "talk"
            : k === "nightglint"
              ? "sit"
              : "sit";
  return {
    kind: k,
    phase: k === "chrysopahush" ? "hold" : "go",
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
export function chrysopahushPose(t: number): { lift: number; rot: number } {
    const breath = Math.sin(t * 0.00098) + 0.00038 * Math.sin(t * 0.0029);
    const hush = Math.abs(Math.sin(t * 0.00040));
    return { lift: -0.00018 + hush * 0.00007, rot: -0.008 + breath * 0.0026 };
  }
export function releasePose(t: number): { lift: number; rot: number } {
    const u = Math.max(0, Math.min(1, t / RELEASE_S));
    return { lift: -0.00018 * (1 - Math.sin(u * Math.PI * 0.5)), rot: -0.008 * (1 - u) };
  }
export function wingtremblePose(t: number, fromX: number, facing?: 1 | -1): { x: number; lift: number; rot: number; anim: TrickAnim } {
    const u = Math.max(0, Math.min(1, t / DUR.wingtremble));
    const face = facing == null ? 1 : facing;
    if (u < 0.10) {
      const s = smoothstep(u / 0.10);
      return { x: fromX + face * s * 0.00006, lift: s * 0.0018, rot: s * -0.14 * face, anim: "play" };
    }
    if (u < 0.90) {
      const tremble = Math.sin((u - 0.10) / 0.80 * Math.PI * 11.5);
      const lace = Math.sin(t * 6.8) * 0.018 + 0.006 * Math.sin(t * 13.2);
      return {
        x: fromX + face * (0.00006 + tremble * 0.00009 + lace * 0.00002),
        lift: 0.0018 + Math.abs(tremble) * 0.00115 + Math.abs(lace) * 0.00022,
        rot: (-0.14 + tremble * 0.22 + lace) * face,
        anim: "play",
      };
    }
    const s = smoothstep((u - 0.90) / 0.10);
    return { x: fromX + face * 0.00006 * (1 - s), lift: 0.0004 * (1 - s), rot: -0.018 * (1 - s) * face, anim: "idle" };
  }
export function aphidstalkPose(t: number, fromX: number, facing?: 1 | -1): { x: number; lift: number; rot: number; anim: TrickAnim } {
    const u = Math.max(0, Math.min(1, t / DUR.aphidstalk));
    const face = facing == null ? 1 : facing;
    if (u < 0.12) {
      const s = smoothstep(u / 0.12);
      return { x: fromX + face * s * 0.00018, lift: s * 0.0009, rot: s * -0.06 * face, anim: "play" };
    }
    if (u < 0.86) {
      const stalk = (u - 0.12) / 0.74;
      const pause = Math.sin(stalk * Math.PI * 3.1);
      const creep = Math.max(0, Math.sin(stalk * Math.PI * 1.55));
      return {
        x: fromX + face * (0.00018 + stalk * 0.012 + pause * 0.00035),
        lift: 0.0009 + creep * 0.00085 + Math.abs(pause) * 0.0004,
        rot: (-0.06 + pause * 0.08) * face,
        anim: "play",
      };
    }
    const s = smoothstep((u - 0.86) / 0.14);
    return { x: fromX + face * 0.01218 * (1 - s * 0.02), lift: 0.0009 * (1 - s), rot: -0.015 * (1 - s) * face, anim: "idle" };
  }
export function eggraisePose(t: number, fromX: number, facing?: 1 | -1): { x: number; lift: number; rot: number; anim: TrickAnim } {
    const u = Math.max(0, Math.min(1, t / DUR.eggraise));
    const face = facing == null ? 1 : facing;
    if (u < 0.14) {
      const s = smoothstep(u / 0.14);
      return { x: fromX + face * s * 0.00005, lift: s * 0.0022, rot: s * 0.16 * face, anim: "talk" };
    }
    if (u < 0.78) {
      const raise = Math.sin((u - 0.14) / 0.64 * Math.PI);
      return {
        x: fromX + face * (0.00005 + raise * 0.00008),
        lift: 0.0022 + raise * 0.0036,
        rot: (0.16 + raise * 0.28) * face,
        anim: "talk",
      };
    }
    if (u < 0.90) {
      const s = smoothstep((u - 0.78) / 0.12);
      return { x: fromX + face * 0.00013, lift: 0.0058 - s * 0.0024, rot: (0.44 - s * 0.22) * face, anim: "talk" };
    }
    const s = smoothstep((u - 0.90) / 0.10);
    return { x: fromX + face * 0.00013 * (1 - s), lift: 0.0034 * (1 - s), rot: 0.05 * (1 - s) * face, anim: "idle" };
  }
export function nightglintPose(t: number, fromX: number, facing?: 1 | -1): { x: number; lift: number; rot: number; anim: TrickAnim } {
    const u = Math.max(0, Math.min(1, t / DUR.nightglint));
    const face = facing == null ? 1 : facing;
    if (u < 0.12) {
      const s = smoothstep(u / 0.12);
      return { x: fromX + face * s * 0.00022, lift: s * 0.0024, rot: s * -0.12 * face, anim: "sit" };
    }
    if (u < 0.86) {
      const glint = Math.sin((u - 0.12) / 0.74 * Math.PI * 2.6);
      const glow = Math.abs(Math.sin(t * 1.9));
      return {
        x: fromX + face * (0.00022 + glint * 0.00018),
        lift: 0.0024 + glow * 0.00155 + Math.abs(glint) * 0.00085,
        rot: (-0.12 + glint * 0.18) * face,
        anim: "sit",
      };
    }
    const s = smoothstep((u - 0.86) / 0.14);
    return { x: fromX + face * 0.00022 * (1 - s), lift: 0.0024 * (1 - s), rot: -0.03 * (1 - s) * face, anim: "idle" };
  }
export function stepTrick(trick: LacewingTrick, dt: number, flags?: TrickFlags): LacewingTrick {
  if (!trick || trick.phase === "done") return trick;
  if (shouldAbort(flags) && trick.kind !== "wingtremble" && trick.kind !== "aphidstalk" && trick.kind !== "eggraise" && trick.kind !== "nightglint") {
    return { ...trick, phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true };
  }
  const next = { ...trick, t: trick.t + Math.max(0, dt) };
  if (next.kind === "chrysopahush") {
    if (next.t < CHRYSOPAHUSH_HOLD) {
      const pose = chrysopahushPose(next.t);
      next.phase = "hold";
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = "sit";
      return next;
    }
    if (next.t < CHRYSOPAHUSH_HOLD + RELEASE_S) {
      const pose = releasePose(next.t - CHRYSOPAHUSH_HOLD);
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
  if (next.kind === "wingtremble") {
    const pose = wingtremblePose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "aphidstalk") {
    const pose = aphidstalkPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "eggraise") {
    const pose = eggraisePose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else {
    const pose = nightglintPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  }
  if (u >= 1) return { ...next, phase: "done", lift: 0, rot: 0, anim: "idle" };
  return next;
}