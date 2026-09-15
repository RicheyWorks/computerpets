/** Ground ground tricks while idle — ultra-polish pass. House neighborly Earth Dragon ground_dragon desk life (ground_dragon / Ground) — lugstrap / earthseat / heaveplate / bedsettle / soilgrip / plateclamp / groundhush personality (lugstrap lug-strap without naming lug or strap alone as wait — lug strap tell; earthseat earth-seat without naming earth or seat alone as wait — earth seat tell; heaveplate heave-plate without naming heave or plate alone as wait — heave plate tell; bedsettle bed-settle without naming bed or settle alone as wait — bed settle tell; soilgrip soil-grip without naming soil or grip alone as wait — soil grip tell; plateclamp plate-clamp without naming plate or clamp alone as wait — plate clamp tell; groundhush ground hush hold (THE groundhush sit_hold tell) — never named wait or crouch or sit or still or ground_dragon or ground or earth as bare ethogram-only trick kinds; window-play key earth stays unchanged (do NOT rename window-play); Fuse fuse_dragon owns railseat/holdcurrent/blowclear/reseatsnap/cartridgerattle/bladeflash/fusehush — do NOT reuse; Relay relay_dragon owns contactclick/latchseat/arcflick/coilbuzz/poleswitch/armaturetap/relayhush — do NOT reuse; Gauss gauss_dragon owns filinglinesbandwalk/ironfilingsstand/fieldlinealign/magneticperchsettle/filingsweep/bandclamp/gausshush — do NOT reuse; Cast earthworm owns terrestris/peristalse/clitellum/setaebrace — do NOT reuse earthworm life; Vesper dragon owns sprawl/guard/smolder/claim/fold — do NOT reuse claim; remaining thin non-birds (monarch / bees) next — do NOT start; guest slug Ground / key ground_dragon only for wantsThankYou matching — accept "ground_dragon" and "ground"; do NOT name a trick "ground_dragon" or "ground" or "earth" or "lug" or "heave" or "bed" or "seat" or "warm" or "hum" or "bow" or "gleam" or "fuse_dragon" or "fuse" or "relay_dragon" or "relay" or "dragon" or "vesper" alone as bare wait; not Fuse Cartridge Dragon life, not Relay Click Dragon life, not Cast earthworm life, not Vesper dragon life, not Rui. Lugstrap / earthseat / heaveplate / bedsettle / soilgrip / plateclamp / groundhush; densground / inkground / densgrounddragon thank-yous (never bare HAPPY hum/bow/gleam). Same map as desktop earth-tricks.js. Window-play earth unchanged. Ethogram softs + freeze — never names earth/still/watch/wait/ground_dragon as bare ethogram-only trick kinds. True Earth Dragon ground_dragon desk life only — lug strap, earth seat, heave plate, bed settle, soil grip, plate clamp, ground hush. Next house-order ultra: remaining thin non-birds (monarch / bumblebee / sweat_bee / honey_drone) or parent pick. No cry inventing — check ground_dragon.wav; prefersHouseCry adds ground_dragon after fuse_dragon only if wav EXISTS. Amplitudes raised toward Rui richness; denser waits/weights; GROUNDHUSH_HOLD=11.2 RELEASE_S=1.18. Catalog 221. */
export const TRICK_KEY = "ground_dragon";
export const TRICKS = ["lugstrap", "earthseat", "heaveplate", "bedsettle", "soilgrip", "plateclamp", "groundhush"] as const;
export const HAPPY = ["densground", "inkground", "densgrounddragon"] as const;
export type EarthTrickKind = (typeof TRICKS)[number];
export type EarthHappyKind = (typeof HAPPY)[number];
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

export type EarthTrick = {
  kind: EarthTrickKind;
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

export type EarthHappy = {
  kind: EarthHappyKind;
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

export const HAPPY_DUR = { densground: 1.70, inkground: 1.84, densgrounddragon: 1.76 } as const;
export const GROUNDHUSH_HOLD = 11.2;
export const RELEASE_S = 1.18;
export const DUR = {
  groundhush: GROUNDHUSH_HOLD + RELEASE_S,
  lugstrap: 2.48,
  earthseat: 2.42,
  heaveplate: 2.40,
  bedsettle: 2.44,
  soilgrip: 2.38,
  plateclamp: 2.56,
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

export function nextTrickWait(justFinished: boolean, rand?: number, kind?: EarthTrickKind | string) {
  const roll = rand == null ? Math.random() : rand;
  if (kind === "groundhush") return 40 + roll * 26;
  if (kind === "soilgrip" || kind === "plateclamp" || kind === "lugstrap") return 12.8 + roll * 9.4;
  if (kind === "heaveplate" || kind === "earthseat" || kind === "bedsettle") return 11.6 + roll * 8.5;
  return justFinished ? 8.5 + roll * 8.4 : 4.4 + roll * 7.4;
}

export function pickTrick(rand?: number, musicOn?: boolean, lastKind?: EarthTrickKind | string | null) {
  if (musicOn) return "groundhush" as const;
  const roll = rand == null ? Math.random() : rand;
  if (lastKind === "groundhush") {
    if (roll < 0.17) return "lugstrap" as const;
    if (roll < 0.33) return "earthseat" as const;
    if (roll < 0.49) return "heaveplate" as const;
    if (roll < 0.65) return "bedsettle" as const;
    if (roll < 0.83) return "soilgrip" as const;
    return "plateclamp" as const;
  }
  if (lastKind === "lugstrap") {
    if (roll < 0.16) return "groundhush" as const;
    if (roll < 0.32) return "earthseat" as const;
    if (roll < 0.48) return "heaveplate" as const;
    if (roll < 0.64) return "bedsettle" as const;
    if (roll < 0.82) return "soilgrip" as const;
    return "plateclamp" as const;
  }
  if (lastKind === "earthseat") {
    if (roll < 0.14) return "groundhush" as const;
    if (roll < 0.3) return "lugstrap" as const;
    if (roll < 0.46) return "heaveplate" as const;
    if (roll < 0.62) return "bedsettle" as const;
    if (roll < 0.8) return "soilgrip" as const;
    return "plateclamp" as const;
  }
  if (lastKind === "heaveplate") {
    if (roll < 0.15) return "groundhush" as const;
    if (roll < 0.31) return "lugstrap" as const;
    if (roll < 0.47) return "earthseat" as const;
    if (roll < 0.63) return "bedsettle" as const;
    if (roll < 0.81) return "soilgrip" as const;
    return "plateclamp" as const;
  }
  if (lastKind === "bedsettle") {
    if (roll < 0.16) return "groundhush" as const;
    if (roll < 0.32) return "lugstrap" as const;
    if (roll < 0.48) return "earthseat" as const;
    if (roll < 0.64) return "heaveplate" as const;
    if (roll < 0.82) return "soilgrip" as const;
    return "plateclamp" as const;
  }
  if (lastKind === "soilgrip") {
    if (roll < 0.15) return "groundhush" as const;
    if (roll < 0.31) return "lugstrap" as const;
    if (roll < 0.47) return "earthseat" as const;
    if (roll < 0.63) return "heaveplate" as const;
    if (roll < 0.81) return "bedsettle" as const;
    return "plateclamp" as const;
  }
  if (lastKind === "plateclamp") {
    if (roll < 0.16) return "groundhush" as const;
    if (roll < 0.32) return "lugstrap" as const;
    if (roll < 0.48) return "earthseat" as const;
    if (roll < 0.64) return "heaveplate" as const;
    if (roll < 0.82) return "bedsettle" as const;
    return "soilgrip" as const;
  }
  if (roll < 0.14) return "groundhush" as const;
  if (roll < 0.28) return "lugstrap" as const;
  if (roll < 0.42) return "earthseat" as const;
  if (roll < 0.56) return "heaveplate" as const;
  if (roll < 0.7) return "bedsettle" as const;
  if (roll < 0.85) return "soilgrip" as const;
  return "plateclamp" as const;
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
  return key === TRICK_KEY || key === "ground";
}

export function startThankYou(
  key: string | undefined | null,
  lastKind: EarthHappyKind | null | undefined,
  x: number,
  facing: 1 | -1,
  flags?: TrickFlags
) {
  if (!wantsThankYou(key)) return null;
  if (!happyCanStart(flags || { cmd: "idle" })) return null;
  const pick = pickHappy(lastKind);
  return { happy: beginHappy(pick, x, facing), kind: pick };
}

export function pickHappy(lastKind?: EarthHappyKind | null, rand?: number) {
  const pool = HAPPY.filter((k) => k !== lastKind);
  const list = pool.length ? pool : [...HAPPY];
  const roll = rand == null ? Math.random() : rand;
  return list[Math.floor(roll * list.length)] || list[0];
}

export function beginHappy(kind: EarthHappyKind | string, x: number, facing: 1 | -1): EarthHappy {
  const name = (HAPPY as readonly string[]).includes(kind) ? (kind as EarthHappyKind) : "densground";
  return {
    kind: name,
    happy: true,
    phase: "go",
    t: 0,
    x,
    lift: 0,
    rot: 0,
    anim: (name === "densground" ? "sit" : name === "inkground" ? "play" : "play") as TrickAnim,
    facing: (facing == null ? 1 : facing) as 1 | -1,
    fromX: x,
  };
}

export function densgroundPose(t: number) {
  const u = Math.max(0, Math.min(1, t / HAPPY_DUR.densground));
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

export function inkgroundPose(t: number) {
  const u = Math.max(0, Math.min(1, t / HAPPY_DUR.inkground));
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

export function densgrounddragonPose(t: number) {
  return {
    lift: 2.2 + Math.abs(Math.sin(t * 0.58)) * 1.1,
    rot: Math.sin(t * 0.58) * 8,
    dx: Math.sin(t * 0.4) * 0.06,
    anim: "play" as TrickAnim,
  };
}

export function stepHappy(happy: EarthHappy | null | undefined, dt: number, flags?: TrickFlags) {
  if (!happy || happy.phase === "done") return happy;
  if (happyShouldAbort(flags)) {
    return { ...happy, phase: "done" as const, t: 0, lift: 0, rot: 0, anim: "idle" as TrickAnim, abort: true };
  }
  const next = { ...happy, t: happy.t + Math.max(0, dt) };
  const hold = HAPPY_DUR[next.kind];
  if (next.kind === "densground") {
    const pose = densgroundPose(next.t);
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "inkground") {
    const pose = inkgroundPose(next.t);
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else {
    const pose = densgrounddragonPose(next.t);
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

export function beginTrick(kind: EarthTrickKind | string, x: number, facing: 1 | -1): EarthTrick {
  const k = (TRICKS as readonly string[]).includes(kind) ? (kind as EarthTrickKind) : "groundhush";
  const anim: TrickAnim =
    k === "groundhush"
      ? "sit"
      : k === "lugstrap"
        ? "play"
        : k === "plateclamp"
          ? "talk"
          : k === "earthseat"
            ? "walk"
            : k === "heaveplate"
              ? "sit"
              : k === "bedsettle"
                ? "sit"
                : k === "soilgrip"
                  ? "walk"
                  : "sit";
  return {
    kind: k,
    phase: k === "groundhush" ? "hold" : "go",
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

export function groundhushPose(t: number) {
  return {
    lift: 2.4 + Math.abs(Math.sin(t * 0.42)) * 1.2,
    rot: -0.18 + Math.sin(t * 0.36) * 0.35,
  };
}

export function releasePose(t: number) {
  const u = Math.max(0, Math.min(1, t / RELEASE_S));
  return { lift: 2.4 * (1 - Math.sin(u * Math.PI * 0.5)), rot: -0.18 * (1 - u) };
}

export function lugstrapPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.lugstrap));
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

export function earthseatPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.earthseat));
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

export function heaveplatePose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.heaveplate));
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

export function bedsettlePose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.bedsettle));
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

export function soilgripPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.soilgrip));
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

export function plateclampPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.plateclamp));
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

export function stepTrick(trick: EarthTrick | null | undefined, dt: number, flags?: TrickFlags) {
  if (!trick || trick.phase === "done") return trick;
  if (
    shouldAbort(flags) &&
    trick.kind !== "lugstrap" &&
    trick.kind !== "earthseat" &&
    trick.kind !== "heaveplate" &&
    trick.kind !== "bedsettle" &&
    trick.kind !== "soilgrip" &&
    trick.kind !== "plateclamp"
  ) {
    return { ...trick, phase: "done" as const, t: 0, lift: 0, rot: 0, anim: "idle" as TrickAnim, abort: true };
  }
  const next = { ...trick, t: trick.t + Math.max(0, dt) };
  if (next.kind === "groundhush") {
    if (next.t < GROUNDHUSH_HOLD) {
      const pose = groundhushPose(next.t);
      next.phase = "hold";
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = "sit";
      return next;
    }
    if (next.t < GROUNDHUSH_HOLD + RELEASE_S) {
      const pose = releasePose(next.t - GROUNDHUSH_HOLD);
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
  if (next.kind === "lugstrap") {
    const pose = lugstrapPose(next.t, fromX, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "earthseat") {
    const pose = earthseatPose(next.t, fromX, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "heaveplate") {
    const pose = heaveplatePose(next.t, fromX, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "bedsettle") {
    const pose = bedsettlePose(next.t, fromX, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "soilgrip") {
    const pose = soilgripPose(next.t, fromX, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else {
    const pose = plateclampPose(next.t, fromX, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  }
  if (u >= 1) return { ...next, phase: "done" as const, lift: 0, rot: 0, anim: "idle" as TrickAnim };
  return next;
}
