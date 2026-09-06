/** Blush ground tricks while idle. House rosy boa — pebble / crevice / rosy / mesa / arroyo personality (small desert rock / pink / tuck desk life; warm-corner hush, not Lula boa river-weight). Feed-happy thank-yous sit after eat. Card-open freeze and window-play do not swallow a thank-you. Sleep, hide, and leave still win. Same map as desktop `rosy-boa-tricks.js`. Not a Rui, cat, dog, rabbit, hamster, guinea pig, turtle, goldfish, budgie, fox, penguin, parrot, ferret, hedgehog, chinchilla, axolotl, toucan, iguana, dragon/Vesper, phoenix/Ember, ball-python/Nori, corn-snake/Saffron, kingsnake/Bandit, green-tree-python/Jade, hognose/Bluff, garter/Sash, boa/Lula, milk-snake/Coral, or *Dragon electrical (Relay/Fuse/Ground) move clone. Window-play STONE unchanged — never names `stone`. Nori owns orb/nook/taste/inch/unroll and savor/nestle/center; Saffron owns scribble/gap/comma/probe/canyon and clause/spice/cord; Bandit owns stripe/audit/verdict/plumb/raid and tribute/docket/seal; Jade owns bracelet/sway/jewel/heat/bough and pendant/treaty/emerald; Bluff owns hood/feign/shovel/gape/encore and aside/cue/ovation; Sash owns seam/rounds/moss/fork/lap and copy/brief/visa; Lula owns pour/heft/oxbow/slack/bank and harbor/cradle/stay; Coral owns rhyme/rumor/costume/frank/tile and postmark/cachet/courtesy; budgie owns mimic; parrot owns flash; hedgehog owns curl/root; turtle owns tuck; volt window-play owns coil; ferret owns noodle; Ember owns settle/shine/dip; Vesper owns fold/thrum/glow; Sol owns flick/sun; Coin owns flare; Thimble owns dig; Lula window-play owns loop; Echo window-play owns perch; Fox window-play owns scent; rosy_boa window-play owns stone; hamster owns nest. Avoids stone/tuck/hide/pour/heft/oxbow/slack/bank/harbor/cradle/stay/rhyme/rumor/costume/frank/tile/postmark/cachet/courtesy/mosaic/loop/patrol/stripe/hood/feign/shovel/gape/encore/flip/saddle/drape/inspect/write/orb/nook/taste/inch/unroll/bun/ball/coil/curl/bask/loaf/potato/settle/shine/dip/sprawl/guard/smolder/claim/fold/thrum/glow/incline/sun/dewlap/cinder/blaze/shed/lift/return/flick/warm/thread/dart/noodle/savor/nestle/center/scribble/gap/comma/probe/canyon/clause/spice/cord/audit/verdict/plumb/raid/tribute/docket/seal/bracelet/sway/jewel/heat/bough/pendant/treaty/emerald/aside/cue/ovation/seam/rounds/moss/fork/lap/copy/brief/visa/mimic/flash/root/flare/dig/perch/hang/clasp/scent/heave/lug/earth/bed/nest name collisions with prior guests and rosy_boa window-play. No cry inventing — thank-yous are silent desk motion only. */

export const TRICK_KEY = "rosy_boa";
export const TRICKS = ["pebble", "crevice", "rosy", "mesa", "arroyo"] as const;
export const HAPPY = ["climate", "manners", "corner"] as const;
export type RosyBoaTrickKind = (typeof TRICKS)[number];
export type RosyBoaHappyKind = (typeof HAPPY)[number];
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

export type RosyBoaTrick = {
  kind: RosyBoaTrickKind;
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

export type RosyBoaHappy = {
  kind: RosyBoaHappyKind;
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

export const HAPPY_DUR: Record<RosyBoaHappyKind, number> = {
  climate: 1.2,
  manners: 1.26,
  corner: 1.32,
};

/** Pebble hold — Blush becomes a pink desk pebble. Not window-play STONE. Not Lula pour. */
export const PEBBLE_HOLD = 10.6;
export const RELEASE_S = 0.6;

export const DUR: Record<RosyBoaTrickKind, number> = {
  pebble: PEBBLE_HOLD + RELEASE_S,
  crevice: 1.38,
  rosy: 1.42,
  mesa: 1.28,
  arroyo: 1.5,
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

export function nextTrickWait(justFinished: boolean, rand?: number, kind?: RosyBoaTrickKind) {
  const roll = rand == null ? Math.random() : rand;
  if (kind === "pebble") return 48 + roll * 28;
  if (kind === "crevice") return 16 + roll * 11;
  if (kind === "rosy") return 15 + roll * 10;
  return justFinished ? 10 + roll * 8 : 5 + roll * 6;
}

export function pickTrick(rand?: number, musicOn?: boolean, lastKind?: RosyBoaTrickKind | null) {
  if (musicOn) return "pebble" as const;
  const roll = rand == null ? Math.random() : rand;
  if (lastKind === "pebble") {
    if (roll < 0.28) return "crevice" as const;
    if (roll < 0.5) return "rosy" as const;
    if (roll < 0.72) return "mesa" as const;
    return "arroyo" as const;
  }
  if (lastKind === "crevice") {
    if (roll < 0.3) return "pebble" as const;
    if (roll < 0.52) return "rosy" as const;
    if (roll < 0.74) return "mesa" as const;
    return "arroyo" as const;
  }
  if (lastKind === "rosy") {
    if (roll < 0.24) return "pebble" as const;
    if (roll < 0.46) return "crevice" as const;
    if (roll < 0.68) return "mesa" as const;
    return "arroyo" as const;
  }
  if (roll < 0.22) return "pebble" as const;
  if (roll < 0.42) return "crevice" as const;
  if (roll < 0.6) return "rosy" as const;
  if (roll < 0.8) return "mesa" as const;
  return "arroyo" as const;
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
  return key === TRICK_KEY || key === "blush";
}

export function startThankYou(
  key: string | undefined | null,
  lastKind: RosyBoaHappyKind | string | null | undefined,
  x: number,
  facing: 1 | -1,
  flags?: TrickFlags,
) {
  if (!wantsThankYou(key)) return null;
  if (!happyCanStart(flags || { cmd: "idle" })) return null;
  const pick = pickHappy(lastKind as RosyBoaHappyKind | null | undefined);
  return { happy: beginHappy(pick, x, facing), kind: pick };
}

export function pickHappy(lastKind?: RosyBoaHappyKind | null, rand?: number) {
  const pool = HAPPY.filter((k) => k !== lastKind);
  const list = pool.length ? pool : [...HAPPY];
  const roll = rand == null ? Math.random() : rand;
  return list[Math.floor(roll * list.length)] || list[0];
}

export function beginHappy(kind: RosyBoaHappyKind, x: number, facing: 1 | -1): RosyBoaHappy {
  const name = HAPPY.includes(kind) ? kind : "climate";
  return {
    kind: name,
    happy: true,
    phase: "go",
    t: 0,
    x,
    lift: 0,
    rot: 0,
    anim: name === "climate" ? "sit" : name === "manners" ? "sit" : "talk",
    facing: facing == null ? 1 : facing,
    fromX: x,
  };
}

export function climatePose(t: number) {
  const u = Math.max(0, Math.min(1, t / HAPPY_DUR.climate));
  if (u < 0.14) {
    const s = u / 0.14;
    return { lift: s * 1.15, rot: s * -5, dx: 0, anim: "sit" as TrickAnim };
  }
  if (u < 0.78) {
    const warm = Math.abs(Math.sin(t * 2.8));
    return {
      lift: 1.15 - warm * 0.4,
      rot: -5 + warm * 3.5,
      dx: Math.sin(t * 1.2) * 0.14,
      anim: "sit" as TrickAnim,
    };
  }
  const s = (u - 0.78) / 0.22;
  return { lift: 0.85 * (1 - s), rot: -3 * (1 - s), dx: 0, anim: "idle" as TrickAnim };
}

export function mannersPose(t: number) {
  const u = Math.max(0, Math.min(1, t / HAPPY_DUR.manners));
  if (u < 0.12) {
    const s = u / 0.12;
    return { lift: s * 1.4, rot: s * 7, dx: 0, anim: "sit" as TrickAnim };
  }
  if (u < 0.8) {
    const nod = Math.sin(t * 2.4);
    return {
      lift: 1.4 + Math.abs(nod) * 0.28,
      rot: 7 + nod * 5.5,
      dx: nod * 0.22,
      anim: "sit" as TrickAnim,
    };
  }
  const s = (u - 0.8) / 0.2;
  return { lift: 1.4 * (1 - s), rot: 7 * (1 - s), dx: 0, anim: "sit" as TrickAnim };
}

export function cornerPose(t: number) {
  return {
    lift: Math.abs(Math.sin(t * 1.7)) * 0.8 + 0.95,
    rot: -4 + Math.sin(t * 2.1) * 5.2,
    dx: Math.sin(t * 1.3) * 0.24,
    anim: "talk" as TrickAnim,
  };
}

export function stepHappy(happy: RosyBoaHappy | null | undefined, dt: number, flags?: TrickFlags) {
  if (!happy || happy.phase === "done") return happy;
  if (happyShouldAbort(flags)) {
    return { ...happy, phase: "done" as const, t: 0, lift: 0, rot: 0, anim: "idle" as TrickAnim, abort: true };
  }
  const next: RosyBoaHappy = { ...happy, t: happy.t + Math.max(0, dt) };
  const hold = HAPPY_DUR[next.kind];
  if (next.kind === "climate") {
    const pose = climatePose(next.t);
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "manners") {
    const pose = mannersPose(next.t);
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else {
    const pose = cornerPose(next.t);
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

export function beginTrick(kind: RosyBoaTrickKind, x: number, facing: 1 | -1): RosyBoaTrick {
  const anim: TrickAnim =
    kind === "pebble"
      ? "sit"
      : kind === "crevice"
        ? "walk"
        : kind === "rosy"
          ? "sit"
          : kind === "mesa"
            ? "sit"
            : kind === "arroyo"
              ? "walk"
              : "sit";
  return {
    kind,
    phase: kind === "pebble" ? "hold" : "go",
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

export function pebblePose(t: number) {
  // Small pink-rock breath — desk pebble, not window sill stone tuck.
  const beat = Math.sin(t * 0.95) + 0.35 * Math.sin(t * 2.7);
  return {
    lift: 0.48 + Math.abs(Math.sin(t * 0.7)) * 0.14,
    rot: -3 + beat * 2.8,
  };
}

export function releasePose(t: number) {
  const u = Math.max(0, Math.min(1, t / RELEASE_S));
  return { lift: 0.48 * (1 - Math.sin(u * Math.PI * 0.5)), rot: -3 * (1 - u) };
}

export function crevicePose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.crevice));
  if (u < 0.14) {
    const s = smoothstep(u / 0.14);
    return { x: fromX + facing * s * 1.2, lift: s * 0.55, rot: s * 6 * facing, anim: "walk" as TrickAnim };
  }
  if (u < 0.48) {
    const s = (u - 0.14) / 0.34;
    // Ease into a keyboard gap — small desert crevice, not Lula oxbow.
    return {
      x: fromX + facing * (1.2 + smoothstep(s) * 1.6),
      lift: 0.55 - smoothstep(s) * 0.45,
      rot: facing * (6 - s * 10),
      anim: "sit" as TrickAnim,
    };
  }
  if (u < 0.78) {
    const s = (u - 0.48) / 0.3;
    const hush = Math.abs(Math.sin(s * Math.PI * 1.8));
    return {
      x: fromX + facing * 2.8,
      lift: 0.12 + hush * 0.1,
      rot: facing * (-4 + hush * 2),
      anim: "sit" as TrickAnim,
    };
  }
  const s = smoothstep((u - 0.78) / 0.22);
  return {
    x: fromX + facing * (2.8 * (1 - s)),
    lift: 0.2 * (1 - s),
    rot: facing * (-2 * (1 - s)),
    anim: "idle" as TrickAnim,
  };
}

export function rosyPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.rosy));
  if (u < 0.12) {
    const s = smoothstep(u / 0.12);
    return { x: fromX, lift: s * 1.5, rot: s * 10 * facing, anim: "sit" as TrickAnim };
  }
  if (u < 0.72) {
    const s = (u - 0.12) / 0.6;
    // Soft pink dusk shimmer — not Coral costume band shiver.
    const shimmer = Math.sin(s * Math.PI * 3.4);
    return {
      x: fromX + facing * shimmer * 0.28,
      lift: 1.5 - s * 0.4 + Math.abs(shimmer) * 0.2,
      rot: facing * (10 - s * 14 + shimmer * 4),
      anim: "play" as TrickAnim,
    };
  }
  const s = smoothstep((u - 0.72) / 0.28);
  return {
    x: fromX,
    lift: 1.15 * (1 - s),
    rot: facing * (-2 * (1 - s)),
    anim: "sit" as TrickAnim,
  };
}

export function mesaPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.mesa));
  if (u < 0.14) {
    const s = smoothstep(u / 0.14);
    return { x: fromX, lift: s * 1.35, rot: s * 4 * facing, anim: "sit" as TrickAnim };
  }
  if (u < 0.5) {
    const s = (u - 0.14) / 0.36;
    return {
      x: fromX + facing * s * 0.35,
      lift: 1.35 - smoothstep(s) * 1.15,
      rot: facing * (4 - s * 9),
      anim: "sit" as TrickAnim,
    };
  }
  if (u < 0.82) {
    const s = (u - 0.5) / 0.32;
    const press = Math.abs(Math.sin(s * Math.PI * 2.0));
    return {
      x: fromX + facing * 0.35,
      lift: 0.16 + press * 0.1,
      rot: facing * (-5 + press * 2),
      anim: "sit" as TrickAnim,
    };
  }
  const s = smoothstep((u - 0.82) / 0.18);
  return {
    x: fromX + facing * (0.35 * (1 - s)),
    lift: 0.16 * (1 - s),
    rot: facing * (-2 * (1 - s)),
    anim: "idle" as TrickAnim,
  };
}

export function arroyoPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.arroyo));
  if (u < 0.12) {
    const s = smoothstep(u / 0.12);
    return { x: fromX + facing * s * 1.0, lift: s * 0.65, rot: s * 7 * facing, anim: "walk" as TrickAnim };
  }
  if (u < 0.45) {
    const s = (u - 0.12) / 0.33;
    // Slow desert-wash crawl — three soft dunes, not Coral stamp tiles.
    const step = Math.floor(s * 3);
    const local = (s * 3) % 1;
    return {
      x: fromX + facing * (1.0 + step * 1.2 + smoothstep(local) * 1.2),
      lift: 0.65 + Math.sin(local * Math.PI) * 0.45,
      rot: facing * (7 + Math.sin(local * Math.PI) * 8),
      anim: "walk" as TrickAnim,
    };
  }
  if (u < 0.78) {
    const s = (u - 0.45) / 0.33;
    return {
      x: fromX + facing * (4.6 - smoothstep(s) * 2.0),
      lift: 0.75 + Math.abs(Math.sin(s * Math.PI * 1.6)) * 0.26,
      rot: facing * (12 - s * 16),
      anim: "play" as TrickAnim,
    };
  }
  const s = smoothstep((u - 0.78) / 0.22);
  return {
    x: fromX + facing * (2.6 * (1 - s)),
    lift: 0.6 * (1 - s),
    rot: facing * (-2 * (1 - s)),
    anim: "sit" as TrickAnim,
  };
}

export function stepTrick(trick: RosyBoaTrick | null | undefined, dt: number, flags?: TrickFlags) {
  if (!trick || trick.phase === "done") return trick;
  if (shouldAbort(flags) && trick.kind !== "arroyo" && trick.kind !== "crevice") {
    return { ...trick, phase: "done" as const, t: 0, lift: 0, rot: 0, anim: "idle" as TrickAnim, abort: true };
  }
  const next: RosyBoaTrick = { ...trick, t: trick.t + Math.max(0, dt) };
  if (next.kind === "pebble") {
    if (next.t < PEBBLE_HOLD) {
      const pose = pebblePose(next.t);
      next.phase = "hold";
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = "sit";
      return next;
    }
    if (next.t < PEBBLE_HOLD + RELEASE_S) {
      const pose = releasePose(next.t - PEBBLE_HOLD);
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
  if (next.kind === "crevice") {
    const pose = crevicePose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "rosy") {
    const pose = rosyPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "mesa") {
    const pose = mesaPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else {
    const pose = arroyoPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  }
  if (u >= 1) return { ...next, phase: "done" as const, lift: 0, rot: 0, anim: "idle" as TrickAnim };
  return next;
}
