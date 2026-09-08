/** Trace ground tricks while idle. House neighborly Path Dragon (trace_dragon / Trace) desk life -- outline-trace path walk / dashed-line flicker / corner snap turn / breadcrumb perch / long trace hush; NOT Volt volt_dragon (esp. not coiledgecharge/windowwireskim/staticfringecrackle/sparkhop/longvolthush/densvolt/inkvolt/densvoltdragon); NOT Arc cyber_dragon (esp. not arcsparkcoil/circuitridgewalk/databreathshimmer/perchscanblink/longcyberhush/densarc/inkarc/denscyber); NOT Hide grouper; NOT Soar eagle ray; NOT Vesper dragon (sprawl/guard/smolder/claim/fold); NOT Relay; NOT Fuse; NOT Rui; guest slug Trace / key trace_dragon -- accept trace_dragon and trace; Thank-yous denstrace / inktrace / denstracedragon. Sleep, hide, leave, rest, card, ribbon still win. Same map as desktop trace_dragon-tricks.js. Next: Flux / flux_dragon. Catalog 220. */
export const TRICK_KEY = "trace_dragon";
export const TRICKS = ["outlinetracepathwalk", "dashedlineflicker", "cornersnapturn", "breadcrumbperch", "longtracehush"] as const;
export const HAPPY = ["denstrace", "inktrace", "denstracedragon"] as const;
export const HAPPY_DUR = { denstrace: 3.18, inktrace: 2.86, denstracedragon: 3.04 } as const;
export const LONGTRACEHUSH_HOLD = 37.18;
export const RELEASE_S = 2.64;
export const DUR = { longtracehush: LONGTRACEHUSH_HOLD + RELEASE_S, outlinetracepathwalk: 6.41, dashedlineflicker: 5.84, cornersnapturn: 5.52, breadcrumbperch: 5.71 } as const;

export type TraceDragonTrickKind = (typeof TRICKS)[number];
export type TraceDragonHappyKind = (typeof HAPPY)[number];
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

export type TraceDragonTrick = {
kind: TraceDragonTrickKind;
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

export type TraceDragonHappy = {
kind: TraceDragonHappyKind;
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

export function nextTrickWait(justFinished: boolean, rand?: number, kind?: TraceDragonTrickKind | string) {
  const roll = rand == null ? Math.random() : rand;
  if (kind === "longtracehush") return 224 + roll * 36;
  if (kind === "dashedlineflicker") return 28.2 + roll * 3.5;
  if (kind === "breadcrumbperch") return 26.0 + roll * 3.2;
  if (kind === "outlinetracepathwalk") return 26.8 + roll * 3.4;
  if (kind === "cornersnapturn") return 25.2 + roll * 3.4;
  return justFinished ? 19.6 + roll * 3.4 : 14.8 + roll * 2.9;
}

export function pickTrick(rand?: number, musicOn?: boolean, lastKind?: TraceDragonTrickKind | string | null) {
  if (musicOn) return "longtracehush";
  const roll = rand == null ? Math.random() : rand;
  if (lastKind === "longtracehush") {
    if (roll < 0.26) return "dashedlineflicker";
    if (roll < 0.5) return "breadcrumbperch";
    if (roll < 0.74) return "outlinetracepathwalk";
    return "cornersnapturn";
  }
  if (lastKind === "dashedlineflicker") {
    if (roll < 0.26) return "longtracehush";
    if (roll < 0.5) return "breadcrumbperch";
    if (roll < 0.74) return "outlinetracepathwalk";
    return "cornersnapturn";
  }
  if (lastKind === "breadcrumbperch") {
    if (roll < 0.22) return "longtracehush";
    if (roll < 0.44) return "dashedlineflicker";
    if (roll < 0.68) return "outlinetracepathwalk";
    return "cornersnapturn";
  }
  if (roll < 0.2) return "longtracehush";
  if (roll < 0.4) return "dashedlineflicker";
  if (roll < 0.6) return "breadcrumbperch";
  if (roll < 0.8) return "outlinetracepathwalk";
  return "cornersnapturn";
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
  return key === TRICK_KEY || key === "trace";
}

export function startThankYou(key: string | undefined, lastKind: TraceDragonHappyKind | string | null | undefined, x: number, facing?: 1 | -1, flags?: TrickFlags) {
  if (!wantsThankYou(key)) return null;
  if (!happyCanStart(flags || { cmd: "idle" })) return null;
  const pick = pickHappy(lastKind);
  return { happy: beginHappy(pick, x, facing), kind: pick };
}

export function pickHappy(lastKind?: TraceDragonHappyKind | string | null, rand?: number) {
  const pool = HAPPY.filter((k) => k !== lastKind);
  const list = pool.length ? pool : HAPPY.slice();
  const roll = rand == null ? Math.random() : rand;
  return list[Math.floor(roll * list.length)] || list[0];
}

export function beginHappy(kind: TraceDragonHappyKind | string, x: number, facing?: 1 | -1): TraceDragonHappy {
  const name = (HAPPY.indexOf(kind as TraceDragonHappyKind) >= 0 ? kind : "denstrace") as TraceDragonHappyKind;
  return {
    kind: name,
    happy: true,
    phase: "go",
    t: 0,
    x: x,
    lift: 0,
    rot: 0,
    anim: name === "denstrace" ? "sit" : name === "inktrace" ? "play" : "play",
    facing: (facing == null ? 1 : facing) as 1 | -1,
    fromX: x,
  };
}

export function denstracePose(t: number) {
  const u = Math.max(0, Math.min(1, t / HAPPY_DUR.denstrace));
  if (u < 0.12) {
    const s = u / 0.12;
    return { lift: s * 0.0048, rot: s * -0.31, anim: "sit" as TrickAnim };
  }
  if (u < 0.86) {
    const sway = Math.sin(((u - 0.12) / 0.74) * Math.PI * 2.65);
    return { lift: 0.0048 + Math.abs(sway) * 0.0015, rot: -0.31 + sway * 0.22, anim: "sit" as TrickAnim };
  }
  const s = (u - 0.86) / 0.14;
  return { lift: 0.0048 * (1 - s), rot: -0.31 * (1 - s), anim: "idle" as TrickAnim };
}
export function inktracePose(t: number) {
  const u = Math.max(0, Math.min(1, t / HAPPY_DUR.inktrace));
  if (u < 0.11) {
    const s = u / 0.11;
    return { lift: s * 0.0057, rot: s * 0.38, anim: "play" as TrickAnim };
  }
  if (u < 0.86) {
    const bob = Math.sin(((u - 0.11) / 0.75) * Math.PI * 2.7);
    return { lift: 0.0057 + Math.abs(bob) * 0.0019, rot: 0.38 + bob * 0.21, anim: "play" as TrickAnim };
  }
  const s = (u - 0.86) / 0.14;
  return { lift: 0.0057 * (1 - s), rot: 0.38 * (1 - s), anim: "idle" as TrickAnim };
}
export function denstracedragonPose(t: number) {
  const u = Math.max(0, Math.min(1, t / HAPPY_DUR.denstracedragon));
  if (u < 0.13) {
    const s = u / 0.13;
    return { lift: s * 0.0041, rot: s * -0.23, anim: "play" as TrickAnim };
  }
  if (u < 0.86) {
    const hush = Math.sin(((u - 0.13) / 0.73) * Math.PI * 2.05);
    return { lift: 0.0041 + Math.abs(hush) * 0.0013, rot: -0.23 + hush * 0.16, anim: "play" as TrickAnim };
  }
  const s = (u - 0.86) / 0.14;
  return { lift: 0.0041 * (1 - s), rot: -0.23 * (1 - s), anim: "idle" as TrickAnim };
}

export function stepHappy(happy: TraceDragonHappy | null | undefined, dt: number, flags?: TrickFlags) {
  if (!happy || happy.phase === "done") return happy;
  if (happyShouldAbort(flags)) {
    return Object.assign({}, happy, { phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true });
  }
  const next = Object.assign({}, happy, { t: happy.t + Math.max(0, dt) });
  const hold = HAPPY_DUR[next.kind];
  if (next.kind === "denstrace") {
    const pose = denstracePose(next.t);
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "inktrace") {
    const pose = inktracePose(next.t);
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else {
    const pose = denstracedragonPose(next.t);
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

export function beginTrick(kind: TraceDragonTrickKind | string, x: number, facing?: 1 | -1): TraceDragonTrick {
  const k = (TRICKS as readonly string[]).includes(kind) ? (kind as TraceDragonTrickKind) : "longtracehush";
  const anim: TrickAnim =
    k === "longtracehush"
      ? "sit"
      : k === "dashedlineflicker"
        ? "sit"
        : k === "breadcrumbperch"
          ? "sit"
          : k === "cornersnapturn"
            ? "play"
            : k === "outlinetracepathwalk"
              ? "walk"
              : "sit";
  return {
    kind: k,
    phase: k === "longtracehush" ? "hold" : "go",
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

export function longtracehushPose(t: number) {
  const breath = Math.sin(t * 0.00028) + 0.00016 * Math.sin(t * 0.00097);
  const charge = Math.abs(Math.sin(t * 0.00019));
  return { lift: -0.00013 + charge * 0.00015, rot: 0.0011 + breath * 0.0022 };
}

export function releasePose(t: number) {
  const u = Math.max(0, Math.min(1, t / RELEASE_S));
  return { lift: -0.00013 * (1 - Math.sin(u * Math.PI * 0.5)), rot: 0.0031 * (1 - u) };
}

export function dashedlineflickerPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.dashedlineflicker));
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
export function breadcrumbperchPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.breadcrumbperch));
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
export function outlinetracepathwalkPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.outlinetracepathwalk));
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
export function cornersnapturnPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.cornersnapturn));
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

export function stepTrick(trick: TraceDragonTrick | null | undefined, dt: number, flags?: TrickFlags) {
  if (!trick || trick.phase === "done") return trick;
  if (shouldAbort(flags) && trick.kind !== "dashedlineflicker" && trick.kind !== "breadcrumbperch" && trick.kind !== "outlinetracepathwalk" && trick.kind !== "cornersnapturn") {
    return Object.assign({}, trick, { phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true });
  }
  const next = Object.assign({}, trick, { t: trick.t + Math.max(0, dt) });
  if (next.kind === "longtracehush") {
    if (next.t < LONGTRACEHUSH_HOLD) {
      const pose = longtracehushPose(next.t);
      next.phase = "hold";
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = "sit";
      return next;
    }
    if (next.t < LONGTRACEHUSH_HOLD + RELEASE_S) {
      const pose = releasePose(next.t - LONGTRACEHUSH_HOLD);
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
  if (next.kind === "dashedlineflicker") {
    const pose = dashedlineflickerPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "breadcrumbperch") {
    const pose = breadcrumbperchPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "outlinetracepathwalk") {
    const pose = outlinetracepathwalkPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else {
    const pose = cornersnapturnPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  }
  if (u >= 1) return Object.assign({}, next, { phase: "done", lift: 0, rot: 0, anim: "idle" });
  return next;
}

