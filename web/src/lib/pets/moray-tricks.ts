/** Door ground tricks while idle. House green moray — hinge / pharynx / knot / lurk / jamb personality (crevice-jaw hinge gape that is breath not a yawn — never named gape (window-play owns GAPE; Bluff owns gape), pharyngeal-jaw flash as pharynx (never named flash — Quill owns that), knot retreat into the dens, ambush peek as lurk (never named peek/peer — Keel owns peer), reef-door jamb desk life in the book crevice; not Coin drift/gulp/flare/glint/dart, Pulse bell/oral/lucent/trail/medusa, Anchor coil/buoy/siphon/swivel/pouch, Kite wing/lobe/gyre/vault/span, Ledger carapace/bookgill/telson/furrow/fossil, Tenant swap/antenna/scuttle/withdraw/vacancy, Cling podia/righting/crawl/evert/penta, Sepia hover/pupil, Chamber spiral, Cup mantle/jet, Ink soak/tuck, Clip nest, or snake guests Nori/Saffron/Bandit/Jade/Bluff/Sash/Lula/Coral/Blush/Atlas coil/bun/stripe/bracelet/hood/seam/pour/rhyme/pebble/legend copies). Feed-happy thank-yous sit after eat. Card-open freeze and window-play do not swallow a thank-you. Sleep, hide, and leave still win. Same map as desktop moray-tricks.js. Not a Rui, cat, dog, rabbit, hamster/Clip, guinea pig, turtle/Ink, goldfish/Coin, budgie, fox, penguin, parrot, ferret, hedgehog/Burr, chinchilla, axolotl/Bloom, toucan, iguana, dragon/Vesper, phoenix/Ember, ball-python/Nori, corn-snake/Saffron, kingsnake/Bandit, green-tree-python/Jade, hognose/Bluff, garter/Sash, boa/Lula, milk-snake/Coral, rosy-boa/Blush, carpet-python/Atlas, octopus/Cup, cuttlefish/Sepia, nautilus/Chamber, moon-jelly/Pulse, sea-star/Cling, hermit-crab/Tenant, horseshoe-crab/Ledger, seahorse/Anchor, manta/Kite, or *Dragon electrical (Relay/Fuse/Ground) move clone. Window-play GAPE unchanged — never names gape. Special hide/gape/dart ethogram unchanged — never names gape/hide/dart as tricks. Blush owns crevice; Bluff owns gape; Quill owns flash; Coin owns dart; Keel owns peer; Anchor owns coil/buoy/siphon/swivel/pouch and coronet/pipe/moor; Kite owns wing/lobe/gyre/vault/span and ceil/scoop/breadth; Rui owns somersault; Ledger owns carapace/bookgill/telson/furrow/fossil and blue/page/tray; Tenant owns swap/antenna/scuttle/withdraw/vacancy and scrap/fit/lease; Cling owns podia/righting/crawl/evert/penta and damp/press/tide; Pulse owns bell/oral/lucent/trail/medusa and halo/lumen/gel; Cup owns jet/mantle/sucker/veil/tinker and keep/tint/squeeze; Sepia owns bone/pupil/chroma/hover/blot and ripple/glance/dab; Chamber owns spiral/siphuncle/nacre/pinhole/fringe and chamber/pearl/quiet; Coin owns drift/gulp/flare/glint/dart and bubble/lip/swish; Ink owns soak/tuck/crane/plod/paddle and munch/bob/huff; Bloom owns gill/amble/mend/smile/plume and wink/blip/grin; Clip owns nest/cheek/scurry/pocket/reel and stuff/chitter/sprint; Burr owns curl; Fuse owns pulse as thank-you; ferret owns tube; Bandit owns tribute; Phoenix owns lift; Sol owns press as a trick and tap as thank-you; rabbit owns dig; boa owns cradle as thank-you; Nori owns nook. No cry inventing — thank-yous are silent desk motion only. */

export const TRICK_KEY = "moray";
export const TRICKS = ["hinge", "pharynx", "knot", "lurk", "jamb"] as const;
export const HAPPY = ["breath", "vigil", "recess"] as const;
export type MorayTrickKind = (typeof TRICKS)[number];
export type MorayHappyKind = (typeof HAPPY)[number];
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

export type MorayTrick = {
  kind: MorayTrickKind;
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

export type MorayHappy = {
  kind: MorayHappyKind;
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

export const HAPPY_DUR = { breath: 1.26, vigil: 1.14, recess: 1.2 } as const;
export const JAMB_HOLD = 11.8;
export const RELEASE_S = 0.7;
export const DUR = { jamb: JAMB_HOLD + RELEASE_S, hinge: 1.44, pharynx: 1.18, knot: 1.5, lurk: 1.36 } as const;

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

export function nextTrickWait(justFinished: boolean, rand?: number, kind?: MorayTrickKind | string) {
  const roll = rand == null ? Math.random() : rand;
  if (kind === "jamb") return 48 + roll * 28;
  if (kind === "hinge") return 15 + roll * 11;
  if (kind === "knot") return 16 + roll * 12;
  return justFinished ? 10.5 + roll * 8 : 5.2 + roll * 6;
}
export function pickTrick(rand?: number, musicOn?: boolean, lastKind?: MorayTrickKind | string | null) {
  if (musicOn) return "jamb" as const;
  const roll = rand == null ? Math.random() : rand;
  if (lastKind === "jamb") {
    if (roll < 0.26) return "hinge" as const;
    if (roll < 0.48) return "pharynx" as const;
    if (roll < 0.72) return "knot" as const;
    return "lurk" as const;
  }
  if (lastKind === "hinge") {
    if (roll < 0.28) return "jamb" as const;
    if (roll < 0.5) return "pharynx" as const;
    if (roll < 0.72) return "knot" as const;
    return "lurk" as const;
  }
  if (lastKind === "pharynx") {
    if (roll < 0.22) return "jamb" as const;
    if (roll < 0.44) return "hinge" as const;
    if (roll < 0.66) return "knot" as const;
    return "lurk" as const;
  }
  if (roll < 0.2) return "jamb" as const;
  if (roll < 0.4) return "hinge" as const;
  if (roll < 0.6) return "pharynx" as const;
  if (roll < 0.8) return "knot" as const;
  return "lurk" as const;
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
  return key === TRICK_KEY || key === "door";
}

export function startThankYou(
  key: string | undefined | null,
  lastKind: MorayHappyKind | string | null | undefined,
  x: number,
  facing: 1 | -1,
  flags?: TrickFlags,
) {
  if (!wantsThankYou(key)) return null;
  if (!happyCanStart(flags || { cmd: "idle" })) return null;
  const pick = pickHappy(lastKind as MorayHappyKind | null | undefined);
  return { happy: beginHappy(pick, x, facing), kind: pick };
}

export function pickHappy(lastKind?: MorayHappyKind | null, rand?: number) {
  const pool = HAPPY.filter((k) => k !== lastKind);
  const list = pool.length ? pool : [...HAPPY];
  const roll = rand == null ? Math.random() : rand;
  return list[Math.floor(roll * list.length)] || list[0];
}

export function beginHappy(kind: MorayHappyKind | string, x: number, facing: 1 | -1): MorayHappy {
  const name = (HAPPY as readonly string[]).indexOf(kind) >= 0 ? (kind as MorayHappyKind) : "breath";
  return {
    kind: name,
    happy: true,
    phase: "go",
    t: 0,
    x: x,
    lift: 0,
    rot: 0,
    anim: name === "breath" ? "talk" : name === "vigil" ? "play" : "sit",
    facing: facing == null ? 1 : facing,
    fromX: x,
  };
}

export function breathPose(t: number) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.breath));
    if (u < 0.2) {
      const s = u / 0.2;
      return { lift: s * 0.1, rot: s * 8.5, dx: 0, anim: "talk" as TrickAnim };
    }
    if (u < 0.78) {
      const open = Math.sin(t * 1.95);
      return {
        lift: 0.1 + Math.abs(open) * 0.05,
        rot: 8.5 + open * 4.2,
        dx: open * 0.03,
        anim: "talk" as TrickAnim,
      };
    }
    const s = (u - 0.78) / 0.22;
    return { lift: 0.08 * (1 - s), rot: 4.5 * (1 - s), dx: 0, anim: "sit" as TrickAnim };
  }
export function vigilPose(t: number) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.vigil));
    if (u < 0.18) {
      const s = u / 0.18;
      return { lift: s * 0.28, rot: s * -3.2, dx: 0, anim: "play" as TrickAnim };
    }
    if (u < 0.76) {
      const tip = Math.sin(t * 2.1);
      return {
        lift: 0.28 + Math.abs(tip) * 0.06,
        rot: -3.2 + tip * 2.8,
        dx: tip * 0.05,
        anim: "play" as TrickAnim,
      };
    }
    const s = (u - 0.76) / 0.24;
    return { lift: 0.2 * (1 - s), rot: -1.8 * (1 - s), dx: 0, anim: "idle" as TrickAnim };
  }
export function recessPose(t: number) {
    return {
      lift: 0.04 + Math.abs(Math.sin(t * 0.68)) * 0.05,
      rot: Math.sin(t * 0.85) * 1.4,
      dx: Math.sin(t * 0.48) * -0.06,
      anim: "sit" as TrickAnim,
    };
  }
export function stepHappy(happy: MorayHappy, dt: number, flags: TrickFlags): MorayHappy {
  if (!happy || happy.phase === "done") return happy;
  if (happyShouldAbort(flags)) {
    return { ...happy, phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true };
  }
  const next: MorayHappy = { ...happy, t: happy.t + Math.max(0, dt) };
  const hold = HAPPY_DUR[next.kind];
  if (next.kind === "breath") {
    const pose = breathPose(next.t);
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "vigil") {
    const pose = vigilPose(next.t);
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else {
    const pose = recessPose(next.t);
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

export function beginTrick(kind: MorayTrickKind, x: number, facing: 1 | -1): MorayTrick {
  const anim: TrickAnim =
    kind === "jamb"
      ? "sit"
      : kind === "hinge"
        ? "talk"
        : kind === "pharynx"
          ? "play"
          : kind === "knot"
        ? "play"
        : kind === "lurk"
          ? "talk"
              : "sit";
  return {
    kind: kind,
    phase: kind === "jamb" ? "hold" : "go",
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

export function jambPose(t: number) {
    const breath = Math.sin(t * 0.55) + 0.08 * Math.sin(t * 1.4);
    return {
      lift: 0.06 + Math.abs(Math.sin(t * 0.55)) * 0.04,
      rot: 3.2 + breath * 2.4,
    };
  }
export function releasePose(t: number) {
    const u = Math.max(0, Math.min(1, t / RELEASE_S));
    return { lift: 0.06 * (1 - Math.sin(u * Math.PI * 0.5)), rot: 2.4 * (1 - u) };
  }
export function hingePose(t: number, fromX: number, facing: 1 | -1) {
    const u = Math.max(0, Math.min(1, t / DUR.hinge));
    if (u < 0.14) {
      const s = smoothstep(u / 0.14);
      return { x: fromX, lift: s * 0.12, rot: s * 10 * facing, anim: "talk" as TrickAnim };
    }
    if (u < 0.8) {
      const s = (u - 0.14) / 0.66;
      const open = Math.sin(s * Math.PI * 3.6);
      return {
        x: fromX + facing * Math.abs(open) * 0.04,
        lift: 0.12 + Math.abs(open) * 0.06,
        rot: facing * (10 + open * 6.5),
        anim: "talk" as TrickAnim,
      };
    }
    const s = smoothstep((u - 0.8) / 0.2);
    return {
      x: fromX,
      lift: 0.1 * (1 - s),
      rot: facing * (5 * (1 - s)),
      anim: "sit" as TrickAnim,
    };
  }
export function pharynxPose(t: number, fromX: number, facing: 1 | -1) {
    const u = Math.max(0, Math.min(1, t / DUR.pharynx));
    if (u < 0.16) {
      const s = smoothstep(u / 0.16);
      return { x: fromX, lift: s * 0.08, rot: s * 4 * facing, anim: "play" as TrickAnim };
    }
    if (u < 0.42) {
      const s = (u - 0.16) / 0.26;
      const snap = smoothstep(s);
      return {
        x: fromX + facing * snap * 0.18,
        lift: 0.08 + snap * 0.22,
        rot: facing * (4 + snap * 14),
        anim: "play" as TrickAnim,
      };
    }
    if (u < 0.72) {
      const s = (u - 0.42) / 0.3;
      const recoil = Math.sin(s * Math.PI);
      return {
        x: fromX + facing * (0.18 - s * 0.12),
        lift: 0.3 - s * 0.14 + recoil * 0.04,
        rot: facing * (18 - s * 12),
        anim: "play" as TrickAnim,
      };
    }
    const s = smoothstep((u - 0.72) / 0.28);
    return {
      x: fromX + facing * 0.06 * (1 - s),
      lift: 0.14 * (1 - s),
      rot: facing * (5 * (1 - s)),
      anim: "sit" as TrickAnim,
    };
  }
export function knotPose(t: number, fromX: number, facing: 1 | -1) {
    const u = Math.max(0, Math.min(1, t / DUR.knot));
    if (u < 0.14) {
      const s = smoothstep(u / 0.14);
      return { x: fromX, lift: s * 0.2, rot: s * -14 * facing, anim: "play" as TrickAnim };
    }
    if (u < 0.55) {
      const s = (u - 0.14) / 0.41;
      const cinch = Math.sin(s * Math.PI * 2.2);
      return {
        x: fromX - facing * (0.12 * s + Math.abs(cinch) * 0.05),
        lift: 0.2 + Math.abs(cinch) * 0.1,
        rot: facing * (-14 + s * 40 + cinch * 12),
        anim: "play" as TrickAnim,
      };
    }
    if (u < 0.78) {
      const s = (u - 0.55) / 0.23;
      return {
        x: fromX - facing * (0.12 + s * 0.1),
        lift: 0.16 * (1 - s * 0.4),
        rot: facing * (12 - s * 8),
        anim: "sit" as TrickAnim,
      };
    }
    const s = smoothstep((u - 0.78) / 0.22);
    return {
      x: fromX - facing * 0.22 * (1 - s),
      lift: 0.1 * (1 - s),
      rot: facing * (4 * (1 - s)),
      anim: "sit" as TrickAnim,
    };
  }
export function lurkPose(t: number, fromX: number, facing: 1 | -1) {
    const u = Math.max(0, Math.min(1, t / DUR.lurk));
    if (u < 0.18) {
      const s = smoothstep(u / 0.18);
      return { x: fromX, lift: s * 0.14, rot: s * -2 * facing, anim: "talk" as TrickAnim };
    }
    if (u < 0.48) {
      const s = (u - 0.18) / 0.3;
      return {
        x: fromX + facing * s * 0.2,
        lift: 0.14 + s * 0.08,
        rot: facing * (-2 + s * 5),
        anim: "talk" as TrickAnim,
      };
    }
    if (u < 0.72) {
      const hold = Math.sin((u - 0.48) * 18);
      return {
        x: fromX + facing * 0.2,
        lift: 0.22 + hold * 0.03,
        rot: facing * (3 + hold * 1.5),
        anim: "talk" as TrickAnim,
      };
    }
    const s = smoothstep((u - 0.72) / 0.28);
    return {
      x: fromX + facing * 0.2 * (1 - s),
      lift: 0.18 * (1 - s),
      rot: facing * (2.5 * (1 - s)),
      anim: "sit" as TrickAnim,
    };
  }
export function stepTrick(trick: MorayTrick, dt: number, flags: TrickFlags): MorayTrick {
  if (!trick || trick.phase === "done") return trick;
  if (shouldAbort(flags) && trick.kind !== "pharynx" && trick.kind !== "knot" && trick.kind !== "lurk") {
    return { ...trick, phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true };
  }
  const next: MorayTrick = { ...trick, t: trick.t + Math.max(0, dt) };
  if (next.kind === "jamb") {
    if (next.t < JAMB_HOLD) {
      const pose = jambPose(next.t);
      next.phase = "hold";
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = "sit";
      return next;
    }
    if (next.t < JAMB_HOLD + RELEASE_S) {
      const pose = releasePose(next.t - JAMB_HOLD);
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
  if (next.kind === "hinge") {
    const pose = hingePose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "pharynx") {
    const pose = pharynxPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "knot") {
    const pose = knotPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else {
    const pose = lurkPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  }
  if (u >= 1) return { ...next, phase: "done", lift: 0, rot: 0, anim: "idle" };
  return next;
}
