/** Prickle ground tricks while idle. House neighborly Gasterosteidae three-spined stickleback desk life — spiggin / zigzag / spinous / fanning / gasterosteid personality (spiggin nest-glue dab without naming glue or nest or flare or dart or still, zigzag courtship-threat dance without naming zig or flare or dart or swim or still, spinous dorsal-spine raise without naming flare or spine or prickle or dart, fanning parental pectoral beat without naming fan or paddle or swim or still or gulp, long gasterosteid Gasterosteus desk hold under the weed bowl — never named wait or wake or still or hide or cover or glue or flare or dart or nest or zig or swim or gulp or drift or glint or hinge or sucker or latch or crawl or dig or burrow or pedal or radula or pneumostome or ommatophore or lymnaeid or adductor or protractor or inhalant or ctenidium or unionid or acetabulum or prostomium or looping or undulatory or hirudinean or spiral or siphuncle or nacre or pinhole or fringe or swap or antenna or scuttle or withdraw or vacancy or chelate or caridoid or chimney or antennule or astacid or mantle or jet or claw or snap or pinch or annulate or fossorial or tentacular or hydrostatic or gymnophion or filter or siphon or gape or click or arc or buzz or switch; ethogram flare/dart/still own those words; window-play GLUE owns glue; Coin owns flare/dart/drift/gulp/glint; Twig owns stick-insect life; Latch owns acetabulum/prostomium/looping/undulatory/hirudinean; Hinge owns adductor/protractor/inhalant/ctenidium/unionid; Whorl owns radula/pedal/pneumostome/ommatophore/lymnaeid; Door owns hinge; Anchor owns siphon; guest slug Prickle / key stickleback only for isKey matching — accept "stickleback" and "prickle"; do NOT name a trick "stickleback" or "prickle" or "glue" or "flare" or "dart" or "still" or "nest" or "swim" or "gulp") — not Coin goldfish life, not Latch leech life, not Hinge mussel life, not Twig stick-insect life, not Door moray, not Anchor seahorse, not Kite manta. spiggin nest-glue dab on the weed dish without naming glue or nest, zigzag courtship zig without naming flare, spinous dorsal raise without naming flare or spine, fanning parental beat without naming fan or swim, gasterosteid long Gasterosteus metabolic hold under the scrap weed with aculeatus / pungitius / spinachia cousins in the thank-yous. Feed-happy thank-yous sit after eat. Card-open freeze and window-play GLUE do not swallow a thank-you. Sleep, hide, and leave still win. Same map as web stickleback-tricks.ts. Ethogram flare/dart/still unchanged — never names flare or dart or still as trick kinds. Window-play GLUE unchanged — never names glue. True Gasterosteidae three-spined stickleback desk life only — distinct from Coin goldfish, Latch leech, Hinge mussel, Twig stick insect, Door moray, Anchor seahorse, and Kite manta. Soot owns the next seat. No cry inventing — thank-yous are silent desk motion only. */
export const TRICK_KEY = "stickleback";
export const TRICKS = ["spiggin", "zigzag", "spinous", "fanning", "gasterosteid"] as const;
export const HAPPY = ["aculeatus", "pungitius", "spinachia"] as const;
export type SticklebackTrickKind = (typeof TRICKS)[number];
export type SticklebackHappyKind = (typeof HAPPY)[number];
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

export type SticklebackTrick = {
  kind: SticklebackTrickKind;
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

export type SticklebackHappy = {
  kind: SticklebackHappyKind;
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

export const HAPPY_DUR = { aculeatus: 1.61, pungitius: 1.74, spinachia: 1.68 } as const;
export const GASTEROSTEID_HOLD = 18.42;
export const RELEASE_S = 1.12;
export const DUR = { gasterosteid: GASTEROSTEID_HOLD + RELEASE_S, spiggin: 2.34, zigzag: 2.48, spinous: 2.22, fanning: 2.56 } as const;
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

export function nextTrickWait(justFinished: boolean, rand?: number, kind?: SticklebackTrickKind | string) {
  const roll = rand == null ? Math.random() : rand;
    if (kind === "gasterosteid") return 76 + roll * 46;
  if (kind === "spiggin") return 16.4 + roll * 12.8;
  if (kind === "zigzag") return 18.6 + roll * 13.2;
  if (kind === "fanning") return 21.8 + roll * 14.6;
  return justFinished ? 14.6 + roll * 10.9 : 8.4 + roll * 9.7;
}

export function pickTrick(rand?: number, musicOn?: boolean, lastKind?: SticklebackTrickKind | string | null) {
  if (musicOn) return "gasterosteid";
  const roll = rand == null ? Math.random() : rand;
  if (lastKind === "gasterosteid") {
    if (roll < 0.26) return "spiggin";
    if (roll < 0.5) return "zigzag";
    if (roll < 0.74) return "spinous";
    return "fanning";
  }
  if (lastKind === "spiggin") {
    if (roll < 0.26) return "gasterosteid";
    if (roll < 0.5) return "zigzag";
    if (roll < 0.74) return "spinous";
    return "fanning";
  }
  if (lastKind === "zigzag") {
    if (roll < 0.22) return "gasterosteid";
    if (roll < 0.44) return "spiggin";
    if (roll < 0.68) return "spinous";
    return "fanning";
  }
  if (roll < 0.2) return "gasterosteid";
  if (roll < 0.4) return "spiggin";
  if (roll < 0.6) return "zigzag";
  if (roll < 0.8) return "spinous";
  return "fanning";
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
  return key === TRICK_KEY || key === "prickle";
}

export function startThankYou(
  key: string | undefined | null,
  lastKind: SticklebackHappyKind | string | null | undefined,
  x: number,
  facing: 1 | -1,
  flags?: TrickFlags,
) {
  if (!wantsThankYou(key)) return null;
  if (!happyCanStart(flags || { cmd: "idle" })) return null;
  const pick = pickHappy(lastKind as SticklebackHappyKind | null | undefined);
  return { happy: beginHappy(pick, x, facing), kind: pick };
}

export function pickHappy(lastKind?: SticklebackHappyKind | null, rand?: number) {
  const pool = HAPPY.filter((k) => k !== lastKind);
  const list = pool.length ? pool : [...HAPPY];
  const roll = rand == null ? Math.random() : rand;
  return list[Math.floor(roll * list.length)] || list[0];
}

export function beginHappy(kind: SticklebackHappyKind | string, x: number, facing: 1 | -1): SticklebackHappy {
  const name = (HAPPY as readonly string[]).indexOf(kind) >= 0 ? (kind as SticklebackHappyKind) : "aculeatus";
  return {
    kind: name,
    happy: true,
    phase: "go",
    t: 0,
    x: x,
    lift: 0,
    rot: 0,
    anim: name === "aculeatus" ? "sit" : name === "pungitius" ? "play" : "sit",
    facing: facing == null ? 1 : facing,
    fromX: x,
  };
}

                    export function aculeatusPose(t: number) {
  const u = Math.max(0, Math.min(1, t / HAPPY_DUR.aculeatus));
  if (u < 0.15) {
    const s = u / 0.15;
    return { lift: s * 0.022, rot: s * 1.40, dx: 0, anim: "sit" as TrickAnim };
  }
  if (u < 0.80) {
    const flash = Math.sin(t * 6.9) + 0.30 * Math.sin(t * 13.8);
    return {
      lift: 0.022 + Math.abs(flash) * 0.016,
      rot: 1.40 + flash * 1.35,
      dx: flash * 0.0012,
      anim: "sit" as TrickAnim,
    };
  }
  const s = (u - 0.80) / 0.20;
  return { lift: 0.009 * (1 - s), rot: 0.42 * (1 - s), dx: 0, anim: "idle" as TrickAnim };
}
export function pungitiusPose(t: number) {
  const u = Math.max(0, Math.min(1, t / HAPPY_DUR.pungitius));
  if (u < 0.13) {
    const s = u / 0.13;
    return { lift: s * 0.036, rot: s * -1.70, dx: s * 0.0016, anim: "play" as TrickAnim };
  }
  if (u < 0.84) {
    const wriggle = Math.sin(t * 4.9) + 0.22 * Math.sin(t * 8.7);
    return {
      lift: 0.036 + Math.abs(wriggle) * 0.022,
      rot: -1.70 + wriggle * 2.85,
      dx: wriggle * 0.0026,
      anim: "play" as TrickAnim,
    };
  }
  const s = (u - 0.84) / 0.16;
  return { lift: 0.011 * (1 - s), rot: -0.42 * (1 - s), dx: 0, anim: "sit" as TrickAnim };
}
export function spinachiaPose(t: number) {
  return {
    lift: 0.008 + Math.abs(Math.sin(t * 0.33)) * 0.017,
    rot: Math.sin(t * 0.33) * 1.05,
    dx: Math.sin(t * 0.27) * 0.0013,
    anim: "sit" as TrickAnim,
  };
}
export function stepHappy(happy: SticklebackHappy, dt: number, flags: TrickFlags): SticklebackHappy {
  if (!happy || happy.phase === "done") return happy;
  if (happyShouldAbort(flags)) {
    return { ...happy, phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true };
  }
  const next: SticklebackHappy = { ...happy, t: happy.t + Math.max(0, dt) };
  const hold = HAPPY_DUR[next.kind];
  if (next.kind === "aculeatus") {
    const pose = aculeatusPose(next.t);
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "pungitius") {
    const pose = pungitiusPose(next.t);
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else {
    const pose = spinachiaPose(next.t);
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

export function beginTrick(kind: SticklebackTrickKind, x: number, facing: 1 | -1): SticklebackTrick {
  const anim: TrickAnim =
    kind === "gasterosteid"
      ? "sit"
      : kind === "spiggin"
        ? "sit"
        : kind === "zigzag"
          ? "walk"
          : kind === "spinous"
            ? "play"
            : kind === "fanning"
              ? "play"
              : "sit";
  return {
    kind: kind,
    phase: kind === "gasterosteid" ? "hold" : "go",
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


export function gasterosteidPose(t: number) {
  const breath = Math.sin(t * 0.12) + 0.07 * Math.sin(t * 0.33);
  const soft = Math.abs(Math.sin(t * 0.17));
  return {
    lift: 0.004 + soft * 0.013,
    rot: -0.28 + breath * 0.55,
  };
}

export function releasePose(t: number) {
  const u = Math.max(0, Math.min(1, t / RELEASE_S));
  return { lift: 0.005 * (1 - Math.sin(u * Math.PI * 0.5)), rot: -0.20 * (1 - u) };
}

export function spigginPose(t: number, fromX: number, facing: 1 | -1 | null | undefined) {
  const u = Math.max(0, Math.min(1, t / DUR.spiggin));
  const face = facing == null ? 1 : facing;
  if (u < 0.14) {
    const s = smoothstep(u / 0.14);
    return { x: fromX, lift: s * 0.006, rot: s * -1.35 * face, anim: "sit" as TrickAnim };
  }
  if (u < 0.80) {
    const grip = Math.sin(t * 6.4) + 0.26 * Math.sin(t * 12.8);
    const bite = grip > 0.4 ? 0.85 : grip < -0.4 ? -0.45 : grip * 0.35;
    return {
      x: fromX + face * bite * 0.0035,
      lift: 0.006 + Math.abs(grip) * 0.010,
      rot: (-1.35 + bite * 1.9) * face,
      anim: "sit" as TrickAnim,
    };
  }
  const s = smoothstep((u - 0.80) / 0.20);
  return { x: fromX, lift: 0.004 * (1 - s), rot: -0.30 * (1 - s) * face, anim: "idle" as TrickAnim };
}
export function zigzagPose(t: number, fromX: number, facing: 1 | -1 | null | undefined) {
  const u = Math.max(0, Math.min(1, t / DUR.zigzag));
  const face = facing == null ? 1 : facing;
  if (u < 0.10) {
    const s = smoothstep(u / 0.10);
    return { x: fromX, lift: s * 0.028, rot: s * -0.85 * face, anim: "walk" as TrickAnim };
  }
  if (u < 0.88) {
    const s = (u - 0.10) / 0.78;
    const zig = Math.sin(s * Math.PI * 5.0);
    const zag = Math.sin(s * Math.PI * 10.0);
    return {
      x: fromX + face * (zig * 0.085 + zag * 0.018),
      lift: 0.018 + Math.abs(zag) * 0.024,
      rot: (-0.85 + zig * 2.4) * face,
      anim: "walk" as TrickAnim,
    };
  }
  const s = smoothstep((u - 0.88) / 0.12);
  return {
    x: fromX + face * 0.02 * (1 - s),
    lift: 0.010 * (1 - s),
    rot: -0.22 * (1 - s) * face,
    anim: "idle" as TrickAnim,
  };
}
export function spinousPose(t: number, fromX: number, facing: 1 | -1 | null | undefined) {
  const u = Math.max(0, Math.min(1, t / DUR.spinous));
  const face = facing == null ? 1 : facing;
  if (u < 0.14) {
    const s = smoothstep(u / 0.14);
    return { x: fromX, lift: s * 0.048, rot: s * -2.15 * face, anim: "play" as TrickAnim };
  }
  if (u < 0.78) {
    const pulse = Math.sin(t * 6.2) + 0.20 * Math.sin(t * 12.4);
    return {
      x: fromX + face * pulse * 0.004,
      lift: 0.048 + Math.abs(pulse) * 0.014,
      rot: (-2.15 + pulse * 0.55) * face,
      anim: "play" as TrickAnim,
    };
  }
  const s = smoothstep((u - 0.78) / 0.22);
  return {
    x: fromX,
    lift: 0.016 * (1 - s),
    rot: -0.45 * (1 - s) * face,
    anim: "idle" as TrickAnim,
  };
}
export function fanningPose(t: number, fromX: number, facing: 1 | -1 | null | undefined) {
  const u = Math.max(0, Math.min(1, t / DUR.fanning));
  const face = facing == null ? 1 : facing;
  if (u < 0.08) {
    const s = smoothstep(u / 0.08);
    return { x: fromX, lift: s * 0.012, rot: s * 0.45 * face, anim: "play" as TrickAnim };
  }
  if (u < 0.90) {
    const beat = Math.sin(t * 8.4) + 0.18 * Math.sin(t * 16.8);
    return {
      x: fromX + face * beat * 0.006,
      lift: 0.012 + Math.abs(beat) * 0.010,
      rot: (0.45 + beat * 1.25) * face,
      anim: "play" as TrickAnim,
    };
  }
  const s = smoothstep((u - 0.90) / 0.10);
  return { x: fromX, lift: 0.005 * (1 - s), rot: 0.16 * (1 - s) * face, anim: "idle" as TrickAnim };
}
export function stepTrick(trick: SticklebackTrick, dt: number, flags: TrickFlags): SticklebackTrick {
  if (!trick || trick.phase === "done") return trick;
  if (shouldAbort(flags) && trick.kind !== "spiggin" && trick.kind !== "zigzag" && trick.kind !== "spinous" && trick.kind !== "fanning") {
    return { ...trick, phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true };
  }
  const next: SticklebackTrick = { ...trick, t: trick.t + Math.max(0, dt) };
  if (next.kind === "gasterosteid") {
    if (next.t < GASTEROSTEID_HOLD) {
      const pose = gasterosteidPose(next.t);
      next.phase = "hold";
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = "sit";
      return next;
    }
    if (next.t < GASTEROSTEID_HOLD + RELEASE_S) {
      const pose = releasePose(next.t - GASTEROSTEID_HOLD);
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
  if (next.kind === "spiggin") {
    const pose = spigginPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "zigzag") {
    const pose = zigzagPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "spinous") {
    const pose = spinousPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else {
    const pose = fanningPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  }
  if (u >= 1) return { ...next, phase: "done", lift: 0, rot: 0, anim: "idle" };
  return next;
}
