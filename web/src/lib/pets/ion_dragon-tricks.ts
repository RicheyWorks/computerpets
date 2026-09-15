/** Ion ground tricks while idle — ultra-polish pass. House neighborly Haze Dragon ion_dragon desk life (ion_dragon / Ion) — paleionhazecling / outlinehazedrift / chargehazeclaim / mistperchsettle / hazeveil / ionbloom / ionhush personality (paleionhazecling pale ion-haze cling without naming pale or ion or haze or cling alone as wait — pale ion-haze cling tell; outlinehazedrift outline haze drift without naming outline or haze or drift alone as wait — outline haze drift tell; chargehazeclaim charge-haze claim without naming charge or haze or claim alone as wait — charge-haze claim tell (distinct from Vesper claim); mistperchsettle mist-perch settle without naming mist or perch or settle alone as wait — mist-perch settle tell; hazeveil haze-veil without naming haze or veil alone as wait — haze veil tell (distinct from Lionfish veil alias); ionbloom ion-bloom without naming ion or bloom alone as wait — ion bloom tell; ionhush ion hush hold (THE ionhush sit_hold tell) — never named wait or crouch or sit or still or ion_dragon or ion or haze as bare ethogram-only trick kinds; Spark spark_dragon owns paleionhazecling? NO — Spark owns crackpointskitter/snoutcrackpop/clawtipcrackle/tailpointperch/fissureflash/tipscorch/sparkhush — do NOT reuse; Flux flux_dragon owns heatfieldclaimwalk/fieldlineshimmer/hideheatbloom/treatyfieldsettle/fieldripple/boundaryglow/fluxhush — do NOT reuse; Trace trace_dragon owns outlinetracepathwalk/dashedlineflicker/cornersnapturn/breadcrumbperch/pathglow/waypointskip/tracehush — do NOT reuse; Volt volt_dragon owns coiledgecharge/windowwireskim/staticfringecrackle/sparkhop/coilwind/coronaflash/volthush — do NOT reuse; Arc cyber_dragon owns arcsparkcoil/circuitridgewalk/databreathshimmer/perchscanblink/gridpulse/packetflick/cyberhush — do NOT reuse; Firefly owns spark alias — do NOT reuse bare spark; Hide grouper owns cavernambushsettle/gulargulpinhale/colorpatternflush/slowcaudalhover/jawsnap/stripeband/epinephelushush — do NOT reuse; Relay owns click/latch/arc/buzz/switch — do NOT reuse bare arc; Fuse owns fuse life — do NOT reuse; Vesper dragon owns sprawl/guard/smolder/claim/fold — do NOT reuse claim; Gauss gauss_dragon next — do NOT start; guest slug Ion / key ion_dragon only for wantsThankYou matching — accept "ion_dragon" and "ion"; do NOT name a trick "ion_dragon" or "ion" or "haze" or "spark_dragon" or "spark" or "crackle" or "flux_dragon" or "flux" or "trace_dragon" or "trace" or "volt_dragon" or "volt" or "cyber_dragon" or "arc" or "grouper" or "hide" or "relay" or "fuse" or "dragon" or "vesper" or "firefly" or "gauss" or "veil"; not Spark Crack Dragon life, not Flux Field Dragon life, not Trace Path Dragon life, not Volt Coil Dragon life, not Arc Grid Dragon life, not Firefly life, not Hide Epinephelus life, not Relay click/latch life, not Fuse life, not Vesper dragon life, not Gauss life, not Rui. Paleionhazecling / outlinehazedrift / chargehazeclaim / mistperchsettle / hazeveil / ionbloom / ionhush; dension / inkion / densiondragon thank-yous. Same map as desktop ion_dragon-tricks.js. Window-play unchanged. Ethogram softs + freeze — never names haze/still/watch/wait/ion_dragon as bare ethogram-only trick kinds. True Haze Dragon ion_dragon desk life only — pale ion-haze cling, outline haze drift, charge-haze claim, mist-perch settle, haze veil, ion bloom, ion hush. Next house-order ultra: Gauss / gauss_dragon. No cry inventing — ion_dragon.wav EXISTS so prefersHouseCry adds ion_dragon after spark_dragon. Amplitudes raised toward Rui richness; denser waits/weights; IONHUSH_HOLD=11.2 RELEASE_S=1.18 (not 37.68/2.74). Catalog 221. */
export const TRICK_KEY = "ion_dragon";
export const TRICKS = ["paleionhazecling", "outlinehazedrift", "chargehazeclaim", "mistperchsettle", "hazeveil", "ionbloom", "ionhush"] as const;
export const HAPPY = ["dension", "inkion", "densiondragon"] as const;
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

export const HAPPY_DUR = { dension: 1.70, inkion: 1.84, densiondragon: 1.76 } as const;
export const IONHUSH_HOLD = 11.2;
export const RELEASE_S = 1.18;
export const DUR = {
  ionhush: IONHUSH_HOLD + RELEASE_S,
  paleionhazecling: 2.48,
  outlinehazedrift: 2.42,
  chargehazeclaim: 2.40,
  mistperchsettle: 2.44,
  hazeveil: 2.38,
  ionbloom: 2.56,
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

export function nextTrickWait(justFinished: boolean, rand?: number, kind?: IonDragonTrickKind | string) {
  const roll = rand == null ? Math.random() : rand;
  if (kind === "ionhush") return 40 + roll * 26;
  if (kind === "hazeveil" || kind === "ionbloom" || kind === "paleionhazecling") return 12.8 + roll * 9.4;
  if (kind === "chargehazeclaim" || kind === "outlinehazedrift" || kind === "mistperchsettle") return 11.6 + roll * 8.5;
  return justFinished ? 8.5 + roll * 8.4 : 4.4 + roll * 7.4;
}

export function pickTrick(rand?: number, musicOn?: boolean, lastKind?: IonDragonTrickKind | string | null) {
  if (musicOn) return "ionhush" as const;
  const roll = rand == null ? Math.random() : rand;
  if (lastKind === "ionhush") {
    if (roll < 0.17) return "paleionhazecling" as const;
    if (roll < 0.33) return "outlinehazedrift" as const;
    if (roll < 0.49) return "chargehazeclaim" as const;
    if (roll < 0.65) return "mistperchsettle" as const;
    if (roll < 0.83) return "hazeveil" as const;
    return "ionbloom" as const;
  }
  if (lastKind === "paleionhazecling") {
    if (roll < 0.16) return "ionhush" as const;
    if (roll < 0.32) return "outlinehazedrift" as const;
    if (roll < 0.48) return "chargehazeclaim" as const;
    if (roll < 0.64) return "mistperchsettle" as const;
    if (roll < 0.82) return "hazeveil" as const;
    return "ionbloom" as const;
  }
  if (lastKind === "outlinehazedrift") {
    if (roll < 0.14) return "ionhush" as const;
    if (roll < 0.3) return "paleionhazecling" as const;
    if (roll < 0.46) return "chargehazeclaim" as const;
    if (roll < 0.62) return "mistperchsettle" as const;
    if (roll < 0.8) return "hazeveil" as const;
    return "ionbloom" as const;
  }
  if (lastKind === "chargehazeclaim") {
    if (roll < 0.15) return "ionhush" as const;
    if (roll < 0.31) return "paleionhazecling" as const;
    if (roll < 0.47) return "outlinehazedrift" as const;
    if (roll < 0.63) return "mistperchsettle" as const;
    if (roll < 0.81) return "hazeveil" as const;
    return "ionbloom" as const;
  }
  if (lastKind === "mistperchsettle") {
    if (roll < 0.16) return "ionhush" as const;
    if (roll < 0.32) return "paleionhazecling" as const;
    if (roll < 0.48) return "outlinehazedrift" as const;
    if (roll < 0.64) return "chargehazeclaim" as const;
    if (roll < 0.82) return "hazeveil" as const;
    return "ionbloom" as const;
  }
  if (lastKind === "hazeveil") {
    if (roll < 0.15) return "ionhush" as const;
    if (roll < 0.31) return "paleionhazecling" as const;
    if (roll < 0.47) return "outlinehazedrift" as const;
    if (roll < 0.63) return "chargehazeclaim" as const;
    if (roll < 0.81) return "mistperchsettle" as const;
    return "ionbloom" as const;
  }
  if (lastKind === "ionbloom") {
    if (roll < 0.16) return "ionhush" as const;
    if (roll < 0.32) return "paleionhazecling" as const;
    if (roll < 0.48) return "outlinehazedrift" as const;
    if (roll < 0.64) return "chargehazeclaim" as const;
    if (roll < 0.82) return "mistperchsettle" as const;
    return "hazeveil" as const;
  }
  if (roll < 0.14) return "ionhush" as const;
  if (roll < 0.28) return "paleionhazecling" as const;
  if (roll < 0.42) return "outlinehazedrift" as const;
  if (roll < 0.56) return "chargehazeclaim" as const;
  if (roll < 0.7) return "mistperchsettle" as const;
  if (roll < 0.85) return "hazeveil" as const;
  return "ionbloom" as const;
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
  return key === TRICK_KEY || key === "ion";
}

export function startThankYou(
  key: string | undefined | null,
  lastKind: IonDragonHappyKind | null | undefined,
  x: number,
  facing: 1 | -1,
  flags?: TrickFlags
) {
  if (!wantsThankYou(key)) return null;
  if (!happyCanStart(flags || { cmd: "idle" })) return null;
  const pick = pickHappy(lastKind);
  return { happy: beginHappy(pick, x, facing), kind: pick };
}

export function pickHappy(lastKind?: IonDragonHappyKind | null, rand?: number) {
  const pool = HAPPY.filter((k) => k !== lastKind);
  const list = pool.length ? pool : [...HAPPY];
  const roll = rand == null ? Math.random() : rand;
  return list[Math.floor(roll * list.length)] || list[0];
}

export function beginHappy(kind: IonDragonHappyKind | string, x: number, facing: 1 | -1): IonDragonHappy {
  const name = (HAPPY as readonly string[]).includes(kind) ? (kind as IonDragonHappyKind) : "dension";
  return {
    kind: name,
    happy: true,
    phase: "go",
    t: 0,
    x,
    lift: 0,
    rot: 0,
    anim: (name === "dension" ? "sit" : name === "inkion" ? "play" : "play") as TrickAnim,
    facing: (facing == null ? 1 : facing) as 1 | -1,
    fromX: x,
  };
}

export function densionPose(t: number) {
  const u = Math.max(0, Math.min(1, t / HAPPY_DUR.dension));
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

export function inkionPose(t: number) {
  const u = Math.max(0, Math.min(1, t / HAPPY_DUR.inkion));
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

export function densiondragonPose(t: number) {
  return {
    lift: 2.2 + Math.abs(Math.sin(t * 0.58)) * 1.1,
    rot: Math.sin(t * 0.58) * 8,
    dx: Math.sin(t * 0.4) * 0.06,
    anim: "play" as TrickAnim,
  };
}

export function stepHappy(happy: IonDragonHappy | null | undefined, dt: number, flags?: TrickFlags) {
  if (!happy || happy.phase === "done") return happy;
  if (happyShouldAbort(flags)) {
    return { ...happy, phase: "done" as const, t: 0, lift: 0, rot: 0, anim: "idle" as TrickAnim, abort: true };
  }
  const next = { ...happy, t: happy.t + Math.max(0, dt) };
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
  if (next.t >= hold) return { ...next, phase: "done" as const, lift: 0, rot: 0, anim: "idle" as TrickAnim };
  return next;
}

export function sleepHoldFrame(_key?: string | null, _frameCount?: number) {
  return null;
}

export function beginTrick(kind: IonDragonTrickKind | string, x: number, facing: 1 | -1): IonDragonTrick {
  const k = (TRICKS as readonly string[]).includes(kind) ? (kind as IonDragonTrickKind) : "ionhush";
  const anim: TrickAnim =
    k === "ionhush"
      ? "sit"
      : k === "paleionhazecling"
        ? "play"
        : k === "ionbloom"
          ? "talk"
          : k === "outlinehazedrift"
            ? "walk"
            : k === "chargehazeclaim"
              ? "sit"
              : k === "mistperchsettle"
                ? "sit"
                : k === "hazeveil"
                  ? "walk"
                  : "sit";
  return {
    kind: k,
    phase: k === "ionhush" ? "hold" : "go",
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

export function ionhushPose(t: number) {
  return {
    lift: 2.4 + Math.abs(Math.sin(t * 0.42)) * 1.2,
    rot: -0.18 + Math.sin(t * 0.36) * 0.35,
  };
}

export function releasePose(t: number) {
  const u = Math.max(0, Math.min(1, t / RELEASE_S));
  return { lift: 2.4 * (1 - Math.sin(u * Math.PI * 0.5)), rot: -0.18 * (1 - u) };
}

export function paleionhazeclingPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.paleionhazecling));
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

export function outlinehazedriftPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.outlinehazedrift));
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

export function chargehazeclaimPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.chargehazeclaim));
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

export function mistperchsettlePose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.mistperchsettle));
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

export function hazeveilPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.hazeveil));
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

export function ionbloomPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.ionbloom));
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

export function stepTrick(trick: IonDragonTrick | null | undefined, dt: number, flags?: TrickFlags) {
  if (!trick || trick.phase === "done") return trick;
  if (
    shouldAbort(flags) &&
    trick.kind !== "paleionhazecling" &&
    trick.kind !== "outlinehazedrift" &&
    trick.kind !== "chargehazeclaim" &&
    trick.kind !== "mistperchsettle" &&
    trick.kind !== "hazeveil" &&
    trick.kind !== "ionbloom"
  ) {
    return { ...trick, phase: "done" as const, t: 0, lift: 0, rot: 0, anim: "idle" as TrickAnim, abort: true };
  }
  const next = { ...trick, t: trick.t + Math.max(0, dt) };
  if (next.kind === "ionhush") {
    if (next.t < IONHUSH_HOLD) {
      const pose = ionhushPose(next.t);
      next.phase = "hold";
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = "sit";
      return next;
    }
    if (next.t < IONHUSH_HOLD + RELEASE_S) {
      const pose = releasePose(next.t - IONHUSH_HOLD);
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
  if (next.kind === "paleionhazecling") {
    const pose = paleionhazeclingPose(next.t, fromX, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "outlinehazedrift") {
    const pose = outlinehazedriftPose(next.t, fromX, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "chargehazeclaim") {
    const pose = chargehazeclaimPose(next.t, fromX, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "mistperchsettle") {
    const pose = mistperchsettlePose(next.t, fromX, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "hazeveil") {
    const pose = hazeveilPose(next.t, fromX, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else {
    const pose = ionbloomPose(next.t, fromX, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  }
  if (u >= 1) return { ...next, phase: "done" as const, lift: 0, rot: 0, anim: "idle" as TrickAnim };
  return next;
}
