/** Dew ground tricks while idle — ultra-polish pass. House sundew — mucilage / tentacle / digest / gland / rosette / lamina / circinate personality (mucilage glitter of sticky droplets on the blotter — never named glitter as happy-only / dew (Disk owns dew) / nectar (Disk owns nectar) / bead (Felt owns bead) / drop (Fan owns drop) / sheen (Disk owns sheen) / flare (Coin owns flare) / glue (special) / sticky as vague adjective-only, tentacle curl reach under the lamp — never named curl (Burr owns curl / ethogram-old / Dew window CURL) / uncurl (window leave) / trichome (Snap owns trichome) / bristle (Burr owns bristle) / lobe (Kite owns lobe) / clamp (Snap owns clamp) / coil (Anchor owns coil), slow digest hush after the catch — never named hush as shared verb-only / stew (Snap owns stew) / brine (Well owns brine) / enzyme as vague / soak (Ink owns soak) / nectar (Disk) / peat (Snap happy), gland tip nod of a mucilage head — never named nod (ethogram-old / Sol owns nod) / tip (Well window) / hair / spike (Moth owns spike) / epiphyte (Moth owns epiphyte) / areole (Arm owns areole), carnivorous rosette desk life as a Drosera peat-saucer plant, lamina round leaf-blade present of Drosera rotundifolia (species-true round-leaved sundew lamina — never named pad (Disk owns pad) / peltate (Disk owns peltate) / saucer (Vein owns saucer) / disc (Disc roster) / blade as vague / orb / disk), circinate vernation unfurl of a new leaf from the tip (species-true Drosera circinate emergence — never named fiddle (Vein owns fiddle) / unfurl (Vein) / curl (Burr / window CURL) / coil (Anchor) / scroll / spiral (Chamber/Nautilus)); not Snap clamp/trichome/stew/unseal/poise/cage/scape, Well peristome/cistern/brine/operculum/urn/ala/baffle, Arm rib/branch/nocturne/areole/sentinel/pleat/boot, Moth labellum/velamen/column/spike/epiphyte/keiki/pollinia, Disk pad/corolla/rhizome/calyx/sheen/peltate/hydropote, Mast acorn/sinus/gall/taproot/bole/catkin/tyloses, Fan biloba/notch/flutter/drop/amber/dichotomy/petiole, Vein frond/rachis/fiddle/pinna/saucer/sori/stipe, Felt tuft/bead/spore/cushion/thatch/rhizoid/seta, Door hinge/pharynx/knot/lurk/jamb, Kite wing/lobe/gyre/vault/span, Anchor coil/buoy/siphon/swivel/pouch, Ledger carapace/bookgill/telson/furrow/fossil, Tenant swap/antenna/scuttle/withdraw/vacancy, Cling podia/righting/crawl/evert/penta, Pulse bell/oral/lucent/trail/medusa, Coin drift/gulp/flare/glint/dart, Ink soak/tuck, Clip nest/seed, Bloom gill, parrot fan/flash, Blush mesa/arroyo, Sol sun/dewlap/nod/press/flick, Burr curl, or snake guests Sash seam/moss/lap copies). Lamina is the iconic round leaf blade (not Disk pad/peltate). Circinate is the iconic tip-first leaf emergence (not Vein fiddle). Window-play CURL unchanged — never names curl as a trick. Ethogram keeps rosette sit_hold; adds mucilage/tentacle/digest/gland/lamina/circinate softs + freeze (replaces thin curl/lean/nod). Amplitudes raised toward Rui richness; denser waits/weights; prefersHouseCry via sundew.wav. Thank-yous glitter / ruby / syrup. Feed-happy after eat. Sleep, hide, leave, rest, card still win. Same map as desktop `sundew-tricks.js`. True house-sundew desk life — not Rui/cat/dog/rabbit/hamster/guinea_pig/turtle/goldfish/budgie/fox/penguin/parrot/ferret/hedgehog/chinchilla/axolotl/toucan/iguana/Sol/dragon/Vesper/phoenix/Ember/ball_python/Nori/corn_snake/Saffron/kingsnake/Bandit/green_tree_python/Jade/hognose/Bluff/garter/Sash/boa/Lula/milk_snake/Coral/rosy_boa/Blush/carpet_python/Atlas/octopus/Cup/cuttlefish/Sepia/nautilus/Chamber/moon_jelly/Pulse/sea_star/Ochre/hermit_crab/Tenant/horseshoe_crab/Ledger/seahorse/Anchor/manta/Kite/moray/Door/sheet-moss/Felt/maidenhair/Vein/ginkgo/Fan/oak/Mast/water-lily/Disk/moth-orchid/Moth/saguaro/Arm/venus-flytrap/Snap/pitcher/Well or *Dragon electrical (Relay/Fuse/Ground) clones. Avoids open/gold/lean/nod/still/unfurl/fan/drop/dichotomy/petiole/biloba/flutter/frond/rachis/fiddle/pinna/saucer/sori/stipe/tuft/bead/spore/cushion/thatch/rhizoid/seta/lobe/sway/root/dig/fossil/cork/barrel/vessel/pad/corolla/rhizome/calyx/sheen/peltate/hydropote/mount/store/drift/float/bloom/cup/siphon/soak/sprout/nectary/nest/den/nook/column/bole/press/swell/snap/count/cilia/teeth/fringe/latch/lure/margin/enzyme/clamp/trichome/stew/unseal/poise/cage/scape/pleat/boot/keiki/pollinia/wing/hood/bristle/peristome/cistern/brine/operculum/urn/ala/baffle/curl/glue/fiddle name collisions. Bird ultra (Soot→Ember) + Miso→Well done; skip Rui + birds. Next guest ultra is Ghost / luna. No cry inventing beyond house sundew.wav prefer. Never retouch Rui sprites. */
export const TRICK_KEY = "sundew";
export const TRICKS = ["mucilage", "tentacle", "digest", "gland", "rosette", "lamina", "circinate"] as const;
export const HAPPY = ["glitter", "ruby", "syrup"] as const;
export type SundewTrickKind = (typeof TRICKS)[number];
export type SundewHappyKind = (typeof HAPPY)[number];
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

export type SundewTrick = {
  kind: SundewTrickKind;
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

export type SundewHappy = {
  kind: SundewHappyKind;
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

export const HAPPY_DUR: Record<SundewHappyKind, number> = {
  glitter: 1.70,
  ruby: 1.84,
  syrup: 1.76,
};

/** Rosette hold — Dew parks carnivorous calm on the blotter. Not window-play CURL. */
export const ROSETTE_HOLD = 11.2;
export const RELEASE_S = 1.18;

export const DUR: Record<SundewTrickKind, number> = {
  rosette: ROSETTE_HOLD + RELEASE_S,
  mucilage: 2.48,
  tentacle: 2.42,
  digest: 2.44,
  gland: 2.56,
  lamina: 2.40,
  circinate: 2.38,
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

export function nextTrickWait(justFinished: boolean, rand?: number, kind?: SundewTrickKind | string) {
  const roll = rand == null ? Math.random() : rand;
  if (kind === "rosette") return 38 + roll * 24;
  if (kind === "lamina" || kind === "circinate" || kind === "gland") return 12 + roll * 9;
  if (kind === "mucilage" || kind === "tentacle" || kind === "digest") return 11 + roll * 8;
  return justFinished ? 8 + roll * 8 : 4 + roll * 7;
}

export function pickTrick(rand?: number, musicOn?: boolean, lastKind?: SundewTrickKind | string | null) {
  if (musicOn) return "rosette" as const;
  const roll = rand == null ? Math.random() : rand;
  if (lastKind === "rosette") {
    if (roll < 0.18) return "mucilage" as const;
    if (roll < 0.34) return "tentacle" as const;
    if (roll < 0.5) return "digest" as const;
    if (roll < 0.66) return "gland" as const;
    if (roll < 0.83) return "lamina" as const;
    return "circinate" as const;
  }
  if (lastKind === "mucilage") {
    if (roll < 0.2) return "rosette" as const;
    if (roll < 0.36) return "tentacle" as const;
    if (roll < 0.52) return "digest" as const;
    if (roll < 0.68) return "gland" as const;
    if (roll < 0.84) return "lamina" as const;
    return "circinate" as const;
  }
  if (lastKind === "digest") {
    if (roll < 0.18) return "rosette" as const;
    if (roll < 0.34) return "mucilage" as const;
    if (roll < 0.5) return "tentacle" as const;
    if (roll < 0.66) return "gland" as const;
    if (roll < 0.83) return "lamina" as const;
    return "circinate" as const;
  }
  if (lastKind === "lamina" || lastKind === "circinate") {
    if (roll < 0.16) return "rosette" as const;
    if (roll < 0.32) return "mucilage" as const;
    if (roll < 0.48) return "tentacle" as const;
    if (roll < 0.64) return "digest" as const;
    if (roll < 0.8) return "gland" as const;
    return lastKind === "lamina" ? ("circinate" as const) : ("lamina" as const);
  }
  if (roll < 0.14) return "rosette" as const;
  if (roll < 0.28) return "mucilage" as const;
  if (roll < 0.42) return "tentacle" as const;
  if (roll < 0.56) return "digest" as const;
  if (roll < 0.7) return "gland" as const;
  if (roll < 0.85) return "lamina" as const;
  return "circinate" as const;
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
  return key === TRICK_KEY || key === "dew";
}

export function startThankYou(
  key: string | undefined | null,
  lastKind: SundewHappyKind | string | null | undefined,
  x: number,
  facing: 1 | -1,
  flags?: TrickFlags,
) {
  if (!wantsThankYou(key)) return null;
  if (!happyCanStart(flags || { cmd: "idle" })) return null;
  const pick = pickHappy(lastKind as SundewHappyKind | null | undefined);
  return { happy: beginHappy(pick, x, facing), kind: pick };
}

export function pickHappy(lastKind?: SundewHappyKind | null, rand?: number) {
  const pool = HAPPY.filter((k) => k !== lastKind);
  const list = pool.length ? pool : [...HAPPY];
  const roll = rand == null ? Math.random() : rand;
  return list[Math.floor(roll * list.length)] || list[0];
}

export function beginHappy(kind: SundewHappyKind | string, x: number, facing: 1 | -1): SundewHappy {
  const name = (HAPPY as readonly string[]).indexOf(kind) >= 0 ? (kind as SundewHappyKind) : "glitter";
  return {
    kind: name,
    happy: true,
    phase: "go",
    t: 0,
    x: x,
    lift: 0,
    rot: 0,
    anim: name === "glitter" ? "play" : name === "ruby" ? "sit" : "talk",
    facing: facing == null ? 1 : facing,
    fromX: x,
  };
}

export function glitterPose(t: number) {
  const u = Math.max(0, Math.min(1, t / HAPPY_DUR.glitter));
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

export function rubyPose(t: number) {
  const u = Math.max(0, Math.min(1, t / HAPPY_DUR.ruby));
  if (u < 0.24) {
    const s = u / 0.24;
    return { lift: s * 2.4, rot: s * -8, dx: 0, anim: "sit" as TrickAnim };
  }
  if (u < 0.78) {
    const drop = Math.sin(t * 0.72);
    return {
      lift: 2.4 + Math.abs(drop) * 1.1,
      rot: -8 + drop * 6,
      dx: drop * 0.7,
      anim: "sit" as TrickAnim,
    };
  }
  const s = (u - 0.78) / 0.22;
  return { lift: 1.6 * (1 - s), rot: -4 * (1 - s), dx: 0, anim: "sit" as TrickAnim };
}

export function syrupPose(t: number) {
  return {
    lift: 2.2 + Math.abs(Math.sin(t * 0.9)) * 1.1,
    rot: Math.sin(t * 1.05) * 9,
    dx: Math.sin(t * 0.55) * 0.85,
    anim: "talk" as TrickAnim,
  };
}

export function stepHappy(happy: SundewHappy, dt: number, flags: TrickFlags): SundewHappy {
  if (!happy || happy.phase === "done") return happy;
  if (happyShouldAbort(flags)) {
    return { ...happy, phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true };
  }
  const next: SundewHappy = { ...happy, t: happy.t + Math.max(0, dt) };
  const hold = HAPPY_DUR[next.kind];
  if (next.kind === "glitter") {
    const pose = glitterPose(next.t);
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "ruby") {
    const pose = rubyPose(next.t);
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else {
    const pose = syrupPose(next.t);
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

export function beginTrick(kind: SundewTrickKind, x: number, facing: 1 | -1): SundewTrick {
  const anim: TrickAnim =
    kind === "rosette"
      ? "sit"
      : kind === "mucilage"
        ? "play"
        : kind === "tentacle"
          ? "talk"
          : kind === "digest"
            ? "sit"
            : kind === "gland"
              ? "talk"
              : kind === "lamina"
                ? "play"
                : kind === "circinate"
                  ? "talk"
                  : "sit";
  return {
    kind: kind,
    phase: kind === "rosette" ? "hold" : "go",
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

export function rosettePose(t: number) {
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

export function mucilagePose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.mucilage));
  if (u < 0.14) {
    const s = smoothstep(u / 0.14);
    return { x: fromX, lift: s * 3.2, rot: s * 8 * facing, anim: "play" as TrickAnim };
  }
  if (u < 0.78) {
    const slick = Math.sin(t * 11.2) + 0.4 * Math.sin(t * 17.5);
    return {
      x: fromX + facing * slick * 0.55,
      lift: 3.2 + Math.abs(slick) * 1.2,
      rot: facing * (8 + slick * 8),
      anim: "play" as TrickAnim,
    };
  }
  const s = smoothstep((u - 0.78) / 0.22);
  return {
    x: fromX,
    lift: 3.2 * (1 - s),
    rot: facing * (4 * (1 - s)),
    anim: "sit" as TrickAnim,
  };
}

export function tentaclePose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.tentacle));
  if (u < 0.2) {
    const s = smoothstep(u / 0.2);
    return { x: fromX, lift: s * 2.6, rot: s * -8 * facing, anim: "sit" as TrickAnim };
  }
  if (u < 0.75) {
    const s = (u - 0.2) / 0.55;
    const fill = Math.sin(s * Math.PI * 1.3);
    return {
      x: fromX - facing * 1.2 * s,
      lift: 2.6 + fill * 0.9,
      rot: facing * (-8 - s * 4 + fill * 2),
      anim: "sit" as TrickAnim,
    };
  }
  const s = smoothstep((u - 0.75) / 0.25);
  return {
    x: fromX - facing * 1.2 * (1 - s),
    lift: 2.6 * (1 - s),
    rot: facing * (-8 * (1 - s)),
    anim: "sit" as TrickAnim,
  };
}

export function digestPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.digest));
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

export function glandPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.gland));
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
    const flap = Math.sin(s * Math.PI * 1.5);
    return {
      x: fromX + facing * (1.6 + flap * 0.5),
      lift: 4.2 + Math.abs(flap) * 0.8,
      rot: facing * (10 + flap * 4),
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

export function laminaPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.lamina));
  if (u < 0.16) {
    const s = smoothstep(u / 0.16);
    return { x: fromX, lift: s * 2.8, rot: s * 10 * facing, anim: "play" as TrickAnim };
  }
  if (u < 0.52) {
    const s = (u - 0.16) / 0.36;
    const wing = Math.sin(s * Math.PI * 2.4);
    return {
      x: fromX + facing * wing * 1.1,
      lift: 2.8 + Math.abs(wing) * 1.5,
      rot: facing * (10 + wing * 12),
      anim: "play" as TrickAnim,
    };
  }
  if (u < 0.82) {
    const s = (u - 0.52) / 0.3;
    const sway = Math.sin(s * Math.PI * 1.7);
    return {
      x: fromX + facing * (0.8 + sway * 0.4),
      lift: 3.4 - s * 0.5 + Math.abs(sway) * 0.7,
      rot: facing * (14 - s * 4 + sway * 3),
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

export function circinatePose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.circinate));
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
    const hush = Math.sin(s * Math.PI * 1.6);
    return {
      x: fromX - facing * (0.8 + hush * 0.3),
      lift: 5.0 + Math.abs(hush) * 0.7,
      rot: facing * (-2 + hush * 5),
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

export function stepTrick(trick: SundewTrick, dt: number, flags: TrickFlags): SundewTrick {
  if (!trick || trick.phase === "done") return trick;
  if (
    shouldAbort(flags) &&
    trick.kind !== "mucilage" &&
    trick.kind !== "tentacle" &&
    trick.kind !== "digest" &&
    trick.kind !== "gland" &&
    trick.kind !== "lamina" &&
    trick.kind !== "circinate"
  ) {
    return { ...trick, phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true };
  }
  const next: SundewTrick = { ...trick, t: trick.t + Math.max(0, dt) };
  if (next.kind === "rosette") {
    if (next.t < ROSETTE_HOLD) {
      const pose = rosettePose(next.t);
      next.phase = "hold";
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = "sit";
      return next;
    }
    if (next.t < ROSETTE_HOLD + RELEASE_S) {
      const pose = releasePose(next.t - ROSETTE_HOLD);
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
  if (next.kind === "mucilage") {
    const pose = mucilagePose(next.t, fromX, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "tentacle") {
    const pose = tentaclePose(next.t, fromX, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "digest") {
    const pose = digestPose(next.t, fromX, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "gland") {
    const pose = glandPose(next.t, fromX, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "lamina") {
    const pose = laminaPose(next.t, fromX, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else {
    const pose = circinatePose(next.t, fromX, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  }
  if (u >= 1) return { ...next, phase: "done", lift: 0, rot: 0, anim: "idle" };
  return next;
}
