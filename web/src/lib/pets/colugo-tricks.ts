/** Sail ground tricks while idle — ultra-polish pass. House neighborly Galeopterus variegatus / Sunda Colugo desk life (colugo / Sail) — patagiumglide / clingclimb / headdownhang / leaffoldsettle / membranespread / barkclamp / galeopterushush personality (patagiumglide membrane glide without naming glide or sail or colugo alone as wait — distinct from Glide flying_squirrel and sugar glider; clingclimb bark cling-climb without naming cling or climb or walk alone as wait — distinct from Hang reachcrawl and Wrist pretailhang; headdownhang head-down hang without naming hang or head or down alone as wait — distinct from Hang hangsway and Swing brachiate; leaffoldsettle leaf-fold settle without naming fold or leaf or settle alone as wait — distinct from Hang clawhook and Wrist tailcoil; membranespread patagium membrane-spread without naming membrane or spread or wing alone as wait — distinct from Glide and Bat; barkclamp bark clamp cling without naming clamp or bark or grip alone as wait — distinct from Limpet clampseal and Hang clawhook; long galeopterushush Galeopterus variegatus hush hold (THE galeopterushush sit_hold tell) — never named wait or crouch or sit or sail or cling or still or colugo or sail as bare ethogram-only trick kinds; Wrist kinkajou owns pretailhang/nectarsip/wristrotate/nightscamper/honeylap/tailcoil/potoshush — do NOT reuse; Swing gibbon owns brachiate/whoopduet/bipedalstrut/hangreach/armhook/duetbow/hylobateshush — do NOT reuse; Hang sloth owns hangsway/reachcrawl/algaescratch/headturnstare/clawhook/slowdrip/bradypushush — do NOT reuse; guest slug Sail / key colugo only for wantsThankYou matching — accept "colugo" and "sail"; do NOT name a trick "colugo" or "sail" or "kinkajou" or "wrist" or "gibbon" or "swing" or "sloth" or "hang" or "glide"; not Wrist Potos life, not Swing Hylobates life, not Hang Choloepus life, not Glide flying_squirrel, not Rui. Patagiumglide / clingclimb / headdownhang / leaffoldsettle / membranespread / barkclamp / galeopterushush; denssail / inksail / densgaleopterus thank-yous. Same map as desktop colugo-tricks.js. Window-play unchanged. Ethogram softs + freeze — never names sail/cling/still/sit/wait/colugo as bare ethogram-only trick kinds. True Sunda Colugo Galeopterus variegatus desk life only — patagium glide, cling climb, head-down hang, leaf-fold settle, membrane spread, bark clamp, Galeopterus hush. Next house-order ultra: Glide / flying_squirrel. No cry inventing — colugo.wav EXISTS so prefersHouseCry adds colugo after kinkajou. Amplitudes raised toward Rui richness; denser waits/weights. Catalog 221. */
export const TRICK_KEY = "colugo";
export const TRICKS = ["patagiumglide", "clingclimb", "headdownhang", "leaffoldsettle", "membranespread", "barkclamp", "galeopterushush"] as const;
export const HAPPY = ["denssail", "inksail", "densgaleopterus"] as const;
export type ColugoTrickKind = (typeof TRICKS)[number];
export type ColugoHappyKind = (typeof HAPPY)[number];
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

export type ColugoTrick = {
  kind: ColugoTrickKind;
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

export type ColugoHappy = {
  kind: ColugoHappyKind;
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

export const HAPPY_DUR = { denssail: 1.70, inksail: 1.84, densgaleopterus: 1.76 } as const;
export const GALEOPTERUSHUSH_HOLD = 11.2;
export const RELEASE_S = 1.18;
export const DUR = {
  galeopterushush: GALEOPTERUSHUSH_HOLD + RELEASE_S,
  patagiumglide: 2.48,
  clingclimb: 2.42,
  headdownhang: 2.40,
  leaffoldsettle: 2.44,
  membranespread: 2.38,
  barkclamp: 2.56,
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

export function nextTrickWait(justFinished: boolean, rand?: number, kind?: ColugoTrickKind | string) {
  const roll = rand == null ? Math.random() : rand;
  if (kind === "galeopterushush") return 40 + roll * 26;
  if (kind === "membranespread" || kind === "patagiumglide" || kind === "leaffoldsettle") return 12.8 + roll * 9.4;
  if (kind === "headdownhang" || kind === "clingclimb" || kind === "barkclamp") return 11.6 + roll * 8.5;
  return justFinished ? 8.5 + roll * 8.4 : 4.4 + roll * 7.4;
}

export function pickTrick(rand?: number, musicOn?: boolean, lastKind?: ColugoTrickKind | string | null) {
  if (musicOn) return "galeopterushush" as const;
  const roll = rand == null ? Math.random() : rand;
  if (lastKind === "galeopterushush") {
    if (roll < 0.17) return "patagiumglide" as const;
    if (roll < 0.33) return "clingclimb" as const;
    if (roll < 0.49) return "headdownhang" as const;
    if (roll < 0.65) return "leaffoldsettle" as const;
    if (roll < 0.83) return "membranespread" as const;
    return "barkclamp" as const;
  }
  if (lastKind === "patagiumglide") {
    if (roll < 0.16) return "galeopterushush" as const;
    if (roll < 0.32) return "clingclimb" as const;
    if (roll < 0.48) return "headdownhang" as const;
    if (roll < 0.64) return "leaffoldsettle" as const;
    if (roll < 0.82) return "membranespread" as const;
    return "barkclamp" as const;
  }
  if (lastKind === "clingclimb") {
    if (roll < 0.14) return "galeopterushush" as const;
    if (roll < 0.3) return "patagiumglide" as const;
    if (roll < 0.46) return "headdownhang" as const;
    if (roll < 0.62) return "leaffoldsettle" as const;
    if (roll < 0.8) return "membranespread" as const;
    return "barkclamp" as const;
  }
  if (lastKind === "headdownhang") {
    if (roll < 0.15) return "galeopterushush" as const;
    if (roll < 0.31) return "patagiumglide" as const;
    if (roll < 0.47) return "clingclimb" as const;
    if (roll < 0.63) return "leaffoldsettle" as const;
    if (roll < 0.81) return "membranespread" as const;
    return "barkclamp" as const;
  }
  if (lastKind === "leaffoldsettle") {
    if (roll < 0.16) return "galeopterushush" as const;
    if (roll < 0.32) return "patagiumglide" as const;
    if (roll < 0.48) return "clingclimb" as const;
    if (roll < 0.64) return "headdownhang" as const;
    if (roll < 0.82) return "membranespread" as const;
    return "barkclamp" as const;
  }
  if (lastKind === "membranespread") {
    if (roll < 0.15) return "galeopterushush" as const;
    if (roll < 0.31) return "patagiumglide" as const;
    if (roll < 0.47) return "clingclimb" as const;
    if (roll < 0.63) return "headdownhang" as const;
    if (roll < 0.81) return "leaffoldsettle" as const;
    return "barkclamp" as const;
  }
  if (lastKind === "barkclamp") {
    if (roll < 0.16) return "galeopterushush" as const;
    if (roll < 0.32) return "patagiumglide" as const;
    if (roll < 0.48) return "clingclimb" as const;
    if (roll < 0.64) return "headdownhang" as const;
    if (roll < 0.82) return "leaffoldsettle" as const;
    return "membranespread" as const;
  }
  if (roll < 0.14) return "galeopterushush" as const;
  if (roll < 0.28) return "patagiumglide" as const;
  if (roll < 0.42) return "clingclimb" as const;
  if (roll < 0.56) return "headdownhang" as const;
  if (roll < 0.7) return "leaffoldsettle" as const;
  if (roll < 0.85) return "membranespread" as const;
  return "barkclamp" as const;
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
  return key === TRICK_KEY || key === "sail";
}

export function startThankYou(
  key: string | undefined | null,
  lastKind: ColugoHappyKind | null | undefined,
  x: number,
  facing: 1 | -1,
  flags?: TrickFlags
) {
  if (!wantsThankYou(key)) return null;
  if (!happyCanStart(flags || { cmd: "idle" })) return null;
  const pick = pickHappy(lastKind);
  return { happy: beginHappy(pick, x, facing), kind: pick };
}

export function pickHappy(lastKind?: ColugoHappyKind | null, rand?: number) {
  const pool = HAPPY.filter((k) => k !== lastKind);
  const list = pool.length ? pool : [...HAPPY];
  const roll = rand == null ? Math.random() : rand;
  return list[Math.floor(roll * list.length)] || list[0];
}

export function beginHappy(kind: ColugoHappyKind | string, x: number, facing: 1 | -1): ColugoHappy {
  const name = (HAPPY as readonly string[]).includes(kind) ? (kind as ColugoHappyKind) : "denssail";
  return {
    kind: name,
    happy: true,
    phase: "go",
    t: 0,
    x,
    lift: 0,
    rot: 0,
    anim: (name === "denssail" ? "sit" : name === "inksail" ? "play" : "play") as TrickAnim,
    facing: (facing == null ? 1 : facing) as 1 | -1,
    fromX: x,
  };
}

export function denssailPose(t: number) {
  const u = Math.max(0, Math.min(1, t / HAPPY_DUR.denssail));
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

export function inksailPose(t: number) {
  const u = Math.max(0, Math.min(1, t / HAPPY_DUR.inksail));
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

export function densgaleopterusPose(t: number) {
  return {
    lift: 2.2 + Math.abs(Math.sin(t * 0.58)) * 1.1,
    rot: Math.sin(t * 0.58) * 8,
    dx: Math.sin(t * 0.4) * 0.06,
    anim: "play" as TrickAnim,
  };
}

export function stepHappy(happy: ColugoHappy | null | undefined, dt: number, flags?: TrickFlags) {
  if (!happy || happy.phase === "done") return happy;
  if (happyShouldAbort(flags)) {
    return { ...happy, phase: "done" as const, t: 0, lift: 0, rot: 0, anim: "idle" as TrickAnim, abort: true };
  }
  const next = { ...happy, t: happy.t + Math.max(0, dt) };
  const hold = HAPPY_DUR[next.kind];
  if (next.kind === "denssail") {
    const pose = denssailPose(next.t);
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "inksail") {
    const pose = inksailPose(next.t);
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else {
    const pose = densgaleopterusPose(next.t);
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

export function beginTrick(kind: ColugoTrickKind, x: number, facing: 1 | -1): ColugoTrick {
  const anim: TrickAnim =
    kind === "galeopterushush"
      ? "sit"
      : kind === "patagiumglide"
        ? "play"
        : kind === "barkclamp"
          ? "talk"
          : kind === "clingclimb"
            ? "walk"
            : kind === "headdownhang"
              ? "sit"
              : kind === "leaffoldsettle"
                ? "play"
                : kind === "membranespread"
                  ? "walk"
                  : "sit";
  return {
    kind,
    phase: kind === "galeopterushush" ? "hold" : "go",
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

export function galeopterushushPose(t: number) {
  return {
    lift: 2.4 + Math.abs(Math.sin(t * 0.42)) * 1.2,
    rot: -0.18 + Math.sin(t * 0.36) * 0.35,
  };
}

export function releasePose(t: number) {
  const u = Math.max(0, Math.min(1, t / RELEASE_S));
  return { lift: 2.4 * (1 - Math.sin(u * Math.PI * 0.5)), rot: -0.18 * (1 - u) };
}

export function patagiumglidePose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.patagiumglide));
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

export function clingclimbPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.clingclimb));
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

export function headdownhangPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.headdownhang));
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

export function leaffoldsettlePose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.leaffoldsettle));
  const face = facing == null ? 1 : facing;
  if (u < 0.1) {
    const s = smoothstep(u / 0.1);
    return { x: fromX + face * s * 1.0, lift: s * 4.0, rot: s * 18 * face, anim: "play" as TrickAnim };
  }
  if (u < 0.8) {
    const thrash = Math.sin(t * 3.6);
    return {
      x: fromX + face * (1.0 + thrash * 0.22),
      lift: 3.6 + Math.abs(thrash) * 2.0,
      rot: face * (18 + thrash * 14),
      anim: "play" as TrickAnim,
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

export function membranespreadPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.membranespread));
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

export function barkclampPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.barkclamp));
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

export function stepTrick(trick: ColugoTrick | null | undefined, dt: number, flags?: TrickFlags) {
  if (!trick || trick.phase === "done") return trick;
  if (
    shouldAbort(flags) &&
    trick.kind !== "patagiumglide" &&
    trick.kind !== "clingclimb" &&
    trick.kind !== "headdownhang" &&
    trick.kind !== "leaffoldsettle" &&
    trick.kind !== "membranespread" &&
    trick.kind !== "barkclamp"
  ) {
    return { ...trick, phase: "done" as const, t: 0, lift: 0, rot: 0, anim: "idle" as TrickAnim, abort: true };
  }
  const next = { ...trick, t: trick.t + Math.max(0, dt) };
  if (next.kind === "galeopterushush") {
    if (next.t < GALEOPTERUSHUSH_HOLD) {
      const pose = galeopterushushPose(next.t);
      next.phase = "hold";
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = "sit";
      return next;
    }
    if (next.t < GALEOPTERUSHUSH_HOLD + RELEASE_S) {
      const pose = releasePose(next.t - GALEOPTERUSHUSH_HOLD);
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
  if (next.kind === "patagiumglide") {
    const pose = patagiumglidePose(next.t, fromX, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "clingclimb") {
    const pose = clingclimbPose(next.t, fromX, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "headdownhang") {
    const pose = headdownhangPose(next.t, fromX, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "leaffoldsettle") {
    const pose = leaffoldsettlePose(next.t, fromX, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "membranespread") {
    const pose = membranespreadPose(next.t, fromX, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else {
    const pose = barkclampPose(next.t, fromX, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  }
  if (u >= 1) return { ...next, phase: "done" as const, lift: 0, rot: 0, anim: "idle" as TrickAnim };
  return next;
}
