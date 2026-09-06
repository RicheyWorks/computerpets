/** Pulse ground tricks while idle. House moon jelly — bell / oral / lucent / trail / medusa personality (umbrella-bell contractions, four oral-arm drape, translucence shimmer, trailing tentacle sway, gentle medusa desk life; not Cup mantle dens, Sepia cuttlebone chromatophores, Chamber spiral chambers, or Coin bowl-drift). Feed-happy thank-yous sit after eat. Card-open freeze and window-play do not swallow a thank-you. Sleep, hide, and leave still win. Same map as desktop `moon_jelly-tricks.js`. Window-play CHIME unchanged — never names `chime`. Cup owns jet/mantle/sucker/veil/tinker and keep/tint/squeeze; Sepia owns bone/pupil/chroma/hover/blot and ripple/glance/dab; Chamber owns spiral/siphuncle/nacre/pinhole/fringe and chamber/pearl/quiet; Coin owns drift/gulp/flare/glint/dart and bubble/lip/swish; Ink owns soak/tuck/crane/plod/paddle and munch/bob/huff; Bloom owns gill/amble/mend/smile/plume and wink/blip/grin; Fuse owns pulse as thank-you; Bluff owns hood; Bandit owns tribute; Phoenix owns lift; hedgehog owns curl. No cry inventing — thank-yous are silent desk motion only. */

export const TRICK_KEY = "moon_jelly";
export const TRICKS = ["bell", "oral", "lucent", "trail", "medusa"] as const;
export const HAPPY = ["halo", "lumen", "gel"] as const;
export type MoonJellyTrickKind = (typeof TRICKS)[number];
export type MoonJellyHappyKind = (typeof HAPPY)[number];
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

export type MoonJellyTrick = {
  kind: MoonJellyTrickKind;
  phase: TrickPhase;
  t: number;
  x: number;
  lift: number;
  rot: number;
  anim: TrickAnim;
  facing: 1 | -1;
  fromX?: number;
  abort?: boolean;
};

export type MoonJellyHappy = {
  kind: MoonJellyHappyKind;
  happy: true;
  phase: HappyPhase;
  t: number;
  x: number;
  lift: number;
  rot: number;
  anim: TrickAnim;
  facing: 1 | -1;
  fromX?: number;
  abort?: boolean;
};

export const HAPPY_DUR: Record<MoonJellyHappyKind, number> = {
  halo: 1.26,
  lumen: 1.18,
  gel: 1.14,
};

/** Bell hold — Pulse rests in soft umbrella contractions. Not window-play CHIME. Not Coin drift. Not Chamber spiral. Not Cup mantle. */
export const BELL_HOLD = 11.0;
export const RELEASE_S = 0.62;

export const DUR: Record<MoonJellyTrickKind, number> = {
  bell: BELL_HOLD + RELEASE_S,
  oral: 1.42,
  lucent: 1.36,
  trail: 1.48,
  medusa: 1.4,
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

export function nextTrickWait(justFinished: boolean, rand?: number, kind?: MoonJellyTrickKind) {
  const roll = rand == null ? Math.random() : rand;
  if (kind === "bell") return 46 + roll * 26;
  if (kind === "oral") return 15 + roll * 10;
  if (kind === "trail") return 16 + roll * 11;
  return justFinished ? 10 + roll * 8 : 5 + roll * 6;
}

export function pickTrick(rand?: number, musicOn?: boolean, lastKind?: MoonJellyTrickKind | null) {
  if (musicOn) return "bell";
  const roll = rand == null ? Math.random() : rand;
  if (lastKind === "bell") {
    if (roll < 0.26) return "oral";
    if (roll < 0.48) return "lucent";
    if (roll < 0.72) return "trail";
    return "medusa";
  }
  if (lastKind === "oral") {
    if (roll < 0.28) return "bell";
    if (roll < 0.5) return "lucent";
    if (roll < 0.72) return "trail";
    return "medusa";
  }
  if (lastKind === "lucent") {
    if (roll < 0.22) return "bell";
    if (roll < 0.44) return "oral";
    if (roll < 0.66) return "trail";
    return "medusa";
  }
  if (roll < 0.2) return "bell";
  if (roll < 0.4) return "oral";
  if (roll < 0.6) return "lucent";
  if (roll < 0.8) return "trail";
  return "medusa";
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
  return key === TRICK_KEY || key === "pulse";
}

export function startThankYou(
  key: string | undefined | null,
  lastKind: MoonJellyHappyKind | string | null | undefined,
  x: number,
  facing: 1 | -1,
  flags?: TrickFlags,
) {
  if (!wantsThankYou(key)) return null;
  if (!happyCanStart(flags || { cmd: "idle" })) return null;
  const pick = pickHappy(lastKind as MoonJellyHappyKind | null | undefined);
  return { happy: beginHappy(pick, x, facing), kind: pick };
}

export function pickHappy(lastKind?: MoonJellyHappyKind | null, rand?: number) {
  const pool = HAPPY.filter((k) => k !== lastKind);
  const list = pool.length ? pool : [...HAPPY];
  const roll = rand == null ? Math.random() : rand;
  return list[Math.floor(roll * list.length)] || list[0];
}

export function beginHappy(kind: MoonJellyHappyKind | string, x: number, facing: 1 | -1): MoonJellyHappy {
  const name = (HAPPY as readonly string[]).indexOf(kind) >= 0 ? (kind as MoonJellyHappyKind) : "halo";
  return {
    kind: name,
    happy: true,
    phase: "go",
    t: 0,
    x: x,
    lift: 0,
    rot: 0,
    anim: name === "halo" ? "sit" : name === "lumen" ? "talk" : "sit",
    facing: facing == null ? 1 : facing,
    fromX: x,
  };
}

export function haloPose(t: number) {
  const u = Math.max(0, Math.min(1, t / HAPPY_DUR.halo));
  if (u < 0.16) {
    const s = u / 0.16;
    return { lift: s * 1.1, rot: s * 2.8, dx: 0, anim: "sit" as TrickAnim };
  }
  if (u < 0.78) {
    const ring = Math.sin(t * 2.2);
    return {
      lift: 1.1 + Math.abs(ring) * 0.2,
      rot: 2.8 + ring * 3.4,
      dx: ring * 0.09,
      anim: "sit" as TrickAnim,
    };
  }
  const s = (u - 0.78) / 0.22;
  return { lift: 0.9 * (1 - s), rot: 1.8 * (1 - s), dx: 0, anim: "idle" as TrickAnim };
}

export function lumenPose(t: number) {
  const u = Math.max(0, Math.min(1, t / HAPPY_DUR.lumen));
  if (u < 0.12) {
    const s = u / 0.12;
    return { lift: s * 0.85, rot: s * -6.5, dx: 0, anim: "talk" as TrickAnim };
  }
  if (u < 0.8) {
    const w = Math.sin(t * 2.5);
    return {
      lift: 0.85 + Math.abs(w) * 0.22,
      rot: -6.5 + w * 8.5,
      dx: w * 0.1,
      anim: "talk" as TrickAnim,
    };
  }
  const s = (u - 0.8) / 0.2;
  return { lift: 0.85 * (1 - s), rot: -6.5 * (1 - s), dx: 0, anim: "sit" as TrickAnim };
}

export function gelPose(t: number) {
  return {
    lift: Math.abs(Math.sin(t * 1.5)) * 0.32 + 0.72,
    rot: 1.2 + Math.sin(t * 1.8) * 2.8,
    dx: Math.sin(t * 1.1) * 0.07,
    anim: "sit" as TrickAnim,
  };
}

export function stepHappy(happy: MoonJellyHappy, dt: number, flags?: TrickFlags): MoonJellyHappy {
  if (!happy || happy.phase === "done") return happy;
  if (happyShouldAbort(flags)) {
    return { ...happy, phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true };
  }
  const next: MoonJellyHappy = { ...happy, t: happy.t + Math.max(0, dt) };
  const hold = HAPPY_DUR[next.kind];
  if (next.kind === "halo") {
    const pose = haloPose(next.t);
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "lumen") {
    const pose = lumenPose(next.t);
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else {
    const pose = gelPose(next.t);
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  }
  if (next.t >= hold) return { ...next, phase: "done", lift: 0, rot: 0, anim: "idle" };
  return next;
}

export function sleepHoldFrame(_key?: string | null, _frameCount?: number) {
  return null;
}

export function beginTrick(kind: MoonJellyTrickKind, x: number, facing: 1 | -1): MoonJellyTrick {
  const anim: TrickAnim =
    kind === "bell"
      ? "sit"
      : kind === "oral"
        ? "talk"
        : kind === "lucent"
          ? "sit"
          : kind === "trail"
            ? "play"
            : kind === "medusa"
              ? "walk"
              : "sit";
  return {
    kind: kind,
    phase: kind === "bell" ? "hold" : "go",
    t: 0,
    x: x,
    lift: 0,
    rot: 0,
    anim: anim,
    facing: facing == null ? 1 : facing,
    fromX: x,
  };
}

function smoothstep(t: number) {
  const x = Math.max(0, Math.min(1, t));
  return x * x * (3 - 2 * x);
}

export function bellPose(t: number) {
  const beat = Math.sin(t * 0.95) + 0.16 * Math.sin(t * 2.4);
  return {
    lift: 1.05 + Math.abs(Math.sin(t * 0.95)) * 0.35,
    rot: 1.6 + beat * 2.2,
  };
}

export function releasePose(t: number) {
  const u = Math.max(0, Math.min(1, t / RELEASE_S));
  return { lift: 1.05 * (1 - Math.sin(u * Math.PI * 0.5)), rot: 1.6 * (1 - u) };
}

export function oralPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.oral));
  if (u < 0.12) {
    const s = smoothstep(u / 0.12);
    return { x: fromX, lift: s * 0.7, rot: s * -8 * facing, anim: "talk" as TrickAnim };
  }
  if (u < 0.7) {
    const s = (u - 0.12) / 0.58;
    const arm = Math.sin(s * Math.PI * 3.2);
    const drape = Math.sin(s * Math.PI * 1.6);
    return {
      x: fromX + facing * drape * 0.22,
      lift: 0.7 + Math.abs(arm) * 0.18,
      rot: facing * (-8 + arm * 10 + drape * 2),
      anim: "talk" as TrickAnim,
    };
  }
  const s = smoothstep((u - 0.7) / 0.3);
  return {
    x: fromX,
    lift: 0.7 * (1 - s),
    rot: facing * (-3 * (1 - s)),
    anim: "sit" as TrickAnim,
  };
}

export function lucentPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.lucent));
  if (u < 0.14) {
    const s = smoothstep(u / 0.14);
    return { x: fromX, lift: s * 0.95, rot: s * 4 * facing, anim: "sit" as TrickAnim };
  }
  if (u < 0.72) {
    const s = (u - 0.14) / 0.58;
    const sheen = Math.sin(s * Math.PI * 3.6);
    return {
      x: fromX + facing * sheen * 0.12,
      lift: 0.95 + Math.abs(sheen) * 0.28,
      rot: facing * (4 + sheen * 5.5),
      anim: "sit" as TrickAnim,
    };
  }
  const s = smoothstep((u - 0.72) / 0.28);
  return {
    x: fromX,
    lift: 0.95 * (1 - s),
    rot: facing * (2.5 * (1 - s)),
    anim: "idle" as TrickAnim,
  };
}

export function trailPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.trail));
  if (u < 0.1) {
    const s = smoothstep(u / 0.1);
    return { x: fromX, lift: s * 1.15, rot: s * -4 * facing, anim: "play" as TrickAnim };
  }
  if (u < 0.72) {
    const s = (u - 0.1) / 0.62;
    const wave = Math.sin(s * Math.PI * 5.2);
    const soft = Math.sin(s * Math.PI * 2.0);
    return {
      x: fromX + facing * soft * 0.42,
      lift: 1.15 + Math.abs(wave) * 0.35,
      rot: facing * (-4 + wave * 7 + soft * 3.5),
      anim: "play" as TrickAnim,
    };
  }
  const s = smoothstep((u - 0.72) / 0.28);
  return {
    x: fromX,
    lift: 1.15 * (1 - s),
    rot: facing * (-2 * (1 - s)),
    anim: "idle" as TrickAnim,
  };
}

export function medusaPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.medusa));
  if (u < 0.12) {
    const s = smoothstep(u / 0.12);
    return { x: fromX, lift: s * 1.45, rot: s * 3 * facing, anim: "walk" as TrickAnim };
  }
  if (u < 0.7) {
    const s = (u - 0.12) / 0.58;
    const bob = Math.sin(s * Math.PI * 2.4);
    const glide = Math.sin(s * Math.PI * 1.2);
    return {
      x: fromX + facing * glide * 0.28,
      lift: 1.45 + bob * 0.4,
      rot: facing * (3 + bob * 3.5 + glide * 2),
      anim: "walk" as TrickAnim,
    };
  }
  const s = smoothstep((u - 0.7) / 0.3);
  return {
    x: fromX,
    lift: 1.45 * (1 - s),
    rot: facing * (1.5 * (1 - s)),
    anim: "sit" as TrickAnim,
  };
}

export function stepTrick(trick: MoonJellyTrick, dt: number, flags?: TrickFlags): MoonJellyTrick {
  if (!trick || trick.phase === "done") return trick;
  if (shouldAbort(flags) && trick.kind !== "oral" && trick.kind !== "lucent" && trick.kind !== "trail") {
    return { ...trick, phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true };
  }
  const next: MoonJellyTrick = { ...trick, t: trick.t + Math.max(0, dt) };
  if (next.kind === "bell") {
    if (next.t < BELL_HOLD) {
      const pose = bellPose(next.t);
      next.phase = "hold";
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = "sit";
      return next;
    }
    if (next.t < BELL_HOLD + RELEASE_S) {
      const pose = releasePose(next.t - BELL_HOLD);
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
  if (next.kind === "oral") {
    const pose = oralPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "lucent") {
    const pose = lucentPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "trail") {
    const pose = trailPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else {
    const pose = medusaPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  }
  if (u >= 1) return { ...next, phase: "done", lift: 0, rot: 0, anim: "idle" };
  return next;
}
