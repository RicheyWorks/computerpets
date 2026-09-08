/** Ion ground tricks while idle. House neighborly Haze Dragon (ion_dragon / Ion) desk life -- pale ion-haze cling / outline haze drift / charge-haze claim / mist-perch settle / long ion hush; NOT Spark spark_dragon (esp. not crackpointskitter/snoutcrackpop/clawtipcrackle/tailpointperch/longsparkhush/densspark/inkspark/denssparkdragon); NOT Flux flux_dragon; NOT Trace; NOT Volt; NOT Arc; NOT Firefly; NOT Hide; NOT Soar; NOT Vesper; NOT Relay; NOT Fuse; NOT Rui; guest slug Ion / key ion_dragon -- accept ion_dragon and ion; Thank-yous dension / inkion / densiondragon. Sleep, hide, leave, rest, card, ribbon still win. Same map as desktop ion_dragon-tricks.js. Next: Gauss / gauss_dragon. Catalog 217. */
export const TRICK_KEY = "ion_dragon";
export const TRICKS = ["paleionhazecling", "outlinehazedrift", "chargehazeclaim", "mistperchsettle", "longionhush"] as const;
export const HAPPY = ["dension", "inkion", "densiondragon"] as const;
export const HAPPY_DUR = { dension: 3.29, inkion: 2.97, densiondragon: 3.15 } as const;
export const LONGIONHUSH_HOLD = 37.68;
export const RELEASE_S = 2.74;
export const DUR = { longionhush: LONGIONHUSH_HOLD + RELEASE_S, paleionhazecling: 6.62, outlinehazedrift: 6.08, chargehazeclaim: 5.81, mistperchsettle: 5.94 } as const;

export type IonDragonTrickKind = (typeof TRICKS)[number];
export type IonDragonHappyKind = (typeof HAPPY)[number];
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

export type IonDragonTrick = {
kind: IonDragonTrickKind;
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

export type IonDragonHappy = {
kind: IonDragonHappyKind;
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

export function nextTrickWait(justFinished: boolean, rand?: number, kind?: IonDragonTrickKind | string) {
  const roll = rand == null ? Math.random() : rand;
  if (kind === "longionhush") return 231 + roll * 39;
  if (kind === "outlinehazedrift") return 29.4 + roll * 3.5;
  if (kind === "mistperchsettle") return 27.3 + roll * 3.2;
  if (kind === "paleionhazecling") return 28.2 + roll * 3.4;
  if (kind === "chargehazeclaim") return 26.5 + roll * 3.3;
  return justFinished ? 20.7 + roll * 3.4 : 15.8 + roll * 2.9;
}

export function pickTrick(rand?: number, musicOn?: boolean, lastKind?: IonDragonTrickKind | string | null) {
  if (musicOn) return "longionhush";
  const roll = rand == null ? Math.random() : rand;
  if (lastKind === "longionhush") {
    if (roll < 0.26) return "outlinehazedrift";
    if (roll < 0.5) return "mistperchsettle";
    if (roll < 0.74) return "paleionhazecling";
    return "chargehazeclaim";
  }
  if (lastKind === "outlinehazedrift") {
    if (roll < 0.26) return "longionhush";
    if (roll < 0.5) return "mistperchsettle";
    if (roll < 0.74) return "paleionhazecling";
    return "chargehazeclaim";
  }
  if (lastKind === "mistperchsettle") {
    if (roll < 0.22) return "longionhush";
    if (roll < 0.44) return "outlinehazedrift";
    if (roll < 0.68) return "paleionhazecling";
    return "chargehazeclaim";
  }
  if (roll < 0.2) return "longionhush";
  if (roll < 0.4) return "outlinehazedrift";
  if (roll < 0.6) return "mistperchsettle";
  if (roll < 0.8) return "paleionhazecling";
  return "chargehazeclaim";
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
  return key === TRICK_KEY || key === "ion";
}

export function startThankYou(key: string | undefined, lastKind: IonDragonHappyKind | string | null | undefined, x: number, facing?: 1 | -1, flags?: TrickFlags) {
  if (!wantsThankYou(key)) return null;
  if (!happyCanStart(flags || { cmd: "idle" })) return null;
  const pick = pickHappy(lastKind);
  return { happy: beginHappy(pick, x, facing), kind: pick };
}

export function pickHappy(lastKind?: IonDragonHappyKind | string | null, rand?: number) {
  const pool = HAPPY.filter((k) => k !== lastKind);
  const list = pool.length ? pool : HAPPY.slice();
  const roll = rand == null ? Math.random() : rand;
  return list[Math.floor(roll * list.length)] || list[0];
}

export function beginHappy(kind: IonDragonHappyKind | string, x: number, facing?: 1 | -1): IonDragonHappy {
  const name = (HAPPY.indexOf(kind as IonDragonHappyKind) >= 0 ? kind : "dension") as IonDragonHappyKind;
  return {
    kind: name,
    happy: true,
    phase: "go",
    t: 0,
    x: x,
    lift: 0,
    rot: 0,
    anim: name === "dension" ? "sit" : name === "inkion" ? "play" : "play",
    facing: (facing == null ? 1 : facing) as 1 | -1,
    fromX: x,
  };
}

export function densionPose(t: number) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.dension));
    if (u < 0.11) {
      const s = u / 0.11;
      return { lift: s * 0.005, rot: s * -0.32, anim: "sit" as TrickAnim };
    }
    if (u < 0.5) {
      const sway = Math.sin(((u - 0.11) / 0.39) * Math.PI * 2.7);
      const haze = Math.sin(((u - 0.11) / 0.39) * Math.PI * 4.8);
      return { lift: 0.005 + Math.abs(sway) * 0.0016 + Math.abs(haze) * 0.00055, rot: -0.32 + sway * 0.23 + haze * 0.055, anim: "sit" as TrickAnim };
    }
    if (u < 0.86) {
      const sway = Math.sin(((u - 0.5) / 0.36) * Math.PI * 2.3);
      return { lift: 0.005 + Math.abs(sway) * 0.0013, rot: -0.27 + sway * 0.17, anim: "sit" as TrickAnim };
    }
    const s = (u - 0.86) / 0.14;
    return { lift: 0.005 * (1 - s), rot: -0.27 * (1 - s), anim: "idle" as TrickAnim };
  }
export function inkionPose(t: number) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.inkion));
    if (u < 0.1) {
      const s = u / 0.1;
      return { lift: s * 0.0059, rot: s * 0.4, anim: "play" as TrickAnim };
    }
    if (u < 0.49) {
      const bob = Math.sin(((u - 0.1) / 0.39) * Math.PI * 2.95);
      const ion = Math.sin(((u - 0.1) / 0.39) * Math.PI * 5.6);
      return { lift: 0.0059 + Math.abs(bob) * 0.002 + Math.abs(ion) * 0.00065, rot: 0.4 + bob * 0.22 + ion * 0.05, anim: "play" as TrickAnim };
    }
    if (u < 0.86) {
      const bob = Math.sin(((u - 0.49) / 0.37) * Math.PI * 2.45);
      return { lift: 0.0059 + Math.abs(bob) * 0.0015, rot: 0.35 + bob * 0.16, anim: "play" as TrickAnim };
    }
    const s = (u - 0.86) / 0.14;
    return { lift: 0.0059 * (1 - s), rot: 0.35 * (1 - s), anim: "idle" as TrickAnim };
  }
export function densiondragonPose(t: number) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.densiondragon));
    if (u < 0.12) {
      const s = u / 0.12;
      return { lift: s * 0.0043, rot: s * -0.24, anim: "play" as TrickAnim };
    }
    if (u < 0.53) {
      const hush = Math.sin(((u - 0.12) / 0.41) * Math.PI * 2.15);
      const haze = Math.sin(((u - 0.12) / 0.41) * Math.PI * 4.2);
      return { lift: 0.0043 + Math.abs(hush) * 0.0014 + Math.abs(haze) * 0.0005, rot: -0.24 + hush * 0.17 + haze * 0.05, anim: "play" as TrickAnim };
    }
    if (u < 0.86) {
      const hush = Math.sin(((u - 0.53) / 0.33) * Math.PI * 1.85);
      return { lift: 0.0043 + Math.abs(hush) * 0.0011, rot: -0.2 + hush * 0.13, anim: "play" as TrickAnim };
    }
    const s = (u - 0.86) / 0.14;
    return { lift: 0.0043 * (1 - s), rot: -0.2 * (1 - s), anim: "idle" as TrickAnim };
  }

export function stepHappy(happy: IonDragonHappy | null | undefined, dt: number, flags?: TrickFlags) {
  if (!happy || happy.phase === "done") return happy;
  if (happyShouldAbort(flags)) {
    return Object.assign({}, happy, { phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true });
  }
  const next = Object.assign({}, happy, { t: happy.t + Math.max(0, dt) });
  const hold = HAPPY_DUR[next.kind];
  if (next.kind === "dension") {
    const pose = densionPose(next.t);
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "inkion") {
    const pose = inkionPose(next.t);
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else {
    const pose = densiondragonPose(next.t);
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

export function beginTrick(kind: IonDragonTrickKind | string, x: number, facing?: 1 | -1): IonDragonTrick {
  const k = (TRICKS as readonly string[]).includes(kind) ? (kind as IonDragonTrickKind) : "longionhush";
  const anim: TrickAnim =
    k === "longionhush"
      ? "sit"
      : k === "outlinehazedrift"
        ? "sit"
        : k === "mistperchsettle"
          ? "sit"
          : k === "chargehazeclaim"
            ? "play"
            : k === "paleionhazecling"
              ? "walk"
              : "sit";
  return {
    kind: k,
    phase: k === "longionhush" ? "hold" : "go",
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

export function longionhushPose(t: number) {
  const breath = Math.sin(t * 0.00028) + 0.00016 * Math.sin(t * 0.00097);
  const charge = Math.abs(Math.sin(t * 0.00019));
  return { lift: -0.00013 + charge * 0.00015, rot: 0.0011 + breath * 0.0022 };
}

export function releasePose(t: number) {
  const u = Math.max(0, Math.min(1, t / RELEASE_S));
  return { lift: -0.00013 * (1 - Math.sin(u * Math.PI * 0.5)), rot: 0.0031 * (1 - u) };
}

export function outlinehazedriftPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.outlinehazedrift));
  const face = facing == null ? 1 : facing;
  if (u < 0.14) {
    const s = smoothstep(u / 0.14);
    return { x: fromX + face * s * 0.00055, lift: s * 0.0026, rot: s * 0.09 * face, anim: "walk" as TrickAnim };
  }
  if (u < 0.8) {
    const wire = Math.sin(((u - 0.14) / 0.66) * Math.PI * 4.1);
    const skim = Math.sin(((u - 0.14) / 0.66) * Math.PI * 2.0);
    return {
      x: fromX + face * (0.00055 + (u - 0.14) / 0.66 * 0.0014 + wire * 0.00008),
      lift: 0.0026 + Math.abs(skim) * 0.0021 + Math.abs(wire) * 0.0007,
      rot: (0.09 + skim * 0.13 + wire * 0.05) * face,
      anim: "walk" as TrickAnim,
    };
  }
  const s = smoothstep((u - 0.8) / 0.2);
  return { x: fromX + face * (0.00195 * (1 - s) + 0.00055 * s), lift: 0.0026 * (1 - s), rot: 0.09 * (1 - s) * face, anim: "idle" as TrickAnim };
}
export function mistperchsettlePose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.mistperchsettle));
  const face = facing == null ? 1 : facing;
  if (u < 0.12) {
    const s = smoothstep(u / 0.12);
    return { x: fromX + face * s * -0.00004, lift: s * 0.0018, rot: s * -0.12 * face, anim: "play" as TrickAnim };
  }
  if (u < 0.42) {
    const s = smoothstep((u - 0.12) / 0.3);
    return { x: fromX + face * (-0.00004 + s * 0.00018), lift: 0.0018 + s * 0.0115, rot: (-0.12 + s * 0.34) * face, anim: "play" as TrickAnim };
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
export function paleionhazeclingPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.paleionhazecling));
  const face = facing == null ? 1 : facing;
  if (u < 0.16) {
    const s = smoothstep(u / 0.16);
    return { x: fromX + face * s * -0.00011, lift: s * -0.0056, rot: s * 0.36 * face, anim: "play" as TrickAnim };
  }
  if (u < 0.78) {
    const coil = Math.sin(((u - 0.16) / 0.62) * Math.PI * 3.3);
    const charge = Math.sin(((u - 0.16) / 0.62) * Math.PI * 6.2);
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
export function chargehazeclaimPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.chargehazeclaim));
  const face = facing == null ? 1 : facing;
  if (u < 0.18) {
    const s = smoothstep(u / 0.18);
    return { x: fromX + face * s * 0.00003, lift: s * 0.0037, rot: s * 0.11 * face, anim: "sit" as TrickAnim };
  }
  if (u < 0.84) {
    const fringe = Math.sin(((u - 0.18) / 0.66) * Math.PI * 7.8);
    const crackle = Math.sin(((u - 0.18) / 0.66) * Math.PI * 3.1);
    return {
      x: fromX + face * (0.00003 + fringe * 0.00004),
      lift: 0.0037 + Math.abs(crackle) * 0.0022 + Math.abs(fringe) * 0.0011,
      rot: (0.11 + fringe * 0.22 + crackle * 0.09) * face,
      anim: "sit" as TrickAnim,
    };
  }
  const s = smoothstep((u - 0.84) / 0.16);
  return { x: fromX + face * 0.00003 * (1 - s), lift: 0.0037 * (1 - s), rot: 0.11 * (1 - s) * face, anim: "idle" as TrickAnim };
}

export function stepTrick(trick: IonDragonTrick | null | undefined, dt: number, flags?: TrickFlags) {
  if (!trick || trick.phase === "done") return trick;
  if (shouldAbort(flags) && trick.kind !== "outlinehazedrift" && trick.kind !== "mistperchsettle" && trick.kind !== "paleionhazecling" && trick.kind !== "chargehazeclaim") {
    return Object.assign({}, trick, { phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true });
  }
  const next = Object.assign({}, trick, { t: trick.t + Math.max(0, dt) });
  if (next.kind === "longionhush") {
    if (next.t < LONGIONHUSH_HOLD) {
      const pose = longionhushPose(next.t);
      next.phase = "hold";
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = "sit";
      return next;
    }
    if (next.t < LONGIONHUSH_HOLD + RELEASE_S) {
      const pose = releasePose(next.t - LONGIONHUSH_HOLD);
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
  if (next.kind === "outlinehazedrift") {
    const pose = outlinehazedriftPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "mistperchsettle") {
    const pose = mistperchsettlePose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "paleionhazecling") {
    const pose = paleionhazeclingPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else {
    const pose = chargehazeclaimPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  }
  if (u >= 1) return Object.assign({}, next, { phase: "done", lift: 0, rot: 0, anim: "idle" });
  return next;
}

