/** Shift ground tricks while idle — ultra-polish pass. House neighborly Chamaeleonidae / Chamaeleo calyptratus Veiled Chameleon perch desk life (chameleon / Shift) — veilflush / turretgaze / tongueshot / branchrock / casque / zygodactyl / calyptratus personality (veilflush chromatophore veil flush without naming color or hue or flush or pigment or change or shift or camouflage or blend or match or fade or bright or mood or stress alone, turretgaze independent turret gaze without naming eye or turret or gaze or aim or scan or look or watch or stereo or independent or orbit or pupil or lid alone, tongueshot ballistic tongue shot without naming tongue or shot or ballistic or sticky or prey or cricket or strike or whip or ball or tip or glue or catch alone, branchrock cryptic branch rock without naming branch or rock or sway or leaf or pendul or walk or climb or foot or tong or grip or perch or vine alone, casque casque crest raise without naming casque or crest or raise or crown or helmet or ridge or spike alone, zygodactyl zygodactyl foot clamp without naming zygodactyl or foot or clamp or grip or tong or grasp or cling or perch alone, long calyptratus Chamaeleo calyptratus surface-calm casque hush hold (THE calyptratus sit_hold tell) — never named wait or crouch or roost or look or stalk or monocle or fossick or anting or corvid or dewlapflash or pushupshow or hueshift or preyinch or nuchal or vinehush or anolis or toepadcling or vocalclick or lickeye or mothstalk or setae or lamphush or hemidactylus or mudwallow or sedgecrop or alarmwhistle or pilelean or scentgland or socialpile or hydrochoerus or bipedrise or clawscar or berrypluck or denscrape or bluffhuff or mastforage or ursus or toothclack or boleclimb or cambiumchew or dorsoflare or guardhair or pinehush or erethizon or woodfell or paddleclap or lodgehaul or mudpack or aspen or divehush or castor or stillfeign or scrapnose or gapegrin or raftergrip or pouchcarry or prehensile or didelphis or footstomp or duffgrub or handwarn or plumeaim or scentraise or plantigrade or mephitis or pawdouse or litterdig or rearstand or maskpeer or dexterous or ringtail or procyon or bellyglide or corkroll or shellcrunch or whiskernudge or denslide or spraint or lontra or nutbury or tailflick or cheekpouch or branchleap or barkscramble or scold or sciurus or wingwrap or traguscup or thumbcrawl or duskhang or eptesicus or flagtail or edgebrowse or earswivel or forestamp or odocoileus or curl or snuffle or anoint or bristle or root or trundle or wheel or tube or romp or steal or puff or noodle or corkscrew or slink or hang or flutter or still or stamp or raise or spray or skunk or stripe or playdead or grin or opossum or ferret or weasel or mink or otter or red_panda or wash or beaver or dam or porcupine or spine or quill or popcorn or rumble or hay or potato or zig or lookout or teeth or soak or graze or nuzzle or capybara or bankhush or climb or chirp or cling or gecko or pad or dewlap or sun or nod or press or flick or sneeze or lash or maculate or litter or cutaneous or nasolabial or ambystomid or mental or granular or crest or caudal or filament or costal or caudate or lamella or imbricate or lasso or margin or pleurotus or gular or nictitate or tympanum or iliac or lentic or toepad or webbing or verruca or burrow or parotoid or tubercle or bufonid or flash or brown or hue or shift or chameleon or aim or catch or dash or skink or tail or tongueflick or tailbluff or litterdash or sunbask or bluetail or stonehush or plestiodon or casquehush or color as bare ethogram-only trick kinds; ethogram softs + freeze own those words; window-play FLASH unchanged if already fine; Wink/anole owns dewlapflash/pushupshow/hueshift/preyinch/nuchal/vinehush/anolis — do NOT reuse hueshift; Pad owns toepadcling/vocalclick/lickeye/mothstalk/setae/lamphush/hemidactylus; Dash owns tailbluff/litterdash/tongueflick/sunbask/bluetail/stonehush/plestiodon — tongueshot stays distinct from tongueflick; Grin owns stillfeign; Wash owns litterdig; guest slug Shift / key chameleon only for isKey matching — accept "chameleon" and "shift"; do NOT name a trick "chameleon" or "shift" or "color" or "hue" or "hueshift" or "still" or "flash" or "anole" or "wink" or "gecko" or "pad" or "skink" or "dash" or "tongueflick" or "aim" or "catch" or "walk" or "horned" or "spike" or "iguana" or "sol" or "frog" or "reed") — not Wink anole life, not Pad gecko life, not Dash skink life, not Sol iguana life, not Reed frog life, not Spike horned_lizard life, not Rui red_panda life. Veilflush veil flush without naming flush alone, turretgaze turret gaze without naming gaze alone, tongueshot tongue shot without naming tongue alone, branchrock branch rock without naming rock alone, casque casque raise without naming casque alone, zygodactyl zygodactyl clamp without naming foot alone, calyptratus long sit_hold on the perch (THE calyptratus sit_hold tell); denshift / inkshift / denscasque thank-yous. Feed-happy thank-yous sit after eat. Card-open freeze and window-play do not swallow a thank-you. Sleep, hide, and leave still win. Same map as desktop chameleon-tricks.js. Window-play FLASH unchanged. Ethogram softs + freeze — never names aim/walk/catch/chameleon as bare ethogram-only trick kinds. True Chamaeleo calyptratus Chamaeleonidae Veiled Chameleon desk life only — distinct from Wink, Pad, Dash, Sol, Reed, Dapple, Eft, Slip, Soak, Coal, Dam, Whee, Slick, Spine, Grin, Stripe, Wash, Cache, Cape, Flag, Spike, Rui, ferret, Prickle, Quill, and birds. Next house-order ultra: Spike / horned_lizard. No cry inventing — thank-yous are silent desk motion only; no chameleon.wav on disk so prefersHouseCry skipped. Amplitudes raised toward Rui richness; denser waits/weights. Catalog 221. */
export const TRICK_KEY = "chameleon";
export const TRICKS = ["veilflush", "turretgaze", "tongueshot", "branchrock", "casque", "zygodactyl", "calyptratus"] as const;
export const HAPPY = ["denshift", "inkshift", "denscasque"] as const;
export type ChameleonTrickKind = (typeof TRICKS)[number];
export type ChameleonHappyKind = (typeof HAPPY)[number];
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

export type ChameleonTrick = {
  kind: ChameleonTrickKind;
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

export type ChameleonHappy = {
  kind: ChameleonHappyKind;
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

export const HAPPY_DUR = { denshift: 1.70, inkshift: 1.84, denscasque: 1.76 } as const;
export const CALYPTRATUS_HOLD = 11.2;
export const RELEASE_S = 1.18;
export const DUR = {
  calyptratus: CALYPTRATUS_HOLD + RELEASE_S,
  veilflush: 2.48,
  turretgaze: 2.42,
  tongueshot: 2.56,
  branchrock: 2.44,
  casque: 2.40,
  zygodactyl: 2.38,
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

export function nextTrickWait(justFinished: boolean, rand?: number, kind?: ChameleonTrickKind | string) {
  const roll = rand == null ? Math.random() : rand;
  if (kind === "calyptratus") return 40 + roll * 26;
  if (kind === "casque" || kind === "zygodactyl" || kind === "veilflush") return 12.8 + roll * 9.4;
  if (kind === "turretgaze" || kind === "tongueshot" || kind === "branchrock") return 11.6 + roll * 8.5;
  return justFinished ? 8.5 + roll * 8.4 : 4.4 + roll * 7.4;
}

export function pickTrick(rand?: number, musicOn?: boolean, lastKind?: ChameleonTrickKind | string | null) {
  if (musicOn) return "calyptratus" as const;
  const roll = rand == null ? Math.random() : rand;
  if (lastKind === "calyptratus") {
    if (roll < 0.17) return "veilflush" as const;
    if (roll < 0.33) return "turretgaze" as const;
    if (roll < 0.49) return "tongueshot" as const;
    if (roll < 0.65) return "branchrock" as const;
    if (roll < 0.83) return "casque" as const;
    return "zygodactyl" as const;
  }
  if (lastKind === "veilflush") {
    if (roll < 0.16) return "calyptratus" as const;
    if (roll < 0.32) return "turretgaze" as const;
    if (roll < 0.48) return "tongueshot" as const;
    if (roll < 0.64) return "branchrock" as const;
    if (roll < 0.82) return "casque" as const;
    return "zygodactyl" as const;
  }
  if (lastKind === "turretgaze") {
    if (roll < 0.14) return "calyptratus" as const;
    if (roll < 0.3) return "veilflush" as const;
    if (roll < 0.46) return "tongueshot" as const;
    if (roll < 0.62) return "branchrock" as const;
    if (roll < 0.8) return "casque" as const;
    return "zygodactyl" as const;
  }
  if (lastKind === "casque" || lastKind === "zygodactyl") {
    if (roll < 0.14) return "calyptratus" as const;
    if (roll < 0.3) return "veilflush" as const;
    if (roll < 0.46) return "turretgaze" as const;
    if (roll < 0.62) return "tongueshot" as const;
    if (roll < 0.78) return "branchrock" as const;
    return lastKind === "casque" ? ("zygodactyl" as const) : ("casque" as const);
  }
  if (roll < 0.14) return "calyptratus" as const;
  if (roll < 0.28) return "veilflush" as const;
  if (roll < 0.42) return "turretgaze" as const;
  if (roll < 0.56) return "tongueshot" as const;
  if (roll < 0.7) return "branchrock" as const;
  if (roll < 0.85) return "casque" as const;
  return "zygodactyl" as const;
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
  return key === TRICK_KEY || key === "shift";
}

export function startThankYou(
  key: string | undefined | null,
  lastKind: ChameleonHappyKind | string | null | undefined,
  x: number,
  facing: 1 | -1,
  flags?: TrickFlags,
) {
  if (!wantsThankYou(key)) return null;
  if (!happyCanStart(flags || { cmd: "idle" })) return null;
  const pick = pickHappy(lastKind as ChameleonHappyKind | null | undefined);
  return { happy: beginHappy(pick, x, facing), kind: pick };
}

export function pickHappy(lastKind?: ChameleonHappyKind | null, rand?: number) {
  const pool = HAPPY.filter((k) => k !== lastKind);
  const list = pool.length ? pool : [...HAPPY];
  const roll = rand == null ? Math.random() : rand;
  return list[Math.floor(roll * list.length)] || list[0];
}

export function beginHappy(kind: ChameleonHappyKind | string, x: number, facing: 1 | -1): ChameleonHappy {
  const name = (HAPPY as readonly string[]).indexOf(kind) >= 0 ? (kind as ChameleonHappyKind) : "denshift";
  return {
    kind: name,
    happy: true,
    phase: "go",
    t: 0,
    x: x,
    lift: 0,
    rot: 0,
    anim: name === "denshift" ? "sit" : name === "inkshift" ? "play" : "sit",
    facing: facing == null ? 1 : facing,
    fromX: x,
  };
}

export function denshiftPose(t: number) {
  const u = Math.max(0, Math.min(1, t / HAPPY_DUR.denshift));
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

export function inkshiftPose(t: number) {
  const u = Math.max(0, Math.min(1, t / HAPPY_DUR.inkshift));
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

export function denscasquePose(t: number) {
  return {
    lift: 2.2 + Math.abs(Math.sin(t * 0.58)) * 1.1,
    rot: Math.sin(t * 0.58) * 8,
    dx: Math.sin(t * 0.4) * 0.06,
    anim: "sit" as TrickAnim,
  };
}

export function stepHappy(happy: ChameleonHappy | null | undefined, dt: number, flags?: TrickFlags) {
  if (!happy || happy.phase === "done") return happy;
  if (happyShouldAbort(flags)) {
    return { ...happy, phase: "done" as const, t: 0, lift: 0, rot: 0, anim: "idle" as TrickAnim, abort: true };
  }
  const next = { ...happy, t: happy.t + Math.max(0, dt) };
  const hold = HAPPY_DUR[next.kind];
  if (next.kind === "denshift") {
    const pose = denshiftPose(next.t);
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "inkshift") {
    const pose = inkshiftPose(next.t);
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else {
    const pose = denscasquePose(next.t);
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

export function beginTrick(kind: ChameleonTrickKind, x: number, facing: 1 | -1): ChameleonTrick {
  const anim: TrickAnim =
    kind === "calyptratus"
      ? "sit"
      : kind === "veilflush"
        ? "sit"
        : kind === "turretgaze"
          ? "talk"
          : kind === "tongueshot"
            ? "play"
            : kind === "branchrock"
              ? "sit"
              : kind === "casque"
                ? "talk"
                : kind === "zygodactyl"
                  ? "play"
                  : "sit";
  return {
    kind,
    phase: kind === "calyptratus" ? "hold" : "go",
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

export function calyptratusPose(t: number) {
  return {
    lift: 2.4 + Math.abs(Math.sin(t * 0.42)) * 1.2,
    rot: -0.18 + Math.sin(t * 0.36) * 0.35,
  };
}

export function releasePose(t: number) {
  const u = Math.max(0, Math.min(1, t / RELEASE_S));
  return { lift: 2.4 * (1 - Math.sin(u * Math.PI * 0.5)), rot: -0.18 * (1 - u) };
}

export function veilflushPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.veilflush));
  const face = facing == null ? 1 : facing;
  if (u < 0.14) {
    const s = smoothstep(u / 0.14);
    return { x: fromX + face * s * 0.8, lift: s * 3.5, rot: s * 16 * face, anim: "sit" as TrickAnim };
  }
  if (u < 0.78) {
    const tip = Math.sin(t * 2.4);
    return {
      x: fromX + face * (0.8 + tip * 0.12),
      lift: 3.5 + Math.abs(tip) * 1.5,
      rot: face * (16 + tip * 10),
      anim: "sit" as TrickAnim,
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

export function turretgazePose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.turretgaze));
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

export function tongueshotPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.tongueshot));
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

export function branchrockPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.branchrock));
  const face = facing == null ? 1 : facing;
  if (u < 0.14) {
    const s = smoothstep(u / 0.14);
    return { x: fromX + face * s * 0.6, lift: s * 2.8, rot: s * 12 * face, anim: "sit" as TrickAnim };
  }
  if (u < 0.78) {
    const nestle = Math.sin(t * 2.2);
    return {
      x: fromX + face * (0.6 + nestle * 0.1),
      lift: 2.4 + Math.abs(nestle) * 1.8,
      rot: face * (12 + nestle * 8),
      anim: "sit" as TrickAnim,
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

export function casquePose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.casque));
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

export function zygodactylPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.zygodactyl));
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

export function stepTrick(trick: ChameleonTrick | null | undefined, dt: number, flags?: TrickFlags) {
  if (!trick || trick.phase === "done") return trick;
  if (shouldAbort(flags) && trick.kind !== "veilflush" && trick.kind !== "turretgaze" && trick.kind !== "tongueshot" && trick.kind !== "branchrock" && trick.kind !== "casque" && trick.kind !== "zygodactyl") {
    return { ...trick, phase: "done" as const, t: 0, lift: 0, rot: 0, anim: "idle" as TrickAnim, abort: true };
  }
  const next = { ...trick, t: trick.t + Math.max(0, dt) };
  if (next.kind === "calyptratus") {
    if (next.t < CALYPTRATUS_HOLD) {
      const pose = calyptratusPose(next.t);
      next.phase = "hold";
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = "sit";
      return next;
    }
    if (next.t < CALYPTRATUS_HOLD + RELEASE_S) {
      const pose = releasePose(next.t - CALYPTRATUS_HOLD);
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
  if (next.kind === "veilflush") {
    const pose = veilflushPose(next.t, fromX, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "turretgaze") {
    const pose = turretgazePose(next.t, fromX, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "tongueshot") {
    const pose = tongueshotPose(next.t, fromX, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "branchrock") {
    const pose = branchrockPose(next.t, fromX, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "casque") {
    const pose = casquePose(next.t, fromX, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else {
    const pose = zygodactylPose(next.t, fromX, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  }
  if (u >= 1) return { ...next, phase: "done" as const, lift: 0, rot: 0, anim: "idle" as TrickAnim };
  return next;
}

