/** Thrum ground tricks while idle — ultra-polish pass. House common eastern bumblebee — sonicate / scopa / fossor / lumber / bombus / thoraxload / corbicularub personality (sonicate buzz-pollination vibration on a blotter bloom — never named buzz (Relay + Snap) / forage (window FORAGE) / tymbal (Brood) / song (field cricket window SONG) / burst (ethogram) / flash (Quill) / semaphore (Spark) / lantern (Spark) / talk, scopa fuzzy-thorax pollen load — never named corbicula (Comb) / pollen (Moth happy) / nest (Clip) / cheek (Clip) / pocket (Clip) / fur / fluff / preen (Echo), fossor moss-cup nest burrow — never named dig (Thimble) / hive (Comb) / nest (Clip) / bank (window DIG) / heave (Ground) / lug (Ground) / earth (Ground) / crawl (Cling) / moss (Sash), lumber heavy loaded hover — never named hover (Sepia) / thrum (Vesper happy) / drone (Hum window) / heft (Lula) / figure (Comb) / wing (Kite) / flutter (Fan) / sip (hummingbird window), bombus desk life as a Bombus impatiens moss-cup forager with eastern cousins in the thank-yous, thoraxload pollen packed deep into the fuzzy thorax (species-true Bombus thoracic pollen load — never named corbicula (Comb) / pollen (Moth happy) / nest / cheek / pocket / fluff / fur), corbicularub hind-leg basket rub packing pollen into the corbicula without naming Comb's corbicula trick (species-true Bombus pollen-basket rub — never named corbicula as Comb trick / figure / hex / hive / pollen / nest / cheek); not Comb figure/corbicula/hex/proboscis/hive/ocelli/nasonov, Milk asclepias/oyamel/warning/chrysalis/danaus/cremaster/tarsus, Brood / Fold / Seven / Column / Twig / Dart / Spark / Ghost / *Dragon copies). Thoraxload is the iconic fuzzy-thorax pollen pack (not Comb corbicula). Corbicularub is the iconic hind-leg basket rub (not Comb corbicula trick name). Window-play FORAGE unchanged — never names forage as a trick. Ethogram keeps bombus sit_hold; adds sonicate/scopa/fossor/lumber/thoraxload/corbicularub softs + freeze (replaces thin thrum/hover/still — Vesper owns trick-name thrum). Amplitudes raised toward Rui richness; denser waits/weights; prefersHouseCry via bumblebee.wav. Thank-yous impatiens / bimaculatus / bombini. Feed-happy after eat. Sleep, hide, leave, rest, card still win. Same map as desktop `bumblebee-tricks.js`. True house-bumblebee desk life — not Rui/cat/dog/rabbit/hamster/guinea_pig/turtle/goldfish/budgie/fox/penguin/parrot/ferret/hedgehog/chinchilla/axolotl/toucan/iguana/Sol/dragon/Vesper/phoenix/Ember/ball_python/Nori/corn_snake/Saffron/kingsnake/Bandit/green_tree_python/Jade/hognose/Bluff/garter/Sash/boa/Lula/milk_snake/Coral/rosy_boa/Blush/carpet_python/Atlas/octopus/Cup/cuttlefish/Sepia/nautilus/Chamber/moon_jelly/Pulse/sea_star/Ochre/hermit_crab/Tenant/horseshoe_crab/Ledger/seahorse/Anchor/manta/Kite/moray/Door/sheet-moss/Felt/maidenhair/Vein/ginkgo/Fan/oak/Mast/water-lily/Disk/moth-orchid/Moth/saguaro/Arm/venus-flytrap/Snap/pitcher/Well/sundew/Dew/honeybee/Comb/monarch/Milk or *Dragon electrical (Relay/Fuse/Ground) clones. Avoids open/gold/lean/nod/still/unfurl/fan/drop/dichotomy/petiole/biloba/flutter/frond/rachis/fiddle/pinna/saucer/sori/stipe/tuft/bead/spore/cushion/thatch/rhizoid/seta/lobe/sway/root/dig/fossil/cork/barrel/vessel/pad/corolla/rhizome/calyx/sheen/peltate/hydropote/mount/store/drift/float/bloom/cup/siphon/soak/sprout/nectary/nest/den/nook/column/bole/press/swell/snap/count/cilia/teeth/fringe/latch/lure/margin/enzyme/clamp/trichome/stew/unseal/poise/cage/scape/pleat/boot/keiki/pollinia/wing/hood/bristle/peristome/cistern/brine/operculum/urn/ala/baffle/mucilage/tentacle/digest/gland/rosette/lamina/circinate/curl/glue/fiddle/waggle/dance/buzz/pollen/nectar/figure/corbicula/hex/proboscis/hive/ocelli/nasonov/asclepias/oyamel/warning/chrysalis/danaus/cremaster/tarsus/hover/thrum name collisions. Bird ultra (Soot→Ember) + Miso→Ghost done; skip Rui + birds. BOMBUS_HOLD=11.2 RELEASE_S=1.18 (house ultra norm). Next: Sheen / sweat_bee. Catalog 221. No cry inventing beyond house bumblebee.wav prefer. Never retouch Rui sprites. */
export const TRICK_KEY = "bumblebee";
export const TRICKS = ["sonicate", "scopa", "fossor", "lumber", "bombus", "thoraxload", "corbicularub"] as const;
export const HAPPY = ["impatiens", "bimaculatus", "bombini"] as const;
export type BumblebeeTrickKind = (typeof TRICKS)[number];
export type BumblebeeHappyKind = (typeof HAPPY)[number];
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

export type BumblebeeTrick = {
  kind: BumblebeeTrickKind;
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

export type BumblebeeHappy = {
  kind: BumblebeeHappyKind;
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

export const HAPPY_DUR: Record<BumblebeeHappyKind, number> = {
  impatiens: 1.70,
  bimaculatus: 1.84,
  bombini: 1.76,
};

/** Bombus hold — Thrum parks moss-cup calm on the blotter. Not window-play FORAGE. */
export const BOMBUS_HOLD = 11.2;
export const RELEASE_S = 1.18;

export const DUR: Record<BumblebeeTrickKind, number> = {
  bombus: BOMBUS_HOLD + RELEASE_S,
  sonicate: 2.48,
  scopa: 2.42,
  fossor: 2.40,
  lumber: 2.44,
  thoraxload: 2.38,
  corbicularub: 2.56,
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

export function nextTrickWait(justFinished: boolean, rand?: number, kind?: BumblebeeTrickKind | string) {
  const roll = rand == null ? Math.random() : rand;
  if (kind === "bombus") return 38 + roll * 24;
  if (kind === "thoraxload" || kind === "corbicularub" || kind === "lumber") return 12 + roll * 9;
  if (kind === "sonicate" || kind === "scopa" || kind === "fossor") return 11 + roll * 8;
  return justFinished ? 8 + roll * 8 : 4 + roll * 7;
}

export function pickTrick(rand?: number, musicOn?: boolean, lastKind?: BumblebeeTrickKind | string | null) {
  if (musicOn) return "bombus" as const;
  const roll = rand == null ? Math.random() : rand;
  if (lastKind === "bombus") {
    if (roll < 0.18) return "sonicate" as const;
    if (roll < 0.34) return "scopa" as const;
    if (roll < 0.5) return "fossor" as const;
    if (roll < 0.66) return "lumber" as const;
    if (roll < 0.83) return "thoraxload" as const;
    return "corbicularub" as const;
  }
  if (lastKind === "sonicate") {
    if (roll < 0.2) return "bombus" as const;
    if (roll < 0.36) return "scopa" as const;
    if (roll < 0.52) return "fossor" as const;
    if (roll < 0.68) return "lumber" as const;
    if (roll < 0.84) return "thoraxload" as const;
    return "corbicularub" as const;
  }
  if (lastKind === "fossor") {
    if (roll < 0.18) return "bombus" as const;
    if (roll < 0.34) return "sonicate" as const;
    if (roll < 0.5) return "scopa" as const;
    if (roll < 0.66) return "lumber" as const;
    if (roll < 0.83) return "thoraxload" as const;
    return "corbicularub" as const;
  }
  if (lastKind === "thoraxload" || lastKind === "corbicularub") {
    if (roll < 0.16) return "bombus" as const;
    if (roll < 0.32) return "sonicate" as const;
    if (roll < 0.48) return "scopa" as const;
    if (roll < 0.64) return "fossor" as const;
    if (roll < 0.8) return "lumber" as const;
    return lastKind === "thoraxload" ? ("corbicularub" as const) : ("thoraxload" as const);
  }
  if (roll < 0.14) return "bombus" as const;
  if (roll < 0.28) return "sonicate" as const;
  if (roll < 0.42) return "scopa" as const;
  if (roll < 0.56) return "fossor" as const;
  if (roll < 0.7) return "lumber" as const;
  if (roll < 0.85) return "thoraxload" as const;
  return "corbicularub" as const;
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
  return key === TRICK_KEY || key === "thrum";
}

export function startThankYou(
  key: string | undefined | null,
  lastKind: BumblebeeHappyKind | string | null | undefined,
  x: number,
  facing: 1 | -1,
  flags?: TrickFlags,
) {
  if (!wantsThankYou(key)) return null;
  if (!happyCanStart(flags || { cmd: "idle" })) return null;
  const pick = pickHappy(lastKind as BumblebeeHappyKind | null | undefined);
  return { happy: beginHappy(pick, x, facing), kind: pick };
}

export function pickHappy(lastKind?: BumblebeeHappyKind | null, rand?: number) {
  const pool = HAPPY.filter((k) => k !== lastKind);
  const list = pool.length ? pool : [...HAPPY];
  const roll = rand == null ? Math.random() : rand;
  return list[Math.floor(roll * list.length)] || list[0];
}

export function beginHappy(kind: BumblebeeHappyKind | string, x: number, facing: 1 | -1): BumblebeeHappy {
  const name = (HAPPY as readonly string[]).indexOf(kind) >= 0 ? (kind as BumblebeeHappyKind) : "impatiens";
  return {
    kind: name,
    happy: true,
    phase: "go",
    t: 0,
    x: x,
    lift: 0,
    rot: 0,
    anim: name === "impatiens" ? "talk" : name === "bimaculatus" ? "play" : "sit",
    facing: facing == null ? 1 : facing,
    fromX: x,
  };
}

export function impatiensPose(t: number) {
  const u = Math.max(0, Math.min(1, t / HAPPY_DUR.impatiens));
  if (u < 0.18) {
    const s = u / 0.18;
    return { lift: s * 2.8, rot: s * 12, dx: 0, anim: "talk" as TrickAnim };
  }
  if (u < 0.72) {
    const buzz = Math.sin(t * 18.2) + 0.3 * Math.sin(t * 36);
    return {
      lift: 2.8 + Math.abs(buzz) * 1.4,
      rot: 12 + buzz * 10,
      dx: buzz * 0.8,
      anim: "talk" as TrickAnim,
    };
  }
  const s = (u - 0.72) / 0.28;
  return { lift: 2.0 * (1 - s), rot: 6 * (1 - s), dx: 0, anim: "idle" as TrickAnim };
}

export function bimaculatusPose(t: number) {
  const u = Math.max(0, Math.min(1, t / HAPPY_DUR.bimaculatus));
  if (u < 0.18) {
    const s = u / 0.18;
    return { lift: s * 2.6, rot: s * -10, dx: s * 0.4, anim: "play" as TrickAnim };
  }
  if (u < 0.78) {
    const sway = Math.sin(t * 4.6) + 0.25 * Math.sin(t * 9.2);
    return {
      lift: 2.6 + Math.abs(sway) * 1.2,
      rot: -10 + sway * 9,
      dx: sway * 0.7,
      anim: "play" as TrickAnim,
    };
  }
  const s = (u - 0.78) / 0.22;
  return { lift: 1.6 * (1 - s), rot: -4 * (1 - s), dx: 0, anim: "sit" as TrickAnim };
}

export function bombiniPose(t: number) {
  return {
    lift: 2.2 + Math.abs(Math.sin(t * 0.42)) * 1.1,
    rot: Math.sin(t * 0.55) * 8,
    dx: Math.sin(t * 0.3) * 0.7,
    anim: "sit" as TrickAnim,
  };
}

export function stepHappy(happy: BumblebeeHappy, dt: number, flags: TrickFlags): BumblebeeHappy {
  if (!happy || happy.phase === "done") return happy;
  if (happyShouldAbort(flags)) {
    return { ...happy, phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true };
  }
  const next: BumblebeeHappy = { ...happy, t: happy.t + Math.max(0, dt) };
  const hold = HAPPY_DUR[next.kind];
  if (next.kind === "impatiens") {
    const pose = impatiensPose(next.t);
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "bimaculatus") {
    const pose = bimaculatusPose(next.t);
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else {
    const pose = bombiniPose(next.t);
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

export function beginTrick(kind: BumblebeeTrickKind, x: number, facing: 1 | -1): BumblebeeTrick {
  const anim: TrickAnim =
    kind === "bombus"
      ? "sit"
      : kind === "sonicate"
        ? "talk"
        : kind === "scopa"
          ? "talk"
          : kind === "fossor"
            ? "play"
            : kind === "lumber"
              ? "play"
              : kind === "thoraxload"
                ? "sit"
                : kind === "corbicularub"
                  ? "talk"
                  : "sit";
  return {
    kind: kind,
    phase: kind === "bombus" ? "hold" : "go",
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

export function bombusPose(t: number) {
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

export function sonicatePose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.sonicate));
  if (u < 0.14) {
    const s = smoothstep(u / 0.14);
    return { x: fromX, lift: s * 3.2, rot: s * 8 * facing, anim: "talk" as TrickAnim };
  }
  if (u < 0.78) {
    const buzz = Math.sin(t * 22.5) + 0.45 * Math.sin(t * 45) + 0.18 * Math.sin(t * 67);
    return {
      x: fromX + facing * buzz * 0.45,
      lift: 3.2 + Math.abs(buzz) * 1.2,
      rot: facing * (8 + buzz * 8),
      anim: "talk" as TrickAnim,
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

export function scopaPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.scopa));
  if (u < 0.2) {
    const s = smoothstep(u / 0.2);
    return { x: fromX, lift: s * 2.6, rot: s * -8 * facing, anim: "talk" as TrickAnim };
  }
  if (u < 0.75) {
    const s = (u - 0.2) / 0.55;
    const pack = Math.sin(s * Math.PI * 3.2);
    return {
      x: fromX + facing * pack * 0.9,
      lift: 2.6 + Math.abs(pack) * 1.1,
      rot: facing * (-8 + s * 6 + pack * 3),
      anim: "talk" as TrickAnim,
    };
  }
  const s = smoothstep((u - 0.75) / 0.25);
  return {
    x: fromX,
    lift: 2.6 * (1 - s),
    rot: facing * (-6 * (1 - s)),
    anim: "sit" as TrickAnim,
  };
}

export function fossorPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.fossor));
  if (u < 0.2) {
    const s = smoothstep(u / 0.2);
    return { x: fromX, lift: s * 1.8, rot: s * 6 * facing, anim: "sit" as TrickAnim };
  }
  if (u < 0.55) {
    const s = (u - 0.2) / 0.35;
    const dig = smoothstep(s);
    return {
      x: fromX + facing * dig * 1.4,
      lift: 1.8 - dig * 1.6,
      rot: facing * (6 + dig * 4),
      anim: "play" as TrickAnim,
    };
  }
  if (u < 0.82) {
    const s = (u - 0.55) / 0.27;
    const settle = Math.sin(s * Math.PI);
    return {
      x: fromX + facing * (1.4 + settle * 0.35),
      lift: 0.4 + settle * 0.9,
      rot: facing * (8 - settle * 2),
      anim: "play" as TrickAnim,
    };
  }
  const s = smoothstep((u - 0.82) / 0.18);
  return {
    x: fromX + facing * 1.2 * (1 - s * 0.4),
    lift: 0.8 * (1 - s),
    rot: facing * (4 * (1 - s)),
    anim: "sit" as TrickAnim,
  };
}

export function lumberPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.lumber));
  if (u < 0.14) {
    const s = smoothstep(u / 0.14);
    return { x: fromX, lift: s * 3.4, rot: s * -8 * facing, anim: "play" as TrickAnim };
  }
  if (u < 0.84) {
    const s = (u - 0.14) / 0.7;
    const heavy = Math.sin(s * Math.PI * 1.6);
    const bob = Math.sin(s * Math.PI * 3.2) * 0.35;
    return {
      x: fromX + facing * heavy * 1.5,
      lift: 3.4 + Math.abs(bob) * 1.1,
      rot: facing * (-8 + heavy * 10 + bob * 3),
      anim: "play" as TrickAnim,
    };
  }
  const s = smoothstep((u - 0.84) / 0.16);
  return {
    x: fromX,
    lift: 3.4 * (1 - s),
    rot: facing * (-4 * (1 - s)),
    anim: "sit" as TrickAnim,
  };
}

export function thoraxloadPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.thoraxload));
  if (u < 0.16) {
    const s = smoothstep(u / 0.16);
    return { x: fromX, lift: s * 3.0, rot: s * 9 * facing, anim: "sit" as TrickAnim };
  }
  if (u < 0.52) {
    const s = (u - 0.16) / 0.36;
    const load = Math.sin(s * Math.PI * 2.2);
    return {
      x: fromX + facing * load * 0.9,
      lift: 3.0 + Math.abs(load) * 1.4,
      rot: facing * (9 + load * 11),
      anim: "sit" as TrickAnim,
    };
  }
  if (u < 0.82) {
    const s = (u - 0.52) / 0.3;
    const pack = Math.sin(s * Math.PI * 1.6);
    return {
      x: fromX + facing * (0.7 + pack * 0.35),
      lift: 3.6 - s * 0.35 + Math.abs(pack) * 0.7,
      rot: facing * (14 - s * 3 + pack * 2.8),
      anim: "sit" as TrickAnim,
    };
  }
  {
    const s = (u - 0.82) / 0.18;
    return {
      x: fromX + facing * (0.7 * (1 - s)),
      lift: 3.6 * (1 - s),
      rot: facing * (11 * (1 - s)),
      anim: "idle" as TrickAnim,
    };
  }
}

export function corbicularubPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.corbicularub));
  if (u < 0.18) {
    const s = smoothstep(u / 0.18);
    return { x: fromX, lift: s * 2.5, rot: s * -8 * facing, anim: "talk" as TrickAnim };
  }
  if (u < 0.55) {
    const s = smoothstep((u - 0.18) / 0.37);
    return {
      x: fromX - facing * s * 0.55,
      lift: 2.5 + s * 2.6,
      rot: facing * (-8 + s * 14),
      anim: "talk" as TrickAnim,
    };
  }
  if (u < 0.84) {
    const s = (u - 0.55) / 0.29;
    const rub = Math.sin(s * Math.PI * 1.7);
    return {
      x: fromX - facing * (0.55 + rub * 0.28),
      lift: 5.0 + Math.abs(rub) * 0.85,
      rot: facing * (5 + rub * 4.5),
      anim: "talk" as TrickAnim,
    };
  }
  {
    const s = (u - 0.84) / 0.16;
    return {
      x: fromX - facing * (0.55 * (1 - s)),
      lift: 5.0 * (1 - s),
      rot: facing * (5 * (1 - s)),
      anim: "idle" as TrickAnim,
    };
  }
}

export function stepTrick(trick: BumblebeeTrick, dt: number, flags: TrickFlags): BumblebeeTrick {
  if (!trick || trick.phase === "done") return trick;
  if (
    shouldAbort(flags) &&
    trick.kind !== "sonicate" &&
    trick.kind !== "scopa" &&
    trick.kind !== "fossor" &&
    trick.kind !== "lumber" &&
    trick.kind !== "thoraxload" &&
    trick.kind !== "corbicularub"
  ) {
    return { ...trick, phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true };
  }
  const next: BumblebeeTrick = { ...trick, t: trick.t + Math.max(0, dt) };
  if (next.kind === "bombus") {
    if (next.t < BOMBUS_HOLD) {
      const pose = bombusPose(next.t);
      next.phase = "hold";
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = "sit";
      return next;
    }
    if (next.t < BOMBUS_HOLD + RELEASE_S) {
      const pose = releasePose(next.t - BOMBUS_HOLD);
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
  if (next.kind === "sonicate") {
    const pose = sonicatePose(next.t, fromX, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "scopa") {
    const pose = scopaPose(next.t, fromX, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "fossor") {
    const pose = fossorPose(next.t, fromX, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "lumber") {
    const pose = lumberPose(next.t, fromX, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "thoraxload") {
    const pose = thoraxloadPose(next.t, fromX, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else {
    const pose = corbicularubPose(next.t, fromX, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  }
  if (u >= 1) return { ...next, phase: "done", lift: 0, rot: 0, anim: "idle" };
  return next;
}
