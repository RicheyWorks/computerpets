/** Saffron ground tricks while idle — ultra-polish pass. House corn snake — scribble / gap / comma / probe / canyon / blotter / pencil personality (mid-sentence blotter life; curious pencil-tray explorer). Scribble S-curve writing without naming write (window-play WRITE owns that); gap curious desk-gap dip without naming hide/nook; comma loose question-mark loaf without naming orb/bun/coil; probe bright tongue chemosense without naming taste/flick/sniff; canyon pencil-tray rim roam without naming inch/strike; blotter mid-sentence blotter pause/blot without naming bask/loaf/settle; pencil pencil-tray climb/peek without naming periscope/loom. Window-play WRITE unchanged — never names `write`. Nori owns orb/nook/taste/inch/unroll/loom/weave and savor/nestle/center; hedgehog owns curl/ball; volt window-play owns coil; ferret owns noodle; Ember owns settle/shine/dip; Vesper owns fold/thrum/glow; Sol owns flick/sun/press. Guest slug Saffron / key corn_snake — accept "corn_snake" and "saffron". Amplitudes raised toward Rui richness; denser waits/weights; prefersHouseCry via corn_snake.wav. Thank-yous clause / spice / cord. Feed-happy after eat. Sleep, hide, leave, rest, card, ribbon still win. Same map as desktop `corn-snake-tricks.js`. True house-corn-snake desk life — not Rui/cat/dog/rabbit/hamster/guinea_pig/turtle/goldfish/budgie/fox/penguin/parrot/ferret/hedgehog/chinchilla/axolotl/toucan/iguana/Sol/dragon/Vesper/phoenix/Ember/ball_python/Nori or *Dragon electrical (Relay/Fuse/Ground) clones. Bird ultra (Soot→Ember) + Miso→Nori done; Echo/budgie + Peck/penguin + Quill/parrot + Keel/toucan + Ember skip birds. prefersHouseCry via corn_snake.wav. Amplitudes raised toward Rui richness; denser waits/weights (COMMA_HOLD=11.2 RELEASE_S=1.18). Bandit densified. Jade densified. Bluff densified. Sash densified. Lula densified. Next leftover Coral / milk_snake. Catalog 221. Never retouch Rui sprites. */

export const TRICK_KEY = "corn_snake";
export const TRICKS = ["scribble", "gap", "comma", "probe", "canyon", "blotter", "pencil"] as const;
export const HAPPY = ["clause", "spice", "cord"] as const;
export type CornSnakeTrickKind = (typeof TRICKS)[number];
export type CornSnakeHappyKind = (typeof HAPPY)[number];
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

export type CornSnakeTrick = {
  kind: CornSnakeTrickKind;
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

export type CornSnakeHappy = {
  kind: CornSnakeHappyKind;
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

export const HAPPY_DUR: Record<CornSnakeHappyKind, number> = {
  clause: 1.58,
  spice: 1.66,
  cord: 1.72,
};

/** Comma hold — Saffron loafs a loose question mark on the blotter. Not Nori orb. Not window-play WRITE. */
export const COMMA_HOLD = 11.2;
export const RELEASE_S = 1.18;

export const DUR: Record<CornSnakeTrickKind, number> = {
  scribble: 2.18,
  gap: 2.12,
  comma: COMMA_HOLD + RELEASE_S,
  probe: 2.05,
  canyon: 2.18,
  blotter: 2.28,
  pencil: 2.34,
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

export function nextTrickWait(justFinished: boolean, rand?: number, kind?: CornSnakeTrickKind) {
  const roll = rand == null ? Math.random() : rand;
  if (kind === "comma") return 40 + roll * 26;
  if (kind === "gap" || kind === "probe" || kind === "blotter") return 12.8 + roll * 9.4;
  if (kind === "scribble" || kind === "canyon" || kind === "pencil") return 11.6 + roll * 8.5;
  return justFinished ? 8.5 + roll * 8.4 : 4.4 + roll * 7.4;
}

export function pickTrick(rand?: number, musicOn = false, lastKind?: CornSnakeTrickKind | null): CornSnakeTrickKind {
  if (musicOn) return "comma";
  const roll = rand == null ? Math.random() : rand;
  const pool = TRICKS.filter((k) => k !== lastKind);
  const list = pool.length ? pool : [...TRICKS];
  const weights = list.map((k) =>
    k === "comma" ? 0.72 : k === "gap" || k === "blotter" || k === "probe" ? 1.28 : k === "scribble" || k === "canyon" ? 1.18 : 1.08
  );
  let total = 0;
  for (let i = 0; i < weights.length; i++) total += weights[i]!;
  let r = roll * total;
  for (let i = 0; i < list.length; i++) {
    r -= weights[i]!;
    if (r <= 0) return list[i]!;
  }
  return list[list.length - 1] || "comma";
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
  return key === TRICK_KEY || key === "saffron";
}

export function startThankYou(
  key: string | undefined,
  lastKind: CornSnakeHappyKind | null | undefined,
  x: number,
  facing: 1 | -1,
  flags?: TrickFlags,
) {
  if (!wantsThankYou(key)) return null;
  if (!happyCanStart(flags || { cmd: "idle" })) return null;
  const pick = pickHappy(lastKind);
  return { happy: beginHappy(pick, x, facing), kind: pick };
}

export function pickHappy(lastKind?: CornSnakeHappyKind | null, rand?: number): CornSnakeHappyKind {
  const pool = HAPPY.filter((k) => k !== lastKind);
  const list = pool.length ? pool : [...HAPPY];
  const roll = rand == null ? Math.random() : rand;
  return list[Math.floor(roll * list.length)] ?? list[0]!;
}

export function beginHappy(kind: CornSnakeHappyKind, x: number, facing: 1 | -1 = 1): CornSnakeHappy {
  const name: CornSnakeHappyKind = HAPPY.includes(kind) ? kind : "clause";
  return {
    kind: name,
    happy: true,
    phase: "go",
    t: 0,
    x,
    lift: 0,
    rot: 0,
    anim: name === "clause" ? "sit" : name === "spice" ? "talk" : "sit",
    facing,
    fromX: x,
  };
}

export function clausePose(t: number) {
  const u = Math.max(0, Math.min(1, t / HAPPY_DUR.clause));
  if (u < 0.18) {
    const s = u / 0.18;
    return { lift: s * 5.28, rot: s * 16.8, dx: 0, anim: "sit" as const };
  }
  if (u < 0.78) {
    return {
      lift: 5.28 + Math.abs(Math.sin(t * 5.2)) * 3.12,
      rot: 16.8 + Math.sin(t * 4.4) * 12,
      dx: Math.sin(t * 2.4) * 0.96,
      anim: "sit" as const,
    };
  }
  const s = (u - 0.78) / 0.22;
  return { lift: 5.28 * (1 - s), rot: 16.8 * (1 - s), dx: 0, anim: "idle" as const };
}

export function spicePose(t: number) {
  const u = Math.max(0, Math.min(1, t / HAPPY_DUR.spice));
  if (u < 0.12) {
    const s = u / 0.12;
    return { lift: s * 6.72, rot: -s * 19.2, dx: 0, anim: "talk" as const };
  }
  if (u < 0.86) {
    const flick = Math.sin(t * 10);
    return {
      lift: 6.72 + Math.abs(flick) * 3.84,
      rot: -19.2 + flick * 21.6,
      dx: Math.sin(t * 6) * 1.44,
      anim: "talk" as const,
    };
  }
  const s = (u - 0.86) / 0.14;
  return { lift: 6.72 * (1 - s), rot: -19.2 * (1 - s), dx: 0, anim: "sit" as const };
}

export function cordPose(t: number) {
  return {
    lift: Math.abs(Math.sin(t * 3.4)) * 4.56 + 1.44,
    rot: -16.8 + Math.sin(t * 3.0) * 14.4,
    dx: Math.sin(t * 2.4) * 1.68,
    anim: "sit" as const,
  };
}

export function stepHappy(happy: CornSnakeHappy, dt: number, flags?: TrickFlags): CornSnakeHappy {
  if (!happy || happy.phase === "done") return happy;
  if (happyShouldAbort(flags)) {
    return { ...happy, phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true };
  }
  const next: CornSnakeHappy = { ...happy, t: happy.t + Math.max(0, dt) };
  const hold = HAPPY_DUR[next.kind];
  if (next.kind === "clause") {
    const pose = clausePose(next.t);
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "spice") {
    const pose = spicePose(next.t);
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else {
    const pose = cordPose(next.t);
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  }
  if (next.t >= hold) return { ...next, phase: "done", lift: 0, rot: 0, anim: "idle" };
  return next;
}

/** Saffron has no Rui-style sleep-frame hold. */
export function sleepHoldFrame(_key: string | undefined, _frameCount?: number) {
  return null;
}

export function beginTrick(kind: CornSnakeTrickKind, x: number, facing: 1 | -1 = 1): CornSnakeTrick {
  const anim: TrickAnim =
    kind === "comma"
      ? "sit"
      : kind === "gap"
        ? "sit"
        : kind === "probe"
          ? "talk"
          : kind === "scribble"
            ? "play"
            : kind === "canyon"
              ? "play"
              : kind === "blotter"
                ? "talk"
                : kind === "pencil"
                  ? "play"
                  : "sit";
  return {
    kind,
    phase: kind === "comma" ? "hold" : "go",
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

/** Comma — loose question-mark loaf. Soft rock. Not Nori orb. Not window-play WRITE. */
export function commaPose(t: number) {
  return {
    lift: 2.64 + Math.sin(t * 1.7) * 3.36 + Math.abs(Math.sin(t * 3.4)) * 1.92,
    rot: -21.6 + Math.sin(t * 2.4) * 26.4 + Math.sin(t * 4.6) * 14.4,
  };
}

/** Soft uncoil out of the comma; stays on the desk. Not window-play leave. */
export function releasePose(t: number) {
  const u = Math.max(0, Math.min(1, t / RELEASE_S));
  return { lift: (2.64 + 3.36) * (1 - Math.sin(u * Math.PI * 0.5)), rot: -21.6 * (1 - u) };
}

/** Scribble — S-curve body writing across the blotter. Mid-sentence. Not window-play WRITE. */
export function scribblePose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.scribble));
  if (u < 0.12) {
    const s = smoothstep(u / 0.12);
    return { x: fromX, lift: s * 3.36, rot: s * 19.2 * facing, anim: "play" as const };
  }
  if (u < 0.88) {
    const s = (u - 0.12) / 0.76;
    const wave = Math.sin(s * Math.PI * 3.6);
    return {
      x: fromX + facing * (Math.abs(wave) * 10.2 + s * 2.64),
      lift: 3.36 + Math.abs(wave) * 8.64,
      rot: facing * (19.2 + wave * 38.4),
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

/** Gap — curious head dips into a desk gap. Not Nori nook. Not hide. */
export function gapPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.gap));
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

/** Probe — bright tongue chemosense. Not Nori taste. Not Sol flick. */
export function probePose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.probe));
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

/** Canyon — pencil-tray rim roam then home. Athletic explorer, not shy inch. */
export function canyonPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.canyon));
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

/** Blotter — mid-sentence blotter pause / blot. Press body to the blotter, soft rock. Ethogram blotter_soft. */
export function blotterPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.blotter));
  if (u < 0.14) {
    const s = smoothstep(u / 0.14);
    return { x: fromX, lift: s * 5.76, rot: s * 24 * facing, anim: "talk" as const };
  }
  if (u < 0.86) {
    const s = (u - 0.14) / 0.72;
    const blot = Math.abs(Math.sin(s * Math.PI * 2.8));
    return {
      x: fromX + facing * Math.sin(s * Math.PI) * 1.68,
      lift: 5.76 + blot * 6.24,
      rot: facing * (24 + blot * 21.6),
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

/** Pencil — pencil-tray climb / peek over the rim. Not rabbit periscope. Not Nori loom. Ethogram pencil_soft. */
export function pencilPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.pencil));
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

export function stepTrick(trick: CornSnakeTrick, dt: number, flags?: TrickFlags): CornSnakeTrick {
  if (!trick || trick.phase === "done") return trick;
  if (shouldAbort(flags) && trick.kind !== "scribble" && trick.kind !== "canyon" && trick.kind !== "pencil") {
    return { ...trick, phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true };
  }
  const next: CornSnakeTrick = { ...trick, t: trick.t + Math.max(0, dt) };
  if (next.kind === "comma") {
    if (next.t < COMMA_HOLD) {
      const pose = commaPose(next.t);
      next.phase = "hold";
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = "sit";
      return next;
    }
    if (next.t < COMMA_HOLD + RELEASE_S) {
      const pose = releasePose(next.t - COMMA_HOLD);
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
  if (next.kind === "scribble") {
    const pose = scribblePose(next.t, from, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "gap") {
    const pose = gapPose(next.t, from, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "probe") {
    const pose = probePose(next.t, from, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "canyon") {
    const pose = canyonPose(next.t, from, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "blotter") {
    const pose = blotterPose(next.t, from, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else {
    const pose = pencilPose(next.t, from, trick.facing);
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
