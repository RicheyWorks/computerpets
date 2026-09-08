/** Hide ground tricks while idle. House neighborly Nassau Grouper (Epinephelus striatus / Epinephelinae grouper) desk life -- cavern ambush settle / gular gulp inhale / color-pattern flush / slow caudal hover / long epinephelus hush; NOT Soar eagle ray (esp. not wingsoarflapglide/cephaliclobesift/sanddigbury/leapbreachcue/longaetobatushush); NOT Gate giant clam; NOT Veil lionfish; NOT Lunge bass (esp. not coverstrike/bedfan/surboil/latline/salmoides); NOT window-play holes (idle ids stay off holes/hide as trick id); NOT Rui; guest slug Hide / key grouper -- accept grouper and hide; Thank-yous densgrouper / inkgrouper / densepinephelus (not denshide — hide UI owns hide). Sleep, hide, leave, rest, card, ribbon still win. Same map as desktop grouper-tricks.js. Next: Arc / cyber_dragon. Catalog 220. */
export const TRICK_KEY = "grouper";
export const TRICKS = ["cavernambushsettle", "gulargulpinhale", "colorpatternflush", "slowcaudalhover", "longepinephelushush"] as const;
export const HAPPY = ["densgrouper", "inkgrouper", "densepinephelus"] as const;
export const HAPPY_DUR = { densgrouper: 2.97, inkgrouper: 2.91, densepinephelus: 2.84 } as const;
export const LONGEPINEPHELUSHUSH_HOLD = 34.76;
export const RELEASE_S = 2.61;
export const DUR = { longepinephelushush: LONGEPINEPHELUSHUSH_HOLD + RELEASE_S, cavernambushsettle: 5.97, gulargulpinhale: 5.73, colorpatternflush: 5.79, slowcaudalhover: 5.88 } as const;

export type GrouperTrickKind = (typeof TRICKS)[number];
export type GrouperHappyKind = (typeof HAPPY)[number];
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

export type GrouperTrick = {
kind: GrouperTrickKind;
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

export type GrouperHappy = {
kind: GrouperHappyKind;
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

export function nextTrickWait(justFinished: boolean, rand?: number, kind?: GrouperTrickKind | string) {
  const roll = rand == null ? Math.random() : rand;
  if (kind === "longepinephelushush") return 214 + roll * 31;
  if (kind === "gulargulpinhale") return 26.6 + roll * 3.5;
  if (kind === "slowcaudalhover") return 25.7 + roll * 3.3;
  if (kind === "cavernambushsettle") return 25.1 + roll * 3.4;
  if (kind === "colorpatternflush") return 26.1 + roll * 3.1;
  return justFinished ? 19.1 + roll * 3.2 : 14.3 + roll * 2.8;
}

export function pickTrick(rand?: number, musicOn?: boolean, lastKind?: GrouperTrickKind | string | null) {
  if (musicOn) return "longepinephelushush";
  const roll = rand == null ? Math.random() : rand;
  if (lastKind === "longepinephelushush") {
    if (roll < 0.26) return "gulargulpinhale";
    if (roll < 0.5) return "slowcaudalhover";
    if (roll < 0.74) return "cavernambushsettle";
    return "colorpatternflush";
  }
  if (lastKind === "gulargulpinhale") {
    if (roll < 0.26) return "longepinephelushush";
    if (roll < 0.5) return "slowcaudalhover";
    if (roll < 0.74) return "cavernambushsettle";
    return "colorpatternflush";
  }
  if (lastKind === "slowcaudalhover") {
    if (roll < 0.22) return "longepinephelushush";
    if (roll < 0.44) return "gulargulpinhale";
    if (roll < 0.68) return "cavernambushsettle";
    return "colorpatternflush";
  }
  if (roll < 0.2) return "longepinephelushush";
  if (roll < 0.4) return "gulargulpinhale";
  if (roll < 0.6) return "slowcaudalhover";
  if (roll < 0.8) return "cavernambushsettle";
  return "colorpatternflush";
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
  return key === TRICK_KEY || key === "hide";
}

export function startThankYou(key: string | undefined, lastKind: GrouperHappyKind | string | null | undefined, x: number, facing?: 1 | -1, flags?: TrickFlags) {
  if (!wantsThankYou(key)) return null;
  if (!happyCanStart(flags || { cmd: "idle" })) return null;
  const pick = pickHappy(lastKind);
  return { happy: beginHappy(pick, x, facing), kind: pick };
}

export function pickHappy(lastKind?: GrouperHappyKind | string | null, rand?: number) {
  const pool = HAPPY.filter((k) => k !== lastKind);
  const list = pool.length ? pool : HAPPY.slice();
  const roll = rand == null ? Math.random() : rand;
  return list[Math.floor(roll * list.length)] || list[0];
}

export function beginHappy(kind: GrouperHappyKind | string, x: number, facing?: 1 | -1): GrouperHappy {
  const name = (HAPPY.indexOf(kind as GrouperHappyKind) >= 0 ? kind : "densgrouper") as GrouperHappyKind;
  return {
    kind: name,
    happy: true,
    phase: "go",
    t: 0,
    x: x,
    lift: 0,
    rot: 0,
    anim: name === "densgrouper" ? "sit" : name === "inkgrouper" ? "play" : "play",
    facing: (facing == null ? 1 : facing) as 1 | -1,
    fromX: x,
  };
}

export function densgrouperPose(t: number) {
  const u = Math.max(0, Math.min(1, t / HAPPY_DUR.densgrouper));
  if (u < 0.15) {
    const s = u / 0.15;
    return { lift: s * 0.0044, rot: s * -0.28, anim: "sit" as TrickAnim };
  }
  if (u < 0.84) {
    const sway = Math.sin(((u - 0.15) / 0.69) * Math.PI * 2.48);
    return { lift: 0.0044 + Math.abs(sway) * 0.0013, rot: -0.28 + sway * 0.2, anim: "sit" as TrickAnim };
  }
  const s = (u - 0.84) / 0.16;
  return { lift: 0.0044 * (1 - s), rot: -0.28 * (1 - s), anim: "idle" as TrickAnim };
}
export function inkgrouperPose(t: number) {
  const u = Math.max(0, Math.min(1, t / HAPPY_DUR.inkgrouper));
  if (u < 0.12) {
    const s = u / 0.12;
    return { lift: s * 0.0051, rot: s * 0.34, anim: "play" as TrickAnim };
  }
  if (u < 0.86) {
    const bob = Math.sin(((u - 0.12) / 0.74) * Math.PI * 2.1);
    return { lift: 0.0051 + Math.abs(bob) * 0.0016, rot: 0.34 + bob * 0.18, anim: "play" as TrickAnim };
  }
  const s = (u - 0.86) / 0.14;
  return { lift: 0.0051 * (1 - s), rot: 0.34 * (1 - s), anim: "idle" as TrickAnim };
}
export function densepinephelusPose(t: number) {
  const u = Math.max(0, Math.min(1, t / HAPPY_DUR.densepinephelus));
  if (u < 0.14) {
    const s = u / 0.14;
    return { lift: s * 0.0038, rot: s * -0.19, anim: "play" as TrickAnim };
  }
  if (u < 0.86) {
    const hush = Math.sin(((u - 0.14) / 0.72) * Math.PI * 1.8);
    return { lift: 0.0038 + Math.abs(hush) * 0.0011, rot: -0.19 + hush * 0.14, anim: "play" as TrickAnim };
  }
  const s = (u - 0.86) / 0.14;
  return { lift: 0.0038 * (1 - s), rot: -0.19 * (1 - s), anim: "idle" as TrickAnim };
}

export function stepHappy(happy: GrouperHappy | null | undefined, dt: number, flags?: TrickFlags) {
  if (!happy || happy.phase === "done") return happy;
  if (happyShouldAbort(flags)) {
    return Object.assign({}, happy, { phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true });
  }
  const next = Object.assign({}, happy, { t: happy.t + Math.max(0, dt) });
  const hold = HAPPY_DUR[next.kind];
  if (next.kind === "densgrouper") {
    const pose = densgrouperPose(next.t);
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "inkgrouper") {
    const pose = inkgrouperPose(next.t);
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else {
    const pose = densepinephelusPose(next.t);
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

export function beginTrick(kind: GrouperTrickKind | string, x: number, facing?: 1 | -1): GrouperTrick {
  const k = (TRICKS.indexOf(kind as GrouperTrickKind) >= 0 ? kind : "longepinephelushush") as GrouperTrickKind;
  const anim =
    k === "longepinephelushush"
      ? "sit"
      : k === "gulargulpinhale"
        ? "play"
        : k === "slowcaudalhover"
          ? "sit"
          : k === "colorpatternflush"
            ? "sit"
            : k === "cavernambushsettle"
              ? "sit"
              : "sit";
  return {
    kind: k,
    phase: k === "longepinephelushush" ? "hold" : "go",
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

export function longepinephelushushPose(t: number) {
  const breath = Math.sin(t * 0.00029) + 0.00012 * Math.sin(t * 0.00097);
  const hush = Math.abs(Math.sin(t * 0.00019));
  return { lift: -0.00013 + hush * 0.00011, rot: 0.0007 + breath * 0.0016 };
}

export function releasePose(t: number) {
  const u = Math.max(0, Math.min(1, t / RELEASE_S));
  return { lift: -0.00013 * (1 - Math.sin(u * Math.PI * 0.5)), rot: 0.0024 * (1 - u) };
}

export function gulargulpinhalePose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.gulargulpinhale));
  const face = facing == null ? 1 : facing;
  if (u < 0.18) {
    const s = smoothstep(u / 0.18);
    return { x: fromX + face * s * 0.00005, lift: s * -0.0064, rot: s * 0.11 * face, anim: "play" as TrickAnim };
  }
  if (u < 0.72) {
    const gulp = Math.sin(((u - 0.18) / 0.54) * Math.PI * 2.7);
    return {
      x: fromX + face * (0.00005 + gulp * 0.000035),
      lift: -0.0064 + Math.abs(gulp) * 0.0021,
      rot: (0.11 + gulp * 0.1) * face,
      anim: "play" as TrickAnim,
    };
  }
  const s = smoothstep((u - 0.72) / 0.28);
  return { x: fromX + face * 0.00005 * (1 - s), lift: -0.0064 * (1 - s), rot: 0.11 * (1 - s) * face, anim: "idle" as TrickAnim };
}
export function slowcaudalhoverPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.slowcaudalhover));
  const face = facing == null ? 1 : facing;
  if (u < 0.16) {
    const s = smoothstep(u / 0.16);
    return { x: fromX + face * s * 0.00009, lift: s * 0.0048, rot: s * -0.06 * face, anim: "sit" as TrickAnim };
  }
  if (u < 0.84) {
    const drift = Math.sin(((u - 0.16) / 0.68) * Math.PI * 1.9);
    return {
      x: fromX + face * (0.00009 + drift * 0.00018),
      lift: 0.0048 + Math.abs(drift) * 0.0016,
      rot: (-0.06 + drift * 0.09) * face,
      anim: "sit" as TrickAnim,
    };
  }
  const s = smoothstep((u - 0.84) / 0.16);
  return { x: fromX + face * 0.00009 * (1 - s), lift: 0.0048 * (1 - s), rot: -0.06 * (1 - s) * face, anim: "idle" as TrickAnim };
}
export function cavernambushsettlePose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.cavernambushsettle));
  const face = facing == null ? 1 : facing;
  if (u < 0.22) {
    const s = smoothstep(u / 0.22);
    return { x: fromX + face * s * -0.00004, lift: s * -0.0082, rot: s * 0.06 * face, anim: "sit" as TrickAnim };
  }
  if (u < 0.78) {
    const settle = Math.sin(((u - 0.22) / 0.56) * Math.PI * 1.4);
    return {
      x: fromX + face * (-0.00004 + settle * 0.00003),
      lift: -0.0082 + Math.abs(settle) * 0.0007,
      rot: (0.06 + settle * 0.04) * face,
      anim: "sit" as TrickAnim,
    };
  }
  const s = smoothstep((u - 0.78) / 0.22);
  return { x: fromX + face * -0.00004 * (1 - s), lift: -0.0082 * (1 - s), rot: 0.06 * (1 - s) * face, anim: "idle" as TrickAnim };
}
export function colorpatternflushPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.colorpatternflush));
  const face = facing == null ? 1 : facing;
  if (u < 0.2) {
    const s = smoothstep(u / 0.2);
    return { x: fromX + face * s * 0.00003, lift: s * 0.0036, rot: s * 0.22 * face, anim: "sit" as TrickAnim };
  }
  if (u < 0.8) {
    const flush = Math.sin(((u - 0.2) / 0.6) * Math.PI * 2.4);
    return {
      x: fromX + face * (0.00003 + flush * 0.00008),
      lift: 0.0036 + Math.abs(flush) * 0.0028,
      rot: (0.22 + flush * 0.28) * face,
      anim: "sit" as TrickAnim,
    };
  }
  const s = smoothstep((u - 0.8) / 0.2);
  return { x: fromX + face * 0.00003 * (1 - s), lift: 0.0036 * (1 - s), rot: 0.22 * (1 - s) * face, anim: "idle" as TrickAnim };
}

export function stepTrick(trick: GrouperTrick | null | undefined, dt: number, flags?: TrickFlags) {
  if (!trick || trick.phase === "done") return trick;
  if (shouldAbort(flags) && trick.kind !== "gulargulpinhale" && trick.kind !== "slowcaudalhover" && trick.kind !== "cavernambushsettle" && trick.kind !== "colorpatternflush") {
    return Object.assign({}, trick, { phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true });
  }
  const next = Object.assign({}, trick, { t: trick.t + Math.max(0, dt) });
  if (next.kind === "longepinephelushush") {
    if (next.t < LONGEPINEPHELUSHUSH_HOLD) {
      const pose = longepinephelushushPose(next.t);
      next.phase = "hold";
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = "sit";
      return next;
    }
    if (next.t < LONGEPINEPHELUSHUSH_HOLD + RELEASE_S) {
      const pose = releasePose(next.t - LONGEPINEPHELUSHUSH_HOLD);
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
  if (next.kind === "gulargulpinhale") {
    const pose = gulargulpinhalePose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "slowcaudalhover") {
    const pose = slowcaudalhoverPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "cavernambushsettle") {
    const pose = cavernambushsettlePose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else {
    const pose = colorpatternflushPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  }
  if (u >= 1) return Object.assign({}, next, { phase: "done", lift: 0, rot: 0, anim: "idle" });
  return next;
}

