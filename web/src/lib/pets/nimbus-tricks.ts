/** Drift ground tricks while idle. House neighborly alien methane-floater FLOAT life — waft / billow / cirrus / virga / stratus personality (soft methane-cloud desk weather — never named float or still or hover or drift or cloud or mist or fog or haze or puff or nimbus as trick kinds; window-play FLOAT + ethogram float/still/hover own those words; guest slug Drift / key nimbus only for isKey matching — accept "nimbus" and "drift"; do NOT name a trick "nimbus" or "drift") — not Choir waft/billow/cirrus/virga/stratus chord-body, not Gleam photon/wavelength/lumen/glass/photovore lamp-drinker, not Pulse bell/oral/lucent/trail/medusa jelly, not Pact podetium/photobiont/fruticose/stone/cladonia plaque, not Starter bud/proof/levain/ferment/saccharomyces bloom, not Flame sulfur/rosette/oak/soft/laetiporus drip, not Puff ostiole/gleba/peridium/duff/lycoperdon cloud, not Mane spine/icicle/cascade/wound/hericium teeth, not Ring pore/bracket/band/leathery/trametes underside, not Frill lamella/imbricate/lasso/margin/pleurotus oyster, not Cap annulus/volva/veil/symbiont/amanita, not Wax tessera/hex honeycomb, not Spark firefly lantern, not Coin goldfish drift; never named float (window-play FLOAT — never a trick kind) / still (ethogram) / hover (ethogram + Sepia) / drift (guest name + Coin goldfish trick — never a trick kind) / cloud (Puff window) / mist (Vein happy) / fog / haze / puff (Ferret + Puff guest) / dust (Floss window) / rain (Drown happy) / chord (Choir window) / thirst (Gleam window) / drink (Gleam ethogram) / drone (Hum window) / pulse (ethogram + Pulse guest) / gleam (Ground happy + Gleam guest) / shine (Ember) / glint (Coin) / sheen (Sheen + Disk) / dig (Thimble) / nest (Clip) / bank (Lula + Bank) / buzz (Relay) / dance (Rui) / plaque (Pact) / share (Pact) / bloom (Starter) / loaf / photon / wavelength / lumen / glass / actinic / lux / candela / waft / billow / cirrus / virga / stratus / zephyr / fogbow / mizzle — Echo/Quill are birds with sound — do not copy their tricks. waft soft methane air slide across the blotter, billow soft swell lift, cirrus thin high filament tip, virga rain-that-never-lands evaporate hush, stratus long layered hold desk life as methane floater (not Choir chord-body, not Gleam lamp-drinker, not Pulse jelly, not Puff spore cloud) with zephyr / fogbow / mizzle cousins in the thank-yous. Feed-happy thank-yous sit after eat. Card-open freeze and window-play FLOAT do not swallow a thank-you. Sleep, hide, and leave still win. Same map as web nimbus-tricks.ts. Window-play FLOAT unchanged — never names float. Ethogram float/still/hover unchanged — never names float or hover as trick kinds. True alien methane-cloud desk weather only — soft haze life without naming haze. Shard owns the next seat. No cry inventing — thank-yous are silent desk motion only. */
export const TRICK_KEY = "nimbus";
export const TRICKS = ["waft", "billow", "cirrus", "virga", "stratus"] as const;
export const HAPPY = ["zephyr", "fogbow", "mizzle"] as const;
export type NimbusTrickKind = (typeof TRICKS)[number];
export type NimbusHappyKind = (typeof HAPPY)[number];
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

export type NimbusTrick = {
  kind: NimbusTrickKind;
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

export type NimbusHappy = {
  kind: NimbusHappyKind;
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

export const HAPPY_DUR = { zephyr: 1.61, fogbow: 1.67, mizzle: 1.74 } as const;
export const STRATUS_HOLD = 16.84;
export const RELEASE_S = 1.01;
export const DUR = { stratus: STRATUS_HOLD + RELEASE_S, waft: 2.17, billow: 2.29, cirrus: 1.91, virga: 2.05 } as const;
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

export function nextTrickWait(justFinished: boolean, rand?: number, kind?: NimbusTrickKind | string) {
  const roll = rand == null ? Math.random() : rand;
    if (kind === "stratus") return 65 + roll * 41;
  if (kind === "waft") return 17.2 + roll * 12.8;
  if (kind === "billow") return 21.3 + roll * 13.8;
  if (kind === "cirrus") return 18.2 + roll * 14.9;
  return justFinished ? 12.8 + roll * 10.1 : 7.3 + roll * 8.7;
}

export function pickTrick(rand?: number, musicOn?: boolean, lastKind?: NimbusTrickKind | string | null) {
  if (musicOn) return "stratus";
  const roll = rand == null ? Math.random() : rand;
  if (lastKind === "stratus") {
    if (roll < 0.26) return "waft";
    if (roll < 0.5) return "billow";
    if (roll < 0.74) return "virga";
    return "cirrus";
  }
  if (lastKind === "waft") {
    if (roll < 0.26) return "stratus";
    if (roll < 0.5) return "billow";
    if (roll < 0.74) return "virga";
    return "cirrus";
  }
  if (lastKind === "billow") {
    if (roll < 0.22) return "stratus";
    if (roll < 0.44) return "waft";
    if (roll < 0.68) return "virga";
    return "cirrus";
  }
  if (roll < 0.2) return "stratus";
  if (roll < 0.4) return "waft";
  if (roll < 0.6) return "billow";
  if (roll < 0.8) return "virga";
  return "cirrus";
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
  return key === TRICK_KEY || key === "drift";
}

export function startThankYou(
  key: string | undefined | null,
  lastKind: NimbusHappyKind | string | null | undefined,
  x: number,
  facing: 1 | -1,
  flags?: TrickFlags,
) {
  if (!wantsThankYou(key)) return null;
  if (!happyCanStart(flags || { cmd: "idle" })) return null;
  const pick = pickHappy(lastKind as NimbusHappyKind | null | undefined);
  return { happy: beginHappy(pick, x, facing), kind: pick };
}

export function pickHappy(lastKind?: NimbusHappyKind | null, rand?: number) {
  const pool = HAPPY.filter((k) => k !== lastKind);
  const list = pool.length ? pool : [...HAPPY];
  const roll = rand == null ? Math.random() : rand;
  return list[Math.floor(roll * list.length)] || list[0];
}

export function beginHappy(kind: NimbusHappyKind | string, x: number, facing: 1 | -1): NimbusHappy {
  const name = (HAPPY as readonly string[]).indexOf(kind) >= 0 ? (kind as NimbusHappyKind) : "zephyr";
  return {
    kind: name,
    happy: true,
    phase: "go",
    t: 0,
    x: x,
    lift: 0,
    rot: 0,
    anim: name === "zephyr" ? "talk" : name === "fogbow" ? "play" : "sit",
    facing: facing == null ? 1 : facing,
    fromX: x,
  };
}

export function zephyrPose(t) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.zephyr));
    if (u < 0.14) {
      const s = u / 0.14;
      return { lift: s * 0.055, rot: s * 3.45, dx: 0, anim: "talk" as TrickAnim };
    }
    if (u < 0.76) {
      const tick = Math.sin(t * 13.8) + 0.32 * Math.sin(t * 27.2);
      return {
        lift: 0.055 + Math.abs(tick) * 0.023,
        rot: 3.45 + tick * 2.38,
        dx: tick * 0.0024,
        anim: "talk" as TrickAnim,
      };
    }
    const s = (u - 0.76) / 0.24;
    return { lift: 0.022 * (1 - s), rot: 1.1 * (1 - s), dx: 0, anim: "idle" as TrickAnim };
  }
export function fogbowPose(t) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.fogbow));
    if (u < 0.15) {
      const s = u / 0.15;
      return { lift: s * 0.071, rot: s * -4.25, dx: s * 0.003, anim: "play" as TrickAnim };
    }
    if (u < 0.8) {
      const flash = Math.sin(t * 6.8) + 0.30 * Math.sin(t * 13.0);
      return {
        lift: 0.071 + Math.abs(flash) * 0.031,
        rot: -4.25 + flash * 5.05,
        dx: flash * 0.0048,
        anim: "play" as TrickAnim,
      };
    }
    const s = (u - 0.8) / 0.2;
    return { lift: 0.024 * (1 - s), rot: -1.4 * (1 - s), dx: 0, anim: "sit" as TrickAnim };
  }
export function mizzlePose(t) {
    return {
      lift: 0.014 + Math.abs(Math.sin(t * 0.46)) * 0.013,
      rot: Math.sin(t * 0.54) * 1.20,
      dx: Math.sin(t * 0.34) * 0.0023,
      anim: "sit" as TrickAnim,
    };
  }
export function stepHappy(happy: NimbusHappy, dt: number, flags: TrickFlags): NimbusHappy {
  if (!happy || happy.phase === "done") return happy;
  if (happyShouldAbort(flags)) {
    return { ...happy, phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true };
  }
  const next: NimbusHappy = { ...happy, t: happy.t + Math.max(0, dt) };
  const hold = HAPPY_DUR[next.kind];
  if (next.kind === "zephyr") {
    const pose = zephyrPose(next.t);
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "fogbow") {
    const pose = fogbowPose(next.t);
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else {
    const pose = mizzlePose(next.t);
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

export function beginTrick(kind: NimbusTrickKind, x: number, facing: 1 | -1): NimbusTrick {
  const anim: TrickAnim =
    kind === "stratus"
    ? "sit"
    : kind === "waft"
      ? "play"
      : kind === "billow"
        ? "talk"
        : kind === "virga"
          ? "talk"
          : kind === "cirrus"
            ? "sit"
              : "sit";
  return {
    kind: kind,
    phase: kind === "stratus" ? "hold" : "go",
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


  export function stratusPose(t) {
    const breath = Math.sin(t * 0.17) + 0.071 * Math.sin(t * 0.49);
    const grit = Math.abs(Math.sin(t * 0.23));
    return {
      lift: 0.028 + grit * 0.022,
      rot: -0.41 + breath * 0.71,
    };
  }

  export function releasePose(t) {
    const u = Math.max(0, Math.min(1, t / RELEASE_S));
    return { lift: 0.017 * (1 - Math.sin(u * Math.PI * 0.5)), rot: -0.48 * (1 - u) };
  }

  export function waftPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.waft));
    if (u < 0.12) {
      const s = smoothstep(u / 0.12);
      return { x: fromX, lift: s * -0.018, rot: s * 1.35 * facing, anim: "sit" as TrickAnim };
    }
    if (u < 0.72) {
      const s = (u - 0.12) / 0.6;
      const bite = Math.sin(s * Math.PI * 4.9);
      const deepen = smoothstep(s);
      return {
        x: fromX + facing * deepen * 0.028,
        lift: -0.031 - Math.abs(bite) * 0.022 - deepen * 0.014,
        rot: facing * (1.65 + bite * 2.85),
        anim: "talk" as TrickAnim,
      };
    }
    const s = smoothstep((u - 0.72) / 0.28);
    return {
      x: fromX + facing * 0.01 * (1 - s),
      lift: -0.018 * (1 - s),
      rot: facing * (0.8 * (1 - s)),
      anim: "sit" as TrickAnim,
    };
  }
  export function billowPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.billow));
    if (u < 0.14) {
      const s = smoothstep(u / 0.14);
      return { x: fromX, lift: s * 0.062, rot: s * -2.55 * facing, anim: "talk" as TrickAnim };
    }
    if (u < 0.58) {
      const s = (u - 0.14) / 0.44;
      const pack = Math.sin(s * Math.PI * 4.5);
      return {
        x: fromX + facing * (0.02 + Math.abs(pack) * 0.012),
        lift: 0.072 + Math.abs(pack) * 0.038,
        rot: facing * (-3.55 + pack * 5.65),
        anim: "play" as TrickAnim,
      };
    }
    if (u < 0.88) {
      const s = (u - 0.58) / 0.3;
      const press = smoothstep(s);
      return {
        x: fromX + facing * 0.028,
        lift: 0.035 - press * 0.04,
        rot: facing * (2.2 - press * 4.0),
        anim: "talk" as TrickAnim,
      };
    }
    const s = smoothstep((u - 0.88) / 0.12);
    return {
      x: fromX + facing * 0.016 * (1 - s),
      lift: -0.008 * (1 - s),
      rot: facing * (0.6 * (1 - s)),
      anim: "sit" as TrickAnim,
    };
  }
  export function virgaPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.virga));
    if (u < 0.22) {
      const s = smoothstep(u / 0.22);
      return { x: fromX, lift: 0.041 + s * -0.012, rot: s * 1.22 * facing, anim: "sit" as TrickAnim };
    }
    if (u < 0.7) {
      const s = (u - 0.22) / 0.48;
      const liftUp = smoothstep(s);
      const shake = Math.sin(s * Math.PI * 3.25);
      return {
        x: fromX + facing * shake * 0.006,
        lift: 0.038 - liftUp * 0.092,
        rot: facing * (1.02 + shake * 2.85 + liftUp * 2.05),
        anim: "play" as TrickAnim,
      };
    }
    const s = smoothstep((u - 0.7) / 0.3);
    return {
      x: fromX,
      lift: 0.08 * (1 - s),
      rot: facing * (1.4 * (1 - s)),
      anim: "sit" as TrickAnim,
    };
  }
  export function cirrusPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.cirrus));
    if (u < 0.16) {
      const s = smoothstep(u / 0.16);
      return { x: fromX, lift: s * 0.033, rot: s * -2.15 * facing, anim: "talk" as TrickAnim };
    }
    if (u < 0.84) {
      const s = (u - 0.16) / 0.68;
      const glance = Math.sin(s * Math.PI * 2.45);
      const velour = Math.sin(s * Math.PI * 5.7) * 0.31;
      return {
        x: fromX + facing * glance * 0.004,
        lift: 0.031 + Math.abs(velour) * 0.009,
        rot: facing * (-2.95 + glance * 4.75 + velour),
        anim: "talk" as TrickAnim,
      };
    }
    const s = smoothstep((u - 0.84) / 0.16);
    return {
      x: fromX,
      lift: 0.01 * (1 - s),
      rot: facing * (-0.8 * (1 - s)),
      anim: "sit" as TrickAnim,
    };
  }
export function stepTrick(trick: NimbusTrick, dt: number, flags: TrickFlags): NimbusTrick {
  if (!trick || trick.phase === "done") return trick;
  if (shouldAbort(flags) && trick.kind !== "waft" && trick.kind !== "billow" && trick.kind !== "virga" && trick.kind !== "cirrus") {
    return { ...trick, phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true };
  }
  const next: NimbusTrick = { ...trick, t: trick.t + Math.max(0, dt) };
  if (next.kind === "stratus") {
    if (next.t < STRATUS_HOLD) {
      const pose = stratusPose(next.t);
      next.phase = "hold";
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = "sit";
      return next;
    }
    if (next.t < STRATUS_HOLD + RELEASE_S) {
      const pose = releasePose(next.t - STRATUS_HOLD);
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
  if (next.kind === "waft") {
    const pose = waftPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "billow") {
    const pose = billowPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "virga") {
    const pose = virgaPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else {
    const pose = cirrusPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  }
  if (u >= 1) return { ...next, phase: "done", lift: 0, rot: 0, anim: "idle" };
  return next;
}
