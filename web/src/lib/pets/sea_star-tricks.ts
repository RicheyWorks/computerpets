/** Ochre ground tricks while idle — ultra-polish pass. House sea star — podia / righting / crawl / evert / penta / madre / papula personality (tube-feet ampulla waves, overturn righting twist, arm-lead crawl, stomach-eversion curiosity, pentaradial desk life, madreporite water-vascular sieve plate, dermal papulae skin-gill shimmer; not Pulse bell/oral/lucent/trail/medusa/rhopalium/horseshoe, Cup mantle dens, Sepia chromatophores, Chamber spiral, Coin bowl-drift, Ink soak/tuck, or Bloom gill/amble). Podia rides soft ampulla waves; righting twists upright; crawl leads an arm; evert probes with stomach curiosity; penta turns the five-ray compass; madre pumps the madreporite sieve (species-true asteroid water-vascular intake — not podia ampulla waves, not evert stomach, not window-play REEF); papula shimmers dermal papulae / skin gills (species-true asteroid respiration — not Bloom gill, not Pulse lucent, not Cup papilla). Window-play REEF unchanged — never names `reef`. Special cling unchanged — never names cling as a trick. Ethogram keeps cling sit_hold; adds righting/crawl/evert/penta/madre/papula softs + freeze (replaces thin still). Amplitudes raised toward Rui richness; denser waits/weights; prefersHouseCry via sea_star.wav. Thank-yous damp / adhere / tide. Feed-happy after eat. Sleep, hide, leave, rest, card still win. Same map as desktop `sea_star-tricks.js`. True house-sea-star desk life — not Rui/cat/dog/rabbit/hamster/guinea_pig/turtle/goldfish/budgie/fox/penguin/parrot/ferret/hedgehog/chinchilla/axolotl/toucan/iguana/Sol/dragon/Vesper/phoenix/Ember/ball_python/Nori/corn_snake/Saffron/kingsnake/Bandit/green_tree_python/Jade/hognose/Bluff/garter/Sash/boa/Lula/milk_snake/Coral/rosy_boa/Blush/carpet_python/Atlas/octopus/Cup/cuttlefish/Sepia/nautilus/Chamber/moon_jelly/Pulse or *Dragon electrical (Relay/Fuse/Ground) clones. Avoids reef/cling/rise/chime/flush/lid/mantle/sucker/jet/veil/tinker/papilla/ooze/drift/gulp/flare/dart/soak/tuck/paddle/gill/amble/plume/legend/fan/flash/latch/puff/unfurl/chart/climb/probe/canyon/siphon/pulse/slink/den/cork/nest/savor/settle/survey/snatch/band/funnel/tentacle/loom/wave/buoy/bone/pupil/chroma/hover/blot/strike/zebra/spiral/siphuncle/nacre/pinhole/fringe/hyponome/aperture/bell/oral/lucent/trail/medusa/rhopalium/horseshoe name collisions with prior guests and sea_star window-play. Bird ultra (Soot→Ember) + Miso→Pulse done; Echo/budgie + Peck/penguin + Quill/parrot + Keel/toucan + Ember skip birds. Tenant / hermit_crab ultra done; Ledger / horseshoe_crab ultra done; Anchor / seahorse ultra done; next guest ultra is Kite / manta. Amplitudes raised toward Rui richness; denser waits/weights (PODIA_HOLD=11.2 RELEASE_S=1.18). Tenant densified. Ledger densified. Anchor densified. Kite densified. Door densified. Felt densified. Vein densified. Fan densified. Mast densified. Disk densified. Next leftover Wax / honeycomb. No cry inventing beyond house sea_star.wav prefer. Never retouch Rui sprites. */
export const TRICK_KEY = "sea_star";
export const TRICKS = ["podia", "righting", "crawl", "evert", "penta", "madre", "papula"] as const;
export const HAPPY = ["damp", "adhere", "tide"] as const;
export type SeaStarTrickKind = (typeof TRICKS)[number];
export type SeaStarHappyKind = (typeof HAPPY)[number];
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

export type SeaStarTrick = {
  kind: SeaStarTrickKind;
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

export type SeaStarHappy = {
  kind: SeaStarHappyKind;
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

export const HAPPY_DUR: Record<SeaStarHappyKind, number> = {
  damp: 1.28,
  adhere: 1.16,
  tide: 1.2,
};

/** Podia hold — Ochre rests in soft tube-feet ampulla waves. Not window-play REEF. Not Pulse bell. Not Coin drift. Not Chamber spiral. Not Cup mantle. */
export const PODIA_HOLD = 11.2;
export const RELEASE_S = 1.18;

export const DUR: Record<SeaStarTrickKind, number> = {
  podia: PODIA_HOLD + RELEASE_S,
  righting: 1.78,
  crawl: 1.85,
  evert: 1.72,
  penta: 1.78,
  madre: 2.05,
  papula: 2.12,
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
  if (cmd === "sleep" || cmd === "leave" || cmd === "hide" || cmd === "rest") return true;
  if (cmd === "seek" || cmd === "eat" || cmd === "play" || cmd === "talk" || cmd === "enter") return true;
  return false;
}

export function nextTrickWait(justFinished: boolean, rand?: number, kind?: SeaStarTrickKind) {
  const roll = rand == null ? Math.random() : rand;
  if (kind === "podia") return 40 + roll * 26;
  if (kind === "madre" || kind === "papula" || kind === "crawl") return 12.8 + roll * 9.4;
  if (kind === "righting" || kind === "evert" || kind === "penta") return 12.8 + roll * 9.4;
  return justFinished ? 8.5 + roll * 8.4 : 4.4 + roll * 7.4;
}

export function pickTrick(rand?: number, musicOn = false, lastKind?: SeaStarTrickKind | null): SeaStarTrickKind {
  if (musicOn) return "podia";
  const roll = rand == null ? Math.random() : rand;
  const pool = TRICKS.filter((k) => k !== lastKind);
  const list = pool.length ? pool : [...TRICKS];
  const weights = list.map((k) =>
    k === "podia" ? 0.72 : k === "madre" || k === "papula" || k === "crawl" ? 1.28 : k === "righting" || k === "evert" || k === "penta" ? 1.18 : 1.08
  );
  let total = 0;
  for (let i = 0; i < weights.length; i++) total += weights[i]!;
  let r = roll * total;
  for (let i = 0; i < list.length; i++) {
    r -= weights[i]!;
    if (r <= 0) return list[i]!;
  }
  return list[list.length - 1] || "podia";
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
  return key === TRICK_KEY || key === "cling";
}

export function startThankYou(
  key: string | undefined | null,
  lastKind: SeaStarHappyKind | string | null | undefined,
  x: number,
  facing: 1 | -1,
  flags?: TrickFlags,
) {
  if (!wantsThankYou(key)) return null;
  if (!happyCanStart(flags || { cmd: "idle" })) return null;
  const pick = pickHappy(lastKind as SeaStarHappyKind | null | undefined);
  return { happy: beginHappy(pick, x, facing), kind: pick };
}

export function pickHappy(lastKind?: SeaStarHappyKind | null, rand?: number) {
  const pool = HAPPY.filter((k) => k !== lastKind);
  const list = pool.length ? pool : [...HAPPY];
  const roll = rand == null ? Math.random() : rand;
  return list[Math.floor(roll * list.length)] || list[0];
}

export function beginHappy(kind: SeaStarHappyKind | string, x: number, facing: 1 | -1): SeaStarHappy {
  const name = (HAPPY as readonly string[]).indexOf(kind) >= 0 ? (kind as SeaStarHappyKind) : "damp";
  return {
    kind: name,
    happy: true,
    phase: "go",
    t: 0,
    x: x,
    lift: 0,
    rot: 0,
    anim: name === "damp" ? "sit" : name === "adhere" ? "talk" : "sit",
    facing: facing == null ? 1 : facing,
    fromX: x,
  };
}

export function dampPose(t: number) {
  const u = Math.max(0, Math.min(1, t / HAPPY_DUR.damp));
  if (u < 0.16) {
    const s = u / 0.16;
    return { lift: s * 3.84, rot: s * 16.8, dx: 0, anim: "sit" as TrickAnim };
  }
  if (u < 0.78) {
    const wave = Math.sin(t * 2.4);
    return {
      lift: 3.84 + Math.abs(wave) * 2.16,
      rot: 16.8 + wave * 14.4,
      dx: wave * 0.54,
      anim: "sit" as TrickAnim,
    };
  }
  const s = (u - 0.78) / 0.22;
  return { lift: 2.88 * (1 - s), rot: 9.6 * (1 - s), dx: 0, anim: "idle" as TrickAnim };
}

export function adherePose(t: number) {
  const u = Math.max(0, Math.min(1, t / HAPPY_DUR.adhere));
  if (u < 0.12) {
    const s = u / 0.12;
    return { lift: s * 3.12, rot: s * -21.6, dx: 0, anim: "talk" as TrickAnim };
  }
  if (u < 0.8) {
    const w = Math.sin(t * 2.6);
    return {
      lift: 3.12 + Math.abs(w) * 1.68,
      rot: -21.6 + w * 26.4,
      dx: w * 0.42,
      anim: "talk" as TrickAnim,
    };
  }
  const s = (u - 0.8) / 0.2;
  return { lift: 2.4 * (1 - s), rot: -14.4 * (1 - s), dx: 0, anim: "sit" as TrickAnim };
}

export function tidePose(t: number) {
  return {
    lift: Math.abs(Math.sin(t * 2.1)) * 2.64 + 2.88,
    rot: 9.6 + Math.sin(t * 2.8) * 16.8,
    dx: Math.sin(t * 1.6) * 0.48,
    anim: "sit" as TrickAnim,
  };
}

export function stepHappy(happy: SeaStarHappy, dt: number, flags?: TrickFlags): SeaStarHappy {
  if (!happy || happy.phase === "done") return happy;
  if (happyShouldAbort(flags)) {
    return { ...happy, phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true };
  }
  const next: SeaStarHappy = { ...happy, t: happy.t + Math.max(0, dt) };
  const hold = HAPPY_DUR[next.kind];
  if (next.kind === "damp") {
    const pose = dampPose(next.t);
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "adhere") {
    const pose = adherePose(next.t);
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else {
    const pose = tidePose(next.t);
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  }
  if (next.t >= hold) return { ...next, phase: "done", lift: 0, rot: 0, anim: "idle" };
  return next;
}

export function sleepHoldFrame(_key?: string | null, _frameCount?: number) {
  return null;
}

export function beginTrick(kind: SeaStarTrickKind, x: number, facing: 1 | -1): SeaStarTrick {
  const anim: TrickAnim =
    kind === "podia"
      ? "sit"
      : kind === "righting"
        ? "play"
        : kind === "crawl"
          ? "walk"
          : kind === "evert"
            ? "talk"
            : kind === "penta"
              ? "sit"
              : kind === "madre"
                ? "talk"
                : kind === "papula"
                  ? "play"
                  : "sit";
  return {
    kind: kind,
    phase: kind === "podia" ? "hold" : "go",
    t: 0,
    x: x,
    lift: 0,
    rot: 0,
    anim: anim,
    facing: facing == null ? 1 : facing,
    fromX: x,
  };
}

function smoothstep(t: number) {
  const x = Math.max(0, Math.min(1, t));
  return x * x * (3 - 2 * x);
}

export function podiaPose(t: number) {
  const beat = Math.sin(t * 1.7) + 0.54 * Math.sin(t * 3.4);
  return {
    lift: 2.88 + Math.sin(t * 1.7) * 3.36 + Math.abs(Math.sin(t * 3.4)) * 1.92,
    rot: -21.6 + Math.sin(t * 2.4) * 19.2 + beat * 8,
  };
}

export function releasePose(t: number) {
  const u = Math.max(0, Math.min(1, t / RELEASE_S));
  return { lift: (2.88 + 3.36) * (1 - Math.sin(u * Math.PI * 0.5)), rot: -21.6 * (1 - u) };
}

export function rightingPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.righting));
  if (u < 0.14) {
    const s = smoothstep(u / 0.14);
    return { x: fromX, lift: s * 4.32, rot: s * 33.6 * facing, anim: "play" as TrickAnim };
  }
  if (u < 0.55) {
    const s = (u - 0.14) / 0.41;
    const twist = Math.sin(s * Math.PI);
    return {
      x: fromX + facing * twist * 0.85,
      lift: 4.32 + Math.abs(twist) * 2.16,
      rot: facing * (33.6 + twist * 42),
      anim: "play" as TrickAnim,
    };
  }
  if (u < 0.78) {
    const s = (u - 0.55) / 0.23;
    return {
      x: fromX,
      lift: 4.32 * (1 - s * 0.48),
      rot: facing * (33.6 * (1 - s) - 9.6 * s),
      anim: "play" as TrickAnim,
    };
  }
  const s = smoothstep((u - 0.78) / 0.22);
  return {
    x: fromX,
    lift: 2.64 * (1 - s),
    rot: facing * (-4.8 * (1 - s)),
    anim: "sit" as TrickAnim,
  };
}

export function crawlPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.crawl));
  if (u < 0.1) {
    const s = smoothstep(u / 0.1);
    return { x: fromX, lift: s * 3.36, rot: s * 12 * facing, anim: "walk" as TrickAnim };
  }
  if (u < 0.75) {
    const s = (u - 0.1) / 0.65;
    const step = Math.sin(s * Math.PI * 3.4);
    const lead = Math.sin(s * Math.PI * 1.1);
    return {
      x: fromX + facing * (lead * 1.38 + step * 0.42),
      lift: 3.36 + Math.abs(step) * 1.92,
      rot: facing * (12 + step * 14.4 + lead * 7.2),
      anim: "walk" as TrickAnim,
    };
  }
  const s = smoothstep((u - 0.75) / 0.25);
  return {
    x: fromX + facing * 1.38 * (1 - s),
    lift: 3.36 * (1 - s),
    rot: facing * (7.2 * (1 - s)),
    anim: "idle" as TrickAnim,
  };
}

export function evertPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.evert));
  if (u < 0.16) {
    const s = smoothstep(u / 0.16);
    return { x: fromX, lift: s * 2.88, rot: s * -16.8 * facing, anim: "talk" as TrickAnim };
  }
  if (u < 0.72) {
    const s = (u - 0.16) / 0.56;
    const probe = Math.sin(s * Math.PI * 2.8);
    const flatten = Math.sin(s * Math.PI * 1.4);
    return {
      x: fromX + facing * flatten * 0.66,
      lift: 2.88 - Math.abs(flatten) * 0.96 + Math.abs(probe) * 1.92,
      rot: facing * (-16.8 + probe * 21.6 + flatten * 7.2),
      anim: "talk" as TrickAnim,
    };
  }
  const s = smoothstep((u - 0.72) / 0.28);
  return {
    x: fromX,
    lift: 1.92 * (1 - s),
    rot: facing * (-7.2 * (1 - s)),
    anim: "sit" as TrickAnim,
  };
}

export function pentaPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.penta));
  if (u < 0.12) {
    const s = smoothstep(u / 0.12);
    return { x: fromX, lift: s * 3.84, rot: s * 16.8 * facing, anim: "sit" as TrickAnim };
  }
  if (u < 0.7) {
    const s = (u - 0.12) / 0.58;
    const spoke = Math.sin(s * Math.PI * 5);
    const turn = Math.sin(s * Math.PI * 2);
    return {
      x: fromX + facing * turn * 0.84,
      lift: 3.84 + Math.abs(spoke) * 2.16,
      rot: facing * (16.8 + spoke * 19.2 + turn * 9.6),
      anim: "sit" as TrickAnim,
    };
  }
  const s = smoothstep((u - 0.7) / 0.3);
  return {
    x: fromX,
    lift: 2.88 * (1 - s),
    rot: facing * (9.6 * (1 - s)),
    anim: "idle" as TrickAnim,
  };
}

export function madrePose(t: number, fromX: number, facing: 1 | -1) {
  // Madreporite sieve plate — species-true asteroid water-vascular intake. Not podia. Not REEF.
  const u = Math.max(0, Math.min(1, t / DUR.madre));
  if (u < 0.12) {
    const s = smoothstep(u / 0.12);
    return { x: fromX + facing * s * 0.6, lift: s * 2.88, rot: s * 12 * facing, anim: "talk" as TrickAnim };
  }
  if (u < 0.38) {
    const s = smoothstep((u - 0.12) / 0.26);
    return {
      x: fromX + facing * (0.6 + s * 5.76),
      lift: 2.88 + s * 1.92,
      rot: facing * (12 - s * 4.8),
      anim: "talk" as TrickAnim,
    };
  }
  if (u < 0.72) {
    const s = (u - 0.38) / 0.34;
    const sieve = Math.sin(s * Math.PI * 3.2);
    return {
      x: fromX + facing * (6.36 - s * 2.64 + sieve * 0.48),
      lift: 4.8 + Math.abs(sieve) * 2.16,
      rot: facing * (7.2 + sieve * 16.8),
      anim: "talk" as TrickAnim,
    };
  }
  const s = smoothstep((u - 0.72) / 0.28);
  return {
    x: fromX + facing * 3.72 * (1 - s),
    lift: 3.84 * (1 - s),
    rot: facing * (4.8 * (1 - s)),
    anim: "sit" as TrickAnim,
  };
}

export function papulaPose(t: number, fromX: number, facing: 1 | -1) {
  // Dermal papulae / skin gills — species-true asteroid respiration. Not Bloom gill. Not lucent.
  const u = Math.max(0, Math.min(1, t / DUR.papula));
  if (u < 0.12) {
    const s = smoothstep(u / 0.12);
    return { x: fromX, lift: s * 3.84, rot: s * -16.8 * facing, anim: "play" as TrickAnim };
  }
  if (u < 0.45) {
    const s = smoothstep((u - 0.12) / 0.33);
    return {
      x: fromX + facing * s * 1.32,
      lift: 3.84 + s * 1.68,
      rot: facing * (-16.8 + s * 12),
      anim: "play" as TrickAnim,
    };
  }
  if (u < 0.72) {
    const s = (u - 0.45) / 0.27;
    const shimmer = Math.sin(s * Math.PI * 3.6);
    return {
      x: fromX + facing * (1.32 - s * 0.66 + shimmer * 0.42),
      lift: 5.52 + Math.abs(shimmer) * 1.92,
      rot: facing * (-4.8 + shimmer * 19.2),
      anim: "sit" as TrickAnim,
    };
  }
  const s = smoothstep((u - 0.72) / 0.28);
  return {
    x: fromX + facing * 0.66 * (1 - s),
    lift: 4.08 * (1 - s),
    rot: facing * (-2.4 * (1 - s)),
    anim: "idle" as TrickAnim,
  };
}

export function stepTrick(trick: SeaStarTrick, dt: number, flags?: TrickFlags): SeaStarTrick {
  if (!trick || trick.phase === "done") return trick;
  if (
    shouldAbort(flags) &&
    trick.kind !== "righting" &&
    trick.kind !== "crawl" &&
    trick.kind !== "evert" &&
    trick.kind !== "penta" &&
    trick.kind !== "madre" &&
    trick.kind !== "papula"
  ) {
    return { ...trick, phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true };
  }
  const next: SeaStarTrick = { ...trick, t: trick.t + Math.max(0, dt) };
  if (next.kind === "podia") {
    if (next.t < PODIA_HOLD) {
      const pose = podiaPose(next.t);
      next.phase = "hold";
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = "sit";
      return next;
    }
    if (next.t < PODIA_HOLD + RELEASE_S) {
      const pose = releasePose(next.t - PODIA_HOLD);
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
  if (next.kind === "righting") {
    const pose = rightingPose(next.t, fromX, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "crawl") {
    const pose = crawlPose(next.t, fromX, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "evert") {
    const pose = evertPose(next.t, fromX, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "penta") {
    const pose = pentaPose(next.t, fromX, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "madre") {
    const pose = madrePose(next.t, fromX, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else {
    const pose = papulaPose(next.t, fromX, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  }
  if (u >= 1) return { ...next, phase: "done", lift: 0, rot: 0, anim: "idle" };
  return next;
}
