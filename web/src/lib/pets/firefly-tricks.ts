/** Spark ground tricks while idle. House firefly — lantern / jstroke / semaphore / elytra / photinus personality (lantern belly-organ soft pulse on the blotter — never named flash (Quill+ethogram+window Flash) / glow (Dragon happy+window GLOW) / blaze (Ember) / lift (Ember+ethogram) / warning (Milk) / lunule (Ghost), jstroke Photinus J-path courtship flight — never named soar / hover (Sepia) / wing (Kite) / flutter (Fan) / stream (Ghost) / dart (Coin+ethogram still uses still), semaphore mate answer-code timing — never named flash / code / signal / buzz (Relay) / click (Relay) / spark (Relay happy), elytra soft dusk cover-wing settle — never named silk (Ghost) / plumose (Ghost) / fan / wing / nocturne (Arm), photinus desk life as a Photinus pyralis Lampyridae beetle week; not Ghost / Milk / Comb / Echo / Ember / Quill / Kite / Fan / Dew / Pulse / Relay copies). Feed-happy thank-yous sit after eat. Card-open freeze and window-play do not swallow a thank-you. Sleep, hide, and leave still win. Same map as desktop firefly-tricks.js. Not a Rui/cat/dog/rabbit/hamster/Clip/guinea pig/turtle/Ink/goldfish/Coin/budgie/Echo/fox/penguin/parrot/ferret/hedgehog/Burr/chinchilla/axolotl/Bloom/toucan/iguana/Sol/dragon/Vesper/phoenix/Ember/snake/Coral/octopus/Cup/cuttlefish/Sepia/nautilus/Chamber/moon-jelly/Pulse/sea-star/Cling/hermit-crab/Tenant/horseshoe-crab/Ledger/seahorse/Anchor/manta/Kite/moray/Door/moss/Felt/fern/Vein/ginkgo/Fan/oak/Mast/water-lily/Disk/orchid/Moth/saguaro/Arm/venus-flytrap/Snap/pitcher/Drown/sundew/Dew/honeybee/Comb/monarch/Milk/luna/Ghost or *Dragon electrical clone. Window-play Flash/GLOW unchanged — never names flash or glow. Ethogram flash/lift/still unchanged. Ghost owns plumose/lunule/silk/stream/actias; Milk owns asclepias/oyamel/warning/chrysalis/danaus; Comb owns figure/corbicula/hex/proboscis/hive; Quill owns fan/flash; Kite owns wing; Fan owns flutter; Echo owns preen/bobble; Ember owns cinder/blaze/shed/lift/return; Sepia owns hover; Relay owns buzz/click and happy spark; Rui owns dance; Pulse guest owns moon-jelly; Dragon happy owns glow. Lampyridae Photinus desk life only. No cry inventing — thank-yous are silent desk motion only. */
export const TRICK_KEY = "firefly";
export const TRICKS = ["lantern", "jstroke", "semaphore", "elytra", "photinus"] as const;
export const HAPPY = ["luciferin", "candela", "pyralis"] as const;
export type FireflyTrickKind = (typeof TRICKS)[number];
export type FireflyHappyKind = (typeof HAPPY)[number];
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

export type FireflyTrick = {
  kind: FireflyTrickKind;
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

export type FireflyHappy = {
  kind: FireflyHappyKind;
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

export const HAPPY_DUR = { luciferin: 1.2, candela: 1.36, pyralis: 1.24 } as const;
export const PHOTINUS_HOLD = 12.4;
export const RELEASE_S = 0.76;
export const DUR = { photinus: PHOTINUS_HOLD + RELEASE_S, lantern: 1.32, jstroke: 1.58, semaphore: 1.44, elytra: 1.5 } as const;

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

export function nextTrickWait(justFinished: boolean, rand?: number, kind?: FireflyTrickKind | string) {
  const roll = rand == null ? Math.random() : rand;
  if (kind === "photinus") return 48 + roll * 32;
  if (kind === "semaphore") return 16 + roll * 12;
  if (kind === "jstroke") return 14 + roll * 11;
  return justFinished ? 10.2 + roll * 8 : 5.2 + roll * 6.8;
}
export function pickTrick(rand?: number, musicOn?: boolean, lastKind?: FireflyTrickKind | string | null) {
  if (musicOn) return "photinus" as const;
  const roll = rand == null ? Math.random() : rand;
  if (lastKind === "photinus") {
    if (roll < 0.26) return "lantern" as const;
    if (roll < 0.48) return "jstroke" as const;
    if (roll < 0.72) return "semaphore" as const;
    return "elytra" as const;
  }
  if (lastKind === "lantern") {
    if (roll < 0.28) return "photinus" as const;
    if (roll < 0.5) return "jstroke" as const;
    if (roll < 0.72) return "semaphore" as const;
    return "elytra" as const;
  }
  if (lastKind === "jstroke") {
    if (roll < 0.22) return "photinus" as const;
    if (roll < 0.44) return "lantern" as const;
    if (roll < 0.66) return "semaphore" as const;
    return "elytra" as const;
  }
  if (roll < 0.2) return "photinus" as const;
  if (roll < 0.4) return "lantern" as const;
  if (roll < 0.6) return "jstroke" as const;
  if (roll < 0.8) return "semaphore" as const;
  return "elytra" as const;
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
  return key === TRICK_KEY || key === "spark";
}

export function startThankYou(
  key: string | undefined | null,
  lastKind: FireflyHappyKind | string | null | undefined,
  x: number,
  facing: 1 | -1,
  flags?: TrickFlags,
) {
  if (!wantsThankYou(key)) return null;
  if (!happyCanStart(flags || { cmd: "idle" })) return null;
  const pick = pickHappy(lastKind as FireflyHappyKind | null | undefined);
  return { happy: beginHappy(pick, x, facing), kind: pick };
}

export function pickHappy(lastKind?: FireflyHappyKind | null, rand?: number) {
  const pool = HAPPY.filter((k) => k !== lastKind);
  const list = pool.length ? pool : [...HAPPY];
  const roll = rand == null ? Math.random() : rand;
  return list[Math.floor(roll * list.length)] || list[0];
}

export function beginHappy(kind: FireflyHappyKind | string, x: number, facing: 1 | -1): FireflyHappy {
  const name = (HAPPY as readonly string[]).indexOf(kind) >= 0 ? (kind as FireflyHappyKind) : "luciferin";
  return {
    kind: name,
    happy: true,
    phase: "go",
    t: 0,
    x: x,
    lift: 0,
    rot: 0,
    anim: name === "luciferin" ? "play" : name === "candela" ? "sit" : "talk",
    facing: facing == null ? 1 : facing,
    fromX: x,
  };
}

export function luciferinPose(t: number) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.luciferin));
    if (u < 0.14) {
      const s = u / 0.14;
      return { lift: s * 0.11, rot: s * 2.6, dx: 0, anim: "play" as TrickAnim };
    }
    if (u < 0.7) {
      const blink = Math.sin(t * 14.5) + 0.22 * Math.sin(t * 22.1);
      return {
        lift: 0.11 + Math.abs(blink) * 0.042,
        rot: 2.6 + blink * 2.8,
        dx: blink * 0.007,
        anim: "play" as TrickAnim,
      };
    }
    const s = (u - 0.7) / 0.3;
    return { lift: 0.06 * (1 - s), rot: 1.2 * (1 - s), dx: 0, anim: "idle" as TrickAnim };
  }
export function candelaPose(t: number) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.candela));
    if (u < 0.2) {
      const s = u / 0.2;
      return { lift: s * -0.02, rot: s * -1.4, dx: 0, anim: "sit" as TrickAnim };
    }
    if (u < 0.82) {
      const warm = Math.sin(t * 0.68);
      return {
        lift: -0.02 + Math.abs(warm) * 0.026,
        rot: -1.4 + warm * 1.5,
        dx: warm * 0.005,
        anim: "sit" as TrickAnim,
      };
    }
    const s = (u - 0.82) / 0.18;
    return { lift: -0.012 * (1 - s), rot: -0.8 * (1 - s), dx: 0, anim: "sit" as TrickAnim };
  }
export function pyralisPose(t: number) {
    return {
      lift: 0.028 + Math.abs(Math.sin(t * 0.92)) * 0.04,
      rot: Math.sin(t * 1.12) * 2.5,
      dx: Math.sin(t * 0.48) * 0.01,
      anim: "talk" as TrickAnim,
    };
  }
export function stepHappy(happy: FireflyHappy, dt: number, flags: TrickFlags): FireflyHappy {
  if (!happy || happy.phase === "done") return happy;
  if (happyShouldAbort(flags)) {
    return { ...happy, phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true };
  }
  const next: FireflyHappy = { ...happy, t: happy.t + Math.max(0, dt) };
  const hold = HAPPY_DUR[next.kind];
  if (next.kind === "luciferin") {
    const pose = luciferinPose(next.t);
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "candela") {
    const pose = candelaPose(next.t);
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else {
    const pose = pyralisPose(next.t);
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

export function beginTrick(kind: FireflyTrickKind, x: number, facing: 1 | -1): FireflyTrick {
  const anim: TrickAnim =
    kind === "photinus"
      ? "sit"
      : kind === "lantern"
        ? "play"
        : kind === "jstroke"
          ? "sit"
          : kind === "semaphore"
            ? "talk"
            : kind === "elytra"
              ? "sit"
              : "sit";
  return {
    kind: kind,
    phase: kind === "photinus" ? "hold" : "go",
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

export function photinusPose(t: number) {
    const breath = Math.sin(t * 0.18) + 0.03 * Math.sin(t * 1.1);
    const lamp = Math.abs(Math.sin(t * 0.55));
    return {
      lift: 0.022 + lamp * 0.014,
      rot: 0.28 + breath * 0.52,
    };
  }
export function releasePose(t: number) {
    const u = Math.max(0, Math.min(1, t / RELEASE_S));
    return { lift: 0.028 * (1 - Math.sin(u * Math.PI * 0.5)), rot: 0.3 * (1 - u) };
  }
export function lanternPose(t: number, fromX: number, facing: 1 | -1) {
    const u = Math.max(0, Math.min(1, t / DUR.lantern));
    if (u < 0.12) {
      const s = smoothstep(u / 0.12);
      return { x: fromX, lift: s * 0.12, rot: s * 3.4 * facing, anim: "play" as TrickAnim };
    }
    if (u < 0.72) {
      const s = (u - 0.12) / 0.6;
      const pulse = Math.sin(s * Math.PI * 4.2);
      return {
        x: fromX + facing * pulse * 0.006,
        lift: 0.12 + Math.abs(pulse) * 0.05,
        rot: facing * (3.4 + pulse * 4.8),
        anim: "play" as TrickAnim,
      };
    }
    const s = smoothstep((u - 0.72) / 0.28);
    return {
      x: fromX,
      lift: 0.12 * (1 - s),
      rot: facing * (1.8 * (1 - s)),
      anim: "sit" as TrickAnim,
    };
  }
export function jstrokePose(t: number, fromX: number, facing: 1 | -1) {
    const u = Math.max(0, Math.min(1, t / DUR.jstroke));
    if (u < 0.18) {
      const s = smoothstep(u / 0.18);
      return { x: fromX + facing * 0.02 * s, lift: s * 0.04, rot: s * -2.2 * facing, anim: "sit" as TrickAnim };
    }
    if (u < 0.55) {
      const s = (u - 0.18) / 0.37;
      const arc = Math.sin(s * Math.PI * 0.5);
      return {
        x: fromX + facing * (0.02 + 0.04 * s),
        lift: 0.04 + arc * 0.1,
        rot: facing * (-2.2 + s * 5.5),
        anim: "sit" as TrickAnim,
      };
    }
    if (u < 0.82) {
      const s = (u - 0.55) / 0.27;
      const hook = Math.sin(s * Math.PI);
      return {
        x: fromX + facing * (0.06 - 0.05 * s) + facing * hook * 0.012,
        lift: 0.14 - s * 0.06 + Math.abs(hook) * 0.03,
        rot: facing * (3.3 + hook * 3.6),
        anim: "sit" as TrickAnim,
      };
    }
    const s = smoothstep((u - 0.82) / 0.18);
    return {
      x: fromX + facing * 0.01 * (1 - s),
      lift: 0.08 * (1 - s),
      rot: facing * (1.4 * (1 - s)),
      anim: "sit" as TrickAnim,
    };
  }
export function semaphorePose(t: number, fromX: number, facing: 1 | -1) {
    const u = Math.max(0, Math.min(1, t / DUR.semaphore));
    if (u < 0.1) {
      const s = smoothstep(u / 0.1);
      return { x: fromX, lift: s * 0.06, rot: s * 2.2 * facing, anim: "talk" as TrickAnim };
    }
    if (u < 0.78) {
      const s = (u - 0.1) / 0.68;
      const code = Math.sin(s * Math.PI * 6.5) + 0.35 * Math.sin(s * Math.PI * 11);
      return {
        x: fromX + facing * code * 0.01,
        lift: 0.06 + Math.abs(code) * 0.045,
        rot: facing * (2.2 + code * 5.4),
        anim: "talk" as TrickAnim,
      };
    }
    const s = smoothstep((u - 0.78) / 0.22);
    return {
      x: fromX,
      lift: 0.06 * (1 - s),
      rot: facing * (1.2 * (1 - s)),
      anim: "sit" as TrickAnim,
    };
  }
export function elytraPose(t: number, fromX: number, facing: 1 | -1) {
    const u = Math.max(0, Math.min(1, t / DUR.elytra));
    if (u < 0.16) {
      const s = smoothstep(u / 0.16);
      return { x: fromX, lift: s * -0.04, rot: s * 1.8 * facing, anim: "sit" as TrickAnim };
    }
    if (u < 0.5) {
      const s = (u - 0.16) / 0.34;
      return {
        x: fromX + facing * 0.006 * s,
        lift: -0.04 + s * 0.02,
        rot: facing * (1.8 + s * 1.2),
        anim: "sit" as TrickAnim,
      };
    }
    if (u < 0.84) {
      const s = (u - 0.5) / 0.34;
      const soft = Math.sin(s * Math.PI * 2.2);
      return {
        x: fromX + facing * (0.006 + soft * 0.008),
        lift: -0.02 + soft * 0.055,
        rot: facing * (3.0 + soft * 3.2),
        anim: "sit" as TrickAnim,
      };
    }
    const s = smoothstep((u - 0.84) / 0.16);
    return {
      x: fromX,
      lift: -0.015 * (1 - s),
      rot: facing * (1.3 * (1 - s)),
      anim: "sit" as TrickAnim,
    };
  }
export function stepTrick(trick: FireflyTrick, dt: number, flags: TrickFlags): FireflyTrick {
  if (!trick || trick.phase === "done") return trick;
  if (shouldAbort(flags) && trick.kind !== "lantern" && trick.kind !== "jstroke" && trick.kind !== "semaphore" && trick.kind !== "elytra") {
    return { ...trick, phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true };
  }
  const next: FireflyTrick = { ...trick, t: trick.t + Math.max(0, dt) };
  if (next.kind === "photinus") {
    if (next.t < PHOTINUS_HOLD) {
      const pose = photinusPose(next.t);
      next.phase = "hold";
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = "sit";
      return next;
    }
    if (next.t < PHOTINUS_HOLD + RELEASE_S) {
      const pose = releasePose(next.t - PHOTINUS_HOLD);
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
  if (next.kind === "lantern") {
    const pose = lanternPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "jstroke") {
    const pose = jstrokePose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "semaphore") {
    const pose = semaphorePose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else {
    const pose = elytraPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  }
  if (u >= 1) return { ...next, phase: "done", lift: 0, rot: 0, anim: "idle" };
  return next;
}
