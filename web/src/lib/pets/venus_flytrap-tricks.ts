/** Snap ground tricks while idle — ultra-polish pass. House venus_flytrap — clamp / trichome / stew / unseal / poise / cage / scape personality (lobe clamp snap on the blotter — never named snap (special / Fuse thank-you / ethogram-old / snapper window) / lobe (Kite owns lobe) / shut (window phase) / count (Snap window owns COUNT) / rib (Arm owns rib) / branch (Arm owns branch), trigger-hair trichome tingle — never named trigger as vague verb-only / hair / bristle (Burr owns bristle) / tickle / probe (Saffron owns probe) / nod (ethogram-old / Sol owns nod), digestive stew hush on the closed trap — never named hush as shared verb-only / digest (sundew owns digest) / enzyme (pitcher owns enzyme) / nectar (Disk owns nectar) / dew (Disk owns dew) / soak (Ink owns soak), unseal open-reset after the meal — never named open (Disk window owns open) / reset / gape (Door window / Bluff) / flare (Coin owns flare) / nocturne (Arm owns nocturne) / spike (Moth owns spike) / corolla (Disk owns corolla), carnivorous poise desk life under the lamp, cage interlocking marginal-cilia fringe after the clamp (species-true Dionaea muscipula cilia cage — never named cilia (paramecium owns cilia) / teeth (beaver) / tooth (alligator) / fringe (amoeba / nautilus) / latch (barn_owl) / lure (snapper) / margin (barnacle)), scape tall flower-stalk rise above the traps (species-true Dionaea flower scape — never named spike (Moth owns spike) / column (Moth owns column) / bloom as axolotl-guest collision / sprout (Bloom owns sprout) / nectary (bat owns nectary)); not Arm rib/branch/nocturne/areole/sentinel/pleat/boot, Moth labellum/velamen/column/spike/epiphyte/keiki/pollinia, Disk pad/corolla/rhizome/calyx/sheen/peltate/hydropote, Mast acorn/sinus/gall/taproot/bole/catkin/tyloses, Fan biloba/notch/flutter/drop/amber/dichotomy/petiole, Vein frond/rachis/fiddle/pinna/saucer/sori/stipe, Felt tuft/bead/spore/cushion/thatch/rhizoid/seta, Door hinge/pharynx/knot/lurk/jamb, Kite wing/lobe/gyre/vault/span, Anchor coil/buoy/siphon/swivel/pouch, Ledger carapace/bookgill/telson/furrow/fossil, Tenant swap/antenna/scuttle/withdraw/vacancy, Cling podia/righting/crawl/evert/penta, Pulse bell/oral/lucent/trail/medusa, Coin drift/gulp/flare/glint/dart, Ink soak/tuck, Clip nest/seed, Bloom gill, parrot fan/flash, Blush mesa/arroyo, Sol sun/dewlap/nod/press/flick, Drown/Well peristome/cistern/brine/operculum/urn, Dew mucilage/tentacle/digest/gland/rosette, or snake guests Sash seam/moss/lap copies). Cage is the iconic interlocking cilia fringe (not teeth/fringe/latch). Scape is the iconic tall flower stalk above the traps (not Moth spike/column). Window-play COUNT unchanged — never names count as a trick. Ethogram keeps poise sit_hold; adds clamp/trichome/stew/unseal/cage/scape softs + freeze (replaces thin snap/lean/nod). Amplitudes raised toward Rui richness; denser waits/weights; prefersHouseCry via venus_flytrap.wav. Thank-yous gnat / peat / crimson. Feed-happy after eat. Sleep, hide, leave, rest, card still win. Same map as desktop `venus_flytrap-tricks.js`. True house-venus-flytrap desk life — not Rui/cat/dog/rabbit/hamster/guinea_pig/turtle/goldfish/budgie/fox/penguin/parrot/ferret/hedgehog/chinchilla/axolotl/toucan/iguana/Sol/dragon/Vesper/phoenix/Ember/ball_python/Nori/corn_snake/Saffron/kingsnake/Bandit/green_tree_python/Jade/hognose/Bluff/garter/Sash/boa/Lula/milk_snake/Coral/rosy_boa/Blush/carpet_python/Atlas/octopus/Cup/cuttlefish/Sepia/nautilus/Chamber/moon_jelly/Pulse/sea_star/Ochre/hermit_crab/Tenant/horseshoe_crab/Ledger/seahorse/Anchor/manta/Kite/moray/Door/sheet-moss/Felt/maidenhair/Vein/ginkgo/Fan/oak/Mast/water-lily/Disk/moth-orchid/Moth/saguaro/Arm or *Dragon electrical (Relay/Fuse/Ground) clones. Avoids open/gold/lean/nod/still/unfurl/fan/drop/dichotomy/petiole/biloba/flutter/frond/rachis/fiddle/pinna/saucer/sori/stipe/tuft/bead/spore/cushion/thatch/rhizoid/seta/lobe/sway/root/dig/fossil/cork/barrel/vessel/pad/corolla/rhizome/calyx/sheen/peltate/hydropote/mount/store/drift/float/bloom/cup/siphon/soak/sprout/nectary/nest/den/nook/column/bole/press/swell/snap/count/cilia/teeth/fringe/latch/lure/margin/enzyme/digest/mucilage/tentacle/gland/rosette/peristome/cistern/brine/operculum/urn/pleat/boot name collisions. Bird ultra (Soot→Ember) + Miso→Arm done; skip Rui + birds. Next guest ultra is Well / pitcher. No cry inventing beyond house venus_flytrap.wav prefer. Never retouch Rui sprites. */
export const TRICK_KEY = "venus_flytrap";
export const TRICKS = ["clamp", "trichome", "stew", "unseal", "poise", "cage", "scape"] as const;
export const HAPPY = ["gnat", "peat", "crimson"] as const;
export type VenusFlytrapTrickKind = (typeof TRICKS)[number];
export type VenusFlytrapHappyKind = (typeof HAPPY)[number];
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

export type VenusFlytrapTrick = {
  kind: VenusFlytrapTrickKind;
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

export type VenusFlytrapHappy = {
  kind: VenusFlytrapHappyKind;
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

export const HAPPY_DUR: Record<VenusFlytrapHappyKind, number> = {
  gnat: 1.70,
  peat: 1.84,
  crimson: 1.76,
};

/** Poise hold — Snap parks carnivorous calm on the blotter. Not window-play COUNT. */
export const POISE_HOLD = 11.2;
export const RELEASE_S = 1.18;

export const DUR: Record<VenusFlytrapTrickKind, number> = {
  poise: POISE_HOLD + RELEASE_S,
  clamp: 2.48,
  trichome: 2.42,
  stew: 2.44,
  unseal: 2.56,
  cage: 2.40,
  scape: 2.38,
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

export function nextTrickWait(justFinished: boolean, rand?: number, kind?: VenusFlytrapTrickKind | string) {
  const roll = rand == null ? Math.random() : rand;
  if (kind === "poise") return 38 + roll * 24;
  if (kind === "cage" || kind === "scape" || kind === "unseal") return 12 + roll * 9;
  if (kind === "clamp" || kind === "trichome" || kind === "stew") return 11 + roll * 8;
  return justFinished ? 8 + roll * 8 : 4 + roll * 7;
}

export function pickTrick(rand?: number, musicOn?: boolean, lastKind?: VenusFlytrapTrickKind | string | null) {
  if (musicOn) return "poise" as const;
  const roll = rand == null ? Math.random() : rand;
  if (lastKind === "poise") {
    if (roll < 0.18) return "clamp" as const;
    if (roll < 0.34) return "trichome" as const;
    if (roll < 0.5) return "stew" as const;
    if (roll < 0.66) return "unseal" as const;
    if (roll < 0.83) return "cage" as const;
    return "scape" as const;
  }
  if (lastKind === "clamp") {
    if (roll < 0.2) return "poise" as const;
    if (roll < 0.36) return "trichome" as const;
    if (roll < 0.52) return "stew" as const;
    if (roll < 0.68) return "unseal" as const;
    if (roll < 0.84) return "cage" as const;
    return "scape" as const;
  }
  if (lastKind === "stew") {
    if (roll < 0.18) return "poise" as const;
    if (roll < 0.34) return "clamp" as const;
    if (roll < 0.5) return "trichome" as const;
    if (roll < 0.66) return "unseal" as const;
    if (roll < 0.83) return "cage" as const;
    return "scape" as const;
  }
  if (lastKind === "cage" || lastKind === "scape") {
    if (roll < 0.16) return "poise" as const;
    if (roll < 0.32) return "clamp" as const;
    if (roll < 0.48) return "trichome" as const;
    if (roll < 0.64) return "stew" as const;
    if (roll < 0.8) return "unseal" as const;
    return lastKind === "cage" ? ("scape" as const) : ("cage" as const);
  }
  if (roll < 0.14) return "poise" as const;
  if (roll < 0.28) return "clamp" as const;
  if (roll < 0.42) return "trichome" as const;
  if (roll < 0.56) return "stew" as const;
  if (roll < 0.7) return "unseal" as const;
  if (roll < 0.85) return "cage" as const;
  return "scape" as const;
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
  return key === TRICK_KEY || key === "snap";
}

export function startThankYou(
  key: string | undefined | null,
  lastKind: VenusFlytrapHappyKind | string | null | undefined,
  x: number,
  facing: 1 | -1,
  flags?: TrickFlags,
) {
  if (!wantsThankYou(key)) return null;
  if (!happyCanStart(flags || { cmd: "idle" })) return null;
  const pick = pickHappy(lastKind as VenusFlytrapHappyKind | null | undefined);
  return { happy: beginHappy(pick, x, facing), kind: pick };
}

export function pickHappy(lastKind?: VenusFlytrapHappyKind | null, rand?: number) {
  const pool = HAPPY.filter((k) => k !== lastKind);
  const list = pool.length ? pool : [...HAPPY];
  const roll = rand == null ? Math.random() : rand;
  return list[Math.floor(roll * list.length)] || list[0];
}

export function beginHappy(kind: VenusFlytrapHappyKind | string, x: number, facing: 1 | -1): VenusFlytrapHappy {
  const name = (HAPPY as readonly string[]).indexOf(kind) >= 0 ? (kind as VenusFlytrapHappyKind) : "gnat";
  return {
    kind: name,
    happy: true,
    phase: "go",
    t: 0,
    x: x,
    lift: 0,
    rot: 0,
    anim: name === "gnat" ? "play" : name === "peat" ? "sit" : "talk",
    facing: facing == null ? 1 : facing,
    fromX: x,
  };
}

export function gnatPose(t: number) {
  const u = Math.max(0, Math.min(1, t / HAPPY_DUR.gnat));
  if (u < 0.18) {
    const s = u / 0.18;
    return { lift: s * 2.8, rot: s * 12, dx: 0, anim: "play" as TrickAnim };
  }
  if (u < 0.62) {
    const buzz = Math.sin(t * 9.2);
    return {
      lift: 2.8 + Math.abs(buzz) * 1.4,
      rot: 12 + buzz * 10,
      dx: buzz * 0.8,
      anim: "play" as TrickAnim,
    };
  }
  const s = (u - 0.62) / 0.38;
  return { lift: 2.0 * (1 - s), rot: 6 * (1 - s), dx: 0, anim: "idle" as TrickAnim };
}

export function peatPose(t: number) {
  const u = Math.max(0, Math.min(1, t / HAPPY_DUR.peat));
  if (u < 0.24) {
    const s = u / 0.24;
    return { lift: s * 2.4, rot: s * -8, dx: 0, anim: "sit" as TrickAnim };
  }
  if (u < 0.78) {
    const bog = Math.sin(t * 0.72);
    return {
      lift: 2.4 + Math.abs(bog) * 1.1,
      rot: -8 + bog * 6,
      dx: bog * 0.7,
      anim: "sit" as TrickAnim,
    };
  }
  const s = (u - 0.78) / 0.22;
  return { lift: 1.6 * (1 - s), rot: -4 * (1 - s), dx: 0, anim: "sit" as TrickAnim };
}

export function crimsonPose(t: number) {
  return {
    lift: 2.2 + Math.abs(Math.sin(t * 0.9)) * 1.1,
    rot: Math.sin(t * 1.05) * 9,
    dx: Math.sin(t * 0.55) * 0.85,
    anim: "talk" as TrickAnim,
  };
}

export function stepHappy(happy: VenusFlytrapHappy, dt: number, flags: TrickFlags): VenusFlytrapHappy {
  if (!happy || happy.phase === "done") return happy;
  if (happyShouldAbort(flags)) {
    return { ...happy, phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true };
  }
  const next: VenusFlytrapHappy = { ...happy, t: happy.t + Math.max(0, dt) };
  const hold = HAPPY_DUR[next.kind];
  if (next.kind === "gnat") {
    const pose = gnatPose(next.t);
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "peat") {
    const pose = peatPose(next.t);
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else {
    const pose = crimsonPose(next.t);
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

export function beginTrick(kind: VenusFlytrapTrickKind, x: number, facing: 1 | -1): VenusFlytrapTrick {
  const anim: TrickAnim =
    kind === "poise"
      ? "sit"
      : kind === "clamp"
        ? "play"
        : kind === "trichome"
          ? "sit"
          : kind === "stew"
            ? "sit"
            : kind === "unseal"
              ? "talk"
              : kind === "cage"
                ? "play"
                : kind === "scape"
                  ? "talk"
                  : "sit";
  return {
    kind: kind,
    phase: kind === "poise" ? "hold" : "go",
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

export function poisePose(t: number) {
  const breath = Math.sin(t * 0.2) + 0.025 * Math.sin(t * 1.1);
  return {
    lift: 2.4 + Math.abs(Math.sin(t * 0.31)) * 1.2,
    rot: 4 + breath * 3.2,
  };
}

export function releasePose(t: number) {
  const u = Math.max(0, Math.min(1, t / RELEASE_S));
  return { lift: 2.4 * (1 - Math.sin(u * Math.PI * 0.5)), rot: 4 * (1 - u) };
}

export function clampPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.clamp));
  if (u < 0.14) {
    const s = smoothstep(u / 0.14);
    return { x: fromX, lift: s * 3.2, rot: s * 8 * facing, anim: "play" as TrickAnim };
  }
  if (u < 0.38) {
    const s = smoothstep((u - 0.14) / 0.24);
    return {
      x: fromX + facing * s * 1.2,
      lift: 3.2 - s * 1.4,
      rot: facing * (8 - s * 18),
      anim: "play" as TrickAnim,
    };
  }
  if (u < 0.72) {
    const s = (u - 0.38) / 0.34;
    const hold = Math.sin(s * Math.PI * 1.8);
    return {
      x: fromX + facing * (1.2 + hold * 0.35),
      lift: 1.6 + Math.abs(hold) * 0.9,
      rot: facing * (-10 + hold * 3),
      anim: "play" as TrickAnim,
    };
  }
  const s = smoothstep((u - 0.72) / 0.28);
  return {
    x: fromX,
    lift: 1.6 * (1 - s),
    rot: facing * (-6 * (1 - s)),
    anim: "sit" as TrickAnim,
  };
}

export function trichomePose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.trichome));
  if (u < 0.16) {
    const s = smoothstep(u / 0.16);
    return { x: fromX, lift: s * 2.6, rot: s * 6 * facing, anim: "sit" as TrickAnim };
  }
  if (u < 0.78) {
    const tick = Math.sin(t * 14.5) + 0.35 * Math.sin(t * 23);
    return {
      x: fromX + facing * tick * 0.55,
      lift: 2.6 + Math.abs(tick) * 1.2,
      rot: facing * (6 + tick * 8),
      anim: "sit" as TrickAnim,
    };
  }
  const s = smoothstep((u - 0.78) / 0.22);
  return {
    x: fromX,
    lift: 2.6 * (1 - s),
    rot: facing * (3 * (1 - s)),
    anim: "sit" as TrickAnim,
  };
}

export function stewPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.stew));
  if (u < 0.22) {
    const s = smoothstep(u / 0.22);
    return { x: fromX, lift: s * 2.2, rot: s * -10 * facing, anim: "sit" as TrickAnim };
  }
  if (u < 0.7) {
    const s = (u - 0.22) / 0.48;
    const hush = Math.sin(s * Math.PI * 1.4);
    return {
      x: fromX - facing * 1.4 * s,
      lift: 2.2 + hush * 0.8,
      rot: facing * (-10 - s * 6 + hush * 2),
      anim: "sit" as TrickAnim,
    };
  }
  const s = smoothstep((u - 0.7) / 0.3);
  return {
    x: fromX - facing * 1.4 * (1 - s),
    lift: 2.2 * (1 - s),
    rot: facing * (-8 * (1 - s)),
    anim: "sit" as TrickAnim,
  };
}

export function unsealPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.unseal));
  if (u < 0.2) {
    const s = smoothstep(u / 0.2);
    return { x: fromX, lift: s * 2.4, rot: s * -8 * facing, anim: "talk" as TrickAnim };
  }
  if (u < 0.55) {
    const s = smoothstep((u - 0.2) / 0.35);
    return {
      x: fromX + facing * s * 1.6,
      lift: 2.4 + s * 2.0,
      rot: facing * (-8 + s * 18),
      anim: "talk" as TrickAnim,
    };
  }
  if (u < 0.84) {
    const s = (u - 0.55) / 0.29;
    const open = Math.sin(s * Math.PI * 1.5);
    return {
      x: fromX + facing * (1.6 + open * 0.5),
      lift: 4.2 + Math.abs(open) * 0.8,
      rot: facing * (10 + open * 4),
      anim: "talk" as TrickAnim,
    };
  }
  const s = smoothstep((u - 0.84) / 0.16);
  return {
    x: fromX,
    lift: 4.2 * (1 - s),
    rot: facing * (6 * (1 - s)),
    anim: "sit" as TrickAnim,
  };
}

export function cagePose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.cage));
  if (u < 0.16) {
    const s = smoothstep(u / 0.16);
    return { x: fromX, lift: s * 2.8, rot: s * 10 * facing, anim: "play" as TrickAnim };
  }
  if (u < 0.52) {
    const s = (u - 0.16) / 0.36;
    const mesh = Math.sin(s * Math.PI * 2.4);
    return {
      x: fromX + facing * mesh * 1.1,
      lift: 2.8 + Math.abs(mesh) * 1.5,
      rot: facing * (10 + mesh * 12),
      anim: "play" as TrickAnim,
    };
  }
  if (u < 0.82) {
    const s = (u - 0.52) / 0.3;
    const lock = Math.sin(s * Math.PI * 1.7);
    return {
      x: fromX + facing * (0.8 + lock * 0.4),
      lift: 3.4 - s * 0.5 + Math.abs(lock) * 0.7,
      rot: facing * (14 - s * 4 + lock * 3),
      anim: "play" as TrickAnim,
    };
  }
  const s = smoothstep((u - 0.82) / 0.18);
  return {
    x: fromX,
    lift: 2.6 * (1 - s),
    rot: facing * (6 * (1 - s)),
    anim: "sit" as TrickAnim,
  };
}

export function scapePose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.scape));
  if (u < 0.18) {
    const s = smoothstep(u / 0.18);
    return { x: fromX, lift: s * 2.6, rot: s * -6 * facing, anim: "talk" as TrickAnim };
  }
  if (u < 0.55) {
    const s = smoothstep((u - 0.18) / 0.37);
    return {
      x: fromX - facing * s * 0.8,
      lift: 2.6 + s * 2.4,
      rot: facing * (-6 + s * 4),
      anim: "talk" as TrickAnim,
    };
  }
  if (u < 0.84) {
    const s = (u - 0.55) / 0.29;
    const bloom = Math.sin(s * Math.PI * 1.6);
    return {
      x: fromX - facing * (0.8 + bloom * 0.3),
      lift: 5.0 + Math.abs(bloom) * 0.7,
      rot: facing * (-2 + bloom * 5),
      anim: "talk" as TrickAnim,
    };
  }
  const s = smoothstep((u - 0.84) / 0.16);
  return {
    x: fromX,
    lift: 5.0 * (1 - s),
    rot: facing * (-2 * (1 - s)),
    anim: "sit" as TrickAnim,
  };
}

export function stepTrick(trick: VenusFlytrapTrick, dt: number, flags: TrickFlags): VenusFlytrapTrick {
  if (!trick || trick.phase === "done") return trick;
  if (
    shouldAbort(flags) &&
    trick.kind !== "clamp" &&
    trick.kind !== "trichome" &&
    trick.kind !== "stew" &&
    trick.kind !== "unseal" &&
    trick.kind !== "cage" &&
    trick.kind !== "scape"
  ) {
    return { ...trick, phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true };
  }
  const next: VenusFlytrapTrick = { ...trick, t: trick.t + Math.max(0, dt) };
  if (next.kind === "poise") {
    if (next.t < POISE_HOLD) {
      const pose = poisePose(next.t);
      next.phase = "hold";
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = "sit";
      return next;
    }
    if (next.t < POISE_HOLD + RELEASE_S) {
      const pose = releasePose(next.t - POISE_HOLD);
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
  const fromX = trick.fromX != null ? trick.fromX : trick.x;
  if (next.kind === "clamp") {
    const pose = clampPose(next.t, fromX, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "trichome") {
    const pose = trichomePose(next.t, fromX, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "stew") {
    const pose = stewPose(next.t, fromX, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "unseal") {
    const pose = unsealPose(next.t, fromX, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "cage") {
    const pose = cagePose(next.t, fromX, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else {
    const pose = scapePose(next.t, fromX, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  }
  if (u >= 1) return { ...next, phase: "done", lift: 0, rot: 0, anim: "idle" };
  return next;
}
