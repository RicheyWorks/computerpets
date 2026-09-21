/** Ember ground tricks while idle — ultra-polish pass. House phoenix — cinder / blaze / shed / lift / return / reignite / hearth personality (ash-and-return firebird desk life). Cinder banked-coal nestle without naming ash or kindle or bask or loaf or nest or den or tuck or perch; blaze gold-throat brightening without naming flare or spark or warm or glow or smolder or flash; shed shake flight-feather ash-flakes without naming ash or preen or fluff or anoint; lift almost-take-wing rise without naming soar or kindle or dance or zoom; return leave-a-little-come-back-kinder without naming fold or claim or reborn; reignite cool-then-catch-fire-again without naming kindle or spark or crackle or bank or flare; hearth settle as desk-hearth warmth without naming bask or sun or coil or drape or sprawl or loaf. Window-play KINDLE unchanged — never names `kindle`. Floss owns ash; Vesper owns sprawl/guard/smolder/claim/fold/thrum/glow/incline; Sol owns sun; Axolotl owns plume; Ferret guest Wick; Soot→Keel bird ultras done — Ember closes the bird ultra-polish line. Guest slug Ember / key phoenix — accept "phoenix" and "ember". Amplitudes raised toward Rui richness; denser timing; house cry preferred for talk (`phoenix.wav`). Thank-yous shine / dip / settle. Feed-happy after eat. Sleep, hide, leave, rest, card, ribbon still win. Same map as desktop phoenix-tricks.js. True phoenix desk life — not Rui/cat/dog/rabbit/hamster/guinea-pig/turtle/goldfish/budgie/fox/penguin/parrot/ferret/hedgehog/chinchilla/axolotl/toucan/iguana/dragon/Vesper or *Dragon electrical clones. Bird ultra-polish line complete after this pass (Soot→Ember). Loom still next for base idle-ground; Nori densified. prefersHouseCry via phoenix.wav. Amplitudes raised toward Rui richness; denser waits/weights (CINDER_HOLD=11.2 RELEASE_S=1.18). Saffron densified. Bandit densified. Jade densified. Bluff densified. Sash densified. Lula densified. Coral densified. Blush densified. Atlas densified. Cup densified. Sepia densified. Chamber densified. Next leftover Pulse / moon_jelly. Catalog 221. Never retouch Rui sprites. */

export const TRICK_KEY = "phoenix";
export const TRICKS = ["cinder", "blaze", "shed", "lift", "return", "reignite", "hearth"] as const;
export const HAPPY = ["shine", "dip", "settle"] as const;
export type PhoenixTrickKind = (typeof TRICKS)[number];
export type PhoenixHappyKind = (typeof HAPPY)[number];
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

export type PhoenixTrick = {
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

export type PhoenixHappy = {
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

export const HAPPY_DUR: Record<PhoenixHappyKind, number> = {
  shine: 1.58,
  dip: 1.66,
  settle: 1.72,
};

/** Cinder hold — Ember banks as a coal on the desk ash. Not window-play KINDLE. Not Floss ash-bath. */
export const CINDER_HOLD = 11.2;
export const RELEASE_S = 1.18;

export const DUR: Record<PhoenixTrickKind, number> = {
  cinder: CINDER_HOLD + RELEASE_S,
  blaze: 2.36,
  shed: 2.28,
  lift: 2.44,
  return: 2.32,
  reignite: 2.40,
  hearth: 2.34,
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
  if (kind === "cinder") return 40 + roll * 26;
  if (kind === "blaze" || kind === "shed" || kind === "reignite") return 12.8 + roll * 9.4;
  if (kind === "lift" || kind === "return" || kind === "hearth") return 11.6 + roll * 8.5;
  return justFinished ? 8.5 + roll * 8.4 : 4.4 + roll * 7.4;
}

export function pickTrick(rand?: number, musicOn = false, lastKind?: string | null) {
  if (musicOn) return "cinder";
  const roll = rand == null ? Math.random() : rand;
  const pool = TRICKS.filter((k) => k !== lastKind);
  const list = pool.length ? pool : TRICKS.slice();
  const weights = list.map((k) =>
    k === "cinder" ? 0.72 : k === "blaze" || k === "shed" || k === "reignite" ? 1.28 : k === "lift" || k === "return" ? 1.18 : 1.08
  );
  let total = 0;
  for (let i = 0; i < weights.length; i++) total += weights[i];
  let r = roll * total;
  for (let i = 0; i < list.length; i++) {
    r -= weights[i];
    if (r <= 0) return list[i];
  }
  return list[list.length - 1] || "blaze";
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
  return key === TRICK_KEY || key === "ember";
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
  const name = HAPPY.indexOf(kind as PhoenixHappyKind) >= 0 ? kind : "shine";
  return {
    kind: name,
    happy: true as const,
    phase: "go" as const,
    t: 0,
    x,
    lift: 0,
    rot: 0,
    anim: (name === "shine" ? "sit" : name === "dip" ? "sit" : "talk") as TrickAnim,
    facing: facing == null ? 1 : facing,
    fromX: x,
  };
}

export function shinePose(t: number) {
  const u = Math.max(0, Math.min(1, t / HAPPY_DUR.shine));
  if (u < 0.14) {
    const s = u / 0.14;
    return { lift: s * 6, rot: s * 16.8, dx: 0, anim: "sit" as TrickAnim };
  }
  if (u < 0.82) {
    const snap = Math.sin(t * 14) + 0.24 * Math.sin(t * 26);
    return {
      lift: 6 + Math.abs(snap) * 4.2,
      rot: 16.8 + snap * 14.4,
      dx: snap * 1.7,
      anim: "sit" as TrickAnim,
    };
  }
  const s = (u - 0.82) / 0.18;
  return { lift: 4.2 * (1 - s), rot: 9.6 * (1 - s), dx: 0, anim: "idle" as TrickAnim };
}

export function dipPose(t: number) {
  const u = Math.max(0, Math.min(1, t / HAPPY_DUR.dip));
  if (u < 0.12) {
    const s = u / 0.12;
    return { lift: s * 7.2, rot: -s * 16.8, dx: 0, anim: "sit" as TrickAnim };
  }
  if (u < 0.84) {
    const cry = Math.sin(t * 9) + 0.26 * Math.sin(t * 16);
    return {
      lift: 7.2 + Math.abs(cry) * 4.8,
      rot: -16.8 + cry * 10.8,
      dx: cry * 2.2,
      anim: "sit" as TrickAnim,
    };
  }
  const s = (u - 0.84) / 0.16;
  return { lift: 4.8 * (1 - s), rot: -9.6 * (1 - s), dx: 0, anim: "sit" as TrickAnim };
}

export function settlePose(t: number) {
  return {
    lift: 4.8 + Math.abs(Math.sin(t * 7)) * 6,
    rot: -7.2 + Math.sin(t * 10) * 16.8,
    dx: Math.sin(t * 6) * 2.6,
    anim: "talk" as TrickAnim,
  };
}

export function stepHappy(happy: PhoenixHappy | null | undefined, dt: number, flags?: HappyFlags | null): PhoenixHappy | null | undefined {
  if (!happy || happy.phase === "done") return happy;
  if (happyShouldAbort(flags)) {
    return Object.assign({}, happy, { phase: "done" as const, t: 0, lift: 0, rot: 0, anim: "idle" as TrickAnim, abort: true });
  }
  const next = Object.assign({}, happy, { t: happy.t + Math.max(0, dt) });
  const hold = HAPPY_DUR[next.kind as PhoenixHappyKind];
  const pose =
    next.kind === "shine" ? shinePose(next.t) : next.kind === "dip" ? dipPose(next.t) : settlePose(next.t);
  next.lift = pose.lift;
  next.rot = pose.rot;
  next.dx = pose.dx;
  next.anim = pose.anim;
  if (next.t >= hold) return Object.assign({}, next, { phase: "done" as const, lift: 0, rot: 0, anim: "idle" as TrickAnim });
  return next;
}

/** Ember has no Rui-style sleep-frame hold. */
export function sleepHoldFrame(_key: string | undefined, _frameCount?: number) {
  return null;
}

export function beginTrick(kind: string, x: number, facing?: number) {
  const anim: TrickAnim =
    kind === "cinder"
      ? "sit"
      : kind === "blaze" || kind === "hearth"
        ? "sit"
        : kind === "shed" || kind === "lift" || kind === "reignite"
          ? "play"
          : kind === "return"
            ? "sit"
            : "sit";
  return {
    kind,
    phase: kind === "cinder" ? ("hold" as const) : ("go" as const),
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

/** Cinder — banked-coal nestle on the blotter ash. Soft heat pulse. Rui-visible. Not Vesper sprawl. Not window-play KINDLE. */
export function cinderPose(t: number) {
  const soft = Math.sin(t * 1.6);
  const breath = Math.sin(t * 2.6);
  return { lift: 5.4 + soft * 3.8 + Math.abs(breath) * 1.9, rot: 31.2 + breath * 6 + Math.sin(t * 4.8) * 6 };
}

/** Soft lift out of the cinder bank; stays on the desk. Not window-play leave. */
export function releasePose(t: number) {
  const u = Math.max(0, Math.min(1, t / RELEASE_S));
  return { lift: 5.4 * (1 - Math.sin(u * Math.PI * 0.5)), rot: 31.2 * (1 - u) };
}

/** Blaze — brief gold-throat brightening. Not Vesper smolder. Not fuse warm. Not parrot flash. */
export function blazePose(t: number, fromX: number, facing: number) {
  const u = Math.max(0, Math.min(1, t / DUR.blaze));
  const face = facing == null ? 1 : facing;
  if (u < 0.12) {
    const s = smoothstep(u / 0.12);
    return { x: fromX, lift: s * 6.6, rot: s * 21.6 * face, anim: "sit" as TrickAnim };
  }
  if (u < 0.86) {
    const s = (u - 0.12) / 0.74;
    const flare = Math.abs(Math.sin(s * Math.PI * 2.8));
    return {
      x: fromX + face * Math.sin(s * Math.PI) * 2.6,
      lift: 6.6 + flare * 6.6,
      rot: face * (21.6 + flare * 16.8),
      anim: "talk" as TrickAnim,
    };
  }
  const s = smoothstep((u - 0.86) / 0.14);
  return {
    x: fromX,
    lift: 4.8 * (1 - s) * 0.25,
    rot: face * 9.6 * (1 - s),
    anim: "sit" as TrickAnim,
  };
}

/** Shed — shake ash flakes from the flight feathers. Not Floss ash-bath. Not budgie preen. */
export function shedPose(t: number, fromX: number, facing: number) {
  const u = Math.max(0, Math.min(1, t / DUR.shed));
  const face = facing == null ? 1 : facing;
  if (u < 0.1) {
    const s = smoothstep(u / 0.1);
    return { x: fromX, lift: s * 5.4, rot: s * -14.4 * face, anim: "play" as TrickAnim };
  }
  if (u < 0.88) {
    const s = (u - 0.1) / 0.78;
    const shake = Math.sin(s * Math.PI * 5.5);
    return {
      x: fromX + face * shake * 2.9,
      lift: 5.4 + Math.abs(shake) * 7.8,
      rot: face * (-14.4 + shake * 26.4),
      anim: "play" as TrickAnim,
    };
  }
  const s = smoothstep((u - 0.88) / 0.12);
  return {
    x: fromX,
    lift: 4.2 * (1 - s),
    rot: face * -4.8 * (1 - s),
    anim: "sit" as TrickAnim,
  };
}

/** Lift — rise as if about to take wing, then stay. Not window-play KINDLE rise. Not Rui somersault. */
export function liftPose(t: number, fromX: number, facing: number) {
  const u = Math.max(0, Math.min(1, t / DUR.lift));
  const face = facing == null ? 1 : facing;
  if (u < 0.14) {
    const s = smoothstep(u / 0.14);
    return { x: fromX, lift: s * 7.8, rot: -s * 21.6 * face, anim: "play" as TrickAnim };
  }
  if (u < 0.78) {
    const s = (u - 0.14) / 0.64;
    const wing = Math.abs(Math.sin(s * Math.PI * 2.4));
    return {
      x: fromX + face * Math.sin(s * Math.PI) * 3.1,
      lift: 7.8 + wing * 6.6,
      rot: face * (-21.6 + wing * 19.2),
      anim: "play" as TrickAnim,
    };
  }
  const s = smoothstep((u - 0.78) / 0.22);
  return {
    x: fromX + face * 1.0,
    lift: 6 * (1 - s) * 0.3,
    rot: face * -7.2 * (1 - s),
    anim: "sit" as TrickAnim,
  };
}

/** Return — the species: leave a little, come back kinder. Not Vesper fold. Not window-play KINDLE. */
export function returnPose(t: number, fromX: number, facing: number) {
  const u = Math.max(0, Math.min(1, t / DUR.return));
  const face = facing == null ? 1 : facing;
  if (u < 0.2) {
    const s = smoothstep(u / 0.2);
    return { x: fromX + face * s * 9.6, lift: s * 6, rot: s * 16.8 * face, anim: "play" as TrickAnim };
  }
  if (u < 0.7) {
    const s = (u - 0.2) / 0.5;
    const home = smoothstep(s);
    return {
      x: fromX + face * (9.6 * (1 - home)),
      lift: 6 * (1 - home * 0.35) + Math.sin(s * Math.PI) * 2.9,
      rot: face * (16.8 - home * 24),
      anim: "sit" as TrickAnim,
    };
  }
  const s = smoothstep((u - 0.7) / 0.3);
  return {
    x: fromX,
    lift: 6 * 0.55 * (1 - s),
    rot: face * -7.2 * (1 - s),
    anim: "sit" as TrickAnim,
  };
}

/** Reignite — cool, then catch fire again on the blotter. Not window-play KINDLE. Not spark/flare/crackle. */
export function reignitePose(t: number, fromX: number, facing: number) {
  const u = Math.max(0, Math.min(1, t / DUR.reignite));
  const face = facing == null ? 1 : facing;
  if (u < 0.18) {
    const s = smoothstep(u / 0.18);
    return { x: fromX, lift: s * 2.6, rot: s * -9.6 * face, anim: "sit" as TrickAnim };
  }
  if (u < 0.42) {
    const s = (u - 0.18) / 0.24;
    return {
      x: fromX + face * Math.sin(s * Math.PI) * 1.0,
      lift: 2.6 * (1 - s * 0.7),
      rot: face * (-9.6 + s * 7.2),
      anim: "sit" as TrickAnim,
    };
  }
  if (u < 0.88) {
    const s = (u - 0.42) / 0.46;
    const burst = Math.abs(Math.sin(s * Math.PI * 3.2));
    return {
      x: fromX + face * Math.sin(s * Math.PI * 2) * 2.9,
      lift: 4.2 + burst * 8.4,
      rot: face * (12 + burst * 21.6),
      anim: "talk" as TrickAnim,
    };
  }
  const s = smoothstep((u - 0.88) / 0.12);
  return {
    x: fromX,
    lift: 4.8 * (1 - s),
    rot: face * 7.2 * (1 - s),
    anim: "sit" as TrickAnim,
  };
}

/** Hearth — settle as the desk's warm center. Not bask/sun/coil/drape/sprawl/loaf. Not cinder bank alone. */
export function hearthPose(t: number, fromX: number, facing: number) {
  const u = Math.max(0, Math.min(1, t / DUR.hearth));
  const face = facing == null ? 1 : facing;
  if (u < 0.14) {
    const s = smoothstep(u / 0.14);
    return { x: fromX, lift: s * 4.8, rot: s * 26.4 * face, anim: "sit" as TrickAnim };
  }
  if (u < 0.86) {
    const s = (u - 0.14) / 0.72;
    const warm = Math.sin(s * Math.PI * 2.2);
    return {
      x: fromX + face * Math.sin(s * Math.PI) * 1.9,
      lift: 4.8 + Math.abs(warm) * 4.2 + Math.sin(t * 3.4) * 1.4,
      rot: face * (26.4 + warm * 12 + Math.sin(t * 5.2) * 7.2),
      anim: "sit" as TrickAnim,
    };
  }
  const s = smoothstep((u - 0.86) / 0.14);
  return {
    x: fromX,
    lift: 3.8 * (1 - s),
    rot: face * 12 * (1 - s),
    anim: "sit" as TrickAnim,
  };
}

export function stepTrick(trick: PhoenixTrick | null | undefined, dt: number, flags?: TrickFlags | null): PhoenixTrick | null | undefined {
  if (!trick || trick.phase === "done") return trick;
  if (shouldAbort(flags) && trick.kind !== "lift" && trick.kind !== "return" && trick.kind !== "reignite") {
    return Object.assign({}, trick, { phase: "done" as const, t: 0, lift: 0, rot: 0, anim: "idle" as TrickAnim, abort: true });
  }
  const next = Object.assign({}, trick, { t: trick.t + Math.max(0, dt) });
  if (next.kind === "cinder") {
    if (next.t < CINDER_HOLD) {
      const pose = cinderPose(next.t);
      next.phase = "hold";
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = "sit";
      return next;
    }
    if (next.t < CINDER_HOLD + RELEASE_S) {
      const pose = releasePose(next.t - CINDER_HOLD);
      next.phase = "release";
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = "sit";
      return next;
    }
    return Object.assign({}, next, { phase: "done" as const, lift: 0, rot: 0, anim: "idle" as TrickAnim });
  }
  const hold = DUR[next.kind as PhoenixTrickKind];
  const u = next.t / hold;
  const fromX = trick.fromX != null ? trick.fromX : trick.x;
  if (next.kind === "blaze") {
    const pose = blazePose(next.t, fromX, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "shed") {
    const pose = shedPose(next.t, fromX, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "lift") {
    const pose = liftPose(next.t, fromX, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "return") {
    const pose = returnPose(next.t, fromX, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "reignite") {
    const pose = reignitePose(next.t, fromX, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else {
    const pose = hearthPose(next.t, fromX, trick.facing);
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
