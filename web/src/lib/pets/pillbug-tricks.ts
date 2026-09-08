/** Armor ground tricks while idle. House neighborly Isopoda / Armadillidium vulgare Common Pillbug — conglobate / moistcling / detritushusk / antennawave / vulgare personality; densarmor / inkarmor / densball thank-yous. Window-play STRIKE and Call Armor leave pillbug alone. Sleep/hide/leave/rest/card/ribbon still win. Same map as desktop pillbug-tricks.js. True isopod volvation ball distinct from millipede coilcurl. Next: Cast / earthworm. */
export const TRICK_KEY = "pillbug";
export const TRICKS = ["conglobate", "moistcling", "detritushusk", "antennawave", "vulgare"] as const;
export const HAPPY = ["densarmor", "inkarmor", "densball"] as const;
export type PillbugTrickKind = (typeof TRICKS)[number];
export type PillbugHappyKind = (typeof HAPPY)[number];
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

export type PillbugTrick = {
  kind: PillbugTrickKind;
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

export type PillbugHappy = {
  kind: PillbugHappyKind;
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

export const HAPPY_DUR = { densarmor: 2.55, inkarmor: 2.68, densball: 2.42 } as const;
export const VULGARE_HOLD = 22.80;
export const RELEASE_S = 1.95;
export const DUR = { vulgare: VULGARE_HOLD + RELEASE_S, conglobate: 4.45, moistcling: 4.55, detritushusk: 4.25, antennawave: 3.95 } as const;

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
export function nextTrickWait(justFinished: boolean, rand?: number, kind?: PillbugTrickKind | string) {
    const roll = rand == null ? Math.random() : rand;
      if (kind === "vulgare") return 148 + roll * 13;
  if (kind === "conglobate") return 25.4 + roll * 4.2;
  if (kind === "detritushusk") return 26.6 + roll * 3.8;
  if (kind === "antennawave") return 22.8 + roll * 3.6;
  if (kind === "moistcling") return 27.8 + roll * 4.4;
  return justFinished ? 19.2 + roll * 2.8 : 14.2 + roll * 2.4;
  }
export function pickTrick(rand?: number, musicOn?: boolean, lastKind?: PillbugTrickKind | string | null) {
    if (musicOn) return "vulgare";
    const roll = rand == null ? Math.random() : rand;
    if (lastKind === "vulgare") {
      if (roll < 0.26) return "conglobate";
      if (roll < 0.5) return "detritushusk";
      if (roll < 0.74) return "antennawave";
      return "moistcling";
    }
    if (lastKind === "conglobate") {
      if (roll < 0.26) return "vulgare";
      if (roll < 0.5) return "detritushusk";
      if (roll < 0.74) return "antennawave";
      return "moistcling";
    }
    if (lastKind === "detritushusk") {
      if (roll < 0.22) return "vulgare";
      if (roll < 0.44) return "conglobate";
      if (roll < 0.68) return "antennawave";
      return "moistcling";
    }
    if (roll < 0.2) return "vulgare";
    if (roll < 0.4) return "conglobate";
    if (roll < 0.6) return "detritushusk";
    if (roll < 0.8) return "antennawave";
    return "moistcling";
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
    return key === TRICK_KEY || key === "armor";
  }
export function startThankYou(
  key: string | undefined | null,
  lastKind: PillbugHappyKind | null | undefined,
  x: number,
  facing: 1 | -1,
  flags?: TrickFlags
) {
    if (!wantsThankYou(key)) return null;
    if (!happyCanStart(flags || { cmd: "idle" })) return null;
    const pick = pickHappy(lastKind);
    return { happy: beginHappy(pick, x, facing), kind: pick };
  }
export function pickHappy(lastKind?: PillbugHappyKind | null, rand?: number) {
    const pool = HAPPY.filter((k) => k !== lastKind);
    const list = pool.length ? pool : HAPPY.slice();
    const roll = rand == null ? Math.random() : rand;
    return list[Math.floor(roll * list.length)] || list[0];
  }
export function beginHappy(kind: PillbugHappyKind | string, x: number, facing: 1 | -1): PillbugHappy {
    const name = HAPPY.indexOf(kind) >= 0 ? kind : "densarmor";
    return {
      kind: name,
      happy: true,
      phase: "go",
      t: 0,
      x: x,
      lift: 0,
      rot: 0,
      anim: (name === "densarmor" ? "sit" : name === "inkarmor" ? "play" : "sit") as TrickAnim,
      facing: (facing == null ? 1 : facing) as 1 | -1,
      fromX: x,
    };
  }
export function densarmorPose(t: number) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.densarmor));
    if (u < 0.14) {
      const s = u / 0.14;
      return { lift: s * 0.0055, rot: s * 1.15, dx: 0, anim: "sit" as TrickAnim };
    }
    if (u < 0.88) {
      const hold = Math.sin(t * 0.88) + 0.035 * Math.sin(t * 1.76);
      return { lift: 0.0055 + Math.abs(hold) * 0.0018, rot: 1.15 + hold * 0.18, dx: hold * 0.00010, anim: "sit" as TrickAnim };
    }
    const s = (u - 0.88) / 0.12;
    return { lift: 0.0007 * (1 - s), rot: 0.028 * (1 - s), dx: 0, anim: "idle" as TrickAnim };
  }
export function inkarmorPose(t: number) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.inkarmor));
    if (u < 0.10) {
      const s = u / 0.10;
      return { lift: s * 0.024, rot: s * 1.35, dx: s * 0.00065, anim: "play" as TrickAnim };
    }
    if (u < 0.86) {
      const roll = Math.sin(t * 1.45) + 0.060 * Math.sin(t * 2.90);
      return { lift: 0.024 + Math.abs(roll) * 0.0065, rot: 1.35 + roll * 0.85, dx: roll * 0.00075, anim: "play" as TrickAnim };
    }
    const s = (u - 0.86) / 0.14;
    return { lift: 0.0014 * (1 - s), rot: 0.055 * (1 - s), dx: 0, anim: "sit" as TrickAnim };
  }
export function densballPose(t: number) {
    return { lift: 0.0011 + Math.abs(Math.sin(t * 0.038)) * 0.0022, rot: Math.sin(t * 0.038) * 0.95, dx: Math.sin(t * 0.028) * 0.00012, anim: "sit" as TrickAnim };
  }
export function stepHappy(happy: PillbugHappy | null | undefined, dt: number, flags?: TrickFlags) {
    if (!happy || happy.phase === "done") return happy;
    if (happyShouldAbort(flags)) {
      return Object.assign({}, happy, { phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true });
    }
    const next = Object.assign({}, happy, { t: happy.t + Math.max(0, dt) });
    const hold = HAPPY_DUR[next.kind];
    if (next.kind === "densarmor") {
      const pose = densarmorPose(next.t);
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "inkarmor") {
      const pose = inkarmorPose(next.t);
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else {
      const pose = densballPose(next.t);
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    }
    if (next.t >= hold) return Object.assign({}, next, { phase: "done", lift: 0, rot: 0, anim: "idle" });
    return next;
  }
export function sleepHoldFrame(_key?: string | null, _frameCount?: number) {
    return null;
  }
export function beginTrick(kind: PillbugTrickKind, x: number, facing: 1 | -1): PillbugTrick {
    const anim: TrickAnim =
      kind === "vulgare"
        ? "sit"
        : kind === "conglobate"
          ? "sit"
          : kind === "detritushusk"
            ? "play"
            : kind === "antennawave"
              ? "talk"
              : kind === "moistcling"
                ? "play"
                : "sit";
    return {
      kind: kind,
      phase: kind === "vulgare" ? "hold" : "go",
      t: 0,
      x: x,
      lift: 0,
      rot: 0,
      anim: anim,
      facing: (facing == null ? 1 : facing) as 1 | -1,
      fromX: x,
    };
  }
function smoothstep(t: number) {
    const x = Math.max(0, Math.min(1, t));
    return x * x * (3 - 2 * x);
  }
export function vulgarePose(t: number) {
    const breath = Math.sin(t * 0.0074) + 0.0032 * Math.sin(t * 0.019);
    const sway = Math.abs(Math.sin(t * 0.0036));
    return { lift: 0.00048 + sway * 0.00095, rot: -0.014 + breath * 0.042 };
  }
export function releasePose(t: number) {
    const u = Math.max(0, Math.min(1, t / RELEASE_S));
    return { lift: 0.00048 * (1 - Math.sin(u * Math.PI * 0.5)), rot: -0.012 * (1 - u) };
  }
export function conglobatePose(t: number, fromX: number, facing: 1 | -1) {
    const u = Math.max(0, Math.min(1, t / DUR.conglobate));
    const face = facing == null ? 1 : facing;
    if (u < 0.12) {
      const s = smoothstep(u / 0.12);
      return { x: fromX + face * s * -0.00022, lift: s * 0.0042, rot: s * 0.55 * face, anim: "sit" as TrickAnim };
    }
    if (u < 0.32) {
      const ball = smoothstep((u - 0.12) / 0.20);
      return { x: fromX + face * (-0.00022 + ball * 0.00018), lift: 0.0042 + ball * 0.0088, rot: (0.55 + ball * 2.35) * face, anim: "sit" as TrickAnim };
    }
    if (u < 0.78) {
      const roll = Math.sin((u - 0.32) / 0.46 * Math.PI * 2.2);
      const hush = Math.sin(t * 0.78) + 0.04 * Math.sin(t * 1.56);
      return { x: fromX + face * (0.00008 + roll * 0.0028 + hush * 0.00006), lift: 0.0125 + Math.abs(roll) * 0.0016 + Math.abs(hush) * 0.0009, rot: (2.90 + roll * 0.55 + hush * 0.12) * face, anim: "sit" as TrickAnim };
    }
    if (u < 0.90) {
      const open = smoothstep((u - 0.78) / 0.12);
      return { x: fromX + face * 0.00008 * (1 - open * 0.4), lift: 0.0125 * (1 - open) + open * 0.0035, rot: (2.90 * (1 - open) + open * 0.35) * face, anim: "sit" as TrickAnim };
    }
    const s = smoothstep((u - 0.90) / 0.10);
    return { x: fromX + face * 0.00005 * (1 - s), lift: 0.0007 * (1 - s), rot: 0.04 * (1 - s) * face, anim: "idle" as TrickAnim };
  }
export function detritushuskPose(t: number, fromX: number, facing: 1 | -1) {
    const u = Math.max(0, Math.min(1, t / DUR.detritushusk));
    const face = facing == null ? 1 : facing;
    if (u < 0.11) {
      const s = smoothstep(u / 0.11);
      return { x: fromX + face * s * 0.00038, lift: s * 0.0038, rot: s * 0.32 * face, anim: "play" as TrickAnim };
    }
    if (u < 0.88) {
      const husk = Math.sin((u - 0.11) / 0.77 * Math.PI * 3.1);
      const nibble = Math.sin(t * 1.22) + 0.06 * Math.sin(t * 2.44);
      return { x: fromX + face * (0.00055 + (u - 0.11) / 0.77 * 0.0042 + husk * 0.00115 + nibble * 0.00014), lift: 0.0036 + Math.abs(husk) * 0.0032 + Math.abs(nibble) * 0.0014, rot: (0.38 + husk * 0.48 + nibble * 0.18) * face, anim: "play" as TrickAnim };
    }
    const s = smoothstep((u - 0.88) / 0.12);
    return { x: fromX + face * 0.00398 * (1 - s), lift: 0.0007 * (1 - s), rot: 0.03 * (1 - s) * face, anim: "idle" as TrickAnim };
  }
export function antennawavePose(t: number, fromX: number, facing: 1 | -1) {
    const u = Math.max(0, Math.min(1, t / DUR.antennawave));
    const face = facing == null ? 1 : facing;
    if (u < 0.10) {
      const s = smoothstep(u / 0.10);
      return { x: fromX + face * s * 0.00042, lift: s * 0.0048, rot: s * -0.22 * face, anim: "talk" as TrickAnim };
    }
    if (u < 0.90) {
      const wave = Math.sin((u - 0.10) / 0.80 * Math.PI * 6.4);
      const probe = Math.sin(t * 1.72) + 0.07 * Math.sin(t * 3.44);
      return { x: fromX + face * (0.00042 + (u - 0.10) / 0.80 * 0.0042 + wave * 0.00055 + probe * 0.00009), lift: 0.0038 + Math.abs(wave) * 0.0022 + Math.abs(probe) * 0.0012, rot: (-0.22 + wave * 0.38 + probe * 0.14) * face, anim: "talk" as TrickAnim };
    }
    const s = smoothstep((u - 0.90) / 0.10);
    return { x: fromX + face * 0.00462 * (1 - s), lift: 0.00075 * (1 - s), rot: -0.028 * (1 - s) * face, anim: "idle" as TrickAnim };
  }
export function moistclingPose(t: number, fromX: number, facing: 1 | -1) {
    const u = Math.max(0, Math.min(1, t / DUR.moistcling));
    const face = facing == null ? 1 : facing;
    if (u < 0.10) {
      const s = smoothstep(u / 0.10);
      return { x: fromX + face * s * 0.00028, lift: s * 0.0022, rot: s * 0.18 * face, anim: "play" as TrickAnim };
    }
    if (u < 0.36) {
      const tuck = smoothstep((u - 0.10) / 0.26);
      return { x: fromX + face * (0.00028 + tuck * 0.00055), lift: 0.0022 + tuck * 0.0055, rot: (0.18 + tuck * -0.72) * face, anim: "play" as TrickAnim };
    }
    if (u < 0.86) {
      const cling = Math.sin((u - 0.36) / 0.50 * Math.PI * 1.8);
      const damp = Math.sin(t * 0.92) + 0.045 * Math.sin(t * 1.84);
      return { x: fromX + face * (0.00083 + cling * 0.00095 + damp * 0.00008), lift: 0.0075 + Math.abs(cling) * 0.0024 + Math.abs(damp) * 0.0011, rot: (-0.54 + cling * 0.38 + damp * 0.14) * face, anim: "sit" as TrickAnim };
    }
    const s = smoothstep((u - 0.86) / 0.14);
    return { x: fromX + face * 0.00083 * (1 - s), lift: 0.0008 * (1 - s), rot: -0.03 * (1 - s) * face, anim: "idle" as TrickAnim };
  }
export function stepTrick(trick: PillbugTrick | null | undefined, dt: number, flags?: TrickFlags) {
    if (!trick || trick.phase === "done") return trick;
    if (shouldAbort(flags) && trick.kind !== "conglobate" && trick.kind !== "detritushusk" && trick.kind !== "antennawave" && trick.kind !== "moistcling") {
      return Object.assign({}, trick, { phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true });
    }
    const next = Object.assign({}, trick, { t: trick.t + Math.max(0, dt) });
    if (next.kind === "vulgare") {
      if (next.t < VULGARE_HOLD) {
        const pose = vulgarePose(next.t);
        next.phase = "hold";
        next.lift = pose.lift;
        next.rot = pose.rot;
        next.anim = "sit";
        return next;
      }
      if (next.t < VULGARE_HOLD + RELEASE_S) {
        const pose = releasePose(next.t - VULGARE_HOLD);
        next.phase = "release";
        next.lift = pose.lift;
        next.rot = pose.rot;
        next.anim = "sit";
        return next;
      }
      return Object.assign({}, next, { phase: "done", lift: 0, rot: 0, anim: "idle" });
    }
    const hold = DUR[next.kind];
    const u = next.t / hold;
    if (next.kind === "conglobate") {
      const pose = conglobatePose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "detritushusk") {
      const pose = detritushuskPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "antennawave") {
      const pose = antennawavePose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else {
      const pose = moistclingPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    }
    if (u >= 1) return Object.assign({}, next, { phase: "done", lift: 0, rot: 0, anim: "idle" });
    return next;
  }