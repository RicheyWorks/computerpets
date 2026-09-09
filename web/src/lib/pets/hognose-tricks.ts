/** Bluff ground tricks while idle — ultra-polish pass. House western hognose — hood / feign / shovel / gape / encore / quiver / upright personality (bluff/death-feign/nose desk life; eraser-dish theater). Hood false-cobra flatten on the eraser dish; feign belly-up death-feign drama; shovel keeled-nose dig on the blotter grit; gape open-mouth hiss bluff; encore theatrical recovery strut; quiver false-rattle tail buzz bluff (western hognose tail vibrate — not Keel toucan rattle, not Relay buzz); upright reared false-cobra stand on the eraser dish (distinct from hood flatten). Window-play FLIP unchanged — never names `flip`. Ethogram maps hood→flatten sit_hold, feign→playdead; keeps tongue/gape; adds shovel/encore/quiver/upright softs + freeze. Nori owns orb/nook/taste/inch/unroll/loom/weave and savor/nestle/center; Saffron owns scribble/gap/comma/probe/canyon/blotter/pencil and clause/spice/cord; Bandit owns stripe/audit/verdict/plumb/raid/band/drawer and tribute/docket/seal; Jade owns bracelet/sway/jewel/heat/bough/liana/arbor and pendant/treaty/emerald; Sash owns moss; hedgehog owns curl/ball; volt window-play owns coil; ferret owns noodle/puff; Ember owns settle/shine/dip; Vesper owns fold/thrum/glow; Sol owns flick/sun/press; Lula window-play owns loop; Echo window-play owns perch; Keel owns rattle; Vee owns hiss; tarantula owns cork; Relay owns buzz. Guest slug Bluff / key hognose — accept "hognose" and "bluff". Amplitudes raised toward Rui richness; denser waits/weights; prefersHouseCry via hognose.wav. Thank-yous aside / cue / ovation. Feed-happy after eat. Sleep, hide, leave, rest, card, ribbon still win. Same map as desktop `hognose-tricks.js`. True house-western-hognose desk life — not Rui/cat/dog/rabbit/hamster/guinea_pig/turtle/goldfish/budgie/fox/penguin/parrot/ferret/hedgehog/chinchilla/axolotl/toucan/iguana/Sol/dragon/Vesper/phoenix/Ember/ball_python/Nori/corn_snake/Saffron/kingsnake/Bandit/green_tree_python/Jade or *Dragon electrical (Relay/Fuse/Ground) clones. Avoids flip/saddle/drape/inspect/write/orb/nook/taste/inch/unroll/loom/weave/bun/ball/coil/curl/bask/loaf/potato/tuck/hide/settle/shine/dip/sprawl/guard/smolder/claim/fold/thrum/glow/incline/sun/dewlap/cinder/blaze/shed/lift/return/flick/warm/thread/dart/noodle/savor/nestle/center/scribble/gap/comma/probe/canyon/blotter/pencil/clause/spice/cord/stripe/audit/verdict/plumb/raid/tribute/docket/seal/band/drawer/bracelet/sway/jewel/heat/bough/pendant/treaty/emerald/liana/arbor/root/flare/dig/loop/perch/hang/clasp/playdead/flatten/rattle/hiss/cork/buzz/puff/moss name collisions. Bird ultra (Soot→Ember) + Miso→Jade done; Echo/budgie + Peck/penguin + Quill/parrot + Keel/toucan + Ember skip birds. Sash / garter ultra done; next guest ultra is Lula / boa. No cry inventing beyond house hognose.wav prefer. Never retouch Rui sprites. */
export const TRICK_KEY = "hognose";
export const TRICKS = ["hood", "feign", "shovel", "gape", "encore", "quiver", "upright"] as const;
export const HAPPY = ["aside", "cue", "ovation"] as const;
export type HognoseTrickKind = (typeof TRICKS)[number];
export type HognoseHappyKind = (typeof HAPPY)[number];
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

export type HognoseTrick = {
  kind: HognoseTrickKind;
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

export type HognoseHappy = {
  kind: HognoseHappyKind;
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

export const HAPPY_DUR: Record<HognoseHappyKind, number> = {
  aside: 1.55,
  cue: 1.6,
  ovation: 1.58,
};

/** Hood hold — Bluff flattens a false cobra hood on the eraser dish. Not window-play FLIP. Not Jade bracelet. */
export const HOOD_HOLD = 12.4;
export const RELEASE_S = 0.88;

export const DUR: Record<HognoseTrickKind, number> = {
  hood: HOOD_HOLD + RELEASE_S,
  feign: 1.86,
  shovel: 1.78,
  gape: 1.72,
  encore: 1.94,
  quiver: 2.02,
  upright: 2.1,
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

export function nextTrickWait(justFinished: boolean, rand?: number, kind?: HognoseTrickKind) {
  const roll = rand == null ? Math.random() : rand;
  if (kind === "hood") return 38 + roll * 24;
  if (kind === "feign" || kind === "upright") return 11 + roll * 8;
  if (kind === "shovel" || kind === "encore" || kind === "quiver") return 10 + roll * 8;
  if (kind === "gape") return 12 + roll * 9;
  return justFinished ? 8 + roll * 8 : 4 + roll * 7;
}

export function pickTrick(rand?: number, musicOn = false, lastKind?: HognoseTrickKind | null): HognoseTrickKind {
  if (musicOn) return "hood";
  const roll = rand == null ? Math.random() : rand;
  const pool = TRICKS.filter((k) => k !== lastKind);
  const list = pool.length ? pool : [...TRICKS];
  const weights = list.map((k) =>
    k === "hood" ? 0.55 : k === "feign" || k === "upright" || k === "gape" ? 1.15 : 1
  );
  let total = 0;
  for (let i = 0; i < weights.length; i++) total += weights[i]!;
  let r = roll * total;
  for (let i = 0; i < list.length; i++) {
    r -= weights[i]!;
    if (r <= 0) return list[i]!;
  }
  return list[list.length - 1] || "hood";
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
  return key === TRICK_KEY || key === "bluff";
}

export function startThankYou(
  key: string | undefined | null,
  lastKind: HognoseHappyKind | string | null | undefined,
  x: number,
  facing: 1 | -1,
  flags?: TrickFlags,
) {
  if (!wantsThankYou(key)) return null;
  if (!happyCanStart(flags || { cmd: "idle" })) return null;
  const pick = pickHappy(lastKind as HognoseHappyKind | null | undefined);
  return { happy: beginHappy(pick, x, facing), kind: pick };
}

export function pickHappy(lastKind?: HognoseHappyKind | null, rand?: number): HognoseHappyKind {
  const pool = HAPPY.filter((k) => k !== lastKind);
  const list = pool.length ? pool : [...HAPPY];
  const roll = rand == null ? Math.random() : rand;
  return list[Math.floor(roll * list.length)] ?? list[0]!;
}

export function beginHappy(kind: HognoseHappyKind, x: number, facing: 1 | -1 = 1): HognoseHappy {
  const name: HognoseHappyKind = HAPPY.includes(kind) ? kind : "aside";
  return {
    kind: name,
    happy: true,
    phase: "go",
    t: 0,
    x,
    lift: 0,
    rot: 0,
    anim: name === "aside" ? "sit" : name === "cue" ? "talk" : "sit",
    facing,
    fromX: x,
  };
}

export function asidePose(t: number) {
  const u = Math.max(0, Math.min(1, t / HAPPY_DUR.aside));
  if (u < 0.14) {
    const s = u / 0.14;
    return { lift: s * 4.2, rot: s * -16, dx: 0, anim: "sit" as const };
  }
  if (u < 0.8) {
    return {
      lift: 4.2 + Math.abs(Math.sin(t * 4.6)) * 3.4,
      rot: -16 + Math.sin(t * 3.4) * 14,
      dx: Math.sin(t * 2.1) * 1.1,
      anim: "sit" as const,
    };
  }
  const s = (u - 0.8) / 0.2;
  return { lift: 4.2 * (1 - s), rot: -16 * (1 - s), dx: 0, anim: "idle" as const };
}

export function cuePose(t: number) {
  const u = Math.max(0, Math.min(1, t / HAPPY_DUR.cue));
  if (u < 0.12) {
    const s = u / 0.12;
    return { lift: s * 4.6, rot: s * 18, dx: 0, anim: "talk" as const };
  }
  if (u < 0.78) {
    const tick = Math.sin(t * 7.2);
    return {
      lift: 4.6 + Math.abs(tick) * 3.2,
      rot: 18 + tick * 16,
      dx: tick * 1.2,
      anim: "talk" as const,
    };
  }
  const s = (u - 0.78) / 0.22;
  return { lift: 4.6 * (1 - s), rot: 18 * (1 - s), dx: 0, anim: "sit" as const };
}

export function ovationPose(t: number) {
  return {
    lift: Math.abs(Math.sin(t * 3.4)) * 3.8 + 2.4,
    rot: -16 + Math.sin(t * 2.8) * 14,
    dx: Math.sin(t * 2.2) * 1.4,
    anim: "sit" as const,
  };
}

export function stepHappy(happy: HognoseHappy | null | undefined, dt: number, flags?: TrickFlags) {
  if (!happy || happy.phase === "done") return happy;
  if (happyShouldAbort(flags)) {
    return { ...happy, phase: "done" as const, t: 0, lift: 0, rot: 0, anim: "idle" as const, abort: true };
  }
  const next: HognoseHappy = { ...happy, t: happy.t + Math.max(0, dt) };
  const hold = HAPPY_DUR[next.kind];
  if (next.kind === "aside") {
    const pose = asidePose(next.t);
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "cue") {
    const pose = cuePose(next.t);
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else {
    const pose = ovationPose(next.t);
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  }
  if (next.t >= hold) return { ...next, phase: "done" as const, lift: 0, rot: 0, anim: "idle" as const };
  return next;
}

/** Bluff has no Rui-style sleep-frame hold. */
export function sleepHoldFrame(_key?: string | null, _frameCount?: number) {
  return null;
}

export function beginTrick(kind: HognoseTrickKind, x: number, facing: 1 | -1 = 1): HognoseTrick {
  const anim: TrickAnim =
    kind === "hood"
      ? "sit"
      : kind === "feign"
        ? "sit"
        : kind === "shovel"
          ? "talk"
          : kind === "gape"
            ? "talk"
            : kind === "encore"
              ? "play"
              : kind === "quiver"
                ? "play"
                : kind === "upright"
                  ? "sit"
                  : "sit";
  return {
    kind,
    phase: kind === "hood" ? "hold" : "go",
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

/** Hood — false-cobra flatten on the eraser dish. Soft rock. Not window-play FLIP. Not Jade bracelet. */
export function hoodPose(t: number) {
  return {
    lift: 2.2 + Math.sin(t * 1.7) * 2.8 + Math.abs(Math.sin(t * 3.4)) * 1.6,
    rot: -22 + Math.sin(t * 2.4) * 18 + Math.sin(t * 4.6) * 10,
  };
}

/** Soft unflatten out of the hood; stays on the eraser dish. Not window-play leave. */
export function releasePose(t: number) {
  const u = Math.max(0, Math.min(1, t / RELEASE_S));
  return { lift: (2.2 + 2.8) * (1 - Math.sin(u * Math.PI * 0.5)), rot: -22 * (1 - u) };
}

/** Feign — belly-up death-feign drama on the blotter. Not Nori unroll. Not Jade sway. */
export function feignPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.feign));
  if (u < 0.14) {
    const s = smoothstep(u / 0.14);
    return { x: fromX, lift: s * 3.6, rot: s * 110 * facing, anim: "play" as const };
  }
  if (u < 0.72) {
    const s = (u - 0.14) / 0.58;
    return {
      x: fromX + facing * Math.sin(s * Math.PI * 0.8) * 1.4,
      lift: 0.9 + Math.sin(s * Math.PI * 1.6) * 1.8,
      rot: facing * (110 + Math.sin(s * Math.PI * 2.2) * 12),
      anim: "sit" as const,
    };
  }
  const s = smoothstep((u - 0.72) / 0.28);
  return {
    x: fromX,
    lift: 0.9 * (1 - s) + s * 2.2,
    rot: facing * (110 * (1 - s) + s * -10),
    anim: "sit" as const,
  };
}

/** Shovel — keeled-nose dig on blotter grit. Not Thimble dig. Not Bandit plumb. */
export function shovelPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.shovel));
  if (u < 0.12) {
    const s = smoothstep(u / 0.12);
    return { x: fromX + facing * s * 2.4, lift: s * 2.8, rot: s * 22 * facing, anim: "talk" as const };
  }
  if (u < 0.84) {
    const s = (u - 0.12) / 0.72;
    const dig = Math.sin(s * Math.PI * 5.2);
    return {
      x: fromX + facing * (2.4 + dig * 3.6),
      lift: 2.4 + Math.abs(dig) * 3.2,
      rot: facing * (22 + dig * 24),
      anim: "talk" as const,
    };
  }
  const s = smoothstep((u - 0.84) / 0.16);
  return {
    x: fromX + facing * (2.4 * (1 - s)),
    lift: 2.4 * (1 - s),
    rot: facing * 8 * (1 - s),
    anim: "sit" as const,
  };
}

/** Gape — open-mouth hiss bluff (silent desk motion). Not Vee hiss. Not Nori taste. */
export function gapePose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.gape));
  if (u < 0.12) {
    const s = smoothstep(u / 0.12);
    return { x: fromX, lift: s * 5.2, rot: s * -18 * facing, anim: "talk" as const };
  }
  if (u < 0.82) {
    const s = (u - 0.12) / 0.7;
    const hiss = Math.sin(s * Math.PI * 3.2);
    return {
      x: fromX + facing * hiss * 2.2,
      lift: 5.2 + Math.abs(hiss) * 3.4,
      rot: facing * (-18 + hiss * 20),
      anim: "talk" as const,
    };
  }
  const s = smoothstep((u - 0.82) / 0.18);
  return {
    x: fromX,
    lift: 5.2 * (1 - s),
    rot: facing * -8 * (1 - s),
    anim: "sit" as const,
  };
}

/** Encore — theatrical recovery strut after a bluff. Not Bandit raid. Not Jade bough. */
export function encorePose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.encore));
  if (u < 0.12) {
    const s = smoothstep(u / 0.12);
    return { x: fromX, lift: s * 4.8, rot: -s * 16 * facing, anim: "play" as const };
  }
  if (u < 0.5) {
    const s = (u - 0.12) / 0.38;
    return {
      x: fromX + facing * smoothstep(s) * 7.2,
      lift: 4.8 + Math.sin(s * Math.PI) * 4.2,
      rot: facing * (-16 + s * 34),
      anim: "play" as const,
    };
  }
  if (u < 0.78) {
    const s = (u - 0.5) / 0.28;
    return {
      x: fromX + facing * 7.2,
      lift: 5.4 + Math.sin(s * Math.PI * 1.8) * 2.8,
      rot: facing * (18 - s * 10),
      anim: "sit" as const,
    };
  }
  const s = smoothstep((u - 0.78) / 0.22);
  return {
    x: fromX + facing * (7.2 * (1 - s)),
    lift: 5.4 * (1 - s),
    rot: facing * 6 * (1 - s),
    anim: "sit" as const,
  };
}

/** Quiver — false-rattle tail buzz bluff on the eraser dish. Not Keel rattle. Not Relay buzz. */
export function quiverPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.quiver));
  if (u < 0.1) {
    const s = smoothstep(u / 0.1);
    return { x: fromX, lift: s * 3.2, rot: s * 12 * facing, anim: "play" as const };
  }
  if (u < 0.86) {
    const s = (u - 0.1) / 0.76;
    const buzz = Math.sin(s * Math.PI * 14);
    return {
      x: fromX + facing * buzz * 2.8,
      lift: 3.2 + Math.abs(buzz) * 2.4 + Math.sin(s * Math.PI * 2.2) * 1.6,
      rot: facing * (12 + buzz * 28),
      anim: "play" as const,
    };
  }
  const s = smoothstep((u - 0.86) / 0.14);
  return {
    x: fromX,
    lift: 3.2 * (1 - s),
    rot: facing * 6 * (1 - s),
    anim: "sit" as const,
  };
}

/** Upright — reared false-cobra stand on the eraser dish. Distinct from hood flatten. Not Jade arbor. */
export function uprightPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.upright));
  if (u < 0.14) {
    const s = smoothstep(u / 0.14);
    return { x: fromX, lift: s * 6.4, rot: s * -14 * facing, anim: "sit" as const };
  }
  if (u < 0.82) {
    const s = (u - 0.14) / 0.68;
    const sway = Math.sin(s * Math.PI * 2.4);
    return {
      x: fromX + facing * sway * 1.8,
      lift: 6.4 + Math.abs(sway) * 2.2,
      rot: facing * (-14 + sway * 18),
      anim: "sit" as const,
    };
  }
  const s = smoothstep((u - 0.82) / 0.18);
  return {
    x: fromX,
    lift: 6.4 * (1 - s),
    rot: facing * -6 * (1 - s),
    anim: "sit" as const,
  };
}

export function stepTrick(trick: HognoseTrick | null | undefined, dt: number, flags?: TrickFlags) {
  if (!trick || trick.phase === "done") return trick;
  if (shouldAbort(flags) && trick.kind !== "encore" && trick.kind !== "feign" && trick.kind !== "quiver") {
    return { ...trick, phase: "done" as const, t: 0, lift: 0, rot: 0, anim: "idle" as const, abort: true };
  }
  const next: HognoseTrick = { ...trick, t: trick.t + Math.max(0, dt) };
  if (next.kind === "hood") {
    if (next.t < HOOD_HOLD) {
      const pose = hoodPose(next.t);
      next.phase = "hold";
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = "sit";
      return next;
    }
    if (next.t < HOOD_HOLD + RELEASE_S) {
      const pose = releasePose(next.t - HOOD_HOLD);
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
  if (next.kind === "feign") {
    const pose = feignPose(next.t, fromX, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "shovel") {
    const pose = shovelPose(next.t, fromX, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "gape") {
    const pose = gapePose(next.t, fromX, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "encore") {
    const pose = encorePose(next.t, fromX, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "quiver") {
    const pose = quiverPose(next.t, fromX, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else {
    const pose = uprightPose(next.t, fromX, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  }
  if (u >= 1) return { ...next, phase: "done" as const, lift: 0, rot: 0, anim: "idle" as const };
  return next;
}
