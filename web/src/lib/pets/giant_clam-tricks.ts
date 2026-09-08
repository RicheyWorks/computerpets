/** Gate ground tricks while idle. House neighborly Giant Clam (Tridacna gigas / Tridacninae giant clam) desk life -- mantle curtain pulse / siphon jet puff / shell gape-close gate / zooxanthellae sun bask / long tridacna hush; NOT Veil lionfish (esp. not mantlecurtainpulse/siphonjetpuff/shellgapeclosegate/zooxanthellaesunbask/longtridacnahush); NOT Tube sea cucumber; NOT Scrub cleaner shrimp; NOT Hinge mussel; NOT Pearl oyster; NOT Cement barnacle; NOT window-play mantle dish (idle ids stay off mantle/mantledish); NOT Rui; guest slug Gate / key giant_clam -- accept giant_clam and gate; Thank-yous densgate / inkgate / denstridacna. Sleep, hide, leave, rest, card, ribbon still win. Same map as desktop giant_clam-tricks.js. Next: Soar / eagle_ray. Catalog 220. */
export const TRICK_KEY = "giant_clam";
export const TRICKS = ["mantlecurtainpulse", "siphonjetpuff", "shellgapeclosegate", "zooxanthellaesunbask", "longtridacnahush"] as const;
export const HAPPY = ["densgate", "inkgate", "denstridacna"] as const;
export const HAPPY_DUR = { densgate: 2.89, inkgate: 2.88, denstridacna: 2.81 } as const;
export const LONGTRIDACNAHUSH_HOLD = 34.12;
export const RELEASE_S = 2.53;
export const DUR = { longtridacnahush: LONGTRIDACNAHUSH_HOLD + RELEASE_S, mantlecurtainpulse: 5.71, siphonjetpuff: 5.49, shellgapeclosegate: 5.55, zooxanthellaesunbask: 5.77 } as const;

export type GiantClamTrickKind = (typeof TRICKS)[number];
export type GiantClamHappyKind = (typeof HAPPY)[number];
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

export type GiantClamTrick = {
kind: GiantClamTrickKind;
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

export type GiantClamHappy = {
kind: GiantClamHappyKind;
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

export function nextTrickWait(justFinished: boolean, rand?: number, kind?: GiantClamTrickKind | string) {
  const roll = rand == null ? Math.random() : rand;
  if (kind === "longtridacnahush") return 211 + roll * 30;
  if (kind === "siphonjetpuff") return 26.2 + roll * 3.4;
  if (kind === "zooxanthellaesunbask") return 25.3 + roll * 3.2;
  if (kind === "mantlecurtainpulse") return 24.6 + roll * 3.3;
  if (kind === "shellgapeclosegate") return 25.8 + roll * 3.2;
  return justFinished ? 19.1 + roll * 3.2 : 14.3 + roll * 2.8;
}

export function pickTrick(rand?: number, musicOn?: boolean, lastKind?: GiantClamTrickKind | string | null) {
  if (musicOn) return "longtridacnahush";
  const roll = rand == null ? Math.random() : rand;
  if (lastKind === "longtridacnahush") {
    if (roll < 0.26) return "siphonjetpuff";
    if (roll < 0.5) return "zooxanthellaesunbask";
    if (roll < 0.74) return "mantlecurtainpulse";
    return "shellgapeclosegate";
  }
  if (lastKind === "siphonjetpuff") {
    if (roll < 0.26) return "longtridacnahush";
    if (roll < 0.5) return "zooxanthellaesunbask";
    if (roll < 0.74) return "mantlecurtainpulse";
    return "shellgapeclosegate";
  }
  if (lastKind === "zooxanthellaesunbask") {
    if (roll < 0.22) return "longtridacnahush";
    if (roll < 0.44) return "siphonjetpuff";
    if (roll < 0.68) return "mantlecurtainpulse";
    return "shellgapeclosegate";
  }
  if (roll < 0.2) return "longtridacnahush";
  if (roll < 0.4) return "siphonjetpuff";
  if (roll < 0.6) return "zooxanthellaesunbask";
  if (roll < 0.8) return "mantlecurtainpulse";
  return "shellgapeclosegate";
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

export function wantsThankYou(key: string | undefined) {
  return key === TRICK_KEY || key === "gate";
}

export function startThankYou(key: string | undefined, lastKind: GiantClamHappyKind | string | null | undefined, x: number, facing?: 1 | -1, flags?: TrickFlags) {
  if (!wantsThankYou(key)) return null;
  if (!happyCanStart(flags || { cmd: "idle" })) return null;
  const pick = pickHappy(lastKind);
  return { happy: beginHappy(pick, x, facing), kind: pick };
}

export function pickHappy(lastKind?: GiantClamHappyKind | string | null, rand?: number) {
  const pool = HAPPY.filter((k) => k !== lastKind);
  const list = pool.length ? pool : HAPPY.slice();
  const roll = rand == null ? Math.random() : rand;
  return list[Math.floor(roll * list.length)] || list[0];
}

export function beginHappy(kind: GiantClamHappyKind | string, x: number, facing?: 1 | -1): GiantClamHappy {
  const name = (HAPPY.indexOf(kind as GiantClamHappyKind) >= 0 ? kind : "densgate") as GiantClamHappyKind;
  return {
    kind: name,
    happy: true,
    phase: "go",
    t: 0,
    x: x,
    lift: 0,
    rot: 0,
    anim: name === "densgate" ? "sit" : name === "inkgate" ? "play" : "play",
    facing: (facing == null ? 1 : facing) as 1 | -1,
    fromX: x,
  };
}

export function densgatePose(t: number) {
  const u = Math.max(0, Math.min(1, t / HAPPY_DUR.densgate));
  if (u < 0.15) {
    const s = u / 0.15;
    return { lift: s * 0.0041, rot: s * -0.31, anim: "sit" };
  }
  if (u < 0.84) {
    const sway = Math.sin(((u - 0.15) / 0.69) * Math.PI * 2.62);
    return { lift: 0.0041 + Math.abs(sway) * 0.0012, rot: -0.31 + sway * 0.22, anim: "sit" };
  }
  const s = (u - 0.84) / 0.16;
  return { lift: 0.0041 * (1 - s), rot: -0.31 * (1 - s), anim: "idle" };
}
export function inkgatePose(t: number) {
  const u = Math.max(0, Math.min(1, t / HAPPY_DUR.inkgate));
  if (u < 0.12) {
    const s = u / 0.12;
    return { lift: s * 0.0045, rot: s * 0.35, anim: "play" };
  }
  if (u < 0.82) {
    const arc = Math.sin(((u - 0.12) / 0.7) * Math.PI * 3.2);
    return { lift: 0.0045 + Math.abs(arc) * 0.0024, rot: 0.35 + arc * 0.34, anim: "play" };
  }
  const s = (u - 0.82) / 0.18;
  return { lift: 0.0045 * (1 - s), rot: 0.35 * (1 - s), anim: "idle" };
}
export function denstridacnaPose(t: number) {
  const u = Math.max(0, Math.min(1, t / HAPPY_DUR.denstridacna));
  if (u < 0.14) {
    const s = u / 0.14;
    return { lift: s * -0.0014, rot: s * 0.21, anim: "play" };
  }
  if (u < 0.83) {
    const hush = Math.sin(((u - 0.14) / 0.69) * Math.PI * 2.12);
    return { lift: -0.0014 + Math.abs(hush) * 0.0010, rot: 0.21 + hush * 0.14, anim: "play" };
  }
  const s = (u - 0.83) / 0.17;
  return { lift: -0.0014 * (1 - s), rot: 0.21 * (1 - s), anim: "idle" };
}
export function stepHappy(happy: GiantClamHappy | null | undefined, dt: number, flags?: TrickFlags) {
  if (!happy || happy.phase === "done") return happy;
  if (happyShouldAbort(flags)) {
    return Object.assign({}, happy, { phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true });
  }
  const next = Object.assign({}, happy, { t: happy.t + Math.max(0, dt) });
  const hold = HAPPY_DUR[next.kind];
  if (next.kind === "densgate") {
    const pose = densgatePose(next.t);
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "inkgate") {
    const pose = inkgatePose(next.t);
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else {
    const pose = denstridacnaPose(next.t);
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  }
  if (next.t >= hold) return Object.assign({}, next, { phase: "done", lift: 0, rot: 0, anim: "idle" });
  return next;
}

export function sleepHoldFrame(_key?: string, _frameCount?: number) {
  return null;
}

export function beginTrick(kind: GiantClamTrickKind | string, x: number, facing?: 1 | -1): GiantClamTrick {
  const k = (TRICKS.indexOf(kind as GiantClamTrickKind) >= 0 ? kind : "longtridacnahush") as GiantClamTrickKind;
  const anim =
    k === "longtridacnahush"
      ? "sit"
      : k === "siphonjetpuff"
        ? "play"
        : k === "zooxanthellaesunbask"
          ? "sit"
          : k === "shellgapeclosegate"
            ? "sit"
            : k === "mantlecurtainpulse"
              ? "sit"
              : "sit";
  return {
    kind: k,
    phase: k === "longtridacnahush" ? "hold" : "go",
    t: 0,
    x: x,
    lift: 0,
    rot: 0,
    anim: anim,
    facing: (facing == null ? 1 : facing) as 1 | -1,
    fromX: x,
  };
}

export function smoothstep(t: number) {
  const x = Math.max(0, Math.min(1, t));
  return x * x * (3 - 2 * x);
}

export function longtridacnahushPose(t: number) {
  const breath = Math.sin(t * 0.00031) + 0.0001 * Math.sin(t * 0.00104);
  const hush = Math.abs(Math.sin(t * 0.00017));
  return { lift: -0.00016 + hush * 0.00006, rot: 0.0013 + breath * 0.0010 };
}

export function releasePose(t: number) {
  const u = Math.max(0, Math.min(1, t / RELEASE_S));
  return { lift: -0.00016 * (1 - Math.sin(u * Math.PI * 0.5)), rot: 0.0028 * (1 - u) };
}

export function siphonjetpuffPose(t: number, fromX: number, facing?: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.siphonjetpuff));
  const face = facing == null ? 1 : facing;
  if (u < 0.2) {
    const s = smoothstep(u / 0.2);
    return { x: fromX + face * s * 0.00006, lift: s * -0.0045, rot: s * 0.09 * face, anim: "play" };
  }
  if (u < 0.7) {
    const gulp = Math.sin(((u - 0.2) / 0.5) * Math.PI * 2.5);
    return {
      x: fromX + face * (0.00006 + gulp * 0.00004),
      lift: -0.0045 + Math.abs(gulp) * 0.0013,
      rot: (0.09 + gulp * 0.07) * face,
      anim: "play",
    };
  }
  const s = smoothstep((u - 0.7) / 0.3);
  return { x: fromX + face * 0.00006 * (1 - s), lift: -0.0045 * (1 - s), rot: 0.09 * (1 - s) * face, anim: "idle" };
}
export function zooxanthellaesunbaskPose(t: number, fromX: number, facing?: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.zooxanthellaesunbask));
  const face = facing == null ? 1 : facing;
  if (u < 0.18) {
    const s = smoothstep(u / 0.18);
    return { x: fromX + face * s * 0.00012, lift: s * 0.0059, rot: s * 0.05 * face, anim: "sit" };
  }
  if (u < 0.82) {
    const drift = Math.sin(((u - 0.18) / 0.64) * Math.PI * 1.7);
    return {
      x: fromX + face * (0.00012 + drift * 0.00022),
      lift: 0.0059 + Math.abs(drift) * 0.0014,
      rot: (0.05 + drift * 0.08) * face,
      anim: "sit",
    };
  }
  const s = smoothstep((u - 0.82) / 0.18);
  return { x: fromX + face * 0.00012 * (1 - s), lift: 0.0059 * (1 - s), rot: 0.05 * (1 - s) * face, anim: "idle" };
}
export function mantlecurtainpulsePose(t: number, fromX: number, facing?: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.mantlecurtainpulse));
  const face = facing == null ? 1 : facing;
  if (u < 0.14) {
    const s = smoothstep(u / 0.14);
    return { x: fromX + face * s * -0.00003, lift: s * 0.0035, rot: s * 0.35 * face, anim: "sit" };
  }
  if (u < 0.86) {
    const fan = Math.sin(((u - 0.14) / 0.72) * Math.PI * 2.8);
    return {
      x: fromX + face * (-0.00003 + fan * 0.0001),
      lift: 0.0035 + Math.abs(fan) * 0.0028,
      rot: (0.35 + fan * 0.38) * face,
      anim: "sit",
    };
  }
  const s = smoothstep((u - 0.86) / 0.14);
  return { x: fromX + face * -0.00003 * (1 - s), lift: 0.0035 * (1 - s), rot: 0.35 * (1 - s) * face, anim: "idle" };
}
export function shellgapeclosegatePose(t: number, fromX: number, facing?: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.shellgapeclosegate));
  const face = facing == null ? 1 : facing;
  if (u < 0.3) {
    const s = smoothstep(u / 0.3);
    return { x: fromX + face * s * -0.00002, lift: s * 0.0068, rot: s * -0.06 * face, anim: "sit" };
  }
  if (u < 0.72) {
    const warn = Math.sin(((u - 0.3) / 0.42) * Math.PI);
    return {
      x: fromX + face * -0.00002,
      lift: 0.0068 + warn * 0.0006,
      rot: (-0.06 + warn * 0.03) * face,
      anim: "sit",
    };
  }
  const s = smoothstep((u - 0.72) / 0.28);
  return { x: fromX + face * -0.00002 * (1 - s), lift: 0.0068 * (1 - s), rot: -0.06 * (1 - s) * face, anim: "idle" };
}
export function stepTrick(trick: GiantClamTrick | null | undefined, dt: number, flags?: TrickFlags) {
  if (!trick || trick.phase === "done") return trick;
  if (shouldAbort(flags) && trick.kind !== "siphonjetpuff" && trick.kind !== "zooxanthellaesunbask" && trick.kind !== "mantlecurtainpulse" && trick.kind !== "shellgapeclosegate") {
    return Object.assign({}, trick, { phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true });
  }
  const next = Object.assign({}, trick, { t: trick.t + Math.max(0, dt) });
  if (next.kind === "longtridacnahush") {
    if (next.t < LONGTRIDACNAHUSH_HOLD) {
      const pose = longtridacnahushPose(next.t);
      next.phase = "hold";
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = "sit";
      return next;
    }
    if (next.t < LONGTRIDACNAHUSH_HOLD + RELEASE_S) {
      const pose = releasePose(next.t - LONGTRIDACNAHUSH_HOLD);
      next.phase = "release";
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = "sit";
      return next;
    }
    return Object.assign({}, next, { phase: "done", lift: 0, rot: 0, anim: "idle" });
  }
  const hold = DUR[next.kind];
  const u = next.t / hold;
  if (next.kind === "siphonjetpuff") {
    const pose = siphonjetpuffPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "zooxanthellaesunbask") {
    const pose = zooxanthellaesunbaskPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "mantlecurtainpulse") {
    const pose = mantlecurtainpulsePose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else {
    const pose = shellgapeclosegatePose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  }
  if (u >= 1) return Object.assign({}, next, { phase: "done", lift: 0, rot: 0, anim: "idle" });
  return next;
}

