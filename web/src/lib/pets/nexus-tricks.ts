/** Knot ground tricks while idle — ultra-polish pass. House neighborly alien junction weave-link desk MANY life — plexus / splice / braid / weft / mesh / fascicle / sennit personality (walking-colony network junction, weave link, many-as-one mesh desk life — never named knot or nexus or count or many or ripple or still or name as trick kinds; window-play MANY + ethogram-old count-ripple/still/name own those words; Door/moray already owns trick name knot; guest slug Knot / key nexus only for isKey matching — accept "nexus" and "knot"; do NOT name a trick "nexus" or "knot" or "count" or "many" or "ripple") — not Dusk belt/penumbra/eclipse/limb/limitor/umbra/syzygy twilight-belt, not Shard cleavage/twinning/inclusion/grit/crescit/hopper/phantom living-crystal, not Drift waft/billow/cirrus/virga/stratus/tholin/nucleate methane-cloud, not Choir polyphony/partial/timbre/resonance/harmonia/formant/dyad chord-body, not Gleam photon/wavelength/lumen/glass/photovore/opsin/iridophore lamp-drinker, not Pulse bell/oral/lucent/trail/medusa jelly, not Pact podetium/photobiont/fruticose/stone/cladonia/soredia/scyphi plaque, not Starter bud/proof/levain/ferment/saccharomyces/ascus/floc bloom, not Flame sulfur/tier/oak/soft/laetiporus/poroid/cluster drip, not Puff ostiole/gleba/peridium/duff/lycoperdon cloud, not Mane spine/icicle/cascade/wound/hericium teeth, not Ring pore/bracket/zonate/leathery/trametes underside, not Frill lamella/imbricate/lasso/margin/pleurotus oyster, not Cap annulus/volva/flake/symbiont/amanita, not Wax tessera/hex honeycomb, not Spark firefly lantern, not Coin goldfish drift, not Door hinge/pharynx/knot/lurk/jamb moray; never named knot (Door/moray trick — never reuse) / nexus (guest key — never a trick kind) / knot-slug-as-trick (guest name slug — never a trick kind) / count (special + ethogram-old) / many (window-play MANY — never a trick kind) / ripple (ethogram-old) / still (ethogram-old) / name (ethogram-old) / belt / penumbra / eclipse / limb / limitor / umbra / syzygy / crepuscule / gloaming / eventide / cleavage / twinning / inclusion / grit / crescit / hopper / phantom / euhedral / vitreous / adamantine / facet / silica / shard / glass / stone / float / waft / billow / cirrus / virga / stratus / zephyr / fogbow / mizzle / tholin / nucleate / photon / wavelength / lumen / actinic / lux / lambert / opsin / iridophore / polyphony / partial / timbre / resonance / harmonia / formant / dyad / diapason / motet / canticle / cloud / mist / fog / haze / puff / dust / rain / chord / thirst / drink / drone / pulse / gleam / shine / glint / sheen / dig / nest / bank / buzz / dance / plaque / share / bloom / loaf / hinge / pharynx / lurk / jamb / rim / edge / trail / terminator / dusk / treaty / brine / halo — Echo/Quill are birds with sound — do not copy their tricks. plexus soft many-link gather across the blotter, splice join two ends of the colony walk, braid weave strands into one name, weft cross-thread pass through the weight, mesh long living-network hold desk life as walking colony (not Dusk twilight walker, not Shard living crystal, not Drift methane floater, not Choir chord-body, not Gleam lamp-drinker, not Door moray knot) with accord / quorum / entente cousins in the thank-yous — never named mellifera / regina / andrena / langstroth; fascicle fiber-bundle gather (THE colony-bundle tell — never named knot / nexus / count / many / ripple / still / name as this new tell); sennit braided living-cord weave (THE cord-weave tell — never named knot / nexus / count / many / ripple / still / name as this new tell); guest slug Knot / key nexus only for isKey matching — accept "nexus" and "knot"; do NOT name a trick "nexus" or "knot". Feed-happy thank-yous sit after eat. Card-open freeze and window-play MANY do not swallow a thank-you. Sleep, hide, and leave still win. Same map as desktop nexus-tricks.js. Not a Rui/cat/dog/rabbit/hamster/Clip/guinea pig/turtle/Ink/goldfish/Coin/budgie/Echo/fox/penguin/parrot/ferret/hedgehog/Burr/chinchilla/axolotl/Bloom/toucan/iguana/Sol/dragon/Vesper/phoenix/Ember/snake/Coral/octopus/Cup/cuttlefish/Sepia/nautilus/Chamber/moon-jelly/Pulse/sea-star/Cling/hermit-crab/Tenant/horseshoe-crab/Ledger/seahorse/Anchor/manta/Kite/moray/Door/moss/Felt/fern/Vein/ginkgo/Fan/oak/Mast/water-lily/Disk/orchid/Moth/saguaro/Arm/venus-flytrap/Snap/pitcher/Drown/sundew/Dew/honeybee/Comb/honey_drone/Hum/honey_queen/Keep/honeycomb/Wax/oyster/Frill/fly_agaric/Cap/morel/Lattice/chanterelle/Horn/turkey_tail/Ring/lions_mane/Mane/puffball/Puff/chicken_of_woods/Flame/yeast/Starter/lichen/Pact/photovore/Gleam/choir/Choir/nimbus/Drift/silica/Shard/terminator/Dusk/monarch/Milk/luna/Ghost/firefly/Spark/darner/Dart/stick/Twig/carpenter_ant/Column/ladybird/Seven/mantis/Fold/cicada/Brood or *Dragon electrical clone. Window-play MANY unchanged — never names many. Ethogram softs + freeze — never names count or ripple or still or name as trick kinds. Hinge owns the next seat. No cry inventing — thank-yous are silent desk motion only. Amplitudes raised toward Rui richness; denser waits/weights (MESH_HOLD=11.2 RELEASE_S=1.18). Next leftover Brine / halovore. prefersHouseCry via nexus.wav. */
export const TRICK_KEY = "nexus";
export const TRICKS = ["plexus", "splice", "braid", "weft", "mesh", "fascicle", "sennit"] as const;
export const HAPPY = ["accord", "quorum", "entente"] as const;
export type NexusTrickKind = (typeof TRICKS)[number];
export type NexusHappyKind = (typeof HAPPY)[number];
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

export type NexusTrick = {
  kind: NexusTrickKind;
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

export type NexusHappy = {
  kind: NexusHappyKind;
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

export const HAPPY_DUR: Record<NexusHappyKind, number> = {
  accord: 1.28,
  quorum: 1.16,
  entente: 1.22,
};

/** Mesh hold — Knot parks living-network calm as walking-colony desk life. Not window-play MANY. */
export const MESH_HOLD = 11.2;
export const RELEASE_S = 1.18;
export const DUR: Record<NexusTrickKind, number> = {
  mesh: MESH_HOLD + RELEASE_S,
  plexus: 1.58,
  splice: 1.64,
  braid: 1.48,
  weft: 1.56,
  fascicle: 1.68,
  sennit: 1.72,
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

export function nextTrickWait(justFinished: boolean, rand?: number, kind?: NexusTrickKind | string) {
  const roll = rand == null ? Math.random() : rand;
  if (kind === "mesh") return 40 + roll * 26;
  if (kind === "plexus" || kind === "splice" || kind === "braid" || kind === "weft" || kind === "fascicle" || kind === "sennit") return 12.8 + roll * 9.4;
  return justFinished ? 8.5 + roll * 8.4 : 4.4 + roll * 7.4;
}

export function pickTrick(rand?: number, musicOn?: boolean, lastKind?: NexusTrickKind | string | null) {
  if (musicOn) return "mesh" as const;
  const roll = rand == null ? Math.random() : rand;
  const pool = TRICKS.filter((k) => k !== lastKind);
  const list = pool.length ? pool : TRICKS.slice();
  const weights = list.map((k) =>
    k === "mesh" ? 0.72 : k === "plexus" || k === "fascicle" ? 1.28 : k === "sennit" ? 1.18 : 1.08
  );
  let total = 0;
  for (let i = 0; i < weights.length; i++) total += weights[i];
  let r = roll * total;
  for (let i = 0; i < list.length; i++) {
    r -= weights[i];
    if (r <= 0) return list[i];
  }
  return list[list.length - 1] || "plexus";
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
  return key === TRICK_KEY || key === "knot";
}

export function startThankYou(
  key: string | undefined | null,
  lastKind: NexusHappyKind | string | null | undefined,
  x: number,
  facing: 1 | -1,
  flags?: TrickFlags,
) {
  if (!wantsThankYou(key)) return null;
  if (!happyCanStart(flags || { cmd: "idle" })) return null;
  const pick = pickHappy(lastKind as NexusHappyKind | null | undefined);
  return { happy: beginHappy(pick, x, facing), kind: pick };
}

export function pickHappy(lastKind?: NexusHappyKind | null, rand?: number) {
  const pool = HAPPY.filter((k) => k !== lastKind);
  const list = pool.length ? pool : [...HAPPY];
  const roll = rand == null ? Math.random() : rand;
  return list[Math.floor(roll * list.length)] || list[0];
}

export function beginHappy(kind: NexusHappyKind | string, x: number, facing: 1 | -1): NexusHappy {
  const name = (HAPPY as readonly string[]).indexOf(kind) >= 0 ? (kind as NexusHappyKind) : "accord";
  return {
    kind: name,
    happy: true,
    phase: "go",
    t: 0,
    x: x,
    lift: 0,
    rot: 0,
    anim: name === "accord" ? "talk" : name === "quorum" ? "play" : "sit",
    facing: facing == null ? 1 : facing,
    fromX: x,
  };
}

export function accordPose(t: number) {
  const u = Math.max(0, Math.min(1, t / HAPPY_DUR.accord));
  if (u < 0.2) {
    const s = u / 0.2;
    return { lift: s * 3.36, rot: s * 14.4, dx: 0, anim: "talk" as TrickAnim };
  }
  if (u < 0.76) {
    const tick = Math.sin(t * 1.72);
    return {
      lift: 3.36 + Math.abs(tick) * 1.68,
      rot: 14.4 + tick * 12,
      dx: tick * 0.14,
      anim: "talk" as TrickAnim,
    };
  }
  const s = (u - 0.76) / 0.24;
  return { lift: 2.4 * (1 - s), rot: 7.2 * (1 - s), dx: 0, anim: "talk" as TrickAnim };
}

export function quorumPose(t: number) {
  const u = Math.max(0, Math.min(1, t / HAPPY_DUR.quorum));
  if (u < 0.18) {
    const s = u / 0.18;
    return { lift: s * 4.08, rot: s * -16.8, dx: s * 0.18, anim: "play" as TrickAnim };
  }
  if (u < 0.78) {
    const flash = Math.sin(t * 2.1);
    return {
      lift: 4.08 + Math.abs(flash) * 1.92,
      rot: -16.8 + flash * 14.4,
      dx: flash * 0.22,
      anim: "play" as TrickAnim,
    };
  }
  const s = (u - 0.78) / 0.22;
  return { lift: 2.64 * (1 - s), rot: -7.2 * (1 - s), dx: 0, anim: "sit" as TrickAnim };
}

export function ententePose(t: number) {
  return {
    lift: 2.64 + Math.abs(Math.sin(t * 0.58)) * 1.32,
    rot: Math.sin(t * 0.72) * 9.6,
    dx: Math.sin(t * 0.4) * -0.14,
    anim: "sit" as TrickAnim,
  };
}

export function stepHappy(happy: NexusHappy, dt: number, flags: TrickFlags): NexusHappy {
  if (!happy || happy.phase === "done") return happy;
  if (happyShouldAbort(flags)) {
    return { ...happy, phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true };
  }
  const next: NexusHappy = { ...happy, t: happy.t + Math.max(0, dt) };
  const hold = HAPPY_DUR[next.kind];
  if (next.kind === "accord") {
    const pose = accordPose(next.t);
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "quorum") {
    const pose = quorumPose(next.t);
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else {
    const pose = ententePose(next.t);
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

export function beginTrick(kind: NexusTrickKind, x: number, facing: 1 | -1): NexusTrick {
  const anim: TrickAnim =
    kind === "mesh"
      ? "sit"
      : kind === "plexus"
        ? "walk"
        : kind === "splice"
          ? "talk"
          : kind === "braid"
            ? "sleep"
            : kind === "weft"
              ? "play"
              : kind === "fascicle"
                ? "sit"
                : kind === "sennit"
                  ? "play"
                  : "sit";
  return {
    kind: kind,
    phase: kind === "mesh" ? "hold" : "go",
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

/** Mesh — long layered hold as walking colony. Not window-play MANY. */
export function meshPose(t: number) {
  const breath = Math.sin(t * 0.42) + 0.06 * Math.sin(t * 1.15);
  return {
    lift: 2.88 + Math.abs(Math.sin(t * 0.42)) * 1.44,
    rot: 4.8 + breath * 7.2,
  };
}

export function releasePose(t: number) {
  const u = Math.max(0, Math.min(1, t / RELEASE_S));
  const s = smoothstep(u);
  return { lift: 2.88 * (1 - Math.sin(u * Math.PI * 0.5)), rot: 4.8 * (1 - s) };
}

/** Plexus — soft many-link gather across the blotter. Never named knot/nexus/count/many. */
export function plexusPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.plexus));
  if (u < 0.16) {
    const s = smoothstep(u / 0.16);
    return { x: fromX, lift: s * 3.84, rot: s * -9.6 * facing, anim: "sit" as TrickAnim };
  }
  if (u < 0.52) {
    const s = (u - 0.16) / 0.36;
    const bob = Math.sin(s * Math.PI * 1.8);
    return {
      x: fromX + facing * bob * 0.42,
      lift: 3.84 - s * 0.96 + Math.abs(bob) * 0.72,
      rot: facing * (-9.6 + bob * 14.4),
      anim: "walk" as TrickAnim,
    };
  }
  if (u < 0.82) {
    const s = (u - 0.52) / 0.3;
    const settle = smoothstep(s);
    return {
      x: fromX + facing * (1 - settle) * 0.48,
      lift: 2.88 * (1 - settle * 1.02),
      rot: facing * (-4.8 + settle * 9.6),
      anim: "sit" as TrickAnim,
    };
  }
  const s = smoothstep((u - 0.82) / 0.18);
  return {
    x: fromX,
    lift: 0.96 * (1 - s),
    rot: facing * (3.6 * (1 - s)),
    anim: "sit" as TrickAnim,
  };
}

/** Splice — join two ends of the colony walk. Never named knot/nexus/ripple. */
export function splicePose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.splice));
  if (u < 0.14) {
    const s = smoothstep(u / 0.14);
    return { x: fromX, lift: s * 3.12, rot: s * -12 * facing, anim: "talk" as TrickAnim };
  }
  if (u < 0.78) {
    const s = (u - 0.14) / 0.64;
    const open = Math.sin(s * Math.PI * 2.4);
    return {
      x: fromX + facing * open * 0.48,
      lift: 3.12 + Math.abs(open) * 1.92,
      rot: facing * (-12 + open * 16.8),
      anim: "play" as TrickAnim,
    };
  }
  const s = smoothstep((u - 0.78) / 0.22);
  return {
    x: fromX,
    lift: 2.16 * (1 - s),
    rot: facing * (-7.2 * (1 - s)),
    anim: "sit" as TrickAnim,
  };
}

/** Braid — weave strands into one name. Never named knot/nexus/still. */
export function braidPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.braid));
  if (u < 0.18) {
    const s = smoothstep(u / 0.18);
    return { x: fromX, lift: s * 2.88, rot: s * 16.8 * facing, anim: "sit" as TrickAnim };
  }
  if (u < 0.55) {
    const s = (u - 0.18) / 0.37;
    const press = Math.sin(s * Math.PI * 3.4);
    return {
      x: fromX + facing * press * 0.48,
      lift: 2.88 + Math.abs(press) * 1.68,
      rot: facing * (16.8 + press * 14.4),
      anim: "sleep" as TrickAnim,
    };
  }
  if (u < 0.78) {
    const s = (u - 0.55) / 0.23;
    const settle = smoothstep(s);
    return {
      x: fromX + facing * (1 - settle) * 0.6,
      lift: 3.84 - settle * 1.44,
      rot: facing * (16.8 - settle * 19.2),
      anim: "sleep" as TrickAnim,
    };
  }
  const s = smoothstep((u - 0.78) / 0.22);
  return {
    x: fromX,
    lift: 2.4 * (1 - s),
    rot: facing * (-3.6 * (1 - s)),
    anim: "sit" as TrickAnim,
  };
}

/** Weft — cross-thread pass through the weight. Never named knot/nexus/many. */
export function weftPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.weft));
  if (u < 0.15) {
    const s = smoothstep(u / 0.15);
    return { x: fromX, lift: s * 3.12, rot: s * 12 * facing, anim: "talk" as TrickAnim };
  }
  if (u < 0.55) {
    const s = (u - 0.15) / 0.4;
    const cup = smoothstep(s);
    return {
      x: fromX + facing * Math.sin(s * Math.PI) * 0.3,
      lift: 3.12 * (1 - cup * 0.84),
      rot: facing * (12 - cup * 16.8),
      anim: "play" as TrickAnim,
    };
  }
  if (u < 0.8) {
    const s = (u - 0.55) / 0.25;
    const hold = Math.sin(s * Math.PI * 3.2);
    return {
      x: fromX + facing * hold * 0.24,
      lift: 0.96 + Math.abs(hold) * 0.72,
      rot: facing * (-4.8 + hold * 12),
      anim: "play" as TrickAnim,
    };
  }
  const s = smoothstep((u - 0.8) / 0.2);
  return {
    x: fromX,
    lift: 0.72 * (1 - s),
    rot: facing * (-2.4 * (1 - s)),
    anim: "sit" as TrickAnim,
  };
}

/** Fascicle — fiber-bundle gather; THE colony-bundle tell. Never named knot/nexus/count/many/ripple/still/name. */
export function fasciclePose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.fascicle));
  if (u < 0.16) {
    const s = smoothstep(u / 0.16);
    return { x: fromX, lift: s * 2.16, rot: s * -9.6 * facing, anim: "sit" as TrickAnim };
  }
  if (u < 0.55) {
    const s = (u - 0.16) / 0.39;
    const rock = Math.sin(s * Math.PI * 4.2);
    return {
      x: fromX + facing * (s * 0.72 + rock * 0.24),
      lift: 2.16 + Math.abs(rock) * 1.92,
      rot: facing * (-9.6 + rock * 16.8),
      anim: "sit" as TrickAnim,
    };
  }
  if (u < 0.78) {
    const s = (u - 0.55) / 0.23;
    const spin = Math.sin(s * Math.PI * 3.4);
    return {
      x: fromX + facing * 0.72,
      lift: 3.36 + Math.abs(spin) * 0.96,
      rot: facing * (4.8 + spin * 12),
      anim: "sit" as TrickAnim,
    };
  }
  const s = smoothstep((u - 0.78) / 0.22);
  return {
    x: fromX + facing * 0.72 * (1 - s),
    lift: 2.16 * (1 - s) + s * 0.24,
    rot: facing * (4.8 * (1 - s)),
    anim: "idle" as TrickAnim,
  };
}

/** Sennit — braided living-cord weave; THE cord-weave tell. Never named knot/nexus/count/many/ripple/still/name. */
export function sennitPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.sennit));
  if (u < 0.14) {
    const s = smoothstep(u / 0.14);
    return { x: fromX, lift: s * 3.12, rot: s * 12 * facing, anim: "talk" as TrickAnim };
  }
  if (u < 0.4) {
    const s = (u - 0.14) / 0.26;
    const sip = smoothstep(s);
    return {
      x: fromX + facing * sip * 0.6,
      lift: 3.12 + sip * 2.88,
      rot: facing * (12 + sip * 9.6),
      anim: "talk" as TrickAnim,
    };
  }
  if (u < 0.78) {
    const s = (u - 0.4) / 0.38;
    const drink = Math.sin(s * Math.PI * 3.2);
    return {
      x: fromX + facing * (0.6 + drink * 0.36),
      lift: 5.76 + Math.abs(drink) * 0.96,
      rot: facing * (7.2 + drink * 16.8),
      anim: "play" as TrickAnim,
    };
  }
  const s = smoothstep((u - 0.78) / 0.22);
  return {
    x: fromX + facing * 0.6 * (1 - s),
    lift: 3.12 * (1 - s),
    rot: facing * (7.2 * (1 - s)),
    anim: "idle" as TrickAnim,
  };
}

export function stepTrick(trick: NexusTrick, dt: number, flags: TrickFlags): NexusTrick {
  if (!trick || trick.phase === "done") return trick;
  if (
    shouldAbort(flags) &&
    trick.kind !== "plexus" &&
    trick.kind !== "splice" &&
    trick.kind !== "braid" &&
    trick.kind !== "weft" &&
    trick.kind !== "fascicle" &&
    trick.kind !== "sennit"
  ) {
    return { ...trick, phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true };
  }
  const next: NexusTrick = { ...trick, t: trick.t + Math.max(0, dt) };
  if (next.kind === "mesh") {
    if (next.t < MESH_HOLD) {
      const pose = meshPose(next.t);
      next.phase = "hold";
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = "sit";
      return next;
    }
    if (next.t < MESH_HOLD + RELEASE_S) {
      const pose = releasePose(next.t - MESH_HOLD);
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
  let pose;
  if (next.kind === "plexus") pose = plexusPose(next.t, fromX, trick.facing);
  else if (next.kind === "splice") pose = splicePose(next.t, fromX, trick.facing);
  else if (next.kind === "braid") pose = braidPose(next.t, fromX, trick.facing);
  else if (next.kind === "weft") pose = weftPose(next.t, fromX, trick.facing);
  else if (next.kind === "fascicle") pose = fasciclePose(next.t, fromX, trick.facing);
  else pose = sennitPose(next.t, fromX, trick.facing);
  next.x = pose.x;
  next.lift = pose.lift;
  next.rot = pose.rot;
  next.anim = pose.anim;
  if (u >= 1) return { ...next, phase: "done", lift: 0, rot: 0, anim: "idle" };
  return next;
}
