/** Bluff ground tricks while idle. House western hognose — hood / feign / shovel / gape / encore personality (bluff/death-feign/nose desk life; eraser-dish theater). Feed-happy thank-yous sit after eat. Card-open freeze and window-play do not swallow a thank-you. Sleep, hide, and leave still win. Same map as desktop `hognose-tricks.js`. Not a Rui, cat, dog, rabbit, hamster, guinea pig, turtle, goldfish, budgie, fox, penguin, parrot, ferret, hedgehog, chinchilla, axolotl, toucan, iguana, dragon/Vesper, phoenix/Ember, ball-python/Nori, corn-snake/Saffron, kingsnake/Bandit, green-tree-python/Jade, or *Dragon electrical (Relay/Fuse/Ground) move clone. Window-play FLIP unchanged — never names `flip`. Nori owns orb/nook/taste/inch/unroll and savor/nestle/center; Saffron owns scribble/gap/comma/probe/canyon and clause/spice/cord; Bandit owns stripe/audit/verdict/plumb/raid and tribute/docket/seal; Jade owns bracelet/sway/jewel/heat/bough and pendant/treaty/emerald; hedgehog owns curl/root; volt window-play owns coil; ferret owns noodle; Ember owns settle/shine/dip; Vesper owns fold/thrum/glow; Sol owns flick/sun; Coin owns flare; Thimble owns dig; Lula window-play owns loop; Echo window-play owns perch. Avoids flip/saddle/drape/inspect/write/orb/nook/taste/inch/unroll/bun/ball/coil/curl/bask/loaf/potato/tuck/hide/settle/shine/dip/sprawl/guard/smolder/claim/fold/thrum/glow/incline/sun/dewlap/cinder/blaze/shed/lift/return/flick/warm/thread/dart/noodle/savor/nestle/center/scribble/gap/comma/probe/canyon/clause/spice/cord/stripe/audit/verdict/plumb/raid/tribute/docket/seal/bracelet/sway/jewel/heat/bough/pendant/treaty/emerald/root/flare/dig/loop/perch/hang/clasp name collisions with prior guests and hognose window-play. No cry inventing — thank-yous are silent desk motion only. */

export const TRICK_KEY = "hognose";
export const TRICKS = ["hood", "feign", "shovel", "gape", "encore"] as const;
export const HAPPY = ["aside", "cue", "ovation"] as const;
export type HognoseTrickKind = (typeof TRICKS)[number];
export type HognoseHappyKind = (typeof HAPPY)[number];
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

export type HognoseTrick = {
  kind: HognoseTrickKind;
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

export type HognoseHappy = {
  kind: HognoseHappyKind;
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

export const HAPPY_DUR: Record<HognoseHappyKind, number> = {
  aside: 1.16,
  cue: 1.2,
  ovation: 1.28,
};

/** Hood hold — Bluff flattens a false cobra hood on the eraser dish. Not window-play FLIP. Not Jade bracelet. */
export const HOOD_HOLD = 10.4;
export const RELEASE_S = 0.58;

export const DUR: Record<HognoseTrickKind, number> = {
  hood: HOOD_HOLD + RELEASE_S,
  feign: 1.52,
  shovel: 1.34,
  gape: 1.28,
  encore: 1.44,
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

export function nextTrickWait(justFinished: boolean, rand?: number, kind?: HognoseTrickKind) {
  const roll = rand == null ? Math.random() : rand;
  if (kind === "hood") return 44 + roll * 24;
  if (kind === "feign") return 16 + roll * 10;
  if (kind === "gape") return 14 + roll * 10;
  return justFinished ? 10 + roll * 8 : 5 + roll * 6;
}

export function pickTrick(rand?: number, musicOn?: boolean, lastKind?: HognoseTrickKind | null) {
  if (musicOn) return "hood" as const;
  const roll = rand == null ? Math.random() : rand;
  if (lastKind === "hood") {
    if (roll < 0.28) return "feign" as const;
    if (roll < 0.5) return "shovel" as const;
    if (roll < 0.72) return "gape" as const;
    return "encore" as const;
  }
  if (lastKind === "feign") {
    if (roll < 0.3) return "hood" as const;
    if (roll < 0.52) return "shovel" as const;
    if (roll < 0.74) return "gape" as const;
    return "encore" as const;
  }
  if (lastKind === "gape") {
    if (roll < 0.24) return "hood" as const;
    if (roll < 0.46) return "feign" as const;
    if (roll < 0.68) return "shovel" as const;
    return "encore" as const;
  }
  if (roll < 0.22) return "hood" as const;
  if (roll < 0.42) return "feign" as const;
  if (roll < 0.6) return "shovel" as const;
  if (roll < 0.8) return "gape" as const;
  return "encore" as const;
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
  return key === TRICK_KEY || key === "bluff";
}

export function startThankYou(
  key: string | undefined | null,
  lastKind: HognoseHappyKind | string | null | undefined,
  x: number,
  facing: 1 | -1,
  flags?: TrickFlags,
) {
  if (!wantsThankYou(key)) return null;
  if (!happyCanStart(flags || { cmd: "idle" })) return null;
  const pick = pickHappy(lastKind as HognoseHappyKind | null | undefined);
  return { happy: beginHappy(pick, x, facing), kind: pick };
}

export function pickHappy(lastKind?: HognoseHappyKind | null, rand?: number) {
  const pool = HAPPY.filter((k) => k !== lastKind);
  const list = pool.length ? pool : [...HAPPY];
  const roll = rand == null ? Math.random() : rand;
  return list[Math.floor(roll * list.length)] || list[0];
}

export function beginHappy(kind: HognoseHappyKind, x: number, facing: 1 | -1): HognoseHappy {
  const name = HAPPY.includes(kind) ? kind : "aside";
  return {
    kind: name,
    happy: true,
    phase: "go",
    t: 0,
    x,
    lift: 0,
    rot: 0,
    anim: name === "aside" ? "sit" : name === "cue" ? "talk" : "sit",
    facing: facing == null ? 1 : facing,
    fromX: x,
  };
}

export function asidePose(t: number) {
  const u = Math.max(0, Math.min(1, t / HAPPY_DUR.aside));
  if (u < 0.14) {
    const s = u / 0.14;
    return { lift: s * 2.0, rot: s * -8, dx: 0, anim: "sit" as TrickAnim };
  }
  if (u < 0.8) {
    return {
      lift: 2.0 + Math.abs(Math.sin(t * 3.6)) * 0.65,
      rot: -8 + Math.sin(t * 2.6) * 5,
      dx: Math.sin(t * 1.8) * 0.28,
      anim: "sit" as TrickAnim,
    };
  }
  const s = (u - 0.8) / 0.2;
  return { lift: 2.0 * (1 - s), rot: -8 * (1 - s), dx: 0, anim: "idle" as TrickAnim };
}

export function cuePose(t: number) {
  const u = Math.max(0, Math.min(1, t / HAPPY_DUR.cue));
  if (u < 0.12) {
    const s = u / 0.12;
    return { lift: s * 2.2, rot: s * 9, dx: 0, anim: "talk" as TrickAnim };
  }
  if (u < 0.78) {
    const tick = Math.sin(t * 6.0);
    return {
      lift: 2.2 + Math.abs(tick) * 0.5,
      rot: 9 + tick * 7,
      dx: tick * 0.32,
      anim: "talk" as TrickAnim,
    };
  }
  const s = (u - 0.78) / 0.22;
  return { lift: 2.2 * (1 - s), rot: 9 * (1 - s), dx: 0, anim: "sit" as TrickAnim };
}

export function ovationPose(t: number) {
  return {
    lift: Math.abs(Math.sin(t * 2.1)) * 1.05 + 1.0,
    rot: -10 + Math.sin(t * 1.8) * 5.2,
    dx: Math.sin(t * 1.5) * 0.4,
    anim: "sit" as TrickAnim,
  };
}

export function stepHappy(happy: HognoseHappy | null | undefined, dt: number, flags?: TrickFlags) {
  if (!happy || happy.phase === "done") return happy;
  if (happyShouldAbort(flags)) {
    return { ...happy, phase: "done" as const, t: 0, lift: 0, rot: 0, anim: "idle" as TrickAnim, abort: true };
  }
  const next: HognoseHappy = { ...happy, t: happy.t + Math.max(0, dt) };
  const hold = HAPPY_DUR[next.kind];
  if (next.kind === "aside") {
    const pose = asidePose(next.t);
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "cue") {
    const pose = cuePose(next.t);
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else {
    const pose = ovationPose(next.t);
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

export function beginTrick(kind: HognoseTrickKind, x: number, facing: 1 | -1): HognoseTrick {
  const anim: TrickAnim =
    kind === "hood"
      ? "sit"
      : kind === "feign"
        ? "sit"
        : kind === "shovel"
          ? "talk"
          : kind === "gape"
            ? "talk"
            : kind === "encore"
              ? "play"
              : "sit";
  return {
    kind,
    phase: kind === "hood" ? "hold" : "go",
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

export function hoodPose(t: number) {
  return {
    lift: 1.55 + Math.sin(t * 0.9) * 0.2,
    rot: -18 + Math.sin(t * 0.78) * 2.4 + Math.sin(t * 2.1) * 1.2,
  };
}

export function releasePose(t: number) {
  const u = Math.max(0, Math.min(1, t / RELEASE_S));
  return { lift: 1.55 * (1 - Math.sin(u * Math.PI * 0.5)), rot: -18 * (1 - u) };
}

export function feignPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.feign));
  if (u < 0.14) {
    const s = smoothstep(u / 0.14);
    return { x: fromX, lift: s * 1.2, rot: s * 95 * facing, anim: "play" as TrickAnim };
  }
  if (u < 0.72) {
    const s = (u - 0.14) / 0.58;
    return {
      x: fromX + facing * Math.sin(s * Math.PI * 0.8) * 0.35,
      lift: 0.35 + Math.sin(s * Math.PI * 1.2) * 0.12,
      rot: facing * (95 + Math.sin(s * Math.PI * 1.4) * 4),
      anim: "sit" as TrickAnim,
    };
  }
  const s = smoothstep((u - 0.72) / 0.28);
  return {
    x: fromX,
    lift: 0.35 * (1 - s) + s * 0.8,
    rot: facing * (95 * (1 - s) + s * -6),
    anim: "sit" as TrickAnim,
  };
}

export function shovelPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.shovel));
  if (u < 0.12) {
    const s = smoothstep(u / 0.12);
    return { x: fromX + facing * s * 0.8, lift: s * 0.6, rot: s * 14 * facing, anim: "talk" as TrickAnim };
  }
  if (u < 0.84) {
    const s = (u - 0.12) / 0.72;
    const dig = Math.sin(s * Math.PI * 4.2);
    return {
      x: fromX + facing * (0.8 + dig * 1.4),
      lift: 0.55 + Math.abs(dig) * 0.35,
      rot: facing * (14 + dig * 10),
      anim: "talk" as TrickAnim,
    };
  }
  const s = smoothstep((u - 0.84) / 0.16);
  return {
    x: fromX + facing * (0.8 * (1 - s)),
    lift: 0.55 * (1 - s),
    rot: facing * 4 * (1 - s),
    anim: "sit" as TrickAnim,
  };
}

export function gapePose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.gape));
  if (u < 0.12) {
    const s = smoothstep(u / 0.12);
    return { x: fromX, lift: s * 2.4, rot: s * -12 * facing, anim: "talk" as TrickAnim };
  }
  if (u < 0.82) {
    const s = (u - 0.12) / 0.7;
    const hiss = Math.sin(s * Math.PI * 2.6);
    return {
      x: fromX + facing * hiss * 0.55,
      lift: 2.4 + Math.abs(hiss) * 0.35,
      rot: facing * (-12 + hiss * 8),
      anim: "talk" as TrickAnim,
    };
  }
  const s = smoothstep((u - 0.82) / 0.18);
  return {
    x: fromX,
    lift: 2.4 * (1 - s),
    rot: facing * -4 * (1 - s),
    anim: "sit" as TrickAnim,
  };
}

export function encorePose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.encore));
  if (u < 0.12) {
    const s = smoothstep(u / 0.12);
    return { x: fromX, lift: s * 2.2, rot: -s * 10 * facing, anim: "play" as TrickAnim };
  }
  if (u < 0.5) {
    const s = (u - 0.12) / 0.38;
    return {
      x: fromX + facing * smoothstep(s) * 4.2,
      lift: 2.2 + Math.sin(s * Math.PI) * 0.8,
      rot: facing * (-10 + s * 22),
      anim: "play" as TrickAnim,
    };
  }
  if (u < 0.78) {
    const s = (u - 0.5) / 0.28;
    return {
      x: fromX + facing * 4.2,
      lift: 2.5 + Math.sin(s * Math.PI * 1.6) * 0.4,
      rot: facing * (12 - s * 6),
      anim: "sit" as TrickAnim,
    };
  }
  const s = smoothstep((u - 0.78) / 0.22);
  return {
    x: fromX + facing * (4.2 * (1 - s)),
    lift: 2.5 * (1 - s),
    rot: facing * 4 * (1 - s),
    anim: "sit" as TrickAnim,
  };
}

export function stepTrick(trick: HognoseTrick | null | undefined, dt: number, flags?: TrickFlags) {
  if (!trick || trick.phase === "done") return trick;
  if (shouldAbort(flags) && trick.kind !== "encore" && trick.kind !== "feign") {
    return { ...trick, phase: "done" as const, t: 0, lift: 0, rot: 0, anim: "idle" as TrickAnim, abort: true };
  }
  const next: HognoseTrick = { ...trick, t: trick.t + Math.max(0, dt) };
  if (next.kind === "hood") {
    if (next.t < HOOD_HOLD) {
      const pose = hoodPose(next.t);
      next.phase = "hold";
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = "sit";
      return next;
    }
    if (next.t < HOOD_HOLD + RELEASE_S) {
      const pose = releasePose(next.t - HOOD_HOLD);
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
  if (next.kind === "feign") {
    const pose = feignPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "shovel") {
    const pose = shovelPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "gape") {
    const pose = gapePose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else {
    const pose = encorePose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  }
  if (u >= 1) return { ...next, phase: "done" as const, lift: 0, rot: 0, anim: "idle" as TrickAnim };
  return next;
}
