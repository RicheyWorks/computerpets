/** Pulse ground tricks while idle — ultra-polish pass. House moon jelly — bell / oral / lucent / trail / medusa / rhopalium / horseshoe personality (umbrella-bell contractions, four oral-arm drape, translucence shimmer, trailing tentacle sway, gentle medusa desk life, rhopalia sensory clubs, four horseshoe gonads through the bell; not Cup mantle dens, Sepia cuttlebone chromatophores, Chamber spiral chambers, or Coin bowl-drift). Bell rides soft umbrella pulses; oral drapes the four oral arms; lucent shimmers the gelatin; trail sways marginal tentacles; medusa glides desk-life; rhopalium tips the eight sensory clubs (species-true Aurelia aurita orientation/light sense — not trail tentacles, not lucent sheen, not window-play CHIME); horseshoe shows the four horseshoe gonads through the bell (species-true Aurelia diagnostic — not oral arms, not Chamber nacre, not Cup papilla). Window-play CHIME unchanged — never names `chime`. Ethogram keeps hide sit_hold; adds oral/lucent/trail/medusa/rhopalium/horseshoe softs + freeze (replaces thin pulse/drift). Amplitudes raised toward Rui richness; denser waits/weights; prefersHouseCry via moon_jelly.wav. Thank-yous halo / lumen / gel. Feed-happy after eat. Sleep, hide, leave, rest, card still win. Same map as desktop `moon_jelly-tricks.js`. True house-moon-jelly desk life — not Rui/cat/dog/rabbit/hamster/guinea_pig/turtle/goldfish/budgie/fox/penguin/parrot/ferret/hedgehog/chinchilla/axolotl/toucan/iguana/Sol/dragon/Vesper/phoenix/Ember/ball_python/Nori/corn_snake/Saffron/kingsnake/Bandit/green_tree_python/Jade/hognose/Bluff/garter/Sash/boa/Lula/milk_snake/Coral/rosy_boa/Blush/carpet_python/Atlas/octopus/Cup/cuttlefish/Sepia/nautilus/Chamber or *Dragon electrical (Relay/Fuse/Ground) clones. Avoids chime/flush/lid/rise/mantle/sucker/jet/veil/tinker/papilla/ooze/drift/gulp/flare/dart/soak/tuck/paddle/gill/amble/plume/legend/fan/flash/latch/puff/unfurl/chart/climb/probe/canyon/crawl/siphon/pulse/slink/den/cork/nest/savor/settle/survey/snatch/band/funnel/tentacle/loom/wave/buoy/bone/pupil/chroma/hover/blot/strike/zebra/spiral/siphuncle/nacre/pinhole/fringe/hyponome/aperture name collisions with prior guests and moon_jelly window-play. Bird ultra (Soot→Ember) + Miso→Chamber done; Echo/budgie + Peck/penguin + Quill/parrot + Keel/toucan + Ember skip birds. Next guest ultra is Ochre / sea_star. No cry inventing beyond house moon_jelly.wav prefer. Never retouch Rui sprites. */
export const TRICK_KEY = "moon_jelly";
export const TRICKS = ["bell", "oral", "lucent", "trail", "medusa", "rhopalium", "horseshoe"] as const;
export const HAPPY = ["halo", "lumen", "gel"] as const;
export type MoonJellyTrickKind = (typeof TRICKS)[number];
export type MoonJellyHappyKind = (typeof HAPPY)[number];
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

export type MoonJellyTrick = {
  kind: MoonJellyTrickKind;
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

export type MoonJellyHappy = {
  kind: MoonJellyHappyKind;
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

export const HAPPY_DUR: Record<MoonJellyHappyKind, number> = {
  halo: 1.55,
  lumen: 1.5,
  gel: 1.42,
};

/** Bell hold — Pulse rests in soft umbrella contractions. Not window-play CHIME. Not Coin drift. Not Chamber spiral. Not Cup mantle. */
export const BELL_HOLD = 10.6;
export const RELEASE_S = 0.6;

export const DUR: Record<MoonJellyTrickKind, number> = {
  bell: BELL_HOLD + RELEASE_S,
  oral: 1.78,
  lucent: 1.85,
  trail: 1.92,
  medusa: 1.78,
  rhopalium: 2.05,
  horseshoe: 2.12,
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

export function nextTrickWait(justFinished: boolean, rand?: number, kind?: MoonJellyTrickKind) {
  const roll = rand == null ? Math.random() : rand;
  if (kind === "bell") return 38 + roll * 24;
  if (kind === "rhopalium" || kind === "horseshoe" || kind === "trail") return 12 + roll * 9;
  if (kind === "oral" || kind === "lucent" || kind === "medusa") return 11 + roll * 8;
  return justFinished ? 8 + roll * 8 : 4 + roll * 7;
}

export function pickTrick(rand?: number, musicOn = false, lastKind?: MoonJellyTrickKind | null): MoonJellyTrickKind {
  if (musicOn) return "bell";
  const roll = rand == null ? Math.random() : rand;
  const pool = TRICKS.filter((k) => k !== lastKind);
  const list = pool.length ? pool : [...TRICKS];
  const weights = list.map((k) =>
    k === "bell" ? 0.55 : k === "rhopalium" || k === "horseshoe" || k === "trail" ? 1.15 : 1
  );
  let total = 0;
  for (let i = 0; i < weights.length; i++) total += weights[i]!;
  let r = roll * total;
  for (let i = 0; i < list.length; i++) {
    r -= weights[i]!;
    if (r <= 0) return list[i]!;
  }
  return list[list.length - 1] || "bell";
}

export function happyCanStart(state: TrickFlags | undefined) {
  if (!state) return false;
  if (state.asleep || state.hidden || state.leaving) return false;
  const cmd = String(state.cmd || "");
  if (cmd === "sleep" || cmd === "leave" || cmd === "hide") return false;
  return true;
}

export function happyShouldAbort(state: TrickFlags | undefined) {
  if (!state) return true;
  if (state.asleep || state.hidden || state.leaving) return true;
  const cmd = String(state.cmd || "");
  if (cmd === "sleep" || cmd === "leave" || cmd === "hide") return true;
  return false;
}

export function wantsThankYou(key: string | undefined | null) {
  return key === TRICK_KEY || key === "pulse";
}

export function startThankYou(
  key: string | undefined | null,
  lastKind: MoonJellyHappyKind | string | null | undefined,
  x: number,
  facing: 1 | -1,
  flags?: TrickFlags,
) {
  if (!wantsThankYou(key)) return null;
  if (!happyCanStart(flags || { cmd: "idle" })) return null;
  const pick = pickHappy(lastKind as MoonJellyHappyKind | null | undefined);
  return { happy: beginHappy(pick, x, facing), kind: pick };
}

export function pickHappy(lastKind?: MoonJellyHappyKind | null, rand?: number) {
  const pool = HAPPY.filter((k) => k !== lastKind);
  const list = pool.length ? pool : [...HAPPY];
  const roll = rand == null ? Math.random() : rand;
  return list[Math.floor(roll * list.length)] || list[0];
}

export function beginHappy(kind: MoonJellyHappyKind | string, x: number, facing: 1 | -1): MoonJellyHappy {
  const name = (HAPPY as readonly string[]).indexOf(kind) >= 0 ? (kind as MoonJellyHappyKind) : "halo";
  return {
    kind: name,
    happy: true,
    phase: "go",
    t: 0,
    x: x,
    lift: 0,
    rot: 0,
    anim: name === "halo" ? "sit" : name === "lumen" ? "talk" : "sit",
    facing: facing == null ? 1 : facing,
    fromX: x,
  };
}

export function haloPose(t: number) {
  const u = Math.max(0, Math.min(1, t / HAPPY_DUR.halo));
  if (u < 0.16) {
    const s = u / 0.16;
    return { lift: s * 3.2, rot: s * 14, dx: 0, anim: "sit" as TrickAnim };
  }
  if (u < 0.78) {
    const ring = Math.sin(t * 2.4);
    return {
      lift: 3.2 + Math.abs(ring) * 1.8,
      rot: 14 + ring * 12,
      dx: ring * 0.45,
      anim: "sit" as TrickAnim,
    };
  }
  const s = (u - 0.78) / 0.22;
  return { lift: 2.4 * (1 - s), rot: 8 * (1 - s), dx: 0, anim: "idle" as TrickAnim };
}

export function lumenPose(t: number) {
  const u = Math.max(0, Math.min(1, t / HAPPY_DUR.lumen));
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

export function gelPose(t: number) {
  return {
    lift: Math.abs(Math.sin(t * 2.1)) * 2.2 + 2.4,
    rot: 8 + Math.sin(t * 2.8) * 14,
    dx: Math.sin(t * 1.6) * 0.4,
    anim: "sit" as TrickAnim,
  };
}

export function stepHappy(happy: MoonJellyHappy, dt: number, flags?: TrickFlags): MoonJellyHappy {
  if (!happy || happy.phase === "done") return happy;
  if (happyShouldAbort(flags)) {
    return { ...happy, phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true };
  }
  const next: MoonJellyHappy = { ...happy, t: happy.t + Math.max(0, dt) };
  const hold = HAPPY_DUR[next.kind];
  const pose =
    next.kind === "halo" ? haloPose(next.t) : next.kind === "lumen" ? lumenPose(next.t) : gelPose(next.t);
  next.lift = pose.lift;
  next.rot = pose.rot;
  next.anim = pose.anim;
  if (pose.dx) next.x = (happy.fromX != null ? happy.fromX : happy.x) + happy.facing * pose.dx;
  if (next.t >= hold) return { ...next, phase: "done", lift: 0, rot: 0, anim: "idle" };
  return next;
}

export function sleepHoldFrame(_key?: string | null, _frameCount?: number) {
  return null;
}

export function beginTrick(kind: MoonJellyTrickKind, x: number, facing: 1 | -1): MoonJellyTrick {
  const anim: TrickAnim =
    kind === "bell"
      ? "sit"
      : kind === "oral"
        ? "talk"
        : kind === "lucent"
          ? "sit"
          : kind === "trail"
            ? "play"
            : kind === "medusa"
              ? "walk"
              : kind === "rhopalium"
                ? "talk"
                : kind === "horseshoe"
                  ? "play"
                  : "sit";
  return {
    kind: kind,
    phase: kind === "bell" ? "hold" : "go",
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

export function bellPose(t: number) {
  const beat = Math.sin(t * 1.7) + 0.45 * Math.sin(t * 3.4);
  return {
    lift: 2.4 + Math.sin(t * 1.7) * 2.8 + Math.abs(Math.sin(t * 3.4)) * 1.6,
    rot: -18 + Math.sin(t * 2.4) * 16 + beat * 8,
  };
}

export function releasePose(t: number) {
  const u = Math.max(0, Math.min(1, t / RELEASE_S));
  return { lift: (2.4 + 2.8) * (1 - Math.sin(u * Math.PI * 0.5)), rot: -18 * (1 - u) };
}

export function oralPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.oral));
  if (u < 0.12) {
    const s = smoothstep(u / 0.12);
    return { x: fromX, lift: s * 3.6, rot: s * -16 * facing, anim: "talk" as TrickAnim };
  }
  if (u < 0.7) {
    const s = (u - 0.12) / 0.58;
    const arm = Math.sin(s * Math.PI * 3.2);
    const drape = Math.sin(s * Math.PI * 1.6);
    return {
      x: fromX + facing * drape * 0.85,
      lift: 3.6 + Math.abs(arm) * 1.8,
      rot: facing * (-16 + arm * 18 + drape * 6),
      anim: "talk" as TrickAnim,
    };
  }
  const s = smoothstep((u - 0.7) / 0.3);
  return {
    x: fromX,
    lift: 2.8 * (1 - s),
    rot: facing * (-6 * (1 - s)),
    anim: "sit" as TrickAnim,
  };
}

export function lucentPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.lucent));
  if (u < 0.14) {
    const s = smoothstep(u / 0.14);
    return { x: fromX, lift: s * 3.2, rot: s * 10 * facing, anim: "sit" as TrickAnim };
  }
  if (u < 0.72) {
    const s = (u - 0.14) / 0.58;
    const sheen = Math.sin(s * Math.PI * 3.6);
    return {
      x: fromX + facing * sheen * 0.55,
      lift: 3.2 + Math.abs(sheen) * 2.0,
      rot: facing * (10 + sheen * 14),
      anim: "sit" as TrickAnim,
    };
  }
  const s = smoothstep((u - 0.72) / 0.28);
  return {
    x: fromX,
    lift: 2.6 * (1 - s),
    rot: facing * (5 * (1 - s)),
    anim: "idle" as TrickAnim,
  };
}

export function trailPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.trail));
  if (u < 0.1) {
    const s = smoothstep(u / 0.1);
    return { x: fromX, lift: s * 3.4, rot: s * -12 * facing, anim: "play" as TrickAnim };
  }
  if (u < 0.72) {
    const s = (u - 0.1) / 0.62;
    const wave = Math.sin(s * Math.PI * 5.2);
    const soft = Math.sin(s * Math.PI * 2.0);
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

export function medusaPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.medusa));
  if (u < 0.12) {
    const s = smoothstep(u / 0.12);
    return { x: fromX, lift: s * 3.6, rot: s * 10 * facing, anim: "walk" as TrickAnim };
  }
  if (u < 0.7) {
    const s = (u - 0.12) / 0.58;
    const bob = Math.sin(s * Math.PI * 2.4);
    const glide = Math.sin(s * Math.PI * 1.2);
    return {
      x: fromX + facing * glide * 1.1,
      lift: 3.6 + bob * 1.8,
      rot: facing * (10 + bob * 12 + glide * 6),
      anim: "walk" as TrickAnim,
    };
  }
  const s = smoothstep((u - 0.7) / 0.3);
  return {
    x: fromX,
    lift: 2.8 * (1 - s),
    rot: facing * (4 * (1 - s)),
    anim: "sit" as TrickAnim,
  };
}

export function rhopaliumPose(t: number, fromX: number, facing: 1 | -1) {
  // Rhopalia sensory clubs — species-true Aurelia aurita orientation/light. Not trail. Not CHIME.
  const u = Math.max(0, Math.min(1, t / DUR.rhopalium));
  if (u < 0.12) {
    const s = smoothstep(u / 0.12);
    return { x: fromX + facing * s * 0.6, lift: s * 2.4, rot: s * 8 * facing, anim: "talk" as TrickAnim };
  }
  if (u < 0.38) {
    const s = smoothstep((u - 0.12) / 0.26);
    return {
      x: fromX + facing * (0.6 + s * 5.2),
      lift: 2.4 + s * 1.6,
      rot: facing * (8 - s * 4),
      anim: "talk" as TrickAnim,
    };
  }
  if (u < 0.72) {
    const s = (u - 0.38) / 0.34;
    const tip = Math.sin(s * Math.PI * 2.8);
    return {
      x: fromX + facing * (5.8 - s * 2.4 + tip * 0.45),
      lift: 4.0 + Math.abs(tip) * 1.8,
      rot: facing * (4 + tip * 14),
      anim: "talk" as TrickAnim,
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

export function horseshoePose(t: number, fromX: number, facing: 1 | -1) {
  // Four horseshoe gonads through the bell — species-true Aurelia diagnostic. Not oral. Not nacre.
  const u = Math.max(0, Math.min(1, t / DUR.horseshoe));
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
    const moon = Math.sin(s * Math.PI * 3.6);
    return {
      x: fromX + facing * (1.2 - s * 0.6 + moon * 0.35),
      lift: 4.6 + Math.abs(moon) * 1.6,
      rot: facing * (-4 + moon * 16),
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

export function stepTrick(trick: MoonJellyTrick, dt: number, flags?: TrickFlags): MoonJellyTrick {
  if (!trick || trick.phase === "done") return trick;
  if (
    shouldAbort(flags) &&
    trick.kind !== "oral" &&
    trick.kind !== "lucent" &&
    trick.kind !== "trail" &&
    trick.kind !== "medusa" &&
    trick.kind !== "rhopalium" &&
    trick.kind !== "horseshoe"
  ) {
    return { ...trick, phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true };
  }
  const next: MoonJellyTrick = { ...trick, t: trick.t + Math.max(0, dt) };
  if (next.kind === "bell") {
    if (next.t < BELL_HOLD) {
      const pose = bellPose(next.t);
      next.phase = "hold";
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = "sit";
      return next;
    }
    if (next.t < BELL_HOLD + RELEASE_S) {
      const pose = releasePose(next.t - BELL_HOLD);
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
  if (next.kind === "oral") {
    const pose = oralPose(next.t, fromX, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "lucent") {
    const pose = lucentPose(next.t, fromX, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "trail") {
    const pose = trailPose(next.t, fromX, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "medusa") {
    const pose = medusaPose(next.t, fromX, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "rhopalium") {
    const pose = rhopaliumPose(next.t, fromX, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else {
    const pose = horseshoePose(next.t, fromX, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  }
  if (u >= 1) return { ...next, phase: "done", lift: 0, rot: 0, anim: "idle" };
  return next;
}
