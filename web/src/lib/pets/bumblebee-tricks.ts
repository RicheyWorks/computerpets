/** Thrum ground tricks while idle. House common eastern bumblebee — sonicate / scopa / fossor / lumber / bombus personality (sonicate buzz-pollination vibration on a blotter bloom — never named buzz (Relay + Snap) / forage (window FORAGE) / tymbal (Brood) / song (field cricket window SONG) / burst (ethogram) / flash (Quill) / semaphore (Spark) / lantern (Spark) / talk, scopa fuzzy-thorax pollen load — never named corbicula (Comb) / pollen (Moth happy) / nest (Clip) / cheek (Clip) / pocket (Clip) / fur / fluff / preen (Echo), fossor moss-cup nest burrow — never named dig (Thimble) / hive (Comb) / nest (Clip) / bank (window DIG) / heave (Ground) / lug (Ground) / earth (Ground) / crawl (Cling) / moss (Sash), lumber heavy loaded hover — never named hover (Sepia) / thrum (Vesper) / drone (Hum window) / heft (Lula) / figure (Comb) / wing (Kite) / flutter (Fan) / sip (hummingbird window), bombus desk life as a Bombus impatiens moss-cup forager with eastern cousins in the thank-yous; not Comb / Brood / Fold / Seven / Column / Twig / Dart / Spark / Ghost / Milk / *Dragon copies). Feed-happy thank-yous sit after eat. Card-open freeze and window-play FORAGE do not swallow a thank-you. Sleep, hide, and leave still win. Same map as desktop bumblebee-tricks.js. Not a Rui/cat/dog/rabbit/hamster/Clip/guinea pig/turtle/Ink/goldfish/Coin/budgie/Echo/fox/penguin/parrot/ferret/hedgehog/Burr/chinchilla/axolotl/Bloom/toucan/iguana/Sol/dragon/Vesper/phoenix/Ember/snake/Coral/octopus/Cup/cuttlefish/Sepia/nautilus/Chamber/moon-jelly/Pulse/sea-star/Cling/hermit-crab/Tenant/horseshoe-crab/Ledger/seahorse/Anchor/manta/Kite/moray/Door/moss/Felt/fern/Vein/ginkgo/Fan/oak/Mast/water-lily/Disk/orchid/Moth/saguaro/Arm/venus-flytrap/Snap/pitcher/Drown/sundew/Dew/honeybee/Comb/monarch/Milk/luna/Ghost/firefly/Spark/darner/Dart/stick/Twig/carpenter_ant/Column/ladybird/Seven/mantis/Fold/cicada/Brood or *Dragon electrical clone. Window-play FORAGE unchanged — never names forage. Ethogram unchanged. Comb owns figure/corbicula/hex/proboscis/hive and happy honey/mead/propolis; Brood owns tymbal/cast/egress/harden/magicicada and happy septendecim/cassini/cicadidae; Relay owns buzz; Sepia owns hover; Vesper owns thrum; Sash owns moss; Clip owns nest; Thimble owns dig; Moth owns pollen; Disk owns nectar; Hum window owns drone; Lula owns heft; Rui owns dance. Bombus moss-cup desk life only. No cry inventing — thank-yous are silent desk motion only. */
export const TRICK_KEY = "bumblebee";
export const TRICKS = ["sonicate", "scopa", "fossor", "lumber", "bombus"] as const;
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

export const HAPPY_DUR = { impatiens: 1.3, bimaculatus: 1.34, bombini: 1.28 } as const;
export const BOMBUS_HOLD = 13.4;
export const RELEASE_S = 0.7;
export const DUR = { bombus: BOMBUS_HOLD + RELEASE_S, sonicate: 1.54, scopa: 1.48, fossor: 1.66, lumber: 1.62 } as const;

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
  if (kind === "bombus") return 50 + roll * 32;
  if (kind === "sonicate") return 14 + roll * 11;
  if (kind === "fossor") return 17 + roll * 12;
  return justFinished ? 10.6 + roll * 8 : 5.4 + roll * 6.6;
}

export function pickTrick(rand?: number, musicOn?: boolean, lastKind?: BumblebeeTrickKind | string | null) {
  if (musicOn) return "bombus";
  const roll = rand == null ? Math.random() : rand;
  if (lastKind === "bombus") {
    if (roll < 0.26) return "sonicate";
    if (roll < 0.5) return "scopa";
    if (roll < 0.74) return "fossor";
    return "lumber";
  }
  if (lastKind === "sonicate") {
    if (roll < 0.26) return "bombus";
    if (roll < 0.5) return "scopa";
    if (roll < 0.74) return "fossor";
    return "lumber";
  }
  if (lastKind === "scopa") {
    if (roll < 0.22) return "bombus";
    if (roll < 0.44) return "sonicate";
    if (roll < 0.68) return "fossor";
    return "lumber";
  }
  if (roll < 0.2) return "bombus";
  if (roll < 0.4) return "sonicate";
  if (roll < 0.6) return "scopa";
  if (roll < 0.8) return "fossor";
  return "lumber";
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
  if (u < 0.14) {
    const s = u / 0.14;
    return { lift: s * 0.055, rot: s * 3.2, dx: 0, anim: "talk" as TrickAnim };
  }
  if (u < 0.76) {
    const buzz = Math.sin(t * 18.2) + 0.3 * Math.sin(t * 36);
    return {
      lift: 0.055 + Math.abs(buzz) * 0.022,
      rot: 3.2 + buzz * 2.4,
      dx: buzz * 0.003,
      anim: "talk" as TrickAnim,
    };
  }
  const s = (u - 0.76) / 0.24;
  return { lift: 0.024 * (1 - s), rot: 1.2 * (1 - s), dx: 0, anim: "idle" as TrickAnim };
}
export function bimaculatusPose(t: number) {
  const u = Math.max(0, Math.min(1, t / HAPPY_DUR.bimaculatus));
  if (u < 0.16) {
    const s = u / 0.16;
    return { lift: s * 0.07, rot: s * -3.4, dx: s * 0.004, anim: "play" as TrickAnim };
  }
  if (u < 0.78) {
    const sway = Math.sin(t * 4.6) + 0.25 * Math.sin(t * 9.2);
    return {
      lift: 0.07 + Math.abs(sway) * 0.03,
      rot: -3.4 + sway * 4.2,
      dx: sway * 0.006,
      anim: "play" as TrickAnim,
    };
  }
  const s = (u - 0.78) / 0.22;
  return { lift: 0.03 * (1 - s), rot: -1.2 * (1 - s), dx: 0, anim: "sit" as TrickAnim };
}
export function bombiniPose(t: number) {
  return {
    lift: 0.018 + Math.abs(Math.sin(t * 0.42)) * 0.016,
    rot: Math.sin(t * 0.55) * 1.4,
    dx: Math.sin(t * 0.3) * 0.003,
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
  const breath = Math.sin(t * 0.16) + 0.04 * Math.sin(t * 0.72);
  const grain = Math.abs(Math.sin(t * 0.34));
  return {
    lift: 0.02 + grain * 0.014,
    rot: 0.45 + breath * 0.7,
  };
}

export function releasePose(t: number) {
  const u = Math.max(0, Math.min(1, t / RELEASE_S));
  return { lift: 0.02 * (1 - Math.sin(u * Math.PI * 0.5)), rot: 0.45 * (1 - u) };
}

export function sonicatePose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.sonicate));
  if (u < 0.1) {
    const s = smoothstep(u / 0.1);
    return { x: fromX, lift: s * 0.06, rot: s * 1.8 * facing, anim: "talk" as TrickAnim };
  }
  if (u < 0.88) {
    const buzz = Math.sin(t * 22.5) + 0.45 * Math.sin(t * 45) + 0.18 * Math.sin(t * 67);
    return {
      x: fromX + facing * buzz * 0.003,
      lift: 0.06 + Math.abs(buzz) * 0.025,
      rot: facing * (1.8 + buzz * 3.4),
      anim: "talk" as TrickAnim,
    };
  }
  const s = smoothstep((u - 0.88) / 0.12);
  return {
    x: fromX,
    lift: 0.02 * (1 - s),
    rot: facing * (0.7 * (1 - s)),
    anim: "sit" as TrickAnim,
  };
}
export function scopaPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.scopa));
  if (u < 0.18) {
    const s = smoothstep(u / 0.18);
    return { x: fromX, lift: s * 0.04, rot: s * -5.2 * facing, anim: "talk" as TrickAnim };
  }
  if (u < 0.72) {
    const s = (u - 0.18) / 0.54;
    const pack = Math.sin(s * Math.PI * 3.2);
    return {
      x: fromX + facing * pack * 0.01,
      lift: 0.04 + Math.abs(pack) * 0.035,
      rot: facing * (-5.2 + s * 3.6 + pack * 2.4),
      anim: "talk" as TrickAnim,
    };
  }
  const s = smoothstep((u - 0.72) / 0.28);
  return {
    x: fromX,
    lift: 0.02 * (1 - s),
    rot: facing * (-1.4 * (1 - s)),
    anim: "sit" as TrickAnim,
  };
}
export function fossorPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.fossor));
  if (u < 0.2) {
    const s = smoothstep(u / 0.2);
    return { x: fromX, lift: -0.02 * s, rot: s * 2.2 * facing, anim: "sit" as TrickAnim };
  }
  if (u < 0.55) {
    const s = (u - 0.2) / 0.35;
    const dig = smoothstep(s);
    return {
      x: fromX + facing * dig * 0.04,
      lift: -0.02 - dig * 0.06,
      rot: facing * (2.2 + dig * 1.8),
      anim: "play" as TrickAnim,
    };
  }
  if (u < 0.82) {
    const s = (u - 0.55) / 0.27;
    const settle = Math.sin(s * Math.PI);
    return {
      x: fromX + facing * (0.04 + settle * 0.008),
      lift: -0.08 + settle * 0.03,
      rot: facing * (4.0 - settle * 1.2),
      anim: "play" as TrickAnim,
    };
  }
  const s = smoothstep((u - 0.82) / 0.18);
  return {
    x: fromX + facing * 0.035 * (1 - s * 0.4),
    lift: -0.04 * (1 - s),
    rot: facing * (1.6 * (1 - s)),
    anim: "sit" as TrickAnim,
  };
}
export function lumberPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.lumber));
  if (u < 0.14) {
    const s = smoothstep(u / 0.14);
    return { x: fromX, lift: s * 0.09, rot: s * -2.6 * facing, anim: "play" as TrickAnim };
  }
  if (u < 0.84) {
    const s = (u - 0.14) / 0.7;
    const heavy = Math.sin(s * Math.PI * 1.6);
    const bob = Math.sin(s * Math.PI * 3.2) * 0.35;
    return {
      x: fromX + facing * heavy * 0.045,
      lift: 0.09 + Math.abs(bob) * 0.04,
      rot: facing * (-2.6 + heavy * 4.8 + bob * 1.6),
      anim: "play" as TrickAnim,
    };
  }
  const s = smoothstep((u - 0.84) / 0.16);
  return {
    x: fromX,
    lift: 0.04 * (1 - s),
    rot: facing * (-1.0 * (1 - s)),
    anim: "sit" as TrickAnim,
  };
}
export function stepTrick(trick: BumblebeeTrick, dt: number, flags: TrickFlags): BumblebeeTrick {
  if (!trick || trick.phase === "done") return trick;
  if (shouldAbort(flags) && trick.kind !== "sonicate" && trick.kind !== "scopa" && trick.kind !== "fossor" && trick.kind !== "lumber") {
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
  if (next.kind === "sonicate") {
    const pose = sonicatePose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "scopa") {
    const pose = scopaPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "fossor") {
    const pose = fossorPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else {
    const pose = lumberPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  }
  if (u >= 1) return { ...next, phase: "done", lift: 0, rot: 0, anim: "idle" };
  return next;
}
