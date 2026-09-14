/** Gale ground tricks while idle — ultra-polish pass. House neighborly Solifugae / Eremobates pallipes camel-spider windscorpion (solifuge / Gale) desk life — malleoli / suctorial / chelicrush / sprintburst / propeltidium / tracheate / eremobates personality (malleoli racquet-organ vibration-sense without naming sense or feel or probe or tip or wave or bob or haller or antennule or palp or flagellum or acetic or pedipalp or metasoma or antenniform, suctorial pedipalp-sucker blotter-reach without naming sucker or suck or cling or latch or grip or clasp or pinch or palpcrush or adhesive or climb or tip or wave or acetabulum, chelicrush huge-chelicerae prey-mill without naming bite or chew or crush or seize or hold or chelate or snap or eat or feed or jaw or fang or venom or hypostome, sprintburst wind-sprint blotter-dash without naming run or dart or dash or sprint or chase or hunt or leap or hop or pounce or cursor or cursorial or gale or wind or quest, propeltidium propeltidium prosoma-plate settle without naming shield or scutum or armor or plate or carapace or dorsum or head or face, tracheate tracheal-spiracle hush without naming breath or lung or booklung or spiracle or gill or air or puff, long eremobates Eremobates pallipes blotter-dish hold (THE eremobates sit_hold tell) — never named wait or crouch or roost or leap or hop or pounce or look or stalk or monocle or fossick or anting or corvid or dihedral or billtap or tumble or cronk or hackles or diskturn or softcrouch or parallax or snore or tytonid or kettle or stoop or bind or keeyer or buteo or feebee or gargle or hangup or cache or poecile or runstop or listen or carol or tug or turdus or dabble or upend or headshake or gruntwhistle or anas or graze or hiss or nestguard or honk or branta or excavate or hitch or crestflare or kuk or dryocopus or nectary or shuttle or gorget or chip or archilochus or radiate or stabilimentum or swathe or strum or araneus or dragline or viscid or orient or saccade or palp or safetyline or ame or scopula or phidippus or cursor or eggsac or spiderling or eyeshine or spur or apron or tigrosa or urticate or threat or cork or ecdysis or rastellum or apophysis or aphonopelma or hourglass or tangle or wrap or gumfoot or combfoot or theridiid or latrodectus or legwave or oscillate or autotomy or gregarious or ozopore or leiobunum or phalangium or pedipalp or metasoma or fluoresce or sanddig or pectines or booklung or centruroides or caudalwhip or acetic or palpcrush or trayburrow or pygidial or antenniform or mastigoproctus or quest or haller or hypostome or engorge or scutum or capitulum or ixodes or flagellum or oil or dab or tip or drum or sip or hover or stridulate or solifuge or gale as bare ethogram-only trick kinds; ethogram softs + freeze own those words; window-play RUN unchanged if already fine; Clasp owns quest/haller/hypostome/engorge/scutum/capitulum/ixodes; Whip owns caudalwhip/acetic/palpcrush/trayburrow/pygidial/antenniform/mastigoproctus; Barb owns pedipalp/metasoma/fluoresce/sanddig/pectines/booklung/centruroides; Stem owns legwave/oscillate/autotomy/gregarious/ozopore/leiobunum/phalangium; Hour owns hourglass/tangle/wrap/gumfoot/combfoot/theridiid/latrodectus; Velvet owns urticate/threat/cork/ecdysis/rastellum/apophysis/aphonopelma; Prowl owns cursor/eggsac/spiderling/eyeshine/spur/apron/tigrosa; Leap owns orient/saccade/palp/safetyline/ame/scopula/phidippus; Loom owns radiate/stabilimentum/swathe/strum/araneus/dragline/viscid; Latch owns acetabulum/prostomium/looping/undulatory/hirudinean/botryoidal/auricle; Ledger owns bookgill/telson; Tenant owns chela; Chirp owns stridulate; Flag / deer words stay free for later; Soot/Wedge/Heart/Hook/Dee/Brick/Drake/Vee/Drum/Sip own bird tricks; guest slug Gale / key solifuge only for isKey matching — accept "solifuge" and "gale"; do NOT name a trick "solifuge" or "gale" or "camel" or "wind" or "spider" or "scorpion" or "tick" or "mite" or "insect" or "silk" or "web" or "venom" or "gaze" or "still" or "wait" or "run" or "bite") — not Clasp tick life, not Whip vinegaroon life, not Barb scorpion life, not Stem harvestman life, not Hour widow life, not Velvet tarantula life, not Prowl wolf_spider life, not Leap jumping_spider life, not Loom orb_weaver life, not Latch leech life, not Flag deer life, not bird life. Malleoli racquet-sense without naming haller, suctorial sucker-reach without naming latch, chelicrush mill without naming hypostome, sprintburst dash without naming quest, propeltidium plate-settle without naming scutum, tracheate spiracle-hush without naming booklung, eremobates long sit_hold on the blotter (THE eremobates sit_hold tell); pallipes / durangonus / dishrun thank-yous. Feed-happy thank-yous sit after eat. Card-open freeze and window-play do not swallow a thank-you. Sleep, hide, and leave still win. Same map as desktop solifuge-tricks.js. Window-play RUN unchanged. Ethogram softs + freeze — never names run/bite/still/solifuge as bare ethogram-only trick kinds. True solifuge camel-spider windscorpion desk life only — distinct from Clasp, Whip, Barb, Stem, Hour, Velvet, Prowl, Leap, Loom, Latch, Flag, and birds. Next house-order ultra: Flag / deer. No cry inventing — thank-yous are silent desk motion only; prefersHouseCry via solifuge.wav. Amplitudes raised toward Rui richness; denser waits/weights. Catalog 221. */
export const TRICK_KEY = "solifuge";
export const TRICKS = ["malleoli", "suctorial", "chelicrush", "sprintburst", "propeltidium", "tracheate", "eremobates"] as const;
export const HAPPY = ["pallipes", "durangonus", "dishrun"] as const;
export type SolifugeTrickKind = (typeof TRICKS)[number];
export type SolifugeHappyKind = (typeof HAPPY)[number];
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

export type SolifugeTrick = {
  kind: SolifugeTrickKind;
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

export type SolifugeHappy = {
  kind: SolifugeHappyKind;
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

export const HAPPY_DUR = { pallipes: 1.70, durangonus: 1.84, dishrun: 1.76 } as const;
export const EREMOBATES_HOLD = 11.2;
export const RELEASE_S = 1.18;
export const DUR = {
  eremobates: EREMOBATES_HOLD + RELEASE_S,
  malleoli: 2.48,
  suctorial: 2.42,
  chelicrush: 2.56,
  sprintburst: 2.44,
  propeltidium: 2.40,
  tracheate: 2.38,
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

export function nextTrickWait(justFinished: boolean, rand?: number, kind?: SolifugeTrickKind | string) {
  const roll = rand == null ? Math.random() : rand;
  if (kind === "eremobates") return 40 + roll * 26;
  if (kind === "propeltidium" || kind === "tracheate" || kind === "malleoli") return 12.8 + roll * 9.4;
  if (kind === "suctorial" || kind === "chelicrush" || kind === "sprintburst") return 11.6 + roll * 8.5;
  return justFinished ? 8.5 + roll * 8.4 : 4.4 + roll * 7.4;
}

export function pickTrick(rand?: number, musicOn?: boolean, lastKind?: SolifugeTrickKind | string | null) {
  if (musicOn) return "eremobates" as const;
  const roll = rand == null ? Math.random() : rand;
  if (lastKind === "eremobates") {
    if (roll < 0.17) return "malleoli" as const;
    if (roll < 0.33) return "suctorial" as const;
    if (roll < 0.49) return "chelicrush" as const;
    if (roll < 0.65) return "sprintburst" as const;
    if (roll < 0.83) return "propeltidium" as const;
    return "tracheate" as const;
  }
  if (lastKind === "malleoli") {
    if (roll < 0.16) return "eremobates" as const;
    if (roll < 0.32) return "suctorial" as const;
    if (roll < 0.48) return "chelicrush" as const;
    if (roll < 0.64) return "sprintburst" as const;
    if (roll < 0.82) return "propeltidium" as const;
    return "tracheate" as const;
  }
  if (lastKind === "suctorial") {
    if (roll < 0.14) return "eremobates" as const;
    if (roll < 0.3) return "malleoli" as const;
    if (roll < 0.46) return "chelicrush" as const;
    if (roll < 0.62) return "sprintburst" as const;
    if (roll < 0.8) return "propeltidium" as const;
    return "tracheate" as const;
  }
  if (lastKind === "propeltidium" || lastKind === "tracheate") {
    if (roll < 0.14) return "eremobates" as const;
    if (roll < 0.3) return "malleoli" as const;
    if (roll < 0.46) return "suctorial" as const;
    if (roll < 0.62) return "chelicrush" as const;
    if (roll < 0.78) return "sprintburst" as const;
    return lastKind === "propeltidium" ? ("tracheate" as const) : ("propeltidium" as const);
  }
  if (roll < 0.14) return "eremobates" as const;
  if (roll < 0.28) return "malleoli" as const;
  if (roll < 0.42) return "suctorial" as const;
  if (roll < 0.56) return "chelicrush" as const;
  if (roll < 0.7) return "sprintburst" as const;
  if (roll < 0.85) return "propeltidium" as const;
  return "tracheate" as const;
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
  return key === TRICK_KEY || key === "gale";
}

export function startThankYou(
  key: string | undefined | null,
  lastKind: SolifugeHappyKind | string | null | undefined,
  x: number,
  facing: 1 | -1,
  flags?: TrickFlags,
) {
  if (!wantsThankYou(key)) return null;
  if (!happyCanStart(flags || { cmd: "idle" })) return null;
  const pick = pickHappy(lastKind as SolifugeHappyKind | null | undefined);
  return { happy: beginHappy(pick, x, facing), kind: pick };
}

export function pickHappy(lastKind?: SolifugeHappyKind | null, rand?: number) {
  const pool = HAPPY.filter((k) => k !== lastKind);
  const list = pool.length ? pool : [...HAPPY];
  const roll = rand == null ? Math.random() : rand;
  return list[Math.floor(roll * list.length)] || list[0];
}

export function beginHappy(kind: SolifugeHappyKind | string, x: number, facing: 1 | -1): SolifugeHappy {
  const name = (HAPPY as readonly string[]).indexOf(kind) >= 0 ? (kind as SolifugeHappyKind) : "pallipes";
  return {
    kind: name,
    happy: true,
    phase: "go",
    t: 0,
    x: x,
    lift: 0,
    rot: 0,
    anim: name === "pallipes" ? "sit" : name === "durangonus" ? "play" : "sit",
    facing: facing == null ? 1 : facing,
    fromX: x,
  };
}

export function pallipesPose(t: number) {
  const u = Math.max(0, Math.min(1, t / HAPPY_DUR.pallipes));
  if (u < 0.14) {
    const s = u / 0.14;
    return { lift: s * 2.8, rot: s * 12, dx: 0, anim: "sit" as TrickAnim };
  }
  if (u < 0.78) {
    const flash = Math.sin(t * 2.2);
    return {
      lift: 2.8 + Math.abs(flash) * 1.4,
      rot: 12 + flash * 8,
      dx: flash * 0.08,
      anim: "sit" as TrickAnim,
    };
  }
  const s = (u - 0.78) / 0.22;
  return { lift: 2.0 * (1 - s), rot: 6 * (1 - s), dx: 0, anim: "idle" as TrickAnim };
}

export function durangonusPose(t: number) {
  const u = Math.max(0, Math.min(1, t / HAPPY_DUR.durangonus));
  if (u < 0.12) {
    const s = u / 0.12;
    return { lift: s * 3.7, rot: s * -14, dx: s * 0.15, anim: "play" as TrickAnim };
  }
  if (u < 0.8) {
    const wriggle = Math.sin(t * 2.6);
    return {
      lift: 3.4 + Math.abs(wriggle) * 1.6,
      rot: -14 + wriggle * 10,
      dx: wriggle * 0.12,
      anim: "play" as TrickAnim,
    };
  }
  const s = (u - 0.8) / 0.2;
  return { lift: 2.2 * (1 - s), rot: -6 * (1 - s), dx: 0, anim: "sit" as TrickAnim };
}

export function dishrunPose(t: number) {
  return {
    lift: 2.2 + Math.abs(Math.sin(t * 0.58)) * 1.1,
    rot: Math.sin(t * 0.58) * 8,
    dx: Math.sin(t * 0.4) * 0.06,
    anim: "sit" as TrickAnim,
  };
}

export function stepHappy(happy: SolifugeHappy | null | undefined, dt: number, flags?: TrickFlags) {
  if (!happy || happy.phase === "done") return happy;
  if (happyShouldAbort(flags)) {
    return { ...happy, phase: "done" as const, t: 0, lift: 0, rot: 0, anim: "idle" as TrickAnim, abort: true };
  }
  const next = { ...happy, t: happy.t + Math.max(0, dt) };
  const hold = HAPPY_DUR[next.kind];
  if (next.kind === "pallipes") {
    const pose = pallipesPose(next.t);
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "durangonus") {
    const pose = durangonusPose(next.t);
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else {
    const pose = dishrunPose(next.t);
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  }
  if (next.t >= hold) return { ...next, phase: "done" as const, lift: 0, rot: 0, anim: "idle" as TrickAnim };
  return next;
}

export function sleepHoldFrame(_key?: string | null, _frameCount?: number) {
  return null;
}

export function beginTrick(kind: SolifugeTrickKind, x: number, facing: 1 | -1): SolifugeTrick {
  const anim: TrickAnim =
    kind === "eremobates"
      ? "sit"
      : kind === "malleoli"
        ? "talk"
        : kind === "suctorial"
          ? "talk"
          : kind === "chelicrush"
            ? "play"
            : kind === "sprintburst"
              ? "play"
              : kind === "propeltidium"
                ? "sit"
                : kind === "tracheate"
                  ? "play"
                  : "sit";
  return {
    kind,
    phase: kind === "eremobates" ? "hold" : "go",
    t: 0,
    x,
    lift: 0,
    rot: 0,
    anim,
    facing: facing == null ? 1 : facing,
    fromX: x,
  };
}

function smoothstep(t: number) {
  const x = Math.max(0, Math.min(1, t));
  return x * x * (3 - 2 * x);
}

export function eremobatesPose(t: number) {
  return {
    lift: 2.4 + Math.abs(Math.sin(t * 0.42)) * 1.2,
    rot: -0.18 + Math.sin(t * 0.36) * 0.35,
  };
}

export function releasePose(t: number) {
  const u = Math.max(0, Math.min(1, t / RELEASE_S));
  return { lift: 2.4 * (1 - Math.sin(u * Math.PI * 0.5)), rot: -0.18 * (1 - u) };
}

export function malleoliPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.malleoli));
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

export function suctorialPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.suctorial));
  const face = facing == null ? 1 : facing;
  if (u < 0.12) {
    const s = smoothstep(u / 0.12);
    return { x: fromX, lift: s * 2.6, rot: s * -10 * face, anim: "talk" as TrickAnim };
  }
  if (u < 0.78) {
    const bob = Math.sin(t * 2.8);
    return {
      x: fromX + face * bob * 0.5,
      lift: 2.6 + Math.abs(bob) * 1.4,
      rot: face * (-10 + bob * 12),
      anim: "talk" as TrickAnim,
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

export function chelicrushPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.chelicrush));
  const face = facing == null ? 1 : facing;
  if (u < 0.14) {
    const s = smoothstep(u / 0.14);
    return { x: fromX, lift: s * 3.8, rot: s * 14 * face, anim: "play" as TrickAnim };
  }
  if (u < 0.78) {
    const cast = Math.sin(t * 2.6);
    return {
      x: fromX - face * cast * 0.16,
      lift: 3.6 + Math.abs(cast) * 1.6,
      rot: face * (14 + cast * 12),
      anim: "play" as TrickAnim,
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

export function sprintburstPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.sprintburst));
  const face = facing == null ? 1 : facing;
  if (u < 0.14) {
    const s = smoothstep(u / 0.14);
    return { x: fromX + face * s * 0.6, lift: s * 2.8, rot: s * 12 * face, anim: "play" as TrickAnim };
  }
  if (u < 0.78) {
    const nestle = Math.sin(t * 2.2);
    return {
      x: fromX + face * (0.6 + nestle * 0.1),
      lift: 2.4 + Math.abs(nestle) * 1.8,
      rot: face * (12 + nestle * 8),
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

export function propeltidiumPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.propeltidium));
  const face = facing == null ? 1 : facing;
  if (u < 0.14) {
    const s = smoothstep(u / 0.14);
    return { x: fromX, lift: s * 2.8, rot: s * -12 * face, anim: "sit" as TrickAnim };
  }
  if (u < 0.55) {
    const tip = Math.sin(t * 2.0);
    return {
      x: fromX + face * tip * 0.08,
      lift: 2.8 + tip * 1.6,
      rot: face * (-12 + tip * 10),
      anim: "sit" as TrickAnim,
    };
  }
  if (u < 0.78) {
    const hush = Math.sin(t * 0.9);
    return {
      x: fromX,
      lift: 4.0 + Math.abs(hush) * 0.6,
      rot: face * (-4 + hush * 3),
      anim: "sit" as TrickAnim,
    };
  }
  const s = smoothstep((u - 0.78) / 0.22);
  return {
    x: fromX,
    lift: 2.0 * (1 - s),
    rot: face * (-2 * (1 - s)),
    anim: "idle" as TrickAnim,
  };
}

export function tracheatePose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.tracheate));
  const face = facing == null ? 1 : facing;
  if (u < 0.14) {
    const s = smoothstep(u / 0.14);
    return { x: fromX, lift: s * 3.4, rot: s * 12 * face, anim: "play" as TrickAnim };
  }
  if (u < 0.55) {
    const stretch = Math.sin(t * 2.3);
    return {
      x: fromX + face * stretch * 0.1,
      lift: 3.4 + stretch * 1.4,
      rot: face * (12 + stretch * 9),
      anim: "play" as TrickAnim,
    };
  }
  if (u < 0.78) {
    const hush = Math.sin(t * 0.85);
    return {
      x: fromX,
      lift: 4.4 + Math.abs(hush) * 0.7,
      rot: face * (5 + hush * 3),
      anim: "play" as TrickAnim,
    };
  }
  const s = smoothstep((u - 0.78) / 0.22);
  return {
    x: fromX,
    lift: 1.8 * (1 - s),
    rot: face * (2 * (1 - s)),
    anim: "idle" as TrickAnim,
  };
}

export function stepTrick(trick: SolifugeTrick | null | undefined, dt: number, flags?: TrickFlags) {
  if (!trick || trick.phase === "done") return trick;
  if (shouldAbort(flags) && trick.kind !== "malleoli" && trick.kind !== "suctorial" && trick.kind !== "chelicrush" && trick.kind !== "sprintburst" && trick.kind !== "propeltidium" && trick.kind !== "tracheate") {
    return { ...trick, phase: "done" as const, t: 0, lift: 0, rot: 0, anim: "idle" as TrickAnim, abort: true };
  }
  const next = { ...trick, t: trick.t + Math.max(0, dt) };
  if (next.kind === "eremobates") {
    if (next.t < EREMOBATES_HOLD) {
      const pose = eremobatesPose(next.t);
      next.phase = "hold";
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = "sit";
      return next;
    }
    if (next.t < EREMOBATES_HOLD + RELEASE_S) {
      const pose = releasePose(next.t - EREMOBATES_HOLD);
      next.phase = "release";
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = "sit";
      return next;
    }
    return { ...next, phase: "done" as const, lift: 0, rot: 0, anim: "idle" as TrickAnim };
  }
  const hold = DUR[next.kind];
  const u = next.t / hold;
  const fromX = trick.fromX != null ? trick.fromX : trick.x;
  if (next.kind === "malleoli") {
    const pose = malleoliPose(next.t, fromX, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "suctorial") {
    const pose = suctorialPose(next.t, fromX, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "chelicrush") {
    const pose = chelicrushPose(next.t, fromX, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "sprintburst") {
    const pose = sprintburstPose(next.t, fromX, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "propeltidium") {
    const pose = propeltidiumPose(next.t, fromX, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else {
    const pose = tracheatePose(next.t, fromX, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  }
  if (u >= 1) return { ...next, phase: "done" as const, lift: 0, rot: 0, anim: "idle" as TrickAnim };
  return next;
}
