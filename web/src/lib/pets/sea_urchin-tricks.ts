/** Thorn ground tricks while idle. House neighborly Strongylocentrotus / purple sea urchin desk life — spinewalk / lanterngraze / gripcreep / spineflare / strongylhush personality (spinewalk spine walk/pivot without naming spine or walk or pivot or roll or ball alone as wait, lanterngraze Aristotle lantern graze without naming lantern or Aristotle or graze or bite or rasp alone as wait, gripcreep tube-feet grip creep without naming tube or feet or grip or creep or podia alone as wait, spineflare defense spine flare without naming flare or defense or bristle or rattle alone as wait, long strongylhush Strongylocentrotus purple-urchin hush — never named wait or crouch or roost or stalk or monocle or fossick or anting or corvid or spinewalk or lanterngraze or gripcreep or spineflare or strongylhush or densurchin or inkthorn or densstrongyl or lunulesift or dollarright or sandfilmburrow or spinefurcreep or mellitahush or denssand or inksand or densmellita or spiralcrawl or filmgraze or opercshut or tidehuddle or littorinahush or densspire or inkspire or denslittorina or plateflex or radularasp or girdlesettle or rockcreep or chitonhush or densmail or inkmail or denspolyplaco or cirrikick or opershut or cementhold or tidereopen or balanushush or denscement or inkcement or densbalanus or clampseal or radialgraze or circumhome or shelltilt or patellahush or denscone or inkcone or denspatella or podia or righting or crawl or evert or penta or damp or press or tide or sprintdash or burrowplunge or burrowdig or sandfeed or denspale or denswave or densscud or densarmor; window-play and Call Thorn leave sea_urchin alone; Token/Spire/Mail/Cement/Cone/Pale/Wave/Scud/Cling own their tricks; guest slug Thorn / key sea_urchin — accept "sea_urchin" and "thorn" (roster slug thorn; campaign Thorn); do NOT accept bare "thorn" as a trick id; do NOT confuse with Token the Common Sand Dollar (key sand_dollar / slug token); do NOT confuse with Spire the Common Periwinkle or Mail the Lined Chiton or Cement the Acorn Barnacle or Cone the Limpet; do NOT confuse with Cling the Sea Star (key sea_star) podia/righting/crawl/evert/penta; do NOT confuse with Knurl the Knobbed Whelk (key knobbed_whelk / slug knurl) — do not start Knurl in parallel; do NOT name a trick sea_urchin or thorn or sand_dollar or token or periwinkle or spire or righting or podia or penta or evert or knurl or whelk. Thank-yous densurchin / inkthorn / densstrongyl. Feed-happy after eat. Sleep, hide, leave, rest, card, ribbon still win. Same map as desktop sea_urchin-tricks.js. Window-play unchanged. True purple sea urchin desk life — spine walk/pivot, Aristotle lantern graze, tube-feet grip creep, defense spine flare, and long Strongylocentrotus hush; not Mellita sand-dollar clones, not Littorina periwinkle clones, not Tonicella chiton clones, not Balanus barnacle clones, not Patella limpet clones, not Asterias sea-star clones, not Busycon knobbed-whelk Knurl (next guest) — true Strongylocentrotus regular echinoid life. Next house-order guest after Thorn still lacking tricks owns the next seat (Knurl / knobbed_whelk). No cry inventing — thank-yous are silent desk motion only. */
export const TRICK_KEY = "sea_urchin";
export const TRICKS = ["spinewalk", "lanterngraze", "gripcreep", "spineflare", "strongylhush"] as const;
export const HAPPY = ["densurchin", "inkthorn", "densstrongyl"] as const;
export type SeaUrchinTrickKind = (typeof TRICKS)[number];
export type SeaUrchinHappyKind = (typeof HAPPY)[number];
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

export type SeaUrchinTrick = {
  kind: SeaUrchinTrickKind;
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

export type SeaUrchinHappy = {
  kind: SeaUrchinHappyKind;
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

export const HAPPY_DUR = { densurchin: 2.74, inkthorn: 2.91, densstrongyl: 2.66 } as const;
export const STRONGYLHUSH_HOLD = 26.48;
export const RELEASE_S = 2.36;
export const DUR = { strongylhush: STRONGYLHUSH_HOLD + RELEASE_S, spinewalk: 5.24, lanterngraze: 5.36, gripcreep: 5.12, spineflare: 4.98 } as const;

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
export function nextTrickWait(justFinished: boolean, rand?: number, kind?: SeaUrchinTrickKind | string) {
  const roll = rand == null ? Math.random() : rand;
  if (kind === "strongylhush") return 178 + roll * 14;
  if (kind === "spinewalk") return 27.8 + roll * 4.7;
  if (kind === "lanterngraze") return 28.4 + roll * 4.9;
  if (kind === "gripcreep") return 26.6 + roll * 4.4;
  if (kind === "spineflare") return 26.2 + roll * 4.2;
  return justFinished ? 19.9 + roll * 3.0 : 15.1 + roll * 2.6;
}
export function pickTrick(rand?: number, musicOn?: boolean, lastKind?: SeaUrchinTrickKind | string) {
  if (musicOn) return "strongylhush";
  const roll = rand == null ? Math.random() : rand;
  if (lastKind === "strongylhush") {
    if (roll < 0.26) return "spinewalk";
    if (roll < 0.5) return "lanterngraze";
    if (roll < 0.74) return "gripcreep";
    return "spineflare";
  }
  if (lastKind === "spinewalk") {
    if (roll < 0.26) return "strongylhush";
    if (roll < 0.5) return "lanterngraze";
    if (roll < 0.74) return "gripcreep";
    return "spineflare";
  }
  if (lastKind === "lanterngraze") {
    if (roll < 0.22) return "strongylhush";
    if (roll < 0.44) return "spinewalk";
    if (roll < 0.68) return "gripcreep";
    return "spineflare";
  }
  if (roll < 0.2) return "strongylhush";
  if (roll < 0.4) return "spinewalk";
  if (roll < 0.6) return "lanterngraze";
  if (roll < 0.8) return "gripcreep";
  return "spineflare";
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
  return key === TRICK_KEY || key === "thorn";
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
export function beginHappy(kind: SeaUrchinHappyKind | string, x: number, facing?: 1 | -1): SeaUrchinHappy {
  const name = (HAPPY as readonly string[]).indexOf(kind) >= 0 ? (kind as SeaUrchinHappyKind) : "densurchin";
  return {
    kind: name,
    happy: true,
    phase: "go",
    t: 0,
    x,
    lift: 0,
    rot: 0,
    anim: name === "densurchin" ? "sit" : name === "inkthorn" ? "play" : "play",
    facing: facing == null ? 1 : facing,
    fromX: x,
  };
}
export function densurchinPose(t: number) {
  const u = Math.max(0, Math.min(1, t / HAPPY_DUR.densurchin));
  if (u < 0.15) {
    const s = u / 0.15;
    return { lift: s * -0.0038, rot: s * -0.15, anim: "sit" as TrickAnim };
  }
  if (u < 0.74) {
    const bob = Math.sin(((u - 0.15) / 0.59) * Math.PI * 2.35);
    return { lift: -0.0036 + bob * 0.00088, rot: -0.14 + bob * 0.11, anim: "sit" as TrickAnim };
  }
  const s = (u - 0.74) / 0.26;
  return { lift: -0.0036 * (1 - s), rot: -0.14 * (1 - s), anim: "idle" as TrickAnim };
}
export function inkthornPose(t: number) {
  const u = Math.max(0, Math.min(1, t / HAPPY_DUR.inkthorn));
  if (u < 0.14) {
    const s = u / 0.14;
    return { lift: s * 0.0041, rot: s * 0.36, anim: "talk" as TrickAnim };
  }
  if (u < 0.72) {
    const pulse = Math.sin(((u - 0.14) / 0.58) * Math.PI * 3.35);
    return { lift: 0.0041 + Math.abs(pulse) * 0.0016, rot: 0.36 + pulse * 0.26, anim: "talk" as TrickAnim };
  }
  const s = (u - 0.72) / 0.28;
  return { lift: 0.0041 * (1 - s), rot: 0.36 * (1 - s), anim: "idle" as TrickAnim };
}
export function densstrongylPose(t: number) {
  const u = Math.max(0, Math.min(1, t / HAPPY_DUR.densstrongyl));
  if (u < 0.13) {
    const s = u / 0.13;
    return { lift: s * 0.0029, rot: s * -0.24, anim: "play" as TrickAnim };
  }
  if (u < 0.80) {
    const wave = Math.sin(((u - 0.13) / 0.67) * Math.PI * 2.75);
    return { lift: 0.0029 + Math.abs(wave) * 0.0013, rot: -0.24 + wave * 0.18, anim: "play" as TrickAnim };
  }
  const s = (u - 0.80) / 0.20;
  return { lift: 0.0029 * (1 - s), rot: -0.24 * (1 - s), anim: "idle" as TrickAnim };
}
export function stepHappy(happy: SeaUrchinHappy, dt: number, flags?: TrickFlags): SeaUrchinHappy {
  if (!happy || happy.phase === "done") return happy;
  if (happyShouldAbort(flags)) {
    return { ...happy, phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true };
  }
  const next = { ...happy, t: happy.t + Math.max(0, dt) };
  const hold = HAPPY_DUR[next.kind];
  if (next.kind === "densurchin") {
    const pose = densurchinPose(next.t);
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "inkthorn") {
    const pose = inkthornPose(next.t);
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else {
    const pose = densstrongylPose(next.t);
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
export function beginTrick(kind: SeaUrchinTrickKind | string, x: number, facing?: 1 | -1): SeaUrchinTrick {
  const k = (TRICKS as readonly string[]).includes(kind) ? (kind as SeaUrchinTrickKind) : "strongylhush";
  const anim: TrickAnim =
    k === "strongylhush"
      ? "sit"
      : k === "spinewalk"
        ? "walk"
        : k === "lanterngraze"
          ? "play"
          : k === "gripcreep"
            ? "walk"
            : k === "spineflare"
              ? "play"
              : "sit";
  return {
    kind: k,
    phase: k === "strongylhush" ? "hold" : "go",
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
  export function strongylhushPose(t: number) {
    const breath = Math.sin(t * 0.00172) + 0.00078 * Math.sin(t * 0.0059);
    const hush = Math.abs(Math.sin(t * 0.00088));
    return { lift: -0.00038 + hush * 0.00012, rot: -0.014 + breath * 0.0046 };
  }

  export function releasePose(t: number) {
    const u = Math.max(0, Math.min(1, t / RELEASE_S));
    return { lift: -0.00034 * (1 - Math.sin(u * Math.PI * 0.5)), rot: -0.014 * (1 - u) };
  }

  // Spine walk/pivot: test spines walk while the test rotates in place (not sand-dollar spinefurcreep, not sea-star crawl).
  export function spinewalkPose(t: number, fromX: number, facing?: 1 | -1) {
    const u = Math.max(0, Math.min(1, t / DUR.spinewalk));
    const face = facing == null ? 1 : facing;
    if (u < 0.12) {
      const s = smoothstep(u / 0.12);
      return { x: fromX + face * s * 0.00028, lift: s * 0.0034, rot: s * 0.22 * face, anim: "walk" as TrickAnim };
    }
    if (u < 0.88) {
      const pivot = Math.sin((u - 0.12) / 0.76 * Math.PI * 3.6);
      const spine = Math.sin(t * 1.28) + 0.05 * Math.sin(t * 2.55);
      const creep = (u - 0.12) / 0.76;
      return {
        x: fromX + face * (0.00028 + creep * 0.0046 + pivot * 0.00018),
        lift: 0.0034 + Math.abs(pivot) * 0.00072 + Math.abs(spine) * 0.00022,
        rot: (0.22 + pivot * 0.55 + spine * 0.08) * face,
        anim: "walk" as TrickAnim,
      };
    }
    const s = smoothstep((u - 0.88) / 0.12);
    return { x: fromX + face * 0.00488 * (1 - s * 0.1), lift: 0.0012 * (1 - s), rot: 0.05 * (1 - s) * face, anim: "idle" as TrickAnim };
  }

  // Aristotle lantern graze: oral face tips to rasp algae (not sand-dollar lunulesift, not periwinkle filmgraze).
  export function lanterngrazePose(t: number, fromX: number, facing?: 1 | -1) {
    const u = Math.max(0, Math.min(1, t / DUR.lanterngraze));
    const face = facing == null ? 1 : facing;
    if (u < 0.14) {
      const s = smoothstep(u / 0.14);
      return { x: fromX + face * s * 0.00014, lift: s * -0.0056, rot: s * 0.32 * face, anim: "play" as TrickAnim };
    }
    if (u < 0.86) {
      const rasp = Math.sin((u - 0.14) / 0.72 * Math.PI * 5.2);
      const jaw = Math.sin(t * 1.72) + 0.04 * Math.sin(t * 3.1);
      return {
        x: fromX + face * (0.00014 + rasp * 0.00085 + jaw * 0.0001),
        lift: -0.0056 + Math.abs(rasp) * 0.0009 + Math.abs(jaw) * 0.00025,
        rot: (0.32 + rasp * 0.24 + jaw * 0.07) * face,
        anim: "play" as TrickAnim,
      };
    }
    const s = smoothstep((u - 0.86) / 0.14);
    return { x: fromX + face * 0.00014 * (1 - s), lift: -0.0018 * (1 - s), rot: 0.04 * (1 - s) * face, anim: "idle" as TrickAnim };
  }

  // Tube-feet grip creep: podia grip the desk and haul the test forward (not sea-star podia crawl, not sand-dollar spinefurcreep).
  export function gripcreepPose(t: number, fromX: number, facing?: 1 | -1) {
    const u = Math.max(0, Math.min(1, t / DUR.gripcreep));
    const face = facing == null ? 1 : facing;
    if (u < 0.11) {
      const s = smoothstep(u / 0.11);
      return { x: fromX + face * s * 0.00038, lift: s * -0.0024, rot: s * 0.08 * face, anim: "walk" as TrickAnim };
    }
    if (u < 0.90) {
      const creep = (u - 0.11) / 0.79;
      const grip = Math.sin(creep * Math.PI * 4.6);
      const feet = Math.sin(t * 0.95) + 0.035 * Math.sin(t * 2.1);
      return {
        x: fromX + face * (0.00038 + creep * 0.0074 + grip * 0.0002),
        lift: -0.0024 + Math.abs(grip) * 0.00055 + Math.abs(feet) * 0.00016,
        rot: (0.08 + grip * 0.09 + feet * 0.04) * face,
        anim: "walk" as TrickAnim,
      };
    }
    const s = smoothstep((u - 0.90) / 0.10);
    return { x: fromX + face * 0.00778 * (1 - s * 0.12), lift: -0.0007 * (1 - s), rot: 0.03 * (1 - s) * face, anim: "idle" as TrickAnim };
  }

  // Defense spine flare: primary spines bristle outward then settle (not goldfish flare, not sand-dollar dollarright).
  export function spineflarePose(t: number, fromX: number, facing?: 1 | -1) {
    const u = Math.max(0, Math.min(1, t / DUR.spineflare));
    const face = facing == null ? 1 : facing;
    if (u < 0.16) {
      const s = smoothstep(u / 0.16);
      return { x: fromX + face * s * 0.00012, lift: s * 0.0064, rot: s * 0.48 * face, anim: "play" as TrickAnim };
    }
    if (u < 0.78) {
      const flare = Math.sin((u - 0.16) / 0.62 * Math.PI * 2.8);
      const bristle = Math.sin(t * 2.05) + 0.06 * Math.sin(t * 3.4);
      return {
        x: fromX + face * (0.00012 + flare * 0.0004),
        lift: 0.0064 + Math.abs(flare) * 0.0018 + Math.abs(bristle) * 0.0004,
        rot: (0.48 + flare * 0.42 + bristle * 0.12) * face,
        anim: "play" as TrickAnim,
      };
    }
    const s = smoothstep((u - 0.78) / 0.22);
    return { x: fromX + face * 0.00012 * (1 - s), lift: 0.0064 * (1 - s), rot: 0.08 * (1 - s) * face, anim: "idle" as TrickAnim };
  }
export function stepTrick(trick: SeaUrchinTrick, dt: number, flags?: TrickFlags): SeaUrchinTrick {
  if (!trick || trick.phase === "done") return trick;
  if (shouldAbort(flags) && trick.kind !== "spinewalk" && trick.kind !== "lanterngraze" && trick.kind !== "gripcreep" && trick.kind !== "spineflare") {
    return { ...trick, phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true };
  }
  const next = { ...trick, t: trick.t + Math.max(0, dt) };
  if (next.kind === "strongylhush") {
    if (next.t < STRONGYLHUSH_HOLD) {
      const pose = strongylhushPose(next.t);
      next.phase = "hold";
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = "sit";
      return next;
    }
    if (next.t < STRONGYLHUSH_HOLD + RELEASE_S) {
      const pose = releasePose(next.t - STRONGYLHUSH_HOLD);
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
  if (next.kind === "spinewalk") {
    const pose = spinewalkPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "lanterngraze") {
    const pose = lanterngrazePose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "gripcreep") {
    const pose = gripcreepPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else {
    const pose = spineflarePose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  }
  if (u >= 1) return { ...next, phase: "done", lift: 0, rot: 0, anim: "idle" };
  return next;
}
