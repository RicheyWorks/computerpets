/** Arca ground tricks while idle — ultra-polish pass. House neighborly sealed vault alien encyst quiet hold desk WAIT life — lorica / tegument / ampoule / bradyzoite / cryptobiosis / sporocyst / tachyzoite personality (sealed vault, alien encyst, quiet hold desk life — never named wait or wake or still or cyst or arca or seal or vault or damp or blotter or silhouette or adumbrate or occultation or antumbra or caligo or sfumato or tenebrae as trick kinds; window-play WAIT + ethogram-old wake/wait/still own those words; Manta already owns vault; Cap/others own seal elsewhere; Hush owns silhouette/adumbrate/occultation/antumbra/caligo/sfumato/tenebrae; guest slug Arca / key cyst only for isKey matching — accept "cyst" and "arca"; do NOT name a trick "cyst" or "arca" or "wait" or "wake" or "still" or "seal" or "vault" or "damp" or "blotter" or "silhouette" or "caligo") — not Hush silhouette/adumbrate/occultation/antumbra/caligo/sfumato/tenebrae shade-umbra, not Beacon lodestone/flux/azimuth/dipole/remanence/barkhausen/hysteresis field-magnet, not Brine for salt-brine, not Knot for junction-weave, not Dusk for twilight-belt, not Shard for living-crystal, not Drift for methane-cloud, not Choir for chord-body, not Gleam for lamp-drinker, not Fuse/Ground dragons, not Drown pitcher, not Pulse jelly, not Chamber nautilus, not Pact lichen, not Starter yeast, not Flame/Puff/Mane/Ring/Frill/Cap fungi, not Wax honeycomb, not Spark firefly, not Coin goldfish, not Door moray, not Sheen sweat_bee; never named wait (window-play WAIT + ethogram-old — never a trick kind) / wake (ethogram-old) / still (ethogram-old) / seal (taken elsewhere — never a trick kind) / vault (Manta) / damp (taken) / blotter (window-play stage — never a trick kind) / cyst (guest key — never a trick kind) / arca (guest slug — never a trick kind) / silhouette / adumbrate / occultation / antumbra / caligo / sfumato / tenebrae / skotos / umbriel / softfall / penumbra / eclipse / limb / limitor / belt / lodestone / flux / azimuth / dipole / remanence / barkhausen / hysteresis — Echo/Quill are birds with sound — do not copy their tricks. lorica protozoan case settle on the blotter grain, tegument quiet membrane press across desk damp, ampoule sealed vial tip-hold of a fleck of lamp spill, bradyzoite dormant form tuck without naming wait, cryptobiosis long sealed metabolic hold that keeps a quiet wait while the still stays the blood (not Hush shade umbra, not Chamber nautilus shell, not Brine salt frost, not Beacon magnet field, not Dusk twilight belt) with excyst / turgor / trehalose cousins in the thank-yous — never named mellifera / regina / andrena / langstroth; sporocyst sealed spore-chamber settle (THE traveling-cyst spore-vault tell — never named wait / wake / still / seal / vault / damp / blotter / cyst / arca as this new tell); tachyzoite quick active-form stir (THE fast-zoite contrast to bradyzoite — never named wait / wake / still / seal / vault / damp / blotter / cyst / arca as this new tell); guest slug Arca / key cyst only for isKey matching — accept "cyst" and "arca"; do NOT name a trick "cyst" or "arca". Feed-happy thank-yous sit after eat. Card-open freeze and window-play WAIT do not swallow a thank-you. Sleep, hide, and leave still win. Same map as desktop cyst-tricks.js. Not a Rui/cat/dog/rabbit/hamster/Clip/guinea pig/turtle/Ink/goldfish/Coin/budgie/Echo/fox/penguin/parrot/ferret/hedgehog/Burr/chinchilla/axolotl/Bloom/toucan/iguana/Sol/dragon/Vesper/phoenix/Ember/snake/Coral/octopus/Cup/cuttlefish/Sepia/nautilus/Chamber/moon-jelly/Pulse/sea-star/Cling/hermit-crab/Tenant/horseshoe-crab/Ledger/seahorse/Anchor/manta/Kite/moray/Door/moss/Felt/fern/Vein/ginkgo/Fan/oak/Mast/water-lily/Disk/orchid/Moth/saguaro/Arm/venus-flytrap/Snap/pitcher/Drown/sundew/Dew/honeybee/Comb/honey_drone/Hum/honey_queen/Keep/honeycomb/Wax/oyster/Frill/fly_agaric/Cap/morel/Lattice/chanterelle/Horn/turkey_tail/Ring/lions_mane/Mane/puffball/Puff/chicken_of_woods/Flame/yeast/Starter/lichen/Pact/photovore/Gleam/choir/Choir/nimbus/Drift/silica/Shard/terminator/Dusk/nexus/Knot/halovore/Brine/magneton/Beacon/umbral/Hush/monarch/Milk/luna/Ghost/firefly/Spark/darner/Dart/stick/Twig/carpenter_ant/Column/ladybird/Seven/mantis/Fold/cicada/Brood or *Dragon electrical clone. Window-play WAIT unchanged — never names wait. Ethogram softs + freeze — never names wake or wait or still as trick kinds. Whorl owns the next seat. No cry inventing — thank-yous are silent desk motion only. Amplitudes raised toward Rui richness; denser waits/weights; prefersHouseCry via cyst.wav. */
export const TRICK_KEY = "cyst";
export const TRICKS = ["lorica", "tegument", "ampoule", "bradyzoite", "cryptobiosis", "sporocyst", "tachyzoite"] as const;
export const HAPPY = ["excyst", "turgor", "trehalose"] as const;
export type CystTrickKind = (typeof TRICKS)[number];
export type CystHappyKind = (typeof HAPPY)[number];
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

export type CystTrick = {
  kind: CystTrickKind;
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

export type CystHappy = {
  kind: CystHappyKind;
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

export const HAPPY_DUR = { excyst: 1.61, turgor: 1.74, trehalose: 1.68 } as const;
export const CRYPTOBIOSIS_HOLD = 10.8;
export const RELEASE_S = 1.14;
export const DUR = {
  cryptobiosis: CRYPTOBIOSIS_HOLD + RELEASE_S,
  lorica: 2.31,
  tegument: 2.39,
  ampoule: 2.24,
  bradyzoite: 2.36,
  sporocyst: 2.28,
  tachyzoite: 2.42,
} as const;

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

export function nextTrickWait(justFinished: boolean, rand?: number, kind?: CystTrickKind | string) {
  const roll = rand == null ? Math.random() : rand;
  if (kind === "cryptobiosis") return 38 + roll * 24;
  if (kind === "sporocyst" || kind === "tachyzoite" || kind === "tegument") return 12 + roll * 9;
  if (kind === "lorica" || kind === "ampoule" || kind === "bradyzoite") return 11 + roll * 8;
  return justFinished ? 8 + roll * 8 : 4 + roll * 7;
}

export function pickTrick(rand?: number, musicOn?: boolean, lastKind?: CystTrickKind | string | null) {
  if (musicOn) return "cryptobiosis" as const;
  const roll = rand == null ? Math.random() : rand;
  if (lastKind === "cryptobiosis") {
    if (roll < 0.18) return "lorica" as const;
    if (roll < 0.34) return "tegument" as const;
    if (roll < 0.5) return "ampoule" as const;
    if (roll < 0.66) return "bradyzoite" as const;
    if (roll < 0.83) return "sporocyst" as const;
    return "tachyzoite" as const;
  }
  if (lastKind === "lorica") {
    if (roll < 0.2) return "cryptobiosis" as const;
    if (roll < 0.36) return "tegument" as const;
    if (roll < 0.52) return "ampoule" as const;
    if (roll < 0.68) return "bradyzoite" as const;
    if (roll < 0.84) return "sporocyst" as const;
    return "tachyzoite" as const;
  }
  if (lastKind === "tegument") {
    if (roll < 0.18) return "cryptobiosis" as const;
    if (roll < 0.34) return "lorica" as const;
    if (roll < 0.5) return "ampoule" as const;
    if (roll < 0.66) return "bradyzoite" as const;
    if (roll < 0.83) return "sporocyst" as const;
    return "tachyzoite" as const;
  }
  if (lastKind === "sporocyst" || lastKind === "tachyzoite") {
    if (roll < 0.16) return "cryptobiosis" as const;
    if (roll < 0.32) return "lorica" as const;
    if (roll < 0.48) return "tegument" as const;
    if (roll < 0.64) return "ampoule" as const;
    if (roll < 0.8) return "bradyzoite" as const;
    return lastKind === "sporocyst" ? ("tachyzoite" as const) : ("sporocyst" as const);
  }
  if (roll < 0.14) return "cryptobiosis" as const;
  if (roll < 0.28) return "lorica" as const;
  if (roll < 0.42) return "tegument" as const;
  if (roll < 0.56) return "ampoule" as const;
  if (roll < 0.7) return "bradyzoite" as const;
  if (roll < 0.85) return "sporocyst" as const;
  return "tachyzoite" as const;
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
  return key === TRICK_KEY || key === "arca";
}

export function startThankYou(
  key: string | undefined | null,
  lastKind: CystHappyKind | string | null | undefined,
  x: number,
  facing: 1 | -1,
  flags?: TrickFlags,
) {
  if (!wantsThankYou(key)) return null;
  if (!happyCanStart(flags || { cmd: "idle" })) return null;
  const pick = pickHappy(lastKind as CystHappyKind | null | undefined);
  return { happy: beginHappy(pick, x, facing), kind: pick };
}

export function pickHappy(lastKind?: CystHappyKind | null, rand?: number) {
  const roll = rand == null ? Math.random() : rand;
  const pool = HAPPY.filter((k) => k !== lastKind);
  const list = pool.length ? pool : [...HAPPY];
  return list[Math.floor(roll * list.length) % list.length]!;
}

export function beginHappy(kind: CystHappyKind | string, x: number, facing: 1 | -1): CystHappy {
  const name = (HAPPY as readonly string[]).indexOf(kind) >= 0 ? (kind as CystHappyKind) : "excyst";
  return {
    kind: name,
    happy: true,
    phase: "go",
    t: 0,
    x: x,
    lift: 0,
    rot: 0,
    anim: name === "excyst" ? "talk" : name === "turgor" ? "play" : "sit",
    facing: facing == null ? 1 : facing,
    fromX: x,
  };
}

export function excystPose(t: number) {
  const u = Math.max(0, Math.min(1, t / HAPPY_DUR.excyst));
  if (u < 0.2) {
    const s = u / 0.2;
    return { lift: s * 2.8, rot: s * 12, dx: 0, anim: "talk" as TrickAnim };
  }
  if (u < 0.76) {
    const tick = Math.sin(t * 1.72);
    return {
      lift: 2.8 + Math.abs(tick) * 1.4,
      rot: 12 + tick * 10,
      dx: tick * 0.12,
      anim: "talk" as TrickAnim,
    };
  }
  const s = (u - 0.76) / 0.24;
  return { lift: 2.0 * (1 - s), rot: 6 * (1 - s), dx: 0, anim: "talk" as TrickAnim };
}

export function turgorPose(t: number) {
  const u = Math.max(0, Math.min(1, t / HAPPY_DUR.turgor));
  if (u < 0.18) {
    const s = u / 0.18;
    return { lift: s * 3.4, rot: s * -14, dx: s * 0.15, anim: "play" as TrickAnim };
  }
  if (u < 0.78) {
    const swell = Math.sin(t * 2.1);
    return {
      lift: 3.4 + Math.abs(swell) * 1.6,
      rot: -14 + swell * 12,
      dx: swell * 0.18,
      anim: "play" as TrickAnim,
    };
  }
  const s = (u - 0.78) / 0.22;
  return { lift: 2.2 * (1 - s), rot: -6 * (1 - s), dx: 0, anim: "sit" as TrickAnim };
}

export function trehalosePose(t: number) {
  return {
    lift: 2.2 + Math.abs(Math.sin(t * 0.58)) * 1.1,
    rot: Math.sin(t * 0.9) * 8,
    dx: Math.sin(t * 0.7) * 0.1,
    anim: "sit" as TrickAnim,
  };
}

export function stepHappy(happy: CystHappy, dt: number, flags: TrickFlags): CystHappy {
  if (!happy || happy.phase === "done") return happy;
  if (happyShouldAbort(flags)) {
    return { ...happy, phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true };
  }
  const next: CystHappy = { ...happy, t: happy.t + Math.max(0, dt) };
  const hold = HAPPY_DUR[next.kind];
  if (next.kind === "excyst") {
    const pose = excystPose(next.t);
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "turgor") {
    const pose = turgorPose(next.t);
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else {
    const pose = trehalosePose(next.t);
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

export function beginTrick(kind: CystTrickKind, x: number, facing: 1 | -1): CystTrick {
  const anim: TrickAnim =
    kind === "cryptobiosis"
      ? "sit"
      : kind === "lorica"
        ? "walk"
        : kind === "tegument"
          ? "talk"
          : kind === "ampoule"
            ? "sleep"
            : kind === "bradyzoite"
              ? "play"
              : kind === "sporocyst"
                ? "sit"
                : kind === "tachyzoite"
                  ? "play"
                  : "sit";
  return {
    kind: kind,
    phase: kind === "cryptobiosis" ? "hold" : "go",
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

export function cryptobiosisPose(t: number) {
  return {
    lift: 2.4 + Math.abs(Math.sin(t * 0.42)) * 1.2,
    rot: Math.sin(t * 0.55) * 6,
  };
}

export function releasePose(t: number) {
  const u = Math.max(0, Math.min(1, t / RELEASE_S));
  return { lift: 2.4 * (1 - Math.sin(u * Math.PI * 0.5)), rot: -0.18 * (1 - u) };
}

export function loricaPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.lorica));
  if (u < 0.16) {
    const s = smoothstep(u / 0.16);
    return { x: fromX, lift: s * 3.2, rot: s * -8 * facing, anim: "walk" as TrickAnim };
  }
  if (u < 0.72) {
    const s = (u - 0.16) / 0.56;
    const caseShell = Math.sin(s * Math.PI * 3.4);
    const settle = smoothstep(s);
    return {
      x: fromX + facing * (settle * 0.8 + caseShell * 0.15),
      lift: 3.2 + Math.abs(caseShell) * 0.8,
      rot: facing * (-8 + caseShell * 12 + settle * 4),
      anim: "walk" as TrickAnim,
    };
  }
  const s = smoothstep((u - 0.72) / 0.28);
  return {
    x: fromX + facing * 0.6 * (1 - s),
    lift: 1.6 * (1 - s),
    rot: facing * (-2 * (1 - s)),
    anim: "sit" as TrickAnim,
  };
}

export function tegumentPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.tegument));
  if (u < 0.14) {
    const s = smoothstep(u / 0.14);
    return { x: fromX, lift: s * 2.6, rot: s * 10 * facing, anim: "talk" as TrickAnim };
  }
  if (u < 0.7) {
    const s = (u - 0.14) / 0.56;
    const press = Math.sin(s * Math.PI * 3.6);
    const membrane = smoothstep(s);
    return {
      x: fromX + facing * (membrane * 0.45 + press * 0.12),
      lift: 2.6 + Math.abs(press) * 1.6,
      rot: facing * (10 + press * 8),
      anim: "talk" as TrickAnim,
    };
  }
  if (u < 0.88) {
    const s = (u - 0.7) / 0.18;
    const settle = smoothstep(s);
    return {
      x: fromX + facing * 0.28 * (1 - settle * 0.4),
      lift: 1.8 + settle * 0.4,
      rot: facing * (4 - settle * 6),
      anim: "talk" as TrickAnim,
    };
  }
  const s = smoothstep((u - 0.88) / 0.12);
  return {
    x: fromX + facing * 0.12 * (1 - s),
    lift: 0.8 * (1 - s),
    rot: facing * (1.2 * (1 - s)),
    anim: "sit" as TrickAnim,
  };
}

export function ampoulePose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.ampoule));
  if (u < 0.16) {
    const s = smoothstep(u / 0.16);
    return { x: fromX, lift: s * 2.4, rot: s * 8 * facing, anim: "sleep" as TrickAnim };
  }
  if (u < 0.52) {
    const s = (u - 0.16) / 0.36;
    const tip = smoothstep(s);
    return {
      x: fromX + facing * tip * 0.35,
      lift: 2.4 + tip * 1.4,
      rot: facing * (8 - tip * 14),
      anim: "sleep" as TrickAnim,
    };
  }
  if (u < 0.82) {
    const s = (u - 0.52) / 0.3;
    const hold = Math.sin(s * Math.PI * 2.8);
    return {
      x: fromX + facing * 0.35,
      lift: 3.2 + Math.abs(hold) * 0.8,
      rot: facing * (-4 + hold * 10),
      anim: "sleep" as TrickAnim,
    };
  }
  const s = smoothstep((u - 0.82) / 0.18);
  return {
    x: fromX + facing * 0.35 * (1 - s),
    lift: 1.6 * (1 - s),
    rot: facing * (-2 * (1 - s)),
    anim: "sit" as TrickAnim,
  };
}

export function bradyzoitePose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.bradyzoite));
  if (u < 0.14) {
    const s = smoothstep(u / 0.14);
    return { x: fromX, lift: s * 2.6, rot: s * -10 * facing, anim: "play" as TrickAnim };
  }
  if (u < 0.78) {
    const s = (u - 0.14) / 0.64;
    const tuck = Math.sin(s * Math.PI * 3.2);
    const dormant = Math.sin(s * Math.PI * 1.6);
    return {
      x: fromX + facing * (tuck * 0.4 + dormant * 0.15),
      lift: 2.6 + Math.abs(dormant) * 1.4 + Math.abs(tuck) * 0.6,
      rot: facing * (-10 + dormant * 12 + tuck * 8),
      anim: "play" as TrickAnim,
    };
  }
  const s = smoothstep((u - 0.78) / 0.22);
  return {
    x: fromX,
    lift: 1.2 * (1 - s),
    rot: facing * (-2 * (1 - s)),
    anim: "sit" as TrickAnim,
  };
}

export function sporocystPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.sporocyst));
  if (u < 0.16) {
    const s = smoothstep(u / 0.16);
    return { x: fromX, lift: s * 1.8, rot: s * -8 * facing, anim: "sit" as TrickAnim };
  }
  if (u < 0.55) {
    const s = (u - 0.16) / 0.39;
    const rock = Math.sin(s * Math.PI * 4.2);
    return {
      x: fromX + facing * (s * 0.6 + rock * 0.2),
      lift: 1.8 + Math.abs(rock) * 1.6,
      rot: facing * (-8 + rock * 14),
      anim: "sit" as TrickAnim,
    };
  }
  if (u < 0.78) {
    const s = (u - 0.55) / 0.23;
    const spin = Math.sin(s * Math.PI * 3.4);
    return {
      x: fromX + facing * 0.6,
      lift: 2.8 + Math.abs(spin) * 0.8,
      rot: facing * (4 + spin * 10),
      anim: "sit" as TrickAnim,
    };
  }
  const s = smoothstep((u - 0.78) / 0.22);
  return {
    x: fromX + facing * 0.6 * (1 - s),
    lift: 1.6 * (1 - s),
    rot: facing * (2 * (1 - s)),
    anim: "idle" as TrickAnim,
  };
}

export function tachyzoitePose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.tachyzoite));
  if (u < 0.14) {
    const s = smoothstep(u / 0.14);
    return { x: fromX, lift: s * 2.6, rot: s * 10 * facing, anim: "talk" as TrickAnim };
  }
  if (u < 0.4) {
    const s = (u - 0.14) / 0.26;
    const sip = smoothstep(s);
    return {
      x: fromX + facing * sip * 0.5,
      lift: 2.6 + sip * 2.4,
      rot: facing * (10 + sip * 8),
      anim: "talk" as TrickAnim,
    };
  }
  if (u < 0.78) {
    const s = (u - 0.4) / 0.38;
    const drink = Math.sin(s * Math.PI * 3.2);
    return {
      x: fromX + facing * (0.5 + drink * 0.3),
      lift: 4.8 + Math.abs(drink) * 0.8,
      rot: facing * (6 + drink * 14),
      anim: "play" as TrickAnim,
    };
  }
  const s = smoothstep((u - 0.78) / 0.22);
  return {
    x: fromX + facing * 0.5 * (1 - s),
    lift: 2.6 * (1 - s),
    rot: facing * (6 * (1 - s)),
    anim: "idle" as TrickAnim,
  };
}

export function stepTrick(trick: CystTrick, dt: number, flags: TrickFlags): CystTrick {
  if (!trick || trick.phase === "done") return trick;
  if (
    shouldAbort(flags) &&
    trick.kind !== "lorica" &&
    trick.kind !== "tegument" &&
    trick.kind !== "ampoule" &&
    trick.kind !== "bradyzoite" &&
    trick.kind !== "sporocyst" &&
    trick.kind !== "tachyzoite"
  ) {
    return { ...trick, phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true };
  }
  const next: CystTrick = { ...trick, t: trick.t + Math.max(0, dt) };
  if (next.kind === "cryptobiosis") {
    if (next.t < CRYPTOBIOSIS_HOLD) {
      const pose = cryptobiosisPose(next.t);
      next.phase = "hold";
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = "sit";
      return next;
    }
    if (next.t < CRYPTOBIOSIS_HOLD + RELEASE_S) {
      const pose = releasePose(next.t - CRYPTOBIOSIS_HOLD);
      next.phase = "release";
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = "sit";
      return next;
    }
    return { ...next, phase: "done", lift: 0, rot: 0, anim: "idle" };
  }
  const hold = DUR[next.kind];
  const fromX = trick.fromX != null ? trick.fromX : trick.x;
  if (next.kind === "lorica") {
    const pose = loricaPose(next.t, fromX, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "tegument") {
    const pose = tegumentPose(next.t, fromX, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "ampoule") {
    const pose = ampoulePose(next.t, fromX, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "bradyzoite") {
    const pose = bradyzoitePose(next.t, fromX, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "sporocyst") {
    const pose = sporocystPose(next.t, fromX, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "tachyzoite") {
    const pose = tachyzoitePose(next.t, fromX, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  }
  if (next.t >= hold) return { ...next, phase: "done", lift: 0, rot: 0, anim: "idle", x: fromX };
  next.phase = "go";
  return next;
}
