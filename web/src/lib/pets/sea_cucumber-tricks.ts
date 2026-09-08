/** Tube ground tricks while idle. House neighborly Pineapple sea cucumber (Thelenota ananas / Holothuroidea sea cucumber) desk life -- tube-foot crawl / deposit-feed sift / cucumber body swell-shrink / soft retract defense cue / long holothuria hush; NOT Scrub cleaner shrimp (esp. not antennawaveadvertise/dancescrubclientcue/rockcreviceretreat/bipedalwalktick/longlysmatahush); NOT Scrape parrotfish; NOT Paint clownfish; NOT Cast earthworm; NOT sea star (podia/righting/crawl/evert/penta); NOT Rui; guest slug Tube / key sea_cucumber -- accept sea_cucumber and tube; Thank-yous denstube / inktube / densholothuria. Sleep, hide, leave, rest, card, ribbon still win. Same map as desktop sea_cucumber-tricks.js. Next: Veil / lionfish. Catalog 220. */
export const TRICK_KEY = "sea_cucumber";
export const TRICKS = ["tubefootcrawl", "depositfeedsift", "cucumberswellshrink", "softretractcue", "longholothuriahush"] as const;
export const HAPPY = ["denstube", "inktube", "densholothuria"] as const;
export type SeaCucumberTrickKind = (typeof TRICKS)[number];
export type SeaCucumberHappyKind = (typeof HAPPY)[number];
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

export type SeaCucumberTrick = {
  kind: SeaCucumberTrickKind;
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

export type SeaCucumberHappy = {
  kind: SeaCucumberHappyKind;
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

export const HAPPY_DUR = { denstube: 2.68, inktube: 2.76, densholothuria: 2.61 } as const;
export const LONGHOLOTHURIAHUSH_HOLD = 34.12;
export const RELEASE_S = 2.52;
export const DUR = { longholothuriahush: LONGHOLOTHURIAHUSH_HOLD + RELEASE_S, tubefootcrawl: 5.52, depositfeedsift: 5.44, cucumberswellshrink: 5.36, softretractcue: 5.48 } as const;

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
export function nextTrickWait(justFinished: boolean, rand?: number, kind?: SeaCucumberTrickKind | string) {
  const roll = rand == null ? Math.random() : rand;
  if (kind === "longholothuriahush") return 212 + roll * 28;
  if (kind === "depositfeedsift") return 26.2 + roll * 3.2;
  if (kind === "softretractcue") return 25.1 + roll * 3.3;
  if (kind === "tubefootcrawl") return 24.6 + roll * 3.1;
  if (kind === "cucumberswellshrink") return 24.3 + roll * 3.5;
  return justFinished ? 19.1 + roll * 3.0 : 14.2 + roll * 2.6;
}
export function pickTrick(rand?: number, musicOn?: boolean, lastKind?: SeaCucumberTrickKind | string) {
  if (musicOn) return "longholothuriahush";
  const roll = rand == null ? Math.random() : rand;
  if (lastKind === "longholothuriahush") {
    if (roll < 0.26) return "depositfeedsift";
    if (roll < 0.5) return "softretractcue";
    if (roll < 0.74) return "tubefootcrawl";
    return "cucumberswellshrink";
  }
  if (lastKind === "depositfeedsift") {
    if (roll < 0.26) return "longholothuriahush";
    if (roll < 0.5) return "softretractcue";
    if (roll < 0.74) return "tubefootcrawl";
    return "cucumberswellshrink";
  }
  if (lastKind === "softretractcue") {
    if (roll < 0.22) return "longholothuriahush";
    if (roll < 0.44) return "depositfeedsift";
    if (roll < 0.68) return "tubefootcrawl";
    return "cucumberswellshrink";
  }
  if (roll < 0.2) return "longholothuriahush";
  if (roll < 0.4) return "depositfeedsift";
  if (roll < 0.6) return "softretractcue";
  if (roll < 0.8) return "tubefootcrawl";
  return "cucumberswellshrink";
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
  return key === TRICK_KEY || key === "tube";
}
export function startThankYou(
  key: string | undefined | null,
  lastKind: SeaCucumberHappyKind | string | undefined,
  x: number,
  facing?: 1 | -1,
  flags?: TrickFlags
) {
  if (!wantsThankYou(key)) return null;
  if (!happyCanStart(flags || { cmd: "idle" })) return null;
  const pick = pickHappy(lastKind);
  return { happy: beginHappy(pick, x, facing), kind: pick };
}
export function pickHappy(lastKind?: SeaCucumberHappyKind | string, rand?: number) {
  const pool = HAPPY.filter((k) => k !== lastKind);
  const list = pool.length ? pool : [...HAPPY];
  const roll = rand == null ? Math.random() : rand;
  return list[Math.floor(roll * list.length)] || list[0];
}
export function beginHappy(kind: SeaCucumberHappyKind | string, x: number, facing?: 1 | -1): SeaCucumberHappy {
  const name = (HAPPY as readonly string[]).indexOf(kind) >= 0 ? (kind as SeaCucumberHappyKind) : "denstube";
  return {
    kind: name,
    happy: true,
    phase: "go",
    t: 0,
    x,
    lift: 0,
    rot: 0,
    anim: name === "denstube" ? "sit" : name === "inktube" ? "play" : "play",
    facing: facing == null ? 1 : facing,
    fromX: x,
  };
}

export function denstubePose(t: number) {
  const u = Math.max(0, Math.min(1, t / HAPPY_DUR.denstube));
  if (u < 0.15) {
    const s = u / 0.15;
    return { lift: s * 0.0034, rot: s * -0.22, anim: "sit" as TrickAnim };
  }
  if (u < 0.84) {
    const sway = Math.sin(((u - 0.15) / 0.69) * Math.PI * 2.35);
    return { lift: 0.0034 + Math.abs(sway) * 0.0009, rot: -0.22 + sway * 0.16, anim: "sit" as TrickAnim };
  }
  const s = (u - 0.84) / 0.16;
  return { lift: 0.0034 * (1 - s), rot: -0.22 * (1 - s), anim: "idle" as TrickAnim };
}
export function inktubePose(t: number) {
  const u = Math.max(0, Math.min(1, t / HAPPY_DUR.inktube));
  if (u < 0.12) {
    const s = u / 0.12;
    return { lift: s * 0.0035, rot: s * 0.26, anim: "play" as TrickAnim };
  }
  if (u < 0.82) {
    const arc = Math.sin(((u - 0.12) / 0.7) * Math.PI * 2.95);
    return { lift: 0.0035 + Math.abs(arc) * 0.0020, rot: 0.26 + arc * 0.28, anim: "play" as TrickAnim };
  }
  const s = (u - 0.82) / 0.18;
  return { lift: 0.0035 * (1 - s), rot: 0.26 * (1 - s), anim: "idle" as TrickAnim };
}
export function densholothuriaPose(t: number) {
  const u = Math.max(0, Math.min(1, t / HAPPY_DUR.densholothuria));
  if (u < 0.14) {
    const s = u / 0.14;
    return { lift: s * -0.0016, rot: s * 0.17, anim: "play" as TrickAnim };
  }
  if (u < 0.83) {
    const hush = Math.sin(((u - 0.14) / 0.69) * Math.PI * 2.18);
    return { lift: -0.0016 + Math.abs(hush) * 0.0010, rot: 0.17 + hush * 0.16, anim: "play" as TrickAnim };
  }
  const s = (u - 0.83) / 0.17;
  return { lift: -0.0016 * (1 - s), rot: 0.17 * (1 - s), anim: "idle" as TrickAnim };
}
export function stepHappy(happy: SeaCucumberHappy, dt: number, flags?: TrickFlags): SeaCucumberHappy {
  if (!happy || happy.phase === "done") return happy;
  if (happyShouldAbort(flags)) {
    return { ...happy, phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true };
  }
  const next = { ...happy, t: happy.t + Math.max(0, dt) };
  const hold = HAPPY_DUR[next.kind];
  if (next.kind === "denstube") {
    const pose = denstubePose(next.t);
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "inktube") {
    const pose = inktubePose(next.t);
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else {
    const pose = densholothuriaPose(next.t);
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
export function beginTrick(kind: SeaCucumberTrickKind | string, x: number, facing?: 1 | -1): SeaCucumberTrick {
  const k = (TRICKS as readonly string[]).includes(kind) ? (kind as SeaCucumberTrickKind) : "longholothuriahush";
  const anim: TrickAnim =
    k === "longholothuriahush"
      ? "sit"
      : k === "depositfeedsift"
        ? "play"
        : k === "softretractcue"
            ? "sit"
          : k === "cucumberswellshrink"
              ? "sit"
            : k === "tubefootcrawl"
                ? "sit"
              : "sit";
  return {
    kind: k,
    phase: k === "longholothuriahush" ? "hold" : "go",
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

export function longholothuriahushPose(t: number) {
  const breath = Math.sin(t * 0.00037) + 0.00011 * Math.sin(t * 0.00105);
  const hush = Math.abs(Math.sin(t * 0.00021));
  return { lift: -0.00018 + hush * 0.00006, rot: 0.0014 + breath * 0.0011 };
}

export function releasePose(t: number) {
  const u = Math.max(0, Math.min(1, t / RELEASE_S));
  return { lift: -0.00018 * (1 - Math.sin(u * Math.PI * 0.5)), rot: 0.0031 * (1 - u) };
}

export function depositfeedsiftPose(t: number, fromX: number, facing?: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.depositfeedsift));
  const face = facing == null ? 1 : facing;
  if (u < 0.22) {
    const s = smoothstep(u / 0.22);
    return { x: fromX + face * s * -0.00004, lift: s * -0.0051, rot: s * 0.07 * face, anim: "play" as TrickAnim };
  }
  if (u < 0.72) {
    const tuck = Math.sin(((u - 0.22) / 0.5) * Math.PI * 2.1);
    return {
      x: fromX + face * (-0.00004 + tuck * 0.00005),
      lift: -0.0051 + Math.abs(tuck) * 0.0008,
      rot: (0.07 + tuck * 0.05) * face,
      anim: "play" as TrickAnim,
    };
  }
  const s = smoothstep((u - 0.72) / 0.28);
  return { x: fromX + face * -0.00004 * (1 - s), lift: -0.0051 * (1 - s), rot: 0.07 * (1 - s) * face, anim: "idle" as TrickAnim };
}
export function softretractcuePose(t: number, fromX: number, facing?: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.softretractcue));
  const face = facing == null ? 1 : facing;
  if (u < 0.3) {
    const s = smoothstep(u / 0.3);
    return { x: fromX + face * s * 0.00006, lift: s * -0.0081, rot: s * 0.03 * face, anim: "sit" as TrickAnim };
  }
  if (u < 0.68) {
    const hold = Math.sin(((u - 0.3) / 0.38) * Math.PI);
    return {
      x: fromX + face * 0.00006,
      lift: -0.0081 + hold * 0.0005,
      rot: (0.03 + hold * 0.015) * face,
      anim: "sit" as TrickAnim,
    };
  }
  if (u < 0.9) {
    const c = smoothstep((u - 0.68) / 0.22);
    return {
      x: fromX + face * 0.00006 * (1 - c * 0.35),
      lift: -0.0081 * (1 - c) + 0.0018 * c,
      rot: (0.03 * (1 - c) + 0.06 * c) * face,
      anim: "sit" as TrickAnim,
    };
  }
  const s = smoothstep((u - 0.9) / 0.1);
  return { x: fromX + face * 0.00004 * (1 - s), lift: 0.0018 * (1 - s), rot: 0.06 * (1 - s) * face, anim: "idle" as TrickAnim };
}
export function tubefootcrawlPose(t: number, fromX: number, facing?: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.tubefootcrawl));
  const face = facing == null ? 1 : facing;
  if (u < 0.14) {
    const s = smoothstep(u / 0.14);
    return { x: fromX + face * s * 0.00009, lift: s * 0.0026, rot: s * 0.14 * face, anim: "sit" as TrickAnim };
  }
  if (u < 0.88) {
    const sway = Math.sin(((u - 0.14) / 0.74) * Math.PI * 2.85);
    return {
      x: fromX + face * (0.00009 + sway * 0.00018),
      lift: 0.0026 + Math.abs(sway) * 0.0019,
      rot: (0.14 + sway * 0.22) * face,
      anim: "sit" as TrickAnim,
    };
  }
  const s = smoothstep((u - 0.88) / 0.12);
  return { x: fromX + face * 0.00009 * (1 - s), lift: 0.0026 * (1 - s), rot: 0.14 * (1 - s) * face, anim: "idle" as TrickAnim };
}
export function cucumberswellshrinkPose(t: number, fromX: number, facing?: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.cucumberswellshrink));
  const face = facing == null ? 1 : facing;
  if (u < 0.18) {
    const s = smoothstep(u / 0.18);
    return { x: fromX + face * s * 0.00028, lift: s * 0.0009, rot: s * 0.05 * face, anim: "sit" as TrickAnim };
  }
  if (u < 0.82) {
    const creep = Math.sin(((u - 0.18) / 0.64) * Math.PI * 1.8);
    return {
      x: fromX + face * (0.00028 + creep * 0.00028),
      lift: 0.0009 + Math.abs(creep) * 0.0007,
      rot: (0.05 + creep * 0.06) * face,
      anim: "sit" as TrickAnim,
    };
  }
  const s = smoothstep((u - 0.82) / 0.18);
  return { x: fromX + face * 0.0007 * (1 - s * 0.3), lift: 0.0009 * (1 - s), rot: 0.05 * (1 - s) * face, anim: "idle" as TrickAnim };
}
export function stepTrick(trick: SeaCucumberTrick, dt: number, flags?: TrickFlags): SeaCucumberTrick {
  if (!trick || trick.phase === "done") return trick;
  if (shouldAbort(flags) && trick.kind !== "depositfeedsift" && trick.kind !== "softretractcue" && trick.kind !== "tubefootcrawl" && trick.kind !== "cucumberswellshrink") {
    return { ...trick, phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true };
  }
  const next = { ...trick, t: trick.t + Math.max(0, dt) };
  if (next.kind === "longholothuriahush") {
    if (next.t < LONGHOLOTHURIAHUSH_HOLD) {
      const pose = longholothuriahushPose(next.t);
      next.phase = "hold";
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = "sit";
      return next;
    }
    if (next.t < LONGHOLOTHURIAHUSH_HOLD + RELEASE_S) {
      const pose = releasePose(next.t - LONGHOLOTHURIAHUSH_HOLD);
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
  if (next.kind === "depositfeedsift") {
    const pose = depositfeedsiftPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "softretractcue") {
    const pose = softretractcuePose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "cucumberswellshrink") {
    const pose = cucumberswellshrinkPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else {
    const pose = tubefootcrawlPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  }
  if (u >= 1) return { ...next, phase: "done", lift: 0, rot: 0, anim: "idle" };
  return next;
}
