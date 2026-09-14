/** Rose ground tricks while idle — ultra-polish pass. House neighborly Halobacterium (haloarchaea / Rose) desk life — bacteriorhodopsin / saltsquare / gasvesicle / carotenoid / retinal / archaellum / brinedrift personality (bacteriorhodopsin purple-membrane proton pump without naming pump or still or dart or purple as bare ethogram-only trick kinds, saltsquare square-cell geometry without naming square or still or dart or cell, gasvesicle buoyancy without naming bob or still or dart or float, carotenoid pink-carotenoid flush without naming blush or still or dart or pink, archaellum archaeal flagella swim without naming flagella or still or dart or spin, brinedrift salt-pan drift without naming drift or still or dart or pan, long retinal sit_hold under the scrap lamp (THE retinal sit_hold tell) — never named wait or wake or still or hide or cover or glue or flare or dart or nest or zig or swim or gulp or drift or glint or hinge or sucker or latch or crawl or dig or burrow or pedal or radula or pneumostome or ommatophore or lymnaeid or adductor or protractor or inhalant or ctenidium or unionid or acetabulum or prostomium or looping or undulatory or hirudinean or botryoidal or auricle or spiggin or zigzag or spinous or fanning or gasterosteid or nuptial or pelvic or cilia or pellicle or cytostome or vacuole or ciliophora or trichocyst or avoiding or slipper or row or wiggle or scute or pseudopod or ectoplasm or endoplasm or foodcup or proteus or uroid or streaming or eyespot or flagellum or chloroplast or phototaxis or euglenid or metaboly or paramylon or colony or inversion or phialopore or somatic or coenobium or daughter or gonidia or frustule or raphe or girdle or oilstore or pennate or epitheca or navicula or holdfast or haptera or blade or pneumatocyst or meristem or sorus or sporophyll or biflagellate or cupplast or stigma or pyrenoid or palmella or cellwall or wetplate or adoral or myoneme or membranelle or holdfoot or introversus or vortex or beadedmac or runandtumble or binaryfission or pilus or chemotax or nucleoid or fimbria or flagmotor or longrosehush or densrose or inkrose or denshaloarchaea or pinksaltblush or saltpandrift or gasvesiclebob as trick kinds; ethogram softs + freeze own those words; window-play blush RED unchanged if already fine; Rod owns runandtumble/binaryfission/pilus/chemotax/nucleoid/fimbria/flagmotor; Bell owns adoral/myoneme/membranelle/holdfoot/introversus/vortex/beadedmac; Spin owns biflagellate/cupplast/stigma/pyrenoid/palmella/cellwall/wetplate; Hold owns holdfast/haptera/blade/pneumatocyst/meristem/sorus/sporophyll; Pane owns frustule/raphe/girdle/oilstore/pennate/epitheca/navicula; Orb owns colony/inversion/phialopore/somatic/coenobium/daughter/gonidia; Spot owns eyespot/flagellum/chloroplast/phototaxis/euglenid/metaboly/paramylon; Blush owns rosy_boa life — do not reuse bare blush/still/pink as trick kinds; guest slug Rose / key haloarchaea only for isKey matching — accept "haloarchaea" and "rose"; do NOT name a trick "haloarchaea" or "rose" or "blush" or "still" or "pink" or "tumble") — not Rod coli life, not Bell stentor life, not Spin chlamydomonas life, not Hold kelp life, not Pane diatom life, not Orb volvox life, not Spot euglena life, not Blush rosy_boa. Bacteriorhodopsin purple-membrane tip without naming pump, saltsquare square cell without naming square, gasvesicle buoyancy without naming bob, carotenoid pink flush without naming blush, archaellum swim without naming flagella, brinedrift salt-pan tip without naming pan, retinal long sit_hold under the scrap lamp (THE retinal sit_hold tell); salinarum / volcanii / mediterranei thank-yous. Feed-happy thank-yous sit after eat. Card-open freeze and window-play do not swallow a thank-you. Sleep, hide, and leave still win. Same map as desktop haloarchaea-tricks.js. Window-play blush RED unchanged. Ethogram softs + freeze — never names rose/haloarchaea/blush/still/pink as bare ethogram-only trick kinds. True Halobacterium desk life only — distinct from Rod coli, Bell stentor, Spin chlamydomonas, Hold kelp, Pane diatom, Orb volvox, Spot euglena, and Blush rosy_boa. Prowl / wolf_spider owns the next seat (Leap / jumping_spider ultra landed). No cry inventing — thank-yous are silent desk motion only; prefersHouseCry via haloarchaea.wav. Amplitudes raised toward Rui richness; denser waits/weights. Catalog 221. */
export const TRICK_KEY = "haloarchaea";
export const TRICKS = ["bacteriorhodopsin", "saltsquare", "gasvesicle", "carotenoid", "retinal", "archaellum", "brinedrift"] as const;
export const HAPPY = ["salinarum", "volcanii", "mediterranei"] as const;
export type HaloarchaeaTrickKind = (typeof TRICKS)[number];
export type HaloarchaeaHappyKind = (typeof HAPPY)[number];
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

export type HaloarchaeaTrick = {
  kind: HaloarchaeaTrickKind;
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

export type HaloarchaeaHappy = {
  kind: HaloarchaeaHappyKind;
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

export const HAPPY_DUR = { salinarum: 1.70, volcanii: 1.82, mediterranei: 1.71 } as const;
export const RETINAL_HOLD = 11.2;
export const RELEASE_S = 1.18;
export const DUR = {
  retinal: RETINAL_HOLD + RELEASE_S,
  bacteriorhodopsin: 2.36,
  saltsquare: 2.50,
  gasvesicle: 2.56,
  carotenoid: 2.42,
  archaellum: 2.44,
  brinedrift: 2.39,
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

export function nextTrickWait(justFinished: boolean, rand?: number, kind?: HaloarchaeaTrickKind | string) {
  const roll = rand == null ? Math.random() : rand;
  if (kind === "retinal") return 40 + roll * 26;
  if (kind === "archaellum" || kind === "brinedrift" || kind === "bacteriorhodopsin") return 12.8 + roll * 9.4;
  if (kind === "saltsquare" || kind === "gasvesicle" || kind === "carotenoid") return 11.6 + roll * 8.5;
  return justFinished ? 8.5 + roll * 8.4 : 4.4 + roll * 7.4;
}

export function pickTrick(rand?: number, musicOn?: boolean, lastKind?: HaloarchaeaTrickKind | string | null) {
  if (musicOn) return "retinal" as const;
  const roll = rand == null ? Math.random() : rand;
  if (lastKind === "retinal") {
    if (roll < 0.17) return "bacteriorhodopsin" as const;
    if (roll < 0.33) return "saltsquare" as const;
    if (roll < 0.49) return "gasvesicle" as const;
    if (roll < 0.65) return "carotenoid" as const;
    if (roll < 0.83) return "archaellum" as const;
    return "brinedrift" as const;
  }
  if (lastKind === "bacteriorhodopsin") {
    if (roll < 0.16) return "retinal" as const;
    if (roll < 0.32) return "saltsquare" as const;
    if (roll < 0.48) return "gasvesicle" as const;
    if (roll < 0.64) return "carotenoid" as const;
    if (roll < 0.82) return "archaellum" as const;
    return "brinedrift" as const;
  }
  if (lastKind === "saltsquare") {
    if (roll < 0.14) return "retinal" as const;
    if (roll < 0.3) return "bacteriorhodopsin" as const;
    if (roll < 0.46) return "gasvesicle" as const;
    if (roll < 0.62) return "carotenoid" as const;
    if (roll < 0.8) return "archaellum" as const;
    return "brinedrift" as const;
  }
  if (lastKind === "archaellum" || lastKind === "brinedrift") {
    if (roll < 0.14) return "retinal" as const;
    if (roll < 0.3) return "bacteriorhodopsin" as const;
    if (roll < 0.46) return "saltsquare" as const;
    if (roll < 0.62) return "gasvesicle" as const;
    if (roll < 0.78) return "carotenoid" as const;
    return lastKind === "archaellum" ? ("brinedrift" as const) : ("archaellum" as const);
  }
  if (roll < 0.14) return "retinal" as const;
  if (roll < 0.28) return "bacteriorhodopsin" as const;
  if (roll < 0.42) return "saltsquare" as const;
  if (roll < 0.56) return "gasvesicle" as const;
  if (roll < 0.7) return "carotenoid" as const;
  if (roll < 0.85) return "archaellum" as const;
  return "brinedrift" as const;
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
  return key === TRICK_KEY || key === "rose";
}

export function startThankYou(
  key: string | undefined | null,
  lastKind: HaloarchaeaHappyKind | string | null | undefined,
  x: number,
  facing: 1 | -1,
  flags?: TrickFlags,
) {
  if (!wantsThankYou(key)) return null;
  if (!happyCanStart(flags || { cmd: "idle" })) return null;
  const pick = pickHappy(lastKind as HaloarchaeaHappyKind | null | undefined);
  return { happy: beginHappy(pick, x, facing), kind: pick };
}

export function pickHappy(lastKind?: HaloarchaeaHappyKind | null, rand?: number) {
  const pool = HAPPY.filter((k) => k !== lastKind);
  const list = pool.length ? pool : [...HAPPY];
  const roll = rand == null ? Math.random() : rand;
  return list[Math.floor(roll * list.length)] || list[0];
}

export function beginHappy(kind: HaloarchaeaHappyKind | string, x: number, facing: 1 | -1): HaloarchaeaHappy {
  const name = (HAPPY as readonly string[]).indexOf(kind) >= 0 ? (kind as HaloarchaeaHappyKind) : "salinarum";
  return {
    kind: name,
    happy: true,
    phase: "go",
    t: 0,
    x: x,
    lift: 0,
    rot: 0,
    anim: name === "salinarum" ? "sit" : name === "volcanii" ? "play" : "sit",
    facing: facing == null ? 1 : facing,
    fromX: x,
  };
}

export function salinarumPose(t: number) {
  const u = Math.max(0, Math.min(1, t / HAPPY_DUR.salinarum));
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

export function volcaniiPose(t: number) {
  const u = Math.max(0, Math.min(1, t / HAPPY_DUR.volcanii));
  if (u < 0.14) {
    const s = u / 0.14;
    return { lift: s * 3.7, rot: s * -14, dx: s * 0.15, anim: "play" as TrickAnim };
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

export function mediterraneiPose(t: number) {
  return {
    lift: 2.2 + Math.abs(Math.sin(t * 0.58)) * 1.1,
    rot: Math.sin(t * 0.52) * 6,
    dx: 0,
    anim: "sit" as TrickAnim,
  };
}

export function stepHappy(happy: HaloarchaeaHappy, dt: number, flags: TrickFlags): HaloarchaeaHappy {
  if (happyShouldAbort(flags)) {
    return { ...happy, phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true };
  }
  const next: HaloarchaeaHappy = { ...happy, t: happy.t + Math.max(0, dt) };
  const hold = HAPPY_DUR[next.kind];
  if (next.kind === "salinarum") {
    const pose = salinarumPose(next.t);
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "volcanii") {
    const pose = volcaniiPose(next.t);
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else {
    const pose = mediterraneiPose(next.t);
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

export function beginTrick(kind: HaloarchaeaTrickKind | string, x: number, facing: 1 | -1): HaloarchaeaTrick {
  const anim: TrickAnim =
    kind === "retinal"
      ? "sit"
      : kind === "bacteriorhodopsin"
        ? "sit"
        : kind === "saltsquare"
          ? "walk"
          : kind === "gasvesicle"
            ? "play"
            : kind === "carotenoid"
              ? "play"
              : kind === "archaellum"
                ? "play"
                : kind === "brinedrift"
                  ? "walk"
                  : "sit";
  return {
    kind: (TRICKS as readonly string[]).indexOf(kind) >= 0 ? (kind as HaloarchaeaTrickKind) : "bacteriorhodopsin",
    phase: kind === "retinal" ? "hold" : "go",
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

export function retinalPose(t: number) {
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

export function bacteriorhodopsinPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.bacteriorhodopsin));
  const face = facing == null ? 1 : facing;
  if (u < 0.14) {
    const s = smoothstep(u / 0.14);
    return { x: fromX, lift: s * 3.5, rot: s * 14 * face, anim: "sit" as TrickAnim };
  }
  if (u < 0.78) {
    const snap = Math.sin(t * 2.4);
    return {
      x: fromX + face * snap * 0.14,
      lift: 3.5 + Math.abs(snap) * 1.5,
      rot: face * (15 + snap * 11),
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

export function saltsquarePose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.saltsquare));
  const face = facing == null ? 1 : facing;
  if (u < 0.12) {
    const s = smoothstep(u / 0.12);
    return { x: fromX, lift: s * 3.9, rot: s * -16 * face, anim: "walk" as TrickAnim };
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

export function gasvesiclePose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.gasvesicle));
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

export function carotenoidPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.carotenoid));
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

export function archaellumPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.archaellum));
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

export function brinedriftPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.brinedrift));
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

export function stepTrick(trick: HaloarchaeaTrick, dt: number, flags: TrickFlags): HaloarchaeaTrick {
  if (shouldAbort(flags)) {
    return { ...trick, phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true };
  }
  const next: HaloarchaeaTrick = { ...trick, t: trick.t + Math.max(0, dt) };
  const fromX = trick.fromX != null ? trick.fromX : trick.x;
  if (next.kind === "retinal") {
    if (next.t < RETINAL_HOLD) {
      const pose = retinalPose(next.t);
      next.phase = "hold";
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
      return next;
    }
    if (next.t < RETINAL_HOLD + RELEASE_S) {
      const pose = releasePose(next.t - RETINAL_HOLD);
      next.phase = "release";
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = "sit";
      return next;
    }
    return { ...next, phase: "done", lift: 0, rot: 0, anim: "idle" };
  }
  const hold = DUR[next.kind];
  if (next.kind === "bacteriorhodopsin") {
    const pose = bacteriorhodopsinPose(next.t, fromX, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "saltsquare") {
    const pose = saltsquarePose(next.t, fromX, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "gasvesicle") {
    const pose = gasvesiclePose(next.t, fromX, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "carotenoid") {
    const pose = carotenoidPose(next.t, fromX, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "archaellum") {
    const pose = archaellumPose(next.t, fromX, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else {
    const pose = brinedriftPose(next.t, fromX, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  }
  if (next.t >= hold) return { ...next, phase: "done", lift: 0, rot: 0, anim: "idle", x: fromX };
  return next;
}
