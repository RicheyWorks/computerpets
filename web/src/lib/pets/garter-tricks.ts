/** Sash ground tricks while idle. House common garter — seam / rounds / moss / fork / lap personality (stripe/patrol/moss desk life; damp-moss desk officer). Feed-happy thank-yous sit after eat. Card-open freeze and window-play do not swallow a thank-you. Sleep, hide, and leave still win. Same map as desktop `garter-tricks.js`. Not a Rui, cat, dog, rabbit, hamster, guinea pig, turtle, goldfish, budgie, fox, penguin, parrot, ferret, hedgehog, chinchilla, axolotl, toucan, iguana, dragon/Vesper, phoenix/Ember, ball-python/Nori, corn-snake/Saffron, kingsnake/Bandit, green-tree-python/Jade, hognose/Bluff, or *Dragon electrical (Relay/Fuse/Ground) move clone. Window-play PATROL unchanged — never names `patrol`. Nori owns orb/nook/taste/inch/unroll and savor/nestle/center; Saffron owns scribble/gap/comma/probe/canyon and clause/spice/cord; Bandit owns stripe/audit/verdict/plumb/raid and tribute/docket/seal; Jade owns bracelet/sway/jewel/heat/bough and pendant/treaty/emerald; Bluff owns hood/feign/shovel/gape/encore and aside/cue/ovation; hedgehog owns curl/root; volt window-play owns coil; ferret owns noodle; Ember owns settle/shine/dip; Vesper owns fold/thrum/glow; Sol owns flick/sun; Coin owns flare; Thimble owns dig; Lula window-play owns loop; Echo window-play owns perch; Fox window-play owns scent. Avoids patrol/stripe/hood/feign/shovel/gape/encore/flip/saddle/drape/inspect/write/orb/nook/taste/inch/unroll/bun/ball/coil/curl/bask/loaf/potato/tuck/hide/settle/shine/dip/sprawl/guard/smolder/claim/fold/thrum/glow/incline/sun/dewlap/cinder/blaze/shed/lift/return/flick/warm/thread/dart/noodle/savor/nestle/center/scribble/gap/comma/probe/canyon/clause/spice/cord/stripe/audit/verdict/plumb/raid/tribute/docket/seal/bracelet/sway/jewel/heat/bough/pendant/treaty/emerald/aside/cue/ovation/root/flare/dig/loop/perch/hang/clasp/scent name collisions with prior guests and garter window-play. No cry inventing — thank-yous are silent desk motion only. */

export const TRICK_KEY = "garter";
export const TRICKS = ["seam", "rounds", "moss", "fork", "lap"] as const;
export const HAPPY = ["copy", "brief", "visa"] as const;
export type GarterTrickKind = (typeof TRICKS)[number];
export type GarterHappyKind = (typeof HAPPY)[number];
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

export type GarterTrick = {
  kind: GarterTrickKind;
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

export type GarterHappy = {
  kind: GarterHappyKind;
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

export const HAPPY_DUR: Record<GarterHappyKind, number> = {
  copy: 1.14,
  brief: 1.18,
  visa: 1.26,
};

/** Seam hold — Sash rests the three longitudinal lines as a desk seam. Not window-play PATROL. Not Bandit stripe. */
export const SEAM_HOLD = 10.2;
export const RELEASE_S = 0.56;

export const DUR: Record<GarterTrickKind, number> = {
  seam: SEAM_HOLD + RELEASE_S,
  rounds: 1.48,
  moss: 1.36,
  fork: 1.24,
  lap: 1.42,
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

export function nextTrickWait(justFinished: boolean, rand?: number, kind?: GarterTrickKind) {
  const roll = rand == null ? Math.random() : rand;
  if (kind === "seam") return 44 + roll * 24;
  if (kind === "rounds") return 15 + roll * 10;
  if (kind === "fork") return 13 + roll * 9;
  return justFinished ? 10 + roll * 8 : 5 + roll * 6;
}

export function pickTrick(rand?: number, musicOn?: boolean, lastKind?: GarterTrickKind | null) {
  if (musicOn) return "seam" as const;
  const roll = rand == null ? Math.random() : rand;
  if (lastKind === "seam") {
    if (roll < 0.28) return "rounds" as const;
    if (roll < 0.5) return "moss" as const;
    if (roll < 0.72) return "fork" as const;
    return "lap" as const;
  }
  if (lastKind === "rounds") {
    if (roll < 0.3) return "seam" as const;
    if (roll < 0.52) return "moss" as const;
    if (roll < 0.74) return "fork" as const;
    return "lap" as const;
  }
  if (lastKind === "fork") {
    if (roll < 0.24) return "seam" as const;
    if (roll < 0.46) return "rounds" as const;
    if (roll < 0.68) return "moss" as const;
    return "lap" as const;
  }
  if (roll < 0.22) return "seam" as const;
  if (roll < 0.42) return "rounds" as const;
  if (roll < 0.6) return "moss" as const;
  if (roll < 0.8) return "fork" as const;
  return "lap" as const;
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
  return key === TRICK_KEY || key === "sash";
}

export function startThankYou(
  key: string | undefined | null,
  lastKind: GarterHappyKind | string | null | undefined,
  x: number,
  facing: 1 | -1,
  flags?: TrickFlags,
) {
  if (!wantsThankYou(key)) return null;
  if (!happyCanStart(flags || { cmd: "idle" })) return null;
  const pick = pickHappy(lastKind as GarterHappyKind | null | undefined);
  return { happy: beginHappy(pick, x, facing), kind: pick };
}

export function pickHappy(lastKind?: GarterHappyKind | null, rand?: number) {
  const pool = HAPPY.filter((k) => k !== lastKind);
  const list = pool.length ? pool : [...HAPPY];
  const roll = rand == null ? Math.random() : rand;
  return list[Math.floor(roll * list.length)] || list[0];
}

export function beginHappy(kind: GarterHappyKind, x: number, facing: 1 | -1): GarterHappy {
  const name = HAPPY.includes(kind) ? kind : "copy";
  return {
    kind: name,
    happy: true,
    phase: "go",
    t: 0,
    x,
    lift: 0,
    rot: 0,
    anim: name === "copy" ? "sit" : name === "brief" ? "talk" : "sit",
    facing: facing == null ? 1 : facing,
    fromX: x,
  };
}

export function copyPose(t: number) {
  const u = Math.max(0, Math.min(1, t / HAPPY_DUR.copy));
  if (u < 0.14) {
    const s = u / 0.14;
    return { lift: s * 1.85, rot: s * -7, dx: 0, anim: "sit" as TrickAnim };
  }
  if (u < 0.8) {
    return {
      lift: 1.85 + Math.abs(Math.sin(t * 3.4)) * 0.55,
      rot: -7 + Math.sin(t * 2.4) * 4.5,
      dx: Math.sin(t * 1.7) * 0.32,
      anim: "sit" as TrickAnim,
    };
  }
  const s = (u - 0.8) / 0.2;
  return { lift: 1.85 * (1 - s), rot: -7 * (1 - s), dx: 0, anim: "idle" as TrickAnim };
}

export function briefPose(t: number) {
  const u = Math.max(0, Math.min(1, t / HAPPY_DUR.brief));
  if (u < 0.12) {
    const s = u / 0.12;
    return { lift: s * 2.05, rot: s * 8, dx: 0, anim: "talk" as TrickAnim };
  }
  if (u < 0.78) {
    const tick = Math.sin(t * 5.6);
    return {
      lift: 2.05 + Math.abs(tick) * 0.45,
      rot: 8 + tick * 6,
      dx: tick * 0.3,
      anim: "talk" as TrickAnim,
    };
  }
  const s = (u - 0.78) / 0.22;
  return { lift: 2.05 * (1 - s), rot: 8 * (1 - s), dx: 0, anim: "sit" as TrickAnim };
}

export function visaPose(t: number) {
  return {
    lift: Math.abs(Math.sin(t * 2.0)) * 0.95 + 0.95,
    rot: -9 + Math.sin(t * 1.7) * 4.8,
    dx: Math.sin(t * 1.45) * 0.38,
    anim: "sit" as TrickAnim,
  };
}

export function stepHappy(happy: GarterHappy | null | undefined, dt: number, flags?: TrickFlags) {
  if (!happy || happy.phase === "done") return happy;
  if (happyShouldAbort(flags)) {
    return { ...happy, phase: "done" as const, t: 0, lift: 0, rot: 0, anim: "idle" as TrickAnim, abort: true };
  }
  const next: GarterHappy = { ...happy, t: happy.t + Math.max(0, dt) };
  const hold = HAPPY_DUR[next.kind];
  if (next.kind === "copy") {
    const pose = copyPose(next.t);
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "brief") {
    const pose = briefPose(next.t);
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else {
    const pose = visaPose(next.t);
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

export function beginTrick(kind: GarterTrickKind, x: number, facing: 1 | -1): GarterTrick {
  const anim: TrickAnim =
    kind === "seam"
      ? "sit"
      : kind === "rounds"
        ? "walk"
        : kind === "moss"
          ? "sit"
          : kind === "fork"
            ? "talk"
            : kind === "lap"
              ? "play"
              : "sit";
  return {
    kind,
    phase: kind === "seam" ? "hold" : "go",
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

export function seamPose(t: number) {
  return {
    lift: 1.35 + Math.sin(t * 0.85) * 0.18,
    rot: -12 + Math.sin(t * 0.72) * 2.1 + Math.sin(t * 1.9) * 1.0,
  };
}

export function releasePose(t: number) {
  const u = Math.max(0, Math.min(1, t / RELEASE_S));
  return { lift: 1.35 * (1 - Math.sin(u * Math.PI * 0.5)), rot: -12 * (1 - u) };
}

export function roundsPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.rounds));
  if (u < 0.12) {
    const s = smoothstep(u / 0.12);
    return { x: fromX + facing * s * 1.2, lift: s * 0.7, rot: s * 6 * facing, anim: "walk" as TrickAnim };
  }
  if (u < 0.5) {
    const s = (u - 0.12) / 0.38;
    return {
      x: fromX + facing * (1.2 + smoothstep(s) * 5.5),
      lift: 0.7 + Math.sin(s * Math.PI * 2.2) * 0.35,
      rot: facing * (6 + Math.sin(s * Math.PI * 3) * 5),
      anim: "walk" as TrickAnim,
    };
  }
  if (u < 0.78) {
    const s = (u - 0.5) / 0.28;
    return {
      x: fromX + facing * (6.7 - smoothstep(s) * 3.2),
      lift: 0.75 + Math.abs(Math.sin(s * Math.PI * 2)) * 0.25,
      rot: facing * (4 - s * 8),
      anim: "walk" as TrickAnim,
    };
  }
  const s = smoothstep((u - 0.78) / 0.22);
  return {
    x: fromX + facing * (3.5 * (1 - s)),
    lift: 0.75 * (1 - s),
    rot: facing * (-2 * (1 - s)),
    anim: "sit" as TrickAnim,
  };
}

export function mossPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.moss));
  if (u < 0.14) {
    const s = smoothstep(u / 0.14);
    return { x: fromX + facing * s * 0.6, lift: s * 0.45, rot: s * 16 * facing, anim: "sit" as TrickAnim };
  }
  if (u < 0.78) {
    const s = (u - 0.14) / 0.64;
    const nudge = Math.sin(s * Math.PI * 2.4);
    return {
      x: fromX + facing * (0.6 + nudge * 0.4),
      lift: 0.35 + Math.abs(nudge) * 0.2,
      rot: facing * (16 + nudge * 5),
      anim: "sit" as TrickAnim,
    };
  }
  const s = smoothstep((u - 0.78) / 0.22);
  return {
    x: fromX + facing * (0.6 * (1 - s)),
    lift: 0.35 * (1 - s),
    rot: facing * 6 * (1 - s),
    anim: "idle" as TrickAnim,
  };
}

export function forkPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.fork));
  if (u < 0.12) {
    const s = smoothstep(u / 0.12);
    return { x: fromX, lift: s * 2.15, rot: s * -10 * facing, anim: "talk" as TrickAnim };
  }
  if (u < 0.82) {
    const s = (u - 0.12) / 0.7;
    const flick = Math.sin(s * Math.PI * 5.2);
    return {
      x: fromX + facing * flick * 0.45,
      lift: 2.15 + Math.abs(flick) * 0.28,
      rot: facing * (-10 + flick * 9),
      anim: "talk" as TrickAnim,
    };
  }
  const s = smoothstep((u - 0.82) / 0.18);
  return {
    x: fromX,
    lift: 2.15 * (1 - s),
    rot: facing * -3 * (1 - s),
    anim: "sit" as TrickAnim,
  };
}

export function lapPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.lap));
  if (u < 0.12) {
    const s = smoothstep(u / 0.12);
    return { x: fromX, lift: s * 2.0, rot: -s * 8 * facing, anim: "play" as TrickAnim };
  }
  if (u < 0.5) {
    const s = (u - 0.12) / 0.38;
    return {
      x: fromX + facing * smoothstep(s) * 4.8,
      lift: 2.0 + Math.sin(s * Math.PI) * 0.75,
      rot: facing * (-8 + s * 20),
      anim: "play" as TrickAnim,
    };
  }
  if (u < 0.78) {
    const s = (u - 0.5) / 0.28;
    return {
      x: fromX + facing * 4.8,
      lift: 2.3 + Math.sin(s * Math.PI * 1.5) * 0.35,
      rot: facing * (12 - s * 5),
      anim: "sit" as TrickAnim,
    };
  }
  const s = smoothstep((u - 0.78) / 0.22);
  return {
    x: fromX + facing * (4.8 * (1 - s)),
    lift: 2.3 * (1 - s),
    rot: facing * 4 * (1 - s),
    anim: "sit" as TrickAnim,
  };
}

export function stepTrick(trick: GarterTrick | null | undefined, dt: number, flags?: TrickFlags) {
  if (!trick || trick.phase === "done") return trick;
  if (shouldAbort(flags) && trick.kind !== "lap" && trick.kind !== "rounds") {
    return { ...trick, phase: "done" as const, t: 0, lift: 0, rot: 0, anim: "idle" as TrickAnim, abort: true };
  }
  const next: GarterTrick = { ...trick, t: trick.t + Math.max(0, dt) };
  if (next.kind === "seam") {
    if (next.t < SEAM_HOLD) {
      const pose = seamPose(next.t);
      next.phase = "hold";
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = "sit";
      return next;
    }
    if (next.t < SEAM_HOLD + RELEASE_S) {
      const pose = releasePose(next.t - SEAM_HOLD);
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
  if (next.kind === "rounds") {
    const pose = roundsPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "moss") {
    const pose = mossPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "fork") {
    const pose = forkPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else {
    const pose = lapPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  }
  if (u >= 1) return { ...next, phase: "done" as const, lift: 0, rot: 0, anim: "idle" as TrickAnim };
  return next;
}
