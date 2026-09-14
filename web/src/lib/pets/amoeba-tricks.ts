/** Reach ground tricks while idle — ultra-polish pass. House neighborly Proteus amoeba desk life — pseudopod / ectoplasm / endoplasm / foodcup / proteus / uroid / streaming personality (pseudopod lobose reach without naming reach or stretch or still or dart or foot, ectoplasm clear rim crawl without naming crawl or glide or still or dart, endoplasm granular streaming without naming flow or still or dart, foodcup phagocytic cup without naming feed or eat or gulp or still, long proteus Amoeba desk hold under the pane foot, uroid trailing-end tuck without naming trail or dart or still or foot (THE amoeba uroid tell), streaming sol-gel cytoplasmic flow without naming flow or dart or swim or still (THE amoeba cytoplasmic-streaming tell) — never named wait or wake or still or hide or cover or glue or flare or dart or nest or zig or swim or gulp or drift or glint or hinge or sucker or latch or crawl or dig or burrow or pedal or radula or pneumostome or ommatophore or lymnaeid or adductor or protractor or inhalant or ctenidium or unionid or acetabulum or prostomium or looping or undulatory or hirudinean or botryoidal or auricle or spiggin or zigzag or spinous or fanning or gasterosteid or nuptial or pelvic or cilia or pellicle or cytostome or vacuole or ciliophora or trichocyst or avoiding or slipper or row or wiggle or scute or pseudopodreach or ectoplasmcrawl or foodvacuole or nucleusdrift or longreachhush as trick kinds; ethogram softs + freeze own those words; window-play FOOT owns the pane foot; Coin owns flare/dart/drift/gulp/glint; Twig owns stick-insect life; Latch owns acetabulum/prostomium/looping/undulatory/hirudinean/botryoidal/auricle; Hinge owns adductor/protractor/inhalant/ctenidium/unionid/ligament/glochid; Whorl owns radula/pedal/pneumostome/ommatophore/lymnaeid/odontophore/neuston; Prickle owns spiggin/zigzag/spinous/fanning/gasterosteid/nuptial/pelvic; Boot owns cilia/pellicle/cytostome/vacuole/ciliophora/trichocyst/avoiding; Door owns hinge; Anchor owns siphon; guest slug Reach / key amoeba only for isKey matching — accept "amoeba" and "reach"; do NOT name a trick "amoeba" or "reach" or "glue" or "flare" or "dart" or "still" or "foot" or "stretch" or "crawl" or "flow" or "gulp") — not Boot paramecium life, not Prickle stickleback life, not Coin goldfish life, not Latch leech life, not Hinge mussel life, not Twig stick-insect life, not Door moray, not Anchor seahorse, not Kite manta, not Gauss filing-dragon, not Spot euglena. Pseudopod lobose reach on the dish without naming stretch, ectoplasm rim crawl without naming dart, endoplasm granular stream without naming flow, foodcup phagocytic cup without naming eat, proteus long Amoeba metabolic hold under the scrap pane, uroid trailing-end tuck (THE amoeba uroid tell), streaming sol-gel cytoplasmic flow (THE amoeba cytoplasmic-streaming tell); chaos / discoides / dubia thank-yous. Feed-happy thank-yous sit after eat. Card-open freeze and window-play FOOT do not swallow a thank-you. Sleep, hide, and leave still win. Same map as desktop amoeba-tricks.js. Window-play FOOT unchanged. Ethogram softs + freeze — never names reach/foot/still as bare ethogram-only trick kinds. True Proteus amoeba desk life only — distinct from Boot paramecium, Prickle stickleback, Coin goldfish, Latch leech, Hinge mussel, Twig stick insect, Door moray, Anchor seahorse, Kite manta, Gauss filing-dragon, and Spot euglena. Orb owns the next seat. No cry inventing — thank-yous are silent desk motion only. Amplitudes raised toward Rui richness; denser waits/weights; prefersHouseCry via amoeba.wav. */
export const TRICK_KEY = "amoeba";
export const TRICKS = ["pseudopod", "ectoplasm", "endoplasm", "foodcup", "proteus", "uroid", "streaming"] as const;
export const HAPPY = ["chaos", "discoides", "dubia"] as const;
export type AmoebaTrickKind = (typeof TRICKS)[number];
export type AmoebaHappyKind = (typeof HAPPY)[number];
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

export type AmoebaTrick = {
  kind: AmoebaTrickKind;
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

export type AmoebaHappy = {
  kind: AmoebaHappyKind;
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

export const HAPPY_DUR = { chaos: 1.67, discoides: 1.79, dubia: 1.71 } as const;
export const PROTEUS_HOLD = 11.0;
export const RELEASE_S = 1.16;
export const DUR = {
  proteus: PROTEUS_HOLD + RELEASE_S,
  pseudopod: 2.32,
  ectoplasm: 2.46,
  endoplasm: 2.52,
  foodcup: 2.38,
  uroid: 2.40,
  streaming: 2.35,
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

export function nextTrickWait(justFinished: boolean, rand?: number, kind?: AmoebaTrickKind | string) {
  const roll = rand == null ? Math.random() : rand;
  if (kind === "proteus") return 39 + roll * 25;
  if (kind === "uroid" || kind === "streaming" || kind === "pseudopod") return 12.5 + roll * 9.2;
  if (kind === "ectoplasm" || kind === "endoplasm" || kind === "foodcup") return 11.4 + roll * 8.3;
  return justFinished ? 8.3 + roll * 8.2 : 4.2 + roll * 7.2;
}

export function pickTrick(rand?: number, musicOn?: boolean, lastKind?: AmoebaTrickKind | string | null) {
  if (musicOn) return "proteus" as const;
  const roll = rand == null ? Math.random() : rand;
  if (lastKind === "proteus") {
    if (roll < 0.165) return "pseudopod" as const;
    if (roll < 0.325) return "ectoplasm" as const;
    if (roll < 0.485) return "endoplasm" as const;
    if (roll < 0.645) return "foodcup" as const;
    if (roll < 0.825) return "uroid" as const;
    return "streaming" as const;
  }
  if (lastKind === "pseudopod") {
    if (roll < 0.16) return "proteus" as const;
    if (roll < 0.32) return "ectoplasm" as const;
    if (roll < 0.48) return "endoplasm" as const;
    if (roll < 0.64) return "foodcup" as const;
    if (roll < 0.82) return "uroid" as const;
    return "streaming" as const;
  }
  if (lastKind === "ectoplasm") {
    if (roll < 0.14) return "proteus" as const;
    if (roll < 0.3) return "pseudopod" as const;
    if (roll < 0.46) return "endoplasm" as const;
    if (roll < 0.62) return "foodcup" as const;
    if (roll < 0.8) return "uroid" as const;
    return "streaming" as const;
  }
  if (lastKind === "uroid" || lastKind === "streaming") {
    if (roll < 0.14) return "proteus" as const;
    if (roll < 0.3) return "pseudopod" as const;
    if (roll < 0.46) return "ectoplasm" as const;
    if (roll < 0.62) return "endoplasm" as const;
    if (roll < 0.78) return "foodcup" as const;
    return lastKind === "uroid" ? ("streaming" as const) : ("uroid" as const);
  }
  if (roll < 0.14) return "proteus" as const;
  if (roll < 0.28) return "pseudopod" as const;
  if (roll < 0.42) return "ectoplasm" as const;
  if (roll < 0.56) return "endoplasm" as const;
  if (roll < 0.7) return "foodcup" as const;
  if (roll < 0.85) return "uroid" as const;
  return "streaming" as const;
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
  return key === TRICK_KEY || key === "reach";
}

export function startThankYou(
  key: string | undefined | null,
  lastKind: AmoebaHappyKind | string | null | undefined,
  x: number,
  facing: 1 | -1,
  flags?: TrickFlags,
) {
  if (!wantsThankYou(key)) return null;
  if (!happyCanStart(flags || { cmd: "idle" })) return null;
  const pick = pickHappy(lastKind as AmoebaHappyKind | null | undefined);
  return { happy: beginHappy(pick, x, facing), kind: pick };
}

export function pickHappy(lastKind?: AmoebaHappyKind | null, rand?: number) {
  const pool = HAPPY.filter((k) => k !== lastKind);
  const list = pool.length ? pool : [...HAPPY];
  const roll = rand == null ? Math.random() : rand;
  return list[Math.floor(roll * list.length)] || list[0];
}

export function beginHappy(kind: AmoebaHappyKind | string, x: number, facing: 1 | -1): AmoebaHappy {
  const name = (HAPPY as readonly string[]).indexOf(kind) >= 0 ? (kind as AmoebaHappyKind) : "chaos";
  return {
    kind: name,
    happy: true,
    phase: "go",
    t: 0,
    x: x,
    lift: 0,
    rot: 0,
    anim: name === "chaos" ? "sit" : name === "discoides" ? "play" : "sit",
    facing: facing == null ? 1 : facing,
    fromX: x,
  };
}

export function chaosPose(t: number) {
  const u = Math.max(0, Math.min(1, t / HAPPY_DUR.chaos));
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

export function discoidesPose(t: number) {
  const u = Math.max(0, Math.min(1, t / HAPPY_DUR.discoides));
  if (u < 0.14) {
    const s = u / 0.14;
    return { lift: s * 3.55, rot: s * -14, dx: s * 0.15, anim: "play" as TrickAnim };
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

export function dubiaPose(t: number) {
  return {
    lift: 2.2 + Math.abs(Math.sin(t * 0.58)) * 1.1,
    rot: Math.sin(t * 0.52) * 6,
    dx: 0,
    anim: "sit" as TrickAnim,
  };
}

export function stepHappy(happy: AmoebaHappy, dt: number, flags: TrickFlags): AmoebaHappy {
  if (happyShouldAbort(flags)) {
    return { ...happy, phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true };
  }
  const next: AmoebaHappy = { ...happy, t: happy.t + Math.max(0, dt) };
  const hold = HAPPY_DUR[next.kind];
  if (next.kind === "chaos") {
    const pose = chaosPose(next.t);
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "discoides") {
    const pose = discoidesPose(next.t);
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else {
    const pose = dubiaPose(next.t);
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

export function beginTrick(kind: AmoebaTrickKind | string, x: number, facing: 1 | -1): AmoebaTrick {
  const anim: TrickAnim =
    kind === "proteus"
      ? "sit"
      : kind === "pseudopod"
        ? "sit"
        : kind === "ectoplasm"
          ? "walk"
          : kind === "endoplasm"
            ? "play"
            : kind === "foodcup"
              ? "play"
              : kind === "uroid"
                ? "play"
                : kind === "streaming"
                  ? "walk"
                  : "sit";
  return {
    kind: (TRICKS as readonly string[]).indexOf(kind) >= 0 ? (kind as AmoebaTrickKind) : "pseudopod",
    phase: kind === "proteus" ? "hold" : "go",
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

export function proteusPose(t: number) {
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

export function pseudopodPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.pseudopod));
  const face = facing == null ? 1 : facing;
  if (u < 0.14) {
    const s = smoothstep(u / 0.14);
    return { x: fromX, lift: s * 3.35, rot: s * 14 * face, anim: "sit" as TrickAnim };
  }
  if (u < 0.78) {
    const snap = Math.sin(t * 2.4);
    return {
      x: fromX + face * snap * 0.13,
      lift: 3.35 + Math.abs(snap) * 1.45,
      rot: face * (14.5 + snap * 10.5),
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

export function ectoplasmPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.ectoplasm));
  const face = facing == null ? 1 : facing;
  if (u < 0.12) {
    const s = smoothstep(u / 0.12);
    return { x: fromX, lift: s * 3.75, rot: s * -16 * face, anim: "walk" as TrickAnim };
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

export function endoplasmPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.endoplasm));
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

export function foodcupPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.foodcup));
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

export function uroidPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.uroid));
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

export function streamingPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.streaming));
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

export function stepTrick(trick: AmoebaTrick, dt: number, flags: TrickFlags): AmoebaTrick {
  if (shouldAbort(flags)) {
    return { ...trick, phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true };
  }
  const next: AmoebaTrick = { ...trick, t: trick.t + Math.max(0, dt) };
  const fromX = trick.fromX != null ? trick.fromX : trick.x;
  if (next.kind === "proteus") {
    if (next.t < PROTEUS_HOLD) {
      const pose = proteusPose(next.t);
      next.phase = "hold";
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
      return next;
    }
    if (next.t < PROTEUS_HOLD + RELEASE_S) {
      const pose = releasePose(next.t - PROTEUS_HOLD);
      next.phase = "release";
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = "sit";
      return next;
    }
    return { ...next, phase: "done", lift: 0, rot: 0, anim: "idle" };
  }
  const hold = DUR[next.kind];
  if (next.kind === "pseudopod") {
    const pose = pseudopodPose(next.t, fromX, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "ectoplasm") {
    const pose = ectoplasmPose(next.t, fromX, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "endoplasm") {
    const pose = endoplasmPose(next.t, fromX, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "foodcup") {
    const pose = foodcupPose(next.t, fromX, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "uroid") {
    const pose = uroidPose(next.t, fromX, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else {
    const pose = streamingPose(next.t, fromX, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  }
  if (next.t >= hold) return { ...next, phase: "done", lift: 0, rot: 0, anim: "idle", x: fromX };
  return next;
}
