/** Gauss ground tricks while idle — ultra-polish pass. House neighborly Filing Dragon gauss_dragon desk life (gauss_dragon / Gauss) — filinglinesbandwalk / ironfilingsstand / fieldlinealign / magneticperchsettle / filingsweep / bandclamp / gausshush personality (filinglinesbandwalk filing-lines band walk without naming filing or lines or band or walk alone as wait — filing-lines band walk tell; ironfilingsstand iron-filings stand without naming iron or filings or stand alone as wait — iron-filings stand tell; fieldlinealign field-line align without naming field or line or align alone as wait — field-line align tell; magneticperchsettle magnetic-perch settle without naming magnetic or perch or settle alone as wait — magnetic-perch settle tell (distinct from Magneton lodestone/dipole); filingsweep filing-sweep without naming filing or sweep alone as wait — filing sweep tell; bandclamp band-clamp without naming band or clamp alone as wait — band clamp tell; gausshush gauss hush hold (THE gausshush sit_hold tell) — never named wait or crouch or sit or still or gauss_dragon or gauss or filing as bare ethogram-only trick kinds; Ion ion_dragon owns filinglinesbandwalk? NO — Ion owns paleionhazecling/outlinehazedrift/chargehazeclaim/mistperchsettle/hazeveil/ionbloom/ionhush — do NOT reuse; Spark spark_dragon owns crackpointskitter/snoutcrackpop/clawtipcrackle/tailpointperch/fissureflash/tipscorch/sparkhush — do NOT reuse; Flux flux_dragon owns heatfieldclaimwalk/fieldlineshimmer/hideheatbloom/treatyfieldsettle/fieldripple/boundaryglow/fluxhush — do NOT reuse; Trace trace_dragon owns outlinetracepathwalk/dashedlineflicker/cornersnapturn/breadcrumbperch/pathglow/waypointskip/tracehush — do NOT reuse; Volt volt_dragon owns coiledgecharge/windowwireskim/staticfringecrackle/sparkhop/coilwind/coronaflash/volthush — do NOT reuse; Arc cyber_dragon owns arcsparkcoil/circuitridgewalk/databreathshimmer/perchscanblink/gridpulse/packetflick/cyberhush — do NOT reuse; Magneton owns lodestone/flux/azimuth/dipole/remanence/barkhausen/hysteresis — do NOT reuse bare flux or dipole; Relay owns click/latch/arc/buzz/switch — do NOT reuse bare arc; Fuse owns fuse life — do NOT reuse; Vesper dragon owns sprawl/guard/smolder/claim/fold — do NOT reuse claim; Relay relay_dragon next — do NOT start; guest slug Gauss / key gauss_dragon only for wantsThankYou matching — accept "gauss_dragon" and "gauss"; do NOT name a trick "gauss_dragon" or "gauss" or "filing" or "ion_dragon" or "ion" or "haze" or "spark_dragon" or "spark" or "crackle" or "flux_dragon" or "flux" or "trace_dragon" or "trace" or "volt_dragon" or "volt" or "cyber_dragon" or "arc" or "magneton" or "relay" or "fuse" or "dragon" or "vesper" or "firefly" or "veil"; not Ion Haze Dragon life, not Spark Crack Dragon life, not Flux Field Dragon life, not Trace Path Dragon life, not Volt Coil Dragon life, not Arc Grid Dragon life, not Magneton life, not Relay click/latch life, not Fuse life, not Vesper dragon life, not Rui. Filinglinesbandwalk / ironfilingsstand / fieldlinealign / magneticperchsettle / filingsweep / bandclamp / gausshush; densgauss / inkgauss / densgaussdragon thank-yous. Same map as desktop gauss_dragon-tricks.js. Window-play unchanged. Ethogram softs + freeze — never names filing/still/watch/wait/gauss_dragon as bare ethogram-only trick kinds. True Filing Dragon gauss_dragon desk life only — filing-lines band walk, iron-filings stand, field-line align, magnetic-perch settle, filing sweep, band clamp, gauss hush. Next house-order ultra: Relay / relay_dragon. No cry inventing — gauss_dragon.wav EXISTS so prefersHouseCry adds gauss_dragon after ion_dragon. Amplitudes raised toward Rui richness; denser waits/weights; GAUSSHUSH_HOLD=11.2 RELEASE_S=1.18 (not 37.81/2.77). Catalog 221. */
export const TRICK_KEY = "gauss_dragon";
export const TRICKS = ["filinglinesbandwalk", "ironfilingsstand", "fieldlinealign", "magneticperchsettle", "filingsweep", "bandclamp", "gausshush"] as const;
export const HAPPY = ["densgauss", "inkgauss", "densgaussdragon"] as const;
export type GaussDragonTrickKind = (typeof TRICKS)[number];
export type GaussDragonHappyKind = (typeof HAPPY)[number];
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

export type GaussDragonTrick = {
  kind: GaussDragonTrickKind;
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

export type GaussDragonHappy = {
  kind: GaussDragonHappyKind;
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

export const HAPPY_DUR = { densgauss: 1.70, inkgauss: 1.84, densgaussdragon: 1.76 } as const;
export const GAUSSHUSH_HOLD = 11.2;
export const RELEASE_S = 1.18;
export const DUR = {
  gausshush: GAUSSHUSH_HOLD + RELEASE_S,
  filinglinesbandwalk: 2.48,
  ironfilingsstand: 2.42,
  fieldlinealign: 2.40,
  magneticperchsettle: 2.44,
  filingsweep: 2.38,
  bandclamp: 2.56,
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

export function nextTrickWait(justFinished: boolean, rand?: number, kind?: GaussDragonTrickKind | string) {
  const roll = rand == null ? Math.random() : rand;
  if (kind === "gausshush") return 40 + roll * 26;
  if (kind === "filingsweep" || kind === "bandclamp" || kind === "filinglinesbandwalk") return 12.8 + roll * 9.4;
  if (kind === "fieldlinealign" || kind === "ironfilingsstand" || kind === "magneticperchsettle") return 11.6 + roll * 8.5;
  return justFinished ? 8.5 + roll * 8.4 : 4.4 + roll * 7.4;
}

export function pickTrick(rand?: number, musicOn?: boolean, lastKind?: GaussDragonTrickKind | string | null) {
  if (musicOn) return "gausshush" as const;
  const roll = rand == null ? Math.random() : rand;
  if (lastKind === "gausshush") {
    if (roll < 0.17) return "filinglinesbandwalk" as const;
    if (roll < 0.33) return "ironfilingsstand" as const;
    if (roll < 0.49) return "fieldlinealign" as const;
    if (roll < 0.65) return "magneticperchsettle" as const;
    if (roll < 0.83) return "filingsweep" as const;
    return "bandclamp" as const;
  }
  if (lastKind === "filinglinesbandwalk") {
    if (roll < 0.16) return "gausshush" as const;
    if (roll < 0.32) return "ironfilingsstand" as const;
    if (roll < 0.48) return "fieldlinealign" as const;
    if (roll < 0.64) return "magneticperchsettle" as const;
    if (roll < 0.82) return "filingsweep" as const;
    return "bandclamp" as const;
  }
  if (lastKind === "ironfilingsstand") {
    if (roll < 0.14) return "gausshush" as const;
    if (roll < 0.3) return "filinglinesbandwalk" as const;
    if (roll < 0.46) return "fieldlinealign" as const;
    if (roll < 0.62) return "magneticperchsettle" as const;
    if (roll < 0.8) return "filingsweep" as const;
    return "bandclamp" as const;
  }
  if (lastKind === "fieldlinealign") {
    if (roll < 0.15) return "gausshush" as const;
    if (roll < 0.31) return "filinglinesbandwalk" as const;
    if (roll < 0.47) return "ironfilingsstand" as const;
    if (roll < 0.63) return "magneticperchsettle" as const;
    if (roll < 0.81) return "filingsweep" as const;
    return "bandclamp" as const;
  }
  if (lastKind === "magneticperchsettle") {
    if (roll < 0.16) return "gausshush" as const;
    if (roll < 0.32) return "filinglinesbandwalk" as const;
    if (roll < 0.48) return "ironfilingsstand" as const;
    if (roll < 0.64) return "fieldlinealign" as const;
    if (roll < 0.82) return "filingsweep" as const;
    return "bandclamp" as const;
  }
  if (lastKind === "filingsweep") {
    if (roll < 0.15) return "gausshush" as const;
    if (roll < 0.31) return "filinglinesbandwalk" as const;
    if (roll < 0.47) return "ironfilingsstand" as const;
    if (roll < 0.63) return "fieldlinealign" as const;
    if (roll < 0.81) return "magneticperchsettle" as const;
    return "bandclamp" as const;
  }
  if (lastKind === "bandclamp") {
    if (roll < 0.16) return "gausshush" as const;
    if (roll < 0.32) return "filinglinesbandwalk" as const;
    if (roll < 0.48) return "ironfilingsstand" as const;
    if (roll < 0.64) return "fieldlinealign" as const;
    if (roll < 0.82) return "magneticperchsettle" as const;
    return "filingsweep" as const;
  }
  if (roll < 0.14) return "gausshush" as const;
  if (roll < 0.28) return "filinglinesbandwalk" as const;
  if (roll < 0.42) return "ironfilingsstand" as const;
  if (roll < 0.56) return "fieldlinealign" as const;
  if (roll < 0.7) return "magneticperchsettle" as const;
  if (roll < 0.85) return "filingsweep" as const;
  return "bandclamp" as const;
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
  return key === TRICK_KEY || key === "gauss";
}

export function startThankYou(
  key: string | undefined | null,
  lastKind: GaussDragonHappyKind | null | undefined,
  x: number,
  facing: 1 | -1,
  flags?: TrickFlags
) {
  if (!wantsThankYou(key)) return null;
  if (!happyCanStart(flags || { cmd: "idle" })) return null;
  const pick = pickHappy(lastKind);
  return { happy: beginHappy(pick, x, facing), kind: pick };
}

export function pickHappy(lastKind?: GaussDragonHappyKind | null, rand?: number) {
  const pool = HAPPY.filter((k) => k !== lastKind);
  const list = pool.length ? pool : [...HAPPY];
  const roll = rand == null ? Math.random() : rand;
  return list[Math.floor(roll * list.length)] || list[0];
}

export function beginHappy(kind: GaussDragonHappyKind | string, x: number, facing: 1 | -1): GaussDragonHappy {
  const name = (HAPPY as readonly string[]).includes(kind) ? (kind as GaussDragonHappyKind) : "densgauss";
  return {
    kind: name,
    happy: true,
    phase: "go",
    t: 0,
    x,
    lift: 0,
    rot: 0,
    anim: (name === "densgauss" ? "sit" : name === "inkgauss" ? "play" : "play") as TrickAnim,
    facing: (facing == null ? 1 : facing) as 1 | -1,
    fromX: x,
  };
}

export function densgaussPose(t: number) {
  const u = Math.max(0, Math.min(1, t / HAPPY_DUR.densgauss));
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

export function inkgaussPose(t: number) {
  const u = Math.max(0, Math.min(1, t / HAPPY_DUR.inkgauss));
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

export function densgaussdragonPose(t: number) {
  return {
    lift: 2.2 + Math.abs(Math.sin(t * 0.58)) * 1.1,
    rot: Math.sin(t * 0.58) * 8,
    dx: Math.sin(t * 0.4) * 0.06,
    anim: "play" as TrickAnim,
  };
}

export function stepHappy(happy: GaussDragonHappy | null | undefined, dt: number, flags?: TrickFlags) {
  if (!happy || happy.phase === "done") return happy;
  if (happyShouldAbort(flags)) {
    return { ...happy, phase: "done" as const, t: 0, lift: 0, rot: 0, anim: "idle" as TrickAnim, abort: true };
  }
  const next = { ...happy, t: happy.t + Math.max(0, dt) };
  const hold = HAPPY_DUR[next.kind];
  if (next.kind === "densgauss") {
    const pose = densgaussPose(next.t);
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "inkgauss") {
    const pose = inkgaussPose(next.t);
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else {
    const pose = densgaussdragonPose(next.t);
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

export function beginTrick(kind: GaussDragonTrickKind | string, x: number, facing: 1 | -1): GaussDragonTrick {
  const k = (TRICKS as readonly string[]).includes(kind) ? (kind as GaussDragonTrickKind) : "gausshush";
  const anim: TrickAnim =
    k === "gausshush"
      ? "sit"
      : k === "filinglinesbandwalk"
        ? "play"
        : k === "bandclamp"
          ? "talk"
          : k === "ironfilingsstand"
            ? "walk"
            : k === "fieldlinealign"
              ? "sit"
              : k === "magneticperchsettle"
                ? "sit"
                : k === "filingsweep"
                  ? "walk"
                  : "sit";
  return {
    kind: k,
    phase: k === "gausshush" ? "hold" : "go",
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

export function gausshushPose(t: number) {
  return {
    lift: 2.4 + Math.abs(Math.sin(t * 0.42)) * 1.2,
    rot: -0.18 + Math.sin(t * 0.36) * 0.35,
  };
}

export function releasePose(t: number) {
  const u = Math.max(0, Math.min(1, t / RELEASE_S));
  return { lift: 2.4 * (1 - Math.sin(u * Math.PI * 0.5)), rot: -0.18 * (1 - u) };
}

export function filinglinesbandwalkPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.filinglinesbandwalk));
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

export function ironfilingsstandPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.ironfilingsstand));
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

export function fieldlinealignPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.fieldlinealign));
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

export function magneticperchsettlePose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.magneticperchsettle));
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

export function filingsweepPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.filingsweep));
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

export function bandclampPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.bandclamp));
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

export function stepTrick(trick: GaussDragonTrick | null | undefined, dt: number, flags?: TrickFlags) {
  if (!trick || trick.phase === "done") return trick;
  if (
    shouldAbort(flags) &&
    trick.kind !== "filinglinesbandwalk" &&
    trick.kind !== "ironfilingsstand" &&
    trick.kind !== "fieldlinealign" &&
    trick.kind !== "magneticperchsettle" &&
    trick.kind !== "filingsweep" &&
    trick.kind !== "bandclamp"
  ) {
    return { ...trick, phase: "done" as const, t: 0, lift: 0, rot: 0, anim: "idle" as TrickAnim, abort: true };
  }
  const next = { ...trick, t: trick.t + Math.max(0, dt) };
  if (next.kind === "gausshush") {
    if (next.t < GAUSSHUSH_HOLD) {
      const pose = gausshushPose(next.t);
      next.phase = "hold";
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = "sit";
      return next;
    }
    if (next.t < GAUSSHUSH_HOLD + RELEASE_S) {
      const pose = releasePose(next.t - GAUSSHUSH_HOLD);
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
  if (next.kind === "filinglinesbandwalk") {
    const pose = filinglinesbandwalkPose(next.t, fromX, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "ironfilingsstand") {
    const pose = ironfilingsstandPose(next.t, fromX, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "fieldlinealign") {
    const pose = fieldlinealignPose(next.t, fromX, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "magneticperchsettle") {
    const pose = magneticperchsettlePose(next.t, fromX, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "filingsweep") {
    const pose = filingsweepPose(next.t, fromX, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else {
    const pose = bandclampPose(next.t, fromX, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  }
  if (u >= 1) return { ...next, phase: "done" as const, lift: 0, rot: 0, anim: "idle" as TrickAnim };
  return next;
}
