/** Jewel ground tricks while idle. House neighborly Calopterygidae / Calopteryx maculata Ebony Jewelwing desk life -- jewelflick / creekpatrol / perchfan / ovipositdip / calopteryxhush personality (jewelflick metallic wing-flick territorial flash distinct from Banner jewelflick, Milk asclepias/oyamel, Ghost plumose/lunule, Spark flash/glow; creekpatrol slow creek-territory hover patrol distinct from Dart hawking and Hover/Sepia hover; perchfan perched wing-fan open display distinct from Fan flutter and Quill fan; ovipositdip desk-safe abdomen dip cue distinct from Dart tandem and Milk chrysalis; long calopteryxhush Calopteryx jewelwing hush -- never named wait; NOT Dart darner (hawking/tandem/nymph/whir/anax); NOT Banner swallowtail (jewelflick/creekpatrol/perchfan/ovipositdip/calopteryxhush); NOT Spark firefly; NOT Milk monarch; NOT Ghost luna; NOT Comb honeybee; NOT Vault grasshopper; NOT Blade katydid; NOT Chirp cricket; window-play and Call Jewel leave jewelwing alone; guest slug Jewel / key jewelwing -- accept "jewelwing" and "jewel"; Thank-yous densjewel / inkjewel / denscalopteryx. Feed-happy after eat. Sleep, hide, leave, rest, card, ribbon still win. Same map as web jewelwing-tricks.ts. Next: Lace / lacewing. Catalog 220. */
export const TRICK_KEY = "jewelwing";
export const TRICKS = ["jewelflick", "creekpatrol", "perchfan", "ovipositdip", "calopteryxhush"] as const;
export const HAPPY = ["densjewel", "inkjewel", "denscalopteryx"] as const;
export type JewelwingTrickKind = (typeof TRICKS)[number];
export type JewelwingHappyKind = (typeof HAPPY)[number];
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

export type JewelwingTrick = {
  kind: JewelwingTrickKind;
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

export type JewelwingHappy = {
  kind: JewelwingHappyKind;
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

export const HAPPY_DUR = { densjewel: 2.48, inkjewel: 2.58, denscalopteryx: 2.36 } as const;
export const CALOPTERYXUSH_HOLD = 29.10;
export const RELEASE_S = 2.08;
export const DUR = { calopteryxhush: CALOPTERYXUSH_HOLD + RELEASE_S, jewelflick: 4.18, creekpatrol: 4.72, perchfan: 3.96, ovipositdip: 4.44 } as const;

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
export function nextTrickWait(justFinished: boolean, rand?: number, kind?: JewelwingTrickKind | string) {
  const roll = rand == null ? Math.random() : rand;
  if (kind === "calopteryxhush") return 190 + roll * 18;
  if (kind === "jewelflick") return 22.0 + roll * 3.5;
  if (kind === "creekpatrol") return 26.4 + roll * 4.0;
  if (kind === "perchfan") return 21.6 + roll * 3.3;
  if (kind === "ovipositdip") return 24.2 + roll * 3.8;
  return justFinished ? 18.6 + roll * 2.9 : 14.0 + roll * 2.5;
}
export function pickTrick(rand?: number, musicOn?: boolean, lastKind?: JewelwingTrickKind | string) {
  if (musicOn) return "calopteryxhush";
  const roll = rand == null ? Math.random() : rand;
  if (lastKind === "calopteryxhush") {
    if (roll < 0.26) return "jewelflick";
    if (roll < 0.5) return "creekpatrol";
    if (roll < 0.74) return "perchfan";
    return "ovipositdip";
  }
  if (lastKind === "jewelflick") {
    if (roll < 0.26) return "calopteryxhush";
    if (roll < 0.5) return "creekpatrol";
    if (roll < 0.74) return "perchfan";
    return "ovipositdip";
  }
  if (lastKind === "creekpatrol") {
    if (roll < 0.22) return "calopteryxhush";
    if (roll < 0.44) return "jewelflick";
    if (roll < 0.68) return "perchfan";
    return "ovipositdip";
  }
  if (roll < 0.2) return "calopteryxhush";
  if (roll < 0.4) return "jewelflick";
  if (roll < 0.6) return "creekpatrol";
  if (roll < 0.8) return "perchfan";
  return "ovipositdip";
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
  return cmd === "sleep" || cmd === "leave" || cmd === "hide" || cmd === "rest" || cmd === "seek" || cmd === "play" || cmd === "talk" || cmd === "enter";
}
export function wantsThankYou(key: string | undefined | null) {
  return key === TRICK_KEY || key === "jewel";
}
export function startThankYou(key: string | undefined | null, lastKind: string | undefined | null, x: number, facing: 1 | -1 | undefined, flags?: TrickFlags) {
  if (!wantsThankYou(key)) return null;
  if (!happyCanStart(flags || { cmd: "idle" })) return null;
  const pick = pickHappy(lastKind);
  return { happy: beginHappy(pick, x, facing), kind: pick };
}
export function pickHappy(lastKind?: string | null, rand?: number) {
  const pool = HAPPY.filter((k) => k !== lastKind);
  const list = pool.length ? pool : [...HAPPY];
  const roll = rand == null ? Math.random() : rand;
  return list[Math.floor(roll * list.length)] || list[0];
}
export function beginHappy(kind: JewelwingHappyKind | string, x: number, facing?: 1 | -1): JewelwingHappy {
  const name = (HAPPY as readonly string[]).indexOf(kind) >= 0 ? (kind as JewelwingHappyKind) : "densjewel";
  return {
    kind: name,
    happy: true,
    phase: "go",
    t: 0,
    x,
    lift: 0,
    rot: 0,
    anim: name === "densjewel" ? "sit" : name === "inkjewel" ? "play" : "play",
    facing: facing == null ? 1 : facing,
    fromX: x,
  };
}
export function densjewelPose(t: number): { lift: number; rot: number; anim: TrickAnim } {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.densjewel));
    if (u < 0.14) {
      const s = u / 0.14;
      return { lift: s * -0.0024, rot: s * -0.09, anim: "sit" };
    }
    if (u < 0.86) {
      const wing = Math.sin(((u - 0.14) / 0.72) * Math.PI * 2.55);
      return { lift: -0.0024 + Math.abs(wing) * 0.00145, rot: -0.09 + wing * 0.11, anim: "sit" };
    }
    const s = (u - 0.86) / 0.14;
    return { lift: -0.0024 * (1 - s), rot: -0.09 * (1 - s), anim: "idle" };
  }
export function inkjewelPose(t: number): { lift: number; rot: number; anim: TrickAnim } {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.inkjewel));
    if (u < 0.12) {
      const s = u / 0.12;
      return { lift: s * 0.0048, rot: s * 0.34, anim: "play" };
    }
    if (u < 0.84) {
      const pulse = Math.sin(((u - 0.12) / 0.72) * Math.PI * 3.2);
      return { lift: 0.0048 + Math.abs(pulse) * 0.00215, rot: 0.34 + pulse * 0.28, anim: "play" };
    }
    const s = (u - 0.84) / 0.16;
    return { lift: 0.0048 * (1 - s), rot: 0.34 * (1 - s), anim: "idle" };
  }
export function denscalopteryxPose(t: number): { lift: number; rot: number; anim: TrickAnim } {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.denscalopteryx));
    if (u < 0.13) {
      const s = u / 0.13;
      return { lift: s * 0.0016, rot: s * -0.14, anim: "play" };
    }
    if (u < 0.82) {
      const flash = Math.sin(((u - 0.13) / 0.69) * Math.PI * 2.05);
      return { lift: 0.0016 + Math.abs(flash) * 0.00095, rot: -0.14 + flash * 0.12, anim: "play" };
    }
    const s = (u - 0.82) / 0.18;
    return { lift: 0.0016 * (1 - s), rot: -0.14 * (1 - s), anim: "idle" };
  }
export function stepHappy(happy: JewelwingHappy, dt: number, flags?: TrickFlags): JewelwingHappy {
  if (!happy || happy.phase === "done") return happy;
  if (happyShouldAbort(flags)) {
    return { ...happy, phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true };
  }
  const next = { ...happy, t: happy.t + Math.max(0, dt) };
  const hold = HAPPY_DUR[next.kind];
  if (next.kind === "densjewel") {
    const pose = densjewelPose(next.t);
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "inkjewel") {
    const pose = inkjewelPose(next.t);
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else {
    const pose = denscalopteryxPose(next.t);
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  }
  if (next.t >= hold) return { ...next, phase: "done", lift: 0, rot: 0, anim: "idle" };
  return next;
}
export function sleepHoldFrame(_key?: string, _frameCount?: number) {
  return null;
}
export function beginTrick(kind: JewelwingTrickKind | string, x: number, facing?: 1 | -1): JewelwingTrick {
  const k = (TRICKS as readonly string[]).includes(kind) ? (kind as JewelwingTrickKind) : "calopteryxhush";
  const anim: TrickAnim =
    k === "calopteryxhush"
      ? "sit"
      : k === "jewelflick"
        ? "play"
        : k === "creekpatrol"
          ? "play"
          : k === "perchfan"
            ? "sit"
            : k === "ovipositdip"
              ? "talk"
              : "sit";
  return {
    kind: k,
    phase: k === "calopteryxhush" ? "hold" : "go",
    t: 0,
    x,
    lift: 0,
    rot: 0,
    anim,
    facing: facing == null ? 1 : facing,
    fromX: x,
  };
}
function smoothstep(t: number) {
  const x = Math.max(0, Math.min(1, t));
  return x * x * (3 - 2 * x);
}
export function calopteryxhushPose(t: number): { lift: number; rot: number } {
    const breath = Math.sin(t * 0.00105) + 0.00042 * Math.sin(t * 0.0032);
    const hush = Math.abs(Math.sin(t * 0.00044));
    return { lift: -0.00020 + hush * 0.00008, rot: -0.009 + breath * 0.0029 };
  }
export function releasePose(t: number): { lift: number; rot: number } {
    const u = Math.max(0, Math.min(1, t / RELEASE_S));
    return { lift: -0.00020 * (1 - Math.sin(u * Math.PI * 0.5)), rot: -0.009 * (1 - u) };
  }
export function jewelflickPose(t: number, fromX: number, facing?: 1 | -1): { x: number; lift: number; rot: number; anim: TrickAnim } {
    const u = Math.max(0, Math.min(1, t / DUR.jewelflick));
    const face = facing == null ? 1 : facing;
    if (u < 0.11) {
      const s = smoothstep(u / 0.11);
      return { x: fromX + face * s * 0.00010, lift: s * 0.0028, rot: s * -0.26 * face, anim: "play" };
    }
    if (u < 0.88) {
      const flick = Math.sin((u - 0.11) / 0.77 * Math.PI * 4.2);
      const metal = Math.sin(t * 2.55) + 0.035 * Math.sin(t * 5.1);
      return {
        x: fromX + face * (0.00010 + flick * 0.00022 + metal * 0.00004),
        lift: 0.0028 + Math.abs(flick) * 0.00245 + Math.abs(metal) * 0.00038,
        rot: (-0.26 + flick * 0.52 + metal * 0.10) * face,
        anim: "play",
      };
    }
    const s = smoothstep((u - 0.88) / 0.12);
    return { x: fromX + face * 0.00010 * (1 - s), lift: 0.0005 * (1 - s), rot: -0.025 * (1 - s) * face, anim: "idle" };
  }
export function creekpatrolPose(t: number, fromX: number, facing?: 1 | -1): { x: number; lift: number; rot: number; anim: TrickAnim } {
    const u = Math.max(0, Math.min(1, t / DUR.creekpatrol));
    const face = facing == null ? 1 : facing;
    if (u < 0.10) {
      const s = smoothstep(u / 0.10);
      return { x: fromX + face * s * 0.00025, lift: s * 0.0065, rot: s * -0.08 * face, anim: "play" };
    }
    if (u < 0.88) {
      const patrol = (u - 0.10) / 0.78;
      const beat = Math.sin(patrol * Math.PI * 2.4);
      const hover = Math.sin(t * 1.65) * 0.0018;
      return {
        x: fromX + face * (0.00025 + patrol * 0.018 + beat * 0.0011),
        lift: 0.0065 + hover + Math.abs(beat) * 0.0014,
        rot: (-0.08 + beat * 0.12) * face,
        anim: "play",
      };
    }
    const s = smoothstep((u - 0.88) / 0.12);
    return { x: fromX + face * 0.01825 * (1 - s * 0.03), lift: 0.0065 * (1 - s), rot: -0.02 * (1 - s) * face, anim: "idle" };
  }
export function perchfanPose(t: number, fromX: number, facing?: 1 | -1): { x: number; lift: number; rot: number; anim: TrickAnim } {
    const u = Math.max(0, Math.min(1, t / DUR.perchfan));
    const face = facing == null ? 1 : facing;
    if (u < 0.14) {
      const s = smoothstep(u / 0.14);
      return { x: fromX + face * s * 0.00008, lift: s * 0.0012, rot: s * 0.18 * face, anim: "sit" };
    }
    if (u < 0.84) {
      const fan = Math.sin((u - 0.14) / 0.70 * Math.PI * 2.1);
      return {
        x: fromX + face * (0.00008 + fan * 0.00015),
        lift: 0.0012 + Math.abs(fan) * 0.00105,
        rot: (0.18 + fan * 0.42) * face,
        anim: "sit",
      };
    }
    const s = smoothstep((u - 0.84) / 0.16);
    return { x: fromX + face * 0.00008 * (1 - s), lift: 0.0012 * (1 - s), rot: 0.04 * (1 - s) * face, anim: "idle" };
  }
export function ovipositdipPose(t: number, fromX: number, facing?: 1 | -1): { x: number; lift: number; rot: number; anim: TrickAnim } {
    const u = Math.max(0, Math.min(1, t / DUR.ovipositdip));
    const face = facing == null ? 1 : facing;
    if (u < 0.12) {
      const s = smoothstep(u / 0.12);
      return { x: fromX + face * s * 0.00016, lift: s * -0.0042, rot: s * 0.22 * face, anim: "talk" };
    }
    if (u < 0.78) {
      const dip = Math.sin((u - 0.12) / 0.66 * Math.PI * 3.4);
      return {
        x: fromX + face * (0.00016 + (u - 0.12) * 0.0018),
        lift: -0.0042 + dip * 0.0016,
        rot: (0.22 + dip * 0.14) * face,
        anim: "talk",
      };
    }
    if (u < 0.90) {
      const s = smoothstep((u - 0.78) / 0.12);
      return { x: fromX + face * 0.00135, lift: -0.0042 + s * 0.0030, rot: (0.22 - s * 0.16) * face, anim: "talk" };
    }
    const s = smoothstep((u - 0.90) / 0.10);
    return { x: fromX + face * 0.00135 * (1 - s * 0.02), lift: -0.0012 * (1 - s), rot: 0.03 * (1 - s) * face, anim: "idle" };
  }
export function stepTrick(trick: JewelwingTrick, dt: number, flags?: TrickFlags): JewelwingTrick {
  if (!trick || trick.phase === "done") return trick;
  if (shouldAbort(flags) && trick.kind !== "jewelflick" && trick.kind !== "creekpatrol" && trick.kind !== "perchfan" && trick.kind !== "ovipositdip") {
    return { ...trick, phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true };
  }
  const next = { ...trick, t: trick.t + Math.max(0, dt) };
  if (next.kind === "calopteryxhush") {
    if (next.t < CALOPTERYXUSH_HOLD) {
      const pose = calopteryxhushPose(next.t);
      next.phase = "hold";
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = "sit";
      return next;
    }
    if (next.t < CALOPTERYXUSH_HOLD + RELEASE_S) {
      const pose = releasePose(next.t - CALOPTERYXUSH_HOLD);
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
  if (next.kind === "jewelflick") {
    const pose = jewelflickPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "creekpatrol") {
    const pose = creekpatrolPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "perchfan") {
    const pose = perchfanPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else {
    const pose = ovipositdipPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  }
  if (u >= 1) return { ...next, phase: "done", lift: 0, rot: 0, anim: "idle" };
  return next;
}