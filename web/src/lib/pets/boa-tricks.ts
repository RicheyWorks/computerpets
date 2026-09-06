/** Lula ground tricks while idle. House boa constrictor — pour / heft / oxbow / slack / bank personality (pour/weight/loop desk life; blotter-river desk weight). Feed-happy thank-yous sit after eat. Card-open freeze and window-play do not swallow a thank-you. Sleep, hide, and leave still win. Same map as desktop `boa-tricks.js`. Not a Rui, cat, dog, rabbit, hamster, guinea pig, turtle, goldfish, budgie, fox, penguin, parrot, ferret, hedgehog, chinchilla, axolotl, toucan, iguana, dragon/Vesper, phoenix/Ember, ball-python/Nori, corn-snake/Saffron, kingsnake/Bandit, green-tree-python/Jade, hognose/Bluff, garter/Sash, or *Dragon electrical (Relay/Fuse/Ground) move clone. Window-play LOOP unchanged — never names `loop`. Nori owns orb/nook/taste/inch/unroll and savor/nestle/center; Saffron owns scribble/gap/comma/probe/canyon and clause/spice/cord; Bandit owns stripe/audit/verdict/plumb/raid and tribute/docket/seal; Jade owns bracelet/sway/jewel/heat/bough and pendant/treaty/emerald; Bluff owns hood/feign/shovel/gape/encore and aside/cue/ovation; Sash owns seam/rounds/moss/fork/lap and copy/brief/visa; hedgehog owns curl/root; volt window-play owns coil; ferret owns noodle; Ember owns settle/shine/dip; Vesper owns fold/thrum/glow; Sol owns flick/sun; Coin owns flare; Thimble owns dig; Lula window-play owns loop; Echo window-play owns perch; Fox window-play owns scent; rosy_boa window-play owns stone. Avoids loop/patrol/stripe/hood/feign/shovel/gape/encore/flip/saddle/drape/inspect/write/orb/nook/taste/inch/unroll/bun/ball/coil/curl/bask/loaf/potato/tuck/hide/settle/shine/dip/sprawl/guard/smolder/claim/fold/thrum/glow/incline/sun/dewlap/cinder/blaze/shed/lift/return/flick/warm/thread/dart/noodle/savor/nestle/center/scribble/gap/comma/probe/canyon/clause/spice/cord/stripe/audit/verdict/plumb/raid/tribute/docket/seal/bracelet/sway/jewel/heat/bough/pendant/treaty/emerald/aside/cue/ovation/seam/rounds/moss/fork/lap/copy/brief/visa/root/flare/dig/perch/hang/clasp/scent/stone/heave/lug/earth/bed name collisions with prior guests and boa window-play. No cry inventing — thank-yous are silent desk motion only. */

export const TRICK_KEY = "boa";
export const TRICKS = ["pour", "heft", "oxbow", "slack", "bank"] as const;
export const HAPPY = ["harbor", "cradle", "stay"] as const;
export type BoaTrickKind = (typeof TRICKS)[number];
export type BoaHappyKind = (typeof HAPPY)[number];
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

export type BoaTrick = {
  kind: BoaTrickKind;
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

export type BoaHappy = {
  kind: BoaHappyKind;
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

export const HAPPY_DUR: Record<BoaHappyKind, number> = {
  harbor: 1.22,
  cradle: 1.28,
  stay: 1.34,
};

/** Pour hold — Lula pours a river of muscle across the blotter. Not window-play LOOP. Not Nori orb. */
export const POUR_HOLD = 10.4;
export const RELEASE_S = 0.62;

export const DUR: Record<BoaTrickKind, number> = {
  pour: POUR_HOLD + RELEASE_S,
  heft: 1.4,
  oxbow: 1.52,
  slack: 1.28,
  bank: 1.44,
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

export function nextTrickWait(justFinished: boolean, rand?: number, kind?: BoaTrickKind) {
  const roll = rand == null ? Math.random() : rand;
  if (kind === "pour") return 46 + roll * 26;
  if (kind === "oxbow") return 16 + roll * 11;
  if (kind === "heft") return 14 + roll * 9;
  return justFinished ? 10 + roll * 8 : 5 + roll * 6;
}

export function pickTrick(rand?: number, musicOn?: boolean, lastKind?: BoaTrickKind | null) {
  if (musicOn) return "pour" as const;
  const roll = rand == null ? Math.random() : rand;
  if (lastKind === "pour") {
    if (roll < 0.28) return "heft" as const;
    if (roll < 0.5) return "oxbow" as const;
    if (roll < 0.72) return "slack" as const;
    return "bank" as const;
  }
  if (lastKind === "oxbow") {
    if (roll < 0.3) return "pour" as const;
    if (roll < 0.52) return "heft" as const;
    if (roll < 0.74) return "slack" as const;
    return "bank" as const;
  }
  if (lastKind === "heft") {
    if (roll < 0.24) return "pour" as const;
    if (roll < 0.46) return "oxbow" as const;
    if (roll < 0.68) return "slack" as const;
    return "bank" as const;
  }
  if (roll < 0.22) return "pour" as const;
  if (roll < 0.42) return "heft" as const;
  if (roll < 0.6) return "oxbow" as const;
  if (roll < 0.8) return "slack" as const;
  return "bank" as const;
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
  return key === TRICK_KEY || key === "lula";
}

export function startThankYou(
  key: string | undefined | null,
  lastKind: BoaHappyKind | string | null | undefined,
  x: number,
  facing: 1 | -1,
  flags?: TrickFlags,
) {
  if (!wantsThankYou(key)) return null;
  if (!happyCanStart(flags || { cmd: "idle" })) return null;
  const pick = pickHappy(lastKind as BoaHappyKind | null | undefined);
  return { happy: beginHappy(pick, x, facing), kind: pick };
}

export function pickHappy(lastKind?: BoaHappyKind | null, rand?: number) {
  const pool = HAPPY.filter((k) => k !== lastKind);
  const list = pool.length ? pool : [...HAPPY];
  const roll = rand == null ? Math.random() : rand;
  return list[Math.floor(roll * list.length)] || list[0];
}

export function beginHappy(kind: BoaHappyKind, x: number, facing: 1 | -1): BoaHappy {
  const name = HAPPY.includes(kind) ? kind : "harbor";
  return {
    kind: name,
    happy: true,
    phase: "go",
    t: 0,
    x,
    lift: 0,
    rot: 0,
    anim: name === "harbor" ? "sit" : name === "cradle" ? "sit" : "talk",
    facing: facing == null ? 1 : facing,
    fromX: x,
  };
}

export function harborPose(t: number) {
  const u = Math.max(0, Math.min(1, t / HAPPY_DUR.harbor));
  if (u < 0.14) {
    const s = u / 0.14;
    return { lift: s * 1.15, rot: s * -5, dx: 0, anim: "sit" as TrickAnim };
  }
  if (u < 0.8) {
    return {
      lift: 1.15 + Math.abs(Math.sin(t * 2.2)) * 0.35,
      rot: -5 + Math.sin(t * 1.6) * 3.2,
      dx: Math.sin(t * 1.2) * 0.22,
      anim: "sit" as TrickAnim,
    };
  }
  const s = (u - 0.8) / 0.2;
  return { lift: 1.15 * (1 - s), rot: -5 * (1 - s), dx: 0, anim: "idle" as TrickAnim };
}

export function cradlePose(t: number) {
  const u = Math.max(0, Math.min(1, t / HAPPY_DUR.cradle));
  if (u < 0.12) {
    const s = u / 0.12;
    return { lift: s * 1.45, rot: s * 6, dx: 0, anim: "sit" as TrickAnim };
  }
  if (u < 0.78) {
    const rock = Math.sin(t * 2.8);
    return {
      lift: 1.45 + Math.abs(rock) * 0.4,
      rot: 6 + rock * 5.5,
      dx: rock * 0.28,
      anim: "sit" as TrickAnim,
    };
  }
  const s = (u - 0.78) / 0.22;
  return { lift: 1.45 * (1 - s), rot: 6 * (1 - s), dx: 0, anim: "sit" as TrickAnim };
}

export function stayPose(t: number) {
  return {
    lift: Math.abs(Math.sin(t * 1.7)) * 0.85 + 1.05,
    rot: -6 + Math.sin(t * 2.1) * 5.2,
    dx: Math.sin(t * 1.3) * 0.3,
    anim: "talk" as TrickAnim,
  };
}

export function stepHappy(happy: BoaHappy | null | undefined, dt: number, flags?: TrickFlags) {
  if (!happy || happy.phase === "done") return happy;
  if (happyShouldAbort(flags)) {
    return { ...happy, phase: "done" as const, t: 0, lift: 0, rot: 0, anim: "idle" as TrickAnim, abort: true };
  }
  const next: BoaHappy = { ...happy, t: happy.t + Math.max(0, dt) };
  const hold = HAPPY_DUR[next.kind];
  if (next.kind === "harbor") {
    const pose = harborPose(next.t);
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "cradle") {
    const pose = cradlePose(next.t);
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else {
    const pose = stayPose(next.t);
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

export function beginTrick(kind: BoaTrickKind, x: number, facing: 1 | -1): BoaTrick {
  const anim: TrickAnim =
    kind === "pour"
      ? "sit"
      : kind === "heft"
        ? "sit"
        : kind === "oxbow"
          ? "walk"
          : kind === "slack"
            ? "talk"
            : kind === "bank"
              ? "sit"
              : "sit";
  return {
    kind,
    phase: kind === "pour" ? "hold" : "go",
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

export function pourPose(t: number) {
  return {
    lift: 0.55 + Math.sin(t * 0.7) * 0.14,
    rot: -8 + Math.sin(t * 0.58) * 1.8 + Math.sin(t * 1.5) * 0.9,
  };
}

export function releasePose(t: number) {
  const u = Math.max(0, Math.min(1, t / RELEASE_S));
  return { lift: 0.55 * (1 - Math.sin(u * Math.PI * 0.5)), rot: -8 * (1 - u) };
}

export function heftPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.heft));
  if (u < 0.14) {
    const s = smoothstep(u / 0.14);
    return { x: fromX, lift: s * 1.1, rot: s * 4 * facing, anim: "sit" as TrickAnim };
  }
  if (u < 0.55) {
    const s = (u - 0.14) / 0.41;
    return {
      x: fromX + facing * s * 0.35,
      lift: 1.1 - smoothstep(s) * 0.95,
      rot: facing * (4 - s * 10),
      anim: "sit" as TrickAnim,
    };
  }
  if (u < 0.82) {
    const s = (u - 0.55) / 0.27;
    const press = Math.abs(Math.sin(s * Math.PI * 1.8));
    return {
      x: fromX + facing * 0.35,
      lift: 0.15 + press * 0.12,
      rot: facing * (-6 + press * 2),
      anim: "sit" as TrickAnim,
    };
  }
  const s = smoothstep((u - 0.82) / 0.18);
  return {
    x: fromX + facing * (0.35 * (1 - s)),
    lift: 0.15 * (1 - s),
    rot: facing * -2 * (1 - s),
    anim: "idle" as TrickAnim,
  };
}

export function oxbowPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.oxbow));
  if (u < 0.12) {
    const s = smoothstep(u / 0.12);
    return { x: fromX + facing * s * 0.8, lift: s * 0.55, rot: s * 10 * facing, anim: "walk" as TrickAnim };
  }
  if (u < 0.48) {
    const s = (u - 0.12) / 0.36;
    return {
      x: fromX + facing * (0.8 + smoothstep(s) * 4.2),
      lift: 0.55 + Math.sin(s * Math.PI) * 0.85,
      rot: facing * (10 + Math.sin(s * Math.PI) * 14),
      anim: "walk" as TrickAnim,
    };
  }
  if (u < 0.78) {
    const s = (u - 0.48) / 0.3;
    return {
      x: fromX + facing * (5.0 - smoothstep(s) * 2.4),
      lift: 0.9 + Math.abs(Math.sin(s * Math.PI * 1.5)) * 0.35,
      rot: facing * (18 - s * 22),
      anim: "play" as TrickAnim,
    };
  }
  const s = smoothstep((u - 0.78) / 0.22);
  return {
    x: fromX + facing * (2.6 * (1 - s)),
    lift: 0.7 * (1 - s),
    rot: facing * (-2 * (1 - s)),
    anim: "sit" as TrickAnim,
  };
}

export function slackPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.slack));
  if (u < 0.12) {
    const s = smoothstep(u / 0.12);
    return { x: fromX, lift: s * 1.6, rot: s * 14 * facing, anim: "talk" as TrickAnim };
  }
  if (u < 0.78) {
    const s = (u - 0.12) / 0.66;
    const ease = Math.sin(s * Math.PI * 2.2);
    return {
      x: fromX + facing * ease * 0.25,
      lift: 1.6 - s * 0.7 + Math.abs(ease) * 0.15,
      rot: facing * (14 - s * 18 + ease * 3),
      anim: "talk" as TrickAnim,
    };
  }
  const s = smoothstep((u - 0.78) / 0.22);
  return {
    x: fromX,
    lift: 0.9 * (1 - s),
    rot: facing * (-2 * (1 - s)),
    anim: "sit" as TrickAnim,
  };
}

export function bankPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.bank));
  if (u < 0.12) {
    const s = smoothstep(u / 0.12);
    return { x: fromX + facing * s * 1.6, lift: s * 0.4, rot: -s * 6 * facing, anim: "sit" as TrickAnim };
  }
  if (u < 0.78) {
    const s = (u - 0.12) / 0.66;
    const nudge = Math.sin(s * Math.PI * 1.8);
    return {
      x: fromX + facing * (1.6 + nudge * 0.35),
      lift: 0.35 + Math.abs(nudge) * 0.18,
      rot: facing * (-6 + nudge * 3.5),
      anim: "sit" as TrickAnim,
    };
  }
  const s = smoothstep((u - 0.78) / 0.22);
  return {
    x: fromX + facing * (1.6 * (1 - s)),
    lift: 0.35 * (1 - s),
    rot: facing * (-2 * (1 - s)),
    anim: "idle" as TrickAnim,
  };
}

export function stepTrick(trick: BoaTrick | null | undefined, dt: number, flags?: TrickFlags) {
  if (!trick || trick.phase === "done") return trick;
  if (shouldAbort(flags) && trick.kind !== "oxbow" && trick.kind !== "bank") {
    return { ...trick, phase: "done" as const, t: 0, lift: 0, rot: 0, anim: "idle" as TrickAnim, abort: true };
  }
  const next: BoaTrick = { ...trick, t: trick.t + Math.max(0, dt) };
  if (next.kind === "pour") {
    if (next.t < POUR_HOLD) {
      const pose = pourPose(next.t);
      next.phase = "hold";
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = "sit";
      return next;
    }
    if (next.t < POUR_HOLD + RELEASE_S) {
      const pose = releasePose(next.t - POUR_HOLD);
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
  if (next.kind === "heft") {
    const pose = heftPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "oxbow") {
    const pose = oxbowPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "slack") {
    const pose = slackPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else {
    const pose = bankPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  }
  if (u >= 1) return { ...next, phase: "done" as const, lift: 0, rot: 0, anim: "idle" as TrickAnim };
  return next;
}
