/** Boot ground tricks while idle — ultra-polish pass. House neighborly Ciliophora slipper paramecium desk life — cilia / pellicle / cytostome / vacuole / ciliophora / trichocyst / avoiding personality (cilia metachronal beat-row without naming row or beat or still or wiggle or dart, pellicle glide without naming glide or swim or dart or still, cytostome oral-groove feed without naming feed or eat or gulp or still, vacuole contractile pulse without naming pump or still or dart, long ciliophora Paramecium desk hold under the drop glass, trichocyst extrusome burst without naming sting or dart or flare or still (THE ciliate defense-extrusome tell), avoiding ciliary-reversal turn without naming reverse or dart or swim or still (THE paramecium avoiding-reaction tell) — never named wait or wake or still or hide or cover or glue or flare or dart or nest or zig or swim or gulp or drift or glint or hinge or sucker or latch or crawl or dig or burrow or pedal or radula or pneumostome or ommatophore or lymnaeid or adductor or protractor or inhalant or ctenidium or unionid or acetabulum or prostomium or looping or undulatory or hirudinean or botryoidal or auricle or spiggin or zigzag or spinous or fanning or gasterosteid or nuptial or pelvic or spiral or siphuncle or nacre or pinhole or fringe or swap or antenna or scuttle or withdraw or vacancy or chelate or caridoid or chimney or antennule or astacid or mantle or jet or claw or snap or pinch or annulate or fossorial or tentacular or hydrostatic or gymnophion or filter or siphon or gape or click or arc or buzz or switch or scute or ciliabeatrow or slippergilde or oralgroovefeed or contractvacuole or longboothush as trick kinds; ethogram softs + freeze own those words; window-play drop-glass owns the pane slipper; Coin owns flare/dart/drift/gulp/glint; Twig owns stick-insect life; Latch owns acetabulum/prostomium/looping/undulatory/hirudinean/botryoidal/auricle; Hinge owns adductor/protractor/inhalant/ctenidium/unionid/ligament/glochid; Whorl owns radula/pedal/pneumostome/ommatophore/lymnaeid/odontophore/neuston; Prickle owns spiggin/zigzag/spinous/fanning/gasterosteid/nuptial/pelvic; Door owns hinge; Anchor owns siphon; guest slug Boot / key paramecium only for isKey matching — accept "paramecium" and "boot"; do NOT name a trick "paramecium" or "boot" or "glue" or "flare" or "dart" or "still" or "row" or "wiggle" or "swim" or "gulp" or "scute") — not Prickle stickleback life, not Coin goldfish life, not Latch leech life, not Hinge mussel life, not Twig stick-insect life, not Door moray, not Anchor seahorse, not Kite manta, not Gauss filing-dragon, not Reach amoeba. cilia metachronal beat on the drop dish without naming row, pellicle glide without naming dart, cytostome oral-groove without naming eat, vacuole contractile pulse without naming pump, ciliophora long Paramecium metabolic hold under the scrap drop, trichocyst extrusome burst (THE ciliate defense tell), avoiding ciliary-reversal turn (THE paramecium avoiding-reaction tell); caudatum / aurelia / bursaria thank-yous. Feed-happy thank-yous sit after eat. Card-open freeze and window-play drop-glass do not swallow a thank-you. Sleep, hide, and leave still win. Same map as desktop paramecium-tricks.js. Window-play drop-glass unchanged. Ethogram softs + freeze — never names cilia/row/still as bare ethogram-only trick kinds. True Ciliophora slipper paramecium desk life only — distinct from Prickle stickleback, Coin goldfish, Latch leech, Hinge mussel, Twig stick insect, Door moray, Anchor seahorse, Kite manta, Gauss filing-dragon, and Reach amoeba. Pane owns the next seat. No cry inventing — thank-yous are silent desk motion only. Amplitudes raised toward Rui richness; denser waits/weights; prefersHouseCry via paramecium.wav. */
export const TRICK_KEY = "paramecium";
export const TRICKS = ["cilia", "pellicle", "cytostome", "vacuole", "ciliophora", "trichocyst", "avoiding"] as const;
export const HAPPY = ["caudatum", "aurelia", "bursaria"] as const;
export type ParameciumTrickKind = (typeof TRICKS)[number];
export type ParameciumHappyKind = (typeof HAPPY)[number];
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

export type ParameciumTrick = {
  kind: ParameciumTrickKind;
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

export type ParameciumHappy = {
  kind: ParameciumHappyKind;
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

export const HAPPY_DUR = { caudatum: 1.64, aurelia: 1.76, bursaria: 1.71 } as const;
export const CILIOPHORA_HOLD = 10.8;
export const RELEASE_S = 1.14;
export const DUR = {
  ciliophora: CILIOPHORA_HOLD + RELEASE_S,
  cilia: 2.28,
  pellicle: 2.42,
  cytostome: 2.48,
  vacuole: 2.34,
  trichocyst: 2.36,
  avoiding: 2.31,
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

export function nextTrickWait(justFinished: boolean, rand?: number, kind?: ParameciumTrickKind | string) {
  const roll = rand == null ? Math.random() : rand;
  if (kind === "ciliophora") return 38 + roll * 24;
  if (kind === "trichocyst" || kind === "avoiding" || kind === "cilia") return 12 + roll * 9;
  if (kind === "pellicle" || kind === "cytostome" || kind === "vacuole") return 11 + roll * 8;
  return justFinished ? 8 + roll * 8 : 4 + roll * 7;
}

export function pickTrick(rand?: number, musicOn?: boolean, lastKind?: ParameciumTrickKind | string | null) {
  if (musicOn) return "ciliophora" as const;
  const roll = rand == null ? Math.random() : rand;
  if (lastKind === "ciliophora") {
    if (roll < 0.16) return "cilia" as const;
    if (roll < 0.32) return "pellicle" as const;
    if (roll < 0.48) return "cytostome" as const;
    if (roll < 0.64) return "vacuole" as const;
    if (roll < 0.82) return "trichocyst" as const;
    return "avoiding" as const;
  }
  if (lastKind === "cilia") {
    if (roll < 0.16) return "ciliophora" as const;
    if (roll < 0.32) return "pellicle" as const;
    if (roll < 0.48) return "cytostome" as const;
    if (roll < 0.64) return "vacuole" as const;
    if (roll < 0.82) return "trichocyst" as const;
    return "avoiding" as const;
  }
  if (lastKind === "pellicle") {
    if (roll < 0.14) return "ciliophora" as const;
    if (roll < 0.3) return "cilia" as const;
    if (roll < 0.46) return "cytostome" as const;
    if (roll < 0.62) return "vacuole" as const;
    if (roll < 0.8) return "trichocyst" as const;
    return "avoiding" as const;
  }
  if (lastKind === "trichocyst" || lastKind === "avoiding") {
    if (roll < 0.14) return "ciliophora" as const;
    if (roll < 0.3) return "cilia" as const;
    if (roll < 0.46) return "pellicle" as const;
    if (roll < 0.62) return "cytostome" as const;
    if (roll < 0.78) return "vacuole" as const;
    return lastKind === "trichocyst" ? ("avoiding" as const) : ("trichocyst" as const);
  }
  if (roll < 0.14) return "ciliophora" as const;
  if (roll < 0.28) return "cilia" as const;
  if (roll < 0.42) return "pellicle" as const;
  if (roll < 0.56) return "cytostome" as const;
  if (roll < 0.7) return "vacuole" as const;
  if (roll < 0.85) return "trichocyst" as const;
  return "avoiding" as const;
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
  return key === TRICK_KEY || key === "boot";
}

export function startThankYou(
  key: string | undefined | null,
  lastKind: ParameciumHappyKind | string | null | undefined,
  x: number,
  facing: 1 | -1,
  flags?: TrickFlags,
) {
  if (!wantsThankYou(key)) return null;
  if (!happyCanStart(flags || { cmd: "idle" })) return null;
  const pick = pickHappy(lastKind as ParameciumHappyKind | null | undefined);
  return { happy: beginHappy(pick, x, facing), kind: pick };
}

export function pickHappy(lastKind?: ParameciumHappyKind | null, rand?: number) {
  const pool = HAPPY.filter((k) => k !== lastKind);
  const list = pool.length ? pool : [...HAPPY];
  const roll = rand == null ? Math.random() : rand;
  return list[Math.floor(roll * list.length)] || list[0];
}

export function beginHappy(kind: ParameciumHappyKind | string, x: number, facing: 1 | -1): ParameciumHappy {
  const name = (HAPPY as readonly string[]).indexOf(kind) >= 0 ? (kind as ParameciumHappyKind) : "caudatum";
  return {
    kind: name,
    happy: true,
    phase: "go",
    t: 0,
    x: x,
    lift: 0,
    rot: 0,
    anim: name === "caudatum" ? "sit" : name === "aurelia" ? "play" : "sit",
    facing: facing == null ? 1 : facing,
    fromX: x,
  };
}

export function caudatumPose(t: number) {
  const u = Math.max(0, Math.min(1, t / HAPPY_DUR.caudatum));
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

export function aureliaPose(t: number) {
  const u = Math.max(0, Math.min(1, t / HAPPY_DUR.aurelia));
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

export function bursariaPose(t: number) {
  return {
    lift: 2.2 + Math.abs(Math.sin(t * 0.58)) * 1.1,
    rot: Math.sin(t * 0.52) * 6,
    dx: 0,
    anim: "sit" as TrickAnim,
  };
}

export function stepHappy(happy: ParameciumHappy, dt: number, flags: TrickFlags): ParameciumHappy {
  if (happyShouldAbort(flags)) {
    return { ...happy, phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true };
  }
  const next: ParameciumHappy = { ...happy, t: happy.t + Math.max(0, dt) };
  const hold = HAPPY_DUR[next.kind];
  if (next.kind === "caudatum") {
    const pose = caudatumPose(next.t);
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "aurelia") {
    const pose = aureliaPose(next.t);
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else {
    const pose = bursariaPose(next.t);
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

export function beginTrick(kind: ParameciumTrickKind | string, x: number, facing: 1 | -1): ParameciumTrick {
  const anim: TrickAnim =
    kind === "ciliophora"
      ? "sit"
      : kind === "cilia"
        ? "sit"
        : kind === "pellicle"
          ? "walk"
          : kind === "cytostome"
            ? "play"
            : kind === "vacuole"
              ? "play"
              : kind === "trichocyst"
                ? "play"
                : kind === "avoiding"
                  ? "walk"
                  : "sit";
  return {
    kind: (TRICKS as readonly string[]).indexOf(kind) >= 0 ? (kind as ParameciumTrickKind) : "cilia",
    phase: kind === "ciliophora" ? "hold" : "go",
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

export function ciliophoraPose(t: number) {
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

export function ciliaPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.cilia));
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

export function pelliclePose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.pellicle));
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

export function cytostomePose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.cytostome));
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

export function vacuolePose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.vacuole));
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

export function trichocystPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.trichocyst));
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

export function avoidingPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.avoiding));
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

export function stepTrick(trick: ParameciumTrick, dt: number, flags: TrickFlags): ParameciumTrick {
  if (shouldAbort(flags)) {
    return { ...trick, phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true };
  }
  const next: ParameciumTrick = { ...trick, t: trick.t + Math.max(0, dt) };
  const fromX = trick.fromX != null ? trick.fromX : trick.x;
  if (next.kind === "ciliophora") {
    if (next.t < CILIOPHORA_HOLD) {
      const pose = ciliophoraPose(next.t);
      next.phase = "hold";
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
      return next;
    }
    if (next.t < CILIOPHORA_HOLD + RELEASE_S) {
      const pose = releasePose(next.t - CILIOPHORA_HOLD);
      next.phase = "release";
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = "sit";
      return next;
    }
    return { ...next, phase: "done", lift: 0, rot: 0, anim: "idle" };
  }
  const hold = DUR[next.kind];
  if (next.kind === "cilia") {
    const pose = ciliaPose(next.t, fromX, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "pellicle") {
    const pose = pelliclePose(next.t, fromX, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "cytostome") {
    const pose = cytostomePose(next.t, fromX, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "vacuole") {
    const pose = vacuolePose(next.t, fromX, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "trichocyst") {
    const pose = trichocystPose(next.t, fromX, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else {
    const pose = avoidingPose(next.t, fromX, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  }
  if (next.t >= hold) return { ...next, phase: "done", lift: 0, rot: 0, anim: "idle", x: fromX };
  return next;
}
