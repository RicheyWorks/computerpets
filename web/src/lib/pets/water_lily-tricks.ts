/** Disk ground tricks while idle. House water_lily — pad / corolla / rhizome / calyx / sheen personality (pad float on the ink dish — never named drift (Coin owns drift) / float as coin-collision / flutter (Fan owns flutter) / biloba (Fan owns biloba), corolla bloom open on the lamp — never named open (Disk window owns open) / bloom as axolotl-guest collision / unfurl (Vein window owns unfurl) / flare (Coin owns flare), rhizome quiet settle under the pad — never named root (Burr owns root) / dig (Rabbit owns dig) / taproot (Mast owns taproot) / crawl (Cling owns crawl), petal calyx cup on the dish — never named cup (Cup guest / Octopus) / saucer (Vein owns saucer) / pouch (Anchor owns pouch), pond-surface sheen desk life under the lamp; not Mast acorn/sinus/gall/taproot/bole/catkin/tyloses, Fan biloba/notch/flutter/drop/amber, Vein frond/rachis/fiddle/pinna/saucer, Felt tuft/bead/spore/cushion/thatch, Door hinge/pharynx/knot/lurk/jamb, Kite wing/lobe/gyre/vault/span, Anchor coil/buoy/siphon/swivel/pouch, Ledger carapace/bookgill/telson/furrow/fossil, Tenant swap/antenna/scuttle/withdraw/vacancy, Cling podia/righting/crawl/evert/penta, Pulse bell/oral/lucent/trail/medusa, Coin drift/gulp/flare/glint/dart, Ink soak/tuck, Clip nest, Bloom gill, parrot fan/flash, or snake guests Sash seam/moss/lap copies). Feed-happy thank-yous sit after eat. Card-open freeze and window-play do not swallow a thank-you. Sleep, hide, and leave still win. Same map as desktop water_lily-tricks.js. Not a Rui, cat, dog, rabbit, hamster/Clip, guinea pig, turtle/Ink, goldfish/Coin, budgie, fox, penguin, parrot, ferret, hedgehog/Burr, chinchilla, axolotl/Bloom, toucan, iguana/Sol, dragon/Vesper, phoenix/Ember, ball-python/Nori, corn-snake/Saffron, kingsnake/Bandit, green-tree-python/Jade, hognose/Bluff, garter/Sash, boa/Lula, milk-snake/Coral, rosy-boa/Blush, carpet-python/Atlas, octopus/Cup, cuttlefish/Sepia, nautilus/Chamber, moon-jelly/Pulse, sea-star/Cling, hermit-crab/Tenant, horseshoe-crab/Ledger, seahorse/Anchor, manta/Kite, moray/Door, sheet-moss/Felt, maidenhair/Vein, ginkgo/Fan, oak/Mast, or *Dragon electrical (Relay/Fuse/Ground) move clone. Window-play OPEN unchanged — never names open. Special open/nod/lean ethogram unchanged — never names open/nod/lean as tricks. Sash owns moss; Felt owns tuft/bead/spore/cushion/thatch and humid/velvet/meadow; Vein owns frond/rachis/fiddle/pinna/saucer and mist/filigree/shade; Fan owns biloba/notch/flutter/drop/amber and ochre/gilt/linger; Mast owns acorn/sinus/gall/taproot/bole and cupule/tannin/grove; Sol owns swell as thank-you, press/nod as tricks; Ember owns lift; Cling owns crawl/damp/press/tide; Still/Felt window owns lean/creep; Burr owns root; Coin owns flare; Phoenix owns lift; Fuse owns pulse as thank-you; Chamber owns quiet as thank-you; Ledger owns page as thank-you and fossil as trick; Jade owns treaty as thank-you and sway as trick; Parrot owns fan; Kite owns lobe; Bloom owns gill. Aquatic pad/bloom desk life only — not an oak copy, ginkgo copy, fern maidenhair copy, bryophyte moss copy, jelly Pulse copy, or goldfish Coin copy. No cry inventing — thank-yous are silent desk motion only. */

export const TRICK_KEY = "water_lily";
export const TRICKS = ["pad", "corolla", "rhizome", "calyx", "sheen"] as const;
export const HAPPY = ["silt", "nectar", "dew"] as const;
export type WaterLilyTrickKind = (typeof TRICKS)[number];
export type WaterLilyHappyKind = (typeof HAPPY)[number];
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

export type WaterLilyTrick = {
  kind: WaterLilyTrickKind;
  phase: TrickPhase;
  t: number;
  x: number;
  lift: number;
  rot: number;
  anim: TrickAnim;
  facing: 1 | -1;
  fromX: number;
  abort?: boolean;
};

export type WaterLilyHappy = {
  kind: WaterLilyHappyKind;
  happy: true;
  phase: HappyPhase;
  t: number;
  x: number;
  lift: number;
  rot: number;
  anim: TrickAnim;
  facing: 1 | -1;
  fromX: number;
  abort?: boolean;
};

export const HAPPY_DUR = { silt: 1.24, nectar: 1.18, dew: 1.28 } as const;
export const SHEEN_HOLD = 12.5;
export const RELEASE_S = 0.78;
export const DUR = { sheen: SHEEN_HOLD + RELEASE_S, pad: 1.48, corolla: 1.56, rhizome: 1.34, calyx: 1.28 } as const;

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

export function nextTrickWait(justFinished: boolean, rand?: number, kind?: WaterLilyTrickKind | string) {
  const roll = rand == null ? Math.random() : rand;
  if (kind === "sheen") return 50 + roll * 30;
  if (kind === "pad") return 15 + roll * 10;
  if (kind === "corolla") return 16 + roll * 11;
  return justFinished ? 10.8 + roll * 8 : 5.4 + roll * 6;
}
export function pickTrick(rand?: number, musicOn?: boolean, lastKind?: WaterLilyTrickKind | string | null) {
  if (musicOn) return "sheen" as const;
  const roll = rand == null ? Math.random() : rand;
  if (lastKind === "sheen") {
    if (roll < 0.26) return "pad" as const;
    if (roll < 0.48) return "corolla" as const;
    if (roll < 0.72) return "rhizome" as const;
    return "calyx" as const;
  }
  if (lastKind === "pad") {
    if (roll < 0.28) return "sheen" as const;
    if (roll < 0.5) return "corolla" as const;
    if (roll < 0.72) return "rhizome" as const;
    return "calyx" as const;
  }
  if (lastKind === "corolla") {
    if (roll < 0.22) return "sheen" as const;
    if (roll < 0.44) return "pad" as const;
    if (roll < 0.66) return "rhizome" as const;
    return "calyx" as const;
  }
  if (roll < 0.2) return "sheen" as const;
  if (roll < 0.4) return "pad" as const;
  if (roll < 0.6) return "corolla" as const;
  if (roll < 0.8) return "rhizome" as const;
  return "calyx" as const;
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
  return key === TRICK_KEY || key === "disk";
}

export function startThankYou(
  key: string | undefined | null,
  lastKind: WaterLilyHappyKind | string | null | undefined,
  x: number,
  facing: 1 | -1,
  flags?: TrickFlags,
) {
  if (!wantsThankYou(key)) return null;
  if (!happyCanStart(flags || { cmd: "idle" })) return null;
  const pick = pickHappy(lastKind as WaterLilyHappyKind | null | undefined);
  return { happy: beginHappy(pick, x, facing), kind: pick };
}

export function pickHappy(lastKind?: WaterLilyHappyKind | null, rand?: number) {
  const pool = HAPPY.filter((k) => k !== lastKind);
  const list = pool.length ? pool : [...HAPPY];
  const roll = rand == null ? Math.random() : rand;
  return list[Math.floor(roll * list.length)] || list[0];
}

export function beginHappy(kind: WaterLilyHappyKind | string, x: number, facing: 1 | -1): WaterLilyHappy {
  const name = (HAPPY as readonly string[]).indexOf(kind) >= 0 ? (kind as WaterLilyHappyKind) : "silt";
  return {
    kind: name,
    happy: true,
    phase: "go",
    t: 0,
    x: x,
    lift: 0,
    rot: 0,
    anim: name === "silt" ? "sit" : name === "nectar" ? "play" : "talk",
    facing: facing == null ? 1 : facing,
    fromX: x,
  };
}

export function siltPose(t: number) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.silt));
    if (u < 0.18) {
      const s = u / 0.18;
      return { lift: s * 0.04, rot: s * 1.6, dx: 0, anim: "sit" as TrickAnim };
    }
    if (u < 0.76) {
      const silt = Math.sin(t * 1.15);
      return {
        lift: 0.04 + Math.abs(silt) * 0.025,
        rot: 1.6 + silt * 1.3,
        dx: silt * 0.01,
        anim: "sit" as TrickAnim,
      };
    }
    const s = (u - 0.76) / 0.24;
    return { lift: 0.03 * (1 - s), rot: 1.1 * (1 - s), dx: 0, anim: "sit" as TrickAnim };
  }
export function nectarPose(t: number) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.nectar));
    if (u < 0.16) {
      const s = u / 0.16;
      return { lift: s * 0.16, rot: s * -2.2, dx: 0, anim: "play" as TrickAnim };
    }
    if (u < 0.72) {
      const sweet = Math.sin(t * 1.9);
      return {
        lift: 0.16 + Math.abs(sweet) * 0.045,
        rot: -2.2 + sweet * 2.6,
        dx: sweet * 0.02,
        anim: "play" as TrickAnim,
      };
    }
    const s = (u - 0.72) / 0.28;
    return { lift: 0.11 * (1 - s), rot: -1.2 * (1 - s), dx: 0, anim: "idle" as TrickAnim };
  }
export function dewPose(t: number) {
    return {
      lift: 0.022 + Math.abs(Math.sin(t * 0.55)) * 0.032,
      rot: Math.sin(t * 0.7) * 1.4,
      dx: Math.sin(t * 0.4) * 0.02,
      anim: "talk" as TrickAnim,
    };
  }
export function stepHappy(happy: WaterLilyHappy, dt: number, flags: TrickFlags): WaterLilyHappy {
  if (!happy || happy.phase === "done") return happy;
  if (happyShouldAbort(flags)) {
    return { ...happy, phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true };
  }
  const next: WaterLilyHappy = { ...happy, t: happy.t + Math.max(0, dt) };
  const hold = HAPPY_DUR[next.kind];
  if (next.kind === "silt") {
    const pose = siltPose(next.t);
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "nectar") {
    const pose = nectarPose(next.t);
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else {
    const pose = dewPose(next.t);
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

export function beginTrick(kind: WaterLilyTrickKind, x: number, facing: 1 | -1): WaterLilyTrick {
  const anim: TrickAnim =
    kind === "sheen"
      ? "sit"
      : kind === "pad"
        ? "sit"
        : kind === "corolla"
          ? "talk"
          : kind === "rhizome"
            ? "play"
            : kind === "calyx"
              ? "talk"
              : "sit";
  return {
    kind: kind,
    phase: kind === "sheen" ? "hold" : "go",
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

export function sheenPose(t: number) {
    const breath = Math.sin(t * 0.28) + 0.04 * Math.sin(t * 1.15);
    return {
      lift: 0.03 + Math.abs(Math.sin(t * 0.35)) * 0.024,
      rot: -0.5 + breath * 0.85,
    };
  }
export function releasePose(t: number) {
    const u = Math.max(0, Math.min(1, t / RELEASE_S));
    return { lift: 0.03 * (1 - Math.sin(u * Math.PI * 0.5)), rot: -0.5 * (1 - u) };
  }
export function padPose(t: number, fromX: number, facing: 1 | -1) {
    const u = Math.max(0, Math.min(1, t / DUR.pad));
    if (u < 0.12) {
      const s = smoothstep(u / 0.12);
      return { x: fromX, lift: s * 0.045, rot: s * -1.8 * facing, anim: "sit" as TrickAnim };
    }
    if (u < 0.82) {
      const s = (u - 0.12) / 0.7;
      const float = Math.sin(s * Math.PI * 1.8);
      return {
        x: fromX + facing * float * 0.045,
        lift: 0.045 + Math.abs(float) * 0.035,
        rot: facing * (-1.8 + float * 3.2),
        anim: "sit" as TrickAnim,
      };
    }
    const s = smoothstep((u - 0.82) / 0.18);
    return {
      x: fromX,
      lift: 0.045 * (1 - s),
      rot: facing * (-1.0 * (1 - s)),
      anim: "sit" as TrickAnim,
    };
  }
export function corollaPose(t: number, fromX: number, facing: 1 | -1) {
    const u = Math.max(0, Math.min(1, t / DUR.corolla));
    if (u < 0.18) {
      const s = smoothstep(u / 0.18);
      return { x: fromX, lift: s * 0.08, rot: s * -6.5 * facing, anim: "talk" as TrickAnim };
    }
    if (u < 0.55) {
      const s = (u - 0.18) / 0.37;
      const open = smoothstep(s);
      return {
        x: fromX + facing * open * 0.012,
        lift: 0.08 + open * 0.1,
        rot: facing * (-6.5 + open * 12.5),
        anim: "talk" as TrickAnim,
      };
    }
    if (u < 0.82) {
      const s = (u - 0.55) / 0.27;
      const hold = Math.sin(s * Math.PI * 2.2);
      return {
        x: fromX + facing * hold * 0.015,
        lift: 0.18 + Math.abs(hold) * 0.03,
        rot: facing * (6.0 + hold * 2.4),
        anim: "talk" as TrickAnim,
      };
    }
    const s = smoothstep((u - 0.82) / 0.18);
    return {
      x: fromX,
      lift: 0.18 * (1 - s),
      rot: facing * (4.0 * (1 - s)),
      anim: "sit" as TrickAnim,
    };
  }
export function rhizomePose(t: number, fromX: number, facing: 1 | -1) {
    const u = Math.max(0, Math.min(1, t / DUR.rhizome));
    if (u < 0.14) {
      const s = smoothstep(u / 0.14);
      return { x: fromX, lift: s * 0.09, rot: s * 3.2 * facing, anim: "play" as TrickAnim };
    }
    if (u < 0.55) {
      const s = (u - 0.14) / 0.41;
      const settle = smoothstep(s);
      return {
        x: fromX + facing * settle * 0.055,
        lift: 0.09 * (1 - settle * 0.55),
        rot: facing * (3.2 - settle * 4.6),
        anim: "play" as TrickAnim,
      };
    }
    if (u < 0.82) {
      const s = (u - 0.55) / 0.27;
      const quiet = Math.sin(s * Math.PI * 1.6);
      return {
        x: fromX + facing * (0.055 + quiet * 0.012),
        lift: 0.04 + Math.abs(quiet) * 0.02,
        rot: facing * (-1.4 + quiet * 1.8),
        anim: "play" as TrickAnim,
      };
    }
    const s = smoothstep((u - 0.82) / 0.18);
    return {
      x: fromX + facing * 0.055 * (1 - s),
      lift: 0.03 * (1 - s),
      rot: facing * (-0.8 * (1 - s)),
      anim: "sit" as TrickAnim,
    };
  }
export function calyxPose(t: number, fromX: number, facing: 1 | -1) {
    const u = Math.max(0, Math.min(1, t / DUR.calyx));
    if (u < 0.15) {
      const s = smoothstep(u / 0.15);
      return { x: fromX, lift: s * 0.1, rot: s * 3.8 * facing, anim: "talk" as TrickAnim };
    }
    if (u < 0.7) {
      const s = (u - 0.15) / 0.55;
      const cup = Math.sin(s * Math.PI * 3.4);
      return {
        x: fromX + facing * cup * 0.016,
        lift: 0.1 + Math.abs(cup) * 0.055,
        rot: facing * (3.8 + cup * 5.5),
        anim: "talk" as TrickAnim,
      };
    }
    const s = smoothstep((u - 0.7) / 0.3);
    return {
      x: fromX,
      lift: 0.1 * (1 - s),
      rot: facing * (2.2 * (1 - s)),
      anim: "sit" as TrickAnim,
    };
  }
export function stepTrick(trick: WaterLilyTrick, dt: number, flags: TrickFlags): WaterLilyTrick {
  if (!trick || trick.phase === "done") return trick;
  if (shouldAbort(flags) && trick.kind !== "pad" && trick.kind !== "corolla" && trick.kind !== "rhizome" && trick.kind !== "calyx") {
    return { ...trick, phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true };
  }
  const next: WaterLilyTrick = { ...trick, t: trick.t + Math.max(0, dt) };
  if (next.kind === "sheen") {
    if (next.t < SHEEN_HOLD) {
      const pose = sheenPose(next.t);
      next.phase = "hold";
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = "sit";
      return next;
    }
    if (next.t < SHEEN_HOLD + RELEASE_S) {
      const pose = releasePose(next.t - SHEEN_HOLD);
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
  if (next.kind === "pad") {
    const pose = padPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "corolla") {
    const pose = corollaPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "rhizome") {
    const pose = rhizomePose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else {
    const pose = calyxPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  }
  if (u >= 1) return { ...next, phase: "done", lift: 0, rot: 0, anim: "idle" };
  return next;
}
