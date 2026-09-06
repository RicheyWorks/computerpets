/** Fan ground tricks while idle. House ginkgo — biloba / notch / flutter / drop / amber personality (two-lobed biloba fan leaf open — never named fan (Parrot owns fan) / lobe (Kite owns lobe) / frond (Vein owns frond), apical notch tip settle, flutter fall as flutter — never named lean (Felt window owns lean) / unfurl (Vein window owns unfurl) / nod (Sol owns nod) / gold (Fan window owns gold), soft golden drop to blotter, living-fossil amber calm desk life under the lamp; not Vein frond/rachis/fiddle/pinna/saucer, Felt tuft/bead/spore/cushion/thatch, Door hinge/pharynx/knot/lurk/jamb, Kite wing/lobe/gyre/vault/span, Anchor coil/buoy/siphon/swivel/pouch, Ledger carapace/bookgill/telson/furrow/fossil, Tenant swap/antenna/scuttle/withdraw/vacancy, Cling podia/righting/crawl/evert/penta, Pulse bell/oral/lucent/trail/medusa, Coin drift/gulp/flare/glint/dart, Ink soak/tuck, Clip nest, Bloom gill, parrot fan/flash, or snake guests Sash seam/moss/lap copies). Feed-happy thank-yous sit after eat. Card-open freeze and window-play do not swallow a thank-you. Sleep, hide, and leave still win. Same map as desktop ginkgo-tricks.js. Not a Rui, cat, dog, rabbit, hamster/Clip, guinea pig, turtle/Ink, goldfish/Coin, budgie, fox, penguin, parrot, ferret, hedgehog/Burr, chinchilla, axolotl/Bloom, toucan, iguana/Sol, dragon/Vesper, phoenix/Ember, ball-python/Nori, corn-snake/Saffron, kingsnake/Bandit, green-tree-python/Jade, hognose/Bluff, garter/Sash, boa/Lula, milk-snake/Coral, rosy-boa/Blush, carpet-python/Atlas, octopus/Cup, cuttlefish/Sepia, nautilus/Chamber, moon-jelly/Pulse, sea-star/Cling, hermit-crab/Tenant, horseshoe-crab/Ledger, seahorse/Anchor, manta/Kite, moray/Door, sheet-moss/Felt, maidenhair/Vein, or *Dragon electrical (Relay/Fuse/Ground) move clone. Window-play GOLD unchanged — never names gold. Special lean/nod/still ethogram unchanged — never names lean/nod/still as tricks. Sash owns moss; Felt owns tuft/bead/spore/cushion/thatch and humid/velvet/meadow; Vein owns frond/rachis/fiddle/pinna/saucer and mist/filigree/shade; Sol owns swell as thank-you, press/nod as tricks; Ember owns lift; Cling owns crawl/damp/press/tide; Still/Felt window owns lean/creep; Burr owns root; Coin owns flare; Phoenix owns lift; Fuse owns pulse as thank-you; Chamber owns quiet as thank-you; Ledger owns page as thank-you and fossil as trick; Jade owns treaty as thank-you; Parrot owns fan. Plant/ginkgo desk life only — not a fern maidenhair copy, bryophyte moss copy, or animal/moray copy. No cry inventing — thank-yous are silent desk motion only. */

export const TRICK_KEY = "ginkgo";
export const TRICKS = ["biloba", "notch", "flutter", "drop", "amber"] as const;
export const HAPPY = ["ochre", "gilt", "linger"] as const;
export type GinkgoTrickKind = (typeof TRICKS)[number];
export type GinkgoHappyKind = (typeof HAPPY)[number];
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

export type GinkgoTrick = {
  kind: GinkgoTrickKind;
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

export type GinkgoHappy = {
  kind: GinkgoHappyKind;
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

export const HAPPY_DUR = { ochre: 1.24, gilt: 1.14, linger: 1.28 } as const;
export const AMBER_HOLD = 12.2;
export const RELEASE_S = 0.76;
export const DUR = { amber: AMBER_HOLD + RELEASE_S, biloba: 1.48, notch: 1.16, flutter: 1.56, drop: 1.34 } as const;

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

export function nextTrickWait(justFinished: boolean, rand?: number, kind?: GinkgoTrickKind | string) {
  const roll = rand == null ? Math.random() : rand;
  if (kind === "amber") return 49 + roll * 29;
  if (kind === "biloba") return 14 + roll * 10;
  if (kind === "flutter") return 16 + roll * 11;
  return justFinished ? 10.6 + roll * 8 : 5.3 + roll * 6;
}
export function pickTrick(rand?: number, musicOn?: boolean, lastKind?: GinkgoTrickKind | string | null) {
  if (musicOn) return "amber" as const;
  const roll = rand == null ? Math.random() : rand;
  if (lastKind === "amber") {
    if (roll < 0.26) return "biloba" as const;
    if (roll < 0.48) return "notch" as const;
    if (roll < 0.72) return "flutter" as const;
    return "drop" as const;
  }
  if (lastKind === "biloba") {
    if (roll < 0.28) return "amber" as const;
    if (roll < 0.5) return "notch" as const;
    if (roll < 0.72) return "flutter" as const;
    return "drop" as const;
  }
  if (lastKind === "notch") {
    if (roll < 0.22) return "amber" as const;
    if (roll < 0.44) return "biloba" as const;
    if (roll < 0.66) return "flutter" as const;
    return "drop" as const;
  }
  if (roll < 0.2) return "amber" as const;
  if (roll < 0.4) return "biloba" as const;
  if (roll < 0.6) return "notch" as const;
  if (roll < 0.8) return "flutter" as const;
  return "drop" as const;
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
  return key === TRICK_KEY || key === "fan";
}

export function startThankYou(
  key: string | undefined | null,
  lastKind: GinkgoHappyKind | string | null | undefined,
  x: number,
  facing: 1 | -1,
  flags?: TrickFlags,
) {
  if (!wantsThankYou(key)) return null;
  if (!happyCanStart(flags || { cmd: "idle" })) return null;
  const pick = pickHappy(lastKind as GinkgoHappyKind | null | undefined);
  return { happy: beginHappy(pick, x, facing), kind: pick };
}

export function pickHappy(lastKind?: GinkgoHappyKind | null, rand?: number) {
  const pool = HAPPY.filter((k) => k !== lastKind);
  const list = pool.length ? pool : [...HAPPY];
  const roll = rand == null ? Math.random() : rand;
  return list[Math.floor(roll * list.length)] || list[0];
}

export function beginHappy(kind: GinkgoHappyKind | string, x: number, facing: 1 | -1): GinkgoHappy {
  const name = (HAPPY as readonly string[]).indexOf(kind) >= 0 ? (kind as GinkgoHappyKind) : "ochre";
  return {
    kind: name,
    happy: true,
    phase: "go",
    t: 0,
    x: x,
    lift: 0,
    rot: 0,
    anim: name === "ochre" ? "talk" : name === "gilt" ? "play" : "sit",
    facing: facing == null ? 1 : facing,
    fromX: x,
  };
}

export function ochrePose(t: number) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.ochre));
    if (u < 0.21) {
      const s = u / 0.21;
      return { lift: s * 0.075, rot: s * 2.9, dx: 0, anim: "talk" as TrickAnim };
    }
    if (u < 0.77) {
      const warm = Math.sin(t * 1.48);
      return {
        lift: 0.075 + Math.abs(warm) * 0.038,
        rot: 2.9 + warm * 1.9,
        dx: warm * 0.018,
        anim: "talk" as TrickAnim,
      };
    }
    const s = (u - 0.77) / 0.23;
    return { lift: 0.055 * (1 - s), rot: 1.9 * (1 - s), dx: 0, anim: "sit" as TrickAnim };
}
export function giltPose(t: number) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.gilt));
    if (u < 0.17) {
      const s = u / 0.17;
      return { lift: s * 0.16, rot: s * -2.8, dx: 0, anim: "play" as TrickAnim };
    }
    if (u < 0.74) {
      const flash = Math.sin(t * 2.2);
      return {
        lift: 0.16 + Math.abs(flash) * 0.055,
        rot: -2.8 + flash * 3.1,
        dx: flash * 0.028,
        anim: "play" as TrickAnim,
      };
    }
    const s = (u - 0.74) / 0.26;
    return { lift: 0.11 * (1 - s), rot: -1.6 * (1 - s), dx: 0, anim: "idle" as TrickAnim };
}
export function lingerPose(t: number) {
    return {
      lift: 0.02 + Math.abs(Math.sin(t * 0.44)) * 0.032,
      rot: Math.sin(t * 0.58) * 1.25,
      dx: Math.sin(t * 0.33) * -0.035,
      anim: "sit" as TrickAnim,
    };
}
export function stepHappy(happy: GinkgoHappy, dt: number, flags: TrickFlags): GinkgoHappy {
  if (!happy || happy.phase === "done") return happy;
  if (happyShouldAbort(flags)) {
    return { ...happy, phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true };
  }
  const next: GinkgoHappy = { ...happy, t: happy.t + Math.max(0, dt) };
  const hold = HAPPY_DUR[next.kind];
  if (next.kind === "ochre") {
    const pose = ochrePose(next.t);
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "gilt") {
    const pose = giltPose(next.t);
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else {
    const pose = lingerPose(next.t);
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

export function beginTrick(kind: GinkgoTrickKind, x: number, facing: 1 | -1): GinkgoTrick {
  const anim: TrickAnim =
    kind === "amber"
      ? "sit"
      : kind === "biloba"
        ? "sit"
        : kind === "notch"
          ? "talk"
          : kind === "flutter"
            ? "play"
            : kind === "drop"
              ? "talk"
              : "sit";
  return {
    kind: kind,
    phase: kind === "amber" ? "hold" : "go",
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

export function amberPose(t: number) {
    const breath = Math.sin(t * 0.34) + 0.04 * Math.sin(t * 1.15);
    return {
      lift: 0.03 + Math.abs(Math.sin(t * 0.34)) * 0.028,
      rot: -0.9 + breath * 1.15,
    };
}
export function releasePose(t: number) {
    const u = Math.max(0, Math.min(1, t / RELEASE_S));
    return { lift: 0.03 * (1 - Math.sin(u * Math.PI * 0.5)), rot: -0.85 * (1 - u) };
}
export function bilobaPose(t: number, fromX: number, facing: 1 | -1) {
    const u = Math.max(0, Math.min(1, t / DUR.biloba));
    if (u < 0.16) {
      const s = smoothstep(u / 0.16);
      return { x: fromX, lift: s * 0.07, rot: s * -5.5 * facing, anim: "sit" as TrickAnim };
    }
    if (u < 0.74) {
      const s = (u - 0.16) / 0.58;
      const split = Math.sin(s * Math.PI * 1.35);
      return {
        x: fromX + facing * split * 0.04,
        lift: 0.07 + Math.abs(split) * 0.1,
        rot: facing * (-5.5 + split * 9.2),
        anim: "sit" as TrickAnim,
      };
    }
    const s = smoothstep((u - 0.74) / 0.26);
    return {
      x: fromX,
      lift: 0.07 * (1 - s),
      rot: facing * (-2.8 * (1 - s)),
      anim: "sit" as TrickAnim,
    };
}
export function notchPose(t: number, fromX: number, facing: 1 | -1) {
    const u = Math.max(0, Math.min(1, t / DUR.notch));
    if (u < 0.15) {
      const s = smoothstep(u / 0.15);
      return { x: fromX, lift: s * 0.035, rot: s * 6.2 * facing, anim: "talk" as TrickAnim };
    }
    if (u < 0.6) {
      const s = (u - 0.15) / 0.45;
      const tip = Math.sin(s * Math.PI * 4.2);
      return {
        x: fromX + facing * tip * 0.015,
        lift: 0.035 + Math.abs(tip) * 0.028,
        rot: facing * (6.2 + tip * 3.8),
        anim: "talk" as TrickAnim,
      };
    }
    if (u < 0.82) {
      const s = (u - 0.6) / 0.22;
      const settle = smoothstep(s);
      return {
        x: fromX + facing * (1 - settle) * 0.02,
        lift: 0.04 * (1 - settle * 0.35),
        rot: facing * (6.2 - settle * 7.5),
        anim: "talk" as TrickAnim,
      };
    }
    const s = smoothstep((u - 0.82) / 0.18);
    return {
      x: fromX,
      lift: 0.022 * (1 - s),
      rot: facing * (-0.9 * (1 - s)),
      anim: "sit" as TrickAnim,
    };
}
export function flutterPose(t: number, fromX: number, facing: 1 | -1) {
    const u = Math.max(0, Math.min(1, t / DUR.flutter));
    if (u < 0.14) {
      const s = smoothstep(u / 0.14);
      return { x: fromX, lift: s * 0.28, rot: s * 4.5 * facing, anim: "play" as TrickAnim };
    }
    if (u < 0.72) {
      const s = (u - 0.14) / 0.58;
      const fall = Math.sin(s * Math.PI * 6.4);
      const descend = s * 0.22;
      return {
        x: fromX + facing * fall * 0.045,
        lift: 0.28 - descend + Math.abs(fall) * 0.04,
        rot: facing * (4.5 + fall * 8.5 - s * 6),
        anim: "play" as TrickAnim,
      };
    }
    const s = smoothstep((u - 0.72) / 0.28);
    return {
      x: fromX + facing * 0.02 * (1 - s),
      lift: 0.08 * (1 - s),
      rot: facing * (-1.5 * (1 - s)),
      anim: "sit" as TrickAnim,
    };
}
export function dropPose(t: number, fromX: number, facing: 1 | -1) {
    const u = Math.max(0, Math.min(1, t / DUR.drop));
    if (u < 0.18) {
      const s = smoothstep(u / 0.18);
      return { x: fromX, lift: s * 0.2, rot: s * -3.4 * facing, anim: "talk" as TrickAnim };
    }
    if (u < 0.55) {
      const s = (u - 0.18) / 0.37;
      const hang = Math.sin(s * Math.PI * 1.8);
      return {
        x: fromX + facing * hang * 0.025,
        lift: 0.2 - s * 0.04 + Math.abs(hang) * 0.03,
        rot: facing * (-3.4 + hang * 5),
        anim: "talk" as TrickAnim,
      };
    }
    if (u < 0.82) {
      const s = (u - 0.55) / 0.27;
      const land = smoothstep(s);
      return {
        x: fromX + facing * (1 - land) * 0.03,
        lift: 0.16 * (1 - land * 0.85),
        rot: facing * (-2.2 + land * 3.5),
        anim: "talk" as TrickAnim,
      };
    }
    const s = smoothstep((u - 0.82) / 0.18);
    return {
      x: fromX,
      lift: 0.03 * (1 - s),
      rot: facing * (1.1 * (1 - s)),
      anim: "sit" as TrickAnim,
    };
}
export function stepTrick(trick: GinkgoTrick, dt: number, flags: TrickFlags): GinkgoTrick {
  if (!trick || trick.phase === "done") return trick;
  if (shouldAbort(flags) && trick.kind !== "notch" && trick.kind !== "flutter" && trick.kind !== "drop") {
    return { ...trick, phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true };
  }
  const next: GinkgoTrick = { ...trick, t: trick.t + Math.max(0, dt) };
  if (next.kind === "amber") {
    if (next.t < AMBER_HOLD) {
      const pose = amberPose(next.t);
      next.phase = "hold";
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = "sit";
      return next;
    }
    if (next.t < AMBER_HOLD + RELEASE_S) {
      const pose = releasePose(next.t - AMBER_HOLD);
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
  if (next.kind === "biloba") {
    const pose = bilobaPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "notch") {
    const pose = notchPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "flutter") {
    const pose = flutterPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else {
    const pose = dropPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  }
  if (u >= 1) return { ...next, phase: "done", lift: 0, rot: 0, anim: "idle" };
  return next;
}
