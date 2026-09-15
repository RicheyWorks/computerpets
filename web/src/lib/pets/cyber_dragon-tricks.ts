/** Arc ground tricks while idle — ultra-polish pass. House neighborly Grid Dragon cyber_dragon desk life (cyber_dragon / Arc) — arcsparkcoil / circuitridgewalk / databreathshimmer / perchscanblink / gridpulse / packetflick / cyberhush personality (arcsparkcoil arc-spark coil without naming arc or spark or coil alone as wait — ridge-spark coil tell (distinct from Relay bare arc and Volt coiledgecharge); circuitridgewalk circuit-ridge walk without naming circuit or ridge or walk alone as wait — desk-ridge circuit pace tell; databreathshimmer data-breath shimmer without naming data or breath or shimmer alone as wait — packet-breath shimmer tell; perchscanblink perch-scan blink without naming perch or scan or blink alone as wait — perch optic scan tell; gridpulse grid-pulse without naming grid or pulse alone as wait — chassis grid pulse tell; packetflick packet-flick without naming packet or flick alone as wait — data-packet flick tell; cyberhush cyber hush hold (THE cyberhush sit_hold tell) — never named wait or crouch or sit or still or cyber_dragon or arc as bare ethogram-only trick kinds; Hide grouper owns cavernambushsettle/gulargulpinhale/colorpatternflush/slowcaudalhover/jawsnap/stripeband/epinephelushush — do NOT reuse; Relay owns click/latch/arc/buzz/switch — do NOT reuse bare arc; Vesper dragon owns sprawl/guard/smolder/claim/fold — do NOT reuse; Volt volt_dragon owns coiledgecharge/windowwireskim/staticfringecrackle/sparkhop/coilwind/coronaflash/volthush — do NOT start; guest slug Arc / key cyber_dragon only for wantsThankYou matching — accept "cyber_dragon" and "arc"; do NOT name a trick "cyber_dragon" or "arc" or "grouper" or "hide" or "volt_dragon" or "volt" or "relay" or "dragon" or "vesper"; not Hide Epinephelus life, not Relay click/latch life, not Vesper dragon life, not Volt volt_dragon life, not Rui. Arcsparkcoil / circuitridgewalk / databreathshimmer / perchscanblink / gridpulse / packetflick / cyberhush; densarc / inkarc / denscyber thank-yous. Same map as desktop cyber_dragon-tricks.js. Window-play unchanged. Ethogram softs + freeze — never names arc/still/watch/wait/cyber_dragon as bare ethogram-only trick kinds (Relay owns bare arc). True Grid Dragon cyber_dragon desk life only — arc-spark coil, circuit-ridge walk, data-breath shimmer, perch-scan blink, grid pulse, packet flick, cyber hush. Next house-order ultra: Trace / trace_dragon (Volt landed). No cry inventing — cyber_dragon.wav EXISTS so prefersHouseCry adds cyber_dragon after grouper. Amplitudes raised toward Rui richness; denser waits/weights; CYBERHUSH_HOLD=11.2 RELEASE_S=1.18 (not 35.18/2.67). Catalog 221. */
export const TRICK_KEY = "cyber_dragon";
export const TRICKS = ["arcsparkcoil", "circuitridgewalk", "databreathshimmer", "perchscanblink", "gridpulse", "packetflick", "cyberhush"] as const;
export const HAPPY = ["densarc", "inkarc", "denscyber"] as const;
export type CyberDragonTrickKind = (typeof TRICKS)[number];
export type CyberDragonHappyKind = (typeof HAPPY)[number];
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

export type CyberDragonTrick = {
  kind: CyberDragonTrickKind;
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

export type CyberDragonHappy = {
  kind: CyberDragonHappyKind;
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

export const HAPPY_DUR = { densarc: 1.70, inkarc: 1.84, denscyber: 1.76 } as const;
export const CYBERHUSH_HOLD = 11.2;
export const RELEASE_S = 1.18;
export const DUR = {
  cyberhush: CYBERHUSH_HOLD + RELEASE_S,
  arcsparkcoil: 2.48,
  circuitridgewalk: 2.42,
  databreathshimmer: 2.40,
  perchscanblink: 2.44,
  gridpulse: 2.38,
  packetflick: 2.56,
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

export function nextTrickWait(justFinished: boolean, rand?: number, kind?: CyberDragonTrickKind | string) {
  const roll = rand == null ? Math.random() : rand;
  if (kind === "cyberhush") return 40 + roll * 26;
  if (kind === "gridpulse" || kind === "packetflick" || kind === "arcsparkcoil") return 12.8 + roll * 9.4;
  if (kind === "databreathshimmer" || kind === "circuitridgewalk" || kind === "perchscanblink") return 11.6 + roll * 8.5;
  return justFinished ? 8.5 + roll * 8.4 : 4.4 + roll * 7.4;
}

export function pickTrick(rand?: number, musicOn?: boolean, lastKind?: CyberDragonTrickKind | string | null) {
  if (musicOn) return "cyberhush" as const;
  const roll = rand == null ? Math.random() : rand;
  if (lastKind === "cyberhush") {
    if (roll < 0.17) return "arcsparkcoil" as const;
    if (roll < 0.33) return "circuitridgewalk" as const;
    if (roll < 0.49) return "databreathshimmer" as const;
    if (roll < 0.65) return "perchscanblink" as const;
    if (roll < 0.83) return "gridpulse" as const;
    return "packetflick" as const;
  }
  if (lastKind === "arcsparkcoil") {
    if (roll < 0.16) return "cyberhush" as const;
    if (roll < 0.32) return "circuitridgewalk" as const;
    if (roll < 0.48) return "databreathshimmer" as const;
    if (roll < 0.64) return "perchscanblink" as const;
    if (roll < 0.82) return "gridpulse" as const;
    return "packetflick" as const;
  }
  if (lastKind === "circuitridgewalk") {
    if (roll < 0.14) return "cyberhush" as const;
    if (roll < 0.3) return "arcsparkcoil" as const;
    if (roll < 0.46) return "databreathshimmer" as const;
    if (roll < 0.62) return "perchscanblink" as const;
    if (roll < 0.8) return "gridpulse" as const;
    return "packetflick" as const;
  }
  if (lastKind === "databreathshimmer") {
    if (roll < 0.15) return "cyberhush" as const;
    if (roll < 0.31) return "arcsparkcoil" as const;
    if (roll < 0.47) return "circuitridgewalk" as const;
    if (roll < 0.63) return "perchscanblink" as const;
    if (roll < 0.81) return "gridpulse" as const;
    return "packetflick" as const;
  }
  if (lastKind === "perchscanblink") {
    if (roll < 0.16) return "cyberhush" as const;
    if (roll < 0.32) return "arcsparkcoil" as const;
    if (roll < 0.48) return "circuitridgewalk" as const;
    if (roll < 0.64) return "databreathshimmer" as const;
    if (roll < 0.82) return "gridpulse" as const;
    return "packetflick" as const;
  }
  if (lastKind === "gridpulse") {
    if (roll < 0.15) return "cyberhush" as const;
    if (roll < 0.31) return "arcsparkcoil" as const;
    if (roll < 0.47) return "circuitridgewalk" as const;
    if (roll < 0.63) return "databreathshimmer" as const;
    if (roll < 0.81) return "perchscanblink" as const;
    return "packetflick" as const;
  }
  if (lastKind === "packetflick") {
    if (roll < 0.16) return "cyberhush" as const;
    if (roll < 0.32) return "arcsparkcoil" as const;
    if (roll < 0.48) return "circuitridgewalk" as const;
    if (roll < 0.64) return "databreathshimmer" as const;
    if (roll < 0.82) return "perchscanblink" as const;
    return "gridpulse" as const;
  }
  if (roll < 0.14) return "cyberhush" as const;
  if (roll < 0.28) return "arcsparkcoil" as const;
  if (roll < 0.42) return "circuitridgewalk" as const;
  if (roll < 0.56) return "databreathshimmer" as const;
  if (roll < 0.7) return "perchscanblink" as const;
  if (roll < 0.85) return "gridpulse" as const;
  return "packetflick" as const;
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
  return key === TRICK_KEY || key === "arc";
}

export function startThankYou(
  key: string | undefined | null,
  lastKind: CyberDragonHappyKind | null | undefined,
  x: number,
  facing: 1 | -1,
  flags?: TrickFlags
) {
  if (!wantsThankYou(key)) return null;
  if (!happyCanStart(flags || { cmd: "idle" })) return null;
  const pick = pickHappy(lastKind);
  return { happy: beginHappy(pick, x, facing), kind: pick };
}

export function pickHappy(lastKind?: CyberDragonHappyKind | null, rand?: number) {
  const pool = HAPPY.filter((k) => k !== lastKind);
  const list = pool.length ? pool : [...HAPPY];
  const roll = rand == null ? Math.random() : rand;
  return list[Math.floor(roll * list.length)] || list[0];
}

export function beginHappy(kind: CyberDragonHappyKind | string, x: number, facing: 1 | -1): CyberDragonHappy {
  const name = (HAPPY as readonly string[]).includes(kind) ? (kind as CyberDragonHappyKind) : "densarc";
  return {
    kind: name,
    happy: true,
    phase: "go",
    t: 0,
    x,
    lift: 0,
    rot: 0,
    anim: (name === "densarc" ? "sit" : name === "inkarc" ? "play" : "play") as TrickAnim,
    facing: (facing == null ? 1 : facing) as 1 | -1,
    fromX: x,
  };
}

export function densarcPose(t: number) {
  const u = Math.max(0, Math.min(1, t / HAPPY_DUR.densarc));
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

export function inkarcPose(t: number) {
  const u = Math.max(0, Math.min(1, t / HAPPY_DUR.inkarc));
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

export function denscyberPose(t: number) {
  return {
    lift: 2.2 + Math.abs(Math.sin(t * 0.58)) * 1.1,
    rot: Math.sin(t * 0.58) * 8,
    dx: Math.sin(t * 0.4) * 0.06,
    anim: "play" as TrickAnim,
  };
}

export function stepHappy(happy: CyberDragonHappy | null | undefined, dt: number, flags?: TrickFlags) {
  if (!happy || happy.phase === "done") return happy;
  if (happyShouldAbort(flags)) {
    return { ...happy, phase: "done" as const, t: 0, lift: 0, rot: 0, anim: "idle" as TrickAnim, abort: true };
  }
  const next = { ...happy, t: happy.t + Math.max(0, dt) };
  const hold = HAPPY_DUR[next.kind];
  if (next.kind === "densarc") {
    const pose = densarcPose(next.t);
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "inkarc") {
    const pose = inkarcPose(next.t);
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else {
    const pose = denscyberPose(next.t);
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

export function beginTrick(kind: CyberDragonTrickKind | string, x: number, facing: 1 | -1): CyberDragonTrick {
  const k = (TRICKS as readonly string[]).includes(kind) ? (kind as CyberDragonTrickKind) : "cyberhush";
  const anim: TrickAnim =
    k === "cyberhush"
      ? "sit"
      : k === "arcsparkcoil"
        ? "play"
        : k === "packetflick"
          ? "talk"
          : k === "circuitridgewalk"
            ? "walk"
            : k === "databreathshimmer"
              ? "sit"
              : k === "perchscanblink"
                ? "sit"
                : k === "gridpulse"
                  ? "walk"
                  : "sit";
  return {
    kind: k,
    phase: k === "cyberhush" ? "hold" : "go",
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

export function cyberhushPose(t: number) {
  return {
    lift: 2.4 + Math.abs(Math.sin(t * 0.42)) * 1.2,
    rot: -0.18 + Math.sin(t * 0.36) * 0.35,
  };
}

export function releasePose(t: number) {
  const u = Math.max(0, Math.min(1, t / RELEASE_S));
  return { lift: 2.4 * (1 - Math.sin(u * Math.PI * 0.5)), rot: -0.18 * (1 - u) };
}

export function arcsparkcoilPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.arcsparkcoil));
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

export function circuitridgewalkPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.circuitridgewalk));
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

export function databreathshimmerPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.databreathshimmer));
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

export function perchscanblinkPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.perchscanblink));
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

export function gridpulsePose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.gridpulse));
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

export function packetflickPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.packetflick));
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

export function stepTrick(trick: CyberDragonTrick | null | undefined, dt: number, flags?: TrickFlags) {
  if (!trick || trick.phase === "done") return trick;
  if (
    shouldAbort(flags) &&
    trick.kind !== "arcsparkcoil" &&
    trick.kind !== "circuitridgewalk" &&
    trick.kind !== "databreathshimmer" &&
    trick.kind !== "perchscanblink" &&
    trick.kind !== "gridpulse" &&
    trick.kind !== "packetflick"
  ) {
    return { ...trick, phase: "done" as const, t: 0, lift: 0, rot: 0, anim: "idle" as TrickAnim, abort: true };
  }
  const next = { ...trick, t: trick.t + Math.max(0, dt) };
  if (next.kind === "cyberhush") {
    if (next.t < CYBERHUSH_HOLD) {
      const pose = cyberhushPose(next.t);
      next.phase = "hold";
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = "sit";
      return next;
    }
    if (next.t < CYBERHUSH_HOLD + RELEASE_S) {
      const pose = releasePose(next.t - CYBERHUSH_HOLD);
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
  if (next.kind === "arcsparkcoil") {
    const pose = arcsparkcoilPose(next.t, fromX, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "circuitridgewalk") {
    const pose = circuitridgewalkPose(next.t, fromX, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "databreathshimmer") {
    const pose = databreathshimmerPose(next.t, fromX, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "perchscanblink") {
    const pose = perchscanblinkPose(next.t, fromX, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "gridpulse") {
    const pose = gridpulsePose(next.t, fromX, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else {
    const pose = packetflickPose(next.t, fromX, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  }
  if (u >= 1) return { ...next, phase: "done" as const, lift: 0, rot: 0, anim: "idle" as TrickAnim };
  return next;
}
