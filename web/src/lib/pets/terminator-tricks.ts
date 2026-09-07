/** Dusk ground tricks while idle. House neighborly alien twilight-belt desk life — belt / penumbra / eclipse / limb / limitor personality (day/night line, eclipse hush, alien limb of light, Limitor cursor lamp-edge life — never named rim or edge or still or trail or terminator or dusk as trick kinds; window-play RIM + ethogram edge-walk/still/rim own those words; guest slug Dusk / key terminator only for isKey matching — accept "terminator" and "dusk"; do NOT name a trick "terminator" or "dusk" or "rim" or "edge") — not Shard cleavage/twinning/inclusion/grit/crescit living-crystal, not Drift waft/billow/cirrus/virga/stratus methane-cloud, not Choir polyphony/partial/timbre/resonance/harmonia chord-body, not Gleam photon/wavelength/lumen/glass/photovore lamp-drinker, not Pulse bell/oral/lucent/trail/medusa jelly, not Pact podetium/photobiont/fruticose/stone/cladonia plaque, not Starter bud/proof/levain/ferment/saccharomyces bloom, not Flame sulfur/rosette/oak/soft/laetiporus drip, not Puff ostiole/gleba/peridium/duff/lycoperdon cloud, not Mane spine/icicle/cascade/wound/hericium teeth, not Ring pore/bracket/band/leathery/trametes underside, not Frill lamella/imbricate/lasso/margin/pleurotus oyster, not Cap annulus/volva/veil/symbiont/amanita, not Wax tessera/hex honeycomb, not Spark firefly lantern, not Coin goldfish drift; never named rim (window-play RIM — never a trick kind) / edge (ethogram edge-walk — never a trick kind) / still (ethogram) / trail (ethogram) / terminator (guest key — never a trick kind) / dusk (guest name — never a trick kind) / cleavage / twinning / inclusion / grit / crescit / euhedral / vitreous / adamantine / facet / silica / shard / glass / stone / float / waft / billow / cirrus / virga / stratus / zephyr / fogbow / mizzle / photon / wavelength / lumen / actinic / lux / candela / polyphony / partial / timbre / resonance / harmonia / diapason / motet / canticle / cloud / mist / fog / haze / puff / dust / rain / chord / thirst / drink / drone / pulse / gleam / shine / glint / sheen / dig / nest / bank / buzz / dance / plaque / share / bloom / loaf — Echo/Quill are birds with sound — do not copy their tricks. belt thin creep along the day/night line on the blotter, penumbra soft half-light sway, eclipse hush settle under the lamp, limb alien limb-of-light stretch, limitor long Limitor-cursor hold desk life as twilight walker (not Shard living crystal, not Drift methane floater, not Choir chord-body, not Gleam lamp-drinker) with crepuscule / gloaming / eventide cousins in the thank-yous. Feed-happy thank-yous sit after eat. Card-open freeze and window-play RIM do not swallow a thank-you. Sleep, hide, and leave still win. Same map as web terminator-tricks.ts. Window-play RIM unchanged — never names rim. Ethogram edge-walk/still/rim unchanged — never names edge or still or rim as trick kinds. True alien twilight-belt desk life only — day/night line without naming rim. Knot owns the next seat. No cry inventing — thank-yous are silent desk motion only. */
export const TRICK_KEY = "terminator";
export const TRICKS = ["belt", "penumbra", "eclipse", "limb", "limitor"] as const;
export const HAPPY = ["crepuscule", "gloaming", "eventide"] as const;
export type TerminatorTrickKind = (typeof TRICKS)[number];
export type TerminatorHappyKind = (typeof HAPPY)[number];
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

export type TerminatorTrick = {
  kind: TerminatorTrickKind;
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

export type TerminatorHappy = {
  kind: TerminatorHappyKind;
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

export const HAPPY_DUR = { crepuscule: 1.61, gloaming: 1.74, eventide: 1.66 } as const;
export const LIMITOR_HOLD = 16.88;
export const RELEASE_S = 1.02;
export const DUR = { limitor: LIMITOR_HOLD + RELEASE_S, belt: 2.19, penumbra: 2.27, eclipse: 2.04, limb: 2.14 } as const;
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

export function nextTrickWait(justFinished: boolean, rand?: number, kind?: TerminatorTrickKind | string) {
  const roll = rand == null ? Math.random() : rand;
    if (kind === "limitor") return 69 + roll * 37;
  if (kind === "belt") return 15.8 + roll * 13.7;
  if (kind === "penumbra") return 21.4 + roll * 13.3;
  if (kind === "limb") return 18.6 + roll * 14.1;
  return justFinished ? 12.7 + roll * 10.2 : 7.2 + roll * 8.9;
}

export function pickTrick(rand?: number, musicOn?: boolean, lastKind?: TerminatorTrickKind | string | null) {
  if (musicOn) return "limitor";
  const roll = rand == null ? Math.random() : rand;
  if (lastKind === "limitor") {
    if (roll < 0.26) return "belt";
    if (roll < 0.5) return "penumbra";
    if (roll < 0.74) return "eclipse";
    return "limb";
  }
  if (lastKind === "belt") {
    if (roll < 0.26) return "limitor";
    if (roll < 0.5) return "penumbra";
    if (roll < 0.74) return "eclipse";
    return "limb";
  }
  if (lastKind === "penumbra") {
    if (roll < 0.22) return "limitor";
    if (roll < 0.44) return "belt";
    if (roll < 0.68) return "eclipse";
    return "limb";
  }
  if (roll < 0.2) return "limitor";
  if (roll < 0.4) return "belt";
  if (roll < 0.6) return "penumbra";
  if (roll < 0.8) return "eclipse";
  return "limb";
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
  return key === TRICK_KEY || key === "dusk";
}

export function startThankYou(
  key: string | undefined | null,
  lastKind: TerminatorHappyKind | string | null | undefined,
  x: number,
  facing: 1 | -1,
  flags?: TrickFlags,
) {
  if (!wantsThankYou(key)) return null;
  if (!happyCanStart(flags || { cmd: "idle" })) return null;
  const pick = pickHappy(lastKind as TerminatorHappyKind | null | undefined);
  return { happy: beginHappy(pick, x, facing), kind: pick };
}

export function pickHappy(lastKind?: TerminatorHappyKind | null, rand?: number) {
  const pool = HAPPY.filter((k) => k !== lastKind);
  const list = pool.length ? pool : [...HAPPY];
  const roll = rand == null ? Math.random() : rand;
  return list[Math.floor(roll * list.length)] || list[0];
}

export function beginHappy(kind: TerminatorHappyKind | string, x: number, facing: 1 | -1): TerminatorHappy {
  const name = (HAPPY as readonly string[]).indexOf(kind) >= 0 ? (kind as TerminatorHappyKind) : "crepuscule";
  return {
    kind: name,
    happy: true,
    phase: "go",
    t: 0,
    x: x,
    lift: 0,
    rot: 0,
    anim: name === "crepuscule" ? "talk" : name === "gloaming" ? "play" : "sit",
    facing: facing == null ? 1 : facing,
    fromX: x,
  };
}

    export function crepusculePose(t) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.crepuscule));
    if (u < 0.12) {
      const s = u / 0.12;
      return { lift: s * 0.048, rot: s * 2.95, dx: 0, anim: "talk" as TrickAnim };
    }
    if (u < 0.79) {
      const tick = Math.sin(t * 13.1) + 0.27 * Math.sin(t * 24.8);
      return {
        lift: 0.048 + Math.abs(tick) * 0.022,
        rot: 2.95 + tick * 2.22,
        dx: tick * 0.0019,
        anim: "talk" as TrickAnim,
      };
    }
    const s = (u - 0.79) / 0.21;
    return { lift: 0.018 * (1 - s), rot: 0.95 * (1 - s), dx: 0, anim: "idle" as TrickAnim };
  }
  export function gloamingPose(t) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.gloaming));
    if (u < 0.13) {
      const s = u / 0.13;
      return { lift: s * 0.062, rot: s * -3.75, dx: s * 0.0025, anim: "play" as TrickAnim };
    }
    if (u < 0.8) {
      const flash = Math.sin(t * 6.6) + 0.26 * Math.sin(t * 11.9);
      return {
        lift: 0.062 + Math.abs(flash) * 0.031,
        rot: -3.75 + flash * 4.45,
        dx: flash * 0.0041,
        anim: "play" as TrickAnim,
      };
    }
    const s = (u - 0.8) / 0.2;
    return { lift: 0.02 * (1 - s), rot: -1.15 * (1 - s), dx: 0, anim: "sit" as TrickAnim };
  }
  export function eventidePose(t) {
    return {
      lift: 0.011 + Math.abs(Math.sin(t * 0.47)) * 0.014,
      rot: Math.sin(t * 0.54) * 1.22,
      dx: Math.sin(t * 0.35) * 0.0018,
      anim: "sit" as TrickAnim,
    };
  }
export function stepHappy(happy: TerminatorHappy, dt: number, flags: TrickFlags): TerminatorHappy {
  if (!happy || happy.phase === "done") return happy;
  if (happyShouldAbort(flags)) {
    return { ...happy, phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true };
  }
  const next: TerminatorHappy = { ...happy, t: happy.t + Math.max(0, dt) };
  const hold = HAPPY_DUR[next.kind];
  if (next.kind === "crepuscule") {
    const pose = crepusculePose(next.t);
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "gloaming") {
    const pose = gloamingPose(next.t);
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else {
    const pose = eventidePose(next.t);
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

export function beginTrick(kind: TerminatorTrickKind, x: number, facing: 1 | -1): TerminatorTrick {
  const anim: TrickAnim =
    kind === "limitor"
      ? "sit"
      : kind === "belt"
        ? "walk"
        : kind === "penumbra"
          ? "talk"
          : kind === "eclipse"
            ? "sleep"
            : kind === "limb"
              ? "play"
              : "sit";
  return {
    kind: kind,
    phase: kind === "limitor" ? "hold" : "go",
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


      export function limitorPose(t) {
    const breath = Math.sin(t * 0.17) + 0.071 * Math.sin(t * 0.49);
    const belt = Math.abs(Math.sin(t * 0.23));
    return {
      lift: 0.019 + belt * 0.017,
      rot: -0.48 + breath * 0.71,
    };
  }

  export function releasePose(t) {
    const u = Math.max(0, Math.min(1, t / RELEASE_S));
    return { lift: 0.014 * (1 - Math.sin(u * Math.PI * 0.5)), rot: -0.47 * (1 - u) };
  }

  export function beltPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.belt));
    if (u < 0.12) {
      const s = smoothstep(u / 0.12);
      return { x: fromX, lift: s * -0.018, rot: s * 1.42 * facing, anim: "sit" as TrickAnim };
    }
    if (u < 0.68) {
      const s = (u - 0.12) / 0.56;
      const creep = Math.sin(s * Math.PI * 4.65);
      const line = smoothstep(s);
      return {
        x: fromX + facing * line * 0.038,
        lift: -0.028 - Math.abs(creep) * 0.016 - line * 0.012,
        rot: facing * (1.62 + creep * 2.35),
        anim: "walk" as TrickAnim,
      };
    }
    const s = smoothstep((u - 0.68) / 0.32);
    return {
      x: fromX + facing * 0.016 * (1 - s),
      lift: -0.018 * (1 - s),
      rot: facing * (0.68 * (1 - s)),
      anim: "sit" as TrickAnim,
    };
  }
  export function penumbraPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.penumbra));
    if (u < 0.14) {
      const s = smoothstep(u / 0.14);
      return { x: fromX, lift: s * 0.051, rot: s * -2.55 * facing, anim: "talk" as TrickAnim };
    }
    if (u < 0.58) {
      const s = (u - 0.14) / 0.44;
      const soft = Math.sin(s * Math.PI * 3.95);
      return {
        x: fromX + facing * (0.014 + Math.abs(soft) * 0.012),
        lift: 0.055 + Math.abs(soft) * 0.036,
        rot: facing * (-3.25 + soft * 5.15),
        anim: "play" as TrickAnim,
      };
    }
    if (u < 0.86) {
      const s = (u - 0.58) / 0.28;
      const fade = smoothstep(s);
      return {
        x: fromX + facing * 0.022,
        lift: 0.028 - fade * 0.034,
        rot: facing * (2.15 - fade * 3.85),
        anim: "talk" as TrickAnim,
      };
    }
    const s = smoothstep((u - 0.86) / 0.14);
    return {
      x: fromX + facing * 0.011 * (1 - s),
      lift: -0.008 * (1 - s),
      rot: facing * (0.48 * (1 - s)),
      anim: "sit" as TrickAnim,
    };
  }
  export function eclipsePose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.eclipse));
    if (u < 0.18) {
      const s = smoothstep(u / 0.18);
      return { x: fromX, lift: 0.032 + s * -0.022, rot: s * 1.05 * facing, anim: "sit" as TrickAnim };
    }
    if (u < 0.74) {
      const s = (u - 0.18) / 0.56;
      const hush = smoothstep(s);
      const shiver = Math.sin(s * Math.PI * 2.15) * 0.22;
      return {
        x: fromX + facing * shiver * 0.004,
        lift: 0.018 - hush * 0.092,
        rot: facing * (0.85 + shiver * 1.45 + hush * 1.55),
        anim: "sleep" as TrickAnim,
      };
    }
    const s = smoothstep((u - 0.74) / 0.26);
    return {
      x: fromX,
      lift: 0.062 * (1 - s),
      rot: facing * (0.95 * (1 - s)),
      anim: "sit" as TrickAnim,
    };
  }
  export function limbPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.limb));
    if (u < 0.16) {
      const s = smoothstep(u / 0.16);
      return { x: fromX, lift: s * 0.042, rot: s * -2.15 * facing, anim: "talk" as TrickAnim };
    }
    if (u < 0.78) {
      const s = (u - 0.16) / 0.62;
      const reach = Math.sin(s * Math.PI * 2.45);
      const flare = Math.sin(s * Math.PI * 5.4) * 0.28;
      return {
        x: fromX + facing * reach * 0.006,
        lift: 0.048 + Math.abs(reach) * 0.052 + Math.abs(flare) * 0.014,
        rot: facing * (-2.95 + reach * 4.05 + flare),
        anim: "play" as TrickAnim,
      };
    }
    const s = smoothstep((u - 0.78) / 0.22);
    return {
      x: fromX,
      lift: 0.014 * (1 - s),
      rot: facing * (-0.62 * (1 - s)),
      anim: "sit" as TrickAnim,
    };
  }
export function stepTrick(trick: TerminatorTrick, dt: number, flags: TrickFlags): TerminatorTrick {
  if (!trick || trick.phase === "done") return trick;
  if (shouldAbort(flags) && trick.kind !== "belt" && trick.kind !== "penumbra" && trick.kind !== "eclipse" && trick.kind !== "limb") {
    return { ...trick, phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true };
  }
  const next: TerminatorTrick = { ...trick, t: trick.t + Math.max(0, dt) };
  if (next.kind === "limitor") {
    if (next.t < LIMITOR_HOLD) {
      const pose = limitorPose(next.t);
      next.phase = "hold";
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = "sit";
      return next;
    }
    if (next.t < LIMITOR_HOLD + RELEASE_S) {
      const pose = releasePose(next.t - LIMITOR_HOLD);
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
  if (next.kind === "belt") {
    const pose = beltPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "penumbra") {
    const pose = penumbraPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "eclipse") {
    const pose = eclipsePose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else {
    const pose = limbPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  }
  if (u >= 1) return { ...next, phase: "done", lift: 0, rot: 0, anim: "idle" };
  return next;
}
