/** Peck ground tricks while idle — ultra-polish pass. House Aptenodytes desk-colony life — huddle / toboggan / waddle / porpoise / trumpet / rockhop / ecstatic personality (huddle formal heat-ball without naming loaf or nest or den or bed or potato, toboggan belly-slide without naming soak or paddle or drift or gulp or bellyflop, waddle side-to-side walk without naming plod or zig or scurry or sidle or hopwalk, porpoise porpoising leap without naming dart or zoom or tumble or flap or leapbreach, trumpet ecstatic-call stretch without naming honk or bray or quack or carol or keeyer, rockhop bounce-hop without naming hop or binky or popcorn or zoom or prance, ecstatic flipper-ecstatic display without naming fan or flash or strut or triumph or chinstrap; window-play BOW leaves penguin alone — never name a trick bow; Soot/Wedge/Heart/Hook/Dee/Brick/Drake/Vee/Drum/Sip/Echo own their tricks; guest slug Peck / key penguin — accept "penguin" and "peck"; do NOT name a trick penguin or peck or bow or preen or paddle or quote or crack). Amplitudes raised toward Rui richness; denser timing; house cry preferred for talk. Thank-yous bray / beak / shimmy. Feed-happy after eat. Sleep, hide, leave, rest, card, ribbon still win. Same map as desktop penguin-tricks.js. Window-play BOW unchanged. True penguin desk life — not budgie/hummingbird/woodpecker/goose/mallard/robin/chickadee/hawk/owl/crow/raven/parrot clones. Brood owns the next leftover. No cry inventing — thank-yous are silent desk motion only; prefersHouseCry via penguin.wav. Amplitudes raised toward Rui richness; denser waits/weights (HUDDLE_HOLD=11.2 RELEASE_S=1.18). Ethogram softs + freeze — never names penguin/peck/bow/loaf as bare ethogram-only trick kinds. Window-play BOW unchanged. Next leftover Brood / cicada. Catalog 221. Never retouch Rui sprites. */
export const TRICK_KEY = "penguin";
export const TRICKS = ["huddle", "toboggan", "waddle", "porpoise", "trumpet", "rockhop", "ecstatic"] as const;
export const HAPPY = ["bray", "beak", "shimmy"] as const;
export type PenguinTrickKind = (typeof TRICKS)[number];
export type PenguinHappyKind = (typeof HAPPY)[number];
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
export type PenguinTrick = {
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
export type PenguinHappy = {
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
export const HAPPY_DUR: Record<PenguinHappyKind, number> = { bray: 1.64, beak: 1.72, shimmy: 1.58 };
export const HUDDLE_HOLD = 11.2;
export const RELEASE_S = 1.18;
export const DUR: Record<PenguinTrickKind, number> = {
  huddle: HUDDLE_HOLD + RELEASE_S,
  toboggan: 2.40,
  waddle: 2.52,
  porpoise: 2.28,
  trumpet: 2.36,
  rockhop: 2.44,
  ecstatic: 2.50,
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
  if (kind === "huddle") return 40 + roll * 26;
  if (kind === "toboggan" || kind === "waddle" || kind === "porpoise" || kind === "trumpet" || kind === "rockhop" || kind === "ecstatic") return 12.8 + roll * 9.4;
  return justFinished ? 8.5 + roll * 8.4 : 4.4 + roll * 7.4;
}

export function pickTrick(rand?: number, musicOn = false, lastKind?: string | null) {
  if (musicOn) return "huddle";
  const roll = rand == null ? Math.random() : rand;
  const pool = TRICKS.filter((k) => k !== lastKind);
  const list = pool.length ? pool : TRICKS.slice();
  const weights = list.map((k) =>
    k === "huddle" ? 0.72 : k === "waddle" || k === "trumpet" ? 1.28 : k === "ecstatic" ? 1.18 : 1.08
  );
  let total = 0;
  for (let i = 0; i < weights.length; i++) total += weights[i];
  let r = roll * total;
  for (let i = 0; i < list.length; i++) {
    r -= weights[i];
    if (r <= 0) return list[i];
  }
  return list[list.length - 1] || "waddle";
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
  return key === TRICK_KEY || key === "peck";
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
  const name = HAPPY.indexOf(kind as PenguinHappyKind) >= 0 ? kind : "bray";
  return {
    kind: name,
    happy: true as const,
    phase: "go" as const,
    t: 0,
    x,
    lift: 0,
    rot: 0,
    anim: (name === "bray" ? "talk" : name === "shimmy" ? "play" : "sit") as TrickAnim,
    facing: facing == null ? 1 : facing,
    fromX: x,
  };
}

export function brayPose(t: number) {
  const u = Math.max(0, Math.min(1, t / HAPPY_DUR.bray));
  if (u < 0.14) {
    const s = u / 0.14;
    return { lift: s * 7.2, rot: -s * 14.4, dx: 0, anim: "talk" as TrickAnim };
  }
  if (u < 0.82) {
    const phrase = Math.sin(t * 10) + 0.26 * Math.sin(t * 18);
    return {
      lift: 7.2 + Math.abs(phrase) * 4.8,
      rot: -14.4 + phrase * 9.6,
      dx: phrase * 1.92,
      anim: "talk" as TrickAnim,
    };
  }
  const s = (u - 0.82) / 0.18;
  return { lift: 4.8 * (1 - s), rot: -7.2 * (1 - s), dx: 0, anim: "sit" as TrickAnim };
}

export function beakPose(t: number) {
  const u = Math.max(0, Math.min(1, t / HAPPY_DUR.beak));
  return {
    lift: 4.8 + Math.sin(u * Math.PI) * 6,
    rot: Math.sin(u * Math.PI * 3) * 16.8,
    dx: Math.sin(u * Math.PI) * 3.84,
    anim: "sit" as TrickAnim,
  };
}

export function shimmyPose(t: number) {
  const u = Math.max(0, Math.min(1, t / HAPPY_DUR.shimmy));
  if (u < 0.88) {
    const buzz = Math.sin(t * 14) + 0.22 * Math.sin(t * 26);
    return {
      lift: 4.8 + Math.abs(buzz) * 6,
      rot: buzz * 16.8,
      dx: Math.sin(t * 11) * 2.88,
      anim: "play" as TrickAnim,
    };
  }
  return { lift: 0, rot: Math.sin(((u - 0.88) / 0.12) * Math.PI) * 4.8, dx: 0, anim: "idle" as TrickAnim };
}

export function stepHappy(happy: PenguinHappy | null | undefined, dt: number, flags?: HappyFlags | null) {
  if (!happy || happy.phase === "done") return happy;
  if (happyShouldAbort(flags)) {
    return Object.assign({}, happy, { phase: "done" as const, t: 0, lift: 0, rot: 0, anim: "idle" as TrickAnim, abort: true });
  }
  const next = Object.assign({}, happy, { t: happy.t + Math.max(0, dt) });
  const hold = HAPPY_DUR[next.kind as PenguinHappyKind];
  const pose =
    next.kind === "bray" ? brayPose(next.t) : next.kind === "beak" ? beakPose(next.t) : shimmyPose(next.t);
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
    kind === "huddle" || kind === "ecstatic"
      ? ("sit" as TrickAnim)
      : kind === "toboggan" || kind === "porpoise" || kind === "rockhop"
        ? ("play" as TrickAnim)
        : kind === "waddle"
          ? ("walk" as TrickAnim)
          : kind === "trumpet"
            ? ("talk" as TrickAnim)
            : ("sit" as TrickAnim);
  return {
    kind,
    phase: kind === "huddle" ? ("hold" as const) : ("go" as const),
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

export function huddlePose(t: number) {
  const soft = Math.sin(t * 1.5);
  const breath = Math.sin(t * 2.8);
  return { lift: 3.6 + soft * 4.8 + Math.abs(breath) * 1.8, rot: 14.4 + breath * 9.6 + Math.sin(t * 2.1) * 6 };
}

export function releasePose(t: number) {
  const u = Math.max(0, Math.min(1, t / RELEASE_S));
  return { lift: 4.8 * (1 - Math.sin(u * Math.PI * 0.5)), rot: 14.4 * (1 - u) };
}

export function tobogganPose(t: number, fromX: number, facing: number) {
  const u = Math.max(0, Math.min(1, t / DUR.toboggan));
  const face = facing == null ? 1 : facing;
  if (u < 0.14) {
    const s = smoothstep(u / 0.14);
    return { x: fromX, lift: -s * 6, rot: s * 33.6 * face, anim: "sit" as TrickAnim };
  }
  if (u < 0.82) {
    const s = (u - 0.14) / 0.68;
    return {
      x: fromX + face * 43.2 * smoothstep(s),
      lift: -6 + Math.sin(s * Math.PI) * 3,
      rot: face * (33.6 - s * 9.6),
      anim: "play" as TrickAnim,
    };
  }
  const s = smoothstep((u - 0.82) / 0.18);
  return {
    x: fromX + face * 43.2,
    lift: -6 * (1 - s),
    rot: face * 19.2 * (1 - s),
    anim: "sit" as TrickAnim,
  };
}

export function waddlePose(t: number, fromX: number, facing: number) {
  const u = Math.max(0, Math.min(1, t / DUR.waddle));
  const face = facing == null ? 1 : facing;
  if (u < 0.1) {
    const s = smoothstep(u / 0.1);
    return { x: fromX, lift: s * 4.8, rot: s * 14.4 * face, anim: "sit" as TrickAnim };
  }
  if (u < 0.88) {
    const s = (u - 0.1) / 0.78;
    const step = Math.sin(s * Math.PI * 5);
    return {
      x: fromX + face * 26.4 * smoothstep(s),
      lift: 4.8 + Math.abs(step) * 6,
      rot: face * (14.4 + step * 16.8),
      anim: "walk" as TrickAnim,
    };
  }
  const s = smoothstep((u - 0.88) / 0.12);
  return {
    x: fromX + face * 26.4,
    lift: 3.6 * (1 - s),
    rot: face * 7.2 * (1 - s),
    anim: "sit" as TrickAnim,
  };
}

export function porpoisePose(t: number, fromX: number, facing: number) {
  const u = Math.max(0, Math.min(1, t / DUR.porpoise));
  const face = facing == null ? 1 : facing;
  if (u < 0.12) {
    const s = smoothstep(u / 0.12);
    return { x: fromX, lift: s * 4.8, rot: -s * 12, anim: "sit" as TrickAnim };
  }
  if (u < 0.88) {
    const s = (u - 0.12) / 0.76;
    const arc = Math.sin(s * Math.PI * 2.5);
    return {
      x: fromX + face * 38.4 * smoothstep(s),
      lift: 4.8 + Math.max(0, arc) * 19.2,
      rot: face * (arc * 26.4),
      anim: "play" as TrickAnim,
    };
  }
  const s = smoothstep((u - 0.88) / 0.12);
  return {
    x: fromX + face * 38.4,
    lift: 3.6 * (1 - s),
    rot: face * 7.2 * (1 - s),
    anim: "sit" as TrickAnim,
  };
}

export function trumpetPose(t: number, fromX: number, facing: number) {
  const u = Math.max(0, Math.min(1, t / DUR.trumpet));
  const face = facing == null ? 1 : facing;
  if (u < 0.16) {
    const s = smoothstep(u / 0.16);
    return { x: fromX, lift: s * 9.6, rot: -s * 19.2, anim: "talk" as TrickAnim };
  }
  if (u < 0.82) {
    const call = Math.sin(t * 9) + 0.24 * Math.sin(t * 17);
    return {
      x: fromX + face * Math.sin(t * 7) * 2.64,
      lift: 9.6 + Math.abs(call) * 6,
      rot: -19.2 + call * 12,
      anim: "talk" as TrickAnim,
    };
  }
  const s = smoothstep((u - 0.82) / 0.18);
  return {
    x: fromX,
    lift: 6 * (1 - s),
    rot: -9.6 * (1 - s),
    anim: "sit" as TrickAnim,
  };
}

export function rockhopPose(t: number, fromX: number, facing: number) {
  const u = Math.max(0, Math.min(1, t / DUR.rockhop));
  const face = facing == null ? 1 : facing;
  if (u < 0.12) {
    const s = smoothstep(u / 0.12);
    return { x: fromX, lift: s * 6, rot: s * -7.2 * face, anim: "sit" as TrickAnim };
  }
  if (u < 0.88) {
    const s = (u - 0.12) / 0.76;
    const hop = Math.abs(Math.sin(s * Math.PI * 4));
    return {
      x: fromX + face * 31.2 * smoothstep(s),
      lift: 6 + hop * 12,
      rot: face * (-7.2 + Math.sin(s * Math.PI * 4) * 16.8),
      anim: "play" as TrickAnim,
    };
  }
  const s = smoothstep((u - 0.88) / 0.12);
  return {
    x: fromX + face * 31.2,
    lift: 3.6 * (1 - s),
    rot: -3.6 * (1 - s) * face,
    anim: "idle" as TrickAnim,
  };
}

export function ecstaticPose(t: number, fromX: number, facing: number) {
  const u = Math.max(0, Math.min(1, t / DUR.ecstatic));
  const face = facing == null ? 1 : facing;
  if (u < 0.14) {
    const s = smoothstep(u / 0.14);
    return { x: fromX, lift: s * 10.8, rot: s * 21.6 * face, anim: "talk" as TrickAnim };
  }
  if (u < 0.86) {
    const flap = Math.sin(t * 12) + 0.2 * Math.sin(t * 24);
    return {
      x: fromX + face * Math.sin(t * 6) * 3,
      lift: 10.8 + Math.abs(flap) * 6,
      rot: (21.6 + flap * 14.4) * face,
      anim: "play" as TrickAnim,
    };
  }
  const s = smoothstep((u - 0.86) / 0.14);
  return {
    x: fromX,
    lift: 6 * (1 - s),
    rot: 9.6 * (1 - s) * face,
    anim: "idle" as TrickAnim,
  };
}

export function stepTrick(trick: PenguinTrick | null | undefined, dt: number, flags?: TrickFlags | null) {
  if (!trick || trick.phase === "done") return trick;
  if (shouldAbort(flags) && trick.kind !== "toboggan" && trick.kind !== "porpoise" && trick.kind !== "rockhop") {
    return Object.assign({}, trick, { phase: "done" as const, t: 0, lift: 0, rot: 0, anim: "idle" as TrickAnim, abort: true });
  }
  const next = Object.assign({}, trick, { t: trick.t + Math.max(0, dt) });
  if (next.kind === "huddle") {
    if (next.t < HUDDLE_HOLD) {
      const pose = huddlePose(next.t);
      next.phase = "hold";
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = "sit";
      return next;
    }
    if (next.t < HUDDLE_HOLD + RELEASE_S) {
      const pose = releasePose(next.t - HUDDLE_HOLD);
      next.phase = "release";
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = "sit";
      return next;
    }
    return Object.assign({}, next, { phase: "done" as const, lift: 0, rot: 0, anim: "idle" as TrickAnim });
  }
  const hold = DUR[next.kind as PenguinTrickKind];
  const u = next.t / hold;
  const fromX = trick.fromX != null ? trick.fromX : trick.x;
  if (next.kind === "toboggan") {
    const pose = tobogganPose(next.t, fromX, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "waddle") {
    const pose = waddlePose(next.t, fromX, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "porpoise") {
    const pose = porpoisePose(next.t, fromX, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "trumpet") {
    const pose = trumpetPose(next.t, fromX, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "rockhop") {
    const pose = rockhopPose(next.t, fromX, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else {
    const pose = ecstaticPose(next.t, fromX, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  }
  if (u >= 1) return Object.assign({}, next, { phase: "done" as const, lift: 0, rot: 0, anim: "idle" as TrickAnim });
  return next;
}
