/** Hang ground tricks while idle. House neighborly two-toed sloth (Choloepus / Linnaeus's two-toed; Bradypus-true canopy manners) desk life -- hangsway / reachcrawl / algaescratch / headturnstare / bradypushush personality (hangsway upside-down hang sway distinct from Opossum hang and Bat roost; reachcrawl slow claw reach crawl distinct from Turtle plod and Millipede ripple; algaescratch algae-fur scratch distinct from Hedgehog anoint and Rui groom; headturnstare slow head-turn stare distinct from Deer freeze and Owl swivel; long bradypushush Bradypus/Choloepus hush -- never named wait; NOT Rob robber fly; NOT Rui red panda; NOT primate Sun/Swing; guest slug Hang / key sloth -- accept sloth and hang; Thank-yous denshang / inkhang / densbradypus. Sleep, hide, leave, rest, card, ribbon still win. Same map as desktop sloth-tricks.js. Next: Sun / lemur. Catalog 220. */
export const TRICK_KEY = "sloth";
export const TRICKS = ["hangsway", "reachcrawl", "algaescratch", "headturnstare", "bradypushush"] as const;
export const HAPPY = ["denshang", "inkhang", "densbradypus"] as const;
export type SlothTrickKind = (typeof TRICKS)[number];
export type SlothHappyKind = (typeof HAPPY)[number];
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

export type SlothTrick = {
  kind: SlothTrickKind;
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

export type SlothHappy = {
  kind: SlothHappyKind;
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

export const HAPPY_DUR = { denshang: 2.64, inkhang: 2.81, densbradypus: 2.52 } as const;
export const BRADYPUSHUSH_HOLD = 31.40;
export const RELEASE_S = 2.36;
export const DUR = { bradypushush: BRADYPUSHUSH_HOLD + RELEASE_S, hangsway: 5.18, reachcrawl: 5.62, algaescratch: 4.88, headturnstare: 5.04 } as const;

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
export function nextTrickWait(justFinished: boolean, rand?: number, kind?: SlothTrickKind | string) {
  const roll = rand == null ? Math.random() : rand;
  if (kind === "bradypushush") return 198 + roll * 20;
  if (kind === "hangsway") return 22.4 + roll * 3.6;
  if (kind === "reachcrawl") return 26.2 + roll * 3.9;
  if (kind === "algaescratch") return 24.6 + roll * 3.5;
  if (kind === "headturnstare") return 25.0 + roll * 3.7;
  return justFinished ? 19.0 + roll * 3.0 : 14.2 + roll * 2.6;
}
export function pickTrick(rand?: number, musicOn?: boolean, lastKind?: SlothTrickKind | string) {
  if (musicOn) return "bradypushush";
  const roll = rand == null ? Math.random() : rand;
  if (lastKind === "bradypushush") {
    if (roll < 0.26) return "hangsway";
    if (roll < 0.5) return "reachcrawl";
    if (roll < 0.74) return "algaescratch";
    return "headturnstare";
  }
  if (lastKind === "hangsway") {
    if (roll < 0.26) return "bradypushush";
    if (roll < 0.5) return "reachcrawl";
    if (roll < 0.74) return "algaescratch";
    return "headturnstare";
  }
  if (lastKind === "reachcrawl") {
    if (roll < 0.22) return "bradypushush";
    if (roll < 0.44) return "hangsway";
    if (roll < 0.68) return "algaescratch";
    return "headturnstare";
  }
  if (roll < 0.2) return "bradypushush";
  if (roll < 0.4) return "hangsway";
  if (roll < 0.6) return "reachcrawl";
  if (roll < 0.8) return "algaescratch";
  return "headturnstare";
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
  return key === TRICK_KEY || key === "hang";
}
export function startThankYou(
  key: string | undefined | null,
  lastKind: SlothHappyKind | string | undefined,
  x: number,
  facing?: 1 | -1,
  flags?: TrickFlags
) {
  if (!wantsThankYou(key)) return null;
  if (!happyCanStart(flags || { cmd: "idle" })) return null;
  const pick = pickHappy(lastKind);
  return { happy: beginHappy(pick, x, facing), kind: pick };
}
export function pickHappy(lastKind?: SlothHappyKind | string, rand?: number) {
  const pool = HAPPY.filter((k) => k !== lastKind);
  const list = pool.length ? pool : [...HAPPY];
  const roll = rand == null ? Math.random() : rand;
  return list[Math.floor(roll * list.length)] || list[0];
}
export function beginHappy(kind: SlothHappyKind | string, x: number, facing?: 1 | -1): SlothHappy {
  const name = (HAPPY as readonly string[]).indexOf(kind) >= 0 ? (kind as SlothHappyKind) : "denshang";
  return {
    kind: name,
    happy: true,
    phase: "go",
    t: 0,
    x,
    lift: 0,
    rot: 0,
    anim: name === "denshang" ? "sit" : name === "inkhang" ? "play" : "play",
    facing: facing == null ? 1 : facing,
    fromX: x,
  };
}

export function denshangPose(t: number) {
  const u = Math.max(0, Math.min(1, t / HAPPY_DUR.denshang));
  if (u < 0.16) {
    const s = u / 0.16;
    return { lift: s * 0.0036, rot: s * -0.11, anim: "sit" as TrickAnim };
  }
  if (u < 0.84) {
    const sway = Math.sin(((u - 0.16) / 0.68) * Math.PI * 2.15);
    return { lift: 0.0036 + Math.abs(sway) * 0.0011, rot: -0.11 + sway * 0.14, anim: "sit" as TrickAnim };
  }
  const s = (u - 0.84) / 0.16;
  return { lift: 0.0036 * (1 - s), rot: -0.11 * (1 - s), anim: "idle" as TrickAnim };
}
export function inkhangPose(t: number) {
  const u = Math.max(0, Math.min(1, t / HAPPY_DUR.inkhang));
  if (u < 0.13) {
    const s = u / 0.13;
    return { lift: s * 0.0024, rot: s * 0.19, anim: "play" as TrickAnim };
  }
  if (u < 0.82) {
    const claw = Math.sin(((u - 0.13) / 0.69) * Math.PI * 2.85);
    return { lift: 0.0024 + Math.abs(claw) * 0.0016, rot: 0.19 + claw * 0.22, anim: "play" as TrickAnim };
  }
  const s = (u - 0.82) / 0.18;
  return { lift: 0.0024 * (1 - s), rot: 0.19 * (1 - s), anim: "idle" as TrickAnim };
}
export function densbradypusPose(t: number) {
  const u = Math.max(0, Math.min(1, t / HAPPY_DUR.densbradypus));
  if (u < 0.14) {
    const s = u / 0.14;
    return { lift: s * -0.0016, rot: s * 0.12, anim: "play" as TrickAnim };
  }
  if (u < 0.83) {
    const hush = Math.sin(((u - 0.14) / 0.69) * Math.PI * 2.05);
    return { lift: -0.0016 + Math.abs(hush) * 0.0009, rot: 0.12 + hush * 0.13, anim: "play" as TrickAnim };
  }
  const s = (u - 0.83) / 0.17;
  return { lift: -0.0016 * (1 - s), rot: 0.12 * (1 - s), anim: "idle" as TrickAnim };
}
export function stepHappy(happy: SlothHappy, dt: number, flags?: TrickFlags): SlothHappy {
  if (!happy || happy.phase === "done") return happy;
  if (happyShouldAbort(flags)) {
    return { ...happy, phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true };
  }
  const next = { ...happy, t: happy.t + Math.max(0, dt) };
  const hold = HAPPY_DUR[next.kind];
  if (next.kind === "denshang") {
    const pose = denshangPose(next.t);
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "inkhang") {
    const pose = inkhangPose(next.t);
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else {
    const pose = densbradypusPose(next.t);
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
export function beginTrick(kind: SlothTrickKind | string, x: number, facing?: 1 | -1): SlothTrick {
  const k = (TRICKS as readonly string[]).includes(kind) ? (kind as SlothTrickKind) : "bradypushush";
  const anim: TrickAnim =
    k === "bradypushush"
      ? "sit"
      : k === "hangsway"
        ? "play"
        : k === "reachcrawl"
          ? "walk"
          : k === "headturnstare"
            ? "sit"
            : k === "algaescratch"
              ? "play"
              : "sit";
  return {
    kind: k,
    phase: k === "bradypushush" ? "hold" : "go",
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

  export function bradypushushPose(t) {
    const breath = Math.sin(t * 0.00074) + 0.00024 * Math.sin(t * 0.0019);
    const hush = Math.abs(Math.sin(t * 0.00027));
    return { lift: -0.00022 + hush * 0.000038, rot: 0.005 + breath * 0.0018 };
  }

  export function releasePose(t) {
    const u = Math.max(0, Math.min(1, t / RELEASE_S));
    return { lift: -0.00024 * (1 - Math.sin(u * Math.PI * 0.5)), rot: 0.006 * (1 - u) };
  }

  export function hangswayPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.hangsway));
    const face = facing == null ? 1 : facing;
    // climb into an upside-down hang, slow canopy sway, ease down
    if (u < 0.18) {
      const s = smoothstep(u / 0.18);
      return { x: fromX + face * s * 0.00004, lift: s * 0.014, rot: s * 3.05 * face, anim: "play" };
    }
    if (u < 0.82) {
      const sway = (u - 0.18) / 0.64;
      const lean = Math.sin(sway * Math.PI * 1.65);
      return {
        x: fromX + face * (0.00004 + lean * 0.00055),
        lift: 0.014 + Math.abs(lean) * 0.0012,
        rot: (3.05 + lean * 0.16) * face,
        anim: "play",
      };
    }
    const s = smoothstep((u - 0.82) / 0.18);
    return { x: fromX + face * 0.00004 * (1 - s), lift: 0.014 * (1 - s), rot: 3.05 * (1 - s) * face, anim: "idle" };
  }

  export function reachcrawlPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.reachcrawl));
    const face = facing == null ? 1 : facing;
    // slow three-hook reach, drag body forward, plant, pause
    if (u < 0.2) {
      const s = smoothstep(u / 0.2);
      return { x: fromX + face * s * 0.0012, lift: s * 0.0014, rot: s * -0.18 * face, anim: "walk" };
    }
    if (u < 0.55) {
      const s = smoothstep((u - 0.2) / 0.35);
      return {
        x: fromX + face * (0.0012 + s * 0.0085),
        lift: 0.0014 + Math.sin(s * Math.PI) * 0.0011,
        rot: (-0.18 + s * 0.1) * face,
        anim: "walk",
      };
    }
    if (u < 0.82) {
      const plant = Math.sin(((u - 0.55) / 0.27) * Math.PI * 1.8);
      return {
        x: fromX + face * (0.0097 + plant * 0.00018),
        lift: 0.0006 + Math.abs(plant) * 0.0007,
        rot: (-0.08 + plant * 0.09) * face,
        anim: "walk",
      };
    }
    const s = smoothstep((u - 0.82) / 0.18);
    return { x: fromX + face * (0.0097 - s * 0.001), lift: 0.0006 * (1 - s), rot: -0.08 * (1 - s) * face, anim: "idle" };
  }

  export function algaescratchPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.algaescratch));
    const face = facing == null ? 1 : facing;
    // rake algae-green fur with a claw, pause, settle
    if (u < 0.14) {
      const s = smoothstep(u / 0.14);
      return { x: fromX + face * s * 0.00003, lift: s * -0.0022, rot: s * 0.32 * face, anim: "play" };
    }
    if (u < 0.78) {
      const scrub = (u - 0.14) / 0.64;
      const wipe = Math.sin(scrub * Math.PI * 4.6);
      return {
        x: fromX + face * (0.00003 + wipe * 0.00014),
        lift: -0.0022 + Math.abs(wipe) * 0.00085,
        rot: (0.32 + wipe * 0.2) * face,
        anim: "play",
      };
    }
    const s = smoothstep((u - 0.78) / 0.22);
    return { x: fromX + face * 0.00003 * (1 - s), lift: -0.0022 * (1 - s), rot: 0.32 * (1 - s) * face, anim: "idle" };
  }

  export function headturnstarePose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.headturnstare));
    const face = facing == null ? 1 : facing;
    // slow head turn, long stare, ease back
    if (u < 0.22) {
      const s = smoothstep(u / 0.22);
      return { x: fromX + face * s * 0.00002, lift: s * 0.0008, rot: s * 0.42 * face, anim: "sit" };
    }
    if (u < 0.78) {
      const stare = Math.sin(((u - 0.22) / 0.56) * Math.PI * 1.2);
      return {
        x: fromX + face * (0.00002 + stare * 0.00008),
        lift: 0.0008 + Math.abs(stare) * 0.00035,
        rot: (0.42 + stare * 0.06) * face,
        anim: "sit",
      };
    }
    const s = smoothstep((u - 0.78) / 0.22);
    return { x: fromX + face * 0.00002 * (1 - s), lift: 0.0008 * (1 - s), rot: 0.42 * (1 - s) * face, anim: "idle" };
  }

export function stepTrick(trick: SlothTrick, dt: number, flags?: TrickFlags): SlothTrick {
  if (!trick || trick.phase === "done") return trick;
  if (shouldAbort(flags) && trick.kind !== "hangsway" && trick.kind !== "reachcrawl" && trick.kind !== "algaescratch" && trick.kind !== "headturnstare") {
    return { ...trick, phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true };
  }
  const next = { ...trick, t: trick.t + Math.max(0, dt) };
  if (next.kind === "bradypushush") {
    if (next.t < BRADYPUSHUSH_HOLD) {
      const pose = bradypushushPose(next.t);
      next.phase = "hold";
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = "sit";
      return next;
    }
    if (next.t < BRADYPUSHUSH_HOLD + RELEASE_S) {
      const pose = releasePose(next.t - BRADYPUSHUSH_HOLD);
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
  if (next.kind === "hangsway") {
    const pose = hangswayPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "reachcrawl") {
    const pose = reachcrawlPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "algaescratch") {
    const pose = algaescratchPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else {
    const pose = headturnstarePose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  }
  if (u >= 1) return { ...next, phase: "done", lift: 0, rot: 0, anim: "idle" };
  return next;
}
