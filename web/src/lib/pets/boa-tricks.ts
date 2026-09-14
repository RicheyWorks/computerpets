/** Lula ground tricks while idle — ultra-polish pass. House boa constrictor — pour / heft / oxbow / slack / bank / anchor / meander personality (pour/weight blotter-river desk life). Pour rests a river of muscle across the blotter; heft presses mass into the desk; oxbow bends a slow river loop; slack loosens a long body wave; bank claims the blotter edge; anchor plants heavy constrictor sit-mass (not hold ethogram act, not Nori orb, not coil); meander walks a slow river bend across the blotter (not Lula window-play loop, not Sash creek, not oxbow). Window-play LOOP unchanged — never names `loop`. Ethogram keeps tongue + hold; adds pour/heft/oxbow/anchor/meander softs + freeze. Nori owns orb/nook/taste/inch/unroll/loom/weave and savor/nestle/center; Saffron owns scribble/gap/comma/probe/canyon/blotter/pencil and clause/spice/cord; Bandit owns stripe/audit/verdict/plumb/raid/band/drawer and tribute/docket/seal; Jade owns bracelet/sway/jewel/heat/bough/liana/arbor and pendant/treaty/emerald; Bluff owns hood/feign/shovel/gape/encore/quiver/upright and aside/cue/ovation; Sash owns seam/rounds/moss/fork/lap/ribbon/creek and copy/brief/visa; hedgehog owns curl/ball; volt window-play owns coil; ferret owns noodle; Ember owns settle/shine/dip; Vesper owns fold/thrum/glow; Sol owns flick/sun; Coin owns flare; Thimble owns dig; Lula window-play owns loop; Echo window-play owns perch; Fox window-play owns scent; rosy_boa window-play owns stone. Guest slug Lula / key boa — accept "boa" and "lula". Amplitudes raised toward Rui richness; denser waits/weights; prefersHouseCry via boa.wav. Thank-yous harbor / cradle / stay. Feed-happy after eat. Sleep, hide, leave, rest, card still win. Same map as desktop `boa-tricks.js`. True house-boa-constrictor desk life — not Rui/cat/dog/rabbit/hamster/guinea_pig/turtle/goldfish/budgie/fox/penguin/parrot/ferret/hedgehog/chinchilla/axolotl/toucan/iguana/Sol/dragon/Vesper/phoenix/Ember/ball_python/Nori/corn_snake/Saffron/kingsnake/Bandit/green_tree_python/Jade/hognose/Bluff/garter/Sash or *Dragon electrical (Relay/Fuse/Ground) clones. Avoids loop/patrol/stripe/hood/feign/shovel/gape/encore/quiver/upright/flip/saddle/drape/inspect/write/orb/nook/taste/inch/unroll/loom/weave/bun/ball/coil/curl/bask/loaf/potato/tuck/hide/settle/shine/dip/sprawl/guard/smolder/claim/fold/thrum/glow/incline/sun/dewlap/cinder/blaze/shed/lift/return/flick/warm/thread/dart/noodle/savor/nestle/center/scribble/gap/comma/probe/canyon/blotter/pencil/clause/spice/cord/audit/verdict/plumb/raid/tribute/docket/seal/band/drawer/bracelet/sway/jewel/heat/bough/pendant/treaty/emerald/liana/arbor/aside/cue/ovation/seam/rounds/moss/fork/lap/copy/brief/visa/ribbon/creek/root/flare/dig/perch/hang/clasp/scent/stone/heave/lug/earth/bed/squeeze/delta name collisions. Bird ultra (Soot→Ember) + Miso→Sash done; Echo/budgie + Peck/penguin + Quill/parrot + Keel/toucan + Ember skip birds. Next guest ultra is Coral / milk_snake. No cry inventing beyond house boa.wav prefer. Never retouch Rui sprites. */
export const TRICK_KEY = "boa";
export const TRICKS = ["pour", "heft", "oxbow", "slack", "bank", "anchor", "meander"] as const;
export const HAPPY = ["harbor", "cradle", "stay"] as const;
export type BoaTrickKind = (typeof TRICKS)[number];
export type BoaHappyKind = (typeof HAPPY)[number];
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

export type BoaTrick = {
  kind: BoaTrickKind;
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

export type BoaHappy = {
  kind: BoaHappyKind;
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

export const HAPPY_DUR: Record<BoaHappyKind, number> = {
  harbor: 1.55,
  cradle: 1.6,
  stay: 1.58,
};

/** Pour hold — Lula pours a river of muscle across the blotter. Not window-play LOOP. Not Nori orb. */
export const POUR_HOLD = 12.6;
export const RELEASE_S = 0.88;

export const DUR: Record<BoaTrickKind, number> = {
  pour: POUR_HOLD + RELEASE_S,
  heft: 1.86,
  oxbow: 1.98,
  slack: 1.72,
  bank: 1.88,
  anchor: 2.05,
  meander: 2.12,
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

export function nextTrickWait(justFinished: boolean, rand?: number, kind?: BoaTrickKind) {
  const roll = rand == null ? Math.random() : rand;
  if (kind === "pour") return 38 + roll * 24;
  if (kind === "anchor") return 12 + roll * 9;
  if (kind === "oxbow" || kind === "meander") return 11 + roll * 8;
  if (kind === "heft" || kind === "bank") return 10 + roll * 8;
  if (kind === "slack") return 10 + roll * 7;
  return justFinished ? 8 + roll * 8 : 4 + roll * 7;
}

export function pickTrick(rand?: number, musicOn = false, lastKind?: BoaTrickKind | null): BoaTrickKind {
  if (musicOn) return "pour";
  const roll = rand == null ? Math.random() : rand;
  const pool = TRICKS.filter((k) => k !== lastKind);
  const list = pool.length ? pool : [...TRICKS];
  const weights = list.map((k) =>
    k === "pour" ? 0.55 : k === "anchor" || k === "meander" || k === "oxbow" ? 1.15 : 1
  );
  let total = 0;
  for (let i = 0; i < weights.length; i++) total += weights[i]!;
  let r = roll * total;
  for (let i = 0; i < list.length; i++) {
    r -= weights[i]!;
    if (r <= 0) return list[i]!;
  }
  return list[list.length - 1] || "pour";
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
  return key === TRICK_KEY || key === "lula";
}

export function startThankYou(
  key: string | undefined | null,
  lastKind: BoaHappyKind | string | null | undefined,
  x: number,
  facing: 1 | -1,
  flags?: TrickFlags,
) {
  if (!wantsThankYou(key)) return null;
  if (!happyCanStart(flags || { cmd: "idle" })) return null;
  const pick = pickHappy(lastKind as BoaHappyKind | null | undefined);
  return { happy: beginHappy(pick, x, facing), kind: pick };
}

export function pickHappy(lastKind?: BoaHappyKind | null, rand?: number) {
  const pool = HAPPY.filter((k) => k !== lastKind);
  const list = pool.length ? pool : [...HAPPY];
  const roll = rand == null ? Math.random() : rand;
  return list[Math.floor(roll * list.length)] || list[0];
}

export function beginHappy(kind: BoaHappyKind, x: number, facing: 1 | -1): BoaHappy {
  const name = HAPPY.includes(kind) ? kind : "harbor";
  return {
    kind: name,
    happy: true,
    phase: "go",
    t: 0,
    x,
    lift: 0,
    rot: 0,
    anim: name === "harbor" ? "sit" : name === "cradle" ? "sit" : "talk",
    facing: facing == null ? 1 : facing,
    fromX: x,
  };
}

export function harborPose(t: number) {
  const u = Math.max(0, Math.min(1, t / HAPPY_DUR.harbor));
  if (u < 0.14) {
    const s = u / 0.14;
    return { lift: s * 4.2, rot: s * -16, dx: 0, anim: "sit" as TrickAnim };
  }
  if (u < 0.8) {
    return {
      lift: 4.2 + Math.abs(Math.sin(t * 4.6)) * 3.4,
      rot: -16 + Math.sin(t * 3.4) * 14,
      dx: Math.sin(t * 1.8) * 0.55,
      anim: "sit" as TrickAnim,
    };
  }
  const s = (u - 0.8) / 0.2;
  return { lift: 4.2 * (1 - s), rot: -16 * (1 - s), dx: 0, anim: "idle" as TrickAnim };
}

export function cradlePose(t: number) {
  const u = Math.max(0, Math.min(1, t / HAPPY_DUR.cradle));
  if (u < 0.12) {
    const s = u / 0.12;
    return { lift: s * 4.6, rot: s * 18, dx: 0, anim: "sit" as TrickAnim };
  }
  if (u < 0.78) {
    const rock = Math.sin(t * 3.2);
    return {
      lift: 4.6 + Math.abs(rock) * 3.2,
      rot: 18 + rock * 16,
      dx: rock * 0.7,
      anim: "sit" as TrickAnim,
    };
  }
  const s = (u - 0.78) / 0.22;
  return { lift: 4.6 * (1 - s), rot: 18 * (1 - s), dx: 0, anim: "sit" as TrickAnim };
}

export function stayPose(t: number) {
  return {
    lift: Math.abs(Math.sin(t * 3.4)) * 3.8 + 2.4,
    rot: -16 + Math.sin(t * 2.8) * 14,
    dx: Math.sin(t * 1.9) * 0.65,
    anim: "talk" as TrickAnim,
  };
}

export function stepHappy(happy: BoaHappy | null | undefined, dt: number, flags?: TrickFlags) {
  if (!happy || happy.phase === "done") return happy;
  if (happyShouldAbort(flags)) {
    return { ...happy, phase: "done" as const, t: 0, lift: 0, rot: 0, anim: "idle" as TrickAnim, abort: true };
  }
  const next: BoaHappy = { ...happy, t: happy.t + Math.max(0, dt) };
  const hold = HAPPY_DUR[next.kind];
  if (next.kind === "harbor") {
    const pose = harborPose(next.t);
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "cradle") {
    const pose = cradlePose(next.t);
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else {
    const pose = stayPose(next.t);
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  }
  if (next.t >= hold) return { ...next, phase: "done" as const, lift: 0, rot: 0, anim: "idle" as TrickAnim };
  return next;
}

export function sleepHoldFrame(_key?: string | null, _frameCount?: number) {
  return null;
}

export function beginTrick(kind: BoaTrickKind, x: number, facing: 1 | -1): BoaTrick {
  const anim: TrickAnim =
    kind === "pour"
      ? "sit"
      : kind === "heft"
        ? "sit"
        : kind === "oxbow"
          ? "walk"
          : kind === "slack"
            ? "talk"
            : kind === "bank"
              ? "sit"
              : kind === "anchor"
                ? "sit"
                : kind === "meander"
                  ? "walk"
                  : "sit";
  return {
    kind,
    phase: kind === "pour" ? "hold" : "go",
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

export function pourPose(t: number) {
  return {
    lift: 2.4 + Math.sin(t * 1.7) * 2.8 + Math.abs(Math.sin(t * 3.4)) * 1.6,
    rot: -22 + Math.sin(t * 2.4) * 18 + Math.sin(t * 4.6) * 10,
  };
}

export function releasePose(t: number) {
  const u = Math.max(0, Math.min(1, t / RELEASE_S));
  return { lift: (2.4 + 2.8) * (1 - Math.sin(u * Math.PI * 0.5)), rot: -22 * (1 - u) };
}

export function heftPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.heft));
  if (u < 0.14) {
    const s = smoothstep(u / 0.14);
    return { x: fromX, lift: s * 4.8, rot: s * 16 * facing, anim: "sit" as TrickAnim };
  }
  if (u < 0.55) {
    const s = (u - 0.14) / 0.41;
    return {
      x: fromX + facing * s * 1.2,
      lift: 4.8 - smoothstep(s) * 3.6,
      rot: facing * (16 - s * 28),
      anim: "sit" as TrickAnim,
    };
  }
  if (u < 0.82) {
    const s = (u - 0.55) / 0.27;
    const press = Math.abs(Math.sin(s * Math.PI * 2.2));
    return {
      x: fromX + facing * 1.2,
      lift: 1.0 + press * 1.4,
      rot: facing * (-14 + press * 8),
      anim: "sit" as TrickAnim,
    };
  }
  const s = smoothstep((u - 0.82) / 0.18);
  return {
    x: fromX + facing * (1.2 * (1 - s)),
    lift: 1.0 * (1 - s),
    rot: facing * -4 * (1 - s),
    anim: "idle" as TrickAnim,
  };
}

export function oxbowPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.oxbow));
  if (u < 0.12) {
    const s = smoothstep(u / 0.12);
    return { x: fromX + facing * s * 2.4, lift: s * 2.8, rot: s * 18 * facing, anim: "walk" as TrickAnim };
  }
  if (u < 0.48) {
    const s = (u - 0.12) / 0.36;
    return {
      x: fromX + facing * (2.4 + smoothstep(s) * 7.2),
      lift: 2.8 + Math.sin(s * Math.PI) * 2.6,
      rot: facing * (18 + Math.sin(s * Math.PI) * 22),
      anim: "walk" as TrickAnim,
    };
  }
  if (u < 0.78) {
    const s = (u - 0.48) / 0.3;
    return {
      x: fromX + facing * (9.6 - smoothstep(s) * 4.2),
      lift: 3.2 + Math.abs(Math.sin(s * Math.PI * 1.8)) * 2.0,
      rot: facing * (28 - s * 34),
      anim: "play" as TrickAnim,
    };
  }
  const s = smoothstep((u - 0.78) / 0.22);
  return {
    x: fromX + facing * (5.4 * (1 - s)),
    lift: 2.6 * (1 - s),
    rot: facing * (-4 * (1 - s)),
    anim: "sit" as TrickAnim,
  };
}

export function slackPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.slack));
  if (u < 0.12) {
    const s = smoothstep(u / 0.12);
    return { x: fromX, lift: s * 5.2, rot: s * 28 * facing, anim: "talk" as TrickAnim };
  }
  if (u < 0.78) {
    const s = (u - 0.12) / 0.66;
    const ease = Math.sin(s * Math.PI * 2.4);
    return {
      x: fromX + facing * ease * 0.9,
      lift: 5.2 - s * 1.4 + Math.abs(ease) * 2.2,
      rot: facing * (28 - s * 34 + ease * 12),
      anim: "talk" as TrickAnim,
    };
  }
  const s = smoothstep((u - 0.78) / 0.22);
  return {
    x: fromX,
    lift: 3.2 * (1 - s),
    rot: facing * (-4 * (1 - s)),
    anim: "sit" as TrickAnim,
  };
}

export function bankPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.bank));
  if (u < 0.12) {
    const s = smoothstep(u / 0.12);
    return { x: fromX + facing * s * 3.2, lift: s * 2.6, rot: -s * 14 * facing, anim: "sit" as TrickAnim };
  }
  if (u < 0.78) {
    const s = (u - 0.12) / 0.66;
    const nudge = Math.sin(s * Math.PI * 2.0);
    return {
      x: fromX + facing * (3.2 + nudge * 1.1),
      lift: 2.4 + Math.abs(nudge) * 2.0,
      rot: facing * (-14 + nudge * 12),
      anim: "sit" as TrickAnim,
    };
  }
  const s = smoothstep((u - 0.78) / 0.22);
  return {
    x: fromX + facing * (3.2 * (1 - s)),
    lift: 2.4 * (1 - s),
    rot: facing * (-4 * (1 - s)),
    anim: "idle" as TrickAnim,
  };
}

/** Anchor — heavy constrictor sit-mass planted on the blotter. Not hold ethogram. Not coil. */
export function anchorPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.anchor));
  if (u < 0.12) {
    const s = smoothstep(u / 0.12);
    return { x: fromX, lift: s * 3.4, rot: s * -10 * facing, anim: "sit" as TrickAnim };
  }
  if (u < 0.42) {
    const s = (u - 0.12) / 0.3;
    return {
      x: fromX + facing * smoothstep(s) * 0.6,
      lift: 3.4 - smoothstep(s) * 2.2,
      rot: facing * (-10 + s * 6),
      anim: "sit" as TrickAnim,
    };
  }
  if (u < 0.82) {
    const s = (u - 0.42) / 0.4;
    const settle = Math.abs(Math.sin(s * Math.PI * 1.6));
    return {
      x: fromX + facing * 0.6,
      lift: 1.0 + settle * 1.8,
      rot: facing * (-8 + settle * 14),
      anim: "sit" as TrickAnim,
    };
  }
  const s = smoothstep((u - 0.82) / 0.18);
  return {
    x: fromX + facing * (0.6 * (1 - s)),
    lift: 1.2 * (1 - s),
    rot: facing * (-4 * (1 - s)),
    anim: "idle" as TrickAnim,
  };
}

/** Meander — slow river bend across the blotter. Not window-play loop. Not Sash creek. */
export function meanderPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.meander));
  if (u < 0.12) {
    const s = smoothstep(u / 0.12);
    return { x: fromX + facing * s * 1.8, lift: s * 3.2, rot: s * 14 * facing, anim: "walk" as TrickAnim };
  }
  if (u < 0.78) {
    const s = (u - 0.12) / 0.66;
    const bend = Math.sin(s * Math.PI * 2.4);
    return {
      x: fromX + facing * (1.8 + s * 6.4 + bend * 2.2),
      lift: 3.2 + Math.abs(bend) * 2.8,
      rot: facing * (14 + bend * 26),
      anim: "walk" as TrickAnim,
    };
  }
  const s = smoothstep((u - 0.78) / 0.22);
  return {
    x: fromX + facing * ((1.8 + 6.4) * (1 - s)),
    lift: 3.2 * (1 - s),
    rot: facing * (6 * (1 - s)),
    anim: "sit" as TrickAnim,
  };
}

export function stepTrick(trick: BoaTrick | null | undefined, dt: number, flags?: TrickFlags) {
  if (!trick || trick.phase === "done") return trick;
  if (shouldAbort(flags) && trick.kind !== "oxbow" && trick.kind !== "bank" && trick.kind !== "meander") {
    return { ...trick, phase: "done" as const, t: 0, lift: 0, rot: 0, anim: "idle" as TrickAnim, abort: true };
  }
  const next: BoaTrick = { ...trick, t: trick.t + Math.max(0, dt) };
  if (next.kind === "pour") {
    if (next.t < POUR_HOLD) {
      const pose = pourPose(next.t);
      next.phase = "hold";
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = "sit";
      return next;
    }
    if (next.t < POUR_HOLD + RELEASE_S) {
      const pose = releasePose(next.t - POUR_HOLD);
      next.phase = "release";
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = "sit";
      return next;
    }
    return { ...next, phase: "done" as const, lift: 0, rot: 0, anim: "idle" as TrickAnim };
  }
  const hold = DUR[next.kind];
  const u = next.t / hold;
  const from = trick.fromX != null ? trick.fromX : trick.x;
  if (next.kind === "heft") {
    const pose = heftPose(next.t, from, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "oxbow") {
    const pose = oxbowPose(next.t, from, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "slack") {
    const pose = slackPose(next.t, from, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "bank") {
    const pose = bankPose(next.t, from, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "anchor") {
    const pose = anchorPose(next.t, from, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else {
    const pose = meanderPose(next.t, from, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  }
  if (u >= 1) return { ...next, phase: "done" as const, lift: 0, rot: 0, anim: "idle" as TrickAnim };
  return next;
}
