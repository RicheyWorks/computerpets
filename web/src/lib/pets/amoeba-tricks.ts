/** Reach ground tricks while idle. House neighborly Proteus Amoeba (amoeba / Reach) desk life -- pseudopod reach / ectoplasm crawl / food-vacuole / nucleus-drift / long reach hush; NOT Boot paramecium; NOT Gauss; NOT Ion; NOT Spark; NOT Flux; NOT Trace; NOT Volt; NOT Arc; NOT Euglena; NOT Relay; NOT Fuse; NOT Rui; guest slug Reach / key amoeba -- accept amoeba and reach; Thank-yous densreach / inkreach / densamoeba. Sleep, hide, leave, rest, card, ribbon still win. Same map as desktop amoeba-tricks.js. Next: Spot / euglena. Catalog 214. */
export const TRICK_KEY = "amoeba";
export const TRICKS = ["pseudopodreach", "ectoplasmcrawl", "foodvacuole", "nucleusdrift", "longreachhush"] as const;
export const HAPPY = ["densreach", "inkreach", "densamoeba"] as const;
export const HAPPY_DUR = { densreach: 3.41, inkreach: 3.09, densamoeba: 3.26 } as const;
export const LONGREACHHUSH_HOLD = 38.12;
export const RELEASE_S = 2.8;
export const DUR = { longreachhush: LONGREACHHUSH_HOLD + RELEASE_S, pseudopodreach: 6.84, ectoplasmcrawl: 6.27, foodvacuole: 6.02, nucleusdrift: 6.15 } as const;

export type AmoebaTrickKind = (typeof TRICKS)[number];
export type AmoebaHappyKind = (typeof HAPPY)[number];
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

export type AmoebaTrick = {
kind: AmoebaTrickKind;
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

export type AmoebaHappy = {
kind: AmoebaHappyKind;
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

export function nextTrickWait(justFinished: boolean, rand?: number, kind?: AmoebaTrickKind | string) {
  const roll = rand == null ? Math.random() : rand;
  if (kind === "longreachhush") return 237 + roll * 42;
  if (kind === "ectoplasmcrawl") return 30.3 + roll * 3.8;
  if (kind === "nucleusdrift") return 28.2 + roll * 3.5;
  if (kind === "pseudopodreach") return 29.1 + roll * 3.7;
  if (kind === "foodvacuole") return 27.4 + roll * 3.6;
  return justFinished ? 21.6 + roll * 3.7 : 16.7 + roll * 3.2;
}

export function pickTrick(rand?: number, musicOn?: boolean, lastKind?: AmoebaTrickKind | string | null) {
  if (musicOn) return "longreachhush";
  const roll = rand == null ? Math.random() : rand;
  if (lastKind === "longreachhush") {
    if (roll < 0.26) return "ectoplasmcrawl";
    if (roll < 0.60) return "nucleusdrift";
    if (roll < 0.78) return "pseudopodreach";
    return "foodvacuole";
  }
  if (lastKind === "ectoplasmcrawl") {
    if (roll < 0.26) return "longreachhush";
    if (roll < 0.5) return "nucleusdrift";
    if (roll < 0.74) return "pseudopodreach";
    return "foodvacuole";
  }
  if (lastKind === "nucleusdrift") {
    if (roll < 0.22) return "longreachhush";
    if (roll < 0.44) return "ectoplasmcrawl";
    if (roll < 0.74) return "pseudopodreach";
    return "foodvacuole";
  }
  if (roll < 0.2) return "longreachhush";
  if (roll < 0.4) return "ectoplasmcrawl";
  if (roll < 0.6) return "nucleusdrift";
  if (roll < 0.8) return "pseudopodreach";
  return "foodvacuole";
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
  return key === TRICK_KEY || key === "reach";
}

export function startThankYou(key: string | undefined, lastKind: AmoebaHappyKind | string | null | undefined, x: number, facing?: 1 | -1, flags?: TrickFlags) {
  if (!wantsThankYou(key)) return null;
  if (!happyCanStart(flags || { cmd: "idle" })) return null;
  const pick = pickHappy(lastKind);
  return { happy: beginHappy(pick, x, facing), kind: pick };
}

export function pickHappy(lastKind?: AmoebaHappyKind | string | null, rand?: number) {
  const pool = HAPPY.filter((k) => k !== lastKind);
  const list = pool.length ? pool : HAPPY.slice();
  const roll = rand == null ? Math.random() : rand;
  return list[Math.floor(roll * list.length)] || list[0];
}

export function beginHappy(kind: AmoebaHappyKind | string, x: number, facing?: 1 | -1): AmoebaHappy {
  const name = (HAPPY.indexOf(kind as AmoebaHappyKind) >= 0 ? kind : "densreach") as AmoebaHappyKind;
  return {
    kind: name,
    happy: true,
    phase: "go",
    t: 0,
    x: x,
    lift: 0,
    rot: 0,
    anim: name === "densreach" ? "sit" : name === "inkreach" ? "play" : "play",
    facing: (facing == null ? 1 : facing) as 1 | -1,
    fromX: x,
  };
}

export function densreachPose(t: number) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.densreach));
    if (u < 0.11) {
      const s = u / 0.11;
      return { lift: s * 0.005, rot: s * -0.37, anim: "sit" as TrickAnim };
    }
    if (u < 0.5) {
      const sway = Math.sin(((u - 0.11) / 0.39) * Math.PI * 3.15);
      const haze = Math.sin(((u - 0.11) / 0.39) * Math.PI * 5.9);
      return { lift: 0.005 + Math.abs(sway) * 0.0016 + Math.abs(haze) * 0.00055, rot: -0.32 + sway * 0.23 + haze * 0.055, anim: "sit" as TrickAnim };
    }
    if (u < 0.86) {
      const sway = Math.sin(((u - 0.5) / 0.36) * Math.PI * 2.4);
      return { lift: 0.005 + Math.abs(sway) * 0.0013, rot: -0.27 + sway * 0.17, anim: "sit" as TrickAnim };
    }
    const s = (u - 0.86) / 0.14;
    return { lift: 0.005 * (1 - s), rot: -0.27 * (1 - s), anim: "idle" as TrickAnim };
  }
export function inkreachPose(t: number) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.inkreach));
    if (u < 0.1) {
      const s = u / 0.1;
      return { lift: s * 0.0061, rot: s * 0.46, anim: "play" as TrickAnim };
    }
    if (u < 0.49) {
      const bob = Math.sin(((u - 0.1) / 0.39) * Math.PI * 3.35);
      const ion = Math.sin(((u - 0.1) / 0.39) * Math.PI * 6.4);
      return { lift: 0.0059 + Math.abs(bob) * 0.002 + Math.abs(ion) * 0.00065, rot: 0.4 + bob * 0.22 + ion * 0.05, anim: "play" as TrickAnim };
    }
    if (u < 0.86) {
      const bob = Math.sin(((u - 0.49) / 0.37) * Math.PI * 2.45);
      return { lift: 0.0059 + Math.abs(bob) * 0.0015, rot: 0.35 + bob * 0.16, anim: "play" as TrickAnim };
    }
    const s = (u - 0.86) / 0.14;
    return { lift: 0.0059 * (1 - s), rot: 0.35 * (1 - s), anim: "idle" as TrickAnim };
  }
export function densamoebaPose(t: number) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.densamoeba));
    if (u < 0.12) {
      const s = u / 0.12;
      return { lift: s * 0.0043, rot: s * -0.275, anim: "play" as TrickAnim };
    }
    if (u < 0.53) {
      const hush = Math.sin(((u - 0.12) / 0.41) * Math.PI * 2.45);
      const haze = Math.sin(((u - 0.12) / 0.41) * Math.PI * 5.0);
      return { lift: 0.0043 + Math.abs(hush) * 0.0014 + Math.abs(haze) * 0.0005, rot: -0.24 + hush * 0.17 + haze * 0.05, anim: "play" as TrickAnim };
    }
    if (u < 0.86) {
      const hush = Math.sin(((u - 0.53) / 0.33) * Math.PI * 1.85);
      return { lift: 0.0043 + Math.abs(hush) * 0.0011, rot: -0.2 + hush * 0.13, anim: "play" as TrickAnim };
    }
    const s = (u - 0.86) / 0.14;
    return { lift: 0.0043 * (1 - s), rot: -0.2 * (1 - s), anim: "idle" as TrickAnim };
  }

export function stepHappy(happy: AmoebaHappy | null | undefined, dt: number, flags?: TrickFlags) {
  if (!happy || happy.phase === "done") return happy;
  if (happyShouldAbort(flags)) {
    return Object.assign({}, happy, { phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true });
  }
  const next = Object.assign({}, happy, { t: happy.t + Math.max(0, dt) });
  const hold = HAPPY_DUR[next.kind];
  if (next.kind === "densreach") {
    const pose = densreachPose(next.t);
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "inkreach") {
    const pose = inkreachPose(next.t);
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else {
    const pose = densamoebaPose(next.t);
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

export function beginTrick(kind: AmoebaTrickKind | string, x: number, facing?: 1 | -1): AmoebaTrick {
  const k = (TRICKS as readonly string[]).includes(kind) ? (kind as AmoebaTrickKind) : "longreachhush";
  const anim: TrickAnim =
    k === "longreachhush"
      ? "sit"
      : k === "ectoplasmcrawl"
        ? "sit"
        : k === "nucleusdrift"
          ? "sit"
          : k === "foodvacuole"
            ? "play"
            : k === "pseudopodreach"
              ? "walk"
              : "sit";
  return {
    kind: k,
    phase: k === "longreachhush" ? "hold" : "go",
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

export function longreachhushPose(t: number) {
  const breath = Math.sin(t * 0.00028) + 0.00021 * Math.sin(t * 0.00097);
  const charge = Math.abs(Math.sin(t * 0.00017));
  return { lift: -0.00013 + charge * 0.00015, rot: 0.0011 + breath * 0.0028 };
}

export function releasePose(t: number) {
  const u = Math.max(0, Math.min(1, t / RELEASE_S));
  return { lift: -0.00013 * (1 - Math.sin(u * Math.PI * 0.5)), rot: 0.0031 * (1 - u) };
}

export function ectoplasmcrawlPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.ectoplasmcrawl));
  const face = facing == null ? 1 : facing;
  if (u < 0.14) {
    const s = smoothstep(u / 0.14);
    return { x: fromX + face * s * 0.00055, lift: s * 0.0029, rot: s * 0.09 * face, anim: "walk" as TrickAnim };
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
export function nucleusdriftPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.nucleusdrift));
  const face = facing == null ? 1 : facing;
  if (u < 0.12) {
    const s = smoothstep(u / 0.12);
    return { x: fromX + face * s * -0.00004, lift: s * 0.0018, rot: s * -0.12 * face, anim: "play" as TrickAnim };
  }
  if (u < 0.42) {
    const s = smoothstep((u - 0.12) / 0.3);
    return { x: fromX + face * (-0.00004 + s * 0.00019), lift: 0.0018 + s * 0.0115, rot: (-0.12 + s * 0.34) * face, anim: "play" as TrickAnim };
  }
  if (u < 0.78) {
    const crack = Math.sin(((u - 0.42) / 0.36) * Math.PI * 5.6);
    return {
      x: fromX + face * (0.00014 + crack * 0.00005),
      lift: 0.0133 - ((u - 0.42) / 0.36) * 0.0084 + Math.abs(crack) * 0.0016,
      rot: (0.22 + crack * 0.19) * face,
      anim: "play" as TrickAnim,
    };
  }
  const s = smoothstep((u - 0.78) / 0.22);
  return { x: fromX + face * 0.00014 * (1 - s), lift: 0.0049 * (1 - s), rot: 0.22 * (1 - s) * face, anim: "idle" as TrickAnim };
}
export function pseudopodreachPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.pseudopodreach));
  const face = facing == null ? 1 : facing;
  if (u < 0.16) {
    const s = smoothstep(u / 0.16);
    return { x: fromX + face * s * -0.00011, lift: s * -0.0056, rot: s * 0.36 * face, anim: "play" as TrickAnim };
  }
  if (u < 0.78) {
    const coil = Math.sin(((u - 0.16) / 0.62) * Math.PI * 3.3);
    const charge = Math.sin(((u - 0.16) / 0.62) * Math.PI * 6.7);
    return {
      x: fromX + face * (-0.00011 + coil * 0.00007),
      lift: -0.0056 + Math.abs(coil) * 0.0028 + Math.abs(charge) * 0.0019,
      rot: (0.36 + coil * 0.41 + charge * 0.14) * face,
      anim: "play" as TrickAnim,
    };
  }
  const s = smoothstep((u - 0.78) / 0.22);
  return { x: fromX + face * -0.00011 * (1 - s), lift: -0.0056 * (1 - s), rot: 0.36 * (1 - s) * face, anim: "idle" as TrickAnim };
}
export function foodvacuolePose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.foodvacuole));
  const face = facing == null ? 1 : facing;
  if (u < 0.18) {
    const s = smoothstep(u / 0.18);
    return { x: fromX + face * s * 0.00003, lift: s * 0.0040, rot: s * 0.11 * face, anim: "sit" as TrickAnim };
  }
  if (u < 0.84) {
    const fringe = Math.sin(((u - 0.18) / 0.66) * Math.PI * 8.7);
    const crackle = Math.sin(((u - 0.18) / 0.66) * Math.PI * 3.8);
    return {
      x: fromX + face * (0.00003 + fringe * 0.00004),
      lift: 0.0039 + Math.abs(crackle) * 0.0022 + Math.abs(fringe) * 0.0011,
      rot: (0.11 + fringe * 0.22 + crackle * 0.09) * face,
      anim: "sit" as TrickAnim,
    };
  }
  const s = smoothstep((u - 0.84) / 0.16);
  return { x: fromX + face * 0.00003 * (1 - s), lift: 0.0037 * (1 - s), rot: 0.11 * (1 - s) * face, anim: "idle" as TrickAnim };
}

export function stepTrick(trick: AmoebaTrick | null | undefined, dt: number, flags?: TrickFlags) {
  if (!trick || trick.phase === "done") return trick;
  if (shouldAbort(flags) && trick.kind !== "ectoplasmcrawl" && trick.kind !== "nucleusdrift" && trick.kind !== "pseudopodreach" && trick.kind !== "foodvacuole") {
    return Object.assign({}, trick, { phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true });
  }
  const next = Object.assign({}, trick, { t: trick.t + Math.max(0, dt) });
  if (next.kind === "longreachhush") {
    if (next.t < LONGREACHHUSH_HOLD) {
      const pose = longreachhushPose(next.t);
      next.phase = "hold";
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = "sit";
      return next;
    }
    if (next.t < LONGREACHHUSH_HOLD + RELEASE_S) {
      const pose = releasePose(next.t - LONGREACHHUSH_HOLD);
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
  if (next.kind === "ectoplasmcrawl") {
    const pose = ectoplasmcrawlPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "nucleusdrift") {
    const pose = nucleusdriftPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "pseudopodreach") {
    const pose = pseudopodreachPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else {
    const pose = foodvacuolePose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  }
  if (u >= 1) return Object.assign({}, next, { phase: "done", lift: 0, rot: 0, anim: "idle" });
  return next;
}

