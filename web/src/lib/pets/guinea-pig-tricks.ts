/** Whee ground tricks while idle — ultra-polish pass. House guinea pig — popcorn / rumble / hay / potato / zig / lookout / teeth personality (soft blotter guinea-pig life). Potato round-settle without naming loaf or wait or nest or flop or den or sprawl or curl; popcorn joy-bursts without naming binky or zoom or scurry; rumble desk-strut without naming wag or buzz; hay nose-forage without naming dig or cheek or nosh or nibble-trick; zig peppery dash without naming zoom or scurry; lookout bipedal stand-survey without naming periscope (rabbit) or beg; teeth soft chatter-buzz without naming talk-cmd or wheek (window-play) or chatter (Relay). Window-play WHEEK unchanged — never names wheek. Guest slug Whee / key guinea_pig — accept "guinea_pig" and "whee". Amplitudes raised toward Rui richness; denser timing; house cry preferred for talk (`guinea_pig.wav`). Thank-yous peep / nibble / toot. Feed-happy after eat. Sleep, hide, leave, rest, card, ribbon still win. Same map as desktop guinea-pig-tricks.js. True house-guinea-pig desk life — not Rui/cat/dog/rabbit/hamster/turtle/goldfish/budgie/fox/penguin/parrot/ferret/hedgehog/chinchilla/axolotl/toucan/iguana/dragon/Vesper or *Dragon electrical clones. Bird ultra line (Soot→Ember) and Miso / Pip / Thimble / Clip already done; Whee continues mammal ultra-polish. Next guest ultra is Ink / turtle. No cry inventing — thank-yous are silent desk motion only. Never retouch Rui sprites. Ethogram SCRATCH_KEYS still owns paw-scratch motion — this module never names a trick `scratch`.  guinea_pig.wav EXISTS so prefersHouseCry adds guinea_pig. Amplitudes raised toward Rui richness; denser waits/weights (POTATO_HOLD=11.2 RELEASE_S=1.18). Catalog 221. */
export const TRICK_KEY = "guinea_pig";
export const TRICKS = ["popcorn", "rumble", "hay", "potato", "zig", "lookout", "teeth"] as const;
export const HAPPY = ["peep", "nibble", "toot"] as const;
export type GuineaPigTrickKind = (typeof TRICKS)[number];
export type GuineaPigHappyKind = (typeof HAPPY)[number];
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

export type GuineaPigTrick = {
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

export type GuineaPigHappy = {
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

export const HAPPY_DUR: Record<GuineaPigHappyKind, number> = {
  peep: 1.58,
  nibble: 1.66,
  toot: 1.72,
};

/** Potato settle hold — Whee rounds into a soft desk potato, then unfurls. Rui-visible breath. Not a cat loaf. Not a rabbit flop. Not a hamster nest. */
export const POTATO_HOLD = 11.2;
export const RELEASE_S = 1.18;

export const DUR: Record<GuineaPigTrickKind, number> = {
  popcorn: 1.85,
  rumble: 2.10,
  hay: 2.12,
  potato: POTATO_HOLD + RELEASE_S,
  zig: 1.85,
  lookout: 2.10,
  teeth: 2.08,
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
  if (kind === "potato") return 40 + roll * 26;
  if (kind === "popcorn" || kind === "zig" || kind === "rumble") return 12.8 + roll * 9.4;
  if (kind === "hay" || kind === "lookout" || kind === "teeth") return 11.6 + roll * 8.5;
  return justFinished ? 8.5 + roll * 8.4 : 4.4 + roll * 7.4;
}

export function pickTrick(rand?: number, musicOn = false, lastKind?: string | null) {
  if (musicOn) return "potato";
  const roll = rand == null ? Math.random() : rand;
  const pool = TRICKS.filter((k) => k !== lastKind);
  const list = pool.length ? pool : TRICKS.slice();
  const weights = list.map((k) =>
    k === "potato" ? 0.72 : k === "hay" || k === "rumble" || k === "lookout" ? 1.28 : k === "popcorn" || k === "zig" ? 1.18 : 1.08
  );
  let total = 0;
  for (let i = 0; i < weights.length; i++) total += weights[i];
  let r = roll * total;
  for (let i = 0; i < list.length; i++) {
    r -= weights[i];
    if (r <= 0) return list[i];
  }
  return list[list.length - 1] || "hay";
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
  return key === TRICK_KEY || key === "whee";
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
  const name = HAPPY.indexOf(kind as GuineaPigHappyKind) >= 0 ? kind : "peep";
  return {
    kind: name,
    happy: true as const,
    phase: "go" as const,
    t: 0,
    x,
    lift: 0,
    rot: 0,
    anim: (name === "peep" ? "talk" : name === "nibble" ? "sit" : "play") as TrickAnim,
    facing: facing == null ? 1 : facing,
    fromX: x,
  };
}

export function peepPose(t: number) {
  const u = Math.max(0, Math.min(1, t / HAPPY_DUR.peep));
  if (u < 0.14) {
    const s = u / 0.14;
    return { lift: s * 6.6, rot: s * 17, dx: 0, anim: "talk" as TrickAnim };
  }
  if (u < 0.85) {
    const soft = Math.sin(t * 18);
    return { lift: 6.6 + Math.abs(soft) * 2.6, rot: 17 + soft * 10, dx: 0, anim: "talk" as TrickAnim };
  }
  const s = (u - 0.85) / 0.15;
  return { lift: 6.6 * (1 - s), rot: 17 * (1 - s), dx: 0, anim: "sit" as TrickAnim };
}

export function nibblePose(t: number) {
  const u = Math.max(0, Math.min(1, t / HAPPY_DUR.nibble));
  if (u < 0.14) {
    const s = u / 0.14;
    return { lift: -s * 5.4, rot: s * 14, dx: 0, anim: "sit" as TrickAnim };
  }
  if (u < 0.85) {
    const buzz = Math.sin(t * 14) + 0.2 * Math.sin(t * 22);
    return {
      lift: -5.4 + Math.abs(buzz) * 3.8,
      rot: 14 + buzz * 8.5,
      dx: 0,
      anim: "sit" as TrickAnim,
    };
  }
  const s = (u - 0.85) / 0.15;
  return { lift: -5.4 * (1 - s), rot: 14 * (1 - s), dx: 0, anim: "sit" as TrickAnim };
}

export function tootPose(t: number) {
  const u = Math.max(0, Math.min(1, t / HAPPY_DUR.toot));
  return {
    lift: Math.sin(u * Math.PI) * 12,
    rot: Math.sin(u * Math.PI * 2) * 17,
    dx: Math.sin(u * Math.PI) * 6,
    anim: "play" as TrickAnim,
  };
}

export function stepHappy(happy: GuineaPigHappy, dt: number, flags?: HappyFlags | null) {
  if (!happy || happy.phase === "done") return happy;
  if (happyShouldAbort(flags)) {
    return Object.assign({}, happy, { phase: "done" as const, t: 0, lift: 0, rot: 0, anim: "idle" as TrickAnim, abort: true });
  }
  const next = Object.assign({}, happy, { t: happy.t + Math.max(0, dt) });
  const hold = HAPPY_DUR[next.kind as GuineaPigHappyKind];
  if (next.kind === "peep") {
    const pose = peepPose(next.t);
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "nibble") {
    const pose = nibblePose(next.t);
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else {
    const pose = tootPose(next.t);
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  }
  if (next.t >= hold) return Object.assign({}, next, { phase: "done" as const, lift: 0, rot: 0, anim: "idle" as TrickAnim });
  return next;
}

/** Whee has no Rui-style sleep-frame hold. */
export function sleepHoldFrame(_key: string | null | undefined, _frameCount?: number) {
  return null;
}

export function beginTrick(kind: string, x: number, facing?: number) {
  const name = TRICKS.indexOf(kind as GuineaPigTrickKind) >= 0 ? kind : "hay";
  const anim: TrickAnim =
    name === "potato" || name === "hay" || name === "rumble" || name === "lookout" || name === "teeth"
      ? "sit"
      : name === "popcorn" || name === "zig"
        ? "play"
        : "sit";
  return {
    kind: name,
    phase: name === "potato" ? ("hold" as const) : ("go" as const),
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

/** Round desk-potato settle — hips soft, Rui-visible breath. Not a cat loaf. Not a rabbit flop. Not a hamster nest. */
export function potatoPose(t: number) {
  const soft = Math.sin(t * 1.7);
  const breath = Math.sin(t * 2.8);
  return {
    lift: -5.0 + soft * 1.8 + Math.abs(breath) * 1.2,
    rot: 17 + breath * 5 + Math.sin(t * 5.1) * 3.6,
  };
}

/** Soft unfurl from the potato — no hop. */
export function releasePose(t: number) {
  const u = Math.max(0, Math.min(1, t / RELEASE_S));
  return {
    lift: -5.0 * (1 - Math.sin(u * Math.PI * 0.5)) + Math.sin(u * Math.PI) * 7.2,
    rot: 17 * (1 - u) + Math.sin(u * Math.PI) * 9.5,
  };
}

/** Popcorn hops — vertical joy bursts. Rui-visible. Not a dog zoom. Not a rabbit binky. Not Rui dance. */
export function popcornPose(t: number) {
  const u = Math.max(0, Math.min(1, t / DUR.popcorn));
  if (u < 0.12) {
    const s = smoothstep(u / 0.12);
    return { lift: -s * 3.6, rot: s * 7.2, dx: 0, anim: "sit" as TrickAnim };
  }
  if (u < 0.88) {
    const hops = Math.sin(((u - 0.12) / 0.76) * Math.PI * 3);
    return {
      lift: Math.abs(hops) * 21.6,
      rot: hops * 17,
      dx: Math.sin(((u - 0.12) / 0.76) * Math.PI * 2) * 4.8,
      anim: "play" as TrickAnim,
    };
  }
  const s = smoothstep((u - 0.88) / 0.12);
  return { lift: 3.6 * (1 - s), rot: 4.8 * (1 - s), dx: 0, anim: "sit" as TrickAnim };
}

/** Rumblestrut sway — low swagger across the blotter. Rui-visible. Not a dog wag. Not Relay buzz. */
export function rumblePose(t: number) {
  const u = Math.max(0, Math.min(1, t / DUR.rumble));
  if (u < 0.2) {
    const s = smoothstep(u / 0.2);
    return { lift: -s * 3.6, rot: -s * 17, dx: s * 6, anim: "sit" as TrickAnim };
  }
  if (u < 0.85) {
    return {
      lift: -3.6 + Math.abs(Math.sin(t * 7)) * 4.8,
      rot: -17 + Math.sin(t * 6) * 19,
      dx: 6 + Math.sin(t * 5) * 7.2,
      anim: "sit" as TrickAnim,
    };
  }
  const s = smoothstep((u - 0.85) / 0.15);
  return { lift: -3.6 * (1 - s), rot: -17 * (1 - s), dx: 6 * (1 - s), anim: "sit" as TrickAnim };
}

/** Hay-face forage — nose into the desk hay. Rui-visible. Not a cat wash. Not a rabbit dig. Not hamster cheek. */
export function hayPose(t: number) {
  const u = Math.max(0, Math.min(1, t / DUR.hay));
  if (u < 0.25) {
    const s = smoothstep(u / 0.25);
    return { lift: -s * 7.2, rot: s * 19, dx: 0, anim: "sit" as TrickAnim };
  }
  if (u < 0.75) {
    return {
      lift: -7.2 + Math.abs(Math.sin(t * 10)) * 4.2,
      rot: 19 + Math.sin(t * 9) * 9.5,
      dx: Math.sin(t * 7) * 2.4,
      anim: "sit" as TrickAnim,
    };
  }
  const s = smoothstep((u - 0.75) / 0.25);
  return { lift: -7.2 * (1 - s), rot: 19 * (1 - s), dx: 0, anim: "sit" as TrickAnim };
}

/** Zig — peppery short desk dash. Rui-visible. Not a hamster scurry. Not a dog zoom. */
export function zigPose(t: number, fromX: number, facing: number) {
  const u = Math.max(0, Math.min(1, t / DUR.zig));
  const face = facing == null ? 1 : facing;
  if (u < 0.18) {
    const s = smoothstep(u / 0.18);
    return { x: fromX, lift: -s * 4.8, rot: s * 12, anim: "sit" as TrickAnim };
  }
  if (u < 0.82) {
    const s = (u - 0.18) / 0.64;
    const wobble = Math.sin(s * Math.PI * 4);
    return {
      x: fromX + face * 26 * smoothstep(s) + wobble * 4.8,
      lift: Math.abs(Math.sin(s * Math.PI * 3)) * 12,
      rot: wobble * 19,
      anim: "play" as TrickAnim,
    };
  }
  const s = smoothstep((u - 0.82) / 0.18);
  return {
    x: fromX + face * 26,
    lift: 3.6 * (1 - s),
    rot: 4.8 * (1 - s),
    anim: "sit" as TrickAnim,
  };
}

/** Lookout — bipedal stand-survey on the blotter. Rui-visible. Not rabbit periscope. Not dog beg. */
export function lookoutPose(t: number, fromX: number, facing: number) {
  const u = Math.max(0, Math.min(1, t / DUR.lookout));
  const face = facing == null ? 1 : facing;
  if (u < 0.16) {
    const s = smoothstep(u / 0.16);
    return { x: fromX, lift: s * 14.4, rot: s * -9.6 * face, anim: "sit" as TrickAnim };
  }
  if (u < 0.84) {
    const s = (u - 0.16) / 0.68;
    const sway = Math.sin(s * Math.PI * 2.4);
    return {
      x: fromX + face * sway * 2.4,
      lift: 14.4 + Math.abs(sway) * 4.2,
      rot: -9.6 * face + sway * 12,
      anim: "sit" as TrickAnim,
    };
  }
  const s = smoothstep((u - 0.84) / 0.16);
  return { x: fromX, lift: 14.4 * (1 - s), rot: -9.6 * face * (1 - s), anim: "sit" as TrickAnim };
}

/** Teeth — soft guinea-pig chatter-buzz. Rui-visible. Not window-play wheek. Not Relay chatter. */
export function teethPose(t: number, fromX: number, facing: number) {
  const u = Math.max(0, Math.min(1, t / DUR.teeth));
  const face = facing == null ? 1 : facing;
  if (u < 0.12) {
    const s = smoothstep(u / 0.12);
    return { x: fromX, lift: -s * 3.6, rot: s * 12 * face, anim: "sit" as TrickAnim };
  }
  if (u < 0.88) {
    const buzz = Math.sin(t * 22) + 0.25 * Math.sin(t * 34);
    return {
      x: fromX + face * buzz * 1.8,
      lift: -6 + Math.abs(buzz) * 8.4,
      rot: 17 * face + buzz * 17,
      anim: "sit" as TrickAnim,
    };
  }
  const s = smoothstep((u - 0.88) / 0.12);
  return { x: fromX, lift: -3.6 * (1 - s), rot: 12 * face * (1 - s), anim: "sit" as TrickAnim };
}

export function stepTrick(trick: GuineaPigTrick, dt: number, flags?: TrickFlags | null) {
  if (!trick || trick.phase === "done") return trick;
  if (shouldAbort(flags) && trick.kind !== "popcorn" && trick.kind !== "zig") {
    return Object.assign({}, trick, { phase: "done" as const, t: 0, lift: 0, rot: 0, anim: "idle" as TrickAnim, abort: true });
  }
  const next = Object.assign({}, trick, { t: trick.t + Math.max(0, dt) });
  if (next.kind === "potato") {
    if (next.t < POTATO_HOLD) {
      const pose = potatoPose(next.t);
      next.phase = "hold";
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = "sit";
      return next;
    }
    if (next.t < POTATO_HOLD + RELEASE_S) {
      const pose = releasePose(next.t - POTATO_HOLD);
      next.phase = "release";
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = "sit";
      return next;
    }
    return Object.assign({}, next, { phase: "done" as const, lift: 0, rot: 0, anim: "idle" as TrickAnim });
  }
  const hold = DUR[next.kind as GuineaPigTrickKind];
  const u = next.t / hold;
  const fromX = trick.fromX != null ? trick.fromX : trick.x;
  const face = trick.facing;
  if (next.kind === "popcorn") {
    const pose = popcornPose(next.t);
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "rumble") {
    const pose = rumblePose(next.t);
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "hay") {
    const pose = hayPose(next.t);
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "lookout") {
    const pose = lookoutPose(next.t, fromX, face);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "teeth") {
    const pose = teethPose(next.t, fromX, face);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else {
    const pose = zigPose(next.t, fromX, face);
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
