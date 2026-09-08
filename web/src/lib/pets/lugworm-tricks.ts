/** Heap ground tricks while idle. House neighborly Arenicola / lugworm desk life — uburrow / pumppulse / headdig / tailcast / arenicolahush personality (uburrow U-burrow cast-heap without naming castheap or cast or heap or pile or dirt alone as wait, pumppulse peristaltic pump pulse without naming peristalse or pump or pulse or wave or thrash alone as wait, headdig head-end fossick without naming head or dig or fossick or snout or taste alone as wait, tailcast tail-cast tip without naming castheap or cast or tip or dung or soil alone as wait, long arenicolahush Arenicola marina lugworm hush — never named wait or crouch or roost or stalk or monocle or fossick or anting or corvid or peristalse or castheap or surfacerise or soilanchor or terrestris or denscast or inkcast or densclit or sinusoid or dauerrest or pharynxpump or thrashturn or elegans or densthread or inkthread or densdauer or siphonprobe or footplow or opercdoor or knobbyrock or busyconhush or densknurl or inkknurl or densbusycon or spinewalk or lanterngraze or gripcreep or spineflare or strongylhush; window-play and Call Heap leave lugworm alone; Cast/Thread/Knurl/Thorn/Token/Spire own their tricks; guest slug Heap / key lugworm — accept "lugworm" and "heap" (roster slug heap; campaign Heap); do NOT accept bare "heap" as a trick id; do NOT confuse with Cast the Common Earthworm (key earthworm / slug cast) — Cast already owns peristalse/castheap; do NOT confuse with Thread the Nematode (thrashturn/pharynxpump); do NOT confuse with Knurl the Knobbed Whelk; do NOT name a trick lugworm or heap or earthworm or cast or nematode or thread or knobbed_whelk or knurl. Thank-yous densheap / inkheap / densarenicola. Feed-happy after eat. Sleep, hide, leave, rest, card, ribbon still win. Same map as desktop lugworm-tricks.js. Window-play unchanged. True Arenicola marina lugworm desk life — U-shaped burrow cast heap on the desk, peristaltic pump pulse through the tube, head-end fossick at the feeding end, tail-cast tip at the cast end, and long Arenicola hush; not Lumbricus earthworm Cast clones (peristalse/castheap), not Caenorhabditis nematode Thread thrash clones, not Busycon whelk Knurl clones — true Arenicola / Arenicolidae lugworm life. Next house-order guest after Heap still lacking tricks owns the next seat (Chirp / field_cricket). No cry inventing — thank-yous are silent desk motion only. */
export const TRICK_KEY = "lugworm";
export const TRICKS = ["uburrow", "pumppulse", "headdig", "tailcast", "arenicolahush"] as const;
export const HAPPY = ["densheap", "inkheap", "densarenicola"] as const;
export type LugwormTrickKind = (typeof TRICKS)[number];
export type LugwormHappyKind = (typeof HAPPY)[number];
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

export type LugwormTrick = {
  kind: LugwormTrickKind;
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

export type LugwormHappy = {
  kind: LugwormHappyKind;
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

export const HAPPY_DUR = { densheap: 2.58, inkheap: 2.74, densarenicola: 2.48 } as const;
export const ARENICOLAHUSH_HOLD = 24.80;
export const RELEASE_S = 2.18;
export const DUR = { arenicolahush: ARENICOLAHUSH_HOLD + RELEASE_S, uburrow: 5.05, pumppulse: 4.88, headdig: 4.55, tailcast: 4.72 } as const;

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
export function nextTrickWait(justFinished: boolean, rand?: number, kind?: LugwormTrickKind | string) {
  const roll = rand == null ? Math.random() : rand;
  if (kind === "arenicolahush") return 168 + roll * 14;
  if (kind === "uburrow") return 27.0 + roll * 4.5;
  if (kind === "pumppulse") return 26.4 + roll * 4.2;
  if (kind === "headdig") return 25.2 + roll * 3.9;
  if (kind === "tailcast") return 25.8 + roll * 4.1;
  return justFinished ? 19.2 + roll * 2.8 : 14.4 + roll * 2.4;
}
export function pickTrick(rand?: number, musicOn?: boolean, lastKind?: LugwormTrickKind | string) {
  if (musicOn) return "arenicolahush";
  const roll = rand == null ? Math.random() : rand;
  if (lastKind === "arenicolahush") {
    if (roll < 0.26) return "uburrow";
    if (roll < 0.5) return "pumppulse";
    if (roll < 0.74) return "headdig";
    return "tailcast";
  }
  if (lastKind === "uburrow") {
    if (roll < 0.26) return "arenicolahush";
    if (roll < 0.5) return "pumppulse";
    if (roll < 0.74) return "headdig";
    return "tailcast";
  }
  if (lastKind === "pumppulse") {
    if (roll < 0.22) return "arenicolahush";
    if (roll < 0.44) return "uburrow";
    if (roll < 0.68) return "headdig";
    return "tailcast";
  }
  if (roll < 0.2) return "arenicolahush";
  if (roll < 0.4) return "uburrow";
  if (roll < 0.6) return "pumppulse";
  if (roll < 0.8) return "headdig";
  return "tailcast";
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
  return cmd === "sleep" || cmd === "leave" || cmd === "hide" || cmd === "rest" || cmd === "seek" || cmd === "play" || cmd === "talk" || cmd === "enter";
}
export function wantsThankYou(key: string | undefined | null) {
  return key === TRICK_KEY || key === "heap";
}
export function startThankYou(key: string | undefined | null, lastKind: string | undefined | null, x: number, facing: 1 | -1 | undefined, flags?: TrickFlags) {
  if (!wantsThankYou(key)) return null;
  if (!happyCanStart(flags || { cmd: "idle" })) return null;
  const pick = pickHappy(lastKind);
  return { happy: beginHappy(pick, x, facing), kind: pick };
}
export function pickHappy(lastKind?: string | null, rand?: number) {
  const pool = HAPPY.filter((k) => k !== lastKind);
  const list = pool.length ? pool : [...HAPPY];
  const roll = rand == null ? Math.random() : rand;
  return list[Math.floor(roll * list.length)] || list[0];
}
export function beginHappy(kind: LugwormHappyKind | string, x: number, facing?: 1 | -1): LugwormHappy {
  const name = (HAPPY as readonly string[]).indexOf(kind) >= 0 ? (kind as LugwormHappyKind) : "densheap";
  return {
    kind: name,
    happy: true,
    phase: "go",
    t: 0,
    x,
    lift: 0,
    rot: 0,
    anim: name === "densheap" ? "sit" : name === "inkheap" ? "play" : "play",
    facing: facing == null ? 1 : facing,
    fromX: x,
  };
}
export function densheapPose(t: number) {
  const u = Math.max(0, Math.min(1, t / HAPPY_DUR.densheap));
  if (u < 0.14) {
    const s = u / 0.14;
    return { lift: s * -0.0042, rot: s * 0.12, anim: "sit" as TrickAnim };
  }
  if (u < 0.86) {
    const mound = Math.sin(((u - 0.14) / 0.72) * Math.PI * 2.15);
    return { lift: -0.0042 + Math.abs(mound) * 0.00115, rot: 0.12 + mound * 0.09, anim: "sit" as TrickAnim };
  }
  const s = (u - 0.86) / 0.14;
  return { lift: -0.0042 * (1 - s), rot: 0.12 * (1 - s), anim: "idle" as TrickAnim };
}
export function inkheapPose(t: number) {
  const u = Math.max(0, Math.min(1, t / HAPPY_DUR.inkheap));
  if (u < 0.12) {
    const s = u / 0.12;
    return { lift: s * 0.0036, rot: s * -0.28, anim: "play" as TrickAnim };
  }
  if (u < 0.84) {
    const pulse = Math.sin(((u - 0.12) / 0.72) * Math.PI * 3.4);
    return { lift: 0.0036 + Math.abs(pulse) * 0.0014, rot: -0.28 + pulse * 0.22, anim: "play" as TrickAnim };
  }
  const s = (u - 0.84) / 0.16;
  return { lift: 0.0036 * (1 - s), rot: -0.28 * (1 - s), anim: "idle" as TrickAnim };
}
export function densarenicolaPose(t: number) {
  const u = Math.max(0, Math.min(1, t / HAPPY_DUR.densarenicola));
  if (u < 0.13) {
    const s = u / 0.13;
    return { lift: s * 0.0022, rot: s * 0.18, anim: "play" as TrickAnim };
  }
  if (u < 0.82) {
    const tube = Math.sin(((u - 0.13) / 0.69) * Math.PI * 2.4);
    return { lift: 0.0022 + Math.abs(tube) * 0.00095, rot: 0.18 + tube * 0.14, anim: "play" as TrickAnim };
  }
  const s = (u - 0.82) / 0.18;
  return { lift: 0.0022 * (1 - s), rot: 0.18 * (1 - s), anim: "idle" as TrickAnim };
}
export function stepHappy(happy: LugwormHappy, dt: number, flags?: TrickFlags): LugwormHappy {
  if (!happy || happy.phase === "done") return happy;
  if (happyShouldAbort(flags)) {
    return { ...happy, phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true };
  }
  const next = { ...happy, t: happy.t + Math.max(0, dt) };
  const hold = HAPPY_DUR[next.kind];
  if (next.kind === "densheap") {
    const pose = densheapPose(next.t);
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "inkheap") {
    const pose = inkheapPose(next.t);
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else {
    const pose = densarenicolaPose(next.t);
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  }
  if (next.t >= hold) return { ...next, phase: "done", lift: 0, rot: 0, anim: "idle" };
  return next;
}
export function sleepHoldFrame(_key?: string, _frameCount?: number) {
  return null;
}
export function beginTrick(kind: LugwormTrickKind | string, x: number, facing?: 1 | -1): LugwormTrick {
  const k = (TRICKS as readonly string[]).includes(kind) ? (kind as LugwormTrickKind) : "arenicolahush";
  const anim: TrickAnim =
    k === "arenicolahush"
      ? "sit"
      : k === "uburrow"
        ? "play"
        : k === "pumppulse"
          ? "walk"
          : k === "headdig"
            ? "sit"
            : k === "tailcast"
              ? "play"
              : "sit";
  return {
    kind: k,
    phase: k === "arenicolahush" ? "hold" : "go",
    t: 0,
    x,
    lift: 0,
    rot: 0,
    anim,
    facing: facing == null ? 1 : facing,
    fromX: x,
  };
}
function smoothstep(t: number) {
  const x = Math.max(0, Math.min(1, t));
  return x * x * (3 - 2 * x);
}
export function arenicolahushPose(t: number) {
  const breath = Math.sin(t * 0.00205) + 0.00088 * Math.sin(t * 0.0062);
  const hush = Math.abs(Math.sin(t * 0.00094));
  return { lift: -0.00052 + hush * 0.00014, rot: 0.018 + breath * 0.0052 };
}

export function releasePose(t: number) {
  const u = Math.max(0, Math.min(1, t / RELEASE_S));
  return { lift: -0.00048 * (1 - Math.sin(u * Math.PI * 0.5)), rot: 0.018 * (1 - u) };
}

// U-burrow cast heap: desk-safe U-shaped burrow with a cast mound at the tail end (not Cast castheap soil push).
export function uburrowPose(t: number, fromX: number, facing?: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.uburrow));
  const face = facing == null ? 1 : facing;
  if (u < 0.12) {
    const s = smoothstep(u / 0.12);
    return { x: fromX + face * s * 0.00018, lift: s * -0.0055, rot: s * 0.22 * face, anim: "play" as TrickAnim };
  }
  if (u < 0.55) {
    const dive = (u - 0.12) / 0.43;
    const uarc = Math.sin(dive * Math.PI);
    return {
      x: fromX + face * (0.00018 + dive * 0.0048),
      lift: -0.0055 + uarc * -0.0038,
      rot: (0.22 + uarc * 0.28) * face,
      anim: "play" as TrickAnim,
    };
  }
  if (u < 0.88) {
    const heap = Math.sin((u - 0.55) / 0.33 * Math.PI * 2.2);
    const cast = Math.sin(t * 1.08) + 0.05 * Math.sin(t * 2.15);
    return {
      x: fromX + face * (0.00498 + heap * 0.00055),
      lift: -0.0022 + Math.abs(heap) * 0.0036 + Math.abs(cast) * 0.0009,
      rot: (0.08 + heap * 0.32 + cast * 0.10) * face,
      anim: "play" as TrickAnim,
    };
  }
  const s = smoothstep((u - 0.88) / 0.12);
  return { x: fromX + face * 0.00498 * (1 - s * 0.15), lift: -0.0007 * (1 - s), rot: 0.03 * (1 - s) * face, anim: "idle" as TrickAnim };
}

// Peristaltic pump pulse: water-pump body wave through the U-tube (not Cast peristalse crawl, not nematode thrashturn).
export function pumppulsePose(t: number, fromX: number, facing?: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.pumppulse));
  const face = facing == null ? 1 : facing;
  if (u < 0.10) {
    const s = smoothstep(u / 0.10);
    return { x: fromX + face * s * 0.00012, lift: s * 0.0018, rot: s * 0.08 * face, anim: "walk" as TrickAnim };
  }
  if (u < 0.90) {
    const pump = Math.sin((u - 0.10) / 0.80 * Math.PI * 6.4);
    const pulse = Math.sin(t * 1.42) + 0.06 * Math.sin(t * 2.85);
    return {
      x: fromX + face * (0.00012 + pump * 0.00085 + pulse * 0.00009),
      lift: 0.0018 + Math.abs(pump) * 0.0032 + Math.abs(pulse) * 0.00085,
      rot: (0.08 + pump * 0.55 + pulse * 0.12) * face,
      anim: "walk" as TrickAnim,
    };
  }
  const s = smoothstep((u - 0.90) / 0.10);
  return { x: fromX + face * 0.00012 * (1 - s), lift: 0.00055 * (1 - s), rot: 0.02 * (1 - s) * face, anim: "idle" as TrickAnim };
}

// Head-end fossick: feeding end tastes and digs the desk film (not Cast surfacerise night rise).
export function headdigPose(t: number, fromX: number, facing?: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.headdig));
  const face = facing == null ? 1 : facing;
  if (u < 0.14) {
    const s = smoothstep(u / 0.14);
    return { x: fromX + face * s * 0.00035, lift: s * 0.0045, rot: s * 0.35 * face, anim: "talk" as TrickAnim };
  }
  if (u < 0.86) {
    const dig = Math.sin((u - 0.14) / 0.72 * Math.PI * 3.6);
    const fossick = Math.sin(t * 1.22) + 0.048 * Math.sin(t * 2.48);
    return {
      x: fromX + face * (0.00035 + dig * 0.00125 + fossick * 0.00016),
      lift: 0.0045 + Math.abs(dig) * 0.0018 + Math.abs(fossick) * 0.00055,
      rot: (0.35 + dig * 0.28 + fossick * 0.11) * face,
      anim: "talk" as TrickAnim,
    };
  }
  const s = smoothstep((u - 0.86) / 0.14);
  return { x: fromX + face * 0.00035 * (1 - s), lift: 0.0045 * (1 - s), rot: 0.04 * (1 - s) * face, anim: "idle" as TrickAnim };
}

// Tail-cast tip: cast end tips a small coiled cast onto the desk (not Cast castheap bulk push).
export function tailcastPose(t: number, fromX: number, facing?: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.tailcast));
  const face = facing == null ? 1 : facing;
  if (u < 0.13) {
    const s = smoothstep(u / 0.13);
    return { x: fromX - face * s * 0.00028, lift: s * 0.0038, rot: s * -0.42 * face, anim: "play" as TrickAnim };
  }
  if (u < 0.78) {
    const tip = Math.sin((u - 0.13) / 0.65 * Math.PI * 2.4);
    const coil = Math.sin(t * 0.95) + 0.045 * Math.sin(t * 1.9);
    return {
      x: fromX - face * (0.00028 + tip * 0.00072),
      lift: 0.0038 + Math.abs(tip) * 0.0024 + Math.abs(coil) * 0.0007,
      rot: (-0.42 + tip * 0.35 + coil * 0.12) * face,
      anim: "play" as TrickAnim,
    };
  }
  if (u < 0.90) {
    const drop = smoothstep((u - 0.78) / 0.12);
    return {
      x: fromX - face * 0.00028 * (1 - drop * 0.3),
      lift: 0.0038 - drop * 0.0022,
      rot: (-0.18 + drop * 0.12) * face,
      anim: "sit" as TrickAnim,
    };
  }
  const s = smoothstep((u - 0.90) / 0.10);
  return { x: fromX - face * 0.0002 * (1 - s), lift: 0.0006 * (1 - s), rot: -0.025 * (1 - s) * face, anim: "idle" as TrickAnim };
}
export function stepTrick(trick: LugwormTrick, dt: number, flags?: TrickFlags): LugwormTrick {
  if (!trick || trick.phase === "done") return trick;
  if (shouldAbort(flags) && trick.kind !== "uburrow" && trick.kind !== "pumppulse" && trick.kind !== "headdig" && trick.kind !== "tailcast") {
    return { ...trick, phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true };
  }
  const next = { ...trick, t: trick.t + Math.max(0, dt) };
  if (next.kind === "arenicolahush") {
    if (next.t < ARENICOLAHUSH_HOLD) {
      const pose = arenicolahushPose(next.t);
      next.phase = "hold";
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = "sit";
      return next;
    }
    if (next.t < ARENICOLAHUSH_HOLD + RELEASE_S) {
      const pose = releasePose(next.t - ARENICOLAHUSH_HOLD);
      next.phase = "release";
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = "sit";
      return next;
    }
    return { ...next, phase: "done", lift: 0, rot: 0, anim: "idle" };
  }
  const hold = DUR[next.kind];
  const u = next.t / hold;
  if (next.kind === "uburrow") {
    const pose = uburrowPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "pumppulse") {
    const pose = pumppulsePose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "headdig") {
    const pose = headdigPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else {
    const pose = tailcastPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  }
  if (u >= 1) return { ...next, phase: "done", lift: 0, rot: 0, anim: "idle" };
  return next;
}
