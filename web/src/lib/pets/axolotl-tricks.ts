/** Bloom ground tricks while idle — ultra-polish pass. House axolotl — gill / amble / mend / smile / plume / sprout / glop personality (soft Ambystoma mexicanum desk life). Gill external-plume breathe hold without naming wall (window-play) or soak or drift; amble neotenic salamander walk without naming zoom/plod/dart; mend regenerate-adjacent settle without naming anoint/noodle; smile permanent soft face without naming gape/prance; plume bilateral gill sway play without naming preen/fan; sprout neotenic filament sprout-flare without naming puff/flash/frill; glop soft suction-feed mouth draw without naming gulp/bubble/nosh/dig. Window-play WALL unchanged — never names a trick `wall`. Window-play FLOAT (Nimbus) and BLOOM (yeast) stay untouched — never names `float` or `bloom`. Goldfish already owns drift/gulp/flare/glint/dart/yawn/forage and bubble/lip/swish. Turtle already owns soak/paddle. Rui already owns wave. Door window-play owns gape. Chinchilla already owns ash/bound/fluff/chin/sift/ricochet/gnaw. Hedgehog already owns curl/snuffle/anoint/bristle/root. Guest slug Bloom / key axolotl — accept "axolotl" and "bloom". Amplitudes raised toward Rui richness; denser timing; house cry preferred for talk (`axolotl.wav`). Thank-yous wink / blip / grin. Feed-happy after eat. Sleep, hide, leave, rest, card, ribbon still win. Same map as desktop `axolotl-tricks.js`. True house-axolotl desk life — not Rui/cat/dog/rabbit/hamster/guinea_pig/turtle/goldfish/budgie/fox/penguin/parrot/ferret/hedgehog/chinchilla/toucan/iguana/dragon/Vesper clones. Bird ultra (Soot→Ember) + Miso/Pip/Thimble/Clip/Whee/Ink/Coin/Rue/Wick/Burr/Floss done; Echo/budgie + Peck/penguin + Quill/parrot + Keel/toucan skip birds. Next guest ultra is Sol / iguana (skip Ember if bird). No cry inventing — thank-yous silent desk motion only. Never retouch Rui sprites.  axolotl.wav EXISTS so prefersHouseCry adds axolotl. Amplitudes raised toward Rui richness; denser waits/weights (GILL_HOLD=11.2 RELEASE_S=1.18). Catalog 221. */

export const TRICK_KEY = "axolotl";
export const TRICKS = ["gill", "amble", "mend", "smile", "plume", "sprout", "glop"] as const;
export const HAPPY = ["wink", "blip", "grin"] as const;
export type AxolotlTrickKind = (typeof TRICKS)[number];
export type AxolotlHappyKind = (typeof HAPPY)[number];
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

export type AxolotlTrick = {
  kind: AxolotlTrickKind;
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

export type AxolotlHappy = {
  kind: AxolotlHappyKind;
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

export const HAPPY_DUR: Record<AxolotlHappyKind, number> = {
  wink: 1.62,
  blip: 1.7,
  grin: 1.66,
};

/** Gill hold — Bloom breathes with external plumes on the desk. Not window-play WALL. Not a goldfish drift. Not a turtle soak. Not a cat loaf. */
export const GILL_HOLD = 11.2;
export const RELEASE_S = 1.18;

export const DUR: Record<AxolotlTrickKind, number> = {
  gill: GILL_HOLD + RELEASE_S,
  amble: 1.88,
  mend: 1.96,
  smile: 1.78,
  plume: 1.92,
  sprout: 2.08,
  glop: 2.15,
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

export function nextTrickWait(justFinished: boolean, rand?: number, kind?: AxolotlTrickKind) {
  const roll = rand == null ? Math.random() : rand;
  if (kind === "gill") return 40 + roll * 26;
  if (kind === "amble" || kind === "sprout" || kind === "plume") return 12.8 + roll * 9.4;
  if (kind === "mend" || kind === "smile" || kind === "glop") return 11.6 + roll * 8.5;
  return justFinished ? 8.5 + roll * 8.4 : 4.4 + roll * 7.4;
}

export function pickTrick(rand?: number, musicOn = false, lastKind?: AxolotlTrickKind | null): AxolotlTrickKind {
  if (musicOn) return "gill";
  const roll = rand == null ? Math.random() : rand;
  const pool = TRICKS.filter((k) => k !== lastKind);
  const list = pool.length ? pool : TRICKS.slice();
  const weights = list.map((k) =>
    k === "gill" ? 0.72 : k === "amble" || k === "sprout" || k === "plume" ? 1.28 : k === "mend" || k === "smile" ? 1.18 : 1.08
  );
  let total = 0;
  for (let i = 0; i < weights.length; i++) total += weights[i]!;
  let r = roll * total;
  for (let i = 0; i < list.length; i++) {
    r -= weights[i]!;
    if (r <= 0) return list[i]!;
  }
  return list[list.length - 1] || "gill";
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
  return key === TRICK_KEY || key === "bloom";
}

export function startThankYou(
  key: string | undefined,
  lastKind: AxolotlHappyKind | null | undefined,
  x: number,
  facing: 1 | -1,
  flags?: TrickFlags,
) {
  if (!wantsThankYou(key)) return null;
  if (!happyCanStart(flags || { cmd: "idle" })) return null;
  const pick = pickHappy(lastKind);
  return { happy: beginHappy(pick, x, facing), kind: pick };
}

export function pickHappy(lastKind?: AxolotlHappyKind | null, rand?: number): AxolotlHappyKind {
  const pool = HAPPY.filter((k) => k !== lastKind);
  const list = pool.length ? pool : [...HAPPY];
  const roll = rand == null ? Math.random() : rand;
  return list[Math.floor(roll * list.length)] ?? list[0]!;
}

export function beginHappy(kind: AxolotlHappyKind, x: number, facing: 1 | -1 = 1): AxolotlHappy {
  const name: AxolotlHappyKind = HAPPY.includes(kind) ? kind : "wink";
  return {
    kind: name,
    happy: true,
    phase: "go",
    t: 0,
    x,
    lift: 0,
    rot: 0,
    anim: name === "wink" ? "sit" : name === "blip" ? "talk" : "play",
    facing,
    fromX: x,
  };
}

export function winkPose(t: number) {
  const u = Math.max(0, Math.min(1, t / HAPPY_DUR.wink));
  if (u < 0.18) {
    const s = u / 0.18;
    return { lift: s * 5.0, rot: s * 14.4, dx: 0, anim: "sit" as const };
  }
  if (u < 0.78) {
    return {
      lift: 5.0 + Math.sin(t * 7) * 2.6,
      rot: 14.4 + Math.sin(t * 9) * 12,
      dx: Math.sin(t * 6) * 1.4,
      anim: "sit" as const,
    };
  }
  const s = (u - 0.78) / 0.22;
  return { lift: 5.0 * (1 - s), rot: 14.4 * (1 - s), dx: 0, anim: "idle" as const };
}

export function blipPose(t: number) {
  const u = Math.max(0, Math.min(1, t / HAPPY_DUR.blip));
  if (u < 0.14) {
    const s = u / 0.14;
    return { lift: s * 6.6, rot: -s * 16.8, dx: 0, anim: "talk" as const };
  }
  if (u < 0.82) {
    return {
      lift: 6.6 + Math.abs(Math.sin(t * 10)) * 4.1,
      rot: -16.8 + Math.sin(t * 12) * 14.4,
      dx: Math.sin(t * 8) * 1.9,
      anim: "talk" as const,
    };
  }
  const s = (u - 0.82) / 0.18;
  return { lift: 6.6 * (1 - s), rot: -16.8 * (1 - s), dx: 0, anim: "sit" as const };
}

export function grinPose(t: number) {
  return {
    lift: Math.abs(Math.sin(t * 8)) * 7.0 + 1.7,
    rot: Math.sin(t * 10) * 21.6,
    dx: Math.sin(t * 7) * 2.6,
    anim: "play" as const,
  };
}

export function stepHappy(happy: AxolotlHappy, dt: number, flags?: TrickFlags): AxolotlHappy {
  if (!happy || happy.phase === "done") return happy;
  if (happyShouldAbort(flags)) {
    return { ...happy, phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true };
  }
  const next: AxolotlHappy = { ...happy, t: happy.t + Math.max(0, dt) };
  const hold = HAPPY_DUR[next.kind];
  if (next.kind === "wink") {
    const pose = winkPose(next.t);
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "blip") {
    const pose = blipPose(next.t);
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else {
    const pose = grinPose(next.t);
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  }
  if (next.t >= hold) return { ...next, phase: "done", lift: 0, rot: 0, anim: "idle" };
  return next;
}

/** Bloom has no Rui-style sleep-frame hold. */
export function sleepHoldFrame(_key: string | undefined, _frameCount?: number) {
  return null;
}

export function beginTrick(kind: AxolotlTrickKind, x: number, facing: 1 | -1 = 1): AxolotlTrick {
  const anim: TrickAnim =
    kind === "gill"
      ? "sit"
      : kind === "amble"
        ? "walk"
        : kind === "mend"
          ? "sit"
          : kind === "smile"
            ? "sit"
            : kind === "plume"
              ? "play"
              : kind === "sprout"
                ? "play"
                : kind === "glop"
                  ? "sit"
                  : "sit";
  return {
    kind,
    phase: kind === "gill" ? "hold" : "go",
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

/** Gill — external plume breathe on the wood. Not window-play WALL. Not a goldfish drift. Not a turtle soak. Ethogram Ambystoma mexicanum true. */
export function gillPose(t: number) {
  return {
    lift: 2.9 + Math.sin(t * 1.9) * 3.8 + Math.abs(Math.sin(t * 3.6)) * 2.2,
    rot: 26.4 + Math.sin(t * 2.6) * 33.6 + Math.sin(t * 4.8) * 19.2,
  };
}

/** Soft settle — plumes still; Bloom stays on the desk. Not window-play leave. */
export function releasePose(t: number) {
  const u = Math.max(0, Math.min(1, t / RELEASE_S));
  return { lift: (2.9 + 3.8) * (1 - Math.sin(u * Math.PI * 0.5)), rot: 26.4 * (1 - u) };
}

/** Amble — neotenic salamander walk across the grain. Not a dog zoom. Not a turtle plod. Not a goldfish dart. Not window-play WALL walk. Ethogram walking true. */
export function amblePose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.amble));
  if (u < 0.1) {
    const s = smoothstep(u / 0.1);
    return { x: fromX, lift: s * 2.6, rot: -s * 14.4 * facing, anim: "sit" as const };
  }
  if (u < 0.88) {
    const s = (u - 0.1) / 0.78;
    const step = Math.sin(s * Math.PI * 3.2);
    return {
      x: fromX + facing * (22 * smoothstep(s) + Math.sin(s * Math.PI * 2) * 2.4),
      lift: 2.6 + Math.abs(step) * 11.4,
      rot: facing * (-14.4 + step * 26.4),
      anim: "walk" as const,
    };
  }
  const s = smoothstep((u - 0.88) / 0.12);
  return {
    x: fromX + facing * 22,
    lift: 2.6 * (1 - s),
    rot: facing * -7.2 * (1 - s),
    anim: "sit" as const,
  };
}

/** Mend — regenerate-adjacent settle; desk life heals slow. Not a ferret noodle. Not a hedgehog anoint. Not a rabbit groom. Ethogram regeneration true. */
export function mendPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.mend));
  if (u < 0.16) {
    const s = smoothstep(u / 0.16);
    return { x: fromX, lift: -s * 4.8, rot: s * 19.2 * facing, anim: "sit" as const };
  }
  if (u < 0.84) {
    const s = (u - 0.16) / 0.68;
    return {
      x: fromX + facing * Math.sin(s * Math.PI) * 2.4,
      lift: -4.8 + Math.sin(s * Math.PI * 2) * 6.6,
      rot: facing * (19.2 + Math.sin(s * Math.PI * 2.5) * 16.8),
      anim: "sit" as const,
    };
  }
  const s = smoothstep((u - 0.84) / 0.16);
  return {
    x: fromX,
    lift: (-4.8 + 6.6) * (1 - s) * 0.25,
    rot: facing * 9.6 * (1 - s),
    anim: "sit" as const,
  };
}

/** Smile — permanent soft face on the desk. Not a fox prance. Not a parrot flash. Not Door window-play gape. Ethogram face true. */
export function smilePose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.smile));
  if (u < 0.14) {
    const s = smoothstep(u / 0.14);
    return { x: fromX, lift: s * 5.8, rot: s * 12 * facing, anim: "sit" as const };
  }
  if (u < 0.86) {
    const s = (u - 0.14) / 0.72;
    return {
      x: fromX + facing * Math.sin(s * Math.PI) * 1.6,
      lift: 5.8 + Math.sin(s * Math.PI * 1.8) * 3.1,
      rot: facing * (12 + Math.sin(s * Math.PI * 2.2) * 14.4),
      anim: "sit" as const,
    };
  }
  const s = smoothstep((u - 0.86) / 0.14);
  return {
    x: fromX,
    lift: 5.8 * (1 - s),
    rot: facing * 6 * (1 - s),
    anim: "sit" as const,
  };
}

/** Plume — bilateral gill sway as play. Not a budgie preen. Not a parrot fan. Not window-play WALL. Ethogram gill plume true. */
export function plumePose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.plume));
  if (u < 0.1) {
    const s = smoothstep(u / 0.1);
    return {
      x: fromX,
      lift: s * 4.6,
      rot: -s * 21.6 * facing,
      anim: "sit" as const,
    };
  }
  if (u < 0.88) {
    const s = (u - 0.1) / 0.78;
    const sway = Math.sin(s * Math.PI * 5.5);
    return {
      x: fromX + facing * sway * 4.2,
      lift: 4.6 + Math.abs(sway) * 5.5,
      rot: facing * (-21.6 + sway * 43.2),
      anim: "play" as const,
    };
  }
  const s = smoothstep((u - 0.88) / 0.12);
  return {
    x: fromX,
    lift: 4.6 * (1 - s),
    rot: facing * -10.8 * (1 - s),
    anim: "sit" as const,
  };
}

/** Sprout — neotenic filament sprout-flare on the desk. Not puff/flash/frill guests. Not plume sway. Ethogram sprout_soft. */
export function sproutPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.sprout));
  if (u < 0.12) {
    const s = smoothstep(u / 0.12);
    return { x: fromX, lift: s * 3.8, rot: -s * 16.8 * facing, anim: "sit" as const };
  }
  if (u < 0.88) {
    const s = (u - 0.12) / 0.76;
    const bloom = Math.sin(s * Math.PI * 4.2);
    return {
      x: fromX + facing * bloom * 2.8,
      lift: 3.8 + Math.abs(bloom) * 12.6,
      rot: facing * (-16.8 + bloom * 33.6),
      anim: "play" as const,
    };
  }
  const s = smoothstep((u - 0.88) / 0.12);
  return {
    x: fromX,
    lift: 3.8 * (1 - s),
    rot: facing * -8.4 * (1 - s),
    anim: "sit" as const,
  };
}

/** Glop — soft suction-feed mouth draw on desk grain. Not goldfish gulp/forage. Not rabbit nosh. Not dig. Ethogram glop_soft. */
export function glopPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.glop));
  if (u < 0.14) {
    const s = smoothstep(u / 0.14);
    return { x: fromX, lift: -s * 5.5, rot: s * 21.6 * facing, anim: "sit" as const };
  }
  if (u < 0.86) {
    const s = (u - 0.14) / 0.72;
    const suck = Math.sin(s * Math.PI * 5);
    return {
      x: fromX + facing * Math.sin(s * Math.PI) * 1.8,
      lift: -5.5 + Math.abs(suck) * 6.2,
      rot: facing * (21.6 + suck * 28.8),
      anim: "sit" as const,
    };
  }
  const s = smoothstep((u - 0.86) / 0.14);
  return {
    x: fromX,
    lift: -5.5 * (1 - s),
    rot: facing * 10.8 * (1 - s),
    anim: "sit" as const,
  };
}

export function stepTrick(trick: AxolotlTrick, dt: number, flags?: TrickFlags): AxolotlTrick {
  if (!trick || trick.phase === "done") return trick;
  if (shouldAbort(flags) && trick.kind !== "amble" && trick.kind !== "plume" && trick.kind !== "sprout") {
    return { ...trick, phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true };
  }
  const next: AxolotlTrick = { ...trick, t: trick.t + Math.max(0, dt) };
  if (next.kind === "gill") {
    if (next.t < GILL_HOLD) {
      const pose = gillPose(next.t);
      next.phase = "hold";
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = "sit";
      return next;
    }
    if (next.t < GILL_HOLD + RELEASE_S) {
      const pose = releasePose(next.t - GILL_HOLD);
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
  const fromX = trick.fromX != null ? trick.fromX : trick.x;
  if (next.kind === "amble") {
    const pose = amblePose(next.t, fromX, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "mend") {
    const pose = mendPose(next.t, fromX, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "smile") {
    const pose = smilePose(next.t, fromX, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "plume") {
    const pose = plumePose(next.t, fromX, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "sprout") {
    const pose = sproutPose(next.t, fromX, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else {
    const pose = glopPose(next.t, fromX, trick.facing);
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
