/** Barb ground tricks while idle — ultra-polish pass. House neighborly Buthidae / Centruroides striped-bark-scorpion (scorpion / Barb) desk life — pedipalp / metasoma / fluoresce / sanddig / pectines / booklung / centruroides personality (pedipalp chela grasp-wave without naming chelate or grasp or pincer or claw or hold or seize or pinch or feel or pat or probe or bob or palp or dragline or saccade or orient or chela, metasoma telson arch-raise without naming telson or arch or sting or stinger or tail or raise or threat or warn or strike or coil or venom or barb, fluoresce UV-glow shimmer without naming glow or flash or shine or uv or light or bloom or spark or firefly or lamp, sanddig substrate sand-scrape without naming dig or burrow or fossor or scratch or scrape or rake or shovel or nest or nestguard, pectines comb-sensor sweep without naming comb or feeler or sense or probe or antenna or palp or legwave, booklung book-lung breathe-settle without naming lung or breath or gill or bookgill or bailer or scaph, long centruroides Centruroides vittatus bark-tray blotter hold (THE centruroides sit_hold tell) — never named wait or crouch or roost or leap or hop or pounce or look or stalk or monocle or fossick or anting or corvid or dihedral or billtap or tumble or cronk or hackles or diskturn or softcrouch or parallax or snore or tytonid or kettle or stoop or bind or keeyer or buteo or feebee or gargle or hangup or cache or poecile or runstop or listen or carol or tug or turdus or dabble or upend or headshake or gruntwhistle or anas or graze or hiss or nestguard or honk or branta or excavate or hitch or crestflare or kuk or dryocopus or nectary or shuttle or gorget or chip or archilochus or radiate or stabilimentum or swathe or strum or araneus or dragline or viscid or orient or saccade or palp or safetyline or ame or scopula or phidippus or cursor or eggsac or spiderling or eyeshine or spur or apron or tigrosa or urticate or threat or cork or ecdysis or rastellum or apophysis or aphonopelma or hourglass or tangle or wrap or gumfoot or combfoot or theridiid or latrodectus or legwave or oscillate or autotomy or gregarious or ozopore or leiobunum or phalangium or oil or dab or tip or drum or sip or hover or stridulate or scorpion or barb or sting or venom as bare ethogram-only trick kinds; ethogram softs + freeze own those words; window-play CARRY unchanged if already fine; Stem owns legwave/oscillate/autotomy/gregarious/ozopore/leiobunum/phalangium; Hour owns hourglass/tangle/wrap/gumfoot/combfoot/theridiid/latrodectus; Velvet owns urticate/threat/cork/ecdysis/rastellum/apophysis/aphonopelma; Prowl owns cursor/eggsac/spiderling/eyeshine/spur/apron/tigrosa; Leap owns orient/saccade/palp/safetyline/ame/scopula/phidippus; Loom owns radiate/stabilimentum/swathe/strum/araneus/dragline/viscid; Ledger owns bookgill/telson; Tenant owns chela; Chirp owns stridulate; Gale / solifuge words stay free for later; Gale / solifuge owns the next seat; Soot/Wedge/Heart/Hook/Dee/Brick/Drake/Vee/Drum/Sip own bird tricks; guest slug Barb / key scorpion only for isKey matching — accept "scorpion" and "barb"; do NOT name a trick "scorpion" or "barb" or "sting" or "venom" or "spider" or "silk" or "web" or "gaze" or "still" or "palp") — not Stem harvestman life, not Hour widow life, not Velvet tarantula life, not Prowl wolf_spider life, not Leap jumping_spider life, not Loom orb_weaver life, not Whip vinegaroon life, not Gale solifuge life, not bird life. Pedipalp chela wave without naming claw, metasoma arch without naming sting, fluoresce UV shimmer without naming glow, sanddig sand scrape without naming burrow, pectines comb-sensor sweep without naming antenna, booklung breathe-settle without naming bookgill, centruroides long sit_hold on the blotter (THE centruroides sit_hold tell); vittatus / sculpturatus / gracilis thank-yous. Feed-happy thank-yous sit after eat. Card-open freeze and window-play do not swallow a thank-you. Sleep, hide, and leave still win. Same map as desktop scorpion-tricks.js. Window-play CARRY unchanged. Ethogram softs + freeze — never names sting/walk/still/scorpion as bare ethogram-only trick kinds. True buthid striped-bark-scorpion desk life only — distinct from Stem, Hour, Velvet, Prowl, Leap, Loom, Whip, Gale, and birds. Next house-order ultra: Gale / solifuge. No cry inventing — thank-yous are silent desk motion only; prefersHouseCry via scorpion.wav. Amplitudes raised toward Rui richness; denser waits/weights. Catalog 221. */
export const TRICK_KEY = "scorpion";
export const TRICKS = ["pedipalp", "metasoma", "fluoresce", "sanddig", "pectines", "booklung", "centruroides"] as const;
export const HAPPY = ["vittatus", "sculpturatus", "gracilis"] as const;
export type ScorpionTrickKind = (typeof TRICKS)[number];
export type ScorpionHappyKind = (typeof HAPPY)[number];
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

export type ScorpionTrick = {
  kind: ScorpionTrickKind;
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

export type ScorpionHappy = {
  kind: ScorpionHappyKind;
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

export const HAPPY_DUR = { vittatus: 1.70, sculpturatus: 1.84, gracilis: 1.76 } as const;
export const CENTRUROIDES_HOLD = 11.2;
export const RELEASE_S = 1.18;
export const DUR = {
  centruroides: CENTRUROIDES_HOLD + RELEASE_S,
  pedipalp: 2.48,
  metasoma: 2.42,
  fluoresce: 2.56,
  sanddig: 2.44,
  pectines: 2.40,
  booklung: 2.38,
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

export function nextTrickWait(justFinished: boolean, rand?: number, kind?: ScorpionTrickKind | string) {
  const roll = rand == null ? Math.random() : rand;
  if (kind === "centruroides") return 40 + roll * 26;
  if (kind === "pectines" || kind === "booklung" || kind === "pedipalp") return 12.8 + roll * 9.4;
  if (kind === "metasoma" || kind === "fluoresce" || kind === "sanddig") return 11.6 + roll * 8.5;
  return justFinished ? 8.5 + roll * 8.4 : 4.4 + roll * 7.4;
}

export function pickTrick(rand?: number, musicOn?: boolean, lastKind?: ScorpionTrickKind | string | null) {
  if (musicOn) return "centruroides" as const;
  const roll = rand == null ? Math.random() : rand;
  if (lastKind === "centruroides") {
    if (roll < 0.17) return "pedipalp" as const;
    if (roll < 0.33) return "metasoma" as const;
    if (roll < 0.49) return "fluoresce" as const;
    if (roll < 0.65) return "sanddig" as const;
    if (roll < 0.83) return "pectines" as const;
    return "booklung" as const;
  }
  if (lastKind === "pedipalp") {
    if (roll < 0.16) return "centruroides" as const;
    if (roll < 0.32) return "metasoma" as const;
    if (roll < 0.48) return "fluoresce" as const;
    if (roll < 0.64) return "sanddig" as const;
    if (roll < 0.82) return "pectines" as const;
    return "booklung" as const;
  }
  if (lastKind === "metasoma") {
    if (roll < 0.14) return "centruroides" as const;
    if (roll < 0.3) return "pedipalp" as const;
    if (roll < 0.46) return "fluoresce" as const;
    if (roll < 0.62) return "sanddig" as const;
    if (roll < 0.8) return "pectines" as const;
    return "booklung" as const;
  }
  if (lastKind === "pectines" || lastKind === "booklung") {
    if (roll < 0.14) return "centruroides" as const;
    if (roll < 0.3) return "pedipalp" as const;
    if (roll < 0.46) return "metasoma" as const;
    if (roll < 0.62) return "fluoresce" as const;
    if (roll < 0.78) return "sanddig" as const;
    return lastKind === "pectines" ? ("booklung" as const) : ("pectines" as const);
  }
  if (roll < 0.14) return "centruroides" as const;
  if (roll < 0.28) return "pedipalp" as const;
  if (roll < 0.42) return "metasoma" as const;
  if (roll < 0.56) return "fluoresce" as const;
  if (roll < 0.7) return "sanddig" as const;
  if (roll < 0.85) return "pectines" as const;
  return "booklung" as const;
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
  return key === TRICK_KEY || key === "barb";
}

export function startThankYou(
  key: string | undefined | null,
  lastKind: ScorpionHappyKind | string | null | undefined,
  x: number,
  facing: 1 | -1,
  flags?: TrickFlags,
) {
  if (!wantsThankYou(key)) return null;
  if (!happyCanStart(flags || { cmd: "idle" })) return null;
  const pick = pickHappy(lastKind as ScorpionHappyKind | null | undefined);
  return { happy: beginHappy(pick, x, facing), kind: pick };
}

export function pickHappy(lastKind?: ScorpionHappyKind | null, rand?: number) {
  const pool = HAPPY.filter((k) => k !== lastKind);
  const list = pool.length ? pool : [...HAPPY];
  const roll = rand == null ? Math.random() : rand;
  return list[Math.floor(roll * list.length)] || list[0];
}

export function beginHappy(kind: ScorpionHappyKind | string, x: number, facing: 1 | -1): ScorpionHappy {
  const name = (HAPPY as readonly string[]).indexOf(kind) >= 0 ? (kind as ScorpionHappyKind) : "vittatus";
  return {
    kind: name,
    happy: true,
    phase: "go",
    t: 0,
    x: x,
    lift: 0,
    rot: 0,
    anim: name === "vittatus" ? "sit" : name === "sculpturatus" ? "play" : "sit",
    facing: facing == null ? 1 : facing,
    fromX: x,
  };
}

export function vittatusPose(t: number) {
  const u = Math.max(0, Math.min(1, t / HAPPY_DUR.vittatus));
  if (u < 0.16) {
    const s = u / 0.16;
    return { lift: s * 2.8, rot: s * 12, dx: 0, anim: "sit" as TrickAnim };
  }
  if (u < 0.82) {
    const flash = Math.sin(t * 1.72);
    return {
      lift: 2.8 + Math.abs(flash) * 1.4,
      rot: 12 + flash * 8,
      dx: 0,
      anim: "sit" as TrickAnim,
    };
  }
  const s = (u - 0.82) / 0.18;
  return { lift: 2.0 * (1 - s), rot: 6 * (1 - s), dx: 0, anim: "idle" as TrickAnim };
}

export function sculpturatusPose(t: number) {
  const u = Math.max(0, Math.min(1, t / HAPPY_DUR.sculpturatus));
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

export function gracilisPose(t: number) {
  return {
    lift: 2.2 + Math.abs(Math.sin(t * 0.58)) * 1.1,
    rot: Math.sin(t * 0.52) * 6,
    dx: 0,
    anim: "sit" as TrickAnim,
  };
}

export function stepHappy(happy: ScorpionHappy, dt: number, flags: TrickFlags): ScorpionHappy {
  if (happyShouldAbort(flags)) {
    return { ...happy, phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true };
  }
  const next: ScorpionHappy = { ...happy, t: happy.t + Math.max(0, dt) };
  const hold = HAPPY_DUR[next.kind];
  if (next.kind === "vittatus") {
    const pose = vittatusPose(next.t);
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "sculpturatus") {
    const pose = sculpturatusPose(next.t);
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else {
    const pose = gracilisPose(next.t);
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

export function beginTrick(kind: ScorpionTrickKind | string, x: number, facing: 1 | -1): ScorpionTrick {
  const anim: TrickAnim =
    kind === "centruroides"
      ? "sit"
      : kind === "pedipalp"
        ? "talk"
        : kind === "metasoma"
          ? "play"
          : kind === "fluoresce"
            ? "sit"
            : kind === "sanddig"
              ? "play"
              : kind === "pectines"
                ? "talk"
                : kind === "booklung"
                  ? "play"
                  : "sit";
  return {
    kind: (TRICKS as readonly string[]).indexOf(kind) >= 0 ? (kind as ScorpionTrickKind) : "pedipalp",
    phase: kind === "centruroides" ? "hold" : "go",
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

export function centruroidesPose(t: number) {
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

export function pedipalpPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.pedipalp));
  const face = facing == null ? 1 : facing;
  if (u < 0.14) {
    const s = smoothstep(u / 0.14);
    return { x: fromX + face * s * 0.8, lift: s * 3.5, rot: s * 16 * face, anim: "talk" as TrickAnim };
  }
  if (u < 0.78) {
    const tip = Math.sin(t * 2.4);
    return {
      x: fromX + face * (0.8 + tip * 0.12),
      lift: 3.5 + Math.abs(tip) * 1.5,
      rot: face * (16 + tip * 10),
      anim: "talk" as TrickAnim,
    };
  }
  const s = smoothstep((u - 0.78) / 0.22);
  return {
    x: fromX + face * 0.8 * (1 - s),
    lift: 1.4 * (1 - s),
    rot: face * (4 * (1 - s)),
    anim: "idle" as TrickAnim,
  };
}

export function metasomaPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.metasoma));
  const face = facing == null ? 1 : facing;
  if (u < 0.12) {
    const s = smoothstep(u / 0.12);
    return { x: fromX, lift: s * 2.6, rot: s * -10 * face, anim: "play" as TrickAnim };
  }
  if (u < 0.78) {
    const bob = Math.sin(t * 2.8);
    return {
      x: fromX + face * bob * 0.5,
      lift: 2.6 + Math.abs(bob) * 1.4,
      rot: face * (-10 + bob * 12),
      anim: "play" as TrickAnim,
    };
  }
  const s = smoothstep((u - 0.78) / 0.22);
  return {
    x: fromX,
    lift: 1.2 * (1 - s),
    rot: face * (-3 * (1 - s)),
    anim: "idle" as TrickAnim,
  };
}

export function fluorescePose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.fluoresce));
  const face = facing == null ? 1 : facing;
  if (u < 0.14) {
    const s = smoothstep(u / 0.14);
    return { x: fromX, lift: s * 3.8, rot: s * 14 * face, anim: "sit" as TrickAnim };
  }
  if (u < 0.78) {
    const cast = Math.sin(t * 2.6);
    return {
      x: fromX - face * cast * 0.16,
      lift: 3.6 + Math.abs(cast) * 1.6,
      rot: face * (14 + cast * 12),
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

export function sanddigPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.sanddig));
  const face = facing == null ? 1 : facing;
  if (u < 0.14) {
    const s = smoothstep(u / 0.14);
    return { x: fromX + face * s * 0.6, lift: s * 2.8, rot: s * 12 * face, anim: "play" as TrickAnim };
  }
  if (u < 0.78) {
    const nestle = Math.sin(t * 2.2);
    return {
      x: fromX + face * (0.6 + Math.abs(nestle) * 0.4),
      lift: 2.4 + Math.abs(nestle) * 1.8,
      rot: face * (12 + nestle * 10),
      anim: "play" as TrickAnim,
    };
  }
  const s = smoothstep((u - 0.78) / 0.22);
  return {
    x: fromX + face * 0.6 * (1 - s),
    lift: 1.2 * (1 - s),
    rot: face * (3 * (1 - s)),
    anim: "idle" as TrickAnim,
  };
}

export function pectinesPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.pectines));
  const face = facing == null ? 1 : facing;
  if (u < 0.14) {
    const s = smoothstep(u / 0.14);
    return { x: fromX, lift: s * 2.8, rot: s * -12 * face, anim: "talk" as TrickAnim };
  }
  if (u < 0.55) {
    const tip = Math.sin(t * 3.2);
    return {
      x: fromX + face * tip * 0.18,
      lift: 2.8 + tip * 1.6,
      rot: face * (-12 + tip * 14),
      anim: "talk" as TrickAnim,
    };
  }
  if (u < 0.78) {
    const hush = Math.sin(t * 1.1);
    return {
      x: fromX + face * hush * 0.12,
      lift: 4.0 + Math.abs(hush) * 0.6,
      rot: face * (-22 + hush * 4),
      anim: "talk" as TrickAnim,
    };
  }
  const s = smoothstep((u - 0.78) / 0.22);
  return {
    x: fromX,
    lift: 2.0 * (1 - s),
    rot: face * (-8 * (1 - s)),
    anim: "idle" as TrickAnim,
  };
}

export function booklungPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.booklung));
  const face = facing == null ? 1 : facing;
  if (u < 0.14) {
    const s = smoothstep(u / 0.14);
    return { x: fromX, lift: s * 3.4, rot: s * 12 * face, anim: "play" as TrickAnim };
  }
  if (u < 0.55) {
    const stretch = Math.abs(Math.sin(t * 2.6));
    return {
      x: fromX + face * stretch * 0.2,
      lift: 3.4 + stretch * 1.4,
      rot: face * (12 + stretch * 10),
      anim: "play" as TrickAnim,
    };
  }
  if (u < 0.78) {
    const hush = Math.sin(t * 1.4);
    return {
      x: fromX,
      lift: 4.4 + Math.abs(hush) * 0.7,
      rot: face * (18 + hush * 6),
      anim: "play" as TrickAnim,
    };
  }
  const s = smoothstep((u - 0.78) / 0.22);
  return {
    x: fromX,
    lift: 1.8 * (1 - s),
    rot: face * (5 * (1 - s)),
    anim: "idle" as TrickAnim,
  };
}

export function stepTrick(trick: ScorpionTrick, dt: number, flags: TrickFlags): ScorpionTrick {
  if (shouldAbort(flags)) {
    return { ...trick, phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true };
  }
  const next: ScorpionTrick = { ...trick, t: trick.t + Math.max(0, dt) };
  const fromX = trick.fromX != null ? trick.fromX : trick.x;
  if (next.kind === "centruroides") {
    if (next.t < CENTRUROIDES_HOLD) {
      const pose = centruroidesPose(next.t);
      next.phase = "hold";
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
      return next;
    }
    if (next.t < CENTRUROIDES_HOLD + RELEASE_S) {
      const pose = releasePose(next.t - CENTRUROIDES_HOLD);
      next.phase = "release";
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = "sit";
      return next;
    }
    return { ...next, phase: "done", lift: 0, rot: 0, anim: "idle" };
  }
  const hold = DUR[next.kind];
  if (next.kind === "pedipalp") {
    const pose = pedipalpPose(next.t, fromX, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "metasoma") {
    const pose = metasomaPose(next.t, fromX, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "fluoresce") {
    const pose = fluorescePose(next.t, fromX, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "sanddig") {
    const pose = sanddigPose(next.t, fromX, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "pectines") {
    const pose = pectinesPose(next.t, fromX, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else {
    const pose = booklungPose(next.t, fromX, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  }
  if (next.t >= hold) return { ...next, phase: "done", lift: 0, rot: 0, anim: "idle", x: fromX };
  return next;
}
