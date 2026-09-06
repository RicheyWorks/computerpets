/** Kite ground tricks while idle. House reef manta — wing / lobe / gyre / vault / span personality (pectoral wing glide, cephalic-lobe plankton scoop, barrel-roll curiosity as a gyre (never named barrel — window-play owns BARREL), forward somersault vault (never named somersault — Rui owns that), gentle-giant wingspan desk life; not Coin drift/gulp/flare/glint/dart, Pulse bell/oral/lucent/trail/medusa, Anchor coil/buoy/siphon/swivel/pouch, Ledger carapace/bookgill/telson/furrow/fossil, Tenant swap/antenna/scuttle/withdraw/vacancy, Cling podia/righting/crawl/evert/penta, Sepia hover/pupil, Chamber spiral, Cup mantle/jet, Ink soak/tuck, or Clip nest). Feed-happy thank-yous sit after eat. Card-open freeze and window-play do not swallow a thank-you. Sleep, hide, and leave still win. Same map as desktop manta-tricks.js. Not a Rui, cat, dog, rabbit, hamster/Clip, guinea pig, turtle/Ink, goldfish/Coin, budgie, fox, penguin, parrot, ferret, hedgehog/Burr, chinchilla, axolotl/Bloom, toucan, iguana, dragon/Vesper, phoenix/Ember, ball-python/Nori, corn-snake/Saffron, kingsnake/Bandit, green-tree-python/Jade, hognose/Bluff, garter/Sash, boa/Lula, milk-snake/Coral, rosy-boa/Blush, carpet-python/Atlas, octopus/Cup, cuttlefish/Sepia, nautilus/Chamber, moon-jelly/Pulse, sea-star/Cling, hermit-crab/Tenant, horseshoe-crab/Ledger, seahorse/Anchor, or *Dragon electrical (Relay/Fuse/Ground) move clone. Window-play BARREL unchanged — never names barrel. Special Soar (eagle_ray) unchanged — never names soar/spots as tricks. Anchor owns coil/buoy/siphon/swivel/pouch and coronet/pipe/moor; Rui owns somersault; Ledger owns carapace/bookgill/telson/furrow/fossil and blue/page/tray; Tenant owns swap/antenna/scuttle/withdraw/vacancy and scrap/fit/lease; Cling owns podia/righting/crawl/evert/penta and damp/press/tide; Pulse owns bell/oral/lucent/trail/medusa and halo/lumen/gel; Cup owns jet/mantle/sucker/veil/tinker and keep/tint/squeeze; Sepia owns bone/pupil/chroma/hover/blot and ripple/glance/dab; Chamber owns spiral/siphuncle/nacre/pinhole/fringe and chamber/pearl/quiet; Coin owns drift/gulp/flare/glint/dart and bubble/lip/swish; Ink owns soak/tuck/crane/plod/paddle and munch/bob/huff; Bloom owns gill/amble/mend/smile/plume and wink/blip/grin; Clip owns nest/cheek/scurry/pocket/reel and stuff/chitter/sprint; Burr owns curl; Fuse owns pulse as thank-you; ferret owns tube; Bluff owns hood; Bandit owns tribute; Phoenix owns lift; Sol owns press as a trick and tap as thank-you; rabbit owns dig; boa owns cradle as thank-you. No cry inventing — thank-yous are silent desk motion only. */

export const TRICK_KEY = "manta";
export const TRICKS = ["wing", "lobe", "gyre", "vault", "span"] as const;
export const HAPPY = ["ceil", "scoop", "breadth"] as const;
export type MantaTrickKind = (typeof TRICKS)[number];
export type MantaHappyKind = (typeof HAPPY)[number];
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

export type MantaTrick = {
  kind: MantaTrickKind;
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

export type MantaHappy = {
  kind: MantaHappyKind;
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

export const HAPPY_DUR = { ceil: 1.24, scoop: 1.16, breadth: 1.22 } as const;
export const SPAN_HOLD = 11.6;
export const RELEASE_S = 0.72;
export const DUR = { span: SPAN_HOLD + RELEASE_S, wing: 1.48, lobe: 1.36, gyre: 1.4, vault: 1.32 } as const;

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

export function nextTrickWait(justFinished: boolean, rand?: number, kind?: MantaTrickKind | string) {
  const roll = rand == null ? Math.random() : rand;
  if (kind === "span") return 48 + roll * 28;
  if (kind === "wing") return 16 + roll * 12;
  if (kind === "vault") return 14 + roll * 10;
  return justFinished ? 10.5 + roll * 8 : 5.2 + roll * 6;
}
export function pickTrick(rand?: number, musicOn?: boolean, lastKind?: MantaTrickKind | string | null) {
  if (musicOn) return "span" as const;
  const roll = rand == null ? Math.random() : rand;
  if (lastKind === "span") {
    if (roll < 0.26) return "wing" as const;
    if (roll < 0.48) return "lobe" as const;
    if (roll < 0.72) return "gyre" as const;
    return "vault" as const;
  }
  if (lastKind === "wing") {
    if (roll < 0.28) return "span" as const;
    if (roll < 0.5) return "lobe" as const;
    if (roll < 0.72) return "gyre" as const;
    return "vault" as const;
  }
  if (lastKind === "lobe") {
    if (roll < 0.22) return "span" as const;
    if (roll < 0.44) return "wing" as const;
    if (roll < 0.66) return "gyre" as const;
    return "vault" as const;
  }
  if (roll < 0.2) return "span" as const;
  if (roll < 0.4) return "wing" as const;
  if (roll < 0.6) return "lobe" as const;
  if (roll < 0.8) return "gyre" as const;
  return "vault" as const;
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
  return key === TRICK_KEY || key === "kite";
}

export function startThankYou(
  key: string | undefined | null,
  lastKind: MantaHappyKind | string | null | undefined,
  x: number,
  facing: 1 | -1,
  flags?: TrickFlags,
) {
  if (!wantsThankYou(key)) return null;
  if (!happyCanStart(flags || { cmd: "idle" })) return null;
  const pick = pickHappy(lastKind as MantaHappyKind | null | undefined);
  return { happy: beginHappy(pick, x, facing), kind: pick };
}

export function pickHappy(lastKind?: MantaHappyKind | null, rand?: number) {
  const pool = HAPPY.filter((k) => k !== lastKind);
  const list = pool.length ? pool : [...HAPPY];
  const roll = rand == null ? Math.random() : rand;
  return list[Math.floor(roll * list.length)] || list[0];
}

export function beginHappy(kind: MantaHappyKind | string, x: number, facing: 1 | -1): MantaHappy {
  const name = (HAPPY as readonly string[]).indexOf(kind) >= 0 ? (kind as MantaHappyKind) : "ceil";
  return {
    kind: name,
    happy: true,
    phase: "go",
    t: 0,
    x: x,
    lift: 0,
    rot: 0,
    anim: name === "ceil" ? "play" : name === "scoop" ? "talk" : "sit",
    facing: facing == null ? 1 : facing,
    fromX: x,
  };
}

export function ceilPose(t: number) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.ceil));
    if (u < 0.18) {
      const s = u / 0.18;
      return { lift: s * 0.42, rot: s * -2.4, dx: 0, anim: "play" as TrickAnim };
    }
    if (u < 0.8) {
      const tip = Math.sin(t * 1.85);
      return {
        lift: 0.42 + Math.abs(tip) * 0.08,
        rot: -2.4 + tip * 3.6,
        dx: tip * 0.04,
        anim: "play" as TrickAnim,
      };
    }
    const s = (u - 0.8) / 0.2;
    return { lift: 0.32 * (1 - s), rot: -1.6 * (1 - s), dx: 0, anim: "idle" as TrickAnim };
  }
export function scoopPose(t: number) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.scoop));
    if (u < 0.2) {
      const s = u / 0.2;
      return { lift: s * 0.18, rot: s * 6.5, dx: 0, anim: "talk" as TrickAnim };
    }
    if (u < 0.78) {
      const draw = Math.sin(t * 2.35);
      return {
        lift: 0.18 + Math.abs(draw) * 0.09,
        rot: 6.5 + draw * 5.5,
        dx: draw * 0.08,
        anim: "talk" as TrickAnim,
      };
    }
    const s = (u - 0.78) / 0.22;
    return { lift: 0.14 * (1 - s), rot: 3.8 * (1 - s), dx: 0, anim: "sit" as TrickAnim };
  }
export function breadthPose(t: number) {
    return {
      lift: 0.12 + Math.abs(Math.sin(t * 0.78)) * 0.1,
      rot: Math.sin(t * 0.92) * 1.8,
      dx: Math.sin(t * 0.55) * 0.05,
      anim: "sit" as TrickAnim,
    };
  }
export function stepHappy(happy: MantaHappy, dt: number, flags: TrickFlags): MantaHappy {
  if (!happy || happy.phase === "done") return happy;
  if (happyShouldAbort(flags)) {
    return { ...happy, phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true };
  }
  const next: MantaHappy = { ...happy, t: happy.t + Math.max(0, dt) };
  const hold = HAPPY_DUR[next.kind];
  if (next.kind === "ceil") {
    const pose = ceilPose(next.t);
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "scoop") {
    const pose = scoopPose(next.t);
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else {
    const pose = breadthPose(next.t);
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

export function beginTrick(kind: MantaTrickKind, x: number, facing: 1 | -1): MantaTrick {
  const anim: TrickAnim =
    kind === "span"
      ? "sit"
      : kind === "wing"
        ? "play"
        : kind === "lobe"
          ? "talk"
          : kind === "gyre"
        ? "play"
        : kind === "vault"
          ? "play"
              : "sit";
  return {
    kind: kind,
    phase: kind === "span" ? "hold" : "go",
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

export function spanPose(t: number) {
    const breath = Math.sin(t * 0.42) + 0.06 * Math.sin(t * 1.15);
    return {
      lift: 0.12 + Math.abs(Math.sin(t * 0.42)) * 0.06,
      rot: breath * 1.05,
    };
  }
export function releasePose(t: number) {
    const u = Math.max(0, Math.min(1, t / RELEASE_S));
    return { lift: 0.12 * (1 - Math.sin(u * Math.PI * 0.5)), rot: 0.75 * (1 - u) };
  }
export function wingPose(t: number, fromX: number, facing: 1 | -1) {
    const u = Math.max(0, Math.min(1, t / DUR.wing));
    if (u < 0.12) {
      const s = smoothstep(u / 0.12);
      return { x: fromX, lift: s * 0.38, rot: s * -3.5 * facing, anim: "play" as TrickAnim };
    }
    if (u < 0.8) {
      const s = (u - 0.12) / 0.68;
      const beat = Math.sin(s * Math.PI * 3.2);
      return {
        x: fromX + facing * (0.22 * s + beat * 0.06),
        lift: 0.38 + beat * 0.1,
        rot: facing * (-3.5 + beat * 5.5),
        anim: "play" as TrickAnim,
      };
    }
    const s = smoothstep((u - 0.8) / 0.2);
    return {
      x: fromX + facing * 0.22 * (1 - s),
      lift: 0.3 * (1 - s),
      rot: facing * (-2 * (1 - s)),
      anim: "sit" as TrickAnim,
    };
  }
export function lobePose(t: number, fromX: number, facing: 1 | -1) {
    const u = Math.max(0, Math.min(1, t / DUR.lobe));
    if (u < 0.14) {
      const s = smoothstep(u / 0.14);
      return { x: fromX, lift: s * 0.16, rot: s * 7 * facing, anim: "talk" as TrickAnim };
    }
    if (u < 0.78) {
      const s = (u - 0.14) / 0.64;
      const scoop = Math.sin(s * Math.PI * 4.2);
      return {
        x: fromX + facing * (0.14 + Math.abs(scoop) * 0.07),
        lift: 0.16 + Math.abs(scoop) * 0.07,
        rot: facing * (7 + scoop * 4.8),
        anim: "talk" as TrickAnim,
      };
    }
    const s = smoothstep((u - 0.78) / 0.22);
    return {
      x: fromX + facing * 0.1 * (1 - s),
      lift: 0.12 * (1 - s),
      rot: facing * (4 * (1 - s)),
      anim: "sit" as TrickAnim,
    };
  }
export function gyrePose(t: number, fromX: number, facing: 1 | -1) {
    const u = Math.max(0, Math.min(1, t / DUR.gyre));
    if (u < 0.12) {
      const s = smoothstep(u / 0.12);
      return { x: fromX, lift: s * 0.48, rot: s * -12 * facing, anim: "play" as TrickAnim };
    }
    if (u < 0.78) {
      const s = (u - 0.12) / 0.66;
      const roll = Math.sin(s * Math.PI);
      return {
        x: fromX + facing * roll * 0.1,
        lift: 0.48 + Math.abs(Math.sin(s * Math.PI * 2)) * 0.12,
        rot: facing * (-12 + s * 30 + roll * 18),
        anim: "play" as TrickAnim,
      };
    }
    const s = smoothstep((u - 0.78) / 0.22);
    return {
      x: fromX,
      lift: 0.36 * (1 - s),
      rot: facing * (8 * (1 - s)),
      anim: "sit" as TrickAnim,
    };
  }
export function vaultPose(t: number, fromX: number, facing: 1 | -1) {
    const u = Math.max(0, Math.min(1, t / DUR.vault));
    if (u < 0.16) {
      const s = smoothstep(u / 0.16);
      return { x: fromX, lift: s * 0.62, rot: s * -8 * facing, anim: "play" as TrickAnim };
    }
    if (u < 0.72) {
      const s = (u - 0.16) / 0.56;
      const flip = Math.sin(s * Math.PI);
      return {
        x: fromX + facing * flip * 0.08,
        lift: 0.62 + flip * 0.18,
        rot: facing * (-8 + s * 28),
        anim: "play" as TrickAnim,
      };
    }
    const s = smoothstep((u - 0.72) / 0.28);
    return {
      x: fromX,
      lift: 0.5 * (1 - s),
      rot: facing * (6 * (1 - s)),
      anim: "sit" as TrickAnim,
    };
  }
export function stepTrick(trick: MantaTrick, dt: number, flags: TrickFlags): MantaTrick {
  if (!trick || trick.phase === "done") return trick;
  if (shouldAbort(flags) && trick.kind !== "lobe" && trick.kind !== "gyre" && trick.kind !== "vault") {
    return { ...trick, phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true };
  }
  const next: MantaTrick = { ...trick, t: trick.t + Math.max(0, dt) };
  if (next.kind === "span") {
    if (next.t < SPAN_HOLD) {
      const pose = spanPose(next.t);
      next.phase = "hold";
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = "sit";
      return next;
    }
    if (next.t < SPAN_HOLD + RELEASE_S) {
      const pose = releasePose(next.t - SPAN_HOLD);
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
  if (next.kind === "wing") {
    const pose = wingPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "lobe") {
    const pose = lobePose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "gyre") {
    const pose = gyrePose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else {
    const pose = vaultPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  }
  if (u >= 1) return { ...next, phase: "done", lift: 0, rot: 0, anim: "idle" };
  return next;
}
