/** Spine ground tricks while idle — ultra-polish pass. House neighborly Erethizontidae / Erethizon dorsatum North-American-porcupine pine-post desk life (porcupine / Spine) — toothclack / boleclimb / cambiumchew / dorsoflare / guardhair / pinehush / erethizon personality (toothclack teeth-chatter warn without naming chatter or teeth or tooth or jaw or warn or threat or clack or click or snap or hiss or growl alone, boleclimb bole-trunk climb without naming climb or bole or trunk or tree or ascend or scramble or grip or claw or limb or pine or oak alone, cambiumchew cambium-bark browse without naming cambium or bark or chew or browse or peel or strip or gnaw or bite or wood or aspen or willow alone, dorsoflare dorsal-quill crest without naming quill or spine or dorsal or flare or crest or bristle or raise or rump or rear or needle or barb alone, guardhair guard-hair warn flare tell without naming guard or hair or warn or bristle or quill or raise or crest or ruff alone, pinehush pine-post hush settle tell without naming pine or hush or post or settle or roost or perch or wait alone, long erethizon Erethizon dorsatum surface-alert pine-hush hold (THE erethizon sit_hold tell) — never named wait or crouch or roost or look or stalk or monocle or fossick or anting or corvid or woodfell or paddleclap or lodgehaul or mudpack or aspen or divehush or castor or stillfeign or scrapnose or gapegrin or raftergrip or pouchcarry or prehensile or didelphis or footstomp or duffgrub or handwarn or plumeaim or scentraise or plantigrade or mephitis or pawdouse or litterdig or rearstand or maskpeer or dexterous or ringtail or procyon or bellyglide or corkroll or shellcrunch or whiskernudge or denslide or spraint or lontra or nutbury or tailflick or cheekpouch or branchleap or barkscramble or scold or sciurus or wingwrap or traguscup or thumbcrawl or duskhang or eptesicus or flagtail or edgebrowse or earswivel or forestamp or odocoileus or curl or snuffle or anoint or bristle or root or trundle or wheel or tube or romp or steal or puff or noodle or corkscrew or slink or hang or flutter or still or stamp or raise or spray or skunk or stripe or playdead or grin or opossum or ferret or weasel or mink or otter or red_panda or wash or beaver or dam or porcupine or spine or quill or sit as bare ethogram-only trick kinds; ethogram softs + freeze own those words; window-play RUN unchanged if already fine; Dam owns woodfell/paddleclap/lodgehaul/mudpack/aspen/divehush/castor; Grin owns stillfeign/scrapnose/gapegrin/raftergrip/pouchcarry/prehensile/didelphis; Stripe owns footstomp/duffgrub/handwarn/plumeaim/scentraise/plantigrade/mephitis; Wash owns pawdouse/litterdig/rearstand/maskpeer/dexterous/ringtail/procyon; Slick owns bellyglide/corkroll/shellcrunch/whiskernudge/denslide/spraint/lontra; Cache owns nutbury/tailflick/cheekpouch/branchleap/barkscramble/scold/sciurus; Cape owns wingwrap/traguscup/thumbcrawl/duskhang/echolocate/calcar/eptesicus; Flag owns flagtail/edgebrowse/earswivel/forestamp/stotbound/snortblow/odocoileus; Burr/hedgehog owns curl/snuffle/anoint/bristle/root/trundle/wheel — keep distinct from hedgehog quills; Prickle/stickleback owns spiggin/zigzag/spinous/fanning/gasterosteid/nuptial/pelvic; Quill/parrot owns quote/strut/fan/crack/flash/pineye/invert; Rui is red_panda — never name a trick red_panda or wash or raccoon or skunk or stripe or opossum or grin or beaver or dam or porcupine or spine; ferret owns tube/romp/steal/puff/noodle/corkscrew/slink; mining bee owns shaft/mass/vernal/fovea/andrena — do NOT collide with mining; Rue fox / Pip dog / Miso cat / Thimble rabbit stay distinct mammal peers; Soot/Wedge/Heart/Hook/Dee/Brick/Drake/Vee/Drum own bird tricks; guest slug Spine / key porcupine only for isKey matching — accept "porcupine" and "spine"; do NOT name a trick "porcupine" or "spine" or "quill" or "bristle" or "climb" or "still" or "sit" or "muskrat" or "otter" or "mink" or "coypu" or "nutria" or "raccoon" or "skunk" or "opossum" or "ferret" or "weasel" or "Bank" or "mining" or "beaver" or "dam" or "hedgehog" or "burr" or "stickleback" or "parrot") — not Dam beaver life, not Burr hedgehog life, not Grin opossum life, not Stripe skunk life, not Wash raccoon life, not Slick otter life, not Cache squirrel life, not Cape bat life, not Flag deer life, not Rui red_panda life, not ferret clone, not bird life, not Coal black_bear life. Toothclack teeth-chatter without naming tooth alone, boleclimb bole-climb without naming climb alone, cambiumchew cambium-chew without naming chew alone, dorsoflare dorsal-flare without naming flare alone, guardhair guard-hair without naming hair alone, pinehush pine-hush without naming hush alone, erethizon long sit_hold on the pine post (THE erethizon sit_hold tell); denspine / inkspine / denscrest thank-yous. Feed-happy thank-yous sit after eat. Card-open freeze and window-play do not swallow a thank-you. Sleep, hide, and leave still win. Same map as desktop porcupine-tricks.js. Window-play RUN unchanged. Ethogram softs + freeze — never names bristle/climb/still/porcupine as bare ethogram-only trick kinds. True North-American-porcupine Erethizontidae desk life only — distinct from Dam, Burr, Grin, Stripe, Wash, Slick, Cache, Cape, Flag, Rui, ferret, Prickle, Quill, Coal, and birds. Next house-order ultra: Coal / black_bear. No cry inventing — thank-yous are silent desk motion only; prefersHouseCry via porcupine.wav. Amplitudes raised toward Rui richness; denser waits/weights. Catalog 221. */
export const TRICK_KEY = "porcupine";
export const TRICKS = ["toothclack", "boleclimb", "cambiumchew", "dorsoflare", "guardhair", "pinehush", "erethizon"] as const;
export const HAPPY = ["denspine", "inkspine", "denscrest"] as const;
export type PorcupineTrickKind = (typeof TRICKS)[number];
export type PorcupineHappyKind = (typeof HAPPY)[number];
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

export type PorcupineTrick = {
  kind: PorcupineTrickKind;
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

export type PorcupineHappy = {
  kind: PorcupineHappyKind;
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

export const HAPPY_DUR = { denspine: 1.70, inkspine: 1.84, denscrest: 1.76 } as const;
export const ERETHIZON_HOLD = 11.2;
export const RELEASE_S = 1.18;
export const DUR = {
  erethizon: ERETHIZON_HOLD + RELEASE_S,
  toothclack: 2.48,
  boleclimb: 2.42,
  cambiumchew: 2.56,
  dorsoflare: 2.44,
  guardhair: 2.40,
  pinehush: 2.38,
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

export function nextTrickWait(justFinished: boolean, rand?: number, kind?: PorcupineTrickKind | string) {
  const roll = rand == null ? Math.random() : rand;
  if (kind === "erethizon") return 40 + roll * 26;
  if (kind === "guardhair" || kind === "pinehush" || kind === "toothclack") return 12.8 + roll * 9.4;
  if (kind === "boleclimb" || kind === "cambiumchew" || kind === "dorsoflare") return 11.6 + roll * 8.5;
  return justFinished ? 8.5 + roll * 8.4 : 4.4 + roll * 7.4;
}

export function pickTrick(rand?: number, musicOn?: boolean, lastKind?: PorcupineTrickKind | string | null) {
  if (musicOn) return "erethizon" as const;
  const roll = rand == null ? Math.random() : rand;
  if (lastKind === "erethizon") {
    if (roll < 0.17) return "toothclack" as const;
    if (roll < 0.33) return "boleclimb" as const;
    if (roll < 0.49) return "cambiumchew" as const;
    if (roll < 0.65) return "dorsoflare" as const;
    if (roll < 0.83) return "guardhair" as const;
    return "pinehush" as const;
  }
  if (lastKind === "toothclack") {
    if (roll < 0.16) return "erethizon" as const;
    if (roll < 0.32) return "boleclimb" as const;
    if (roll < 0.48) return "cambiumchew" as const;
    if (roll < 0.64) return "dorsoflare" as const;
    if (roll < 0.82) return "guardhair" as const;
    return "pinehush" as const;
  }
  if (lastKind === "boleclimb") {
    if (roll < 0.14) return "erethizon" as const;
    if (roll < 0.3) return "toothclack" as const;
    if (roll < 0.46) return "cambiumchew" as const;
    if (roll < 0.62) return "dorsoflare" as const;
    if (roll < 0.8) return "guardhair" as const;
    return "pinehush" as const;
  }
  if (lastKind === "guardhair" || lastKind === "pinehush") {
    if (roll < 0.14) return "erethizon" as const;
    if (roll < 0.3) return "toothclack" as const;
    if (roll < 0.46) return "boleclimb" as const;
    if (roll < 0.62) return "cambiumchew" as const;
    if (roll < 0.78) return "dorsoflare" as const;
    return lastKind === "guardhair" ? ("pinehush" as const) : ("guardhair" as const);
  }
  if (roll < 0.14) return "erethizon" as const;
  if (roll < 0.28) return "toothclack" as const;
  if (roll < 0.42) return "boleclimb" as const;
  if (roll < 0.56) return "cambiumchew" as const;
  if (roll < 0.7) return "dorsoflare" as const;
  if (roll < 0.85) return "guardhair" as const;
  return "pinehush" as const;
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
  return key === TRICK_KEY || key === "spine";
}

export function startThankYou(
  key: string | undefined | null,
  lastKind: PorcupineHappyKind | string | null | undefined,
  x: number,
  facing: 1 | -1,
  flags?: TrickFlags,
) {
  if (!wantsThankYou(key)) return null;
  if (!happyCanStart(flags || { cmd: "idle" })) return null;
  const pick = pickHappy(lastKind as PorcupineHappyKind | null | undefined);
  return { happy: beginHappy(pick, x, facing), kind: pick };
}

export function pickHappy(lastKind?: PorcupineHappyKind | null, rand?: number) {
  const pool = HAPPY.filter((k) => k !== lastKind);
  const list = pool.length ? pool : [...HAPPY];
  const roll = rand == null ? Math.random() : rand;
  return list[Math.floor(roll * list.length)] || list[0];
}

export function beginHappy(kind: PorcupineHappyKind | string, x: number, facing: 1 | -1): PorcupineHappy {
  const name = (HAPPY as readonly string[]).indexOf(kind) >= 0 ? (kind as PorcupineHappyKind) : "denspine";
  return {
    kind: name,
    happy: true,
    phase: "go",
    t: 0,
    x: x,
    lift: 0,
    rot: 0,
    anim: name === "denspine" ? "sit" : name === "inkspine" ? "play" : "sit",
    facing: facing == null ? 1 : facing,
    fromX: x,
  };
}

export function denspinePose(t: number) {
  const u = Math.max(0, Math.min(1, t / HAPPY_DUR.denspine));
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

export function inkspinePose(t: number) {
  const u = Math.max(0, Math.min(1, t / HAPPY_DUR.inkspine));
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

export function denscrestPose(t: number) {
  return {
    lift: 2.2 + Math.abs(Math.sin(t * 0.58)) * 1.1,
    rot: Math.sin(t * 0.58) * 8,
    dx: Math.sin(t * 0.4) * 0.06,
    anim: "sit" as TrickAnim,
  };
}

export function stepHappy(happy: PorcupineHappy | null | undefined, dt: number, flags?: TrickFlags) {
  if (!happy || happy.phase === "done") return happy;
  if (happyShouldAbort(flags)) {
    return { ...happy, phase: "done" as const, t: 0, lift: 0, rot: 0, anim: "idle" as TrickAnim, abort: true };
  }
  const next = { ...happy, t: happy.t + Math.max(0, dt) };
  const hold = HAPPY_DUR[next.kind];
  if (next.kind === "denspine") {
    const pose = denspinePose(next.t);
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "inkspine") {
    const pose = inkspinePose(next.t);
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else {
    const pose = denscrestPose(next.t);
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

export function beginTrick(kind: PorcupineTrickKind, x: number, facing: 1 | -1): PorcupineTrick {
  const anim: TrickAnim =
    kind === "erethizon"
      ? "sit"
      : kind === "toothclack"
        ? "talk"
        : kind === "boleclimb"
          ? "play"
          : kind === "cambiumchew"
            ? "play"
            : kind === "dorsoflare"
              ? "talk"
              : kind === "guardhair"
                ? "talk"
                : kind === "pinehush"
                  ? "play"
                  : "sit";
  return {
    kind,
    phase: kind === "erethizon" ? "hold" : "go",
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

export function erethizonPose(t: number) {
  return {
    lift: 2.4 + Math.abs(Math.sin(t * 0.42)) * 1.2,
    rot: -0.18 + Math.sin(t * 0.36) * 0.35,
  };
}

export function releasePose(t: number) {
  const u = Math.max(0, Math.min(1, t / RELEASE_S));
  return { lift: 2.4 * (1 - Math.sin(u * Math.PI * 0.5)), rot: -0.18 * (1 - u) };
}

export function toothclackPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.toothclack));
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

export function boleclimbPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.boleclimb));
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

export function cambiumchewPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.cambiumchew));
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

export function dorsoflarePose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.dorsoflare));
  const face = facing == null ? 1 : facing;
  if (u < 0.14) {
    const s = smoothstep(u / 0.14);
    return { x: fromX + face * s * 0.6, lift: s * 2.8, rot: s * 12 * face, anim: "talk" as TrickAnim };
  }
  if (u < 0.78) {
    const nestle = Math.sin(t * 2.2);
    return {
      x: fromX + face * (0.6 + nestle * 0.1),
      lift: 2.4 + Math.abs(nestle) * 1.8,
      rot: face * (12 + nestle * 8),
      anim: "talk" as TrickAnim,
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

export function guardhairPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.guardhair));
  const face = facing == null ? 1 : facing;
  if (u < 0.14) {
    const s = smoothstep(u / 0.14);
    return { x: fromX, lift: s * 2.8, rot: s * -12 * face, anim: "talk" as TrickAnim };
  }
  if (u < 0.55) {
    const tip = Math.sin(t * 2.0);
    return {
      x: fromX + face * tip * 0.08,
      lift: 2.8 + tip * 1.6,
      rot: face * (-12 + tip * 10),
      anim: "talk" as TrickAnim,
    };
  }
  if (u < 0.78) {
    const hush = Math.sin(t * 0.9);
    return {
      x: fromX,
      lift: 4.0 + Math.abs(hush) * 0.6,
      rot: face * (-4 + hush * 3),
      anim: "talk" as TrickAnim,
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

export function pinehushPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.pinehush));
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

export function stepTrick(trick: PorcupineTrick | null | undefined, dt: number, flags?: TrickFlags) {
  if (!trick || trick.phase === "done") return trick;
  if (shouldAbort(flags) && trick.kind !== "toothclack" && trick.kind !== "boleclimb" && trick.kind !== "cambiumchew" && trick.kind !== "dorsoflare" && trick.kind !== "guardhair" && trick.kind !== "pinehush") {
    return { ...trick, phase: "done" as const, t: 0, lift: 0, rot: 0, anim: "idle" as TrickAnim, abort: true };
  }
  const next = { ...trick, t: trick.t + Math.max(0, dt) };
  if (next.kind === "erethizon") {
    if (next.t < ERETHIZON_HOLD) {
      const pose = erethizonPose(next.t);
      next.phase = "hold";
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = "sit";
      return next;
    }
    if (next.t < ERETHIZON_HOLD + RELEASE_S) {
      const pose = releasePose(next.t - ERETHIZON_HOLD);
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
  if (next.kind === "toothclack") {
    const pose = toothclackPose(next.t, fromX, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "boleclimb") {
    const pose = boleclimbPose(next.t, fromX, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "cambiumchew") {
    const pose = cambiumchewPose(next.t, fromX, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "dorsoflare") {
    const pose = dorsoflarePose(next.t, fromX, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "guardhair") {
    const pose = guardhairPose(next.t, fromX, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else {
    const pose = pinehushPose(next.t, fromX, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  }
  if (u >= 1) return { ...next, phase: "done" as const, lift: 0, rot: 0, anim: "idle" as TrickAnim };
  return next;
}
