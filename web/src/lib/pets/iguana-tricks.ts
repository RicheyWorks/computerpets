/** Sol ground tricks while idle — ultra-polish pass. House iguana — sun / dewlap / nod / press / flick / sneeze / lash personality (Iguana iguana desk life). Sun thermoregulation sprawl without naming bask/flatten (window-play owns those); dewlap throat-fan without naming fan/frill; nod head-bob signal without naming bob thank-you or budgie bobble; press push-up display without naming zoom; flick tongue-flick chemoreception without naming sniff/gulp; sneeze salt-gland sneeze without naming huff/cough; lash tail-lash warning without naming whip/crack/switch. Window-play FLATTEN unchanged — never names a trick `flatten`. Window-play BASK stays untouched — never names `bask`. Turtle already owns soak/tuck/crane/plod/paddle. Bloom already owns gill/amble/mend/smile/plume/sprout/glop. Keel already owns roost/berry/juggle/peer/skip. Guest slug Sol / key iguana — accept "iguana" and "sol". Amplitudes raised toward Rui richness; denser waits/weights; no house cry invent (no iguana.wav — skip prefersHouseCry). Thank-yous swell / tap / ease. Feed-happy after eat. Sleep, hide, leave, rest, card, ribbon still win. Same map as desktop `iguana-tricks.js`. True house-iguana desk life — not Rui/cat/dog/rabbit/hamster/guinea_pig/turtle/goldfish/budgie/fox/penguin/parrot/ferret/hedgehog/chinchilla/axolotl/toucan/dragon/Vesper clones. Bird ultra (Soot→Ember) + Miso→Bloom done; Echo/budgie + Peck/penguin + Quill/parrot + Keel/toucan skip birds. Next guest ultra is Vesper / dragon (skip Ember if bird). No cry inventing — thank-yous silent desk motion only. Never retouch Rui sprites. */

export const TRICK_KEY = "iguana";
export const TRICKS = ["sun", "dewlap", "nod", "press", "flick", "sneeze", "lash"] as const;
export const HAPPY = ["swell", "tap", "ease"] as const;
export type IguanaTrickKind = (typeof TRICKS)[number];
export type IguanaHappyKind = (typeof HAPPY)[number];
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

export type IguanaTrick = {
  kind: IguanaTrickKind;
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

export type IguanaHappy = {
  kind: IguanaHappyKind;
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

export const HAPPY_DUR: Record<IguanaHappyKind, number> = {
  swell: 1.55,
  tap: 1.62,
  ease: 1.58,
};

/** Sun hold — Sol sprawls under the lamp. Not window-play BASK or FLATTEN. Thermoregulation-true. */
export const SUN_HOLD = 12.8;
export const RELEASE_S = 0.88;

export const DUR: Record<IguanaTrickKind, number> = {
  sun: SUN_HOLD + RELEASE_S,
  dewlap: 1.82,
  nod: 1.76,
  press: 1.88,
  flick: 1.72,
  sneeze: 2.02,
  lash: 2.1,
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

export function nextTrickWait(justFinished: boolean, rand?: number, kind?: IguanaTrickKind) {
  const roll = rand == null ? Math.random() : rand;
  if (kind === "sun") return 38 + roll * 24;
  if (kind === "dewlap" || kind === "nod") return 11 + roll * 8;
  if (kind === "press" || kind === "flick" || kind === "lash") return 10 + roll * 8;
  if (kind === "sneeze") return 12 + roll * 9;
  return justFinished ? 8 + roll * 8 : 4 + roll * 7;
}

export function pickTrick(rand?: number, musicOn = false, lastKind?: IguanaTrickKind | null): IguanaTrickKind {
  if (musicOn) return "sun";
  const roll = rand == null ? Math.random() : rand;
  const pool = TRICKS.filter((k) => k !== lastKind);
  const list = pool.length ? pool : TRICKS.slice();
  const weights = list.map((k) =>
    k === "sun" ? 0.55 : k === "dewlap" || k === "sneeze" || k === "press" ? 1.15 : 1
  );
  let total = 0;
  for (let i = 0; i < weights.length; i++) total += weights[i]!;
  let r = roll * total;
  for (let i = 0; i < list.length; i++) {
    r -= weights[i]!;
    if (r <= 0) return list[i]!;
  }
  return list[list.length - 1] || "sun";
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
  return key === TRICK_KEY || key === "sol";
}

export function startThankYou(
  key: string | undefined,
  lastKind: IguanaHappyKind | null | undefined,
  x: number,
  facing: 1 | -1,
  flags?: TrickFlags,
) {
  if (!wantsThankYou(key)) return null;
  if (!happyCanStart(flags || { cmd: "idle" })) return null;
  const pick = pickHappy(lastKind);
  return { happy: beginHappy(pick, x, facing), kind: pick };
}

export function pickHappy(lastKind?: IguanaHappyKind | null, rand?: number): IguanaHappyKind {
  const pool = HAPPY.filter((k) => k !== lastKind);
  const list = pool.length ? pool : [...HAPPY];
  const roll = rand == null ? Math.random() : rand;
  return list[Math.floor(roll * list.length)] ?? list[0]!;
}

export function beginHappy(kind: IguanaHappyKind, x: number, facing: 1 | -1 = 1): IguanaHappy {
  const name: IguanaHappyKind = HAPPY.includes(kind) ? kind : "swell";
  return {
    kind: name,
    happy: true,
    phase: "go",
    t: 0,
    x,
    lift: 0,
    rot: 0,
    anim: name === "swell" ? "sit" : name === "tap" ? "talk" : "play",
    facing,
    fromX: x,
  };
}

export function swellPose(t: number) {
  const u = Math.max(0, Math.min(1, t / HAPPY_DUR.swell));
  if (u < 0.18) {
    const s = u / 0.18;
    return { lift: s * 4.4, rot: s * 14, dx: 0, anim: "sit" as const };
  }
  if (u < 0.78) {
    return {
      lift: 4.4 + Math.abs(Math.sin(t * 5.2)) * 2.6,
      rot: 14 + Math.sin(t * 4.4) * 10,
      dx: 0,
      anim: "sit" as const,
    };
  }
  const s = (u - 0.78) / 0.22;
  return { lift: 4.4 * (1 - s), rot: 14 * (1 - s), dx: 0, anim: "idle" as const };
}

export function tapPose(t: number) {
  const u = Math.max(0, Math.min(1, t / HAPPY_DUR.tap));
  if (u < 0.12) {
    const s = u / 0.12;
    return { lift: s * 5.6, rot: -s * 16, dx: 0, anim: "talk" as const };
  }
  if (u < 0.86) {
    return {
      lift: 5.6 + Math.abs(Math.sin(t * 10)) * 3.2,
      rot: -16 + Math.sin(t * 12) * 18,
      dx: Math.sin(t * 6) * 1.2,
      anim: "talk" as const,
    };
  }
  const s = (u - 0.86) / 0.14;
  return { lift: 5.6 * (1 - s), rot: -16 * (1 - s), dx: 0, anim: "sit" as const };
}

export function easePose(t: number) {
  return {
    lift: Math.abs(Math.sin(t * 3.4)) * 3.8 + 1.2,
    rot: Math.sin(t * 3.0) * 12,
    dx: Math.sin(t * 2.4) * 1.4,
    anim: "play" as const,
  };
}

export function stepHappy(happy: IguanaHappy, dt: number, flags?: TrickFlags): IguanaHappy {
  if (!happy || happy.phase === "done") return happy;
  if (happyShouldAbort(flags)) {
    return { ...happy, phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true };
  }
  const next: IguanaHappy = { ...happy, t: happy.t + Math.max(0, dt) };
  const hold = HAPPY_DUR[next.kind];
  if (next.kind === "swell") {
    const pose = swellPose(next.t);
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "tap") {
    const pose = tapPose(next.t);
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else {
    const pose = easePose(next.t);
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  }
  if (next.t >= hold) return { ...next, phase: "done", lift: 0, rot: 0, anim: "idle" };
  return next;
}

/** Sol has no Rui-style sleep-frame hold. */
export function sleepHoldFrame(_key: string | undefined, _frameCount?: number) {
  return null;
}

export function beginTrick(kind: IguanaTrickKind, x: number, facing: 1 | -1 = 1): IguanaTrick {
  const anim: TrickAnim =
    kind === "sun"
      ? "sit"
      : kind === "dewlap"
        ? "sit"
        : kind === "nod"
          ? "talk"
          : kind === "press"
            ? "play"
            : kind === "flick"
              ? "sit"
              : kind === "sneeze"
                ? "sit"
                : kind === "lash"
                  ? "play"
                  : "sit";
  return {
    kind,
    phase: kind === "sun" ? "hold" : "go",
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

/** Sun — lamp sprawl thermoregulation on the blotter. Not window-play BASK or FLATTEN. Ethogram Iguana iguana true. */
export function sunPose(t: number) {
  return {
    lift: 2.2 + Math.sin(t * 1.7) * 2.8 + Math.abs(Math.sin(t * 3.4)) * 1.6,
    rot: 18 + Math.sin(t * 2.4) * 22 + Math.sin(t * 4.6) * 12,
  };
}

/** Soft lift — Sol leaves the lamp sprawl; stays on the desk. Not window-play leave. */
export function releasePose(t: number) {
  const u = Math.max(0, Math.min(1, t / RELEASE_S));
  return { lift: (2.2 + 2.8) * (1 - Math.sin(u * Math.PI * 0.5)), rot: 18 * (1 - u) };
}

/** Dewlap — throat fan extends on the blotter. Not a parrot fan. Not window-play FLATTEN. Ethogram dewlap true. */
export function dewlapPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.dewlap));
  if (u < 0.14) {
    const s = smoothstep(u / 0.14);
    return { x: fromX, lift: s * 4.6, rot: s * 18 * facing, anim: "sit" as const };
  }
  if (u < 0.86) {
    const s = (u - 0.14) / 0.72;
    return {
      x: fromX + facing * Math.sin(s * Math.PI) * 1.6,
      lift: 4.6 + Math.abs(Math.sin(s * Math.PI * 2.4)) * 4.2,
      rot: facing * (18 + Math.sin(s * Math.PI * 2.8) * 16),
      anim: "sit" as const,
    };
  }
  const s = smoothstep((u - 0.86) / 0.14);
  return {
    x: fromX,
    lift: 4.6 * (1 - s),
    rot: facing * 9 * (1 - s),
    anim: "sit" as const,
  };
}

/** Nod — head-bob signal on the grain. Not turtle bob thank-you. Not budgie bobble. Ethogram head-bob true. */
export function nodPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.nod));
  if (u < 0.1) {
    const s = smoothstep(u / 0.1);
    return { x: fromX, lift: s * 3.4, rot: -s * 14 * facing, anim: "talk" as const };
  }
  if (u < 0.9) {
    const s = (u - 0.1) / 0.8;
    const bob = Math.sin(s * Math.PI * 5.2);
    return {
      x: fromX + facing * Math.sin(s * Math.PI) * 1.2,
      lift: 3.4 + Math.abs(bob) * 7.5,
      rot: facing * (-14 + bob * 28),
      anim: "talk" as const,
    };
  }
  const s = smoothstep((u - 0.9) / 0.1);
  return {
    x: fromX,
    lift: 3.4 * (1 - s),
    rot: facing * -7 * (1 - s),
    anim: "sit" as const,
  };
}

/** Press — push-up display on the desk. Not a dog zoom. Not window-play FLATTEN. Ethogram push-up true. */
export function pressPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.press));
  if (u < 0.1) {
    const s = smoothstep(u / 0.1);
    return { x: fromX, lift: s * 4.8, rot: -s * 10 * facing, anim: "sit" as const };
  }
  if (u < 0.9) {
    const s = (u - 0.1) / 0.8;
    const pump = Math.abs(Math.sin(s * Math.PI * 3.8));
    return {
      x: fromX + facing * Math.sin(s * Math.PI * 1.5) * 2.2,
      lift: 4.8 + pump * 9.2,
      rot: facing * (-10 + pump * 18),
      anim: "play" as const,
    };
  }
  const s = smoothstep((u - 0.9) / 0.1);
  return {
    x: fromX,
    lift: 4.8 * (1 - s),
    rot: facing * -5 * (1 - s),
    anim: "sit" as const,
  };
}

/** Flick — tongue-flick chemoreception along the blotter edge. Not a dog sniff. Not a goldfish gulp. Ethogram tongue-flick true. */
export function flickPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.flick));
  if (u < 0.16) {
    const s = smoothstep(u / 0.16);
    return { x: fromX, lift: -s * 3.8, rot: s * 22 * facing, anim: "sit" as const };
  }
  if (u < 0.84) {
    const s = (u - 0.16) / 0.68;
    const tick = Math.abs(Math.sin(s * Math.PI * 4.4));
    return {
      x: fromX + facing * (6.5 * smoothstep(s) + tick * 1.8),
      lift: -3.8 + tick * 5.5,
      rot: facing * (22 + tick * 14),
      anim: "sit" as const,
    };
  }
  const s = smoothstep((u - 0.84) / 0.16);
  return {
    x: fromX + facing * 6.5,
    lift: -3.8 * (1 - s),
    rot: facing * 11 * (1 - s),
    anim: "sit" as const,
  };
}

/** Sneeze — salt-gland sneeze clears the nose on the desk. Not a ferret huff. Not a dog pant. Ethogram sneeze_soft. */
export function sneezePose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.sneeze));
  if (u < 0.14) {
    const s = smoothstep(u / 0.14);
    return { x: fromX, lift: s * 3.6, rot: -s * 12 * facing, anim: "sit" as const };
  }
  if (u < 0.88) {
    const s = (u - 0.14) / 0.74;
    const burst = Math.sin(s * Math.PI * 4.6);
    return {
      x: fromX + facing * Math.abs(burst) * 2.4,
      lift: 3.6 + Math.abs(burst) * 8.8,
      rot: facing * (-12 + burst * 26),
      anim: "sit" as const,
    };
  }
  const s = smoothstep((u - 0.88) / 0.12);
  return {
    x: fromX,
    lift: 3.6 * (1 - s),
    rot: facing * -6 * (1 - s),
    anim: "sit" as const,
  };
}

/** Lash — tail-lash warning arc across the grain. Not a parrot crack. Not fuse switch. Not vinegaroon whip. Ethogram lash_soft. */
export function lashPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.lash));
  if (u < 0.12) {
    const s = smoothstep(u / 0.12);
    return { x: fromX, lift: s * 2.8, rot: s * 16 * facing, anim: "sit" as const };
  }
  if (u < 0.88) {
    const s = (u - 0.12) / 0.76;
    const swing = Math.sin(s * Math.PI * 3.6);
    return {
      x: fromX + facing * swing * 8.5,
      lift: 2.8 + Math.abs(swing) * 7.2,
      rot: facing * (16 + swing * 32),
      anim: "play" as const,
    };
  }
  const s = smoothstep((u - 0.88) / 0.12);
  return {
    x: fromX,
    lift: 2.8 * (1 - s),
    rot: facing * 8 * (1 - s),
    anim: "sit" as const,
  };
}

export function stepTrick(trick: IguanaTrick, dt: number, flags?: TrickFlags): IguanaTrick {
  if (!trick || trick.phase === "done") return trick;
  if (shouldAbort(flags) && trick.kind !== "press" && trick.kind !== "flick" && trick.kind !== "lash") {
    return { ...trick, phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true };
  }
  const next: IguanaTrick = { ...trick, t: trick.t + Math.max(0, dt) };
  if (next.kind === "sun") {
    if (next.t < SUN_HOLD) {
      const pose = sunPose(next.t);
      next.phase = "hold";
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = "sit";
      return next;
    }
    if (next.t < SUN_HOLD + RELEASE_S) {
      const pose = releasePose(next.t - SUN_HOLD);
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
  if (next.kind === "dewlap") {
    const pose = dewlapPose(next.t, fromX, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "nod") {
    const pose = nodPose(next.t, fromX, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "press") {
    const pose = pressPose(next.t, fromX, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "flick") {
    const pose = flickPose(next.t, fromX, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "sneeze") {
    const pose = sneezePose(next.t, fromX, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else {
    const pose = lashPose(next.t, fromX, trick.facing);
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
