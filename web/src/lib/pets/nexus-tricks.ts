/** Knot ground tricks while idle. House neighborly alien junction weave-link desk life — plexus / splice / braid / weft / mesh personality (walking-colony network junction, weave link, many-as-one mesh desk life — never named knot or nexus or count or many or ripple or still or name as trick kinds; window-play MANY + ethogram count-ripple/still/name own those words; Door/moray already owns trick name knot; guest slug Knot / key nexus only for isKey matching — accept "nexus" and "knot"; do NOT name a trick "nexus" or "knot" or "count" or "many" or "ripple") — not Dusk belt/penumbra/eclipse/limb/limitor twilight-belt, not Shard cleavage/twinning/inclusion/grit/crescit living-crystal, not Drift waft/billow/cirrus/virga/stratus methane-cloud, not Choir polyphony/partial/timbre/resonance/harmonia chord-body, not Gleam photon/wavelength/lumen/glass/photovore lamp-drinker, not Pulse bell/oral/lucent/trail/medusa jelly, not Pact podetium/photobiont/fruticose/stone/cladonia plaque, not Starter bud/proof/levain/ferment/saccharomyces bloom, not Flame sulfur/rosette/oak/soft/laetiporus drip, not Puff ostiole/gleba/peridium/duff/lycoperdon cloud, not Mane spine/icicle/cascade/wound/hericium teeth, not Ring pore/bracket/band/leathery/trametes underside, not Frill lamella/imbricate/lasso/margin/pleurotus oyster, not Cap annulus/volva/veil/symbiont/amanita, not Wax tessera/hex honeycomb, not Spark firefly lantern, not Coin goldfish drift, not Door hinge/pharynx/knot/lurk/jamb moray; never named knot (Door/moray trick — never reuse) / nexus (guest key — never a trick kind) / knot-slug-as-trick (guest name slug — never a trick kind) / count (special + ethogram) / many (window-play MANY — never a trick kind) / ripple (ethogram) / still (ethogram) / name (ethogram) / belt / penumbra / eclipse / limb / limitor / crepuscule / gloaming / eventide / cleavage / twinning / inclusion / grit / crescit / euhedral / vitreous / adamantine / facet / silica / shard / glass / stone / float / waft / billow / cirrus / virga / stratus / zephyr / fogbow / mizzle / photon / wavelength / lumen / actinic / lux / candela / polyphony / partial / timbre / resonance / harmonia / diapason / motet / canticle / cloud / mist / fog / haze / puff / dust / rain / chord / thirst / drink / drone / pulse / gleam / shine / glint / sheen / dig / nest / bank / buzz / dance / plaque / share / bloom / loaf / hinge / pharynx / lurk / jamb / rim / edge / trail / terminator / dusk / treaty — Echo/Quill are birds with sound — do not copy their tricks. plexus soft many-link gather across the blotter, splice join two ends of the colony walk, braid weave strands into one name, weft cross-thread pass through the weight, mesh long living-network hold desk life as walking colony (not Dusk twilight walker, not Shard living crystal, not Drift methane floater, not Choir chord-body, not Gleam lamp-drinker, not Door moray knot) with accord / quorum / entente cousins in the thank-yous. Feed-happy thank-yous sit after eat. Card-open freeze and window-play MANY do not swallow a thank-you. Sleep, hide, and leave still win. Same map as web nexus-tricks.ts. Window-play MANY unchanged — never names many. Ethogram count-ripple/still/name unchanged — never names count or ripple or still or name as trick kinds. True alien junction weave-link desk life only — network colony without naming knot. Brine owns the next seat. No cry inventing — thank-yous are silent desk motion only. */
export const TRICK_KEY = "nexus";
export const TRICKS = ["plexus", "splice", "braid", "weft", "mesh"] as const;
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

export const HAPPY_DUR = { accord: 1.57, quorum: 1.69, entente: 1.63 } as const;
export const MESH_HOLD = 17.35;
export const RELEASE_S = 0.99;
export const DUR = { mesh: MESH_HOLD + RELEASE_S, plexus: 2.16, splice: 2.24, braid: 2.07, weft: 2.11 } as const;
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
    if (kind === "mesh") return 71 + roll * 36;
  if (kind === "plexus") return 16.1 + roll * 13.4;
  if (kind === "splice") return 20.8 + roll * 13.6;
  if (kind === "weft") return 19.2 + roll * 13.9;
  return justFinished ? 12.9 + roll * 10.1 : 7.4 + roll * 8.7;
}

export function pickTrick(rand?: number, musicOn?: boolean, lastKind?: NexusTrickKind | string | null) {
  if (musicOn) return "mesh";
  const roll = rand == null ? Math.random() : rand;
  if (lastKind === "mesh") {
    if (roll < 0.26) return "plexus";
    if (roll < 0.5) return "splice";
    if (roll < 0.74) return "braid";
    return "weft";
  }
  if (lastKind === "plexus") {
    if (roll < 0.26) return "mesh";
    if (roll < 0.5) return "splice";
    if (roll < 0.74) return "braid";
    return "weft";
  }
  if (lastKind === "splice") {
    if (roll < 0.22) return "mesh";
    if (roll < 0.44) return "plexus";
    if (roll < 0.68) return "braid";
    return "weft";
  }
  if (roll < 0.2) return "mesh";
  if (roll < 0.4) return "plexus";
  if (roll < 0.6) return "splice";
  if (roll < 0.8) return "braid";
  return "weft";
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

      export function accordPose(t) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.accord));
    if (u < 0.12) {
      const s = u / 0.12;
      return { lift: s * 0.046, rot: s * 2.75, dx: 0, anim: "talk" as TrickAnim };
    }
    if (u < 0.78) {
      const tick = Math.sin(t * 12.4) + 0.25 * Math.sin(t * 23.6);
      return {
        lift: 0.046 + Math.abs(tick) * 0.021,
        rot: 2.75 + tick * 2.08,
        dx: tick * 0.0018,
        anim: "talk" as TrickAnim,
      };
    }
    const s = (u - 0.78) / 0.22;
    return { lift: 0.017 * (1 - s), rot: 0.88 * (1 - s), dx: 0, anim: "idle" as TrickAnim };
  }
  export function quorumPose(t) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.quorum));
    if (u < 0.14) {
      const s = u / 0.14;
      return { lift: s * 0.058, rot: s * -3.55, dx: s * 0.0024, anim: "play" as TrickAnim };
    }
    if (u < 0.81) {
      const flash = Math.sin(t * 6.2) + 0.24 * Math.sin(t * 11.4);
      return {
        lift: 0.058 + Math.abs(flash) * 0.029,
        rot: -3.55 + flash * 4.15,
        dx: flash * 0.0038,
        anim: "play" as TrickAnim,
      };
    }
    const s = (u - 0.81) / 0.19;
    return { lift: 0.019 * (1 - s), rot: -1.05 * (1 - s), dx: 0, anim: "sit" as TrickAnim };
  }
  export function ententePose(t) {
    return {
      lift: 0.01 + Math.abs(Math.sin(t * 0.44)) * 0.013,
      rot: Math.sin(t * 0.51) * 1.14,
      dx: Math.sin(t * 0.33) * 0.0017,
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


        export function meshPose(t) {
    const breath = Math.sin(t * 0.19) + 0.066 * Math.sin(t * 0.53);
    const link = Math.abs(Math.sin(t * 0.27));
    return {
      lift: 0.017 + link * 0.019,
      rot: -0.41 + breath * 0.78,
    };
  }

  export function releasePose(t) {
    const u = Math.max(0, Math.min(1, t / RELEASE_S));
    return { lift: 0.013 * (1 - Math.sin(u * Math.PI * 0.5)), rot: -0.42 * (1 - u) };
  }

  export function plexusPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.plexus));
    if (u < 0.13) {
      const s = smoothstep(u / 0.13);
      return { x: fromX, lift: s * -0.016, rot: s * 1.28 * facing, anim: "sit" as TrickAnim };
    }
    if (u < 0.7) {
      const s = (u - 0.13) / 0.57;
      const gather = Math.sin(s * Math.PI * 4.35);
      const knit = smoothstep(s);
      return {
        x: fromX + facing * knit * 0.034,
        lift: -0.024 - Math.abs(gather) * 0.018 - knit * 0.011,
        rot: facing * (1.48 + gather * 2.55),
        anim: "walk" as TrickAnim,
      };
    }
    const s = smoothstep((u - 0.7) / 0.3);
    return {
      x: fromX + facing * 0.015 * (1 - s),
      lift: -0.016 * (1 - s),
      rot: facing * (0.62 * (1 - s)),
      anim: "sit" as TrickAnim,
    };
  }
  export function splicePose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.splice));
    if (u < 0.15) {
      const s = smoothstep(u / 0.15);
      return { x: fromX, lift: s * 0.048, rot: s * -2.35 * facing, anim: "talk" as TrickAnim };
    }
    if (u < 0.6) {
      const s = (u - 0.15) / 0.45;
      const join = Math.sin(s * Math.PI * 3.75);
      return {
        x: fromX + facing * (0.012 + Math.abs(join) * 0.014),
        lift: 0.052 + Math.abs(join) * 0.033,
        rot: facing * (-3.05 + join * 4.85),
        anim: "play" as TrickAnim,
      };
    }
    if (u < 0.85) {
      const s = (u - 0.6) / 0.25;
      const seal = smoothstep(s);
      return {
        x: fromX + facing * 0.02,
        lift: 0.026 - seal * 0.032,
        rot: facing * (1.95 - seal * 3.55),
        anim: "talk" as TrickAnim,
      };
    }
    const s = smoothstep((u - 0.85) / 0.15);
    return {
      x: fromX + facing * 0.01 * (1 - s),
      lift: -0.007 * (1 - s),
      rot: facing * (0.44 * (1 - s)),
      anim: "sit" as TrickAnim,
    };
  }
  export function braidPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.braid));
    if (u < 0.17) {
      const s = smoothstep(u / 0.17);
      return { x: fromX, lift: 0.028 + s * -0.02, rot: s * 1.12 * facing, anim: "sit" as TrickAnim };
    }
    if (u < 0.75) {
      const s = (u - 0.17) / 0.58;
      const weave = smoothstep(s);
      const twist = Math.sin(s * Math.PI * 3.25) * 0.38;
      return {
        x: fromX + facing * twist * 0.005,
        lift: 0.016 - weave * 0.088,
        rot: facing * (0.92 + twist * 1.65 + weave * 1.48),
        anim: "sleep" as TrickAnim,
      };
    }
    const s = smoothstep((u - 0.75) / 0.25);
    return {
      x: fromX,
      lift: 0.058 * (1 - s),
      rot: facing * (0.88 * (1 - s)),
      anim: "sit" as TrickAnim,
    };
  }
  export function weftPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.weft));
    if (u < 0.15) {
      const s = smoothstep(u / 0.15);
      return { x: fromX, lift: s * 0.04, rot: s * -2.05 * facing, anim: "talk" as TrickAnim };
    }
    if (u < 0.78) {
      const s = (u - 0.15) / 0.63;
      const pass = Math.sin(s * Math.PI * 2.55);
      const thread = Math.sin(s * Math.PI * 5.15) * 0.26;
      return {
        x: fromX + facing * pass * 0.007,
        lift: 0.045 + Math.abs(pass) * 0.048 + Math.abs(thread) * 0.015,
        rot: facing * (-2.75 + pass * 3.85 + thread),
        anim: "play" as TrickAnim,
      };
    }
    const s = smoothstep((u - 0.78) / 0.22);
    return {
      x: fromX,
      lift: 0.013 * (1 - s),
      rot: facing * (-0.58 * (1 - s)),
      anim: "sit" as TrickAnim,
    };
  }
export function stepTrick(trick: NexusTrick, dt: number, flags: TrickFlags): NexusTrick {
  if (!trick || trick.phase === "done") return trick;
  if (shouldAbort(flags) && trick.kind !== "plexus" && trick.kind !== "splice" && trick.kind !== "braid" && trick.kind !== "weft") {
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
  if (next.kind === "plexus") {
    const pose = plexusPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "splice") {
    const pose = splicePose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "braid") {
    const pose = braidPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else {
    const pose = weftPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  }
  if (u >= 1) return { ...next, phase: "done", lift: 0, rot: 0, anim: "idle" };
  return next;
}
