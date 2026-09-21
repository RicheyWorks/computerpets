/** Burr ground tricks while idle — ultra-polish pass. House hedgehog — curl / snuffle / anoint / bristle / root / trundle / wheel personality (soft Atelerix desk life). Curl guarded pin-cushion hold without naming ball (window-play) or tuck (turtle) or loaf/nest; snuffle nose-down forage without naming dig or sniff-clone; anoint foam-and-spread without naming wash/preen; bristle quill lift without naming flare/puff; root litter shove without naming dig/steal; trundle slow rolling gait without naming waddle (penguin) or plod (turtle); wheel pet-hedgehog night-run without naming zoom/scurry/reel. Window-play BALL unchanged — never names a trick `ball`. Guest slug Burr / key hedgehog — accept "hedgehog" and "burr". Amplitudes raised toward Rui richness; denser timing; house cry preferred for talk (`hedgehog.wav`). Thank-yous snort / soft / grunt. Feed-happy after eat. Sleep, hide, leave, rest, card, ribbon still win. Same map as desktop `hedgehog-tricks.js`. True house-hedgehog desk life — not Rui/cat/dog/rabbit/hamster/guinea_pig/turtle/goldfish/budgie/fox/penguin/parrot/ferret/chinchilla/axolotl/toucan/iguana/dragon/Vesper clones. Bird ultra (Soot→Ember) + Miso/Pip/Thimble/Clip/Whee/Ink/Coin/Rue/Wick done; Echo/budgie + Peck/penguin + Quill/parrot skip birds; Keel/toucan skip if bird. Next guest ultra is Floss / chinchilla. No cry inventing — thank-yous silent desk motion only. Never retouch Rui sprites.  hedgehog.wav EXISTS so prefersHouseCry adds hedgehog. Amplitudes raised toward Rui richness; denser waits/weights (CURL_HOLD=11.2 RELEASE_S=1.18). Catalog 221. */

export const TRICK_KEY = "hedgehog";
export const TRICKS = ["curl", "snuffle", "anoint", "bristle", "root", "trundle", "wheel"] as const;
export const HAPPY = ["snort", "soft", "grunt"] as const;
export type HedgehogTrickKind = (typeof TRICKS)[number];
export type HedgehogHappyKind = (typeof HAPPY)[number];
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

export type HedgehogTrick = {
  kind: HedgehogTrickKind;
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

export type HedgehogHappy = {
  kind: HedgehogHappyKind;
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

export const HAPPY_DUR: Record<HedgehogHappyKind, number> = {
  snort: 1.62,
  soft: 1.7,
  grunt: 1.66,
};

/** Curl hold — Burr becomes a guarded pin-cushion ball on the desk. Not window-play ball. Not a turtle tuck. Not a cat loaf. Not a hamster nest. */
export const CURL_HOLD = 11.2;
export const RELEASE_S = 1.18;

export const DUR: Record<HedgehogTrickKind, number> = {
  curl: CURL_HOLD + RELEASE_S,
  snuffle: 1.88,
  anoint: 1.96,
  bristle: 1.78,
  root: 1.92,
  trundle: 2.08,
  wheel: 2.15,
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

export function nextTrickWait(justFinished: boolean, rand?: number, kind?: HedgehogTrickKind) {
  const roll = rand == null ? Math.random() : rand;
  if (kind === "curl") return 40 + roll * 26;
  if (kind === "wheel" || kind === "snuffle" || kind === "trundle") return 12.8 + roll * 9.4;
  if (kind === "anoint" || kind === "bristle" || kind === "root") return 11.6 + roll * 8.5;
  return justFinished ? 8.5 + roll * 8.4 : 4.4 + roll * 7.4;
}

export function pickTrick(rand?: number, musicOn = false, lastKind?: HedgehogTrickKind | null): HedgehogTrickKind {
  if (musicOn) return "curl";
  const roll = rand == null ? Math.random() : rand;
  const pool = TRICKS.filter((k) => k !== lastKind);
  const list = pool.length ? pool : TRICKS.slice();
  const weights = list.map((k) =>
    k === "curl" ? 0.72 : k === "snuffle" || k === "trundle" || k === "wheel" ? 1.28 : k === "anoint" || k === "bristle" ? 1.18 : 1.08
  );
  let total = 0;
  for (let i = 0; i < weights.length; i++) total += weights[i];
  let r = roll * total;
  for (let i = 0; i < list.length; i++) {
    r -= weights[i];
    if (r <= 0) return list[i];
  }
  return list[list.length - 1] || "curl";
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
  return key === TRICK_KEY || key === "burr";
}

export function startThankYou(
  key: string | undefined,
  lastKind: HedgehogHappyKind | null | undefined,
  x: number,
  facing: 1 | -1,
  flags?: TrickFlags,
) {
  if (!wantsThankYou(key)) return null;
  if (!happyCanStart(flags || { cmd: "idle" })) return null;
  const pick = pickHappy(lastKind);
  return { happy: beginHappy(pick, x, facing), kind: pick };
}

export function pickHappy(lastKind?: HedgehogHappyKind | null, rand?: number): HedgehogHappyKind {
  const pool = HAPPY.filter((k) => k !== lastKind);
  const list = pool.length ? pool : [...HAPPY];
  const roll = rand == null ? Math.random() : rand;
  return list[Math.floor(roll * list.length)] ?? list[0]!;
}

export function beginHappy(kind: HedgehogHappyKind, x: number, facing: 1 | -1 = 1): HedgehogHappy {
  const name: HedgehogHappyKind = HAPPY.includes(kind) ? kind : "snort";
  return {
    kind: name,
    happy: true,
    phase: "go",
    t: 0,
    x,
    lift: 0,
    rot: 0,
    anim: name === "snort" ? "talk" : name === "soft" ? "sit" : "play",
    facing,
    fromX: x,
  };
}

export function snortPose(t: number) {
  const u = Math.max(0, Math.min(1, t / HAPPY_DUR.snort));
  if (u < 0.16) {
    const s = u / 0.16;
    return { lift: s * 5.0, rot: -s * 14.4, dx: 0, anim: "talk" as const };
  }
  if (u < 0.8) {
    return {
      lift: 5.0 + Math.abs(Math.sin(t * 10)) * 3.8,
      rot: -14.4 + Math.sin(t * 12) * 12,
      dx: Math.sin(t * 8) * 1.9,
      anim: "talk" as const,
    };
  }
  const s = (u - 0.8) / 0.2;
  return { lift: 5.0 * (1 - s), rot: -14.4 * (1 - s), dx: 0, anim: "sit" as const };
}

export function softPose(t: number) {
  const u = Math.max(0, Math.min(1, t / HAPPY_DUR.soft));
  if (u < 0.88) {
    return {
      lift: Math.sin(u * Math.PI) * 4.1,
      rot: 26.4 * (1 - Math.sin(u * Math.PI * 0.5)) + Math.sin(u * Math.PI * 2) * 8.4,
      dx: Math.sin(u * Math.PI) * 2.6,
      anim: "sit" as const,
    };
  }
  return { lift: 0, rot: Math.sin(((u - 0.88) / 0.12) * Math.PI) * 3.6, dx: 0, anim: "idle" as const };
}

export function gruntPose(t: number) {
  return {
    lift: Math.abs(Math.sin(t * 9)) * 6.2,
    rot: Math.sin(t * 11) * 19.2,
    dx: Math.sin(t * 7) * 2.4,
    anim: "play" as const,
  };
}

export function stepHappy(happy: HedgehogHappy, dt: number, flags?: TrickFlags): HedgehogHappy {
  if (!happy || happy.phase === "done") return happy;
  if (happyShouldAbort(flags)) {
    return { ...happy, phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true };
  }
  const next: HedgehogHappy = { ...happy, t: happy.t + Math.max(0, dt) };
  const hold = HAPPY_DUR[next.kind];
  if (next.kind === "snort") {
    const pose = snortPose(next.t);
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "soft") {
    const pose = softPose(next.t);
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else {
    const pose = gruntPose(next.t);
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  }
  if (next.t >= hold) return { ...next, phase: "done", lift: 0, rot: 0, anim: "idle" };
  return next;
}

/** Burr has no Rui-style sleep-frame hold. */
export function sleepHoldFrame(_key: string | undefined, _frameCount?: number) {
  return null;
}

export function beginTrick(kind: HedgehogTrickKind, x: number, facing: 1 | -1 = 1): HedgehogTrick {
  const anim: TrickAnim =
    kind === "curl"
      ? "sit"
      : kind === "snuffle"
        ? "walk"
        : kind === "anoint"
          ? "sit"
          : kind === "bristle"
            ? "sit"
            : kind === "root"
              ? "play"
              : kind === "trundle"
                ? "walk"
                : kind === "wheel"
                  ? "play"
                  : "sit";
  return {
    kind,
    phase: kind === "curl" ? "hold" : "go",
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

/** Curl — guarded pin-cushion ball. Not window-play ball. Not a turtle tuck. Not a cat loaf. */
export function curlPose(t: number) {
  return {
    lift: 1.0 + Math.sin(t * 1.3) * 0.8 + Math.abs(Math.sin(t * 2.4)) * 0.6,
    rot: 33.6 + Math.sin(t * 1.6) * 6 + Math.sin(t * 2.8) * 3.6,
  };
}

/** Soft uncurl — nose peeks; quills ease. Not window-play leave. */
export function releasePose(t: number) {
  const u = Math.max(0, Math.min(1, t / RELEASE_S));
  return { lift: 1.0 * (1 - Math.sin(u * Math.PI * 0.5)), rot: 33.6 * (1 - u) };
}

/** Snuffle — nose-down forage along the wood. Not a dog sniff. Not a rabbit dig. Not a ferret steal. Ethogram hedgehog true. */
export function snufflePose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.snuffle));
  if (u < 0.12) {
    const s = smoothstep(u / 0.12);
    return { x: fromX, lift: -s * 5.0, rot: s * 16.8 * facing, anim: "sit" as const };
  }
  if (u < 0.86) {
    const s = (u - 0.12) / 0.74;
    return {
      x: fromX + facing * (18 * smoothstep(s) + Math.sin(s * Math.PI * 4) * 4.5),
      lift: -5.0 + Math.abs(Math.sin(s * Math.PI * 5)) * 3.8,
      rot: facing * (16.8 + Math.sin(s * Math.PI * 6) * 13.2),
      anim: "walk" as const,
    };
  }
  const s = smoothstep((u - 0.86) / 0.14);
  return {
    x: fromX + facing * 18,
    lift: -5.0 * (1 - s),
    rot: facing * 8.4 * (1 - s),
    anim: "sit" as const,
  };
}

/** Anoint — foam-and-spread self-anoint. Head turns; quills get the foam. Not a cat wash. Not a budgie preen. Not a parrot fan. Ethogram Atelerix true. */
export function anointPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.anoint));
  if (u < 0.14) {
    const s = smoothstep(u / 0.14);
    return { x: fromX, lift: s * 3.8, rot: -s * 33.6 * facing, anim: "sit" as const };
  }
  if (u < 0.45) {
    const s = (u - 0.14) / 0.31;
    return {
      x: fromX + facing * Math.sin(s * Math.PI) * 2.4,
      lift: 3.8 + Math.sin(s * Math.PI * 2) * 2.6,
      rot: facing * (-33.6 + Math.sin(s * Math.PI * 3) * 16.8),
      anim: "sit" as const,
    };
  }
  if (u < 0.86) {
    const s = (u - 0.45) / 0.41;
    return {
      x: fromX,
      lift: 2.9 + Math.abs(Math.sin(s * Math.PI * 4)) * 5.5,
      rot: facing * (21.6 + Math.sin(s * Math.PI * 5) * 31.2),
      anim: "play" as const,
    };
  }
  const s = smoothstep((u - 0.86) / 0.14);
  return {
    x: fromX,
    lift: 2.9 * (1 - s),
    rot: facing * 10.8 * (1 - s),
    anim: "sit" as const,
  };
}

/** Bristle — quills lift; guarded freeze-display. Not a fox stalk. Not a dog wait. Not a cat stretch. */
export function bristlePose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.bristle));
  if (u < 0.18) {
    const s = smoothstep(u / 0.18);
    return { x: fromX, lift: s * 7.0, rot: -s * 19.2, anim: "sit" as const };
  }
  if (u < 0.78) {
    const s = (u - 0.18) / 0.6;
    return {
      x: fromX + facing * Math.sin(s * Math.PI) * 1.6,
      lift: 7.0 + Math.sin(s * Math.PI * 2) * 2.2,
      rot: -19.2 + Math.sin(s * Math.PI * 3) * 10.8,
      anim: "sit" as const,
    };
  }
  const s = smoothstep((u - 0.78) / 0.22);
  return {
    x: fromX,
    lift: 7.0 * (1 - s),
    rot: -9.6 * (1 - s),
    anim: "sit" as const,
  };
}

/** Root — litter-rooting shove with the snout. Not a rabbit dig. Not a hamster pocket. Not a ferret steal. Ethogram insectivore true. */
export function rootPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.root));
  if (u < 0.1) {
    const s = smoothstep(u / 0.1);
    return {
      x: fromX,
      lift: -s * 4.3,
      rot: s * 21.6 * facing,
      anim: "sit" as const,
    };
  }
  if (u < 0.88) {
    const s = (u - 0.1) / 0.78;
    const shove = Math.sin(s * Math.PI * 4.5);
    return {
      x: fromX + facing * (14 * smoothstep(s) + shove * 5.5),
      lift: -4.3 + Math.abs(shove) * 6.0,
      rot: facing * (21.6 + shove * 26.4),
      anim: "play" as const,
    };
  }
  const s = smoothstep((u - 0.88) / 0.12);
  return {
    x: fromX + facing * 14,
    lift: -4.3 * (1 - s),
    rot: facing * 10.8 * (1 - s),
    anim: "sit" as const,
  };
}

/** Trundle — slow rolling Atelerix gait with quill sway. Not a penguin waddle. Not a turtle plod. Not a fox trot. */
export function trundlePose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.trundle));
  if (u < 0.12) {
    const s = smoothstep(u / 0.12);
    return { x: fromX, lift: s * 2.6, rot: -s * 12 * facing, anim: "sit" as const };
  }
  if (u < 0.88) {
    const s = (u - 0.12) / 0.76;
    const bob = Math.sin(s * Math.PI * 5);
    const sway = Math.sin(s * Math.PI * 3);
    return {
      x: fromX + facing * (20 * smoothstep(s)),
      lift: 2.6 + Math.abs(bob) * 4.6,
      rot: facing * (-12 + sway * 19.2 + bob * 9.6),
      anim: "walk" as const,
    };
  }
  const s = smoothstep((u - 0.88) / 0.12);
  return {
    x: fromX + facing * 20,
    lift: 2.6 * (1 - s),
    rot: facing * -6 * (1 - s),
    anim: "sit" as const,
  };
}

/** Wheel — night-run on an imaginary exercise wheel. Not hamster reel. Not guinea zig. Not ferret romp. House-hedgehog true. */
export function wheelPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.wheel));
  if (u < 0.1) {
    const s = smoothstep(u / 0.1);
    return { x: fromX, lift: s * 6.6, rot: -s * 21.6, anim: "sit" as const };
  }
  if (u < 0.88) {
    const s = (u - 0.1) / 0.78;
    const spin = Math.sin(s * Math.PI * 7);
    const hop = Math.abs(Math.sin(s * Math.PI * 5));
    return {
      x: fromX + facing * (Math.sin(s * Math.PI * 2) * 6),
      lift: 6.6 + hop * 14.4,
      rot: -21.6 + spin * 38.4 + facing * hop * 9.6,
      anim: "play" as const,
    };
  }
  const s = smoothstep((u - 0.88) / 0.12);
  return {
    x: fromX,
    lift: 6.6 * (1 - s),
    rot: -10.8 * (1 - s),
    anim: "sit" as const,
  };
}

export function stepTrick(trick: HedgehogTrick, dt: number, flags?: TrickFlags): HedgehogTrick {
  if (!trick || trick.phase === "done") return trick;
  if (shouldAbort(flags) && trick.kind !== "snuffle" && trick.kind !== "root" && trick.kind !== "trundle") {
    return { ...trick, phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true };
  }
  const next: HedgehogTrick = { ...trick, t: trick.t + Math.max(0, dt) };
  if (next.kind === "curl") {
    if (next.t < CURL_HOLD) {
      const pose = curlPose(next.t);
      next.phase = "hold";
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = "sit";
      return next;
    }
    if (next.t < CURL_HOLD + RELEASE_S) {
      const pose = releasePose(next.t - CURL_HOLD);
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
  if (next.kind === "snuffle") {
    const pose = snufflePose(next.t, fromX, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "anoint") {
    const pose = anointPose(next.t, fromX, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "bristle") {
    const pose = bristlePose(next.t, fromX, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "root") {
    const pose = rootPose(next.t, fromX, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "trundle") {
    const pose = trundlePose(next.t, fromX, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else {
    const pose = wheelPose(next.t, fromX, trick.facing);
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
