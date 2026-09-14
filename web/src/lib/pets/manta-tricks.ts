/** Kite ground tricks while idle — ultra-polish pass. House reef manta — wing / lobe / gyre / vault / span / breach / ram personality (pectoral wingbeat glide, cephalic-lobe plankton scoop, barrel-roll curiosity as a gyre (never named barrel — window-play owns BARREL), forward somersault vault (never named somersault — Rui owns that), gentle-giant wingspan desk hold, surface breach leap, ram-filter mouth-open feed glide; not Coin drift/gulp/flare/glint/dart/yawn/forage, Pulse bell/oral/lucent/trail/medusa, Anchor coil/buoy/siphon/swivel/pouch/dorsal/pectoral, Ledger carapace/bookgill/telson/furrow/fossil/pusher/ocular, Tenant swap/antenna/scuttle/withdraw/vacancy/chela/bailer, Ochre podia/righting/crawl/evert/penta/madre/papula, Sepia hover/pupil, Chamber spiral, Cup mantle/jet, Ink soak/tuck, Clip nest, or Soar eagle_ray spots). Breach is the species-true surface leap (not vault flip alone, not Rui somersault, not window-play BARREL); ram is Mobula/Manta filter-feeding with cephalic lobes funneling (not lobe scoop alone, not Coin gulp, not Cup jet). Window-play BARREL unchanged — never names `barrel`. Special Soar (eagle_ray) unchanged — never names soar. Ethogram keeps span sit_hold; adds wing/lobe/gyre/vault/breach/ram softs + freeze (replaces thin soar/glide). Amplitudes raised toward Rui richness; denser waits/weights; prefersHouseCry via manta.wav. Thank-yous ceil / scoop / breadth. Feed-happy after eat. Sleep, hide, leave, rest, card still win. Same map as desktop `manta-tricks.js`. True house-manta desk life — not Rui/cat/dog/rabbit/hamster/guinea_pig/turtle/goldfish/budgie/fox/penguin/parrot/ferret/hedgehog/chinchilla/axolotl/toucan/iguana/Sol/dragon/Vesper/phoenix/Ember/ball_python/Nori/corn_snake/Saffron/kingsnake/Bandit/green_tree_python/Jade/hognose/Bluff/garter/Sash/boa/Lula/milk_snake/Coral/rosy_boa/Blush/carpet_python/Atlas/octopus/Cup/cuttlefish/Sepia/nautilus/Chamber/moon_jelly/Pulse/sea_star/Ochre/hermit_crab/Tenant/horseshoe_crab/Ledger/seahorse/Anchor or *Dragon electrical (Relay/Fuse/Ground) clones. Avoids barrel/soar/spots/hitch/hover/coil/buoy/siphon/swivel/pouch/dorsal/pectoral/carapace/bookgill/swap/withdraw/podia/bell/oral/mantle/jet/drift/gulp/flare/somersault name collisions with prior guests and manta window-play. Bird ultra (Soot→Ember) + Miso→Anchor done; Echo/budgie + Peck/penguin + Quill/parrot + Keel/toucan + Ember skip birds. Next guest ultra is Door / moray. No cry inventing beyond house manta.wav prefer. Never retouch Rui sprites. */
export const TRICK_KEY = "manta";
export const TRICKS = ["wing", "lobe", "gyre", "vault", "span", "breach", "ram"] as const;
export const HAPPY = ["ceil", "scoop", "breadth"] as const;
export type MantaTrickKind = (typeof TRICKS)[number];
export type MantaHappyKind = (typeof HAPPY)[number];
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

export type MantaTrick = {
  kind: MantaTrickKind;
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

export type MantaHappy = {
  kind: MantaHappyKind;
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

export const HAPPY_DUR: Record<MantaHappyKind, number> = {
  ceil: 1.28,
  scoop: 1.18,
  breadth: 1.24,
};

/** Span hold — Kite opens the full pectoral wingspan on the desk. Not window-play BARREL. Not Anchor coil. */
export const SPAN_HOLD = 10.8;
export const RELEASE_S = 0.62;

export const DUR: Record<MantaTrickKind, number> = {
  span: SPAN_HOLD + RELEASE_S,
  wing: 1.58,
  lobe: 1.52,
  gyre: 1.68,
  vault: 1.48,
  breach: 1.72,
  ram: 1.64,
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

export function nextTrickWait(justFinished: boolean, rand?: number, kind?: MantaTrickKind | string) {
  const roll = rand == null ? Math.random() : rand;
  if (kind === "span") return 38 + roll * 24;
  if (kind === "breach" || kind === "gyre" || kind === "vault") return 12 + roll * 9;
  if (kind === "wing" || kind === "lobe" || kind === "ram") return 11 + roll * 8;
  return justFinished ? 8 + roll * 8 : 4 + roll * 7;
}

export function pickTrick(rand?: number, musicOn = false, lastKind?: MantaTrickKind | string | null): MantaTrickKind {
  if (musicOn) return "span";
  const roll = rand == null ? Math.random() : rand;
  const pool = TRICKS.filter((k) => k !== lastKind);
  const list = pool.length ? pool : [...TRICKS];
  const weights = list.map((k) =>
    k === "span" ? 0.55 : k === "breach" || k === "gyre" || k === "vault" ? 1.15 : 1
  );
  let total = 0;
  for (let i = 0; i < weights.length; i++) total += weights[i]!;
  let r = roll * total;
  for (let i = 0; i < list.length; i++) {
    r -= weights[i]!;
    if (r <= 0) return list[i]!;
  }
  return list[list.length - 1] || "wing";
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

export function wantsThankYou(key: string | undefined | null) {
  return key === TRICK_KEY || key === "kite";
}

export function startThankYou(
  key: string | undefined | null,
  lastKind: MantaHappyKind | string | null | undefined,
  x: number,
  facing: 1 | -1,
  flags?: TrickFlags,
) {
  if (!wantsThankYou(key)) return null;
  if (!happyCanStart(flags || { cmd: "idle" })) return null;
  const pick = pickHappy(lastKind as MantaHappyKind | null | undefined);
  return { happy: beginHappy(pick, x, facing), kind: pick };
}

export function pickHappy(lastKind?: MantaHappyKind | null, rand?: number) {
  const pool = HAPPY.filter((k) => k !== lastKind);
  const list = pool.length ? pool : [...HAPPY];
  const roll = rand == null ? Math.random() : rand;
  return list[Math.floor(roll * list.length)] || list[0];
}

export function beginHappy(kind: MantaHappyKind | string, x: number, facing: 1 | -1): MantaHappy {
  const name = (HAPPY as readonly string[]).indexOf(kind) >= 0 ? (kind as MantaHappyKind) : "ceil";
  return {
    kind: name,
    happy: true,
    phase: "go",
    t: 0,
    x: x,
    lift: 0,
    rot: 0,
    anim: name === "ceil" ? "play" : name === "scoop" ? "talk" : "sit",
    facing: facing == null ? 1 : facing,
    fromX: x,
  };
}

export function ceilPose(t: number) {
  const u = Math.max(0, Math.min(1, t / HAPPY_DUR.ceil));
  if (u < 0.18) {
    const s = u / 0.18;
    return { lift: s * 2.8, rot: s * -12, dx: 0, anim: "play" as TrickAnim };
  }
  if (u < 0.8) {
    const tip = Math.sin(t * 1.85);
    return {
      lift: 2.8 + Math.abs(tip) * 1.4,
      rot: -12 + tip * 16,
      dx: tip * 0.35,
      anim: "play" as TrickAnim,
    };
  }
  const s = (u - 0.8) / 0.2;
  return { lift: 2.0 * (1 - s), rot: -8 * (1 - s), dx: 0, anim: "idle" as TrickAnim };
}

export function scoopPose(t: number) {
  const u = Math.max(0, Math.min(1, t / HAPPY_DUR.scoop));
  if (u < 0.2) {
    const s = u / 0.2;
    return { lift: s * 2.4, rot: s * 18, dx: 0, anim: "talk" as TrickAnim };
  }
  if (u < 0.78) {
    const draw = Math.sin(t * 2.2);
    return {
      lift: 2.4 + Math.abs(draw) * 1.3,
      rot: 18 + draw * 14,
      dx: draw * 0.28,
      anim: "talk" as TrickAnim,
    };
  }
  const s = (u - 0.78) / 0.22;
  return { lift: 1.6 * (1 - s), rot: 10 * (1 - s), dx: 0, anim: "idle" as TrickAnim };
}

export function breadthPose(t: number) {
  const u = Math.max(0, Math.min(1, t / HAPPY_DUR.breadth));
  if (u < 0.22) {
    const s = u / 0.22;
    return { lift: s * 2.2, rot: s * 6, dx: 0, anim: "sit" as TrickAnim };
  }
  if (u < 0.78) {
    const breath = Math.sin(t * 1.1);
    return {
      lift: 2.2 + Math.abs(breath) * 1.1,
      rot: 6 + breath * 8,
      dx: breath * 0.2,
      anim: "sit" as TrickAnim,
    };
  }
  const s = (u - 0.78) / 0.22;
  return { lift: 1.5 * (1 - s), rot: 4 * (1 - s), dx: 0, anim: "idle" as TrickAnim };
}

export function stepHappy(happy: MantaHappy, dt: number, flags: TrickFlags): MantaHappy {
  if (!happy || happy.phase === "done") return happy;
  if (happyShouldAbort(flags)) {
    return { ...happy, phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true };
  }
  const next: MantaHappy = { ...happy, t: happy.t + Math.max(0, dt) };
  const dur = HAPPY_DUR[next.kind] || HAPPY_DUR.ceil;
  let pose;
  if (next.kind === "ceil") pose = ceilPose(next.t);
  else if (next.kind === "scoop") pose = scoopPose(next.t);
  else pose = breadthPose(next.t);
  next.lift = pose.lift;
  next.rot = pose.rot;
  next.x = (happy.fromX != null ? happy.fromX : happy.x) + (pose.dx || 0) * happy.facing;
  next.anim = pose.anim;
  if (next.t >= dur) return { ...next, phase: "done", lift: 0, rot: 0, anim: "idle" };
  return next;
}

export function sleepHoldFrame(_key?: string | null, _frameCount?: number) {
  return null;
}

export function beginTrick(kind: MantaTrickKind | string, x: number, facing: 1 | -1): MantaTrick {
  const name = (TRICKS as readonly string[]).indexOf(kind) >= 0 ? (kind as MantaTrickKind) : "wing";
  const hold = name === "span";
  return {
    kind: name,
    phase: hold ? "hold" : "go",
    t: 0,
    x: x,
    lift: 0,
    rot: 0,
    anim: hold ? "sit" : name === "lobe" || name === "ram" ? "talk" : name === "wing" ? "walk" : "play",
    facing: facing == null ? 1 : facing,
    fromX: x,
  };
}

function smoothstep(t: number) {
  const x = Math.max(0, Math.min(1, t));
  return x * x * (3 - 2 * x);
}

export function spanPose(t: number) {
  const breath = Math.sin(t * 0.42);
  return {
    lift: 2.4 + Math.abs(breath) * 1.2,
    rot: breath * 6,
    anim: "sit" as TrickAnim,
  };
}

export function releasePose(t: number) {
  const u = Math.max(0, Math.min(1, t / RELEASE_S));
  const s = smoothstep(u);
  return {
    lift: 2.4 * (1 - Math.sin(u * Math.PI * 0.5)),
    rot: 4 * (1 - s),
    anim: "sit" as TrickAnim,
  };
}

/** Pectoral wingbeat — reef-manta flight through the bowl. Not Coin dart. Not Cup jet. */
export function wingPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.wing));
  if (u < 0.14) {
    const s = smoothstep(u / 0.14);
    return { x: fromX, lift: s * 3.0, rot: s * -14 * facing, anim: "walk" as TrickAnim };
  }
  if (u < 0.72) {
    const s = (u - 0.14) / 0.58;
    const beat = Math.sin(s * Math.PI * 4.6);
    const surge = Math.sin(s * Math.PI * 1.3);
    return {
      x: fromX + facing * (surge * 1.4 + beat * 0.4),
      lift: 3.0 + Math.abs(beat) * 1.7,
      rot: facing * (-14 + beat * 18 + surge * 8),
      anim: "walk" as TrickAnim,
    };
  }
  const s = smoothstep((u - 0.72) / 0.28);
  return {
    x: fromX + facing * 1.1 * (1 - s),
    lift: 2.2 * (1 - s),
    rot: facing * (-8 * (1 - s)),
    anim: "idle" as TrickAnim,
  };
}

/** Cephalic-lobe scoop — plankton funnel. Not Coin gulp. Not scoop thank-you alone. */
export function lobePose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.lobe));
  if (u < 0.16) {
    const s = smoothstep(u / 0.16);
    return { x: fromX, lift: s * 2.6, rot: s * 18 * facing, anim: "talk" as TrickAnim };
  }
  if (u < 0.74) {
    const s = (u - 0.16) / 0.58;
    const scoop = Math.sin(s * Math.PI * 3.4);
    return {
      x: fromX + facing * scoop * 0.55,
      lift: 2.6 + Math.abs(scoop) * 1.4,
      rot: facing * (18 + scoop * 16),
      anim: "talk" as TrickAnim,
    };
  }
  const s = smoothstep((u - 0.74) / 0.26);
  return {
    x: fromX,
    lift: 1.8 * (1 - s),
    rot: facing * (10 * (1 - s)),
    anim: "idle" as TrickAnim,
  };
}

/** Gyre curiosity roll — never named barrel (window-play BARREL). */
export function gyrePose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.gyre));
  if (u < 0.12) {
    const s = smoothstep(u / 0.12);
    return { x: fromX, lift: s * 3.4, rot: s * -16 * facing, anim: "play" as TrickAnim };
  }
  if (u < 0.78) {
    const s = (u - 0.12) / 0.66;
    const roll = Math.sin(s * Math.PI * 2);
    return {
      x: fromX + facing * Math.sin(s * Math.PI) * 2.2,
      lift: 3.4 + Math.abs(Math.sin(s * Math.PI * 2)) * 1.8,
      rot: facing * (-16 + s * 42 + roll * 22),
      anim: "play" as TrickAnim,
    };
  }
  const s = smoothstep((u - 0.78) / 0.22);
  return {
    x: fromX + facing * 1.2 * (1 - s),
    lift: 2.4 * (1 - s),
    rot: facing * (10 * (1 - s)),
    anim: "idle" as TrickAnim,
  };
}

/** Vault forward flip — never named somersault (Rui). Not breach leap. */
export function vaultPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.vault));
  if (u < 0.14) {
    const s = smoothstep(u / 0.14);
    return { x: fromX, lift: s * 3.6, rot: s * -12 * facing, anim: "play" as TrickAnim };
  }
  if (u < 0.72) {
    const s = (u - 0.14) / 0.58;
    const flip = Math.sin(s * Math.PI);
    return {
      x: fromX + facing * s * 2.8,
      lift: 3.6 + flip * 2.2,
      rot: facing * (-12 + s * 36),
      anim: "play" as TrickAnim,
    };
  }
  const s = smoothstep((u - 0.72) / 0.28);
  return {
    x: fromX + facing * 2.4 * (1 - s),
    lift: 2.4 * (1 - s),
    rot: facing * (8 * (1 - s)),
    anim: "idle" as TrickAnim,
  };
}

/** Breach — species-true surface leap clear of the bowl-sky. Not vault. Not Rui somersault. Not BARREL. */
export function breachPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.breach));
  if (u < 0.12) {
    const s = smoothstep(u / 0.12);
    return { x: fromX, lift: s * 2.2, rot: s * -8 * facing, anim: "play" as TrickAnim };
  }
  if (u < 0.45) {
    const s = (u - 0.12) / 0.33;
    const rise = smoothstep(s);
    return {
      x: fromX + facing * rise * 1.6,
      lift: 2.2 + rise * 4.2,
      rot: facing * (-8 + rise * -18),
      anim: "play" as TrickAnim,
    };
  }
  if (u < 0.78) {
    const s = (u - 0.45) / 0.33;
    const arc = Math.sin(s * Math.PI);
    return {
      x: fromX + facing * (1.6 + s * 2.4),
      lift: 6.4 - s * 3.2 + arc * 0.8,
      rot: facing * (-26 + s * 40),
      anim: "play" as TrickAnim,
    };
  }
  const s = smoothstep((u - 0.78) / 0.22);
  return {
    x: fromX + facing * 3.6 * (1 - s * 0.35),
    lift: 2.8 * (1 - s),
    rot: facing * (10 * (1 - s)),
    anim: "idle" as TrickAnim,
  };
}

/** Ram — filter-feed glide, cephalic lobes funneling plankton. Not lobe scoop alone. Not Coin gulp. */
export function ramPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.ram));
  if (u < 0.14) {
    const s = smoothstep(u / 0.14);
    return { x: fromX, lift: s * 2.8, rot: s * 14 * facing, anim: "talk" as TrickAnim };
  }
  if (u < 0.74) {
    const s = (u - 0.14) / 0.6;
    const surge = Math.sin(s * Math.PI * 1.6);
    const filter = Math.sin(s * Math.PI * 4.2);
    return {
      x: fromX + facing * (s * 2.6 + filter * 0.25),
      lift: 2.8 + Math.abs(surge) * 1.5 + Math.abs(filter) * 0.6,
      rot: facing * (14 + surge * 10 + filter * 6),
      anim: "talk" as TrickAnim,
    };
  }
  const s = smoothstep((u - 0.74) / 0.26);
  return {
    x: fromX + facing * 2.2 * (1 - s),
    lift: 2.0 * (1 - s),
    rot: facing * (8 * (1 - s)),
    anim: "idle" as TrickAnim,
  };
}

export function stepTrick(trick: MantaTrick, dt: number, flags: TrickFlags): MantaTrick {
  if (!trick || trick.phase === "done") return trick;
  if (shouldAbort(flags) && trick.kind !== "lobe" && trick.kind !== "gyre" && trick.kind !== "vault" && trick.kind !== "breach" && trick.kind !== "ram") {
    return { ...trick, phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true };
  }
  const next: MantaTrick = { ...trick, t: trick.t + Math.max(0, dt) };
  if (next.kind === "span") {
    if (next.t < SPAN_HOLD) {
      const pose = spanPose(next.t);
      next.phase = "hold";
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = "sit";
      return next;
    }
    if (next.t < SPAN_HOLD + RELEASE_S) {
      const pose = releasePose(next.t - SPAN_HOLD);
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
  let pose;
  if (next.kind === "wing") pose = wingPose(next.t, fromX, trick.facing);
  else if (next.kind === "lobe") pose = lobePose(next.t, fromX, trick.facing);
  else if (next.kind === "gyre") pose = gyrePose(next.t, fromX, trick.facing);
  else if (next.kind === "vault") pose = vaultPose(next.t, fromX, trick.facing);
  else if (next.kind === "breach") pose = breachPose(next.t, fromX, trick.facing);
  else pose = ramPose(next.t, fromX, trick.facing);
  next.x = pose.x;
  next.lift = pose.lift;
  next.rot = pose.rot;
  next.anim = pose.anim;
  if (u >= 1) return { ...next, phase: "done", lift: 0, rot: 0, anim: "idle" };
  return next;
}
