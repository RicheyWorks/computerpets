/** Brood ground tricks while idle. House periodical cicada — tymbal / cast / egress / harden / magicicada personality (tymbal song vibration on the inkstone — never named buzz (Relay + Snap) / song (field cricket window SONG) / burst (ethogram) / flash (Quill) / semaphore (Spark) / lantern (Spark) / talk, cast molt-shell leave-behind — never named shed (Ember) / exuvia (Dart happy) / molt / peel / strip / skin, egress ground-emergence climb from the dark years — never named emerge (window EMERGE + ethogram) / dig (Thimble) / heave (Ground) / lug (Ground) / earth (Ground) / crawl (Cling) / climb (Seven) / rise / surface, harden sun-perch cuticle set after egress — never named perch (Echo window) / sun (Sol) / bask (Ink window) / warm (Sol happy) / heat (Jade) / press (Sol) / glare / roost (Keel), magicicada desk life as a Magicicada septendecim periodical week with annual cousins in the thank-yous; not Fold / Seven / Column / Twig / Dart / Spark / Ghost / Milk / Comb / Thrum / *Dragon copies). Feed-happy thank-yous sit after eat. Card-open freeze and window-play EMERGE do not swallow a thank-you. Sleep, hide, and leave still win. Same map as desktop cicada-tricks.js. Not a Rui/cat/dog/rabbit/hamster/Clip/guinea pig/turtle/Ink/goldfish/Coin/budgie/Echo/fox/penguin/parrot/ferret/hedgehog/Burr/chinchilla/axolotl/Bloom/toucan/iguana/Sol/dragon/Vesper/phoenix/Ember/snake/Coral/octopus/Cup/cuttlefish/Sepia/nautilus/Chamber/moon-jelly/Pulse/sea-star/Cling/hermit-crab/Tenant/horseshoe-crab/Ledger/seahorse/Anchor/manta/Kite/moray/Door/moss/Felt/fern/Vein/ginkgo/Fan/oak/Mast/water-lily/Disk/orchid/Moth/saguaro/Arm/venus-flytrap/Snap/pitcher/Drown/sundew/Dew/honeybee/Comb/monarch/Milk/luna/Ghost/firefly/Spark/darner/Dart/stick/Twig/carpenter_ant/Column/ladybird/Seven/mantis/Fold or *Dragon electrical clone. Window-play EMERGE unchanged — never names emerge/burst/still. Ethogram still/emerge/burst unchanged. Fold owns raptorial/gimbal/snatch/pendulum/mantodea and happy sinensis/tenodera/mantidae; Seven owns spots/aphid/reflex/climb/coccinella; Column owns gallery/pheromone/crumb/bustle/camponotus; Twig owns rocking/catalepsy/browse/tread/diapheromera; Dart owns hawking/tandem/nymph/whir/anax and happy junius/labium/exuvia; Spark owns lantern/jstroke/semaphore/elytra/photinus; Comb owns figure/corbicula/hex/proboscis/hive; Relay owns buzz; Sol owns sun; Echo window owns perch; Ember owns shed; Vesper owns fold. Magicicada Periodical Cicada desk life only. No cry inventing — thank-yous are silent desk motion only. */
export const TRICK_KEY = "cicada";
export const TRICKS = ["tymbal", "cast", "egress", "harden", "magicicada"] as const;
export const HAPPY = ["septendecim", "cassini", "cicadidae"] as const;
export type CicadaTrickKind = (typeof TRICKS)[number];
export type CicadaHappyKind = (typeof HAPPY)[number];
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

export type CicadaTrick = {
  kind: CicadaTrickKind;
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

export type CicadaHappy = {
  kind: CicadaHappyKind;
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

export const HAPPY_DUR = { septendecim: 1.28, cassini: 1.32, cicadidae: 1.3 } as const;
export const MAGICICADA_HOLD = 14.2;
export const RELEASE_S = 0.72;
export const DUR = { magicicada: MAGICICADA_HOLD + RELEASE_S, tymbal: 1.6, cast: 1.52, egress: 1.7, harden: 1.58 } as const;

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

export function nextTrickWait(justFinished: boolean, rand?: number, kind?: CicadaTrickKind | string) {
  const roll = rand == null ? Math.random() : rand;
  if (kind === "magicicada") return 54 + roll * 34;
  if (kind === "tymbal") return 14 + roll * 12;
  if (kind === "egress") return 16 + roll * 12;
  return justFinished ? 10.8 + roll * 8 : 5.6 + roll * 6.8;
}

export function pickTrick(rand?: number, musicOn?: boolean, lastKind?: CicadaTrickKind | string | null) {
  if (musicOn) return "magicicada";
  const roll = rand == null ? Math.random() : rand;
  if (lastKind === "magicicada") {
    if (roll < 0.26) return "tymbal";
    if (roll < 0.5) return "cast";
    if (roll < 0.74) return "egress";
    return "harden";
  }
  if (lastKind === "tymbal") {
    if (roll < 0.26) return "magicicada";
    if (roll < 0.5) return "cast";
    if (roll < 0.74) return "egress";
    return "harden";
  }
  if (lastKind === "cast") {
    if (roll < 0.22) return "magicicada";
    if (roll < 0.44) return "tymbal";
    if (roll < 0.68) return "egress";
    return "harden";
  }
  if (roll < 0.2) return "magicicada";
  if (roll < 0.4) return "tymbal";
  if (roll < 0.6) return "cast";
  if (roll < 0.8) return "egress";
  return "harden";
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
  return key === TRICK_KEY || key === "brood";
}

export function startThankYou(
  key: string | undefined | null,
  lastKind: CicadaHappyKind | string | null | undefined,
  x: number,
  facing: 1 | -1,
  flags?: TrickFlags,
) {
  if (!wantsThankYou(key)) return null;
  if (!happyCanStart(flags || { cmd: "idle" })) return null;
  const pick = pickHappy(lastKind as CicadaHappyKind | null | undefined);
  return { happy: beginHappy(pick, x, facing), kind: pick };
}

export function pickHappy(lastKind?: CicadaHappyKind | null, rand?: number) {
  const pool = HAPPY.filter((k) => k !== lastKind);
  const list = pool.length ? pool : [...HAPPY];
  const roll = rand == null ? Math.random() : rand;
  return list[Math.floor(roll * list.length)] || list[0];
}

export function beginHappy(kind: CicadaHappyKind | string, x: number, facing: 1 | -1): CicadaHappy {
  const name = (HAPPY as readonly string[]).indexOf(kind) >= 0 ? (kind as CicadaHappyKind) : "septendecim";
  return {
    kind: name,
    happy: true,
    phase: "go",
    t: 0,
    x: x,
    lift: 0,
    rot: 0,
    anim: name === "septendecim" ? "talk" : name === "cassini" ? "play" : "sit",
    facing: facing == null ? 1 : facing,
    fromX: x,
  };
}

export function septendecimPose(t: number) {
  const u = Math.max(0, Math.min(1, t / HAPPY_DUR.septendecim));
  if (u < 0.14) {
    const s = u / 0.14;
    return { lift: s * 0.04, rot: s * 2.6, dx: 0, anim: "talk" as TrickAnim };
  }
  if (u < 0.74) {
    const buzz = Math.sin(t * 14.5) + 0.35 * Math.sin(t * 29);
    return {
      lift: 0.04 + Math.abs(buzz) * 0.018,
      rot: 2.6 + buzz * 1.8,
      dx: buzz * 0.002,
      anim: "talk" as TrickAnim,
    };
  }
  const s = (u - 0.74) / 0.26;
  return { lift: 0.02 * (1 - s), rot: 1.0 * (1 - s), dx: 0, anim: "idle" as TrickAnim };
}
export function cassiniPose(t: number) {
  const u = Math.max(0, Math.min(1, t / HAPPY_DUR.cassini));
  if (u < 0.16) {
    const s = u / 0.16;
    return { lift: s * 0.05, rot: s * -2.8, dx: s * 0.003, anim: "play" as TrickAnim };
  }
  if (u < 0.78) {
    const pulse = Math.sin(t * 5.2) + 0.28 * Math.sin(t * 10.4);
    return {
      lift: 0.05 + Math.abs(pulse) * 0.024,
      rot: -2.8 + pulse * 3.6,
      dx: pulse * 0.004,
      anim: "play" as TrickAnim,
    };
  }
  const s = (u - 0.78) / 0.22;
  return { lift: 0.024 * (1 - s), rot: -1.0 * (1 - s), dx: 0, anim: "sit" as TrickAnim };
}
export function cicadidaePose(t: number) {
  return {
    lift: 0.014 + Math.abs(Math.sin(t * 0.36)) * 0.014,
    rot: Math.sin(t * 0.48) * 1.1,
    dx: Math.sin(t * 0.26) * 0.002,
    anim: "sit" as TrickAnim,
  };
}
export function stepHappy(happy: CicadaHappy, dt: number, flags: TrickFlags): CicadaHappy {
  if (!happy || happy.phase === "done") return happy;
  if (happyShouldAbort(flags)) {
    return { ...happy, phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true };
  }
  const next: CicadaHappy = { ...happy, t: happy.t + Math.max(0, dt) };
  const hold = HAPPY_DUR[next.kind];
  if (next.kind === "septendecim") {
    const pose = septendecimPose(next.t);
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "cassini") {
    const pose = cassiniPose(next.t);
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else {
    const pose = cicadidaePose(next.t);
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

export function beginTrick(kind: CicadaTrickKind, x: number, facing: 1 | -1): CicadaTrick {
  const anim: TrickAnim =
    kind === "magicicada"
    ? "sit"
    : kind === "tymbal"
      ? "talk"
      : kind === "cast"
        ? "sit"
        : kind === "egress"
          ? "play"
          : kind === "harden"
            ? "sit"
              : "sit";
  return {
    kind: kind,
    phase: kind === "magicicada" ? "hold" : "go",
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

export function magicicadaPose(t: number) {
  const breath = Math.sin(t * 0.14) + 0.03 * Math.sin(t * 0.68);
  const grain = Math.abs(Math.sin(t * 0.3));
  return {
    lift: 0.016 + grain * 0.012,
    rot: 0.35 + breath * 0.65,
  };
}

export function releasePose(t: number) {
  const u = Math.max(0, Math.min(1, t / RELEASE_S));
  return { lift: 0.018 * (1 - Math.sin(u * Math.PI * 0.5)), rot: 0.35 * (1 - u) };
}

export function tymbalPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.tymbal));
  if (u < 0.12) {
    const s = smoothstep(u / 0.12);
    return { x: fromX, lift: s * 0.035, rot: s * 2.4 * facing, anim: "talk" as TrickAnim };
  }
  if (u < 0.86) {
    const buzz = Math.sin(t * 16.2) + 0.4 * Math.sin(t * 32.4) + 0.15 * Math.sin(t * 48);
    return {
      x: fromX + facing * buzz * 0.004,
      lift: 0.035 + Math.abs(buzz) * 0.02,
      rot: facing * (2.4 + buzz * 2.8),
      anim: "talk" as TrickAnim,
    };
  }
  const s = smoothstep((u - 0.86) / 0.14);
  return {
    x: fromX,
    lift: 0.016 * (1 - s),
    rot: facing * (0.9 * (1 - s)),
    anim: "sit" as TrickAnim,
  };
}
export function castPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.cast));
  if (u < 0.2) {
    const s = smoothstep(u / 0.2);
    return { x: fromX, lift: s * 0.07, rot: s * -4.2 * facing, anim: "sit" as TrickAnim };
  }
  if (u < 0.45) {
    const s = (u - 0.2) / 0.25;
    const arch = Math.sin(s * Math.PI);
    return {
      x: fromX + facing * arch * 0.02,
      lift: 0.07 + arch * 0.04,
      rot: facing * (-4.2 + arch * 2.0),
      anim: "play" as TrickAnim,
    };
  }
  if (u < 0.72) {
    const s = (u - 0.45) / 0.27;
    const slip = Math.sin(s * Math.PI * 1.6) * 0.22;
    return {
      x: fromX + facing * (0.025 + slip * 0.015),
      lift: 0.05 - s * 0.03,
      rot: facing * (-2.0 + slip * 1.6),
      anim: "play" as TrickAnim,
    };
  }
  const s = smoothstep((u - 0.72) / 0.28);
  return {
    x: fromX + facing * 0.012 * (1 - s),
    lift: 0.018 * (1 - s),
    rot: facing * (-0.8 * (1 - s)),
    anim: "sit" as TrickAnim,
  };
}
export function egressPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.egress));
  if (u < 0.18) {
    const s = smoothstep(u / 0.18);
    return { x: fromX, lift: -0.04 + s * 0.02, rot: s * 1.2 * facing, anim: "sit" as TrickAnim };
  }
  if (u < 0.55) {
    const s = (u - 0.18) / 0.37;
    const climb = smoothstep(s);
    return {
      x: fromX + facing * climb * 0.06,
      lift: -0.02 + climb * 0.1,
      rot: facing * (1.2 + climb * 2.4),
      anim: "play" as TrickAnim,
    };
  }
  if (u < 0.82) {
    const s = (u - 0.55) / 0.27;
    const settle = Math.sin(s * Math.PI);
    return {
      x: fromX + facing * (0.06 + settle * 0.01),
      lift: 0.08 - settle * 0.02,
      rot: facing * (3.6 - settle * 1.4),
      anim: "play" as TrickAnim,
    };
  }
  const s = smoothstep((u - 0.82) / 0.18);
  return {
    x: fromX + facing * 0.05 * (1 - s * 0.3),
    lift: 0.04 * (1 - s),
    rot: facing * (1.4 * (1 - s)),
    anim: "sit" as TrickAnim,
  };
}
export function hardenPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.harden));
  if (u < 0.14) {
    const s = smoothstep(u / 0.14);
    return { x: fromX, lift: s * 0.03, rot: s * 3.6 * facing, anim: "sit" as TrickAnim };
  }
  if (u < 0.84) {
    const s = (u - 0.14) / 0.7;
    const sun = Math.sin(s * Math.PI * 2.2) * 0.22;
    return {
      x: fromX + facing * sun * 0.008,
      lift: 0.03 + Math.abs(sun) * 0.01,
      rot: facing * (3.6 + sun * 2.0),
      anim: "sit" as TrickAnim,
    };
  }
  const s = smoothstep((u - 0.84) / 0.16);
  return {
    x: fromX,
    lift: 0.014 * (1 - s),
    rot: facing * (1.2 * (1 - s)),
    anim: "sit" as TrickAnim,
  };
}
export function stepTrick(trick: CicadaTrick, dt: number, flags: TrickFlags): CicadaTrick {
  if (!trick || trick.phase === "done") return trick;
  if (shouldAbort(flags) && trick.kind !== "tymbal" && trick.kind !== "cast" && trick.kind !== "egress" && trick.kind !== "harden") {
    return { ...trick, phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true };
  }
  const next: CicadaTrick = { ...trick, t: trick.t + Math.max(0, dt) };
  if (next.kind === "magicicada") {
    if (next.t < MAGICICADA_HOLD) {
      const pose = magicicadaPose(next.t);
      next.phase = "hold";
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = "sit";
      return next;
    }
    if (next.t < MAGICICADA_HOLD + RELEASE_S) {
      const pose = releasePose(next.t - MAGICICADA_HOLD);
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
  if (next.kind === "tymbal") {
    const pose = tymbalPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "cast") {
    const pose = castPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "egress") {
    const pose = egressPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else {
    const pose = hardenPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  }
  if (u >= 1) return { ...next, phase: "done", lift: 0, rot: 0, anim: "idle" };
  return next;
}
