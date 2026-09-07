/** Wedge ground tricks while idle. House neighborly Corvidae Common raven desk life — dihedral / billtap / tumble / cronk / hackles personality (dihedral soaring wing-set posture without naming soar or glide or thermal or kettle or loft or hop or walk or strut or fan, billtap bill-tap stow gesture without naming cache or croak or caw or probe or dig or peck or bill or fossick, tumble blotter roll-play without naming barrel or roll or soar or aerobat or looping or hopwalk, cronk throat kronk gesture without naming croak or caw or call or cronk-cry or vocal, long hackles throat-ruff flare on the high rafter — never named wait or wake or still or hide or cover or croak or caw or cache or hop or walk or strut or fan or preen or probe or dig or peck or bill or roost or berry or juggle or peer or skip or quote or crack or flash or sidle or bobble or mimic or dangle or huddle or toboggan or waddle or porpoise or trumpet or hopwalk or monocle or fossick or anting or corvid or spiggin or zigzag or spinous or fanning or gasterosteid or acetabulum or prostomium or looping or undulatory or hirudinean or lantern or jstroke or semaphore or elytra or photinus or plumose or lunule or silk or stream or actias; window-play CROAK owns croak; window-play CACHE owns cache; window-play SOAR owns soar; window-play BARREL owns barrel; Soot owns hopwalk/monocle/fossick/anting/corvid; Budgie owns preen/sidle/bobble/mimic/dangle; Parrot owns quote/strut/fan/crack/flash; Toucan owns roost/berry/juggle/peer/skip; Penguin owns huddle/toboggan/waddle/porpoise/trumpet; Prickle owns spiggin/zigzag/spinous/fanning/gasterosteid; Latch owns acetabulum/prostomium/looping/undulatory/hirudinean; Ghost owns luna moth life; Spark owns firefly life; guest slug Wedge / key raven only for isKey matching — accept "raven" and "wedge"; do NOT name a trick "raven" or "wedge" or "croak" or "caw" or "cache" or "soar" or "barrel" or "hop" or "preen" or "probe" or "fan" or "strut" or "roost" or "hopwalk" or "monocle" or "fossick" or "anting" or "corvid") — not Quill macaw life, not Echo budgie life, not Soot crow life, not Prickle stickleback life, not Latch leech life, not Ghost luna, not Spark firefly. dihedral wing-set on the blotter without naming soar, billtap stow-tap without naming cache, tumble roll-play without naming barrel, cronk throat gesture without naming croak, hackles long Corvus corax metabolic perch on the high rafter with principalis / sinuatus / cryptoleucus cousins in the thank-yous. Feed-happy thank-yous sit after eat. Card-open freeze and window-play CROAK do not swallow a thank-you. Sleep, hide, and leave still win. Same map as web raven-tricks.ts. Window-play CROAK unchanged — never names croak. Window-play CACHE/SOAR/BARREL unchanged. True Corvidae Common raven desk life only — distinct from Quill macaw, Echo budgie, Soot crow, Prickle stickleback, Latch leech, Ghost luna, and Spark firefly. Heart owns the next seat. No cry inventing — thank-yous are silent desk motion only. */
export const TRICK_KEY = "raven";
export const TRICKS = ["dihedral", "billtap", "tumble", "cronk", "hackles"] as const;
export const HAPPY = ["principalis", "sinuatus", "cryptoleucus"] as const;
export type RavenTrickKind = (typeof TRICKS)[number];
export type RavenHappyKind = (typeof HAPPY)[number];
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

export type RavenTrick = {
  kind: RavenTrickKind;
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

export type RavenHappy = {
  kind: RavenHappyKind;
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

export const HAPPY_DUR = { principalis: 1.66, sinuatus: 1.79, cryptoleucus: 1.71 } as const;
export const HACKLES_HOLD = 19.18;
export const RELEASE_S = 1.18;
export const DUR = { hackles: HACKLES_HOLD + RELEASE_S, dihedral: 2.52, billtap: 2.28, tumble: 2.64, cronk: 2.40 } as const;
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

export function nextTrickWait(justFinished: boolean, rand?: number, kind?: RavenTrickKind | string) {
  const roll = rand == null ? Math.random() : rand;
    if (kind === "hackles") return 82 + roll * 48;
  if (kind === "dihedral") return 17.2 + roll * 13.4;
  if (kind === "billtap") return 17.8 + roll * 12.6;
  if (kind === "cronk") return 20.4 + roll * 13.8;
  return justFinished ? 14.6 + roll * 10.9 : 8.4 + roll * 9.7;
}

export function pickTrick(rand?: number, musicOn?: boolean, lastKind?: RavenTrickKind | string | null) {
  if (musicOn) return "hackles";
  const roll = rand == null ? Math.random() : rand;
  if (lastKind === "hackles") {
    if (roll < 0.26) return "dihedral";
    if (roll < 0.5) return "billtap";
    if (roll < 0.74) return "tumble";
    return "cronk";
  }
  if (lastKind === "dihedral") {
    if (roll < 0.26) return "hackles";
    if (roll < 0.5) return "billtap";
    if (roll < 0.74) return "tumble";
    return "cronk";
  }
  if (lastKind === "billtap") {
    if (roll < 0.22) return "hackles";
    if (roll < 0.44) return "dihedral";
    if (roll < 0.68) return "tumble";
    return "cronk";
  }
  if (roll < 0.2) return "hackles";
  if (roll < 0.4) return "dihedral";
  if (roll < 0.6) return "billtap";
  if (roll < 0.8) return "tumble";
  return "cronk";
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
  return key === TRICK_KEY || key === "wedge";
}

export function startThankYou(
  key: string | undefined | null,
  lastKind: RavenHappyKind | string | null | undefined,
  x: number,
  facing: 1 | -1,
  flags?: TrickFlags,
) {
  if (!wantsThankYou(key)) return null;
  if (!happyCanStart(flags || { cmd: "idle" })) return null;
  const pick = pickHappy(lastKind as RavenHappyKind | null | undefined);
  return { happy: beginHappy(pick, x, facing), kind: pick };
}

export function pickHappy(lastKind?: RavenHappyKind | null, rand?: number) {
  const pool = HAPPY.filter((k) => k !== lastKind);
  const list = pool.length ? pool : [...HAPPY];
  const roll = rand == null ? Math.random() : rand;
  return list[Math.floor(roll * list.length)] || list[0];
}

export function beginHappy(kind: RavenHappyKind | string, x: number, facing: 1 | -1): RavenHappy {
  const name = (HAPPY as readonly string[]).indexOf(kind) >= 0 ? (kind as RavenHappyKind) : "principalis";
  return {
    kind: name,
    happy: true,
    phase: "go",
    t: 0,
    x: x,
    lift: 0,
    rot: 0,
    anim: name === "principalis" ? "sit" : name === "sinuatus" ? "play" : "sit",
    facing: facing == null ? 1 : facing,
    fromX: x,
  };
}

                    export function principalisPose(t: number): { lift: number; rot: number; dx: number; anim: TrickAnim } {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.principalis));
    if (u < 0.15) {
      const s = u / 0.15;
      return { lift: s * 0.022, rot: s * 1.40, dx: 0, anim: "sit" };
    }
    if (u < 0.80) {
      const flash = Math.sin(t * 6.9) + 0.30 * Math.sin(t * 13.8);
      return {
        lift: 0.022 + Math.abs(flash) * 0.016,
        rot: 1.40 + flash * 1.35,
        dx: flash * 0.0012,
        anim: "sit",
      };
    }
    const s = (u - 0.80) / 0.20;
    return { lift: 0.009 * (1 - s), rot: 0.42 * (1 - s), dx: 0, anim: "idle" };
  }
export function sinuatusPose(t: number): { lift: number; rot: number; dx: number; anim: TrickAnim } {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.sinuatus));
    if (u < 0.13) {
      const s = u / 0.13;
      return { lift: s * 0.036, rot: s * -1.70, dx: s * 0.0016, anim: "play" };
    }
    if (u < 0.84) {
      const wriggle = Math.sin(t * 4.9) + 0.22 * Math.sin(t * 8.7);
      return {
        lift: 0.036 + Math.abs(wriggle) * 0.022,
        rot: -1.70 + wriggle * 2.85,
        dx: wriggle * 0.0026,
        anim: "play",
      };
    }
    const s = (u - 0.84) / 0.16;
    return { lift: 0.011 * (1 - s), rot: -0.42 * (1 - s), dx: 0, anim: "sit" };
  }
export function cryptoleucusPose(t: number): { lift: number; rot: number; dx: number; anim: TrickAnim } {
    return {
      lift: 0.008 + Math.abs(Math.sin(t * 0.33)) * 0.017,
      rot: Math.sin(t * 0.33) * 1.05,
      dx: Math.sin(t * 0.27) * 0.0013,
      anim: "sit",
    };
  }
export function stepHappy(happy: RavenHappy, dt: number, flags: TrickFlags): RavenHappy {
  if (!happy || happy.phase === "done") return happy;
  if (happyShouldAbort(flags)) {
    return { ...happy, phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true };
  }
  const next: RavenHappy = { ...happy, t: happy.t + Math.max(0, dt) };
  const hold = HAPPY_DUR[next.kind];
  if (next.kind === "principalis") {
    const pose = principalisPose(next.t);
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "sinuatus") {
    const pose = sinuatusPose(next.t);
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else {
    const pose = cryptoleucusPose(next.t);
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

export function beginTrick(kind: RavenTrickKind, x: number, facing: 1 | -1): RavenTrick {
  const anim: TrickAnim =
    kind === "hackles"
      ? "sit"
      : kind === "dihedral"
        ? "sit"
        : kind === "billtap"
          ? "sit"
          : kind === "tumble"
            ? "play"
            : kind === "cronk"
              ? "talk"
              : "sit";
  return {
    kind: kind,
    phase: kind === "hackles" ? "hold" : "go",
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


export function hacklesPose(t: number): { lift: number; rot: number } {
    const breath = Math.sin(t * 0.11) + 0.09 * Math.sin(t * 0.29);
    const soft = Math.abs(Math.sin(t * 0.15));
    return {
      lift: 0.006 + soft * 0.016,
      rot: -0.42 + breath * 0.72,
    };
  }

export function releasePose(t: number): { lift: number; rot: number } {
    const u = Math.max(0, Math.min(1, t / RELEASE_S));
    return { lift: 0.005 * (1 - Math.sin(u * Math.PI * 0.5)), rot: -0.20 * (1 - u) };
  }

export function dihedralPose(t: number, fromX: number, facing: 1 | -1): { x: number; lift: number; rot: number; anim: TrickAnim } {
    const u = Math.max(0, Math.min(1, t / DUR.dihedral));
    const face = facing == null ? 1 : facing;
    if (u < 0.10) {
      const s = smoothstep(u / 0.10);
      // dihedral wing-set settles onto the blotter
      return { x: fromX, lift: s * 0.048, rot: s * -0.32 * face, anim: "sit" };
    }
    if (u < 0.88) {
      const s = (u - 0.10) / 0.78;
      // soaring wing dihedral — hold without naming soar
      const breath = Math.sin(s * Math.PI * 1.6);
      const settle = Math.abs(Math.sin(s * Math.PI * 2.4));
      return {
        x: fromX + face * (0.018 * s + breath * 0.006),
        lift: 0.038 + settle * 0.022,
        rot: (-0.32 + breath * 0.55) * face,
        anim: "sit",
      };
    }
    const s = smoothstep((u - 0.88) / 0.12);
    return {
      x: fromX + face * 0.018 * (1 - s),
      lift: 0.018 * (1 - s),
      rot: -0.12 * (1 - s) * face,
      anim: "idle",
    };
  }
export function billtapPose(t: number, fromX: number, facing: 1 | -1): { x: number; lift: number; rot: number; anim: TrickAnim } {
    const u = Math.max(0, Math.min(1, t / DUR.billtap));
    const face = facing == null ? 1 : facing;
    if (u < 0.14) {
      const s = smoothstep(u / 0.14);
      // bill-tap stow settles
      return { x: fromX, lift: s * 0.012, rot: s * -2.95 * face, anim: "sit" };
    }
    if (u < 0.78) {
      const tap = Math.sin(t * 8.4) + 0.22 * Math.sin(t * 16.8);
      const bite = tap > 0.4 ? 1.0 : tap < -0.4 ? -0.6 : tap * 0.45;
      return {
        x: fromX + face * bite * 0.0035,
        lift: 0.008 + Math.abs(tap) * 0.016,
        rot: (-2.95 + bite * 1.45) * face,
        anim: "sit",
      };
    }
    const s = smoothstep((u - 0.78) / 0.22);
    return {
      x: fromX,
      lift: 0.006 * (1 - s),
      rot: -0.45 * (1 - s) * face,
      anim: "idle",
    };
  }
export function tumblePose(t: number, fromX: number, facing: 1 | -1): { x: number; lift: number; rot: number; anim: TrickAnim } {
    const u = Math.max(0, Math.min(1, t / DUR.tumble));
    const face = facing == null ? 1 : facing;
    if (u < 0.12) {
      const s = smoothstep(u / 0.12);
      // roll-play coils onto the blotter
      return { x: fromX, lift: s * 0.036, rot: s * -3.15 * face, anim: "play" };
    }
    if (u < 0.84) {
      const spin = Math.sin(t * 4.2) + 0.28 * Math.sin(t * 8.4);
      return {
        x: fromX + face * spin * 0.014,
        lift: 0.028 + Math.abs(spin) * 0.032,
        rot: (-2.45 + spin * 4.8) * face,
        anim: "play",
      };
    }
    const s = smoothstep((u - 0.84) / 0.16);
    return { x: fromX, lift: 0.010 * (1 - s), rot: -0.40 * (1 - s) * face, anim: "idle" };
  }
export function cronkPose(t: number, fromX: number, facing: 1 | -1): { x: number; lift: number; rot: number; anim: TrickAnim } {
    const u = Math.max(0, Math.min(1, t / DUR.cronk));
    const face = facing == null ? 1 : facing;
    if (u < 0.10) {
      const s = smoothstep(u / 0.10);
      return { x: fromX, lift: s * 0.016, rot: s * 1.85 * face, anim: "talk" };
    }
    if (u < 0.88) {
      // throat cronk — hackle pulse without naming croak
      const pulse = Math.sin(t * 3.6) + 0.26 * Math.sin(t * 7.2);
      return {
        x: fromX + face * pulse * 0.003,
        lift: 0.014 + Math.abs(pulse) * 0.012,
        rot: (1.85 + pulse * 1.25) * face,
        anim: "talk",
      };
    }
    const s = smoothstep((u - 0.88) / 0.12);
    return { x: fromX, lift: 0.006 * (1 - s), rot: 0.32 * (1 - s) * face, anim: "idle" };
  }
export function stepTrick(trick: RavenTrick, dt: number, flags: TrickFlags): RavenTrick {
  if (!trick || trick.phase === "done") return trick;
  if (shouldAbort(flags) && trick.kind !== "dihedral" && trick.kind !== "billtap" && trick.kind !== "tumble" && trick.kind !== "cronk") {
    return { ...trick, phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true };
  }
  const next: RavenTrick = { ...trick, t: trick.t + Math.max(0, dt) };
  if (next.kind === "hackles") {
    if (next.t < HACKLES_HOLD) {
      const pose = hacklesPose(next.t);
      next.phase = "hold";
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = "sit";
      return next;
    }
    if (next.t < HACKLES_HOLD + RELEASE_S) {
      const pose = releasePose(next.t - HACKLES_HOLD);
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
  if (next.kind === "dihedral") {
    const pose = dihedralPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "billtap") {
    const pose = billtapPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "tumble") {
    const pose = tumblePose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else {
    const pose = cronkPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  }
  if (u >= 1) return { ...next, phase: "done", lift: 0, rot: 0, anim: "idle" };
  return next;
}
