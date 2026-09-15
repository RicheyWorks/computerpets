/** Volt ground tricks while idle — ultra-polish pass. House neighborly Coil Dragon volt_dragon desk life (volt_dragon / Volt) — coiledgecharge / windowwireskim / staticfringecrackle / sparkhop / coilwind / coronaflash / volthush personality (coiledgecharge coil-edge charge without naming coil or edge or charge alone as wait — coil-edge charge tell (distinct from Arc arcsparkcoil and Spark later); windowwireskim window-wire skim without naming window or wire or skim alone as wait — desk-wire skim tell; staticfringecrackle static-fringe crackle without naming static or fringe or crackle alone as wait — fringe static crackle tell; sparkhop spark-hop without naming spark or hop alone as wait — coil spark hop tell (distinct from Spark spark_dragon later); coilwind coil-wind without naming coil or wind alone as wait — coil body wind tell; coronaflash corona-flash without naming corona or flash alone as wait — corona fringe flash tell; volthush volt hush hold (THE volthush sit_hold tell) — never named wait or crouch or sit or still or volt_dragon or volt as bare ethogram-only trick kinds; Arc cyber_dragon owns arcsparkcoil/circuitridgewalk/databreathshimmer/perchscanblink/gridpulse/packetflick/cyberhush — do NOT reuse; Hide grouper owns cavernambushsettle/gulargulpinhale/colorpatternflush/slowcaudalhover/jawsnap/stripeband/epinephelushush — do NOT reuse; Relay owns click/latch/arc/buzz/switch — do NOT reuse bare arc; Vesper dragon owns sprawl/guard/smolder/claim/fold — do NOT reuse; Spark spark_dragon later — do NOT collide bare spark; Trace trace_dragon next — do NOT start; guest slug Volt / key volt_dragon only for wantsThankYou matching — accept "volt_dragon" and "volt"; do NOT name a trick "volt_dragon" or "volt" or "cyber_dragon" or "arc" or "grouper" or "hide" or "relay" or "dragon" or "vesper" or "spark" or "trace"; not Arc Grid Dragon life, not Hide Epinephelus life, not Relay click/latch life, not Vesper dragon life, not Spark life, not Trace life, not Rui. Coiledgecharge / windowwireskim / staticfringecrackle / sparkhop / coilwind / coronaflash / volthush; densvolt / inkvolt / densvoltdragon thank-yous. Same map as desktop volt_dragon-tricks.js. Window-play unchanged. Ethogram softs + freeze — never names current/still/watch/wait/volt_dragon as bare ethogram-only trick kinds. True Coil Dragon volt_dragon desk life only — coil-edge charge, window-wire skim, static-fringe crackle, spark hop, coil wind, corona flash, volt hush. Next house-order ultra: Trace / trace_dragon. No cry inventing — volt_dragon.wav EXISTS so prefersHouseCry adds volt_dragon after cyber_dragon. Amplitudes raised toward Rui richness; denser waits/weights; VOLTHUSH_HOLD=11.2 RELEASE_S=1.18 (not 36.42/2.71). Catalog 221. */
export const TRICK_KEY = "volt_dragon";
export const TRICKS = ["coiledgecharge", "windowwireskim", "staticfringecrackle", "sparkhop", "coilwind", "coronaflash", "volthush"] as const;
export const HAPPY = ["densvolt", "inkvolt", "densvoltdragon"] as const;
export type VoltDragonTrickKind = (typeof TRICKS)[number];
export type VoltDragonHappyKind = (typeof HAPPY)[number];
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

export type VoltDragonTrick = {
  kind: VoltDragonTrickKind;
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

export type VoltDragonHappy = {
  kind: VoltDragonHappyKind;
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

export const HAPPY_DUR = { densvolt: 1.70, inkvolt: 1.84, densvoltdragon: 1.76 } as const;
export const VOLTHUSH_HOLD = 11.2;
export const RELEASE_S = 1.18;
export const DUR = {
  volthush: VOLTHUSH_HOLD + RELEASE_S,
  coiledgecharge: 2.48,
  windowwireskim: 2.42,
  staticfringecrackle: 2.40,
  sparkhop: 2.44,
  coilwind: 2.38,
  coronaflash: 2.56,
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

export function nextTrickWait(justFinished: boolean, rand?: number, kind?: VoltDragonTrickKind | string) {
  const roll = rand == null ? Math.random() : rand;
  if (kind === "volthush") return 40 + roll * 26;
  if (kind === "coilwind" || kind === "coronaflash" || kind === "coiledgecharge") return 12.8 + roll * 9.4;
  if (kind === "staticfringecrackle" || kind === "windowwireskim" || kind === "sparkhop") return 11.6 + roll * 8.5;
  return justFinished ? 8.5 + roll * 8.4 : 4.4 + roll * 7.4;
}

export function pickTrick(rand?: number, musicOn?: boolean, lastKind?: VoltDragonTrickKind | string | null) {
  if (musicOn) return "volthush" as const;
  const roll = rand == null ? Math.random() : rand;
  if (lastKind === "volthush") {
    if (roll < 0.17) return "coiledgecharge" as const;
    if (roll < 0.33) return "windowwireskim" as const;
    if (roll < 0.49) return "staticfringecrackle" as const;
    if (roll < 0.65) return "sparkhop" as const;
    if (roll < 0.83) return "coilwind" as const;
    return "coronaflash" as const;
  }
  if (lastKind === "coiledgecharge") {
    if (roll < 0.16) return "volthush" as const;
    if (roll < 0.32) return "windowwireskim" as const;
    if (roll < 0.48) return "staticfringecrackle" as const;
    if (roll < 0.64) return "sparkhop" as const;
    if (roll < 0.82) return "coilwind" as const;
    return "coronaflash" as const;
  }
  if (lastKind === "windowwireskim") {
    if (roll < 0.14) return "volthush" as const;
    if (roll < 0.3) return "coiledgecharge" as const;
    if (roll < 0.46) return "staticfringecrackle" as const;
    if (roll < 0.62) return "sparkhop" as const;
    if (roll < 0.8) return "coilwind" as const;
    return "coronaflash" as const;
  }
  if (lastKind === "staticfringecrackle") {
    if (roll < 0.15) return "volthush" as const;
    if (roll < 0.31) return "coiledgecharge" as const;
    if (roll < 0.47) return "windowwireskim" as const;
    if (roll < 0.63) return "sparkhop" as const;
    if (roll < 0.81) return "coilwind" as const;
    return "coronaflash" as const;
  }
  if (lastKind === "sparkhop") {
    if (roll < 0.16) return "volthush" as const;
    if (roll < 0.32) return "coiledgecharge" as const;
    if (roll < 0.48) return "windowwireskim" as const;
    if (roll < 0.64) return "staticfringecrackle" as const;
    if (roll < 0.82) return "coilwind" as const;
    return "coronaflash" as const;
  }
  if (lastKind === "coilwind") {
    if (roll < 0.15) return "volthush" as const;
    if (roll < 0.31) return "coiledgecharge" as const;
    if (roll < 0.47) return "windowwireskim" as const;
    if (roll < 0.63) return "staticfringecrackle" as const;
    if (roll < 0.81) return "sparkhop" as const;
    return "coronaflash" as const;
  }
  if (lastKind === "coronaflash") {
    if (roll < 0.16) return "volthush" as const;
    if (roll < 0.32) return "coiledgecharge" as const;
    if (roll < 0.48) return "windowwireskim" as const;
    if (roll < 0.64) return "staticfringecrackle" as const;
    if (roll < 0.82) return "sparkhop" as const;
    return "coilwind" as const;
  }
  if (roll < 0.14) return "volthush" as const;
  if (roll < 0.28) return "coiledgecharge" as const;
  if (roll < 0.42) return "windowwireskim" as const;
  if (roll < 0.56) return "staticfringecrackle" as const;
  if (roll < 0.7) return "sparkhop" as const;
  if (roll < 0.85) return "coilwind" as const;
  return "coronaflash" as const;
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
  return key === TRICK_KEY || key === "volt";
}

export function startThankYou(
  key: string | undefined | null,
  lastKind: VoltDragonHappyKind | null | undefined,
  x: number,
  facing: 1 | -1,
  flags?: TrickFlags
) {
  if (!wantsThankYou(key)) return null;
  if (!happyCanStart(flags || { cmd: "idle" })) return null;
  const pick = pickHappy(lastKind);
  return { happy: beginHappy(pick, x, facing), kind: pick };
}

export function pickHappy(lastKind?: VoltDragonHappyKind | null, rand?: number) {
  const pool = HAPPY.filter((k) => k !== lastKind);
  const list = pool.length ? pool : [...HAPPY];
  const roll = rand == null ? Math.random() : rand;
  return list[Math.floor(roll * list.length)] || list[0];
}

export function beginHappy(kind: VoltDragonHappyKind | string, x: number, facing: 1 | -1): VoltDragonHappy {
  const name = (HAPPY as readonly string[]).includes(kind) ? (kind as VoltDragonHappyKind) : "densvolt";
  return {
    kind: name,
    happy: true,
    phase: "go",
    t: 0,
    x,
    lift: 0,
    rot: 0,
    anim: (name === "densvolt" ? "sit" : name === "inkvolt" ? "play" : "play") as TrickAnim,
    facing: (facing == null ? 1 : facing) as 1 | -1,
    fromX: x,
  };
}

export function densvoltPose(t: number) {
  const u = Math.max(0, Math.min(1, t / HAPPY_DUR.densvolt));
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

export function inkvoltPose(t: number) {
  const u = Math.max(0, Math.min(1, t / HAPPY_DUR.inkvolt));
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

export function densvoltdragonPose(t: number) {
  return {
    lift: 2.2 + Math.abs(Math.sin(t * 0.58)) * 1.1,
    rot: Math.sin(t * 0.58) * 8,
    dx: Math.sin(t * 0.4) * 0.06,
    anim: "play" as TrickAnim,
  };
}

export function stepHappy(happy: VoltDragonHappy | null | undefined, dt: number, flags?: TrickFlags) {
  if (!happy || happy.phase === "done") return happy;
  if (happyShouldAbort(flags)) {
    return { ...happy, phase: "done" as const, t: 0, lift: 0, rot: 0, anim: "idle" as TrickAnim, abort: true };
  }
  const next = { ...happy, t: happy.t + Math.max(0, dt) };
  const hold = HAPPY_DUR[next.kind];
  if (next.kind === "densvolt") {
    const pose = densvoltPose(next.t);
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "inkvolt") {
    const pose = inkvoltPose(next.t);
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else {
    const pose = densvoltdragonPose(next.t);
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

export function beginTrick(kind: VoltDragonTrickKind | string, x: number, facing: 1 | -1): VoltDragonTrick {
  const k = (TRICKS as readonly string[]).includes(kind) ? (kind as VoltDragonTrickKind) : "volthush";
  const anim: TrickAnim =
    k === "volthush"
      ? "sit"
      : k === "coiledgecharge"
        ? "play"
        : k === "coronaflash"
          ? "talk"
          : k === "windowwireskim"
            ? "walk"
            : k === "staticfringecrackle"
              ? "sit"
              : k === "sparkhop"
                ? "sit"
                : k === "coilwind"
                  ? "walk"
                  : "sit";
  return {
    kind: k,
    phase: k === "volthush" ? "hold" : "go",
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

export function volthushPose(t: number) {
  return {
    lift: 2.4 + Math.abs(Math.sin(t * 0.42)) * 1.2,
    rot: -0.18 + Math.sin(t * 0.36) * 0.35,
  };
}

export function releasePose(t: number) {
  const u = Math.max(0, Math.min(1, t / RELEASE_S));
  return { lift: 2.4 * (1 - Math.sin(u * Math.PI * 0.5)), rot: -0.18 * (1 - u) };
}

export function coiledgechargePose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.coiledgecharge));
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

export function windowwireskimPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.windowwireskim));
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

export function staticfringecracklePose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.staticfringecrackle));
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

export function sparkhopPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.sparkhop));
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

export function coilwindPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.coilwind));
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

export function coronaflashPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.coronaflash));
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

export function stepTrick(trick: VoltDragonTrick | null | undefined, dt: number, flags?: TrickFlags) {
  if (!trick || trick.phase === "done") return trick;
  if (
    shouldAbort(flags) &&
    trick.kind !== "coiledgecharge" &&
    trick.kind !== "windowwireskim" &&
    trick.kind !== "staticfringecrackle" &&
    trick.kind !== "sparkhop" &&
    trick.kind !== "coilwind" &&
    trick.kind !== "coronaflash"
  ) {
    return { ...trick, phase: "done" as const, t: 0, lift: 0, rot: 0, anim: "idle" as TrickAnim, abort: true };
  }
  const next = { ...trick, t: trick.t + Math.max(0, dt) };
  if (next.kind === "volthush") {
    if (next.t < VOLTHUSH_HOLD) {
      const pose = volthushPose(next.t);
      next.phase = "hold";
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = "sit";
      return next;
    }
    if (next.t < VOLTHUSH_HOLD + RELEASE_S) {
      const pose = releasePose(next.t - VOLTHUSH_HOLD);
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
  if (next.kind === "coiledgecharge") {
    const pose = coiledgechargePose(next.t, fromX, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "windowwireskim") {
    const pose = windowwireskimPose(next.t, fromX, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "staticfringecrackle") {
    const pose = staticfringecracklePose(next.t, fromX, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "sparkhop") {
    const pose = sparkhopPose(next.t, fromX, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "coilwind") {
    const pose = coilwindPose(next.t, fromX, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else {
    const pose = coronaflashPose(next.t, fromX, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  }
  if (u >= 1) return { ...next, phase: "done" as const, lift: 0, rot: 0, anim: "idle" as TrickAnim };
  return next;
}
