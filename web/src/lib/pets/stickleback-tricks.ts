/** Prickle ground tricks while idle — ultra-polish pass. House neighborly Gasterosteidae three-spined stickleback desk life — spiggin / zigzag / spinous / fanning / gasterosteid / nuptial / pelvic personality (spiggin nest-glue dab without naming glue or nest or flare or dart or still, zigzag courtship-threat dance without naming zig or flare or dart or swim or still, spinous dorsal-spine raise without naming flare or spine or prickle or dart, fanning parental pectoral beat without naming fan or paddle or swim or still or gulp, long gasterosteid Gasterosteus desk hold under the weed bowl, nuptial breeding-dress pulse without naming red or color or flare or dart (THE male stickleback courtship-color tell), pelvic ventral-spine threaten without naming spine or flare or prickle or dart (THE gasterosteid armor-spine tell) — never named wait or wake or still or hide or cover or glue or flare or dart or nest or zig or swim or gulp or drift or glint or hinge or sucker or latch or crawl or dig or burrow or pedal or radula or pneumostome or ommatophore or lymnaeid or adductor or protractor or inhalant or ctenidium or unionid or acetabulum or prostomium or looping or undulatory or hirudinean or botryoidal or auricle or spiral or siphuncle or nacre or pinhole or fringe or swap or antenna or scuttle or withdraw or vacancy or chelate or caridoid or chimney or antennule or astacid or mantle or jet or claw or snap or pinch or annulate or fossorial or tentacular or hydrostatic or gymnophion or filter or siphon or gape or click or arc or buzz or switch or scute as trick kinds; ethogram softs + freeze own those words; window-play GLUE owns glue; Coin owns flare/dart/drift/gulp/glint; Twig owns stick-insect life; Latch owns acetabulum/prostomium/looping/undulatory/hirudinean/botryoidal/auricle; Hinge owns adductor/protractor/inhalant/ctenidium/unionid/ligament/glochid; Whorl owns radula/pedal/pneumostome/ommatophore/lymnaeid/odontophore/neuston; Door owns hinge; Anchor owns siphon; guest slug Prickle / key stickleback only for isKey matching — accept "stickleback" and "prickle"; do NOT name a trick "stickleback" or "prickle" or "glue" or "flare" or "dart" or "still" or "nest" or "swim" or "gulp" or "scute") — not Coin goldfish life, not Latch leech life, not Hinge mussel life, not Twig stick-insect life, not Door moray, not Anchor seahorse, not Kite manta. spiggin nest-glue dab on the weed dish without naming glue or nest, zigzag courtship zig without naming flare, spinous dorsal raise without naming flare or spine, fanning parental beat without naming fan or swim, gasterosteid long Gasterosteus metabolic hold under the scrap weed, nuptial breeding-dress pulse (THE stickleback courtship-color tell), pelvic ventral-spine threaten (THE gasterosteid armor-spine tell); aculeatus / pungitius / spinachia thank-yous. Feed-happy thank-yous sit after eat. Card-open freeze and window-play GLUE do not swallow a thank-you. Sleep, hide, and leave still win. Same map as desktop stickleback-tricks.js. Window-play GLUE unchanged. Ethogram softs + freeze — never names flare/dart/still as trick kinds. True Gasterosteidae three-spined stickleback desk life only — distinct from Coin goldfish, Latch leech, Hinge mussel, Twig stick insect, Door moray, Anchor seahorse, and Kite manta. Hold owns the next seat. No cry inventing — thank-yous are silent desk motion only. Amplitudes raised toward Rui richness; denser waits/weights; prefersHouseCry via stickleback.wav. */
export const TRICK_KEY = "stickleback";
export const TRICKS = ["spiggin", "zigzag", "spinous", "fanning", "gasterosteid", "nuptial", "pelvic"] as const;
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

export const HAPPY_DUR = { aculeatus: 1.64, pungitius: 1.76, spinachia: 1.71 } as const;
export const GASTEROSTEID_HOLD = 10.8;
export const RELEASE_S = 1.14;
export const DUR = {
  gasterosteid: GASTEROSTEID_HOLD + RELEASE_S,
  spiggin: 2.28,
  zigzag: 2.42,
  spinous: 2.48,
  fanning: 2.34,
  nuptial: 2.36,
  pelvic: 2.31,
} as const;

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
  if (kind === "gasterosteid") return 38 + roll * 24;
  if (kind === "nuptial" || kind === "pelvic" || kind === "spiggin") return 12 + roll * 9;
  if (kind === "zigzag" || kind === "spinous" || kind === "fanning") return 11 + roll * 8;
  return justFinished ? 8 + roll * 8 : 4 + roll * 7;
}

export function pickTrick(rand?: number, musicOn?: boolean, lastKind?: SticklebackTrickKind | string | null) {
  if (musicOn) return "gasterosteid" as const;
  const roll = rand == null ? Math.random() : rand;
  if (lastKind === "gasterosteid") {
    if (roll < 0.16) return "spiggin" as const;
    if (roll < 0.32) return "zigzag" as const;
    if (roll < 0.48) return "spinous" as const;
    if (roll < 0.64) return "fanning" as const;
    if (roll < 0.82) return "nuptial" as const;
    return "pelvic" as const;
  }
  if (lastKind === "spiggin") {
    if (roll < 0.16) return "gasterosteid" as const;
    if (roll < 0.32) return "zigzag" as const;
    if (roll < 0.48) return "spinous" as const;
    if (roll < 0.64) return "fanning" as const;
    if (roll < 0.82) return "nuptial" as const;
    return "pelvic" as const;
  }
  if (lastKind === "zigzag") {
    if (roll < 0.14) return "gasterosteid" as const;
    if (roll < 0.3) return "spiggin" as const;
    if (roll < 0.46) return "spinous" as const;
    if (roll < 0.62) return "fanning" as const;
    if (roll < 0.8) return "nuptial" as const;
    return "pelvic" as const;
  }
  if (lastKind === "nuptial" || lastKind === "pelvic") {
    if (roll < 0.14) return "gasterosteid" as const;
    if (roll < 0.3) return "spiggin" as const;
    if (roll < 0.46) return "zigzag" as const;
    if (roll < 0.62) return "spinous" as const;
    if (roll < 0.78) return "fanning" as const;
    return lastKind === "nuptial" ? ("pelvic" as const) : ("nuptial" as const);
  }
  if (roll < 0.14) return "gasterosteid" as const;
  if (roll < 0.28) return "spiggin" as const;
  if (roll < 0.42) return "zigzag" as const;
  if (roll < 0.56) return "spinous" as const;
  if (roll < 0.7) return "fanning" as const;
  if (roll < 0.85) return "nuptial" as const;
  return "pelvic" as const;
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
  if (u < 0.16) {
    const s = u / 0.16;
    return { lift: s * 2.8, rot: s * 12, dx: 0, anim: "talk" as TrickAnim };
  }
  if (u < 0.82) {
    const flash = Math.sin(t * 1.72);
    return {
      lift: 2.8 + Math.abs(flash) * 1.4,
      rot: 12 + flash * 8,
      dx: 0,
      anim: "talk" as TrickAnim,
    };
  }
  const s = (u - 0.82) / 0.18;
  return { lift: 2.0 * (1 - s), rot: 6 * (1 - s), dx: 0, anim: "idle" as TrickAnim };
}

export function pungitiusPose(t: number) {
  const u = Math.max(0, Math.min(1, t / HAPPY_DUR.pungitius));
  if (u < 0.14) {
    const s = u / 0.14;
    return { lift: s * 3.4, rot: s * -14, dx: s * 0.15, anim: "play" as TrickAnim };
  }
  if (u < 0.84) {
    const wriggle = Math.sin(t * 2.1);
    return {
      lift: 3.4 + Math.abs(wriggle) * 1.6,
      rot: -14 + wriggle * 10,
      dx: 0.08,
      anim: "play" as TrickAnim,
    };
  }
  const s = (u - 0.84) / 0.16;
  return { lift: 2.2 * (1 - s), rot: -6 * (1 - s), dx: 0, anim: "sit" as TrickAnim };
}

export function spinachiaPose(t: number) {
  return {
    lift: 2.2 + Math.abs(Math.sin(t * 0.58)) * 1.1,
    rot: Math.sin(t * 0.52) * 6,
    dx: 0,
    anim: "sit" as TrickAnim,
  };
}

export function stepHappy(happy: SticklebackHappy, dt: number, flags: TrickFlags): SticklebackHappy {
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

export function beginTrick(kind: SticklebackTrickKind | string, x: number, facing: 1 | -1): SticklebackTrick {
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
              : kind === "nuptial"
                ? "play"
                : kind === "pelvic"
                  ? "walk"
                  : "sit";
  return {
    kind: (TRICKS as readonly string[]).indexOf(kind) >= 0 ? (kind as SticklebackTrickKind) : "spiggin",
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
  return {
    lift: 2.4 + Math.abs(Math.sin(t * 0.42)) * 1.2,
    rot: -0.18 + Math.sin(t * 0.14) * 4,
    anim: "sit" as TrickAnim,
  };
}

export function releasePose(t: number) {
  const u = Math.max(0, Math.min(1, t / RELEASE_S));
  return { lift: 2.4 * (1 - Math.sin(u * Math.PI * 0.5)), rot: -0.18 * (1 - u) };
}

export function spigginPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.spiggin));
  const face = facing == null ? 1 : facing;
  if (u < 0.14) {
    const s = smoothstep(u / 0.14);
    return { x: fromX, lift: s * 3.2, rot: s * 14 * face, anim: "sit" as TrickAnim };
  }
  if (u < 0.78) {
    const snap = Math.sin(t * 2.4);
    return {
      x: fromX + face * snap * 0.12,
      lift: 3.2 + Math.abs(snap) * 1.4,
      rot: face * (14 + snap * 10),
      anim: "sit" as TrickAnim,
    };
  }
  const s = smoothstep((u - 0.78) / 0.22);
  return {
    x: fromX,
    lift: 1.4 * (1 - s),
    rot: face * (4 * (1 - s)),
    anim: "idle" as TrickAnim,
  };
}

export function zigzagPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.zigzag));
  const face = facing == null ? 1 : facing;
  if (u < 0.12) {
    const s = smoothstep(u / 0.12);
    return { x: fromX, lift: s * 3.6, rot: s * -16 * face, anim: "walk" as TrickAnim };
  }
  if (u < 0.48) {
    const s = smoothstep((u - 0.12) / 0.36);
    return {
      x: fromX - face * (2.2 + s * 4.5),
      lift: 3.6 + Math.sin(s * Math.PI) * 2.2,
      rot: face * (-16 + s * 22),
      anim: "walk" as TrickAnim,
    };
  }
  if (u < 0.78) {
    const s = (u - 0.48) / 0.3;
    const settle = Math.sin(s * Math.PI * 2.1);
    return {
      x: fromX - face * (6.7 * (1 - s)),
      lift: 2.4 + Math.abs(settle) * 1.1,
      rot: face * (6 + settle * 8),
      anim: "walk" as TrickAnim,
    };
  }
  const s = smoothstep((u - 0.78) / 0.22);
  return {
    x: fromX,
    lift: 1.4 * (1 - s),
    rot: face * (3 * (1 - s)),
    anim: "idle" as TrickAnim,
  };
}

export function spinousPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.spinous));
  const face = facing == null ? 1 : facing;
  if (u < 0.16) {
    const s = smoothstep(u / 0.16);
    return { x: fromX + face * s * 0.8, lift: s * 2.2, rot: s * 8 * face, anim: "play" as TrickAnim };
  }
  if (u < 0.72) {
    const mud = Math.sin(t * 1.6);
    return {
      x: fromX + face * (0.8 + mud * 0.4),
      lift: 2.2 + Math.abs(mud) * 1.0,
      rot: face * (8 + mud * 10),
      anim: "play" as TrickAnim,
    };
  }
  const s = smoothstep((u - 0.72) / 0.28);
  return {
    x: fromX + face * 0.8 * (1 - s),
    lift: 1.2 * (1 - s),
    rot: face * (3 * (1 - s)),
    anim: s > 0.6 ? ("idle" as TrickAnim) : ("play" as TrickAnim),
  };
}

export function fanningPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.fanning));
  const face = facing == null ? 1 : facing;
  if (u < 0.14) {
    const s = smoothstep(u / 0.14);
    return { x: fromX, lift: s * 2.4, rot: s * 10 * face, anim: "play" as TrickAnim };
  }
  if (u < 0.84) {
    const tap = Math.sin(t * 2.8);
    return {
      x: fromX + face * tap * 0.2,
      lift: 2.4 + Math.abs(tap) * 1.1,
      rot: face * (10 + tap * 12),
      anim: "play" as TrickAnim,
    };
  }
  const s = smoothstep((u - 0.84) / 0.16);
  return {
    x: fromX,
    lift: 1.2 * (1 - s),
    rot: face * (3 * (1 - s)),
    anim: "idle" as TrickAnim,
  };
}

export function nuptialPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.nuptial));
  const face = facing == null ? 1 : facing;
  if (u < 0.14) {
    const s = smoothstep(u / 0.14);
    return { x: fromX, lift: s * 2.8, rot: s * 12 * face, anim: "play" as TrickAnim };
  }
  if (u < 0.55) {
    const pulse = Math.sin(t * 3.2);
    return {
      x: fromX,
      lift: 2.8 + pulse * 1.6,
      rot: face * (12 + pulse * 14),
      anim: "play" as TrickAnim,
    };
  }
  if (u < 0.78) {
    const scent = Math.sin(t * 1.1);
    return {
      x: fromX + face * scent * 0.15,
      lift: 4.0 + Math.abs(scent) * 0.6,
      rot: face * (22 + scent * 4),
      anim: "play" as TrickAnim,
    };
  }
  const s = smoothstep((u - 0.78) / 0.22);
  return {
    x: fromX,
    lift: 2.0 * (1 - s),
    rot: face * (8 * (1 - s)),
    anim: "idle" as TrickAnim,
  };
}

export function pelvicPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.pelvic));
  const face = facing == null ? 1 : facing;
  if (u < 0.14) {
    const s = smoothstep(u / 0.14);
    return { x: fromX, lift: s * 3.4, rot: s * -12 * face, anim: "walk" as TrickAnim };
  }
  if (u < 0.55) {
    const flash = Math.abs(Math.sin(t * 2.6));
    return {
      x: fromX + face * flash * 0.2,
      lift: 3.4 + flash * 1.4,
      rot: face * (-12 - flash * 10),
      anim: "walk" as TrickAnim,
    };
  }
  if (u < 0.78) {
    const warn = Math.sin(t * 1.4);
    return {
      x: fromX,
      lift: 4.4 + Math.abs(warn) * 0.7,
      rot: face * (-18 + warn * 6),
      anim: "walk" as TrickAnim,
    };
  }
  const s = smoothstep((u - 0.78) / 0.22);
  return {
    x: fromX,
    lift: 1.8 * (1 - s),
    rot: face * (-5 * (1 - s)),
    anim: "idle" as TrickAnim,
  };
}

export function stepTrick(trick: SticklebackTrick, dt: number, flags: TrickFlags): SticklebackTrick {
  if (shouldAbort(flags)) {
    return { ...trick, phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true };
  }
  const next: SticklebackTrick = { ...trick, t: trick.t + Math.max(0, dt) };
  const fromX = trick.fromX != null ? trick.fromX : trick.x;
  if (next.kind === "gasterosteid") {
    if (next.t < GASTEROSTEID_HOLD) {
      const pose = gasterosteidPose(next.t);
      next.phase = "hold";
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
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
  if (next.kind === "spiggin") {
    const pose = spigginPose(next.t, fromX, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "zigzag") {
    const pose = zigzagPose(next.t, fromX, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "spinous") {
    const pose = spinousPose(next.t, fromX, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "fanning") {
    const pose = fanningPose(next.t, fromX, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "nuptial") {
    const pose = nuptialPose(next.t, fromX, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else {
    const pose = pelvicPose(next.t, fromX, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  }
  if (next.t >= hold) return { ...next, phase: "done", lift: 0, rot: 0, anim: "idle", x: fromX };
  return next;
}
