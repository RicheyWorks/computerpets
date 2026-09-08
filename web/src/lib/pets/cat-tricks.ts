/** Miso ground tricks while idle — ultra-polish pass. House cat — loaf / knead / stretch / wash / pounce / bunting / mlem personality (cream-loaf desk cat life). Loaf tuck-and-breathe without naming nest or den or sprawl or curl; knead biscuit-press without naming scratch (SCRATCH_KEYS owns paw-scratch) or dig; stretch long-front settle without naming yawn ethogram alone; wash face-wipe without naming groom ethogram alone or mlem; pounce short spring without naming hunt or somersault or zoom; bunting head-scent greet without naming nuzzle (Rue) or rub or scent (skunk) or bonk; mlem tongue-flick taste without naming wash or groom or lick as a trick kind. Window-play LEDGE unchanged — never names `ledge`. Guest slug Miso / key cat — accept "cat" and "miso". Amplitudes raised toward Rui richness; denser timing; house cry preferred for talk (`cat.wav`). Thank-yous purr / blink / chirp. Feed-happy after eat. Sleep, hide, leave, rest, card, ribbon still win. Same map as desktop cat-tricks.js. True house-cat desk life — not Rui/dog/rabbit/hamster/guinea-pig/turtle/goldfish/budgie/fox/penguin/parrot/ferret/hedgehog/chinchilla/axolotl/toucan/iguana/dragon/Vesper or *Dragon electrical clones. Bird ultra line (Soot→Ember) already done; Miso opens mammal ultra-polish. Next guest ultra is Pip / dog. No cry inventing — thank-yous are silent desk motion only. Never retouch Rui sprites. */
export const TRICK_KEY = "cat";
export const TRICKS = ["loaf", "knead", "stretch", "wash", "pounce", "bunting", "mlem"] as const;
export const HAPPY = ["purr", "blink", "chirp"] as const;
export type CatTrickKind = (typeof TRICKS)[number];
export type CatHappyKind = (typeof HAPPY)[number];
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

export type HappyFlags = {
  asleep?: boolean;
  hidden?: boolean;
  leaving?: boolean;
  cmd?: string;
};

export type CatTrick = {
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

export type CatHappy = {
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

export const HAPPY_DUR: Record<CatHappyKind, number> = {
  purr: 1.58,
  blink: 1.66,
  chirp: 1.72,
};

/** Loaf hold — Miso tucks into a cream loaf and breathes, then soft-unloafs. Not an earth lug. Not a phoenix cinder. */
export const LOAF_HOLD = 14.4;
export const RELEASE_S = 1.02;

export const DUR: Record<CatTrickKind, number> = {
  loaf: LOAF_HOLD + RELEASE_S,
  knead: 2.22,
  stretch: 2.28,
  wash: 2.20,
  pounce: 1.85,
  bunting: 2.10,
  mlem: 1.95,
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
  if (kind === "loaf") return 42 + roll * 28;
  if (kind === "pounce") return 12 + roll * 9;
  if (kind === "bunting" || kind === "mlem") return 11 + roll * 8;
  if (kind === "knead" || kind === "wash") return 11 + roll * 8;
  if (kind === "stretch") return 10 + roll * 8;
  return justFinished ? 8 + roll * 8 : 4 + roll * 7;
}

export function pickTrick(rand?: number, musicOn = false, lastKind?: string | null) {
  if (musicOn) return "loaf";
  const roll = rand == null ? Math.random() : rand;
  const pool = TRICKS.filter((k) => k !== lastKind);
  const list = pool.length ? pool : TRICKS.slice();
  const weights = list.map((k) =>
    k === "loaf" ? 0.55 : k === "knead" || k === "wash" || k === "bunting" ? 1.15 : 1
  );
  let total = 0;
  for (let i = 0; i < weights.length; i++) total += weights[i];
  let r = roll * total;
  for (let i = 0; i < list.length; i++) {
    r -= weights[i];
    if (r <= 0) return list[i];
  }
  return list[list.length - 1] || "knead";
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
  return key === TRICK_KEY || key === "miso";
}

export function startThankYou(
  key: string | null | undefined,
  lastKind: string | null | undefined,
  x: number,
  facing: number,
  flags?: HappyFlags | null,
) {
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
  const name = HAPPY.indexOf(kind as CatHappyKind) >= 0 ? kind : "purr";
  return {
    kind: name,
    happy: true as const,
    phase: "go" as const,
    t: 0,
    x,
    lift: 0,
    rot: 0,
    anim: (name === "blink" ? "sit" : name === "purr" ? "talk" : "play") as TrickAnim,
    facing: facing == null ? 1 : facing,
    fromX: x,
  };
}

export function purrPose(t: number) {
  const u = Math.max(0, Math.min(1, t / HAPPY_DUR.purr));
  if (u < 0.14) {
    const s = u / 0.14;
    return { lift: s * 4.5, rot: s * 12, dx: 0, anim: "talk" as TrickAnim };
  }
  if (u < 0.85) {
    const buzz = Math.sin(t * 18) + 0.2 * Math.sin(t * 28);
    return {
      lift: 4.5 + Math.abs(buzz) * 3.2,
      rot: 10 + buzz * 9,
      dx: buzz * 0.8,
      anim: "talk" as TrickAnim,
    };
  }
  const s = (u - 0.85) / 0.15;
  return { lift: 4.5 * (1 - s), rot: Math.sin(s * Math.PI) * 4, dx: 0, anim: "sit" as TrickAnim };
}

export function blinkPose(t: number) {
  const u = Math.max(0, Math.min(1, t / HAPPY_DUR.blink));
  if (u < 0.28) {
    const s = u / 0.28;
    return { lift: -s * 5.5, rot: s * 14, dx: 0, anim: "sit" as TrickAnim };
  }
  if (u < 0.72) {
    const soft = Math.sin(t * 6);
    return { lift: -5.5 + soft * 1.2, rot: 14 + soft * 4, dx: 0, anim: "sit" as TrickAnim };
  }
  const s = (u - 0.72) / 0.28;
  return { lift: -5.5 * (1 - s), rot: 14 * (1 - s), dx: 0, anim: "sit" as TrickAnim };
}

export function chirpPose(t: number) {
  const u = Math.max(0, Math.min(1, t / HAPPY_DUR.chirp));
  return {
    lift: Math.sin(u * Math.PI) * 12,
    rot: Math.sin(u * Math.PI * 2) * 14,
    dx: Math.sin(u * Math.PI) * 3.5,
    anim: "play" as TrickAnim,
  };
}

export function stepHappy(happy: CatHappy, dt: number, flags?: HappyFlags | null): CatHappy {
  if (!happy || happy.phase === "done") return happy;
  if (happyShouldAbort(flags)) {
    return Object.assign({}, happy, { phase: "done" as const, t: 0, lift: 0, rot: 0, anim: "idle" as TrickAnim, abort: true });
  }
  const next = Object.assign({}, happy, { t: happy.t + Math.max(0, dt) });
  const hold = HAPPY_DUR[next.kind as CatHappyKind];
  if (next.kind === "purr") {
    const pose = purrPose(next.t);
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "blink") {
    const pose = blinkPose(next.t);
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else {
    const pose = chirpPose(next.t);
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  }
  if (next.t >= hold) return Object.assign({}, next, { phase: "done" as const, lift: 0, rot: 0, anim: "idle" as TrickAnim });
  return next;
}

/** Miso has no Rui-style sleep-frame hold. */
export function sleepHoldFrame(_key: string | undefined, _frameCount?: number) {
  return null;
}

export function beginTrick(kind: string, x: number, facing?: number): CatTrick {
  const name = TRICKS.indexOf(kind as CatTrickKind) >= 0 ? kind : "loaf";
  const anim: TrickAnim =
    name === "loaf" || name === "knead" || name === "wash" || name === "stretch" || name === "bunting" || name === "mlem"
      ? "sit"
      : name === "pounce"
        ? "play"
        : "sit";
  return {
    kind: name,
    phase: name === "loaf" ? ("hold" as const) : ("go" as const),
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

/** Tuck into a cream loaf with visible breath — paws under, round sit. Rui-visible sway. */
export function loafPose(t: number) {
  const soft = Math.sin(t * 1.7);
  const breath = Math.sin(t * 2.8);
  return {
    lift: -4.6 + soft * 1.6 + Math.abs(breath) * 1.1,
    rot: 14 + breath * 6 + Math.sin(t * 5.1) * 4,
  };
}

/** Soft unloaf — stand from the tuck with a visible lift. */
export function releasePose(t: number) {
  const u = Math.max(0, Math.min(1, t / RELEASE_S));
  return {
    lift: -4.6 * (1 - Math.sin(u * Math.PI * 0.5)) + Math.sin(u * Math.PI) * 6,
    rot: 14 * (1 - u) + Math.sin(u * Math.PI) * 8,
  };
}

/** Biscuit knead — soft rhythmic press. Rui-visible. Not Rui's scratch. Not ethogram paw-scratch. */
export function kneadPose(t: number) {
  const press = Math.abs(Math.sin(t * 10));
  return {
    lift: -1.2 + press * 10.5,
    rot: Math.sin(t * 9) * 16,
    dx: 0,
    anim: "sit" as TrickAnim,
  };
}

/** Long house-cat stretch — front long, then settle. Rui-visible. */
export function stretchPose(t: number) {
  const u = Math.max(0, Math.min(1, t / DUR.stretch));
  if (u < 0.28) {
    const s = smoothstep(u / 0.28);
    return { lift: -s * 4, rot: -s * 18, dx: s * 4, anim: "sit" as TrickAnim };
  }
  if (u < 0.72) {
    const s = (u - 0.28) / 0.44;
    return {
      lift: -4 + Math.sin(s * Math.PI) * 5,
      rot: -18 + Math.sin(s * Math.PI) * 8,
      dx: 4,
      anim: "sit" as TrickAnim,
    };
  }
  const s = smoothstep((u - 0.72) / 0.28);
  return { lift: -4 * (1 - s), rot: -18 * (1 - s), dx: 4 * (1 - s), anim: "sit" as TrickAnim };
}

/** Face wash — sit and wipe. Rui-visible. Not a dragon hum. Not mlem. */
export function washPose(t: number) {
  return {
    lift: -1.5 + Math.abs(Math.sin(t * 8)) * 5.5,
    rot: Math.sin(t * 11) * 20,
    dx: 0,
    anim: "sit" as TrickAnim,
  };
}

/** Pounce-adjacent — crouch, then a short spring. Rui-visible. Not Rui's somersault. Not a hunt. */
export function pouncePose(t: number, fromX: number, facing: number) {
  const u = Math.max(0, Math.min(1, t / DUR.pounce));
  const face = facing == null ? 1 : facing;
  if (u < 0.24) {
    const s = smoothstep(u / 0.24);
    return { x: fromX, lift: -s * 6, rot: s * 12, anim: "sit" as TrickAnim };
  }
  if (u < 0.7) {
    const s = (u - 0.24) / 0.46;
    return {
      x: fromX + face * 28 * smoothstep(s),
      lift: Math.sin(s * Math.PI) * 18,
      rot: Math.sin(s * Math.PI) * -14,
      anim: "play" as TrickAnim,
    };
  }
  const s = smoothstep((u - 0.7) / 0.3);
  return {
    x: fromX + face * 28,
    lift: 3 * (1 - s),
    rot: -5 * (1 - s),
    anim: "sit" as TrickAnim,
  };
}

/** Bunting — head-scent greet press. Not nuzzle (Rue). Not rub/scent skunk moves. */
export function buntingPose(t: number, fromX: number, facing: number) {
  const u = Math.max(0, Math.min(1, t / DUR.bunting));
  const face = facing == null ? 1 : facing;
  if (u < 0.16) {
    const s = smoothstep(u / 0.16);
    return { x: fromX, lift: s * 5, rot: s * 18 * face, anim: "sit" as TrickAnim };
  }
  if (u < 0.84) {
    const s = (u - 0.16) / 0.68;
    const press = Math.sin(s * Math.PI * 2.2);
    return {
      x: fromX + face * (3 + press * 4),
      lift: 5 + Math.abs(press) * 4.5,
      rot: (16 + press * 10) * face,
      anim: "sit" as TrickAnim,
    };
  }
  const s = smoothstep((u - 0.84) / 0.16);
  return { x: fromX, lift: 5 * (1 - s), rot: 16 * face * (1 - s), anim: "sit" as TrickAnim };
}

/** Mlem — tongue-flick taste. Not wash face-wipe. Not ethogram groom. */
export function mlemPose(t: number, fromX: number, facing: number) {
  const u = Math.max(0, Math.min(1, t / DUR.mlem));
  const face = facing == null ? 1 : facing;
  if (u < 0.12) {
    const s = smoothstep(u / 0.12);
    return { x: fromX, lift: s * 3.5, rot: -s * 10 * face, anim: "sit" as TrickAnim };
  }
  if (u < 0.88) {
    const s = (u - 0.12) / 0.76;
    const flick = Math.sin(s * Math.PI * 5);
    return {
      x: fromX + face * flick * 1.5,
      lift: 3.5 + Math.abs(flick) * 5,
      rot: (-8 + flick * 14) * face,
      anim: "sit" as TrickAnim,
    };
  }
  const s = smoothstep((u - 0.88) / 0.12);
  return { x: fromX, lift: 3.5 * (1 - s), rot: -8 * face * (1 - s), anim: "sit" as TrickAnim };
}

export function stepTrick(trick: CatTrick, dt: number, flags?: TrickFlags | null): CatTrick {
  if (!trick || trick.phase === "done") return trick;
  if (shouldAbort(flags) && trick.kind !== "pounce") {
    return Object.assign({}, trick, { phase: "done" as const, t: 0, lift: 0, rot: 0, anim: "idle" as TrickAnim, abort: true });
  }
  const next = Object.assign({}, trick, { t: trick.t + Math.max(0, dt) });
  if (next.kind === "loaf") {
    if (next.t < LOAF_HOLD) {
      const pose = loafPose(next.t);
      next.phase = "hold";
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = "sit";
      return next;
    }
    if (next.t < LOAF_HOLD + RELEASE_S) {
      const pose = releasePose(next.t - LOAF_HOLD);
      next.phase = "release";
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = "sit";
      return next;
    }
    return Object.assign({}, next, { phase: "done" as const, lift: 0, rot: 0, anim: "idle" as TrickAnim });
  }
  const hold = DUR[next.kind as CatTrickKind];
  const u = next.t / hold;
  const fromX = trick.fromX != null ? trick.fromX : trick.x;
  const face = trick.facing;
  if (next.kind === "knead") {
    const pose = kneadPose(next.t);
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "stretch") {
    const pose = stretchPose(next.t);
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "wash") {
    const pose = washPose(next.t);
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "bunting") {
    const pose = buntingPose(next.t, fromX, face);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "mlem") {
    const pose = mlemPose(next.t, fromX, face);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else {
    const pose = pouncePose(next.t, fromX, face);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  }
  if (u >= 1) {
    return Object.assign({}, next, { phase: "done" as const, lift: 0, rot: 0, anim: "idle" as TrickAnim });
  }
  return next;
}
