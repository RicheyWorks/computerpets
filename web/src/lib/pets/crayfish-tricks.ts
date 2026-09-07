/** Pinch ground tricks while idle. House neighborly Astacoidea common-crayfish desk life — chelate / caridoid / chimney / antennule / astacid personality (chelate claw-snap without naming claw or snap or pinch, caridoid tail-flip escape burst without naming flip or dart or escape, chimney mud-bank burrow settle without naming burrow or dig or fossorial, antennule tip-tap probe without naming antenna or tap, long astacid Astacoidea desk hold under the tray grain — never named wait or wake or still or hide or cover or wiggle or claw or snap or pinch or antenna or burrow or dig or flip or telson or carapace or swap or scuttle or withdraw or vacancy or bookgill or furrow or fossil or annulate or fossorial or tentacular or hydrostatic or gymnophion; window-play CLAW owns claw; ethogram pinch/snap + walk/wiggle + still/freeze own those words; special Pinch owns pinch; Tenant owns swap/antenna/scuttle/withdraw/vacancy; Ledger owns carapace/bookgill/telson/furrow/fossil; Slip owns annulate/fossorial/tentacular/hydrostatic/gymnophion; Pebble owns burrow; guest slug Pinch / key crayfish only for isKey matching — accept "crayfish" and "pinch"; do NOT name a trick "crayfish" or "pinch" or "claw" or "snap" or "antenna" or "burrow" or "flip" or "telson" or "carapace" or "annulate" or "fossorial" or "tentacular" or "hydrostatic" or "gymnophion") — not Tenant hermit shell life, not Ledger horseshoe helmet life, not Slip caecilian silt life. chelate cheliped snap on the tray without naming claw or snap or pinch, caridoid uropod-tail flip retreat without naming flip or dart, chimney mud chimney settle without naming burrow or dig, antennule antennular tap without naming antenna, astacid long Astacoidea metabolic hold under the scrap grain with clasp / marl / chitin cousins in the thank-yous. Feed-happy thank-yous sit after eat. Card-open freeze and window-play CLAW do not swallow a thank-you. Sleep, hide, and leave still win. Same map as web crayfish-tricks.ts. Window-play CLAW unchanged — never names claw. Ethogram pinch/still/walk unchanged — never names pinch or snap or still or wiggle as trick kinds. True Astacoidea common crayfish desk life only — distinct from Tenant hermit, Ledger horseshoe, and Slip caecilian. Whorl owns the next seat. No cry inventing — thank-yous are silent desk motion only. */
export const TRICK_KEY = "crayfish";
export const TRICKS = ["chelate", "caridoid", "chimney", "antennule", "astacid"] as const;
export const HAPPY = ["clasp", "marl", "chitin"] as const;
export type CrayfishTrickKind = (typeof TRICKS)[number];
export type CrayfishHappyKind = (typeof HAPPY)[number];
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

export type CrayfishTrick = {
  kind: CrayfishTrickKind;
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

export type CrayfishHappy = {
  kind: CrayfishHappyKind;
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

export const HAPPY_DUR = { clasp: 1.58, marl: 1.72, chitin: 1.64 } as const;
export const ASTACID_HOLD = 18.42;
export const RELEASE_S = 1.12;
export const DUR = { astacid: ASTACID_HOLD + RELEASE_S, chelate: 2.28, caridoid: 2.36, chimney: 2.62, antennule: 2.18 } as const;
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

export function nextTrickWait(justFinished: boolean, rand?: number, kind?: CrayfishTrickKind | string) {
  const roll = rand == null ? Math.random() : rand;
    if (kind === "astacid") return 76 + roll * 46;
  if (kind === "chelate") return 16.4 + roll * 12.8;
  if (kind === "caridoid") return 18.6 + roll * 13.2;
  if (kind === "antennule") return 21.8 + roll * 14.6;
  return justFinished ? 14.6 + roll * 10.9 : 8.4 + roll * 9.7;
}

export function pickTrick(rand?: number, musicOn?: boolean, lastKind?: CrayfishTrickKind | string | null) {
  if (musicOn) return "astacid";
  const roll = rand == null ? Math.random() : rand;
  if (lastKind === "astacid") {
    if (roll < 0.26) return "chelate";
    if (roll < 0.5) return "caridoid";
    if (roll < 0.74) return "chimney";
    return "antennule";
  }
  if (lastKind === "chelate") {
    if (roll < 0.26) return "astacid";
    if (roll < 0.5) return "caridoid";
    if (roll < 0.74) return "chimney";
    return "antennule";
  }
  if (lastKind === "caridoid") {
    if (roll < 0.22) return "astacid";
    if (roll < 0.44) return "chelate";
    if (roll < 0.68) return "chimney";
    return "antennule";
  }
  if (roll < 0.2) return "astacid";
  if (roll < 0.4) return "chelate";
  if (roll < 0.6) return "caridoid";
  if (roll < 0.8) return "chimney";
  return "antennule";
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
  return key === TRICK_KEY || key === "pinch";
}

export function startThankYou(
  key: string | undefined | null,
  lastKind: CrayfishHappyKind | string | null | undefined,
  x: number,
  facing: 1 | -1,
  flags?: TrickFlags,
) {
  if (!wantsThankYou(key)) return null;
  if (!happyCanStart(flags || { cmd: "idle" })) return null;
  const pick = pickHappy(lastKind as CrayfishHappyKind | null | undefined);
  return { happy: beginHappy(pick, x, facing), kind: pick };
}

export function pickHappy(lastKind?: CrayfishHappyKind | null, rand?: number) {
  const pool = HAPPY.filter((k) => k !== lastKind);
  const list = pool.length ? pool : [...HAPPY];
  const roll = rand == null ? Math.random() : rand;
  return list[Math.floor(roll * list.length)] || list[0];
}

export function beginHappy(kind: CrayfishHappyKind | string, x: number, facing: 1 | -1): CrayfishHappy {
  const name = (HAPPY as readonly string[]).indexOf(kind) >= 0 ? (kind as CrayfishHappyKind) : "clasp";
  return {
    kind: name,
    happy: true,
    phase: "go",
    t: 0,
    x: x,
    lift: 0,
    rot: 0,
    anim: name === "clasp" ? "sit" : name === "marl" ? "play" : "sit",
    facing: facing == null ? 1 : facing,
    fromX: x,
  };
}

                    export function claspPose(t) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.clasp));
    if (u < 0.15) {
      const s = u / 0.15;
      return { lift: s * 0.022, rot: s * 1.15, dx: 0, anim: "sit" as TrickAnim };
    }
    if (u < 0.80) {
      const flash = Math.sin(t * 7.4) + 0.28 * Math.sin(t * 14.8);
      return {
        lift: 0.022 + Math.abs(flash) * 0.014,
        rot: 1.15 + flash * 1.25,
        dx: flash * 0.0010,
        anim: "sit" as TrickAnim,
      };
    }
    const s = (u - 0.80) / 0.20;
    return { lift: 0.008 * (1 - s), rot: 0.40 * (1 - s), dx: 0, anim: "idle" as TrickAnim };
  }
  export function marlPose(t) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.marl));
    if (u < 0.13) {
      const s = u / 0.13;
      return { lift: s * 0.028, rot: s * -1.45, dx: s * 0.0014, anim: "play" as TrickAnim };
    }
    if (u < 0.84) {
      const wriggle = Math.sin(t * 5.1) + 0.20 * Math.sin(t * 9.3);
      return {
        lift: 0.028 + Math.abs(wriggle) * 0.020,
        rot: -1.45 + wriggle * 2.65,
        dx: wriggle * 0.0024,
        anim: "play" as TrickAnim,
      };
    }
    const s = (u - 0.84) / 0.16;
    return { lift: 0.010 * (1 - s), rot: -0.40 * (1 - s), dx: 0, anim: "sit" as TrickAnim };
  }
  export function chitinPose(t) {
    return {
      lift: 0.007 + Math.abs(Math.sin(t * 0.36)) * 0.015,
      rot: Math.sin(t * 0.39) * 0.92,
      dx: Math.sin(t * 0.28) * 0.0011,
      anim: "sit" as TrickAnim,
    };
  }
export function stepHappy(happy: CrayfishHappy, dt: number, flags: TrickFlags): CrayfishHappy {
  if (!happy || happy.phase === "done") return happy;
  if (happyShouldAbort(flags)) {
    return { ...happy, phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true };
  }
  const next: CrayfishHappy = { ...happy, t: happy.t + Math.max(0, dt) };
  const hold = HAPPY_DUR[next.kind];
  if (next.kind === "clasp") {
    const pose = claspPose(next.t);
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "marl") {
    const pose = marlPose(next.t);
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else {
    const pose = chitinPose(next.t);
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

export function beginTrick(kind: CrayfishTrickKind, x: number, facing: 1 | -1): CrayfishTrick {
  const anim: TrickAnim =
    kind === "astacid"
      ? "sit"
      : kind === "chelate"
        ? "play"
        : kind === "caridoid"
          ? "play"
          : kind === "chimney"
            ? "walk"
            : kind === "antennule"
              ? "sit"
              : "sit";
  return {
    kind: kind,
    phase: kind === "astacid" ? "hold" : "go",
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


                      export function astacidPose(t) {
    const breath = Math.sin(t * 0.12) + 0.06 * Math.sin(t * 0.33);
    const soft = Math.abs(Math.sin(t * 0.17));
    return {
      lift: 0.003 + soft * 0.011,
      rot: -0.22 + breath * 0.48,
    };
  }

  export function releasePose(t) {
    const u = Math.max(0, Math.min(1, t / RELEASE_S));
    return { lift: 0.004 * (1 - Math.sin(u * Math.PI * 0.5)), rot: -0.18 * (1 - u) };
  }

  function chelatePose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.chelate));
    const face = facing == null ? 1 : facing;
    if (u < 0.12) {
      const s = smoothstep(u / 0.12);
      return { x: fromX, lift: s * 0.022, rot: s * 1.8 * face, anim: "play" };
    }
    if (u < 0.78) {
      // chelate claw-snap pulses
      const snap = Math.sin(t * 8.2) + 0.30 * Math.sin(t * 16.4);
      const bite = snap > 0.35 ? 1.0 : snap < -0.35 ? -0.55 : snap * 0.4;
      return {
        x: fromX + face * bite * 0.006,
        lift: 0.022 + Math.abs(snap) * 0.016,
        rot: (1.8 + bite * 2.4) * face,
        anim: "play",
      };
    }
    const s = smoothstep((u - 0.78) / 0.22);
    return { x: fromX, lift: 0.008 * (1 - s), rot: 0.35 * (1 - s) * face, anim: "idle" };
  }
  function caridoidPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.caridoid));
    const face = facing == null ? 1 : facing;
    if (u < 0.10) {
      const s = smoothstep(u / 0.10);
      return { x: fromX, lift: s * 0.034, rot: s * -2.4 * face, anim: "play" };
    }
    if (u < 0.42) {
      const s = smoothstep((u - 0.10) / 0.32);
      // caridoid escape: sudden reverse tail-flip burst
      return {
        x: fromX - face * (0.055 + s * 0.095),
        lift: 0.034 + Math.sin(s * Math.PI) * 0.045,
        rot: (-2.4 + s * 3.1) * face,
        anim: "play",
      };
    }
    if (u < 0.78) {
      const s = (u - 0.42) / 0.36;
      const settle = Math.sin(s * Math.PI * 2.1);
      return {
        x: fromX - face * (0.150 - s * 0.150),
        lift: 0.018 + Math.abs(settle) * 0.012,
        rot: (0.55 + settle * 1.1) * face,
        anim: "walk",
      };
    }
    const s = smoothstep((u - 0.78) / 0.22);
    return { x: fromX, lift: 0.010 * (1 - s), rot: 0.25 * (1 - s) * face, anim: "idle" };
  }
  function chimneyPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.chimney));
    const face = facing == null ? 1 : facing;
    if (u < 0.18) {
      const s = smoothstep(u / 0.18);
      // sink into mud chimney
      return { x: fromX + face * s * 0.012, lift: -s * 0.055, rot: s * 0.55 * face, anim: "walk" };
    }
    if (u < 0.70) {
      const s = (u - 0.18) / 0.52;
      const mud = Math.sin(s * Math.PI * 2.4) + 0.14 * Math.sin(s * Math.PI * 4.8);
      return {
        x: fromX + face * (0.012 + mud * 0.008),
        lift: -0.055 + Math.abs(mud) * 0.010,
        rot: (0.55 + mud * 0.85) * face,
        anim: "sit",
      };
    }
    const s = smoothstep((u - 0.70) / 0.30);
    return {
      x: fromX + face * 0.012 * (1 - s),
      lift: -0.055 * (1 - s),
      rot: 0.20 * (1 - s) * face,
      anim: s > 0.6 ? "idle" : "sit",
    };
  }
  function antennulePose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.antennule));
    const face = facing == null ? 1 : facing;
    if (u < 0.12) {
      const s = smoothstep(u / 0.12);
      return { x: fromX, lift: s * 0.008, rot: s * 0.95 * face, anim: "sit" };
    }
    if (u < 0.84) {
      const tap = Math.sin(t * 6.8) + 0.22 * Math.sin(t * 13.6);
      return {
        x: fromX + face * tap * 0.0035,
        lift: 0.008 + Math.abs(tap) * 0.006,
        rot: (0.95 + tap * 1.55) * face,
        anim: "sit",
      };
    }
    const s = smoothstep((u - 0.84) / 0.16);
    return { x: fromX, lift: 0.004 * (1 - s), rot: 0.25 * (1 - s) * face, anim: "idle" };
  }
export function stepTrick(trick: CrayfishTrick, dt: number, flags: TrickFlags): CrayfishTrick {
  if (!trick || trick.phase === "done") return trick;
  if (shouldAbort(flags) && trick.kind !== "chelate" && trick.kind !== "caridoid" && trick.kind !== "chimney" && trick.kind !== "antennule") {
    return { ...trick, phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true };
  }
  const next: CrayfishTrick = { ...trick, t: trick.t + Math.max(0, dt) };
  if (next.kind === "astacid") {
    if (next.t < ASTACID_HOLD) {
      const pose = astacidPose(next.t);
      next.phase = "hold";
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = "sit";
      return next;
    }
    if (next.t < ASTACID_HOLD + RELEASE_S) {
      const pose = releasePose(next.t - ASTACID_HOLD);
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
  if (next.kind === "chelate") {
    const pose = chelatePose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "caridoid") {
    const pose = caridoidPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "chimney") {
    const pose = chimneyPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else {
    const pose = antennulePose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  }
  if (u >= 1) return { ...next, phase: "done", lift: 0, rot: 0, anim: "idle" };
  return next;
}
