/** Coral ground tricks while idle. House Pueblo milk snake — rhyme / rumor / costume / frank / tile personality (tricolor mimic stamp-box desk life; witty false-warning costume, not venom). Feed-happy thank-yous sit after eat. Card-open freeze and window-play do not swallow a thank-you. Sleep, hide, and leave still win. Same map as desktop `milk-snake-tricks.js`. Not a Rui, cat, dog, rabbit, hamster, guinea pig, turtle, goldfish, budgie, fox, penguin, parrot, ferret, hedgehog, chinchilla, axolotl, toucan, iguana, dragon/Vesper, phoenix/Ember, ball-python/Nori, corn-snake/Saffron, kingsnake/Bandit, green-tree-python/Jade, hognose/Bluff, garter/Sash, boa/Lula, or *Dragon electrical (Relay/Fuse/Ground) move clone. Window-play MOSAIC unchanged — never names `mosaic`. Nori owns orb/nook/taste/inch/unroll and savor/nestle/center; Saffron owns scribble/gap/comma/probe/canyon and clause/spice/cord; Bandit owns stripe/audit/verdict/plumb/raid and tribute/docket/seal; Jade owns bracelet/sway/jewel/heat/bough and pendant/treaty/emerald; Bluff owns hood/feign/shovel/gape/encore and aside/cue/ovation; Sash owns seam/rounds/moss/fork/lap and copy/brief/visa; Lula owns pour/heft/oxbow/slack/bank and harbor/cradle/stay; budgie owns mimic; parrot owns flash; hedgehog owns curl/root; volt window-play owns coil; ferret owns noodle; Ember owns settle/shine/dip; Vesper owns fold/thrum/glow; Sol owns flick/sun; Coin owns flare; Thimble owns dig; Lula window-play owns loop; Echo window-play owns perch; Fox window-play owns scent; rosy_boa window-play owns stone. Avoids mosaic/loop/patrol/stripe/hood/feign/shovel/gape/encore/flip/saddle/drape/inspect/write/orb/nook/taste/inch/unroll/bun/ball/coil/curl/bask/loaf/potato/tuck/hide/settle/shine/dip/sprawl/guard/smolder/claim/fold/thrum/glow/incline/sun/dewlap/cinder/blaze/shed/lift/return/flick/warm/thread/dart/noodle/savor/nestle/center/scribble/gap/comma/probe/canyon/clause/spice/cord/stripe/audit/verdict/plumb/raid/tribute/docket/seal/bracelet/sway/jewel/heat/bough/pendant/treaty/emerald/aside/cue/ovation/seam/rounds/moss/fork/lap/copy/brief/visa/pour/heft/oxbow/slack/bank/harbor/cradle/stay/mimic/flash/root/flare/dig/perch/hang/clasp/scent/stone/heave/lug/earth/bed name collisions with prior guests and milk_snake window-play. No cry inventing — thank-yous are silent desk motion only. */

export const TRICK_KEY = "milk_snake";
export const TRICKS = ["rhyme", "rumor", "costume", "frank", "tile"] as const;
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
  postmark: 1.18,
  cachet: 1.24,
  courtesy: 1.3,
};

/** Rhyme hold — Coral stacks red/black/pale as the desk mnemonic flag. Not Bandit stripe. Not window-play MOSAIC. */
export const RHYME_HOLD = 10.1;
export const RELEASE_S = 0.58;

export const DUR: Record<MilkSnakeTrickKind, number> = {
  rhyme: RHYME_HOLD + RELEASE_S,
  rumor: 1.36,
  costume: 1.44,
  frank: 1.3,
  tile: 1.48,
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
  if (kind === "rhyme") return 44 + roll * 24;
  if (kind === "costume") return 15 + roll * 10;
  if (kind === "rumor") return 14 + roll * 9;
  return justFinished ? 10 + roll * 8 : 5 + roll * 6;
}

export function pickTrick(rand?: number, musicOn?: boolean, lastKind?: MilkSnakeTrickKind | null) {
  if (musicOn) return "rhyme" as const;
  const roll = rand == null ? Math.random() : rand;
  if (lastKind === "rhyme") {
    if (roll < 0.28) return "rumor" as const;
    if (roll < 0.5) return "costume" as const;
    if (roll < 0.72) return "frank" as const;
    return "tile" as const;
  }
  if (lastKind === "costume") {
    if (roll < 0.3) return "rhyme" as const;
    if (roll < 0.52) return "rumor" as const;
    if (roll < 0.74) return "frank" as const;
    return "tile" as const;
  }
  if (lastKind === "rumor") {
    if (roll < 0.24) return "rhyme" as const;
    if (roll < 0.46) return "costume" as const;
    if (roll < 0.68) return "frank" as const;
    return "tile" as const;
  }
  if (roll < 0.22) return "rhyme" as const;
  if (roll < 0.42) return "rumor" as const;
  if (roll < 0.6) return "costume" as const;
  if (roll < 0.8) return "frank" as const;
  return "tile" as const;
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
    return { lift: s * 1.25, rot: s * -6, dx: 0, anim: "sit" as TrickAnim };
  }
  if (u < 0.78) {
    const press = Math.abs(Math.sin(t * 3.4));
    return {
      lift: 1.25 - press * 0.55,
      rot: -6 + press * 4,
      dx: Math.sin(t * 1.4) * 0.18,
      anim: "sit" as TrickAnim,
    };
  }
  const s = (u - 0.78) / 0.22;
  return { lift: 0.9 * (1 - s), rot: -4 * (1 - s), dx: 0, anim: "idle" as TrickAnim };
}

export function cachetPose(t: number) {
  const u = Math.max(0, Math.min(1, t / HAPPY_DUR.cachet));
  if (u < 0.12) {
    const s = u / 0.12;
    return { lift: s * 1.55, rot: s * 8, dx: 0, anim: "sit" as TrickAnim };
  }
  if (u < 0.8) {
    const rock = Math.sin(t * 2.6);
    return {
      lift: 1.55 + Math.abs(rock) * 0.32,
      rot: 8 + rock * 6.5,
      dx: rock * 0.3,
      anim: "sit" as TrickAnim,
    };
  }
  const s = (u - 0.8) / 0.2;
  return { lift: 1.55 * (1 - s), rot: 8 * (1 - s), dx: 0, anim: "sit" as TrickAnim };
}

export function courtesyPose(t: number) {
  return {
    lift: Math.abs(Math.sin(t * 1.9)) * 0.9 + 1.0,
    rot: -5 + Math.sin(t * 2.3) * 5.8,
    dx: Math.sin(t * 1.45) * 0.28,
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
  const beat = Math.sin(t * 1.15) + 0.45 * Math.sin(t * 3.45);
  return {
    lift: 0.62 + Math.abs(Math.sin(t * 0.85)) * 0.18,
    rot: -4 + beat * 3.6,
  };
}

export function releasePose(t: number) {
  const u = Math.max(0, Math.min(1, t / RELEASE_S));
  return { lift: 0.62 * (1 - Math.sin(u * Math.PI * 0.5)), rot: -4 * (1 - u) };
}

export function rumorPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.rumor));
  if (u < 0.14) {
    const s = smoothstep(u / 0.14);
    return { x: fromX, lift: s * 1.35, rot: s * 9 * facing, anim: "talk" as TrickAnim };
  }
  if (u < 0.55) {
    const s = (u - 0.14) / 0.41;
    return {
      x: fromX + facing * smoothstep(s) * 2.8,
      lift: 1.35 - s * 0.35 + Math.sin(s * Math.PI) * 0.25,
      rot: facing * (9 - s * 14),
      anim: "talk" as TrickAnim,
    };
  }
  if (u < 0.82) {
    const s = (u - 0.55) / 0.27;
    // Return the rumor kinder — slip back softer.
    return {
      x: fromX + facing * (2.8 - smoothstep(s) * 2.8),
      lift: 1.0 + Math.abs(Math.sin(s * Math.PI * 1.6)) * 0.28,
      rot: facing * (-5 + s * 3),
      anim: "talk" as TrickAnim,
    };
  }
  const s = smoothstep((u - 0.82) / 0.18);
  return {
    x: fromX,
    lift: 1.0 * (1 - s),
    rot: facing * (-2 * (1 - s)),
    anim: "sit" as TrickAnim,
  };
}

export function costumePose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.costume));
  if (u < 0.12) {
    const s = smoothstep(u / 0.12);
    return { x: fromX, lift: s * 1.7, rot: s * 12 * facing, anim: "sit" as TrickAnim };
  }
  if (u < 0.72) {
    const s = (u - 0.12) / 0.6;
    // Adjust the false-warning coat — quick band shivers, not Bluff hood/feign.
    const shiver = Math.sin(s * Math.PI * 4.2);
    return {
      x: fromX + facing * shiver * 0.35,
      lift: 1.7 - s * 0.45 + Math.abs(shiver) * 0.22,
      rot: facing * (12 - s * 16 + shiver * 5),
      anim: "play" as TrickAnim,
    };
  }
  const s = smoothstep((u - 0.72) / 0.28);
  return {
    x: fromX,
    lift: 1.25 * (1 - s),
    rot: facing * (-2 * (1 - s)),
    anim: "sit" as TrickAnim,
  };
}

export function frankPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.frank));
  if (u < 0.14) {
    const s = smoothstep(u / 0.14);
    return { x: fromX, lift: s * 1.45, rot: s * 5 * facing, anim: "sit" as TrickAnim };
  }
  if (u < 0.5) {
    const s = (u - 0.14) / 0.36;
    return {
      x: fromX + facing * s * 0.4,
      lift: 1.45 - smoothstep(s) * 1.2,
      rot: facing * (5 - s * 11),
      anim: "sit" as TrickAnim,
    };
  }
  if (u < 0.82) {
    const s = (u - 0.5) / 0.32;
    const press = Math.abs(Math.sin(s * Math.PI * 2.2));
    return {
      x: fromX + facing * 0.4,
      lift: 0.2 + press * 0.14,
      rot: facing * (-6 + press * 2.5),
      anim: "sit" as TrickAnim,
    };
  }
  const s = smoothstep((u - 0.82) / 0.18);
  return {
    x: fromX + facing * (0.4 * (1 - s)),
    lift: 0.2 * (1 - s),
    rot: facing * (-2 * (1 - s)),
    anim: "idle" as TrickAnim,
  };
}

export function tilePose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.tile));
  if (u < 0.12) {
    const s = smoothstep(u / 0.12);
    return { x: fromX + facing * s * 1.1, lift: s * 0.7, rot: s * 8 * facing, anim: "walk" as TrickAnim };
  }
  if (u < 0.45) {
    const s = (u - 0.12) / 0.33;
    // Place three stamp tiles — desk mosaic cousin, not window MOSAIC.
    const step = Math.floor(s * 3);
    const local = (s * 3) % 1;
    return {
      x: fromX + facing * (1.1 + step * 1.35 + smoothstep(local) * 1.35),
      lift: 0.7 + Math.sin(local * Math.PI) * 0.55,
      rot: facing * (8 + Math.sin(local * Math.PI) * 10),
      anim: "walk" as TrickAnim,
    };
  }
  if (u < 0.78) {
    const s = (u - 0.45) / 0.33;
    return {
      x: fromX + facing * (5.15 - smoothstep(s) * 2.2),
      lift: 0.85 + Math.abs(Math.sin(s * Math.PI * 1.8)) * 0.3,
      rot: facing * (14 - s * 18),
      anim: "play" as TrickAnim,
    };
  }
  const s = smoothstep((u - 0.78) / 0.22);
  return {
    x: fromX + facing * (2.95 * (1 - s)),
    lift: 0.7 * (1 - s),
    rot: facing * (-2 * (1 - s)),
    anim: "sit" as TrickAnim,
  };
}

export function stepTrick(trick: MilkSnakeTrick | null | undefined, dt: number, flags?: TrickFlags) {
  if (!trick || trick.phase === "done") return trick;
  if (shouldAbort(flags) && trick.kind !== "tile" && trick.kind !== "rumor") {
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
  if (next.kind === "rumor") {
    const pose = rumorPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "costume") {
    const pose = costumePose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "frank") {
    const pose = frankPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else {
    const pose = tilePose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  }
  if (u >= 1) return { ...next, phase: "done" as const, lift: 0, rot: 0, anim: "idle" as TrickAnim };
  return next;
}
