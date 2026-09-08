/** Spark ground tricks while idle. House neighborly Crack Dragon (spark_dragon / Spark) desk life -- crack-point skitter / snout-crack pop / claw-tip crackle / tail-point perch / long spark hush; NOT Flux flux_dragon (esp. not heatfieldclaimwalk/fieldlineshimmer/hideheatbloom/treatyfieldsettle/longfluxhush/densflux/inkflux/densfluxdragon); NOT Trace trace_dragon (esp. not outlinetracepathwalk/dashedlineflicker/cornersnapturn/breadcrumbperch/longtracehush/denstrace/inktrace/denstracedragon); NOT Volt volt_dragon; NOT Arc cyber_dragon; NOT Firefly (alias spark); NOT Hide grouper; NOT Soar; NOT Vesper; NOT Relay; NOT Fuse; NOT Rui; guest slug Spark / key spark_dragon -- accept spark_dragon and crackle (NOT spark — Firefly owns spark); Thank-yous densspark / inkspark / denssparkdragon. Sleep, hide, leave, rest, card, ribbon still win. Same map as desktop spark_dragon-tricks.js. Next: Ion / ion_dragon. Catalog 218. */
export const TRICK_KEY = "spark_dragon";
export const TRICKS = ["crackpointskitter", "snoutcrackpop", "clawtipcrackle", "tailpointperch", "longsparkhush"] as const;
export const HAPPY = ["densspark", "inkspark", "denssparkdragon"] as const;
export const HAPPY_DUR = { densspark: 3.21, inkspark: 2.88, denssparkdragon: 3.08 } as const;
export const LONGSPARKHUSH_HOLD = 37.55;
export const RELEASE_S = 2.68;
export const DUR = { longsparkhush: LONGSPARKHUSH_HOLD + RELEASE_S, crackpointskitter: 6.49, snoutcrackpop: 5.91, clawtipcrackle: 5.66, tailpointperch: 5.79 } as const;

export type SparkDragonTrickKind = (typeof TRICKS)[number];
export type SparkDragonHappyKind = (typeof HAPPY)[number];
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

export type SparkDragonTrick = {
kind: SparkDragonTrickKind;
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

export type SparkDragonHappy = {
kind: SparkDragonHappyKind;
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

export function nextTrickWait(justFinished: boolean, rand?: number, kind?: SparkDragonTrickKind | string) {
  const roll = rand == null ? Math.random() : rand;
  if (kind === "longsparkhush") return 229 + roll * 37;
  if (kind === "snoutcrackpop") return 29.1 + roll * 3.4;
  if (kind === "tailpointperch") return 27.0 + roll * 3.1;
  if (kind === "crackpointskitter") return 27.9 + roll * 3.3;
  if (kind === "clawtipcrackle") return 26.2 + roll * 3.2;
  return justFinished ? 20.4 + roll * 3.3 : 15.5 + roll * 2.8;
}

export function pickTrick(rand?: number, musicOn?: boolean, lastKind?: SparkDragonTrickKind | string | null) {
  if (musicOn) return "longsparkhush";
  const roll = rand == null ? Math.random() : rand;
  if (lastKind === "longsparkhush") {
    if (roll < 0.26) return "snoutcrackpop";
    if (roll < 0.5) return "tailpointperch";
    if (roll < 0.74) return "crackpointskitter";
    return "clawtipcrackle";
  }
  if (lastKind === "snoutcrackpop") {
    if (roll < 0.26) return "longsparkhush";
    if (roll < 0.5) return "tailpointperch";
    if (roll < 0.74) return "crackpointskitter";
    return "clawtipcrackle";
  }
  if (lastKind === "tailpointperch") {
    if (roll < 0.22) return "longsparkhush";
    if (roll < 0.44) return "snoutcrackpop";
    if (roll < 0.68) return "crackpointskitter";
    return "clawtipcrackle";
  }
  if (roll < 0.2) return "longsparkhush";
  if (roll < 0.4) return "snoutcrackpop";
  if (roll < 0.6) return "tailpointperch";
  if (roll < 0.8) return "crackpointskitter";
  return "clawtipcrackle";
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
  return key === TRICK_KEY || key === "crackle";
}

export function startThankYou(key: string | undefined, lastKind: SparkDragonHappyKind | string | null | undefined, x: number, facing?: 1 | -1, flags?: TrickFlags) {
  if (!wantsThankYou(key)) return null;
  if (!happyCanStart(flags || { cmd: "idle" })) return null;
  const pick = pickHappy(lastKind);
  return { happy: beginHappy(pick, x, facing), kind: pick };
}

export function pickHappy(lastKind?: SparkDragonHappyKind | string | null, rand?: number) {
  const pool = HAPPY.filter((k) => k !== lastKind);
  const list = pool.length ? pool : HAPPY.slice();
  const roll = rand == null ? Math.random() : rand;
  return list[Math.floor(roll * list.length)] || list[0];
}

export function beginHappy(kind: SparkDragonHappyKind | string, x: number, facing?: 1 | -1): SparkDragonHappy {
  const name = (HAPPY.indexOf(kind as SparkDragonHappyKind) >= 0 ? kind : "densspark") as SparkDragonHappyKind;
  return {
    kind: name,
    happy: true,
    phase: "go",
    t: 0,
    x: x,
    lift: 0,
    rot: 0,
    anim: name === "densspark" ? "sit" : name === "inkspark" ? "play" : "play",
    facing: (facing == null ? 1 : facing) as 1 | -1,
    fromX: x,
  };
}

export function denssparkPose(t: number) {
  const u = Math.max(0, Math.min(1, t / HAPPY_DUR.densspark));
  if (u < 0.105) {
    const s = u / 0.105;
    return { lift: s * 0.0053, rot: s * -0.33, anim: "sit" as TrickAnim };
  }
  if (u < 0.48) {
    const sway = Math.sin(((u - 0.105) / 0.375) * Math.PI * 3.2);
    const crack = Math.sin(((u - 0.105) / 0.375) * Math.PI * 6.1);
    return { lift: 0.0053 + Math.abs(sway) * 0.0018 + Math.abs(crack) * 0.0007, rot: -0.33 + sway * 0.25 + crack * 0.07, anim: "sit" as TrickAnim };
  }
  if (u < 0.86) {
    const sway = Math.sin(((u - 0.48) / 0.38) * Math.PI * 2.55);
    return { lift: 0.0053 + Math.abs(sway) * 0.0013, rot: -0.27 + sway * 0.17, anim: "sit" as TrickAnim };
  }
  const s = (u - 0.86) / 0.14;
  return { lift: 0.0053 * (1 - s), rot: -0.27 * (1 - s), anim: "idle" as TrickAnim };
}
export function inksparkPose(t: number) {
  const u = Math.max(0, Math.min(1, t / HAPPY_DUR.inkspark));
  if (u < 0.095) {
    const s = u / 0.095;
    return { lift: s * 0.0063, rot: s * 0.43, anim: "play" as TrickAnim };
  }
  if (u < 0.5) {
    const bob = Math.sin(((u - 0.095) / 0.405) * Math.PI * 3.4);
    const pop = Math.sin(((u - 0.095) / 0.405) * Math.PI * 7.2);
    return { lift: 0.0063 + Math.abs(bob) * 0.0022 + Math.abs(pop) * 0.0008, rot: 0.43 + bob * 0.24 + pop * 0.06, anim: "play" as TrickAnim };
  }
  if (u < 0.86) {
    const bob = Math.sin(((u - 0.5) / 0.36) * Math.PI * 2.6);
    return { lift: 0.0063 + Math.abs(bob) * 0.0015, rot: 0.37 + bob * 0.16, anim: "play" as TrickAnim };
  }
  const s = (u - 0.86) / 0.14;
  return { lift: 0.0063 * (1 - s), rot: 0.37 * (1 - s), anim: "idle" as TrickAnim };
}
export function denssparkdragonPose(t: number) {
  const u = Math.max(0, Math.min(1, t / HAPPY_DUR.denssparkdragon));
  if (u < 0.115) {
    const s = u / 0.115;
    return { lift: s * 0.0046, rot: s * -0.25, anim: "play" as TrickAnim };
  }
  if (u < 0.54) {
    const hush = Math.sin(((u - 0.115) / 0.425) * Math.PI * 2.4);
    const crack = Math.sin(((u - 0.115) / 0.425) * Math.PI * 5.0);
    return { lift: 0.0046 + Math.abs(hush) * 0.0016 + Math.abs(crack) * 0.0006, rot: -0.25 + hush * 0.19 + crack * 0.055, anim: "play" as TrickAnim };
  }
  if (u < 0.86) {
    const hush = Math.sin(((u - 0.54) / 0.32) * Math.PI * 2.0);
    return { lift: 0.0046 + Math.abs(hush) * 0.0012, rot: -0.21 + hush * 0.13, anim: "play" as TrickAnim };
  }
  const s = (u - 0.86) / 0.14;
  return { lift: 0.0046 * (1 - s), rot: -0.21 * (1 - s), anim: "idle" as TrickAnim };
}

export function stepHappy(happy: SparkDragonHappy | null | undefined, dt: number, flags?: TrickFlags) {
  if (!happy || happy.phase === "done") return happy;
  if (happyShouldAbort(flags)) {
    return Object.assign({}, happy, { phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true });
  }
  const next = Object.assign({}, happy, { t: happy.t + Math.max(0, dt) });
  const hold = HAPPY_DUR[next.kind];
  if (next.kind === "densspark") {
    const pose = denssparkPose(next.t);
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "inkspark") {
    const pose = inksparkPose(next.t);
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else {
    const pose = denssparkdragonPose(next.t);
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

export function beginTrick(kind: SparkDragonTrickKind | string, x: number, facing?: 1 | -1): SparkDragonTrick {
  const k = (TRICKS as readonly string[]).includes(kind) ? (kind as SparkDragonTrickKind) : "longsparkhush";
  const anim: TrickAnim =
    k === "longsparkhush"
      ? "sit"
      : k === "snoutcrackpop"
        ? "sit"
        : k === "tailpointperch"
          ? "sit"
          : k === "clawtipcrackle"
            ? "play"
            : k === "crackpointskitter"
              ? "walk"
              : "sit";
  return {
    kind: k,
    phase: k === "longsparkhush" ? "hold" : "go",
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

export function longsparkhushPose(t: number) {
  const breath = Math.sin(t * 0.00028) + 0.00016 * Math.sin(t * 0.00097);
  const charge = Math.abs(Math.sin(t * 0.00019));
  return { lift: -0.00013 + charge * 0.00015, rot: 0.0011 + breath * 0.0022 };
}

export function releasePose(t: number) {
  const u = Math.max(0, Math.min(1, t / RELEASE_S));
  return { lift: -0.00013 * (1 - Math.sin(u * Math.PI * 0.5)), rot: 0.0031 * (1 - u) };
}

export function snoutcrackpopPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.snoutcrackpop));
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
export function tailpointperchPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.tailpointperch));
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
export function crackpointskitterPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.crackpointskitter));
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
export function clawtipcracklePose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.clawtipcrackle));
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

export function stepTrick(trick: SparkDragonTrick | null | undefined, dt: number, flags?: TrickFlags) {
  if (!trick || trick.phase === "done") return trick;
  if (shouldAbort(flags) && trick.kind !== "snoutcrackpop" && trick.kind !== "tailpointperch" && trick.kind !== "crackpointskitter" && trick.kind !== "clawtipcrackle") {
    return Object.assign({}, trick, { phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true });
  }
  const next = Object.assign({}, trick, { t: trick.t + Math.max(0, dt) });
  if (next.kind === "longsparkhush") {
    if (next.t < LONGSPARKHUSH_HOLD) {
      const pose = longsparkhushPose(next.t);
      next.phase = "hold";
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = "sit";
      return next;
    }
    if (next.t < LONGSPARKHUSH_HOLD + RELEASE_S) {
      const pose = releasePose(next.t - LONGSPARKHUSH_HOLD);
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
  if (next.kind === "snoutcrackpop") {
    const pose = snoutcrackpopPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "tailpointperch") {
    const pose = tailpointperchPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "crackpointskitter") {
    const pose = crackpointskitterPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else {
    const pose = clawtipcracklePose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  }
  if (u >= 1) return Object.assign({}, next, { phase: "done", lift: 0, rot: 0, anim: "idle" });
  return next;
}

