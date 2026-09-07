/** Hook ground tricks while idle. House neighborly Accipitridae / Buteoninae red-tailed hawk desk life — kettle / stoop / bind / keeyer / buteo personality (kettle thermal-circle wing-set without naming soar or dihedral, stoop dive-coil without naming softcrouch or plunge, bind talon-bind without naming mantle, keeyer kee-eer stance without naming soar-cry or cronk or snore, long buteo Buteo jamaicensis fencepost perch — never named wait or soar or hop or preen or fan or strut or roost or hopwalk or monocle or fossick or anting or corvid or dihedral or billtap or tumble or cronk or hackles or diskturn or softcrouch or parallax or snore or tytonid; window-play SOAR owns soar; Soot/Wedge/Heart own their tricks; guest slug Hook / key red_tail — accept "red_tail" and "hook"; do NOT name a trick red_tail or hook or soar or mantle). Thank-yous borealis / calurus / harlani. Feed-happy after eat. Sleep, hide, leave, rest, card, ribbon still win. Same map as desktop red_tail-tricks.js. Window-play SOAR unchanged. True red-tailed hawk desk life — not owl/crow/raven clones. Dee owns the next seat. No cry inventing — thank-yous are silent desk motion only. */
export const TRICK_KEY = "red_tail";
export const TRICKS = ["kettle", "stoop", "bind", "keeyer", "buteo"] as const;
export const HAPPY = ["borealis", "calurus", "harlani"] as const;
export type RedTailTrickKind = (typeof TRICKS)[number];
export type RedTailHappyKind = (typeof HAPPY)[number];
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

export type RedTailTrick = {
  kind: RedTailTrickKind;
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

export type RedTailHappy = {
  kind: RedTailHappyKind;
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

export const HAPPY_DUR = { borealis: 1.62, calurus: 1.76, harlani: 1.69 } as const;
export const BUTEO_HOLD = 19.42;
export const RELEASE_S = 1.16;
export const DUR = { buteo: BUTEO_HOLD + RELEASE_S, kettle: 2.54, stoop: 2.32, bind: 2.48, keeyer: 2.50 } as const;

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
export function nextTrickWait(justFinished: boolean, rand?: number, kind?: RedTailTrickKind | string) {
    const roll = rand == null ? Math.random() : rand;
      if (kind === "buteo") return 84 + roll * 46;
  if (kind === "kettle") return 17.0 + roll * 13.2;
  if (kind === "stoop") return 17.6 + roll * 12.8;
  if (kind === "keeyer") return 20.6 + roll * 13.6;
  return justFinished ? 14.6 + roll * 10.9 : 8.4 + roll * 9.7;
  }
export function pickTrick(rand?: number, musicOn?: boolean, lastKind?: RedTailTrickKind | string | null) {
    if (musicOn) return "buteo";
    const roll = rand == null ? Math.random() : rand;
    if (lastKind === "buteo") {
      if (roll < 0.26) return "kettle";
      if (roll < 0.5) return "stoop";
      if (roll < 0.74) return "bind";
      return "keeyer";
    }
    if (lastKind === "kettle") {
      if (roll < 0.26) return "buteo";
      if (roll < 0.5) return "stoop";
      if (roll < 0.74) return "bind";
      return "keeyer";
    }
    if (lastKind === "stoop") {
      if (roll < 0.22) return "buteo";
      if (roll < 0.44) return "kettle";
      if (roll < 0.68) return "bind";
      return "keeyer";
    }
    if (roll < 0.2) return "buteo";
    if (roll < 0.4) return "kettle";
    if (roll < 0.6) return "stoop";
    if (roll < 0.8) return "bind";
    return "keeyer";
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
    return key === TRICK_KEY || key === "hook";
  }
export function startThankYou(
  key: string | undefined | null,
  lastKind: RedTailHappyKind | null | undefined,
  x: number,
  facing: 1 | -1,
  flags?: TrickFlags
) {
    if (!wantsThankYou(key)) return null;
    if (!happyCanStart(flags || { cmd: "idle" })) return null;
    const pick = pickHappy(lastKind);
    return { happy: beginHappy(pick, x, facing), kind: pick };
  }
export function pickHappy(lastKind?: RedTailHappyKind | null, rand?: number) {
    const pool = HAPPY.filter((k) => k !== lastKind);
    const list = pool.length ? pool : HAPPY.slice();
    const roll = rand == null ? Math.random() : rand;
    return list[Math.floor(roll * list.length)] || list[0];
  }
export function beginHappy(kind: RedTailHappyKind | string, x: number, facing: 1 | -1): RedTailHappy {
    const name = HAPPY.indexOf(kind) >= 0 ? kind : "borealis";
    return {
      kind: name,
      happy: true,
      phase: "go",
      t: 0,
      x: x,
      lift: 0,
      rot: 0,
      anim: (name === "borealis" ? "sit" : name === "calurus" ? "play" : "sit") as TrickAnim,
      facing: (facing == null ? 1 : facing) as 1 | -1,
      fromX: x,
    };
  }
export function borealisPose(t: number) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.borealis));
    if (u < 0.16) {
      const s = u / 0.16;
      return { lift: s * 0.019, rot: s * 2.15, dx: 0, anim: "sit" };
    }
    if (u < 0.82) {
      const flash = Math.sin(t * 5.8) + 0.28 * Math.sin(t * 11.6);
      return {
        lift: 0.019 + Math.abs(flash) * 0.014,
        rot: 2.15 + flash * 1.55,
        dx: flash * 0.0010,
        anim: "sit",
      };
    }
    const s = (u - 0.82) / 0.18;
    return { lift: 0.008 * (1 - s), rot: 0.55 * (1 - s), dx: 0, anim: "idle" };
  }
export function calurusPose(t: number) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.calurus));
    if (u < 0.12) {
      const s = u / 0.12;
      return { lift: s * 0.028, rot: s * -2.05, dx: s * 0.0014, anim: "play" };
    }
    if (u < 0.85) {
      const wriggle = Math.sin(t * 4.4) + 0.24 * Math.sin(t * 7.9);
      return {
        lift: 0.028 + Math.abs(wriggle) * 0.020,
        rot: -2.05 + wriggle * 2.55,
        dx: wriggle * 0.0022,
        anim: "play",
      };
    }
    const s = (u - 0.85) / 0.15;
    return { lift: 0.010 * (1 - s), rot: -0.38 * (1 - s), dx: 0, anim: "sit" };
  }
export function harlaniPose(t: number) {
    return {
      lift: 0.007 + Math.abs(Math.sin(t * 0.29)) * 0.015,
      rot: Math.sin(t * 0.29) * 1.25,
      dx: Math.sin(t * 0.24) * 0.0011,
      anim: "sit",
    };
  }
export function stepHappy(happy: RedTailHappy | null | undefined, dt: number, flags?: TrickFlags) {
    if (!happy || happy.phase === "done") return happy;
    if (happyShouldAbort(flags)) {
      return Object.assign({}, happy, { phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true });
    }
    const next = Object.assign({}, happy, { t: happy.t + Math.max(0, dt) });
    const hold = HAPPY_DUR[next.kind];
    if (next.kind === "borealis") {
      const pose = borealisPose(next.t);
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "calurus") {
      const pose = calurusPose(next.t);
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else {
      const pose = harlaniPose(next.t);
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
export function beginTrick(kind: RedTailTrickKind, x: number, facing: 1 | -1): RedTailTrick {
    const anim: TrickAnim =
      kind === "buteo"
        ? "sit"
        : kind === "kettle"
          ? "sit"
          : kind === "stoop"
            ? "sit"
            : kind === "bind"
              ? "play"
              : kind === "keeyer"
                ? "talk"
                : "sit";
    return {
      kind: kind,
      phase: kind === "buteo" ? "hold" : "go",
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
export function buteoPose(t: number) {
    const breath = Math.sin(t * 0.10) + 0.08 * Math.sin(t * 0.27);
    const soft = Math.abs(Math.sin(t * 0.13));
    return {
      lift: 0.005 + soft * 0.014,
      rot: 0.55 + breath * 0.68,
    };
  }
export function releasePose(t: number) {
    const u = Math.max(0, Math.min(1, t / RELEASE_S));
    return { lift: 0.004 * (1 - Math.sin(u * Math.PI * 0.5)), rot: 0.22 * (1 - u) };
  }
export function kettlePose(t: number, fromX: number, facing: 1 | -1) {
    const u = Math.max(0, Math.min(1, t / DUR.kettle));
    const face = facing == null ? 1 : facing;
    if (u < 0.11) {
      const s = smoothstep(u / 0.11);
      // kettle wing-set settles into a thermal circle lean
      return { x: fromX, lift: s * 0.022, rot: s * 8.4 * face, anim: "sit" };
    }
    if (u < 0.86) {
      const s = (u - 0.11) / 0.75;
      // buteo kettle tracks a soft thermal without naming soar
      const scan = Math.sin(s * Math.PI * 1.35);
      const settle = Math.abs(Math.sin(s * Math.PI * 2.1));
      return {
        x: fromX + face * (0.006 * s + scan * 0.003),
        lift: 0.018 + settle * 0.012,
        rot: (8.4 + scan * 4.6) * face,
        anim: "sit",
      };
    }
    const s = smoothstep((u - 0.86) / 0.14);
    return {
      x: fromX + face * 0.006 * (1 - s),
      lift: 0.010 * (1 - s),
      rot: 1.6 * (1 - s) * face,
      anim: "idle",
    };
  }
export function stoopPose(t: number, fromX: number, facing: 1 | -1) {
    const u = Math.max(0, Math.min(1, t / DUR.stoop));
    const face = facing == null ? 1 : facing;
    if (u < 0.16) {
      const s = smoothstep(u / 0.16);
      // stoop dive-coil compresses low
      return { x: fromX, lift: s * -0.018, rot: s * -1.15 * face, anim: "sit" };
    }
    if (u < 0.80) {
      const hush = Math.sin(t * 2.2) + 0.18 * Math.sin(t * 5.1);
      return {
        x: fromX + face * hush * 0.002,
        lift: -0.018 + Math.abs(hush) * 0.006,
        rot: (-1.15 + hush * 0.55) * face,
        anim: "sit",
      };
    }
    const s = smoothstep((u - 0.80) / 0.20);
    return {
      x: fromX,
      lift: -0.008 * (1 - s),
      rot: -0.35 * (1 - s) * face,
      anim: "idle",
    };
  }
export function bindPose(t: number, fromX: number, facing: 1 | -1) {
    const u = Math.max(0, Math.min(1, t / DUR.bind));
    const face = facing == null ? 1 : facing;
    if (u < 0.10) {
      const s = smoothstep(u / 0.10);
      // talon-bind grip coils onto the blotter
      return { x: fromX, lift: s * 0.024, rot: s * -2.65 * face, anim: "play" };
    }
    if (u < 0.86) {
      const swing = Math.sin(t * 3.5) + 0.30 * Math.sin(t * 7.0);
      return {
        x: fromX + face * swing * 0.016,
        lift: 0.020 + Math.abs(swing) * 0.018,
        rot: (-1.25 + swing * 3.4) * face,
        anim: "play",
      };
    }
    const s = smoothstep((u - 0.86) / 0.14);
    return { x: fromX, lift: 0.008 * (1 - s), rot: -0.35 * (1 - s) * face, anim: "idle" };
  }
export function keeyerPose(t: number, fromX: number, facing: 1 | -1) {
    const u = Math.max(0, Math.min(1, t / DUR.keeyer));
    const face = facing == null ? 1 : facing;
    if (u < 0.12) {
      const s = smoothstep(u / 0.12);
      return { x: fromX, lift: s * 0.014, rot: s * -1.55 * face, anim: "talk" };
    }
    if (u < 0.88) {
      // keeyer territorial stance pulse without naming soar
      const pulse = Math.sin(t * 2.8) + 0.24 * Math.sin(t * 5.6);
      return {
        x: fromX + face * pulse * 0.0025,
        lift: 0.012 + Math.abs(pulse) * 0.010,
        rot: (-1.55 + pulse * 1.05) * face,
        anim: "talk",
      };
    }
    const s = smoothstep((u - 0.88) / 0.12);
    return { x: fromX, lift: 0.005 * (1 - s), rot: -0.28 * (1 - s) * face, anim: "idle" };
  }
export function stepTrick(trick: RedTailTrick | null | undefined, dt: number, flags?: TrickFlags) {
    if (!trick || trick.phase === "done") return trick;
    if (shouldAbort(flags) && trick.kind !== "kettle" && trick.kind !== "stoop" && trick.kind !== "bind" && trick.kind !== "keeyer") {
      return Object.assign({}, trick, { phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true });
    }
    const next = Object.assign({}, trick, { t: trick.t + Math.max(0, dt) });
    if (next.kind === "buteo") {
      if (next.t < BUTEO_HOLD) {
        const pose = buteoPose(next.t);
        next.phase = "hold";
        next.lift = pose.lift;
        next.rot = pose.rot;
        next.anim = "sit";
        return next;
      }
      if (next.t < BUTEO_HOLD + RELEASE_S) {
        const pose = releasePose(next.t - BUTEO_HOLD);
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
    if (next.kind === "kettle") {
      const pose = kettlePose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "stoop") {
      const pose = stoopPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "bind") {
      const pose = bindPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else {
      const pose = keeyerPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    }
    if (u >= 1) return Object.assign({}, next, { phase: "done", lift: 0, rot: 0, anim: "idle" });
    return next;
  }
