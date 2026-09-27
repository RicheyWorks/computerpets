/** Banner ground tricks while idle — ultra-polish pass. House neighborly Papilionidae / Papilio glaucus Eastern Tiger Swallowtail desk life (swallowtail / Banner) — wingbanner / puddlesip / flutterhop / tailglidesettle / tornusflash / tigerband / papiliohush personality (wingbanner forewing open-close bask pulse without naming asclepias or oyamel or plumose or lunule or wing alone as wait, puddlesip mineral puddle-sip desk cue without naming proboscis or figure or sip alone as wait, flutterhop short flutter desk hop without naming hopskip or hindleap or hop or flutter alone as wait, tailglidesettle hindwing-tail flick then soft glide settle without naming tailflick or stream or tail alone as wait, tornusflash hindwing tornusflash flash warn without naming eye or spot or flash alone as wait, tigerband tiger-stripe band pulse without naming stripe or band or tiger alone as wait, long papiliohush Papilio swallowtail hush hold (THE papiliohush sit_hold tell) — never named wait or crouch or roost or stalk or monocle or fossick or anting or corvid or asclepias or oyamel or plumose or lunule or densmilk or inkmilk or densdanaus or densghost or inkghost or densactias or hopskip or hindleap or deskbask or mandiblegraze or femurrasp or tympanal or saltatory or caeliferahush or densvault or inkvault or denscaelifera or leafstill or antennatick or tegminasong or leafwalk or tegminlift or greenmimic or tettigonihush or densblade or inkblade or denstettigonia or stridulate or antennasweep or burrowmouth or cerciflick or tegmenraise or gryllushush or denschirp or inkchirp or densgryllus or bury or flat or still or sit or walk or hop or spring or vault or banner or swallowtail as bare ethogram-only trick kinds; ethogram softs + freeze own those words; window-play unchanged if already fine; Milk monarch owns asclepias/oyamel — do NOT reuse; Ghost luna owns plumose/lunule — do NOT reuse; Comb honeybee owns proboscis/figure — do NOT reuse; Dart darner — do NOT reuse; Chirp owns hopskip/stridulate/gryllushush — do NOT reuse; Vault owns hindleap/deskbask/mandiblegraze/femurrasp/tympanal/saltatory/caeliferahush — do NOT reuse (Banner owns wingbanner/puddlesip/flutterhop/tailglidesettle/tornusflash/tigerband/papiliohush, not Vault); Blade owns leafstill/tettigonihush — do NOT reuse; squirrel may own tailflick — do NOT reuse; Jewel jewelwing next — do NOT reuse bare banner/swallowtail; header forbids bare bury/flat/still/sit/wait and bare swallowtail/banner as trick kinds; guest slug Banner / key swallowtail only for wantsThankYou matching — accept "swallowtail" and "banner"; do NOT accept bare "banner" as a trick id; do NOT name a trick "swallowtail" or "banner" or "monarch" or "milk" or "luna" or "ghost" or "honeybee" or "comb" or "darner" or "dart" or "grasshopper" or "vault" or "katydid" or "blade" or "field_cricket" or "chirp" or "asclepias" or "oyamel" or "plumose" or "lunule" or "hopskip" or "hindleap" or "caeliferahush" or "densvault" or "densblade" or "denschirp") — not Milk Danaus monarch life, not Ghost Actias luna life, not Comb Apis honeybee life, not Dart Aeshnidae darner life, not Vault Melanoplus grasshopper life, not Blade Tettigoniidae katydid life, not Chirp Gryllus field-cricket life, not Jewel Calopterygidae jewelwing life (next guest), not Rui red_panda life. Wingbanner without naming wing alone, puddlesip without naming sip alone, flutterhop without naming hop alone, tailglidesettle without naming tail alone, tornusflash without naming eye alone, tigerband without naming tiger alone, papiliohush long sit_hold on the Papilio swallowtail hush (THE papiliohush sit_hold tell); densbanner / inkbanner / denspapilio thank-yous. Feed-happy thank-yous sit after eat. Card-open freeze and window-play do not swallow a thank-you. Sleep, hide, and leave still win. Same map as desktop swallowtail-tricks.js. Window-play unchanged. Ethogram softs + freeze — never names hunt/sit/still/wait/walk/banner as bare ethogram-only trick kinds. True Eastern Tiger Swallowtail Papilio glaucus Papilionidae desk life only — forewing bask pulse, puddle sip, flutter hop, tail-glide settle, tornusflash flash, tiger-band pulse, and Papilio hush; distinct from Milk monarch asclepias/oyamel, Ghost luna plumose/lunule, Comb honeybee, Dart darner, Vault grasshopper hindleap/deskbask/mandiblegraze/femurrasp/tympanal/saltatory/caeliferahush, Blade katydid, Chirp cricket hopskip, Jewel jewelwing next, creek peers, Ink, Shift, Dash, Wink, Sol, Reed, Dapple, Eft, Slip, Soak, Coal, Whee, Spine, Burr, Grin, Stripe, Wash, Cache, Cape, Flag, Rui, ferret, Prickle, Quill, and birds. Next house-order ultra: Jewel / jewelwing. No cry inventing — thank-yous are silent desk motion only; swallowtail.wav EXISTS so prefersHouseCry adds swallowtail after grasshopper. Amplitudes raised toward Rui richness; denser waits/weights. Catalog 221. */
export const TRICK_KEY = "swallowtail";
export const TRICKS = ["wingbanner", "puddlesip", "flutterhop", "tailglidesettle", "tornusflash", "tigerband", "papiliohush"] as const;
export const HAPPY = ["densbanner", "inkbanner", "denspapilio"] as const;
export type SwallowtailTrickKind = (typeof TRICKS)[number];
export type SwallowtailHappyKind = (typeof HAPPY)[number];
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

export type SwallowtailTrick = {
  kind: SwallowtailTrickKind;
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

export type SwallowtailHappy = {
  kind: SwallowtailHappyKind;
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

export const HAPPY_DUR = { densbanner: 1.70, inkbanner: 1.84, denspapilio: 1.76 } as const;
export const PAPILIOHUSH_HOLD = 11.2;
export const RELEASE_S = 1.18;
export const DUR = {
  papiliohush: PAPILIOHUSH_HOLD + RELEASE_S,
  wingbanner: 2.48,
  puddlesip: 2.42,
  flutterhop: 2.40,
  tailglidesettle: 2.44,
  tornusflash: 2.38,
  tigerband: 2.56,
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

export function nextTrickWait(justFinished: boolean, rand?: number, kind?: SwallowtailTrickKind | string) {
  const roll = rand == null ? Math.random() : rand;
  if (kind === "papiliohush") return 40 + roll * 26;
  if (kind === "tornusflash" || kind === "wingbanner" || kind === "tailglidesettle") return 12.8 + roll * 9.4;
  if (kind === "flutterhop" || kind === "puddlesip" || kind === "tigerband") return 11.6 + roll * 8.5;
  return justFinished ? 8.5 + roll * 8.4 : 4.4 + roll * 7.4;
}

export function pickTrick(rand?: number, musicOn?: boolean, lastKind?: SwallowtailTrickKind | string | null) {
  if (musicOn) return "papiliohush" as const;
  const roll = rand == null ? Math.random() : rand;
  if (lastKind === "papiliohush") {
    if (roll < 0.17) return "wingbanner" as const;
    if (roll < 0.33) return "puddlesip" as const;
    if (roll < 0.49) return "flutterhop" as const;
    if (roll < 0.65) return "tailglidesettle" as const;
    if (roll < 0.83) return "tornusflash" as const;
    return "tigerband" as const;
  }
  if (lastKind === "wingbanner") {
    if (roll < 0.16) return "papiliohush" as const;
    if (roll < 0.32) return "puddlesip" as const;
    if (roll < 0.48) return "flutterhop" as const;
    if (roll < 0.64) return "tailglidesettle" as const;
    if (roll < 0.82) return "tornusflash" as const;
    return "tigerband" as const;
  }
  if (lastKind === "puddlesip") {
    if (roll < 0.14) return "papiliohush" as const;
    if (roll < 0.3) return "wingbanner" as const;
    if (roll < 0.46) return "flutterhop" as const;
    if (roll < 0.62) return "tailglidesettle" as const;
    if (roll < 0.8) return "tornusflash" as const;
    return "tigerband" as const;
  }
  if (lastKind === "flutterhop") {
    if (roll < 0.15) return "papiliohush" as const;
    if (roll < 0.31) return "wingbanner" as const;
    if (roll < 0.47) return "puddlesip" as const;
    if (roll < 0.63) return "tailglidesettle" as const;
    if (roll < 0.81) return "tornusflash" as const;
    return "tigerband" as const;
  }
  if (lastKind === "tailglidesettle") {
    if (roll < 0.16) return "papiliohush" as const;
    if (roll < 0.32) return "wingbanner" as const;
    if (roll < 0.48) return "puddlesip" as const;
    if (roll < 0.64) return "flutterhop" as const;
    if (roll < 0.82) return "tornusflash" as const;
    return "tigerband" as const;
  }
  if (lastKind === "tornusflash") {
    if (roll < 0.15) return "papiliohush" as const;
    if (roll < 0.31) return "wingbanner" as const;
    if (roll < 0.47) return "puddlesip" as const;
    if (roll < 0.63) return "flutterhop" as const;
    if (roll < 0.81) return "tailglidesettle" as const;
    return "tigerband" as const;
  }
  if (lastKind === "tigerband") {
    if (roll < 0.16) return "papiliohush" as const;
    if (roll < 0.32) return "wingbanner" as const;
    if (roll < 0.48) return "puddlesip" as const;
    if (roll < 0.64) return "flutterhop" as const;
    if (roll < 0.82) return "tailglidesettle" as const;
    return "tornusflash" as const;
  }
  if (roll < 0.14) return "papiliohush" as const;
  if (roll < 0.28) return "wingbanner" as const;
  if (roll < 0.42) return "puddlesip" as const;
  if (roll < 0.56) return "flutterhop" as const;
  if (roll < 0.7) return "tailglidesettle" as const;
  if (roll < 0.85) return "tornusflash" as const;
  return "tigerband" as const;
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
  return key === TRICK_KEY || key === "banner";
}

export function startThankYou(
  key: string | undefined | null,
  lastKind: SwallowtailHappyKind | null | undefined,
  x: number,
  facing: 1 | -1,
  flags?: TrickFlags
) {
  if (!wantsThankYou(key)) return null;
  if (!happyCanStart(flags || { cmd: "idle" })) return null;
  const pick = pickHappy(lastKind);
  return { happy: beginHappy(pick, x, facing), kind: pick };
}

export function pickHappy(lastKind?: SwallowtailHappyKind | null, rand?: number) {
  const pool = HAPPY.filter((k) => k !== lastKind);
  const list = pool.length ? pool : [...HAPPY];
  const roll = rand == null ? Math.random() : rand;
  return list[Math.floor(roll * list.length)] || list[0];
}

export function beginHappy(kind: SwallowtailHappyKind | string, x: number, facing: 1 | -1): SwallowtailHappy {
  const name = (HAPPY as readonly string[]).includes(kind) ? (kind as SwallowtailHappyKind) : "densbanner";
  return {
    kind: name,
    happy: true,
    phase: "go",
    t: 0,
    x,
    lift: 0,
    rot: 0,
    anim: (name === "densbanner" ? "sit" : name === "inkbanner" ? "play" : "play") as TrickAnim,
    facing: (facing == null ? 1 : facing) as 1 | -1,
    fromX: x,
  };
}

export function densbannerPose(t: number) {
  const u = Math.max(0, Math.min(1, t / HAPPY_DUR.densbanner));
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

export function inkbannerPose(t: number) {
  const u = Math.max(0, Math.min(1, t / HAPPY_DUR.inkbanner));
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

export function denspapilioPose(t: number) {
  return {
    lift: 2.2 + Math.abs(Math.sin(t * 0.58)) * 1.1,
    rot: Math.sin(t * 0.58) * 8,
    dx: Math.sin(t * 0.4) * 0.06,
    anim: "play" as TrickAnim,
  };
}

export function stepHappy(happy: SwallowtailHappy | null | undefined, dt: number, flags?: TrickFlags) {
  if (!happy || happy.phase === "done") return happy;
  if (happyShouldAbort(flags)) {
    return { ...happy, phase: "done" as const, t: 0, lift: 0, rot: 0, anim: "idle" as TrickAnim, abort: true };
  }
  const next = { ...happy, t: happy.t + Math.max(0, dt) };
  const hold = HAPPY_DUR[next.kind];
  if (next.kind === "densbanner") {
    const pose = densbannerPose(next.t);
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "inkbanner") {
    const pose = inkbannerPose(next.t);
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else {
    const pose = denspapilioPose(next.t);
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

export function beginTrick(kind: SwallowtailTrickKind, x: number, facing: 1 | -1): SwallowtailTrick {
  const anim: TrickAnim =
    kind === "papiliohush"
      ? "sit"
      : kind === "wingbanner"
        ? "play"
        : kind === "tigerband"
          ? "talk"
          : kind === "puddlesip"
            ? "walk"
            : kind === "flutterhop"
              ? "sit"
              : kind === "tailglidesettle"
                ? "play"
                : kind === "tornusflash"
                  ? "walk"
                  : "sit";
  return {
    kind,
    phase: kind === "papiliohush" ? "hold" : "go",
    t: 0,
    x,
    lift: 0,
    rot: 0,
    anim,
    facing: (facing == null ? 1 : facing) as 1 | -1,
    fromX: x,
  };
}

function smoothstep(t: number) {
  const x = Math.max(0, Math.min(1, t));
  return x * x * (3 - 2 * x);
}

export function papiliohushPose(t: number) {
  return {
    lift: 2.4 + Math.abs(Math.sin(t * 0.42)) * 1.2,
    rot: -0.18 + Math.sin(t * 0.36) * 0.35,
  };
}

export function releasePose(t: number) {
  const u = Math.max(0, Math.min(1, t / RELEASE_S));
  return { lift: 2.4 * (1 - Math.sin(u * Math.PI * 0.5)), rot: -0.18 * (1 - u) };
}

export function wingbannerPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.wingbanner));
  const face = facing == null ? 1 : facing;
  if (u < 0.14) {
    const s = smoothstep(u / 0.14);
    return { x: fromX + face * s * 0.8, lift: s * 3.0, rot: s * -12 * face, anim: "play" as TrickAnim };
  }
  if (u < 0.78) {
    const bar = Math.sin(t * 2.4);
    return {
      x: fromX + face * (0.8 + bar * 0.16),
      lift: 2.8 + Math.abs(bar) * 1.5,
      rot: face * (-12 + bar * 10),
      anim: "play" as TrickAnim,
    };
  }
  const s = smoothstep((u - 0.78) / 0.22);
  return {
    x: fromX + face * 0.8 * (1 - s),
    lift: 1.4 * (1 - s),
    rot: face * (-4 * (1 - s)),
    anim: "idle" as TrickAnim,
  };
}

export function puddlesipPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.puddlesip));
  const face = facing == null ? 1 : facing;
  if (u < 0.12) {
    const s = smoothstep(u / 0.12);
    return { x: fromX, lift: s * 2.6, rot: s * 10 * face, anim: "walk" as TrickAnim };
  }
  if (u < 0.78) {
    const bob = Math.sin(t * 2.2);
    return {
      x: fromX + face * bob * 0.12,
      lift: 2.6 + Math.abs(bob) * 1.3,
      rot: face * (10 + bob * 8),
      anim: "walk" as TrickAnim,
    };
  }
  const s = smoothstep((u - 0.78) / 0.22);
  return {
    x: fromX,
    lift: 1.2 * (1 - s),
    rot: face * (3 * (1 - s)),
    anim: "idle" as TrickAnim,
  };
}

export function flutterhopPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.flutterhop));
  const face = facing == null ? 1 : facing;
  if (u < 0.14) {
    const s = smoothstep(u / 0.14);
    return { x: fromX + face * s * 0.5, lift: s * 2.8, rot: s * 11 * face, anim: "sit" as TrickAnim };
  }
  if (u < 0.78) {
    const hang = Math.sin(t * 2.0);
    return {
      x: fromX + face * (0.5 + hang * 0.1),
      lift: 2.8 + Math.abs(hang) * 1.2,
      rot: face * (11 + hang * 8),
      anim: "sit" as TrickAnim,
    };
  }
  const s = smoothstep((u - 0.78) / 0.22);
  return {
    x: fromX + face * 0.5 * (1 - s),
    lift: 1.3 * (1 - s),
    rot: face * (3 * (1 - s)),
    anim: "idle" as TrickAnim,
  };
}

export function tailglidesettlePose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.tailglidesettle));
  const face = facing == null ? 1 : facing;
  if (u < 0.1) {
    const s = smoothstep(u / 0.1);
    return { x: fromX + face * s * 1.0, lift: s * 4.0, rot: s * 18 * face, anim: "play" as TrickAnim };
  }
  if (u < 0.8) {
    const thrash = Math.sin(t * 3.6);
    return {
      x: fromX + face * (1.0 + thrash * 0.22),
      lift: 3.6 + Math.abs(thrash) * 2.0,
      rot: face * (18 + thrash * 14),
      anim: "play" as TrickAnim,
    };
  }
  const s = smoothstep((u - 0.8) / 0.2);
  return {
    x: fromX + face * 1.0 * (1 - s),
    lift: 1.6 * (1 - s),
    rot: face * (6 * (1 - s)),
    anim: "idle" as TrickAnim,
  };
}

export function tornusflashPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.tornusflash));
  const face = facing == null ? 1 : facing;
  if (u < 0.14) {
    const s = smoothstep(u / 0.14);
    return { x: fromX + face * s * 0.6, lift: s * 3.0, rot: s * 12 * face, anim: "walk" as TrickAnim };
  }
  if (u < 0.8) {
    const cast = Math.sin(t * 2.8);
    return {
      x: fromX + face * (0.6 + cast * 0.16),
      lift: 2.8 + Math.abs(cast) * 1.6,
      rot: face * (12 + cast * 10),
      anim: "walk" as TrickAnim,
    };
  }
  const s = smoothstep((u - 0.8) / 0.2);
  return {
    x: fromX + face * 0.6 * (1 - s),
    lift: 1.4 * (1 - s),
    rot: face * (4 * (1 - s)),
    anim: "idle" as TrickAnim,
  };
}

export function tigerbandPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.tigerband));
  const face = facing == null ? 1 : facing;
  if (u < 0.14) {
    const s = smoothstep(u / 0.14);
    return { x: fromX + face * s * 0.6, lift: s * 3.2, rot: s * 14 * face, anim: "talk" as TrickAnim };
  }
  if (u < 0.8) {
    const cloud = Math.sin(t * 3.0);
    return {
      x: fromX + face * (0.6 + cloud * 0.18),
      lift: 3.0 + Math.abs(cloud) * 1.8,
      rot: face * (14 + cloud * 12),
      anim: "talk" as TrickAnim,
    };
  }
  const s = smoothstep((u - 0.8) / 0.2);
  return {
    x: fromX + face * 0.6 * (1 - s),
    lift: 1.5 * (1 - s),
    rot: face * (5 * (1 - s)),
    anim: "idle" as TrickAnim,
  };
}

export function stepTrick(trick: SwallowtailTrick | null | undefined, dt: number, flags?: TrickFlags) {
  if (!trick || trick.phase === "done") return trick;
  if (
    shouldAbort(flags) &&
    trick.kind !== "wingbanner" &&
    trick.kind !== "puddlesip" &&
    trick.kind !== "flutterhop" &&
    trick.kind !== "tailglidesettle" &&
    trick.kind !== "tornusflash" &&
    trick.kind !== "tigerband"
  ) {
    return { ...trick, phase: "done" as const, t: 0, lift: 0, rot: 0, anim: "idle" as TrickAnim, abort: true };
  }
  const next = { ...trick, t: trick.t + Math.max(0, dt) };
  if (next.kind === "papiliohush") {
    if (next.t < PAPILIOHUSH_HOLD) {
      const pose = papiliohushPose(next.t);
      next.phase = "hold";
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = "sit";
      return next;
    }
    if (next.t < PAPILIOHUSH_HOLD + RELEASE_S) {
      const pose = releasePose(next.t - PAPILIOHUSH_HOLD);
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
  if (next.kind === "wingbanner") {
    const pose = wingbannerPose(next.t, fromX, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "puddlesip") {
    const pose = puddlesipPose(next.t, fromX, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "flutterhop") {
    const pose = flutterhopPose(next.t, fromX, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "tailglidesettle") {
    const pose = tailglidesettlePose(next.t, fromX, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "tornusflash") {
    const pose = tornusflashPose(next.t, fromX, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else {
    const pose = tigerbandPose(next.t, fromX, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  }
  if (u >= 1) return { ...next, phase: "done" as const, lift: 0, rot: 0, anim: "idle" as TrickAnim };
  return next;
}
