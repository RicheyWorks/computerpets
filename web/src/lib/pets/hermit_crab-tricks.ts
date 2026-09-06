/** Tenant ground tricks while idle. House hermit crab — swap / antenna / scuttle / withdraw / vacancy personality (shell-swap try-on, antennal tap probes, sideways scuttle bursts, soft-abdomen withdraw into the lid, house-hunting vacancy desk life; not Cling podia/righting/crawl/evert/penta, Pulse bell/oral/lucent/trail/medusa, Clip nest/cheek/scurry/pocket/reel, Burr curl/snuffle, Chamber spiral, Cup mantle, Ink soak/tuck, or Coin drift). Feed-happy thank-yous sit after eat. Card-open freeze and window-play do not swallow a thank-you. Sleep, hide, and leave still win. Same map as desktop hermit_crab-tricks.js. Not a Rui, cat, dog, rabbit, hamster/Clip, guinea pig, turtle/Ink, goldfish/Coin, budgie, fox, penguin, parrot, ferret, hedgehog/Burr, chinchilla, axolotl/Bloom, toucan, iguana, dragon/Vesper, phoenix/Ember, ball-python/Nori, corn-snake/Saffron, kingsnake/Bandit, green-tree-python/Jade, hognose/Bluff, garter/Sash, boa/Lula, milk-snake/Coral, rosy-boa/Blush, carpet-python/Atlas, octopus/Cup, cuttlefish/Sepia, nautilus/Chamber, moon-jelly/Pulse, sea-star/Cling, or *Dragon electrical (Relay/Fuse/Ground) move clone. Window-play KNOB unchanged — never names knob. Special Trade unchanged — never names trade as a trick. Cling owns podia/righting/crawl/evert/penta and damp/press/tide; Pulse owns bell/oral/lucent/trail/medusa and halo/lumen/gel; Cup owns jet/mantle/sucker/veil/tinker and keep/tint/squeeze; Sepia owns bone/pupil/chroma/hover/blot and ripple/glance/dab; Chamber owns spiral/siphuncle/nacre/pinhole/fringe and chamber/pearl/quiet; Coin owns drift/gulp/flare/glint/dart and bubble/lip/swish; Ink owns soak/tuck/crane/plod/paddle and munch/bob/huff; Bloom owns gill/amble/mend/smile/plume and wink/blip/grin; Clip owns nest/cheek/scurry/pocket/reel and stuff/chitter/sprint; Burr owns curl; Fuse owns pulse as thank-you; ferret owns tube; Bluff owns hood; Bandit owns tribute; Phoenix owns lift; Sol owns press as a trick and tap as thank-you. No cry inventing — thank-yous are silent desk motion only. */

export const TRICK_KEY = "hermit_crab";
export const TRICKS = ["swap", "antenna", "scuttle", "withdraw", "vacancy"] as const;
export const HAPPY = ["scrap", "fit", "lease"] as const;
export type HermitCrabTrickKind = (typeof TRICKS)[number];
export type HermitCrabHappyKind = (typeof HAPPY)[number];
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

export type HermitCrabTrick = {
  kind: HermitCrabTrickKind;
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

export type HermitCrabHappy = {
  kind: HermitCrabHappyKind;
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

export const HAPPY_DUR: Record<HermitCrabHappyKind, number> = {
  scrap: 1.22,
  fit: 1.18,
  lease: 1.14,
};

/** Withdraw hold — Tenant rests tucked in the borrowed lid. Not window-play KNOB. Not Cling podia. Not Burr curl. Not Ink tuck. */
export const WITHDRAW_HOLD = 11.5;
export const RELEASE_S = 0.68;

export const DUR: Record<HermitCrabTrickKind, number> = {
  withdraw: WITHDRAW_HOLD + RELEASE_S,
  swap: 1.52,
  antenna: 1.34,
  scuttle: 1.58,
  vacancy: 1.48,
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

export function nextTrickWait(justFinished: boolean, rand?: number, kind?: HermitCrabTrickKind) {
  const roll = rand == null ? Math.random() : rand;
  if (kind === "withdraw") return 47 + roll * 27;
  if (kind === "swap") return 16 + roll * 11;
  if (kind === "scuttle") return 17 + roll * 12;
  return justFinished ? 10.5 + roll * 8 : 5.2 + roll * 6;
}

export function pickTrick(rand?: number, musicOn?: boolean, lastKind?: HermitCrabTrickKind | null) {
  if (musicOn) return "withdraw";
  const roll = rand == null ? Math.random() : rand;
  if (lastKind === "withdraw") {
    if (roll < 0.26) return "swap";
    if (roll < 0.48) return "antenna";
    if (roll < 0.72) return "scuttle";
    return "vacancy";
  }
  if (lastKind === "swap") {
    if (roll < 0.28) return "withdraw";
    if (roll < 0.5) return "antenna";
    if (roll < 0.72) return "scuttle";
    return "vacancy";
  }
  if (lastKind === "antenna") {
    if (roll < 0.22) return "withdraw";
    if (roll < 0.44) return "swap";
    if (roll < 0.66) return "scuttle";
    return "vacancy";
  }
  if (roll < 0.2) return "withdraw";
  if (roll < 0.4) return "swap";
  if (roll < 0.6) return "antenna";
  if (roll < 0.8) return "scuttle";
  return "vacancy";
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
  return key === TRICK_KEY || key === "tenant";
}

export function startThankYou(
  key: string | undefined | null,
  lastKind: HermitCrabHappyKind | string | null | undefined,
  x: number,
  facing: 1 | -1,
  flags?: TrickFlags,
) {
  if (!wantsThankYou(key)) return null;
  if (!happyCanStart(flags || { cmd: "idle" })) return null;
  const pick = pickHappy(lastKind as HermitCrabHappyKind | null | undefined);
  return { happy: beginHappy(pick, x, facing), kind: pick };
}

export function pickHappy(lastKind?: HermitCrabHappyKind | null, rand?: number) {
  const pool = HAPPY.filter((k) => k !== lastKind);
  const list = pool.length ? pool : [...HAPPY];
  const roll = rand == null ? Math.random() : rand;
  return list[Math.floor(roll * list.length)] || list[0];
}

export function beginHappy(kind: HermitCrabHappyKind | string, x: number, facing: 1 | -1): HermitCrabHappy {
  const name = (HAPPY as readonly string[]).indexOf(kind) >= 0 ? (kind as HermitCrabHappyKind) : "scrap";
  return {
    kind: name,
    happy: true,
    phase: "go",
    t: 0,
    x: x,
    lift: 0,
    rot: 0,
    anim: name === "scrap" ? "talk" : name === "fit" ? "sit" : "sit",
    facing: facing == null ? 1 : facing,
    fromX: x,
  };
}

export function scrapPose(t: number) {
  const u = Math.max(0, Math.min(1, t / HAPPY_DUR.scrap));
  if (u < 0.16) {
    const s = u / 0.16;
    return { lift: s * 0.42, rot: s * -3.2, dx: 0, anim: "talk" as TrickAnim };
  }
  if (u < 0.78) {
    const nibble = Math.sin(t * 2.4);
    return {
      lift: 0.42 + Math.abs(nibble) * 0.1,
      rot: -3.2 + nibble * 4.2,
      dx: nibble * 0.05,
      anim: "talk" as TrickAnim,
    };
  }
  const s = (u - 0.78) / 0.22;
  return { lift: 0.35 * (1 - s), rot: -2.4 * (1 - s), dx: 0, anim: "idle" as TrickAnim };
}

export function fitPose(t: number) {
  const u = Math.max(0, Math.min(1, t / HAPPY_DUR.fit));
  if (u < 0.18) {
    const s = u / 0.18;
    return { lift: s * 0.28, rot: s * 2.8, dx: 0, anim: "sit" as TrickAnim };
  }
  if (u < 0.8) {
    const settle = Math.sin(t * 1.55);
    return {
      lift: 0.28 + Math.abs(settle) * 0.08,
      rot: 2.8 + settle * 2.2,
      dx: settle * 0.04,
      anim: "sit" as TrickAnim,
    };
  }
  const s = (u - 0.8) / 0.2;
  return { lift: 0.28 * (1 - s), rot: 2.8 * (1 - s), dx: 0, anim: "sit" as TrickAnim };
}

export function leasePose(t: number) {
  return {
    lift: Math.abs(Math.sin(t * 1.35)) * 0.2 + 0.38,
    rot: 1.1 + Math.sin(t * 1.7) * 3.1,
    dx: Math.sin(t * 1.05) * 0.07,
    anim: "sit" as TrickAnim,
  };
}

export function stepHappy(happy: HermitCrabHappy, dt: number, flags: TrickFlags): HermitCrabHappy {
  if (!happy || happy.phase === "done") return happy;
  if (happyShouldAbort(flags)) {
    return { ...happy, phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true };
  }
  const next: HermitCrabHappy = { ...happy, t: happy.t + Math.max(0, dt) };
  const hold = HAPPY_DUR[next.kind];
  if (next.kind === "scrap") {
    const pose = scrapPose(next.t);
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "fit") {
    const pose = fitPose(next.t);
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else {
    const pose = leasePose(next.t);
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

export function beginTrick(kind: HermitCrabTrickKind, x: number, facing: 1 | -1): HermitCrabTrick {
  const anim: TrickAnim =
    kind === "withdraw"
      ? "sit"
      : kind === "swap"
        ? "play"
        : kind === "antenna"
          ? "talk"
          : kind === "scuttle"
            ? "walk"
            : kind === "vacancy"
              ? "walk"
              : "sit";
  return {
    kind,
    phase: kind === "withdraw" ? "hold" : "go",
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

export function withdrawPose(t: number) {
  const beat = Math.sin(t * 0.68) + 0.1 * Math.sin(t * 1.9);
  return {
    lift: 0.22 + Math.abs(Math.sin(t * 0.68)) * 0.12,
    rot: 1.2 + beat * 1.4,
  };
}

export function releasePose(t: number) {
  const u = Math.max(0, Math.min(1, t / RELEASE_S));
  return { lift: 0.22 * (1 - Math.sin(u * Math.PI * 0.5)), rot: 1.2 * (1 - u) };
}

export function swapPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.swap));
  if (u < 0.14) {
    const s = smoothstep(u / 0.14);
    return { x: fromX, lift: s * 0.7, rot: s * -18 * facing, anim: "play" as TrickAnim };
  }
  if (u < 0.52) {
    const s = (u - 0.14) / 0.38;
    const tryOn = Math.sin(s * Math.PI * 2);
    return {
      x: fromX + facing * tryOn * 0.16,
      lift: 0.7 + Math.abs(tryOn) * 0.22,
      rot: facing * (-18 + tryOn * 26),
      anim: "play" as TrickAnim,
    };
  }
  if (u < 0.78) {
    const s = (u - 0.52) / 0.26;
    return {
      x: fromX,
      lift: 0.7 * (1 - s * 0.35),
      rot: facing * (-18 * (1 - s) + 6 * s),
      anim: "play" as TrickAnim,
    };
  }
  const s = smoothstep((u - 0.78) / 0.22);
  return {
    x: fromX,
    lift: 0.45 * (1 - s),
    rot: facing * (4 * (1 - s)),
    anim: "sit" as TrickAnim,
  };
}

export function antennaPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.antenna));
  if (u < 0.12) {
    const s = smoothstep(u / 0.12);
    return { x: fromX, lift: s * 0.18, rot: s * 8 * facing, anim: "talk" as TrickAnim };
  }
  if (u < 0.78) {
    const s = (u - 0.12) / 0.66;
    const tap = Math.sin(s * Math.PI * 4.2);
    const lean = Math.sin(s * Math.PI * 1.3);
    return {
      x: fromX + facing * lean * 0.08,
      lift: 0.18 + Math.abs(tap) * 0.1,
      rot: facing * (8 + tap * 9 + lean * 3),
      anim: "talk" as TrickAnim,
    };
  }
  const s = smoothstep((u - 0.78) / 0.22);
  return {
    x: fromX,
    lift: 0.14 * (1 - s),
    rot: facing * (4 * (1 - s)),
    anim: "sit" as TrickAnim,
  };
}

export function scuttlePose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.scuttle));
  if (u < 0.1) {
    const s = smoothstep(u / 0.1);
    return { x: fromX, lift: s * 0.32, rot: s * -7 * facing, anim: "walk" as TrickAnim };
  }
  if (u < 0.74) {
    const s = (u - 0.1) / 0.64;
    const burst = Math.sin(s * Math.PI * 4.6);
    const side = Math.sin(s * Math.PI * 1.2);
    return {
      x: fromX + facing * (side * 1.35 + burst * 0.18),
      lift: 0.32 + Math.abs(burst) * 0.14,
      rot: facing * (-7 + burst * 6 + side * 4),
      anim: "walk" as TrickAnim,
    };
  }
  const s = smoothstep((u - 0.74) / 0.26);
  return {
    x: fromX + facing * 1.35 * (1 - s),
    lift: 0.32 * (1 - s),
    rot: facing * (-3 * (1 - s)),
    anim: "idle" as TrickAnim,
  };
}

export function vacancyPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.vacancy));
  if (u < 0.14) {
    const s = smoothstep(u / 0.14);
    return { x: fromX, lift: s * 0.25, rot: s * 5 * facing, anim: "walk" as TrickAnim };
  }
  if (u < 0.42) {
    const s = (u - 0.14) / 0.28;
    return {
      x: fromX + facing * s * 0.95,
      lift: 0.25 + Math.sin(s * Math.PI) * 0.1,
      rot: facing * (5 + Math.sin(s * Math.PI * 2) * 4),
      anim: "walk" as TrickAnim,
    };
  }
  if (u < 0.72) {
    const s = (u - 0.42) / 0.3;
    const measure = Math.sin(s * Math.PI * 3);
    return {
      x: fromX + facing * 0.95,
      lift: 0.2 + Math.abs(measure) * 0.12,
      rot: facing * (measure * 10),
      anim: "talk" as TrickAnim,
    };
  }
  const s = smoothstep((u - 0.72) / 0.28);
  return {
    x: fromX + facing * 0.95 * (1 - s),
    lift: 0.2 * (1 - s),
    rot: facing * (2 * (1 - s)),
    anim: "idle" as TrickAnim,
  };
}

export function stepTrick(trick: HermitCrabTrick, dt: number, flags: TrickFlags): HermitCrabTrick {
  if (!trick || trick.phase === "done") return trick;
  if (shouldAbort(flags) && trick.kind !== "swap" && trick.kind !== "scuttle" && trick.kind !== "vacancy") {
    return { ...trick, phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true };
  }
  const next: HermitCrabTrick = { ...trick, t: trick.t + Math.max(0, dt) };
  if (next.kind === "withdraw") {
    if (next.t < WITHDRAW_HOLD) {
      const pose = withdrawPose(next.t);
      next.phase = "hold";
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = "sit";
      return next;
    }
    if (next.t < WITHDRAW_HOLD + RELEASE_S) {
      const pose = releasePose(next.t - WITHDRAW_HOLD);
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
  if (next.kind === "swap") {
    const pose = swapPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "antenna") {
    const pose = antennaPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "scuttle") {
    const pose = scuttlePose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else {
    const pose = vacancyPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  }
  if (u >= 1) return { ...next, phase: "done", lift: 0, rot: 0, anim: "idle" };
  return next;
}
