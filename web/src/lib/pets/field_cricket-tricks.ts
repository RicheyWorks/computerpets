/** Chirp ground tricks while idle — ultra-polish pass. House neighborly Gryllidae / Gryllus / Fall Field Cricket desk life (field_cricket / Chirp) — stridulate / antennasweep / hopskip / burrowmouth / cerciflick / tegmenraise / gryllushush personality (stridulate tegmen wing-chirp cue without naming song or buzz or tymbal or cast or egress or harden or magicicada or cicada or brood or rasp or file or bow or music or call or cry alone as wait, antennasweep long feeler sweep without naming antenna or feeler or sweep or scan or look or sense or touch or probe alone as wait, hopskip hop-skip bound without naming hop or skip or jump or vault or bound or leap or grasshopper or katydid or blade alone as wait, burrowmouth burrow-mouth fossick without naming fossick or dig or burrow or mouth or hole or nest or dens alone as wait, cerciflick cerci flick without naming cerci or flick or tail or rear or sense alone as wait, tegmenraise tegmen raise without naming tegmen or raise or wing or elytra or lift alone as wait, long gryllushush Gryllus field-cricket hush hold (THE gryllushush sit_hold tell) — never named wait or crouch or roost or stalk or monocle or fossick or anting or corvid or uburrow or sedgulp or gillflush or heapcast or tailcast or headdig or arenicolahush or densheap or inkheap or densarenicola or siphonprobe or footplow or opercdoor or knobbyrock or whelkhaul or canalprobe or busyconhush or densknurl or inkknurl or densbusycon or spinewalk or lanterngraze or gripcreep or spineflare or pedicellaria or aristotle or strongylhush or densurchin or inkthorn or densstrongyl or tymbal or cast or egress or harden or magicicada or septendecim or cassini or cicadidae or raptorial or gimbal or snatch or pendulum or mantodea or bury or flat or still or leafhush or cast or dart or roll or walk or sit or hop or spring or vault or thrash or peristalse or castheap or surfacerise or soilanchor or terrestris or denscast or inkcast or densclit or sinusoid or dauerrest or pharynxpump or thrashturn or elegans or densthread or inkthread or densdauer or pumppulse or limpet or cone or barnacle or cement or ghost_crab or pale or chiton or mail or periwinkle or spire or sand_dollar or token or sea_urchin or thorn or knurl or whelk or knobbed_whelk or lugworm or heap or field_cricket or chirp or katydid or blade or grasshopper or vault or righting or podia or penta or evert or graze or rasp as bare ethogram-only trick kinds; ethogram softs + freeze own those words; window-play unchanged if already fine; Heap owns uburrow/sedgulp/gillflush/heapcast/tailcast/headdig/arenicolahush — do NOT reuse; Knurl owns siphonprobe/footplow/opercdoor/knobbyrock/whelkhaul/canalprobe/busyconhush — do NOT reuse; Thorn owns spinewalk/lanterngraze/gripcreep/spineflare/pedicellaria/aristotle/strongylhush — do NOT reuse; Cast owns peristalse/castheap/surfacerise/soilanchor/terrestris — do NOT reuse; Brood cicada owns tymbal/cast/egress/harden/magicicada — do NOT reuse; Blade katydid next — do NOT reuse bare field_cricket/chirp/katydid/blade as trick kinds; header forbids bare bury/flat/still/sit/wait and bare field_cricket/chirp/lugworm/heap/knurl/whelk/katydid/blade/grasshopper/vault; guest slug Chirp / key field_cricket only for wantsThankYou matching — accept "field_cricket" and "chirp"; do NOT accept bare "chirp" as a trick id; do NOT name a trick "field_cricket" or "chirp" or "lugworm" or "heap" or "knobbed_whelk" or "knurl" or "katydid" or "blade" or "grasshopper" or "vault" or "cicada" or "brood" or "castheap" or "peristalse" or "pumppulse" or "uburrow" or "arenicolahush" or "bury" or "flat" or "still" or "sit" or "densheap" or "densknurl" or "chamber") — not Heap Arenicola lugworm life, not Knurl Busycon knobbed-whelk life, not Thorn Strongylocentrotus sea-urchin life, not Brood Magicicada cicada life, not Fold Mantodea mantis life, not Blade Northern True Katydid life (next guest), not Vault Differential Grasshopper life, not Rui red_panda life. Stridulate without naming song alone, antennasweep without naming antenna alone, hopskip without naming hop alone, burrowmouth without naming burrow alone, cerciflick without naming cerci alone, tegmenraise without naming tegmen alone, gryllushush long sit_hold on the Gryllus field-cricket hush (THE gryllushush sit_hold tell); denschirp / inkchirp / densgryllus thank-yous. Feed-happy thank-yous sit after eat. Card-open freeze and window-play do not swallow a thank-you. Sleep, hide, and leave still win. Same map as desktop field_cricket-tricks.js. Window-play unchanged. Ethogram softs + freeze — never names hunt/sit/still/wait/walk as bare ethogram-only trick kinds. True Gryllus Fall Field Cricket desk life only — tegmen stridulation cue, antenna sweep, hop-skip bound, burrow-mouth fossick, cerci flick, tegmen raise, and Gryllus hush; distinct from Heap lugworm uburrow/sedgulp/gillflush/heapcast/tailcast/headdig/arenicolahush, Knurl knobbed-whelk, Thorn sea-urchin, Brood cicada tymbal/cast/egress, Cast earthworm, Thread nematode, Blade katydid next, creek peers, Ink, Shift, Dash, Wink, Sol, Reed, Dapple, Eft, Slip, Soak, Coal, Whee, Spine, Burr, Grin, Stripe, Wash, Cache, Cape, Flag, Rui, ferret, Prickle, Quill, and birds. Next house-order ultra: Blade / katydid. No cry inventing — thank-yous are silent desk motion only; field_cricket.wav EXISTS so prefersHouseCry adds field_cricket after lugworm. Amplitudes raised toward Rui richness; denser waits/weights. Catalog 221. */
export const TRICK_KEY = "field_cricket";
export const TRICKS = ["stridulate", "antennasweep", "hopskip", "burrowmouth", "cerciflick", "tegmenraise", "gryllushush"] as const;
export const HAPPY = ["denschirp", "inkchirp", "densgryllus"] as const;
export type FieldCricketTrickKind = (typeof TRICKS)[number];
export type FieldCricketHappyKind = (typeof HAPPY)[number];
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

export type FieldCricketTrick = {
  kind: FieldCricketTrickKind;
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

export type FieldCricketHappy = {
  kind: FieldCricketHappyKind;
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

export const HAPPY_DUR = { denschirp: 1.70, inkchirp: 1.84, densgryllus: 1.76 } as const;
export const GRYLLUSHUSH_HOLD = 11.2;
export const RELEASE_S = 1.18;
export const DUR = {
  gryllushush: GRYLLUSHUSH_HOLD + RELEASE_S,
  stridulate: 2.48,
  antennasweep: 2.42,
  hopskip: 2.40,
  burrowmouth: 2.44,
  cerciflick: 2.38,
  tegmenraise: 2.56,
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

export function nextTrickWait(justFinished: boolean, rand?: number, kind?: FieldCricketTrickKind | string) {
  const roll = rand == null ? Math.random() : rand;
  if (kind === "gryllushush") return 40 + roll * 26;
  if (kind === "cerciflick" || kind === "stridulate" || kind === "burrowmouth") return 12.8 + roll * 9.4;
  if (kind === "hopskip" || kind === "antennasweep" || kind === "tegmenraise") return 11.6 + roll * 8.5;
  return justFinished ? 8.5 + roll * 8.4 : 4.4 + roll * 7.4;
}

export function pickTrick(rand?: number, musicOn?: boolean, lastKind?: FieldCricketTrickKind | string | null) {
  if (musicOn) return "gryllushush" as const;
  const roll = rand == null ? Math.random() : rand;
  if (lastKind === "gryllushush") {
    if (roll < 0.17) return "stridulate" as const;
    if (roll < 0.33) return "antennasweep" as const;
    if (roll < 0.49) return "hopskip" as const;
    if (roll < 0.65) return "burrowmouth" as const;
    if (roll < 0.83) return "cerciflick" as const;
    return "tegmenraise" as const;
  }
  if (lastKind === "stridulate") {
    if (roll < 0.16) return "gryllushush" as const;
    if (roll < 0.32) return "antennasweep" as const;
    if (roll < 0.48) return "hopskip" as const;
    if (roll < 0.64) return "burrowmouth" as const;
    if (roll < 0.82) return "cerciflick" as const;
    return "tegmenraise" as const;
  }
  if (lastKind === "antennasweep") {
    if (roll < 0.14) return "gryllushush" as const;
    if (roll < 0.3) return "stridulate" as const;
    if (roll < 0.46) return "hopskip" as const;
    if (roll < 0.62) return "burrowmouth" as const;
    if (roll < 0.8) return "cerciflick" as const;
    return "tegmenraise" as const;
  }
  if (lastKind === "hopskip") {
    if (roll < 0.15) return "gryllushush" as const;
    if (roll < 0.31) return "stridulate" as const;
    if (roll < 0.47) return "antennasweep" as const;
    if (roll < 0.63) return "burrowmouth" as const;
    if (roll < 0.81) return "cerciflick" as const;
    return "tegmenraise" as const;
  }
  if (lastKind === "burrowmouth") {
    if (roll < 0.16) return "gryllushush" as const;
    if (roll < 0.32) return "stridulate" as const;
    if (roll < 0.48) return "antennasweep" as const;
    if (roll < 0.64) return "hopskip" as const;
    if (roll < 0.82) return "cerciflick" as const;
    return "tegmenraise" as const;
  }
  if (lastKind === "cerciflick") {
    if (roll < 0.15) return "gryllushush" as const;
    if (roll < 0.31) return "stridulate" as const;
    if (roll < 0.47) return "antennasweep" as const;
    if (roll < 0.63) return "hopskip" as const;
    if (roll < 0.81) return "burrowmouth" as const;
    return "tegmenraise" as const;
  }
  if (lastKind === "tegmenraise") {
    if (roll < 0.16) return "gryllushush" as const;
    if (roll < 0.32) return "stridulate" as const;
    if (roll < 0.48) return "antennasweep" as const;
    if (roll < 0.64) return "hopskip" as const;
    if (roll < 0.82) return "burrowmouth" as const;
    return "cerciflick" as const;
  }
  if (roll < 0.14) return "gryllushush" as const;
  if (roll < 0.28) return "stridulate" as const;
  if (roll < 0.42) return "antennasweep" as const;
  if (roll < 0.56) return "hopskip" as const;
  if (roll < 0.7) return "burrowmouth" as const;
  if (roll < 0.85) return "cerciflick" as const;
  return "tegmenraise" as const;
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
  return key === TRICK_KEY || key === "chirp";
}

export function startThankYou(
  key: string | undefined | null,
  lastKind: FieldCricketHappyKind | null | undefined,
  x: number,
  facing: 1 | -1,
  flags?: TrickFlags
) {
  if (!wantsThankYou(key)) return null;
  if (!happyCanStart(flags || { cmd: "idle" })) return null;
  const pick = pickHappy(lastKind);
  return { happy: beginHappy(pick, x, facing), kind: pick };
}

export function pickHappy(lastKind?: FieldCricketHappyKind | null, rand?: number) {
  const pool = HAPPY.filter((k) => k !== lastKind);
  const list = pool.length ? pool : [...HAPPY];
  const roll = rand == null ? Math.random() : rand;
  return list[Math.floor(roll * list.length)] || list[0];
}

export function beginHappy(kind: FieldCricketHappyKind | string, x: number, facing: 1 | -1): FieldCricketHappy {
  const name = (HAPPY as readonly string[]).includes(kind) ? (kind as FieldCricketHappyKind) : "denschirp";
  return {
    kind: name,
    happy: true,
    phase: "go",
    t: 0,
    x,
    lift: 0,
    rot: 0,
    anim: (name === "denschirp" ? "sit" : name === "inkchirp" ? "play" : "play") as TrickAnim,
    facing: (facing == null ? 1 : facing) as 1 | -1,
    fromX: x,
  };
}

export function denschirpPose(t: number) {
  const u = Math.max(0, Math.min(1, t / HAPPY_DUR.denschirp));
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

export function inkchirpPose(t: number) {
  const u = Math.max(0, Math.min(1, t / HAPPY_DUR.inkchirp));
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

export function densgryllusPose(t: number) {
  return {
    lift: 2.2 + Math.abs(Math.sin(t * 0.58)) * 1.1,
    rot: Math.sin(t * 0.58) * 8,
    dx: Math.sin(t * 0.4) * 0.06,
    anim: "play" as TrickAnim,
  };
}

export function stepHappy(happy: FieldCricketHappy | null | undefined, dt: number, flags?: TrickFlags) {
  if (!happy || happy.phase === "done") return happy;
  if (happyShouldAbort(flags)) {
    return { ...happy, phase: "done" as const, t: 0, lift: 0, rot: 0, anim: "idle" as TrickAnim, abort: true };
  }
  const next = { ...happy, t: happy.t + Math.max(0, dt) };
  const hold = HAPPY_DUR[next.kind];
  if (next.kind === "denschirp") {
    const pose = denschirpPose(next.t);
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "inkchirp") {
    const pose = inkchirpPose(next.t);
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else {
    const pose = densgryllusPose(next.t);
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

export function beginTrick(kind: FieldCricketTrickKind, x: number, facing: 1 | -1): FieldCricketTrick {
  const anim: TrickAnim =
    kind === "gryllushush"
      ? "sit"
      : kind === "stridulate"
        ? "play"
        : kind === "tegmenraise"
          ? "talk"
          : kind === "antennasweep"
            ? "walk"
            : kind === "hopskip"
              ? "sit"
              : kind === "burrowmouth"
                ? "play"
                : kind === "cerciflick"
                  ? "walk"
                  : "sit";
  return {
    kind,
    phase: kind === "gryllushush" ? "hold" : "go",
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

export function gryllushushPose(t: number) {
  return {
    lift: 2.4 + Math.abs(Math.sin(t * 0.42)) * 1.2,
    rot: -0.18 + Math.sin(t * 0.36) * 0.35,
  };
}

export function releasePose(t: number) {
  const u = Math.max(0, Math.min(1, t / RELEASE_S));
  return { lift: 2.4 * (1 - Math.sin(u * Math.PI * 0.5)), rot: -0.18 * (1 - u) };
}

export function stridulatePose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.stridulate));
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

export function antennasweepPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.antennasweep));
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

export function hopskipPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.hopskip));
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

export function burrowmouthPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.burrowmouth));
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

export function cerciflickPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.cerciflick));
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

export function tegmenraisePose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.tegmenraise));
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

export function stepTrick(trick: FieldCricketTrick | null | undefined, dt: number, flags?: TrickFlags) {
  if (!trick || trick.phase === "done") return trick;
  if (
    shouldAbort(flags) &&
    trick.kind !== "stridulate" &&
    trick.kind !== "antennasweep" &&
    trick.kind !== "hopskip" &&
    trick.kind !== "burrowmouth" &&
    trick.kind !== "cerciflick" &&
    trick.kind !== "tegmenraise"
  ) {
    return { ...trick, phase: "done" as const, t: 0, lift: 0, rot: 0, anim: "idle" as TrickAnim, abort: true };
  }
  const next = { ...trick, t: trick.t + Math.max(0, dt) };
  if (next.kind === "gryllushush") {
    if (next.t < GRYLLUSHUSH_HOLD) {
      const pose = gryllushushPose(next.t);
      next.phase = "hold";
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = "sit";
      return next;
    }
    if (next.t < GRYLLUSHUSH_HOLD + RELEASE_S) {
      const pose = releasePose(next.t - GRYLLUSHUSH_HOLD);
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
  if (next.kind === "stridulate") {
    const pose = stridulatePose(next.t, fromX, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "antennasweep") {
    const pose = antennasweepPose(next.t, fromX, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "hopskip") {
    const pose = hopskipPose(next.t, fromX, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "burrowmouth") {
    const pose = burrowmouthPose(next.t, fromX, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "cerciflick") {
    const pose = cerciflickPose(next.t, fromX, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else {
    const pose = tegmenraisePose(next.t, fromX, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  }
  if (u >= 1) return { ...next, phase: "done" as const, lift: 0, rot: 0, anim: "idle" as TrickAnim };
  return next;
}
