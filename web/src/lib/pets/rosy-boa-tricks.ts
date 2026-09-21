/** Blush ground tricks while idle — ultra-polish pass. House rosy boa — pebble / crevice / rosy / mesa / arroyo / dune / talus personality (small desert rock / pink / warm-corner desk life; not Lula boa river-weight). Pebble rests a pink desk stone; crevice eases into a keyboard gap; rosy shimmers dusk-pink; mesa presses a flat warm plate; arroyo walks a desert-wash crawl; dune rolls a sandy scrub undulation (species-true Lichanura sand scrub — not arroyo wash, not Sash creek); talus weaves rocky hillside rubble (species-true talus-slope life — not crevice gap, not Nori nook, not hide/tuck). Window-play STONE unchanged — never names `stone`. Ethogram keeps tongue + pebble sit_hold; adds crevice/rosy/mesa/dune/talus softs + freeze (replaces thin nest-only). Nori owns orb/nook/taste/inch/unroll/loom/weave and savor/nestle/center; Saffron owns scribble/gap/comma/probe/canyon/blotter/pencil and clause/spice/cord; Bandit owns stripe/audit/verdict/plumb/raid/band/drawer and tribute/docket/seal; Jade owns bracelet/sway/jewel/heat/bough/liana/arbor and pendant/treaty/emerald; Bluff owns hood/feign/shovel/gape/encore/quiver/upright and aside/cue/ovation; Sash owns seam/rounds/moss/fork/lap/ribbon/creek and copy/brief/visa; Lula owns pour/heft/oxbow/slack/bank/anchor/meander and harbor/cradle/stay; Coral owns rhyme/rumor/costume/frank/tile/cipher/verse and postmark/cachet/courtesy; budgie owns mimic; parrot owns flash; hedgehog owns curl/root; turtle owns tuck; volt window-play owns coil; ferret owns noodle; Ember owns settle/shine/dip; Vesper owns fold/thrum/glow; Sol owns flick/sun; Coin owns flare; Thimble owns dig; Lula window-play owns loop; Echo window-play owns perch; Fox window-play owns scent; rosy_boa window-play owns stone; hamster owns nest. Guest slug Blush / key rosy_boa — accept "rosy_boa" and "blush". Amplitudes raised toward Rui richness; denser waits/weights; prefersHouseCry via rosy_boa.wav. Thank-yous climate / manners / corner. Feed-happy after eat. Sleep, hide, leave, rest, card still win. Same map as desktop `rosy-boa-tricks.js`. True house-rosy-boa desk life — not Rui/cat/dog/rabbit/hamster/guinea_pig/turtle/goldfish/budgie/fox/penguin/parrot/ferret/hedgehog/chinchilla/axolotl/toucan/iguana/Sol/dragon/Vesper/phoenix/Ember/ball_python/Nori/corn_snake/Saffron/kingsnake/Bandit/green_tree_python/Jade/hognose/Bluff/garter/Sash/boa/Lula/milk_snake/Coral or *Dragon electrical (Relay/Fuse/Ground) clones. Avoids stone/tuck/hide/pour/heft/oxbow/slack/bank/harbor/cradle/stay/rhyme/rumor/costume/frank/tile/cipher/verse/postmark/cachet/courtesy/mosaic/loop/patrol/stripe/hood/feign/shovel/gape/encore/flip/saddle/drape/inspect/write/orb/nook/taste/inch/unroll/bun/ball/coil/curl/bask/loaf/potato/settle/shine/dip/sprawl/guard/smolder/claim/fold/thrum/glow/incline/sun/dewlap/cinder/blaze/shed/lift/return/flick/warm/thread/dart/noodle/savor/nestle/center/scribble/gap/comma/probe/canyon/clause/spice/cord/audit/verdict/plumb/raid/tribute/docket/seal/bracelet/sway/jewel/heat/bough/pendant/treaty/emerald/aside/cue/ovation/seam/rounds/moss/fork/lap/copy/brief/visa/ribbon/creek/mimic/flash/root/flare/dig/perch/hang/clasp/scent/heave/lug/earth/bed/nest/grit/ledge/ochre/silt/drift/flush/shade/pocket/wash/scrub/burrow name collisions with prior guests and rosy_boa window-play. Bird ultra (Soot→Ember) + Miso→Coral done; Echo/budgie + Peck/penguin + Quill/parrot + Keel/toucan + Ember skip birds. Amplitudes raised toward Rui richness; denser waits/weights (PEBBLE_HOLD=11.2 RELEASE_S=1.18). Atlas densified. Cup densified. Sepia densified. Chamber densified. Pulse densified. Ochre densified. Next leftover Tenant / hermit_crab. No cry inventing beyond house rosy_boa.wav prefer. Never retouch Rui sprites. */
export const TRICK_KEY = "rosy_boa";
export const TRICKS = ["pebble", "crevice", "rosy", "mesa", "arroyo", "dune", "talus"] as const;
export const HAPPY = ["climate", "manners", "corner"] as const;
export type RosyBoaTrickKind = (typeof TRICKS)[number];
export type RosyBoaHappyKind = (typeof HAPPY)[number];
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

export type RosyBoaTrick = {
  kind: RosyBoaTrickKind;
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

export type RosyBoaHappy = {
  kind: RosyBoaHappyKind;
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

export const HAPPY_DUR: Record<RosyBoaHappyKind, number> = {
  climate: 1.55,
  manners: 1.6,
  corner: 1.58,
};

/** Pebble hold — Blush becomes a pink desk pebble. Not window-play STONE. Not Lula pour. */
export const PEBBLE_HOLD = 11.2;
export const RELEASE_S = 1.18;

export const DUR: Record<RosyBoaTrickKind, number> = {
  pebble: PEBBLE_HOLD + RELEASE_S,
  crevice: 1.78,
  rosy: 1.92,
  mesa: 1.72,
  arroyo: 1.98,
  dune: 2.05,
  talus: 2.12,
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

export function nextTrickWait(justFinished: boolean, rand?: number, kind?: RosyBoaTrickKind) {
  const roll = rand == null ? Math.random() : rand;
  if (kind === "pebble") return 40 + roll * 26;
  if (kind === "dune" || kind === "talus" || kind === "rosy") return 12.8 + roll * 9.4;
  if (kind === "crevice" || kind === "arroyo") return 12.8 + roll * 9.4;
  if (kind === "mesa") return 11.6 + roll * 8.5;
  return justFinished ? 8.5 + roll * 8.4 : 4.4 + roll * 7.4;
}

export function pickTrick(rand?: number, musicOn = false, lastKind?: RosyBoaTrickKind | null): RosyBoaTrickKind {
  if (musicOn) return "pebble";
  const roll = rand == null ? Math.random() : rand;
  const pool = TRICKS.filter((k) => k !== lastKind);
  const list = pool.length ? pool : [...TRICKS];
  const weights = list.map((k) =>
    k === "pebble" ? 0.72 : k === "dune" || k === "talus" || k === "rosy" ? 1.28 : k === "crevice" || k === "arroyo" ? 1.18 : 1.08
  );
  let total = 0;
  for (let i = 0; i < weights.length; i++) total += weights[i]!;
  let r = roll * total;
  for (let i = 0; i < list.length; i++) {
    r -= weights[i]!;
    if (r <= 0) return list[i]!;
  }
  return list[list.length - 1] || "pebble";
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
  return key === TRICK_KEY || key === "blush";
}

export function startThankYou(
  key: string | undefined | null,
  lastKind: RosyBoaHappyKind | string | null | undefined,
  x: number,
  facing: 1 | -1,
  flags?: TrickFlags,
) {
  if (!wantsThankYou(key)) return null;
  if (!happyCanStart(flags || { cmd: "idle" })) return null;
  const pick = pickHappy(lastKind as RosyBoaHappyKind | null | undefined);
  return { happy: beginHappy(pick, x, facing), kind: pick };
}

export function pickHappy(lastKind?: RosyBoaHappyKind | null, rand?: number) {
  const pool = HAPPY.filter((k) => k !== lastKind);
  const list = pool.length ? pool : [...HAPPY];
  const roll = rand == null ? Math.random() : rand;
  return list[Math.floor(roll * list.length)] || list[0];
}

export function beginHappy(kind: RosyBoaHappyKind, x: number, facing: 1 | -1): RosyBoaHappy {
  const name = HAPPY.includes(kind) ? kind : "climate";
  return {
    kind: name,
    happy: true,
    phase: "go",
    t: 0,
    x,
    lift: 0,
    rot: 0,
    anim: name === "climate" ? "sit" : name === "manners" ? "sit" : "talk",
    facing: facing == null ? 1 : facing,
    fromX: x,
  };
}

export function climatePose(t: number) {
  const u = Math.max(0, Math.min(1, t / HAPPY_DUR.climate));
  if (u < 0.14) {
    const s = u / 0.14;
    return { lift: s * 5.04, rot: s * -19.2, dx: 0, anim: "sit" as TrickAnim };
  }
  if (u < 0.78) {
    const warm = Math.abs(Math.sin(t * 4.6));
    return {
      lift: 5.04 + warm * 4.08,
      rot: -19.2 + Math.sin(t * 3.4) * 16.8,
      dx: Math.sin(t * 1.8) * 0.66,
      anim: "sit" as TrickAnim,
    };
  }
  const s = (u - 0.78) / 0.22;
  return { lift: 5.04 * (1 - s), rot: -19.2 * (1 - s), dx: 0, anim: "idle" as TrickAnim };
}

export function mannersPose(t: number) {
  const u = Math.max(0, Math.min(1, t / HAPPY_DUR.manners));
  if (u < 0.12) {
    const s = u / 0.12;
    return { lift: s * 5.52, rot: s * 21.6, dx: 0, anim: "sit" as TrickAnim };
  }
  if (u < 0.8) {
    const nod = Math.sin(t * 2.8);
    return {
      lift: 5.52 + Math.abs(nod) * 3.84,
      rot: 21.6 + nod * 19.2,
      dx: nod * 0.84,
      anim: "sit" as TrickAnim,
    };
  }
  const s = (u - 0.8) / 0.2;
  return { lift: 5.52 * (1 - s), rot: 21.6 * (1 - s), dx: 0, anim: "sit" as TrickAnim };
}

export function cornerPose(t: number) {
  return {
    lift: Math.abs(Math.sin(t * 3.4)) * 4.56 + 2.88,
    rot: -19.2 + Math.sin(t * 2.8) * 16.8,
    dx: Math.sin(t * 1.9) * 0.84,
    anim: "talk" as TrickAnim,
  };
}

export function stepHappy(happy: RosyBoaHappy | null | undefined, dt: number, flags?: TrickFlags) {
  if (!happy || happy.phase === "done") return happy;
  if (happyShouldAbort(flags)) {
    return { ...happy, phase: "done" as const, t: 0, lift: 0, rot: 0, anim: "idle" as TrickAnim, abort: true };
  }
  const next: RosyBoaHappy = { ...happy, t: happy.t + Math.max(0, dt) };
  const hold = HAPPY_DUR[next.kind];
  if (next.kind === "climate") {
    const pose = climatePose(next.t);
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "manners") {
    const pose = mannersPose(next.t);
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else {
    const pose = cornerPose(next.t);
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

export function beginTrick(kind: RosyBoaTrickKind, x: number, facing: 1 | -1): RosyBoaTrick {
  const anim: TrickAnim =
    kind === "pebble"
      ? "sit"
      : kind === "crevice"
        ? "walk"
        : kind === "rosy"
          ? "sit"
          : kind === "mesa"
            ? "sit"
            : kind === "arroyo"
              ? "walk"
              : kind === "dune"
                ? "walk"
                : kind === "talus"
                  ? "sit"
                  : "sit";
  return {
    kind,
    phase: kind === "pebble" ? "hold" : "go",
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

export function pebblePose(t: number) {
  // Pink-rock breath — desk pebble, not window sill stone tuck.
  const beat = Math.sin(t * 1.7) + 0.54 * Math.sin(t * 3.4);
  return {
    lift: 2.88 + Math.sin(t * 1.7) * 3.36 + Math.abs(Math.sin(t * 3.4)) * 1.92,
    rot: -26.4 + Math.sin(t * 2.4) * 21.6 + Math.sin(t * 4.6) * 12,
  };
}

export function releasePose(t: number) {
  const u = Math.max(0, Math.min(1, t / RELEASE_S));
  return {
    lift: (2.88 + 3.36) * (1 - Math.sin(u * Math.PI * 0.5)),
    rot: -26.4 * (1 - u),
  };
}

export function crevicePose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.crevice));
  if (u < 0.14) {
    const s = smoothstep(u / 0.14);
    return { x: fromX + facing * s * 2.16, lift: s * 3.84, rot: s * 16.8 * facing, anim: "walk" as TrickAnim };
  }
  if (u < 0.48) {
    const s = (u - 0.14) / 0.408;
    return {
      x: fromX + facing * (2.16 + smoothstep(s) * 2.64),
      lift: 3.84 - smoothstep(s) * 2.4,
      rot: facing * (16.8 - s * 26.4),
      anim: "sit" as TrickAnim,
    };
  }
  if (u < 0.78) {
    const s = (u - 0.48) / 0.3;
    const hush = Math.abs(Math.sin(s * Math.PI * 1.8));
    return {
      x: fromX + facing * 4.8,
      lift: 1.2 + hush * 1.92,
      rot: facing * (-14.4 + hush * 16.8),
      anim: "sit" as TrickAnim,
    };
  }
  const s = smoothstep((u - 0.78) / 0.22);
  return {
    x: fromX + facing * (4.8 * (1 - s)),
    lift: 1.2 * (1 - s),
    rot: facing * (-4.8 * (1 - s)),
    anim: "idle" as TrickAnim,
  };
}

export function rosyPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.rosy));
  if (u < 0.12) {
    const s = smoothstep(u / 0.12);
    return { x: fromX, lift: s * 6.24, rot: s * 33.6 * facing, anim: "sit" as TrickAnim };
  }
  if (u < 0.72) {
    const s = (u - 0.12) / 0.6;
    const shimmer = Math.sin(s * Math.PI * 4.2);
    return {
      x: fromX + facing * shimmer * 0.84,
      lift: 6.24 - s * 1.68 + Math.abs(shimmer) * 2.64,
      rot: facing * (33.6 - s * 43.2 + shimmer * 16.8),
      anim: "play" as TrickAnim,
    };
  }
  const s = smoothstep((u - 0.72) / 0.28);
  return {
    x: fromX,
    lift: 4.32 * (1 - s),
    rot: facing * (-7.2 * (1 - s)),
    anim: "sit" as TrickAnim,
  };
}

export function mesaPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.mesa));
  if (u < 0.14) {
    const s = smoothstep(u / 0.14);
    return { x: fromX, lift: s * 5.76, rot: s * 19.2 * facing, anim: "sit" as TrickAnim };
  }
  if (u < 0.5) {
    const s = (u - 0.14) / 0.36;
    return {
      x: fromX + facing * s * 1.44,
      lift: 5.76 - smoothstep(s) * 4.32,
      rot: facing * (19.2 - s * 33.6),
      anim: "sit" as TrickAnim,
    };
  }
  if (u < 0.82) {
    const s = (u - 0.5) / 0.32;
    const press = Math.abs(Math.sin(s * Math.PI * 2.2));
    return {
      x: fromX + facing * 1.44,
      lift: 1.2 + press * 1.68,
      rot: facing * (-16.8 + press * 9.6),
      anim: "sit" as TrickAnim,
    };
  }
  const s = smoothstep((u - 0.82) / 0.18);
  return {
    x: fromX + facing * (1.44 * (1 - s)),
    lift: 1.2 * (1 - s),
    rot: facing * (-4.8 * (1 - s)),
    anim: "idle" as TrickAnim,
  };
}

export function arroyoPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.arroyo));
  if (u < 0.12) {
    const s = smoothstep(u / 0.12);
    return { x: fromX + facing * s * 2.16, lift: s * 3.84, rot: s * 16.8 * facing, anim: "walk" as TrickAnim };
  }
  if (u < 0.45) {
    const s = (u - 0.12) / 0.33;
    const step = Math.floor(s * 3);
    const local = (s * 3) % 1;
    return {
      x: fromX + facing * (2.16 + step * 2.4 + smoothstep(local) * 2.4),
      lift: 3.84 + Math.sin(local * Math.PI) * 3.12,
      rot: facing * (16.8 + Math.sin(local * Math.PI) * 26.4),
      anim: "walk" as TrickAnim,
    };
  }
  if (u < 0.78) {
    const s = (u - 0.45) / 0.33;
    return {
      x: fromX + facing * (9.36 - smoothstep(s) * 3.84),
      lift: 4.08 + Math.abs(Math.sin(s * Math.PI * 1.8)) * 2.4,
      rot: facing * (26.4 - s * 33.6),
      anim: "play" as TrickAnim,
    };
  }
  const s = smoothstep((u - 0.78) / 0.22);
  return {
    x: fromX + facing * (5.52 * (1 - s)),
    lift: 3.84 * (1 - s),
    rot: facing * (-4.8 * (1 - s)),
    anim: "sit" as TrickAnim,
  };
}

/** Dune — sandy scrub undulation across the blotter. Not arroyo wash. Not Sash creek. */
export function dunePose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.dune));
  if (u < 0.12) {
    const s = smoothstep(u / 0.12);
    return { x: fromX + facing * s * 1.92, lift: s * 4.32, rot: s * 21.6 * facing, anim: "walk" as TrickAnim };
  }
  if (u < 0.78) {
    const s = (u - 0.12) / 0.66;
    const beat = Math.floor(s * 3);
    const local = (s * 3) % 1;
    const bob = Math.sin(local * Math.PI);
    return {
      x: fromX + facing * (1.92 + beat * 2.16 + bob * 0.84),
      lift: 4.32 + Math.abs(bob) * 3.36,
      rot: facing * (21.6 + beat * 7.2 + bob * 24),
      anim: "walk" as TrickAnim,
    };
  }
  const s = smoothstep((u - 0.78) / 0.22);
  return {
    x: fromX + facing * ((1.92 + 4.32) * (1 - s)),
    lift: 4.32 * (1 - s),
    rot: facing * (9.6 * (1 - s)),
    anim: "sit" as TrickAnim,
  };
}

/** Talus — rocky hillside rubble weave. Not crevice keyboard-gap. Not Nori nook. Not hide/tuck. */
export function talusPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.talus));
  if (u < 0.12) {
    const s = smoothstep(u / 0.12);
    return { x: fromX, lift: s * 4.08, rot: s * -14.4 * facing, anim: "sit" as TrickAnim };
  }
  if (u < 0.42) {
    const s = (u - 0.12) / 0.3;
    return {
      x: fromX + facing * smoothstep(s) * -1.68,
      lift: 4.08 - smoothstep(s) * 2.4,
      rot: facing * (-14.4 + s * 4.8),
      anim: "sit" as TrickAnim,
    };
  }
  if (u < 0.82) {
    const s = (u - 0.42) / 0.4;
    const hush = Math.abs(Math.sin(s * Math.PI * 1.8));
    return {
      x: fromX + facing * -1.68 + facing * Math.sin(s * Math.PI * 2.4) * 1.08,
      lift: 1.44 + hush * 2.16,
      rot: facing * (-12 + hush * 19.2),
      anim: "sit" as TrickAnim,
    };
  }
  const s = smoothstep((u - 0.82) / 0.18);
  return {
    x: fromX + facing * (-1.68 * (1 - s)),
    lift: 1.44 * (1 - s),
    rot: facing * (-4.8 * (1 - s)),
    anim: "idle" as TrickAnim,
  };
}

export function stepTrick(trick: RosyBoaTrick | null | undefined, dt: number, flags?: TrickFlags) {
  if (!trick || trick.phase === "done") return trick;
  if (shouldAbort(flags) && trick.kind !== "arroyo" && trick.kind !== "crevice" && trick.kind !== "dune") {
    return { ...trick, phase: "done" as const, t: 0, lift: 0, rot: 0, anim: "idle" as TrickAnim, abort: true };
  }
  const next: RosyBoaTrick = { ...trick, t: trick.t + Math.max(0, dt) };
  if (next.kind === "pebble") {
    if (next.t < PEBBLE_HOLD) {
      const pose = pebblePose(next.t);
      next.phase = "hold";
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = "sit";
      return next;
    }
    if (next.t < PEBBLE_HOLD + RELEASE_S) {
      const pose = releasePose(next.t - PEBBLE_HOLD);
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
  if (next.kind === "crevice") {
    const pose = crevicePose(next.t, from, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "rosy") {
    const pose = rosyPose(next.t, from, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "mesa") {
    const pose = mesaPose(next.t, from, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "arroyo") {
    const pose = arroyoPose(next.t, from, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "dune") {
    const pose = dunePose(next.t, from, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else {
    const pose = talusPose(next.t, from, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  }
  if (u >= 1) return { ...next, phase: "done" as const, lift: 0, rot: 0, anim: "idle" as TrickAnim };
  return next;
}
