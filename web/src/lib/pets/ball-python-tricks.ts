/** Nori ground tricks while idle — ultra-polish pass. House ball python — orb / nook / taste / inch / unroll / loom / weave personality (ball/hide/tongue desk life; shy inkwell bun). Orb comfort-ball without naming bun/ball/coil/curl (window-play BUN + hedgehog own those); nook head-tuck hide without naming hide/tuck; taste tongue-flick chemosense without naming flick/sniff; inch shy lunge without naming strike/pounce; unroll long-body stretch without naming noodle/fold; loom periscope head-raise survey without naming periscope (rabbit); weave S-curve body weave without naming corkscrew/spiral. Window-play BUN unchanged — never names `bun`. Hedgehog owns curl/ball; volt window-play owns coil; Ember owns settle/shine/dip; Vesper owns fold/thrum/glow; Sol owns flick/sun/press. Guest slug Nori / key ball_python — accept "ball_python" and "nori". Amplitudes raised toward Rui richness; denser waits/weights; prefersHouseCry via ball_python.wav. Thank-yous savor / nestle / center. Feed-happy after eat. Sleep, hide, leave, rest, card, ribbon still win. Same map as desktop `ball-python-tricks.js`. True house-ball-python desk life — not Rui/cat/dog/rabbit/hamster/guinea_pig/turtle/goldfish/budgie/fox/penguin/parrot/ferret/hedgehog/chinchilla/axolotl/toucan/iguana/Sol/dragon/Vesper/phoenix/Ember or *Dragon electrical (Relay/Fuse/Ground) clones. Bird ultra (Soot→Ember) + Miso→Vesper done; Echo/budgie + Peck/penguin + Quill/parrot + Keel/toucan + Ember skip birds. prefersHouseCry via ball_python.wav. Amplitudes raised toward Rui richness; denser waits/weights (ORB_HOLD=11.2 RELEASE_S=1.18). Saffron densified. Bandit densified. Jade densified. Bluff densified. Sash densified. Lula densified. Coral densified. Blush densified. Atlas densified. Cup densified. Sepia densified. Next leftover Chamber / nautilus. Catalog 221. Never retouch Rui sprites. */

export const TRICK_KEY = "ball_python";
export const TRICKS = ["orb", "nook", "taste", "inch", "unroll", "loom", "weave"] as const;
export const HAPPY = ["savor", "nestle", "center"] as const;
export type BallPythonTrickKind = (typeof TRICKS)[number];
export type BallPythonHappyKind = (typeof HAPPY)[number];
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

export type BallPythonTrick = {
  kind: BallPythonTrickKind;
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

export type BallPythonHappy = {
  kind: BallPythonHappyKind;
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

export const HAPPY_DUR: Record<BallPythonHappyKind, number> = {
  savor: 1.58,
  nestle: 1.66,
  center: 1.72,
};

/** Orb hold — Nori becomes a tight desk ball. Not window-play BUN. Not hedgehog curl. */
export const ORB_HOLD = 11.2;
export const RELEASE_S = 1.18;

export const DUR: Record<BallPythonTrickKind, number> = {
  orb: ORB_HOLD + RELEASE_S,
  nook: 2.12,
  taste: 2.05,
  inch: 2.18,
  unroll: 1.95,
  loom: 2.28,
  weave: 2.34,
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

export function nextTrickWait(justFinished: boolean, rand?: number, kind?: BallPythonTrickKind) {
  const roll = rand == null ? Math.random() : rand;
  if (kind === "orb") return 40 + roll * 26;
  if (kind === "nook" || kind === "taste" || kind === "loom") return 12.8 + roll * 9.4;
  if (kind === "inch" || kind === "unroll" || kind === "weave") return 11.6 + roll * 8.5;
  return justFinished ? 8.5 + roll * 8.4 : 4.4 + roll * 7.4;
}

export function pickTrick(rand?: number, musicOn = false, lastKind?: BallPythonTrickKind | null): BallPythonTrickKind {
  if (musicOn) return "orb";
  const roll = rand == null ? Math.random() : rand;
  const pool = TRICKS.filter((k) => k !== lastKind);
  const list = pool.length ? pool : [...TRICKS];
  const weights = list.map((k) =>
    k === "orb" ? 0.72 : k === "nook" || k === "loom" || k === "taste" ? 1.28 : k === "inch" || k === "unroll" ? 1.18 : 1.08
  );
  let total = 0;
  for (let i = 0; i < weights.length; i++) total += weights[i]!;
  let r = roll * total;
  for (let i = 0; i < list.length; i++) {
    r -= weights[i]!;
    if (r <= 0) return list[i]!;
  }
  return list[list.length - 1] || "orb";
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
  return key === TRICK_KEY || key === "nori";
}

export function startThankYou(
  key: string | undefined,
  lastKind: BallPythonHappyKind | null | undefined,
  x: number,
  facing: 1 | -1,
  flags?: TrickFlags,
) {
  if (!wantsThankYou(key)) return null;
  if (!happyCanStart(flags || { cmd: "idle" })) return null;
  const pick = pickHappy(lastKind);
  return { happy: beginHappy(pick, x, facing), kind: pick };
}

export function pickHappy(lastKind?: BallPythonHappyKind | null, rand?: number): BallPythonHappyKind {
  const pool = HAPPY.filter((k) => k !== lastKind);
  const list = pool.length ? pool : [...HAPPY];
  const roll = rand == null ? Math.random() : rand;
  return list[Math.floor(roll * list.length)] ?? list[0]!;
}

export function beginHappy(kind: BallPythonHappyKind, x: number, facing: 1 | -1 = 1): BallPythonHappy {
  const name: BallPythonHappyKind = HAPPY.includes(kind) ? kind : "savor";
  return {
    kind: name,
    happy: true,
    phase: "go",
    t: 0,
    x,
    lift: 0,
    rot: 0,
    anim: name === "savor" ? "sit" : name === "nestle" ? "sit" : "talk",
    facing,
    fromX: x,
  };
}

export function savorPose(t: number) {
  const u = Math.max(0, Math.min(1, t / HAPPY_DUR.savor));
  if (u < 0.18) {
    const s = u / 0.18;
    return { lift: s * 5.28, rot: s * 16.8, dx: 0, anim: "sit" as const };
  }
  if (u < 0.78) {
    return {
      lift: 5.28 + Math.abs(Math.sin(t * 5.2)) * 3.12,
      rot: 16.8 + Math.sin(t * 4.4) * 12,
      dx: 0,
      anim: "sit" as const,
    };
  }
  const s = (u - 0.78) / 0.22;
  return { lift: 5.28 * (1 - s), rot: 16.8 * (1 - s), dx: 0, anim: "idle" as const };
}

export function nestlePose(t: number) {
  const u = Math.max(0, Math.min(1, t / HAPPY_DUR.nestle));
  if (u < 0.12) {
    const s = u / 0.12;
    return { lift: s * 6.72, rot: -s * 19.2, dx: 0, anim: "sit" as const };
  }
  if (u < 0.86) {
    return {
      lift: 6.72 + Math.abs(Math.sin(t * 10)) * 3.84,
      rot: -19.2 + Math.sin(t * 12) * 21.6,
      dx: Math.sin(t * 6) * 1.44,
      anim: "sit" as const,
    };
  }
  const s = (u - 0.86) / 0.14;
  return { lift: 6.72 * (1 - s), rot: -19.2 * (1 - s), dx: 0, anim: "sit" as const };
}

export function centerPose(t: number) {
  return {
    lift: Math.abs(Math.sin(t * 3.4)) * 4.56 + 1.44,
    rot: -16.8 + Math.sin(t * 3.0) * 14.4,
    dx: Math.sin(t * 2.4) * 1.68,
    anim: "talk" as const,
  };
}

export function stepHappy(happy: BallPythonHappy, dt: number, flags?: TrickFlags): BallPythonHappy {
  if (!happy || happy.phase === "done") return happy;
  if (happyShouldAbort(flags)) {
    return { ...happy, phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true };
  }
  const next: BallPythonHappy = { ...happy, t: happy.t + Math.max(0, dt) };
  const hold = HAPPY_DUR[next.kind];
  if (next.kind === "savor") {
    const pose = savorPose(next.t);
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "nestle") {
    const pose = nestlePose(next.t);
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else {
    const pose = centerPose(next.t);
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  }
  if (next.t >= hold) return { ...next, phase: "done", lift: 0, rot: 0, anim: "idle" };
  return next;
}

/** Nori has no Rui-style sleep-frame hold. */
export function sleepHoldFrame(_key: string | undefined, _frameCount?: number) {
  return null;
}

export function beginTrick(kind: BallPythonTrickKind, x: number, facing: 1 | -1 = 1): BallPythonTrick {
  const anim: TrickAnim =
    kind === "orb"
      ? "sit"
      : kind === "nook"
        ? "sit"
        : kind === "taste"
          ? "talk"
          : kind === "inch"
            ? "play"
            : kind === "unroll"
              ? "play"
              : kind === "loom"
                ? "talk"
                : kind === "weave"
                  ? "play"
                  : "sit";
  return {
    kind,
    phase: kind === "orb" ? "hold" : "go",
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

/** Orb — tight comfort ball on the blotter. Soft rock. Not window-play BUN. Not hedgehog curl. */
export function orbPose(t: number) {
  return {
    lift: 2.64 + Math.sin(t * 1.7) * 3.36 + Math.abs(Math.sin(t * 3.4)) * 1.92,
    rot: 21.6 + Math.sin(t * 2.4) * 26.4 + Math.sin(t * 4.6) * 14.4,
  };
}

/** Soft uncurl out of the orb; stays on the desk. Not window-play leave. */
export function releasePose(t: number) {
  const u = Math.max(0, Math.min(1, t / RELEASE_S));
  return { lift: (2.64 + 3.36) * (1 - Math.sin(u * Math.PI * 0.5)), rot: 21.6 * (1 - u) };
}

/** Nook — head tucks into a desk hide. Shy hide without naming hide/bun. */
export function nookPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.nook));
  if (u < 0.14) {
    const s = smoothstep(u / 0.14);
    return { x: fromX, lift: s * 5.52, rot: s * -21.6 * facing, anim: "sit" as const };
  }
  if (u < 0.86) {
    const s = (u - 0.14) / 0.72;
    const tuck = Math.abs(Math.sin(s * Math.PI * 1.6));
    return {
      x: fromX + facing * Math.sin(s * Math.PI) * 1.92,
      lift: 5.52 + tuck * 5.04,
      rot: facing * (-21.6 - tuck * 19.2),
      anim: "sit" as const,
    };
  }
  const s = smoothstep((u - 0.86) / 0.14);
  return {
    x: fromX,
    lift: 5.52 * (1 - s),
    rot: facing * -10.8 * (1 - s),
    anim: "sit" as const,
  };
}

/** Taste — tongue-flick chemosense. Not Sol flick. Not dog sniff. */
export function tastePose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.taste));
  if (u < 0.1) {
    const s = smoothstep(u / 0.1);
    return { x: fromX, lift: s * 4.56, rot: s * 14.4 * facing, anim: "talk" as const };
  }
  if (u < 0.88) {
    const s = (u - 0.1) / 0.78;
    const flick = Math.sin(s * Math.PI * 6.5);
    return {
      x: fromX + facing * flick * 2.16,
      lift: 4.56 + Math.abs(flick) * 6.6,
      rot: facing * (14.4 + flick * 26.4),
      anim: "talk" as const,
    };
  }
  const s = smoothstep((u - 0.88) / 0.12);
  return {
    x: fromX,
    lift: 4.56 * (1 - s),
    rot: facing * 7.2 * (1 - s),
    anim: "sit" as const,
  };
}

/** Inch — shy one-inch lunge then retreat. Athletic theater, then bun-thought. */
export function inchPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.inch));
  if (u < 0.14) {
    const s = smoothstep(u / 0.14);
    return { x: fromX, lift: s * 6.0, rot: -s * 16.8 * facing, anim: "play" as const };
  }
  if (u < 0.5) {
    const s = (u - 0.14) / 0.36;
    return {
      x: fromX + facing * smoothstep(s) * 10.2,
      lift: 6.0 + Math.sin(s * Math.PI) * 5.76,
      rot: facing * (-16.8 + s * 33.6),
      anim: "play" as const,
    };
  }
  if (u < 0.82) {
    const s = (u - 0.5) / 0.32;
    const home = smoothstep(s);
    return {
      x: fromX + facing * (10.2 * (1 - home)),
      lift: 6.0 * (1 - home * 0.45) + Math.sin(s * Math.PI) * 2.64,
      rot: facing * (16.8 - home * 24),
      anim: "play" as const,
    };
  }
  const s = smoothstep((u - 0.82) / 0.18);
  return {
    x: fromX,
    lift: 6.0 * 0.55 * (1 - s),
    rot: facing * -4.8 * (1 - s),
    anim: "sit" as const,
  };
}

/** Unroll — decide to be long, then re-round. Not ferret noodle. Not Vesper fold. */
export function unrollPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.unroll));
  if (u < 0.18) {
    const s = smoothstep(u / 0.18);
    return { x: fromX + facing * s * 5.04, lift: s * 5.52, rot: s * -16.8 * facing, anim: "play" as const };
  }
  if (u < 0.62) {
    const s = (u - 0.18) / 0.44;
    const wave = Math.sin(s * Math.PI * 2.2);
    return {
      x: fromX + facing * (5.04 + s * 6.6 + wave * 1.92),
      lift: 5.52 + Math.abs(wave) * 5.04,
      rot: facing * (-16.8 + wave * 26.4),
      anim: "play" as const,
    };
  }
  const s = smoothstep((u - 0.62) / 0.38);
  return {
    x: fromX + facing * (11.64 * (1 - s)),
    lift: 5.52 * (1 - s) * 0.45,
    rot: facing * (-4.8 + s * 19.2),
    anim: "sit" as const,
  };
}

/** Loom — periscope head-raise survey on the blotter. Not rabbit periscope. Ethogram loom_soft. */
export function loomPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.loom));
  if (u < 0.14) {
    const s = smoothstep(u / 0.14);
    return { x: fromX, lift: s * 5.76, rot: s * 24 * facing, anim: "talk" as const };
  }
  if (u < 0.86) {
    const s = (u - 0.14) / 0.72;
    const rise = Math.abs(Math.sin(s * Math.PI * 2.8));
    return {
      x: fromX + facing * Math.sin(s * Math.PI) * 1.68,
      lift: 5.76 + rise * 6.24,
      rot: facing * (24 + rise * 21.6),
      anim: "talk" as const,
    };
  }
  const s = smoothstep((u - 0.86) / 0.14);
  return {
    x: fromX,
    lift: 5.76 * (1 - s),
    rot: facing * 12 * (1 - s),
    anim: "sit" as const,
  };
}

/** Weave — S-curve body weave across the grain. Not ferret corkscrew. Not nautilus spiral. Ethogram weave_soft. */
export function weavePose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.weave));
  if (u < 0.12) {
    const s = smoothstep(u / 0.12);
    return { x: fromX, lift: s * 3.36, rot: s * 19.2 * facing, anim: "sit" as const };
  }
  if (u < 0.88) {
    const s = (u - 0.12) / 0.76;
    const sway = Math.sin(s * Math.PI * 3.6);
    return {
      x: fromX + facing * (Math.abs(sway) * 10.2 + s * 2.64),
      lift: 3.36 + Math.abs(sway) * 8.64,
      rot: facing * (19.2 + sway * 38.4),
      anim: "play" as const,
    };
  }
  const s = smoothstep((u - 0.88) / 0.12);
  return {
    x: fromX + facing * 7.2,
    lift: 3.36 * (1 - s),
    rot: facing * 9.6 * (1 - s),
    anim: "sit" as const,
  };
}

export function stepTrick(trick: BallPythonTrick, dt: number, flags?: TrickFlags): BallPythonTrick {
  if (!trick || trick.phase === "done") return trick;
  if (shouldAbort(flags) && trick.kind !== "inch" && trick.kind !== "unroll" && trick.kind !== "weave") {
    return { ...trick, phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true };
  }
  const next: BallPythonTrick = { ...trick, t: trick.t + Math.max(0, dt) };
  if (next.kind === "orb") {
    if (next.t < ORB_HOLD) {
      const pose = orbPose(next.t);
      next.phase = "hold";
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = "sit";
      return next;
    }
    if (next.t < ORB_HOLD + RELEASE_S) {
      const pose = releasePose(next.t - ORB_HOLD);
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
  if (next.kind === "nook") {
    const pose = nookPose(next.t, from, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "taste") {
    const pose = tastePose(next.t, from, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "inch") {
    const pose = inchPose(next.t, from, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "unroll") {
    const pose = unrollPose(next.t, from, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "loom") {
    const pose = loomPose(next.t, from, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else {
    const pose = weavePose(next.t, from, trick.facing);
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
