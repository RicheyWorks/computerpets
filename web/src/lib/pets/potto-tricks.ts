/** Still ground tricks while idle. House neighborly potto (Perodicticus potto / Lorisidae Perodicticinae) desk life -- scapularshield / crypticcreep / gumscrape / gripclamp / perodicticushush personality; NOT Gaze/Boom/Hang/Sun/slow loris/Rui; guest slug Still / key potto -- accept potto and still; Thank-yous densstill / inkstill / densperodicticus. Sleep, hide, leave, rest, card, ribbon still win. Same map as desktop potto-tricks.js. Next: Gum / koala. Catalog 220. */
export const TRICK_KEY = "potto";
export const TRICKS = ["scapularshield", "crypticcreep", "gumscrape", "gripclamp", "perodicticushush"] as const;
export const HAPPY = ["densstill", "inkstill", "densperodicticus"] as const;
export type PottoTrickKind = (typeof TRICKS)[number];
export type PottoHappyKind = (typeof HAPPY)[number];
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

export type PottoTrick = {
  kind: PottoTrickKind;
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

export type PottoHappy = {
  kind: PottoHappyKind;
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

export const HAPPY_DUR = { densstill: 2.67, inkstill: 2.84, densperodicticus: 2.52 } as const;
export const PERODICTICUSHUSH_HOLD = 31.88;
export const RELEASE_S = 2.41;
export const DUR = { perodicticushush: PERODICTICUSHUSH_HOLD + RELEASE_S, scapularshield: 5.48, crypticcreep: 5.64, gumscrape: 5.18, gripclamp: 5.28 } as const;

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
export function nextTrickWait(justFinished: boolean, rand?: number, kind?: PottoTrickKind | string) {
  const roll = rand == null ? Math.random() : rand;
  if (kind === "perodicticushush") return 206 + roll * 23;
  if (kind === "scapularshield") return 26.1 + roll * 3.8;
  if (kind === "crypticcreep") return 24.8 + roll * 3.6;
  if (kind === "gumscrape") return 23.2 + roll * 3.5;
  if (kind === "gripclamp") return 25.4 + roll * 3.7;
  return justFinished ? 19.1 + roll * 3.0 : 14.2 + roll * 2.6;
}
export function pickTrick(rand?: number, musicOn?: boolean, lastKind?: PottoTrickKind | string) {
  if (musicOn) return "perodicticushush";
  const roll = rand == null ? Math.random() : rand;
  if (lastKind === "perodicticushush") {
    if (roll < 0.26) return "scapularshield";
    if (roll < 0.5) return "crypticcreep";
    if (roll < 0.74) return "gumscrape";
    return "gripclamp";
  }
  if (lastKind === "scapularshield") {
    if (roll < 0.26) return "perodicticushush";
    if (roll < 0.5) return "crypticcreep";
    if (roll < 0.74) return "gumscrape";
    return "gripclamp";
  }
  if (lastKind === "crypticcreep") {
    if (roll < 0.22) return "perodicticushush";
    if (roll < 0.44) return "scapularshield";
    if (roll < 0.68) return "gumscrape";
    return "gripclamp";
  }
  if (roll < 0.2) return "perodicticushush";
  if (roll < 0.4) return "scapularshield";
  if (roll < 0.6) return "crypticcreep";
  if (roll < 0.8) return "gumscrape";
  return "gripclamp";
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
  return key === TRICK_KEY || key === "still";
}
export function startThankYou(
  key: string | undefined | null,
  lastKind: PottoHappyKind | string | undefined,
  x: number,
  facing?: 1 | -1,
  flags?: TrickFlags
) {
  if (!wantsThankYou(key)) return null;
  if (!happyCanStart(flags || { cmd: "idle" })) return null;
  const pick = pickHappy(lastKind);
  return { happy: beginHappy(pick, x, facing), kind: pick };
}
export function pickHappy(lastKind?: PottoHappyKind | string, rand?: number) {
  const pool = HAPPY.filter((k) => k !== lastKind);
  const list = pool.length ? pool : [...HAPPY];
  const roll = rand == null ? Math.random() : rand;
  return list[Math.floor(roll * list.length)] || list[0];
}
export function beginHappy(kind: PottoHappyKind | string, x: number, facing?: 1 | -1): PottoHappy {
  const name = (HAPPY as readonly string[]).indexOf(kind) >= 0 ? (kind as PottoHappyKind) : "densstill";
  return {
    kind: name,
    happy: true,
    phase: "go",
    t: 0,
    x,
    lift: 0,
    rot: 0,
    anim: name === "densstill" ? "sit" : name === "inkstill" ? "play" : "play",
    facing: facing == null ? 1 : facing,
    fromX: x,
  };
}

export function densstillPose(t: number) {
  const u = Math.max(0, Math.min(1, t / HAPPY_DUR.densstill));
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
export function inkstillPose(t: number) {
  const u = Math.max(0, Math.min(1, t / HAPPY_DUR.inkstill));
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
export function densperodicticusPose(t: number) {
  const u = Math.max(0, Math.min(1, t / HAPPY_DUR.densperodicticus));
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
export function stepHappy(happy: PottoHappy, dt: number, flags?: TrickFlags): PottoHappy {
  if (!happy || happy.phase === "done") return happy;
  if (happyShouldAbort(flags)) {
    return { ...happy, phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true };
  }
  const next = { ...happy, t: happy.t + Math.max(0, dt) };
  const hold = HAPPY_DUR[next.kind];
  if (next.kind === "densstill") {
    const pose = densstillPose(next.t);
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "inkstill") {
    const pose = inkstillPose(next.t);
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else {
    const pose = densperodicticusPose(next.t);
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
export function beginTrick(kind: PottoTrickKind | string, x: number, facing?: 1 | -1): PottoTrick {
  const k = (TRICKS as readonly string[]).includes(kind) ? (kind as PottoTrickKind) : "perodicticushush";
  const anim: TrickAnim =
    k === "perodicticushush"
      ? "sit"
      : k === "scapularshield"
        ? "sit"
        : k === "crypticcreep"
            ? "walk"
          : k === "gripclamp"
              ? "sit"
            : k === "gumscrape"
                ? "sit"
              : "sit";
  return {
    kind: k,
    phase: k === "perodicticushush" ? "hold" : "go",
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

export function perodicticushushPose(t: number) {
  const breath = Math.sin(t * 0.00048) + 0.00016 * Math.sin(t * 0.00132);
  const hush = Math.abs(Math.sin(t * 0.00022));
  return { lift: -0.00028 + hush * 0.00004, rot: 0.0014 + breath * 0.0011 };
}
export function releasePose(t: number) {
  const u = Math.max(0, Math.min(1, t / RELEASE_S));
  return { lift: -0.00022 * (1 - Math.sin(u * Math.PI * 0.5)), rot: 0.0028 * (1 - u) };
}

export function scapularshieldPose(t: number, fromX: number, facing?: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.scapularshield));
  const face = facing == null ? 1 : facing;
  if (u < 0.2) {
    const s = smoothstep(u / 0.2);
    return { x: fromX + face * s * -0.0001, lift: s * -0.0018, rot: s * 0.32 * face, anim: "sit" as TrickAnim };
  }
  if (u < 0.86) {
    const micro = Math.sin(((u - 0.2) / 0.66) * Math.PI * 0.95);
    return {
      x: fromX + face * (-0.0001 + micro * 0.00003),
      lift: -0.0018 + Math.abs(micro) * 0.00012,
      rot: (0.32 + micro * 0.012) * face,
      anim: "sit" as TrickAnim,
    };
  }
  const s = smoothstep((u - 0.86) / 0.14);
  return { x: fromX + face * -0.0001 * (1 - s), lift: -0.0018 * (1 - s), rot: 0.32 * (1 - s) * face, anim: "idle" as TrickAnim };
}
export function crypticcreepPose(t: number, fromX: number, facing?: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.crypticcreep));
  const face = facing == null ? 1 : facing;
  if (u < 0.12) {
    const s = smoothstep(u / 0.12);
    return { x: fromX + face * s * 0.0006, lift: s * 0.0008, rot: s * -0.06 * face, anim: "walk" as TrickAnim };
  }
  if (u < 0.88) {
    const creep = (u - 0.12) / 0.76;
    const bob = Math.sin(creep * Math.PI * 3.6);
    return {
      x: fromX + face * (0.0006 + creep * 0.0072),
      lift: 0.0008 + Math.abs(bob) * 0.0014,
      rot: (-0.06 + bob * 0.05) * face,
      anim: "walk" as TrickAnim,
    };
  }
  const s = smoothstep((u - 0.88) / 0.12);
  return { x: fromX + face * (0.0078 - 0.0012 * s), lift: 0.0008 * (1 - s), rot: -0.06 * (1 - s) * face, anim: "idle" as TrickAnim };
}
export function gumscrapePose(t: number, fromX: number, facing?: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.gumscrape));
  const face = facing == null ? 1 : facing;
  if (u < 0.18) {
    const s = smoothstep(u / 0.18);
    return { x: fromX + face * s * 0.0003, lift: s * -0.0036, rot: s * 0.28 * face, anim: "sit" as TrickAnim };
  }
  if (u < 0.8) {
    const scrape = Math.sin(((u - 0.18) / 0.62) * Math.PI * 4.2);
    return {
      x: fromX + face * (0.0003 + Math.abs(scrape) * 0.00025),
      lift: -0.0036 + Math.abs(scrape) * 0.0012,
      rot: (0.28 + scrape * 0.11) * face,
      anim: "sit" as TrickAnim,
    };
  }
  const s = smoothstep((u - 0.8) / 0.2);
  return { x: fromX + face * 0.00035 * (1 - s), lift: -0.0036 * (1 - s), rot: 0.28 * (1 - s) * face, anim: "idle" as TrickAnim };
}
export function gripclampPose(t: number, fromX: number, facing?: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.gripclamp));
  const face = facing == null ? 1 : facing;
  if (u < 0.22) {
    const s = smoothstep(u / 0.22);
    return { x: fromX + face * s * -0.0003, lift: s * 0.0088, rot: s * -0.12 * face, anim: "sit" as TrickAnim };
  }
  if (u < 0.78) {
    const clamp = Math.sin(((u - 0.22) / 0.56) * Math.PI * 1.6);
    return {
      x: fromX + face * (-0.0003 + Math.abs(clamp) * 0.0002),
      lift: 0.0088 + Math.abs(clamp) * 0.0011,
      rot: (-0.12 + clamp * 0.06) * face,
      anim: "sit" as TrickAnim,
    };
  }
  const s = smoothstep((u - 0.78) / 0.22);
  return { x: fromX + face * -0.0003 * (1 - s), lift: 0.0088 * (1 - s), rot: -0.12 * (1 - s) * face, anim: "idle" as TrickAnim };
}
export function stepTrick(trick: PottoTrick, dt: number, flags?: TrickFlags): PottoTrick {
  if (!trick || trick.phase === "done") return trick;
  if (shouldAbort(flags) && trick.kind !== "scapularshield" && trick.kind !== "crypticcreep" && trick.kind !== "gumscrape" && trick.kind !== "gripclamp") {
    return { ...trick, phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true };
  }
  const next = { ...trick, t: trick.t + Math.max(0, dt) };
  if (next.kind === "perodicticushush") {
    if (next.t < PERODICTICUSHUSH_HOLD) {
      const pose = perodicticushushPose(next.t);
      next.phase = "hold";
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = "sit";
      return next;
    }
    if (next.t < PERODICTICUSHUSH_HOLD + RELEASE_S) {
      const pose = releasePose(next.t - PERODICTICUSHUSH_HOLD);
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
  if (next.kind === "scapularshield") {
    const pose = scapularshieldPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "crypticcreep") {
    const pose = crypticcreepPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "gripclamp") {
    const pose = gripclampPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else {
    const pose = gumscrapePose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  }
  if (u >= 1) return { ...next, phase: "done", lift: 0, rot: 0, anim: "idle" };
  return next;
}
