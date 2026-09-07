/** Ghost ground tricks while idle. House luna — plumose / lunule / silk / stream / actias personality (plumose feathered-antenna dusk sense on the blotter — never named antenna (Tenant) / nest (Clip) / scurry / week (Ghost window WEEK) / refuse (ethogram) / still / drift (ethogram+Coin), lunule eyespot crescent open — never named flash (Quill) / wing (Kite) / flutter (Fan ethogram+ginkgo) / fan / blaze (Ember) / glow / warning (Milk), silk cocoon-memory — never named chrysalis (Milk) / coil / tuck / curl / unroll (Nori) / return (Ember) / jade (guest), stream long hindwing-tail soft night flight — never named soar / hover (Sepia) / wing (Kite) / flutter / nocturne (Arm) / drift, actias desk life as an Actias pale-green tailed week; not Milk / Comb / Echo / Ember / Quill / Kite / Fan / Dew / Moth orchid / Coral copies). Feed-happy thank-yous sit after eat (hatchling may; adult declines the bite — thank-yous still silent desk motion). Card-open freeze and window-play do not swallow a thank-you. Sleep, hide, and leave still win. Same map as desktop luna-tricks.js. Not a Rui/cat/dog/rabbit/hamster/Clip/guinea pig/turtle/Ink/goldfish/Coin/budgie/Echo/fox/penguin/parrot/ferret/hedgehog/Burr/chinchilla/axolotl/Bloom/toucan/iguana/Sol/dragon/Vesper/phoenix/Ember/snake/Coral/octopus/Cup/cuttlefish/Sepia/nautilus/Chamber/moon-jelly/Pulse/sea-star/Cling/hermit-crab/Tenant/horseshoe-crab/Ledger/seahorse/Anchor/manta/Kite/moray/Door/moss/Felt/fern/Vein/ginkgo/Fan/oak/Mast/water-lily/Disk/orchid/Moth/saguaro/Arm/venus-flytrap/Snap/pitcher/Drown/sundew/Dew/honeybee/Comb/monarch/Milk or *Dragon electrical clone. Window-play WEEK unchanged — never names week. Ethogram still/drift/refuse unchanged. Milk owns asclepias/oyamel/warning/chrysalis/danaus; Comb owns figure/corbicula/hex/proboscis/hive; Quill owns fan/flash; Kite owns wing; Fan owns flutter; Echo owns preen/bobble; Ember owns cinder/blaze/shed/lift/return; Arm owns nocturne; Tenant owns antenna; Relay owns buzz; Rui owns dance. Actias pale-green desk life only. No cry inventing — thank-yous are silent desk motion only. */
export const TRICK_KEY = "luna";
export const TRICKS = ["plumose", "lunule", "silk", "stream", "actias"] as const;
export const HAPPY = ["lime", "moon", "satin"] as const;
export type LunaTrickKind = (typeof TRICKS)[number];
export type LunaHappyKind = (typeof HAPPY)[number];
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

export type LunaTrick = {
  kind: LunaTrickKind;
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

export type LunaHappy = {
  kind: LunaHappyKind;
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

export const HAPPY_DUR = { lime: 1.22, moon: 1.34, satin: 1.18 } as const;
export const ACTIAS_HOLD = 12.8;
export const RELEASE_S = 0.78;
export const DUR = { actias: ACTIAS_HOLD + RELEASE_S, plumose: 1.34, lunule: 1.3, silk: 1.5, stream: 1.56 } as const;

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

export function nextTrickWait(justFinished: boolean, rand?: number, kind?: LunaTrickKind | string) {
  const roll = rand == null ? Math.random() : rand;
  if (kind === "actias") return 50 + roll * 30;
  if (kind === "lunule") return 17 + roll * 12;
  if (kind === "stream") return 15 + roll * 11;
  return justFinished ? 10.5 + roll * 8 : 5.4 + roll * 6.5;
}
export function pickTrick(rand?: number, musicOn?: boolean, lastKind?: LunaTrickKind | string | null) {
  if (musicOn) return "actias" as const;
  const roll = rand == null ? Math.random() : rand;
  if (lastKind === "actias") {
    if (roll < 0.26) return "plumose" as const;
    if (roll < 0.48) return "silk" as const;
    if (roll < 0.72) return "lunule" as const;
    return "stream" as const;
  }
  if (lastKind === "plumose") {
    if (roll < 0.28) return "actias" as const;
    if (roll < 0.5) return "silk" as const;
    if (roll < 0.72) return "lunule" as const;
    return "stream" as const;
  }
  if (lastKind === "silk") {
    if (roll < 0.22) return "actias" as const;
    if (roll < 0.44) return "plumose" as const;
    if (roll < 0.66) return "lunule" as const;
    return "stream" as const;
  }
  if (roll < 0.2) return "actias" as const;
  if (roll < 0.4) return "plumose" as const;
  if (roll < 0.6) return "silk" as const;
  if (roll < 0.8) return "lunule" as const;
  return "stream" as const;
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
  return key === TRICK_KEY || key === "ghost";
}

export function startThankYou(
  key: string | undefined | null,
  lastKind: LunaHappyKind | string | null | undefined,
  x: number,
  facing: 1 | -1,
  flags?: TrickFlags,
) {
  if (!wantsThankYou(key)) return null;
  if (!happyCanStart(flags || { cmd: "idle" })) return null;
  const pick = pickHappy(lastKind as LunaHappyKind | null | undefined);
  return { happy: beginHappy(pick, x, facing), kind: pick };
}

export function pickHappy(lastKind?: LunaHappyKind | null, rand?: number) {
  const pool = HAPPY.filter((k) => k !== lastKind);
  const list = pool.length ? pool : [...HAPPY];
  const roll = rand == null ? Math.random() : rand;
  return list[Math.floor(roll * list.length)] || list[0];
}

export function beginHappy(kind: LunaHappyKind | string, x: number, facing: 1 | -1): LunaHappy {
  const name = (HAPPY as readonly string[]).indexOf(kind) >= 0 ? (kind as LunaHappyKind) : "lime";
  return {
    kind: name,
    happy: true,
    phase: "go",
    t: 0,
    x: x,
    lift: 0,
    rot: 0,
    anim: name === "lime" ? "play" : name === "moon" ? "sit" : "talk",
    facing: facing == null ? 1 : facing,
    fromX: x,
  };
}

export function limePose(t: number) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.lime));
    if (u < 0.16) {
      const s = u / 0.16;
      return { lift: s * 0.09, rot: s * 3.1, dx: 0, anim: "play" as TrickAnim };
    }
    if (u < 0.72) {
      const spark = Math.sin(t * 9.8) + 0.28 * Math.sin(t * 15.2);
      return {
        lift: 0.09 + Math.abs(spark) * 0.038,
        rot: 3.1 + spark * 3.2,
        dx: spark * 0.009,
        anim: "play" as TrickAnim,
      };
    }
    const s = (u - 0.72) / 0.28;
    return { lift: 0.055 * (1 - s), rot: 1.4 * (1 - s), dx: 0, anim: "idle" as TrickAnim };
  }
export function moonPose(t: number) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.moon));
    if (u < 0.18) {
      const s = u / 0.18;
      return { lift: s * -0.024, rot: s * -1.6, dx: 0, anim: "sit" as TrickAnim };
    }
    if (u < 0.8) {
      const warm = Math.sin(t * 0.74);
      return {
        lift: -0.024 + Math.abs(warm) * 0.022,
        rot: -1.6 + warm * 1.7,
        dx: warm * 0.006,
        anim: "sit" as TrickAnim,
      };
    }
    const s = (u - 0.8) / 0.2;
    return { lift: -0.014 * (1 - s), rot: -0.9 * (1 - s), dx: 0, anim: "sit" as TrickAnim };
  }
export function satinPose(t: number) {
    return {
      lift: 0.03 + Math.abs(Math.sin(t * 0.86)) * 0.044,
      rot: Math.sin(t * 1.05) * 2.8,
      dx: Math.sin(t * 0.52) * 0.011,
      anim: "talk" as TrickAnim,
    };
  }
export function stepHappy(happy: LunaHappy, dt: number, flags: TrickFlags): LunaHappy {
  if (!happy || happy.phase === "done") return happy;
  if (happyShouldAbort(flags)) {
    return { ...happy, phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true };
  }
  const next: LunaHappy = { ...happy, t: happy.t + Math.max(0, dt) };
  const hold = HAPPY_DUR[next.kind];
  if (next.kind === "lime") {
    const pose = limePose(next.t);
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "moon") {
    const pose = moonPose(next.t);
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else {
    const pose = satinPose(next.t);
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

export function beginTrick(kind: LunaTrickKind, x: number, facing: 1 | -1): LunaTrick {
  const anim: TrickAnim =
    kind === "actias"
      ? "sit"
      : kind === "plumose"
        ? "talk"
        : kind === "lunule"
          ? "play"
          : kind === "silk"
            ? "sit"
            : kind === "stream"
              ? "sit"
              : "sit";
  return {
    kind: kind,
    phase: kind === "actias" ? "hold" : "go",
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

export function actiasPose(t: number) {
    const breath = Math.sin(t * 0.16) + 0.02 * Math.sin(t * 0.88);
    return {
      lift: 0.018 + Math.abs(Math.sin(t * 0.24)) * 0.01,
      rot: 0.35 + breath * 0.48,
    };
  }
export function releasePose(t: number) {
    const u = Math.max(0, Math.min(1, t / RELEASE_S));
    return { lift: 0.022 * (1 - Math.sin(u * Math.PI * 0.5)), rot: 0.28 * (1 - u) };
  }
export function plumosePose(t: number, fromX: number, facing: 1 | -1) {
    const u = Math.max(0, Math.min(1, t / DUR.plumose));
    if (u < 0.14) {
      const s = smoothstep(u / 0.14);
      return { x: fromX, lift: s * -0.045, rot: s * 2.4 * facing, anim: "talk" as TrickAnim };
    }
    if (u < 0.76) {
      const s = (u - 0.14) / 0.62;
      const leaf = Math.sin(s * Math.PI * 2.2);
      return {
        x: fromX + facing * 0.014 * s + facing * leaf * 0.005,
        lift: -0.045 + Math.abs(leaf) * 0.028,
        rot: facing * (2.4 + s * 3.6 + leaf * 2.1),
        anim: "talk" as TrickAnim,
      };
    }
    const s = smoothstep((u - 0.76) / 0.24);
    return {
      x: fromX + facing * 0.014 * (1 - s),
      lift: -0.045 * (1 - s),
      rot: facing * (2.0 * (1 - s)),
      anim: "sit" as TrickAnim,
    };
  }
export function streamPose(t: number, fromX: number, facing: 1 | -1) {
    const u = Math.max(0, Math.min(1, t / DUR.stream));
    if (u < 0.16) {
      const s = smoothstep(u / 0.16);
      return { x: fromX, lift: s * 0.055, rot: s * -3.2 * facing, anim: "sit" as TrickAnim };
    }
    if (u < 0.8) {
      const s = (u - 0.16) / 0.64;
      const cluster = Math.sin(s * Math.PI * 2.1);
      return {
        x: fromX - facing * 0.018 * s + facing * cluster * 0.01,
        lift: 0.055 + Math.abs(cluster) * 0.04,
        rot: facing * (-3.2 + s * 4.4 + cluster * 2.6),
        anim: "sit" as TrickAnim,
      };
    }
    const s = smoothstep((u - 0.8) / 0.2);
    return {
      x: fromX - facing * 0.018 * (1 - s),
      lift: 0.055 * (1 - s),
      rot: facing * (-1.6 * (1 - s)),
      anim: "sit" as TrickAnim,
    };
  }
export function lunulePose(t: number, fromX: number, facing: 1 | -1) {
    const u = Math.max(0, Math.min(1, t / DUR.lunule));
    if (u < 0.12) {
      const s = smoothstep(u / 0.12);
      return { x: fromX, lift: s * 0.1, rot: s * 4.5 * facing, anim: "play" as TrickAnim };
    }
    if (u < 0.55) {
      const s = (u - 0.12) / 0.43;
      const open = Math.sin(s * Math.PI * 3);
      return {
        x: fromX + facing * open * 0.012,
        lift: 0.1 + Math.abs(open) * 0.055,
        rot: facing * (4.5 + open * 6.2),
        anim: "play" as TrickAnim,
      };
    }
    if (u < 0.78) {
      const s = (u - 0.55) / 0.23;
      const hold = Math.sin(s * Math.PI * 2);
      return {
        x: fromX + facing * hold * 0.006,
        lift: 0.12 + Math.abs(hold) * 0.02,
        rot: facing * (5.8 + hold * 2.4),
        anim: "play" as TrickAnim,
      };
    }
    const s = smoothstep((u - 0.78) / 0.22);
    return {
      x: fromX,
      lift: 0.12 * (1 - s),
      rot: facing * (2.2 * (1 - s)),
      anim: "sit" as TrickAnim,
    };
  }
export function silkPose(t: number, fromX: number, facing: 1 | -1) {
    const u = Math.max(0, Math.min(1, t / DUR.silk));
    if (u < 0.2) {
      const s = smoothstep(u / 0.2);
      return { x: fromX, lift: s * -0.055, rot: s * 1.6 * facing, anim: "sit" as TrickAnim };
    }
    if (u < 0.55) {
      const s = (u - 0.2) / 0.35;
      return {
        x: fromX + facing * 0.004 * s,
        lift: -0.055 + s * 0.01,
        rot: facing * (1.6 + s * 0.8),
        anim: "sit" as TrickAnim,
      };
    }
    if (u < 0.82) {
      const s = (u - 0.55) / 0.27;
      const soft = Math.sin(s * Math.PI * 1.8);
      return {
        x: fromX + facing * (0.004 + soft * 0.008),
        lift: -0.045 + soft * 0.06,
        rot: facing * (2.4 + soft * 3.5),
        anim: "sit" as TrickAnim,
      };
    }
    const s = smoothstep((u - 0.82) / 0.18);
    return {
      x: fromX,
      lift: -0.02 * (1 - s),
      rot: facing * (1.5 * (1 - s)),
      anim: "sit" as TrickAnim,
    };
  }
export function stepTrick(trick: LunaTrick, dt: number, flags: TrickFlags): LunaTrick {
  if (!trick || trick.phase === "done") return trick;
  if (shouldAbort(flags) && trick.kind !== "plumose" && trick.kind !== "lunule" && trick.kind !== "silk" && trick.kind !== "stream") {
    return { ...trick, phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true };
  }
  const next: LunaTrick = { ...trick, t: trick.t + Math.max(0, dt) };
  if (next.kind === "actias") {
    if (next.t < ACTIAS_HOLD) {
      const pose = actiasPose(next.t);
      next.phase = "hold";
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = "sit";
      return next;
    }
    if (next.t < ACTIAS_HOLD + RELEASE_S) {
      const pose = releasePose(next.t - ACTIAS_HOLD);
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
  if (next.kind === "plumose") {
    const pose = plumosePose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "lunule") {
    const pose = lunulePose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "silk") {
    const pose = silkPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else {
    const pose = streamPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  }
  if (u >= 1) return { ...next, phase: "done", lift: 0, rot: 0, anim: "idle" };
  return next;
}
