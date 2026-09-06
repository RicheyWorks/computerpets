/** Vein ground tricks while idle. House maidenhair fern — frond / rachis / fiddle / pinna / saucer personality (delicate fan fronds, black wiry rachis, soft fiddlehead uncoil as fiddle — never named unfurl (Vein window owns unfurl) / lean (Felt window owns lean) / nod (Sol owns nod), leaflet pinna flutter, mist-loving damp saucer desk life; not Felt tuft/bead/spore/cushion/thatch, Door hinge/pharynx/knot/lurk/jamb, Kite wing/lobe/gyre/vault/span, Anchor coil/buoy/siphon/swivel/pouch, Ledger carapace/bookgill/telson/furrow/fossil, Tenant swap/antenna/scuttle/withdraw/vacancy, Cling podia/righting/crawl/evert/penta, Pulse bell/oral/lucent/trail/medusa, Coin drift/gulp/flare/glint/dart, Ink soak/tuck, Clip nest, Bloom gill, parrot fan/flash, or snake guests Sash seam/moss/lap copies). Feed-happy thank-yous sit after eat. Card-open freeze and window-play do not swallow a thank-you. Sleep, hide, and leave still win. Same map as desktop maidenhair-tricks.js. Not a Rui, cat, dog, rabbit, hamster/Clip, guinea pig, turtle/Ink, goldfish/Coin, budgie, fox, penguin, parrot, ferret, hedgehog/Burr, chinchilla, axolotl/Bloom, toucan, iguana/Sol, dragon/Vesper, phoenix/Ember, ball-python/Nori, corn-snake/Saffron, kingsnake/Bandit, green-tree-python/Jade, hognose/Bluff, garter/Sash, boa/Lula, milk-snake/Coral, rosy-boa/Blush, carpet-python/Atlas, octopus/Cup, cuttlefish/Sepia, nautilus/Chamber, moon-jelly/Pulse, sea-star/Cling, hermit-crab/Tenant, horseshoe-crab/Ledger, seahorse/Anchor, manta/Kite, moray/Door, sheet-moss/Felt, or *Dragon electrical (Relay/Fuse/Ground) move clone. Window-play UNFURL unchanged — never names unfurl. Special unfurl ethogram unchanged — never names unfurl as a trick. Sash owns moss; Felt owns tuft/bead/spore/cushion/thatch and humid/velvet/meadow; Sol owns swell as thank-you, press/nod as tricks; Ember owns lift; Cling owns crawl/damp/press/tide; Still/Felt window owns lean/creep; Burr owns root; Coin owns flare; Phoenix owns lift; Fuse owns pulse as thank-you; Chamber owns quiet as thank-you; Ledger owns page as thank-you; Jade owns treaty as thank-you; Parrot owns fan. Plant/fern desk life only — not a bryophyte moss copy or animal/moray copy. No cry inventing — thank-yous are silent desk motion only. */

export const TRICK_KEY = "maidenhair";
export const TRICKS = ["frond", "rachis", "fiddle", "pinna", "saucer"] as const;
export const HAPPY = ["mist", "filigree", "shade"] as const;
export type MaidenhairTrickKind = (typeof TRICKS)[number];
export type MaidenhairHappyKind = (typeof HAPPY)[number];
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

export type MaidenhairTrick = {
  kind: MaidenhairTrickKind;
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

export type MaidenhairHappy = {
  kind: MaidenhairHappyKind;
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

export const HAPPY_DUR = { mist: 1.26, filigree: 1.18, shade: 1.24 } as const;
export const SAUCER_HOLD = 11.8;
export const RELEASE_S = 0.74;
export const DUR = { saucer: SAUCER_HOLD + RELEASE_S, frond: 1.42, rachis: 1.18, fiddle: 1.52, pinna: 1.28 } as const;

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

export function nextTrickWait(justFinished: boolean, rand?: number, kind?: MaidenhairTrickKind | string) {
  const roll = rand == null ? Math.random() : rand;
  if (kind === "saucer") return 48 + roll * 28;
  if (kind === "frond") return 14 + roll * 10;
  if (kind === "fiddle") return 15 + roll * 11;
  return justFinished ? 10.4 + roll * 8 : 5.2 + roll * 6;
}
export function pickTrick(rand?: number, musicOn?: boolean, lastKind?: MaidenhairTrickKind | string | null) {
  if (musicOn) return "saucer" as const;
  const roll = rand == null ? Math.random() : rand;
  if (lastKind === "saucer") {
    if (roll < 0.26) return "frond" as const;
    if (roll < 0.48) return "rachis" as const;
    if (roll < 0.72) return "fiddle" as const;
    return "pinna" as const;
  }
  if (lastKind === "frond") {
    if (roll < 0.28) return "saucer" as const;
    if (roll < 0.5) return "rachis" as const;
    if (roll < 0.72) return "fiddle" as const;
    return "pinna" as const;
  }
  if (lastKind === "rachis") {
    if (roll < 0.22) return "saucer" as const;
    if (roll < 0.44) return "frond" as const;
    if (roll < 0.66) return "fiddle" as const;
    return "pinna" as const;
  }
  if (roll < 0.2) return "saucer" as const;
  if (roll < 0.4) return "frond" as const;
  if (roll < 0.6) return "rachis" as const;
  if (roll < 0.8) return "fiddle" as const;
  return "pinna" as const;
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
  return key === TRICK_KEY || key === "vein";
}

export function startThankYou(
  key: string | undefined | null,
  lastKind: MaidenhairHappyKind | string | null | undefined,
  x: number,
  facing: 1 | -1,
  flags?: TrickFlags,
) {
  if (!wantsThankYou(key)) return null;
  if (!happyCanStart(flags || { cmd: "idle" })) return null;
  const pick = pickHappy(lastKind as MaidenhairHappyKind | null | undefined);
  return { happy: beginHappy(pick, x, facing), kind: pick };
}

export function pickHappy(lastKind?: MaidenhairHappyKind | null, rand?: number) {
  const pool = HAPPY.filter((k) => k !== lastKind);
  const list = pool.length ? pool : [...HAPPY];
  const roll = rand == null ? Math.random() : rand;
  return list[Math.floor(roll * list.length)] || list[0];
}

export function beginHappy(kind: MaidenhairHappyKind | string, x: number, facing: 1 | -1): MaidenhairHappy {
  const name = (HAPPY as readonly string[]).indexOf(kind) >= 0 ? (kind as MaidenhairHappyKind) : "mist";
  return {
    kind: name,
    happy: true,
    phase: "go",
    t: 0,
    x: x,
    lift: 0,
    rot: 0,
    anim: name === "mist" ? "talk" : name === "filigree" ? "play" : "sit",
    facing: facing == null ? 1 : facing,
    fromX: x,
  };
}

export function mistPose(t: number) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.mist));
    if (u < 0.2) {
      const s = u / 0.2;
      return { lift: s * 0.07, rot: s * 2.6, dx: 0, anim: "talk" as TrickAnim };
    }
    if (u < 0.76) {
      const vapor = Math.sin(t * 1.72);
      return {
        lift: 0.07 + Math.abs(vapor) * 0.035,
        rot: 2.6 + vapor * 1.8,
        dx: vapor * 0.015,
        anim: "talk" as TrickAnim,
      };
    }
    const s = (u - 0.76) / 0.24;
    return { lift: 0.05 * (1 - s), rot: 1.8 * (1 - s), dx: 0, anim: "sit" as TrickAnim };
}
export function filigreePose(t: number) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.filigree));
    if (u < 0.18) {
      const s = u / 0.18;
      return { lift: s * 0.12, rot: s * -3.1, dx: 0, anim: "play" as TrickAnim };
    }
    if (u < 0.78) {
      const lace = Math.sin(t * 2.05);
      return {
        lift: 0.12 + Math.abs(lace) * 0.045,
        rot: -3.1 + lace * 2.8,
        dx: lace * 0.025,
        anim: "play" as TrickAnim,
      };
    }
    const s = (u - 0.78) / 0.22;
    return { lift: 0.09 * (1 - s), rot: -1.8 * (1 - s), dx: 0, anim: "idle" as TrickAnim };
}
export function shadePose(t: number) {
    return {
      lift: 0.025 + Math.abs(Math.sin(t * 0.52)) * 0.035,
      rot: Math.sin(t * 0.64) * -1.4,
      dx: Math.sin(t * 0.36) * 0.03,
      anim: "sit" as TrickAnim,
    };
}
export function stepHappy(happy: MaidenhairHappy, dt: number, flags: TrickFlags): MaidenhairHappy {
  if (!happy || happy.phase === "done") return happy;
  if (happyShouldAbort(flags)) {
    return { ...happy, phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true };
  }
  const next: MaidenhairHappy = { ...happy, t: happy.t + Math.max(0, dt) };
  const hold = HAPPY_DUR[next.kind];
  if (next.kind === "mist") {
    const pose = mistPose(next.t);
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "filigree") {
    const pose = filigreePose(next.t);
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else {
    const pose = shadePose(next.t);
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

export function beginTrick(kind: MaidenhairTrickKind, x: number, facing: 1 | -1): MaidenhairTrick {
  const anim: TrickAnim =
    kind === "saucer"
      ? "sit"
      : kind === "frond"
        ? "sit"
        : kind === "rachis"
          ? "talk"
          : kind === "fiddle"
            ? "play"
            : kind === "pinna"
              ? "talk"
              : "sit";
  return {
    kind: kind,
    phase: kind === "saucer" ? "hold" : "go",
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

export function saucerPose(t: number) {
    const breath = Math.sin(t * 0.38) + 0.05 * Math.sin(t * 1.28);
    return {
      lift: 0.035 + Math.abs(Math.sin(t * 0.38)) * 0.03,
      rot: -1.2 + breath * 1.35,
    };
}
export function releasePose(t: number) {
    const u = Math.max(0, Math.min(1, t / RELEASE_S));
    return { lift: 0.035 * (1 - Math.sin(u * Math.PI * 0.5)), rot: -1.1 * (1 - u) };
}
export function frondPose(t: number, fromX: number, facing: 1 | -1) {
    const u = Math.max(0, Math.min(1, t / DUR.frond));
    if (u < 0.15) {
      const s = smoothstep(u / 0.15);
      return { x: fromX, lift: s * 0.08, rot: s * -4.2 * facing, anim: "sit" as TrickAnim };
    }
    if (u < 0.76) {
      const s = (u - 0.15) / 0.61;
      const open = Math.sin(s * Math.PI * 1.6);
      return {
        x: fromX + facing * open * 0.035,
        lift: 0.08 + Math.abs(open) * 0.09,
        rot: facing * (-4.2 + open * 7.5),
        anim: "sit" as TrickAnim,
      };
    }
    const s = smoothstep((u - 0.76) / 0.24);
    return {
      x: fromX,
      lift: 0.08 * (1 - s),
      rot: facing * (-2.4 * (1 - s)),
      anim: "sit" as TrickAnim,
    };
}
export function rachisPose(t: number, fromX: number, facing: 1 | -1) {
    const u = Math.max(0, Math.min(1, t / DUR.rachis));
    if (u < 0.16) {
      const s = smoothstep(u / 0.16);
      return { x: fromX, lift: s * 0.03, rot: s * 8.5 * facing, anim: "talk" as TrickAnim };
    }
    if (u < 0.58) {
      const s = (u - 0.16) / 0.42;
      const wire = Math.sin(s * Math.PI * 3.4);
      return {
        x: fromX + facing * wire * 0.02,
        lift: 0.03 + Math.abs(wire) * 0.025,
        rot: facing * (8.5 + wire * 4.5),
        anim: "talk" as TrickAnim,
      };
    }
    if (u < 0.8) {
      const s = (u - 0.58) / 0.22;
      const settle = smoothstep(s);
      return {
        x: fromX + facing * (1 - settle) * 0.03,
        lift: 0.04 * (1 - settle * 0.4),
        rot: facing * (8.5 - settle * 10),
        anim: "talk" as TrickAnim,
      };
    }
    const s = smoothstep((u - 0.8) / 0.2);
    return {
      x: fromX,
      lift: 0.025 * (1 - s),
      rot: facing * (-1.2 * (1 - s)),
      anim: "sit" as TrickAnim,
    };
}
export function fiddlePose(t: number, fromX: number, facing: 1 | -1) {
    const u = Math.max(0, Math.min(1, t / DUR.fiddle));
    if (u < 0.18) {
      const s = smoothstep(u / 0.18);
      return { x: fromX, lift: s * 0.05, rot: s * 5.5 * facing, anim: "play" as TrickAnim };
    }
    if (u < 0.55) {
      const s = (u - 0.18) / 0.37;
      const coil = smoothstep(s);
      return {
        x: fromX + facing * coil * 0.03,
        lift: 0.05 + coil * 0.22,
        rot: facing * (5.5 - coil * 9),
        anim: "play" as TrickAnim,
      };
    }
    if (u < 0.8) {
      const s = (u - 0.55) / 0.25;
      const open = Math.sin(s * Math.PI * 0.9);
      return {
        x: fromX + facing * (0.03 + open * 0.04),
        lift: 0.27 - s * 0.08 + Math.abs(open) * 0.03,
        rot: facing * (-3.5 + open * 4),
        anim: "play" as TrickAnim,
      };
    }
    const s = smoothstep((u - 0.8) / 0.2);
    return {
      x: fromX + facing * 0.04 * (1 - s),
      lift: 0.16 * (1 - s),
      rot: facing * (-2 * (1 - s)),
      anim: "sit" as TrickAnim,
    };
}
export function pinnaPose(t: number, fromX: number, facing: 1 | -1) {
    const u = Math.max(0, Math.min(1, t / DUR.pinna));
    if (u < 0.14) {
      const s = smoothstep(u / 0.14);
      return { x: fromX, lift: s * 0.04, rot: s * 2.2 * facing, anim: "talk" as TrickAnim };
    }
    if (u < 0.72) {
      const s = (u - 0.14) / 0.58;
      const flutter = Math.sin(s * Math.PI * 5.6);
      return {
        x: fromX + facing * flutter * 0.018,
        lift: 0.04 + Math.abs(flutter) * 0.035,
        rot: facing * (2.2 + flutter * 3.6),
        anim: "talk" as TrickAnim,
      };
    }
    const s = smoothstep((u - 0.72) / 0.28);
    return {
      x: fromX,
      lift: 0.04 * (1 - s),
      rot: facing * (1.4 * (1 - s)),
      anim: "sit" as TrickAnim,
    };
}
export function stepTrick(trick: MaidenhairTrick, dt: number, flags: TrickFlags): MaidenhairTrick {
  if (!trick || trick.phase === "done") return trick;
  if (shouldAbort(flags) && trick.kind !== "rachis" && trick.kind !== "fiddle" && trick.kind !== "pinna") {
    return { ...trick, phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true };
  }
  const next: MaidenhairTrick = { ...trick, t: trick.t + Math.max(0, dt) };
  if (next.kind === "saucer") {
    if (next.t < SAUCER_HOLD) {
      const pose = saucerPose(next.t);
      next.phase = "hold";
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = "sit";
      return next;
    }
    if (next.t < SAUCER_HOLD + RELEASE_S) {
      const pose = releasePose(next.t - SAUCER_HOLD);
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
  if (next.kind === "frond") {
    const pose = frondPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "rachis") {
    const pose = rachisPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "fiddle") {
    const pose = fiddlePose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else {
    const pose = pinnaPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  }
  if (u >= 1) return { ...next, phase: "done", lift: 0, rot: 0, anim: "idle" };
  return next;
}
