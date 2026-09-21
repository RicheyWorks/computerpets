/** Sash ground tricks while idle — ultra-polish pass. House common garter — seam / rounds / moss / fork / lap / ribbon / creek personality (stripe/patrol/moss desk life; damp-moss desk officer). Seam rests the three longitudinal lines as a desk seam; rounds patrols a short blotter circuit; moss claims a damp blotter patch; fork tongue-flick scent check; lap quick desk circuit; ribbon side-stripe flash (roll to show the bright lateral line — not Bandit stripe, not Parrot flash); creek damp-moss waterline wiggle (edge undulation like a creek bank — not Lula loop, not window-play PATROL). Window-play PATROL unchanged — never names `patrol`. Ethogram retires thin lone `patrol`/`dart` (seam covers rest); keeps tongue; adds seam/rounds/moss/fork/ribbon/creek softs + freeze. Nori owns orb/nook/taste/inch/unroll/loom/weave and savor/nestle/center; Saffron owns scribble/gap/comma/probe/canyon/blotter/pencil and clause/spice/cord; Bandit owns stripe/audit/verdict/plumb/raid/band/drawer and tribute/docket/seal; Jade owns bracelet/sway/jewel/heat/bough/liana/arbor and pendant/treaty/emerald; Bluff owns hood/feign/shovel/gape/encore/quiver/upright and aside/cue/ovation; hedgehog owns curl/ball; volt window-play owns coil; ferret owns noodle/puff; Ember owns settle/shine/dip; Vesper owns fold/thrum/glow; Sol owns flick/sun/press; Lula window-play owns loop; Echo window-play owns perch; Fox window-play owns scent; Parrot owns flash; Sundew owns dew. Guest slug Sash / key garter — accept "garter" and "sash". Amplitudes raised toward Rui richness; denser waits/weights; prefersHouseCry via garter.wav. Thank-yous copy / brief / visa. Feed-happy after eat. Sleep, hide, leave, rest, card, ribbon still win. Same map as desktop `garter-tricks.js`. True house-common-garter desk life — not Rui/cat/dog/rabbit/hamster/guinea_pig/turtle/goldfish/budgie/fox/penguin/parrot/ferret/hedgehog/chinchilla/axolotl/toucan/iguana/Sol/dragon/Vesper/phoenix/Ember/ball_python/Nori/corn_snake/Saffron/kingsnake/Bandit/green_tree_python/Jade/hognose/Bluff or *Dragon electrical (Relay/Fuse/Ground) clones. Avoids patrol/stripe/hood/feign/shovel/gape/encore/quiver/upright/flip/saddle/drape/inspect/write/orb/nook/taste/inch/unroll/loom/weave/bun/ball/coil/curl/bask/loaf/potato/tuck/hide/settle/shine/dip/sprawl/guard/smolder/claim/fold/thrum/glow/incline/sun/dewlap/cinder/blaze/shed/lift/return/flick/warm/thread/dart/noodle/savor/nestle/center/scribble/gap/comma/probe/canyon/blotter/pencil/clause/spice/cord/audit/verdict/plumb/raid/tribute/docket/seal/band/drawer/bracelet/sway/jewel/heat/bough/pendant/treaty/emerald/liana/arbor/aside/cue/ovation/root/flare/dig/loop/perch/hang/clasp/scent/flash/dew/officer name collisions. Bird ultra (Soot→Ember) + Miso→Bluff done; Echo/budgie + Peck/penguin + Quill/parrot + Keel/toucan + Ember skip birds. Amplitudes raised toward Rui richness; denser waits/weights (SEAM_HOLD=11.2 RELEASE_S=1.18). Lula densified. Coral densified. Blush densified. Atlas densified. Cup densified. Sepia densified. Next leftover Chamber / nautilus. No cry inventing beyond house garter.wav prefer. Never retouch Rui sprites. */
export const TRICK_KEY = "garter";
export const TRICKS = ["seam", "rounds", "moss", "fork", "lap", "ribbon", "creek"] as const;
export const HAPPY = ["copy", "brief", "visa"] as const;
export type GarterTrickKind = (typeof TRICKS)[number];
export type GarterHappyKind = (typeof HAPPY)[number];
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

export type GarterTrick = {
  kind: GarterTrickKind;
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

export type GarterHappy = {
  kind: GarterHappyKind;
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

export const HAPPY_DUR: Record<GarterHappyKind, number> = {
  copy: 1.55,
  brief: 1.6,
  visa: 1.58,
};

/** Seam hold — Sash rests the three longitudinal lines as a desk seam. Not window-play PATROL. Not Bandit stripe. */
export const SEAM_HOLD = 11.2;
export const RELEASE_S = 1.18;

export const DUR: Record<GarterTrickKind, number> = {
  seam: SEAM_HOLD + RELEASE_S,
  rounds: 1.86,
  moss: 1.78,
  fork: 1.72,
  lap: 1.94,
  ribbon: 2.02,
  creek: 2.1,
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

export function nextTrickWait(justFinished: boolean, rand?: number, kind?: GarterTrickKind) {
  const roll = rand == null ? Math.random() : rand;
  if (kind === "seam") return 40 + roll * 26;
  if (kind === "rounds" || kind === "creek" || kind === "fork") return 12.8 + roll * 9.4;
  if (kind === "moss" || kind === "lap" || kind === "ribbon") return 11.6 + roll * 8.5;
  return justFinished ? 8.5 + roll * 8.4 : 4.4 + roll * 7.4;
}

export function pickTrick(rand?: number, musicOn = false, lastKind?: GarterTrickKind | null): GarterTrickKind {
  if (musicOn) return "seam";
  const roll = rand == null ? Math.random() : rand;
  const pool = TRICKS.filter((k) => k !== lastKind);
  const list = pool.length ? pool : [...TRICKS];
  const weights = list.map((k) =>
    k === "seam" ? 0.72 : k === "rounds" || k === "creek" || k === "fork" ? 1.28 : k === "moss" || k === "lap" ? 1.18 : 1.08
  );
  let total = 0;
  for (let i = 0; i < weights.length; i++) total += weights[i]!;
  let r = roll * total;
  for (let i = 0; i < list.length; i++) {
    r -= weights[i]!;
    if (r <= 0) return list[i]!;
  }
  return list[list.length - 1] || "seam";
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
  return key === TRICK_KEY || key === "sash";
}

export function startThankYou(
  key: string | undefined | null,
  lastKind: GarterHappyKind | string | null | undefined,
  x: number,
  facing: 1 | -1,
  flags?: TrickFlags,
) {
  if (!wantsThankYou(key)) return null;
  if (!happyCanStart(flags || { cmd: "idle" })) return null;
  const pick = pickHappy(lastKind as GarterHappyKind | null | undefined);
  return { happy: beginHappy(pick, x, facing), kind: pick };
}

export function pickHappy(lastKind?: GarterHappyKind | null, rand?: number): GarterHappyKind {
  const pool = HAPPY.filter((k) => k !== lastKind);
  const list = pool.length ? pool : [...HAPPY];
  const roll = rand == null ? Math.random() : rand;
  return list[Math.floor(roll * list.length)] ?? list[0]!;
}

export function beginHappy(kind: GarterHappyKind, x: number, facing: 1 | -1 = 1): GarterHappy {
  const name: GarterHappyKind = HAPPY.includes(kind) ? kind : "copy";
  return {
    kind: name,
    happy: true,
    phase: "go",
    t: 0,
    x,
    lift: 0,
    rot: 0,
    anim: name === "copy" ? "sit" : name === "brief" ? "talk" : "sit",
    facing,
    fromX: x,
  };
}

export function copyPose(t: number) {
  const u = Math.max(0, Math.min(1, t / HAPPY_DUR.copy));
  if (u < 0.14) {
    const s = u / 0.14;
    return { lift: s * 5.04, rot: s * -19.2, dx: 0, anim: "sit" as const };
  }
  if (u < 0.8) {
    return {
      lift: 5.04 + Math.abs(Math.sin(t * 4.6)) * 4.08,
      rot: -19.2 + Math.sin(t * 3.4) * 16.8,
      dx: Math.sin(t * 2.1) * 1.32,
      anim: "sit" as const,
    };
  }
  const s = (u - 0.8) / 0.2;
  return { lift: 5.04 * (1 - s), rot: -19.2 * (1 - s), dx: 0, anim: "idle" as const };
}

export function briefPose(t: number) {
  const u = Math.max(0, Math.min(1, t / HAPPY_DUR.brief));
  if (u < 0.12) {
    const s = u / 0.12;
    return { lift: s * 5.52, rot: s * 21.6, dx: 0, anim: "talk" as const };
  }
  if (u < 0.78) {
    const tick = Math.sin(t * 7.2);
    return {
      lift: 5.52 + Math.abs(tick) * 3.84,
      rot: 21.6 + tick * 19.2,
      dx: tick * 1.44,
      anim: "talk" as const,
    };
  }
  const s = (u - 0.78) / 0.22;
  return { lift: 5.52 * (1 - s), rot: 21.6 * (1 - s), dx: 0, anim: "sit" as const };
}

export function visaPose(t: number) {
  return {
    lift: Math.abs(Math.sin(t * 3.4)) * 4.56 + 2.4,
    rot: -19.2 + Math.sin(t * 2.8) * 16.8,
    dx: Math.sin(t * 2.2) * 1.68,
    anim: "sit" as const,
  };
}

export function stepHappy(happy: GarterHappy | null | undefined, dt: number, flags?: TrickFlags) {
  if (!happy || happy.phase === "done") return happy;
  if (happyShouldAbort(flags)) {
    return { ...happy, phase: "done" as const, t: 0, lift: 0, rot: 0, anim: "idle" as const, abort: true };
  }
  const next: GarterHappy = { ...happy, t: happy.t + Math.max(0, dt) };
  const hold = HAPPY_DUR[next.kind];
  if (next.kind === "copy") {
    const pose = copyPose(next.t);
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "brief") {
    const pose = briefPose(next.t);
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else {
    const pose = visaPose(next.t);
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  }
  if (next.t >= hold) return { ...next, phase: "done" as const, lift: 0, rot: 0, anim: "idle" as const };
  return next;
}

/** Sash has no Rui-style sleep-frame hold. */
export function sleepHoldFrame(_key?: string | null, _frameCount?: number) {
  return null;
}

export function beginTrick(kind: GarterTrickKind, x: number, facing: 1 | -1 = 1): GarterTrick {
  const anim: TrickAnim =
    kind === "seam"
      ? "sit"
      : kind === "rounds"
        ? "walk"
        : kind === "moss"
          ? "sit"
          : kind === "fork"
            ? "talk"
            : kind === "lap"
              ? "play"
              : kind === "ribbon"
                ? "play"
                : kind === "creek"
                  ? "play"
                  : "sit";
  return {
    kind,
    phase: kind === "seam" ? "hold" : "go",
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

/** Seam — three longitudinal lines as a desk seam. Soft rock. Not window-play PATROL. Not Bandit stripe. */
export function seamPose(t: number) {
  return {
    lift: 2.64 + Math.sin(t * 1.7) * 3.36 + Math.abs(Math.sin(t * 3.4)) * 1.92,
    rot: -26.4 + Math.sin(t * 2.4) * 21.6 + Math.sin(t * 4.6) * 12,
  };
}

/** Soft unseam out of the desk seam; stays on the blotter. Not window-play leave. */
export function releasePose(t: number) {
  const u = Math.max(0, Math.min(1, t / RELEASE_S));
  return { lift: (2.64 + 3.36) * (1 - Math.sin(u * Math.PI * 0.5)), rot: -26.4 * (1 - u) };
}

/** Rounds — short blotter circuit. Not window-play PATROL. Not Bandit raid. */
export function roundsPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.rounds));
  if (u < 0.12) {
    const s = smoothstep(u / 0.12);
    return { x: fromX + facing * s * 2.88, lift: s * 3.36, rot: s * 16.8 * facing, anim: "walk" as const };
  }
  if (u < 0.5) {
    const s = (u - 0.12) / 0.38;
    return {
      x: fromX + facing * (2.88 + smoothstep(s) * 8.64),
      lift: 3.36 + Math.sin(s * Math.PI * 2.2) * 2.88,
      rot: facing * (16.8 + Math.sin(s * Math.PI * 3) * 19.2),
      anim: "walk" as const,
    };
  }
  if (u < 0.78) {
    const s = (u - 0.5) / 0.28;
    return {
      x: fromX + facing * (11.52 - smoothstep(s) * 5.04),
      lift: 3.12 + Math.abs(Math.sin(s * Math.PI * 2)) * 2.16,
      rot: facing * (12 - s * 21.6),
      anim: "walk" as const,
    };
  }
  const s = smoothstep((u - 0.78) / 0.22);
  return {
    x: fromX + facing * (6.48 * (1 - s)),
    lift: 3.12 * (1 - s),
    rot: facing * (-4.8 * (1 - s)),
    anim: "sit" as const,
  };
}

/** Moss — damp blotter patch claim. Not Jade jewel. Not Ember settle. */
export function mossPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.moss));
  if (u < 0.14) {
    const s = smoothstep(u / 0.14);
    return { x: fromX + facing * s * 2.16, lift: s * 2.88, rot: s * 33.6 * facing, anim: "sit" as const };
  }
  if (u < 0.78) {
    const s = (u - 0.14) / 0.64;
    const nudge = Math.sin(s * Math.PI * 2.8);
    return {
      x: fromX + facing * (2.16 + nudge * 1.92),
      lift: 2.4 + Math.abs(nudge) * 2.64,
      rot: facing * (33.6 + nudge * 16.8),
      anim: "sit" as const,
    };
  }
  const s = smoothstep((u - 0.78) / 0.22);
  return {
    x: fromX + facing * (2.16 * (1 - s)),
    lift: 2.4 * (1 - s),
    rot: facing * 14.4 * (1 - s),
    anim: "idle" as const,
  };
}

/** Fork — tongue-flick scent check. Not Sol flick. Not Nori taste. */
export function forkPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.fork));
  if (u < 0.12) {
    const s = smoothstep(u / 0.12);
    return { x: fromX, lift: s * 6.24, rot: s * -21.6 * facing, anim: "talk" as const };
  }
  if (u < 0.82) {
    const s = (u - 0.12) / 0.7;
    const flick = Math.sin(s * Math.PI * 5.2);
    return {
      x: fromX + facing * flick * 2.64,
      lift: 6.24 + Math.abs(flick) * 4.08,
      rot: facing * (-21.6 + flick * 24),
      anim: "talk" as const,
    };
  }
  const s = smoothstep((u - 0.82) / 0.18);
  return {
    x: fromX,
    lift: 6.24 * (1 - s),
    rot: facing * -9.6 * (1 - s),
    anim: "sit" as const,
  };
}

/** Lap — quick desk circuit. Not Bandit raid. Not Jade bough. */
export function lapPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.lap));
  if (u < 0.12) {
    const s = smoothstep(u / 0.12);
    return { x: fromX, lift: s * 5.76, rot: -s * 19.2 * facing, anim: "play" as const };
  }
  if (u < 0.5) {
    const s = (u - 0.12) / 0.38;
    return {
      x: fromX + facing * smoothstep(s) * 8.64,
      lift: 5.76 + Math.sin(s * Math.PI) * 5.04,
      rot: facing * (-19.2 + s * 40.8),
      anim: "play" as const,
    };
  }
  if (u < 0.78) {
    const s = (u - 0.5) / 0.28;
    return {
      x: fromX + facing * 8.64,
      lift: 6.48 + Math.sin(s * Math.PI * 1.8) * 3.36,
      rot: facing * (21.6 - s * 12),
      anim: "sit" as const,
    };
  }
  const s = smoothstep((u - 0.78) / 0.22);
  return {
    x: fromX + facing * (8.64 * (1 - s)),
    lift: 6.48 * (1 - s),
    rot: facing * 7.2 * (1 - s),
    anim: "sit" as const,
  };
}

/** Ribbon — side-stripe flash (roll to show the bright lateral line). Not Bandit stripe. Not Parrot flash. */
export function ribbonPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.ribbon));
  if (u < 0.1) {
    const s = smoothstep(u / 0.1);
    return { x: fromX, lift: s * 3.84, rot: s * 50.4 * facing, anim: "play" as const };
  }
  if (u < 0.86) {
    const s = (u - 0.1) / 0.76;
    const flash = Math.sin(s * Math.PI * 4.6);
    return {
      x: fromX + facing * flash * 2.88,
      lift: 3.84 + Math.abs(flash) * 3.36 + Math.sin(s * Math.PI * 2.2) * 1.92,
      rot: facing * (50.4 + flash * 26.4),
      anim: "play" as const,
    };
  }
  const s = smoothstep((u - 0.86) / 0.14);
  return {
    x: fromX,
    lift: 3.84 * (1 - s),
    rot: facing * 14.4 * (1 - s),
    anim: "sit" as const,
  };
}

/** Creek — damp-moss waterline wiggle (creek-bank undulation). Not Lula loop. Not window-play PATROL. */
export function creekPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.creek));
  if (u < 0.14) {
    const s = smoothstep(u / 0.14);
    return { x: fromX + facing * s * 1.92, lift: s * 4.32, rot: s * -14.4 * facing, anim: "play" as const };
  }
  if (u < 0.82) {
    const s = (u - 0.14) / 0.68;
    const wave = Math.sin(s * Math.PI * 5.6);
    return {
      x: fromX + facing * (1.92 + wave * 4.08),
      lift: 4.32 + Math.abs(wave) * 3.12,
      rot: facing * (-14.4 + wave * 28.8),
      anim: "play" as const,
    };
  }
  const s = smoothstep((u - 0.82) / 0.18);
  return {
    x: fromX + facing * (1.92 * (1 - s)),
    lift: 4.32 * (1 - s),
    rot: facing * -7.2 * (1 - s),
    anim: "sit" as const,
  };
}

export function stepTrick(trick: GarterTrick | null | undefined, dt: number, flags?: TrickFlags) {
  if (!trick || trick.phase === "done") return trick;
  if (shouldAbort(flags) && trick.kind !== "lap" && trick.kind !== "rounds" && trick.kind !== "ribbon" && trick.kind !== "creek") {
    return { ...trick, phase: "done" as const, t: 0, lift: 0, rot: 0, anim: "idle" as const, abort: true };
  }
  const next: GarterTrick = { ...trick, t: trick.t + Math.max(0, dt) };
  if (next.kind === "seam") {
    if (next.t < SEAM_HOLD) {
      const pose = seamPose(next.t);
      next.phase = "hold";
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = "sit";
      return next;
    }
    if (next.t < SEAM_HOLD + RELEASE_S) {
      const pose = releasePose(next.t - SEAM_HOLD);
      next.phase = "release";
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = "sit";
      return next;
    }
    return { ...next, phase: "done" as const, lift: 0, rot: 0, anim: "idle" as const };
  }
  const hold = DUR[next.kind];
  const u = next.t / hold;
  const fromX = trick.fromX != null ? trick.fromX : trick.x;
  if (next.kind === "rounds") {
    const pose = roundsPose(next.t, fromX, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "moss") {
    const pose = mossPose(next.t, fromX, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "fork") {
    const pose = forkPose(next.t, fromX, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "lap") {
    const pose = lapPose(next.t, fromX, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "ribbon") {
    const pose = ribbonPose(next.t, fromX, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else {
    const pose = creekPose(next.t, fromX, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  }
  if (u >= 1) return { ...next, phase: "done" as const, lift: 0, rot: 0, anim: "idle" as const };
  return next;
}
