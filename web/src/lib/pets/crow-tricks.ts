/** Soot ground tricks while idle — ultra-polish pass. House neighborly Corvidae American crow desk life — hopwalk / monocle / fossick / anting / scrutinize / glean / corvid personality (hopwalk bipedal ground hop without naming hop or caw or cache or walk or strut or fan, monocle monocular head-cock gaze without naming gaze or cock or look or peer or caw, fossick bill-probe forage without naming probe or cache or dig or peck or bill or caw, anting formic acid feather-rub without naming preen or ant or rub or fan or silk or stream, scrutinize hard monocular stare without naming gaze or cock or look or peer, glean blotter forage-amble without naming walk or hop or cache or probe, long corvid Corvus desk perch on the ledge — never named wait or wake or still or hide or cover or caw or cache or hop or walk or strut or fan or preen or probe or dig or peck or bill or roost or berry or juggle or peer or skip or quote or crack or flash or sidle or bobble or mimic or dangle or huddle or toboggan or waddle or porpoise or trumpet or spiggin or zigzag or spinous or fanning or gasterosteid or acetabulum or prostomium or looping or undulatory or hirudinean or lantern or jstroke or semaphore or elytra or photinus or plumose or lunule or silk or stream or actias; window-play CAW owns caw; window-play CACHE owns cache; Budgie owns preen/sidle/bobble/mimic/dangle; Parrot owns quote/strut/fan/crack/flash; Toucan owns roost/berry/juggle/peer/skip; Penguin owns huddle/toboggan/waddle/porpoise/trumpet; guest slug Soot / key crow only for isKey matching — accept "crow" and "soot"; do NOT name a trick "crow" or "soot" or "caw" or "cache" or "hop" or "preen" or "probe" or "fan" or "strut" or "roost") — not Quill macaw life, not Echo budgie life, not Wedge raven life. Amplitudes raised toward Rui richness; denser timing; house cry preferred for talk. Feed-happy thank-yous sit after eat. Card-open freeze and window-play CAW do not swallow a thank-you. Sleep, hide, and leave still win. Same map as web crow-tricks.ts. Window-play CAW unchanged — never names caw. True Corvidae American crow desk life only. Wedge now Rue-dense; Heart owns the next leftover. No cry inventing — thank-yous are silent desk motion only; prefersHouseCry via crow.wav. Amplitudes raised toward Rui richness; denser waits/weights (CORVID_HOLD=11.2 RELEASE_S=1.18). Ethogram softs + freeze — never names crow/soot/caw/cache as bare ethogram-only trick kinds. Window-play CAW unchanged. Brick now Rue-dense; Drake now Rue-dense; Vee now Rue-dense; Drum now Rue-dense; Sip now Rue-dense; Echo now Rue-dense; Peck now Rue-dense; Quill now Rue-dense; Brood now Rue-dense; next leftover Frill / oyster. Catalog 221. Never retouch Rui sprites. */
export const TRICK_KEY = "crow";
export const TRICKS = ["hopwalk", "monocle", "fossick", "anting", "scrutinize", "glean", "corvid"] as const;
export const HAPPY = ["brachyrhynchos", "ossifragus", "corone"] as const;
export type CrowTrickKind = (typeof TRICKS)[number];
export type CrowHappyKind = (typeof HAPPY)[number];
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

export type HappyFlags = {
  asleep?: boolean;
  hidden?: boolean;
  leaving?: boolean;
  cmd?: string;
};

export type CrowTrick = {
  kind: CrowTrickKind;
  phase: TrickPhase;
  t: number;
  x: number;
  lift: number;
  rot: number;
  anim: TrickAnim;
  facing: number;
  fromX: number;
  abort?: boolean;
};

export type CrowHappy = {
  kind: CrowHappyKind;
  happy: true;
  phase: HappyPhase;
  t: number;
  x: number;
  lift: number;
  rot: number;
  anim: TrickAnim;
  facing: number;
  fromX: number;
  abort?: boolean;
};

export const HAPPY_DUR: Record<CrowHappyKind, number> = { brachyrhynchos: 1.48, ossifragus: 1.62, corone: 1.54 };
export const CORVID_HOLD = 11.2;
export const RELEASE_S = 1.18;
export const DUR: Record<CrowTrickKind, number> = {
  corvid: CORVID_HOLD + RELEASE_S,
  hopwalk: 2.18,
  monocle: 2.28,
  fossick: 2.12,
  anting: 2.36,
  scrutinize: 2.42,
  glean: 2.24,
};

export function canStart(state: TrickFlags | null | undefined) {
  if (!state) return false;
  if (state.asleep || state.hidden || state.leaving || state.windowPlay || state.card) return false;
  const cmd = String(state.cmd || "");
  if (cmd === "sleep" || cmd === "leave" || cmd === "hide" || cmd === "rest") return false;
  if (cmd === "seek" || cmd === "eat" || cmd === "play" || cmd === "talk" || cmd === "enter") return false;
  return true;
}

export function shouldAbort(state: TrickFlags | null | undefined) {
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

export function nextTrickWait(justFinished: boolean, rand?: number, kind?: string) {
  const roll = rand == null ? Math.random() : rand;
  if (kind === "corvid") return 40 + roll * 26;
  if (kind === "hopwalk" || kind === "monocle" || kind === "fossick" || kind === "anting" || kind === "scrutinize" || kind === "glean") return 12.8 + roll * 9.4;
  return justFinished ? 8.5 + roll * 8.4 : 4.4 + roll * 7.4;
}

export function pickTrick(rand?: number, musicOn?: boolean, lastKind?: string): CrowTrickKind {
  if (musicOn) return "corvid";
  const roll = rand == null ? Math.random() : rand;
  const pool = TRICKS.filter((k) => k !== lastKind);
  const list = pool.length ? pool : [...TRICKS];
  const weights = list.map((k) => (k === "corvid" ? 0.72 : k === "scrutinize" || k === "anting" ? 1.28 : k === "hopwalk" || k === "monocle" || k === "fossick" ? 1.18 : 1.08));
  let total = 0;
  for (let i = 0; i < weights.length; i++) total += weights[i];
  let r = roll * total;
  for (let i = 0; i < list.length; i++) {
    r -= weights[i];
    if (r <= 0) return list[i];
  }
  return list[list.length - 1] || "hopwalk";
}

export function happyCanStart(state: HappyFlags | null | undefined) {
  if (!state) return false;
  if (state.asleep || state.hidden || state.leaving) return false;
  const cmd = String(state.cmd || "");
  if (cmd === "sleep" || cmd === "leave" || cmd === "hide" || cmd === "rest") return false;
  if (cmd === "seek" || cmd === "play" || cmd === "talk" || cmd === "enter") return false;
  return true;
}

export function happyShouldAbort(state: HappyFlags | null | undefined) {
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
  return key === TRICK_KEY || key === "soot";
}

export function startThankYou(
  key: string | undefined | null,
  lastKind: string | undefined,
  x: number,
  facing: number,
  flags?: HappyFlags,
) {
  if (!wantsThankYou(key)) return null;
  if (!happyCanStart(flags || { cmd: "idle" })) return null;
  const pick = pickHappy(lastKind);
  return { happy: beginHappy(pick, x, facing), kind: pick };
}

export function pickHappy(lastKind?: string, rand?: number): CrowHappyKind {
  const pool = HAPPY.filter((k) => k !== lastKind);
  const list = pool.length ? pool : [...HAPPY];
  const roll = rand == null ? Math.random() : rand;
  return list[Math.floor(roll * list.length)] || list[0];
}

export function beginHappy(kind: CrowHappyKind | string, x: number, facing?: number): CrowHappy {
  const name = (HAPPY as readonly string[]).indexOf(kind) >= 0 ? (kind as CrowHappyKind) : "brachyrhynchos";
  return {
    kind: name,
    happy: true,
    phase: "go",
    t: 0,
    x,
    lift: 0,
    rot: 0,
    anim: name === "ossifragus" ? "play" : "sit",
    facing: facing == null ? 1 : facing,
    fromX: x,
  };
}

export function brachyrhynchosPose(t: number) {
  const u = Math.max(0, Math.min(1, t / HAPPY_DUR.brachyrhynchos));
  if (u < 0.14) {
    const s = u / 0.14;
      return { lift: s * 7.2, rot: s * 12, dx: 0, anim: "sit" as TrickAnim };
    }
    if (u < 0.82) {
      const flash = Math.sin(t * 7.2) + 0.28 * Math.sin(t * 14.4);
      return {
        lift: 7.2 + Math.abs(flash) * 6,
        rot: 12 + flash * 10.8,
        dx: flash * 2.64,
        anim: "sit" as TrickAnim,
      };
    }
    const s = (u - 0.82) / 0.18;
    return { lift: 4.8 * (1 - s), rot: 4.8 * (1 - s), dx: 0, anim: "idle" as TrickAnim };
}

export function ossifragusPose(t: number) {
  const u = Math.max(0, Math.min(1, t / HAPPY_DUR.ossifragus));
  if (u < 0.12) {
    const s = u / 0.12;
      return { lift: s * 16.8, rot: s * -14.4, dx: s * 3.6, anim: "play" as TrickAnim };
    }
    if (u < 0.86) {
      const wriggle = Math.sin(t * 5.4) + 0.24 * Math.sin(t * 10.2);
      return {
        lift: 14.4 + Math.abs(wriggle) * 12,
        rot: -12 + wriggle * 16.8,
        dx: wriggle * 4.8,
        anim: "play" as TrickAnim,
      };
    }
    const s = (u - 0.86) / 0.14;
    return { lift: 6 * (1 - s), rot: -4.8 * (1 - s), dx: 0, anim: "sit" as TrickAnim };
}

export function coronePose(t: number) {
  return {
    lift: 3.6 + Math.abs(Math.sin(t * 4.2)) * 8.4,
    rot: Math.sin(t * 3.6) * 9.6,
    dx: Math.sin(t * 2.8) * 3.6,
    anim: "sit" as TrickAnim,
  };
}

export function stepHappy(happy: CrowHappy, dt: number, flags?: HappyFlags): CrowHappy {
  if (!happy || happy.phase === "done") return happy;
  if (happyShouldAbort(flags)) {
    return { ...happy, phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true };
  }
  const next = { ...happy, t: happy.t + Math.max(0, dt) };
  const hold = HAPPY_DUR[next.kind];
  if (next.kind === "brachyrhynchos") {
    const pose = brachyrhynchosPose(next.t);
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "ossifragus") {
    const pose = ossifragusPose(next.t);
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else {
    const pose = coronePose(next.t);
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

export function beginTrick(kind: CrowTrickKind | string, x: number, facing?: number): CrowTrick {
  const name = (TRICKS as readonly string[]).indexOf(kind) >= 0 ? (kind as CrowTrickKind) : "hopwalk";
  const anim: TrickAnim =
    name === "corvid"
      ? "sit"
      : name === "hopwalk" || name === "glean"
        ? "walk"
        : name === "monocle" || name === "fossick" || name === "scrutinize"
          ? "sit"
          : name === "anting"
            ? "play"
            : "sit";
  return {
    kind: name,
    phase: name === "corvid" ? "hold" : "go",
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

export function corvidPose(t: number) {
  const breath = Math.sin(t * 0.55) + 0.18 * Math.sin(t * 1.4);
  const soft = Math.abs(Math.sin(t * 0.9));
  return {
    lift: 2.4 + soft * 4.8 + Math.abs(breath) * 1.8,
    rot: -2.4 + breath * 4.8,
  };
}

export function releasePose(t: number) {
  const u = Math.max(0, Math.min(1, t / RELEASE_S));
  return { lift: 3.6 * (1 - Math.sin(u * Math.PI * 0.5)), rot: -3.6 * (1 - u) };
}

export function hopwalkPose(t: number, fromX: number, facing?: number) {
  const u = Math.max(0, Math.min(1, t / DUR.hopwalk));
  const face = facing == null ? 1 : facing;
  if (u < 0.1) {
    const s = smoothstep(u / 0.1);
      return { x: fromX, lift: s * 12, rot: s * -7.2 * face, anim: "walk" as TrickAnim };
    }
    if (u < 0.88) {
      const s = (u - 0.1) / 0.78;
      const bounce = Math.abs(Math.sin(s * Math.PI * 4.2));
      const drift = Math.sin(s * Math.PI * 2.1);
      return {
        x: fromX + face * (28 * s + drift * 7.2),
        lift: 7.2 + bounce * 21.6,
        rot: (-7.2 + drift * 12) * face,
        anim: "walk" as TrickAnim,
      };
    }
    const s = smoothstep((u - 0.88) / 0.12);
    return {
      x: fromX + face * 28 * (1 - s),
      lift: 7.2 * (1 - s),
      rot: -3.6 * (1 - s) * face,
      anim: "idle" as TrickAnim,
    };
}

export function monoclePose(t: number, fromX: number, facing?: number) {
  const u = Math.max(0, Math.min(1, t / DUR.monocle));
  const face = facing == null ? 1 : facing;
  if (u < 0.12) {
    const s = smoothstep(u / 0.12);
      return { x: fromX, lift: s * 6, rot: s * 19.2 * face, anim: "sit" as TrickAnim };
    }
    if (u < 0.8) {
      const pulse = Math.sin(t * 3.6) + 0.22 * Math.sin(t * 8.1);
      return {
        x: fromX + face * pulse * 2.88,
        lift: 6 + Math.abs(pulse) * 4.2,
        rot: (19.2 + pulse * 6) * face,
        anim: "sit" as TrickAnim,
      };
    }
    const s = smoothstep((u - 0.8) / 0.2);
    return {
      x: fromX,
      lift: 3.6 * (1 - s),
      rot: 6 * (1 - s) * face,
      anim: "idle" as TrickAnim,
    };
}

export function fossickPose(t: number, fromX: number, facing?: number) {
  const u = Math.max(0, Math.min(1, t / DUR.fossick));
  const face = facing == null ? 1 : facing;
  if (u < 0.1) {
    const s = smoothstep(u / 0.1);
      return { x: fromX, lift: s * 3.6, rot: s * -16.8 * face, anim: "sit" as TrickAnim };
    }
    if (u < 0.86) {
      const peck = Math.sin(t * 8.4) + 0.26 * Math.sin(t * 16.8);
      const bite = peck > 0.35 ? 1 : peck < -0.35 ? -0.6 : peck * 0.45;
      return {
        x: fromX + face * bite * 3.84,
        lift: 2.4 + Math.abs(peck) * 8.4,
        rot: (-16.8 + bite * 10.8) * face,
        anim: "sit" as TrickAnim,
      };
    }
    const s = smoothstep((u - 0.86) / 0.14);
    return { x: fromX, lift: 2.4 * (1 - s), rot: -4.8 * (1 - s) * face, anim: "idle" as TrickAnim };
}

export function antingPose(t: number, fromX: number, facing?: number) {
  const u = Math.max(0, Math.min(1, t / DUR.anting));
  const face = facing == null ? 1 : facing;
  if (u < 0.1) {
    const s = smoothstep(u / 0.1);
      return { x: fromX, lift: s * 12, rot: s * -14.4 * face, anim: "play" as TrickAnim };
    }
    if (u < 0.88) {
      const rub = Math.sin(t * 6.2) + 0.24 * Math.sin(t * 12.4);
      return {
        x: fromX + face * rub * 6,
        lift: 9.6 + Math.abs(rub) * 9.6,
        rot: (-14.4 + rub * 16.8) * face,
        anim: "play" as TrickAnim,
      };
    }
    const s = smoothstep((u - 0.88) / 0.12);
    return { x: fromX, lift: 4.8 * (1 - s), rot: -4.8 * (1 - s) * face, anim: "idle" as TrickAnim };
}

export function scrutinizePose(t: number, fromX: number, facing?: number) {
  const u = Math.max(0, Math.min(1, t / DUR.scrutinize));
  const face = facing == null ? 1 : facing;
  if (u < 0.12) {
    const s = smoothstep(u / 0.12);
      return { x: fromX, lift: s * 4.8, rot: s * 21.6 * face, anim: "sit" as TrickAnim };
    }
    if (u < 0.78) {
      const tick = Math.sin(t * 2.4) + 0.35 * Math.sin(t * 9.6);
      const flick = Math.sin(t * 14) * 0.4;
      return {
        x: fromX + face * (tick * 2.16 + flick * 0.96),
        lift: 4.8 + Math.abs(tick) * 3,
        rot: (21.6 + tick * 4.8 + flick * 3.6) * face,
        anim: "sit" as TrickAnim,
      };
    }
    if (u < 0.9) {
      const s = (u - 0.78) / 0.12;
      return {
        x: fromX,
        lift: 4.8,
        rot: (21.6 - s * 43.2) * face,
        anim: "sit" as TrickAnim,
      };
    }
    const s = smoothstep((u - 0.9) / 0.1);
    return { x: fromX, lift: 3.6 * (1 - s), rot: -4.8 * (1 - s) * face, anim: "idle" as TrickAnim };
}

export function gleanPose(t: number, fromX: number, facing?: number) {
  const u = Math.max(0, Math.min(1, t / DUR.glean));
  const face = facing == null ? 1 : facing;
  if (u < 0.1) {
    const s = smoothstep(u / 0.1);
      return { x: fromX, lift: s * 9.6, rot: s * -6 * face, anim: "walk" as TrickAnim };
    }
    if (u < 0.55) {
      const s = (u - 0.1) / 0.45;
      const bounce = Math.abs(Math.sin(s * Math.PI * 3));
      return {
        x: fromX + face * 22 * s,
        lift: 6 + bounce * 16.8,
        rot: (-6 + Math.sin(s * Math.PI * 3) * 9.6) * face,
        anim: "walk" as TrickAnim,
      };
    }
    if (u < 0.88) {
      const s = (u - 0.55) / 0.33;
      const peck = Math.sin(s * Math.PI * 5);
      return {
        x: fromX + face * 22,
        lift: 3.6 + Math.abs(peck) * 7.2,
        rot: (-12 + peck * 9.6) * face,
        anim: "sit" as TrickAnim,
      };
    }
    const s = smoothstep((u - 0.88) / 0.12);
    return {
      x: fromX + face * 22 * (1 - s * 0.35),
      lift: 3.6 * (1 - s),
      rot: -3.6 * (1 - s) * face,
      anim: "idle" as TrickAnim,
    };
}

export function stepTrick(trick: CrowTrick, dt: number, flags?: TrickFlags): CrowTrick {
  if (!trick || trick.phase === "done") return trick;
  if (
    shouldAbort(flags) &&
    trick.kind !== "hopwalk" &&
    trick.kind !== "monocle" &&
    trick.kind !== "fossick" &&
    trick.kind !== "anting" &&
    trick.kind !== "scrutinize" &&
    trick.kind !== "glean"
  ) {
    return { ...trick, phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true };
  }
  const next = { ...trick, t: trick.t + Math.max(0, dt) };
  if (next.kind === "corvid") {
    if (next.t < CORVID_HOLD) {
      const pose = corvidPose(next.t);
      next.phase = "hold";
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = "sit";
      return next;
    }
    if (next.t < CORVID_HOLD + RELEASE_S) {
      const pose = releasePose(next.t - CORVID_HOLD);
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
  const from = trick.fromX != null ? trick.fromX : trick.x;
  if (next.kind === "hopwalk") {
    const pose = hopwalkPose(next.t, from, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "monocle") {
    const pose = monoclePose(next.t, from, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "fossick") {
    const pose = fossickPose(next.t, from, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "anting") {
    const pose = antingPose(next.t, from, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "scrutinize") {
    const pose = scrutinizePose(next.t, from, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else {
    const pose = gleanPose(next.t, from, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  }
  if (u >= 1) return { ...next, phase: "done", lift: 0, rot: 0, anim: "idle" };
  return next;
}
