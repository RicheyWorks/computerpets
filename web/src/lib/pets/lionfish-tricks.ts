/** Veil ground tricks while idle. House neighborly Red Lionfish (Pterois volitans / Pteroinae lionfish) desk life -- pectoral-veil fan flare / slow hover stalk / spine warn raise / gulping inhale cue / long pterois hush; NOT Tube sea cucumber (esp. not tubefootcrawl/depositfeedsift/cucumberswellshrink/softretractcue/longholothuriahush); NOT Scrub cleaner shrimp; NOT Scrape parrotfish; NOT Paint clownfish; NOT window-play rays (idle ids stay off rays); NOT Rui; guest slug Veil / key lionfish -- accept lionfish and veil; Thank-yous densveil / inkveil / denspterois. Sleep, hide, leave, rest, card, ribbon still win. Same map as desktop lionfish-tricks.js. Next: Gate / giant_clam. Catalog 220. */
export const TRICK_KEY = "lionfish";
export const TRICKS = ["pectoralveilfanflare", "gulpinginhalecue", "spinewarnraise", "slowhoverstalk", "longpteroishush"] as const;
export const HAPPY = ["densveil", "inkveil", "denspterois"] as const;
export const HAPPY_DUR = { densveil: 2.72, inkveil: 2.81, denspterois: 2.64 } as const;
export const LONGPTEROISHUSH_HOLD = 33.84;
export const RELEASE_S = 2.48;
export const DUR = { longpteroishush: LONGPTEROISHUSH_HOLD + RELEASE_S, pectoralveilfanflare: 5.58, gulpinginhalecue: 5.36, spinewarnraise: 5.42, slowhoverstalk: 5.64 } as const;

export type LionfishTrickKind = (typeof TRICKS)[number];
export type LionfishHappyKind = (typeof HAPPY)[number];
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

export type LionfishTrick = {
kind: LionfishTrickKind;
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

export type LionfishHappy = {
kind: LionfishHappyKind;
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

export function nextTrickWait(justFinished: boolean, rand?: number, kind?: LionfishTrickKind | string) {
  const roll = rand == null ? Math.random() : rand;
  if (kind === "longpteroishush") return 208 + roll * 30;
  if (kind === "gulpinginhalecue") return 25.8 + roll * 3.4;
  if (kind === "slowhoverstalk") return 24.9 + roll * 3.2;
  if (kind === "pectoralveilfanflare") return 24.2 + roll * 3.3;
  if (kind === "spinewarnraise") return 25.4 + roll * 3.1;
  return justFinished ? 18.8 + roll * 3.1 : 14.0 + roll * 2.7;
}

export function pickTrick(rand?: number, musicOn?: boolean, lastKind?: LionfishTrickKind | string | null) {
  if (musicOn) return "longpteroishush";
  const roll = rand == null ? Math.random() : rand;
  if (lastKind === "longpteroishush") {
    if (roll < 0.26) return "gulpinginhalecue";
    if (roll < 0.5) return "slowhoverstalk";
    if (roll < 0.74) return "pectoralveilfanflare";
    return "spinewarnraise";
  }
  if (lastKind === "gulpinginhalecue") {
    if (roll < 0.26) return "longpteroishush";
    if (roll < 0.5) return "slowhoverstalk";
    if (roll < 0.74) return "pectoralveilfanflare";
    return "spinewarnraise";
  }
  if (lastKind === "slowhoverstalk") {
    if (roll < 0.22) return "longpteroishush";
    if (roll < 0.44) return "gulpinginhalecue";
    if (roll < 0.68) return "pectoralveilfanflare";
    return "spinewarnraise";
  }
  if (roll < 0.2) return "longpteroishush";
  if (roll < 0.4) return "gulpinginhalecue";
  if (roll < 0.6) return "slowhoverstalk";
  if (roll < 0.8) return "pectoralveilfanflare";
  return "spinewarnraise";
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
  return key === TRICK_KEY || key === "veil";
}

export function startThankYou(key: string | undefined, lastKind: LionfishHappyKind | string | null | undefined, x: number, facing?: 1 | -1, flags?: TrickFlags) {
  if (!wantsThankYou(key)) return null;
  if (!happyCanStart(flags || { cmd: "idle" })) return null;
  const pick = pickHappy(lastKind);
  return { happy: beginHappy(pick, x, facing), kind: pick };
}

export function pickHappy(lastKind?: LionfishHappyKind | string | null, rand?: number) {
  const pool = HAPPY.filter((k) => k !== lastKind);
  const list = pool.length ? pool : HAPPY.slice();
  const roll = rand == null ? Math.random() : rand;
  return list[Math.floor(roll * list.length)] || list[0];
}

export function beginHappy(kind: LionfishHappyKind | string, x: number, facing?: 1 | -1): LionfishHappy {
  const name = (HAPPY.indexOf(kind as LionfishHappyKind) >= 0 ? kind : "densveil") as LionfishHappyKind;
  return {
    kind: name,
    happy: true,
    phase: "go",
    t: 0,
    x: x,
    lift: 0,
    rot: 0,
    anim: name === "densveil" ? "sit" : name === "inkveil" ? "play" : "play",
    facing: (facing == null ? 1 : facing) as 1 | -1,
    fromX: x,
  };
}

export function densveilPose(t: number) {
  const u = Math.max(0, Math.min(1, t / HAPPY_DUR.densveil));
  if (u < 0.15) {
    const s = u / 0.15;
    return { lift: s * 0.0038, rot: s * -0.28, anim: "sit" };
  }
  if (u < 0.84) {
    const sway = Math.sin(((u - 0.15) / 0.69) * Math.PI * 2.55);
    return { lift: 0.0038 + Math.abs(sway) * 0.0012, rot: -0.28 + sway * 0.22, anim: "sit" };
  }
  const s = (u - 0.84) / 0.16;
  return { lift: 0.0038 * (1 - s), rot: -0.28 * (1 - s), anim: "idle" };
}
export function inkveilPose(t: number) {
  const u = Math.max(0, Math.min(1, t / HAPPY_DUR.inkveil));
  if (u < 0.12) {
    const s = u / 0.12;
    return { lift: s * 0.0042, rot: s * 0.32, anim: "play" };
  }
  if (u < 0.82) {
    const arc = Math.sin(((u - 0.12) / 0.7) * Math.PI * 3.1);
    return { lift: 0.0042 + Math.abs(arc) * 0.0024, rot: 0.32 + arc * 0.34, anim: "play" };
  }
  const s = (u - 0.82) / 0.18;
  return { lift: 0.0042 * (1 - s), rot: 0.32 * (1 - s), anim: "idle" };
}
export function denspteroisPose(t: number) {
  const u = Math.max(0, Math.min(1, t / HAPPY_DUR.denspterois));
  if (u < 0.14) {
    const s = u / 0.14;
    return { lift: s * -0.0012, rot: s * 0.19, anim: "play" };
  }
  if (u < 0.83) {
    const hush = Math.sin(((u - 0.14) / 0.69) * Math.PI * 2.05);
    return { lift: -0.0012 + Math.abs(hush) * 0.0010, rot: 0.19 + hush * 0.14, anim: "play" };
  }
  const s = (u - 0.83) / 0.17;
  return { lift: -0.0012 * (1 - s), rot: 0.19 * (1 - s), anim: "idle" };
}
export function stepHappy(happy: LionfishHappy | null | undefined, dt: number, flags?: TrickFlags) {
  if (!happy || happy.phase === "done") return happy;
  if (happyShouldAbort(flags)) {
    return Object.assign({}, happy, { phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true });
  }
  const next = Object.assign({}, happy, { t: happy.t + Math.max(0, dt) });
  const hold = HAPPY_DUR[next.kind];
  if (next.kind === "densveil") {
    const pose = densveilPose(next.t);
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "inkveil") {
    const pose = inkveilPose(next.t);
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else {
    const pose = denspteroisPose(next.t);
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

export function beginTrick(kind: LionfishTrickKind | string, x: number, facing?: 1 | -1): LionfishTrick {
  const k = (TRICKS.indexOf(kind as LionfishTrickKind) >= 0 ? kind : "longpteroishush") as LionfishTrickKind;
  const anim =
    k === "longpteroishush"
      ? "sit"
      : k === "gulpinginhalecue"
        ? "play"
        : k === "slowhoverstalk"
          ? "sit"
          : k === "spinewarnraise"
            ? "sit"
            : k === "pectoralveilfanflare"
              ? "sit"
              : "sit";
  return {
    kind: k,
    phase: k === "longpteroishush" ? "hold" : "go",
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

export function longpteroishushPose(t: number) {
  const breath = Math.sin(t * 0.00033) + 0.0001 * Math.sin(t * 0.00098);
  const hush = Math.abs(Math.sin(t * 0.00019));
  return { lift: -0.00014 + hush * 0.00005, rot: 0.0011 + breath * 0.0009 };
}

export function releasePose(t: number) {
  const u = Math.max(0, Math.min(1, t / RELEASE_S));
  return { lift: -0.00014 * (1 - Math.sin(u * Math.PI * 0.5)), rot: 0.0026 * (1 - u) };
}

export function gulpinginhalecuePose(t: number, fromX: number, facing?: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.gulpinginhalecue));
  const face = facing == null ? 1 : facing;
  if (u < 0.2) {
    const s = smoothstep(u / 0.2);
    return { x: fromX + face * s * 0.00005, lift: s * -0.0042, rot: s * 0.09 * face, anim: "play" };
  }
  if (u < 0.7) {
    const gulp = Math.sin(((u - 0.2) / 0.5) * Math.PI * 2.4);
    return {
      x: fromX + face * (0.00005 + gulp * 0.00004),
      lift: -0.0042 + Math.abs(gulp) * 0.0011,
      rot: (0.09 + gulp * 0.07) * face,
      anim: "play",
    };
  }
  const s = smoothstep((u - 0.7) / 0.3);
  return { x: fromX + face * 0.00005 * (1 - s), lift: -0.0042 * (1 - s), rot: 0.09 * (1 - s) * face, anim: "idle" };
}
export function slowhoverstalkPose(t: number, fromX: number, facing?: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.slowhoverstalk));
  const face = facing == null ? 1 : facing;
  if (u < 0.18) {
    const s = smoothstep(u / 0.18);
    return { x: fromX + face * s * 0.00012, lift: s * 0.0056, rot: s * 0.05 * face, anim: "sit" };
  }
  if (u < 0.82) {
    const drift = Math.sin(((u - 0.18) / 0.64) * Math.PI * 1.6);
    return {
      x: fromX + face * (0.00012 + drift * 0.00022),
      lift: 0.0056 + Math.abs(drift) * 0.0014,
      rot: (0.05 + drift * 0.08) * face,
      anim: "sit",
    };
  }
  const s = smoothstep((u - 0.82) / 0.18);
  return { x: fromX + face * 0.00012 * (1 - s), lift: 0.0056 * (1 - s), rot: 0.05 * (1 - s) * face, anim: "idle" };
}
export function pectoralveilfanflarePose(t: number, fromX: number, facing?: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.pectoralveilfanflare));
  const face = facing == null ? 1 : facing;
  if (u < 0.14) {
    const s = smoothstep(u / 0.14);
    return { x: fromX + face * s * -0.00003, lift: s * 0.0032, rot: s * 0.32 * face, anim: "sit" };
  }
  if (u < 0.86) {
    const fan = Math.sin(((u - 0.14) / 0.72) * Math.PI * 2.7);
    return {
      x: fromX + face * (-0.00003 + fan * 0.0001),
      lift: 0.0032 + Math.abs(fan) * 0.0028,
      rot: (0.32 + fan * 0.38) * face,
      anim: "sit",
    };
  }
  const s = smoothstep((u - 0.86) / 0.14);
  return { x: fromX + face * -0.00003 * (1 - s), lift: 0.0032 * (1 - s), rot: 0.32 * (1 - s) * face, anim: "idle" };
}
export function spinewarnraisePose(t: number, fromX: number, facing?: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.spinewarnraise));
  const face = facing == null ? 1 : facing;
  if (u < 0.3) {
    const s = smoothstep(u / 0.3);
    return { x: fromX + face * s * -0.00002, lift: s * 0.0072, rot: s * -0.06 * face, anim: "sit" };
  }
  if (u < 0.72) {
    const warn = Math.sin(((u - 0.3) / 0.42) * Math.PI);
    return {
      x: fromX + face * -0.00002,
      lift: 0.0072 + warn * 0.0006,
      rot: (-0.06 + warn * 0.03) * face,
      anim: "sit",
    };
  }
  const s = smoothstep((u - 0.72) / 0.28);
  return { x: fromX + face * -0.00002 * (1 - s), lift: 0.0072 * (1 - s), rot: -0.06 * (1 - s) * face, anim: "idle" };
}
export function stepTrick(trick: LionfishTrick | null | undefined, dt: number, flags?: TrickFlags) {
  if (!trick || trick.phase === "done") return trick;
  if (shouldAbort(flags) && trick.kind !== "gulpinginhalecue" && trick.kind !== "slowhoverstalk" && trick.kind !== "pectoralveilfanflare" && trick.kind !== "spinewarnraise") {
    return Object.assign({}, trick, { phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true });
  }
  const next = Object.assign({}, trick, { t: trick.t + Math.max(0, dt) });
  if (next.kind === "longpteroishush") {
    if (next.t < LONGPTEROISHUSH_HOLD) {
      const pose = longpteroishushPose(next.t);
      next.phase = "hold";
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = "sit";
      return next;
    }
    if (next.t < LONGPTEROISHUSH_HOLD + RELEASE_S) {
      const pose = releasePose(next.t - LONGPTEROISHUSH_HOLD);
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
  if (next.kind === "gulpinginhalecue") {
    const pose = gulpinginhalecuePose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "slowhoverstalk") {
    const pose = slowhoverstalkPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "pectoralveilfanflare") {
    const pose = pectoralveilfanflarePose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else {
    const pose = spinewarnraisePose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  }
  if (u >= 1) return Object.assign({}, next, { phase: "done", lift: 0, rot: 0, anim: "idle" });
  return next;
}

