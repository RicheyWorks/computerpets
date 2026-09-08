/** Knurl ground tricks while idle. House neighborly Busycon / knobbed whelk desk life — siphonprobe / footplow / opercdoor / knobbyrock / busyconhush personality (siphonprobe siphon probe without naming siphon or probe or taste or snorkel alone as wait, footplow foot plow crawl without naming foot or plow or crawl or haul or sand alone as wait, opercdoor operculum door shut without naming operculum or door or shut or plug or seal alone as wait, knobbyrock knobby shell tip-rock without naming knobby or tip or rock or shell or tilt alone as wait, long busyconhush Busycon knobbed-whelk hush — never named wait or crouch or roost or stalk or monocle or fossick or anting or corvid or siphonprobe or footplow or opercdoor or knobbyrock or busyconhush or densknurl or inkknurl or densbusycon or spinewalk or lanterngraze or gripcreep or spineflare or strongylhush or densurchin or inkthorn or densstrongyl or lunulesift or dollarright or sandfilmburrow or spinefurcreep or mellitahush or denssand or inksand or densmellita or spiralcrawl or filmgraze or opercshut or tidehuddle or littorinahush or densspire or inkspire or denslittorina or plateflex or radularasp or girdlesettle or rockcreep or chitonhush or densmail or inkmail or denspolyplaco or cirrikick or opershut or cementhold or tidereopen or balanushush or denscement or inkcement or densbalanus or clampseal or radialgraze or circumhome or shelltilt or patellahush or denscone or inkcone or denspatella or radula or pedal or pneumostome or ommatophore or lymnaeid or denspale or denswave or densscud or densarmor; window-play and Call Knurl leave knobbed_whelk alone; Thorn/Token/Spire/Mail/Cement/Cone/Whorl/Pale/Wave/Scud own their tricks; guest slug Knurl / key knobbed_whelk — accept "knobbed_whelk" and "knurl" (roster slug knurl; campaign Knurl); do NOT accept bare "knurl" as a trick id; do NOT confuse with Thorn the Purple Sea Urchin (key sea_urchin / slug thorn); do NOT confuse with Token the Common Sand Dollar; do NOT confuse with Spire the Common Periwinkle (spiralcrawl/opercshut) or Cone the Limpet or Whorl the Pond Snail; do NOT confuse with Heap the Lugworm (key lugworm / slug heap) — do not start Heap in parallel; do NOT name a trick knobbed_whelk or knurl or sea_urchin or thorn or periwinkle or spire or limpet or cone or lugworm or heap. Thank-yous densknurl / inkknurl / densbusycon. Feed-happy after eat. Sleep, hide, leave, rest, card, ribbon still win. Same map as desktop knobbed_whelk-tricks.js. Window-play unchanged. True knobbed whelk desk life — siphon probe, foot plow crawl, operculum door shut, knobby shell tip-rock, and long Busycon hush; not Strongylocentrotus urchin clones, not Mellita sand-dollar clones, not Littorina periwinkle clones, not Patella limpet clones, not Lymnaea pond-snail clones, not Arenicola lugworm Heap (next guest) — true Busycon / Busyconidae knobbed whelk life. Next house-order guest after Knurl still lacking tricks owns the next seat (Heap / lugworm). No cry inventing — thank-yous are silent desk motion only. */
export const TRICK_KEY = "knobbed_whelk";
export const TRICKS = ["siphonprobe", "footplow", "opercdoor", "knobbyrock", "busyconhush"] as const;
export const HAPPY = ["densknurl", "inkknurl", "densbusycon"] as const;
export type KnobbedWhelkTrickKind = (typeof TRICKS)[number];
export type KnobbedWhelkHappyKind = (typeof HAPPY)[number];
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

export type KnobbedWhelkTrick = {
  kind: KnobbedWhelkTrickKind;
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

export type KnobbedWhelkHappy = {
  kind: KnobbedWhelkHappyKind;
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

export const HAPPY_DUR = { densknurl: 2.72, inkknurl: 2.88, densbusycon: 2.62 } as const;
export const BUSYCONHUSH_HOLD = 26.55;
export const RELEASE_S = 2.34;
export const DUR = { busyconhush: BUSYCONHUSH_HOLD + RELEASE_S, siphonprobe: 5.18, footplow: 5.42, opercdoor: 4.72, knobbyrock: 5.06 } as const;

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
export function nextTrickWait(justFinished: boolean, rand?: number, kind?: KnobbedWhelkTrickKind | string) {
  const roll = rand == null ? Math.random() : rand;
  if (kind === "busyconhush") return 179 + roll * 14;
  if (kind === "siphonprobe") return 27.2 + roll * 4.6;
  if (kind === "footplow") return 28.6 + roll * 4.8;
  if (kind === "opercdoor") return 26.0 + roll * 4.3;
  if (kind === "knobbyrock") return 26.8 + roll * 4.5;
  return justFinished ? 19.7 + roll * 3.0 : 14.9 + roll * 2.6;
}
export function pickTrick(rand?: number, musicOn?: boolean, lastKind?: KnobbedWhelkTrickKind | string) {
  if (musicOn) return "busyconhush";
  const roll = rand == null ? Math.random() : rand;
  if (lastKind === "busyconhush") {
    if (roll < 0.26) return "siphonprobe";
    if (roll < 0.5) return "footplow";
    if (roll < 0.74) return "opercdoor";
    return "knobbyrock";
  }
  if (lastKind === "siphonprobe") {
    if (roll < 0.26) return "busyconhush";
    if (roll < 0.5) return "footplow";
    if (roll < 0.74) return "opercdoor";
    return "knobbyrock";
  }
  if (lastKind === "footplow") {
    if (roll < 0.22) return "busyconhush";
    if (roll < 0.44) return "siphonprobe";
    if (roll < 0.68) return "opercdoor";
    return "knobbyrock";
  }
  if (roll < 0.2) return "busyconhush";
  if (roll < 0.4) return "siphonprobe";
  if (roll < 0.6) return "footplow";
  if (roll < 0.8) return "opercdoor";
  return "knobbyrock";
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
  return cmd === "sleep" || cmd === "leave" || cmd === "hide" || cmd === "rest" || cmd === "seek" || cmd === "play" || cmd === "talk" || cmd === "enter";
}
export function wantsThankYou(key: string | undefined | null) {
  return key === TRICK_KEY || key === "knurl";
}
export function startThankYou(key: string | undefined | null, lastKind: string | undefined | null, x: number, facing: 1 | -1 | undefined, flags?: TrickFlags) {
  if (!wantsThankYou(key)) return null;
  if (!happyCanStart(flags || { cmd: "idle" })) return null;
  const pick = pickHappy(lastKind);
  return { happy: beginHappy(pick, x, facing), kind: pick };
}
export function pickHappy(lastKind?: string | null, rand?: number) {
  const pool = HAPPY.filter((k) => k !== lastKind);
  const list = pool.length ? pool : [...HAPPY];
  const roll = rand == null ? Math.random() : rand;
  return list[Math.floor(roll * list.length)] || list[0];
}
export function beginHappy(kind: KnobbedWhelkHappyKind | string, x: number, facing?: 1 | -1): KnobbedWhelkHappy {
  const name = (HAPPY as readonly string[]).indexOf(kind) >= 0 ? (kind as KnobbedWhelkHappyKind) : "densknurl";
  return {
    kind: name,
    happy: true,
    phase: "go",
    t: 0,
    x,
    lift: 0,
    rot: 0,
    anim: name === "densknurl" ? "sit" : name === "inkknurl" ? "play" : "play",
    facing: facing == null ? 1 : facing,
    fromX: x,
  };
}
export function densknurlPose(t: number) {
  const u = Math.max(0, Math.min(1, t / HAPPY_DUR.densknurl));
  if (u < 0.15) {
    const s = u / 0.15;
    return { lift: s * -0.0036, rot: s * -0.17, anim: "sit" as TrickAnim };
  }
  if (u < 0.74) {
    const bob = Math.sin(((u - 0.15) / 0.59) * Math.PI * 2.28);
    return { lift: -0.0035 + bob * 0.00082, rot: -0.15 + bob * 0.10, anim: "sit" as TrickAnim };
  }
  const s = (u - 0.74) / 0.26;
  return { lift: -0.0035 * (1 - s), rot: -0.15 * (1 - s), anim: "idle" as TrickAnim };
}
export function inkknurlPose(t: number) {
  const u = Math.max(0, Math.min(1, t / HAPPY_DUR.inkknurl));
  if (u < 0.14) {
    const s = u / 0.14;
    return { lift: s * 0.0040, rot: s * 0.34, anim: "talk" as TrickAnim };
  }
  if (u < 0.72) {
    const pulse = Math.sin(((u - 0.14) / 0.58) * Math.PI * 3.18);
    return { lift: 0.0040 + Math.abs(pulse) * 0.00155, rot: 0.34 + pulse * 0.25, anim: "talk" as TrickAnim };
  }
  const s = (u - 0.72) / 0.28;
  return { lift: 0.0040 * (1 - s), rot: 0.34 * (1 - s), anim: "idle" as TrickAnim };
}
export function densbusyconPose(t: number) {
  const u = Math.max(0, Math.min(1, t / HAPPY_DUR.densbusycon));
  if (u < 0.13) {
    const s = u / 0.13;
    return { lift: s * 0.0028, rot: s * -0.23, anim: "play" as TrickAnim };
  }
  if (u < 0.80) {
    const wave = Math.sin(((u - 0.13) / 0.67) * Math.PI * 2.70);
    return { lift: 0.0028 + Math.abs(wave) * 0.00125, rot: -0.23 + wave * 0.175, anim: "play" as TrickAnim };
  }
  const s = (u - 0.80) / 0.20;
  return { lift: 0.0028 * (1 - s), rot: -0.23 * (1 - s), anim: "idle" as TrickAnim };
}
export function stepHappy(happy: KnobbedWhelkHappy, dt: number, flags?: TrickFlags): KnobbedWhelkHappy {
  if (!happy || happy.phase === "done") return happy;
  if (happyShouldAbort(flags)) {
    return { ...happy, phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true };
  }
  const next = { ...happy, t: happy.t + Math.max(0, dt) };
  const hold = HAPPY_DUR[next.kind];
  if (next.kind === "densknurl") {
    const pose = densknurlPose(next.t);
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "inkknurl") {
    const pose = inkknurlPose(next.t);
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else {
    const pose = densbusyconPose(next.t);
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  }
  if (next.t >= hold) return { ...next, phase: "done", lift: 0, rot: 0, anim: "idle" };
  return next;
}
export function sleepHoldFrame(_key?: string, _frameCount?: number) {
  return null;
}
export function beginTrick(kind: KnobbedWhelkTrickKind | string, x: number, facing?: 1 | -1): KnobbedWhelkTrick {
  const k = (TRICKS as readonly string[]).includes(kind) ? (kind as KnobbedWhelkTrickKind) : "busyconhush";
  const anim: TrickAnim =
    k === "busyconhush"
      ? "sit"
      : k === "siphonprobe"
        ? "play"
        : k === "footplow"
          ? "walk"
          : k === "opercdoor"
            ? "sit"
            : k === "knobbyrock"
              ? "play"
              : "sit";
  return {
    kind: k,
    phase: k === "busyconhush" ? "hold" : "go",
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
export function busyconhushPose(t: number) {
  const breath = Math.sin(t * 0.00170) + 0.00076 * Math.sin(t * 0.0057);
  const hush = Math.abs(Math.sin(t * 0.00086));
  return { lift: -0.00040 + hush * 0.00011, rot: -0.015 + breath * 0.0045 };
}

export function releasePose(t: number) {
  const u = Math.max(0, Math.min(1, t / RELEASE_S));
  return { lift: -0.00036 * (1 - Math.sin(u * Math.PI * 0.5)), rot: -0.015 * (1 - u) };
}

// Siphon probe: long inhalant siphon tastes the desk ahead (not periwinkle filmgraze, not urchin lanterngraze).
export function siphonprobePose(t: number, fromX: number, facing?: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.siphonprobe));
  const face = facing == null ? 1 : facing;
  if (u < 0.13) {
    const s = smoothstep(u / 0.13);
    return { x: fromX + face * s * 0.00022, lift: s * 0.0042, rot: s * 0.28 * face, anim: "play" as TrickAnim };
  }
  if (u < 0.86) {
    const probe = Math.sin((u - 0.13) / 0.73 * Math.PI * 3.4);
    const siphon = Math.sin(t * 1.15) + 0.045 * Math.sin(t * 2.4);
    return {
      x: fromX + face * (0.00022 + probe * 0.0011 + siphon * 0.00014),
      lift: 0.0042 + Math.abs(probe) * 0.00095 + Math.abs(siphon) * 0.00028,
      rot: (0.28 + probe * 0.22 + siphon * 0.08) * face,
      anim: "play" as TrickAnim,
    };
  }
  const s = smoothstep((u - 0.86) / 0.14);
  return { x: fromX + face * 0.00022 * (1 - s), lift: 0.0014 * (1 - s), rot: 0.04 * (1 - s) * face, anim: "idle" as TrickAnim };
}

// Foot plow crawl: broad muscular foot plows forward through desk sand (not periwinkle spiralcrawl tip-up, not urchin gripcreep).
export function footplowPose(t: number, fromX: number, facing?: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.footplow));
  const face = facing == null ? 1 : facing;
  if (u < 0.11) {
    const s = smoothstep(u / 0.11);
    return { x: fromX + face * s * 0.00042, lift: s * -0.0028, rot: s * 0.12 * face, anim: "walk" as TrickAnim };
  }
  if (u < 0.90) {
    const plow = (u - 0.11) / 0.79;
    const haul = Math.sin(plow * Math.PI * 3.2);
    const foot = Math.sin(t * 0.88) + 0.04 * Math.sin(t * 1.95);
    return {
      x: fromX + face * (0.00042 + plow * 0.0088 + haul * 0.00024),
      lift: -0.0028 + Math.abs(haul) * 0.00062 + Math.abs(foot) * 0.00018,
      rot: (0.12 + haul * 0.10 + foot * 0.045) * face,
      anim: "walk" as TrickAnim,
    };
  }
  const s = smoothstep((u - 0.90) / 0.10);
  return { x: fromX + face * 0.00922 * (1 - s * 0.12), lift: -0.0008 * (1 - s), rot: 0.03 * (1 - s) * face, anim: "idle" as TrickAnim };
}

// Operculum door shut: door-hinge operculum closes over the aperture (not Spire opercshut seal-down, not barnacle opershut).
export function opercdoorPose(t: number, fromX: number, facing?: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.opercdoor));
  const face = facing == null ? 1 : facing;
  if (u < 0.15) {
    const s = smoothstep(u / 0.15);
    return { x: fromX, lift: s * -0.0058, rot: s * -0.18 * face, anim: "sit" as TrickAnim };
  }
  if (u < 0.82) {
    const door = Math.sin((u - 0.15) / 0.67 * Math.PI * 2.0);
    const hinge = Math.sin(t * 0.42) * 0.00012;
    return {
      x: fromX + face * door * 0.00008,
      lift: -0.0058 + hinge + Math.abs(door) * 0.00022,
      rot: (-0.18 + door * 0.14) * face,
      anim: "sit" as TrickAnim,
    };
  }
  const s = smoothstep((u - 0.82) / 0.18);
  return { x: fromX, lift: -0.0058 * (1 - s), rot: -0.03 * (1 - s) * face, anim: "idle" as TrickAnim };
}

// Knobby shell tip-rock: heavy Busycon shell tips and rocks on its knobs (not limpet shelltilt, not periwinkle spiral tip).
export function knobbyrockPose(t: number, fromX: number, facing?: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.knobbyrock));
  const face = facing == null ? 1 : facing;
  if (u < 0.14) {
    const s = smoothstep(u / 0.14);
    return { x: fromX + face * s * 0.00016, lift: s * 0.0052, rot: s * 0.52 * face, anim: "play" as TrickAnim };
  }
  if (u < 0.84) {
    const rock = Math.sin((u - 0.14) / 0.70 * Math.PI * 2.6);
    const knob = Math.sin(t * 1.05) + 0.05 * Math.sin(t * 2.2);
    return {
      x: fromX + face * (0.00016 + rock * 0.00055),
      lift: 0.0052 + Math.abs(rock) * 0.0014 + Math.abs(knob) * 0.00032,
      rot: (0.52 + rock * 0.38 + knob * 0.10) * face,
      anim: "play" as TrickAnim,
    };
  }
  const s = smoothstep((u - 0.84) / 0.16);
  return { x: fromX + face * 0.00016 * (1 - s), lift: 0.0052 * (1 - s), rot: 0.06 * (1 - s) * face, anim: "idle" as TrickAnim };
}
export function stepTrick(trick: KnobbedWhelkTrick, dt: number, flags?: TrickFlags): KnobbedWhelkTrick {
  if (!trick || trick.phase === "done") return trick;
  if (shouldAbort(flags) && trick.kind !== "siphonprobe" && trick.kind !== "footplow" && trick.kind !== "opercdoor" && trick.kind !== "knobbyrock") {
    return { ...trick, phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true };
  }
  const next = { ...trick, t: trick.t + Math.max(0, dt) };
  if (next.kind === "busyconhush") {
    if (next.t < BUSYCONHUSH_HOLD) {
      const pose = busyconhushPose(next.t);
      next.phase = "hold";
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = "sit";
      return next;
    }
    if (next.t < BUSYCONHUSH_HOLD + RELEASE_S) {
      const pose = releasePose(next.t - BUSYCONHUSH_HOLD);
      next.phase = "release";
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = "sit";
      return next;
    }
    return { ...next, phase: "done", lift: 0, rot: 0, anim: "idle" };
  }
  const hold = DUR[next.kind];
  const u = next.t / hold;
  if (next.kind === "siphonprobe") {
    const pose = siphonprobePose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "footplow") {
    const pose = footplowPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "opercdoor") {
    const pose = opercdoorPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else {
    const pose = knobbyrockPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  }
  if (u >= 1) return { ...next, phase: "done", lift: 0, rot: 0, anim: "idle" };
  return next;
}
