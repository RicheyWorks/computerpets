/** Atlas ground tricks while idle. House carpet python — legend / rung / contour / runner / bearing personality (map/carpet climb desk life; chart-shelf cartographer, not Nori ball-bun or Jade lamp-arm jewelry or Blush desert pebble). Feed-happy thank-yous sit after eat. Card-open freeze and window-play do not swallow a thank-you. Sleep, hide, and leave still win. Same map as desktop `carpet-python-tricks.js`. Not a Rui, cat, dog, rabbit, hamster, guinea pig, turtle, goldfish, budgie, fox, penguin, parrot, ferret, hedgehog, chinchilla, axolotl, toucan, iguana, dragon/Vesper, phoenix/Ember, ball-python/Nori, corn-snake/Saffron, kingsnake/Bandit, green-tree-python/Jade, hognose/Bluff, garter/Sash, boa/Lula, milk-snake/Coral, rosy-boa/Blush, or *Dragon electrical (Relay/Fuse/Ground) move clone. Window-play CHART unchanged — never names `chart`. Nori owns orb/nook/taste/inch/unroll and savor/nestle/center; Saffron owns scribble/gap/comma/probe/canyon and clause/spice/cord; Bandit owns stripe/audit/verdict/plumb/raid and tribute/docket/seal; Jade owns bracelet/sway/jewel/heat/bough and pendant/treaty/emerald; Bluff owns hood/feign/shovel/gape/encore and aside/cue/ovation; Sash owns seam/rounds/moss/fork/lap and copy/brief/visa; Lula owns pour/heft/oxbow/slack/bank and harbor/cradle/stay; Coral owns rhyme/rumor/costume/frank/tile and postmark/cachet/courtesy; Blush owns pebble/crevice/rosy/mesa/arroyo and climate/manners/corner; budgie owns mimic; parrot owns flash; hedgehog owns curl/root; turtle owns tuck; volt window-play owns coil; ferret owns noodle; Ember owns settle/shine/dip; Vesper owns fold/thrum/glow; Sol owns flick/sun; Coin owns flare; Thimble owns dig; Lula window-play owns loop; Echo window-play owns perch; Fox window-play owns scent; rosy_boa window-play owns stone; carpet_python window-play owns chart; hamster owns nest. Avoids chart/climb/unroll/drape/tongue/pebble/crevice/rosy/mesa/arroyo/climate/manners/corner/mosaic/loop/patrol/stripe/hood/feign/shovel/gape/encore/flip/saddle/inspect/write/orb/nook/taste/inch/bun/ball/coil/curl/bask/loaf/potato/settle/shine/dip/sprawl/guard/smolder/claim/fold/thrum/glow/incline/sun/dewlap/cinder/blaze/shed/lift/return/flick/warm/thread/dart/noodle/savor/nestle/center/scribble/gap/comma/probe/canyon/clause/spice/cord/audit/verdict/plumb/raid/tribute/docket/seal/bracelet/sway/jewel/heat/bough/pendant/treaty/emerald/aside/cue/ovation/seam/rounds/moss/fork/lap/copy/brief/visa/mimic/flash/root/flare/dig/perch/hang/clasp/scent/heave/lug/earth/bed/nest/pour/heft/oxbow/slack/bank/harbor/cradle/stay/rhyme/rumor/costume/frank/tile/postmark/cachet/courtesy/tuck/hide name collisions with prior guests and carpet_python window-play. No cry inventing — thank-yous are silent desk motion only. */

export const TRICK_KEY = "carpet_python";
export const TRICKS = ["legend", "rung", "contour", "runner", "bearing"] as const;
export const HAPPY = ["survey", "gazette", "shelf"] as const;
export type CarpetPythonTrickKind = (typeof TRICKS)[number];
export type CarpetPythonHappyKind = (typeof HAPPY)[number];
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

export type CarpetPythonTrick = {
  kind: CarpetPythonTrickKind;
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

export type CarpetPythonHappy = {
  kind: CarpetPythonHappyKind;
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

export const HAPPY_DUR: Record<CarpetPythonHappyKind, number> = {
  survey: 1.22,
  gazette: 1.28,
  shelf: 1.34,
};

/** Legend hold — Atlas rests as a desk map-legend carpet plate. Not window-play CHART. Not Nori orb. */
export const LEGEND_HOLD = 10.4;
export const RELEASE_S = 0.6;

export const DUR: Record<CarpetPythonTrickKind, number> = {
  legend: LEGEND_HOLD + RELEASE_S,
  rung: 1.44,
  contour: 1.48,
  runner: 1.56,
  bearing: 1.3,
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

export function nextTrickWait(justFinished: boolean, rand?: number, kind?: CarpetPythonTrickKind) {
  const roll = rand == null ? Math.random() : rand;
  if (kind === "legend") return 48 + roll * 28;
  if (kind === "rung") return 16 + roll * 11;
  if (kind === "contour") return 15 + roll * 10;
  return justFinished ? 10 + roll * 8 : 5 + roll * 6;
}

export function pickTrick(rand?: number, musicOn?: boolean, lastKind?: CarpetPythonTrickKind | null) {
  if (musicOn) return "legend" as const;
  const roll = rand == null ? Math.random() : rand;
  if (lastKind === "legend") {
    if (roll < 0.28) return "rung" as const;
    if (roll < 0.5) return "contour" as const;
    if (roll < 0.72) return "runner" as const;
    return "bearing" as const;
  }
  if (lastKind === "rung") {
    if (roll < 0.3) return "legend" as const;
    if (roll < 0.52) return "contour" as const;
    if (roll < 0.74) return "runner" as const;
    return "bearing" as const;
  }
  if (lastKind === "contour") {
    if (roll < 0.24) return "legend" as const;
    if (roll < 0.46) return "rung" as const;
    if (roll < 0.68) return "runner" as const;
    return "bearing" as const;
  }
  if (roll < 0.22) return "legend" as const;
  if (roll < 0.42) return "rung" as const;
  if (roll < 0.6) return "contour" as const;
  if (roll < 0.8) return "runner" as const;
  return "bearing" as const;
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
  return key === TRICK_KEY || key === "atlas";
}

export function startThankYou(
  key: string | undefined | null,
  lastKind: CarpetPythonHappyKind | string | null | undefined,
  x: number,
  facing: 1 | -1,
  flags?: TrickFlags,
) {
  if (!wantsThankYou(key)) return null;
  if (!happyCanStart(flags || { cmd: "idle" })) return null;
  const pick = pickHappy(lastKind as CarpetPythonHappyKind | null | undefined);
  return { happy: beginHappy(pick, x, facing), kind: pick };
}

export function pickHappy(lastKind?: CarpetPythonHappyKind | null, rand?: number) {
  const pool = HAPPY.filter((k) => k !== lastKind);
  const list = pool.length ? pool : [...HAPPY];
  const roll = rand == null ? Math.random() : rand;
  return list[Math.floor(roll * list.length)] || list[0];
}

export function beginHappy(kind: CarpetPythonHappyKind, x: number, facing: 1 | -1): CarpetPythonHappy {
  const name = HAPPY.includes(kind) ? kind : "survey";
  return {
    kind: name,
    happy: true,
    phase: "go",
    t: 0,
    x,
    lift: 0,
    rot: 0,
    anim: name === "survey" ? "sit" : name === "gazette" ? "sit" : "talk",
    facing: facing == null ? 1 : facing,
    fromX: x,
  };
}

export function surveyPose(t: number) {
  const u = Math.max(0, Math.min(1, t / HAPPY_DUR.survey));
  if (u < 0.14) {
    const s = u / 0.14;
    return { lift: s * 1.2, rot: s * -4.5, dx: 0, anim: "sit" as TrickAnim };
  }
  if (u < 0.78) {
    const scan = Math.abs(Math.sin(t * 2.6));
    return {
      lift: 1.2 - scan * 0.35,
      rot: -4.5 + scan * 4,
      dx: Math.sin(t * 1.15) * 0.16,
      anim: "sit" as TrickAnim,
    };
  }
  const s = (u - 0.78) / 0.22;
  return { lift: 0.9 * (1 - s), rot: -2.5 * (1 - s), dx: 0, anim: "idle" as TrickAnim };
}

export function gazettePose(t: number) {
  const u = Math.max(0, Math.min(1, t / HAPPY_DUR.gazette));
  if (u < 0.12) {
    const s = u / 0.12;
    return { lift: s * 1.45, rot: s * 6.5, dx: 0, anim: "sit" as TrickAnim };
  }
  if (u < 0.8) {
    const nod = Math.sin(t * 2.35);
    return {
      lift: 1.45 + Math.abs(nod) * 0.3,
      rot: 6.5 + nod * 5,
      dx: nod * 0.2,
      anim: "sit" as TrickAnim,
    };
  }
  const s = (u - 0.8) / 0.2;
  return { lift: 1.45 * (1 - s), rot: 6.5 * (1 - s), dx: 0, anim: "sit" as TrickAnim };
}

export function shelfPose(t: number) {
  return {
    lift: Math.abs(Math.sin(t * 1.65)) * 0.85 + 1.0,
    rot: -3.5 + Math.sin(t * 2.05) * 5.4,
    dx: Math.sin(t * 1.25) * 0.26,
    anim: "talk" as TrickAnim,
  };
}

export function stepHappy(happy: CarpetPythonHappy | null | undefined, dt: number, flags?: TrickFlags) {
  if (!happy || happy.phase === "done") return happy;
  if (happyShouldAbort(flags)) {
    return { ...happy, phase: "done" as const, t: 0, lift: 0, rot: 0, anim: "idle" as TrickAnim, abort: true };
  }
  const next: CarpetPythonHappy = { ...happy, t: happy.t + Math.max(0, dt) };
  const hold = HAPPY_DUR[next.kind];
  if (next.kind === "survey") {
    const pose = surveyPose(next.t);
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "gazette") {
    const pose = gazettePose(next.t);
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else {
    const pose = shelfPose(next.t);
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

export function beginTrick(kind: CarpetPythonTrickKind, x: number, facing: 1 | -1): CarpetPythonTrick {
  const anim: TrickAnim =
    kind === "legend"
      ? "sit"
      : kind === "rung"
        ? "walk"
        : kind === "contour"
          ? "walk"
          : kind === "runner"
            ? "walk"
            : kind === "bearing"
              ? "sit"
              : "sit";
  return {
    kind,
    phase: kind === "legend" ? "hold" : "go",
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

export function legendPose(t: number) {
  // Map-legend carpet breath — patterned plate on the blotter, not window chart.
  const beat = Math.sin(t * 0.92) + 0.32 * Math.sin(t * 2.55);
  return {
    lift: 0.52 + Math.abs(Math.sin(t * 0.68)) * 0.15,
    rot: -2.8 + beat * 3.0,
  };
}

export function releasePose(t: number) {
  const u = Math.max(0, Math.min(1, t / RELEASE_S));
  return { lift: 0.52 * (1 - Math.sin(u * Math.PI * 0.5)), rot: -2.8 * (1 - u) };
}

export function rungPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.rung));
  if (u < 0.12) {
    const s = smoothstep(u / 0.12);
    return { x: fromX + facing * s * 0.6, lift: s * 0.7, rot: s * 8 * facing, anim: "walk" as TrickAnim };
  }
  if (u < 0.42) {
    const s = (u - 0.12) / 0.3;
    // Climb a desk rung — vertical lift, not Jade bracelet coil jewelry.
    return {
      x: fromX + facing * (0.6 + smoothstep(s) * 0.4),
      lift: 0.7 + smoothstep(s) * 2.4,
      rot: facing * (8 - s * 6),
      anim: "play" as TrickAnim,
    };
  }
  if (u < 0.72) {
    const s = (u - 0.42) / 0.3;
    const sway = Math.sin(s * Math.PI * 2.2);
    return {
      x: fromX + facing * (1.0 + sway * 0.18),
      lift: 3.1 + Math.abs(sway) * 0.2,
      rot: facing * (2 + sway * 5),
      anim: "sit" as TrickAnim,
    };
  }
  const s = smoothstep((u - 0.72) / 0.28);
  return {
    x: fromX + facing * (1.0 * (1 - s)),
    lift: 3.1 * (1 - s),
    rot: facing * (2 * (1 - s)),
    anim: "walk" as TrickAnim,
  };
}

export function contourPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.contour));
  if (u < 0.12) {
    const s = smoothstep(u / 0.12);
    return { x: fromX + facing * s * 0.8, lift: s * 0.55, rot: s * 7 * facing, anim: "walk" as TrickAnim };
  }
  if (u < 0.7) {
    const s = (u - 0.12) / 0.58;
    // Trace a map contour — soft S-curve, not Saffron pencil scribble.
    const wave = Math.sin(s * Math.PI * 2.6);
    return {
      x: fromX + facing * (0.8 + s * 3.6),
      lift: 0.55 + Math.abs(wave) * 0.55,
      rot: facing * (7 + wave * 11),
      anim: "walk" as TrickAnim,
    };
  }
  const s = smoothstep((u - 0.7) / 0.3);
  return {
    x: fromX + facing * (4.4 * (1 - s) + s * 0),
    lift: 0.7 * (1 - s),
    rot: facing * (4 * (1 - s)),
    anim: "sit" as TrickAnim,
  };
}

export function runnerPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.runner));
  if (u < 0.12) {
    const s = smoothstep(u / 0.12);
    return { x: fromX + facing * s * 1.1, lift: s * 0.5, rot: s * 5 * facing, anim: "walk" as TrickAnim };
  }
  if (u < 0.48) {
    const s = (u - 0.12) / 0.36;
    // Lay a carpet runner along the blotter — not Nori unroll bun.
    const step = Math.floor(s * 3);
    const local = (s * 3) % 1;
    return {
      x: fromX + facing * (1.1 + step * 1.35 + smoothstep(local) * 1.35),
      lift: 0.5 + Math.sin(local * Math.PI) * 0.35,
      rot: facing * (5 + Math.sin(local * Math.PI) * 7),
      anim: "walk" as TrickAnim,
    };
  }
  if (u < 0.78) {
    const s = (u - 0.48) / 0.3;
    const nap = Math.abs(Math.sin(s * Math.PI * 1.8));
    return {
      x: fromX + facing * 5.15,
      lift: 0.22 + nap * 0.12,
      rot: facing * (-3 + nap * 2.5),
      anim: "sit" as TrickAnim,
    };
  }
  const s = smoothstep((u - 0.78) / 0.22);
  return {
    x: fromX + facing * (5.15 * (1 - s)),
    lift: 0.3 * (1 - s),
    rot: facing * (-1.5 * (1 - s)),
    anim: "idle" as TrickAnim,
  };
}

export function bearingPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.bearing));
  if (u < 0.14) {
    const s = smoothstep(u / 0.14);
    return { x: fromX, lift: s * 1.4, rot: s * 12 * facing, anim: "sit" as TrickAnim };
  }
  if (u < 0.72) {
    const s = (u - 0.14) / 0.58;
    // Compass-bearing orient — head points true, not Bandit stripe audit.
    const tick = Math.sin(s * Math.PI * 3.2);
    return {
      x: fromX + facing * tick * 0.22,
      lift: 1.4 - s * 0.35 + Math.abs(tick) * 0.18,
      rot: facing * (12 - s * 16 + tick * 3.5),
      anim: "play" as TrickAnim,
    };
  }
  const s = smoothstep((u - 0.72) / 0.28);
  return {
    x: fromX,
    lift: 1.1 * (1 - s),
    rot: facing * (-2 * (1 - s)),
    anim: "sit" as TrickAnim,
  };
}

export function stepTrick(trick: CarpetPythonTrick | null | undefined, dt: number, flags?: TrickFlags) {
  if (!trick || trick.phase === "done") return trick;
  if (shouldAbort(flags) && trick.kind !== "runner" && trick.kind !== "rung" && trick.kind !== "contour") {
    return { ...trick, phase: "done" as const, t: 0, lift: 0, rot: 0, anim: "idle" as TrickAnim, abort: true };
  }
  const next: CarpetPythonTrick = { ...trick, t: trick.t + Math.max(0, dt) };
  if (next.kind === "legend") {
    if (next.t < LEGEND_HOLD) {
      const pose = legendPose(next.t);
      next.phase = "hold";
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = "sit";
      return next;
    }
    if (next.t < LEGEND_HOLD + RELEASE_S) {
      const pose = releasePose(next.t - LEGEND_HOLD);
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
  if (next.kind === "rung") {
    const pose = rungPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "contour") {
    const pose = contourPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "runner") {
    const pose = runnerPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else {
    const pose = bearingPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  }
  if (u >= 1) return { ...next, phase: "done" as const, lift: 0, rot: 0, anim: "idle" as TrickAnim };
  return next;
}
