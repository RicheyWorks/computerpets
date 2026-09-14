/** Moth ground tricks while idle. House orchid — labellum / velamen / column / spike / bark personality (labellum landing on the bark mount — never named pad (Disk owns pad) / corolla (Disk owns corolla) / flutter (Fan owns flutter) / drop (Fan owns drop), velamen aerial-root sip on the mist — never named root (Burr owns root) / rhizome (Disk owns rhizome) / taproot (Mast owns taproot) / siphon (Anchor owns siphon) / crawl (Cling owns crawl), column pose on the stem — never named rachis (Vein owns rachis) / bole (Mast owns bole) / hinge (Door owns hinge), spike slow bloom on the lamp — never named bloom as axolotl-guest collision / open (Disk window owns open) / unfurl (Vein window / ethogram owns unfurl) / corolla (Disk owns corolla) / flare (Coin owns flare) / nod (orchid ethogram owns nod), bark-mount desk life under the lamp; not Disk pad/corolla/rhizome/calyx/sheen/peltate/hydropote, Mast acorn/sinus/gall/taproot/bole, Fan biloba/notch/flutter/drop/amber, Vein frond/rachis/fiddle/pinna/saucer, Felt tuft/bead/spore/cushion/thatch, Door hinge/pharynx/knot/lurk/jamb, Kite wing/lobe/gyre/vault/span, Anchor coil/buoy/siphon/swivel/pouch, Ledger carapace/bookgill/telson/furrow/fossil, Tenant swap/antenna/scuttle/withdraw/vacancy, Cling podia/righting/crawl/evert/penta, Pulse bell/oral/lucent/trail/medusa, Coin drift/gulp/flare/glint/dart, Ink soak/tuck, Clip nest, Bloom gill, parrot fan/flash, or snake guests Sash seam/moss/lap copies). Feed-happy thank-yous sit after eat. Card-open freeze and window-play do not swallow a thank-you. Sleep, hide, and leave still win. Same map as desktop orchid-tricks.js. Not a Rui, cat, dog, rabbit, hamster/Clip, guinea pig, turtle/Ink, goldfish/Coin, budgie, fox, penguin, parrot, ferret, hedgehog/Burr, chinchilla, axolotl/Bloom, toucan, iguana/Sol, dragon/Vesper, phoenix/Ember, ball-python/Nori, corn-snake/Saffron, kingsnake/Bandit, green-tree-python/Jade, hognose/Bluff, garter/Sash, boa/Lula, milk-snake/Coral, rosy-boa/Blush, carpet-python/Atlas, octopus/Cup, cuttlefish/Sepia, nautilus/Chamber, moon-jelly/Pulse, sea-star/Cling, hermit-crab/Tenant, horseshoe-crab/Ledger, seahorse/Anchor, manta/Kite, moray/Door, sheet-moss/Felt, maidenhair/Vein, ginkgo/Fan, oak/Mast, water-lily/Disk, or *Dragon electrical (Relay/Fuse/Ground) move clone. Window-play MOUNT unchanged — never names mount. Special bloom ethogram / unfurl/lean/nod ethogram unchanged — never names bloom/unfurl/lean/nod as tricks. Sash owns moss; Felt owns tuft/bead/spore/cushion/thatch and humid/velvet/meadow; Vein owns frond/rachis/fiddle/pinna/saucer and mist/filigree/shade; Fan owns biloba/notch/flutter/drop/amber and ochre/gilt/linger; Mast owns acorn/sinus/gall/taproot/bole and cupule/tannin/grove; Disk owns pad/corolla/rhizome/calyx/sheen/peltate/hydropote and silt/nectar/dew; Sol owns swell as thank-you, press/nod as tricks; Ember owns lift; Cling owns crawl/damp/press/tide; Still/Felt window owns lean/creep; Burr owns root; Coin owns flare; Phoenix owns lift; Fuse owns pulse as thank-you; Chamber owns quiet as thank-you; Ledger owns page as thank-you and fossil as trick; Jade owns treaty as thank-you and sway as trick; Parrot owns fan; Kite owns lobe; Bloom owns gill. Epiphyte moth-orchid desk life only — not a water-lily Disk copy, oak Mast copy, ginkgo Fan copy, fern Vein copy, bryophyte Felt copy, jelly Pulse copy, or goldfish Coin copy. No cry inventing — thank-yous are silent desk motion only. */

export const TRICK_KEY = "orchid";
export const TRICKS = ["labellum", "velamen", "column", "spike", "bark"] as const;
export const HAPPY = ["pollen", "perfume", "pearl"] as const;
export type OrchidTrickKind = (typeof TRICKS)[number];
export type OrchidHappyKind = (typeof HAPPY)[number];
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

export type OrchidTrick = {
  kind: OrchidTrickKind;
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

export type OrchidHappy = {
  kind: OrchidHappyKind;
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

export const HAPPY_DUR = { pollen: 1.26, perfume: 1.2, pearl: 1.3 } as const;
export const BARK_HOLD = 12.8;
export const RELEASE_S = 0.8;
export const DUR = { bark: BARK_HOLD + RELEASE_S, labellum: 1.52, velamen: 1.4, column: 1.36, spike: 1.62 } as const;

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

export function nextTrickWait(justFinished: boolean, rand?: number, kind?: OrchidTrickKind | string) {
  const roll = rand == null ? Math.random() : rand;
  if (kind === "bark") return 52 + roll * 28;
  if (kind === "labellum") return 15 + roll * 10;
  if (kind === "spike") return 17 + roll * 11;
  return justFinished ? 11 + roll * 8 : 5.6 + roll * 6;
}
export function pickTrick(rand?: number, musicOn?: boolean, lastKind?: OrchidTrickKind | string | null) {
  if (musicOn) return "bark" as const;
  const roll = rand == null ? Math.random() : rand;
  if (lastKind === "bark") {
    if (roll < 0.26) return "labellum" as const;
    if (roll < 0.48) return "spike" as const;
    if (roll < 0.72) return "velamen" as const;
    return "column" as const;
  }
  if (lastKind === "labellum") {
    if (roll < 0.28) return "bark" as const;
    if (roll < 0.5) return "spike" as const;
    if (roll < 0.72) return "velamen" as const;
    return "column" as const;
  }
  if (lastKind === "spike") {
    if (roll < 0.22) return "bark" as const;
    if (roll < 0.44) return "labellum" as const;
    if (roll < 0.66) return "velamen" as const;
    return "column" as const;
  }
  if (roll < 0.2) return "bark" as const;
  if (roll < 0.4) return "labellum" as const;
  if (roll < 0.6) return "spike" as const;
  if (roll < 0.8) return "velamen" as const;
  return "column" as const;
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
  return key === TRICK_KEY || key === "moth";
}

export function startThankYou(
  key: string | undefined | null,
  lastKind: OrchidHappyKind | string | null | undefined,
  x: number,
  facing: 1 | -1,
  flags?: TrickFlags,
) {
  if (!wantsThankYou(key)) return null;
  if (!happyCanStart(flags || { cmd: "idle" })) return null;
  const pick = pickHappy(lastKind as OrchidHappyKind | null | undefined);
  return { happy: beginHappy(pick, x, facing), kind: pick };
}

export function pickHappy(lastKind?: OrchidHappyKind | null, rand?: number) {
  const pool = HAPPY.filter((k) => k !== lastKind);
  const list = pool.length ? pool : [...HAPPY];
  const roll = rand == null ? Math.random() : rand;
  return list[Math.floor(roll * list.length)] || list[0];
}

export function beginHappy(kind: OrchidHappyKind | string, x: number, facing: 1 | -1): OrchidHappy {
  const name = (HAPPY as readonly string[]).indexOf(kind) >= 0 ? (kind as OrchidHappyKind) : "pollen";
  return {
    kind: name,
    happy: true,
    phase: "go",
    t: 0,
    x: x,
    lift: 0,
    rot: 0,
    anim: name === "pollen" ? "sit" : name === "perfume" ? "play" : "talk",
    facing: facing == null ? 1 : facing,
    fromX: x,
  };
}

export function pollenPose(t: number) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.pollen));
    if (u < 0.2) {
      const s = u / 0.2;
      return { lift: s * 0.035, rot: s * -1.4, dx: 0, anim: "sit" as TrickAnim };
    }
    if (u < 0.78) {
      const dust = Math.sin(t * 1.05);
      return {
        lift: 0.035 + Math.abs(dust) * 0.022,
        rot: -1.4 + dust * 1.5,
        dx: dust * 0.012,
        anim: "sit" as TrickAnim,
      };
    }
    const s = (u - 0.78) / 0.22;
    return { lift: 0.028 * (1 - s), rot: -0.9 * (1 - s), dx: 0, anim: "sit" as TrickAnim };
  }
export function perfumePose(t: number) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.perfume));
    if (u < 0.15) {
      const s = u / 0.15;
      return { lift: s * 0.18, rot: s * 2.4, dx: 0, anim: "play" as TrickAnim };
    }
    if (u < 0.7) {
      const scent = Math.sin(t * 1.7);
      return {
        lift: 0.18 + Math.abs(scent) * 0.05,
        rot: 2.4 + scent * 2.8,
        dx: scent * 0.018,
        anim: "play" as TrickAnim,
      };
    }
    const s = (u - 0.7) / 0.3;
    return { lift: 0.12 * (1 - s), rot: 1.4 * (1 - s), dx: 0, anim: "idle" as TrickAnim };
  }
export function pearlPose(t: number) {
    return {
      lift: 0.028 + Math.abs(Math.sin(t * 0.62)) * 0.03,
      rot: Math.sin(t * 0.78) * 1.6,
      dx: Math.sin(t * 0.45) * 0.018,
      anim: "talk" as TrickAnim,
    };
  }
export function stepHappy(happy: OrchidHappy, dt: number, flags: TrickFlags): OrchidHappy {
  if (!happy || happy.phase === "done") return happy;
  if (happyShouldAbort(flags)) {
    return { ...happy, phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true };
  }
  const next: OrchidHappy = { ...happy, t: happy.t + Math.max(0, dt) };
  const hold = HAPPY_DUR[next.kind];
  if (next.kind === "pollen") {
    const pose = pollenPose(next.t);
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "perfume") {
    const pose = perfumePose(next.t);
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else {
    const pose = pearlPose(next.t);
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

export function beginTrick(kind: OrchidTrickKind, x: number, facing: 1 | -1): OrchidTrick {
  const anim: TrickAnim =
    kind === "bark"
      ? "sit"
      : kind === "labellum"
        ? "sit"
        : kind === "spike"
          ? "talk"
          : kind === "velamen"
            ? "play"
            : kind === "column"
              ? "talk"
              : "sit";
  return {
    kind: kind,
    phase: kind === "bark" ? "hold" : "go",
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

export function barkPose(t: number) {
    const breath = Math.sin(t * 0.26) + 0.035 * Math.sin(t * 1.05);
    return {
      lift: 0.028 + Math.abs(Math.sin(t * 0.32)) * 0.022,
      rot: 0.6 + breath * 0.75,
    };
  }
export function releasePose(t: number) {
    const u = Math.max(0, Math.min(1, t / RELEASE_S));
    return { lift: 0.028 * (1 - Math.sin(u * Math.PI * 0.5)), rot: 0.6 * (1 - u) };
  }
export function labellumPose(t: number, fromX: number, facing: 1 | -1) {
    const u = Math.max(0, Math.min(1, t / DUR.labellum));
    if (u < 0.16) {
      const s = smoothstep(u / 0.16);
      return { x: fromX, lift: s * 0.11, rot: s * 4.2 * facing, anim: "sit" as TrickAnim };
    }
    if (u < 0.55) {
      const s = (u - 0.16) / 0.39;
      const land = smoothstep(s);
      return {
        x: fromX + facing * land * 0.028,
        lift: 0.11 * (1 - land * 0.72),
        rot: facing * (4.2 - land * 7.5),
        anim: "sit" as TrickAnim,
      };
    }
    if (u < 0.84) {
      const s = (u - 0.55) / 0.29;
      const lip = Math.sin(s * Math.PI * 1.8);
      return {
        x: fromX + facing * (0.028 + lip * 0.01),
        lift: 0.03 + Math.abs(lip) * 0.018,
        rot: facing * (-3.3 + lip * 2.2),
        anim: "sit" as TrickAnim,
      };
    }
    const s = smoothstep((u - 0.84) / 0.16);
    return {
      x: fromX + facing * 0.028 * (1 - s),
      lift: 0.028 * (1 - s),
      rot: facing * (-2.0 * (1 - s)),
      anim: "sit" as TrickAnim,
    };
  }
export function velamenPose(t: number, fromX: number, facing: 1 | -1) {
    const u = Math.max(0, Math.min(1, t / DUR.velamen));
    if (u < 0.14) {
      const s = smoothstep(u / 0.14);
      return { x: fromX, lift: s * 0.06, rot: s * -5.5 * facing, anim: "play" as TrickAnim };
    }
    if (u < 0.5) {
      const s = (u - 0.14) / 0.36;
      const sip = smoothstep(s);
      return {
        x: fromX + facing * sip * 0.07,
        lift: 0.06 - sip * 0.04,
        rot: facing * (-5.5 + sip * 2.2),
        anim: "play" as TrickAnim,
      };
    }
    if (u < 0.8) {
      const s = (u - 0.5) / 0.3;
      const drink = Math.sin(s * Math.PI * 2.4);
      return {
        x: fromX + facing * (0.07 + drink * 0.012),
        lift: 0.02 + Math.abs(drink) * 0.025,
        rot: facing * (-3.3 + drink * 2.6),
        anim: "play" as TrickAnim,
      };
    }
    const s = smoothstep((u - 0.8) / 0.2);
    return {
      x: fromX + facing * 0.07 * (1 - s),
      lift: 0.02 * (1 - s),
      rot: facing * (-2.0 * (1 - s)),
      anim: "sit" as TrickAnim,
    };
  }
export function columnPose(t: number, fromX: number, facing: 1 | -1) {
    const u = Math.max(0, Math.min(1, t / DUR.column));
    if (u < 0.18) {
      const s = smoothstep(u / 0.18);
      return { x: fromX, lift: s * 0.14, rot: s * -2.2 * facing, anim: "talk" as TrickAnim };
    }
    if (u < 0.72) {
      const s = (u - 0.18) / 0.54;
      const stand = Math.sin(s * Math.PI * 1.4);
      return {
        x: fromX + facing * stand * 0.01,
        lift: 0.14 + Math.abs(stand) * 0.02,
        rot: facing * (-2.2 + stand * 1.6),
        anim: "talk" as TrickAnim,
      };
    }
    const s = smoothstep((u - 0.72) / 0.28);
    return {
      x: fromX,
      lift: 0.14 * (1 - s),
      rot: facing * (-1.4 * (1 - s)),
      anim: "sit" as TrickAnim,
    };
  }
export function spikePose(t: number, fromX: number, facing: 1 | -1) {
    const u = Math.max(0, Math.min(1, t / DUR.spike));
    if (u < 0.22) {
      const s = smoothstep(u / 0.22);
      return { x: fromX, lift: s * 0.05, rot: s * 2.8 * facing, anim: "talk" as TrickAnim };
    }
    if (u < 0.58) {
      const s = (u - 0.22) / 0.36;
      const bloom = smoothstep(s);
      return {
        x: fromX + facing * bloom * 0.014,
        lift: 0.05 + bloom * 0.16,
        rot: facing * (2.8 + bloom * 8.5),
        anim: "talk" as TrickAnim,
      };
    }
    if (u < 0.84) {
      const s = (u - 0.58) / 0.26;
      const hold = Math.sin(s * Math.PI * 1.6);
      return {
        x: fromX + facing * (0.014 + hold * 0.012),
        lift: 0.21 + Math.abs(hold) * 0.025,
        rot: facing * (11.3 + hold * 1.8),
        anim: "talk" as TrickAnim,
      };
    }
    const s = smoothstep((u - 0.84) / 0.16);
    return {
      x: fromX,
      lift: 0.21 * (1 - s),
      rot: facing * (6.5 * (1 - s)),
      anim: "sit" as TrickAnim,
    };
  }
export function stepTrick(trick: OrchidTrick, dt: number, flags: TrickFlags): OrchidTrick {
  if (!trick || trick.phase === "done") return trick;
  if (shouldAbort(flags) && trick.kind !== "labellum" && trick.kind !== "velamen" && trick.kind !== "column" && trick.kind !== "spike") {
    return { ...trick, phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true };
  }
  const next: OrchidTrick = { ...trick, t: trick.t + Math.max(0, dt) };
  if (next.kind === "bark") {
    if (next.t < BARK_HOLD) {
      const pose = barkPose(next.t);
      next.phase = "hold";
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = "sit";
      return next;
    }
    if (next.t < BARK_HOLD + RELEASE_S) {
      const pose = releasePose(next.t - BARK_HOLD);
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
  if (next.kind === "labellum") {
    const pose = labellumPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "velamen") {
    const pose = velamenPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "column") {
    const pose = columnPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else {
    const pose = spikePose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  }
  if (u >= 1) return { ...next, phase: "done", lift: 0, rot: 0, anim: "idle" };
  return next;
}
