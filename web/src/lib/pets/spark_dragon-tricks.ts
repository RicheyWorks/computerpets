/** Spark ground tricks while idle — ultra-polish pass. House neighborly Crack Dragon spark_dragon desk life (spark_dragon / Spark) — crackpointskitter / snoutcrackpop / clawtipcrackle / tailpointperch / fissureflash / tipscorch / sparkhush personality (crackpointskitter crack-point skitter without naming crack or point or skitter alone as wait — crack-point skitter tell; snoutcrackpop snout-crack pop without naming snout or crack or pop alone as wait — snout-crack pop tell; clawtipcrackle claw-tip crackle without naming claw or tip or crackle alone as wait — claw-tip crackle tell; tailpointperch tail-point perch without naming tail or point or perch alone as wait — tail-point perch tell; fissureflash fissure-flash without naming fissure or flash alone as wait — fissure flash tell (distinct from Flux fieldripple); tipscorch tip-scorch without naming tip or scorch alone as wait — tip scorch tell; sparkhush spark hush hold (THE sparkhush sit_hold tell) — never named wait or crouch or sit or still or spark_dragon or spark or crackle as bare ethogram-only trick kinds; Flux flux_dragon owns crackpointskitter? NO — Flux owns heatfieldclaimwalk/snoutcrackpop? NO — Flux owns heatfieldclaimwalk/fieldlineshimmer/hideheatbloom/treatyfieldsettle/fieldripple/boundaryglow/fluxhush — do NOT reuse; Trace trace_dragon owns outlinetracepathwalk/dashedlineflicker/cornersnapturn/breadcrumbperch/pathglow/waypointskip/tracehush — do NOT reuse; Volt volt_dragon owns coiledgecharge/windowwireskim/staticfringecrackle/sparkhop/coilwind/coronaflash/volthush — do NOT reuse sparkhop; Arc cyber_dragon owns arcsparkcoil/circuitridgewalk/databreathshimmer/perchscanblink/gridpulse/packetflick/cyberhush — do NOT reuse arcsparkcoil; Firefly owns spark alias — do NOT reuse bare spark; Hide grouper owns cavernambushsettle/gulargulpinhale/colorpatternflush/slowcaudalhover/jawsnap/stripeband/epinephelushush — do NOT reuse; Relay owns click/latch/arc/buzz/switch — do NOT reuse bare arc; Fuse owns fuse life — do NOT reuse; Vesper dragon owns sprawl/guard/smolder/claim/fold — do NOT reuse; Ion ion_dragon next — do NOT start; guest slug Spark / key spark_dragon only for wantsThankYou matching — accept "spark_dragon" and "crackle" (NOT "spark" — Firefly owns spark); do NOT name a trick "spark_dragon" or "spark" or "crackle" or "flux_dragon" or "flux" or "trace_dragon" or "trace" or "volt_dragon" or "volt" or "cyber_dragon" or "arc" or "grouper" or "hide" or "relay" or "fuse" or "dragon" or "vesper" or "firefly" or "ion"; not Flux Field Dragon life, not Trace Path Dragon life, not Volt Coil Dragon life, not Arc Grid Dragon life, not Firefly life, not Hide Epinephelus life, not Relay click/latch life, not Fuse life, not Vesper dragon life, not Ion life, not Rui. Crackpointskitter / snoutcrackpop / clawtipcrackle / tailpointperch / fissureflash / tipscorch / sparkhush; densspark / inkspark / denssparkdragon thank-yous. Same map as desktop spark_dragon-tricks.js. Window-play unchanged. Ethogram softs + freeze — never names crackle/still/watch/wait/spark_dragon as bare ethogram-only trick kinds. True Crack Dragon spark_dragon desk life only — crack-point skitter, snout-crack pop, claw-tip crackle, tail-point perch, fissure flash, tip scorch, spark hush. Next house-order ultra: Ion / ion_dragon. No cry inventing — spark_dragon.wav EXISTS so prefersHouseCry adds spark_dragon after flux_dragon. Amplitudes raised toward Rui richness; denser waits/weights; SPARKHUSH_HOLD=11.2 RELEASE_S=1.18 (not 37.55/2.68). Catalog 221. */
export const TRICK_KEY = "spark_dragon";
export const TRICKS = ["crackpointskitter", "snoutcrackpop", "clawtipcrackle", "tailpointperch", "fissureflash", "tipscorch", "sparkhush"] as const;
export const HAPPY = ["densspark", "inkspark", "denssparkdragon"] as const;
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

export const HAPPY_DUR = { densspark: 1.70, inkspark: 1.84, denssparkdragon: 1.76 } as const;
export const SPARKHUSH_HOLD = 11.2;
export const RELEASE_S = 1.18;
export const DUR = {
  sparkhush: SPARKHUSH_HOLD + RELEASE_S,
  crackpointskitter: 2.48,
  snoutcrackpop: 2.42,
  clawtipcrackle: 2.40,
  tailpointperch: 2.44,
  fissureflash: 2.38,
  tipscorch: 2.56,
} as const;

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
  if (kind === "sparkhush") return 40 + roll * 26;
  if (kind === "fissureflash" || kind === "tipscorch" || kind === "crackpointskitter") return 12.8 + roll * 9.4;
  if (kind === "clawtipcrackle" || kind === "snoutcrackpop" || kind === "tailpointperch") return 11.6 + roll * 8.5;
  return justFinished ? 8.5 + roll * 8.4 : 4.4 + roll * 7.4;
}

export function pickTrick(rand?: number, musicOn?: boolean, lastKind?: SparkDragonTrickKind | string | null) {
  if (musicOn) return "sparkhush" as const;
  const roll = rand == null ? Math.random() : rand;
  if (lastKind === "sparkhush") {
    if (roll < 0.17) return "crackpointskitter" as const;
    if (roll < 0.33) return "snoutcrackpop" as const;
    if (roll < 0.49) return "clawtipcrackle" as const;
    if (roll < 0.65) return "tailpointperch" as const;
    if (roll < 0.83) return "fissureflash" as const;
    return "tipscorch" as const;
  }
  if (lastKind === "crackpointskitter") {
    if (roll < 0.16) return "sparkhush" as const;
    if (roll < 0.32) return "snoutcrackpop" as const;
    if (roll < 0.48) return "clawtipcrackle" as const;
    if (roll < 0.64) return "tailpointperch" as const;
    if (roll < 0.82) return "fissureflash" as const;
    return "tipscorch" as const;
  }
  if (lastKind === "snoutcrackpop") {
    if (roll < 0.14) return "sparkhush" as const;
    if (roll < 0.3) return "crackpointskitter" as const;
    if (roll < 0.46) return "clawtipcrackle" as const;
    if (roll < 0.62) return "tailpointperch" as const;
    if (roll < 0.8) return "fissureflash" as const;
    return "tipscorch" as const;
  }
  if (lastKind === "clawtipcrackle") {
    if (roll < 0.15) return "sparkhush" as const;
    if (roll < 0.31) return "crackpointskitter" as const;
    if (roll < 0.47) return "snoutcrackpop" as const;
    if (roll < 0.63) return "tailpointperch" as const;
    if (roll < 0.81) return "fissureflash" as const;
    return "tipscorch" as const;
  }
  if (lastKind === "tailpointperch") {
    if (roll < 0.16) return "sparkhush" as const;
    if (roll < 0.32) return "crackpointskitter" as const;
    if (roll < 0.48) return "snoutcrackpop" as const;
    if (roll < 0.64) return "clawtipcrackle" as const;
    if (roll < 0.82) return "fissureflash" as const;
    return "tipscorch" as const;
  }
  if (lastKind === "fissureflash") {
    if (roll < 0.15) return "sparkhush" as const;
    if (roll < 0.31) return "crackpointskitter" as const;
    if (roll < 0.47) return "snoutcrackpop" as const;
    if (roll < 0.63) return "clawtipcrackle" as const;
    if (roll < 0.81) return "tailpointperch" as const;
    return "tipscorch" as const;
  }
  if (lastKind === "tipscorch") {
    if (roll < 0.16) return "sparkhush" as const;
    if (roll < 0.32) return "crackpointskitter" as const;
    if (roll < 0.48) return "snoutcrackpop" as const;
    if (roll < 0.64) return "clawtipcrackle" as const;
    if (roll < 0.82) return "tailpointperch" as const;
    return "fissureflash" as const;
  }
  if (roll < 0.14) return "sparkhush" as const;
  if (roll < 0.28) return "crackpointskitter" as const;
  if (roll < 0.42) return "snoutcrackpop" as const;
  if (roll < 0.56) return "clawtipcrackle" as const;
  if (roll < 0.7) return "tailpointperch" as const;
  if (roll < 0.85) return "fissureflash" as const;
  return "tipscorch" as const;
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
  return key === TRICK_KEY || key === "crackle";
}

export function startThankYou(
  key: string | undefined | null,
  lastKind: SparkDragonHappyKind | null | undefined,
  x: number,
  facing: 1 | -1,
  flags?: TrickFlags
) {
  if (!wantsThankYou(key)) return null;
  if (!happyCanStart(flags || { cmd: "idle" })) return null;
  const pick = pickHappy(lastKind);
  return { happy: beginHappy(pick, x, facing), kind: pick };
}

export function pickHappy(lastKind?: SparkDragonHappyKind | null, rand?: number) {
  const pool = HAPPY.filter((k) => k !== lastKind);
  const list = pool.length ? pool : [...HAPPY];
  const roll = rand == null ? Math.random() : rand;
  return list[Math.floor(roll * list.length)] || list[0];
}

export function beginHappy(kind: SparkDragonHappyKind | string, x: number, facing: 1 | -1): SparkDragonHappy {
  const name = (HAPPY as readonly string[]).includes(kind) ? (kind as SparkDragonHappyKind) : "densspark";
  return {
    kind: name,
    happy: true,
    phase: "go",
    t: 0,
    x,
    lift: 0,
    rot: 0,
    anim: (name === "densspark" ? "sit" : name === "inkspark" ? "play" : "play") as TrickAnim,
    facing: (facing == null ? 1 : facing) as 1 | -1,
    fromX: x,
  };
}

export function denssparkPose(t: number) {
  const u = Math.max(0, Math.min(1, t / HAPPY_DUR.densspark));
  if (u < 0.14) {
    const s = u / 0.14;
    return { lift: s * 2.8, rot: s * 12, dx: 0, anim: "sit" as TrickAnim };
  }
  if (u < 0.78) {
    const flash = Math.sin(t * 2.2);
    return {
      lift: 2.8 + Math.abs(flash) * 1.4,
      rot: 12 + flash * 8,
      dx: flash * 0.08,
      anim: "sit" as TrickAnim,
    };
  }
  const s = (u - 0.78) / 0.22;
  return { lift: 2.0 * (1 - s), rot: 6 * (1 - s), dx: 0, anim: "idle" as TrickAnim };
}

export function inksparkPose(t: number) {
  const u = Math.max(0, Math.min(1, t / HAPPY_DUR.inkspark));
  if (u < 0.12) {
    const s = u / 0.12;
    return { lift: s * 3.7, rot: s * -14, dx: s * 0.15, anim: "play" as TrickAnim };
  }
  if (u < 0.8) {
    const wriggle = Math.sin(t * 2.6);
    return {
      lift: 3.4 + Math.abs(wriggle) * 1.6,
      rot: -14 + wriggle * 10,
      dx: wriggle * 0.12,
      anim: "play" as TrickAnim,
    };
  }
  const s = (u - 0.8) / 0.2;
  return { lift: 2.2 * (1 - s), rot: -6 * (1 - s), dx: 0, anim: "sit" as TrickAnim };
}

export function denssparkdragonPose(t: number) {
  return {
    lift: 2.2 + Math.abs(Math.sin(t * 0.58)) * 1.1,
    rot: Math.sin(t * 0.58) * 8,
    dx: Math.sin(t * 0.4) * 0.06,
    anim: "play" as TrickAnim,
  };
}

export function stepHappy(happy: SparkDragonHappy | null | undefined, dt: number, flags?: TrickFlags) {
  if (!happy || happy.phase === "done") return happy;
  if (happyShouldAbort(flags)) {
    return { ...happy, phase: "done" as const, t: 0, lift: 0, rot: 0, anim: "idle" as TrickAnim, abort: true };
  }
  const next = { ...happy, t: happy.t + Math.max(0, dt) };
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
  if (next.t >= hold) return { ...next, phase: "done" as const, lift: 0, rot: 0, anim: "idle" as TrickAnim };
  return next;
}

export function sleepHoldFrame(_key?: string | null, _frameCount?: number) {
  return null;
}

export function beginTrick(kind: SparkDragonTrickKind | string, x: number, facing: 1 | -1): SparkDragonTrick {
  const k = (TRICKS as readonly string[]).includes(kind) ? (kind as SparkDragonTrickKind) : "sparkhush";
  const anim: TrickAnim =
    k === "sparkhush"
      ? "sit"
      : k === "crackpointskitter"
        ? "play"
        : k === "tipscorch"
          ? "talk"
          : k === "snoutcrackpop"
            ? "walk"
            : k === "clawtipcrackle"
              ? "sit"
              : k === "tailpointperch"
                ? "sit"
                : k === "fissureflash"
                  ? "walk"
                  : "sit";
  return {
    kind: k,
    phase: k === "sparkhush" ? "hold" : "go",
    t: 0,
    x,
    lift: 0,
    rot: 0,
    anim,
    facing: (facing == null ? 1 : facing) as 1 | -1,
    fromX: x,
  };
}

function smoothstep(t: number) {
  const x = Math.max(0, Math.min(1, t));
  return x * x * (3 - 2 * x);
}

export function sparkhushPose(t: number) {
  return {
    lift: 2.4 + Math.abs(Math.sin(t * 0.42)) * 1.2,
    rot: -0.18 + Math.sin(t * 0.36) * 0.35,
  };
}

export function releasePose(t: number) {
  const u = Math.max(0, Math.min(1, t / RELEASE_S));
  return { lift: 2.4 * (1 - Math.sin(u * Math.PI * 0.5)), rot: -0.18 * (1 - u) };
}

export function crackpointskitterPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.crackpointskitter));
  const face = facing == null ? 1 : facing;
  if (u < 0.14) {
    const s = smoothstep(u / 0.14);
    return { x: fromX + face * s * 0.8, lift: s * 3.0, rot: s * -12 * face, anim: "play" as TrickAnim };
  }
  if (u < 0.78) {
    const bar = Math.sin(t * 2.4);
    return {
      x: fromX + face * (0.8 + bar * 0.16),
      lift: 2.8 + Math.abs(bar) * 1.5,
      rot: face * (-12 + bar * 10),
      anim: "play" as TrickAnim,
    };
  }
  const s = smoothstep((u - 0.78) / 0.22);
  return {
    x: fromX + face * 0.8 * (1 - s),
    lift: 1.4 * (1 - s),
    rot: face * (-4 * (1 - s)),
    anim: "idle" as TrickAnim,
  };
}

export function snoutcrackpopPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.snoutcrackpop));
  const face = facing == null ? 1 : facing;
  if (u < 0.12) {
    const s = smoothstep(u / 0.12);
    return { x: fromX, lift: s * 2.6, rot: s * 10 * face, anim: "walk" as TrickAnim };
  }
  if (u < 0.78) {
    const bob = Math.sin(t * 2.2);
    return {
      x: fromX + face * bob * 0.12,
      lift: 2.6 + Math.abs(bob) * 1.3,
      rot: face * (10 + bob * 8),
      anim: "walk" as TrickAnim,
    };
  }
  const s = smoothstep((u - 0.78) / 0.22);
  return {
    x: fromX,
    lift: 1.2 * (1 - s),
    rot: face * (3 * (1 - s)),
    anim: "idle" as TrickAnim,
  };
}

export function clawtipcracklePose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.clawtipcrackle));
  const face = facing == null ? 1 : facing;
  if (u < 0.14) {
    const s = smoothstep(u / 0.14);
    return { x: fromX + face * s * 0.5, lift: s * 2.8, rot: s * 11 * face, anim: "sit" as TrickAnim };
  }
  if (u < 0.78) {
    const hang = Math.sin(t * 2.0);
    return {
      x: fromX + face * (0.5 + hang * 0.1),
      lift: 2.8 + Math.abs(hang) * 1.2,
      rot: face * (11 + hang * 8),
      anim: "sit" as TrickAnim,
    };
  }
  const s = smoothstep((u - 0.78) / 0.22);
  return {
    x: fromX + face * 0.5 * (1 - s),
    lift: 1.3 * (1 - s),
    rot: face * (3 * (1 - s)),
    anim: "idle" as TrickAnim,
  };
}

export function tailpointperchPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.tailpointperch));
  const face = facing == null ? 1 : facing;
  if (u < 0.1) {
    const s = smoothstep(u / 0.1);
    return { x: fromX + face * s * 1.0, lift: s * 4.0, rot: s * 18 * face, anim: "sit" as TrickAnim };
  }
  if (u < 0.8) {
    const thrash = Math.sin(t * 3.6);
    return {
      x: fromX + face * (1.0 + thrash * 0.22),
      lift: 3.6 + Math.abs(thrash) * 2.0,
      rot: face * (18 + thrash * 14),
      anim: "sit" as TrickAnim,
    };
  }
  const s = smoothstep((u - 0.8) / 0.2);
  return {
    x: fromX + face * 1.0 * (1 - s),
    lift: 1.6 * (1 - s),
    rot: face * (6 * (1 - s)),
    anim: "idle" as TrickAnim,
  };
}

export function fissureflashPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.fissureflash));
  const face = facing == null ? 1 : facing;
  if (u < 0.14) {
    const s = smoothstep(u / 0.14);
    return { x: fromX + face * s * 0.6, lift: s * 3.0, rot: s * 12 * face, anim: "walk" as TrickAnim };
  }
  if (u < 0.8) {
    const cast = Math.sin(t * 2.8);
    return {
      x: fromX + face * (0.6 + cast * 0.16),
      lift: 2.8 + Math.abs(cast) * 1.6,
      rot: face * (12 + cast * 10),
      anim: "walk" as TrickAnim,
    };
  }
  const s = smoothstep((u - 0.8) / 0.2);
  return {
    x: fromX + face * 0.6 * (1 - s),
    lift: 1.4 * (1 - s),
    rot: face * (4 * (1 - s)),
    anim: "idle" as TrickAnim,
  };
}

export function tipscorchPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.tipscorch));
  const face = facing == null ? 1 : facing;
  if (u < 0.14) {
    const s = smoothstep(u / 0.14);
    return { x: fromX + face * s * 0.6, lift: s * 3.2, rot: s * 14 * face, anim: "talk" as TrickAnim };
  }
  if (u < 0.8) {
    const cloud = Math.sin(t * 3.0);
    return {
      x: fromX + face * (0.6 + cloud * 0.18),
      lift: 3.0 + Math.abs(cloud) * 1.8,
      rot: face * (14 + cloud * 12),
      anim: "talk" as TrickAnim,
    };
  }
  const s = smoothstep((u - 0.8) / 0.2);
  return {
    x: fromX + face * 0.6 * (1 - s),
    lift: 1.5 * (1 - s),
    rot: face * (5 * (1 - s)),
    anim: "idle" as TrickAnim,
  };
}

export function stepTrick(trick: SparkDragonTrick | null | undefined, dt: number, flags?: TrickFlags) {
  if (!trick || trick.phase === "done") return trick;
  if (
    shouldAbort(flags) &&
    trick.kind !== "crackpointskitter" &&
    trick.kind !== "snoutcrackpop" &&
    trick.kind !== "clawtipcrackle" &&
    trick.kind !== "tailpointperch" &&
    trick.kind !== "fissureflash" &&
    trick.kind !== "tipscorch"
  ) {
    return { ...trick, phase: "done" as const, t: 0, lift: 0, rot: 0, anim: "idle" as TrickAnim, abort: true };
  }
  const next = { ...trick, t: trick.t + Math.max(0, dt) };
  if (next.kind === "sparkhush") {
    if (next.t < SPARKHUSH_HOLD) {
      const pose = sparkhushPose(next.t);
      next.phase = "hold";
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = "sit";
      return next;
    }
    if (next.t < SPARKHUSH_HOLD + RELEASE_S) {
      const pose = releasePose(next.t - SPARKHUSH_HOLD);
      next.phase = "release";
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = "sit";
      return next;
    }
    return { ...next, phase: "done" as const, lift: 0, rot: 0, anim: "idle" as TrickAnim };
  }
  const hold = DUR[next.kind];
  const u = next.t / hold;
  const fromX = trick.fromX != null ? trick.fromX : trick.x;
  if (next.kind === "crackpointskitter") {
    const pose = crackpointskitterPose(next.t, fromX, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "snoutcrackpop") {
    const pose = snoutcrackpopPose(next.t, fromX, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "clawtipcrackle") {
    const pose = clawtipcracklePose(next.t, fromX, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "tailpointperch") {
    const pose = tailpointperchPose(next.t, fromX, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "fissureflash") {
    const pose = fissureflashPose(next.t, fromX, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else {
    const pose = tipscorchPose(next.t, fromX, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  }
  if (u >= 1) return { ...next, phase: "done" as const, lift: 0, rot: 0, anim: "idle" as TrickAnim };
  return next;
}
