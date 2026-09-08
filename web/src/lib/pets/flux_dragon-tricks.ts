/** Flux ground tricks while idle. House neighborly Field Dragon (flux_dragon / Flux) desk life -- heat-field claim walk / field-line shimmer / hide-heat bloom / treaty-field settle / long flux hush; NOT Trace trace_dragon (esp. not outlinetracepathwalk/dashedlineflicker/cornersnapturn/breadcrumbperch/longtracehush/denstrace/inktrace/denstracedragon); NOT Volt volt_dragon (esp. not coiledgecharge/windowwireskim/staticfringecrackle/sparkhop/longvolthush/densvolt/inkvolt/densvoltdragon); NOT Arc cyber_dragon (esp. not arcsparkcoil/circuitridgewalk/databreathshimmer/perchscanblink/longcyberhush/densarc/inkarc/denscyber); NOT Hide grouper; NOT Soar eagle ray; NOT Vesper dragon (sprawl/guard/smolder/claim/fold); NOT Relay; NOT Fuse; NOT Rui; guest slug Flux / key flux_dragon -- accept flux_dragon and flux; Thank-yous densflux / inkflux / densfluxdragon. Sleep, hide, leave, rest, card, ribbon still win. Same map as desktop flux_dragon-tricks.js. Next: Spark / spark_dragon. Catalog 219. */
export const TRICK_KEY = "flux_dragon";
export const TRICKS = ["heatfieldclaimwalk", "fieldlineshimmer", "hideheatbloom", "treatyfieldsettle", "longfluxhush"] as const;
export const HAPPY = ["densflux", "inkflux", "densfluxdragon"] as const;
export const HAPPY_DUR = { densflux: 3.26, inkflux: 2.94, densfluxdragon: 3.12 } as const;
export const LONGFLUXHUSH_HOLD = 37.42;
export const RELEASE_S = 2.71;
export const DUR = { longfluxhush: LONGFLUXHUSH_HOLD + RELEASE_S, heatfieldclaimwalk: 6.58, fieldlineshimmer: 6.02, hideheatbloom: 5.74, treatyfieldsettle: 5.88 } as const;

export type FluxDragonTrickKind = (typeof TRICKS)[number];
export type FluxDragonHappyKind = (typeof HAPPY)[number];
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

export type FluxDragonTrick = {
kind: FluxDragonTrickKind;
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

export type FluxDragonHappy = {
kind: FluxDragonHappyKind;
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

export function nextTrickWait(justFinished: boolean, rand?: number, kind?: FluxDragonTrickKind | string) {
  const roll = rand == null ? Math.random() : rand;
  if (kind === "longfluxhush") return 227 + roll * 38;
  if (kind === "fieldlineshimmer") return 28.8 + roll * 3.6;
  if (kind === "treatyfieldsettle") return 26.6 + roll * 3.3;
  if (kind === "heatfieldclaimwalk") return 27.4 + roll * 3.5;
  if (kind === "hideheatbloom") return 25.8 + roll * 3.5;
  return justFinished ? 20.1 + roll * 3.5 : 15.2 + roll * 3.0;
}

export function pickTrick(rand?: number, musicOn?: boolean, lastKind?: FluxDragonTrickKind | string | null) {
  if (musicOn) return "longfluxhush";
  const roll = rand == null ? Math.random() : rand;
  if (lastKind === "longfluxhush") {
    if (roll < 0.26) return "fieldlineshimmer";
    if (roll < 0.5) return "treatyfieldsettle";
    if (roll < 0.74) return "heatfieldclaimwalk";
    return "hideheatbloom";
  }
  if (lastKind === "fieldlineshimmer") {
    if (roll < 0.26) return "longfluxhush";
    if (roll < 0.5) return "treatyfieldsettle";
    if (roll < 0.74) return "heatfieldclaimwalk";
    return "hideheatbloom";
  }
  if (lastKind === "treatyfieldsettle") {
    if (roll < 0.22) return "longfluxhush";
    if (roll < 0.44) return "fieldlineshimmer";
    if (roll < 0.68) return "heatfieldclaimwalk";
    return "hideheatbloom";
  }
  if (roll < 0.2) return "longfluxhush";
  if (roll < 0.4) return "fieldlineshimmer";
  if (roll < 0.6) return "treatyfieldsettle";
  if (roll < 0.8) return "heatfieldclaimwalk";
  return "hideheatbloom";
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
  return key === TRICK_KEY || key === "flux";
}

export function startThankYou(key: string | undefined, lastKind: FluxDragonHappyKind | string | null | undefined, x: number, facing?: 1 | -1, flags?: TrickFlags) {
  if (!wantsThankYou(key)) return null;
  if (!happyCanStart(flags || { cmd: "idle" })) return null;
  const pick = pickHappy(lastKind);
  return { happy: beginHappy(pick, x, facing), kind: pick };
}

export function pickHappy(lastKind?: FluxDragonHappyKind | string | null, rand?: number) {
  const pool = HAPPY.filter((k) => k !== lastKind);
  const list = pool.length ? pool : HAPPY.slice();
  const roll = rand == null ? Math.random() : rand;
  return list[Math.floor(roll * list.length)] || list[0];
}

export function beginHappy(kind: FluxDragonHappyKind | string, x: number, facing?: 1 | -1): FluxDragonHappy {
  const name = (HAPPY.indexOf(kind as FluxDragonHappyKind) >= 0 ? kind : "densflux") as FluxDragonHappyKind;
  return {
    kind: name,
    happy: true,
    phase: "go",
    t: 0,
    x: x,
    lift: 0,
    rot: 0,
    anim: name === "densflux" ? "sit" : name === "inkflux" ? "play" : "play",
    facing: (facing == null ? 1 : facing) as 1 | -1,
    fromX: x,
  };
}

export function densfluxPose(t: number) {
  const u = Math.max(0, Math.min(1, t / HAPPY_DUR.densflux));
  if (u < 0.11) {
    const s = u / 0.11;
    return { lift: s * 0.0051, rot: s * -0.34, anim: "sit" as TrickAnim };
  }
  if (u < 0.5) {
    const sway = Math.sin(((u - 0.11) / 0.39) * Math.PI * 2.9);
    const field = Math.sin(((u - 0.11) / 0.39) * Math.PI * 5.2);
    return { lift: 0.0051 + Math.abs(sway) * 0.0017 + Math.abs(field) * 0.0006, rot: -0.34 + sway * 0.24 + field * 0.06, anim: "sit" as TrickAnim };
  }
  if (u < 0.86) {
    const sway = Math.sin(((u - 0.5) / 0.36) * Math.PI * 2.4);
    return { lift: 0.0051 + Math.abs(sway) * 0.0014, rot: -0.28 + sway * 0.18, anim: "sit" as TrickAnim };
  }
  const s = (u - 0.86) / 0.14;
  return { lift: 0.0051 * (1 - s), rot: -0.28 * (1 - s), anim: "idle" as TrickAnim };
}
export function inkfluxPose(t: number) {
  const u = Math.max(0, Math.min(1, t / HAPPY_DUR.inkflux));
  if (u < 0.1) {
    const s = u / 0.1;
    return { lift: s * 0.0061, rot: s * 0.41, anim: "play" as TrickAnim };
  }
  if (u < 0.48) {
    const bob = Math.sin(((u - 0.1) / 0.38) * Math.PI * 3.1);
    const heat = Math.sin(((u - 0.1) / 0.38) * Math.PI * 6.0);
    return { lift: 0.0061 + Math.abs(bob) * 0.0021 + Math.abs(heat) * 0.0007, rot: 0.41 + bob * 0.23 + heat * 0.05, anim: "play" as TrickAnim };
  }
  if (u < 0.86) {
    const bob = Math.sin(((u - 0.48) / 0.38) * Math.PI * 2.5);
    return { lift: 0.0061 + Math.abs(bob) * 0.0016, rot: 0.36 + bob * 0.17, anim: "play" as TrickAnim };
  }
  const s = (u - 0.86) / 0.14;
  return { lift: 0.0061 * (1 - s), rot: 0.36 * (1 - s), anim: "idle" as TrickAnim };
}
export function densfluxdragonPose(t: number) {
  const u = Math.max(0, Math.min(1, t / HAPPY_DUR.densfluxdragon));
  if (u < 0.12) {
    const s = u / 0.12;
    return { lift: s * 0.0044, rot: s * -0.26, anim: "play" as TrickAnim };
  }
  if (u < 0.52) {
    const hush = Math.sin(((u - 0.12) / 0.4) * Math.PI * 2.25);
    const field = Math.sin(((u - 0.12) / 0.4) * Math.PI * 4.4);
    return { lift: 0.0044 + Math.abs(hush) * 0.0015 + Math.abs(field) * 0.0005, rot: -0.26 + hush * 0.18 + field * 0.05, anim: "play" as TrickAnim };
  }
  if (u < 0.86) {
    const hush = Math.sin(((u - 0.52) / 0.34) * Math.PI * 1.9);
    return { lift: 0.0044 + Math.abs(hush) * 0.0011, rot: -0.22 + hush * 0.14, anim: "play" as TrickAnim };
  }
  const s = (u - 0.86) / 0.14;
  return { lift: 0.0044 * (1 - s), rot: -0.22 * (1 - s), anim: "idle" as TrickAnim };
}

export function stepHappy(happy: FluxDragonHappy | null | undefined, dt: number, flags?: TrickFlags) {
  if (!happy || happy.phase === "done") return happy;
  if (happyShouldAbort(flags)) {
    return Object.assign({}, happy, { phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true });
  }
  const next = Object.assign({}, happy, { t: happy.t + Math.max(0, dt) });
  const hold = HAPPY_DUR[next.kind];
  if (next.kind === "densflux") {
    const pose = densfluxPose(next.t);
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "inkflux") {
    const pose = inkfluxPose(next.t);
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else {
    const pose = densfluxdragonPose(next.t);
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

export function beginTrick(kind: FluxDragonTrickKind | string, x: number, facing?: 1 | -1): FluxDragonTrick {
  const k = (TRICKS as readonly string[]).includes(kind) ? (kind as FluxDragonTrickKind) : "longfluxhush";
  const anim: TrickAnim =
    k === "longfluxhush"
      ? "sit"
      : k === "fieldlineshimmer"
        ? "sit"
        : k === "treatyfieldsettle"
          ? "sit"
          : k === "hideheatbloom"
            ? "play"
            : k === "heatfieldclaimwalk"
              ? "walk"
              : "sit";
  return {
    kind: k,
    phase: k === "longfluxhush" ? "hold" : "go",
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

export function longfluxhushPose(t: number) {
  const breath = Math.sin(t * 0.00028) + 0.00016 * Math.sin(t * 0.00097);
  const charge = Math.abs(Math.sin(t * 0.00019));
  return { lift: -0.00013 + charge * 0.00015, rot: 0.0011 + breath * 0.0022 };
}

export function releasePose(t: number) {
  const u = Math.max(0, Math.min(1, t / RELEASE_S));
  return { lift: -0.00013 * (1 - Math.sin(u * Math.PI * 0.5)), rot: 0.0031 * (1 - u) };
}

export function fieldlineshimmerPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.fieldlineshimmer));
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
export function treatyfieldsettlePose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.treatyfieldsettle));
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
export function heatfieldclaimwalkPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.heatfieldclaimwalk));
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
export function hideheatbloomPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.hideheatbloom));
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

export function stepTrick(trick: FluxDragonTrick | null | undefined, dt: number, flags?: TrickFlags) {
  if (!trick || trick.phase === "done") return trick;
  if (shouldAbort(flags) && trick.kind !== "fieldlineshimmer" && trick.kind !== "treatyfieldsettle" && trick.kind !== "heatfieldclaimwalk" && trick.kind !== "hideheatbloom") {
    return Object.assign({}, trick, { phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true });
  }
  const next = Object.assign({}, trick, { t: trick.t + Math.max(0, dt) });
  if (next.kind === "longfluxhush") {
    if (next.t < LONGFLUXHUSH_HOLD) {
      const pose = longfluxhushPose(next.t);
      next.phase = "hold";
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = "sit";
      return next;
    }
    if (next.t < LONGFLUXHUSH_HOLD + RELEASE_S) {
      const pose = releasePose(next.t - LONGFLUXHUSH_HOLD);
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
  if (next.kind === "fieldlineshimmer") {
    const pose = fieldlineshimmerPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "treatyfieldsettle") {
    const pose = treatyfieldsettlePose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "heatfieldclaimwalk") {
    const pose = heatfieldclaimwalkPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else {
    const pose = hideheatbloomPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  }
  if (u >= 1) return Object.assign({}, next, { phase: "done", lift: 0, rot: 0, anim: "idle" });
  return next;
}

