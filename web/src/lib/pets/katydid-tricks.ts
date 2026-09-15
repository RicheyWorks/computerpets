/** Blade ground tricks while idle — ultra-polish pass. House neighborly Tettigoniidae / Pterophylla / Northern True Katydid desk life (katydid / Blade) — leafstill / antennatick / tegminasong / leafwalk / tegminlift / greenmimic / tettigonihush personality (leafstill leaf-mimic stillness without naming still or sit or wait or leaf or mimic or hide or freeze alone as wait, antennatick long-antenna tick without naming antenna or tick or feeler or sweep or scan or probe alone as wait, tegminasong tegmina song cue without naming song or stridulate or tegmenraise or gryllushush or chirp or buzz or call or cry alone as wait, leafwalk slow leaf walk without naming walk or leaf or stroll or step or crawl alone as wait, tegminlift tegmina raise without naming tegmen or raise or wing or lift or tegmenraise alone as wait, greenmimic green leaf-mimic flatten without naming green or camouflage or cryptic or flat or still alone as wait, long tettigonihush Tettigonia katydid hush hold (THE tettigonihush sit_hold tell) — never named wait or crouch or roost or stalk or monocle or fossick or anting or corvid or stridulate or antennasweep or hopskip or burrowmouth or cerciflick or tegmenraise or gryllushush or denschirp or inkchirp or densgryllus or uburrow or sedgulp or gillflush or heapcast or tailcast or headdig or arenicolahush or densheap or inkheap or densarenicola or siphonprobe or footplow or opercdoor or knobbyrock or whelkhaul or canalprobe or busyconhush or densknurl or inkknurl or densbusycon or spinewalk or lanterngraze or gripcreep or spineflare or pedicellaria or aristotle or strongylhush or densurchin or inkthorn or densstrongyl or tymbal or cast or egress or harden or magicicada or septendecim or cassini or cicadidae or raptorial or gimbal or snatch or pendulum or mantodea or bury or flat or still or leafhush or cast or dart or roll or walk or sit or hop or spring or vault or thrash or peristalse or castheap or surfacerise or soilanchor or terrestris or denscast or inkcast or densclit or sinusoid or dauerrest or pharynxpump or thrashturn or elegans or densthread or inkthread or densdauer or pumppulse or limpet or cone or barnacle or cement or ghost_crab or pale or chiton or mail or periwinkle or spire or sand_dollar or token or sea_urchin or thorn or knurl or whelk or knobbed_whelk or lugworm or heap or field_cricket or chirp or katydid or blade or grasshopper or vault or righting or podia or penta or evert or graze or rasp as bare ethogram-only trick kinds; ethogram softs + freeze own those words; window-play unchanged if already fine; Chirp owns stridulate/antennasweep/hopskip/burrowmouth/cerciflick/tegmenraise/gryllushush — do NOT reuse (tegminasong != tegmenraise); Heap owns uburrow/sedgulp/gillflush/heapcast/tailcast/headdig/arenicolahush — do NOT reuse; Knurl owns siphonprobe/footplow/opercdoor/knobbyrock/whelkhaul/canalprobe/busyconhush — do NOT reuse; Thorn owns spinewalk/lanterngraze/gripcreep/spineflare/pedicellaria/aristotle/strongylhush — do NOT reuse; Cast owns peristalse/castheap/surfacerise/soilanchor/terrestris — do NOT reuse; Brood cicada owns tymbal/cast/egress/harden/magicicada — do NOT reuse; Lid box_turtle owns leafhush — do NOT reuse; Vault grasshopper next — do NOT reuse bare hop/vault/grasshopper; header forbids bare bury/flat/still/sit/wait and bare field_cricket/chirp/lugworm/heap/knurl/whelk/katydid/blade/grasshopper/vault; guest slug Blade / key katydid only for wantsThankYou matching — accept "katydid" and "blade"; do NOT accept bare "blade" as a trick id; do NOT name a trick "katydid" or "blade" or "field_cricket" or "chirp" or "lugworm" or "heap" or "knobbed_whelk" or "knurl" or "grasshopper" or "vault" or "cicada" or "brood" or "castheap" or "peristalse" or "pumppulse" or "uburrow" or "arenicolahush" or "stridulate" or "tegmenraise" or "gryllushush" or "bury" or "flat" or "still" or "sit" or "densheap" or "densknurl" or "denschirp" or "chamber") — not Chirp Gryllus field-cricket life, not Heap Arenicola lugworm life, not Knurl Busycon knobbed-whelk life, not Thorn Strongylocentrotus sea-urchin life, not Brood Magicicada cicada life, not Fold Mantodea mantis life, not Lid Terrapene box-turtle leafhush life, not Vault Differential Grasshopper life (next guest), not Rui red_panda life. Leafstill without naming still alone, antennatick without naming antenna alone, tegminasong without naming song alone, leafwalk without naming walk alone, tegminlift without naming tegmen alone, greenmimic without naming green alone, tettigonihush long sit_hold on the Tettigonia katydid hush (THE tettigonihush sit_hold tell); densblade / inkblade / denstettigonia thank-yous. Feed-happy thank-yous sit after eat. Card-open freeze and window-play do not swallow a thank-you. Sleep, hide, and leave still win. Same map as desktop katydid-tricks.js. Window-play unchanged. Ethogram softs + freeze — never names hunt/sit/still/wait/walk as bare ethogram-only trick kinds. True Northern True Katydid Tettigoniidae desk life only — leaf-mimic stillness, antenna tick, tegmina song cue, leaf walk, tegmina raise, green leaf-mimic flatten, and Tettigonia hush; distinct from Chirp field-cricket stridulate/antennasweep/hopskip/burrowmouth/cerciflick/tegmenraise/gryllushush, Heap lugworm, Knurl knobbed-whelk, Thorn sea-urchin, Brood cicada tymbal/cast/egress, Cast earthworm, Thread nematode, Vault grasshopper next, creek peers, Ink, Shift, Dash, Wink, Sol, Reed, Dapple, Eft, Slip, Soak, Coal, Whee, Spine, Burr, Grin, Stripe, Wash, Cache, Cape, Flag, Rui, ferret, Prickle, Quill, and birds. Next house-order ultra: Vault / grasshopper. No cry inventing — thank-yous are silent desk motion only; katydid.wav EXISTS so prefersHouseCry adds katydid after field_cricket. Amplitudes raised toward Rui richness; denser waits/weights. Catalog 221. */
export const TRICK_KEY = "katydid";
export const TRICKS = ["leafstill", "antennatick", "tegminasong", "leafwalk", "tegminlift", "greenmimic", "tettigonihush"] as const;
export const HAPPY = ["densblade", "inkblade", "denstettigonia"] as const;
export type KatydidTrickKind = (typeof TRICKS)[number];
export type KatydidHappyKind = (typeof HAPPY)[number];
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

export type KatydidTrick = {
  kind: KatydidTrickKind;
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

export type KatydidHappy = {
  kind: KatydidHappyKind;
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

export const HAPPY_DUR = { densblade: 1.70, inkblade: 1.84, denstettigonia: 1.76 } as const;
export const TETTIGONIHUSH_HOLD = 11.2;
export const RELEASE_S = 1.18;
export const DUR = {
  tettigonihush: TETTIGONIHUSH_HOLD + RELEASE_S,
  leafstill: 2.48,
  antennatick: 2.42,
  tegminasong: 2.40,
  leafwalk: 2.44,
  tegminlift: 2.38,
  greenmimic: 2.56,
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

export function nextTrickWait(justFinished: boolean, rand?: number, kind?: KatydidTrickKind | string) {
  const roll = rand == null ? Math.random() : rand;
  if (kind === "tettigonihush") return 40 + roll * 26;
  if (kind === "tegminlift" || kind === "leafstill" || kind === "leafwalk") return 12.8 + roll * 9.4;
  if (kind === "tegminasong" || kind === "antennatick" || kind === "greenmimic") return 11.6 + roll * 8.5;
  return justFinished ? 8.5 + roll * 8.4 : 4.4 + roll * 7.4;
}

export function pickTrick(rand?: number, musicOn?: boolean, lastKind?: KatydidTrickKind | string | null) {
  if (musicOn) return "tettigonihush" as const;
  const roll = rand == null ? Math.random() : rand;
  if (lastKind === "tettigonihush") {
    if (roll < 0.17) return "leafstill" as const;
    if (roll < 0.33) return "antennatick" as const;
    if (roll < 0.49) return "tegminasong" as const;
    if (roll < 0.65) return "leafwalk" as const;
    if (roll < 0.83) return "tegminlift" as const;
    return "greenmimic" as const;
  }
  if (lastKind === "leafstill") {
    if (roll < 0.16) return "tettigonihush" as const;
    if (roll < 0.32) return "antennatick" as const;
    if (roll < 0.48) return "tegminasong" as const;
    if (roll < 0.64) return "leafwalk" as const;
    if (roll < 0.82) return "tegminlift" as const;
    return "greenmimic" as const;
  }
  if (lastKind === "antennatick") {
    if (roll < 0.14) return "tettigonihush" as const;
    if (roll < 0.3) return "leafstill" as const;
    if (roll < 0.46) return "tegminasong" as const;
    if (roll < 0.62) return "leafwalk" as const;
    if (roll < 0.8) return "tegminlift" as const;
    return "greenmimic" as const;
  }
  if (lastKind === "tegminasong") {
    if (roll < 0.15) return "tettigonihush" as const;
    if (roll < 0.31) return "leafstill" as const;
    if (roll < 0.47) return "antennatick" as const;
    if (roll < 0.63) return "leafwalk" as const;
    if (roll < 0.81) return "tegminlift" as const;
    return "greenmimic" as const;
  }
  if (lastKind === "leafwalk") {
    if (roll < 0.16) return "tettigonihush" as const;
    if (roll < 0.32) return "leafstill" as const;
    if (roll < 0.48) return "antennatick" as const;
    if (roll < 0.64) return "tegminasong" as const;
    if (roll < 0.82) return "tegminlift" as const;
    return "greenmimic" as const;
  }
  if (lastKind === "tegminlift") {
    if (roll < 0.15) return "tettigonihush" as const;
    if (roll < 0.31) return "leafstill" as const;
    if (roll < 0.47) return "antennatick" as const;
    if (roll < 0.63) return "tegminasong" as const;
    if (roll < 0.81) return "leafwalk" as const;
    return "greenmimic" as const;
  }
  if (lastKind === "greenmimic") {
    if (roll < 0.16) return "tettigonihush" as const;
    if (roll < 0.32) return "leafstill" as const;
    if (roll < 0.48) return "antennatick" as const;
    if (roll < 0.64) return "tegminasong" as const;
    if (roll < 0.82) return "leafwalk" as const;
    return "tegminlift" as const;
  }
  if (roll < 0.14) return "tettigonihush" as const;
  if (roll < 0.28) return "leafstill" as const;
  if (roll < 0.42) return "antennatick" as const;
  if (roll < 0.56) return "tegminasong" as const;
  if (roll < 0.7) return "leafwalk" as const;
  if (roll < 0.85) return "tegminlift" as const;
  return "greenmimic" as const;
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
  return key === TRICK_KEY || key === "blade";
}

export function startThankYou(
  key: string | undefined | null,
  lastKind: KatydidHappyKind | null | undefined,
  x: number,
  facing: 1 | -1,
  flags?: TrickFlags
) {
  if (!wantsThankYou(key)) return null;
  if (!happyCanStart(flags || { cmd: "idle" })) return null;
  const pick = pickHappy(lastKind);
  return { happy: beginHappy(pick, x, facing), kind: pick };
}

export function pickHappy(lastKind?: KatydidHappyKind | null, rand?: number) {
  const pool = HAPPY.filter((k) => k !== lastKind);
  const list = pool.length ? pool : [...HAPPY];
  const roll = rand == null ? Math.random() : rand;
  return list[Math.floor(roll * list.length)] || list[0];
}

export function beginHappy(kind: KatydidHappyKind | string, x: number, facing: 1 | -1): KatydidHappy {
  const name = (HAPPY as readonly string[]).includes(kind) ? (kind as KatydidHappyKind) : "densblade";
  return {
    kind: name,
    happy: true,
    phase: "go",
    t: 0,
    x,
    lift: 0,
    rot: 0,
    anim: (name === "densblade" ? "sit" : name === "inkblade" ? "play" : "play") as TrickAnim,
    facing: (facing == null ? 1 : facing) as 1 | -1,
    fromX: x,
  };
}

export function densbladePose(t: number) {
  const u = Math.max(0, Math.min(1, t / HAPPY_DUR.densblade));
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

export function inkbladePose(t: number) {
  const u = Math.max(0, Math.min(1, t / HAPPY_DUR.inkblade));
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

export function denstettigoniaPose(t: number) {
  return {
    lift: 2.2 + Math.abs(Math.sin(t * 0.58)) * 1.1,
    rot: Math.sin(t * 0.58) * 8,
    dx: Math.sin(t * 0.4) * 0.06,
    anim: "play" as TrickAnim,
  };
}

export function stepHappy(happy: KatydidHappy | null | undefined, dt: number, flags?: TrickFlags) {
  if (!happy || happy.phase === "done") return happy;
  if (happyShouldAbort(flags)) {
    return { ...happy, phase: "done" as const, t: 0, lift: 0, rot: 0, anim: "idle" as TrickAnim, abort: true };
  }
  const next = { ...happy, t: happy.t + Math.max(0, dt) };
  const hold = HAPPY_DUR[next.kind];
  if (next.kind === "densblade") {
    const pose = densbladePose(next.t);
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "inkblade") {
    const pose = inkbladePose(next.t);
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else {
    const pose = denstettigoniaPose(next.t);
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

export function beginTrick(kind: KatydidTrickKind, x: number, facing: 1 | -1): KatydidTrick {
  const anim: TrickAnim =
    kind === "tettigonihush"
      ? "sit"
      : kind === "leafstill"
        ? "play"
        : kind === "greenmimic"
          ? "talk"
          : kind === "antennatick"
            ? "walk"
            : kind === "tegminasong"
              ? "sit"
              : kind === "leafwalk"
                ? "play"
                : kind === "tegminlift"
                  ? "walk"
                  : "sit";
  return {
    kind,
    phase: kind === "tettigonihush" ? "hold" : "go",
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

export function tettigonihushPose(t: number) {
  return {
    lift: 2.4 + Math.abs(Math.sin(t * 0.42)) * 1.2,
    rot: -0.18 + Math.sin(t * 0.36) * 0.35,
  };
}

export function releasePose(t: number) {
  const u = Math.max(0, Math.min(1, t / RELEASE_S));
  return { lift: 2.4 * (1 - Math.sin(u * Math.PI * 0.5)), rot: -0.18 * (1 - u) };
}

export function leafstillPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.leafstill));
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

export function antennatickPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.antennatick));
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

export function tegminasongPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.tegminasong));
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

export function leafwalkPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.leafwalk));
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

export function tegminliftPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.tegminlift));
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

export function greenmimicPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.greenmimic));
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

export function stepTrick(trick: KatydidTrick | null | undefined, dt: number, flags?: TrickFlags) {
  if (!trick || trick.phase === "done") return trick;
  if (
    shouldAbort(flags) &&
    trick.kind !== "leafstill" &&
    trick.kind !== "antennatick" &&
    trick.kind !== "tegminasong" &&
    trick.kind !== "leafwalk" &&
    trick.kind !== "tegminlift" &&
    trick.kind !== "greenmimic"
  ) {
    return { ...trick, phase: "done" as const, t: 0, lift: 0, rot: 0, anim: "idle" as TrickAnim, abort: true };
  }
  const next = { ...trick, t: trick.t + Math.max(0, dt) };
  if (next.kind === "tettigonihush") {
    if (next.t < TETTIGONIHUSH_HOLD) {
      const pose = tettigonihushPose(next.t);
      next.phase = "hold";
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = "sit";
      return next;
    }
    if (next.t < TETTIGONIHUSH_HOLD + RELEASE_S) {
      const pose = releasePose(next.t - TETTIGONIHUSH_HOLD);
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
  if (next.kind === "leafstill") {
    const pose = leafstillPose(next.t, fromX, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "antennatick") {
    const pose = antennatickPose(next.t, fromX, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "tegminasong") {
    const pose = tegminasongPose(next.t, fromX, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "leafwalk") {
    const pose = leafwalkPose(next.t, fromX, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "tegminlift") {
    const pose = tegminliftPose(next.t, fromX, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else {
    const pose = greenmimicPose(next.t, fromX, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  }
  if (u >= 1) return { ...next, phase: "done" as const, lift: 0, rot: 0, anim: "idle" as TrickAnim };
  return next;
}
