/** Bandit ground tricks while idle — ultra-polish pass. House California kingsnake — stripe / audit / verdict / plumb / raid / band / drawer personality (banded ruler-drawer law; bold desk inspector). Stripe band-ripple across the body; audit deliberate desk survey; verdict stacked ruling hold; plumb straighten like a measuring stick; raid bold theatrical sweep; band show the bold black-and-white band pattern stretch; drawer ruler-drawer peek. Window-play INSPECT unchanged — never names `inspect`. Nori owns orb/nook/taste/inch/unroll/loom/weave and savor/nestle/center; Saffron owns scribble/gap/comma/probe/canyon/blotter/pencil and clause/spice/cord; hedgehog owns curl/ball; volt window-play owns coil; ferret owns noodle; Ember owns settle/shine/dip; Vesper owns fold/thrum/glow; Sol owns flick/sun/press. Guest slug Bandit / key kingsnake — accept "kingsnake" and "bandit". Amplitudes raised toward Rui richness; denser waits/weights; prefersHouseCry via kingsnake.wav. Thank-yous tribute / docket / seal. Feed-happy after eat. Sleep, hide, leave, rest, card, ribbon still win. Same map as desktop `kingsnake-tricks.js`. True house-kingsnake desk life — not Rui/cat/dog/rabbit/hamster/guinea_pig/turtle/goldfish/budgie/fox/penguin/parrot/ferret/hedgehog/chinchilla/axolotl/toucan/iguana/Sol/dragon/Vesper/phoenix/Ember/ball_python/Nori/corn_snake/Saffron or *Dragon electrical (Relay/Fuse/Ground) clones. Avoids inspect/write/orb/nook/taste/inch/unroll/bun/ball/coil/curl/bask/loaf/potato/tuck/hide/settle/shine/dip/sprawl/guard/smolder/claim/fold/thrum/glow/incline/sun/dewlap/cinder/blaze/shed/lift/return/flick/warm/thread/dart/noodle/savor/nestle/center/scribble/gap/comma/probe/canyon/clause/spice/cord/blotter/pencil/periscope/strike/pounce/sniff name collisions. Bird ultra (Soot→Ember) + Miso→Saffron done; Echo/budgie + Peck/penguin + Quill/parrot + Keel/toucan + Ember skip birds. Jade / green_tree_python ultra done; next guest ultra is Bluff / hognose. No cry inventing beyond house kingsnake.wav prefer. Never retouch Rui sprites. */

export const TRICK_KEY = "kingsnake";
export const TRICKS = ["stripe", "audit", "verdict", "plumb", "raid", "band", "drawer"] as const;
export const HAPPY = ["tribute", "docket", "seal"] as const;
export type KingsnakeTrickKind = (typeof TRICKS)[number];
export type KingsnakeHappyKind = (typeof HAPPY)[number];
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

export type KingsnakeTrick = {
  kind: KingsnakeTrickKind;
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

export type KingsnakeHappy = {
  kind: KingsnakeHappyKind;
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

export const HAPPY_DUR: Record<KingsnakeHappyKind, number> = {
  tribute: 1.55,
  docket: 1.62,
  seal: 1.58,
};

/** Verdict hold — Bandit stacks like a ruling on the blotter. Not Nori orb. Not window-play INSPECT. */
export const VERDICT_HOLD = 12.8;
export const RELEASE_S = 0.88;

export const DUR: Record<KingsnakeTrickKind, number> = {
  stripe: 1.88,
  audit: 1.82,
  verdict: VERDICT_HOLD + RELEASE_S,
  plumb: 1.76,
  raid: 1.92,
  band: 2.02,
  drawer: 2.1,
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

export function nextTrickWait(justFinished: boolean, rand?: number, kind?: KingsnakeTrickKind) {
  const roll = rand == null ? Math.random() : rand;
  if (kind === "verdict") return 38 + roll * 24;
  if (kind === "audit" || kind === "drawer") return 11 + roll * 8;
  if (kind === "stripe" || kind === "raid" || kind === "band") return 10 + roll * 8;
  if (kind === "plumb") return 12 + roll * 9;
  return justFinished ? 8 + roll * 8 : 4 + roll * 7;
}

export function pickTrick(rand?: number, musicOn = false, lastKind?: KingsnakeTrickKind | null): KingsnakeTrickKind {
  if (musicOn) return "verdict";
  const roll = rand == null ? Math.random() : rand;
  const pool = TRICKS.filter((k) => k !== lastKind);
  const list = pool.length ? pool : [...TRICKS];
  const weights = list.map((k) =>
    k === "verdict" ? 0.55 : k === "audit" || k === "drawer" || k === "plumb" ? 1.15 : 1
  );
  let total = 0;
  for (let i = 0; i < weights.length; i++) total += weights[i]!;
  let r = roll * total;
  for (let i = 0; i < list.length; i++) {
    r -= weights[i]!;
    if (r <= 0) return list[i]!;
  }
  return list[list.length - 1] || "verdict";
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
  return key === TRICK_KEY || key === "bandit";
}

export function startThankYou(
  key: string | undefined,
  lastKind: KingsnakeHappyKind | null | undefined,
  x: number,
  facing: 1 | -1,
  flags?: TrickFlags,
) {
  if (!wantsThankYou(key)) return null;
  if (!happyCanStart(flags || { cmd: "idle" })) return null;
  const pick = pickHappy(lastKind);
  return { happy: beginHappy(pick, x, facing), kind: pick };
}

export function pickHappy(lastKind?: KingsnakeHappyKind | null, rand?: number): KingsnakeHappyKind {
  const pool = HAPPY.filter((k) => k !== lastKind);
  const list = pool.length ? pool : [...HAPPY];
  const roll = rand == null ? Math.random() : rand;
  return list[Math.floor(roll * list.length)] ?? list[0]!;
}

export function beginHappy(kind: KingsnakeHappyKind, x: number, facing: 1 | -1 = 1): KingsnakeHappy {
  const name: KingsnakeHappyKind = HAPPY.includes(kind) ? kind : "tribute";
  return {
    kind: name,
    happy: true,
    phase: "go",
    t: 0,
    x,
    lift: 0,
    rot: 0,
    anim: name === "tribute" ? "sit" : name === "docket" ? "talk" : "sit",
    facing,
    fromX: x,
  };
}

export function tributePose(t: number) {
  const u = Math.max(0, Math.min(1, t / HAPPY_DUR.tribute));
  if (u < 0.14) {
    const s = u / 0.14;
    return { lift: s * 4.2, rot: s * 16, dx: 0, anim: "sit" as const };
  }
  if (u < 0.8) {
    return {
      lift: 4.2 + Math.abs(Math.sin(t * 4.6)) * 3.4,
      rot: 16 + Math.sin(t * 3.4) * 14,
      dx: Math.sin(t * 2.1) * 1.1,
      anim: "sit" as const,
    };
  }
  const s = (u - 0.8) / 0.2;
  return { lift: 4.2 * (1 - s), rot: 16 * (1 - s), dx: 0, anim: "idle" as const };
}

export function docketPose(t: number) {
  const u = Math.max(0, Math.min(1, t / HAPPY_DUR.docket));
  if (u < 0.12) {
    const s = u / 0.12;
    return { lift: s * 4.6, rot: s * -18, dx: 0, anim: "talk" as const };
  }
  if (u < 0.78) {
    const tick = Math.sin(t * 6.4);
    return {
      lift: 4.6 + Math.abs(tick) * 3.2,
      rot: -18 + tick * 22,
      dx: tick * 1.2,
      anim: "talk" as const,
    };
  }
  const s = (u - 0.78) / 0.22;
  return { lift: 4.6 * (1 - s), rot: -18 * (1 - s), dx: 0, anim: "sit" as const };
}

export function sealPose(t: number) {
  return {
    lift: Math.abs(Math.sin(t * 2.2)) * 3.6 + 2.0,
    rot: -12 + Math.sin(t * 1.9) * 16,
    dx: Math.sin(t * 1.55) * 1.3,
    anim: "sit" as const,
  };
}

export function stepHappy(happy: KingsnakeHappy, dt: number, flags?: TrickFlags): KingsnakeHappy {
  if (!happy || happy.phase === "done") return happy;
  if (happyShouldAbort(flags)) {
    return { ...happy, phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true };
  }
  const next: KingsnakeHappy = { ...happy, t: happy.t + Math.max(0, dt) };
  const hold = HAPPY_DUR[next.kind];
  if (next.kind === "tribute") {
    const pose = tributePose(next.t);
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "docket") {
    const pose = docketPose(next.t);
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else {
    const pose = sealPose(next.t);
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  }
  if (next.t >= hold) return { ...next, phase: "done", lift: 0, rot: 0, anim: "idle" };
  return next;
}

/** Bandit has no Rui-style sleep-frame hold. */
export function sleepHoldFrame(_key: string | undefined, _frameCount?: number) {
  return null;
}

export function beginTrick(kind: KingsnakeTrickKind, x: number, facing: 1 | -1 = 1): KingsnakeTrick {
  const anim: TrickAnim =
    kind === "verdict"
      ? "sit"
      : kind === "audit" || kind === "drawer"
        ? "talk"
        : kind === "plumb"
          ? "sit"
          : kind === "stripe" || kind === "raid" || kind === "band"
            ? "play"
            : "sit";
  return {
    kind,
    phase: kind === "verdict" ? "hold" : "go",
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

/** Verdict — stacked authoritative coil. Soft rock. Not Nori orb. Not window-play INSPECT. */
export function verdictPose(t: number) {
  return {
    lift: 2.2 + Math.sin(t * 1.7) * 2.8 + Math.abs(Math.sin(t * 3.4)) * 1.6,
    rot: -18 + Math.sin(t * 2.4) * 22 + Math.sin(t * 4.6) * 12,
  };
}

/** Soft unstack out of the verdict; stays on the desk. Not window-play leave. */
export function releasePose(t: number) {
  const u = Math.max(0, Math.min(1, t / RELEASE_S));
  return { lift: (2.2 + 2.8) * (1 - Math.sin(u * Math.PI * 0.5)), rot: -18 * (1 - u) };
}

/** Stripe — band ripple across the body. Black-and-white law. Not Saffron scribble. */
export function stripePose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.stripe));
  if (u < 0.12) {
    const s = smoothstep(u / 0.12);
    return { x: fromX, lift: s * 2.8, rot: s * 16 * facing, anim: "play" as const };
  }
  if (u < 0.88) {
    const s = (u - 0.12) / 0.76;
    const band = Math.sin(s * Math.PI * 4.2);
    return {
      x: fromX + facing * (s * 6.5 + band * 2.8),
      lift: 2.8 + Math.abs(band) * 7.2,
      rot: facing * (16 + band * 32),
      anim: "play" as const,
    };
  }
  const s = smoothstep((u - 0.88) / 0.12);
  return {
    x: fromX + facing * (6.5 * (1 - s)),
    lift: 2.8 * (1 - s),
    rot: facing * 8 * (1 - s),
    anim: "sit" as const,
  };
}

/** Audit — deliberate desk survey with the head. Not window-play INSPECT. Not Nori taste. */
export function auditPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.audit));
  if (u < 0.12) {
    const s = smoothstep(u / 0.12);
    return { x: fromX + facing * s * 1.4, lift: s * 4.6, rot: s * -18 * facing, anim: "talk" as const };
  }
  if (u < 0.84) {
    const s = (u - 0.12) / 0.72;
    const sweep = Math.sin(s * Math.PI * 2.6);
    return {
      x: fromX + facing * (1.4 + sweep * 3.2),
      lift: 4.6 + Math.abs(Math.sin(s * Math.PI * 3.2)) * 4.2,
      rot: facing * (-18 + sweep * 28),
      anim: "talk" as const,
    };
  }
  const s = smoothstep((u - 0.84) / 0.16);
  return {
    x: fromX + facing * (1.4 * (1 - s)),
    lift: 4.6 * (1 - s),
    rot: facing * -9 * (1 - s),
    anim: "sit" as const,
  };
}

/** Plumb — straighten full length like a measuring stick. Not Saffron probe. Not Sol flick. */
export function plumbPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.plumb));
  if (u < 0.14) {
    const s = smoothstep(u / 0.14);
    return { x: fromX, lift: s * 3.8, rot: s * 22 * facing, anim: "sit" as const };
  }
  if (u < 0.72) {
    const s = (u - 0.14) / 0.58;
    return {
      x: fromX + facing * smoothstep(s) * 10.5,
      lift: 3.8 - s * 1.2 + Math.abs(Math.sin(s * Math.PI)) * 2.4,
      rot: facing * (22 - s * 34),
      anim: "sit" as const,
    };
  }
  const s = smoothstep((u - 0.72) / 0.28);
  return {
    x: fromX + facing * (10.5 * (1 - s)),
    lift: 2.6 * (1 - s),
    rot: facing * (-12 * (1 - s)),
    anim: "sit" as const,
  };
}

/** Raid — bold theatrical strike-sweep then home. Bandit theater, not shy inch. */
export function raidPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.raid));
  if (u < 0.1) {
    const s = smoothstep(u / 0.1);
    return { x: fromX, lift: s * 5.0, rot: -s * 18 * facing, anim: "play" as const };
  }
  if (u < 0.46) {
    const s = (u - 0.1) / 0.36;
    return {
      x: fromX + facing * smoothstep(s) * 9.5,
      lift: 5.0 + Math.sin(s * Math.PI) * 4.8,
      rot: facing * (-18 + s * 32),
      anim: "play" as const,
    };
  }
  if (u < 0.8) {
    const s = (u - 0.46) / 0.34;
    const home = smoothstep(s);
    return {
      x: fromX + facing * (9.5 * (1 - home)),
      lift: 5.0 * (1 - home * 0.45) + Math.sin(s * Math.PI) * 2.2,
      rot: facing * (14 - home * 22),
      anim: "play" as const,
    };
  }
  const s = smoothstep((u - 0.8) / 0.2);
  return {
    x: fromX,
    lift: 5.0 * 0.55 * (1 - s),
    rot: facing * -6 * (1 - s),
    anim: "sit" as const,
  };
}

/** Band — show the bold black-and-white band pattern stretch. Not Saffron blotter. Not stripe (ripple). Ethogram band_soft. */
export function bandPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.band));
  if (u < 0.14) {
    const s = smoothstep(u / 0.14);
    return { x: fromX, lift: s * 4.8, rot: s * 20 * facing, anim: "play" as const };
  }
  if (u < 0.86) {
    const s = (u - 0.14) / 0.72;
    const band = Math.abs(Math.sin(s * Math.PI * 3.4));
    return {
      x: fromX + facing * Math.sin(s * Math.PI) * 2.4,
      lift: 4.8 + band * 5.6,
      rot: facing * (20 + band * 22),
      anim: "play" as const,
    };
  }
  const s = smoothstep((u - 0.86) / 0.14);
  return {
    x: fromX,
    lift: 4.8 * (1 - s),
    rot: facing * 10 * (1 - s),
    anim: "sit" as const,
  };
}

/** Drawer — ruler-drawer peek over the rim. Not rabbit periscope. Not Nori loom. Not Saffron pencil. Ethogram drawer_soft. */
export function drawerPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.drawer));
  if (u < 0.12) {
    const s = smoothstep(u / 0.12);
    return { x: fromX, lift: s * 2.8, rot: s * 16 * facing, anim: "talk" as const };
  }
  if (u < 0.88) {
    const s = (u - 0.12) / 0.76;
    const sway = Math.sin(s * Math.PI * 3.6);
    return {
      x: fromX + facing * (Math.abs(sway) * 8.5 + s * 2.2),
      lift: 2.8 + Math.abs(sway) * 7.2,
      rot: facing * (16 + sway * 32),
      anim: "talk" as const,
    };
  }
  const s = smoothstep((u - 0.88) / 0.12);
  return {
    x: fromX + facing * 6.0,
    lift: 2.8 * (1 - s),
    rot: facing * 8 * (1 - s),
    anim: "sit" as const,
  };
}

export function stepTrick(trick: KingsnakeTrick, dt: number, flags?: TrickFlags): KingsnakeTrick {
  if (!trick || trick.phase === "done") return trick;
  if (shouldAbort(flags) && trick.kind !== "stripe" && trick.kind !== "raid" && trick.kind !== "band") {
    return { ...trick, phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true };
  }
  const next: KingsnakeTrick = { ...trick, t: trick.t + Math.max(0, dt) };
  if (next.kind === "verdict") {
    if (next.t < VERDICT_HOLD) {
      const pose = verdictPose(next.t);
      next.phase = "hold";
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = "sit";
      return next;
    }
    if (next.t < VERDICT_HOLD + RELEASE_S) {
      const pose = releasePose(next.t - VERDICT_HOLD);
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
  const from = trick.fromX != null ? trick.fromX : trick.x;
  if (next.kind === "stripe") {
    const pose = stripePose(next.t, from, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "audit") {
    const pose = auditPose(next.t, from, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "plumb") {
    const pose = plumbPose(next.t, from, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "raid") {
    const pose = raidPose(next.t, from, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "band") {
    const pose = bandPose(next.t, from, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else {
    const pose = drawerPose(next.t, from, trick.facing);
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
