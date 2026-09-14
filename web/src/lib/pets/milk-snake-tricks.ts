/** Coral ground tricks while idle — ultra-polish pass. House Pueblo milk snake — rhyme / rumor / costume / frank / tile / cipher / verse personality (tricolor mimic stamp-box desk life; witty false-warning costume, not venom). Rhyme stacks the red/black/pale mnemonic flag; rumor softens a desk whisper; costume adjusts the false-warning coat; frank presses a cancellation stamp; tile places three stamp tiles; cipher ducks into a cryptic blotter fold (secretive milk-snake cover life — not hide/tuck/Nori nook); verse beats the red-black-pale teaching verse (not Bandit stripe, not rhyme hold). Window-play MOSAIC unchanged — never names `mosaic`. Ethogram keeps tongue + rhyme sit_hold; adds rumor/costume/cipher/verse/tile softs + freeze (replaces thin mimic). Nori owns orb/nook/taste/inch/unroll/loom/weave and savor/nestle/center; Saffron owns scribble/gap/comma/probe/canyon/blotter/pencil and clause/spice/cord; Bandit owns stripe/audit/verdict/plumb/raid/band/drawer and tribute/docket/seal; Jade owns bracelet/sway/jewel/heat/bough/liana/arbor and pendant/treaty/emerald; Bluff owns hood/feign/shovel/gape/encore/quiver/upright and aside/cue/ovation; Sash owns seam/rounds/moss/fork/lap/ribbon/creek and copy/brief/visa; Lula owns pour/heft/oxbow/slack/bank/anchor/meander and harbor/cradle/stay; budgie owns mimic; parrot owns flash; hedgehog owns curl/root; volt window-play owns coil; ferret owns noodle; Ember owns settle/shine/dip; Vesper owns fold/thrum/glow; Sol owns flick/sun; Coin owns flare; Thimble owns dig; Lula window-play owns loop; Echo window-play owns perch; Fox window-play owns scent; rosy_boa window-play owns stone. Guest slug Coral / key milk_snake — accept "milk_snake" and "coral". Amplitudes raised toward Rui richness; denser waits/weights; prefersHouseCry via milk_snake.wav. Thank-yous postmark / cachet / courtesy. Feed-happy after eat. Sleep, hide, leave, rest, card still win. Same map as desktop `milk-snake-tricks.js`. True house-Pueblo-milk-snake desk life — not Rui/cat/dog/rabbit/hamster/guinea_pig/turtle/goldfish/budgie/fox/penguin/parrot/ferret/hedgehog/chinchilla/axolotl/toucan/iguana/Sol/dragon/Vesper/phoenix/Ember/ball_python/Nori/corn_snake/Saffron/kingsnake/Bandit/green_tree_python/Jade/hognose/Bluff/garter/Sash/boa/Lula or *Dragon electrical (Relay/Fuse/Ground) clones. Avoids mosaic/loop/patrol/stripe/hood/feign/shovel/gape/encore/quiver/upright/flip/saddle/drape/inspect/write/orb/nook/taste/inch/unroll/loom/weave/bun/ball/coil/curl/bask/loaf/potato/tuck/hide/settle/shine/dip/sprawl/guard/smolder/claim/fold/thrum/glow/incline/sun/dewlap/cinder/blaze/shed/lift/return/flick/warm/thread/dart/noodle/savor/nestle/center/scribble/gap/comma/probe/canyon/blotter/pencil/clause/spice/cord/audit/verdict/plumb/raid/tribute/docket/seal/band/drawer/bracelet/sway/jewel/heat/bough/pendant/treaty/emerald/liana/arbor/aside/cue/ovation/seam/rounds/moss/fork/lap/copy/brief/visa/ribbon/creek/pour/heft/oxbow/slack/bank/anchor/meander/harbor/cradle/stay/mimic/flash/root/flare/dig/perch/hang/clasp/scent/stone/heave/lug/earth/bed/pebble/crevice/mesa/arroyo name collisions. Bird ultra (Soot→Ember) + Miso→Lula done; Echo/budgie + Peck/penguin + Quill/parrot + Keel/toucan + Ember skip birds. Next guest ultra is Blush / rosy_boa. No cry inventing beyond house milk_snake.wav prefer. Never retouch Rui sprites. */
export const TRICK_KEY = "milk_snake";
export const TRICKS = ["rhyme", "rumor", "costume", "frank", "tile", "cipher", "verse"] as const;
export const HAPPY = ["postmark", "cachet", "courtesy"] as const;
export type MilkSnakeTrickKind = (typeof TRICKS)[number];
export type MilkSnakeHappyKind = (typeof HAPPY)[number];
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

export type MilkSnakeTrick = {
  kind: MilkSnakeTrickKind;
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

export type MilkSnakeHappy = {
  kind: MilkSnakeHappyKind;
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

export const HAPPY_DUR: Record<MilkSnakeHappyKind, number> = {
  postmark: 1.55,
  cachet: 1.6,
  courtesy: 1.58,
};

/** Rhyme hold — Coral stacks red/black/pale as the desk mnemonic flag. Not Bandit stripe. Not window-play MOSAIC. */
export const RHYME_HOLD = 12.2;
export const RELEASE_S = 0.82;

export const DUR: Record<MilkSnakeTrickKind, number> = {
  rhyme: RHYME_HOLD + RELEASE_S,
  rumor: 1.78,
  costume: 1.92,
  frank: 1.72,
  tile: 1.98,
  cipher: 2.05,
  verse: 2.12,
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

export function nextTrickWait(justFinished: boolean, rand?: number, kind?: MilkSnakeTrickKind) {
  const roll = rand == null ? Math.random() : rand;
  if (kind === "rhyme") return 38 + roll * 24;
  if (kind === "verse" || kind === "costume") return 12 + roll * 9;
  if (kind === "cipher" || kind === "rumor") return 11 + roll * 8;
  if (kind === "frank" || kind === "tile") return 10 + roll * 8;
  return justFinished ? 8 + roll * 8 : 4 + roll * 7;
}

export function pickTrick(rand?: number, musicOn = false, lastKind?: MilkSnakeTrickKind | null): MilkSnakeTrickKind {
  if (musicOn) return "rhyme";
  const roll = rand == null ? Math.random() : rand;
  const pool = TRICKS.filter((k) => k !== lastKind);
  const list = pool.length ? pool : [...TRICKS];
  const weights = list.map((k) =>
    k === "rhyme" ? 0.55 : k === "cipher" || k === "verse" || k === "costume" ? 1.15 : 1
  );
  let total = 0;
  for (let i = 0; i < weights.length; i++) total += weights[i]!;
  let r = roll * total;
  for (let i = 0; i < list.length; i++) {
    r -= weights[i]!;
    if (r <= 0) return list[i]!;
  }
  return list[list.length - 1] || "rhyme";
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
  return key === TRICK_KEY || key === "coral";
}

export function startThankYou(
  key: string | undefined | null,
  lastKind: MilkSnakeHappyKind | string | null | undefined,
  x: number,
  facing: 1 | -1,
  flags?: TrickFlags,
) {
  if (!wantsThankYou(key)) return null;
  if (!happyCanStart(flags || { cmd: "idle" })) return null;
  const pick = pickHappy(lastKind as MilkSnakeHappyKind | null | undefined);
  return { happy: beginHappy(pick, x, facing), kind: pick };
}

export function pickHappy(lastKind?: MilkSnakeHappyKind | null, rand?: number) {
  const pool = HAPPY.filter((k) => k !== lastKind);
  const list = pool.length ? pool : [...HAPPY];
  const roll = rand == null ? Math.random() : rand;
  return list[Math.floor(roll * list.length)] || list[0];
}

export function beginHappy(kind: MilkSnakeHappyKind, x: number, facing: 1 | -1): MilkSnakeHappy {
  const name = HAPPY.includes(kind) ? kind : "postmark";
  return {
    kind: name,
    happy: true,
    phase: "go",
    t: 0,
    x,
    lift: 0,
    rot: 0,
    anim: name === "postmark" ? "sit" : name === "cachet" ? "sit" : "talk",
    facing: facing == null ? 1 : facing,
    fromX: x,
  };
}

export function postmarkPose(t: number) {
  const u = Math.max(0, Math.min(1, t / HAPPY_DUR.postmark));
  if (u < 0.14) {
    const s = u / 0.14;
    return { lift: s * 4.2, rot: s * -16, dx: 0, anim: "sit" as TrickAnim };
  }
  if (u < 0.78) {
    const press = Math.abs(Math.sin(t * 4.6));
    return {
      lift: 4.2 + press * 3.4,
      rot: -16 + Math.sin(t * 3.4) * 14,
      dx: Math.sin(t * 1.8) * 0.55,
      anim: "sit" as TrickAnim,
    };
  }
  const s = (u - 0.78) / 0.22;
  return { lift: 4.2 * (1 - s), rot: -16 * (1 - s), dx: 0, anim: "idle" as TrickAnim };
}

export function cachetPose(t: number) {
  const u = Math.max(0, Math.min(1, t / HAPPY_DUR.cachet));
  if (u < 0.12) {
    const s = u / 0.12;
    return { lift: s * 4.6, rot: s * 18, dx: 0, anim: "sit" as TrickAnim };
  }
  if (u < 0.8) {
    const rock = Math.sin(t * 2.8);
    return {
      lift: 4.6 + Math.abs(rock) * 3.2,
      rot: 18 + rock * 16,
      dx: rock * 0.7,
      anim: "sit" as TrickAnim,
    };
  }
  const s = (u - 0.8) / 0.2;
  return { lift: 4.6 * (1 - s), rot: 18 * (1 - s), dx: 0, anim: "sit" as TrickAnim };
}

export function courtesyPose(t: number) {
  return {
    lift: Math.abs(Math.sin(t * 3.4)) * 3.8 + 2.4,
    rot: -16 + Math.sin(t * 2.8) * 14,
    dx: Math.sin(t * 1.9) * 0.7,
    anim: "talk" as TrickAnim,
  };
}

export function stepHappy(happy: MilkSnakeHappy | null | undefined, dt: number, flags?: TrickFlags) {
  if (!happy || happy.phase === "done") return happy;
  if (happyShouldAbort(flags)) {
    return { ...happy, phase: "done" as const, t: 0, lift: 0, rot: 0, anim: "idle" as TrickAnim, abort: true };
  }
  const next: MilkSnakeHappy = { ...happy, t: happy.t + Math.max(0, dt) };
  const hold = HAPPY_DUR[next.kind];
  if (next.kind === "postmark") {
    const pose = postmarkPose(next.t);
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "cachet") {
    const pose = cachetPose(next.t);
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else {
    const pose = courtesyPose(next.t);
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

export function beginTrick(kind: MilkSnakeTrickKind, x: number, facing: 1 | -1): MilkSnakeTrick {
  const anim: TrickAnim =
    kind === "rhyme"
      ? "sit"
      : kind === "rumor"
        ? "talk"
        : kind === "costume"
          ? "sit"
          : kind === "frank"
            ? "sit"
            : kind === "tile"
              ? "walk"
              : kind === "cipher"
                ? "sit"
                : kind === "verse"
                  ? "talk"
                  : "sit";
  return {
    kind,
    phase: kind === "rhyme" ? "hold" : "go",
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

export function rhymePose(t: number) {
  // Three-beat tricolor rock — red / black / pale mnemonic, not Bandit band ticks.
  const beat = Math.sin(t * 1.7) + 0.45 * Math.sin(t * 3.4);
  return {
    lift: 2.4 + Math.sin(t * 1.7) * 2.8 + Math.abs(Math.sin(t * 3.4)) * 1.6,
    rot: -22 + Math.sin(t * 2.4) * 18 + Math.sin(t * 4.6) * 10,
  };
}

export function releasePose(t: number) {
  const u = Math.max(0, Math.min(1, t / RELEASE_S));
  return {
    lift: (2.4 + 2.8) * (1 - Math.sin(u * Math.PI * 0.5)),
    rot: -22 * (1 - u),
  };
}

export function rumorPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.rumor));
  if (u < 0.14) {
    const s = smoothstep(u / 0.14);
    return { x: fromX, lift: s * 4.8, rot: s * 16 * facing, anim: "talk" as TrickAnim };
  }
  if (u < 0.55) {
    const s = (u - 0.14) / 0.41;
    return {
      x: fromX + facing * smoothstep(s) * 4.2,
      lift: 4.8 - s * 1.4 + Math.sin(s * Math.PI) * 2.2,
      rot: facing * (16 - s * 28),
      anim: "talk" as TrickAnim,
    };
  }
  if (u < 0.82) {
    const s = (u - 0.55) / 0.27;
    return {
      x: fromX + facing * (4.2 - smoothstep(s) * 4.2),
      lift: 3.2 + Math.abs(Math.sin(s * Math.PI * 1.8)) * 2.0,
      rot: facing * (-14 + s * 10),
      anim: "talk" as TrickAnim,
    };
  }
  const s = smoothstep((u - 0.82) / 0.18);
  return {
    x: fromX,
    lift: 3.2 * (1 - s),
    rot: facing * (-4 * (1 - s)),
    anim: "sit" as TrickAnim,
  };
}

export function costumePose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.costume));
  if (u < 0.12) {
    const s = smoothstep(u / 0.12);
    return { x: fromX, lift: s * 5.2, rot: s * 28 * facing, anim: "sit" as TrickAnim };
  }
  if (u < 0.72) {
    const s = (u - 0.12) / 0.6;
    const shiver = Math.sin(s * Math.PI * 4.2);
    return {
      x: fromX + facing * shiver * 1.1,
      lift: 5.2 - s * 1.4 + Math.abs(shiver) * 2.2,
      rot: facing * (28 - s * 36 + shiver * 14),
      anim: "play" as TrickAnim,
    };
  }
  const s = smoothstep((u - 0.72) / 0.28);
  return {
    x: fromX,
    lift: 3.6 * (1 - s),
    rot: facing * (-6 * (1 - s)),
    anim: "sit" as TrickAnim,
  };
}

export function frankPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.frank));
  if (u < 0.14) {
    const s = smoothstep(u / 0.14);
    return { x: fromX, lift: s * 4.8, rot: s * 16 * facing, anim: "sit" as TrickAnim };
  }
  if (u < 0.5) {
    const s = (u - 0.14) / 0.36;
    return {
      x: fromX + facing * s * 1.2,
      lift: 4.8 - smoothstep(s) * 3.6,
      rot: facing * (16 - s * 28),
      anim: "sit" as TrickAnim,
    };
  }
  if (u < 0.82) {
    const s = (u - 0.5) / 0.32;
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
    rot: facing * (-4 * (1 - s)),
    anim: "idle" as TrickAnim,
  };
}

export function tilePose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.tile));
  if (u < 0.12) {
    const s = smoothstep(u / 0.12);
    return { x: fromX + facing * s * 1.8, lift: s * 3.2, rot: s * 14 * facing, anim: "walk" as TrickAnim };
  }
  if (u < 0.45) {
    const s = (u - 0.12) / 0.33;
    const step = Math.floor(s * 3);
    const local = (s * 3) % 1;
    return {
      x: fromX + facing * (1.8 + step * 2.0 + smoothstep(local) * 2.0),
      lift: 3.2 + Math.sin(local * Math.PI) * 2.6,
      rot: facing * (14 + Math.sin(local * Math.PI) * 22),
      anim: "walk" as TrickAnim,
    };
  }
  if (u < 0.78) {
    const s = (u - 0.45) / 0.33;
    return {
      x: fromX + facing * (7.8 - smoothstep(s) * 3.2),
      lift: 3.4 + Math.abs(Math.sin(s * Math.PI * 1.8)) * 2.0,
      rot: facing * (22 - s * 28),
      anim: "play" as TrickAnim,
    };
  }
  const s = smoothstep((u - 0.78) / 0.22);
  return {
    x: fromX + facing * (4.6 * (1 - s)),
    lift: 3.2 * (1 - s),
    rot: facing * (-4 * (1 - s)),
    anim: "sit" as TrickAnim,
  };
}

/** Cipher — cryptic milk-snake cover fold under the blotter corner. Not hide. Not Nori nook. Not tuck. */
export function cipherPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.cipher));
  if (u < 0.12) {
    const s = smoothstep(u / 0.12);
    return { x: fromX, lift: s * 3.4, rot: s * -12 * facing, anim: "sit" as TrickAnim };
  }
  if (u < 0.42) {
    const s = (u - 0.12) / 0.3;
    return {
      x: fromX + facing * smoothstep(s) * -1.4,
      lift: 3.4 - smoothstep(s) * 2.0,
      rot: facing * (-12 + s * 4),
      anim: "sit" as TrickAnim,
    };
  }
  if (u < 0.82) {
    const s = (u - 0.42) / 0.4;
    const hush = Math.abs(Math.sin(s * Math.PI * 1.8));
    return {
      x: fromX + facing * -1.4,
      lift: 1.2 + hush * 1.8,
      rot: facing * (-10 + hush * 16),
      anim: "sit" as TrickAnim,
    };
  }
  const s = smoothstep((u - 0.82) / 0.18);
  return {
    x: fromX + facing * (-1.4 * (1 - s)),
    lift: 1.2 * (1 - s),
    rot: facing * (-4 * (1 - s)),
    anim: "idle" as TrickAnim,
  };
}

/** Verse — three-beat red/black/pale teaching verse. Not Bandit stripe. Not rhyme hold. */
export function versePose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.verse));
  if (u < 0.12) {
    const s = smoothstep(u / 0.12);
    return { x: fromX + facing * s * 1.6, lift: s * 3.6, rot: s * 18 * facing, anim: "talk" as TrickAnim };
  }
  if (u < 0.78) {
    const s = (u - 0.12) / 0.66;
    const beat = Math.floor(s * 3);
    const local = (s * 3) % 1;
    const bob = Math.sin(local * Math.PI);
    return {
      x: fromX + facing * (1.6 + beat * 1.4 + bob * 0.6),
      lift: 3.6 + Math.abs(bob) * 2.8,
      rot: facing * (18 + beat * 6 + bob * 20),
      anim: "talk" as TrickAnim,
    };
  }
  const s = smoothstep((u - 0.78) / 0.22);
  return {
    x: fromX + facing * ((1.6 + 2.8) * (1 - s)),
    lift: 3.6 * (1 - s),
    rot: facing * (8 * (1 - s)),
    anim: "sit" as TrickAnim,
  };
}

export function stepTrick(trick: MilkSnakeTrick | null | undefined, dt: number, flags?: TrickFlags) {
  if (!trick || trick.phase === "done") return trick;
  if (shouldAbort(flags) && trick.kind !== "tile" && trick.kind !== "rumor" && trick.kind !== "verse") {
    return { ...trick, phase: "done" as const, t: 0, lift: 0, rot: 0, anim: "idle" as TrickAnim, abort: true };
  }
  const next: MilkSnakeTrick = { ...trick, t: trick.t + Math.max(0, dt) };
  if (next.kind === "rhyme") {
    if (next.t < RHYME_HOLD) {
      const pose = rhymePose(next.t);
      next.phase = "hold";
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = "sit";
      return next;
    }
    if (next.t < RHYME_HOLD + RELEASE_S) {
      const pose = releasePose(next.t - RHYME_HOLD);
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
  if (next.kind === "rumor") {
    const pose = rumorPose(next.t, from, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "costume") {
    const pose = costumePose(next.t, from, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "frank") {
    const pose = frankPose(next.t, from, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "tile") {
    const pose = tilePose(next.t, from, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "cipher") {
    const pose = cipherPose(next.t, from, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else {
    const pose = versePose(next.t, from, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  }
  if (u >= 1) return { ...next, phase: "done" as const, lift: 0, rot: 0, anim: "idle" as TrickAnim };
  return next;
}
