/** Dee ground tricks while idle. House neighborly Paridae / Poecile black-capped chickadee desk life — feebee / gargle / hangup / cache / poecile personality (feebee fee-bee song stance without naming sing or song or cry or call or talk-cry, gargle gargle-threat bob without naming hiss or cronk or snore or keeyer, hangup hang-upside forage without naming tumble or dihedral or softcrouch or plunge, cache seed-cache stash without naming fossick or mantle or bury-cry, long poecile Poecile atricapillus black-cap desk perch — never named wait or soar or hop or preen or fan or strut or roost or hopwalk or monocle or fossick or anting or corvid or dihedral or billtap or tumble or cronk or hackles or diskturn or softcrouch or parallax or snore or tytonid or kettle or stoop or bind or keeyer or buteo; window-play leaves chickadee fly alone; Soot/Wedge/Heart/Hook own their tricks; guest slug Dee / key chickadee — accept "chickadee" and "dee"; do NOT name a trick chickadee or dee or fee-bee or hang or soar or mantle). Thank-yous atricapillus / practicus / turneri. Feed-happy after eat. Sleep, hide, leave, rest, card, ribbon still win. Same map as desktop chickadee-tricks.js. Window-play unchanged. True black-capped chickadee desk life — not hawk/owl/crow/raven clones. Brick owns the next seat. No cry inventing — thank-yous are silent desk motion only. */
export const TRICK_KEY = "chickadee";
export const TRICKS = ["feebee", "gargle", "hangup", "cache", "poecile"] as const;
export const HAPPY = ["atricapillus", "practicus", "turneri"] as const;
export type ChickadeeTrickKind = (typeof TRICKS)[number];
export type ChickadeeHappyKind = (typeof HAPPY)[number];
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

export type ChickadeeTrick = {
  kind: ChickadeeTrickKind;
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

export type ChickadeeHappy = {
  kind: ChickadeeHappyKind;
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

export const HAPPY_DUR = { atricapillus: 1.60, practicus: 1.74, turneri: 1.67 } as const;
export const POECILE_HOLD = 18.74;
export const RELEASE_S = 1.12;
export const DUR = { poecile: POECILE_HOLD + RELEASE_S, feebee: 2.42, gargle: 2.36, hangup: 2.58, cache: 2.46 } as const;

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
export function nextTrickWait(justFinished: boolean, rand?: number, kind?: ChickadeeTrickKind | string) {
    const roll = rand == null ? Math.random() : rand;
      if (kind === "poecile") return 82 + roll * 44;
  if (kind === "feebee") return 16.4 + roll * 12.8;
  if (kind === "gargle") return 17.2 + roll * 12.4;
  if (kind === "cache") return 19.8 + roll * 13.2;
  return justFinished ? 14.6 + roll * 10.9 : 8.4 + roll * 9.7;
  }
export function pickTrick(rand?: number, musicOn?: boolean, lastKind?: ChickadeeTrickKind | string | null) {
    if (musicOn) return "poecile";
    const roll = rand == null ? Math.random() : rand;
    if (lastKind === "poecile") {
      if (roll < 0.26) return "feebee";
      if (roll < 0.5) return "gargle";
      if (roll < 0.74) return "hangup";
      return "cache";
    }
    if (lastKind === "feebee") {
      if (roll < 0.26) return "poecile";
      if (roll < 0.5) return "gargle";
      if (roll < 0.74) return "hangup";
      return "cache";
    }
    if (lastKind === "gargle") {
      if (roll < 0.22) return "poecile";
      if (roll < 0.44) return "feebee";
      if (roll < 0.68) return "hangup";
      return "cache";
    }
    if (roll < 0.2) return "poecile";
    if (roll < 0.4) return "feebee";
    if (roll < 0.6) return "gargle";
    if (roll < 0.8) return "hangup";
    return "cache";
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
    return key === TRICK_KEY || key === "dee";
  }
export function startThankYou(
  key: string | undefined | null,
  lastKind: ChickadeeHappyKind | null | undefined,
  x: number,
  facing: 1 | -1,
  flags?: TrickFlags
) {
    if (!wantsThankYou(key)) return null;
    if (!happyCanStart(flags || { cmd: "idle" })) return null;
    const pick = pickHappy(lastKind);
    return { happy: beginHappy(pick, x, facing), kind: pick };
  }
export function pickHappy(lastKind?: ChickadeeHappyKind | null, rand?: number) {
    const pool = HAPPY.filter((k) => k !== lastKind);
    const list = pool.length ? pool : HAPPY.slice();
    const roll = rand == null ? Math.random() : rand;
    return list[Math.floor(roll * list.length)] || list[0];
  }
export function beginHappy(kind: ChickadeeHappyKind | string, x: number, facing: 1 | -1): ChickadeeHappy {
    const name = HAPPY.indexOf(kind) >= 0 ? kind : "atricapillus";
    return {
      kind: name,
      happy: true,
      phase: "go",
      t: 0,
      x: x,
      lift: 0,
      rot: 0,
      anim: (name === "atricapillus" ? "sit" : name === "practicus" ? "play" : "sit") as TrickAnim,
      facing: (facing == null ? 1 : facing) as 1 | -1,
      fromX: x,
    };
  }
export function atricapillusPose(t: number) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.atricapillus));
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
export function practicusPose(t: number) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.practicus));
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
export function turneriPose(t: number) {
    return {
      lift: 0.007 + Math.abs(Math.sin(t * 0.29)) * 0.015,
      rot: Math.sin(t * 0.29) * 1.25,
      dx: Math.sin(t * 0.24) * 0.0011,
      anim: "sit",
    };
  }
export function stepHappy(happy: ChickadeeHappy | null | undefined, dt: number, flags?: TrickFlags) {
    if (!happy || happy.phase === "done") return happy;
    if (happyShouldAbort(flags)) {
      return Object.assign({}, happy, { phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true });
    }
    const next = Object.assign({}, happy, { t: happy.t + Math.max(0, dt) });
    const hold = HAPPY_DUR[next.kind];
    if (next.kind === "atricapillus") {
      const pose = atricapillusPose(next.t);
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "practicus") {
      const pose = practicusPose(next.t);
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else {
      const pose = turneriPose(next.t);
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
export function beginTrick(kind: ChickadeeTrickKind, x: number, facing: 1 | -1): ChickadeeTrick {
    const anim: TrickAnim =
      kind === "poecile"
        ? "sit"
        : kind === "feebee"
          ? "talk"
          : kind === "gargle"
            ? "play"
            : kind === "hangup"
              ? "play"
              : kind === "cache"
                ? "sit"
                : "sit";
    return {
      kind: kind,
      phase: kind === "poecile" ? "hold" : "go",
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
export function poecilePose(t: number) {
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
export function feebeePose(t: number, fromX: number, facing: 1 | -1) {
    const u = Math.max(0, Math.min(1, t / DUR.feebee));
    const face = facing == null ? 1 : facing;
    if (u < 0.11) {
      const s = smoothstep(u / 0.11);
      // feebee song-stance lifts into a two-note lean
      return { x: fromX, lift: s * 0.022, rot: s * 8.4 * face, anim: "talk" };
    }
    if (u < 0.86) {
      const s = (u - 0.11) / 0.75;
      // feebee song tracks a soft fee-bee without naming sing
      const scan = Math.sin(s * Math.PI * 1.35);
      const settle = Math.abs(Math.sin(s * Math.PI * 2.1));
      return {
        x: fromX + face * (0.006 * s + scan * 0.003),
        lift: 0.018 + settle * 0.012,
        rot: (8.4 + scan * 4.6) * face,
        anim: "talk",
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
export function garglePose(t: number, fromX: number, facing: 1 | -1) {
    const u = Math.max(0, Math.min(1, t / DUR.gargle));
    const face = facing == null ? 1 : facing;
    if (u < 0.16) {
      const s = smoothstep(u / 0.16);
      // gargle threat-bob compresses into a chattersit
      return { x: fromX, lift: s * -0.018, rot: s * -1.15 * face, anim: "play" };
    }
    if (u < 0.80) {
      const hush = Math.sin(t * 2.2) + 0.18 * Math.sin(t * 5.1);
      return {
        x: fromX + face * hush * 0.002,
        lift: -0.018 + Math.abs(hush) * 0.006,
        rot: (-1.15 + hush * 0.55) * face,
        anim: "play",
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
export function hangupPose(t: number, fromX: number, facing: 1 | -1) {
    const u = Math.max(0, Math.min(1, t / DUR.hangup));
    const face = facing == null ? 1 : facing;
    if (u < 0.10) {
      const s = smoothstep(u / 0.10);
      // hangup upside forage coils under the blotter edge
      return { x: fromX, lift: s * 0.034, rot: s * 168 * face, anim: "play" as TrickAnim };
    }
    if (u < 0.86) {
      const swing = Math.sin(t * 3.5) + 0.30 * Math.sin(t * 7.0);
      return {
        x: fromX + face * swing * 0.012,
        lift: 0.030 + Math.abs(swing) * 0.016,
        rot: (168 + swing * 8.5) * face,
        anim: "play" as TrickAnim,
      };
    }
    const s = smoothstep((u - 0.86) / 0.14);
    return { x: fromX, lift: 0.010 * (1 - s), rot: 12 * (1 - s) * face, anim: "idle" as TrickAnim };
  }
export function cachePose(t: number, fromX: number, facing: 1 | -1) {
    const u = Math.max(0, Math.min(1, t / DUR.cache));
    const face = facing == null ? 1 : facing;
    if (u < 0.12) {
      const s = smoothstep(u / 0.12);
      return { x: fromX, lift: s * 0.014, rot: s * -1.55 * face, anim: "sit" };
    }
    if (u < 0.88) {
      // cache stash pulse tucks a seed without naming fossick
      const pulse = Math.sin(t * 2.8) + 0.24 * Math.sin(t * 5.6);
      return {
        x: fromX + face * pulse * 0.0025,
        lift: 0.012 + Math.abs(pulse) * 0.010,
        rot: (-1.55 + pulse * 1.05) * face,
        anim: "sit",
      };
    }
    const s = smoothstep((u - 0.88) / 0.12);
    return { x: fromX, lift: 0.005 * (1 - s), rot: -0.28 * (1 - s) * face, anim: "idle" };
  }
export function stepTrick(trick: ChickadeeTrick | null | undefined, dt: number, flags?: TrickFlags) {
    if (!trick || trick.phase === "done") return trick;
    if (shouldAbort(flags) && trick.kind !== "feebee" && trick.kind !== "gargle" && trick.kind !== "hangup" && trick.kind !== "cache") {
      return Object.assign({}, trick, { phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true });
    }
    const next = Object.assign({}, trick, { t: trick.t + Math.max(0, dt) });
    if (next.kind === "poecile") {
      if (next.t < POECILE_HOLD) {
        const pose = poecilePose(next.t);
        next.phase = "hold";
        next.lift = pose.lift;
        next.rot = pose.rot;
        next.anim = "sit";
        return next;
      }
      if (next.t < POECILE_HOLD + RELEASE_S) {
        const pose = releasePose(next.t - POECILE_HOLD);
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
    if (next.kind === "feebee") {
      const pose = feebeePose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "gargle") {
      const pose = garglePose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "hangup") {
      const pose = hangupPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else {
      const pose = cachePose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    }
    if (u >= 1) return Object.assign({}, next, { phase: "done", lift: 0, rot: 0, anim: "idle" });
    return next;
  }
