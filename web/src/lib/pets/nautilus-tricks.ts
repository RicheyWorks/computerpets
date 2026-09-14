/** Chamber ground tricks while idle — ultra-polish pass. House nautilus — spiral / siphuncle / nacre / pinhole / fringe / hyponome / aperture personality (chambered shell spiral, gas-tube buoyancy, pearly nacre calm, pinhole-eye regard, suckerless tentacle fringe, hyponome funnel jet, soft-body aperture emerge; not Cup mantle dens, Sepia cuttlebone chromatophores, or Coin bowl-drift). Spiral rides the coiled chambers; siphuncle gas-tubes buoyancy; nacre pearly-calms; pinhole regards the blotter; fringe waves suckerless cirri; hyponome funnel-jets (species-true Nautilus pompilius locomotion — not Cup mantle jet, not window-play RISE); aperture soft-body emerges/retracts at the shell mouth (species-true protective/foraging posture — not Cup dens, not Sepia blot). Window-play RISE unchanged — never names `rise`. Ethogram keeps hide sit_hold; adds siphuncle/nacre/pinhole/fringe/hyponome/aperture softs + freeze (replaces thin rise/still). Amplitudes raised toward Rui richness; denser waits/weights; prefersHouseCry via nautilus.wav. Thank-yous chamber / pearl / quiet. Feed-happy after eat. Sleep, hide, leave, rest, card still win. Same map as desktop `nautilus-tricks.js`. True house-nautilus desk life — not Rui/cat/dog/rabbit/hamster/guinea_pig/turtle/goldfish/budgie/fox/penguin/parrot/ferret/hedgehog/chinchilla/axolotl/toucan/iguana/Sol/dragon/Vesper/phoenix/Ember/ball_python/Nori/corn_snake/Saffron/kingsnake/Bandit/green_tree_python/Jade/hognose/Bluff/garter/Sash/boa/Lula/milk_snake/Coral/rosy_boa/Blush/carpet_python/Atlas/octopus/Cup/cuttlefish/Sepia or *Dragon electrical (Relay/Fuse/Ground) clones. Avoids rise/flush/lid/mantle/sucker/jet/veil/tinker/papilla/ooze/drift/gulp/flare/dart/soak/tuck/paddle/gill/amble/plume/legend/fan/flash/latch/puff/unfurl/chart/climb/probe/canyon/crawl/siphon/pulse/slink/den/cork/nest/savor/settle/survey/snatch/band/funnel/tentacle/loom/wave/buoy/bone/pupil/chroma/hover/blot/strike/zebra name collisions with prior guests and nautilus window-play. Bird ultra (Soot→Ember) + Miso→Sepia done; Echo/budgie + Peck/penguin + Quill/parrot + Keel/toucan + Ember skip birds. Pulse / moon_jelly ultra done; Ochre / sea_star ultra done; next guest ultra is Tenant / hermit_crab. No cry inventing beyond house nautilus.wav prefer. Never retouch Rui sprites. */

export const TRICK_KEY = "nautilus";
export const TRICKS = ["spiral", "siphuncle", "nacre", "pinhole", "fringe", "hyponome", "aperture"] as const;
export const HAPPY = ["chamber", "pearl", "quiet"] as const;
export type NautilusTrickKind = (typeof TRICKS)[number];
export type NautilusHappyKind = (typeof HAPPY)[number];
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

export type NautilusTrick = {
  kind: NautilusTrickKind;
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

export type NautilusHappy = {
  kind: NautilusHappyKind;
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

export const HAPPY_DUR: Record<NautilusHappyKind, number> = {
  chamber: 1.55,
  pearl: 1.5,
  quiet: 1.42,
};

/** Spiral hold — Chamber rests in the coiled chambers. Not window-play RISE. Not Cup mantle plate. Not Sepia bone. */
export const SPIRAL_HOLD = 10.6;
export const RELEASE_S = 0.6;

export const DUR: Record<NautilusTrickKind, number> = {
  spiral: SPIRAL_HOLD + RELEASE_S,
  siphuncle: 1.78,
  nacre: 1.85,
  pinhole: 1.78,
  fringe: 1.92,
  hyponome: 2.05,
  aperture: 2.12,
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

export function nextTrickWait(justFinished: boolean, rand?: number, kind?: NautilusTrickKind) {
  const roll = rand == null ? Math.random() : rand;
  if (kind === "spiral") return 38 + roll * 24;
  if (kind === "hyponome" || kind === "aperture" || kind === "fringe") return 12 + roll * 9;
  if (kind === "siphuncle" || kind === "nacre" || kind === "pinhole") return 11 + roll * 8;
  return justFinished ? 8 + roll * 8 : 4 + roll * 7;
}

export function pickTrick(rand?: number, musicOn = false, lastKind?: NautilusTrickKind | null): NautilusTrickKind {
  if (musicOn) return "spiral";
  const roll = rand == null ? Math.random() : rand;
  const pool = TRICKS.filter((k) => k !== lastKind);
  const list = pool.length ? pool : [...TRICKS];
  const weights = list.map((k) =>
    k === "spiral" ? 0.55 : k === "hyponome" || k === "aperture" || k === "fringe" ? 1.15 : 1
  );
  let total = 0;
  for (let i = 0; i < weights.length; i++) total += weights[i]!;
  let r = roll * total;
  for (let i = 0; i < list.length; i++) {
    r -= weights[i]!;
    if (r <= 0) return list[i]!;
  }
  return list[list.length - 1] || "spiral";
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
  return key === TRICK_KEY || key === "chamber";
}

export function startThankYou(
  key: string | undefined | null,
  lastKind: NautilusHappyKind | string | null | undefined,
  x: number,
  facing: 1 | -1,
  flags?: TrickFlags,
) {
  if (!wantsThankYou(key)) return null;
  if (!happyCanStart(flags || { cmd: "idle" })) return null;
  const pick = pickHappy(lastKind as NautilusHappyKind | null | undefined);
  return { happy: beginHappy(pick, x, facing), kind: pick };
}

export function pickHappy(lastKind?: NautilusHappyKind | null, rand?: number) {
  const pool = HAPPY.filter((k) => k !== lastKind);
  const list = pool.length ? pool : [...HAPPY];
  const roll = rand == null ? Math.random() : rand;
  return list[Math.floor(roll * list.length)] || list[0];
}

export function beginHappy(kind: NautilusHappyKind | string, x: number, facing: 1 | -1): NautilusHappy {
  const name = (HAPPY as readonly string[]).indexOf(kind) >= 0 ? (kind as NautilusHappyKind) : "chamber";
  return {
    kind: name,
    happy: true,
    phase: "go",
    t: 0,
    x: x,
    lift: 0,
    rot: 0,
    anim: name === "chamber" ? "sit" : name === "pearl" ? "talk" : "sit",
    facing: facing == null ? 1 : facing,
    fromX: x,
  };
}

export function chamberPose(t: number) {
  const u = Math.max(0, Math.min(1, t / HAPPY_DUR.chamber));
  if (u < 0.16) {
    const s = u / 0.16;
    return { lift: s * 3.2, rot: s * 14, dx: 0, anim: "sit" as TrickAnim };
  }
  if (u < 0.78) {
    const coil = Math.sin(t * 2.4);
    return {
      lift: 3.2 + Math.abs(coil) * 1.8,
      rot: 14 + coil * 12,
      dx: coil * 0.45,
      anim: "sit" as TrickAnim,
    };
  }
  const s = (u - 0.78) / 0.22;
  return { lift: 2.4 * (1 - s), rot: 8 * (1 - s), dx: 0, anim: "idle" as TrickAnim };
}

export function pearlPose(t: number) {
  const u = Math.max(0, Math.min(1, t / HAPPY_DUR.pearl));
  if (u < 0.12) {
    const s = u / 0.12;
    return { lift: s * 2.6, rot: s * -18, dx: 0, anim: "talk" as TrickAnim };
  }
  if (u < 0.8) {
    const w = Math.sin(t * 2.6);
    return {
      lift: 2.6 + Math.abs(w) * 1.4,
      rot: -18 + w * 22,
      dx: w * 0.35,
      anim: "talk" as TrickAnim,
    };
  }
  const s = (u - 0.8) / 0.2;
  return { lift: 2.0 * (1 - s), rot: -12 * (1 - s), dx: 0, anim: "sit" as TrickAnim };
}

export function quietPose(t: number) {
  return {
    lift: Math.abs(Math.sin(t * 2.1)) * 2.2 + 2.4,
    rot: 8 + Math.sin(t * 2.8) * 14,
    dx: Math.sin(t * 1.6) * 0.4,
    anim: "sit" as TrickAnim,
  };
}

export function stepHappy(happy: NautilusHappy, dt: number, flags?: TrickFlags): NautilusHappy {
  if (!happy || happy.phase === "done") return happy;
  if (happyShouldAbort(flags)) {
    return { ...happy, phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true };
  }
  const next: NautilusHappy = { ...happy, t: happy.t + Math.max(0, dt) };
  const hold = HAPPY_DUR[next.kind];
  if (next.kind === "chamber") {
    const pose = chamberPose(next.t);
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "pearl") {
    const pose = pearlPose(next.t);
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else {
    const pose = quietPose(next.t);
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

export function beginTrick(kind: NautilusTrickKind, x: number, facing: 1 | -1): NautilusTrick {
  const anim: TrickAnim =
    kind === "spiral"
      ? "sit"
      : kind === "siphuncle"
        ? "walk"
        : kind === "nacre"
          ? "sit"
          : kind === "pinhole"
            ? "talk"
            : kind === "fringe"
              ? "play"
              : kind === "hyponome"
                ? "walk"
                : kind === "aperture"
                  ? "play"
                  : "sit";
  return {
    kind: kind,
    phase: kind === "spiral" ? "hold" : "go",
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

export function spiralPose(t: number) {
  const beat = Math.sin(t * 1.7) + 0.45 * Math.sin(t * 3.4);
  return {
    lift: 2.4 + Math.sin(t * 1.7) * 2.8 + Math.abs(Math.sin(t * 3.4)) * 1.6,
    rot: -18 + Math.sin(t * 2.4) * 16 + beat * 8,
  };
}

export function releasePose(t: number) {
  const u = Math.max(0, Math.min(1, t / RELEASE_S));
  return {
    lift: (2.4 + 2.8) * (1 - Math.sin(u * Math.PI * 0.5)),
    rot: -18 * (1 - u),
  };
}

export function siphunclePose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.siphuncle));
  if (u < 0.12) {
    const s = smoothstep(u / 0.12);
    return { x: fromX, lift: s * 3.6, rot: s * 10 * facing, anim: "walk" as TrickAnim };
  }
  if (u < 0.72) {
    const s = (u - 0.12) / 0.6;
    const gas = Math.sin(s * Math.PI * 2.6);
    const tube = Math.sin(s * Math.PI * 1.4);
    return {
      x: fromX + facing * tube * 0.55,
      lift: 3.6 + gas * 2.0,
      rot: facing * (10 + gas * 14 + tube * 6),
      anim: "walk" as TrickAnim,
    };
  }
  const s = smoothstep((u - 0.72) / 0.28);
  return {
    x: fromX,
    lift: 3.2 * (1 - s),
    rot: facing * (6 * (1 - s)),
    anim: "sit" as TrickAnim,
  };
}

export function nacrePose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.nacre));
  if (u < 0.14) {
    const s = smoothstep(u / 0.14);
    return { x: fromX, lift: s * 2.8, rot: s * 14 * facing, anim: "sit" as TrickAnim };
  }
  if (u < 0.7) {
    const s = (u - 0.14) / 0.56;
    const sheen = Math.sin(s * Math.PI * 3.4);
    return {
      x: fromX + facing * sheen * 0.55,
      lift: 2.8 + Math.abs(sheen) * 1.8,
      rot: facing * (14 + sheen * 16),
      anim: "sit" as TrickAnim,
    };
  }
  const s = smoothstep((u - 0.7) / 0.3);
  return {
    x: fromX,
    lift: 2.2 * (1 - s),
    rot: facing * (8 * (1 - s)),
    anim: "idle" as TrickAnim,
  };
}

export function pinholePose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.pinhole));
  if (u < 0.14) {
    const s = smoothstep(u / 0.14);
    return { x: fromX, lift: s * 2.6, rot: s * -20 * facing, anim: "talk" as TrickAnim };
  }
  if (u < 0.55) {
    const s = (u - 0.14) / 0.41;
    const w = Math.sin(s * Math.PI * 2.2);
    return {
      x: fromX + facing * w * 0.55,
      lift: 2.6 + Math.abs(w) * 1.6,
      rot: facing * (-20 + w * 24),
      anim: "talk" as TrickAnim,
    };
  }
  if (u < 0.78) {
    const s = (u - 0.55) / 0.23;
    return {
      x: fromX,
      lift: 2.6 - s * 0.5,
      rot: facing * (-8 + s * 4),
      anim: "sit" as TrickAnim,
    };
  }
  const s = smoothstep((u - 0.78) / 0.22);
  return {
    x: fromX,
    lift: 1.8 * (1 - s),
    rot: facing * (-4 * (1 - s)),
    anim: "idle" as TrickAnim,
  };
}

export function fringePose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.fringe));
  if (u < 0.1) {
    const s = smoothstep(u / 0.1);
    return { x: fromX, lift: s * 3.4, rot: s * -12 * facing, anim: "play" as TrickAnim };
  }
  if (u < 0.72) {
    const s = (u - 0.1) / 0.62;
    const wave = Math.sin(s * Math.PI * 4.8);
    const soft = Math.sin(s * Math.PI * 2.2);
    return {
      x: fromX + facing * soft * 0.9,
      lift: 3.4 + Math.abs(wave) * 2.2,
      rot: facing * (-12 + wave * 18 + soft * 8),
      anim: "play" as TrickAnim,
    };
  }
  const s = smoothstep((u - 0.72) / 0.28);
  return {
    x: fromX,
    lift: 2.8 * (1 - s),
    rot: facing * (-6 * (1 - s)),
    anim: "idle" as TrickAnim,
  };
}

export function hyponomePose(t: number, fromX: number, facing: 1 | -1) {
  // Hyponome funnel jet — species-true Nautilus pompilius locomotion. Not Cup mantle jet. Not window-play RISE.
  const u = Math.max(0, Math.min(1, t / DUR.hyponome));
  if (u < 0.12) {
    const s = smoothstep(u / 0.12);
    return { x: fromX + facing * s * 0.6, lift: s * 2.4, rot: s * 8 * facing, anim: "walk" as TrickAnim };
  }
  if (u < 0.38) {
    const s = smoothstep((u - 0.12) / 0.26);
    return {
      x: fromX + facing * (0.6 + s * 5.2),
      lift: 2.4 + s * 1.6,
      rot: facing * (8 - s * 4),
      anim: "play" as TrickAnim,
    };
  }
  if (u < 0.72) {
    const s = (u - 0.38) / 0.34;
    const pulse = Math.sin(s * Math.PI * 2.8);
    return {
      x: fromX + facing * (5.8 - s * 2.4 + pulse * 0.45),
      lift: 4.0 + Math.abs(pulse) * 1.8,
      rot: facing * (4 + pulse * 14),
      anim: "play" as TrickAnim,
    };
  }
  const s = smoothstep((u - 0.72) / 0.28);
  return {
    x: fromX + facing * (3.4 * (1 - s)),
    lift: 2.8 * (1 - s),
    rot: facing * (4 * (1 - s)),
    anim: "idle" as TrickAnim,
  };
}

export function aperturePose(t: number, fromX: number, facing: 1 | -1) {
  // Soft-body aperture emerge/retract — species-true shell-mouth posture. Not Cup dens. Not Sepia blot.
  const u = Math.max(0, Math.min(1, t / DUR.aperture));
  if (u < 0.12) {
    const s = smoothstep(u / 0.12);
    return { x: fromX, lift: s * 3.2, rot: s * -14 * facing, anim: "play" as TrickAnim };
  }
  if (u < 0.45) {
    const s = smoothstep((u - 0.12) / 0.33);
    return {
      x: fromX + facing * s * 1.2,
      lift: 3.2 + s * 1.4,
      rot: facing * (-14 + s * 10),
      anim: "play" as TrickAnim,
    };
  }
  if (u < 0.72) {
    const s = (u - 0.45) / 0.27;
    const quiver = Math.sin(s * Math.PI * 3.6);
    return {
      x: fromX + facing * (1.2 - s * 0.6 + quiver * 0.35),
      lift: 4.6 + Math.abs(quiver) * 1.6,
      rot: facing * (-4 + quiver * 16),
      anim: "sit" as TrickAnim,
    };
  }
  const s = smoothstep((u - 0.72) / 0.28);
  return {
    x: fromX + facing * (0.6 * (1 - s)),
    lift: 3.0 * (1 - s),
    rot: facing * (-6 * (1 - s)),
    anim: "idle" as TrickAnim,
  };
}

export function stepTrick(trick: NautilusTrick, dt: number, flags?: TrickFlags): NautilusTrick {
  if (!trick || trick.phase === "done") return trick;
  if (
    shouldAbort(flags) &&
    trick.kind !== "siphuncle" &&
    trick.kind !== "nacre" &&
    trick.kind !== "fringe" &&
    trick.kind !== "hyponome" &&
    trick.kind !== "aperture"
  ) {
    return { ...trick, phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true };
  }
  const next: NautilusTrick = { ...trick, t: trick.t + Math.max(0, dt) };
  if (next.kind === "spiral") {
    if (next.t < SPIRAL_HOLD) {
      const pose = spiralPose(next.t);
      next.phase = "hold";
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = "sit";
      return next;
    }
    if (next.t < SPIRAL_HOLD + RELEASE_S) {
      const pose = releasePose(next.t - SPIRAL_HOLD);
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
  if (next.kind === "siphuncle") {
    const pose = siphunclePose(next.t, fromX, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "nacre") {
    const pose = nacrePose(next.t, fromX, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "pinhole") {
    const pose = pinholePose(next.t, fromX, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "fringe") {
    const pose = fringePose(next.t, fromX, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "hyponome") {
    const pose = hyponomePose(next.t, fromX, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else {
    const pose = aperturePose(next.t, fromX, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  }
  if (u >= 1) return { ...next, phase: "done", lift: 0, rot: 0, anim: "idle" };
  return next;
}
