/** Spin ground tricks while idle. House neighborly Chlamydomonas (chlamydomonas / Spin) desk life -- flagella spin / cup chloroplast / eyespot glance / wet-plate swim / long spin hush; NOT Hold kelp; NOT Pane; NOT Orb; NOT Spot; NOT Reach; NOT Boot; NOT Gauss; NOT Ion; NOT Spark; NOT Stentor; NOT Relay; NOT Fuse; NOT Rui; guest slug Spin / key chlamydomonas -- accept chlamydomonas and spin; Thank-yous densspin / inkspin / denschlamydomonas. Sleep, hide, leave, rest, card, ribbon still win. Same map as desktop chlamydomonas-tricks.js. Next: Bell / stentor. Catalog 209. */
export const TRICK_KEY = "chlamydomonas";
export const TRICKS = ["flagellaspin", "cupchloroplast", "eyespotglance", "wetplateswim", "longspinhush"] as const;
export const HAPPY = ["densspin", "inkspin", "denschlamydomonas"] as const;
export const HAPPY_DUR = { densspin: 3.56, inkspin: 3.24, denschlamydomonas: 3.41 } as const;
export const LONGSPINHUSH_HOLD = 39.02;
export const RELEASE_S = 2.8;
export const DUR = { longspinhush: LONGSPINHUSH_HOLD + RELEASE_S, flagellaspin: 7.15, cupchloroplast: 6.57, eyespotglance: 6.32, wetplateswim: 6.45 } as const;

export type ChlamydomonasTrickKind = (typeof TRICKS)[number];
export type ChlamydomonasHappyKind = (typeof HAPPY)[number];
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

export type ChlamydomonasTrick = {
kind: ChlamydomonasTrickKind;
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

export type ChlamydomonasHappy = {
kind: ChlamydomonasHappyKind;
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

export function nextTrickWait(justFinished: boolean, rand?: number, kind?: ChlamydomonasTrickKind | string) {
  const roll = rand == null ? Math.random() : rand;
  if (kind === "longspinhush") return 247 + roll * 47;
  if (kind === "cupchloroplast") return 31.8 + roll * 4.3;
  if (kind === "wetplateswim") return 29.7 + roll * 4.0;
  if (kind === "flagellaspin") return 30.6 + roll * 4.2;
  if (kind === "eyespotglance") return 28.9 + roll * 4.1;
  return justFinished ? 23.1 + roll * 4.2 : 18.2 + roll * 3.7;
}

export function pickTrick(rand?: number, musicOn?: boolean, lastKind?: ChlamydomonasTrickKind | string | null) {
  if (musicOn) return "longspinhush";
  const roll = rand == null ? Math.random() : rand;
  if (lastKind === "longspinhush") {
    if (roll < 0.26) return "cupchloroplast";
    if (roll < 0.62) return "wetplateswim";
    if (roll < 0.79) return "flagellaspin";
    return "eyespotglance";
  }
  if (lastKind === "cupchloroplast") {
    if (roll < 0.26) return "longspinhush";
    if (roll < 0.5) return "wetplateswim";
    if (roll < 0.74) return "flagellaspin";
    return "eyespotglance";
  }
  if (lastKind === "wetplateswim") {
    if (roll < 0.22) return "longspinhush";
    if (roll < 0.44) return "cupchloroplast";
    if (roll < 0.74) return "flagellaspin";
    return "eyespotglance";
  }
  if (roll < 0.2) return "longspinhush";
  if (roll < 0.4) return "cupchloroplast";
  if (roll < 0.6) return "wetplateswim";
  if (roll < 0.8) return "flagellaspin";
  return "eyespotglance";
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
  return key === TRICK_KEY || key === "spin";
}

export function startThankYou(key: string | undefined, lastKind: ChlamydomonasHappyKind | string | null | undefined, x: number, facing?: 1 | -1, flags?: TrickFlags) {
  if (!wantsThankYou(key)) return null;
  if (!happyCanStart(flags || { cmd: "idle" })) return null;
  const pick = pickHappy(lastKind);
  return { happy: beginHappy(pick, x, facing), kind: pick };
}

export function pickHappy(lastKind?: ChlamydomonasHappyKind | string | null, rand?: number) {
  const pool = HAPPY.filter((k) => k !== lastKind);
  const list = pool.length ? pool : HAPPY.slice();
  const roll = rand == null ? Math.random() : rand;
  return list[Math.floor(roll * list.length)] || list[0];
}

export function beginHappy(kind: ChlamydomonasHappyKind | string, x: number, facing?: 1 | -1): ChlamydomonasHappy {
  const name = (HAPPY.indexOf(kind as ChlamydomonasHappyKind) >= 0 ? kind : "densspin") as ChlamydomonasHappyKind;
  return {
    kind: name,
    happy: true,
    phase: "go",
    t: 0,
    x: x,
    lift: 0,
    rot: 0,
    anim: name === "densspin" ? "sit" : name === "inkspin" ? "play" : "play",
    facing: (facing == null ? 1 : facing) as 1 | -1,
    fromX: x,
  };
}

export function densspinPose(t: number) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.densspin));
    if (u < 0.11) {
      const s = u / 0.11;
      return { lift: s * 0.005, rot: s * -0.38, anim: "sit" as TrickAnim };
    }
    if (u < 0.5) {
      const sway = Math.sin(((u - 0.11) / 0.39) * Math.PI * 3.25);
      const haze = Math.sin(((u - 0.11) / 0.39) * Math.PI * 6.1);
      return { lift: 0.005 + Math.abs(sway) * 0.0016 + Math.abs(haze) * 0.00055, rot: -0.32 + sway * 0.23 + haze * 0.055, anim: "sit" as TrickAnim };
    }
    if (u < 0.86) {
      const sway = Math.sin(((u - 0.5) / 0.36) * Math.PI * 2.5);
      return { lift: 0.005 + Math.abs(sway) * 0.0013, rot: -0.27 + sway * 0.17, anim: "sit" as TrickAnim };
    }
    const s = (u - 0.86) / 0.14;
    return { lift: 0.005 * (1 - s), rot: -0.27 * (1 - s), anim: "idle" as TrickAnim };
  }
export function inkspinPose(t: number) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.inkspin));
    if (u < 0.1) {
      const s = u / 0.1;
      return { lift: s * 0.0063, rot: s * 0.47, anim: "play" as TrickAnim };
    }
    if (u < 0.49) {
      const bob = Math.sin(((u - 0.1) / 0.39) * Math.PI * 3.45);
      const ion = Math.sin(((u - 0.1) / 0.39) * Math.PI * 6.6);
      return { lift: 0.0059 + Math.abs(bob) * 0.002 + Math.abs(ion) * 0.00065, rot: 0.4 + bob * 0.22 + ion * 0.05, anim: "play" as TrickAnim };
    }
    if (u < 0.86) {
      const bob = Math.sin(((u - 0.49) / 0.37) * Math.PI * 2.55);
      return { lift: 0.0059 + Math.abs(bob) * 0.0015, rot: 0.35 + bob * 0.16, anim: "play" as TrickAnim };
    }
    const s = (u - 0.86) / 0.14;
    return { lift: 0.0059 * (1 - s), rot: 0.35 * (1 - s), anim: "idle" as TrickAnim };
  }
export function denschlamydomonasPose(t: number) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.denschlamydomonas));
    if (u < 0.12) {
      const s = u / 0.12;
      return { lift: s * 0.0043, rot: s * -0.285, anim: "play" as TrickAnim };
    }
    if (u < 0.53) {
      const hush = Math.sin(((u - 0.12) / 0.41) * Math.PI * 2.55);
      const haze = Math.sin(((u - 0.12) / 0.41) * Math.PI * 5.2);
      return { lift: 0.0043 + Math.abs(hush) * 0.0014 + Math.abs(haze) * 0.0005, rot: -0.24 + hush * 0.17 + haze * 0.05, anim: "play" as TrickAnim };
    }
    if (u < 0.86) {
      const hush = Math.sin(((u - 0.53) / 0.33) * Math.PI * 1.85);
      return { lift: 0.0043 + Math.abs(hush) * 0.0011, rot: -0.2 + hush * 0.13, anim: "play" as TrickAnim };
    }
    const s = (u - 0.86) / 0.14;
    return { lift: 0.0043 * (1 - s), rot: -0.2 * (1 - s), anim: "idle" as TrickAnim };
  }

export function stepHappy(happy: ChlamydomonasHappy | null | undefined, dt: number, flags?: TrickFlags) {
  if (!happy || happy.phase === "done") return happy;
  if (happyShouldAbort(flags)) {
    return Object.assign({}, happy, { phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true });
  }
  const next = Object.assign({}, happy, { t: happy.t + Math.max(0, dt) });
  const hold = HAPPY_DUR[next.kind];
  if (next.kind === "densspin") {
    const pose = densspinPose(next.t);
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "inkspin") {
    const pose = inkspinPose(next.t);
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else {
    const pose = denschlamydomonasPose(next.t);
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

export function beginTrick(kind: ChlamydomonasTrickKind | string, x: number, facing?: 1 | -1): ChlamydomonasTrick {
  const k = (TRICKS as readonly string[]).includes(kind) ? (kind as ChlamydomonasTrickKind) : "longspinhush";
  const anim: TrickAnim =
    k === "longspinhush"
      ? "sit"
      : k === "cupchloroplast"
        ? "sit"
        : k === "wetplateswim"
          ? "sit"
          : k === "eyespotglance"
            ? "play"
            : k === "flagellaspin"
              ? "walk"
              : "sit";
  return {
    kind: k,
    phase: k === "longspinhush" ? "hold" : "go",
    t: 0,
    x,
    lift: 0,
    rot: 0,
    anim,
    facing: facing == null ? 1 : facing,
    fromX: x,
  };
}

export function smoothstep(t: number) {
  const x = Math.max(0, Math.min(1, t));
  return x * x * (3 - 2 * x);
}

export function longspinhushPose(t: number) {
  const breath = Math.sin(t * 0.00028) + 0.00020 * Math.sin(t * 0.00097);
  const charge = Math.abs(Math.sin(t * 0.00017));
  return { lift: -0.00013 + charge * 0.00015, rot: 0.0011 + breath * 0.0030 };
}

export function releasePose(t: number) {
  const u = Math.max(0, Math.min(1, t / RELEASE_S));
  return { lift: -0.00013 * (1 - Math.sin(u * Math.PI * 0.5)), rot: 0.0031 * (1 - u) };
}

export function cupchloroplastPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.cupchloroplast));
  const face = facing == null ? 1 : facing;
  if (u < 0.14) {
    const s = smoothstep(u / 0.14);
    return { x: fromX + face * s * 0.00055, lift: s * 0.0030, rot: s * 0.09 * face, anim: "walk" as TrickAnim };
  }
  if (u < 0.8) {
    const wire = Math.sin(((u - 0.14) / 0.66) * Math.PI * 4.1);
    const skim = Math.sin(((u - 0.14) / 0.66) * Math.PI * 2.3);
    return {
      x: fromX + face * (0.00055 + (u - 0.14) / 0.66 * 0.0014 + wire * 0.00008),
      lift: 0.0027 + Math.abs(skim) * 0.0021 + Math.abs(wire) * 0.0007,
      rot: (0.09 + skim * 0.13 + wire * 0.05) * face,
      anim: "walk" as TrickAnim,
    };
  }
  const s = smoothstep((u - 0.8) / 0.2);
  return { x: fromX + face * (0.00195 * (1 - s) + 0.00055 * s), lift: 0.0026 * (1 - s), rot: 0.09 * (1 - s) * face, anim: "idle" as TrickAnim };
}
export function wetplateswimPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.wetplateswim));
  const face = facing == null ? 1 : facing;
  if (u < 0.12) {
    const s = smoothstep(u / 0.12);
    return { x: fromX + face * s * -0.00004, lift: s * 0.0018, rot: s * -0.13 * face, anim: "play" as TrickAnim };
  }
  if (u < 0.42) {
    const s = smoothstep((u - 0.12) / 0.3);
    return { x: fromX + face * (-0.00004 + s * 0.00020), lift: 0.0018 + s * 0.0115, rot: (-0.13 + s * 0.34) * face, anim: "play" as TrickAnim };
  }
  if (u < 0.79) {
    const crack = Math.sin(((u - 0.42) / 0.36) * Math.PI * 5.6);
    return {
      x: fromX + face * (0.00014 + crack * 0.00005),
      lift: 0.0133 - ((u - 0.42) / 0.36) * 0.0084 + Math.abs(crack) * 0.0016,
      rot: (0.22 + crack * 0.19) * face,
      anim: "play" as TrickAnim,
    };
  }
  const s = smoothstep((u - 0.79) / 0.22);
  return { x: fromX + face * 0.00014 * (1 - s), lift: 0.0049 * (1 - s), rot: 0.22 * (1 - s) * face, anim: "idle" as TrickAnim };
}
export function flagellaspinPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.flagellaspin));
  const face = facing == null ? 1 : facing;
  if (u < 0.16) {
    const s = smoothstep(u / 0.16);
    return { x: fromX + face * s * -0.00011, lift: s * -0.0056, rot: s * 0.36 * face, anim: "play" as TrickAnim };
  }
  if (u < 0.79) {
    const coil = Math.sin(((u - 0.16) / 0.62) * Math.PI * 3.3);
    const charge = Math.sin(((u - 0.16) / 0.62) * Math.PI * 6.9);
    return {
      x: fromX + face * (-0.00011 + coil * 0.00007),
      lift: -0.0056 + Math.abs(coil) * 0.0030 + Math.abs(charge) * 0.0019,
      rot: (0.36 + coil * 0.41 + charge * 0.14) * face,
      anim: "play" as TrickAnim,
    };
  }
  const s = smoothstep((u - 0.79) / 0.22);
  return { x: fromX + face * -0.00011 * (1 - s), lift: -0.0056 * (1 - s), rot: 0.36 * (1 - s) * face, anim: "idle" as TrickAnim };
}
export function eyespotglancePose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.eyespotglance));
  const face = facing == null ? 1 : facing;
  if (u < 0.18) {
    const s = smoothstep(u / 0.18);
    return { x: fromX + face * s * 0.00003, lift: s * 0.0042, rot: s * 0.11 * face, anim: "sit" as TrickAnim };
  }
  if (u < 0.84) {
    const fringe = Math.sin(((u - 0.18) / 0.66) * Math.PI * 9.0);
    const crackle = Math.sin(((u - 0.18) / 0.66) * Math.PI * 4.0);
    return {
      x: fromX + face * (0.00003 + fringe * 0.00004),
      lift: 0.0041 + Math.abs(crackle) * 0.0022 + Math.abs(fringe) * 0.0011,
      rot: (0.11 + fringe * 0.22 + crackle * 0.09) * face,
      anim: "sit" as TrickAnim,
    };
  }
  const s = smoothstep((u - 0.84) / 0.16);
  return { x: fromX + face * 0.00003 * (1 - s), lift: 0.0037 * (1 - s), rot: 0.11 * (1 - s) * face, anim: "idle" as TrickAnim };
}

export function stepTrick(trick: ChlamydomonasTrick | null | undefined, dt: number, flags?: TrickFlags) {
  if (!trick || trick.phase === "done") return trick;
  if (shouldAbort(flags) && trick.kind !== "cupchloroplast" && trick.kind !== "wetplateswim" && trick.kind !== "flagellaspin" && trick.kind !== "eyespotglance") {
    return Object.assign({}, trick, { phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true });
  }
  const next = Object.assign({}, trick, { t: trick.t + Math.max(0, dt) });
  if (next.kind === "longspinhush") {
    if (next.t < LONGSPINHUSH_HOLD) {
      const pose = longspinhushPose(next.t);
      next.phase = "hold";
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = "sit";
      return next;
    }
    if (next.t < LONGSPINHUSH_HOLD + RELEASE_S) {
      const pose = releasePose(next.t - LONGSPINHUSH_HOLD);
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
  if (next.kind === "cupchloroplast") {
    const pose = cupchloroplastPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "wetplateswim") {
    const pose = wetplateswimPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "flagellaspin") {
    const pose = flagellaspinPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else {
    const pose = eyespotglancePose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  }
  if (u >= 1) return Object.assign({}, next, { phase: "done", lift: 0, rot: 0, anim: "idle" });
  return next;
}

