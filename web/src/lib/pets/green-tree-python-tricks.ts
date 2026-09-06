/** Jade ground tricks while idle. House green tree python — bracelet / sway / jewel / heat / bough personality (arboreal perch/coil desk life; lamp-arm jewelry above the work). Feed-happy thank-yous sit after eat. Card-open freeze and window-play do not swallow a thank-you. Sleep, hide, and leave still win. Same map as desktop `green-tree-python-tricks.js`. Not a Rui, cat, dog, rabbit, hamster, guinea pig, turtle, goldfish, budgie, fox, penguin, parrot, ferret, hedgehog, chinchilla, axolotl, toucan, iguana, dragon/Vesper, phoenix/Ember, ball-python/Nori, corn-snake/Saffron, kingsnake/Bandit, or *Dragon electrical (Relay/Fuse/Ground) move clone. Window-play SADDLE unchanged — never names `saddle`. Nori owns orb/nook/taste/inch/unroll and savor/nestle/center; Saffron owns scribble/gap/comma/probe/canyon and clause/spice/cord; Bandit owns stripe/audit/verdict/plumb/raid and tribute/docket/seal; hedgehog owns curl/ball; volt window-play owns coil; ferret owns noodle; Ember owns settle/shine/dip; Vesper owns fold/thrum/glow; Sol owns flick/sun; Lula window-play owns loop; Echo window-play owns perch. Avoids saddle/drape/inspect/write/orb/nook/taste/inch/unroll/bun/ball/coil/curl/bask/loaf/potato/tuck/hide/settle/shine/dip/sprawl/guard/smolder/claim/fold/thrum/glow/incline/sun/dewlap/cinder/blaze/shed/lift/return/flick/warm/thread/dart/noodle/savor/nestle/center/scribble/gap/comma/probe/canyon/clause/spice/cord/stripe/audit/verdict/plumb/raid/tribute/docket/seal/loop/perch/hang/clasp name collisions with prior guests and green_tree_python window-play. No cry inventing — thank-yous are silent desk motion only. */

export const TRICK_KEY = "green_tree_python";
export const TRICKS = ["bracelet", "sway", "jewel", "heat", "bough"] as const;
export const HAPPY = ["pendant", "treaty", "emerald"] as const;
export type GreenTreePythonTrickKind = (typeof TRICKS)[number];
export type GreenTreePythonHappyKind = (typeof HAPPY)[number];
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

export type GreenTreePythonTrick = {
  kind: GreenTreePythonTrickKind;
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

export type GreenTreePythonHappy = {
  kind: GreenTreePythonHappyKind;
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

export const HAPPY_DUR: Record<GreenTreePythonHappyKind, number> = {
  pendant: 1.18,
  treaty: 1.22,
  emerald: 1.3,
};

/** Bracelet hold — Jade folds into living jewelry on a desk branch. Not window-play SADDLE. Not Nori orb. */
export const BRACELET_HOLD = 10.6;
export const RELEASE_S = 0.6;

export const DUR: Record<GreenTreePythonTrickKind, number> = {
  bracelet: BRACELET_HOLD + RELEASE_S,
  sway: 1.4,
  jewel: 1.36,
  heat: 1.3,
  bough: 1.48,
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

export function nextTrickWait(justFinished: boolean, rand?: number, kind?: GreenTreePythonTrickKind) {
  const roll = rand == null ? Math.random() : rand;
  if (kind === "bracelet") return 44 + roll * 24;
  if (kind === "jewel") return 16 + roll * 10;
  if (kind === "heat") return 14 + roll * 10;
  return justFinished ? 10 + roll * 8 : 5 + roll * 6;
}

export function pickTrick(rand?: number, musicOn = false, lastKind?: GreenTreePythonTrickKind | null): GreenTreePythonTrickKind {
  if (musicOn) return "bracelet";
  const roll = rand == null ? Math.random() : rand;
  if (lastKind === "bracelet") {
    if (roll < 0.28) return "sway";
    if (roll < 0.5) return "jewel";
    if (roll < 0.72) return "heat";
    return "bough";
  }
  if (lastKind === "jewel") {
    if (roll < 0.3) return "bracelet";
    if (roll < 0.52) return "sway";
    if (roll < 0.74) return "heat";
    return "bough";
  }
  if (lastKind === "heat") {
    if (roll < 0.24) return "bracelet";
    if (roll < 0.46) return "sway";
    if (roll < 0.68) return "jewel";
    return "bough";
  }
  if (roll < 0.22) return "bracelet";
  if (roll < 0.42) return "sway";
  if (roll < 0.6) return "jewel";
  if (roll < 0.8) return "heat";
  return "bough";
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

export function wantsThankYou(key: string | undefined) {
  return key === TRICK_KEY || key === "jade";
}

export function startThankYou(
  key: string | undefined,
  lastKind: GreenTreePythonHappyKind | null | undefined,
  x: number,
  facing: 1 | -1,
  flags?: TrickFlags,
) {
  if (!wantsThankYou(key)) return null;
  if (!happyCanStart(flags || { cmd: "idle" })) return null;
  const pick = pickHappy(lastKind);
  return { happy: beginHappy(pick, x, facing), kind: pick };
}

export function pickHappy(lastKind?: GreenTreePythonHappyKind | null, rand?: number): GreenTreePythonHappyKind {
  const pool = HAPPY.filter((k) => k !== lastKind);
  const list = pool.length ? pool : [...HAPPY];
  const roll = rand == null ? Math.random() : rand;
  return list[Math.floor(roll * list.length)] ?? list[0]!;
}

export function beginHappy(kind: GreenTreePythonHappyKind, x: number, facing: 1 | -1 = 1): GreenTreePythonHappy {
  const name: GreenTreePythonHappyKind = HAPPY.includes(kind) ? kind : "pendant";
  return {
    kind: name,
    happy: true,
    phase: "go",
    t: 0,
    x,
    lift: 0,
    rot: 0,
    anim: name === "pendant" ? "sit" : name === "treaty" ? "talk" : "sit",
    facing,
    fromX: x,
  };
}

export function pendantPose(t: number) {
  const u = Math.max(0, Math.min(1, t / HAPPY_DUR.pendant));
  if (u < 0.14) {
    const s = u / 0.14;
    return { lift: s * 2.2, rot: s * -6, dx: 0, anim: "sit" as const };
  }
  if (u < 0.8) {
    return {
      lift: 2.2 + Math.abs(Math.sin(t * 3.8)) * 0.7,
      rot: -6 + Math.sin(t * 2.8) * 4.2,
      dx: Math.sin(t * 1.9) * 0.25,
      anim: "sit" as const,
    };
  }
  const s = (u - 0.8) / 0.2;
  return { lift: 2.2 * (1 - s), rot: -6 * (1 - s), dx: 0, anim: "idle" as const };
}

export function treatyPose(t: number) {
  const u = Math.max(0, Math.min(1, t / HAPPY_DUR.treaty));
  if (u < 0.12) {
    const s = u / 0.12;
    return { lift: s * 1.8, rot: s * 7, dx: 0, anim: "talk" as const };
  }
  if (u < 0.78) {
    const tick = Math.sin(t * 5.8);
    return {
      lift: 1.8 + Math.abs(tick) * 0.55,
      rot: 7 + tick * 8,
      dx: tick * 0.3,
      anim: "talk" as const,
    };
  }
  const s = (u - 0.78) / 0.22;
  return { lift: 1.8 * (1 - s), rot: 7 * (1 - s), dx: 0, anim: "sit" as const };
}

export function emeraldPose(t: number) {
  return {
    lift: Math.abs(Math.sin(t * 2.0)) * 0.95 + 1.1,
    rot: -8 + Math.sin(t * 1.7) * 4.5,
    dx: Math.sin(t * 1.4) * 0.35,
    anim: "sit" as const,
  };
}

export function stepHappy(happy: GreenTreePythonHappy, dt: number, flags?: TrickFlags): GreenTreePythonHappy {
  if (!happy || happy.phase === "done") return happy;
  if (happyShouldAbort(flags)) {
    return { ...happy, phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true };
  }
  const next: GreenTreePythonHappy = { ...happy, t: happy.t + Math.max(0, dt) };
  const hold = HAPPY_DUR[next.kind];
  if (next.kind === "pendant") {
    const pose = pendantPose(next.t);
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "treaty") {
    const pose = treatyPose(next.t);
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else {
    const pose = emeraldPose(next.t);
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  }
  if (next.t >= hold) return { ...next, phase: "done", lift: 0, rot: 0, anim: "idle" };
  return next;
}

/** Jade has no Rui-style sleep-frame hold. */
export function sleepHoldFrame(_key: string | undefined, _frameCount?: number) {
  return null;
}

export function beginTrick(kind: GreenTreePythonTrickKind, x: number, facing: 1 | -1 = 1): GreenTreePythonTrick {
  const anim: TrickAnim =
    kind === "bracelet"
      ? "sit"
      : kind === "jewel"
        ? "sit"
        : kind === "heat"
          ? "talk"
          : kind === "sway"
            ? "play"
            : kind === "bough"
              ? "play"
              : "sit";
  return {
    kind,
    phase: kind === "bracelet" ? "hold" : "go",
    t: 0,
    x,
    lift: 0,
    rot: 0,
    anim,
    facing,
    fromX: x,
  };
}

function smoothstep(t: number) {
  const x = Math.max(0, Math.min(1, t));
  return x * x * (3 - 2 * x);
}

/** Bracelet — folded arboreal jewelry on a desk branch. Soft rock. Not window-play SADDLE. Not Nori orb. */
export function braceletPose(t: number) {
  return {
    lift: 1.35 + Math.sin(t * 0.95) * 0.22,
    rot: -14 + Math.sin(t * 0.82) * 2.2 + Math.sin(t * 2.0) * 1.1,
  };
}

/** Soft unfold out of the bracelet; stays above the blotter. Not window-play leave. */
export function releasePose(t: number) {
  const u = Math.max(0, Math.min(1, t / RELEASE_S));
  return { lift: 1.4 * (1 - Math.sin(u * Math.PI * 0.5)), rot: -14 * (1 - u) };
}

/** Sway — lamp-arm rock without coming down. Not Saffron scribble. Not Bandit stripe. */
export function swayPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.sway));
  if (u < 0.12) {
    const s = smoothstep(u / 0.12);
    return { x: fromX, lift: s * 2.0, rot: s * -10 * facing, anim: "play" as const };
  }
  if (u < 0.88) {
    const s = (u - 0.12) / 0.76;
    const rock = Math.sin(s * Math.PI * 3.4);
    return {
      x: fromX + facing * rock * 1.6,
      lift: 2.0 + Math.abs(rock) * 0.55,
      rot: facing * (-10 + rock * 18),
      anim: "play" as const,
    };
  }
  const s = smoothstep((u - 0.88) / 0.12);
  return {
    x: fromX,
    lift: 2.0 * (1 - s),
    rot: facing * -4 * (1 - s),
    anim: "sit" as const,
  };
}

/** Jewel — still emerald display above the work. Not Bandit verdict. Not Nori orb. */
export function jewelPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.jewel));
  if (u < 0.14) {
    const s = smoothstep(u / 0.14);
    return { x: fromX, lift: s * 1.9, rot: s * -12 * facing, anim: "sit" as const };
  }
  if (u < 0.82) {
    const s = (u - 0.14) / 0.68;
    return {
      x: fromX + facing * Math.sin(s * Math.PI * 1.2) * 0.45,
      lift: 1.9 + Math.sin(s * Math.PI * 2.0) * 0.2,
      rot: facing * (-12 + Math.sin(s * Math.PI * 1.6) * 3.5),
      anim: "sit" as const,
    };
  }
  const s = smoothstep((u - 0.82) / 0.18);
  return {
    x: fromX,
    lift: 1.9 * (1 - s),
    rot: facing * -4 * (1 - s),
    anim: "sit" as const,
  };
}

/** Heat — lean toward bulb warmth without leaving height. Not Nori taste. Not Sol sun. */
export function heatPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.heat));
  if (u < 0.12) {
    const s = smoothstep(u / 0.12);
    return { x: fromX + facing * s * 0.6, lift: s * 2.1, rot: s * 8 * facing, anim: "talk" as const };
  }
  if (u < 0.84) {
    const s = (u - 0.12) / 0.72;
    const lean = Math.sin(s * Math.PI * 2.4);
    return {
      x: fromX + facing * (0.6 + lean * 1.1),
      lift: 2.1 + Math.abs(Math.sin(s * Math.PI * 2.8)) * 0.4,
      rot: facing * (8 + lean * 12),
      anim: "talk" as const,
    };
  }
  const s = smoothstep((u - 0.84) / 0.16);
  return {
    x: fromX + facing * (0.6 * (1 - s)),
    lift: 2.1 * (1 - s),
    rot: facing * 3 * (1 - s),
    anim: "sit" as const,
  };
}

/** Bough — claim a desk branch, settle high, then ease home. Arboreal, not terrestrial raid. */
export function boughPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.bough));
  if (u < 0.12) {
    const s = smoothstep(u / 0.12);
    return { x: fromX, lift: s * 2.6, rot: -s * 8 * facing, anim: "play" as const };
  }
  if (u < 0.48) {
    const s = (u - 0.12) / 0.36;
    return {
      x: fromX + facing * smoothstep(s) * 5.4,
      lift: 2.6 + Math.sin(s * Math.PI) * 0.7,
      rot: facing * (-8 + s * 16),
      anim: "play" as const,
    };
  }
  if (u < 0.78) {
    const s = (u - 0.48) / 0.3;
    return {
      x: fromX + facing * 5.4,
      lift: 2.8 + Math.sin(s * Math.PI * 1.5) * 0.35,
      rot: facing * (8 - s * 4),
      anim: "sit" as const,
    };
  }
  const s = smoothstep((u - 0.78) / 0.22);
  return {
    x: fromX + facing * (5.4 * (1 - s)),
    lift: 2.8 * (1 - s),
    rot: facing * 4 * (1 - s),
    anim: "sit" as const,
  };
}

export function stepTrick(trick: GreenTreePythonTrick, dt: number, flags?: TrickFlags): GreenTreePythonTrick {
  if (!trick || trick.phase === "done") return trick;
  if (shouldAbort(flags) && trick.kind !== "sway" && trick.kind !== "bough") {
    return { ...trick, phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true };
  }
  const next: GreenTreePythonTrick = { ...trick, t: trick.t + Math.max(0, dt) };
  if (next.kind === "bracelet") {
    if (next.t < BRACELET_HOLD) {
      const pose = braceletPose(next.t);
      next.phase = "hold";
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = "sit";
      return next;
    }
    if (next.t < BRACELET_HOLD + RELEASE_S) {
      const pose = releasePose(next.t - BRACELET_HOLD);
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
  if (next.kind === "sway") {
    const pose = swayPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "jewel") {
    const pose = jewelPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "heat") {
    const pose = heatPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else {
    const pose = boughPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  }
  if (u >= 1) {
    return { ...next, phase: "done", lift: 0, rot: 0, anim: "idle" };
  }
  return next;
}
