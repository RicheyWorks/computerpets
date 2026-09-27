/** Keel ground tricks while idle — ultra-polish pass. House Ramphastos toucan desk-colony life — roost / berry / juggle / peer / skip / rattle / clatter personality (roost bill-keel wood rest without naming nest or loaf or perch or den or tuck, berry fruit tip-inspect without naming crack or gulp or seedhammer or nibble or chew, juggle fruit toss-catch on the blotter without naming toss or flash or porpoise or zoom, peer bill tip under the blotter edge without naming tilt or stalk or listen or glare, skip hop-skips across the grain without naming zoom or bound or waddle or hopwalk or rockhop, rattle rapid bill-rattle social without naming croak or chatter or trumpet or carol or squawk, clatter bill wood-clatter taps without naming bill or billtap or tap or drum or knock; window-play TOSS leaves toucan alone — never name a trick toss; Soot/Wedge/Heart/Hook/Dee/Brick/Drake/Vee/Drum/Sip/Echo/Peck/Quill own their tricks; guest slug Keel / key toucan — accept "toucan" and "keel"; do NOT name a trick toucan or keel or toss or bill or flash or fan or quote or strut or crack or preen or pineye or invert or rockhop or ecstatic). Amplitudes raised toward Rui richness; denser timing; house cry preferred for talk. Thank-yous clack / yelp / tok. Feed-happy after eat. Sleep, hide, leave, rest, card, ribbon still win. Same map as desktop toucan-tricks.js. Window-play TOSS unchanged (already present — not thin). True toucan desk life — not parrot/penguin/budgie/hummingbird/woodpecker/goose/mallard/robin/chickadee/hawk/owl/crow/raven clones. Ember owns the next bird ultra seat. No cry inventing — thank-yous are silent desk motion only. Never retouch Rui sprites.  toucan.wav EXISTS so prefersHouseCry adds toucan. Amplitudes raised toward Rui richness; denser waits/weights (ROOST_HOLD=11.2 RELEASE_S=1.18). Catalog 221. */
export const TRICK_KEY = "toucan";
export const TRICKS = ["roost", "berry", "juggle", "peer", "skip", "rattle", "clatter"] as const;
export const HAPPY = ["clack", "yelp", "tok"] as const;
export type ToucanTrickKind = (typeof TRICKS)[number];
export type ToucanHappyKind = (typeof HAPPY)[number];
export type TrickAnim = "idle" | "walk" | "sit" | "sleep" | "talk" | "play";
export type TrickPhase = "go" | "hold" | "release" | "done";
export type HappyPhase = "go" | "done";
export type TrickFlags = {
  asleep?: boolean;
  hidden?: boolean;
  leaving?: boolean;
  windowPlay?: boolean;
  card?: boolean;
  cmd?: string;
};
export type HappyFlags = {
  asleep?: boolean;
  hidden?: boolean;
  leaving?: boolean;
  cmd?: string;
};
export type ToucanTrick = {
  kind: string;
  phase: TrickPhase;
  t: number;
  x: number;
  lift: number;
  rot: number;
  anim: TrickAnim;
  facing: number;
  fromX: number;
  abort?: boolean;
};
export type ToucanHappy = {
  kind: string;
  happy: true;
  phase: HappyPhase;
  t: number;
  x: number;
  lift: number;
  rot: number;
  dx?: number;
  anim: TrickAnim;
  facing: number;
  fromX: number;
  abort?: boolean;
};
export const HAPPY_DUR: Record<ToucanHappyKind, number> = { clack: 1.58, yelp: 1.66, tok: 1.72 };
export const ROOST_HOLD = 11.2;
export const RELEASE_S = 1.18;
export const DUR: Record<ToucanTrickKind, number> = {
  roost: ROOST_HOLD + RELEASE_S,
  berry: 2.36,
  juggle: 2.44,
  peer: 2.28,
  skip: 2.40,
  rattle: 2.32,
  clatter: 2.38,
};

export function canStart(state: TrickFlags | null | undefined) {
  if (!state) return false;
  if (state.asleep || state.hidden || state.leaving || state.windowPlay || state.card) return false;
  const cmd = String(state.cmd || "");
  if (cmd === "sleep" || cmd === "leave" || cmd === "hide" || cmd === "rest") return false;
  if (cmd === "seek" || cmd === "eat" || cmd === "play" || cmd === "talk" || cmd === "enter") return false;
  return true;
}

export function shouldAbort(state: TrickFlags | null | undefined) {
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

export function nextTrickWait(justFinished: boolean, rand?: number, kind?: string) {
  const roll = rand == null ? Math.random() : rand;
  if (kind === "roost") return 40 + roll * 26;
  if (kind === "berry" || kind === "juggle" || kind === "skip") return 12.8 + roll * 9.4;
  if (kind === "peer" || kind === "rattle" || kind === "clatter") return 11.6 + roll * 8.5;
  return justFinished ? 8.5 + roll * 8.4 : 4.4 + roll * 7.4;
}

export function pickTrick(rand?: number, musicOn = false, lastKind?: string | null) {
  if (musicOn) return "roost";
  const roll = rand == null ? Math.random() : rand;
  const pool = TRICKS.filter((k) => k !== lastKind);
  const list = pool.length ? pool : TRICKS.slice();
  const weights = list.map((k) =>
    k === "roost" ? 0.72 : k === "berry" || k === "juggle" || k === "skip" ? 1.28 : k === "peer" || k === "rattle" ? 1.18 : 1.08
  );
  let total = 0;
  for (let i = 0; i < weights.length; i++) total += weights[i];
  let r = roll * total;
  for (let i = 0; i < list.length; i++) {
    r -= weights[i];
    if (r <= 0) return list[i];
  }
  return list[list.length - 1] || "berry";
}

export function happyCanStart(state: HappyFlags | null | undefined) {
  if (!state) return false;
  if (state.asleep || state.hidden || state.leaving) return false;
  const cmd = String(state.cmd || "");
  if (cmd === "sleep" || cmd === "leave" || cmd === "hide" || cmd === "rest") return false;
  if (cmd === "seek" || cmd === "play" || cmd === "talk" || cmd === "enter") return false;
  return true;
}

export function happyShouldAbort(state: HappyFlags | null | undefined) {
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

export function wantsThankYou(key: string | null | undefined) {
  return key === TRICK_KEY || key === "keel";
}

export function startThankYou(key: string | null | undefined, lastKind: string | null | undefined, x: number, facing: number, flags?: HappyFlags | null) {
  if (!wantsThankYou(key)) return null;
  if (!happyCanStart(flags || { cmd: "idle" })) return null;
  const pick = pickHappy(lastKind);
  return { happy: beginHappy(pick, x, facing), kind: pick };
}

export function pickHappy(lastKind?: string | null, rand?: number) {
  const pool = HAPPY.filter((k) => k !== lastKind);
  const list = pool.length ? pool : HAPPY.slice();
  const roll = rand == null ? Math.random() : rand;
  return list[Math.floor(roll * list.length)] || list[0];
}

export function beginHappy(kind: string, x: number, facing?: number) {
  const name = HAPPY.indexOf(kind as ToucanHappyKind) >= 0 ? kind : "clack";
  return {
    kind: name,
    happy: true as const,
    phase: "go" as const,
    t: 0,
    x,
    lift: 0,
    rot: 0,
    anim: (name === "clack" ? "sit" : name === "yelp" ? "talk" : "play") as TrickAnim,
    facing: facing == null ? 1 : facing,
    fromX: x,
  };
}

export function clackPose(t: number) {
  const u = Math.max(0, Math.min(1, t / HAPPY_DUR.clack));
  if (u < 0.14) {
    const s = u / 0.14;
    return { lift: s * 6.0, rot: s * 16.8, dx: 0, anim: "sit" as TrickAnim };
  }
  if (u < 0.82) {
    const snap = Math.sin(t * 16) + 0.24 * Math.sin(t * 28);
    return {
      lift: 6.0 + Math.abs(snap) * 4.2,
      rot: 16.8 + snap * 14.4,
      dx: snap * 1.7,
      anim: "sit" as TrickAnim,
    };
  }
  const s = (u - 0.82) / 0.18;
  return { lift: 4.2 * (1 - s), rot: 9.6 * (1 - s), dx: 0, anim: "idle" as TrickAnim };
}

export function yelpPose(t: number) {
  const u = Math.max(0, Math.min(1, t / HAPPY_DUR.yelp));
  if (u < 0.12) {
    const s = u / 0.12;
    return { lift: s * 7.2, rot: -s * 16.8, dx: 0, anim: "talk" as TrickAnim };
  }
  if (u < 0.84) {
    const cry = Math.sin(t * 10) + 0.26 * Math.sin(t * 18);
    return {
      lift: 7.2 + Math.abs(cry) * 4.8,
      rot: -16.8 + cry * 10.8,
      dx: cry * 2.2,
      anim: "talk" as TrickAnim,
    };
  }
  const s = (u - 0.84) / 0.16;
  return { lift: 4.8 * (1 - s), rot: -9.6 * (1 - s), dx: 0, anim: "sit" as TrickAnim };
}

export function tokPose(t: number) {
  const u = Math.max(0, Math.min(1, t / HAPPY_DUR.tok));
  return {
    lift: 4.8 + Math.abs(Math.sin(t * 8)) * 6.0,
    rot: Math.sin(t * 11) * 19.2,
    dx: Math.sin(t * 7) * 2.9,
    anim: "play" as TrickAnim,
  };
}

export function stepHappy(happy: ToucanHappy | null | undefined, dt: number, flags?: HappyFlags | null) {
  if (!happy || happy.phase === "done") return happy;
  if (happyShouldAbort(flags)) {
    return Object.assign({}, happy, { phase: "done" as const, t: 0, lift: 0, rot: 0, anim: "idle" as TrickAnim, abort: true });
  }
  const next = Object.assign({}, happy, { t: happy.t + Math.max(0, dt) });
  const hold = HAPPY_DUR[next.kind as ToucanHappyKind];
  const pose =
    next.kind === "clack" ? clackPose(next.t) : next.kind === "yelp" ? yelpPose(next.t) : tokPose(next.t);
  next.lift = pose.lift;
  next.rot = pose.rot;
  next.dx = pose.dx;
  next.anim = pose.anim;
  if (next.t >= hold) return Object.assign({}, next, { phase: "done" as const, lift: 0, rot: 0, anim: "idle" as TrickAnim });
  return next;
}

export function sleepHoldFrame(_key: string, _frameCount?: number) {
  return null;
}

export function beginTrick(kind: string, x: number, facing?: number) {
  const anim =
    kind === "roost"
      ? ("sit" as TrickAnim)
      : kind === "berry" || kind === "peer" || kind === "clatter"
        ? ("sit" as TrickAnim)
        : kind === "juggle" || kind === "rattle"
          ? ("play" as TrickAnim)
          : kind === "skip"
            ? ("walk" as TrickAnim)
            : ("sit" as TrickAnim);
  return {
    kind,
    phase: kind === "roost" ? ("hold" as const) : ("go" as const),
    t: 0,
    x,
    lift: 0,
    rot: 0,
    anim,
    facing: facing == null ? 1 : facing,
    fromX: x,
  };
}

export function smoothstep(t: number) {
  const x = Math.max(0, Math.min(1, t));
  return x * x * (3 - 2 * x);
}

export function roostPose(t: number) {
  const soft = Math.sin(t * 1.6);
  const breath = Math.sin(t * 2.6);
  return { lift: 5.4 + soft * 3.8 + Math.abs(breath) * 1.9, rot: 31.2 + breath * 6 + Math.sin(t * 4.8) * 6 };
}

export function releasePose(t: number) {
  const u = Math.max(0, Math.min(1, t / RELEASE_S));
  return { lift: 5.4 * (1 - Math.sin(u * Math.PI * 0.5)), rot: 31.2 * (1 - u) };
}

export function berryPose(t: number, fromX: number, facing: number) {
  const u = Math.max(0, Math.min(1, t / DUR.berry));
  const face = facing == null ? 1 : facing;
  if (u < 0.12) {
    const s = smoothstep(u / 0.12);
    return { x: fromX, lift: -s * 5.4, rot: s * 21.6 * face, anim: "sit" as TrickAnim };
  }
  if (u < 0.86) {
    const s = (u - 0.12) / 0.74;
    const tip = Math.sin(s * Math.PI * 3.2);
    return {
      x: fromX + face * Math.sin(s * Math.PI) * 2.9,
      lift: -5.4 + Math.abs(tip) * 6.6,
      rot: face * (21.6 + tip * 16.8),
      anim: "sit" as TrickAnim,
    };
  }
  const s = smoothstep((u - 0.86) / 0.14);
  return {
    x: fromX,
    lift: -3.6 * (1 - s) * 0.2,
    rot: face * 9.6 * (1 - s),
    anim: "sit" as TrickAnim,
  };
}

export function jugglePose(t: number, fromX: number, facing: number) {
  const u = Math.max(0, Math.min(1, t / DUR.juggle));
  const face = facing == null ? 1 : facing;
  if (u < 0.1) {
    const s = smoothstep(u / 0.1);
    return { x: fromX, lift: s * 4.8, rot: -s * 14.4 * face, anim: "sit" as TrickAnim };
  }
  if (u < 0.9) {
    const s = (u - 0.1) / 0.8;
    const toss = Math.abs(Math.sin(s * Math.PI * 4.5));
    return {
      x: fromX + face * Math.sin(s * Math.PI * 2.2) * 3.4,
      lift: 4.8 + toss * 10.8,
      rot: face * (-14.4 + toss * 26.4),
      anim: "play" as TrickAnim,
    };
  }
  const s = smoothstep((u - 0.9) / 0.1);
  return {
    x: fromX,
    lift: 3.6 * (1 - s),
    rot: face * -7.2 * (1 - s),
    anim: "sit" as TrickAnim,
  };
}

export function peerPose(t: number, fromX: number, facing: number) {
  const u = Math.max(0, Math.min(1, t / DUR.peer));
  const face = facing == null ? 1 : facing;
  if (u < 0.14) {
    const s = smoothstep(u / 0.14);
    return { x: fromX, lift: s * 4.8, rot: s * 38.4 * face, anim: "sit" as TrickAnim };
  }
  if (u < 0.84) {
    const s = (u - 0.14) / 0.7;
    return {
      x: fromX + face * Math.sin(s * Math.PI) * 1.7,
      lift: 4.8 + Math.sin(s * Math.PI * 1.8) * 2.6,
      rot: face * (38.4 + Math.sin(s * Math.PI * 2.2) * 12),
      anim: "sit" as TrickAnim,
    };
  }
  const s = smoothstep((u - 0.84) / 0.16);
  return {
    x: fromX,
    lift: 3.6 * (1 - s),
    rot: face * 16.8 * (1 - s),
    anim: "sit" as TrickAnim,
  };
}

export function skipPose(t: number, fromX: number, facing: number) {
  const u = Math.max(0, Math.min(1, t / DUR.skip));
  const face = facing == null ? 1 : facing;
  if (u < 0.08) {
    const s = smoothstep(u / 0.08);
    return { x: fromX, lift: s * 4.2, rot: -s * 9.6 * face, anim: "sit" as TrickAnim };
  }
  if (u < 0.9) {
    const s = (u - 0.08) / 0.82;
    const hop = Math.abs(Math.sin(s * Math.PI * 3.5));
    return {
      x: fromX + face * (28 * smoothstep(s) + Math.sin(s * Math.PI * 2) * 2.6),
      lift: 4.2 + hop * 10.8,
      rot: face * (-9.6 + hop * 21.6),
      anim: "walk" as TrickAnim,
    };
  }
  const s = smoothstep((u - 0.9) / 0.1);
  return {
    x: fromX + face * 28,
    lift: 3.0 * (1 - s),
    rot: face * -3.6 * (1 - s),
    anim: "sit" as TrickAnim,
  };
}

export function rattlePose(t: number, fromX: number, facing: number) {
  const u = Math.max(0, Math.min(1, t / DUR.rattle));
  const face = facing == null ? 1 : facing;
  if (u < 0.12) {
    const s = smoothstep(u / 0.12);
    return { x: fromX, lift: s * 6.6, rot: -s * 12 * face, anim: "talk" as TrickAnim };
  }
  if (u < 0.88) {
    const ratt = Math.sin(t * 22) + 0.3 * Math.sin(t * 38);
    return {
      x: fromX + face * Math.sin(t * 9) * 1.9,
      lift: 6.6 + Math.abs(ratt) * 4.2,
      rot: face * (-12 + ratt * 24),
      anim: "talk" as TrickAnim,
    };
  }
  const s = smoothstep((u - 0.88) / 0.12);
  return {
    x: fromX,
    lift: 4.2 * (1 - s),
    rot: -6 * (1 - s) * face,
    anim: "sit" as TrickAnim,
  };
}

export function clatterPose(t: number, fromX: number, facing: number) {
  const u = Math.max(0, Math.min(1, t / DUR.clatter));
  const face = facing == null ? 1 : facing;
  if (u < 0.12) {
    const s = smoothstep(u / 0.12);
    return { x: fromX, lift: -s * 4.2, rot: s * 16.8 * face, anim: "sit" as TrickAnim };
  }
  if (u < 0.86) {
    const s = (u - 0.12) / 0.74;
    const knock = Math.sin(s * Math.PI * 7);
    return {
      x: fromX + face * Math.abs(knock) * 2.6,
      lift: -4.2 + Math.abs(knock) * 7.8,
      rot: face * (16.8 + knock * 19.2),
      anim: "sit" as TrickAnim,
    };
  }
  const s = smoothstep((u - 0.86) / 0.14);
  return {
    x: fromX,
    lift: -2.4 * (1 - s),
    rot: face * 7.2 * (1 - s),
    anim: "sit" as TrickAnim,
  };
}

export function stepTrick(trick: ToucanTrick | null | undefined, dt: number, flags?: TrickFlags | null) {
  if (!trick || trick.phase === "done") return trick;
  if (shouldAbort(flags) && trick.kind !== "skip" && trick.kind !== "juggle" && trick.kind !== "rattle") {
    return Object.assign({}, trick, { phase: "done" as const, t: 0, lift: 0, rot: 0, anim: "idle" as TrickAnim, abort: true });
  }
  const next = Object.assign({}, trick, { t: trick.t + Math.max(0, dt) });
  if (next.kind === "roost") {
    if (next.t < ROOST_HOLD) {
      const pose = roostPose(next.t);
      next.phase = "hold";
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = "sit";
      return next;
    }
    if (next.t < ROOST_HOLD + RELEASE_S) {
      const pose = releasePose(next.t - ROOST_HOLD);
      next.phase = "release";
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = "sit";
      return next;
    }
    return Object.assign({}, next, { phase: "done" as const, lift: 0, rot: 0, anim: "idle" as TrickAnim });
  }
  const hold = DUR[next.kind as ToucanTrickKind];
  const u = next.t / hold;
  const fromX = trick.fromX != null ? trick.fromX : trick.x;
  if (next.kind === "berry") {
    const pose = berryPose(next.t, fromX, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "juggle") {
    const pose = jugglePose(next.t, fromX, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "peer") {
    const pose = peerPose(next.t, fromX, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "skip") {
    const pose = skipPose(next.t, fromX, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "rattle") {
    const pose = rattlePose(next.t, fromX, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else {
    const pose = clatterPose(next.t, fromX, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  }
  if (u >= 1) return Object.assign({}, next, { phase: "done" as const, lift: 0, rot: 0, anim: "idle" as TrickAnim });
  return next;
}
